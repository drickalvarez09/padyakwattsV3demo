import { redirect } from "next/navigation";
import {
  countSessions,
  getUserById,
  listRecentSessions,
  listReportsForUser,
  weeklyEnergy,
} from "@/lib/db";
import { getSession } from "@/lib/session";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import EnergyTab from "@/components/dashboard/EnergyTab";
import ReportTab from "@/components/dashboard/ReportTab";
import ProfileTab from "@/components/dashboard/ProfileTab";
import type { PublicUser } from "@/types";

const VALID_TABS = ["energy", "report", "profile"] as const;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const user = getUserById(session.userId);
  if (!user) {
    redirect("/login");
  }

  const activeTab = VALID_TABS.includes(searchParams.tab as (typeof VALID_TABS)[number])
    ? (searchParams.tab as (typeof VALID_TABS)[number])
    : "energy";

  const recentSessions = listRecentSessions(user.id, 10);
  const totalSessions = countSessions(user.id);
  const weekly = weeklyEnergy(user.id);
  const reports = listReportsForUser(user.id);

  const today = new Date().toDateString();
  const todayEnergy = recentSessions
    .filter((s) => new Date(s.start_time).toDateString() === today)
    .reduce((sum, s) => sum + s.energy_generated, 0);

  const publicUser: PublicUser = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    user_type: user.user_type,
    points_earned: user.points_earned,
    total_energy_generated: user.total_energy_generated,
    is_active: user.is_active,
    email_notifications: user.email_notifications,
    weekly_reports: user.weekly_reports,
    marketing_emails: user.marketing_emails,
    share_data: user.share_data,
    created_at: user.created_at,
    updated_at: user.updated_at,
    deleted_at: user.deleted_at,
  };

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="text-gray-800" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)" }}>
      <div className="flex flex-col md:flex-row min-h-screen">
        <DashboardSidebar
          activeTab={activeTab}
          userName={`${user.first_name} ${user.last_name}`}
          userPoints={user.points_earned}
          todayEnergy={todayEnergy}
        />

        <main className="flex-1 min-w-0 p-4 md:p-6">
          <div className="dashboard-container bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 min-h-[calc(100vh-2rem)] border border-green-100 fade-in">
            {activeTab === "energy" && (
              <EnergyTab
                todayEnergy={todayEnergy}
                totalEnergy={user.total_energy_generated}
                pointsEarned={user.points_earned}
                weeklyEnergy={weekly}
                recentSessions={recentSessions}
              />
            )}
            {activeTab === "report" && (
              <ReportTab
                userName={`${user.first_name} ${user.last_name}`}
                userEmail={user.email}
                initialReports={reports}
              />
            )}
            {activeTab === "profile" && (
              <ProfileTab user={publicUser} totalSessions={totalSessions} memberSince={memberSince} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
