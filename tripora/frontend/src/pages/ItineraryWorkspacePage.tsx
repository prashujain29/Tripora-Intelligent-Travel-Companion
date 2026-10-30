import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Navigation,
  Compass,
  PieChart,
  Sparkles,
  Bot,
  AlertCircle,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Trip, ItineraryDay, Activity } from '../types';
import { api } from '../services/api';
import { InteractiveMap } from '../components/InteractiveMap';
import { ActivityModal } from '../components/ActivityModal';
import { DayRegenModal } from '../components/DayRegenModal';

export const ItineraryWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [dayRegenModalOpen, setDayRegenModalOpen] = useState(false);
  const [isRegeneratingFull, setIsRegeneratingFull] = useState(false);

  const fetchTripWorkspace = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await api.getItinerary(id);
      setTrip(data.trip);
      setDays(data.days);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTripWorkspace();
  }, [id]);

  const activeDay = days[selectedDayIndex] || days[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Activity Save (Add or Edit)
  const handleSaveActivity = async (activityData: Partial<Activity>) => {
    if (!id || !activeDay) return;

    if (editingActivity) {
      const updated = await api.updateActivity(id, editingActivity.id, activityData);
      setDays((prev) =>
        prev.map((d) =>
          d.id === activeDay.id
            ? {
                ...d,
                activities: d.activities.map((a) => (a.id === updated.id ? updated : a)),
              }
            : d
        )
      );
      showToast('Activity updated successfully');
    } else {
      const created = await api.addActivity(id, activeDay.id, activityData);
      setDays((prev) =>
        prev.map((d) =>
          d.id === activeDay.id ? { ...d, activities: [...d.activities, created] } : d
        )
      );
      showToast('New activity added to day schedule');
    }
  };

  // Activity Delete
  const handleDeleteActivity = async (activityId: string) => {
    if (!id || !activeDay) return;
    if (window.confirm('Remove this activity from Day schedule?')) {
      await api.deleteActivity(id, activityId);
      setDays((prev) =>
        prev.map((d) =>
          d.id === activeDay.id
            ? { ...d, activities: d.activities.filter((a) => a.id !== activityId) }
            : d
        )
      );
      showToast('Activity deleted');
    }
  };

  // Activity Reorder
  const handleReorder = async (currentIndex: number, direction: 'up' | 'down') => {
    if (!id || !activeDay) return;
    const activities = [...activeDay.activities];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= activities.length) return;

    // Swap items
    const [moved] = activities.splice(currentIndex, 1);
    activities.splice(targetIndex, 0, moved);

    // Update locally
    setDays((prev) =>
      prev.map((d) => (d.id === activeDay.id ? { ...d, activities } : d))
    );

    // Sync order with backend
    await api.reorderActivities(
      id,
      activeDay.id,
      activities.map((a) => a.id)
    );
    showToast('Activity order updated');
  };

  // Single Day Regeneration
  const handleRegenerateDay = async (focus: string) => {
    if (!id || !activeDay) return;
    const res = await api.regenerateSingleDay(id, activeDay.id, focus);
    setDays((prev) =>
      prev.map((d) => (d.id === activeDay.id ? res.day : d))
    );
    showToast(`Day ${activeDay.day_number} refreshed with ${focus}`);
  };

  // Full Trip Regeneration
  const handleRegenerateEntireTrip = async () => {
    if (!id) return;
    if (
      window.confirm(
        'Are you sure you want to regenerate all days of this journey? Any custom edits will be replaced.'
      )
    ) {
      try {
        setIsRegeneratingFull(true);
        const res = await api.regenerateEntireTrip(id);
        setDays(res.days);
        setSelectedDayIndex(0);
        showToast('Entire trip itinerary regenerated with fresh suggestions');
      } catch (err) {
        console.error(err);
      } finally {
        setIsRegeneratingFull(false);
      }
    }
  };

  if (isLoading || !trip) {
    return (
      <div className="py-32 text-center space-y-4">
        <Compass className="w-12 h-12 text-cobalt animate-spin mx-auto" />
        <h3 className="font-editorial text-2xl font-bold">Loading Smart Workspace...</h3>
        <p className="text-xs text-charcoal-muted">Retrieving itinerary timetable and spatial maps...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-charcoal text-white px-5 py-3 rounded-2xl shadow-elevated border border-charcoal-light flex items-center gap-2.5 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Workspace Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-cobalt-50 text-cobalt font-bold uppercase tracking-wider">
              {trip.status}
            </span>
            <span className="text-charcoal-muted">•</span>
            <span className="text-charcoal-muted capitalize">
              {trip.traveler_type} ({trip.adults} Adults)
            </span>
            <span className="text-charcoal-muted">•</span>
            <span className="text-charcoal-muted capitalize">{trip.travel_pace} pace</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-charcoal">
            {trip.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-light pt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-coral" /> {trip.destination}, {trip.country}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-cobalt" /> {trip.start_date} to {trip.end_date}
            </span>
            <span className="flex items-center gap-1.5 font-bold text-coral">
              <DollarSign className="w-3.5 h-3.5" /> ${trip.total_budget.toLocaleString()} {trip.currency} Budget
            </span>
          </div>
        </div>

        {/* Quick Tools Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to={`/budget/${trip.id}`}
            className="px-4 py-2.5 rounded-full border border-charcoal-border hover:border-cobalt text-xs font-semibold text-charcoal transition-colors flex items-center gap-1.5"
          >
            <PieChart className="w-4 h-4 text-cobalt" />
            <span>Budget Studio</span>
          </Link>

          <Link
            to="/assistant"
            className="px-4 py-2.5 rounded-full border border-charcoal-border hover:border-coral text-xs font-semibold text-charcoal transition-colors flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4 text-coral" />
            <span>AI Assistant</span>
          </Link>

          <button
            onClick={handleRegenerateEntireTrip}
            disabled={isRegeneratingFull}
            className="px-4 py-2.5 rounded-full bg-warm-200 hover:bg-warm-300 text-charcoal text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Regenerate all days with new ideas"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingFull ? 'animate-spin' : ''}`} />
            <span>Regenerate Trip</span>
          </button>
        </div>
      </div>

      {/* Day Selector Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          return (
            <button
              key={day.id || idx}
              onClick={() => setSelectedDayIndex(idx)}
              className={`p-3 sm:px-5 sm:py-3 rounded-2xl text-left transition-all border whitespace-nowrap flex-shrink-0 ${
                isSelected
                  ? 'bg-cobalt text-white border-cobalt shadow-md shadow-cobalt/25'
                  : 'bg-white text-charcoal border-charcoal-border hover:bg-warm'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                Day {day.day_number}
              </div>
              <div className="text-xs sm:text-sm font-bold truncate max-w-[150px]">
                {day.date}
              </div>
            </button>
          );
        })}
      </div>

      {/* Split Workspace Layout: Timeline (Main) + Map / Context (Secondary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column: Day Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Day Header & Sub-actions */}
          <div className="p-6 rounded-3xl bg-white border border-charcoal-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cobalt">
                Day {activeDay?.day_number} Schedule
              </span>
              <h2 className="font-editorial text-2xl font-bold text-charcoal">
                {activeDay?.title}
              </h2>
              {activeDay?.theme && (
                <p className="text-xs text-charcoal-muted">{activeDay.theme}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDayRegenModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-cobalt-50 text-cobalt hover:bg-cobalt-100 text-xs font-bold transition-colors flex items-center gap-1.5"
                title="Regenerate only this day"
              >
                <Sparkles className="w-3.5 h-3.5 text-coral" />
                <span>Refresh Day</span>
              </button>

              <button
                onClick={() => {
                  setEditingActivity(null);
                  setActivityModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-coral hover:bg-coral-600 text-white text-xs font-bold shadow-sm shadow-coral/25 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Activity</span>
              </button>
            </div>
          </div>

          {/* Activities Chronological Timeline */}
          <div className="space-y-4">
            {!activeDay || activeDay.activities.length === 0 ? (
              <div className="p-10 rounded-3xl bg-white border border-charcoal-border text-center space-y-3">
                <Calendar className="w-8 h-8 text-charcoal-muted mx-auto" />
                <h4 className="font-bold text-charcoal text-base">No activities for Day {activeDay?.day_number}</h4>
                <p className="text-xs text-charcoal-muted">
                  Click "+ Add Activity" or use "Refresh Day" to generate activities.
                </p>
              </div>
            ) : (
              activeDay.activities.map((act, idx) => (
                <div
                  key={act.id}
                  className="p-5 rounded-3xl bg-white border border-charcoal-border shadow-soft flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-cobalt-200 transition-all group"
                >
                  {/* Left: Time & Step Number */}
                  <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-1 flex-shrink-0 sm:w-20">
                    <span className="w-7 h-7 rounded-full bg-cobalt text-white text-xs font-bold flex items-center justify-center">
                      {act.order_index || idx + 1}
                    </span>
                    <span className="text-xs font-bold text-charcoal flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cobalt" />
                      {act.start_time}
                    </span>
                  </div>

                  {/* Center: Activity Information */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-pale text-cobalt border border-cobalt-100">
                        {act.category}
                      </span>
                      <span className="text-xs text-charcoal-muted">
                        ⏱ {act.duration_minutes} min
                      </span>
                      {act.cost > 0 && (
                        <span className="text-xs font-bold text-coral">
                          ${act.cost} {act.currency || trip.currency}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-charcoal">{act.title}</h3>

                    <p className="text-xs text-charcoal-light leading-relaxed">
                      {act.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-muted pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-coral" />
                        {act.location_name}
                      </span>

                      {act.transport_details && (
                        <span className="flex items-center gap-1 text-charcoal-light">
                          <Navigation className="w-3.5 h-3.5 text-cobalt" />
                          {act.transport_mode}: {act.transport_details}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Reorder & Edit Actions */}
                  <div className="flex sm:flex-col items-center gap-1 self-end sm:self-start pt-2 sm:pt-0 border-t sm:border-t-0 border-charcoal-border/50 w-full sm:w-auto justify-end">
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleReorder(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-warm disabled:opacity-20"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReorder(idx, 'down')}
                        disabled={idx === activeDay.activities.length - 1}
                        className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-warm disabled:opacity-20"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingActivity(act);
                          setActivityModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-charcoal-muted hover:text-cobalt hover:bg-warm transition-colors"
                        title="Edit Activity"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteActivity(act.id)}
                        className="p-1.5 rounded-lg text-charcoal-muted hover:text-coral hover:bg-warm transition-colors"
                        title="Delete Activity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Secondary Column: Interactive Map & Trip Context (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          {/* Interactive Map */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
              Spatial Route • Day {activeDay?.day_number}
            </span>
            <InteractiveMap
              activities={activeDay?.activities || []}
              destinationName={trip.destination}
              className="h-80 sm:h-96 w-full"
            />
          </div>

          {/* Contextual Trip Card */}
          <div className="p-6 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-4 text-xs">
            <h4 className="font-bold text-sm text-charcoal uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-cobalt" />
              Itinerary Grounding Insights
            </h4>

            <div className="space-y-2 text-charcoal-light leading-relaxed">
              <p>
                • <strong>Pacing Note:</strong> {activeDay?.notes || `Balanced itinerary for Day ${activeDay?.day_number}.`}
              </p>
              <p>
                • <strong>Estimated Day Spending:</strong> $
                {activeDay?.activities.reduce((sum, a) => sum + (a.cost || 0), 0) || 0} {trip.currency} (excl. lodging)
              </p>
              <p>
                • <strong>Spatial Flow:</strong> Stops are ordered chronologically to minimize transit crisscrossing.
              </p>
            </div>

            <div className="pt-3 border-t border-charcoal-border flex items-center justify-between">
              <Link
                to={`/budget/${trip.id}`}
                className="font-bold text-cobalt hover:underline flex items-center gap-1"
              >
                <span>Full Financial Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Add / Edit Modal */}
      <ActivityModal
        isOpen={activityModalOpen}
        onClose={() => {
          setActivityModalOpen(false);
          setEditingActivity(null);
        }}
        onSave={handleSaveActivity}
        initialData={editingActivity}
        dayNumber={activeDay?.day_number || 1}
      />

      {/* Day Regeneration Modal */}
      <DayRegenModal
        isOpen={dayRegenModalOpen}
        onClose={() => setDayRegenModalOpen(false)}
        onRegenerate={handleRegenerateDay}
        dayNumber={activeDay?.day_number || 1}
      />
    </div>
  );
};

