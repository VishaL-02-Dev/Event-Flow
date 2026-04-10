import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Navbar */}
      <nav className="relative border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-md shadow-violet-600/30">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">EventQR</span>
          </div>

          {token ? (
            <button
              onClick={handleLogout}
              className="text-sm text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-600 px-4 py-1.5 rounded-lg transition-all"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg transition-all">
                Get started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
            QR-powered event check-ins
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
            Manage events,<br />
            <span className="text-violet-400">effortlessly.</span>
          </h1>

          <p className="text-neutral-500 text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Create events, invite guests with a QR code, and check them in seamlessly — all from one place.
          </p>

          {token ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"          // ← Changed from /dashboard (was already correct)
                className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-violet-600/30 hover:shadow-violet-500/40"
              >
                Go to Dashboard →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-violet-600/30"
              >
                Get started free
              </Link>
              <Link
                to="/login"
                className="text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-600 px-6 py-3 rounded-xl text-sm transition-all"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20">
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              ),
              title: "Create events",
              desc: "Set up events in seconds and get a shareable invite QR instantly.",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              ),
              title: "QR invitations",
              desc: "Guests scan the invite QR, fill a form and get their unique entry pass.",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Smooth check-ins",
              desc: "Scan entry QR at the gate. Guest info shows up instantly.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-left hover:border-neutral-700 transition-all"
            >
              <div className="w-10 h-10 bg-violet-600/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 mb-4">
                {f.icon}
              </div>
              <h3 className="text-white font-medium text-sm mb-1.5">{f.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}