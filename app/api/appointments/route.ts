import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getProfile } from "@/lib/profile";
import { get } from "@/lib/db";
import {
  getAppointmentsByDate,
  getAppointmentsByDateRange,
  getUserAppointmentsByDate,
  getUserAppointmentsByDateRange,
  bookAppointment,
  cancelAppointment,
  adminCancelAppointment,
  countUserAppointmentsInWeek,
  SLOTS,
} from "@/lib/appointments";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

function isAdmin(userId: string): boolean {
  const user = get<{ role: string }>("SELECT role FROM user WHERE id = ?", [userId]);
  return user?.role === "admin";
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const admin = isAdmin(session.user.id);

  if (from && to) {
    const appointments = admin
      ? getAppointmentsByDateRange(from, to)
      : getUserAppointmentsByDateRange(session.user.id, from, to);
    return NextResponse.json(appointments);
  }

  if (date) {
    const appointments = admin
      ? getAppointmentsByDate(date)
      : getUserAppointmentsByDate(session.user.id, date);
    return NextResponse.json(appointments);
  }

  return NextResponse.json({ error: "date or from/to is required" }, { status: 400 });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { date, startHour } = body;

  if (!date || startHour == null || !SLOTS.includes(startHour)) {
    return NextResponse.json({ error: "Invalid date or time slot" }, { status: 400 });
  }

  const dayOfWeek = new Date(date + "T12:00:00").getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return NextResponse.json({ error: "Classes are only available on weekdays" }, { status: 400 });
  }

  const admin = isAdmin(session.user.id);
  const targetUserId = admin && body.userId ? body.userId : session.user.id;

  const profile = getProfile(targetUserId);
  const category = profile?.category;
  if (!category || (category !== "group" && category !== "individual")) {
    return NextResponse.json(
      { error: admin ? "This user has no class category set" : "Set your class category in your profile first" },
      { status: 400 }
    );
  }

  const weeklyLimit = profile.weekly_appointments ?? 1;
  const currentCount = countUserAppointmentsInWeek(targetUserId, date);
  if (currentCount >= weeklyLimit) {
    const userName = admin
      ? get<{ name: string }>("SELECT name FROM user WHERE id = ?", [targetUserId])?.name ?? "User"
      : "You";
    return NextResponse.json(
      { error: `${userName} has reached the weekly limit of ${weeklyLimit} class${weeklyLimit > 1 ? "es" : ""}` },
      { status: 409 }
    );
  }

  try {
    const appointment = bookAppointment(targetUserId, date, startHour, category);
    return NextResponse.json(appointment, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Booking failed";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const admin = isAdmin(session.user.id);
  const deleted = admin
    ? adminCancelAppointment(id)
    : cancelAppointment(session.user.id, id);

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
