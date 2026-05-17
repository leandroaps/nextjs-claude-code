"use client";

import { useState, useEffect, useRef } from "react";
import { t } from "@/lib/i18n";

type Appointment = {
  id: string;
  user_id: string;
  user_name: string;
  date: string;
  start_hour: number;
  category: string;
};

type UserOption = {
  id: string;
  name: string;
  category: string | null;
};

const SLOTS = Array.from({ length: 13 }, (_, i) => 7 + i);
const MAX_GROUP = 3;
const DAY_LABELS = t.days;

function formatHour(hour: number) {
  return `${hour.toString().padStart(2, "0")}:00`;
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

function addDays(d: Date, n: number): Date {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date;
}

function formatShortDate(d: Date): string {
  return d.toLocaleDateString("pt-BR", { month: "short", day: "numeric" });
}

export function AgendaView({
  userId,
  category,
  isAdmin,
}: {
  userId: string;
  category: string;
  isAdmin: boolean;
}) {
  const [monday, setMonday] = useState(() => getMonday(new Date()));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const abortRef = useRef<AbortController>(null);

  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(monday, i));
  const from = toDateStr(monday);
  const to = toDateStr(addDays(monday, 4));

  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/admin/users/list")
      .then((res) => (res.ok ? res.json() : []))
      .then(setUsers);
  }, [isAdmin]);

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    fetch(`/api/appointments?from=${from}&to=${to}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!controller.signal.aborted) {
          setAppointments(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [from, to, refreshKey]);

  async function handleBook(date: string, startHour: number) {
    setError("");
    const body: Record<string, unknown> = { date, startHour };
    if (isAdmin && selectedUserId) {
      body.userId = selectedUserId;
    }

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    refresh();
  }

  async function handleCancel(id: string) {
    const res = await fetch(`/api/appointments?id=${id}`, { method: "DELETE" });
    if (res.ok) refresh();
  }

  function changeWeek(offset: number) {
    setMonday((m) => addDays(m, offset * 7));
  }

  function goToday() {
    setMonday(getMonday(new Date()));
  }

  const todayStr = toDateStr(new Date());
  const canBook = isAdmin ? !!selectedUserId : !!category;

  const selectedUser = users.find((u) => u.id === selectedUserId);
  const bookingCategory = isAdmin
    ? selectedUser?.category ?? ""
    : category;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => changeWeek(-1)}
          className="rounded border border-zinc-300 px-2 py-1.5 text-xs sm:px-3 sm:text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          &larr; {t.prev}
        </button>
        <button
          type="button"
          onClick={goToday}
          className="rounded border border-zinc-300 px-2 py-1.5 text-xs sm:px-3 sm:text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          {t.today}
        </button>
        <button
          type="button"
          onClick={() => changeWeek(1)}
          className="rounded border border-zinc-300 px-2 py-1.5 text-xs sm:px-3 sm:text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          {t.next} &rarr;
        </button>

        {isAdmin && (
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full rounded border border-zinc-300 px-2 py-1.5 text-xs sm:ml-auto sm:w-auto sm:px-3 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">{t.selectUserToBook}</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.category || t.noCategory})
              </option>
            ))}
          </select>
        )}

        <span className="flex items-center gap-2">
          {isAdmin && (
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              Admin
            </span>
          )}
          {!isAdmin && category && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium capitalize dark:bg-zinc-800">
              {category}
            </span>
          )}
        </span>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {loading ? (
        <p className="py-8 text-center text-zinc-500">{t.loading}</p>
      ) : (
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <div className="min-w-[600px] sm:min-w-0">
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <th className="w-14 px-1 py-2 text-left font-medium text-zinc-500 sm:w-24 sm:px-2">
                  Time
                </th>
                {weekDays.map((day, i) => {
                  const dateStr = toDateStr(day);
                  const isToday = dateStr === todayStr;
                  return (
                    <th
                      key={i}
                      className={`px-1 py-2 text-center font-medium sm:px-2 ${
                        isToday
                          ? "text-zinc-900 dark:text-zinc-100"
                          : "text-zinc-500"
                      }`}
                    >
                      <div>{DAY_LABELS[i]}</div>
                      <div
                        className={`text-xs ${
                          isToday
                            ? "inline-block rounded-full bg-zinc-900 px-1.5 text-white dark:bg-zinc-100 dark:text-zinc-900"
                            : ""
                        }`}
                      >
                        {formatShortDate(day)}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((hour) => (
                <tr
                  key={hour}
                  className="border-b border-zinc-100 dark:border-zinc-800/50"
                >
                  <td className="px-1 py-1 font-mono text-xs text-zinc-400 sm:px-2 sm:py-1.5">
                    {formatHour(hour)}
                  </td>
                  {weekDays.map((day, i) => {
                    const dateStr = toDateStr(day);
                    const isToday = dateStr === todayStr;
                    return (
                      <SlotCell
                        key={i}
                        isToday={isToday}
                        userId={userId}
                        bookingCategory={bookingCategory}
                        isAdmin={isAdmin}
                        canBook={canBook}
                        appointments={appointments.filter(
                          (a) =>
                            a.date === dateStr && a.start_hour === hour
                        )}
                        onBook={() => handleBook(dateStr, hour)}
                        onCancel={handleCancel}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-blue-100 dark:bg-blue-900" />
          {t.groupMax(MAX_GROUP)}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-purple-100 dark:bg-purple-900" />
          {t.individualOnly}
        </span>
      </div>
    </div>
  );
}

function SlotCell({
  isToday,
  userId,
  bookingCategory,
  isAdmin,
  canBook,
  appointments,
  onBook,
  onCancel,
}: {
  isToday: boolean;
  userId: string;
  bookingCategory: string;
  isAdmin: boolean;
  canBook: boolean;
  appointments: Appointment[];
  onBook: () => void;
  onCancel: (id: string) => void;
}) {
  const myBooking = appointments.find((a) => a.user_id === userId);
  const hasIndividual = appointments.some((a) => a.category === "individual");
  const groupCount = appointments.filter(
    (a) => a.category === "group"
  ).length;

  const slotFull =
    hasIndividual ||
    (bookingCategory === "individual" && appointments.length > 0) ||
    groupCount >= MAX_GROUP;

  const userCanBook = canBook && (isAdmin || !myBooking) && !slotFull;
  const isEmpty = appointments.length === 0;

  let bgClass = "";
  if (!isAdmin && myBooking) {
    bgClass =
      myBooking.category === "individual"
        ? "bg-purple-50 dark:bg-purple-950/40"
        : "bg-blue-50 dark:bg-blue-950/40";
  } else if (hasIndividual) {
    bgClass = "bg-purple-50/50 dark:bg-purple-950/20";
  } else if (groupCount > 0) {
    bgClass = "bg-blue-50/50 dark:bg-blue-950/20";
  } else if (isToday) {
    bgClass = "bg-zinc-50/50 dark:bg-zinc-900/20";
  }

  return (
    <td
      className={`relative px-1 py-1 text-center align-top ${bgClass} ${
        isToday ? "border-x border-zinc-200 dark:border-zinc-700" : ""
      }`}
    >
      {isEmpty && userCanBook && (
        <button
          type="button"
          onClick={onBook}
          className="flex h-10 w-full items-center justify-center rounded text-xs text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          +
        </button>
      )}

      {isEmpty && !userCanBook && (
        <div className="flex h-10 items-center justify-center text-xs text-zinc-300 dark:text-zinc-700">
          &mdash;
        </div>
      )}

      {!isEmpty && (
        <div className="space-y-0.5">
          {appointments.map((a) => (
            <div
              key={a.id}
              className={`flex items-center justify-between rounded px-1 py-0.5 text-xs ${
                a.category === "individual"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
              }`}
            >
              <span className="truncate">{a.user_name}</span>
              {(a.user_id === userId || isAdmin) && (
                <button
                  type="button"
                  onClick={() => onCancel(a.id)}
                  className="ml-1 shrink-0 text-red-500 hover:text-red-700"
                  title={t.cancel}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          {userCanBook && (
            <button
              type="button"
              onClick={onBook}
              className="w-full rounded py-0.5 text-xs text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
              +
            </button>
          )}
        </div>
      )}
    </td>
  );
}
