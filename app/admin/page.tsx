export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireAdmin, listAllUsers } from "@/lib/admin";
import { AdminDashboard } from "@/components/AdminDashboard";

export default async function AdminPage() {
  const session = await requireAdmin();
  if (!session) redirect("/login");

  const users = listAllUsers();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Manage users, profiles, and appointments.
      </p>
      <div className="mt-6">
        <AdminDashboard users={users} />
      </div>
    </div>
  );
}
