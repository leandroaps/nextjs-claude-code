import { auth } from "./auth";
import { headers } from "next/headers";
import { query, get, run } from "./db";
import type { Profile, ProfileUpdate } from "./profile";

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const user = get<{ role: string }>("SELECT role FROM user WHERE id = ?", [
    session.user.id,
  ]);
  if (user?.role !== "admin") return null;

  return session;
}

export type UserWithProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  address: string | null;
  city: string | null;
  telephone: string | null;
  mobile: string | null;
  age: number | null;
  gender: string | null;
  category: string | null;
  weekly_appointments: number | null;
  plan_type: string | null;
};

export function listAllUsers(): UserWithProfile[] {
  return query<UserWithProfile>(
    `SELECT u.id, u.name, u.email, u.role, u.createdAt,
            p.address, p.city, p.telephone, p.mobile, p.age, p.gender, p.category, p.weekly_appointments, p.plan_type
     FROM user u
     LEFT JOIN profile p ON p.user_id = u.id
     ORDER BY u.createdAt DESC`
  );
}

export function getUserById(userId: string): UserWithProfile | undefined {
  return get<UserWithProfile>(
    `SELECT u.id, u.name, u.email, u.role, u.createdAt,
            p.address, p.city, p.telephone, p.mobile, p.age, p.gender, p.category, p.weekly_appointments, p.plan_type
     FROM user u
     LEFT JOIN profile p ON p.user_id = u.id
     WHERE u.id = ?`,
    [userId]
  );
}

export function updateUserRole(userId: string, role: string) {
  run("UPDATE user SET role = ?, updatedAt = datetime('now') WHERE id = ?", [
    role,
    userId,
  ]);
}

export function updateUserDetails(
  userId: string,
  data: { name?: string; email?: string }
) {
  if (data.name) {
    run("UPDATE user SET name = ?, updatedAt = datetime('now') WHERE id = ?", [
      data.name,
      userId,
    ]);
  }
  if (data.email) {
    run("UPDATE user SET email = ?, updatedAt = datetime('now') WHERE id = ?", [
      data.email,
      userId,
    ]);
  }
}

export function adminUpsertProfile(userId: string, data: ProfileUpdate) {
  const existing = get<Profile>("SELECT * FROM profile WHERE user_id = ?", [
    userId,
  ]);

  if (existing) {
    run(
      `UPDATE profile SET address = ?, city = ?, telephone = ?, mobile = ?, age = ?, gender = ?, category = ?, weekly_appointments = ?, plan_type = ?, updated_at = datetime('now') WHERE user_id = ?`,
      [
        data.address ?? existing.address,
        data.city ?? existing.city,
        data.telephone ?? existing.telephone,
        data.mobile ?? existing.mobile,
        data.age ?? existing.age,
        data.gender ?? existing.gender,
        data.category ?? existing.category,
        data.weekly_appointments ?? existing.weekly_appointments,
        data.plan_type ?? existing.plan_type,
        userId,
      ]
    );
  } else {
    run(
      `INSERT INTO profile (user_id, address, city, telephone, mobile, age, gender, category, weekly_appointments, plan_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        data.address ?? null,
        data.city ?? null,
        data.telephone ?? null,
        data.mobile ?? null,
        data.age ?? null,
        data.gender ?? null,
        data.category ?? null,
        data.weekly_appointments ?? 1,
        data.plan_type ?? null,
      ]
    );
  }
}

export function deleteUser(userId: string) {
  run("DELETE FROM appointments WHERE user_id = ?", [userId]);
  run("DELETE FROM notes WHERE user_id = ?", [userId]);
  run("DELETE FROM profile WHERE user_id = ?", [userId]);
  run("DELETE FROM session WHERE userId = ?", [userId]);
  run("DELETE FROM account WHERE userId = ?", [userId]);
  run("DELETE FROM user WHERE id = ?", [userId]);
}
