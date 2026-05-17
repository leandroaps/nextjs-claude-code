"use client";

import Link from "next/link";

type NoteItem = {
  id: string;
  title: string;
  is_public: number;
  updated_at: string;
};

export function NoteList({ notes }: { notes: NoteItem[] }) {
  if (notes.length === 0) {
    return (
      <p className="py-12 text-center text-zinc-500">
        No notes yet. Create your first note!
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {notes.map((note) => (
        <li key={note.id}>
          <Link
            href={`/notes/${note.id}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{note.title}</p>
              <p className="text-sm text-zinc-500">
                {new Date(note.updated_at + "Z").toLocaleDateString()}
              </p>
            </div>
            {note.is_public === 1 && (
              <span className="ml-3 shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                Public
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
