import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import type { EnergySession, Report, Station, User } from "@/types";

/**
 * ---------------------------------------------------------------------------
 * Data layer
 * ---------------------------------------------------------------------------
 * The original app (v1) talked to MySQL via PDO in config/database.php.
 * This module exposes the exact same shape of operations (getUserByEmail,
 * createUser, listSessionsForUser, ...) but persists to a JSON file on disk
 * instead of a MySQL server, so the app runs standalone in this environment.
 *
 * To point this at a real MySQL database later:
 *   1. `npm install mysql2`
 *   2. Replace the `readDb`/`writeDb` file I/O below with a `mysql2/promise`
 *      pool, and rewrite each exported function's body to run the equivalent
 *      SQL query (they're noted in comments next to each function).
 *   3. Nothing outside this file needs to change - every API route and page
 *      only calls these exported functions.
 * ---------------------------------------------------------------------------
 */

interface DbShape {
  users: User[];
  stations: Station[];
  sessions: EnergySession[];
  reports: Report[];
}

// On Vercel (and most serverless hosts) the deployed bundle at
// process.cwd() is READ-ONLY — the only writable path is /tmp. Locally,
// process.cwd() is your project folder, so we keep using ./data there
// (handy for inspecting db.json directly / persisting between `npm run dev`
// restarts). On Vercel we fall back to /tmp — note this is NOT durable
// storage: it can be wiped on cold starts and isn't shared across
// concurrent instances, so signups/data made this way are demo-only and
// can disappear. See README "About the database layer" for the real fix.
const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "padyakwatts-data")
  : path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

const STATIONS_SEED: Station[] = [
  { id: "st_1", name: "PADYAKWATTS Hub — QC Circle", location: "Quezon City Circle, Quezon City", status: "active" },
  { id: "st_2", name: "UP Diliman Academic Oval Station", location: "Academic Oval, UP Diliman", status: "active" },
  { id: "st_3", name: "Eastwood Mall Charging Point", location: "Eastwood City, Libis, QC", status: "active" },
  { id: "st_4", name: "SM North EDSA Station", location: "SM North EDSA, Quezon City", status: "maintenance" },
  { id: "st_5", name: "Ateneo de Manila Station", location: "Katipunan Ave, Loyola Heights, QC", status: "active" },
  { id: "st_6", name: "Cubao Terminal Station", location: "Araneta City, Cubao, QC", status: "offline" },
];

export const DEMO_EMAIL = "demo@padyakwatts.ph";
export const DEMO_PASSWORD = "Demo@123";

function daysAgoIso(n: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function buildDemoSessions(userId: string): EnergySession[] {
  // A realistic-looking spread of sessions over the last 30 days, including
  // a couple "today" so the dashboard never looks empty on first run.
  const plan: [number, number, number, number, string][] = [
    [0, 8, 10, 22, "st_1"], [0, 17, 30, 18, "st_2"],
    [1, 7, 45, 25, "st_1"], [2, 18, 5, 15, "st_3"],
    [3, 8, 0, 20, "st_2"], [4, 17, 50, 30, "st_1"],
    [5, 9, 15, 18, "st_5"], [6, 16, 40, 24, "st_1"],
    [8, 7, 55, 21, "st_2"], [9, 18, 20, 27, "st_3"],
    [11, 8, 5, 19, "st_1"], [12, 17, 10, 23, "st_5"],
  ];

  return plan.map(([day, hour, minute, durationMinutes, stationId]) => {
    const rate = 0.15 + Math.random() * 0.04;
    const energy = Math.round(durationMinutes * rate * 10) / 10;
    const points = Math.round(energy * 8);
    return {
      id: `sess_${day}_${hour}_${minute}`,
      user_id: userId,
      station_id: stationId,
      start_time: daysAgoIso(day, hour, minute),
      duration_minutes: durationMinutes,
      energy_generated: energy,
      points_earned: points,
    };
  });
}

function seedDemoAccount(db: DbShape): void {
  const demoId = "usr_demo";
  const demoSessions = buildDemoSessions(demoId);
  const totalEnergy = demoSessions.reduce((sum, s) => sum + s.energy_generated, 0);
  const totalPoints = demoSessions.reduce((sum, s) => sum + s.points_earned, 0);

  db.users.push({
    id: demoId,
    first_name: "Juan",
    last_name: "Dela Cruz",
    email: DEMO_EMAIL,
    password_hash: bcrypt.hashSync(DEMO_PASSWORD, 10),
    phone: "+63 912 345 6789",
    address: "Quezon City, Metro Manila",
    user_type: "user",
    points_earned: Math.round(totalPoints),
    total_energy_generated: Math.round(totalEnergy * 10) / 10,
    is_active: true,
    email_notifications: true,
    weekly_reports: true,
    marketing_emails: false,
    share_data: true,
    remember_token: null,
    reset_token: null,
    reset_expiry: null,
    created_at: daysAgoIso(60, 9, 0),
    updated_at: null,
    deleted_at: null,
  });
  db.sessions.push(...demoSessions);
}

function ensureDb(): DbShape {
  if (!fs.existsSync(DB_PATH)) {
    const initial: DbShape = {
      users: [],
      stations: STATIONS_SEED,
      sessions: [],
      reports: [],
    };
    seedDemoAccount(initial);
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as DbShape;
}

function readDb(): DbShape {
  return ensureDb();
}

function writeDb(db: DbShape): void {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// --- Users -------------------------------------------------------------
// SQL equivalent: SELECT ... FROM users WHERE email = :email AND is_active = 1 LIMIT 1
export function getUserByEmail(email: string): User | undefined {
  const db = readDb();
  return db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.is_active
  );
}

// SQL equivalent: SELECT id FROM users WHERE email = :email
export function emailExists(email: string, excludeUserId?: string): boolean {
  const db = readDb();
  return db.users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== excludeUserId
  );
}

// SQL equivalent: SELECT ... FROM users WHERE id = :id
export function getUserById(id: string): User | undefined {
  const db = readDb();
  return db.users.find((u) => u.id === id && u.is_active);
}

// SQL equivalent: INSERT INTO users (...) VALUES (...)
export function createUser(input: {
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  phone: string;
  address: string;
}): User {
  const db = readDb();
  const user: User = {
    id: uid("usr"),
    first_name: input.first_name,
    last_name: input.last_name,
    email: input.email,
    password_hash: input.password_hash,
    phone: input.phone,
    address: input.address,
    user_type: "user",
    points_earned: 0,
    total_energy_generated: 0,
    is_active: true,
    email_notifications: true,
    weekly_reports: true,
    marketing_emails: false,
    share_data: true,
    remember_token: null,
    reset_token: null,
    reset_expiry: null,
    created_at: new Date().toISOString(),
    updated_at: null,
    deleted_at: null,
  };
  db.users.push(user);
  writeDb(db);
  return user;
}

// SQL equivalent: UPDATE users SET first_name=..., last_name=..., email=..., phone=..., address=..., ... WHERE id=:id
export function updateUserProfile(
  id: string,
  fields: Partial<
    Pick<
      User,
      | "first_name"
      | "last_name"
      | "email"
      | "phone"
      | "address"
      | "email_notifications"
      | "weekly_reports"
      | "marketing_emails"
      | "share_data"
      | "password_hash"
    >
  >
): User | undefined {
  const db = readDb();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) return undefined;
  db.users[idx] = { ...db.users[idx], ...fields, updated_at: new Date().toISOString() };
  writeDb(db);
  return db.users[idx];
}

// SQL equivalent: UPDATE users SET is_active = 0, deleted_at = NOW() WHERE id = :user_id
// (matches the "soft delete" branch the original delete_account.php used)
export function softDeleteUser(id: string): void {
  const db = readDb();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) return;
  db.users[idx].is_active = false;
  db.users[idx].deleted_at = new Date().toISOString();
  // Cascade: DELETE FROM sessions WHERE user_id = :id; DELETE FROM reports WHERE user_id = :id
  db.sessions = db.sessions.filter((s) => s.user_id !== id);
  db.reports = db.reports.filter((r) => r.user_id !== id);
  writeDb(db);
}

// --- Stations ------------------------------------------------------------
// SQL equivalent: SELECT * FROM stations ORDER BY name
export function listStations(): Station[] {
  const db = readDb();
  return [...db.stations].sort((a, b) => a.name.localeCompare(b.name));
}

// --- Sessions --------------------------------------------------------------
// SQL equivalent: SELECT s.*, st.name, st.location FROM sessions s JOIN stations st
//                 WHERE s.user_id = :user_id ORDER BY s.start_time DESC LIMIT 10
export function listRecentSessions(userId: string, limit = 10) {
  const db = readDb();
  const stationsById = new Map(db.stations.map((s) => [s.id, s]));
  return db.sessions
    .filter((s) => s.user_id === userId)
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
    .slice(0, limit)
    .map((s) => ({
      ...s,
      station_name: stationsById.get(s.station_id)?.name ?? "Unknown Station",
      station_location: stationsById.get(s.station_id)?.location ?? "Location not specified",
    }));
}

// SQL equivalent: SELECT COUNT(*) FROM sessions WHERE user_id = :user_id
export function countSessions(userId: string): number {
  const db = readDb();
  return db.sessions.filter((s) => s.user_id === userId).length;
}

// SQL equivalent: SELECT DATE(start_time), SUM(energy_generated) FROM sessions
//                 WHERE user_id = :user_id AND start_time >= NOW() - INTERVAL 7 DAY GROUP BY DATE(start_time)
export function weeklyEnergy(userId: string): Record<string, number> {
  const db = readDb();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result: Record<string, number> = Object.fromEntries(days.map((d) => [d, 0]));
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  db.sessions
    .filter((s) => s.user_id === userId && new Date(s.start_time).getTime() >= cutoff)
    .forEach((s) => {
      const dayName = days[new Date(s.start_time).getDay()];
      result[dayName] += s.energy_generated;
    });
  return result;
}

// --- Reports ---------------------------------------------------------------
// SQL equivalent: INSERT INTO reports (...) VALUES (...)
export function createReport(input: {
  user_id: string;
  issue_type: string;
  description: string;
}): Report {
  const db = readDb();
  const report: Report = {
    id: uid("rep"),
    user_id: input.user_id,
    issue_type: input.issue_type,
    description: input.description,
    status: "under_review",
    created_at: new Date().toISOString(),
  };
  db.reports.push(report);
  writeDb(db);
  return report;
}

// SQL equivalent: SELECT * FROM reports WHERE user_id = :user_id ORDER BY created_at DESC
export function listReportsForUser(userId: string): Report[] {
  const db = readDb();
  return db.reports
    .filter((r) => r.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
