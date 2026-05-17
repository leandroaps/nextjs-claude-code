import { get, run } from "./db";

export type Profile = {
  user_id: string;
  address: string | null;
  city: string | null;
  telephone: string | null;
  mobile: string | null;
  age: number | null;
  gender: string | null;
  category: string | null;
  weekly_appointments: number;
  plan_type: string | null;
  updated_at: string;
};

export type ProfileUpdate = {
  address?: string | null;
  city?: string | null;
  telephone?: string | null;
  mobile?: string | null;
  age?: number | null;
  gender?: string | null;
  category?: string | null;
  weekly_appointments?: number;
  plan_type?: string | null;
};

export function getProfile(userId: string): Profile | undefined {
  return get<Profile>("SELECT * FROM profile WHERE user_id = ?", [userId]);
}

export function upsertProfile(userId: string, data: ProfileUpdate): Profile {
  const existing = getProfile(userId);

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

  return getProfile(userId)!;
}
