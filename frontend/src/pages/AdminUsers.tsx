import { useEffect, useState } from "react";
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

    const fetchUsers = async (p = 1) => {
        setLoading(true);
        try {
            const res = await ADMIN_API.get(`/users?page=${p}`);
            setUsers(res.data.user);
            setTotalPages(res.data.totalPages || 1);
            setUsers(res.data.user);
            setTotalPages(res.data.totalPages || 1);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(page); }, [page]);

    const handleToggle = async (user: User) => {
        setActionId(user._id);
        try {
            if (user.isDeleted) {
                await ADMIN_API.patch(`/users/unblock/${user._id}`);
            } else {
                await ADMIN_API.patch(`/users/block/${user._id}`);
            }
            fetchUsers(page);
        } catch (e) {
            console.error(e);
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className="px-8 py-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-white">Users</h1>
                <p className="text-neutral-500 text-sm mt-1">Manage all registered users</p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_1.5fr_1fr_auto] gap-4 px-5 py-3 border-b border-neutral-800 bg-neutral-950/60">
                    {["Name", "Email", "Status", "Action"].map((h) => (
                        <span key={h} className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{h}</span>
                    ))}
                </div>

                {/* Rows */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <svg className="w-5 h-5 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-16 text-neutral-600 text-sm">No users found</div>
                ) : (
                    users.map((user, i) => (
                        <div
                            key={user._id}
                            className={`grid grid-cols-[1fr_1.5fr_1fr_auto] gap-4 items-center px-5 py-4 border-b border-neutral-800/60 last:border-0 hover:bg-neutral-800/30 transition-colors ${i % 2 === 0 ? "" : "bg-neutral-900/40"}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-violet-600/15 border border-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-semibold flex-shrink-0">
                                    {user.name?.[0]?.toUpperCase()}
                                </div>
                                <span className="text-white text-sm font-medium truncate">{user.name}</span>
                            </div>
                            <span className="text-neutral-400 text-sm truncate">{user.email}</span>
                            <span>
                                {user.isDeleted ? (
                                    <span className="text-xs font-medium text-red-400 bg-red-400/10 border border-red-400/20 px-2.5 py-1 rounded-full">Blocked</span>
                                ) : (
                                    <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">Active</span>
                                )}
                            </span>
                            <button
                                onClick={() => handleToggle(user)}
                                disabled={actionId === user._id}
                                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${user.isDeleted
                                        ? "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                                        : "text-red-400 border-red-500/30 hover:bg-red-500/10"
                                    }`}
                            >
                                {actionId === user._id ? "..." : user.isDeleted ? "Unblock" : "Block"}
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-5">
                    <span className="text-neutral-600 text-sm">Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 text-sm text-neutral-400 border border-neutral-700 rounded-lg hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >← Prev</button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 text-sm text-neutral-400 border border-neutral-700 rounded-lg hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >Next →</button>
                    </div>
                </div>
            )}
        </div>
    );
}