import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createNote, getNotesByUser } from "@/lib/notes";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notes = getNotesByUser(session.user.id);
  return NextResponse.json(notes);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const note = createNote(session.user.id, {
    title: body.title,
    contentJson:
      body.contentJson != null ? JSON.stringify(body.contentJson) : undefined,
  });

  return NextResponse.json(note, { status: 201 });
}
