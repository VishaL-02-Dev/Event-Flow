import { useEffect, useState } from "react";
import ADMIN_API from "../services/adminApi";

interface DashboardData {
  totalUsers: number;
  totalEvents: number;
  users: { activeUsers: number; deletedUsers: number };
  events: { activeEvents: number; deletedEvents: number };
  growth: { newUsers: number; newEvents: number };
}

function useCountUp(target: number, duration = 1800, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setVal(Math.floor(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);
  return val;
}

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

  .dash-root {
    font-family: 'Inter', system-ui, sans-serif;
    background: linear-gradient(135deg, #0f172a 0%, #1e2937 100%);
    min-height: 100vh;
    color: #e2e8f0;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    border-radius: 24px;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .glass-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 35px 70px -15px rgba(139, 92, 246, 0.25);
    border-color: rgba(139, 92, 246, 0.25);
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes barGrow {
    from { width: 0%; }
    to { width: var(--bar-w); }
  }

  @keyframes ringPulse {
    0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.5); }
    70% { box-shadow: 0 0 0 14px rgba(139, 92, 246, 0); }
    100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
  }

  .stat-number {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 3.4rem;
    font-weight: 700;
    background: linear-gradient(90deg, #a5b4fc, #c084fc, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
    letter-spacing: -2.5px;
  }

  .dash-label {
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #94a3b8;
  }

  .growth-pill {
    background: linear-gradient(90deg, #4ade80, #22d3ee);
    color: #0f172a;
    font-weight: 700;
    font-size: 13px;
    padding: 6px 16px;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 20px rgba(74, 222, 128, 0.3);
  }

  .dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    position: relative;
  }
  .dot-green  { background: #4ade80; box-shadow: 0 0 0 5px rgba(74, 222, 128, 0.3); animation: ringPulse 2.8s infinite; }
  .dot-red    { background: #f87171; }
  .dot-purple { background: #c084fc; box-shadow: 0 0 0 5px rgba(192, 132, 252, 0.25); }

  .bar-track {
    height: 6px;
    background: rgba(255,255,255,0.08);
    border-radius: 999px;
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    border-radius: 999px;
    animation: barGrow 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .section-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #94a3b8;
    margin-bottom: 1.5rem;
  }
`;

function StatCard({ label, value, sub, subLabel, delay = 0, accent = "#6366f1", total }: {
  label: string; value: number; sub?: number; subLabel?: string;
  delay?: number; accent?: string; total?: number;
}) {
  const counted = useCountUp(value, 1800, delay);
  const pct = total ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div className="glass-card" style={{ padding: "2.25rem", animation: `fadeUp 0.8s ease both`, animationDelay: `${delay}ms` }}>
      <div className="dash-label">{label}</div>
      
      <div className="stat-number" style={{ margin: "18px 0 20px" }}>
        {counted.toLocaleString()}
      </div>

      {total !== undefined && (
        <div className="bar-track">
          <div 
            className="bar-fill" 
            style={{ 
              "--bar-w": `${pct}%`, 
              background: `linear-gradient(90deg, ${accent}, #e0e7ff)` 
            } as React.CSSProperties}
          />
        </div>
      )}

      {sub !== undefined && sub > 0 && (
        <div style={{ marginTop: "20px" }}>
          <span className="growth-pill">
            ↑ +{sub}
            <span style={{ opacity: 0.9, fontSize: "12.5px" }}>{subLabel}</span>
          </span>
        </div>
      )}
    </div>
  );
}

function BreakdownRow({ label, value, color, barColor, max, delay = 0 }: {
  label: string; value: number; color: string; barColor: string; max: number; delay?: number;
}) {
  const counted = useCountUp(value, 1400, delay + 200);
  const pct = max ? (value / max) * 100 : 0;

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "18px 0",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      animation: `fadeUp 0.7s ease both`,
      animationDelay: `${delay}ms`
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className={`dot ${color}`} />
        <span style={{ fontSize: "15.5px", color: "#cbd5e1", fontWeight: 500 }}>{label}</span>
      </div>

      <div style={{ textAlign: "right", minWidth: "120px" }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.45rem", fontWeight: 600, color: "#f1f5f9" }}>
          {counted.toLocaleString()}
        </div>
        <div className="bar-track" style={{ marginTop: "8px" }}>
          <div 
            className="bar-fill" 
            style={{ 
              "--bar-w": `${pct}%`, 
              background: barColor 
            } as React.CSSProperties}
          />
        </div>
      </div>
    </div>
  );
}

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

  if (loading) {
    return (
      <div className="dash-root flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-6" />
          <p className="text-slate-400 text-sm tracking-widest">LOADING INSIGHTS...</p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="dash-root p-10 text-center">No dashboard data available</div>;

  return (
    <div className="dash-root py-10 px-8">
      <style>{style}</style>

      <div className="max-w-[1180px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-4 h-9 bg-gradient-to-b from-violet-400 via-fuchsia-400 to-pink-400 rounded" />
              <h1 className="text-4xl font-bold tracking-tighter text-white font-space">Dashboard</h1>
            </div>
            <p className="text-slate-400 text-[17px]">
              Platform overview • Real-time metrics
            </p>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 text-emerald-400 text-sm justify-end">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
              LIVE • UPDATED JUST NOW
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            label="TOTAL USERS" 
            value={data.totalUsers} 
            sub={data.growth.newUsers} 
            subLabel="this week" 
            delay={50}
            accent="#818cf8"
            total={data.totalUsers}
          />
          <StatCard 
            label="TOTAL EVENTS" 
            value={data.totalEvents} 
            sub={data.growth.newEvents} 
            subLabel="this week" 
            delay={180}
            accent="#34d399"
            total={data.totalEvents}
          />
          <StatCard 
            label="ACTIVE USERS" 
            value={data.users.activeUsers} 
            delay={310}
            accent="#4ade80"
            total={data.totalUsers}
          />
          <StatCard 
            label="ACTIVE EVENTS" 
            value={data.events.activeEvents} 
            delay={440}
            accent="#4ade80"
            total={data.totalEvents}
          />
        </div>

        {/* Breakdown Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users Breakdown */}
          <div className="glass-card p-8">
            <p className="section-title">USER BREAKDOWN</p>
            <BreakdownRow label="Active Users" value={data.users.activeUsers} color="dot-green" barColor="#4ade80" max={data.totalUsers} delay={200} />
            <BreakdownRow label="Blocked Users" value={data.users.deletedUsers} color="dot-red" barColor="#f87171" max={data.totalUsers} delay={320} />
            <BreakdownRow label="New This Week" value={data.growth.newUsers} color="dot-purple" barColor="#c084fc" max={data.totalUsers} delay={440} />

            <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center">
              <span className="text-slate-400 text-sm">Overall Active Rate</span>
              <span className="text-3xl font-semibold text-white font-space tracking-tight">
                {data.totalUsers ? ((data.users.activeUsers / data.totalUsers) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>

          {/* Events Breakdown */}
          <div className="glass-card p-8">
            <p className="section-title">EVENT BREAKDOWN</p>
            <BreakdownRow label="Active Events" value={data.events.activeEvents} color="dot-green" barColor="#34d399" max={data.totalEvents} delay={260} />
            <BreakdownRow label="Blocked Events" value={data.events.deletedEvents} color="dot-red" barColor="#f87171" max={data.totalEvents} delay={380} />
            <BreakdownRow label="New This Week" value={data.growth.newEvents} color="dot-purple" barColor="#c084fc" max={data.totalEvents} delay={500} />

            <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center">
              <span className="text-slate-400 text-sm">Overall Active Rate</span>
              <span className="text-3xl font-semibold text-white font-space tracking-tight">
                {data.totalEvents ? ((data.events.activeEvents / data.totalEvents) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}