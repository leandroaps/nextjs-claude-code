import { NextResponse } from "next/server";
import { requireAdmin, listAllUsers } from "@/lib/admin";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = listAllUsers();
  return NextResponse.json(users);
}
