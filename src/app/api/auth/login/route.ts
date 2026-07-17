import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = (body.email ?? "").trim();
  const password = body.password ?? "";
  const remember = Boolean(body.remember);

  if (!email || !password) {
    return NextResponse.json(
      { error: "Please enter both email and password." },
      { status: 400 }
    );
  }

  const user = getUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createSession(
    { userId: user.id, email: user.email, name: `${user.first_name} ${user.last_name}` },
    remember
  );

  return NextResponse.json({ success: true });
}
