import { NavLink, useNavigate, Outlet } from "react-router-dom";

const navItems = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1v-5m10-10l2 2m-2-2v10a1 1 0 01-1 1v-5m-6 0a1 1 0 001-1v5" />
      </svg>
    ),
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    to: "/admin/events",
    label: "Events",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2" />
      </svg>
    ),
  },
  {
    to: "/admin/guests",
    label: "Guests",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 flex overflow-hidden">
      {/* Sidebar - Premium Glassmorphic */}
      <aside className="w-72 flex-shrink-0 border-r border-white/10 bg-black/70 backdrop-blur-3xl flex flex-col sticky top-0 h-screen shadow-2xl">
        {/* Brand Header */}
        <div className="px-8 py-8 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-xl shadow-violet-500/40">
              <span className="text-white text-2xl font-bold tracking-tighter">EF</span>
            </div>
            <div>
              <p className="text-white text-2xl font-semibold tracking-tighter font-space">EventFlow</p>
              <p className="text-slate-400 text-xs tracking-[2px] mt-0.5">ADMIN PORTAL</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-6 py-4 rounded-2xl text-[15px] font-medium transition-all duration-300 relative overflow-hidden
                ${isActive 
                  ? "bg-white/10 text-white shadow-inner border border-white/20" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-violet-400 to-fuchsia-400 rounded-r-full" />
                  )}

                  <div className={`transition-all duration-300 ${isActive ? "text-violet-400" : "group-hover:text-violet-400"}`}>
                    {item.icon}
                  </div>
                  <span>{item.label}</span>

                  {/* Subtle shine effect on hover */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Admin Info & Logout */}
        <div className="p-6 border-t border-white/10 mt-auto">
          <div className="glass p-5 rounded-3xl mb-4 bg-white/5 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                {admin?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{admin?.name || "Administrator"}</p>
                <p className="text-slate-400 text-xs truncate">{admin?.email || "admin@eventqr.com"}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-white/10 hover:border-red-400/30 transition-all duration-300 group"
          >
            <svg 
              className="w-5 h-5 group-hover:rotate-12 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2.2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative">
        {/* Subtle top gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
        
        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}