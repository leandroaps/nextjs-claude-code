export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getNotesByUser } from "@/lib/notes";
import { NoteList } from "@/components/NoteList";
import { CreateNoteButton } from "@/components/CreateNoteButton";
import { t } from "@/lib/i18n";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const notes = getNotesByUser(session.user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t.yourNotes}</h1>
        <CreateNoteButton />
      </div>
      <div className="mt-6">
        <NoteList notes={notes} />
      </div>
    </div>
  );
}
