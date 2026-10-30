import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Compass,
  ArrowRight,
  Filter,
  Bookmark,
  Check,
  Sparkles,
  Info
} from 'lucide-react';
import { Destination } from '../types';
import { api } from '../services/api';
import { DestinationDetailModal } from '../components/DestinationDetailModal';

export const ExplorePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialFocus = searchParams.get('focus') || '';

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModalDest, setActiveModalDest] = useState<Destination | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'all', label: 'All Destinations' },
    { id: 'trending', label: 'Trending' },
    { id: 'cultural', label: 'Cultural Heritage' },
    { id: 'romantic', label: 'Romantic Escapes' },
    { id: 'adventure', label: 'Nature & Adventure' },
    { id: 'weekend', label: 'Weekend Getaways' },
    { id: 'budget', label: 'Budget-Friendly' },
  ];

  const fetchDestinations = async () => {
    try {
      setIsLoading(true);
      const data = await api.getDestinations(
        selectedCategory === 'all' ? undefined : selectedCategory,
        searchQuery || undefined
      );
      setDestinations(data);

      if (initialFocus) {
        const match = data.find((d) => d.id === initialFocus);
        if (match) setActiveModalDest(match);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDestinations();
  };

  const handleSaveToggle = async (dest: Destination) => {
    try {
      if (savedIds.has(dest.id)) {
        // Toggle off
        const next = new Set(savedIds);
        next.delete(dest.id);
        setSavedIds(next);
      } else {
        await api.saveDestination({
          destination_name: dest.name,
          country: dest.country,
          region: dest.region,
          image_url: dest.card_image,
          category: dest.category,
          estimated_budget_range: dest.estimated_budget_range,
          best_time_to_visit: dest.best_travel_period,
          notes: dest.tagline,
        });
        setSavedIds(new Set([...savedIds, dest.id]));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header & Search Bar */}
      <div className="space-y-4">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cobalt">
            Travel Discovery
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-charcoal">
            Explore Exceptional Destinations
          </h1>
          <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed">
            Discover destinations curated for scenic beauty, rich traditions, and culinary distinction. Filter by travel personality or search directly by country, city, or region.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="pt-2">
          <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-charcoal-border shadow-sm max-w-2xl">
            <Search className="w-5 h-5 text-cobalt ml-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, country, region, or tags (e.g. Italy, Temples, Hiking)..."
              className="w-full bg-transparent text-charcoal text-sm outline-none font-medium placeholder:text-charcoal-muted"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cobalt hover:bg-cobalt-600 text-white text-sm font-semibold transition-all"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-cobalt text-white shadow-sm shadow-cobalt/30'
                : 'bg-white text-charcoal-light border border-charcoal-border hover:bg-warm-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Demo Grounding Notice */}
      <div className="p-4 rounded-2xl bg-surface-pale border border-cobalt-100/80 flex items-start sm:items-center gap-3 text-xs text-charcoal-light">
        <Info className="w-4 h-4 text-cobalt flex-shrink-0 mt-0.5 sm:mt-0" />
        <span>
          <strong>Sample Travel Benchmark:</strong> Destination profiles, estimated daily cost ranges, and optimal visiting windows are curated for demo exploration. Verified booking conditions should always be confirmed with local operators.
        </span>
      </div>

      {/* Destinations Grid */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <Compass className="w-10 h-10 text-cobalt animate-spin mx-auto" />
          <p className="text-sm font-medium text-charcoal-muted">Loading destination portfolios...</p>
        </div>
      ) : destinations.length === 0 ? (
        <div className="py-24 text-center space-y-4 bg-white rounded-3xl border border-charcoal-border p-8">
          <Compass className="w-12 h-12 text-charcoal-muted mx-auto" />
          <h3 className="font-editorial text-2xl font-bold text-charcoal">No destinations found</h3>
          <p className="text-sm text-charcoal-muted max-w-md mx-auto">
            We couldn't find any destinations matching "{searchQuery}". Try searching for another country or clear filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-full bg-cobalt text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="editorial-card bg-white border border-charcoal-border shadow-soft flex flex-col justify-between group"
            >
              {/* Card Image Container */}
              <div className="relative h-60 w-full overflow-hidden">
                <img
                  src={dest.card_image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />

                {/* Category tag */}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 text-cobalt shadow-sm">
                  {dest.category}
                </span>

                {/* Save bookmark button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveToggle(dest);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                    savedIds.has(dest.id)
                      ? 'bg-coral text-white'
                      : 'bg-white/80 hover:bg-white text-charcoal'
                  }`}
                  title={savedIds.has(dest.id) ? 'Saved' : 'Save to bookmarks'}
                >
                  {savedIds.has(dest.id) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>

                {/* Bottom title over image */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-warm-200">
                    <MapPin className="w-3.5 h-3.5 text-coral" />
                    <span>{dest.country}</span>
                  </div>
                  <h3 className="font-editorial text-2xl font-bold">{dest.name}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-charcoal-light line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>

                {/* Key metadata pills */}
                <div className="space-y-2 pt-2 border-t border-charcoal-border/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-charcoal-muted flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-coral" /> Budget Range
                    </span>
                    <span className="font-semibold text-charcoal">
                      {dest.estimated_budget_range}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-charcoal-muted flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cobalt" /> Best Season
                    </span>
                    <span className="font-semibold text-charcoal">
                      {dest.best_travel_period}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveModalDest(dest)}
                    className="w-full py-2.5 rounded-xl border border-charcoal-border hover:border-cobalt text-xs font-bold text-charcoal hover:text-cobalt transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Destination</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Destination Detail Modal */}
      <DestinationDetailModal
        destination={activeModalDest}
        isOpen={Boolean(activeModalDest)}
        onClose={() => setActiveModalDest(null)}
        onSave={handleSaveToggle}
        isSaved={activeModalDest ? savedIds.has(activeModalDest.id) : false}
      />
    </div>
  );
};

