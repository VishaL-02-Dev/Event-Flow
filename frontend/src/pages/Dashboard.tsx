// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import CreateEventModal from './CreateEventModal';

interface Event {
  _id: string;
  name: string;
  description?: string;
  location: string;
  date: string;
  inviteToken: string;
}

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await API.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const copyInviteLink = (inviteToken: string) => {
    const inviteLink = `${window.location.origin}/invite/${inviteToken}`;
    navigator.clipboard.writeText(inviteLink);
    alert("✅ Invite link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-200 bg-white/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold tracking-tighter">EF</span>
            </div>
            <span className="text-3xl font-semibold tracking-tighter text-zinc-900">EventFlow</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link to="/" className="text-zinc-600 hover:text-zinc-900 transition-colors font-medium">Home</Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="px-6 py-2.5 border border-zinc-300 hover:border-zinc-400 rounded-2xl text-zinc-700 hover:text-zinc-900 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold text-zinc-900 tracking-tight">My Events</h1>
            <p className="text-zinc-600 mt-3 text-lg">Create unforgettable experiences and manage them effortlessly</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 md:mt-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-8 py-4 rounded-3xl font-semibold flex items-center gap-3 shadow-xl shadow-violet-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-xl">+</span>
            Create New Event
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-zinc-300 border-t-violet-600 rounded-full animate-spin mb-4" />
              <p className="text-zinc-500">Loading your events...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-3xl py-24 text-center shadow-sm">
            <div className="mx-auto w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🎉</span>
            </div>
            <h3 className="text-2xl font-semibold text-zinc-900 mb-3">No events yet</h3>
            <p className="text-zinc-600 max-w-md mx-auto mb-8">
              Create your first event and start inviting guests with beautiful QR codes.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-zinc-900 text-white px-10 py-4 rounded-3xl font-medium hover:bg-black transition-all"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div
                key={event._id}
                className="group bg-white border border-zinc-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-violet-200 transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500" />

                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-zinc-900 mb-3 line-clamp-2 group-hover:text-violet-700 transition-colors">
                    {event.name}
                  </h3>

                  {event.description && (
                    <p className="text-zinc-600 text-[15px] leading-relaxed mb-6 line-clamp-3">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-4 text-sm mb-8">
                    <div className="flex items-center gap-3 text-zinc-600">
                      <span className="text-lg">📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-600">
                      <span className="text-lg">📅</span>
                      <span>
                        {new Date(event.date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/event/${event._id}`}
                      className="flex-1 bg-zinc-900 hover:bg-black text-white py-3.5 rounded-2xl text-center font-medium transition-all"
                    >
                      Manage Event
                    </Link>
                    <button
                      onClick={() => copyInviteLink(event.inviteToken)}
                      className="flex-1 border border-zinc-300 hover:bg-zinc-50 py-3.5 rounded-2xl text-center font-medium text-zinc-700 transition-all"
                    >
                      Share Invite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onEventCreated={fetchEvents} 
      />
    </div>
  );
}