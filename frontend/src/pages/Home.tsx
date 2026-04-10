import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-50 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-70" />
      
      {/* Interactive Mouse Glow */}
      <div
        className="absolute w-[800px] h-[800px] bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 rounded-full blur-[130px] pointer-events-none transition-all duration-700 ease-out z-0"
        style={{
          left: `${mousePosition.x - 400}px`,
          top: `${mousePosition.y - 400}px`,
        }}
      />

      {/* Navbar */}
      <nav className="relative z-50 border-b border-zinc-100 bg-white/90 backdrop-blur-2xl sticky top-0">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
              <span className="text-white text-3xl font-bold tracking-[-2px]">EF</span>
            </div>
            <div>
              <span className="text-3xl font-semibold tracking-tighter text-zinc-900">EventFlow</span>
            </div>
          </div>

          {token ? (
            <button
              onClick={handleLogout}
              className="px-7 py-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-300 rounded-2xl hover:border-zinc-400 transition-all"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-5">
              <Link
                to="/login"
                className="px-7 py-3 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-all"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 bg-zinc-900 hover:bg-black text-white font-semibold rounded-2xl transition-all shadow-lg"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-6xl mx-auto px-8 pt-32 pb-28 text-center">
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white border border-zinc-200 rounded-full mb-10 shadow shadow-zinc-100">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-emerald-600 text-sm font-semibold tracking-widest">EXPERIENCE THE FUTURE OF EVENTS</span>
          </div>

          <h1 className="text-7xl sm:text-[5.2rem] font-bold text-zinc-950 tracking-[-3px] leading-none mb-8">
            Events reimagined.<br />
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
              Flow perfected.
            </span>
          </h1>

          <p className="text-2xl text-zinc-600 max-w-3xl mx-auto leading-tight mb-14">
            Create breathtaking events, generate magical QR experiences, 
            and deliver seamless guest journeys that feel effortless.
          </p>

          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            {token ? (
              <Link
                to="/dashboard"
                className="group relative px-12 py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-xl rounded-3xl overflow-hidden shadow-2xl hover:shadow-violet-500/50 transition-all hover:scale-105 active:scale-95"
              >
                Enter Dashboard
                <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group relative px-12 py-5 bg-zinc-900 hover:bg-black text-white font-semibold text-xl rounded-3xl shadow-2xl transition-all hover:scale-105 active:scale-95"
                >
                  Start Creating Events
                </Link>
                <Link
                  to="/login"
                  className="px-12 py-5 border-2 border-zinc-300 text-zinc-700 font-semibold text-xl rounded-3xl hover:bg-zinc-100 hover:border-zinc-400 transition-all"
                >
                  I already have an account
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Floating 3D-like QR Preview */}
        <div className="absolute right-12 top-40 hidden 2xl:block">
          <div className="relative w-80 h-80 bg-white p-8 rounded-[2.75rem] shadow-2xl border border-zinc-100">
            <div className="bg-white rounded-3xl p-6 shadow-inner">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=https://eventflow.in/guest/demo12345"
                alt="EventFlow QR"
                className="w-full h-full drop-shadow-md"
              />
            </div>
            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-bold px-6 py-2 rounded-2xl shadow-xl flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE DEMO
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-8 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-semibold text-zinc-900 mb-4">Designed to impress</h2>
          <p className="text-zinc-600 text-xl">Powerful tools wrapped in elegance</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Instant QR Magic",
              desc: "Generate beautiful, branded QR codes instantly for every guest and event.",
              icon: "✨",
              color: "from-violet-500 to-purple-600"
            },
            {
              title: "Lightning Check-ins",
              desc: "Scan QR at entry and get instant guest details with real-time sync.",
              icon: "⚡",
              color: "from-fuchsia-500 to-pink-600"
            },
            {
              title: "Smart Guest Flow",
              desc: "Manage RSVPs, groups, preferences and analytics in one beautiful dashboard.",
              icon: "🌊",
              color: "from-pink-500 to-rose-600"
            }
          ].map((f, i) => (
            <div
              key={i}
              className="group bg-white border border-zinc-100 rounded-3xl p-10 hover:border-violet-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
            >
              <div className={`inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br ${f.color} items-center justify-center text-5xl mb-8 shadow-inner transition-transform group-hover:scale-110`}>
                {f.icon}
              </div>
              <h3 className="text-3xl font-semibold text-zinc-900 mb-5 group-hover:text-violet-700 transition-colors">
                {f.title}
              </h3>
              <p className="text-zinc-600 text-[17px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-b from-transparent via-white to-white py-28 border-t border-zinc-100">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-6xl font-bold text-zinc-950 tracking-tight mb-6">
            The future of events<br />starts here
          </h2>
          <p className="text-2xl text-zinc-600 mb-12">Join the movement of effortless event management.</p>

          <Link
            to={token ? "/admin/dashboard" : "/register"}
            className="inline-flex items-center gap-4 px-16 py-7 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-2xl font-semibold rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-violet-500/40"
          >
            {token ? "Enter My EventFlow" : "Create Your First Event"}
            <span className="text-3xl">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}