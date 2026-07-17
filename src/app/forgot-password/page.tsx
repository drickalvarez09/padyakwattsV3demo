"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "An error occurred. Please try again later.");
        return;
      }
      setSuccess(data.success);
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
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-bolt text-white text-2xl" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">PADYAKWATTS</h1>
        <p className="text-gray-600">Reset Your Password</p>
      </div>

      <div className="login-container card w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password?</h2>
        <p className="text-gray-600 text-center mb-8">
          Enter your email address and we&apos;ll send you instructions to reset your password.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
            <div className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-3" />
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
              <i className="fas fa-envelope mr-2 text-green-600" />
              Email Address
            </label>
            <input
              className="enhanced-input"
              id="email"
              placeholder="you@example.com"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="enhanced-submit" disabled={loading}>
            <i className="fas fa-paper-plane mr-2" />
            {loading ? "Sending..." : "Send Reset Instructions"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <Link href="/login" className="text-green-600 hover:text-green-800 font-semibold transition-colors">
            <i className="fas fa-arrow-left mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
