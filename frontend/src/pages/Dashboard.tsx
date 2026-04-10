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

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Navbar - Dark */}
      <nav className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center shadow-md">
              <span className="text-white text-xl font-bold">E</span>
            </div>
            <span className="text-white font-semibold tracking-tight text-lg">EventQR</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-neutral-400 hover:text-white transition-colors">Home</Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="text-sm px-5 py-2 border border-neutral-700 hover:border-neutral-600 rounded-2xl transition-all hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white">My Events</h1>
            <p className="text-neutral-400 mt-2">Create and manage your events effortlessly</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-violet-600 hover:bg-violet-500 px-6 py-3.5 rounded-2xl font-medium flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all active:scale-95"
          >
            + Create New Event
          </button>
        </div>

        {loading ? (
          <p className="text-neutral-400 text-center py-10">Loading your events...</p>
        ) : events.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl py-20 text-center">
            <p className="text-neutral-400 text-lg mb-4">You don't have any events yet</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-violet-400 hover:text-violet-300 font-medium text-lg"
            >
              Create your first event →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white border border-neutral-200 rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <h3 className="text-xl font-semibold text-neutral-900 mb-3 line-clamp-1">{event.name}</h3>
                
                {event.description && (
                  <p className="text-neutral-600 text-sm mb-5 line-clamp-2">{event.description}</p>
                )}

                <div className="space-y-2 text-sm text-neutral-600 mb-7">
                  <p className="flex items-center gap-2">
                    📍 <span>{event.location}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    📅 {new Date(event.date).toLocaleDateString('en-IN', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/event/${event._id}`}
                    className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white py-3.5 rounded-2xl text-center text-sm font-medium transition-all"
                  >
                    Manage Event
                  </Link>
                  <button
                    onClick={() => {
                      const inviteLink = `${window.location.origin}/invite/${event.inviteToken}`;
                      navigator.clipboard.writeText(inviteLink);
                      alert("Invite link copied to clipboard!");
                    }}
                    className="flex-1 border border-neutral-300 hover:bg-neutral-100 py-3.5 rounded-2xl text-sm font-medium text-neutral-700 transition-all"
                  >
                    Share Invite
                  </button>
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