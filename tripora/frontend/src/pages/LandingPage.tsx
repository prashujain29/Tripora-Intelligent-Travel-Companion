import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Search,
  ChevronRight,
  Clock,
  Layers,
  Heart
} from 'lucide-react';
import { Destination } from '../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/explore');
    }
  };

  const featuredDestinations = [
    {
      id: 'amalfi-coast-italy',
      name: 'Amalfi Coast',
      country: 'Italy',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80',
      category: 'Romantic',
      highlight: 'Pastel cliffside villas & private wooden boat grottos',
      budget: '$220 - $550 / day',
      gridSpan: 'md:col-span-2 md:row-span-2 h-[460px]',
    },
    {
      id: 'kyoto-japan',
      name: 'Kyoto',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      category: 'Cultural',
      highlight: 'Quiet zen gardens, bamboo forests & tea paths',
      budget: '$180 - $350 / day',
      gridSpan: 'md:col-span-1 h-[220px]',
    },
    {
      id: 'reykjavik-iceland',
      name: 'Southern Wilds',
      country: 'Iceland',
      image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80',
      category: 'Adventure',
      highlight: 'Geothermal milky lagoons & dancing northern lights',
      budget: '$240 - $480 / day',
      gridSpan: 'md:col-span-1 h-[220px]',
    },
    {
      id: 'oaxaca-mexico',
      name: 'Oaxaca de Juárez',
      country: 'Mexico',
      image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=800&q=80',
      category: 'Culinary & Art',
      highlight: 'Ancestral mezcal palenques & artisanal mole recipes',
      budget: '$70 - $160 / day',
      gridSpan: 'md:col-span-2 h-[220px]',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Editorial Travel Hero Section */}
      <section className="relative pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-charcoal text-white shadow-2xl min-h-[580px] sm:min-h-[640px] flex items-center">
          {/* Hero Background Image */}
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
            alt="Scenic Coastal Horizon"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          {/* Deep cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-dark/95 via-charcoal-dark/70 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-lavender-300">
              <Sparkles className="w-3.5 h-3.5 text-coral" />
              <span>Next-Generation Travel Intelligence</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-warm leading-[1.08]">
              Explore more. <br />
              <span className="italic font-normal text-coral">Plan smarter.</span> <br />
              Travel better.
            </h1>

            <p className="text-warm-200 text-base sm:text-lg leading-relaxed font-light">
              Tripora crafts bespoke, day-by-day travel itineraries tuned to your personal pace, budget, and curiosity—powered by Google Gemini intelligence and verified travel benchmarks.
            </p>

            {/* Quick Destination Search Form */}
            <form onSubmit={handleSearchSubmit} className="pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white/95 rounded-2xl sm:rounded-full shadow-elevated max-w-lg">
                <div className="flex items-center gap-3 px-4 py-2 w-full sm:w-auto flex-1">
                  <Search className="w-5 h-5 text-cobalt flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Where to next? (e.g. Kyoto, Amalfi, Iceland)"
                    className="w-full bg-transparent text-charcoal outline-none text-sm placeholder:text-charcoal-muted font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full bg-cobalt hover:bg-cobalt-600 text-white text-sm font-bold shadow-md shadow-cobalt/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Discover</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/studio"
                className="px-6 py-3.5 rounded-full bg-coral hover:bg-coral-600 text-white font-semibold text-sm shadow-md shadow-coral/30 transition-all flex items-center gap-2"
              >
                <span>Plan Your Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/explore"
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-semibold text-sm transition-all"
              >
                Explore Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Value Proposition / AI Planning Explanation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cobalt-50 text-cobalt flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-charcoal">
              Intelligent Curation
            </h3>
            <p className="text-charcoal-light text-sm leading-relaxed">
              No generic cookie-cutter lists. Tripora understands whether you crave early morning temple solitude, family-friendly beach coves, or evening jazz taverns.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-coral-50 text-coral flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-charcoal">
              True Budget Realism
            </h3>
            <p className="text-charcoal-light text-sm leading-relaxed">
              Transparent, calculated expense allocations across accommodations, dining, transport, and experiences. No surprise costs or imaginary prices.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-lavender-200 text-purple-700 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-charcoal">
              Adaptive Workspaces
            </h3>
            <p className="text-charcoal-light text-sm leading-relaxed">
              Rearrange days on interactive timelines, swap activities on interactive maps, and ask your dedicated AI assistant to fine-tune whenever plans change.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Destinations: Asymmetric Editorial Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cobalt">
              Curated World Portfolios
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-charcoal">
              Featured Journeys
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-sm font-bold text-cobalt hover:text-cobalt-700 flex items-center gap-1.5 transition-colors"
          >
            <span>Browse All 20+ Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDestinations.map((dest) => (
            <Link
              key={dest.id}
              to={`/explore?focus=${dest.id}`}
              className={`editorial-card group ${dest.gridSpan}`}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 text-charcoal shadow-sm">
                  {dest.category}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                <div className="flex items-center gap-1 text-xs text-warm-200">
                  <MapPin className="w-3.5 h-3.5 text-coral" />
                  <span>{dest.country}</span>
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold">
                  {dest.name}
                </h3>
                <p className="text-xs sm:text-sm text-warm-200 line-clamp-2 font-light">
                  {dest.highlight}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-coral">
                  <span>{dest.budget}</span>
                  <span className="flex items-center gap-1 text-white group-hover:translate-x-1 transition-transform">
                    Explore Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-surface-pale py-20 border-y border-cobalt-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cobalt">
              Effortless Intelligence
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-charcoal">
              How Tripora Works
            </h2>
            <p className="text-charcoal-muted text-sm sm:text-base">
              Four intuitive steps from initial travel spark to a living, interactive itinerary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Share Preferences',
                desc: 'Select destinations, dates, travel companions, budget limits, and style preferences in our guided Studio.',
              },
              {
                step: '02',
                title: 'AI Synthesis',
                desc: 'Tripora harmonizes travel times, opening hours, local pace, and spatial coordinates into balanced days.',
              },
              {
                step: '03',
                title: 'Interactive Studio',
                desc: 'Fine-tune schedules, adjust timings, swap activities, and visualize daily routes on interactive maps.',
              },
              {
                step: '04',
                title: 'Live Budget & Chat',
                desc: 'Track expenses with real-time financial charts and ask your AI assistant for adjustments on the go.',
              },
            ].map((step, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-white border border-charcoal-border/80 shadow-sm space-y-3">
                <span className="font-editorial text-4xl font-bold text-cobalt/30">
                  {step.step}
                </span>
                <h4 className="font-bold text-lg text-charcoal">{step.title}</h4>
                <p className="text-charcoal-muted text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Itinerary Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-coral">
            Editorial Preview
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-charcoal">
            A Glimpse into Your Journey
          </h2>
          <p className="text-charcoal-muted text-sm">
            Here is a sample timeline generated for an Amalfi Coast journey.
          </p>
        </div>

        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-border shadow-elevated space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-charcoal-border gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cobalt">
                Day 2 Preview
              </span>
              <h3 className="font-editorial text-2xl font-bold text-charcoal">
                Ravello High Clifftops & Classical Romance
              </h3>
            </div>
            <Link
              to="/itinerary/trip-amalfi-01"
              className="px-4 py-2 rounded-full text-xs font-bold bg-cobalt text-white hover:bg-cobalt-600 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Open Live Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {[
              {
                time: '09:30',
                title: 'Morning Ferry from Positano Pier to Amalfi',
                loc: 'Amalfi Port Dock',
                cat: 'Transport',
                cost: '$30',
                badge: 'Ferry',
              },
              {
                time: '11:00',
                title: 'Explore Villa Cimbrone & The Terrace of Infinity',
                loc: 'Villa Cimbrone, Ravello',
                cat: 'Sightseeing',
                cost: '$25',
                badge: 'Culture',
              },
              {
                time: '13:15',
                title: 'Terrace Lunch at Ristorante Garden Ravello',
                loc: 'Ristorante Garden, Ravello',
                cat: 'Dining',
                cost: '$85',
                badge: 'Food',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-warm-100/70 border border-charcoal-border/50"
              >
                <div className="px-2.5 py-1 rounded-lg bg-cobalt-50 text-cobalt font-bold text-xs flex-shrink-0">
                  {item.time}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-charcoal">{item.title}</h4>
                    <span className="text-xs font-bold text-coral">{item.cost}</span>
                  </div>
                  <p className="text-xs text-charcoal-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cobalt" /> {item.loc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] bg-cobalt text-white p-8 sm:p-14 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-coral/30 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight">
              Ready to craft your next unforgettable adventure?
            </h2>
            <p className="text-cobalt-100 text-sm sm:text-base font-light">
              Create a personalized travel itinerary in under 2 minutes with Tripora.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                to="/studio"
                className="px-8 py-4 rounded-full bg-coral hover:bg-coral-600 text-white font-bold text-base shadow-elevated transition-transform hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Launch Trip Studio Wizard</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

