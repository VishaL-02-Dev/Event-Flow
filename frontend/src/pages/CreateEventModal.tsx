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

      alert('Event created successfully!');
      onEventCreated();
      onClose();

      // Reset form
      setFormData({ name: '', description: '', location: '', date: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Create New Event</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-neutral-400 text-sm block mb-1.5">Event Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500"
                placeholder="Annual Tech Meet 2026"
              />
            </div>

            <div>
              <label className="text-neutral-400 text-sm block mb-1.5">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 h-24"
                placeholder="Tech conference with speakers..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-neutral-400 text-sm block mb-1.5">Location *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500"
                  placeholder="Grand Hall, Bangalore"
                />
              </div>

              <div>
                <label className="text-neutral-400 text-sm block mb-1.5">Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-neutral-400 hover:text-white border border-neutral-700 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 text-white font-medium rounded-2xl transition-all"
              >
                {loading ? 'Creating Event...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}