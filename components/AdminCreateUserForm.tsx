"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { phoneMask } from "@/lib/masks";

export function AdminCreateUserForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    address: "",
    city: "",
    telephone: "",
    mobile: "",
    age: null as number | null,
    gender: "",
    category: "",
    weekly_appointments: 1,
    plan_type: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string | number | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch("/api/admin/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        age: form.age || null,
        gender: form.gender || null,
        category: form.category || null,
        plan_type: form.plan_type || null,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        setError(data.error || "Failed to create user");
      } catch {
        setError("Failed to create user");
      }
      setSaving(false);
      return;
    }

    router.refresh();
    onClose();
  }

  const inputClass =
    "w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create user</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Cancel
          </button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="create-name" className="text-sm font-medium">
                Name *
              </label>
              <input
                id="create-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="create-email" className="text-sm font-medium">
                Email *
              </label>
              <input
                id="create-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="create-password" className="text-sm font-medium">
                Password *
              </label>
              <input
                id="create-password"
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="create-role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="create-role"
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                className={inputClass}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="create-category" className="text-sm font-medium">
                Class category
              </label>
              <select
                id="create-category"
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
              <label htmlFor="create-weekly_appointments" className="text-sm font-medium">
                Classes per week
              </label>
              <select
                id="create-weekly_appointments"
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
              <label htmlFor="create-plan_type" className="text-sm font-medium">
                Plan
              </label>
              <select
                id="create-plan_type"
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

            <div className="space-y-1">
              <label htmlFor="create-address" className="text-sm font-medium">
                Address
              </label>
              <input
                id="create-address"
                type="text"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="create-city" className="text-sm font-medium">
                City
              </label>
              <input
                id="create-city"
                type="text"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="create-telephone" className="text-sm font-medium">
                Telephone
              </label>
              <input
                id="create-telephone"
                type="tel"
                value={form.telephone}
                onChange={(e) => update("telephone", phoneMask(e.target.value))}
                placeholder="(99) 9999-9999"
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="create-mobile" className="text-sm font-medium">
                Mobile
              </label>
              <input
                id="create-mobile"
                type="tel"
                value={form.mobile}
                onChange={(e) => update("mobile", phoneMask(e.target.value))}
                placeholder="(99) 9999-9999"
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="create-age" className="text-sm font-medium">
                Age
              </label>
              <input
                id="create-age"
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
              <label htmlFor="create-gender" className="text-sm font-medium">
                Gender
              </label>
              <select
                id="create-gender"
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
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {saving ? "Creating..." : "Create user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
