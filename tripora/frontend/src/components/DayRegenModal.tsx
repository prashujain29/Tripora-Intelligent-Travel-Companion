import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface DayRegenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: (focus: string) => Promise<void>;
  dayNumber: number;
}

export const DayRegenModal: React.FC<DayRegenModalProps> = ({
  isOpen,
  onClose,
  onRegenerate,
  dayNumber,
}) => {
  const [selectedFocus, setSelectedFocus] = useState('Relaxed Scenic & Food');
  const [customFocus, setCustomFocus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const presetThemes = [
    'Budget-Friendly Hidden Gems',
    'Foodie & Wine Immersion',
    'Rainy Day & Cultural Indoor',
    'Outdoor Adventure & Coastal Trekking',
    'Relaxed Scenic & Photography',
    'Family & Accessible Leisure',
  ];

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const finalFocus = customFocus.trim() || selectedFocus;
      await onRegenerate(finalFocus);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-charcoal-border relative">
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cobalt-50 text-cobalt flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cobalt" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cobalt">
                AI Curator
              </span>
              <h3 className="font-editorial text-2xl font-bold text-charcoal">
                Regenerate Day {dayNumber}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-charcoal-muted hover:text-charcoal rounded-full hover:bg-warm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <p className="text-sm text-charcoal-light leading-relaxed">
            Select a custom angle for Day {dayNumber}. The Tripora AI engine will craft a new, harmonious sequence of activities tailored to this theme.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
              Choose a Curation Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetThemes.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => {
                    setSelectedFocus(theme);
                    setCustomFocus('');
                  }}
                  className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                    selectedFocus === theme && !customFocus
                      ? 'bg-cobalt-50 border-cobalt text-cobalt shadow-sm'
                      : 'bg-warm-100 border-charcoal-border/70 text-charcoal-light hover:border-cobalt-300'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
              Or Specify Your Own Custom Wish
            </label>
            <input
              type="text"
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              placeholder="e.g., Focus on artisan pottery studios and sunset views"
              className="w-full px-4 py-2.5 rounded-xl border border-charcoal-border text-sm outline-none focus:ring-2 focus:ring-cobalt"
            />
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              This will refresh Day {dayNumber}'s timeline. Other days of your itinerary remain completely untouched.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-charcoal-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-charcoal-muted hover:text-charcoal hover:bg-warm transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-cobalt hover:bg-cobalt-600 shadow-md shadow-cobalt/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Regenerating...' : 'Apply AI Refresh'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

