// Temporary static data for building the public changelog UI.
// Replace with API fetch from shirase-server once the route is ready.
//
// Content covers all markdown element types the renderer must handle:
// headings, paragraphs, bold, italic, bullet lists, ordered lists,
// inline code, code blocks, blockquotes, tables, images, and links.

export type PostCategory = 'new' | 'improved' | 'fixed' | 'security' | 'other'

export interface ChangelogPost {
  id: string
  title: string
  slug: string
  category: PostCategory
  publishedAt: string // ISO date string
  coverImageUrl?: string
  content: string // markdown
}

export const posts: ChangelogPost[] = [
  // ── Post 1 ────────────────────────────────────────────────────
  // Types: cover image, h2, h3, paragraphs, bold, bullet list,
  //        code block (tsx), inline code, link
  {
    id: '1',
    title: 'Introducing the Shirase editor',
    slug: 'introducing-the-shirase-editor',
    category: 'new',
    publishedAt: '2025-05-12',
    coverImageUrl:
      'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=1200&q=80',
    content: `## Writing announcements should feel effortless

The editor is the heart of Shirase. You'll spend more time there than anywhere else in the product, so we built it to feel as natural as writing in Notion — no toolbars to click, no modes to switch between. Just write.

### Markdown shortcuts

Type naturally and formatting follows. Start a line with \`##\` for a heading, \`-\` for a bullet, or \`>\` for a callout. Wrap text in \`**\` for bold or \`_\` for italic. Every shortcut works exactly as you'd expect.

### Slash commands

Press \`/\` anywhere to open the block picker. Insert headings, lists, code blocks, images, or callouts without taking your hands off the keyboard.

### Clean HTML output

Every post you write is stored as markdown and rendered to clean, semantic HTML for the public changelog page and email announcements. No inline styles. No wrapper divs. Code you'd be comfortable shipping.

\`\`\`tsx
// The editor is a single composable component.
// Bring your own styles — it ships completely unstyled.
import { Editor } from '@shirase/editor'

export function AnnouncementEditor() {
  return (
    <Editor
      placeholder="What did you ship?"
      onUpdate={(markdown) => autosave(markdown)}
    />
  )
}
\`\`\`

The editor is built on [Tiptap](https://tiptap.dev) with a minimal extension set — no unnecessary dependencies, no bloated bundle. The total editor chunk is **under 100kb**.

### What's coming next

- Image uploads with drag-and-drop
- Inline mentions linking to previous posts
- AI-assisted writing for release notes`,
  },

  // ── Post 2 ────────────────────────────────────────────────────
  // Types: h2, h3, paragraphs, ordered list, table,
  //        inline code, blockquote, link
  {
    id: '2',
    title: 'Segmentation and targeted notifications',
    slug: 'segmentation-and-targeted-notifications',
    category: 'new',
    publishedAt: '2025-04-03',
    coverImageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    content: `## Show the right message to the right user

Not every announcement is relevant to everyone. A notification about a Pro feature shouldn't interrupt free-tier users. A migration guide for v2 only matters to customers still on v1. Shirase's segmentation lets you target both widget notifications and email announcements by any user trait.

### How to set it up

Targeting is built on the traits you pass to \`Shirase.identify\`. Call it once after your user logs in:

\`\`\`javascript
Shirase.identify({
  id: user.id,
  email: user.email,
  plan: user.plan,           // 'free' | 'pro' | 'enterprise'
  createdAt: user.createdAt, // ISO date string
  company: user.company,
})
\`\`\`

Then create segments in the **Audience** tab using these traits as filters. Segments update automatically as user traits change — no manual list management.

### Available filter operators

| Operator | Works with | Example |
|---|---|---|
| \`is\` | String, boolean | \`plan is pro\` |
| \`is not\` | String, boolean | \`plan is not free\` |
| \`contains\` | String | \`email contains @acme.com\` |
| \`greater than\` | Number, date | \`createdAt greater than 30 days ago\` |
| \`less than\` | Number, date | \`actionsThisMonth less than 5\` |

Multiple filters on a segment use **AND** logic — a user must match all conditions to be included.

### Applying segments to notifications

1. Create your notification in the Announcements tab
2. Open the **Audience** panel in the editor sidebar
3. Select one or more segments — the notification shows to users matching **any** selected segment
4. Leave it empty to show to all users

> **Note:** Segment membership is evaluated at widget load time, not at the moment you publish. Users who match a segment after publication will see the notification on their next session.

[Read the full segmentation documentation →](https://shirase.app/docs/segmentation)`,
  },

  // ── Post 3 ────────────────────────────────────────────────────
  // Types: h2, h3, paragraphs, table (before/after),
  //        bullet list, inline code, bold, italic
  {
    id: '3',
    title: 'Widget performance — 60% smaller bundle',
    slug: 'widget-performance-60-percent-smaller',
    category: 'improved',
    publishedAt: '2025-03-18',
    coverImageUrl: undefined,
    content: `## The widget is now significantly faster to load

When we launched the widget, the bundle was 47kb gzipped. That's not terrible, but it's not good either — every kilobyte added to your page's initial load is a kilobyte your users pay for. We spent two weeks on a systematic reduction and shipped a 28kb bundle today.

### What changed

| | Before | After |
|---|---|---|
| Bundle size (gzipped) | 47kb | 28kb |
| Parse time (mid-range mobile) | ~180ms | ~95ms |
| Time to interactive | ~320ms | ~160ms |
| External dependencies | 4 | 0 |

The biggest win came from eliminating all external dependencies. The previous widget used a small DOM diffing library, a date formatting library, and two utility packages. We replaced all four with purpose-built code that does exactly what the widget needs and nothing else — totalling around 80 lines.

### Other improvements

- The widget panel now uses \`content-visibility: auto\` — the browser skips rendering off-screen content entirely, reducing paint time on first open by ~40%
- Launcher button renders immediately from a \`<style>\` tag injected inline — no layout shift while the main bundle loads
- Notification list is now virtualised — only visible items are in the DOM regardless of how many notifications a workspace has

### How to get it

The update is automatic. If you self-host the widget script, replace your URL with \`https://cdn.shirase.app/widget.js\` — the old versioned URLs still work but won't receive updates.

> **Tip:** Add \`defer\` to your script tag if you haven't already. It tells the browser to load the widget after the page is interactive, which improves your Core Web Vitals scores without any visible difference to your users.`,
  },

  // ── Post 4 ────────────────────────────────────────────────────
  // Types: h2, h3, paragraphs, code blocks (bash, typescript),
  //        ordered list, inline code, blockquote, bullet list
  {
    id: '4',
    title: 'REST API now available',
    slug: 'rest-api-now-available',
    category: 'new',
    publishedAt: '2025-02-24',
    coverImageUrl: undefined,
    content: `## Build on top of Shirase

The Shirase REST API is now available to all workspaces. Use it to publish announcements from your deployment pipeline, sync notifications with your own data, or build custom integrations that don't fit the standard workflow.

### Authentication

All API requests require a workspace API key passed as a Bearer token. Generate one from **Settings → API Keys**.

\`\`\`bash
curl https://api.shirase.app/v1/posts \\
  -H "Authorization: Bearer shrs_live_your_key_here"
\`\`\`

### Publishing a changelog post

\`\`\`typescript
const response = await fetch('https://api.shirase.app/v1/posts', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.SHIRASE_API_KEY}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'v2.4.0 released',
    category: 'new',
    content: '## What\\'s new\\n\\nFull markdown supported here.',
    publishedAt: new Date().toISOString(),
  }),
})

const { post } = await response.json()
\`\`\`

### Common automation patterns

1. **Post-deploy hook** — publish a changelog entry automatically after every production deploy using your CI/CD pipeline
2. **GitHub Release sync** — mirror GitHub Releases to your Shirase changelog via a GitHub Action
3. **Internal tooling** — trigger widget notifications from your own admin tools without opening the Shirase dashboard

> **Rate limits:** The API allows 100 requests per minute per workspace. Exceeding this returns a \`429 Too Many Requests\` response with a \`Retry-After\` header.

### Available endpoints

- \`GET /v1/posts\` — list published posts
- \`POST /v1/posts\` — create a post
- \`PATCH /v1/posts/:id\` — update a post
- \`POST /v1/posts/:id/publish\` — publish a draft
- \`GET /v1/notifications\` — list widget notifications
- \`POST /v1/notifications\` — create a notification

Full API reference at [docs.shirase.app/api](https://docs.shirase.app/api).`,
  },

  // ── Post 5 ────────────────────────────────────────────────────
  // Types: h2, h3, blockquote (warning), bullet lists,
  //        ordered list, inline code, italic, bold
  {
    id: '5',
    title: 'Custom domains, bug fixes, and a breaking change',
    slug: 'custom-domains-bug-fixes-breaking-change',
    category: 'improved',
    publishedAt: '2025-01-30',
    coverImageUrl: undefined,
    content: `## Custom domains for your changelog

Your public changelog can now live at your own domain — \`changelog.yourapp.com\`, \`updates.yourapp.com\`, or any subdomain you choose. Previously only the Shirase-hosted URL was available.

### How to set it up

1. Go to **Settings → Custom Domain**
2. Enter your desired subdomain (e.g. \`changelog.yourapp.com\`)
3. Add a \`CNAME\` record pointing to \`cname.shirase.app\` with your DNS provider
4. Wait for DNS propagation — typically under 10 minutes
5. SSL is provisioned automatically once the record resolves

> **Note for Cloudflare users:** Set the proxy status to **DNS only** (grey cloud) during initial setup. Once SSL is provisioned you can re-enable the proxy if needed.

### Bug fixes

**Widget**
- Fixed an issue where the unread badge showed the wrong count after marking individual notifications as read
- Fixed widget panel clipping behind fixed-position navigation bars on certain layouts
- Fixed \`Shirase.identify\` being silently ignored when called before the script had finished parsing

**Dashboard**
- Fixed the schedule date picker defaulting to UTC instead of the workspace's configured timezone
- Fixed long post titles overflowing the announcements list on narrow viewports
- Fixed code blocks losing their syntax language label after a post was saved and reopened

**Email**
- Fixed unsubscribe links failing for email addresses containing \`+\` characters
- Fixed plain-text fallback missing paragraph breaks

### Breaking change

> ⚠️ **Action required if you use the JavaScript SDK directly.**
>
> The \`onReady\` callback has been removed. Replace any usage of \`Shirase.onReady(fn)\` with a standard \`defer\` attribute on the script tag — the widget now guarantees the global is available before \`DOMContentLoaded\` fires.

If you only use the \`data-workspace\` attribute installation method, *no changes are needed*.`,
  },
]
