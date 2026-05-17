export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/profile";
import { get } from "@/lib/db";
import { ProfileForm } from "@/components/ProfileForm";
import { t } from "@/lib/i18n";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const profile = getProfile(session.user.id);
  const user = get<{ role: string }>("SELECT role FROM user WHERE id = ?", [
    session.user.id,
  ]);
  const isAdmin = user?.role === "admin";

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">{t.profile}</h1>
      <div className="mb-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-sm text-zinc-500">{t.name}</p>
        <p className="font-medium">{session.user.name}</p>
        <p className="mt-2 text-sm text-zinc-500">{t.email}</p>
        <p className="font-medium">{session.user.email}</p>
      </div>
      <ProfileForm
        isAdmin={isAdmin}
        profile={{
          address: profile?.address ?? "",
          city: profile?.city ?? "",
          telephone: profile?.telephone ?? "",
          mobile: profile?.mobile ?? "",
          age: profile?.age ?? null,
          gender: profile?.gender ?? "",
          category: profile?.category ?? "",
          weekly_appointments: profile?.weekly_appointments ?? 1,
          plan_type: profile?.plan_type ?? "",
        }}
      />
    </div>
  );
}
