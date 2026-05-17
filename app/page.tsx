import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-32">
      <h1 className="text-4xl font-bold tracking-tight">
        Your notes, simple.
      </h1>
      <p className="mt-4 max-w-md text-center text-lg text-zinc-600 dark:text-zinc-400">
        Create, edit, and share rich-text notes. No clutter, no fuss.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/signup"
          className="rounded bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
