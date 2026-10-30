from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any, Optional
from app.db.database import db
from app.services.ai_service import ai_service
from app.models.itinerary import ActivityCreate, ActivityUpdate, DayRegenerateRequest

router = APIRouter()

@router.get("/{trip_id}")
async def get_itinerary(trip_id: str):
    trip = db.get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    days = db.get_trip_days(trip_id)
    return {
        "trip": trip,
        "days": days,
        "total_days": len(days),
        "total_activities": sum(len(d.get("activities", [])) for d in days)
    }

@router.post("/{trip_id}/generate")
async def regenerate_entire_trip(trip_id: str):
    trip = db.get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    new_days = await ai_service.generate_itinerary(trip)
    db.set_trip_days(trip_id, new_days)
    return {
        "message": "Entire trip regenerated successfully",
        "days": new_days
    }

@router.post("/{trip_id}/days/{day_id}/regenerate")
async def regenerate_single_day(trip_id: str, day_id: str, req: DayRegenerateRequest):
    trip = db.get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    days = db.get_trip_days(trip_id)
    target_day = next((d for d in days if d["id"] == day_id), None)
    if not target_day:
        raise HTTPException(status_code=404, detail="Day not found")
    
    refreshed_day = await ai_service.regenerate_single_day(trip, target_day, req.focus)
    
    # Replace the day in trip days
    updated_days = [refreshed_day if d["id"] == day_id else d for d in days]
    db.set_trip_days(trip_id, updated_days)
    
    return {
        "message": f"Day {refreshed_day['day_number']} regenerated successfully",
        "day": refreshed_day
    }

@router.post("/{trip_id}/days/{day_id}/activities")
async def add_activity(trip_id: str, day_id: str, activity_data: Dict[str, Any] = Body(...)):
    trip = db.get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    new_act = db.add_activity(trip_id, day_id, activity_data)
    if not new_act:
        raise HTTPException(status_code=404, detail="Could not add activity to specified day")
    return new_act

@router.put("/{trip_id}/activities/{activity_id}")
async def update_activity(trip_id: str, activity_id: str, activity_data: Dict[str, Any] = Body(...)):
    trip = db.get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    updated = db.update_activity(trip_id, activity_id, activity_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Activity not found")
    return updated

@router.delete("/{trip_id}/activities/{activity_id}")
async def delete_activity(trip_id: str, activity_id: str):
    trip = db.get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    success = db.delete_activity(trip_id, activity_id)
    if not success:
        raise HTTPException(status_code=404, detail="Activity not found")
    return {"message": "Activity deleted successfully", "activity_id": activity_id}

@router.post("/{trip_id}/days/{day_id}/reorder")
async def reorder_activities(trip_id: str, day_id: str, order_payload: Dict[str, List[str]] = Body(...)):
    activity_ids = order_payload.get("activity_ids", [])
    success = db.reorder_activities(trip_id, day_id, activity_ids)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to reorder activities")
    return {"message": "Activities reordered successfully"}

