import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ADMIN_API from "../services/adminApi";

interface Event {
    _id: string;
    name: string;
    date: string;
    location?: string;
    isDeleted: boolean;
    createdAt: string;
}

export default function AdminEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEvents, setTotalEvents] = useState(0);
    const [search, setSearch] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);

    const fetchEvents = async (p = 1) => {
        setLoading(true);
        try {
            const res = await ADMIN_API.get(`/events?page=${p}&search=${search}&date=${date}`);
            setEvents(res.data.events || []);
            setTotalPages(res.data.totalPages || 1);
            setTotalEvents(res.data.totalEvents || 0);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents(page);
    }, [page, search, date]); // Auto-refresh when filters change

    const handleToggle = async (eventItem: Event) => {
    setActionId(eventItem._id);

    const loadingToast = toast.loading(
        eventItem.isDeleted ? "Unblocking event..." : "Blocking event..."
    );

    // ✅ Optimistic UI update (instant)
    setEvents(prev =>
        prev.map(ev =>
            ev._id === eventItem._id
                ? { ...ev, isDeleted: !ev.isDeleted }
                : ev
        )
    );

    try {
        if (eventItem.isDeleted) {
            await ADMIN_API.patch(`/events/${eventItem._id}/unblock`);
            toast.success("Event unblocked ✅", { id: loadingToast });
        } else {
            await ADMIN_API.patch(`/events/${eventItem._id}/block`);
            toast.success("Event blocked ⛔", { id: loadingToast });
        }
    } catch (e) {
        console.error(e);

        // ❌ Rollback if API fails
        setEvents(prev =>
            prev.map(ev =>
                ev._id === eventItem._id
                    ? { ...ev, isDeleted: eventItem.isDeleted }
                    : ev
            )
        );

        toast.error("Failed to update ❌", { id: loadingToast });
    } finally {
        setActionId(null);
    }
};

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("en-US", { 
            day: "numeric", 
            month: "short", 
            year: "numeric" 
        });

    const clearFilters = () => {
        setSearch("");
        setDate("");
        setPage(1);
    };

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

                .event-row {
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .event-row:hover {
                    transform: translateX(12px) scale(1.015);
                    background: rgba(255, 255, 255, 0.08) !important;
                    box-shadow: 0 15px 35px -10px rgba(139, 92, 246, 0.35);
                }

                .avatar-icon {
                    transition: all 0.4s ease;
                }
                .event-row:hover .avatar-icon {
                    transform: scale(1.2) rotate(12deg);
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .stagger-row {
                    animation: fadeInUp 0.6s backwards;
                }

                .pulse-dot {
                    animation: ringPulse 2.5s infinite ease-in-out;
                }

                @keyframes ringPulse {
                    0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.5); }
                    70% { box-shadow: 0 0 0 12px rgba(74, 222, 128, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
                }

                .filter-input {
                    transition: all 0.3s ease;
                }
                .filter-input:focus {
                    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
                    border-color: #a5b4fc;
                }
            `}</style>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <div className="inline-flex items-center gap-3 mb-3">
                            <div className="w-3 h-8 bg-gradient-to-b from-violet-400 to-fuchsia-500 rounded-full" />
                            <h1 className="text-4xl font-semibold text-white tracking-tight font-space">Events</h1>
                        </div>
                        <p className="text-slate-400 text-lg">Manage all platform events • Real-time control</p>
                    </div>

                    <div className="text-right">
                        <div className="text-emerald-400 flex items-center gap-2 justify-end text-sm font-medium">
                            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full pulse-dot" />
                            LIVE
                        </div>
                        <p className="text-slate-400 mt-1 text-sm">
                            {totalEvents.toLocaleString()} events total
                        </p>
                    </div>
                </div>

                {/* Filters - Glass Style */}
                <div className="glass rounded-3xl p-6 mb-8 flex flex-wrap gap-4 items-end">
                    <form onSubmit={(e) => { e.preventDefault(); setPage(1); }} className="flex-1 flex flex-wrap gap-4">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search event name..."
                            className="filter-input flex-1 min-w-72 bg-white/5 border border-white/10 text-white placeholder-slate-400 rounded-2xl px-5 py-3.5 text-sm focus:outline-none"
                        />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="filter-input bg-white/5 border border-white/10 text-slate-300 rounded-2xl px-5 py-3.5 text-sm focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-violet-600 hover:bg-violet-500 transition-all px-8 py-3.5 rounded-2xl text-sm font-semibold text-white shadow-lg shadow-violet-500/30"
                        >
                            Search
                        </button>
                    </form>

                    {(search || date) && (
                        <button
                            onClick={clearFilters}
                            className="text-slate-400 hover:text-white border border-white/10 hover:border-white/30 px-6 py-3.5 rounded-2xl text-sm transition-all"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Main Table */}
                <div className="glass rounded-3xl overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-[auto_2.5fr_1.2fr_1.4fr_1fr_auto] gap-6 px-8 py-5 border-b border-white/10 bg-white/5 text-xs font-medium text-slate-400 uppercase tracking-[1px]">
                        <div>Icon</div>
                        <div>Event Name</div>
                        <div>Date</div>
                        <div>Location</div>
                        <div>Status</div>
                        <div className="text-right">Action</div>
                    </div>

                    {/* Table Body */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-28">
                            <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-6" />
                            <p className="text-slate-400 tracking-widest text-sm">Loading events...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-24 text-slate-400">No events found matching your criteria</div>
                    ) : (
                        events.map((event, index) => (
                            <div
                                key={event._id}
                                className={`event-row grid grid-cols-[auto_2.5fr_1.2fr_1.4fr_1fr_auto] gap-6 items-center px-8 py-6 border-b border-white/10 stagger-row ${index % 2 === 0 ? 'bg-white/5' : ''}`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Icon */}
                                <div className="avatar-icon w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-inner">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2" />
                                    </svg>
                                </div>

                                {/* Name */}
                                <div>
                                    <div className="text-white font-medium text-[17px] tracking-tight">{event.name}</div>
                                    <div className="text-slate-500 text-sm mt-0.5">
                                        Created {new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="text-slate-300 font-light">
                                    {event.date ? formatDate(event.date) : "—"}
                                </div>

                                {/* Location */}
                                <div className="text-slate-300 text-[15px] truncate pr-4">
                                    {event.location || "—"}
                                </div>

                                {/* Status */}
                                <div>
                                    {event.isDeleted ? (
                                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-500/10 border border-red-500/30 rounded-2xl">
                                            <div className="w-2 h-2 bg-red-400 rounded-full" />
                                            <span className="text-red-400 text-sm font-medium">Blocked</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full pulse-dot" />
                                            <span className="text-emerald-400 text-sm font-medium">Active</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Button */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleToggle(event)}
                                        disabled={actionId === event._id}
                                        className={`px-7 py-3.5 text-sm font-semibold rounded-2xl border transition-all duration-300 disabled:opacity-50
                                            ${event.isDeleted 
                                                ? "border-emerald-400/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400" 
                                                : "border-red-400/50 text-red-400 hover:bg-red-500/10 hover:border-red-400"
                                            }`}
                                    >
                                        {actionId === event._id ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                Updating
                                            </span>
                                        ) : event.isDeleted ? "✅ Unblock" : "⛔ Block"}
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