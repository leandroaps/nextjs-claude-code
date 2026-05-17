"use client";

import { t } from "@/lib/i18n";

type Appointment = {
  id: string;
  user_id: string;
  user_name: string;
  date: string;
  start_hour: number;
  category: string;
};

const SLOTS = Array.from({ length: 13 }, (_, i) => 7 + i);

function formatHour(hour: number) {
  return `${hour.toString().padStart(2, "0")}:00`;
}

export function TodaySchedule({
  appointments,
  isAdmin,
  userId,
}: {
  appointments: Appointment[];
  isAdmin: boolean;
  userId: string;
}) {
  const visibleAppointments = isAdmin
    ? appointments
    : appointments.filter((a) => a.user_id === userId);

  if (visibleAppointments.length === 0) {
    return (
      <p className="py-12 text-center text-zinc-500">{t.noClasses}</p>
    );
  }

  const slotGroups = SLOTS.map((hour) => ({
    hour,
    items: visibleAppointments.filter((a) => a.start_hour === hour),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {slotGroups.map(({ hour, items }) => (
        <div key={hour} className="flex flex-col gap-1 px-3 py-2.5 sm:flex-row sm:gap-4 sm:px-4 sm:py-3">
          <span className="shrink-0 font-mono text-xs text-zinc-500 sm:w-28 sm:text-sm">
            {formatHour(hour)} – {formatHour(hour + 1)}
          </span>
          <div className="flex flex-1 flex-wrap gap-2">
            {items.map((a) => (
              <span
                key={a.id}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                  a.category === "individual"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
                }`}
              >
                {a.user_name}
                <span className="opacity-60 capitalize">({a.category === "individual" ? t.individual : t.group})</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
