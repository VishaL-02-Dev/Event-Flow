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
            const res = await ADMIN_API.get(
                `/guests?page=${p}&eventId=${eventIdFilter}`
            );

            setGuests(res.data.guests);
            setTotalPages(res.data.totalPages || 1);
            setTotalGuests(res.data.totalGuests || 0);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchGuests(page); }, [page]);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchGuests(1);
    };

    const handleToggle = async (guest: Guest) => {
        setActionId(guest._id);
        try {
            if (guest.isDeleted) {
                await ADMIN_API.patch(`/guests/unblock/${guest._id}`);
            } else {
                await ADMIN_API.patch(`/guests/block/${guest._id}`);
            }
            fetchGuests(page);
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
                <h1 className="text-2xl font-semibold text-white">Guests</h1>
                <p className="text-neutral-500 text-sm mt-1">{totalGuests} guests registered</p>
            </div>

            {/* Filter by event */}
            <form onSubmit={handleFilter} className="flex gap-3 mb-6">
                <input
                    value={eventIdFilter} onChange={(e) => setEventIdFilter(e.target.value)}
                    placeholder="Filter by Event ID..."
                    className="flex-1 bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
                <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
                    Filter
                </button>
                {eventIdFilter && (
                    <button type="button" onClick={() => { setEventIdFilter(""); setPage(1); setTimeout(() => fetchGuests(1), 0); }}
                        className="text-neutral-500 hover:text-white border border-neutral-700 px-4 py-2.5 rounded-xl text-sm transition-all">
                        Clear
                    </button>
                )}
            </form>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[1.2fr_1.2fr_0.6fr_0.8fr_0.8fr_auto] gap-3 px-5 py-3 border-b border-neutral-800 bg-neutral-950/60">
                    {["Name", "Contact", "Group", "Check-in", "Status", "Action"].map((h) => (
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
                ) : guests.length === 0 ? (
                    <div className="text-center py-16 text-neutral-600 text-sm">No guests found</div>
                ) : (
                    guests.map((guest, i) => (
                        <div
                            key={guest._id}
                            className={`grid grid-cols-[1.2fr_1.2fr_0.6fr_0.8fr_0.8fr_auto] gap-3 items-center px-5 py-4 border-b border-neutral-800/60 last:border-0 hover:bg-neutral-800/30 transition-colors ${i % 2 === 0 ? "" : "bg-neutral-900/40"}`}
                        >
                            {/* Name */}
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-teal-600/15 border border-teal-500/20 flex items-center justify-center text-teal-400 text-xs font-semibold flex-shrink-0">
                                    {guest.name?.[0]?.toUpperCase()}
                                </div>
                                <span className="text-white text-sm font-medium truncate">{guest.name}</span>
                            </div>

                            {/* Contact */}
                            <div className="min-w-0">
                                {guest.email && <p className="text-neutral-400 text-xs truncate">{guest.email}</p>}
                                {guest.phone && <p className="text-neutral-600 text-xs truncate">{guest.phone}</p>}
                                {!guest.email && !guest.phone && <span className="text-neutral-700 text-xs">—</span>}
                            </div>

                            {/* Group size */}
                            <div className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-white text-sm font-medium">{guest.groupSize}</span>
                            </div>

                            {/* Check-in */}
                            <div>
                                {guest.checkedIn ? (
                                    <div>
                                        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">Checked in</span>
                                        {guest.checkedInAt && <p className="text-neutral-600 text-xs mt-1">{formatDate(guest.checkedInAt)}</p>}
                                    </div>
                                ) : (
                                    <span className="text-xs font-medium text-neutral-500 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded-full">Pending</span>
                                )}
                            </div>

                            {/* Block status */}
                            <span>
                                {guest.isDeleted ? (
                                    <span className="text-xs font-medium text-red-400 bg-red-400/10 border border-red-400/20 px-2.5 py-1 rounded-full">Blocked</span>
                                ) : (
                                    <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">Active</span>
                                )}
                            </span>

                            {/* Action */}
                            <button
                                onClick={() => handleToggle(guest)}
                                disabled={actionId === guest._id}
                                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${guest.isDeleted
                                    ? "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                                    : "text-red-400 border-red-500/30 hover:bg-red-500/10"
                                    }`}
                            >
                                {actionId === guest._id ? "..." : guest.isDeleted ? "Unblock" : "Block"}
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