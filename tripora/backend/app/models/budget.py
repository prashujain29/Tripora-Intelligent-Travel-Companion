from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import uuid

class ExpenseItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trip_id: str
    title: str
    category: str = Field(..., description="accommodation, food, transportation, activities, shopping, misc")
    amount: float = Field(..., ge=0)
    currency: str = "USD"
    day_number: Optional[int] = None
    date: Optional[str] = None
    notes: Optional[str] = None
    is_estimate: bool = True

class ExpenseItemCreate(BaseModel):
    trip_id: str
    title: str
    category: str
    amount: float
    currency: str = "USD"
    day_number: Optional[int] = None
    date: Optional[str] = None
    notes: Optional[str] = None
    is_estimate: bool = True

class CategoryBreakdown(BaseModel):
    category: str
    name: str
    amount: float
    percentage: float
    color: str

class DailyExpenseBreakdown(BaseModel):
    day_number: int
    date: str
    amount: float

class BudgetAnalysis(BaseModel):
    trip_id: str
    currency: str
    total_budget_limit: float
    total_estimated_spending: float
    remaining_budget: float
    budget_utilization_percentage: float
    is_over_budget: bool
    total_travelers: int
    per_person_expense: float
    trip_duration_days: int
    daily_spending_estimate: float
    categories: List[CategoryBreakdown]
    daily_breakdown: List[DailyExpenseBreakdown]
    expenses: List[ExpenseItem]
    calculation_timestamp: str

