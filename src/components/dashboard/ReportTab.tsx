"use client";

import { FormEvent, useState } from "react";
import type { Report } from "@/types";

const ISSUE_TYPES = [
  { value: "account", label: "Account Issue" },
  { value: "energy", label: "Energy Tracking Problem" },
  { value: "points", label: "Points/Rewards Issue" },
  { value: "technical", label: "Technical Problem" },
  { value: "general", label: "General Inquiry" },
  { value: "other", label: "Other Issues" },
];

const STATUS_STYLES: Record<Report["status"], string> = {
  under_review: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

const STATUS_LABELS: Record<Report["status"], string> = {
  under_review: "Under Review",
  resolved: "Resolved",
  closed: "Closed",
};

export default function ReportTab({
  userName,
  userEmail,
  initialReports,
}: {
  userName: string;
  userEmail: string;
  initialReports: Report[];
}) {
  const [reports, setReports] = useState(initialReports);
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!issueType || !description.trim()) {
      setError("Please select an issue type and add a description.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueType, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to submit report.");
        return;
      }
      setReports((prev) => [data.report, ...prev]);
      setSuccess("Report submitted successfully. We'll get back to you soon.");
      setIssueType("");
      setDescription("");
    } catch {
      setError("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Report a Problem</h2>
          <p className="text-gray-600">Help us maintain PADYAKWATTS by reporting issues</p>
        </div>
      </div>

      <div className="stats-card p-6">
        <h3 className="text-xl font-semibold text-green-800 mb-6">Submit a New Report</h3>

        {error && (
          <div className="message-box error mb-6">
            <p className="text-red-700 font-medium">
              <i className="fas fa-exclamation-circle mr-2" />
              {error}
            </p>
          </div>
        )}
        {success && (
          <div className="message-box success mb-6">
            <p className="text-green-700 font-medium">
              <i className="fas fa-check-circle mr-2" />
              {success}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="issue-type">
              <i className="fas fa-exclamation-triangle mr-2 text-yellow-600" />
              Issue Type
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              id="issue-type"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
            >
              <option value="">Select issue type</option>
              {ISSUE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="description">
              <i className="fas fa-file-alt mr-2 text-blue-600" />
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
              id="description"
              rows={6}
              placeholder="Please describe the issue in detail. Include any relevant information such as when the issue started, what you were doing, and any error messages you saw..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-2">
              Be specific about what&apos;s not working and when it started.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h4 className="font-semibold text-gray-800 mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  value={userName}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  value={userEmail}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              onClick={() => {
                setIssueType("");
                setDescription("");
              }}
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              disabled={submitting}
            >
              <i className="fas fa-paper-plane mr-2" />
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>

      <div className="stats-card p-6">
        <h3 className="text-xl font-semibold text-green-800 mb-6">Your Recent Reports</h3>

        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-gray-800 capitalize">
                        {report.issue_type.replace("_", " ")}
                      </span>
                      <span
                        className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[report.status]}`}
                      >
                        {STATUS_LABELS[report.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Submitted on{" "}
                      {new Date(report.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-clipboard-check text-4xl text-gray-300 mb-4" />
            <p className="text-gray-600">No reports found</p>
          </div>
        )}
      </div>
    </div>
  );
}
