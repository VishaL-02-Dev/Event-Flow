import { useEffect, useState } from "react";
import ADMIN_API from "../services/adminApi";

interface Guest {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    groupSize: number;
    checkedIn: boolean;
    isDeleted: boolean;
    checkedInAt?: string;
    registeredAt: string;
}

export default function AdminGuests() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalGuests, setTotalGuests] = useState(0);
    const [eventIdFilter, setEventIdFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);

    const fetchGuests = async (p = 1) => {
        setLoading(true);
        try {
            const res = await ADMIN_API.get(`/guest?page=${p}&eventId=${eventIdFilter}`);
            setGuests(res.data.guests || []);
            setTotalPages(res.data.totalPages || 1);
            setTotalGuests(res.data.totalGuests || 0);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuests(page);
    }, [page, eventIdFilter]);

    const handleToggle = async (guest: Guest) => {
        setActionId(guest._id);
        try {
            if (guest.isDeleted) {
                await ADMIN_API.patch(`/guest/unblock/${guest._id}`);
            } else {
                await ADMIN_API.patch(`/guest/block/${guest._id}`);
            }
            fetchGuests(page);
        } catch (e) {
            console.error(e);
        } finally {
            setActionId(null);
        }
    };

    const clearFilter = () => {
        setEventIdFilter("");
        setPage(1);
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("en-US", { 
            day: "numeric", 
            month: "short", 
            year: "numeric" 
        });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 py-10 px-6">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

                .glass {
                    background: rgba(255, 255, 255, 0.06);
                    backdrop-filter: blur(24px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5);
                }

                .guest-row {
                    transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .guest-row:hover {
                    transform: translateX(14px) scale(1.02);
                    background: rgba(255, 255, 255, 0.09) !important;
                    box-shadow: 0 20px 40px -15px rgba(45, 212, 191, 0.35);
                }

                .avatar {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .guest-row:hover .avatar {
                    transform: scale(1.25) rotate(10deg);
                    box-shadow: 0 0 0 8px rgba(45, 212, 191, 0.25);
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(35px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .stagger {
                    animation: fadeInUp 0.65s backwards;
                }

                .pulse-check {
                    animation: ringPulse 2.6s infinite;
                }

                @keyframes ringPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.5); }
                    70% { box-shadow: 0 0 0 14px rgba(52, 211, 153, 0); }
                }
            `}</style>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <div className="inline-flex items-center gap-3 mb-3">
                            <div className="w-3 h-8 bg-gradient-to-b from-teal-400 to-cyan-400 rounded-full" />
                            <h1 className="text-4xl font-semibold text-white tracking-tight font-space">Guests</h1>
                        </div>
                        <p className="text-slate-400 text-lg">Manage event attendees • Real-time check-ins</p>
                    </div>

                    <div className="text-right">
                        <div className="text-emerald-400 flex items-center gap-2 justify-end text-sm">
                            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                            LIVE
                        </div>
                        <p className="text-slate-400 mt-1 text-sm">
                            {totalGuests.toLocaleString()} guests registered
                        </p>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="glass rounded-3xl p-6 mb-8">
                    <form onSubmit={(e) => { e.preventDefault(); setPage(1); }} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-xs uppercase tracking-widest text-slate-400 mb-2 block">Filter by Event ID</label>
                            <input
                                value={eventIdFilter}
                                onChange={(e) => setEventIdFilter(e.target.value)}
                                placeholder="Enter Event ID..."
                                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-400 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-teal-400 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-teal-600 hover:bg-teal-500 transition-all px-8 py-4 rounded-2xl text-sm font-semibold text-white shadow-lg shadow-teal-500/30"
                        >
                            Apply Filter
                        </button>

                        {eventIdFilter && (
                            <button
                                type="button"
                                onClick={clearFilter}
                                className="text-slate-400 hover:text-white border border-white/10 hover:border-white/30 px-8 py-4 rounded-2xl text-sm transition-all"
                            >
                                Clear
                            </button>
                        )}
                    </form>
                </div>

                {/* Main Table */}
                <div className="glass rounded-3xl overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-[auto_2fr_1.8fr_0.9fr_1.1fr_1fr_auto] gap-6 px-8 py-5 border-b border-white/10 bg-white/5 text-xs font-medium text-slate-400 uppercase tracking-[1px]">
                        <div>Guest</div>
                        <div>Contact Info</div>
                        <div>Group Size</div>
                        <div>Check-in</div>
                        <div>Status</div>
                        <div className="text-right">Action</div>
                    </div>

                    {/* Table Body */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-28">
                            <div className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mb-6" />
                            <p className="text-slate-400 tracking-widest text-sm">Loading guests...</p>
                        </div>
                    ) : guests.length === 0 ? (
                        <div className="text-center py-24 text-slate-400">No guests found</div>
                    ) : (
                        guests.map((guest, index) => (
                            <div
                                key={guest._id}
                                className={`guest-row grid grid-cols-[auto_2fr_1.8fr_0.9fr_1.1fr_1fr_auto] gap-6 items-center px-8 py-6 border-b border-white/10 stagger ${index % 2 === 0 ? 'bg-white/5' : ''}`}
                                style={{ animationDelay: `${index * 45}ms` }}
                            >
                                {/* Avatar + Name */}
                                <div className="flex items-center gap-4">
                                    <div className="avatar w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-xl shadow-inner flex-shrink-0">
                                        {guest.name?.[0]?.toUpperCase() || "G"}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium text-[17px] tracking-tight">{guest.name}</div>
                                        <div className="text-slate-500 text-xs">
                                            Registered {new Date(guest.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="text-slate-300 text-[15px]">
                                    {guest.email && <div className="truncate">{guest.email}</div>}
                                    {guest.phone && <div className="text-slate-400 text-sm truncate">{guest.phone}</div>}
                                    {!guest.email && !guest.phone && <span className="text-slate-600">— No contact info —</span>}
                                </div>

                                {/* Group Size */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m5 4v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-semibold text-white font-space">{guest.groupSize}</div>
                                        <div className="text-xs text-slate-500 -mt-1">people</div>
                                    </div>
                                </div>

                                {/* Check-in Status */}
                                <div>
                                    {guest.checkedIn ? (
                                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                                            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full pulse-check" />
                                            <span className="text-emerald-400 text-sm font-medium">Checked In</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-700/70 border border-slate-600 rounded-2xl">
                                            <span className="text-slate-400 text-sm font-medium">Pending</span>
                                        </div>
                                    )}
                                    {guest.checkedInAt && (
                                        <p className="text-xs text-slate-500 mt-2 pl-1">{formatDate(guest.checkedInAt)}</p>
                                    )}
                                </div>

                                {/* Block Status */}
                                <div>
                                    {guest.isDeleted ? (
                                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-500/10 border border-red-500/30 rounded-2xl">
                                            <div className="w-2 h-2 bg-red-400 rounded-full" />
                                            <span className="text-red-400 text-sm font-medium">Blocked</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                                            <span className="text-emerald-400 text-sm font-medium">Active</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Button */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleToggle(guest)}
                                        disabled={actionId === guest._id}
                                        className={`px-7 py-3.5 text-sm font-semibold rounded-2xl border transition-all duration-300 disabled:opacity-50
                                            ${guest.isDeleted 
                                                ? "border-emerald-400/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400" 
                                                : "border-red-400/50 text-red-400 hover:bg-red-500/10 hover:border-red-400"
                                            }`}
                                    >
                                        {actionId === guest._id ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                Updating...
                                            </span>
                                        ) : guest.isDeleted ? "✅ Unblock" : "⛔ Block"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-10 px-4">
                        <div className="text-slate-400 text-sm">
                            Page <span className="text-white font-medium">{page}</span> of {totalPages}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-7 py-3.5 text-sm font-medium border border-white/10 hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl transition-all hover:bg-white/5 text-slate-300"
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-7 py-3.5 text-sm font-medium border border-white/10 hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl transition-all hover:bg-white/5 text-slate-300"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}