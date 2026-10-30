import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Compass,
  Sparkles,
  Calendar,
  Users,
  Heart,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Clock,
  Shield,
  Layers,
  Utensils,
  Hotel,
  Car,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export const TripStudioPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [formData, setFormData] = useState({
    destination: searchParams.get('dest') || 'Amalfi Coast',
    country: searchParams.get('country') || 'Italy',
    startDate: '2026-11-15',
    endDate: '2026-11-19',
    adults: 2,
    children: 0,
    travelerType: 'couple',
    personalities: ['Romantic', 'Cultural', 'Food Exploration'],
    pace: 'balanced',
    interests: ['Scenic Views', 'Italian Food', 'Coastal Ferries'],
    accommodationClass: 'boutique',
    dietary: 'None',
    mobility: 'Walking-friendly',
    totalBudget: 3400,
    currency: 'USD',
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState('Initializing AI Curator...');

  // Personality options
  const personalityOptions = [
    { id: 'Adventure', label: 'Adventure', icon: '🧗', desc: 'Active exploration, hiking & wilderness' },
    { id: 'Relaxation', label: 'Relaxation', icon: '🌿', desc: 'Thermal spas, quiet beaches & peaceful retreats' },
    { id: 'Luxury', label: 'Luxury & Comfort', icon: '✨', desc: 'Boutique stays, private charters & fine dining' },
    { id: 'Budget', label: 'Budget-Savvy', icon: '🏷️', desc: 'Hidden street gems & authentic affordable spots' },
    { id: 'Cultural', label: 'Cultural & Historic', icon: '🏛️', desc: 'Ancient monuments, museums & local craft' },
    { id: 'Romantic', label: 'Romantic', icon: '🥂', desc: 'Sunset overlooks, candlelit tables & scenic strolls' },
    { id: 'Nature', label: 'Nature & Scenery', icon: '🌲', desc: 'Glaciers, alpine lakes & national parks' },
    { id: 'Food Exploration', label: 'Food Exploration', icon: '🍷', desc: 'Culinary tours, wine tastings & local markets' },
  ];

  const interestTags = [
    'Historical Landmarks', 'Local Street Food', 'Fine Dining', 'Scenic Hikes',
    'Art & Architecture', 'Boat Tours', 'Wine & Cocktails', 'Photography',
    'Local Markets', 'Hidden Beaches', 'Wellness & Spa', 'Wildlife'
  ];

  // Calculate duration
  const getDurationDays = () => {
    try {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
      return Math.max(diff, 1);
    } catch {
      return 1;
    }
  };

  const durationDays = getDurationDays();
  const totalTravelers = Number(formData.adults) + Number(formData.children);
  const perPersonBudget = Math.round(Number(formData.totalBudget) / Math.max(totalTravelers, 1));
  const dailySpendPerPerson = Math.round(perPersonBudget / Math.max(durationDays, 1));

  // Step Navigation Validation
  const validateStep = (step: number) => {
    setValidationError(null);
    if (step === 1) {
      if (!formData.destination.trim()) {
        setValidationError('Please specify a destination.');
        return false;
      }
      if (!formData.startDate || !formData.endDate) {
        setValidationError('Please select both start and end travel dates.');
        return false;
      }
      if (formData.endDate < formData.startDate) {
        setValidationError('End date must be on or after start date.');
        return false;
      }
    } else if (step === 2) {
      if (formData.adults < 1) {
        setValidationError('At least 1 adult traveler is required.');
        return false;
      }
    } else if (step === 3) {
      if (formData.personalities.length === 0) {
        setValidationError('Please select at least one travel personality.');
        return false;
      }
    } else if (step === 5) {
      if (formData.totalBudget <= 0) {
        setValidationError('Please specify a valid total budget.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePersonalityToggle = (id: string) => {
    setFormData((prev) => {
      const exists = prev.personalities.includes(id);
      return {
        ...prev,
        personalities: exists
          ? prev.personalities.filter((p) => p !== id)
          : [...prev.personalities, id],
      };
    });
  };

  const handleInterestToggle = (tag: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(tag);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== tag)
          : [...prev.interests, tag],
      };
    });
  };

  // Submit and Generate
  const handleGenerateJourney = async () => {
    try {
      setIsGenerating(true);
      setGenerationPhase('Analyzing travel pace & seasonal weather...');
      await new Promise((r) => setTimeout(r, 800));

      setGenerationPhase('Synthesizing route coordinates & daily timetable...');
      await new Promise((r) => setTimeout(r, 900));

      setGenerationPhase('Allocating budget benchmarks & culinary pairings...');
      const payload = {
        title: `${formData.destination} ${formData.personalities[0] || 'Curated'} Journey`,
        destination: formData.destination,
        country: formData.country,
        start_date: formData.startDate,
        end_date: formData.endDate,
        adults: formData.adults,
        children: formData.children,
        traveler_type: formData.travelerType,
        total_budget: formData.totalBudget,
        currency: formData.currency,
        accommodation_class: formData.accommodationClass,
        travel_pace: formData.pace,
        personalities: formData.personalities,
        interests: formData.interests,
        summary: `Tailored ${durationDays}-day ${formData.pace} exploration of ${formData.destination} customized for ${formData.travelerType} travelers with an estimated budget of ${formData.currency} ${formData.totalBudget}.`,
      };

      const result = await api.createTrip(payload);

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2864D8', '#FF786B', '#E9E5FF', '#F0F5FF'],
      });

      await new Promise((r) => setTimeout(r, 600));
      navigate(`/itinerary/${result.trip.id}`);
    } catch (err: any) {
      console.error(err);
      setValidationError(err.message || 'Generation failed. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-cobalt flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-coral" />
          Guided Multi-Step Trip Studio
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-charcoal">
          Design Your Personal Journey
        </h1>
        <p className="text-sm text-charcoal-muted max-w-lg mx-auto">
          Step {currentStep} of {totalSteps}: Follow our guided questionnaire to generate a harmonious, budget-aware itinerary.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-charcoal-muted px-1">
          <span className={currentStep >= 1 ? 'text-cobalt font-bold' : ''}>1. Destination</span>
          <span className={currentStep >= 2 ? 'text-cobalt font-bold' : ''}>2. Travelers</span>
          <span className={currentStep >= 3 ? 'text-cobalt font-bold' : ''}>3. Personality</span>
          <span className={currentStep >= 4 ? 'text-cobalt font-bold' : ''}>4. Preferences</span>
          <span className={currentStep >= 5 ? 'text-cobalt font-bold' : ''}>5. Budget</span>
          <span className={currentStep >= 6 ? 'text-cobalt font-bold' : ''}>6. Review</span>
        </div>
        <div className="w-full h-2 rounded-full bg-warm-300 overflow-hidden">
          <div
            className="h-full bg-cobalt transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-coral-50 border border-coral-200 text-coral-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-coral flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Step Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-charcoal-border shadow-elevated min-h-[420px] flex flex-col justify-between">
        {/* STEP 1: DESTINATION & DATES */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="font-editorial text-2xl font-bold text-charcoal">
                Where & When are you traveling?
              </h3>
              <p className="text-xs text-charcoal-muted">
                Specify your target destination and travel calendar window.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cobalt" /> Primary Destination *
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g. Amalfi Coast, Kyoto, Iceland"
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-border text-sm font-medium outline-none focus:ring-2 focus:ring-cobalt"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. Italy, Japan, Iceland"
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-border text-sm outline-none focus:ring-2 focus:ring-cobalt"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-coral" /> Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-border text-sm outline-none focus:ring-2 focus:ring-cobalt"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-coral" /> End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-border text-sm outline-none focus:ring-2 focus:ring-cobalt"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-pale border border-cobalt-100 flex items-center justify-between text-xs">
              <span className="text-charcoal-muted">Trip Duration:</span>
              <span className="font-bold text-cobalt text-sm">
                {durationDays} Days / {Math.max(durationDays - 1, 0)} Nights
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: TRAVELERS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="font-editorial text-2xl font-bold text-charcoal">
                Who is joining this journey?
              </h3>
              <p className="text-xs text-charcoal-muted">
                Party composition helps Tripora select appropriate lodging and activities.
              </p>
            </div>

            {/* Classification */}
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                Traveler Classification
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'solo', label: 'Solo Traveler', icon: '👤' },
                  { id: 'couple', label: 'Couple / Duo', icon: '👫' },
                  { id: 'family', label: 'Family with Kids', icon: '👨‍👩‍👧' },
                  { id: 'group', label: 'Friends Group', icon: '🎉' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, travelerType: type.id as any })}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      formData.travelerType === type.id
                        ? 'bg-cobalt-50 border-cobalt text-cobalt shadow-sm'
                        : 'bg-warm-100 border-charcoal-border text-charcoal-light hover:border-cobalt-200'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{type.icon}</span>
                    <span className="text-xs font-bold block">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Counts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl border border-charcoal-border flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-charcoal">Adults (18+)</h4>
                  <p className="text-xs text-charcoal-muted">Standard rate travelers</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, adults: Math.max(formData.adults - 1, 1) })
                    }
                    className="w-8 h-8 rounded-full border border-charcoal-border flex items-center justify-center font-bold text-charcoal hover:bg-warm"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{formData.adults}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, adults: formData.adults + 1 })
                    }
                    className="w-8 h-8 rounded-full border border-charcoal-border flex items-center justify-center font-bold text-charcoal hover:bg-warm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-charcoal-border flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-charcoal">Children (0 - 17)</h4>
                  <p className="text-xs text-charcoal-muted">Kid-friendly activity filtering</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, children: Math.max(formData.children - 1, 0) })
                    }
                    className="w-8 h-8 rounded-full border border-charcoal-border flex items-center justify-center font-bold text-charcoal hover:bg-warm"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{formData.children}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, children: formData.children + 1 })
                    }
                    className="w-8 h-8 rounded-full border border-charcoal-border flex items-center justify-center font-bold text-charcoal hover:bg-warm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: TRAVEL PERSONALITY */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="font-editorial text-2xl font-bold text-charcoal">
                Choose Your Travel Personality
              </h3>
              <p className="text-xs text-charcoal-muted">
                Select 1 to 3 archetypes that capture the vibe of this trip.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {personalityOptions.map((opt) => {
                const selected = formData.personalities.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handlePersonalityToggle(opt.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      selected
                        ? 'bg-cobalt-50 border-cobalt shadow-sm'
                        : 'bg-warm-100/70 border-charcoal-border/70 hover:border-cobalt-200'
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{opt.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold ${selected ? 'text-cobalt' : 'text-charcoal'}`}>
                          {opt.label}
                        </h4>
                        {selected && <CheckCircle2 className="w-4 h-4 text-cobalt" />}
                      </div>
                      <p className="text-xs text-charcoal-muted mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: PREFERENCES & PACE */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="font-editorial text-2xl font-bold text-charcoal">
                Pace & Specific Interests
              </h3>
              <p className="text-xs text-charcoal-muted">
                Tune the rhythm of your days and select must-have attractions.
              </p>
            </div>

            {/* Travel Pace */}
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                Daily Activity Pace
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'relaxed', label: 'Relaxed', desc: '2-3 leisurely stops/day, ample café time' },
                  { id: 'balanced', label: 'Balanced', desc: '3-4 stops/day, harmonious blend' },
                  { id: 'intense', label: 'Active', desc: '5+ stops/day, packed exploration' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, pace: p.id })}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      formData.pace === p.id
                        ? 'bg-cobalt-50 border-cobalt text-cobalt shadow-sm'
                        : 'bg-warm-100 border-charcoal-border text-charcoal-light hover:border-cobalt-200'
                    }`}
                  >
                    <span className="text-sm font-bold block">{p.label}</span>
                    <span className="text-[10px] text-charcoal-muted block mt-1">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interests Chips */}
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                What excites you most?
              </label>
              <div className="flex flex-wrap gap-2">
                {interestTags.map((tag) => {
                  const active = formData.interests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleInterestToggle(tag)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        active
                          ? 'bg-coral text-white shadow-sm'
                          : 'bg-warm-100 border border-charcoal-border text-charcoal-light hover:bg-warm-200'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dietary & Accessibility */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-coral" /> Dietary Preference
                </label>
                <select
                  value={formData.dietary}
                  onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-border bg-white text-xs outline-none focus:ring-2 focus:ring-cobalt"
                >
                  <option value="None">Standard / No Restrictions</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                  <option value="Halal">Halal</option>
                  <option value="Kosher">Kosher</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cobalt" /> Accessibility & Mobility
                </label>
                <select
                  value={formData.mobility}
                  onChange={(e) => setFormData({ ...formData, mobility: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-border bg-white text-xs outline-none focus:ring-2 focus:ring-cobalt"
                >
                  <option value="Walking-friendly">Walking-friendly (Moderate steps)</option>
                  <option value="Elevator & Step-Free">Step-Free / Elevator Access</option>
                  <option value="Wheelchair Accessible">Wheelchair Accessible</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: BUDGET & LODGING */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="font-editorial text-2xl font-bold text-charcoal">
                Budget & Accommodation Class
              </h3>
              <p className="text-xs text-charcoal-muted">
                Tripora distributes this target budget logically across lodging, dining, transit, and experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-coral" /> Total Journey Budget *
                </label>
                <input
                  type="number"
                  min="200"
                  step="100"
                  value={formData.totalBudget}
                  onChange={(e) => setFormData({ ...formData, totalBudget: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-border text-base font-bold outline-none focus:ring-2 focus:ring-cobalt"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl border border-charcoal-border bg-white text-sm font-bold outline-none focus:ring-2 focus:ring-cobalt"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>

            {/* Accommodation class */}
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                Accommodation Tier
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'budget', label: 'Budget Hostels / B&B', desc: '$40 - $90/night' },
                  { id: 'comfort', label: 'Comfort Hotels (3-4★)', desc: '$120 - $220/night' },
                  { id: 'boutique', label: 'Boutique Heritage', desc: '$250 - $450/night' },
                  { id: 'luxury', label: 'Luxury 5★ Resorts', desc: '$500+/night' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, accommodationClass: tier.id as any })}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      formData.accommodationClass === tier.id
                        ? 'bg-cobalt-50 border-cobalt text-cobalt shadow-sm'
                        : 'bg-warm-100 border-charcoal-border text-charcoal-light hover:border-cobalt-200'
                    }`}
                  >
                    <span className="text-xs font-bold block">{tier.label}</span>
                    <span className="text-[10px] text-charcoal-muted block mt-1">{tier.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Financial Metrics Preview */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-pale border border-cobalt-100">
              <div>
                <span className="text-xs text-charcoal-muted block">Estimated Per-Person Budget</span>
                <span className="text-lg font-bold text-cobalt">
                  ${perPersonBudget} {formData.currency}
                </span>
              </div>
              <div>
                <span className="text-xs text-charcoal-muted block">Daily Benchmark Spend</span>
                <span className="text-lg font-bold text-coral">
                  ~${dailySpendPerPerson} / person / day
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW & SYNTHESIS */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="font-editorial text-2xl font-bold text-charcoal">
                Review Journey Blueprint
              </h3>
              <p className="text-xs text-charcoal-muted">
                Review your selections before the AI curator generates your day-by-day timetable.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-warm-100 border border-charcoal-border/70 text-xs sm:text-sm">
              <div className="space-y-2">
                <div>
                  <span className="text-charcoal-muted block">Destination:</span>
                  <span className="font-bold text-charcoal text-base">
                    {formData.destination}, {formData.country}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">Travel Dates:</span>
                  <span className="font-semibold text-charcoal">
                    {formData.startDate} to {formData.endDate} ({durationDays} Days)
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">Travelers:</span>
                  <span className="font-semibold text-charcoal capitalize">
                    {formData.adults} Adults, {formData.children} Children ({formData.travelerType})
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-charcoal-muted block">Total Target Budget:</span>
                  <span className="font-bold text-coral text-base">
                    ${formData.totalBudget.toLocaleString()} {formData.currency}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">Personalities:</span>
                  <span className="font-semibold text-charcoal">
                    {formData.personalities.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">Pace & Style:</span>
                  <span className="font-semibold text-charcoal capitalize">
                    {formData.pace} pace • {formData.accommodationClass} lodging
                  </span>
                </div>
              </div>
            </div>

            {/* AI Generation State or Ready Banner */}
            {isGenerating ? (
              <div className="p-8 rounded-3xl bg-surface-pale border border-cobalt-200 text-center space-y-4 animate-pulse">
                <Compass className="w-10 h-10 text-cobalt animate-spin mx-auto" />
                <h4 className="font-editorial text-2xl font-bold text-cobalt">
                  Synthesizing Itinerary
                </h4>
                <p className="text-xs font-semibold text-charcoal-light">
                  {generationPhase}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  Everything is set! Clicking <strong>"Generate My Journey"</strong> will invoke the Tripora itinerary engine, calculate realistic activity coordinates, and assemble your interactive timeline.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-charcoal-border mt-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1 || isGenerating}
            className="px-5 py-2.5 rounded-full border border-charcoal-border text-xs font-semibold text-charcoal hover:bg-warm transition-colors disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-full bg-cobalt hover:bg-cobalt-600 text-white text-xs font-bold shadow-md shadow-cobalt/25 transition-all flex items-center gap-2"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateJourney}
              className="px-8 py-3.5 rounded-full bg-coral hover:bg-coral-600 text-white text-sm font-bold shadow-elevated shadow-coral/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Curating...' : 'Generate My Journey'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

