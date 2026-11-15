<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Recetario

Recetario is a Next.js 16 App Router app for browsing recipes. Source lives in `src/app`; the README is stock `create-next-app` boilerplate and still points at `app/page.tsx`.

## Commands

- `npm run dev` — Turbopack dev server on http://localhost:3000.
- `npm run build` — production build; the real check for Cache Components prerender errors.
- `npm run lint` — ESLint flat config. Single file: `npx eslint src/app/page.tsx`.
- Typecheck: `npx next typegen && npx tsc --noEmit`. No `typecheck` script exists, and route typings come from generated `.next/types`.
- No test runner or test script is configured.
- PowerShell may block `npm.ps1`/`npx.ps1` on this Windows setup; use `npm.cmd`/`npx.cmd` or `cmd /c "npm ..."` if that happens.

## Stack

- Next.js 16.4.6, React 19, TypeScript strict, App Router under `src/`.
- `@/*` maps to `src/*`.
- Tailwind CSS v4 is wired through the `@tailwindcss/turbopack` rule in `next.config.ts`. There is no `postcss.config.*` or `tailwind.config.*`; put theme tokens in `src/app/globals.css` using `@theme`. Do not switch to `--webpack` — that Tailwind loader only exists for Turbopack.

## Project rules (required)

- App Router only, under `src/app`. Never add `pages/` or `src/pages/`.
- Server Components are the default. Add `"use client"` only to the smallest component that needs state, effects, event handlers, or browser APIs. `error.tsx` is the required exception: it must be a Client Component.
- TypeScript is strict: no `any`. Put shared domain types in `src/types/`; use `unknown` plus narrowing for untrusted data.
- Style with Tailwind utilities only, mobile-first and responsive. Keep global CSS limited to `src/app/globals.css` (Tailwind import, `@theme` tokens, base rules); no CSS Modules or CSS-in-JS.
- Every data-backed route must provide its own `loading.tsx` and `error.tsx` in that route segment.
- Secrets and environment-specific config go in `.env.local` (gitignored). Document every variable with placeholders and no real values in `.env.example`. `.gitignore` currently ignores `.env*`, so add a `!.env.example` exception (or `git add -f`) when creating it.
- Before writing code, state the intended change in 3–5 lines.

## Routes and data flow

- Target routes: `/`, `/recetas`, `/recetas/[id]`, `/favoritos`, `/acerca`.
- The data source is TheMealDB. Client components must not call TheMealDB directly; browser requests go to our own Route Handlers under `src/app/api/...`, which call TheMealDB server-side.

## Next 16 constraints in this repo

- `cacheComponents: true` and `partialPrefetching: true` are enabled. Do not add route segment exports `dynamic`, `revalidate`, `fetchCache`, `dynamicParams`, `runtime`, or `experimental_ppr`; they error. Cache with `"use cache"` + `cacheLife`, and wrap `cookies()`, `headers()`, or `searchParams` reads in `<Suspense>`.
- When using `generateStaticParams`, return at least one param; an empty array errors under Cache Components.
- `params` and `searchParams` are Promises. Prefer the generated global `PageProps<'/route'>`, `LayoutProps<'/'>`, and `RouteContext` helpers over handwritten prop types; run `next typegen` if they are missing.
- Turbopack is the default for both `next dev` and `next build`; don't add webpack config.
- `next-env.d.ts` is generated and gitignored. Do not edit or commit it.
