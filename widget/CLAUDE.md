# CLAUDE.md — Widget

This directory is a **completely separate build** from the Next.js app.
It compiles to a single vanilla JavaScript file loaded by customers via
a `<script>` tag. It has nothing to do with React or Next.js.

---

## Absolute Constraints

- **Zero npm dependencies at runtime.** No React, no libraries, nothing.
  All code must be vanilla TypeScript compiled to plain JS.
- **Bundle target: under 30kb gzipped.** Check with `npm run build:widget`
  before submitting any PR that adds code here.
- **No framework patterns.** No JSX, no hooks, no component abstractions
  that mimic React. Write direct DOM manipulation.

---

## What This Widget Does

1. Renders a launcher button (badge with unread count) in the host page.
2. On click, opens a slide-in panel showing recent announcements.
3. Fetches announcement data from the public API endpoint.
4. Marks items as read using localStorage keyed to the workspace slug.

---

## API Contract

The widget talks to one endpoint only:

```
GET /api/widget/:workspaceSlug/announcements
```

Response is a flat JSON array — no pagination at v1. The widget never
writes data except to localStorage.

---

## Isolation Rules

- The widget must not pollute the global scope. Everything lives inside
  an IIFE or a module wrapper.
- All CSS is injected as a `<style>` tag at runtime. Class names are
  prefixed with `cl-` to avoid collisions with host page styles.
- The widget must not break if `window.localStorage` is unavailable
  (private browsing, iframe restrictions). Fail silently.
