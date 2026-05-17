export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getNoteById } from "@/lib/notes";
import { NoteEditorPage } from "@/components/NoteEditorPage";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { id } = await params;
  const note = getNoteById(session.user.id, id);
  if (!note) notFound();

  return (
    <NoteEditorPage
      note={{
        id: note.id,
        title: note.title,
        contentJson: note.content_json,
        isPublic: note.is_public === 1,
        publicSlug: note.public_slug,
      }}
    />
  );
}
