import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Tripora" in data["service"]

def test_get_destinations():
    response = client.get("/api/v1/destinations")
    assert response.status_code == 200
    destinations = response.json()
    assert len(destinations) > 0
    assert any("Kyoto" in d["name"] for d in destinations)

def test_destination_filter():
    response = client.get("/api/v1/destinations?category=adventure")
    assert response.status_code == 200
    destinations = response.json()
    for d in destinations:
        assert d["category"].lower() == "adventure"

def test_get_trips():
    response = client.get("/api/v1/trips")
    assert response.status_code == 200
    trips = response.json()
    assert len(trips) >= 3

def test_trip_stats():
    response = client.get("/api/v1/trips/stats/summary")
    assert response.status_code == 200
    stats = response.json()
    assert stats["trips_planned"] >= 3
    assert stats["total_estimated_budget"] > 0

