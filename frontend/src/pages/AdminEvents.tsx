import { useEffect, useState } from "react";
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
            const res = await ADMIN_API.get(
                `/events?page=${p}&search=${search}&date=${date}`
            );

            setEvents(res.data.events);
            setTotalPages(res.data.totalPages || 1);
            setTotalEvents(res.data.totalEvents || 0);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEvents(page); }, [page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchEvents(1);
    };

    const handleToggle = async (event: Event) => {
        setActionId(event._id);
        try {
            if (event.isDeleted) {
                await ADMIN_API.patch(`/events/unblock/${event._id}`);
            } else {
                await ADMIN_API.patch(`/events/block/${event._id}`);
            }
            fetchEvents(page);
        } catch (e) {
            console.error(e);
        } finally {
            setActionId(null);
        }
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

    return (
        <div className="px-8 py-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-white">Events</h1>
                <p className="text-neutral-500 text-sm mt-1">{totalEvents} events found</p>
            </div>

            {/* Filters */}
            <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-6">
                <input
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name..."
                    className="flex-1 min-w-48 bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
                <input
                    type="date" value={date} onChange={(e) => setDate(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
                <button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                >Search</button>
                {(search || date) && (
                    <button
                        type="button"
                        onClick={() => { setSearch(""); setDate(""); setPage(1); setTimeout(() => fetchEvents(1), 0); }}
                        className="text-neutral-500 hover:text-white border border-neutral-700 px-4 py-2.5 rounded-xl text-sm transition-all"
                    >Clear</button>
                )}
            </form>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-neutral-800 bg-neutral-950/60">
                    {["Name", "Event Date", "Location", "Status", "Action"].map((h) => (
                        <span key={h} className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{h}</span>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <svg className="w-5 h-5 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-16 text-neutral-600 text-sm">No events found</div>
                ) : (
                    events.map((event, i) => (
                        <div
                            key={event._id}
                            className={`grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-4 border-b border-neutral-800/60 last:border-0 hover:bg-neutral-800/30 transition-colors ${i % 2 === 0 ? "" : "bg-neutral-900/40"}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-violet-600/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                </div>
                                <span className="text-white text-sm font-medium truncate">{event.name}</span>
                            </div>
                            <span className="text-neutral-400 text-sm">{event.date ? formatDate(event.date) : "—"}</span>
                            <span className="text-neutral-400 text-sm truncate">{event.location || "—"}</span>
                            <span>
                                {event.isDeleted ? (
                                    <span className="text-xs font-medium text-red-400 bg-red-400/10 border border-red-400/20 px-2.5 py-1 rounded-full">Blocked</span>
                                ) : (
                                    <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">Active</span>
                                )}
                            </span>
                            <button
                                onClick={() => handleToggle(event)}
                                disabled={actionId === event._id}
                                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${event.isDeleted
                                    ? "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                                    : "text-red-400 border-red-500/30 hover:bg-red-500/10"
                                    }`}
                            >
                                {actionId === event._id ? "..." : event.isDeleted ? "Unblock" : "Block"}
                            </button>
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-5">
                    <span className="text-neutral-600 text-sm">Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                            className="px-3 py-1.5 text-sm text-neutral-400 border border-neutral-700 rounded-lg hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">← Prev</button>
                        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                            className="px-3 py-1.5 text-sm text-neutral-400 border border-neutral-700 rounded-lg hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">Next →</button>
                    </div>
                </div>
            )}
        </div>
    );
}