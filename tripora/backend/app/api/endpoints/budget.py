from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any
from app.db.database import db
from app.models.budget import BudgetAnalysis, ExpenseItemCreate
from app.services.budget_calculator import calculate_trip_budget

router = APIRouter()

@router.get("/{trip_id}", response_model=BudgetAnalysis)
async def get_budget_analysis(trip_id: str):
    trip = db.get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    days = db.get_trip_days(trip_id)
    expenses = db.get_trip_expenses(trip_id)
    
    analysis = calculate_trip_budget(trip, days, expenses)
    return analysis

@router.post("/{trip_id}/expenses")
async def add_trip_expense(trip_id: str, data: ExpenseItemCreate):
    trip = db.get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    new_expense = db.add_expense(trip_id, data)
    return new_expense

@router.delete("/{trip_id}/expenses/{expense_id}")
async def delete_trip_expense(trip_id: str, expense_id: str):
    trip = db.get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    success = db.delete_expense(trip_id, expense_id)
    if not success:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense item deleted successfully"}

