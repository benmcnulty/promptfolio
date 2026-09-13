# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router routes, layouts, API (`app/api/*/route.ts`).
- `components/`: Reusable React components (UI built on Radix + Tailwind).
- `lib/`: Data and utilities (`lib/catalog.ts`, `lib/blog.ts`, `lib/types.ts`).
- `public/`: Static assets and thumbnails served at root paths.
- `styles/`: Global CSS and Tailwind setup.  `utils/`: helpers (e.g., `cn`).

## Build, Test, and Development Commands
- Use Node 22 and npm. Run all commands from this directory.
- `npm run dev`: Start the loopback-only development server.
- `npm run build`: Production build (compiles TS, bundles pages, MDX).
- `npm start`: Start production server from `.next`.
- `npm run lint`: Run the explicit ESLint flat configuration.
- `npm run typecheck`: Check TypeScript without emitting files.
- `npm test`: Run deterministic Jest tests.
- `npm run test:e2e`: Run production-build Playwright journeys.
- `npm run check`: Run lint, types, unit tests, and production build.
- Example API checks: `curl http://localhost:3000/api/time` or `/api/listing`.

## Coding Style & Naming Conventions
- **Language**: TypeScript (strict). Prefer explicit types for public APIs.
- **Formatting**: 2-space indent and trailing commas where valid. Match the surrounding quote style and keep diffs focused.
- **Components**: PascalCase file and export (e.g., `components/Hero.tsx`).
- **Hooks**: `useX` prefix (e.g., `useFeatureFlag`).
- **Routes & folders**: lower‑case segment dirs in `app/`; Next pages as `page.tsx`.
- **Styling**: Tailwind classes + `cn()` helper; keep variants in component.

## Testing Guidelines
- Add Jest/Testing Library coverage for logic and components and Playwright coverage for user-visible behavior.
- Preserve public routes, catalog ordering, article URLs, and API response shapes.
- Treat screenshot changes as review artifacts; do not update baselines to hide an unexplained change.
- Keep external ChatGPT availability out of deterministic CI.

## Next.js guidance
- This project uses Next.js 16. Read the version-matched upgrade and App Router documentation before framework-level changes.
- Prefer Server Components and static rendering. Add `use client` only around interactive boundaries.

## Commit & Pull Request Guidelines
- **Commits**: Imperative mood; keep focused. Conventional commit prefixes encouraged (`feat:`, `fix:`, `chore:`), but not mandatory.
- **PRs**: Include scope/intent, before/after screenshots for UI, steps to validate, and linked issue (if any). Ensure `npm run lint` passes and the app builds.

## Security & Configuration Tips
- Do not commit secrets. Use `.env.local` for runtime env and reference via `process.env`.
- Security headers are set in `next.config.mjs`. Keep additions idempotent and minimal.
- Images go in `public/`; prefer WebP/AVIF as configured.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
