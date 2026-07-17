"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { PublicUser } from "@/types";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `+${digits}`;
  if (digits.length <= 6) return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 9) return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9, 13)}`;
}

export default function ProfileTab({
  user,
  totalSessions,
  memberSince,
}: {
  user: PublicUser;
  totalSessions: number;
  memberSince: string;
}) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(user.email_notifications);
  const [weeklyReports, setWeeklyReports] = useState(user.weekly_reports);
  const [marketingEmails, setMarketingEmails] = useState(user.marketing_emails);
  const [shareData, setShareData] = useState(user.share_data);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const initials =
    (user.first_name[0] ?? "") + (user.last_name[0] ?? "") || user.email[0]?.toUpperCase() || "U";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          address,
          currentPassword,
          newPassword,
          confirmPassword,
          preferences: {
            emailNotifications,
            weeklyReports,
            marketingEmails,
            shareData,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update profile.");
        return;
      }
      setSuccess(data.success ?? "Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.refresh();
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Profile Settings</h2>
          <p className="text-gray-600">Manage your account and personal information</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg animate-fadeIn">
          <p className="text-green-700 font-medium">
            <i className="fas fa-check-circle mr-2" />
            {success}
          </p>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-fadeIn">
          <p className="text-red-700 font-medium">
            <i className="fas fa-exclamation-circle mr-2" />
            {error}
          </p>
        </div>
      )}

      <div className="stats-card p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl font-bold uppercase">{initials}</span>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-gray-600 mb-4">
              <i className="fas fa-calendar-alt mr-2 text-green-600" />
              Energy Contributor since {memberSince}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{totalSessions}</div>
                <div className="text-sm text-gray-600 mt-1">Sessions</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {user.total_energy_generated.toFixed(1)} Wh
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Energy</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-yellow-600">{user.points_earned}</div>
                <div className="text-sm text-gray-600 mt-1">Points</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">—</div>
                <div className="text-sm text-gray-600 mt-1">Rank</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="stats-card p-6 space-y-6">
        <h3 className="text-xl font-semibold text-green-800">
          <i className="fas fa-user-edit mr-2" />
          Edit Profile Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="fas fa-user mr-2 text-green-600" />
              First Name *
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="fas fa-user mr-2 text-green-600" />
              Last Name *
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <i className="fas fa-envelope mr-2 text-green-600" />
            Email Address *
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="fas fa-phone mr-2 text-green-600" />
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="+63 912 345 6789"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="fas fa-map-marker-alt mr-2 text-green-600" />
              Address
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full address"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-shield-alt mr-2 text-green-600" />
            Security Settings
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-lock mr-2 text-green-600" />
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter current password to change password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-key mr-2 text-green-600" />
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="Enter new password (optional)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-key mr-2 text-green-600" />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              <i className="fas fa-info-circle mr-1" />
              Password must be at least 6 characters and include at least one special character
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-sliders-h mr-2 text-green-600" />
            Preferences
          </h4>

          <div className="space-y-4">
            <label className="flex items-center p-3 hover:bg-green-50 rounded-lg transition-colors cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-5 w-5"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
              <span className="ml-3 text-gray-700">Email notifications for new stations</span>
            </label>
            <label className="flex items-center p-3 hover:bg-green-50 rounded-lg transition-colors cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-5 w-5"
                checked={weeklyReports}
                onChange={(e) => setWeeklyReports(e.target.checked)}
              />
              <span className="ml-3 text-gray-700">Weekly energy report emails</span>
            </label>
            <label className="flex items-center p-3 hover:bg-green-50 rounded-lg transition-colors cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-5 w-5"
                checked={marketingEmails}
                onChange={(e) => setMarketingEmails(e.target.checked)}
              />
              <span className="ml-3 text-gray-700">Marketing communications</span>
            </label>
            <label className="flex items-center p-3 hover:bg-green-50 rounded-lg transition-colors cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-5 w-5"
                checked={shareData}
                onChange={(e) => setShareData(e.target.checked)}
              />
              <span className="ml-3 text-gray-700">Share my energy data (anonymously)</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <div className="text-sm text-gray-600">
            <p>
              <i className="fas fa-info-circle mr-1 text-green-600" />
              Fields marked with * are required
            </p>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
            disabled={saving}
          >
            <i className="fas fa-save mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <div className="stats-card p-6 border border-red-200 bg-red-50">
        <h4 className="text-lg font-semibold text-red-700 mb-4">
          <i className="fas fa-exclamation-triangle mr-2" />
          Danger Zone
        </h4>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-800">Delete Account</p>
            <p className="text-sm text-gray-600">
              Permanently delete your account and all data. This action cannot be undone.
            </p>
          </div>
          <Link
            href="/delete-account"
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            <i className="fas fa-trash-alt mr-2" />
            Delete Account
          </Link>
        </div>
      </div>
    </div>
  );
}
