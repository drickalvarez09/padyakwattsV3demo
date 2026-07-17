import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { emailExists, getUserById, updateUserProfile } from "@/lib/db";
import { getSession } from "@/lib/session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_CHAR_RE = /[!@#$%^&*(),.?":{}|<>]/;

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json();
  const firstName = (body.firstName ?? "").trim();
  const lastName = (body.lastName ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const address = (body.address ?? "").trim();
  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";
  const confirmPassword = body.confirmPassword ?? "";
  const preferences = body.preferences ?? {};

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { error: "First name, last name, and email are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (emailExists(email, session.userId)) {
    return NextResponse.json(
      { error: "Email is already registered by another user." },
      { status: 409 }
    );
  }

  const fields: Parameters<typeof updateUserProfile>[1] = {
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    address,
    email_notifications: Boolean(preferences.emailNotifications),
    weekly_reports: Boolean(preferences.weeklyReports),
    marketing_emails: Boolean(preferences.marketingEmails),
    share_data: Boolean(preferences.shareData),
  };

  if (currentPassword || newPassword || confirmPassword) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required to change password." },
        { status: 400 }
      );
    }
    const user = getUserById(session.userId);
    if (!user || !bcrypt.compareSync(currentPassword, user.password_hash)) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New passwords do not match." }, { status: 400 });
    }
    if (newPassword.length < 6 || !SPECIAL_CHAR_RE.test(newPassword)) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters and include a special character.' },
        { status: 400 }
      );
    }
    fields.password_hash = bcrypt.hashSync(newPassword, 10);
  }

  updateUserProfile(session.userId, fields);

  return NextResponse.json({ success: "Profile updated successfully!" });
}
