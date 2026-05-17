"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";

export function Header() {
  const { data: session, isPending } = authClient.useSession();
  const isAdmin = session?.user?.role === "admin";
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  const linkClass =
    "text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100";

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold">
          {t.appName}
        </Link>

        {isPending ? null : session ? (
          <>
            <nav className="hidden items-center gap-4 sm:flex">
              <Link href="/dashboard" className={linkClass}>{t.dashboard}</Link>
              <Link href="/profile" className={linkClass}>{t.profile}</Link>
              <Link href="/agenda" className={linkClass}>{t.agenda}</Link>
              {isAdmin && (
                <Link href="/admin" className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200">
                  {t.admin}
                </Link>
              )}
              <button type="button" onClick={handleLogout} className={linkClass}>
                {t.logout}
              </button>
            </nav>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded text-zinc-600 hover:bg-zinc-100 sm:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </>
        ) : (
          <nav className="flex items-center gap-4">
            <Link href="/login" className={linkClass}>{t.login}</Link>
            <Link href="/signup" className="rounded bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
              {t.signup}
            </Link>
          </nav>
        )}
      </div>

      {menuOpen && session && (
        <nav className="border-t border-zinc-200 px-4 py-2 sm:hidden dark:border-zinc-800">
          <div className="flex flex-col gap-1">
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="rounded px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
              {t.dashboard}
            </Link>
            <Link href="/profile" onClick={() => setMenuOpen(false)} className="rounded px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
              {t.profile}
            </Link>
            <Link href="/agenda" onClick={() => setMenuOpen(false)} className="rounded px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
              {t.agenda}
            </Link>
            {isAdmin && (
              <Link href="/admin" onClick={() => setMenuOpen(false)} className="rounded px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950">
                {t.admin}
              </Link>
            )}
            <button type="button" onClick={() => { handleLogout(); setMenuOpen(false); }} className="rounded px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
              {t.logout}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
