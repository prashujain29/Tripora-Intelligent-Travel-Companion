import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_assistant_chat():
    payload = {
        "message": "Can you help me find more affordable activities for my trip?",
        "trip_id": "trip-amalfi-01"
    }
    response = client.post("/api/v1/assistant/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "assistant"
    assert "content" in data
    assert len(data["content"]) > 20
    assert len(data["suggested_actions"]) > 0

def test_apply_assistant_action():
    payload = {
        "trip_id": "trip-amalfi-01",
        "action_type": "adjust_pace",
        "payload": {"pace": "relaxed"}
    }
    response = client.post("/api/v1/assistant/apply-action", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True

    # Verify trip pace changed
    trip_resp = client.get("/api/v1/trips/trip-amalfi-01")
    assert trip_resp.json()["travel_pace"] == "relaxed"

