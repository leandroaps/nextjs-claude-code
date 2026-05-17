export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireAdmin, listAllUsers } from "@/lib/admin";
import { AdminDashboard } from "@/components/AdminDashboard";
import { t } from "@/lib/i18n";

export default async function AdminPage() {
  const session = await requireAdmin();
  if (!session) redirect("/login");

  const users = listAllUsers();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{t.admin}</h1>
      <p className="mt-1 text-sm text-zinc-500">{t.manageUsers}</p>
      <div className="mt-6">
        <AdminDashboard users={users} />
      </div>
    </div>
  );
}
