"use client";

import { useState, useCallback, useRef } from "react";
import { NoteEditor } from "./NoteEditor";
import { ShareToggle } from "./ShareToggle";
import { DeleteNoteButton } from "./DeleteNoteButton";

type NoteData = {
  id: string;
  title: string;
  contentJson: string;
  isPublic: boolean;
  publicSlug: string | null;
};

export function NoteEditorPage({ note }: { note: NoteData }) {
  const [title, setTitle] = useState(note.title);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const save = useCallback(
    (updates: { title?: string; contentJson?: Record<string, unknown> }) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);

      saveTimer.current = setTimeout(async () => {
        setSaving(true);
        await fetch(`/api/notes/${note.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        setSaving(false);
      }, 500);
    },
    [note.id]
  );

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value;
    setTitle(newTitle);
    save({ title: newTitle });
  }

  function handleContentUpdate(json: Record<string, unknown>) {
    save({ contentJson: json });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShareToggle
            noteId={note.id}
            isPublic={note.isPublic}
            publicSlug={note.publicSlug}
          />
          {saving && (
            <span className="text-xs text-zinc-400">Saving...</span>
          )}
        </div>
        <DeleteNoteButton noteId={note.id} />
      </div>

      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Untitled note"
        className="mb-4 w-full border-none bg-transparent text-3xl font-bold outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
      />

      <NoteEditor
        initialContent={note.contentJson}
        onUpdate={handleContentUpdate}
      />
    </div>
  );
}
