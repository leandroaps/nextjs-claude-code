export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getNoteByPublicSlug } from "@/lib/notes";
import { PublicNoteViewer } from "@/components/PublicNoteViewer";

export default async function PublicNotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNoteByPublicSlug(slug);
  if (!note) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{note.title}</h1>
      <PublicNoteViewer contentJson={note.content_json} />
    </div>
  );
}
