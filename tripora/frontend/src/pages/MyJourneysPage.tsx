import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Luggage,
  Calendar,
  Users,
  DollarSign,
  PlusCircle,
  Copy,
  Trash2,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  Compass,
  PieChart,
  Clock
} from 'lucide-react';
import { Trip } from '../types';
import { api } from '../services/api';

export const MyJourneysPage: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'draft' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'budget_desc'>('date_desc');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      const data = await api.getTrips(
        activeTab === 'all' ? undefined : activeTab,
        searchQuery || undefined,
        sortBy
      );
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [activeTab, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrips();
  };

  const handleDuplicate = async (tripId: string) => {
    try {
      const duplicated = await api.duplicateTrip(tripId);
      await fetchTrips();
      navigate(`/itinerary/${duplicated.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this journey? This action cannot be undone.')) {
      try {
        await api.deleteTrip(tripId);
        setTrips((prev) => prev.filter((t) => t.id !== tripId));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const tabs = [
    { id: 'all', label: 'All Journeys' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'draft', label: 'Drafts' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cobalt">
            Journey Management
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-charcoal">
            My Travel Journeys
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Manage your saved itineraries, review budgets, and continue planning anytime.
          </p>
        </div>

        <Link
          to="/studio"
          className="px-6 py-2.5 rounded-full bg-coral hover:bg-coral-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-coral/25 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Journey</span>
        </Link>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-cobalt text-white shadow-sm shadow-cobalt/25'
                  : 'bg-white text-charcoal-light border border-charcoal-border hover:bg-warm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-charcoal-border bg-white text-xs">
              <Search className="w-3.5 h-3.5 text-charcoal-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter destination..."
                className="bg-transparent outline-none w-36 text-charcoal font-medium placeholder:text-charcoal-muted"
              />
            </div>
          </form>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-charcoal-border bg-white text-xs font-medium text-charcoal outline-none focus:ring-1 focus:ring-cobalt"
          >
            <option value="date_desc">Latest Travel Date</option>
            <option value="date_asc">Earliest Travel Date</option>
            <option value="budget_desc">Highest Budget</option>
          </select>
        </div>
      </div>

      {/* Trip List Grid */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <Compass className="w-10 h-10 text-cobalt animate-spin mx-auto" />
          <p className="text-sm font-medium text-charcoal-muted">Loading your journeys...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-charcoal-border p-8">
          <Luggage className="w-12 h-12 text-cobalt/40 mx-auto" />
          <h3 className="font-editorial text-2xl font-bold text-charcoal">
            No journeys in "{activeTab}"
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
            You don't have any trips matching this tab. Launch the Trip Studio wizard to design your next itinerary.
          </p>
          <Link
            to="/studio"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-coral text-white text-xs font-bold shadow-md shadow-coral/25"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Trip Studio</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const statusColors = {
              upcoming: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              draft: 'bg-amber-50 text-amber-700 border-amber-200',
              completed: 'bg-purple-50 text-purple-700 border-purple-200',
              ongoing: 'bg-blue-50 text-blue-700 border-blue-200',
              archived: 'bg-slate-50 text-slate-700 border-slate-200',
            };

            return (
              <div
                key={trip.id}
                className="editorial-card bg-white border border-charcoal-border shadow-soft flex flex-col justify-between group overflow-hidden"
              >
                {/* Cover Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={trip.cover_image_url || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'}
                    alt={trip.destination}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />

                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                      statusColors[trip.status] || 'bg-white text-charcoal'
                    }`}
                  >
                    {trip.status}
                  </span>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-xs text-warm-200 font-medium">
                      {trip.destination}, {trip.country}
                    </span>
                    <h3 className="font-editorial text-xl font-bold line-clamp-1">
                      {trip.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 text-xs text-charcoal-light">
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal-muted flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cobalt" /> Dates:
                      </span>
                      <span className="font-semibold text-charcoal">
                        {trip.start_date} → {trip.end_date}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-charcoal-muted flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-coral" /> Travelers:
                      </span>
                      <span className="font-semibold text-charcoal capitalize">
                        {trip.traveler_type} ({trip.adults} Adults)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-charcoal-muted flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Target Budget:
                      </span>
                      <span className="font-bold text-coral">
                        ${trip.total_budget.toLocaleString()} {trip.currency}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-charcoal-border/70 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDuplicate(trip.id)}
                        className="p-2 text-charcoal-muted hover:text-charcoal rounded-lg hover:bg-warm transition-colors"
                        title="Duplicate Trip"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(trip.id)}
                        className="p-2 text-charcoal-muted hover:text-coral rounded-lg hover:bg-warm transition-colors"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/budget/${trip.id}`}
                        className="p-2 text-charcoal-muted hover:text-cobalt rounded-lg hover:bg-warm transition-colors"
                        title="Budget Studio"
                      >
                        <PieChart className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/itinerary/${trip.id}`}
                        className="px-3.5 py-1.5 rounded-full bg-cobalt hover:bg-cobalt-600 text-white text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <span>Workspace</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

