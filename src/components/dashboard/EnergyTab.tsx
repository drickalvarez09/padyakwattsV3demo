"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface SessionRow {
  id: string;
  start_time: string;
  duration_minutes: number;
  energy_generated: number;
  points_earned: number;
  station_name: string;
  station_location: string;
}

export default function EnergyTab({
  todayEnergy,
  totalEnergy,
  pointsEarned,
  weeklyEnergy,
  recentSessions,
}: {
  todayEnergy: number;
  totalEnergy: number;
  pointsEarned: number;
  weeklyEnergy: Record<string, number>;
  recentSessions: SessionRow[];
}) {
  const co2Saved = todayEnergy * 37.5;
  const totalCo2Saved = totalEnergy * 37.5;
  const phoneCharges = todayEnergy / 10;

  const chartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Energy Generated (Wh)",
        data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => weeklyEnergy[d] ?? 0),
        fill: true,
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold gradient-text">My Energy Stats</h2>
          <p className="text-gray-600">Track your energy generation and environmental impact</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="energy-badge">
            <i className="fas fa-bolt" />
            <span>{todayEnergy.toFixed(1)}</span> Wh Today
          </span>
        </div>
      </div>

      <div className="stats-card p-6">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Total Energy Generated</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center">
                <i className="fas fa-bolt text-white text-3xl" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full border-4 border-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">↑</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-3xl font-bold text-gray-800">
                {totalEnergy.toFixed(1)} <span className="text-lg text-gray-600">Wh</span>
              </p>
              <p className="text-gray-600 mt-1">Lifetime generation</p>
              <div className="flex items-center justify-center sm:justify-start flex-wrap mt-2 text-green-600">
                <i className="fas fa-arrow-up mr-1" />
                <span className="font-semibold">{pointsEarned.toLocaleString()} points</span>
                <span className="text-gray-500 ml-2">earned</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-700 mb-3">Today&apos;s Impact</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-mobile-alt text-green-600 mr-3" />
                  <span>Phone Charges</span>
                </div>
                <span className="font-semibold">{phoneCharges.toFixed(1)}x</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-leaf text-green-600 mr-3" />
                  <span>CO₂ Saved</span>
                </div>
                <span className="font-semibold">{co2Saved.toFixed(0)}g</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-clock text-blue-600 mr-3" />
                  <span>Grid Savings</span>
                </div>
                <span className="font-semibold">{(todayEnergy * 2).toFixed(0)} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-card p-6">
        <h3 className="text-xl font-semibold text-green-800 mb-6">Environmental Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-teal-50 border border-green-100">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <i className="fas fa-seedling text-2xl text-green-600" />
            </div>
            <p className="font-semibold text-green-700 mb-2">Total CO₂ Reduced</p>
            <p className="text-3xl font-bold text-gray-800">{totalCo2Saved.toFixed(0)}g</p>
            <p className="text-gray-600 text-sm mt-2">
              Equivalent to {(totalCo2Saved / 21000).toFixed(1)} trees
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <i className="fas fa-clock text-2xl text-blue-600" />
            </div>
            <p className="font-semibold text-blue-700 mb-2">Grid Electricity Saved</p>
            <p className="text-3xl font-bold text-gray-800">{(totalEnergy * 2).toFixed(0)} min</p>
            <p className="text-gray-600 text-sm mt-2">Of conventional electricity use</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
              <i className="fas fa-trophy text-2xl text-yellow-600" />
            </div>
            <p className="font-semibold text-yellow-700 mb-2">Points Generated</p>
            <p className="text-3xl font-bold text-gray-800">{pointsEarned.toLocaleString()}</p>
            <p className="text-gray-600 text-sm mt-2">Redeemable for rewards</p>
          </div>
        </div>
      </div>

      <div className="stats-card p-6">
        <h3 className="text-xl font-semibold text-green-800 mb-6">Weekly Energy Generation</h3>
        <div className="h-96">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                  labels: {
                    color: "#166534",
                    font: { family: "Poppins, sans-serif", size: 14, weight: "bold" as const },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: "rgba(209, 250, 229, 0.3)" },
                  ticks: { color: "#166534" },
                },
                x: {
                  grid: { color: "rgba(209, 250, 229, 0.3)" },
                  ticks: { color: "#166534" },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="stats-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-green-800">Recent Sessions</h3>
        </div>

        {recentSessions.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-green-500 to-teal-500">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Station</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Energy Generated</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-green-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(session.start_time).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(session.start_time).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="status-indicator status-active" />
                        <span className="text-sm text-gray-900">{session.station_name}</span>
                      </div>
                      <div className="text-xs text-gray-500">{session.station_location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {session.duration_minutes} minutes
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">
                      {session.energy_generated.toFixed(1)} Wh
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        {session.points_earned} points
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <i className="fas fa-bicycle text-4xl text-gray-300 mb-4" />
            <p className="text-gray-600">No sessions recorded yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Start pedaling at a station to see your sessions here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
