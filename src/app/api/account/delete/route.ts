import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserById, softDeleteUser } from "@/lib/db";
import { destroySession, getSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json();
  const password = body.password ?? "";

  const user = getUserById(session.userId);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return NextResponse.json(
      { error: "Incorrect password. Account deletion cancelled." },
      { status: 400 }
    );
  }

  softDeleteUser(session.userId);
  destroySession();

  return NextResponse.json({ success: true });
}
