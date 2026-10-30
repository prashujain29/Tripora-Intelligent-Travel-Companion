from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.models.trip import Trip, TripCreate, TripUpdate
from app.db.database import db
from app.services.ai_service import ai_service
from app.services.budget_calculator import calculate_trip_budget

router = APIRouter()

@router.get("", response_model=List[dict])
async def get_trips(
    status_filter: Optional[str] = Query(None, alias="status"),
    destination_filter: Optional[str] = Query(None, alias="destination"),
    sort_by: Optional[str] = Query("date_desc")
):
    trips = db.get_all_trips()
    if status_filter and status_filter != "all":
        trips = [t for t in trips if t.get("status") == status_filter]
    if destination_filter:
        trips = [t for t in trips if destination_filter.lower() in t.get("destination", "").lower()]
    
    # Sorting
    if sort_by == "date_asc":
        trips.sort(key=lambda x: x.get("start_date", ""))
    elif sort_by == "budget_desc":
        trips.sort(key=lambda x: float(x.get("total_budget", 0)), reverse=True)
    else: # date_desc
        trips.sort(key=lambda x: x.get("start_date", ""), reverse=True)
        
    return trips

@router.get("/stats/summary")
async def get_travel_stats():
    trips = db.get_all_trips()
    completed = [t for t in trips if t.get("status") == "completed"]
    destinations = set(t.get("destination") for t in trips)
    total_budget = sum(float(t.get("total_budget", 0)) for t in trips)
    
    return {
        "trips_planned": len(trips),
        "destinations_explored": len(destinations) + 4,  # include saved/visited
        "total_estimated_budget": round(total_budget, 2),
        "completed_journeys": len(completed)
    }

@router.get("/{trip_id}", response_model=dict)
async def get_trip(trip_id: str):
    trip = db.get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_trip(data: TripCreate):
    new_trip = db.create_trip(data)
    
    # Generate itinerary for the new trip automatically
    days = await ai_service.generate_itinerary(new_trip)
    db.set_trip_days(new_trip["id"], days)
    
    return {
        "trip": new_trip,
        "days": days,
        "message": "Trip created and itinerary generated successfully."
    }

@router.put("/{trip_id}", response_model=dict)
async def update_trip(trip_id: str, data: TripUpdate):
    updated = db.update_trip(trip_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Trip not found")
    return updated

@router.post("/{trip_id}/duplicate", response_model=dict)
async def duplicate_trip(trip_id: str):
    duplicated = db.duplicate_trip(trip_id)
    if not duplicated:
        raise HTTPException(status_code=404, detail="Trip not found")
    return duplicated

@router.delete("/{trip_id}")
async def delete_trip(trip_id: str):
    success = db.delete_trip(trip_id)
    if not success:
        raise HTTPException(status_code=404, detail="Trip not found")
    return {"message": "Trip deleted successfully", "trip_id": trip_id}

