export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/profile";
import { get } from "@/lib/db";
import { AgendaView } from "@/components/AgendaView";

export default async function AgendaPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const profile = getProfile(session.user.id);
  const user = get<{ role: string }>("SELECT role FROM user WHERE id = ?", [
    session.user.id,
  ]);
  const isAdmin = user?.role === "admin";

  if (!isAdmin && !profile?.category) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold">Class schedule</h1>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Please set your class category (Group or Individual) in your{" "}
            <a href="/profile" className="font-medium underline">
              profile
            </a>{" "}
            before booking classes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Class schedule</h1>
      <AgendaView
        userId={session.user.id}
        category={profile?.category ?? ""}
        isAdmin={isAdmin}
      />
    </div>
  );
}
