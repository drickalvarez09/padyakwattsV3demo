"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoodbyePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/"), 10000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main
      className="text-gray-800 min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%)" }}
    >
      <div
        className="w-full max-w-md p-8 rounded-2xl text-center"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          boxShadow: "0 20px 40px rgba(16, 185, 129, 0.1)",
        }}
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
          <i className="fas fa-leaf text-4xl text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-green-700 mb-4">Account Successfully Deleted</h1>

        <div className="space-y-4 mb-8">
          <p className="text-gray-600">
            Your account and all associated data have been permanently deleted from our systems.
          </p>

          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-700 mb-2">
              <i className="fas fa-check-circle mr-2" />
              We&apos;ve removed:
            </p>
            <ul className="text-xs text-green-600 text-left ml-6 space-y-1">
              <li>• Your personal information</li>
              <li>• Energy generation records</li>
              <li>• Session history</li>
              <li>• Earned points and rewards</li>
            </ul>
          </div>

          <p className="text-sm text-gray-500">
            Thank you for being part of the PADYAKWATTS community. We hope to see you again in
            the future!
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <i className="fas fa-home mr-2" />
            Return to Homepage
          </Link>

          <p className="text-xs text-gray-500 mt-4">
            If you change your mind, you can always create a new account
          </p>

          <Link href="/signup" className="inline-block text-sm text-green-600 hover:text-green-800 font-medium">
            <i className="fas fa-user-plus mr-1" />
            Create New Account
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            <i className="fas fa-heart mr-1 text-red-400" />
            Wishing you green energy and happy pedaling!
          </p>
        </div>
      </div>
    </main>
  );
}
