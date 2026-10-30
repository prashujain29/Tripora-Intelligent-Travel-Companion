from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, time
import uuid

class ActivityBase(BaseModel):
    title: str = Field(..., description="Activity title")
    description: Optional[str] = Field(None, description="Detailed description")
    category: str = Field("sightseeing", description="sightseeing, food, adventure, culture, relaxation, shopping, transport, hotel")
    start_time: str = Field("09:00", description="HH:MM format")
    end_time: Optional[str] = Field("11:00", description="HH:MM format")
    duration_minutes: int = Field(120, ge=15, description="Duration in minutes")
    cost: float = Field(0.0, ge=0, description="Estimated cost in currency")
    currency: str = Field("USD", description="Currency symbol/code")
    location_name: str = Field(..., description="Name of location/venue")
    latitude: Optional[float] = Field(None, description="GPS latitude")
    longitude: Optional[float] = Field(None, description="GPS longitude")
    transport_mode: Optional[str] = Field("walking", description="walking, metro, taxi, train, bus, ferry")
    transport_details: Optional[str] = Field(None, description="e.g., 10 min walk, metro Line 1")
    order_index: int = Field(0, description="Sequential ordering for the day")
    booking_verified: bool = Field(False, description="Verified with live booking service vs AI suggestion")

class ActivityCreate(ActivityBase):
    day_id: str

class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    duration_minutes: Optional[int] = None
    cost: Optional[float] = None
    currency: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    transport_mode: Optional[str] = None
    transport_details: Optional[str] = None
    order_index: Optional[int] = None
    booking_verified: Optional[bool] = None

class Activity(ActivityBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    day_id: str

class ItineraryDayBase(BaseModel):
    day_number: int = Field(..., ge=1, description="Day number (1-indexed)")
    date: str = Field(..., description="YYYY-MM-DD")
    title: str = Field(..., description="Theme/headline for the day")
    theme: Optional[str] = Field(None, description="e.g. Historic Quarter & Local Flavors")
    notes: Optional[str] = Field(None, description="Helpful tips or weather notes")

class ItineraryDay(ItineraryDayBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trip_id: str
    activities: List[Activity] = Field(default_factory=list)

class ItineraryGenerateRequest(BaseModel):
    trip_id: str

class DayRegenerateRequest(BaseModel):
    day_id: str
    focus: Optional[str] = None  # e.g., "more outdoor activities", "budget-friendly", "foodie focused"
    preserve_manual_edits: bool = True

