"use client";

import { useState } from "react";
import { phoneMask } from "@/lib/masks";

type ProfileData = {
  address: string;
  city: string;
  telephone: string;
  mobile: string;
  age: number | null;
  gender: string;
  category: string;
  weekly_appointments: number;
  plan_type: string;
};

export function ProfileForm({
  profile,
  isAdmin = false,
}: {
  profile: ProfileData;
  isAdmin?: boolean;
}) {
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(field: keyof ProfileData, value: string | number | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        age: form.age || null,
        gender: form.gender || null,
        category: form.category || null,
        plan_type: form.plan_type || null,
      }),
    });
    if (res.ok) setSaved(true);
    setSaving(false);
  }

  const inputClass =
    "w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="address" className="text-sm font-medium">
            Address
          </label>
          <input
            id="address"
            type="text"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <input
            id="city"
            type="text"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="telephone" className="text-sm font-medium">
            Telephone
          </label>
          <input
            id="telephone"
            type="tel"
            value={form.telephone}
            onChange={(e) => update("telephone", phoneMask(e.target.value))}
            placeholder="(99) 9999-9999"
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="mobile" className="text-sm font-medium">
            Mobile
          </label>
          <input
            id="mobile"
            type="tel"
            value={form.mobile}
            onChange={(e) => update("mobile", phoneMask(e.target.value))}
            placeholder="(99) 9999-9999"
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="age" className="text-sm font-medium">
            Age
          </label>
          <input
            id="age"
            type="number"
            min={0}
            max={150}
            value={form.age ?? ""}
            onChange={(e) =>
              update("age", e.target.value ? Number(e.target.value) : null)
            }
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="gender" className="text-sm font-medium">
            Gender
          </label>
          <select
            id="gender"
            value={form.gender}
            onChange={(e) => update("gender", e.target.value)}
            className={inputClass}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="other">Other</option>
          </select>
        </div>

        {!isAdmin && (
          <>
            <div className="space-y-1">
              <label htmlFor="category" className="text-sm font-medium">
                Class category
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className={inputClass}
              >
                <option value="">Select a category</option>
                <option value="group">Group</option>
                <option value="individual">Individual</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="weekly_appointments" className="text-sm font-medium">
                Classes per week
              </label>
              <select
                id="weekly_appointments"
                value={form.weekly_appointments}
                onChange={(e) => update("weekly_appointments", Number(e.target.value))}
                className={inputClass}
              >
                <option value={1}>1x per week</option>
                <option value={2}>2x per week</option>
                <option value={3}>3x per week</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="plan_type" className="text-sm font-medium">
                Plan
              </label>
              <select
                id="plan_type"
                value={form.plan_type}
                onChange={(e) => update("plan_type", e.target.value)}
                className={inputClass}
              >
                <option value="">Select a plan</option>
                <option value="monthly">Monthly</option>
                <option value="semester">Semester</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {saved && (
          <span className="text-sm text-green-600 dark:text-green-400">
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
