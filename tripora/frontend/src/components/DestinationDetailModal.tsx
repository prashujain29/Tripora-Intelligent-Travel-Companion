import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  Bookmark,
  Check,
  Compass,
  ArrowRight,
  Lightbulb,
  Clock
} from 'lucide-react';
import { Destination } from '../types';

interface DestinationDetailModalProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (dest: Destination) => void;
  isSaved?: boolean;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  isOpen,
  onClose,
  onSave,
  isSaved = false,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !destination) return null;

  const handleCreateTrip = () => {
    onClose();
    navigate(`/studio?dest=${encodeURIComponent(destination.name)}&country=${encodeURIComponent(destination.country)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-charcoal-border relative">
        {/* Hero Header with Imagery */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-t-3xl">
          <img
            src={destination.hero_image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-charcoal flex items-center justify-center shadow-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top category chip */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 text-cobalt shadow-sm">
              {destination.category} Destination
            </span>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2 text-warm-200 text-sm">
              <MapPin className="w-4 h-4 text-coral" />
              <span>{destination.region}, {destination.country}</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight">
              {destination.name}
            </h2>
            <p className="text-warm-200 text-sm max-w-2xl font-light">
              "{destination.tagline}"
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-surface-pale border border-cobalt-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cobalt-100 text-cobalt flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase text-charcoal-muted">Estimated Budget</span>
                <p className="text-sm font-bold text-charcoal">{destination.estimated_budget_range}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-coral-100 text-coral flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase text-charcoal-muted">Best Time to Visit</span>
                <p className="text-sm font-bold text-charcoal">{destination.best_travel_period}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lavender-200 text-purple-700 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase text-charcoal-muted">Daily Benchmark</span>
                <p className="text-sm font-bold text-charcoal">~${destination.avg_daily_cost} / person</p>
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div className="space-y-3">
            <h3 className="font-editorial text-2xl font-bold text-charcoal">
              Destination Overview
            </h3>
            <p className="text-charcoal-light leading-relaxed text-sm sm:text-base">
              {destination.overview}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {destination.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-warm-200 text-charcoal-light"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Popular Attractions */}
          {destination.popular_attractions && destination.popular_attractions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-editorial text-2xl font-bold text-charcoal">
                Must-Experience Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {destination.popular_attractions.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-charcoal-border/70 hover:border-cobalt-200 transition-all bg-white shadow-sm flex flex-col justify-between"
                  >
                    {att.image_url && (
                      <div className="h-32 rounded-xl overflow-hidden mb-3">
                        <img
                          src={att.image_url}
                          alt={att.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="space-y-1.5 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-coral">
                        {att.category}
                      </span>
                      <h4 className="text-sm font-bold text-charcoal">{att.name}</h4>
                      <p className="text-xs text-charcoal-muted line-clamp-3 leading-relaxed">
                        {att.description}
                      </p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-charcoal-border/50 flex items-center justify-between text-xs text-charcoal-muted font-medium">
                      <span>⏱ {att.recommended_duration}</span>
                      <span className="text-cobalt font-semibold">
                        {att.estimated_cost > 0 ? `$${att.estimated_cost}` : 'Free Entry'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Activities */}
          {destination.suggested_activities && destination.suggested_activities.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-editorial text-2xl font-bold text-charcoal">
                Signature Activities
              </h3>
              <div className="space-y-3">
                {destination.suggested_activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-warm-100 border border-charcoal-border/60 flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-coral-100 text-coral flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-charcoal">{act.title}</h4>
                        <span className="text-xs font-semibold text-charcoal-muted flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {act.best_time}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-light leading-relaxed">
                        {act.highlight}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Travel Tips */}
          {destination.travel_tips && destination.travel_tips.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                Insider Curated Tips
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-950">
                {destination.travel_tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-coral font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-charcoal-border">
            {onSave && (
              <button
                type="button"
                onClick={() => onSave(destination)}
                className={`w-full sm:w-auto px-5 py-3 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  isSaved
                    ? 'bg-warm-200 text-charcoal border border-charcoal-border'
                    : 'bg-warm hover:bg-warm-200 text-charcoal-light border border-charcoal-border'
                }`}
              >
                {isSaved ? <Check className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
                <span>{isSaved ? 'Saved in Collection' : 'Save Destination'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCreateTrip}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold text-white bg-cobalt hover:bg-cobalt-600 shadow-elevated shadow-cobalt/25 transition-all flex items-center justify-center gap-2.5"
            >
              <span>Create a Trip to {destination.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

