import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_budget_analysis():
    response = client.get("/api/v1/budget/trip-amalfi-01")
    assert response.status_code == 200
    data = response.json()
    assert data["trip_id"] == "trip-amalfi-01"
    assert data["total_budget_limit"] == 3400.0
    assert data["total_estimated_spending"] > 0
    assert len(data["categories"]) > 0
    assert data["per_person_expense"] > 0
    assert data["daily_spending_estimate"] > 0

def test_add_and_delete_expense():
    expense_payload = {
        "trip_id": "trip-amalfi-01",
        "title": "Private Vintage Vespa Rental",
        "category": "transportation",
        "amount": 95.0,
        "currency": "USD",
        "day_number": 2,
        "notes": "Classic Vespa 125 Primavera"
    }
    # Add expense
    add_resp = client.post("/api/v1/budget/trip-amalfi-01/expenses", json=expense_payload)
    assert add_resp.status_code == 200
    created = add_resp.json()
    assert created["title"] == "Private Vintage Vespa Rental"
    exp_id = created["id"]

    # Delete expense
    del_resp = client.delete(f"/api/v1/budget/trip-amalfi-01/expenses/{exp_id}")
    assert del_resp.status_code == 200

