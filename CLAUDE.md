# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

We are building the app described in the @SPEC.MD. Read the file for general architectural tasks or to double-check the exact database structure, tech stack or application architecture.

Keep your replies extremely concise and focus on conveying the key information. No unnecessary fluff, no long code snippets.

## Commands

- **Dev server:** `bun run dev` (runs on http://localhost:3000)
- **Build:** `bun run build`
- **Lint:** `pnpm lint` (runs `eslint` with flat config)
- **Type check:** `npx tsc --noEmit`
- No test framework is configured yet.

## Tech Stack

- Next.js 16 with App Router (React 19), Bun runtime
- TypeScript (strict mode)
- Tailwind CSS v4 + `@tailwindcss/typography` for prose rendering
- pnpm for package management, bun for runtime (`bun:sqlite` requires bun runtime)
- Tiptap v3 for rich text editing (`@tiptap/react`, `@tiptap/starter-kit`)
- better-auth for authentication
- SQLite via `bun:sqlite` (single file at `data/app.db`, auto-created)
- Zod v4 for schema validation

## Architecture

- Path alias `@/*` maps to project root.
- ESLint uses flat config (`eslint.config.mjs`) with `core-web-vitals` and `typescript`.
- Dark mode via `prefers-color-scheme` (system preference, no toggle).
- All authenticated pages use `export const dynamic = "force-dynamic"` to prevent ISR caching issues with auth checks.

### Data Flow

- `lib/db.ts` — bun:sqlite singleton with `query()`, `get()`, `run()` helpers. Auto-initializes all tables (better-auth + app tables) on first access. WAL mode + foreign keys enabled.
- `lib/auth.ts` — `betterAuth()` server config with `nextCookies()` plugin. Exports `auth` instance used in API routes and server components.
- `lib/auth-client.ts` — `createAuthClient()` for client-side React auth (session hooks, signIn/signUp/signOut).
- `lib/notes.ts` — Note repository with raw SQL functions scoped by `user_id`. All CRUD + sharing logic.
- `lib/profile.ts` — User profile repository with upsert pattern (insert-or-update). Profile `category` (Group/Individual) gates appointment booking.
- `lib/appointments.ts` — Appointment booking with conflict checking. 13 hourly slots (7am–7pm). Individual bookings block the slot; group bookings can coexist.

### API Routes

- `app/api/auth/[...all]/route.ts` — better-auth catch-all handler
- `app/api/notes/route.ts` — GET (list), POST (create)
- `app/api/notes/[id]/route.ts` — GET, PUT, DELETE single note
- `app/api/notes/[id]/share/route.ts` — POST toggle public sharing
- `app/api/profile/route.ts` — GET, PUT user profile
- `app/api/appointments/route.ts` — GET (by date), POST (book), DELETE (cancel)

### Pages

- `/` — Landing page
- `/login`, `/signup` — Auth pages (route group `(auth)`)
- `/dashboard` — Authenticated note list (server component, redirects to `/login` if unauthenticated)
- `/notes/[id]` — Note editor (server component loads note, passes to client `NoteEditorPage`)
- `/p/[slug]` — Public read-only note view
- `/profile` — User profile form (contact info, category selection)
- `/agenda` — Appointment scheduling (day-based slot picker)

### Key Patterns

- Auth check in server components: `auth.api.getSession({ headers: await headers() })`
- Auth check in API routes: same pattern, return 401 if null
- Note content stored as stringified TipTap JSON in `content_json` column
- Auto-save with 500ms debounce in the note editor
- Public slugs generated via `nanoid(16)` when sharing is enabled
- Server components load data and pass to client components for interactivity (e.g., `NotePage` → `NoteEditorPage`)
- `AgendaView` uses AbortController to cancel in-flight requests on unmount or date change
