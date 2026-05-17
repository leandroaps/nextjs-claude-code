"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { phoneMask } from "@/lib/masks";
import { t } from "@/lib/i18n";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
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

export function AdminUserForm({ user }: { user: UserData }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address ?? "",
    city: user.city ?? "",
    telephone: user.telephone ?? "",
    mobile: user.mobile ?? "",
    age: user.age,
    gender: user.gender ?? "",
    category: user.category ?? "",
    weekly_appointments: user.weekly_appointments ?? 1,
    plan_type: user.plan_type ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function update(field: string, value: string | number | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/admin/users/${user.id}`, {
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

  async function handleDelete() {
    if (!confirm(t.deleteUserConfirm(user.name))) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const text = await res.text();
      try { alert(JSON.parse(text).error); } catch { alert(t.failedToCreateUser); }
      setDeleting(false);
    }
  }

  const inputClass =
    "w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
            &larr; {t.backToAdmin}
          </Link>
          <h1 className="mt-1 text-2xl font-semibold">{user.name}</h1>
        </div>
        <button type="button" onClick={handleDelete} disabled={deleting} className="rounded border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">
          {deleting ? t.deleting : t.deleteUser}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium">{t.name}</label>
            <input id="name" type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">{t.email}</label>
            <input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label htmlFor="role" className="text-sm font-medium">{t.role}</label>
            <select id="role" value={form.role} onChange={(e) => update("role", e.target.value)} className={inputClass}>
              <option value="user">{t.roleUser}</option>
              <option value="admin">{t.roleAdmin}</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="category" className="text-sm font-medium">{t.classCategory}</label>
            <select id="category" value={form.category} onChange={(e) => update("category", e.target.value)} className={inputClass}>
              <option value="">{t.selectCategory}</option>
              <option value="group">{t.group}</option>
              <option value="individual">{t.individual}</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="weekly_appointments" className="text-sm font-medium">{t.classesPerWeek}</label>
            <select id="weekly_appointments" value={form.weekly_appointments} onChange={(e) => update("weekly_appointments", Number(e.target.value))} className={inputClass}>
              <option value={1}>{t.perWeek1}</option>
              <option value={2}>{t.perWeek2}</option>
              <option value={3}>{t.perWeek3}</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="plan_type" className="text-sm font-medium">{t.plan}</label>
            <select id="plan_type" value={form.plan_type} onChange={(e) => update("plan_type", e.target.value)} className={inputClass}>
              <option value="">{t.selectPlan}</option>
              <option value="monthly">{t.monthly}</option>
              <option value="semester">{t.semester}</option>
              <option value="yearly">{t.yearly}</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="address" className="text-sm font-medium">{t.address}</label>
            <input id="address" type="text" value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label htmlFor="city" className="text-sm font-medium">{t.city}</label>
            <input id="city" type="text" value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label htmlFor="telephone" className="text-sm font-medium">{t.telephone}</label>
            <input id="telephone" type="tel" value={form.telephone} onChange={(e) => update("telephone", phoneMask(e.target.value))} placeholder="(99) 9999-9999" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label htmlFor="mobile" className="text-sm font-medium">{t.mobile}</label>
            <input id="mobile" type="tel" value={form.mobile} onChange={(e) => update("mobile", phoneMask(e.target.value))} placeholder="(99) 9999-9999" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label htmlFor="age" className="text-sm font-medium">{t.age}</label>
            <input id="age" type="number" min={0} max={150} value={form.age ?? ""} onChange={(e) => update("age", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label htmlFor="gender" className="text-sm font-medium">{t.gender}</label>
            <select id="gender" value={form.gender} onChange={(e) => update("gender", e.target.value)} className={inputClass}>
              <option value="">{t.genderOptions.none}</option>
              <option value="male">{t.genderOptions.male}</option>
              <option value="female">{t.genderOptions.female}</option>
              <option value="non-binary">{t.genderOptions.nonBinary}</option>
              <option value="other">{t.genderOptions.other}</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
            {saving ? t.saving : t.saveChanges}
          </button>
          {saved && <span className="text-sm text-green-600 dark:text-green-400">{t.saved}</span>}
        </div>
      </form>
    </div>
  );
}
