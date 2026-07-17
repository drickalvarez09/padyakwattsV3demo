"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Please enter your password to confirm deletion.");
      return;
    }
    if (
      !confirm(
        "FINAL WARNING: This will permanently delete your account. Are you absolutely sure?"
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to delete account.");
        return;
      }
      router.push("/goodbye");
    } catch {
      setError("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="text-gray-800 min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)" }}
    >
      <div
        className="w-full max-w-md p-8 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #ffffff, #fef2f2)",
          border: "1px solid #fecaca",
          boxShadow: "0 20px 40px rgba(239, 68, 68, 0.1)",
        }}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-3xl text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-700 mb-2">Delete Account</h1>
          <p className="text-gray-600">This action cannot be undone</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start">
            <i className="fas fa-exclamation-circle text-red-500 mr-3 mt-1" />
            <div>
              <p className="font-semibold text-red-700 mb-1">Warning!</p>
              <p className="text-sm text-red-600">
                Deleting your account will permanently remove all your data including:
              </p>
              <ul className="text-sm text-red-600 mt-2 ml-4 list-disc">
                <li>Your profile information</li>
                <li>All energy generation records</li>
                <li>Your earned points</li>
                <li>Session history</li>
                <li>Submitted reports</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">
              <i className="fas fa-lock mr-2 text-red-600" />
              Enter your password to confirm
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                placeholder="Your current password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              disabled={loading}
            >
              <i className="fas fa-trash-alt mr-2" />
              {loading ? "Deleting..." : "Permanently Delete My Account"}
            </button>

            <Link
              href="/dashboard?tab=profile"
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <i className="fas fa-times mr-2" />
              Cancel and Go Back
            </Link>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            <i className="fas fa-info-circle mr-1" />
            If you&apos;re having issues, consider contacting support instead
          </p>
        </div>
      </div>
    </main>
  );
}
