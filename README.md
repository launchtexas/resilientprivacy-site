# Resilient Privacy marketing site

Marketing site for Resilient Privacy Inc., a cybersecurity and AI security consultancy. Live at <https://www.resilientprivacy.com> (the apex domain redirects to `www`). Repo: `launchtexas/resilientprivacy-site` (private, branch `main`).

The site is a Next.js App Router app. Every page is static; the only server code is one form endpoint, `POST /api/inquiry`.

## Contents

1. [Stack](#stack)
2. [Prerequisites](#prerequisites)
3. [Local development](#local-development)
4. [Scripts](#scripts)
5. [Folder structure](#folder-structure)
6. [Route map](#route-map)
7. [Editing common content](#editing-common-content)
8. [Contact form flow](#contact-form-flow)
9. [Security headers and CSP](#security-headers-and-csp)
10. [SEO and AEO](#seo-and-aeo)
11. [Deployment](#deployment)
12. [Content rules](#content-rules)
13. [Troubleshooting](#troubleshooting)
14. [Related docs](#related-docs)

## Stack

Versions below are the ones installed in `node_modules` (ranges are in `package.json`).

| Piece | Version |
|---|---|
| Next.js (App Router) | 16.4.6 |
| React / React DOM | 19.3.1 |
| TypeScript | 7.0.2 |
| Tailwind CSS (+ `@tailwindcss/postcss`) | 4.3.5 |
| Vercel BotID (`botid`) | 1.5.13 |
| Geist font (`geist`) | ^1.9.2 |

Path alias: `@/*` maps to the `site/` root (`tsconfig.json`).

**Next.js 16 differs from older versions.** Before changing framework-level code, read the matching guide in `node_modules/next/dist/docs/` (see `AGENTS.md`).

## Prerequisites

- A current Node.js LTS that Next 16 supports, and npm. `package.json` has no `engines` field, so none is enforced; use the version Vercel builds with.
- No database or other service is needed to run the site. Only the email feature needs a key (see [Contact form flow](#contact-form-flow)).

## Local development

All commands run from the `site/` folder.

```bash
npm install        # first time, or after package.json changes
npm run dev        # dev server at http://localhost:3000
npm run build      # production build (runs check:copy first)
npm run start      # serve the production build
```

Optional: copy `.env.example` to `.env.local` and fill it in to test real email. Without `RESEND_API_KEY` the forms fall back to opening the visitor's email app (`mailto:`), which is fine for most local work. `.env*` files are git-ignored except `.env.example`.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | `next dev` |
| `npm run build` | `next build`; the `prebuild` hook runs `check:copy` first |
| `npm run start` | `next start` |
| `npm run check:copy` | Fails the build if any `[placeholder` or `[proposed name` marker is left in `app/` or `components/`. Lines that are comments, or that carry `data-gap`, are ignored. Runs automatically before `build` |
| `npm run check:forms` | Self-checks for the form: `components/company/inquiry.check.mjs` (field rules) and `app/api/inquiry/route.check.mjs` (the API route, with `fetch` and BotID mocked, so no real email is sent) |

There is no lint or unit-test script. Run `check:forms` after any change to `components/company/inquiry.ts` or `app/api/inquiry/route.ts`.

## Folder structure

```
site/
├── app/                    # routes (see Route map); globals.css holds the design tokens
│   ├── api/inquiry/        # the only server endpoint + its self-check
│   ├── [...slug]/          # placeholder pages for nav links with no real page yet
│   ├── llms.txt/route.ts   # /llms.txt for AI answer engines
│   ├── robots.ts  sitemap.ts  opengraph-image.tsx  layout.tsx  not-found.tsx
│   └── icon.svg  favicon.ico  apple-icon.png
├── components/             # shared UI, grouped by area
│   ├── ui.tsx  sections.tsx  Tabs.tsx  Nav.tsx  Footer.tsx  Logo.tsx  mockup.tsx
│   └── ai/ charts/ company/ consulting/ graphics/ grc/ home/ managed/ motion/ platform/ resources/
├── lib/
│   ├── nav.ts              # nav menus, CTAs, contact facts, legal links (single source of truth)
│   ├── routes.ts           # which nav hrefs have a real page vs a placeholder
│   ├── schema.ts           # SITE_URL, SITE_NAME, JSON-LD builders
│   └── example.ts
├── public/
│   ├── brand/              # logo files (symbol SVGs, logo-512.png)
│   ├── logos/              # third-party and social marks used on the site
│   └── team/               # leadership photos
├── instrumentation-client.ts   # BotID client setup
├── next.config.ts              # security headers/CSP, BotID wrapper, redirects
├── AGENTS.md  DESIGN.md        # see Related docs
└── .env.example                # env var names and defaults, no values
```

## Route map

Source: `app/`. Navigation lives in `lib/nav.ts`.

| Route | Source |
|---|---|
| `/` | `app/page.tsx` |
| `/consulting`, `/consulting/how-we-work` | `app/consulting/page.tsx`, `how-we-work/page.tsx` |
| `/consulting/[service]` (penetration-testing, red-team, appsec, architecture, vciso) | `app/consulting/[service]/page.tsx`, data in `components/consulting/data.ts` |
| `/ai-security`, `/ai-security/red-teaming`, `/governance`, `/secure-adoption` | `app/ai-security/` |
| `/grc` (Risk & Compliance), `/grc/soc-2`, `iso-27001`, `privacy`, `frameworks`, `risk-assessment`, `internal-audit`, `vendor-risk` | `app/grc/` |
| `/managed-services`, `/soc`, `/mdr`, `/noc`, `/incident-response`, `/threat-hunting` | `app/managed-services/` |
| `/platform`, `/platform/integrations`, `/platform/[product]` | `app/platform/`, product data in `components/platform/products.tsx` |
| `/resources`, `/blog`, `/blog/[slug]`, `/guides`, `/guides/[slug]`, `/case-studies`, `/sample-report`, `/docs`, `/trust` (all under `/resources`) | `app/resources/`; posts and guides in `components/resources/data.ts` |
| `/resources/blog/rss.xml` | `app/resources/blog/rss.xml/route.ts` |
| `/company`, `/company/careers`, `/company/partners` | `app/company/` |
| `/contact`, `/demo` | `app/contact/page.tsx`, `app/demo/page.tsx` |
| `/legal/privacy`, `/legal/terms`, `/legal/security` | `app/legal/` |
| `POST /api/inquiry` | `app/api/inquiry/route.ts` (other methods get Next's automatic 405) |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | `app/robots.ts`, `app/sitemap.ts`, `app/llms.txt/route.ts` |
| `/opengraph-image` | `app/opengraph-image.tsx` (default share image for every route) |
| Any other nav href | `app/[...slug]/page.tsx` renders a "being built" page marked `noindex`. A real page at that path replaces it automatically (`lib/routes.ts`) |

Redirect: `/consulting/ai-security` permanently redirects to `/ai-security/red-teaming` (`next.config.ts`).

## Editing common content

| To change | Edit |
|---|---|
| Navigation menus, footer links, CTA buttons | `lib/nav.ts` (`NAV`, `CTA`, `CTA_FOR`, `LEGAL`). The footer, `/llms.txt`, the sitemap and placeholder pages all read it |
| Contact email, security/legal/careers addresses, LinkedIn URL, street address, copyright | `CONTACT` in `lib/nav.ts` |
| Leadership cards (name, title, bio, photo, LinkedIn) | `LEADERS` array in `app/company/page.tsx`. These also feed the `Person` JSON-LD |
| Team list (name and title only, silhouette until a photo exists) | `TEAM` array in `app/company/page.tsx` |
| Founder portrait | `public/team/vishva-patel.png`, referenced in `app/company/page.tsx` |
| Leadership photos | Add the image to `public/team/` and set `photo`, `w`, `h` (pixel size) on the `LEADERS` entry |
| Logos | Brand files in `public/brand/` (`ResilientPrivacy_Symbol_Black.svg`, `…_White.svg`, `logo-512.png`); component in `components/Logo.tsx`. Third-party marks in `public/logos/` |
| Dashboard/mockup caption | The text "Simulated environment, real workflow." is defined as `ILLUSTRATIVE` in `components/ui.tsx` and as `PLACEHOLDER_NOTE` in `components/home/icons.tsx`, `consulting/parts.tsx`, `grc/ServicePage.tsx`, `managed/kit.tsx`, `platform/kit.tsx` (charts reuse `ILLUSTRATIVE` as `PLACEHOLDER`). To reword it, change every copy |
| Blog posts and guides | `components/resources/data.ts` (`POSTS`, `GUIDES`). The sitemap, RSS and JSON-LD pick them up |
| Consulting, GRC, platform, managed-services page content | `components/consulting/data.ts`, `components/grc/data.ts`, `components/platform/products.tsx`, `components/managed/` |
| Colors, spacing, type | `@theme` block in `app/globals.css` only; see `DESIGN.md` |

## Contact form flow

Two forms, `contact` and `demo`, share `components/company/InquiryForm.tsx`. Fields and rules are in `components/company/inquiry.ts` (`FORMS`).

1. The browser validates, then POSTs JSON to `/api/inquiry`. BotID (`instrumentation-client.ts`) attaches its challenge to that request.
2. `app/api/inquiry/route.ts` checks, in order:
   - **Origin**: `Origin`/`Referer` host must equal the request host, else 403.
   - **Content type** must be JSON (415) and the body under 16 KB (413).
   - **Rate limit**: 5 requests per IP per 10 minutes, else 429 with `Retry-After`. The counter is in memory per server instance, which is acceptable at current traffic; move it to a shared store if traffic grows.
   - **BotID** `checkBotId()`: bots get 403. Off Vercel it answers "human", so local runs work.
   - **Honeypot**: a filled `website` field returns 200 and sends nothing.
   - **Validation**: unknown form id, wrong types, missing consent or invalid fields return 400.
3. It sends the email through the Resend API. Failure returns 502.
4. If no key is set the API returns 503 `{ fallback: "mailto" }` and the browser opens the visitor's email app with the message prefilled.

Environment variables (names only; set them in `.env.local` locally, or Vercel > Project > Settings > Environment Variables):

| Name | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend key. The route also accepts `RESENT_API_KEY` as a fallback (the name once used in Vercel). Prefer `RESEND_API_KEY` |
| `INQUIRY_FROM` | Sender. Default `Website <no-reply@resilientprivacy.com>`; the domain must be verified in Resend |
| `INQUIRY_TO` | Inbox that receives submissions. Default is set in `route.ts` and `.env.example` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional Google Search Console token, added to the page `<meta>` tags by `app/layout.tsx` |

Never commit real values. `.env.example` lists names and safe defaults only.

## Security headers and CSP

`next.config.ts` sets these on every route: Content-Security-Policy, Strict-Transport-Security (2 years, preload), X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options DENY, Cross-Origin-Opener-Policy.

**CSP rule: `script-src` must keep `'self' 'unsafe-inline'`.** Next's inline bootstrap scripts need it. A stricter policy using per-script `sha256` hashes failed on Vercel: there are about 1,561 distinct inline scripts, the header grew too large, and a build with an empty hash list froze the live site. Nonces would force dynamic rendering, which this static site avoids. Do not retry hashes without a plan for those limits.

- `'unsafe-eval'` and `ws:` are allowed in development only; `upgrade-insecure-requests` only in production.
- BotID proxies its challenge through same-origin rewrites, so the CSP needs no extra sources.
- If you add a third-party script, image, font or API host, add it to the matching directive in `next.config.ts`.

**After any header or CSP change, verify the live site** (<https://www.resilientprivacy.com>), not just a local build: load pages, watch the browser console for CSP violations, and submit the contact form. Check headers with `curl -sI https://www.resilientprivacy.com`.

## SEO and AEO

AEO = answer-engine optimization (being quotable by AI search and chat tools).

- **Canonical host**: `SITE_URL = https://www.resilientprivacy.com` in `lib/schema.ts`. Canonicals, sitemap and JSON-LD must use `www`; the apex redirects to it. Change the domain only there.
- **Metadata**: `metadataBase` and a per-route canonical (`alternates: { canonical: "./" }`) in `app/layout.tsx`; each page exports its own `metadata`.
- **Structured data (JSON-LD)**: builders in `lib/schema.ts` (`organization`, `founder`, `leader`, `website`, `faqPage`, `service`, `breadcrumbs`, `article`, `blog`, `itemList`). Pages render them with `<JsonLd>`. `Faq` components emit FAQPage markup, one per page.
- **robots**: `app/robots.ts` allows search and AI crawlers by name (Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Claude-SearchBot, Google-Extended, Applebot-Extended) and blocks `/api/` for everyone. It points to the sitemap.
- **sitemap**: `app/sitemap.ts` lists real pages (not placeholders), blog posts and guides.
- **llms.txt**: `app/llms.txt/route.ts` builds a plain-text site map from `lib/nav.ts`, so it does not drift from the nav.
- **Share image**: `app/opengraph-image.tsx`.

## Deployment

Vercel auto-deploys `main` to production at <https://www.resilientprivacy.com>; the apex domain redirects (308) to `www`. Pull requests and other branches get preview deployments. There is no deploy script and no `vercel.json` in `site/`.

Before merging: run `npm run build` (this also runs `check:copy`) and `npm run check:forms`. After deploy, spot-check the live site (see [Security headers and CSP](#security-headers-and-csp)). Environment variables are managed in the Vercel project settings, not in git.

## Content rules

- No invented client logos, statistics, awards, rankings, certifications or testimonials.
- The company holds **no audit certifications**: make no SOC 2 / ISO claims for the company itself. Name individual staff certifications only.
- Case studies are anonymised ("Illustrative engagement") with no numbers.
- No PGP key and no hotline anywhere on the site.
- Dashboards and console mockups show **simulated data** and must carry the caption "Simulated environment, real workflow."
- Founder, leadership and team appear only on `/company`.
- Company contact facts come from `CONTACT` in `lib/nav.ts`; do not hardcode addresses elsewhere.
- Ask before removing the Platform section from the nav or pages.

## Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| `npm run build` fails at `check:copy` | A `[placeholder…` or `[proposed name…` marker is in `app/` or `components/`. The error lists file and line; replace it with real copy |
| Form always opens the email app instead of sending | No Resend key in that environment (503 fallback). Set `RESEND_API_KEY` (or `RESENT_API_KEY`) and redeploy |
| Form returns 403 | Origin check failed (request from a different host), or BotID flagged it as a bot |
| Form returns 429 | More than 5 submissions from one IP in 10 minutes. Wait 10 minutes |
| Form returns 502 | Resend rejected the send. Check the sender domain is verified and the key is valid; the server log line starts `inquiry: send failed` |
| Live site frozen or scripts blocked after a header change | CSP too strict. Restore `script-src 'self' 'unsafe-inline'` (see the CSP rule) and redeploy |
| A new nav link shows "This page is being built" | No page exists at that path. Add `app/<path>/page.tsx`; the placeholder disappears and the page enters the sitemap |
| Page missing from `/sitemap.xml` | It is still a placeholder, or it is not linked in `lib/nav.ts` (blog and guide pages come from `components/resources/data.ts`) |
| `next dev` edits `AGENTS.md` | Next rewrites its agent-rules block there; commit it with your work, or the change returns |
| Local form works but production does not | Local BotID always answers "human"; production verdicts only exist on Vercel |

## Related docs

- [`DESIGN.md`](./DESIGN.md): design system, positioning, tokens and the rules every page builder follows. Read before adding or restyling a page.
- [`AGENTS.md`](./AGENTS.md): notes for AI coding agents, including the Next.js 16 docs pointer.
