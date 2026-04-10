import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ADMIN_API from "../services/adminApi";

interface User {
    _id: string;
    name: string;
    email: string;
    isDeleted: boolean;
    createdAt: string;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);

    const fetchUsers = async (p = 1, showLoader = true) => {
    if (showLoader) setLoading(true);

    try {
        const res = await ADMIN_API.get(`/users?page=${p}`);
        setUsers(res.data.user || []);
        setTotalPages(res.data.totalPages || 1);
    } catch (e) {
        console.error(e);
    } finally {
        if (showLoader) setLoading(false);
    }
};

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

  const handleToggle = async (user: User) => {
    setActionId(user._id);

    const loadingToast = toast.loading(
        user.isDeleted ? "Unblocking user..." : "Blocking user..."
    );

    // ✅ Optimistic update (instant UI change)
    setUsers(prev =>
        prev.map(u =>
            u._id === user._id
                ? { ...u, isDeleted: !u.isDeleted }
                : u
        )
    );

    try {
        if (user.isDeleted) {
            await ADMIN_API.patch(`/users/${user._id}/unblock`);
            toast.success("User unblocked ✅", { id: loadingToast });
        } else {
            await ADMIN_API.patch(`/users/${user._id}/block`);
            toast.success("User blocked ⛔", { id: loadingToast });
        }
    } catch (e) {
        console.error(e);

        // ❌ Rollback if API fails
        setUsers(prev =>
            prev.map(u =>
                u._id === user._id
                    ? { ...u, isDeleted: user.isDeleted }
                    : u
            )
        );

        toast.error("Failed to update ❌", { id: loadingToast });
    } finally {
        setActionId(null);
    }
};

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 py-10 px-6">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

                .glass {
                    background: rgba(255, 255, 255, 0.06);
                    backdrop-filter: blur(24px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.4);
                }

                .row-hover {
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .row-hover:hover {
                    transform: translateX(8px) scale(1.01);
                    background: rgba(255, 255, 255, 0.08) !important;
                    box-shadow: 0 10px 30px -10px rgba(139, 92, 246, 0.3);
                }

                .avatar {
                    transition: all 0.3s ease;
                }
                .row-hover:hover .avatar {
                    transform: scale(1.15) rotate(8deg);
                    box-shadow: 0 0 0 6px rgba(139, 92, 246, 0.25);
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-row {
                    animation: fadeInUp 0.6s backwards;
                }

                .status-dot {
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
            `}</style>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <div className="inline-flex items-center gap-3 mb-3">
                            <div className="w-3 h-8 bg-gradient-to-b from-violet-400 to-fuchsia-500 rounded-full" />
                            <h1 className="text-4xl font-semibold text-white tracking-tight font-space">Users</h1>
                        </div>
                        <p className="text-slate-400 text-lg">Manage all registered users • Real-time control</p>
                    </div>

                    <div className="text-right">
                        <div className="text-sm text-emerald-400 flex items-center gap-2 justify-end">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full status-dot" />
                            LIVE
                        </div>
                        <p className="text-slate-500 text-sm mt-1">Total Users: <span className="text-white font-medium">{users.length}</span></p>
                    </div>
                </div>

                {/* Main Table Container */}
                <div className="glass rounded-3xl overflow-hidden border border-white/10">
                    {/* Table Header */}
                    <div className="grid grid-cols-[auto_2fr_2fr_1fr_1.2fr] gap-6 px-8 py-5 border-b border-white/10 bg-white/5">
                        <div className="text-xs font-medium text-slate-400 uppercase tracking-[1px]">Avatar</div>
                        <div className="text-xs font-medium text-slate-400 uppercase tracking-[1px]">User Details</div>
                        <div className="text-xs font-medium text-slate-400 uppercase tracking-[1px]">Email</div>
                        <div className="text-xs font-medium text-slate-400 uppercase tracking-[1px]">Status</div>
                        <div className="text-xs font-medium text-slate-400 uppercase tracking-[1px] text-right">Action</div>
                    </div>

                    {/* Table Body */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-6" />
                            <p className="text-slate-400 text-sm tracking-wide">Loading users...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">No users found</div>
                    ) : (
                        users.map((user, index) => (
                            <div
                                key={user._id}
                                className={`grid grid-cols-[auto_2fr_2fr_1fr_1.2fr] gap-6 items-center px-8 py-6 border-b border-white/10 row-hover animate-row ${index % 2 === 0 ? 'bg-white/5' : ''}`}
                                style={{ animationDelay: `${index * 40}ms` }}
                            >
                                {/* Avatar */}
                                <div className="avatar w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold text-xl shadow-inner flex-shrink-0">
                                    {user.name?.[0]?.toUpperCase() || '?'}
                                </div>

                                {/* Name + Join Date */}
                                <div>
                                    <div className="text-white font-medium text-[17px] tracking-tight">{user.name}</div>
                                    <div className="text-slate-500 text-sm mt-0.5">
                                        Joined {formatDate(user.createdAt)}
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="text-slate-300 text-[15px] font-light truncate pr-4">
                                    {user.email}
                                </div>

                                {/* Status */}
                                <div>
                                    {user.isDeleted ? (
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/30 rounded-2xl">
                                            <div className="w-2 h-2 bg-red-400 rounded-full" />
                                            <span className="text-red-400 text-sm font-medium">Blocked</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full status-dot" />
                                            <span className="text-emerald-400 text-sm font-medium">Active</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Button */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleToggle(user)}
                                        disabled={actionId === user._id}
                                        className={`px-6 py-3 text-sm font-semibold rounded-2xl border transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                                            ${user.isDeleted 
                                                ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400" 
                                                : "border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-400"
                                            }`}
                                    >
                                        {actionId === user._id ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                Updating...
                                            </span>
                                        ) : user.isDeleted ? "✅ Unblock" : "⛔ Block"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-8 px-4">
                        <div className="text-slate-400 text-sm">
                            Page <span className="text-white font-medium">{page}</span> of {totalPages}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-6 py-3 text-sm font-medium border border-white/10 hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl transition-all hover:bg-white/5 text-slate-300 flex items-center gap-2"
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-6 py-3 text-sm font-medium border border-white/10 hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl transition-all hover:bg-white/5 text-slate-300 flex items-center gap-2"
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