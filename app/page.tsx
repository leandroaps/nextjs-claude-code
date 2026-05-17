export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { get } from "@/lib/db";
import { getAppointmentsByDate } from "@/lib/appointments";
import { t } from "@/lib/i18n";
import { TodaySchedule } from "@/components/TodaySchedule";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = get<{ role: string }>("SELECT role FROM user WHERE id = ?", [
    session.user.id,
  ]);
  const isAdmin = user?.role === "admin";
  const today = todayStr();
  const appointments = getAppointmentsByDate(today);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{t.todaySchedule}</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {new Date().toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <div className="mt-6">
        <TodaySchedule
          appointments={appointments}
          isAdmin={isAdmin}
          userId={session.user.id}
        />
      </div>
    </div>
  );
}
