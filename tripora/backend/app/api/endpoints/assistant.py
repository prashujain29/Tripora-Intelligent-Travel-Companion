from fastapi import APIRouter, HTTPException, Body
from typing import List, Optional, Dict, Any
from app.db.database import db
from app.models.assistant import ChatRequest, ChatMessage, ApplyActionRequest, ApplyActionResponse
from app.services.ai_service import ai_service
from app.models.trip import TripUpdate

router = APIRouter()

@router.get("/messages", response_model=List[dict])
async def get_messages(trip_id: Optional[str] = None):
    return db.get_messages("demo-user-123", trip_id=trip_id)

@router.post("/chat", response_model=dict)
async def chat_with_assistant(req: ChatRequest):
    trip = db.get_trip(req.trip_id) if req.trip_id else None
    
    # Store user message
    user_msg = {
        "id": f"msg-user-{abs(hash(req.message)) % 1000000}",
        "role": "user",
        "content": req.message,
        "trip_id": req.trip_id
    }
    db.add_message("demo-user-123", user_msg)
    
    # Generate AI response
    response_msg = await ai_service.generate_assistant_response(
        message=req.message,
        trip=trip
    )
    db.add_message("demo-user-123", response_msg)
    
    return response_msg

@router.post("/apply-action", response_model=ApplyActionResponse)
async def apply_assistant_action(req: ApplyActionRequest):
    trip = db.get_trip(req.trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    action_type = req.action_type
    payload = req.payload
    
    if action_type == "adjust_pace":
        new_pace = payload.get("pace", "balanced")
        db.update_trip(req.trip_id, TripUpdate(travel_pace=new_pace))
        return ApplyActionResponse(
            success=True,
            message=f"Trip travel pace updated to {new_pace}.",
            updated_trip_id=req.trip_id
        )
        
    elif action_type in ("add_activity", "replace_activity"):
        day_num = payload.get("day_number", 1)
        days = db.get_trip_days(req.trip_id)
        target_day = next((d for d in days if d.get("day_number") == day_num), None)
        if not target_day and len(days) > 0:
            target_day = days[0]
            
        if target_day:
            act_data = {
                "title": payload.get("title", "Curated AI Experience"),
                "description": payload.get("description", "Recommended by Tripora AI assistant."),
                "category": payload.get("category", "sightseeing"),
                "start_time": payload.get("start_time", "15:00"),
                "end_time": "17:00",
                "duration_minutes": payload.get("duration_minutes", 120),
                "cost": float(payload.get("cost", 0.0)),
                "currency": trip.get("currency", "USD"),
                "location_name": payload.get("location_name", trip["destination"]),
                "transport_mode": "walking",
                "transport_details": "Short walk",
                "booking_verified": False
            }
            db.add_activity(req.trip_id, target_day["id"], act_data)
            return ApplyActionResponse(
                success=True,
                message=f"Added '{act_data['title']}' to Day {target_day['day_number']}.",
                updated_trip_id=req.trip_id
            )

    return ApplyActionResponse(
        success=True,
        message="Action processed successfully.",
        updated_trip_id=req.trip_id
    )

