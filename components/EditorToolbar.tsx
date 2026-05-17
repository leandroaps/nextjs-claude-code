"use client";

import type { Editor } from "@tiptap/react";

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const btn =
    "rounded px-2 py-1 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30";
  const active = "bg-zinc-200 dark:bg-zinc-700";

  return (
    <div className="flex flex-wrap gap-1 border-b border-zinc-200 p-2 dark:border-zinc-800">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${btn} ${editor.isActive("bold") ? active : ""} font-bold`}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${btn} ${editor.isActive("italic") ? active : ""} italic`}
      >
        I
      </button>

      <div className="mx-1 w-px bg-zinc-200 dark:bg-zinc-700" />

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={`${btn} ${editor.isActive("heading", { level: 1 }) ? active : ""}`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={`${btn} ${editor.isActive("heading", { level: 2 }) ? active : ""}`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        className={`${btn} ${editor.isActive("heading", { level: 3 }) ? active : ""}`}
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`${btn} ${editor.isActive("paragraph") && !editor.isActive("heading") ? active : ""}`}
      >
        P
      </button>

      <div className="mx-1 w-px bg-zinc-200 dark:bg-zinc-700" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${btn} ${editor.isActive("bulletList") ? active : ""}`}
      >
        List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`${btn} ${editor.isActive("code") ? active : ""} font-mono`}
      >
        Code
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`${btn} ${editor.isActive("codeBlock") ? active : ""}`}
      >
        Block
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btn}
      >
        HR
      </button>
    </div>
  );
}
