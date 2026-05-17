import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { setNotePublic } from "@/lib/notes";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const note = setNotePublic(session.user.id, id, body.isPublic);

  if (!note) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: note.id,
    isPublic: note.is_public === 1,
    publicSlug: note.public_slug,
  });
}
