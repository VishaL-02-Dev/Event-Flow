import { useEffect, useState } from "react";
import ADMIN_API from "../services/adminApi";

interface DashboardData {
  totalUsers: number;
  totalEvents: number;
  users: { activeUsers: number; deletedUsers: number };
  events: { activeEvents: number; deletedEvents: number };
  growth: { newUsers: number; newEvents: number };
}

const StatCard = ({
  label, value, sub, subLabel, accent = false,
}: {
  label: string; value: number; sub?: number; subLabel?: string; accent?: boolean;
}) => (
  <div className={`bg-neutral-900 border rounded-2xl p-6 flex flex-col gap-3 ${accent ? "border-violet-500/30" : "border-neutral-800"}`}>
    <p className="text-neutral-500 text-xs font-medium uppercase tracking-wider">{label}</p>
    <p className="text-3xl font-semibold text-white">{value.toLocaleString()}</p>
    {sub !== undefined && (
      <div className="flex items-center gap-1.5">
        <span className="text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full">+{sub}</span>
        <span className="text-neutral-600 text-xs">{subLabel}</span>
      </div>
    )}
  </div>
);

const MiniStat = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-neutral-800 last:border-0">
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-neutral-400 text-sm">{label}</span>
    </div>
    <span className="text-white text-sm font-medium">{value.toLocaleString()}</span>
  </div>
);

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const res = await ADMIN_API.get("/dashboard");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <svg className="w-6 h-6 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
    </div>
  );

  if (!data) return null;

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">Overview of your platform</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={data.totalUsers} sub={data.growth.newUsers} subLabel="this week" accent />
        <StatCard label="Total Events" value={data.totalEvents} sub={data.growth.newEvents} subLabel="this week" accent />
        <StatCard label="Active Users" value={data.users.activeUsers} />
        <StatCard label="Active Events" value={data.events.activeEvents} />
      </div>

      {/* Detail breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <p className="text-neutral-400 text-sm font-medium mb-4">User breakdown</p>
          <MiniStat label="Active users" value={data.users.activeUsers} color="bg-emerald-400" />
          <MiniStat label="Blocked users" value={data.users.deletedUsers} color="bg-red-400" />
          <MiniStat label="New this week" value={data.growth.newUsers} color="bg-violet-400" />
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <p className="text-neutral-400 text-sm font-medium mb-4">Event breakdown</p>
          <MiniStat label="Active events" value={data.events.activeEvents} color="bg-emerald-400" />
          <MiniStat label="Blocked events" value={data.events.deletedEvents} color="bg-red-400" />
          <MiniStat label="New this week" value={data.growth.newEvents} color="bg-violet-400" />
        </div>
      </div>
    </div>
  );
}