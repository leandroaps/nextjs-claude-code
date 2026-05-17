import { nanoid } from "nanoid";
import { query, get, run } from "./db";

export type Appointment = {
  id: string;
  user_id: string;
  date: string;
  start_hour: number;
  category: string;
  created_at: string;
};

export type AppointmentWithUser = Appointment & {
  user_name: string;
};

export const SLOTS = Array.from({ length: 13 }, (_, i) => 7 + i);

export const MAX_GROUP_PER_SLOT = 3;

export function getAppointmentsByDate(date: string): AppointmentWithUser[] {
  return query<AppointmentWithUser>(
    `SELECT a.*, u.name as user_name
     FROM appointments a
     JOIN user u ON u.id = a.user_id
     WHERE a.date = ?
     ORDER BY a.start_hour`,
    [date]
  );
}

export function getAppointmentsByDateRange(
  from: string,
  to: string
): AppointmentWithUser[] {
  return query<AppointmentWithUser>(
    `SELECT a.*, u.name as user_name
     FROM appointments a
     JOIN user u ON u.id = a.user_id
     WHERE a.date >= ? AND a.date <= ?
     ORDER BY a.date, a.start_hour`,
    [from, to]
  );
}

export function getUserAppointmentsByDate(
  userId: string,
  date: string
): AppointmentWithUser[] {
  return query<AppointmentWithUser>(
    `SELECT a.*, u.name as user_name
     FROM appointments a
     JOIN user u ON u.id = a.user_id
     WHERE a.user_id = ? AND a.date = ?
     ORDER BY a.start_hour`,
    [userId, date]
  );
}

export function getUserAppointmentsByDateRange(
  userId: string,
  from: string,
  to: string
): AppointmentWithUser[] {
  return query<AppointmentWithUser>(
    `SELECT a.*, u.name as user_name
     FROM appointments a
     JOIN user u ON u.id = a.user_id
     WHERE a.user_id = ? AND a.date >= ? AND a.date <= ?
     ORDER BY a.date, a.start_hour`,
    [userId, from, to]
  );
}

export function countUserAppointmentsInWeek(
  userId: string,
  date: string
): number {
  const d = new Date(date + "T12:00:00");
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const mondayStr = monday.toISOString().split("T")[0];
  const fridayStr = friday.toISOString().split("T")[0];

  const result = get<{ count: number }>(
    "SELECT COUNT(*) as count FROM appointments WHERE user_id = ? AND date >= ? AND date <= ?",
    [userId, mondayStr, fridayStr]
  );
  return result?.count ?? 0;
}

function getSlotAppointments(date: string, startHour: number): Appointment[] {
  return query<Appointment>(
    "SELECT * FROM appointments WHERE date = ? AND start_hour = ?",
    [date, startHour]
  );
}

export function bookAppointment(
  userId: string,
  date: string,
  startHour: number,
  category: string
): Appointment {
  const existing = getSlotAppointments(date, startHour);

  if (existing.some((a) => a.category === "individual")) {
    throw new Error("This slot has an individual booking");
  }

  if (category === "individual" && existing.length > 0) {
    throw new Error("This slot already has bookings");
  }

  if (category === "group" && existing.length >= MAX_GROUP_PER_SLOT) {
    throw new Error("This slot is full");
  }

  const id = nanoid();
  run(
    "INSERT INTO appointments (id, user_id, date, start_hour, category) VALUES (?, ?, ?, ?, ?)",
    [id, userId, date, startHour, category]
  );
  return get<Appointment>("SELECT * FROM appointments WHERE id = ?", [id])!;
}

export function cancelAppointment(userId: string, appointmentId: string): boolean {
  const existing = get<Appointment>(
    "SELECT * FROM appointments WHERE id = ? AND user_id = ?",
    [appointmentId, userId]
  );
  if (!existing) return false;

  run("DELETE FROM appointments WHERE id = ? AND user_id = ?", [
    appointmentId,
    userId,
  ]);
  return true;
}

export function adminCancelAppointment(appointmentId: string): boolean {
  const existing = get<Appointment>(
    "SELECT * FROM appointments WHERE id = ?",
    [appointmentId]
  );
  if (!existing) return false;

  run("DELETE FROM appointments WHERE id = ?", [appointmentId]);
  return true;
}

export function hasIndividualBooking(date: string, startHour: number): boolean {
  const existing = get<{ count: number }>(
    "SELECT COUNT(*) as count FROM appointments WHERE date = ? AND start_hour = ? AND category = 'individual'",
    [date, startHour]
  );
  return (existing?.count ?? 0) > 0;
}
