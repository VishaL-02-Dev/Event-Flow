// src/pages/EventDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import {QRCodeSVG} from 'qrcode.react';

interface Event {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  date: string;
  inviteToken: string;
  organizer: string;
  createdAt: string;
  isDeleted: boolean;
}

interface Guest {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  groupSize: number;
  eventId: string;
  entryToken: string;
  checkedIn: boolean;
  checkInAt?: string;
  registeredAt: string;
  isDeleted?: boolean;
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'guests'>('overview');
  const [showQR, setShowQR] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const inviteLink = event ? `${window.location.origin}/invite/${event.inviteToken}` : '';

  // Fetch Event Details
  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err: any) {
      console.error(err);
      alert("Event not found or you don't have access.");
      navigate('/dashboard');
    }
  };

  // Fetch Guests for this Event
  const fetchGuests = async () => {
    if (!id) return;
    setRefreshing(true);
    try {
      const res = await API.get(`/guests/event/${id}`);
      // Filter out soft-deleted guests
      const activeGuests = res.data.filter((guest: Guest) => !guest.isDeleted);
      setGuests(activeGuests);
    } catch (err) {
      console.error("Failed to fetch guests", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvent();
      fetchGuests();
    }
  }, [id]);

  // Manual Refresh Guests
  const refreshGuests = () => {
    fetchGuests();
  };

  const handleCheckIn = async (entryToken: string) => {
    try {
      await API.post('/guests/checkin', { token: entryToken });
      alert("Guest checked in successfully!");
      fetchGuests(); // Refresh list
    } catch (err: any) {
      alert(err.response?.data?.message || "Check-in failed. Please try again.");
    }
  };

  const copyInviteLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied successfully!");
  };

  if (loading && !event) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-neutral-400">Loading event details...</p>
      </div>
    );
  }

  if (!event) return null;

  const checkedInCount = guests.filter(g => g.checkedIn).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="text-neutral-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              ← Back to My Events
            </Link>
            <div className="h-5 w-px bg-neutral-700" />
            <span className="font-semibold text-lg text-white">{event.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyInviteLink}
              className="px-5 py-2 border border-neutral-700 hover:border-neutral-600 rounded-2xl text-sm transition-all"
            >
              Copy Invite
            </button>
            <button
              onClick={() => setShowQR(true)}
              className="px-5 py-2 bg-violet-600 hover:bg-violet-500 rounded-2xl text-sm font-medium transition-all"
            >
              Show QR Code
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Event Info Card - Light Theme */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 mb-10 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-900 mb-3">{event.name}</h1>
              {event.description && (
                <p className="text-neutral-600 leading-relaxed">{event.description}</p>
              )}
            </div>

            <div className="text-sm text-neutral-600 space-y-2 text-right md:text-left">
              <p><span className="font-medium">📍 Location:</span> {event.location || 'Not specified'}</p>
              <p><span className="font-medium">📅 Date:</span> {new Date(event.date).toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })}</p>
              <p><span className="font-medium">Created:</span> {new Date(event.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-8 py-4 text-lg font-medium transition-all border-b-2 ${activeTab === 'overview' 
              ? 'border-violet-500 text-white' 
              : 'border-transparent text-neutral-400 hover:text-neutral-300'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('guests')}
            className={`px-8 py-4 text-lg font-medium transition-all border-b-2 flex items-center gap-2 ${activeTab === 'guests' 
              ? 'border-violet-500 text-white' 
              : 'border-transparent text-neutral-400 hover:text-neutral-300'}`}
          >
            Guests 
            <span className="text-sm bg-neutral-800 px-2.5 py-0.5 rounded-full">{guests.length}</span>
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Code Card */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Invite with QR Code</h3>
              <p className="text-neutral-600 mb-6">Guests can scan this QR to register easily.</p>

              <div className="flex justify-center bg-neutral-50 border border-neutral-100 rounded-2xl py-10">
                <QRCodeSVG 
                  value={inviteLink} 
                  size={240} 
                  level="H"
                  fgColor="#111827"
                  bgColor="#F8FAFC"
                />
              </div>

              <button
                onClick={copyInviteLink}
                className="mt-6 w-full py-3.5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 rounded-2xl font-medium transition-all"
              >
                Copy Invite Link
              </button>
            </div>

            {/* Stats Card */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">Event Summary</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                  <p className="text-neutral-500 text-sm">Total Registered</p>
                  <p className="text-5xl font-semibold text-neutral-900 mt-3">{guests.length}</p>
                </div>
                <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                  <p className="text-neutral-500 text-sm">Checked In</p>
                  <p className="text-5xl font-semibold text-emerald-600 mt-3">{checkedInCount}</p>
                  <p className="text-xs text-emerald-600 mt-1">
                    {guests.length > 0 ? Math.round((checkedInCount / guests.length) * 100) : 0}% of guests
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guests Tab */}
        {activeTab === 'guests' && (
          <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-8 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
              <h3 className="text-xl font-semibold text-neutral-900">All Guests</h3>
              <button 
                onClick={refreshGuests}
                disabled={refreshing}
                className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-2 disabled:opacity-50"
              >
                {refreshing ? "Refreshing..." : "↻ Refresh"}
              </button>
            </div>

            {guests.length === 0 ? (
              <div className="py-24 text-center text-neutral-500">
                No guests have registered yet.<br />
                Share the invite link or QR code to get started.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {guests.map((guest) => (
                  <div key={guest._id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-neutral-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-neutral-900 text-lg truncate">{guest.name}</div>
                      <div className="text-neutral-600 text-sm mt-1">
                        {guest.email && `${guest.email} • `}
                        {guest.phone && guest.phone}
                        {!guest.email && !guest.phone && "No contact info"}
                      </div>
                      <div className="text-xs text-neutral-500 mt-2">
                        Group Size: <span className="font-medium">{guest.groupSize}</span> • 
                        Registered: {new Date(guest.registeredAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {guest.checkedIn ? (
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-100 text-emerald-700 rounded-2xl text-sm font-medium">
                          ✓ Checked In
                          {guest.checkInAt && (
                            <span className="text-xs opacity-75">
                              {new Date(guest.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCheckIn(guest.entryToken)}
                          className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-2xl text-sm font-medium transition-all active:scale-[0.97]"
                        >
                          Mark as Checked In
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQR && inviteLink && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
            <h3 className="text-2xl font-semibold text-neutral-900 mb-2">Scan to Register</h3>
            <p className="text-neutral-600 mb-8">Guests can scan this QR code to join your event</p>

            <div className="inline-flex justify-center bg-neutral-50 p-6 rounded-2xl mb-8">
              <QRCodeSVG 
                value={inviteLink} 
                size={260} 
                level="H"
                fgColor="#111827"
                bgColor="#F8FAFC"
              />
            </div>

            <button
              onClick={() => setShowQR(false)}
              className="w-full py-4 border border-neutral-300 text-neutral-700 rounded-2xl font-medium hover:bg-neutral-100 transition-all"
            >
              Close QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}