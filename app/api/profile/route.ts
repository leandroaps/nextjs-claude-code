import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getProfile, upsertProfile } from "@/lib/profile";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = getProfile(session.user.id);
  return NextResponse.json(profile ?? { user_id: session.user.id });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const profile = upsertProfile(session.user.id, {
    address: body.address,
    city: body.city,
    telephone: body.telephone,
    mobile: body.mobile,
    age: body.age != null ? Number(body.age) : undefined,
    gender: body.gender,
    category: body.category,
    weekly_appointments: body.weekly_appointments != null ? Number(body.weekly_appointments) : undefined,
    plan_type: body.plan_type,
  });

  return NextResponse.json(profile);
}
