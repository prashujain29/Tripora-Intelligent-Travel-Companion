from datetime import datetime
from typing import List, Dict, Any
from app.models.budget import (
    BudgetAnalysis,
    CategoryBreakdown,
    DailyExpenseBreakdown,
    ExpenseItem
)

CATEGORY_COLORS = {
    "accommodation": "#2864D8",     # Cobalt blue
    "food": "#FF786B",              # Coral
    "activities": "#9475FB",        # Lavender purple
    "transportation": "#38BDF8",    # Sky blue
    "shopping": "#F59E0B",          # Amber
    "misc": "#94A3B8"               # Slate
}

CATEGORY_NAMES = {
    "accommodation": "Accommodation & Lodging",
    "food": "Dining, Cafés & Food",
    "activities": "Tours, Culture & Experiences",
    "transportation": "Transport, Flights & Ferries",
    "shopping": "Artisanal Goods & Shopping",
    "misc": "Tips, Porterage & Miscellaneous"
}

def calculate_trip_budget(trip: Dict[str, Any], days: List[Dict[str, Any]], expenses: List[Dict[str, Any]]) -> BudgetAnalysis:
    # 1. Trip Duration
    try:
        s_date = datetime.strptime(trip["start_date"], "%Y-%m-%d")
        e_date = datetime.strptime(trip["end_date"], "%Y-%m-%d")
        duration = max((e_date - s_date).days + 1, 1)
    except Exception:
        duration = len(days) if len(days) > 0 else 1

    # 2. Total travelers
    adults = max(int(trip.get("adults", 1)), 1)
    children = max(int(trip.get("children", 0)), 0)
    total_travelers = adults + children

    # 3. Currency and Budget Limit
    currency = trip.get("currency", "USD")
    total_budget_limit = float(trip.get("total_budget", 0.0))

    # 4. If explicit expenses exist, use them. Otherwise, aggregate from days/activities
    items_to_analyze: List[Dict[str, Any]] = []
    
    if expenses and len(expenses) > 0:
        items_to_analyze = expenses
    else:
        # Synthesize from activities + estimated lodging
        for d in days:
            day_num = d.get("day_number", 1)
            date_str = d.get("date", "")
            for act in d.get("activities", []):
                cat = act.get("category", "sightseeing").lower()
                # Map activity category to budget category
                mapped_cat = "activities"
                if cat in ("food", "dining"):
                    mapped_cat = "food"
                elif cat in ("transport", "ferry", "train", "taxi", "bus"):
                    mapped_cat = "transportation"
                elif cat in ("hotel", "lodging"):
                    mapped_cat = "accommodation"
                elif cat in ("shopping", "markets"):
                    mapped_cat = "shopping"
                
                cost = float(act.get("cost", 0.0))
                if cost > 0:
                    items_to_analyze.append({
                        "id": act.get("id"),
                        "trip_id": trip["id"],
                        "title": act.get("title"),
                        "category": mapped_cat,
                        "amount": cost,
                        "currency": currency,
                        "day_number": day_num,
                        "date": date_str,
                        "notes": act.get("location_name"),
                        "is_estimate": True
                    })

    # 5. Calculate category totals
    category_totals: Dict[str, float] = {
        "accommodation": 0.0,
        "food": 0.0,
        "activities": 0.0,
        "transportation": 0.0,
        "shopping": 0.0,
        "misc": 0.0
    }

    # Daily aggregation
    daily_map: Dict[str, float] = {}

    for item in items_to_analyze:
        cat = item.get("category", "misc").lower()
        if cat not in category_totals:
            cat = "misc"
        amt = float(item.get("amount", 0.0))
        category_totals[cat] += amt

        # Daily mapping
        d_key = f"Day {item.get('day_number', 1)}"
        daily_map[d_key] = daily_map.get(d_key, 0.0) + amt

    total_estimated_spending = sum(category_totals.values())
    if total_estimated_spending == 0.0 and total_budget_limit > 0:
        # Fallback conservative baseline distribution based on destination & class
        total_estimated_spending = total_budget_limit * 0.88
        category_totals["accommodation"] = total_estimated_spending * 0.44
        category_totals["food"] = total_estimated_spending * 0.22
        category_totals["activities"] = total_estimated_spending * 0.16
        category_totals["transportation"] = total_estimated_spending * 0.10
        category_totals["shopping"] = total_estimated_spending * 0.05
        category_totals["misc"] = total_estimated_spending * 0.03

    remaining_budget = max(total_budget_limit - total_estimated_spending, 0.0)
    utilization = (total_estimated_spending / total_budget_limit * 100.0) if total_budget_limit > 0 else 0.0
    is_over = total_estimated_spending > total_budget_limit

    per_person = round(total_estimated_spending / total_travelers, 2)
    daily_spend = round(total_estimated_spending / duration, 2)

    # Build category breakdown objects
    categories_list: List[CategoryBreakdown] = []
    for cat_key, amount in category_totals.items():
        pct = (amount / total_estimated_spending * 100.0) if total_estimated_spending > 0 else 0.0
        categories_list.append(CategoryBreakdown(
            category=cat_key,
            name=CATEGORY_NAMES.get(cat_key, cat_key.capitalize()),
            amount=round(amount, 2),
            percentage=round(pct, 1),
            color=CATEGORY_COLORS.get(cat_key, "#94A3B8")
        ))

    # Daily breakdown list
    daily_breakdown: List[DailyExpenseBreakdown] = []
    for i in range(1, duration + 1):
        day_key = f"Day {i}"
        amt = daily_map.get(day_key, round(daily_spend, 2))
        daily_breakdown.append(DailyExpenseBreakdown(
            day_number=i,
            date=f"Day {i}",
            amount=round(amt, 2)
        ))

    # Expense items models
    expense_models = [ExpenseItem(**item) for item in items_to_analyze]

    return BudgetAnalysis(
        trip_id=trip["id"],
        currency=currency,
        total_budget_limit=round(total_budget_limit, 2),
        total_estimated_spending=round(total_estimated_spending, 2),
        remaining_budget=round(remaining_budget, 2),
        budget_utilization_percentage=round(utilization, 1),
        is_over_budget=is_over,
        total_travelers=total_travelers,
        per_person_expense=per_person,
        trip_duration_days=duration,
        daily_spending_estimate=daily_spend,
        categories=categories_list,
        daily_breakdown=daily_breakdown,
        expenses=expense_models,
        calculation_timestamp=datetime.utcnow().isoformat()
    )

