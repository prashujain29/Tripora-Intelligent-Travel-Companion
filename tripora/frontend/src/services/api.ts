import {
  Trip,
  ItineraryDay,
  Activity,
  Destination,
  SavedDestination,
  BudgetAnalysis,
  ExpenseItem,
  ChatMessage,
  Profile
} from '../types';

const API_BASE = '/api/v1';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorBody.detail || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Trips
  getTrips: (status?: string, destination?: string, sortBy?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (destination) params.append('destination', destination);
    if (sortBy) params.append('sort_by', sortBy);
    return request<Trip[]>(`/trips?${params.toString()}`);
  },

  getTrip: (tripId: string) => request<Trip>(`/trips/${tripId}`),

  createTrip: (tripData: any) =>
    request<{ trip: Trip; days: ItineraryDay[]; message: string }>('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    }),

  updateTrip: (tripId: string, tripData: Partial<Trip>) =>
    request<Trip>(`/trips/${tripId}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    }),

  duplicateTrip: (tripId: string) =>
    request<Trip>(`/trips/${tripId}/duplicate`, {
      method: 'POST',
    }),

  deleteTrip: (tripId: string) =>
    request<{ message: string; trip_id: string }>(`/trips/${tripId}`, {
      method: 'DELETE',
    }),

  getTravelStats: () =>
    request<{
      trips_planned: number;
      destinations_explored: number;
      total_estimated_budget: number;
      completed_journeys: number;
    }>('/trips/stats/summary'),

  // Itinerary
  getItinerary: (tripId: string) =>
    request<{ trip: Trip; days: ItineraryDay[]; total_days: number; total_activities: number }>(
      `/itinerary/${tripId}`
    ),

  regenerateEntireTrip: (tripId: string) =>
    request<{ message: string; days: ItineraryDay[] }>(`/itinerary/${tripId}/generate`, {
      method: 'POST',
    }),

  regenerateSingleDay: (tripId: string, dayId: string, focus?: string) =>
    request<{ message: string; day: ItineraryDay }>(
      `/itinerary/${tripId}/days/${dayId}/regenerate`,
      {
        method: 'POST',
        body: JSON.stringify({ day_id: dayId, focus, preserve_manual_edits: true }),
      }
    ),

  addActivity: (tripId: string, dayId: string, activityData: Partial<Activity>) =>
    request<Activity>(`/itinerary/${tripId}/days/${dayId}/activities`, {
      method: 'POST',
      body: JSON.stringify(activityData),
    }),

  updateActivity: (tripId: string, activityId: string, activityData: Partial<Activity>) =>
    request<Activity>(`/itinerary/${tripId}/activities/${activityId}`, {
      method: 'PUT',
      body: JSON.stringify(activityData),
    }),

  deleteActivity: (tripId: string, activityId: string) =>
    request<{ message: string; activity_id: string }>(`/itinerary/${tripId}/activities/${activityId}`, {
      method: 'DELETE',
    }),

  reorderActivities: (tripId: string, dayId: string, activityIds: string[]) =>
    request<{ message: string }>(`/itinerary/${tripId}/days/${dayId}/reorder`, {
      method: 'POST',
      body: JSON.stringify({ activity_ids: activityIds }),
    }),

  // Destinations
  getDestinations: (category?: string, query?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('q', query);
    return request<Destination[]>(`/destinations?${params.toString()}`);
  },

  getDestination: (id: string) => request<Destination>(`/destinations/${id}`),

  getSavedDestinations: () => request<SavedDestination[]>('/destinations/saved/all'),

  saveDestination: (data: Partial<SavedDestination>) =>
    request<SavedDestination>('/destinations/saved', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  removeSavedDestination: (id: string) =>
    request<{ message: string; id: string }>(`/destinations/saved/${id}`, {
      method: 'DELETE',
    }),

  // Budget
  getBudgetAnalysis: (tripId: string) => request<BudgetAnalysis>(`/budget/${tripId}`),

  addExpense: (tripId: string, expenseData: Partial<ExpenseItem>) =>
    request<ExpenseItem>(`/budget/${tripId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(expenseData),
    }),

  deleteExpense: (tripId: string, expenseId: string) =>
    request<{ message: string }>(`/budget/${tripId}/expenses/${expenseId}`, {
      method: 'DELETE',
    }),

  // AI Assistant
  getMessages: (tripId?: string) => {
    const params = tripId ? `?trip_id=${tripId}` : '';
    return request<ChatMessage[]>(`/assistant/messages${params}`);
  },

  sendMessage: (message: string, tripId?: string) =>
    request<ChatMessage>('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message, trip_id: tripId }),
    }),

  applyAssistantAction: (tripId: string, actionType: string, payload: Record<string, any>) =>
    request<{ success: boolean; message: string; updated_trip_id: string }>('/assistant/apply-action', {
      method: 'POST',
      body: JSON.stringify({ trip_id: tripId, action_type: actionType, payload }),
    }),

  // Profile
  getProfile: () => request<Profile>('/profile'),

  updateProfile: (profileData: Partial<Profile>) =>
    request<Profile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

