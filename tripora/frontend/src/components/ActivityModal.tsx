import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, DollarSign, Tag, Navigation, FileText } from 'lucide-react';
import { Activity } from '../types';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activityData: Partial<Activity>) => Promise<void>;
  initialData?: Activity | null;
  dayNumber: number;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  dayNumber,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Activity['category']>('sightseeing');
  const [startTime, setStartTime] = useState('10:00');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [cost, setCost] = useState(25);
  const [locationName, setLocationName] = useState('');
  const [transportMode, setTransportMode] = useState('walking');
  const [transportDetails, setTransportDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setCategory(initialData.category);
      setStartTime(initialData.start_time);
      setDurationMinutes(initialData.duration_minutes);
      setCost(initialData.cost);
      setLocationName(initialData.location_name);
      setTransportMode(initialData.transport_mode || 'walking');
      setTransportDetails(initialData.transport_details || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('sightseeing');
      setStartTime('10:00');
      setDurationMinutes(90);
      setCost(0);
      setLocationName('');
      setTransportMode('walking');
      setTransportDetails('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim()) return;

    try {
      setIsSubmitting(true);
      await onSave({
        title,
        description,
        category,
        start_time: startTime,
        duration_minutes: Number(durationMinutes),
        cost: Number(cost),
        location_name: locationName,
        transport_mode: transportMode,
        transport_details: transportDetails,
        booking_verified: false,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'sightseeing', label: 'Sightseeing' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'culture', label: 'Culture & Heritage' },
    { value: 'relaxation', label: 'Relaxation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'transport', label: 'Transport' },
    { value: 'hotel', label: 'Hotel & Check-in' },
  ];

  const transportModes = [
    { value: 'walking', label: 'Walking' },
    { value: 'metro', label: 'Metro / Subway' },
    { value: 'taxi', label: 'Taxi / Rideshare' },
    { value: 'bus', label: 'Public Bus' },
    { value: 'ferry', label: 'Ferry / Boat' },
    { value: 'train', label: 'Train' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-charcoal-border relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-border">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cobalt">
              Day {dayNumber} Activity
            </span>
            <h3 className="font-editorial text-2xl font-bold text-charcoal">
              {initialData ? 'Edit Activity' : 'Add New Activity'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-charcoal-muted hover:text-charcoal rounded-full hover:bg-warm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
              Activity Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Sunset Spritz at Franco's Bar"
              className="w-full px-4 py-2.5 rounded-xl border border-charcoal-border focus:ring-2 focus:ring-cobalt focus:border-transparent outline-none text-sm font-medium"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cobalt" /> Location / Venue *
            </label>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g., Via Cristoforo Colombo, Positano"
              className="w-full px-4 py-2.5 rounded-xl border border-charcoal-border focus:ring-2 focus:ring-cobalt focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Category & Start Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-coral" /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-border bg-white text-sm outline-none focus:ring-2 focus:ring-cobalt"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cobalt" /> Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-border bg-white text-sm outline-none focus:ring-2 focus:ring-cobalt"
              />
            </div>
          </div>

          {/* Duration & Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="15"
                step="15"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-border text-sm outline-none focus:ring-2 focus:ring-cobalt"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-coral" /> Estimated Cost ($)
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-border text-sm outline-none focus:ring-2 focus:ring-cobalt"
              />
            </div>
          </div>

          {/* Transportation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-cobalt" /> Transport Mode
              </label>
              <select
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-border bg-white text-sm outline-none focus:ring-2 focus:ring-cobalt"
              >
                {transportModes.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Transport Details
              </label>
              <input
                type="text"
                value={transportDetails}
                onChange={(e) => setTransportDetails(e.target.value)}
                placeholder="e.g., 8-minute walk uphill"
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-border text-sm outline-none focus:ring-2 focus:ring-cobalt"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-charcoal-muted" /> Notes & Highlights
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this activity special? Highlights, recommendations, or entry advice..."
              className="w-full px-4 py-2.5 rounded-xl border border-charcoal-border text-sm outline-none focus:ring-2 focus:ring-cobalt"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-charcoal-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-charcoal-muted hover:text-charcoal hover:bg-warm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-cobalt hover:bg-cobalt-600 shadow-md shadow-cobalt/25 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Activity' : 'Add Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

