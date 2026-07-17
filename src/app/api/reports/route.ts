import { NextRequest, NextResponse } from "next/server";
import { createReport, listReportsForUser } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  return NextResponse.json({ reports: listReportsForUser(session.userId) });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json();
  const issueType = (body.issueType ?? "").trim();
  const description = (body.description ?? "").trim();

  if (!issueType || !description) {
    return NextResponse.json(
      { error: "Please select an issue type and add a description." },
      { status: 400 }
    );
  }

  const report = createReport({ user_id: session.userId, issue_type: issueType, description });
  return NextResponse.json({ report });
}
