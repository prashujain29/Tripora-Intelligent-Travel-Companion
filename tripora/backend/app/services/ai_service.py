import json
import logging
import uuid
import httpx
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from app.config import settings
from app.models.itinerary import ItineraryDay, Activity

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL
        self.is_live = bool(self.api_key and not settings.MOCK_MODE)

    async def generate_itinerary(self, trip: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generates a complete day-wise itinerary for a trip."""
        # 1. Determine number of days
        try:
            s_date = datetime.strptime(trip["start_date"], "%Y-%m-%d")
            e_date = datetime.strptime(trip["end_date"], "%Y-%m-%d")
            num_days = max((e_date - s_date).days + 1, 1)
        except Exception:
            s_date = datetime.utcnow()
            num_days = 3

        # 2. If Gemini API Key is available and live mode enabled, call Gemini
        if self.is_live:
            try:
                live_days = await self._call_gemini_for_itinerary(trip, s_date, num_days)
                if live_days:
                    return live_days
            except Exception as e:
                logger.warning(f"Gemini API generation failed, falling back to intelligent mock generator: {e}")

        # 3. Fallback: Intelligent Deterministic AI Generation
        return self._generate_deterministic_itinerary(trip, s_date, num_days)

    async def regenerate_single_day(self, trip: Dict[str, Any], day_info: Dict[str, Any], focus: Optional[str] = None) -> Dict[str, Any]:
        """Regenerates a single day while preserving day structure."""
        day_number = day_info.get("day_number", 1)
        date_str = day_info.get("date", trip["start_date"])
        dest = trip["destination"]

        # Curate activities specific to the focus
        activities = self._build_activities_for_day(
            dest=dest,
            day_number=day_number,
            pace=trip.get("travel_pace", "balanced"),
            currency=trip.get("currency", "USD"),
            focus=focus,
            personalities=trip.get("personalities", [])
        )

        return {
            "id": day_info.get("id") or f"day-{uuid.uuid4().hex[:8]}",
            "trip_id": trip["id"],
            "day_number": day_number,
            "date": date_str,
            "title": f"Refreshed Day {day_number}: {focus or 'Curated Hidden Gems'}",
            "theme": f"Tailored {focus or 'Immersive Local Discovery'} in {dest}",
            "notes": "Updated based on your custom focus request while maintaining trip rhythm.",
            "activities": activities
        }

    async def generate_assistant_response(self, message: str, trip: Optional[Dict[str, Any]] = None, history: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Generates AI assistant advice with actionable recommendations."""
        msg_lower = message.lower()
        dest = trip["destination"] if trip else "your selected destination"
        currency = trip.get("currency", "USD") if trip else "USD"

        # Check for specific actionable user queries
        suggested_actions = []

        if "crowd" in msg_lower or "less crowded" in msg_lower or "peaceful" in msg_lower:
            reply = (
                f"To avoid peak tourist crowds in {dest}, I recommend scheduling iconic sights early morning (before 08:30) "
                f"or during twilight. During mid-day peak hours (11:00 – 15:00), escape to residential artisan alleys, "
                f"botanical sanctuaries, or boutique olive/tea estates. Would you like me to adjust your day pace to 'relaxed'?"
            )
            suggested_actions.append({
                "id": f"act-{uuid.uuid4().hex[:6]}",
                "label": "Set pace to Relaxed & shift popular sights to morning",
                "action_type": "adjust_pace",
                "description": f"Adjust activity cadence in {dest} for fewer crowds",
                "payload": {"pace": "relaxed"}
            })

        elif "budget" in msg_lower or "affordable" in msg_lower or "cheap" in msg_lower:
            reply = (
                f"To keep your spending within your target budget in {dest}, here are 3 high-impact strategies:\n"
                f"1. Opt for local neighborhood markets and traditional lunch menus (plat du jour / teishoku), which cost 40-50% less than evening dining.\n"
                f"2. Use regional multi-day rail or ferry passes rather than single-ticket point-to-point taxis.\n"
                f"3. Take advantage of open-air scenic coastal trails and historic viewpoints that are 100% free."
            )
            suggested_actions.append({
                "id": f"act-{uuid.uuid4().hex[:6]}",
                "label": "Add free scenic walking activity",
                "action_type": "add_activity",
                "description": f"Add zero-cost panoramic walking experience in {dest}",
                "payload": {
                    "title": f"Sunset Panoramic Walk along {dest} Ridge",
                    "category": "sightseeing",
                    "cost": 0.0,
                    "location_name": f"{dest} Scenic Overlook",
                    "duration_minutes": 90,
                    "start_time": "17:30"
                }
            })

        elif "rain" in msg_lower or "weather" in msg_lower:
            reply = (
                f"If the forecast shows rain for {dest}, don't worry! We can easily swap outdoor hikes for sheltered cultural gems: "
                f"underground wine cellars, artisan ceramics workshops, local cooking masterclasses, or historic indoor market halls. "
                f"Would you like me to replace outdoor activities on Day 2 with indoor alternatives?"
            )
            suggested_actions.append({
                "id": f"act-{uuid.uuid4().hex[:6]}",
                "label": "Swap outdoor hike with Artisan Cooking & Wine Masterclass",
                "action_type": "replace_activity",
                "description": "Weather-proof indoor cultural experience",
                "payload": {
                    "day_number": 2,
                    "title": f"Artisanal Culinary Workshop & Wine Cellar Tasting",
                    "category": "culture",
                    "cost": 75.0,
                    "location_name": f"Centro Storico {dest}",
                    "duration_minutes": 150,
                    "start_time": "14:00"
                }
            })

        elif "restaurant" in msg_lower or "food" in msg_lower or "eat" in msg_lower:
            reply = (
                f"Here are top culinary highlights in {dest} rooted in seasonal produce:\n"
                f"• An intimate family-run trattoria featuring handmade pasta and locally harvested herbs.\n"
                f"• A rooftop terrace offering fresh seafood crudo, local citrus spritzes, and panoramic sunset views.\n"
                f"• A historic bakery renowned for warm morning pastries and espresso."
            )
            suggested_actions.append({
                "id": f"act-{uuid.uuid4().hex[:6]}",
                "label": "Add authentic local dinner reservation to Day 1",
                "action_type": "add_activity",
                "description": "Add curated chef table dinner",
                "payload": {
                    "day_number": 1,
                    "title": f"Dinner at Trattoria Tipica {dest}",
                    "category": "food",
                    "cost": 55.0,
                    "location_name": f"{dest} Old Town",
                    "duration_minutes": 120,
                    "start_time": "20:00"
                }
            })

        elif "family" in msg_lower or "kids" in msg_lower or "children" in msg_lower:
            reply = (
                f"For family travelers in {dest}, we recommend prioritizing interactive experiences over lengthy museum tours: "
                f"accessible coastal ferries with open upper decks, gelato crafting workshops, botanical gardens with wide lawns, "
                f"and leisurely shaded beach coves with calm shallows."
            )
            suggested_actions.append({
                "id": f"act-{uuid.uuid4().hex[:6]}",
                "label": "Add Family Gelato Making Experience",
                "action_type": "add_activity",
                "description": "Hands-on dessert crafting for adults and kids",
                "payload": {
                    "day_number": 2,
                    "title": "Hands-on Artisanal Gelato Crafting Workshop",
                    "category": "food",
                    "cost": 45.0,
                    "location_name": f"{dest} Artisan Lab",
                    "duration_minutes": 90,
                    "start_time": "15:30"
                }
            })

        else:
            reply = (
                f"I've analyzed your itinerary for {dest}. The balance between active exploration and relaxation looks harmonious. "
                f"You can ask me to optimize for specific dietary requirements, find hidden local view spots, adjust for rainy forecasts, "
                f"or inspect how each planned day fits within your {currency} {trip.get('total_budget', 0) if trip else ''} budget."
            )

        # Disclaimer reminder for responsible AI
        reply += "\n\n*(Note: Tripora AI recommendations provide editorial guidance and cost estimates. Please confirm live hours and reservation availability with official venues directly.)*"

        return {
            "id": f"msg-{uuid.uuid4().hex[:8]}",
            "role": "assistant",
            "content": reply,
            "timestamp": datetime.utcnow().isoformat(),
            "trip_id": trip["id"] if trip else None,
            "suggested_actions": suggested_actions,
            "is_mock": not self.is_live
        }

    def _generate_deterministic_itinerary(self, trip: Dict[str, Any], start_date: datetime, num_days: int) -> List[Dict[str, Any]]:
        dest = trip["destination"]
        pace = trip.get("travel_pace", "balanced")
        currency = trip.get("currency", "USD")
        personalities = trip.get("personalities", [])

        days: List[Dict[str, Any]] = []

        day_themes = [
            ("Arrival & Iconic Vistas", "Welcome stroll, neighborhood orientation & sunset dinner"),
            ("Deep Cultural Heritage & Hidden Alleys", "Historic landmarks, artisan workshops & regional tasting"),
            ("Coastal Trails & Natural Wonders", "Scenic hiking or coastal ferry, nature exploration & picnic"),
            ("Artisanal Markets & Gastronomy", "Morning food market, cooking masterclass & panoramic terrace"),
            ("Leisure, Spa & Golden Hour Cruise", "Thermal relaxation, boutique shopping & farewell sunset feast"),
            ("Off-the-Beaten-Path Expedition", "Nearby rural villages, olive/vineyard estates & tranquil vistas"),
            ("Grand Finale & Souvenirs", "Scenic sunrise walk, souvenir collecting & commemorative lunch")
        ]

        for i in range(num_days):
            day_num = i + 1
            curr_date = start_date + timedelta(days=i)
            theme_idx = i % len(day_themes)
            title, theme_desc = day_themes[theme_idx]

            activities = self._build_activities_for_day(
                dest=dest,
                day_number=day_num,
                pace=pace,
                currency=currency,
                focus=None,
                personalities=personalities
            )

            days.append({
                "id": f"day-{trip['id']}-{day_num}",
                "trip_id": trip["id"],
                "day_number": day_num,
                "date": curr_date.strftime("%Y-%m-%d"),
                "title": f"Day {day_num}: {title}",
                "theme": f"{theme_desc} in {dest}",
                "notes": f"Pace set to {pace}. Always keep a light windbreaker and comfortable walking shoes ready.",
                "activities": activities
            })

        return days

    def _build_activities_for_day(self, dest: str, day_number: int, pace: str, currency: str, focus: Optional[str], personalities: List[str]) -> List[Dict[str, Any]]:
        # Count activities based on pace: relaxed=3, balanced=4, intense=5
        count = 3 if pace == "relaxed" else (5 if pace == "intense" else 4)

        # Coordinate offsets around nominal coords for destination
        base_lat, base_lon = 40.6340, 14.6027
        if "kyoto" in dest.lower() or "japan" in dest.lower():
            base_lat, base_lon = 35.0116, 135.7681
        elif "iceland" in dest.lower() or "reykjavik" in dest.lower():
            base_lat, base_lon = 64.1466, -21.9426
        elif "cape town" in dest.lower():
            base_lat, base_lon = -33.9249, 18.4241
        elif "oaxaca" in dest.lower():
            base_lat, base_lon = 17.0732, -96.7266
        elif "banff" in dest.lower():
            base_lat, base_lon = 51.1784, -115.5708
        elif "lisbon" in dest.lower():
            base_lat, base_lon = 38.7223, -9.1393

        templates = [
            {
                "title": f"Morning Exploration of {dest} Historic Quarter",
                "category": "sightseeing",
                "start_time": "09:00",
                "end_time": "11:00",
                "duration_minutes": 120,
                "cost": 15.0,
                "location_name": f"{dest} Old Center",
                "transport_mode": "walking",
                "transport_details": "10-minute walk from hotel",
                "description": f"Walk through iconic stone passageways and take in centuries of architectural heritage in {dest}."
            },
            {
                "title": f"Authentic Regional Lunch & Market Tasting",
                "category": "food",
                "start_time": "12:00",
                "end_time": "13:30",
                "duration_minutes": 90,
                "cost": 35.0,
                "location_name": f"Mercato Centrale di {dest}",
                "transport_mode": "walking",
                "transport_details": "5-minute stroll",
                "description": f"Taste authentic specialty delicacies prepared with fresh seasonal ingredients."
            },
            {
                "title": f"Scenic Panoramic Viewpoint & Photography",
                "category": "adventure",
                "start_time": "14:30",
                "end_time": "16:30",
                "duration_minutes": 120,
                "cost": 20.0,
                "location_name": f"{dest} Clifftop Belvedere",
                "transport_mode": "bus",
                "transport_details": "Local scenic shuttle",
                "description": f"Enjoy expansive 360-degree vistas overlooking {dest}'s dramatic topography."
            },
            {
                "title": f"Sunset Terrace Aperitivo & Dinner",
                "category": "food",
                "start_time": "18:30",
                "end_time": "21:00",
                "duration_minutes": 150,
                "cost": 75.0,
                "location_name": f"{dest} Sunset Lounge",
                "transport_mode": "walking",
                "transport_details": "8-minute walk",
                "description": f"Relax with artisanal beverages and multi-course local dishes as the evening lights turn on."
            },
            {
                "title": f"Stargazing or Nighttime Stroll",
                "category": "relaxation",
                "start_time": "21:30",
                "end_time": "22:30",
                "duration_minutes": 60,
                "cost": 0.0,
                "location_name": f"{dest} Illuminated Promenade",
                "transport_mode": "walking",
                "transport_details": "Leisurely walk",
                "description": "Quiet evening wind-down taking in the tranquil night atmosphere."
            }
        ]

        activities: List[Dict[str, Any]] = []
        for idx in range(min(count, len(templates))):
            tmpl = templates[idx]
            lat_jitter = base_lat + (day_number * 0.004) + (idx * 0.003)
            lon_jitter = base_lon + (day_number * 0.003) - (idx * 0.002)

            activities.append({
                "id": f"act-{uuid.uuid4().hex[:8]}",
                "day_id": f"day-{day_number}",
                "title": tmpl["title"],
                "description": tmpl["description"],
                "category": tmpl["category"],
                "start_time": tmpl["start_time"],
                "end_time": tmpl["end_time"],
                "duration_minutes": tmpl["duration_minutes"],
                "cost": tmpl["cost"],
                "currency": currency,
                "location_name": tmpl["location_name"],
                "latitude": round(lat_jitter, 4),
                "longitude": round(lon_jitter, 4),
                "transport_mode": tmpl["transport_mode"],
                "transport_details": tmpl["transport_details"],
                "order_index": idx + 1,
                "booking_verified": False
            })

        return activities

    async def _call_gemini_for_itinerary(self, trip: Dict[str, Any], start_date: datetime, num_days: int) -> Optional[List[Dict[str, Any]]]:
        """Calls Google Gemini REST API using structured JSON prompt."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        
        prompt = f"""
        Act as a master luxury travel planner for Tripora. Generate a realistic {num_days}-day itinerary for a trip to {trip['destination']}.
        Traveler type: {trip.get('traveler_type')}, Adults: {trip.get('adults')}, Pace: {trip.get('travel_pace')}.
        Total Budget: {trip.get('total_budget')} {trip.get('currency')}.
        Interests: {', '.join(trip.get('interests', []))}.
        Personalities: {', '.join(trip.get('personalities', []))}.

        Return a JSON array of days. Each day object must contain:
        - "day_number": integer (1 to {num_days})
        - "title": short compelling headline
        - "theme": descriptive editorial theme
        - "notes": helpful travel/weather tips
        - "activities": array of 3 to 4 activity objects:
            - "title": string
            - "description": 2-3 sentences
            - "category": one of "sightseeing", "food", "adventure", "culture", "relaxation", "shopping", "transport", "hotel"
            - "start_time": "HH:MM"
            - "end_time": "HH:MM"
            - "duration_minutes": integer
            - "cost": numeric cost in {trip.get('currency')}
            - "location_name": specific place name
            - "latitude": approximate latitude float
            - "longitude": approximate longitude float
            - "transport_mode": "walking", "bus", "taxi", "ferry", or "train"
            - "transport_details": transport description

        Return ONLY the raw JSON array.
        """

        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.4
            }
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                raw_days = json.loads(text)
                
                # Format into our internal schema with proper UUIDs and dates
                formatted_days = []
                for idx, d in enumerate(raw_days):
                    day_num = d.get("day_number", idx + 1)
                    curr_date = start_date + timedelta(days=idx)
                    day_id = f"day-{trip['id']}-{day_num}"
                    
                    activities = []
                    for act_idx, act in enumerate(d.get("activities", [])):
                        activities.append({
                            "id": f"act-{uuid.uuid4().hex[:8]}",
                            "day_id": day_id,
                            "title": act.get("title", "Scenic Discovery"),
                            "description": act.get("description", ""),
                            "category": act.get("category", "sightseeing"),
                            "start_time": act.get("start_time", "10:00"),
                            "end_time": act.get("end_time", "12:00"),
                            "duration_minutes": int(act.get("duration_minutes", 120)),
                            "cost": float(act.get("cost", 0.0)),
                            "currency": trip.get("currency", "USD"),
                            "location_name": act.get("location_name", trip["destination"]),
                            "latitude": float(act.get("latitude", 40.0)),
                            "longitude": float(act.get("longitude", 14.0)),
                            "transport_mode": act.get("transport_mode", "walking"),
                            "transport_details": act.get("transport_details", "Walking"),
                            "order_index": act_idx + 1,
                            "booking_verified": False
                        })
                        
                    formatted_days.append({
                        "id": day_id,
                        "trip_id": trip["id"],
                        "day_number": day_num,
                        "date": curr_date.strftime("%Y-%m-%d"),
                        "title": d.get("title", f"Day {day_num} in {trip['destination']}"),
                        "theme": d.get("theme", "Exploration"),
                        "notes": d.get("notes", "Enjoy your journey"),
                        "activities": activities
                    })
                return formatted_days

        return None

ai_service = AIService()

