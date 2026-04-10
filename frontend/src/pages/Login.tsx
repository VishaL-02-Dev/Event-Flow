import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/users/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-zinc-50 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Subtle Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#a1a1aa_0.8px,transparent_1px)] bg-[size:30px_30px] opacity-40" />

      {/* Soft Floating Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-xl mb-6">
            <span className="text-white text-4xl font-bold tracking-tighter">EF</span>
          </div>
          <h1 className="text-4xl font-semibold text-zinc-900 tracking-tight">Welcome back</h1>
          <p className="text-zinc-600 mt-2">Sign in to continue to EventFlow</p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-2xl rounded-3xl p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl text-sm flex items-start gap-3">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Email address</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-white border border-zinc-300 focus:border-violet-500 focus:ring-violet-500 rounded-2xl px-5 py-4 text-zinc-900 placeholder-zinc-400 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-white border border-zinc-300 focus:border-violet-500 focus:ring-violet-500 rounded-2xl px-5 py-4 text-zinc-900 placeholder-zinc-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg shadow-violet-500/30 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing you in...
                </>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-zinc-600 mt-8 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-violet-600 hover:text-violet-700 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}