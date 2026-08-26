"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Invalid email or password.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="text-gray-800 min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%)" }}
    >
      <div className="text-center mb-8 animate-fadeIn">
        <div className="energy-orb-lg mb-6">
          <i className="fas fa-bolt text-white text-4xl" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2">PADYAKWATTS</h1>
        <p className="text-gray-600">Pedal-Powered Clean Energy</p>
      </div>

      <div className="login-container card w-full max-w-md p-8 animate-slideIn">
        <h2 className="text-2xl font-bold text-center mb-8">Welcome Back</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium transition-colors duration-200"
          >
            <i className="fas fa-arrow-left mr-2" />
            Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
              <i className="fas fa-envelope mr-2 text-green-600" />
              Email Address
            </label>
            <input
              className="enhanced-input"
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">
              <i className="fas fa-lock mr-2 text-green-600" />
              Password
            </label>
            <div className="relative">
              <input
                className="enhanced-input pr-12"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="enhanced-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="checkmark" />
              <span className="text-gray-700 text-sm ml-2">Remember me</span>
            </label>
            <Link href="/forgot-password" className="enhanced-link text-sm">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="enhanced-submit" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2" />
                Signing in...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt mr-2" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-3 bg-green-50 rounded-lg text-center text-sm text-green-700">
          Demo account: <strong>demo@padyakwatts.ph</strong> / <strong>Demo@123</strong>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-600 mb-4">Don&apos;t have an account?</p>
          <Link
            href="/signup"
            className="inline-block w-full py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
          >
            <i className="fas fa-user-plus mr-2" />
            Create Account
          </Link>
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2024 PADYAKWATTS. Powering communities with clean energy.</p>
      </footer>
    </main>
  );
}
