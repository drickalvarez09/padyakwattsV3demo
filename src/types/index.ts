// Types mirror the original MySQL schema (users / sessions / stations / reports)
// so this layer can be swapped for a real MySQL-backed implementation later
// without touching any page or API route.

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  phone: string;
  address: string;
  user_type: "user" | "admin";
  points_earned: number;
  total_energy_generated: number;
  is_active: boolean;
  email_notifications: boolean;
  weekly_reports: boolean;
  marketing_emails: boolean;
  share_data: boolean;
  remember_token: string | null;
  reset_token: string | null;
  reset_expiry: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export type PublicUser = Omit<
  User,
  "password_hash" | "remember_token" | "reset_token" | "reset_expiry"
>;

export interface Station {
  id: string;
  name: string;
  location: string;
  status: "active" | "offline" | "maintenance";
}

export interface EnergySession {
  id: string;
  user_id: string;
  station_id: string;
  start_time: string;
  duration_minutes: number;
  energy_generated: number;
  points_earned: number;
}

export interface Report {
  id: string;
  user_id: string;
  issue_type: string;
  description: string;
  status: "under_review" | "resolved" | "closed";
  created_at: string;
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
}
