// src/pages/EventDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { QRCodeSVG } from 'qrcode.react';

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

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error(err);
      alert("Event not found or you don't have access.");
      navigate('/dashboard');
    }
  };

  const fetchGuests = async () => {
    if (!id) return;
    setRefreshing(true);
    try {
      const res = await API.get(`/guest/event/${id}`);
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

  const refreshGuests = () => fetchGuests();

  const handleCheckIn = async (entryToken: string) => {
    try {
      await API.post('/guest/checkin', { token: entryToken });
      alert("Guest checked in successfully! ✓");
      fetchGuests();
    } catch (err: any) {
      alert(err.response?.data?.message || "Check-in failed");
    }
  };

  const copyInviteLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    alert("✅ Invite link copied to clipboard!");
  };

  if (loading && !event) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-zinc-300 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const checkedInCount = guests.filter(g => g.checkedIn).length;
  const checkInRate = guests.length > 0 ? Math.round((checkedInCount / guests.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white">
      {/* Premium Navbar */}
      <nav className="border-b border-zinc-200 bg-white/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-all group"
            >
              ← <span className="group-hover:underline">Back to Events</span>
            </Link>
            <div className="h-6 w-px bg-zinc-300" />
            <h1 className="font-semibold text-xl text-zinc-900 tracking-tight">{event.name}</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={copyInviteLink}
              className="px-6 py-3 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-2xl transition-all hover:bg-zinc-50"
            >
              Copy Invite Link
            </button>
            <button
              onClick={() => setShowQR(true)}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl font-medium hover:brightness-105 transition-all shadow-lg shadow-violet-500/30"
            >
              Show QR Code
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Hero Event Header */}
        <div className="bg-white border border-zinc-100 rounded-3xl p-10 mb-12 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-zinc-900 tracking-tight mb-4">{event.name}</h1>
              {event.description && (
                <p className="text-zinc-600 text-lg leading-relaxed max-w-2xl">{event.description}</p>
              )}
            </div>

            <div className="space-y-4 text-zinc-600">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-medium">Location</p>
                  <p>{event.location || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p>{new Date(event.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                  })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 mb-10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-10 py-5 text-lg font-semibold transition-all border-b-4 ${activeTab === 'overview' 
              ? 'border-violet-600 text-zinc-900' 
              : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('guests')}
            className={`px-10 py-5 text-lg font-semibold transition-all border-b-4 flex items-center gap-3 ${activeTab === 'guests' 
              ? 'border-violet-600 text-zinc-900' 
              : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
          >
            Guests 
            <span className="text-sm bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-medium">
              {guests.length}
            </span>
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Code Card */}
            <div className="bg-white border border-zinc-100 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all">
              <h3 className="text-2xl font-semibold text-zinc-900 mb-2">Event Invite QR</h3>
              <p className="text-zinc-600 mb-8">Guests can scan this to register instantly</p>

              <div className="flex justify-center bg-zinc-50 border border-zinc-100 rounded-3xl p-10 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-inner">
                  <QRCodeSVG 
                    value={inviteLink} 
                    size={280} 
                    level="H"
                    fgColor="#1f2937"
                    bgColor="#ffffff"
                  />
                </div>
              </div>

              <button
                onClick={copyInviteLink}
                className="w-full py-4 border-2 border-zinc-300 hover:border-violet-300 text-zinc-700 hover:text-violet-700 rounded-2xl font-medium transition-all"
              >
                📋 Copy Invite Link
              </button>
            </div>

            {/* Stats Overview */}
            <div className="space-y-6">
              <div className="bg-white border border-zinc-100 rounded-3xl p-10 shadow-sm">
                <h3 className="text-2xl font-semibold text-zinc-900 mb-8">Event Summary</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-100">
                    <p className="text-zinc-500">Total Guests</p>
                    <p className="text-6xl font-semibold text-zinc-900 mt-4">{guests.length}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
                    <p className="text-emerald-600">Checked In</p>
                    <p className="text-6xl font-semibold text-emerald-600 mt-4">{checkedInCount}</p>
                    <p className="text-emerald-600 text-sm mt-2">
                      {checkInRate}% attendance rate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guests Tab */}
        {activeTab === 'guests' && (
          <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <h3 className="text-2xl font-semibold text-zinc-900">All Registered Guests</h3>
              <button 
                onClick={refreshGuests}
                disabled={refreshing}
                className="flex items-center gap-2 text-violet-600 hover:text-violet-700 disabled:opacity-60 transition-all"
              >
                ↻ {refreshing ? "Refreshing..." : "Refresh List"}
              </button>
            </div>

            {guests.length === 0 ? (
              <div className="py-28 text-center">
                <p className="text-6xl mb-6">👥</p>
                <p className="text-xl text-zinc-500">No guests registered yet</p>
                <p className="text-zinc-600 mt-2">Share the QR code or invite link to start getting registrations</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {guests.map((guest, index) => (
                  <div 
                    key={guest._id} 
                    className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-zinc-50 transition-all"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-xl text-zinc-900">{guest.name}</div>
                      <div className="text-zinc-600 mt-1">
                        {guest.email || guest.phone || "No contact provided"}
                      </div>
                      <div className="text-sm text-zinc-500 mt-3">
                        Group of {guest.groupSize} • Registered {new Date(guest.registeredAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>

                    <div>
                      {guest.checkedIn ? (
                        <div className="inline-flex items-center gap-3 bg-emerald-100 text-emerald-700 px-6 py-3 rounded-2xl">
                          <span className="text-xl">✓</span>
                          <div>
                            <div className="font-medium">Checked In</div>
                            {guest.checkInAt && (
                              <div className="text-xs opacity-75">
                                {new Date(guest.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCheckIn(guest.entryToken)}
                          className="px-8 py-3.5 bg-zinc-900 hover:bg-black text-white rounded-2xl font-medium transition-all active:scale-95"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl">
            <h3 className="text-3xl font-semibold text-zinc-900 mb-3">Scan to Register</h3>
            <p className="text-zinc-600 mb-10">Share this QR code with your guests</p>

            <div className="inline-block bg-white p-8 rounded-3xl shadow-inner mb-10">
              <QRCodeSVG 
                value={inviteLink} 
                size={300} 
                level="H"
                fgColor="#111827"
                bgColor="#ffffff"
              />
            </div>

            <button
              onClick={() => setShowQR(false)}
              className="w-full py-4 border border-zinc-300 text-zinc-700 rounded-2xl font-medium hover:bg-zinc-50 transition-all"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}