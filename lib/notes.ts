import { nanoid } from "nanoid";
import { query, get, run } from "./db";

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content_json: string;
  is_public: number;
  public_slug: string | null;
  created_at: string;
  updated_at: string;
};

export type NoteListItem = {
  id: string;
  title: string;
  is_public: number;
  updated_at: string;
};

const EMPTY_DOC = JSON.stringify({
  type: "doc",
  content: [{ type: "paragraph" }],
});

export function createNote(
  userId: string,
  data?: { title?: string; contentJson?: string }
): Note {
  const id = nanoid();
  const title = data?.title || "Untitled note";
  const contentJson = data?.contentJson || EMPTY_DOC;

  run(
    "INSERT INTO notes (id, user_id, title, content_json) VALUES (?, ?, ?, ?)",
    [id, userId, title, contentJson]
  );

  return get<Note>("SELECT * FROM notes WHERE id = ?", [id])!;
}

export function getNoteById(userId: string, noteId: string): Note | undefined {
  return get<Note>("SELECT * FROM notes WHERE id = ? AND user_id = ?", [
    noteId,
    userId,
  ]);
}

export function getNotesByUser(userId: string): NoteListItem[] {
  return query<NoteListItem>(
    "SELECT id, title, is_public, updated_at FROM notes WHERE user_id = ? ORDER BY updated_at DESC",
    [userId]
  );
}

export function updateNote(
  userId: string,
  noteId: string,
  data: { title?: string; contentJson?: string }
): Note | undefined {
  const existing = getNoteById(userId, noteId);
  if (!existing) return undefined;

  const title = data.title ?? existing.title;
  const contentJson = data.contentJson ?? existing.content_json;

  run(
    "UPDATE notes SET title = ?, content_json = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?",
    [title, contentJson, noteId, userId]
  );

  return get<Note>("SELECT * FROM notes WHERE id = ?", [noteId]);
}

export function deleteNote(userId: string, noteId: string): boolean {
  const existing = getNoteById(userId, noteId);
  if (!existing) return false;

  run("DELETE FROM notes WHERE id = ? AND user_id = ?", [noteId, userId]);
  return true;
}

export function setNotePublic(
  userId: string,
  noteId: string,
  isPublic: boolean
): Note | undefined {
  const existing = getNoteById(userId, noteId);
  if (!existing) return undefined;

  if (isPublic) {
    const slug = existing.public_slug || nanoid(16);
    run(
      "UPDATE notes SET is_public = 1, public_slug = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?",
      [slug, noteId, userId]
    );
  } else {
    run(
      "UPDATE notes SET is_public = 0, public_slug = NULL, updated_at = datetime('now') WHERE id = ? AND user_id = ?",
      [noteId, userId]
    );
  }

  return get<Note>("SELECT * FROM notes WHERE id = ?", [noteId]);
}

export function getNoteByPublicSlug(slug: string): Note | undefined {
  return get<Note>(
    "SELECT * FROM notes WHERE public_slug = ? AND is_public = 1",
    [slug]
  );
}
