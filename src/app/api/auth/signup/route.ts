import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, emailExists } from "@/lib/db";
import { createSession } from "@/lib/session";

const SPECIAL_CHAR_RE = /[!@#$%^&*(),.?":{}|<>]/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const firstName = (body.firstName ?? "").trim();
  const lastName = (body.lastName ?? "").trim();
  const email = (body.email ?? "").trim();
  const password = body.password ?? "";
  const confirmPassword = body.confirmPassword ?? "";
  const phone = (body.phone ?? "").trim();
  const address = (body.address ?? "").trim();
  const terms = Boolean(body.terms);

  const errors: string[] = [];
  if (!firstName) errors.push("First name is required.");
  if (!lastName) errors.push("Last name is required.");
  if (!email) errors.push("Email is required.");
  else if (!EMAIL_RE.test(email)) errors.push("Invalid email format.");
  if (!password) errors.push("Password is required.");
  else if (password.length < 6) errors.push("Password must be at least 6 characters.");
  else if (!SPECIAL_CHAR_RE.test(password))
    errors.push("Password must include at least one special character.");
  if (password !== confirmPassword) errors.push("Passwords do not match.");
  if (!phone) errors.push("Phone number is required.");
  if (!address) errors.push("Address is required.");
  if (!terms) errors.push("You must agree to the terms and conditions.");

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  if (emailExists(email)) {
    return NextResponse.json(
      { error: "Email already registered. Please use a different email or login." },
      { status: 409 }
    );
  }

  const password_hash = bcrypt.hashSync(password, 10);
  const user = createUser({
    first_name: firstName,
    last_name: lastName,
    email,
    password_hash,
    phone,
    address,
  });

  await createSession({ userId: user.id, email: user.email, name: `${firstName} ${lastName}` });

  return NextResponse.json({ success: true });
}
