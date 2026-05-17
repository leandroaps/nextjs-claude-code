export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireAdmin, getUserById } from "@/lib/admin";
import { AdminUserForm } from "@/components/AdminUserForm";

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  if (!session) redirect("/login");

  const { id } = await params;
  const user = getUserById(id);
  if (!user) redirect("/admin");

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <AdminUserForm user={user} />
    </div>
  );
}
