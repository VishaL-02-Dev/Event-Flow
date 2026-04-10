// src/components/CreateEventModal.tsx
import { useState } from 'react';
import API from '../services/api';   

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

export default function CreateEventModal({ 
  isOpen, 
  onClose, 
  onEventCreated 
}: CreateEventModalProps) {

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/events', formData);     

      alert('Event created successfully! 🎉');
      onEventCreated();
      onClose();

      // Reset form
      setFormData({ name: '', description: '', location: '', date: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-zinc-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-zinc-900">Create New Event</h2>
              <p className="text-zinc-600 mt-1">Bring your vision to life</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-2xl transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Event Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 rounded-2xl px-5 py-4 text-zinc-900 placeholder-zinc-400 transition-all outline-none"
                placeholder="Annual Tech Summit 2026"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white border border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 rounded-3xl px-5 py-4 text-zinc-900 placeholder-zinc-400 transition-all outline-none resize-y min-h-[110px]"
                placeholder="A two-day conference featuring industry leaders, workshops, and networking opportunities..."
              />
            </div>

            {/* Location & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Location <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-white border border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 rounded-2xl px-5 py-4 text-zinc-900 placeholder-zinc-400 transition-all outline-none"
                  placeholder="The Grand Ballroom, Bengaluru"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Date & Time <span className="text-red-500">*</span></label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-white border border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 rounded-2xl px-5 py-4 text-zinc-900 transition-all outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 text-zinc-700 font-medium border border-zinc-300 hover:bg-zinc-100 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-70 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating...
                  </>
                ) : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}