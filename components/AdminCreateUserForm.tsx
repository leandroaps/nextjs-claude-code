"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { phoneMask } from "@/lib/masks";
import { t } from "@/lib/i18n";

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
        setError(data.error || t.failedToCreateUser);
      } catch {
        setError(t.failedToCreateUser);
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-lg border border-zinc-200 bg-white p-4 sm:rounded-lg sm:p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t.createUser}</h2>
          <button type="button" onClick={onClose} className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
            {t.cancel}
          </button>
        </div>

        {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="create-name" className="text-sm font-medium">{t.name} *</label>
              <input id="create-name" type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label htmlFor="create-email" className="text-sm font-medium">{t.email} *</label>
              <input id="create-email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label htmlFor="create-password" className="text-sm font-medium">{t.password} *</label>
              <input id="create-password" type="password" required minLength={8} value={form.password} onChange={(e) => update("password", e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label htmlFor="create-role" className="text-sm font-medium">{t.role}</label>
              <select id="create-role" value={form.role} onChange={(e) => update("role", e.target.value)} className={inputClass}>
                <option value="user">{t.roleUser}</option>
                <option value="admin">{t.roleAdmin}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="create-category" className="text-sm font-medium">{t.classCategory}</label>
              <select id="create-category" value={form.category} onChange={(e) => update("category", e.target.value)} className={inputClass}>
                <option value="">{t.selectCategory}</option>
                <option value="group">{t.group}</option>
                <option value="individual">{t.individual}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="create-weekly_appointments" className="text-sm font-medium">{t.classesPerWeek}</label>
              <select id="create-weekly_appointments" value={form.weekly_appointments} onChange={(e) => update("weekly_appointments", Number(e.target.value))} className={inputClass}>
                <option value={1}>{t.perWeek1}</option>
                <option value={2}>{t.perWeek2}</option>
                <option value={3}>{t.perWeek3}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="create-plan_type" className="text-sm font-medium">{t.plan}</label>
              <select id="create-plan_type" value={form.plan_type} onChange={(e) => update("plan_type", e.target.value)} className={inputClass}>
                <option value="">{t.selectPlan}</option>
                <option value="monthly">{t.monthly}</option>
                <option value="semester">{t.semester}</option>
                <option value="yearly">{t.yearly}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="create-address" className="text-sm font-medium">{t.address}</label>
              <input id="create-address" type="text" value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label htmlFor="create-city" className="text-sm font-medium">{t.city}</label>
              <input id="create-city" type="text" value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label htmlFor="create-telephone" className="text-sm font-medium">{t.telephone}</label>
              <input id="create-telephone" type="tel" value={form.telephone} onChange={(e) => update("telephone", phoneMask(e.target.value))} placeholder="(99) 9999-9999" className={inputClass} />
            </div>
            <div className="space-y-1">
              <label htmlFor="create-mobile" className="text-sm font-medium">{t.mobile}</label>
              <input id="create-mobile" type="tel" value={form.mobile} onChange={(e) => update("mobile", phoneMask(e.target.value))} placeholder="(99) 9999-9999" className={inputClass} />
            </div>
            <div className="space-y-1">
              <label htmlFor="create-age" className="text-sm font-medium">{t.age}</label>
              <input id="create-age" type="number" min={0} max={150} value={form.age ?? ""} onChange={(e) => update("age", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label htmlFor="create-gender" className="text-sm font-medium">{t.gender}</label>
              <select id="create-gender" value={form.gender} onChange={(e) => update("gender", e.target.value)} className={inputClass}>
                <option value="">{t.genderOptions.none}</option>
                <option value="male">{t.genderOptions.male}</option>
                <option value="female">{t.genderOptions.female}</option>
                <option value="non-binary">{t.genderOptions.nonBinary}</option>
                <option value="other">{t.genderOptions.other}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
              {t.cancel}
            </button>
            <button type="submit" disabled={saving} className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
              {saving ? t.creating : t.createUser}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
