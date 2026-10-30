from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.db.database import db
from app.models.destination import Destination, SavedDestination, SavedDestinationCreate

router = APIRouter()

@router.get("", response_model=List[Destination])
async def get_destinations(
    category: Optional[str] = Query(None, description="trending, recommended, weekend, adventure, cultural, romantic, budget"),
    q: Optional[str] = Query(None, description="Search term for city, country or region")
):
    results = list(db.destinations.values())
    if category and category != "all":
        results = [d for d in results if d.category.lower() == category.lower()]
    if q:
        query = q.lower()
        results = [
            d for d in results 
            if query in d.name.lower() or query in d.country.lower() or query in d.region.lower() or any(query in t.lower() for t in d.tags)
        ]
    return results

@router.get("/saved/all")
async def get_saved_destinations():
    return db.get_saved_destinations()

@router.post("/saved")
async def save_destination(data: SavedDestinationCreate):
    return db.save_destination(data)

@router.delete("/saved/{save_id}")
async def remove_saved_destination(save_id: str):
    success = db.remove_saved_destination(save_id)
    if not success:
        raise HTTPException(status_code=404, detail="Saved destination not found")
    return {"message": "Saved destination removed", "id": save_id}

@router.get("/{destination_id}", response_model=Destination)
async def get_destination(destination_id: str):
    dest = db.destinations.get(destination_id)
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    return dest

