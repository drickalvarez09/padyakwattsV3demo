import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = (body.email ?? "").trim();

  if (!email) {
    return NextResponse.json({ error: "Please enter your email address." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const user = getUserByEmail(email);

  // Security best practice (matches original PHP): never reveal whether the
  // email exists. A reset token would be generated + emailed here in a real
  // deployment; that step is a no-op in this offline demo.
  void user;

  return NextResponse.json({
    success:
      "If your email exists in our system, you will receive password reset instructions.",
  });
}
