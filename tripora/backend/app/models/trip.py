from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import date, datetime
import uuid

class TripBase(BaseModel):
    title: str = Field(..., description="Trip title, e.g., 'Amalfi Coast Coastal Discovery'")
    destination: str = Field(..., description="Primary destination city or region")
    country: Optional[str] = Field(None, description="Country of destination")
    start_date: str = Field(..., description="YYYY-MM-DD")
    end_date: str = Field(..., description="YYYY-MM-DD")
    status: str = Field("upcoming", description="draft, upcoming, ongoing, completed, archived")
    cover_image_url: Optional[str] = Field(None, description="Editorial photograph URL")
    adults: int = Field(1, ge=1, description="Number of adult travelers")
    children: int = Field(0, ge=0, description="Number of children")
    traveler_type: str = Field("solo", description="solo, couple, family, group")
    total_budget: float = Field(..., ge=0, description="Total budget in selected currency")
    currency: str = Field("USD", description="Currency symbol/code, e.g., USD, EUR, GBP")
    accommodation_class: str = Field("comfort", description="budget, comfort, luxury, boutique")
    travel_pace: str = Field("balanced", description="relaxed, balanced, intense")
    personalities: List[str] = Field(default_factory=list, description="Adventure, Cultural, Relaxation, etc.")
    interests: List[str] = Field(default_factory=list, description="Food, Museums, Architecture, Nature, etc.")
    summary: Optional[str] = Field(None, description="Editorial summary of the journey")

    @field_validator("end_date")
    @classmethod
    def validate_dates(cls, v, values):
        if "start_date" in values.data and v < values.data["start_date"]:
            raise ValueError("end_date must be on or after start_date")
        return v

class TripCreate(BaseModel):
    title: Optional[str] = None
    destination: str
    country: Optional[str] = None
    start_date: str
    end_date: str
    adults: int = 1
    children: int = 0
    traveler_type: str = "solo"
    total_budget: float = 2500.0
    currency: str = "USD"
    accommodation_class: str = "comfort"
    travel_pace: str = "balanced"
    personalities: List[str] = []
    interests: List[str] = []
    summary: Optional[str] = None
    cover_image_url: Optional[str] = None

class TripUpdate(BaseModel):
    title: Optional[str] = None
    destination: Optional[str] = None
    country: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: Optional[str] = None
    cover_image_url: Optional[str] = None
    adults: Optional[int] = None
    children: Optional[int] = None
    traveler_type: Optional[str] = None
    total_budget: Optional[float] = None
    currency: Optional[str] = None
    accommodation_class: Optional[str] = None
    travel_pace: Optional[str] = None
    personalities: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    summary: Optional[str] = None

class Trip(TripBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = "demo-user-123"
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

