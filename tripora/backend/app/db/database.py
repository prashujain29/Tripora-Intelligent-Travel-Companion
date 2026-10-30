import copy
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from app.models.trip import Trip, TripCreate, TripUpdate
from app.models.itinerary import ItineraryDay, Activity, ActivityCreate, ActivityUpdate
from app.models.destination import Destination, SavedDestination, SavedDestinationCreate
from app.models.budget import ExpenseItem, ExpenseItemCreate
from app.models.profile import Profile, ProfileUpdate
from app.models.assistant import ChatMessage
from app.services.mock_data import SAMPLE_DESTINATIONS, SAMPLE_TRIPS, SAMPLE_ITINERARY_DAYS

class Database:
    def __init__(self):
        self.destinations: Dict[str, Destination] = {d.id: d for d in SAMPLE_DESTINATIONS}
        self.trips: Dict[str, Dict[str, Any]] = {t["id"]: copy.deepcopy(t) for t in SAMPLE_TRIPS}
        self.days: Dict[str, List[Dict[str, Any]]] = copy.deepcopy(SAMPLE_ITINERARY_DAYS)
        self.saved_destinations: Dict[str, Dict[str, Any]] = {
            "saved-1": {
                "id": "saved-1",
                "user_id": "demo-user-123",
                "destination_name": "Kyoto",
                "country": "Japan",
                "region": "Kansai",
                "image_url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
                "category": "cultural",
                "estimated_budget_range": "$180 - $350 / day",
                "best_time_to_visit": "March - May & October - November",
                "notes": "Plan during cherry blossom or vibrant autumn foliage season.",
                "saved_at": "2026-10-15T12:00:00Z"
            },
            "saved-2": {
                "id": "saved-2",
                "user_id": "demo-user-123",
                "destination_name": "Banff & Lake Louise",
                "country": "Canada",
                "region": "Alberta Rockies",
                "image_url": "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80",
                "category": "adventure",
                "estimated_budget_range": "$190 - $420 / day",
                "best_time_to_visit": "June - August",
                "notes": "Reserve Lake Moraine shuttle permits early in spring.",
                "saved_at": "2026-10-22T08:30:00Z"
            }
        }
        self.profile: Profile = Profile()
        self.expenses: Dict[str, List[Dict[str, Any]]] = {
            "trip-amalfi-01": [
                {
                    "id": "exp-1",
                    "trip_id": "trip-amalfi-01",
                    "title": "Hotel Palazzo Murat (4 nights)",
                    "category": "accommodation",
                    "amount": 1520.0,
                    "currency": "USD",
                    "day_number": 1,
                    "date": "2026-11-15",
                    "notes": "Boutique cliffside suite with private terrace",
                    "is_estimate": True
                },
                {
                    "id": "exp-2",
                    "trip_id": "trip-amalfi-01",
                    "title": "Private Gozzo Boat Charter to Capri",
                    "category": "activities",
                    "amount": 320.0,
                    "currency": "USD",
                    "day_number": 3,
                    "date": "2026-11-17",
                    "notes": "Full day private skipper with grotto swims",
                    "is_estimate": True
                },
                {
                    "id": "exp-3",
                    "trip_id": "trip-amalfi-01",
                    "title": "High-Speed Ferry Passes (Positano, Amalfi, Capri)",
                    "category": "transportation",
                    "amount": 140.0,
                    "currency": "USD",
                    "day_number": 2,
                    "date": "2026-11-16",
                    "notes": "Round-trip coastal transfers",
                    "is_estimate": True
                },
                {
                    "id": "exp-4",
                    "trip_id": "trip-amalfi-01",
                    "title": "Fine Dining & Seafood Trattorias",
                    "category": "food",
                    "amount": 540.0,
                    "currency": "USD",
                    "day_number": 2,
                    "date": "2026-11-16",
                    "notes": "Da Vincenzo, Franco's Bar spritzes & Ravello lunches",
                    "is_estimate": True
                },
                {
                    "id": "exp-5",
                    "trip_id": "trip-amalfi-01",
                    "title": "Ceramics & Artisan Linen Shopping",
                    "category": "shopping",
                    "amount": 180.0,
                    "currency": "USD",
                    "day_number": 2,
                    "date": "2026-11-16",
                    "notes": "Handmade Vietri ceramics and Positano linen shirts",
                    "is_estimate": True
                },
                {
                    "id": "exp-6",
                    "trip_id": "trip-amalfi-01",
                    "title": "Luggage Porterage & Local Porter Service",
                    "category": "misc",
                    "amount": 60.0,
                    "currency": "USD",
                    "day_number": 1,
                    "date": "2026-11-15",
                    "notes": "Stair porter service to cliff villa",
                    "is_estimate": True
                }
            ]
        }
        self.conversations: Dict[str, List[Dict[str, Any]]] = {
            "demo-user-123": [
                {
                    "id": "msg-init-1",
                    "role": "assistant",
                    "content": "Hello Elena! I am Tripora, your intelligent travel companion. I see you're planning your Mediterranean trip to the Amalfi Coast. How can I assist you today? Would you like recommendations for quiet swimming coves, budget optimizations, or alternative rainy-day plans?",
                    "timestamp": "2026-10-30T10:00:00Z",
                    "trip_id": "trip-amalfi-01",
                    "suggested_actions": [
                        {
                            "id": "act-sug-1",
                            "label": "Suggest scenic sunset dinner spots",
                            "action_type": "add_activity",
                            "description": "Add a curated cliffside dinner reservation to Day 2",
                            "payload": {
                                "day_number": 2,
                                "title": "Romantic Sunset Dinner at Il Tridente",
                                "category": "food",
                                "cost": 130.0,
                                "location_name": "Il Tridente Rooftop, Positano",
                                "start_time": "19:30",
                                "duration_minutes": 120
                            }
                        },
                        {
                            "id": "act-sug-2",
                            "label": "Make itinerary less crowded",
                            "action_type": "adjust_pace",
                            "description": "Swap peak midday tourist spots for tranquil lemon grove walks",
                            "payload": {
                                "pace": "relaxed"
                            }
                        }
                    ],
                    "is_mock": True
                }
            ]
        }

    # Trips CRUD
    def get_all_trips(self, user_id: str = "demo-user-123") -> List[Dict[str, Any]]:
        return [t for t in self.trips.values() if t.get("user_id") == user_id]

    def get_trip(self, trip_id: str) -> Optional[Dict[str, Any]]:
        return self.trips.get(trip_id)

    def create_trip(self, data: TripCreate, user_id: str = "demo-user-123") -> Dict[str, Any]:
        trip_id = f"trip-{uuid.uuid4().hex[:8]}"
        title = data.title or f"{data.destination} Journey"
        
        # Select appropriate cover photo based on destination
        cover = data.cover_image_url
        if not cover:
            dest_match = next((d for d in self.destinations.values() if d.name.lower() in data.destination.lower()), None)
            if dest_match:
                cover = dest_match.hero_image
            else:
                cover = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"
        
        trip = {
            "id": trip_id,
            "user_id": user_id,
            "title": title,
            "destination": data.destination,
            "country": data.country or "International",
            "start_date": data.start_date,
            "end_date": data.end_date,
            "status": "upcoming",
            "cover_image_url": cover,
            "adults": data.adults,
            "children": data.children,
            "traveler_type": data.traveler_type,
            "total_budget": float(data.total_budget),
            "currency": data.currency,
            "accommodation_class": data.accommodation_class,
            "travel_pace": data.travel_pace,
            "personalities": data.personalities,
            "interests": data.interests,
            "summary": data.summary or f"Personalized {data.travel_pace} journey to {data.destination} customized for {data.traveler_type} travelers.",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        self.trips[trip_id] = trip
        return trip

    def update_trip(self, trip_id: str, data: TripUpdate) -> Optional[Dict[str, Any]]:
        if trip_id not in self.trips:
            return None
        trip = self.trips[trip_id]
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if value is not None:
                trip[key] = value
        trip["updated_at"] = datetime.utcnow().isoformat()
        return trip

    def duplicate_trip(self, trip_id: str, user_id: str = "demo-user-123") -> Optional[Dict[str, Any]]:
        if trip_id not in self.trips:
            return None
        orig = self.trips[trip_id]
        new_id = f"trip-{uuid.uuid4().hex[:8]}"
        new_trip = copy.deepcopy(orig)
        new_trip["id"] = new_id
        new_trip["user_id"] = user_id
        new_trip["title"] = f"Copy of {orig['title']}"
        new_trip["created_at"] = datetime.utcnow().isoformat()
        new_trip["updated_at"] = datetime.utcnow().isoformat()
        new_trip["status"] = "draft"
        self.trips[new_id] = new_trip

        # Duplicate days & activities if present
        if trip_id in self.days:
            new_days = []
            for d in self.days[trip_id]:
                copied_day = copy.deepcopy(d)
                copied_day["id"] = f"day-{uuid.uuid4().hex[:8]}"
                copied_day["trip_id"] = new_id
                for act in copied_day.get("activities", []):
                    act["id"] = f"act-{uuid.uuid4().hex[:8]}"
                    act["day_id"] = copied_day["id"]
                new_days.append(copied_day)
            self.days[new_id] = new_days
            
        # Duplicate expenses
        if trip_id in self.expenses:
            new_expenses = []
            for exp in self.expenses[trip_id]:
                copied_exp = copy.deepcopy(exp)
                copied_exp["id"] = f"exp-{uuid.uuid4().hex[:8]}"
                copied_exp["trip_id"] = new_id
                new_expenses.append(copied_exp)
            self.expenses[new_id] = new_expenses

        return new_trip

    def delete_trip(self, trip_id: str) -> bool:
        if trip_id in self.trips:
            del self.trips[trip_id]
            if trip_id in self.days:
                del self.days[trip_id]
            if trip_id in self.expenses:
                del self.expenses[trip_id]
            return True
        return False

    # Itinerary Days & Activities
    def get_trip_days(self, trip_id: str) -> List[Dict[str, Any]]:
        return self.days.get(trip_id, [])

    def set_trip_days(self, trip_id: str, days: List[Dict[str, Any]]) -> None:
        self.days[trip_id] = days

    def add_activity(self, trip_id: str, day_id: str, activity_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        days = self.days.get(trip_id, [])
        for day in days:
            if day["id"] == day_id:
                new_act = copy.deepcopy(activity_data)
                new_act["id"] = f"act-{uuid.uuid4().hex[:8]}"
                new_act["day_id"] = day_id
                new_act["order_index"] = len(day.get("activities", [])) + 1
                day.setdefault("activities", []).append(new_act)
                return new_act
        return None

    def update_activity(self, trip_id: str, activity_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        days = self.days.get(trip_id, [])
        for day in days:
            for act in day.get("activities", []):
                if act["id"] == activity_id:
                    for k, v in data.items():
                        if v is not None:
                            act[k] = v
                    return act
        return None

    def delete_activity(self, trip_id: str, activity_id: str) -> bool:
        days = self.days.get(trip_id, [])
        for day in days:
            original_len = len(day.get("activities", []))
            day["activities"] = [a for a in day.get("activities", []) if a["id"] != activity_id]
            if len(day["activities"]) < original_len:
                # Re-index remaining activities
                for idx, a in enumerate(day["activities"]):
                    a["order_index"] = idx + 1
                return True
        return False

    def reorder_activities(self, trip_id: str, day_id: str, activity_ids_in_order: List[str]) -> bool:
        days = self.days.get(trip_id, [])
        for day in days:
            if day["id"] == day_id:
                act_map = {a["id"]: a for a in day.get("activities", [])}
                reordered = []
                for idx, aid in enumerate(activity_ids_in_order):
                    if aid in act_map:
                        item = act_map[aid]
                        item["order_index"] = idx + 1
                        reordered.append(item)
                day["activities"] = reordered
                return True
        return False

    # Saved Destinations
    def get_saved_destinations(self, user_id: str = "demo-user-123") -> List[Dict[str, Any]]:
        return [sd for sd in self.saved_destinations.values() if sd.get("user_id") == user_id]

    def save_destination(self, data: SavedDestinationCreate, user_id: str = "demo-user-123") -> Dict[str, Any]:
        save_id = f"saved-{uuid.uuid4().hex[:8]}"
        saved = {
            "id": save_id,
            "user_id": user_id,
            "destination_name": data.destination_name,
            "country": data.country,
            "region": data.region,
            "image_url": data.image_url,
            "category": data.category,
            "estimated_budget_range": data.estimated_budget_range,
            "best_time_to_visit": data.best_time_to_visit,
            "notes": data.notes,
            "saved_at": datetime.utcnow().isoformat()
        }
        self.saved_destinations[save_id] = saved
        return saved

    def remove_saved_destination(self, save_id: str) -> bool:
        if save_id in self.saved_destinations:
            del self.saved_destinations[save_id]
            return True
        return False

    # Budget & Expenses
    def get_trip_expenses(self, trip_id: str) -> List[Dict[str, Any]]:
        return self.expenses.get(trip_id, [])

    def add_expense(self, trip_id: str, data: ExpenseItemCreate) -> Dict[str, Any]:
        exp_id = f"exp-{uuid.uuid4().hex[:8]}"
        expense = {
            "id": exp_id,
            "trip_id": trip_id,
            "title": data.title,
            "category": data.category,
            "amount": float(data.amount),
            "currency": data.currency,
            "day_number": data.day_number,
            "date": data.date,
            "notes": data.notes,
            "is_estimate": data.is_estimate
        }
        self.expenses.setdefault(trip_id, []).append(expense)
        return expense

    def delete_expense(self, trip_id: str, expense_id: str) -> bool:
        if trip_id in self.expenses:
            original_len = len(self.expenses[trip_id])
            self.expenses[trip_id] = [e for e in self.expenses[trip_id] if e["id"] != expense_id]
            return len(self.expenses[trip_id]) < original_len
        return False

    # Profile
    def get_profile(self) -> Profile:
        return self.profile

    def update_profile(self, data: ProfileUpdate) -> Profile:
        update_dict = data.model_dump(exclude_unset=True)
        for k, v in update_dict.items():
            if v is not None:
                setattr(self.profile, k, v)
        return self.profile

    # Assistant Conversations
    def get_messages(self, user_id: str = "demo-user-123", trip_id: Optional[str] = None) -> List[Dict[str, Any]]:
        msgs = self.conversations.get(user_id, [])
        if trip_id:
            return [m for m in msgs if m.get("trip_id") in (trip_id, None)]
        return msgs

    def add_message(self, user_id: str, msg: Dict[str, Any]) -> Dict[str, Any]:
        self.conversations.setdefault(user_id, []).append(msg)
        return msg

# Global database instance
db = Database()

