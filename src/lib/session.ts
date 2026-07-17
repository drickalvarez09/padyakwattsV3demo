import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionPayload } from "@/types";

const COOKIE_NAME = "padyakwatts_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days (30 days if "remember me")
const REMEMBER_DURATION_SECONDS = 60 * 60 * 24 * 30;

function getSecretKey() {
  const secret = process.env.SESSION_SECRET || "padyakwatts-dev-secret-change-me";
  return new TextEncoder().encode(secret);
}

/** Equivalent of setting $_SESSION['logged_in'], ['user_id'], etc. after login/signup. */
export async function createSession(payload: SessionPayload, remember = false) {
  const durationSeconds = remember ? REMEMBER_DURATION_SECONDS : SESSION_DURATION_SECONDS;
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + durationSeconds)
    .sign(getSecretKey());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: durationSeconds,
  });
}

/** Equivalent of checking isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true */
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Equivalent of session_unset() + session_destroy() in logout.php */
export function destroySession() {
  cookies().delete(COOKIE_NAME);
}
