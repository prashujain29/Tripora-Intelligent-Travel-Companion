import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  DollarSign,
  Globe,
  Utensils,
  Shield,
  Bookmark,
  Trash2,
  CheckCircle2,
  LogOut,
  Sparkles,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Profile, SavedDestination } from '../types';
import { api } from '../services/api';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [savedDestinations, setSavedDestinations] = useState<SavedDestination[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profData, savedData] = await Promise.all([
          api.getProfile(),
          api.getSavedDestinations().catch(() => []),
        ]);
        setProfile(profData);
        setSavedDestinations(savedData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setIsSaving(true);
      const updated = await api.updateProfile(profile);
      setProfile(updated);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSaved = async (id: string) => {
    try {
      await api.removeSavedDestination(id);
      setSavedDestinations((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) {
    return (
      <div className="py-32 text-center space-y-3">
        <Compass className="w-10 h-10 text-cobalt animate-spin mx-auto" />
        <p className="text-sm text-charcoal-muted">Loading your profile preferences...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Toast */}
      {successToast && (
        <div className="fixed top-24 right-6 z-50 bg-cobalt text-white px-5 py-3 rounded-2xl shadow-elevated border border-cobalt-400 flex items-center gap-2 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile preferences saved successfully!</span>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-border shadow-soft flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-warm"
          />
          <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-charcoal">
              {profile.full_name}
            </h1>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cobalt-50 text-cobalt">
              Verified Traveler
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-muted">{profile.email}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-charcoal-light pt-2">
            <span>{profile.trips_planned_count} Journeys Planned</span>
            <span>•</span>
            <span>{profile.destinations_explored_count} Ports Explored</span>
            <span>•</span>
            <span className="text-coral">
              ${profile.total_travel_budget_spent.toLocaleString()} Lifetime Spend
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleUpdate}
        className="p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-border">
          <h2 className="font-editorial text-2xl font-bold text-charcoal">
            Travel Preferences & Settings
          </h2>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 rounded-full bg-cobalt hover:bg-cobalt-600 text-white text-xs font-bold shadow-md shadow-cobalt/25 transition-all disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-charcoal-border text-sm outline-none focus:ring-2 focus:ring-cobalt"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full px-4 py-2.5 rounded-xl border border-charcoal-border bg-warm-100 text-sm text-charcoal-muted outline-none cursor-not-allowed"
            />
          </div>
        </div>

        {/* Currency & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-coral" /> Default Currency
            </label>
            <select
              value={profile.preferred_currency}
              onChange={(e) => setProfile({ ...profile, preferred_currency: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-charcoal-border bg-white text-sm outline-none focus:ring-2 focus:ring-cobalt"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cobalt" /> Preferred Language
            </label>
            <select
              value={profile.preferred_language}
              onChange={(e) => setProfile({ ...profile, preferred_language: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-charcoal-border bg-white text-sm outline-none focus:ring-2 focus:ring-cobalt"
            >
              <option value="en">English (Global)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="it">Italiano</option>
              <option value="ja">日本語</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        {/* Dietary & Mobility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-coral" /> Dietary Tags
            </label>
            <input
              type="text"
              value={profile.dietary_preferences.join(', ')}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  dietary_preferences: e.target.value.split(',').map((s) => s.trim()),
                })
              }
              placeholder="e.g. Vegetarian Options, Authentic Local Cuisine"
              className="w-full px-4 py-2.5 rounded-xl border border-charcoal-border text-sm outline-none focus:ring-2 focus:ring-cobalt"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cobalt" /> Accessibility Requirements
            </label>
            <input
              type="text"
              value={profile.accessibility_requirements.join(', ')}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  accessibility_requirements: e.target.value.split(',').map((s) => s.trim()),
                })
              }
              placeholder="e.g. Walking-friendly routes, Elevator access"
              className="w-full px-4 py-2.5 rounded-xl border border-charcoal-border text-sm outline-none focus:ring-2 focus:ring-cobalt"
            />
          </div>
        </div>
      </form>

      {/* Saved Destinations Management */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-2xl font-bold text-charcoal flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-coral" />
            Saved Destinations ({savedDestinations.length})
          </h2>
        </div>

        {savedDestinations.length === 0 ? (
          <p className="text-xs text-charcoal-muted">You have no saved destinations.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedDestinations.map((sd) => (
              <div
                key={sd.id}
                className="p-3.5 rounded-2xl bg-warm-100 border border-charcoal-border/80 flex items-center justify-between gap-3"
              >
                {sd.image_url && (
                  <img
                    src={sd.image_url}
                    alt={sd.destination_name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-charcoal truncate">
                    {sd.destination_name}
                  </h4>
                  <p className="text-xs text-charcoal-muted truncate">
                    {sd.country} • {sd.estimated_budget_range}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSaved(sd.id)}
                  className="p-2 text-charcoal-muted hover:text-coral transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Info & Supabase Auth Connection */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-pale border border-cobalt-200 space-y-4">
        <h3 className="font-editorial text-xl font-bold text-cobalt">
          Account Status & Cloud Synchronization
        </h3>
        <p className="text-xs text-charcoal-light leading-relaxed">
          Currently running in <strong>Tripora Zero-Friction Demo Mode</strong> with instant in-memory & SQLite persistence. To sync across devices via Supabase PostgreSQL, configure <code>SUPABASE_URL</code> and <code>SUPABASE_KEY</code> in your environment.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => alert('Demo Session reset. You are safely logged into Tripora.')}
            className="px-5 py-2.5 rounded-full border border-charcoal-border hover:bg-white text-xs font-semibold text-charcoal-light transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Reset Demo Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};

