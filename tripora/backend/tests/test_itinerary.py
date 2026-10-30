import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_itinerary():
    response = client.get("/api/v1/itinerary/trip-amalfi-01")
    assert response.status_code == 200
    data = response.json()
    assert "trip" in data
    assert "days" in data
    assert len(data["days"]) >= 3
    assert len(data["days"][0]["activities"]) > 0

def test_create_trip_and_generate():
    payload = {
        "destination": "Santorini",
        "country": "Greece",
        "start_date": "2026-06-10",
        "end_date": "2026-06-14",
        "adults": 2,
        "children": 0,
        "traveler_type": "couple",
        "total_budget": 3200.0,
        "currency": "USD",
        "accommodation_class": "boutique",
        "travel_pace": "balanced",
        "personalities": ["Romantic", "Cultural"],
        "interests": ["Sunsets", "Greek Cuisine", "Boat Tours"]
    }
    response = client.post("/api/v1/trips", json=payload)
    assert response.status_code == 201
    result = response.json()
    assert "trip" in result
    assert "days" in result
    assert len(result["days"]) == 5  # June 10 to June 14 = 5 days inclusive
    
    trip_id = result["trip"]["id"]
    # Verify we can fetch the generated itinerary
    itin_resp = client.get(f"/api/v1/itinerary/{trip_id}")
    assert itin_resp.status_code == 200
    assert len(itin_resp.json()["days"]) == 5

def test_add_and_delete_activity():
    # 1. Fetch days for amalfi trip
    itin_resp = client.get("/api/v1/itinerary/trip-amalfi-01")
    first_day = itin_resp.json()["days"][0]
    day_id = first_day["id"]

    # 2. Add activity
    act_data = {
        "title": "Midnight Gelato Tasting in Positano",
        "description": "Late night pistachio and dark chocolate gelato.",
        "category": "food",
        "start_time": "23:00",
        "end_time": "23:45",
        "duration_minutes": 45,
        "cost": 12.0,
        "currency": "USD",
        "location_name": "Gelateria Buca di Bacco",
        "transport_mode": "walking"
    }
    add_resp = client.post(f"/api/v1/itinerary/trip-amalfi-01/days/{day_id}/activities", json=act_data)
    assert add_resp.status_code == 200
    created_act = add_resp.json()
    act_id = created_act["id"]
    assert created_act["title"] == act_data["title"]

    # 3. Delete activity
    del_resp = client.delete(f"/api/v1/itinerary/trip-amalfi-01/activities/{act_id}")
    assert del_resp.status_code == 200

