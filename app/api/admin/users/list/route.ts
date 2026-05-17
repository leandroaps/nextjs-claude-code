import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { query } from "@/lib/db";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = query<{ id: string; name: string; category: string | null }>(
    `SELECT u.id, u.name, p.category
     FROM user u
     LEFT JOIN profile p ON p.user_id = u.id
     WHERE u.role != 'admin'
     ORDER BY u.name`
  );

  return NextResponse.json(users);
}
