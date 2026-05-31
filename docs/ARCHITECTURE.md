# Architecture

Reference document for the changelog and notification widget SaaS.
Pull this into context when making decisions about new features, schema
changes, or anything touching the content model or API contract.

---

## Stack

| Layer          | Technology                        | Notes                                              |
|----------------|-----------------------------------|----------------------------------------------------|
| Framework      | Next.js 16 (App Router)           | Handles admin, public changelog, and API routes    |
| Language       | TypeScript (strict)               | End-to-end, no `any`                               |
| UI Primitives  | Base UI                           | Unstyled; less AI-training coverage than Radix     |
| Styling        | CSS Modules                       | Complete design control; no utility class leakage  |
| Animation      | Motion                            | Disciplined — transform/opacity only               |
| Editor         | Tiptap (minimal)                  | Headless; markdown string storage, not JSON        |
| Data Fetching  | TanStack Query                    | Optimistic mutations throughout admin              |
| ORM            | Prisma + PostgreSQL               | Type-safe queries; migration history in repo       |
| Email          | AWS SES                           | Transactional + announcement sends                 |
| Hosting        | Vercel                            | Frontend only; backend is private                  |
| Widget         | Vanilla TypeScript                | Separate build, zero runtime deps, target <30kb    |

---

## Project Structure

```
/src
  /app
    /(admin)/          # Protected admin routes (layout with auth guard)
    /(public)/         # Public changelog pages (SSG/ISR)
    /api/              # REST API routes (backend repo mirrors this structure)
  /components
    /ui/               # Base UI wrappers and design system primitives
    /editor/           # Tiptap editor and slash command components
    /[feature]/        # Feature-scoped components, colocated with routes
  /lib
    /db.ts             # Prisma client singleton
    /query.ts          # TanStack Query client config
  /types               # Shared TypeScript types (API contracts, domain models)
  /styles
    /globals.css       # CSS custom properties (tokens) and resets
/widget                # Separate vanilla TS build — see /widget/CLAUDE.md
/prisma
  /schema.prisma
/docs
  /ARCHITECTURE.md     # This file
```

---

## Product Overview

A design-quality-first alternative to Beamer, Headway, and Canny.
Targets developers and product teams in the mid-market who value craft.

Core differentiators:
- Superior design quality (the primary moat)
- User segmentation at a fair price point
- Email notifications included (not a paid add-on)
- Open-source frontend as a trust and credibility signal

---

## Three Surfaces

### 1. Admin Dashboard (protected, open source)

The internal tool where customers create and manage content.
Built with Next.js App Router, TypeScript, Base UI, CSS Modules, Motion.

Six top-level tabs:
- **Announcements** — list of all content across types, with filters
- **Appearance** — widget and changelog customization
- **Audience** — segment management and targeting rules
- **Installation** — embed code and SDK instructions
- **Analytics** — open rates, widget views, click-through
- **Settings** — workspace, billing, team members

### 2. Public Changelog (open source)

Customer-facing page listing all published changelog posts.
Rendered with Next.js SSG + ISR — pre-built HTML served from CDN.
Zero server involvement at read time. ISR revalidates on publish.

URL pattern: `changelog.theirapp.com` (custom domain) or
`app.ourproduct.com/changelog/[workspace-slug]` (hosted).

### 3. Embeddable Widget (open source, separate bundle)

A `<script>` tag customers add to their app. Compiles to vanilla JS,
no framework, target <30kb gzipped. See `/widget/CLAUDE.md` for
the full constraint set.

The widget shows:
- A launcher button with unread count badge
- A slide-in panel with recent widget notifications
- Links to full changelog posts

---

## Content Model

Three distinct content types. Each is independent — they are not
variants of the same model. They have different fields, different
audiences, and different delivery mechanisms.

### Changelog Post

The primary content type. Long-form, public-facing, SEO-indexed.

```
title          String
slug           String     (unique, auto-generated from title)
content        String     (markdown — not Tiptap JSON)
category       Enum       (new | improved | fixed | security | other)
coverImage     String?    (URL)
publishedAt    DateTime?
status         Enum       (draft | published)
workspaceId    String
```

Appears on: public changelog page, referenced by widget notifications.
Does NOT appear in widget directly (widget has its own type).

### Widget Notification

Brief, targeted, in-app. Shown inside the embeddable widget panel.
Has its own independent scheduling and audience targeting.

```
title          String
body           String     (plain text, ~280 chars max)
linkType       Enum       (changelog_post | external_url | none)
linkTarget     String?    (post slug or URL)
targetSegments String[]   (empty = all users)
scheduledAt    DateTime?
expiresAt      DateTime?
publishedAt    DateTime?
status         Enum       (draft | scheduled | published | expired)
workspaceId    String
```

### Email Announcement

Sent directly to subscribers. Independent from widget notifications.
Has its own targeting rules and send schedule.

```
subject        String
previewText    String?
content        String     (markdown, rendered to HTML for delivery)
targetSegments String[]   (empty = all subscribers)
scheduledAt    DateTime?
sentAt         DateTime?
status         Enum       (draft | scheduled | sent)
workspaceId    String
```

**Why three types instead of one?**
A widget notification that goes stale in 2 weeks should not pollute the
permanent changelog. An email announcement needs a subject line and
preview text that a changelog post doesn't have. Forcing them into one
model creates a field-soup that none of them fit cleanly.

---

## Editor

Tiptap with minimal extension set. Headless — all styling via CSS Modules.
Content stored as **markdown string**. Converted to HTML at render time
using `marked` (for the public page and email templates).

**Approved extensions only:**

```ts
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'        // H1–H3 only
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import CodeBlock from '@tiptap/extension-code-block'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
// Slash commands: built in-house using @tiptap/suggestion (~50 lines)
```

Do not use `StarterKit` — it includes extensions we don't need and
inflates the bundle. Target ~80–100kb for the editor chunk.

---

## Performance Strategy

The guiding principle (from Linear's architecture): **the network is the
bottleneck. Every decision is about eliminating or hiding network requests.**

### Optimistic Mutations (admin)

Every write operation in the admin updates the UI immediately via
TanStack Query's `onMutate` callback. The server confirms in the
background. Roll back on error. Users should never wait for a spinner
after initiating an action.

```ts
// Pattern for every admin mutation
const mutation = useMutation({
  mutationFn: (data) => api.updateAnnouncement(data),
  onMutate: async (data) => {
    await queryClient.cancelQueries({ queryKey: ['announcements'] })
    const snapshot = queryClient.getQueryData(['announcements'])
    queryClient.setQueryData(['announcements'], (old) => optimisticUpdate(old, data))
    return { snapshot }
  },
  onError: (err, data, context) => {
    queryClient.setQueryData(['announcements'], context.snapshot)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['announcements'] })
  },
})
```

### Public Changelog (SSG + ISR)

Pre-rendered at build time. On publish, the API route triggers ISR
revalidation. Customers' end-users get CDN-served HTML with no server
in the critical path.

```ts
// app/(public)/changelog/[slug]/page.tsx
export const revalidate = 60  // ISR fallback; webhook-triggered revalidation is primary
```

### Code Splitting

Next.js handles route-level splitting automatically. Additionally:
- The Tiptap editor is lazy-loaded — only the Announcements editor
  route loads it. Not the list view.
- The widget bundle is entirely separate from the app build.

### Font Loading

```html
<!-- In layout.tsx <head> -->
<link
  rel="preload"
  href="/fonts/InterVariable.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

```css
/* globals.css */
@font-face {
  font-family: 'Inter Variable';
  font-weight: 100 900;
  font-display: swap;
  src: url('/fonts/InterVariable.woff2') format('woff2');
}
```

The `crossOrigin="anonymous"` on the preload tag is required — without
it the browser preloads and then fetches again, doubling the request.

### Animation Rules

Only `transform` and `opacity`. Never layout-triggering properties.

```ts
// Good — GPU-composited, no layout cost
animate={{ opacity: 1, transform: 'translateX(0)' }}

// Never — forces layout recalculation on every frame
animate={{ height: 'auto', marginTop: 16 }}
```

Duration scale:
- `100ms` — hover states, toggles, micro-feedback
- `200ms` — dropdowns, tooltips
- `250ms` — panel slide-in, modal entrance
- Never exceed `300ms` in a productivity tool context

---

## API Design

The admin and public changelog share the same Next.js codebase.
The API layer is in the private backend repository, which mirrors the
`/src/app/api` directory structure.

Widget endpoint is public (no auth), rate-limited by workspace slug:
```
GET  /api/widget/[slug]/announcements   → widget notification list
```

Admin endpoints require session auth:
```
GET    /api/announcements               → list (paginated, filtered)
POST   /api/announcements               → create
PATCH  /api/announcements/[id]          → update
DELETE /api/announcements/[id]          → soft delete
POST   /api/announcements/[id]/publish  → publish + trigger ISR
```

---

## Open Source Boundary

**Public repo (this one):** All frontend code — Next.js app, widget,
components, styles, types, editor configuration.

**Private repo:** Prisma schema, API route implementations, AWS SES
integration, email templates, authentication logic, billing.

The split is at the API boundary. The frontend only knows about the
API contract (request shape, response types). It does not contain
database queries, secret keys, or business logic.

Shared types (API request/response shapes) are duplicated intentionally
— one copy in each repo. Do not create a shared package for v1.
