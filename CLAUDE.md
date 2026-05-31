# CLAUDE.md
@AGENTS.md

This is a changelog and notification widget SaaS. The frontend is open source;
the backend (API routes, database, email) lives in a private repository.

For architectural context on new features, schema changes, or the content model,
reference @docs/ARCHITECTURE.md before proceeding.

---

## Stack

Next.js 15 (App Router) · TypeScript strict · Base UI · CSS Modules ·
Motion · Tiptap (minimal) · TanStack Query · Prisma + PostgreSQL · AWS SES

Full stack rationale and decision notes in @docs/ARCHITECTURE.md.

---

## Hard Rules

**Styling**
- CSS Modules only. Inline styles for dynamic values only.
- Class names use camelCase in the `.module.css` file.
- CSS custom properties for all design tokens (colors, spacing, radii, durations).

**TypeScript**
- Strict mode is on. No `any`, no `as unknown as X` workarounds.
- All API responses have a typed schema. Use Zod for runtime validation.
- Shared types live in `/types`. Never duplicate a type.

**Data Fetching**
- Every mutation uses TanStack Query with optimistic updates. No exceptions.
  Roll back on error. No spinners on actions the user initiates.
- Queries use `stale-while-revalidate`. Never show a loading skeleton for
  data the user has already seen.

**Editor**
- Tiptap stores content as a **markdown string**, not Tiptap JSON.
- Only import the extensions listed in ARCHITECTURE.md. Do not add extensions
  without checking the bundle size impact first.

**Animation**
- Only animate `transform` and `opacity`. Never animate `height`, `width`,
  `margin`, or `padding` — these trigger layout recalculation.
- Duration limits: micro-interactions ≤ 120ms, panels/modals ≤ 250ms.

**Imports**
- Absolute imports from `@/` for everything inside `/src`.
- No default exports from component files — named exports only.

---

## Behavioral Guidelines

**Before coding:** State assumptions explicitly. If multiple interpretations
exist, present them — don't pick silently. If something is unclear, stop and ask.

**Simplicity:** Write the minimum code that solves the problem. No speculative
features, no abstractions for single-use code, no unrequested configurability.
If it could be 50 lines instead of 200, rewrite it.

**Surgical edits:** Touch only what the task requires. Don't refactor adjacent
code, don't "improve" formatting, don't remove pre-existing dead code unless
asked. Every changed line should trace directly to the request. Clean up only
imports/variables that YOUR changes made unused.

**Verify:** For multi-step tasks, state a short plan with explicit success
criteria before starting. Loop until each step is verified, not just implemented.

---

## Anti-Patterns

- Do not suggest Tailwind, shadcn/ui, or styled-components.
- Do not add dependencies to the widget build. See `/widget/CLAUDE.md`.
- Do not store Tiptap JSON in the database — always markdown.
- Do not add Tiptap extensions beyond the approved list without explicit approval.
- Do not use `useEffect` for data fetching — use TanStack Query.
- Do not use Next.js `<Image>` for user-uploaded images without confirming
  the CDN setup is in place.
