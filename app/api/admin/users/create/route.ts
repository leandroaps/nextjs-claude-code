import { NextResponse } from "next/server";
import { requireAdmin, adminUpsertProfile } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { run } from "@/lib/db";

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, email, password, role, ...profileFields } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
      { status: 400 }
    );
  }

  let res;
  try {
    res = await auth.api.signUpEmail({
      body: { name, email, password },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create user";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (!res || !res.user) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 400 });
  }

  const userId = res.user.id;

  if (role && role !== "user") {
    run("UPDATE user SET role = ? WHERE id = ?", [role, userId]);
  }

  const hasProfileData = Object.values(profileFields).some(
    (v) => v !== "" && v !== null && v !== undefined
  );
  if (hasProfileData) {
    adminUpsertProfile(userId, {
      address: profileFields.address || null,
      city: profileFields.city || null,
      telephone: profileFields.telephone || null,
      mobile: profileFields.mobile || null,
      age: profileFields.age != null ? Number(profileFields.age) : null,
      gender: profileFields.gender || null,
      category: profileFields.category || null,
      weekly_appointments: profileFields.weekly_appointments != null ? Number(profileFields.weekly_appointments) : 1,
      plan_type: profileFields.plan_type || null,
    });
  }

  return NextResponse.json({ id: userId }, { status: 201 });
}
