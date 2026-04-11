import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

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

    const toastId = toast.loading("Signing you in...");

    try {
      const res = await API.post("/users/login", form);

      localStorage.setItem("token", res.data.token);

      toast.success("Login successful!", { id: toastId });

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (err: any) {
      const message =
        err.response?.data?.message || "Invalid email or password";

      setError(message);

      toast.error(message, { id: toastId });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-zinc-50 flex items-center justify-center px-4 overflow-hidden relative">
      
      <div className="absolute inset-0 bg-[radial-gradient(#a1a1aa_0.8px,transparent_1px)] bg-[size:30px_30px] opacity-40" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-400/10 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-md">
        
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-xl mb-6">
            <span className="text-white text-4xl font-bold tracking-tighter">EF</span>
          </div>
          <h1 className="text-4xl font-semibold text-zinc-900 tracking-tight">Welcome back</h1>
          <p className="text-zinc-600 mt-2">Sign in to continue to EventFlow</p>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-2xl rounded-3xl p-10">
          <form onSubmit={handleSubmit} className="space-y-6">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl text-sm flex items-start gap-3">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Email address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-white border border-zinc-300 focus:border-violet-500 rounded-2xl px-5 py-4 text-zinc-900 placeholder-zinc-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-white border border-zinc-300 focus:border-violet-500 rounded-2xl px-5 py-4 text-zinc-900 placeholder-zinc-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {loading ? "Signing you in..." : "Sign In"}
            </button>

          </form>

          <p className="text-center text-zinc-600 mt-8 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}