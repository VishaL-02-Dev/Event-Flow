import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { QRCodeSVG } from 'qrcode.react';

interface EventInfo {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  date: string;
}

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [entryToken, setEntryToken] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    groupSize: 1,
    eventId: ''
  });

  // Fetch event using invite token
  useEffect(() => {
    const fetchEvent = async () => {
      if (!token) return;

      try {
        const res = await API.get(`/guest/invite/${token}`);
        setEvent(res.data);
        setFormData(prev => ({ ...prev, eventId: res.data._id }));
      } catch (err: any) {
        console.error(err);
        alert("This invite link is invalid or has expired.");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'groupSize' ? Number(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter your name");
      return;
    }

    setSubmitting(true);

    try {
      const res = await API.post('/guest/create', formData);
      
      setEntryToken(res.data.guest.entryToken);
      setSuccess(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Success Screen - Show Personal Entry QR
  if (success && entryToken) {
    const entryLink = `${window.location.origin}/checkin/${entryToken}`;

    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl max-w-md w-full p-10 text-center">
          <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            🎟️
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">You're Registered!</h2>
          <p className="text-neutral-600 mb-8">Show this QR code at the event entrance</p>

          <div className="bg-neutral-50 p-8 rounded-2xl inline-block mb-8 shadow-inner">
            <QRCodeSVG 
              value={entryLink} 
              size={260} 
              level="H"
              fgColor="#111827"
              bgColor="#F8FAFC"
            />
          </div>

          <p className="text-xs text-neutral-500 break-all mb-8 px-4">{entryLink}</p>

          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-neutral-900 hover:bg-black text-white rounded-2xl font-medium transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Verifying invite...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-violet-600 rounded-2xl items-center justify-center mb-6 text-4xl">
            🎟️
          </div>
          <h1 className="text-3xl font-bold text-white">You're Invited</h1>
          {event && <p className="text-violet-400 text-xl mt-2">{event.name}</p>}
        </div>

        {event && (
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="mb-8 space-y-2 text-neutral-600">
              <p><strong>Location:</strong> {event.location || 'Not specified'}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-2xl px-5 py-3 focus:border-violet-500 focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-2xl px-5 py-3 focus:border-violet-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-2xl px-5 py-3 focus:border-violet-500 focus:outline-none"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1.5">Number of People (including you) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="groupSize"
                  value={formData.groupSize}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-2xl px-5 py-3 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-400 py-4 rounded-2xl text-white font-medium text-lg transition-all"
              >
                {submitting ? "Registering..." : "Register & Get My Entry QR"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}