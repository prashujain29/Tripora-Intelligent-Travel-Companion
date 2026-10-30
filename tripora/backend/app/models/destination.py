from pydantic import BaseModel, Field
from typing import List, Optional

class Attraction(BaseModel):
    name: str
    category: str
    description: str
    estimated_cost: float
    recommended_duration: str
    image_url: Optional[str] = None

class ActivitySuggestion(BaseModel):
    title: str
    type: str
    highlight: str
    best_time: str

class Destination(BaseModel):
    id: str
    name: str
    country: str
    region: str
    tagline: str
    description: str
    hero_image: str
    card_image: str
    category: str  # trending, recommended, weekend, adventure, cultural, romantic, budget
    tags: List[str]
    estimated_budget_range: str
    avg_daily_cost: float
    currency: str = "USD"
    best_travel_period: str
    is_sample_data: bool = True
    overview: str
    popular_attractions: List[Attraction] = []
    suggested_activities: List[ActivitySuggestion] = []
    travel_tips: List[str] = []
    latitude: float
    longitude: float

class SavedDestinationCreate(BaseModel):
    destination_name: str
    country: str
    region: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    estimated_budget_range: Optional[str] = None
    best_time_to_visit: Optional[str] = None
    notes: Optional[str] = None

class SavedDestination(SavedDestinationCreate):
    id: str
    user_id: str
    saved_at: str

