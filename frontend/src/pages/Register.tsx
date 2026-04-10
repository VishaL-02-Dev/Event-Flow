import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const res = await API.post("/users/register", form);
      alert(res.data.message || "Account created successfully!");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-zinc-50 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#a1a1aa_0.8px,transparent_1px)] bg-[size:30px_30px] opacity-40" />

      {/* Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-fuchsia-400/10 rounded-full blur-[130px]" />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-2xl mb-6">
            <span className="text-white text-4xl font-bold tracking-tighter">EF</span>
          </div>
          <h1 className="text-4xl font-semibold text-zinc-900 tracking-tight">Join EventFlow</h1>
          <p className="text-zinc-600 mt-2">Create your account and start hosting amazing events</p>
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

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="Alex Rivera"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-white border border-zinc-300 focus:border-violet-500 rounded-2xl px-5 py-4 text-zinc-900 placeholder-zinc-400 transition-all"
              />
            </div>

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
                className="w-full bg-white border border-zinc-300 focus:border-violet-500 rounded-2xl px-5 py-4 text-zinc-900 placeholder-zinc-400 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-white border border-zinc-300 focus:border-violet-500 rounded-2xl px-5 py-4 text-zinc-900 placeholder-zinc-400 transition-all"
              />
              <p className="text-xs text-zinc-500 mt-1.5">Minimum 8 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold py-4 rounded-2xl text-lg shadow-xl shadow-violet-500/30 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating your account...
                </>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-zinc-600 mt-8 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-600 hover:text-violet-700 font-medium transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}