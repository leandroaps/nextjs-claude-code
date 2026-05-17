"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function PublicNoteViewer({ contentJson }: { contentJson: string }) {
  const content = (() => {
    try {
      return JSON.parse(contentJson);
    } catch {
      return { type: "doc", content: [{ type: "paragraph" }] };
    }
  })();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
    ],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert max-w-none",
      },
    },
  });

  return <EditorContent editor={editor} />;
}
