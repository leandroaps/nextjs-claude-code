import { NextResponse } from "next/server";
import { requireAdmin, adminUpsertProfile } from "@/lib/admin";
import { hashPassword } from "better-auth/crypto";
import { run, get } from "@/lib/db";
import { nanoid } from "nanoid";

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

  const existing = get<{ id: string }>("SELECT id FROM user WHERE email = ?", [email]);
  if (existing) {
    return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
  }

  const userId = nanoid(32);
  const hashedPassword = await hashPassword(password);

  run(
    `INSERT INTO user (id, name, email, role, emailVerified) VALUES (?, ?, ?, ?, 0)`,
    [userId, name, email, role || "user"]
  );

  run(
    `INSERT INTO account (id, userId, accountId, providerId, password) VALUES (?, ?, ?, 'credential', ?)`,
    [nanoid(32), userId, userId, hashedPassword]
  );

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
