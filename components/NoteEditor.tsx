"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorToolbar } from "./EditorToolbar";
import { useCallback, useRef, useEffect } from "react";

type NoteEditorProps = {
  initialContent: string;
  onUpdate: (json: Record<string, unknown>) => void;
};

export function NoteEditor({ initialContent, onUpdate }: NoteEditorProps) {
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  const content = (() => {
    try {
      return JSON.parse(initialContent);
    } catch {
      return { type: "doc", content: [{ type: "paragraph" }] };
    }
  })();

  const handleUpdate = useCallback(
    ({ editor }: { editor: import("@tiptap/core").Editor }) => {
      onUpdateRef.current(editor.getJSON() as Record<string, unknown>);
    },
    []
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
    ],
    content,
    onUpdate: handleUpdate,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert max-w-none p-4 min-h-[300px] outline-none",
      },
    },
  });

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
