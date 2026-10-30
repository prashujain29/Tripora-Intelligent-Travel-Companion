import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  MapPin,
  Sparkles,
  Bot,
  PlusCircle,
  Bell,
  User,
  Menu,
  X,
  Luggage
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  const navLinks = [
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Journeys', path: '/trips', icon: Luggage },
    { label: 'Trip Studio', path: '/studio', icon: PlusCircle, isHighlight: true },
    { label: 'AI Assistant', path: '/assistant', icon: Bot },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Desktop & Tablet Top Horizontal Navigation */}
      <header className="sticky top-0 z-40 w-full bg-warm/95 backdrop-blur-md border-b border-charcoal-border/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-cobalt flex items-center justify-center text-white shadow-md shadow-cobalt/25 transition-transform group-hover:scale-105">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-2xl font-bold tracking-tight text-charcoal">
                  Tripora
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-cobalt uppercase -mt-1">
                  Intelligent Travel
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-surface-card px-3 py-1.5 rounded-full border border-charcoal-border shadow-sm">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      active
                        ? 'bg-cobalt text-white shadow-sm shadow-cobalt/30'
                        : link.isHighlight
                        ? 'text-cobalt hover:bg-cobalt-50'
                        : 'text-charcoal-light hover:text-charcoal hover:bg-warm-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : link.isHighlight ? 'text-coral' : 'text-charcoal-muted'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setHasUnreadNotification(false)}
                  className="p-2.5 rounded-full text-charcoal-light hover:text-charcoal hover:bg-warm-200 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {hasUnreadNotification && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-coral ring-2 ring-warm" />
                  )}
                </button>
              </div>

              {/* Quick Trip Studio CTA */}
              <Link
                to="/studio"
                className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-full bg-coral hover:bg-coral-600 text-white text-sm font-semibold shadow-sm shadow-coral/25 transition-all hover:shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Trip</span>
              </Link>

              {/* Profile Avatar */}
              <Link
                to="/profile"
                className={`p-1 rounded-full border-2 transition-all ${
                  isActive('/profile') ? 'border-cobalt ring-2 ring-cobalt/20' : 'border-transparent hover:border-cobalt-200'
                }`}
                title="Profile & Settings"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Elena Rostova"
                  className="w-9 h-9 rounded-full object-cover shadow-sm"
                />
              </Link>

              {/* Mobile hamburger toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-charcoal rounded-lg hover:bg-warm-200"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-charcoal-border bg-warm px-4 pt-3 pb-6 space-y-2 shadow-lg">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                    active ? 'bg-cobalt text-white' : 'text-charcoal hover:bg-warm-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-charcoal hover:bg-warm-200 border-t border-charcoal-border/50 pt-3"
            >
              <User className="w-5 h-5" />
              <span>User Profile & Settings</span>
            </Link>
          </div>
        )}
      </header>

      {/* Accessible Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-warm/95 backdrop-blur-md border-t border-charcoal-border py-2 px-3 flex items-center justify-around shadow-2xl">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center py-1 px-2 rounded-xl text-xs font-medium transition-colors ${
                active ? 'text-cobalt font-semibold' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <div className={`p-1 rounded-full ${active ? 'bg-cobalt-100 text-cobalt' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

