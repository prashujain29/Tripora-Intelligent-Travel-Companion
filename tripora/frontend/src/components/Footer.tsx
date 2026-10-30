import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Globe, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal text-white pt-16 pb-24 md:pb-16 border-t border-charcoal-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-charcoal-light/20">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cobalt flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-white">
                Tripora
              </span>
            </Link>
            <p className="text-sm text-charcoal-muted leading-relaxed">
              Your intelligent travel companion. Combining editorial curation, personalized AI itinerary generation, and smart financial planning.
            </p>
            <div className="flex items-center gap-2 text-xs text-lavender-400">
              <Sparkles className="w-4 h-4 text-coral" />
              <span>AI-Powered & Grounded Discovery</span>
            </div>
          </div>

          {/* Quick Discover */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-warm-300">
              Discover
            </h4>
            <ul className="space-y-2 text-sm text-charcoal-muted">
              <li><Link to="/explore" className="hover:text-white transition-colors">Trending Destinations</Link></li>
              <li><Link to="/explore?category=weekend" className="hover:text-white transition-colors">Weekend Getaways</Link></li>
              <li><Link to="/explore?category=adventure" className="hover:text-white transition-colors">Adventure & Wilderness</Link></li>
              <li><Link to="/explore?category=cultural" className="hover:text-white transition-colors">Cultural Heritage</Link></li>
              <li><Link to="/explore?category=romantic" className="hover:text-white transition-colors">Romantic Escapes</Link></li>
            </ul>
          </div>

          {/* Planning Suite */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-warm-300">
              Planning Suite
            </h4>
            <ul className="space-y-2 text-sm text-charcoal-muted">
              <li><Link to="/studio" className="hover:text-white transition-colors">Trip Studio Wizard</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Personal Dashboard</Link></li>
              <li><Link to="/trips" className="hover:text-white transition-colors">Saved Journeys</Link></li>
              <li><Link to="/assistant" className="hover:text-white transition-colors">AI Travel Assistant</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Travel Preferences</Link></li>
            </ul>
          </div>

          {/* Editorial & Guidelines */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-warm-300">
              Responsible Travel
            </h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Tripora utilizes Google Gemini intelligence to synthesize sample itineraries and estimates. Always verify operating hours, seasonal weather, and live reservation policies before departure.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-warm-400">
              <Shield className="w-4 h-4 text-cobalt-400" />
              <span>Independent Edition 2.0</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-muted gap-4">
          <p>© {new Date().getFullYear()} Tripora Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security & RLS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

