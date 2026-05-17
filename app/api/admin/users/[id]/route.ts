import { NextResponse } from "next/server";
import {
  requireAdmin,
  getUserById,
  updateUserRole,
  updateUserDetails,
  adminUpsertProfile,
  deleteUser,
} from "@/lib/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const user = getUserById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  if (body.role) {
    updateUserRole(id, body.role);
  }

  updateUserDetails(id, { name: body.name, email: body.email });

  adminUpsertProfile(id, {
    address: body.address,
    city: body.city,
    telephone: body.telephone,
    mobile: body.mobile,
    age: body.age != null ? Number(body.age) : undefined,
    gender: body.gender,
    category: body.category,
    weekly_appointments: body.weekly_appointments != null ? Number(body.weekly_appointments) : undefined,
    plan_type: body.plan_type,
  });

  const updated = getUserById(id);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json(
      { error: "Cannot delete your own account" },
      { status: 400 }
    );
  }

  deleteUser(id);
  return new NextResponse(null, { status: 204 });
}
