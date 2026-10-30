export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  country?: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'archived';
  cover_image_url?: string;
  adults: number;
  children: number;
  traveler_type: 'solo' | 'couple' | 'family' | 'group';
  total_budget: number;
  currency: string;
  accommodation_class: 'budget' | 'comfort' | 'luxury' | 'boutique';
  travel_pace: 'relaxed' | 'balanced' | 'intense';
  personalities: string[];
  interests: string[];
  summary?: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  day_id: string;
  title: string;
  description?: string;
  category: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'relaxation' | 'shopping' | 'transport' | 'hotel';
  start_time: string;
  end_time?: string;
  duration_minutes: number;
  cost: number;
  currency: string;
  location_name: string;
  latitude?: number;
  longitude?: number;
  transport_mode?: string;
  transport_details?: string;
  order_index: number;
  booking_verified: boolean;
}

export interface ItineraryDay {
  id: string;
  trip_id: string;
  day_number: number;
  date: string;
  title: string;
  theme?: string;
  notes?: string;
  activities: Activity[];
}

export interface Attraction {
  name: string;
  category: string;
  description: string;
  estimated_cost: number;
  recommended_duration: string;
  image_url?: string;
}

export interface ActivitySuggestion {
  title: string;
  type: string;
  highlight: string;
  best_time: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  tagline: string;
  description: string;
  hero_image: string;
  card_image: string;
  category: 'trending' | 'recommended' | 'weekend' | 'adventure' | 'cultural' | 'romantic' | 'budget';
  tags: string[];
  estimated_budget_range: string;
  avg_daily_cost: number;
  currency: string;
  best_travel_period: string;
  is_sample_data: boolean;
  overview: string;
  popular_attractions: Attraction[];
  suggested_activities: ActivitySuggestion[];
  travel_tips: string[];
  latitude: number;
  longitude: number;
}

export interface SavedDestination {
  id: string;
  user_id: string;
  destination_name: string;
  country: string;
  region?: string;
  image_url?: string;
  category?: string;
  estimated_budget_range?: string;
  best_time_to_visit?: string;
  notes?: string;
  saved_at: string;
}

export interface CategoryBreakdown {
  category: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface DailyExpenseBreakdown {
  day_number: number;
  date: string;
  amount: number;
}

export interface ExpenseItem {
  id: string;
  trip_id: string;
  title: string;
  category: string;
  amount: number;
  currency: string;
  day_number?: number;
  date?: string;
  notes?: string;
  is_estimate: boolean;
}

export interface BudgetAnalysis {
  trip_id: string;
  currency: string;
  total_budget_limit: number;
  total_estimated_spending: number;
  remaining_budget: number;
  budget_utilization_percentage: number;
  is_over_budget: boolean;
  total_travelers: number;
  per_person_expense: number;
  trip_duration_days: number;
  daily_spending_estimate: number;
  categories: CategoryBreakdown[];
  daily_breakdown: DailyExpenseBreakdown[];
  expenses: ExpenseItem[];
  calculation_timestamp: string;
}

export interface SuggestedAction {
  id: string;
  label: string;
  action_type: string;
  description: string;
  payload: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  trip_id?: string;
  suggested_actions?: SuggestedAction[];
  is_mock?: boolean;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  preferred_currency: string;
  preferred_language: string;
  travel_personality: string[];
  dietary_preferences: string[];
  accessibility_requirements: string[];
  trips_planned_count: number;
  destinations_explored_count: number;
  completed_journeys_count: number;
  total_travel_budget_spent: number;
}

