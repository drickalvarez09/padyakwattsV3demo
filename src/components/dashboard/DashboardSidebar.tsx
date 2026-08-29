"use client";

import Link from "next/link";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

const TABS = [
  { key: "energy", label: "My Energy Stats", icon: "fa-bolt" },
  { key: "report", label: "Report a Problem", icon: "fa-exclamation-triangle" },
  { key: "profile", label: "Profile Settings", icon: "fa-user" },
];

export default function DashboardSidebar({
  activeTab,
  userName,
  userPoints,
  todayEnergy,
}: {
  activeTab: string;
  userName: string;
  userPoints: number;
  todayEnergy: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="md:hidden flex justify-between items-center p-4 bg-green-600 text-white shadow-lg">
        <button className="text-white focus:outline-none" onClick={() => setOpen((v) => !v)}>
          <i className={`fas ${open ? "fa-times" : "fa-bars"} text-2xl`} />
        </button>
        <h1 className="text-xl font-bold">PADYAKWATTS</h1>
        <div className="w-8" />
      </header>

      {/* Tap-outside-to-close backdrop, mobile only */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`sidebar text-white w-72 max-w-[85vw] min-h-screen fixed md:static top-0 left-0 transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center space-x-3 px-6 py-6 border-b border-green-500/30">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <i className="fas fa-bolt text-xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">PADYAKWATTS</h1>
            <p className="text-xs text-white/70">Dashboard</p>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-green-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-user text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate">{userName}</p>
              <p className="text-xs text-white/70">{userPoints.toLocaleString()} Points</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col space-y-2 px-4 py-6">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={`/dashboard?tab=${tab.key}`}
              onClick={() => setOpen(false)}
              className={`tab-btn flex items-center space-x-3 px-4 py-3 rounded-lg ${
                activeTab === tab.key ? "active" : ""
              }`}
            >
              <i className={`fas ${tab.icon} w-5 text-center`} />
              <span>{tab.label}</span>
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-green-500/30">
            <LogoutButton className="tab-btn flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-white w-full text-left" />
          </div>
        </nav>

        <div className="mt-auto px-6 py-4 border-t border-green-500/30">
          <div className="text-center">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-white/70">Today&apos;s Energy</span>
              <span className="font-semibold">{todayEnergy.toFixed(1)} Wh</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/40 rounded-full"
                style={{ width: `${Math.min(100, (todayEnergy / 5) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-white/60 mt-3">
              <i className="fas fa-leaf mr-1" />
              {Math.round(todayEnergy * 37.5)}g CO₂ saved today
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
