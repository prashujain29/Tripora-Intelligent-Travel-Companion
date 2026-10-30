from pydantic import BaseModel, Field
from typing import List, Optional

class Profile(BaseModel):
    id: str = "demo-user-123"
    email: str = "traveler@tripora.io"
    full_name: str = "Elena Rostova"
    avatar_url: str = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    preferred_currency: str = "USD"
    preferred_language: str = "en"
    travel_personality: List[str] = ["Cultural", "Food Exploration", "Scenic Nature"]
    dietary_preferences: List[str] = ["Vegetarian Options", "Authentic Local Cuisine"]
    accessibility_requirements: List[str] = ["Walking-friendly routes"]
    trips_planned_count: int = 4
    destinations_explored_count: int = 12
    completed_journeys_count: int = 3
    total_travel_budget_spent: float = 11450.0

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    preferred_currency: Optional[str] = None
    preferred_language: Optional[str] = None
    travel_personality: Optional[List[str]] = None
    dietary_preferences: Optional[List[str]] = None
    accessibility_requirements: Optional[List[str]] = None
