Next.js + Bun starter tailored for rapid local development and small deployments.

Quick overview

- **Stack:** Next.js (App Router) + TypeScript + Bun runtime (optional) + Tailwind CSS
- **Runtime:** Built to run on Bun, also works on Node.js
- **Package manager:** pnpm (recommended), npm/yarn supported

Quick start

1. Install dependencies (pnpm recommended):

```bash
pnpm install
```

1. Run the dev server (Bun recommended):

```bash
# with bun
bun run dev

# or with pnpm / npm
pnpm dev
# or
npm run dev
```

Open <http://localhost:3000> in your browser.

Build & checks

```bash
# Build for production (Bun)
bun run build

# Type check
npx tsc --noEmit

# Lint
pnpm lint
```

Project conventions & notes

- Uses the Next.js App Router; pages live under `app/`.
- Auth is provided by `better-auth` (see `app/api/auth/[...all]/route.ts`).
- SQLite (via `bun:sqlite`) is used for local persistence; DB helper is in `lib/db.ts`.
- TipTap is used for rich text note content (stored as JSON in the DB).
- Auto-save and optimistic UI patterns are used in the note editor components.

Where to look

- App entry & routes: `app/`
- Components: `components/`
- Server helpers & DB: `lib/`
- API routes: `app/api/`

Helpful commands

```bash
# Start dev server
bun run dev

# Run lint
pnpm lint

# Type check
npx tsc --noEmit
```

Support & learning

See the repository `CLAUDE.md` for project-specific developer notes and conventions. For Next.js docs, visit <https://nextjs.org/docs>.

Contributions

PRs and issues are welcome — open a PR against `main` with a clear description of changes.

License

This project does not include a license file. Add one if you plan to publish or share the code.
