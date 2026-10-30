import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Luggage,
  Bookmark,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Trip, Destination, SavedDestination } from '../types';
import { api } from '../services/api';
import { DestinationDetailModal } from '../components/DestinationDetailModal';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState({
    trips_planned: 3,
    destinations_explored: 12,
    total_estimated_budget: 9700.0,
    completed_journeys: 1,
  });
  const [savedDestinations, setSavedDestinations] = useState<SavedDestination[]>([]);
  const [recommendedDestinations, setRecommendedDestinations] = useState<Destination[]>([]);
  const [activeModalDest, setActiveModalDest] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [tripsData, statsData, savedData, allDestinations] = await Promise.all([
          api.getTrips(),
          api.getTravelStats().catch(() => ({
            trips_planned: 3,
            destinations_explored: 12,
            total_estimated_budget: 9700.0,
            completed_journeys: 1,
          })),
          api.getSavedDestinations().catch(() => []),
          api.getDestinations().catch(() => []),
        ]);

        setTrips(tripsData);
        setStats(statsData);
        setSavedDestinations(savedData);
        setRecommendedDestinations(allDestinations.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Nearest upcoming trip
  const upcomingTrip = trips.find((t) => t.status === 'upcoming') || trips[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-charcoal-border">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cobalt-50 text-cobalt text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-coral" />
            <span>Travel Season 2026/2027</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-charcoal">
            Welcome back, Elena
          </h1>
          <p className="text-sm text-charcoal-muted">
            Your travel journeys are on track. You have{' '}
            <span className="font-semibold text-charcoal">
              {trips.filter((t) => t.status === 'upcoming').length} upcoming journey
            </span>{' '}
            and {savedDestinations.length} saved destinations to discover.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/trips"
            className="px-5 py-2.5 rounded-full border border-charcoal-border hover:border-cobalt text-sm font-semibold text-charcoal transition-colors"
          >
            All Journeys
          </Link>
          <Link
            to="/studio"
            className="px-6 py-2.5 rounded-full bg-coral hover:bg-coral-600 text-white text-sm font-bold shadow-md shadow-coral/25 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Plan New Trip</span>
          </Link>
        </div>
      </div>

      {/* Travel Statistics Horizontal Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-2">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Trips Planned</span>
            <Luggage className="w-5 h-5 text-cobalt" />
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-charcoal font-editorial">
            {stats.trips_planned}
          </div>
          <p className="text-xs text-charcoal-muted">Active & archived journeys</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-2">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Destinations</span>
            <Compass className="w-5 h-5 text-coral" />
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-charcoal font-editorial">
            {stats.destinations_explored}
          </div>
          <p className="text-xs text-charcoal-muted">Explored & saved ports</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-2">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Total Budget</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-charcoal font-editorial">
            ${stats.total_estimated_budget.toLocaleString()}
          </div>
          <p className="text-xs text-charcoal-muted">Allocated travel funds</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-2">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-charcoal font-editorial">
            {stats.completed_journeys}
          </div>
          <p className="text-xs text-charcoal-muted">Cherished past journeys</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Next Adventure Spotlight Card (2 cols) */}
        {upcomingTrip ? (
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cobalt">
                Next Adventure Spotlight
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Departing Soon
              </span>
            </div>

            <div className="editorial-card relative bg-charcoal text-white rounded-3xl overflow-hidden shadow-magazine min-h-[360px] flex flex-col justify-end p-6 sm:p-8">
              <img
                src={upcomingTrip.cover_image_url || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'}
                alt={upcomingTrip.destination}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/50 to-transparent" />

              <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs text-warm-200">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                    {upcomingTrip.traveler_type.toUpperCase()} • {upcomingTrip.adults} Travelers
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-coral" />
                    {upcomingTrip.start_date} to {upcomingTrip.end_date}
                  </span>
                </div>

                <div>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-bold">
                    {upcomingTrip.title}
                  </h2>
                  <p className="text-warm-200 text-xs sm:text-sm line-clamp-2 mt-1 max-w-xl font-light">
                    {upcomingTrip.summary}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/20">
                  <div className="text-xs">
                    <span className="text-warm-300 block">Total Budget</span>
                    <span className="font-bold text-base text-coral">
                      ${upcomingTrip.total_budget.toLocaleString()} {upcomingTrip.currency}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/budget/${upcomingTrip.id}`}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold text-white transition-colors"
                    >
                      Budget Studio
                    </Link>
                    <Link
                      to={`/itinerary/${upcomingTrip.id}`}
                      className="px-5 py-2 rounded-full bg-cobalt hover:bg-cobalt-600 text-xs font-bold text-white shadow-md shadow-cobalt/30 transition-all flex items-center gap-1.5"
                    >
                      <span>Continue Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 p-10 rounded-3xl bg-white border border-charcoal-border text-center space-y-4">
            <Luggage className="w-12 h-12 text-cobalt mx-auto" />
            <h3 className="font-editorial text-2xl font-bold">No trips currently planned</h3>
            <p className="text-sm text-charcoal-muted max-w-md mx-auto">
              Start building your first personalized itinerary with our 6-step Trip Studio wizard.
            </p>
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-coral text-white text-sm font-semibold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Journey</span>
            </Link>
          </div>
        )}

        {/* Saved Destinations Quick Access (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
              Saved Collection
            </span>
            <Link to="/explore" className="text-xs font-semibold text-cobalt hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {savedDestinations.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-charcoal-border text-center text-xs text-charcoal-muted space-y-2">
                <Bookmark className="w-6 h-6 text-charcoal-muted mx-auto" />
                <p>No saved destinations yet.</p>
                <Link to="/explore" className="text-cobalt font-semibold block">
                  Explore Destinations
                </Link>
              </div>
            ) : (
              savedDestinations.slice(0, 3).map((sd) => (
                <div
                  key={sd.id}
                  className="p-3 rounded-2xl bg-white border border-charcoal-border shadow-sm flex items-center gap-3 hover:border-cobalt-300 transition-all cursor-pointer"
                  onClick={() => navigate(`/explore?q=${encodeURIComponent(sd.destination_name)}`)}
                >
                  {sd.image_url && (
                    <img
                      src={sd.image_url}
                      alt={sd.destination_name}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-charcoal truncate">
                      {sd.destination_name}
                    </h4>
                    <span className="text-xs text-charcoal-muted block truncate">
                      {sd.country} • {sd.category}
                    </span>
                    <span className="text-[11px] font-semibold text-coral block mt-0.5">
                      {sd.estimated_budget_range}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-charcoal-muted" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Personalized Destination Recommendations Section */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-coral">
              Tailored For You
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-charcoal">
              Recommended for Your Travel Style
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-bold text-cobalt hover:underline flex items-center gap-1"
          >
            <span>See More Recommendations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedDestinations.map((dest) => (
            <div
              key={dest.id}
              className="editorial-card bg-white border border-charcoal-border shadow-soft flex flex-col justify-between group"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={dest.card_image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-cobalt">
                  {dest.category}
                </span>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-editorial text-xl font-bold">{dest.name}</h4>
                  <p className="text-xs text-warm-200">{dest.country}</p>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-charcoal-light line-clamp-2">
                  {dest.description}
                </p>
                <div className="pt-2 border-t border-charcoal-border flex items-center justify-between text-xs font-semibold text-charcoal">
                  <span>{dest.estimated_budget_range}</span>
                  <button
                    onClick={() => setActiveModalDest(dest)}
                    className="text-cobalt hover:underline flex items-center gap-1"
                  >
                    Details <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destination Detail Modal */}
      <DestinationDetailModal
        destination={activeModalDest}
        isOpen={Boolean(activeModalDest)}
        onClose={() => setActiveModalDest(null)}
      />
    </div>
  );
};

