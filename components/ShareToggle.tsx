"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";

type ShareToggleProps = {
  noteId: string;
  isPublic: boolean;
  publicSlug: string | null;
};

export function ShareToggle({
  noteId,
  isPublic: initialIsPublic,
  publicSlug: initialSlug,
}: ShareToggleProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [publicSlug, setPublicSlug] = useState(initialSlug);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch(`/api/notes/${noteId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !isPublic }),
    });

    if (res.ok) {
      const data = await res.json();
      setIsPublic(data.isPublic);
      setPublicSlug(data.publicSlug);
    }
    setLoading(false);
  }

  const publicUrl =
    isPublic && publicSlug
      ? `${window.location.origin}/p/${publicSlug}`
      : null;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors disabled:opacity-50 ${
          isPublic ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
            isPublic ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <span className="text-sm">
        {isPublic ? t.public : t.private}
      </span>
      {publicUrl && (
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(publicUrl)}
          className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
        >
          {t.copyLink}
        </button>
      )}
    </div>
  );
}
