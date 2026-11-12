# Resilient Privacy design system (v2: violet + white, 2026-11-09; v3 positioning)

## Positioning (v3, from `research/rp-site/audit-v3.md`)
Resilient Privacy is a **cybersecurity and AI security consultancy**: "Cybersecurity and AI security consulting, from first test to final evidence." **Consulting and AI Security lead**; Managed Services and Platform support them ("how we keep it running"). Risk & Compliance (the `/grc/*` routes) is a Consulting practice. Show leadership through depth (published method, framework crosswalks, research, named practices), never through invented awards, rankings, client logos or stats.

Rules every phase-2 page builder must follow. If something here doesn't cover your case, reuse the nearest existing pattern. Don't invent a new one.

## Stack and files

| What | Where |
|---|---|
| Tokens (the only place raw values live) | `app/globals.css` → `@theme` |
| Primitives: `Button`, `Arrow`, `Badge`, `Eyebrow`, `Card`, `Section`, `SectionHeading`, `CheckList`, `cx` | `components/ui.tsx` |
| `Tabs` (WAI-ARIA, keyboard) | `components/Tabs.tsx` |
| Page closers: `FinalCta` (navy CTA band, `title` + `lead` + optional `primary`), `Faq` (details/summary list, emits FAQPage JSON-LD; one per page) | `components/sections.tsx` |
| `Nav` (pill + mega menus + mobile drawer), `Footer`, `Logo` | `components/` |
| UI mockup kit: `AppWindow`, `AppSidebar`, `StatTile`, `Sparkline`, `AreaChart`, `SeverityBars`, `Legend`, `ScoreRing`, `AlertList`, `DataTable`, `Progress`, `Panel` | `components/mockup.tsx` |
| Nav, footer, CTA links and `CONTACT` (info@, security@, legal@) | `lib/nav.ts` |
| JSON-LD: `JsonLd`, `organization`, `website`, `faqPage`, `service`, `breadcrumbs`, `article` (Organization + WebSite already in the root layout) | `lib/schema.ts` |
| Default share image, 404 | `app/opengraph-image.tsx`, `app/not-found.tsx` |
| Stub detection (`STUBS`, `REAL`; server only), used by `app/[...slug]` and `app/sitemap.ts` | `lib/routes.ts` |
| Homepage (reference for composition) | `app/page.tsx` |

Next.js 15 App Router, TypeScript, Tailwind CSS v4 (tokens in CSS `@theme`, no `tailwind.config`). Fonts: **Figtree** (sans, via `next/font/google`, self-hosted at build; the closest free match to Aikido's commercial "Newgrotesk") and **Geist Mono** (mono, `geist` package). The build fetches Figtree from Google Fonts once, so `npm run build` needs network. Build: `npm run build`.

## Tokens

**Never write a hex value, px shadow or font size in a component.** Use the Tailwind utility generated from the token. To add a token, add it to `@theme` and record it here.

### Color
- **Ink (`navy-*`, a deep indigo; the name is kept so pages compile):** `navy-950` (darkest: dark bands, footer, dark nav pill, active strip tab) · `navy-900` (body text) · `navy-800/700` (strong secondary) · `navy-600` (paragraph/lead) · `navy-500` (meta, captions, mockup axis labels on light) · `navy-400/300` (muted text **on dark only**; below 4.5:1 on white).
- **Surfaces:** `canvas` (white) · `mist` (very light lavender-gray, alternate section bg) · `cloud` (insets, hover fill, track) · `line` / `line-strong` (borders).
- **Accent (violet, the only brand hue):** `accent` #5b47e0 (6.1:1 on white), `accent-hover`, `accent-active` (pressed), `accent-soft` (tint bg, mockup frames), `accent-ink` (accent text on soft bg), `accent-on-dark` (accent on indigo). Own hex values, close to the aikido.dev family; never copy theirs. No second brand color.
- **Status (meaning only, never decoration):** `critical`, `high`, `medium`, `ok`, each with a `-soft` bg. Use them only for severity and state in data and mockups. The base hue is for fills, dots and bars; status **text** uses `critical-ink`, `high-ink`, `medium-ink`, `ok-ink` (AA on white and on `-soft`).

### Type
| Token | Use |
|---|---|
| `text-display` | Home hero H1 only. `font-semibold tracking-[-0.04em]` |
| `text-h1` | Page H1 on inner pages, final-CTA headline. `tracking-[-0.03em]` |
| `text-h2` | Section titles (via `SectionHeading`). `tracking-[-0.025em]` |
| `text-h3` | Card and step titles. `tracking-[-0.015em]` |
| `text-lead` | The one supporting line under a heading. `text-navy-600` |
| base / `text-[0.9375rem]` | Body in cards |
| `text-micro` | Chart axes, mockup meta, captions |
| `font-mono` + uppercase + `tracking-[0.08em]` | Eyebrows and small labels (`Eyebrow` component) |

One H1 per page. Headings use `text-balance`, paragraphs `text-pretty`. Keep supporting copy to one or two sentences.

### Spacing and layout
- Tailwind 4px scale. Containers: `container-rp` (max 1240px, 16px gutter on mobile, 32px from `md`).
- Section rhythm: `section-y` (64px mobile, 96px from `lg`). Always use `<Section>`; don't hand-roll padding. Two same-tone sections in a row automatically drop the second one's top padding (globals.css), so alternate tones only where a visual break helps.
- Two-column sections: copy column `lg:col-span-5`, visual `lg:col-span-7`, `items-start` (top-aligned). A 4/12 copy column leaves the visual card floating with holes.
- A 12-column grid at `lg` (`lg:grid-cols-12` with `col-span-*`). **Every responsive grid starts with `grid-cols-1`.** Without it, wide children such as tables overflow at 375px.
- Heading → content gap: `mt-10` to `mt-14`. Card padding `p-6` (`lg:p-8` for large cards).

### Radius
`rounded-chip` 6 (badges) · `rounded-control` 10 (inputs, menu items) · `rounded-card` 16 (cards, panels) · `rounded-panel` 24 (app windows, mega menu, CTA band) · `rounded-frame` 32 (lavender frame around the hero console) · `rounded-full` (buttons, pills, tabs).

### Shadow
`shadow-hairline` (1px line ring) · `shadow-card` (default card) · `shadow-lift` (hover, menus) · `shadow-window` (product mockups only, violet-tinted) · `shadow-button` (primary button) · `shadow-pill` (dark nav pill, active strip tab).

### Motion
- Durations `duration-(--duration-fast)` 150ms (hover), `--duration-base` 240ms (shadows, header), `--duration-slow` 600ms. Easing `ease-(--ease-out)`.
- Scroll reveal: add class `reveal`. It is pure CSS (`animation-timeline: view()`) and needs no JS; browsers without support show content immediately. Use it on section headings and card groups only, never on every element.
- `pulse-dot` is used only for "live" indicators.
- `prefers-reduced-motion: reduce` disables every animation and transition globally. Don't add JS animation that bypasses this.

## Component rules

- **Button**: a link (`href` required). `primary` is used once per view for the main action (see CTA rule). Use `secondary` beside it, `inverse` on navy, and `ghost` in the nav. Sizes `sm` (nav), `md`, `lg` (hero, CTA). Append `<Arrow />` to primary CTAs.
- **CTA rule**: labels and hrefs always come from `CTA` / `CTA_FOR` in `lib/nav.ts`; never hard-code them. Heroes use `<CtaButtons kind>` and the closing band `<FinalCta kind>` with the same `kind`, so the order is identical on a page. One exception: consulting detail pages close with `kind="engagement"` ("Scope an engagement"), the only place that label appears outside the contact form.
  - `practice` (home, Consulting, AI Security, Risk & Compliance `/grc/*`): `CTA.scope` primary + `CTA.report` ("See a sample report", `/resources/sample-report`) secondary.
  - `platform` (`/platform/*`, docs): `CTA.demo` primary + `CTA.expert` secondary (`FinalCta` default).
  - `expert` (Managed Services, Company, Resources): `CTA.expert` only. Never a second button that goes to the same contact form.
  - Site header: `CTA.expert` primary, `CTA.demo` ghost.
  - Each CTA has its own target: `CTA.expert` → `/contact?intent=expert`, `CTA.scope` → `/contact?intent=engagement`, `CTA.demo` → `/demo`. The `intent` query preselects the contact form's "I'd like to" field; don't point two labels at the same URL.
- **Page heroes**: two templates only. Practice hubs (home, consulting, AI security, GRC, managed services, platform, resources, company): centered copy, product visual below. Detail pages: split, copy left (`lg:col-span-6/7`), visual right, never an empty half. The eyebrow is always the mono `Eyebrow` (not a `Badge` pill, not plain text). CTAs sit directly under the lead, left-aligned with the copy (centered on centered heroes), primary first.
- **Badge**: tones `neutral | accent | critical | high | medium | ok | dark`; add `dot` for state. Use it for status, not for emphasis in prose.
- **Card**: add `interactive` only when the whole card is a link.
- **Section**: tones `canvas | mist | navy`. Alternate canvas and mist, and use at most one `navy` band per page plus the footer. Pass `labelledBy` with the heading id.
- **SectionHeading**: `eyebrow` + `title` + optional `lead`; `align="center"` only for short, symmetric sections.
- **Tabs**: content is server-rendered and passed in; 2–5 tabs; labels of one or two words. `variant="pill"` (default, in-section) or `variant="strip"` (large switcher buttons, used once: the homepage hero product switcher). `panelClassName` styles the panel.
- **Hover states**: interactive cards lift 2px and gain `shadow-lift`; buttons press down 1px (`active:translate-y-px`).
- **Backgrounds**: `bg-hero-wash` (lavender glow fading to white) + `bg-grid` belong to page heroes only.
- **Logo cloud**: none. Don't show invented customer names; use a frameworks strip (text chips) until real customers approve logos.
- **Nav**: a dark indigo pill (`bg-navy-950`) on a light header. Edit `lib/nav.ts` only. Order: Consulting, AI Security, Managed Services, Platform, Resources, Company. Each item has an intro column and one to three link groups. The footer and stub routes are generated from the same data (query/hash links count as their path).

## Product mockups

- Build them in HTML/CSS/SVG from `components/mockup.tsx`. No screenshots, stock images or third-party logos.
- Wrap each in `AppWindow` (or a `role="img"` container) with a meaningful `label`; inner markup is `aria-hidden`.
- Mockup layout: `bg-mist p-4` inside the window, `Panel`/`StatTile` cards with `gap-3`.
- Charts use the accent for the primary series and `navy-300` dashed for comparison. Status colors are only for severity. Every chart has a `Legend` when it has more than one series.
- Put the `ILLUSTRATIVE` caption from `components/ui.tsx` ("Illustrative data", `text-micro text-navy-500`; `navy-400` fails contrast at micro size on light) under every mockup.

## Motion

Motion shows the product working, never decoration (aikido.dev study, RP-SITE v5): every animated piece is a product scene, a small UI window that does one real job (a finding triaged, a prompt blocked, a control proven) and stops on a clear end state. No orbit rings, floating dots, particles or generic pulses. No dependencies: CSS plus small client components in `@/components/motion`. Usage for every piece is in its source under `@/components/motion` and `@/components/graphics`.

**Rules every piece follows**
- **Nothing leaves its box.** A scene's root is its `<Frame>` (`relative overflow-hidden`, a size container): children animate only `opacity`/`translate`/`scale` inside it, and the scene `<Cursor>` is clamped to the frame. Layouts switch on container queries (`@md`, `@lg`, `@xl`), not the viewport. Text truncates rather than wrapping out. `svg.rp-g *, .rp-g svg *` sets `transform-box: fill-box` so SVG shapes scale around their own centre (the old overflow bug). Proof: every scene at 375/768/1024/1280/1440 over a full loop shows zero pixels outside its card and no page horizontal scroll.
- **Reduced motion and no-JS = the finished frame.** Base CSS is the end state; motion lives only in `prefers-reduced-motion: no-preference` (and `scripting: enabled` for scenes and reveals).
- **Plays once, in view.** A `<Scene>` starts when 35% visible and holds its end state; it replays only if it was cut off before finishing. The one looping scene (`<SocMap>` feed) sits in `<Live>`, which pauses it offscreen.
- **No layout shift.** Before/after states share one grid cell (`<Swap>` / `.rp-stack`), so sizes never change. Only `transform`/`translate`/`scale`/`opacity`/`clip-path` animate.
- **No React re-renders while animating.** Client pieces write data attributes, CSS variables or `textContent` directly.

**Timings and easing**
| Use | Duration | Easing |
|---|---|---|
| Hover, press | `--duration-fast` 150ms | `--ease-out` |
| Tab underline, spotlight | `--duration-base` 240ms | `--ease-out` |
| Reveal / Stagger | `--duration-slow` 600ms, +70ms per child (max 8) | `--ease-out` |
| Scene beat (element in / out) | opacity 420ms, move 560ms, `--lag` for same-beat staggers | `--ease-out` |
| Scene cursor move | 700ms, click 260ms | ease-in-out |
| Whole scene | 4–6.5s, beats ~0.7–1.5s apart | — |
| Hero entrance (`<Enter>`) | 800ms, +110ms per item | `--ease-out` |
| Terminal typing | 24ms per character, 220ms between lines | `steps()` |
| Loops: SOC feed 12s (2.4s per event) · step-card pipeline 8s · border light 6s · marquee 40s | | linear / `--ease-out` |

**Building a scene** (`<Scene>` + `<Cursor>`, wrapped by `Frame` in `components/graphics/kit.tsx`)
- `beats={[ms, …]}` or `{ at, click: "name" }`. Mark children `data-at="k"` (appears on beat k) and `data-until="k"` (gone on beat k). Add `.rp-grow-x` / `.rp-grow-y` (bars and rails), `.rp-pop` (badges, checks) or `.rp-slide` (new rows).
- A beat with `click` moves `<Cursor />` to the child with `data-target="name"` 750ms earlier and presses it.
- Kit: `Frame` (window chrome + status chip + scene root), `Swap` (before/after in one cell), `Chip` (tones: neutral, accent, critical, high, medium, ok, dark*), `Check`/`Cross`/`Shield`, `lag(ms)`.
- Keep strings short (they truncate at 343px). Give the frame an `aria-label` that tells the whole story; the inside is `aria-hidden`.

**Primitives** (`@/components/motion`)
| Piece | Use it for | Don't |
|---|---|---|
| `<Scene beats loop? hold?>` + `<Cursor />` | A new product scene (prefer `Frame` from graphics/kit) | Decoration with no product meaning |
| `<Enter i>` | Hero eyebrow, lead, CTAs, product window on page load | The h1 (keeps LCP fast) |
| `<ScrollRise>` | One product window or section visual per section | Text blocks |
| `<Reveal delay?>` / `<Stagger>` | Headings and card groups below the fold | Above-the-fold content; nesting |
| `<CountUp value …>` | Key numbers in a stat band | Unapproved numbers (caption them `ILLUSTRATIVE`, see Honest gaps) |
| `<Marquee label …>` | One row of frameworks/partners per page | Logos we have no rights to |
| `<Parallax speed?>` | Background glows behind a section that clips (`overflow-hidden`) | Text, or any card the reader must read |
| `<Spotlight tilt?>` | Feature cards; `tilt` on 2–4 hero-level cards only | Text-heavy cards with tilt |
| `<GradientBorder fill?>` | The one featured card in a view | More than one per view |
| `<Terminal label lines cps?>` | CLI moments; lines ≤ 40 characters | Real secrets, hostnames or customer data |
| `<TabUnderline>` | Wrap `<Tabs>` for a sliding underline | — |
| `<Live>` | Root of anything with a CSS loop (pauses offscreen) | — |

**Product scenes** (`@/components/graphics`; theme tokens only, each `role="img"` with an `aria-label`. Put the `ILLUSTRATIVE` caption under any a reader could take as real.)
| Scene | Story (end state) | Where it belongs |
|---|---|---|
| `<FindingsTable />` | A critical IDOR lands, the cursor triages it, it goes In fix → Fixed, retest passed | Pentest / consulting, homepage proof |
| `<FixDiff />` | The vulnerable line is flagged, the tenant check is added, the call returns 403, retest passed | Remediation moments |
| `<AiAttackSurface />` | A support bot answers, a prompt injection is blocked by the guardrail (OWASP LLM01), answered safely, logged to the SIEM | AI security pages, homepage AI section |
| `<AttackPath />` | The path is drawn across five real assets to the customer DB, the cursor rotates the leaked token, the path closes | Exposure management, threat hunting, pentest |
| `<ThreatPipeline />` | A SOC case goes Detect → Confirm → Contain → Prove: assigned, contained, filed as SOC 2 evidence | Managed SOC / MDR |
| `<SocMap />` | Dark live SOC console: a triaged event slides in every 2.4s with its outcome (the one loop) | Managed SOC/NOC hero or proof band; counts as the page's one dark element |
| `<ComplianceRing frameworks? />` | Coverage bars fill, four controls flip Collecting → Evidence collected with their source, Audit-ready | GRC, compliance automation; up to 3 frameworks |
| `<DivisionOrbit core? />` | One engagement handed across Consulting → AI Security → Managed → Platform, each Queued → Active → Done | Company page |
| `<FindingsJourney />` | One real item (finding / privacy request) travels a 4-column board; header counts tick as it lands, each stop stamps the card, side notes account for every exit. Stacked tiles under 36rem container | Home "Where a quarter's findings end up", /platform/privacy-automation proof |
| `<PentestTerminal />` | A finding typed once in a terminal | Pentest, API protection |

**Budget:** at most one looping piece per section and two in view. Keep Lighthouse mobile performance ≥ 95 on any page you add a scene to.

## Content rules

- Copy is plain, confident and short. Don't use "cutting-edge", "next-gen" or "revolutionary".
- **No invented facts presented as real, and no visible `[placeholder]` / `[proposed name]` tags** (buyers read them as an unfinished site).
- **Honest gaps.** Where a fact is not confirmed (SLA numbers, durations, prices, locations, certifications, names):
  - Write honest wording instead: "agreed in your SOW", "scoped per engagement", "Example engagement", "Illustrative data". Or leave the claim out.
  - Track the gap invisibly: a `{/* gap: <what the human must supply> */}` JSX comment or a `data-gap="<what>"` attribute on the element. `grep -rn 'gap:\|data-gap' site/` lists them all.
  - Mockup and chart data: caption with `ILLUSTRATIVE` only.
  - Unconfirmed method or product names: use plain descriptive wording ("Our AI attack method") until the human approves the name.
- Wherever practices appear together, Consulting and AI Security come first and get the most weight; Managed Services and Platform follow as support.
- Contacts: `CONTACT.security` for vulnerability reports and security policy, `CONTACT.legal` for legal and privacy notices, `CONTACT.email` for everything else.
- Product names are descriptive (API Protection, Exposure Management…) until the company supplies real names.
- The logo is a placeholder (`components/Logo.tsx`; tracked in a code comment, never shown as a tag).

## Accessibility checklist (every page)
- One `h1`, then headings in order; every section has `aria-labelledby`.
- Interactive targets are at least 40px tall on mobile; focus is visible (global `:focus-visible` ring in accent).
- Color is never the only signal: severity badges carry text.
- Check the layout at 375px and 1440px before handing off.

## Adding a phase-2 page
1. Create `app/<path>/page.tsx` at an href already in `lib/nav.ts`. The real page replaces the stub automatically (`app/[...slug]` only serves hrefs that have no page).
2. Compose from `Section`, `SectionHeading`, `Card` and the mockup kit, and end with `FinalCta` (and `Faq` if needed) from `components/sections.tsx`.
3. Export `metadata` with `title` (≤ 60 chars with the " · Resilient Privacy" suffix the layout adds) and `description` (≤ 160 chars). Canonical, Open Graph and Twitter defaults come from the layout; if you set `openGraph`, repeat the fields you need (Next replaces it, it doesn't merge). Detail pages add `<JsonLd data={service({...})} />` (hubs: `type: "ProfessionalService"`). A new real page drops out of the stub route and into `sitemap.xml` automatically.
4. Run `npm run build`.

## Charts

Animated data charts live in `@/components/charts` (hand-written SVG/CSS, no dependency). Usage for every chart is in its source under `@/components/charts`. Built with the `dataviz` method: form first, colour by job, palette run through its validator.

**Rules every chart follows**
- **Says something real about security work.** One story per chart (MTTR falling, findings closing, alerts becoming incidents). If the story is one number, use `KpiTiles` or `Gauge`, not a chart.
- **Plays once in view, base CSS is the end state.** `ChartFrame` sets `data-play="on"` when 30% is visible; marks animate only under `prefers-reduced-motion: no-preference` + `scripting: enabled`, so reduced motion, no-JS and print show the finished chart. The only loop is `Sparklines live` (pulsing end dot), paused offscreen via `data-live`; use it only for data that is actually live.
- **Readable without colour or a mouse.** Legend for 2+ series (dashed/dotted strokes as the second channel), a visually hidden data table in every frame, hover tooltip on every `[data-tip]` mark, and the same tooltip by keyboard (Tab to the plot, arrow keys, Home/End, Esc). Text never wears a series colour.
- **Container-relative, no layout shift.** SVGs size from their viewBox (`w-full h-auto`, capped `max-w-[32–36rem]`); HTML charts use % geometry. Only `transform`, `opacity`, `clip-path`, `stroke-dashoffset` animate.
- **Data comes in as props.** Presets in `components/charts/data.ts` are illustrative: keep the "Illustrative data" caption (default `placeholder` prop) until the numbers are real.

**Colour**
| Job | Tokens |
|---|---|
| Categorical (max 3 series, fixed order) | `#5b47e0` accent (solid) · `#1baf7a` aqua (dash `6 4`) · `#e87ba4` pink (dash `2 4`). Validator: all-pairs pass on white; aqua/pink sit below 3:1 contrast, so the dash, legend and table are mandatory |
| Severity | status tokens `critical` / `high` / `medium`, `navy-400` for low; never for identity |
| Risk matrix | `-soft` status fills for the grid, status base for the count dots (white text on critical/ok, ink on high/medium) |
| Neutral / not on the story | `navy-300`, `line-strong`; grid and axes are 1px solid `line` |

**Pieces**
| Chart | Props (besides `title`, `desc?`, `placeholder?`) | Story |
|---|---|---|
| `<RadarChart>` | `axes`, `series` (1–3 `{name, values}`), `max` | Maturity per area; toggle morphs the filled shape between series. Presets `RADAR_NIST` (CSF 2.0 tiers 1–4), `RADAR_AI`, `RADAR_VENDOR` |
| `<TrendChart>` | `points` `{label, value}[]`, `unit?`, `target?` | A measure over time against an SLA/target |
| `<StackedBars>` | `keys` `{label, color}[]`, `groups` `{label, values}[]` | Open findings by severity per sprint |
| `<Gauge>` | `value`, `max?`, `label`, `note?`, `goodWhen?` (`"low"` default: risk bands Low/Elevated/High/Critical; `"high"`: readiness bands Not ready/In progress/Nearly ready/Audit-ready) | One risk score, or one readiness score, in a band |
| `<Donut>` | `segments` (≤4, first = headline share), `centerLabel` | Controls passing |
| `<RiskHeatmap>` | `counts[likelihood-1][impact-1]` (5×5) | Risk register |
| `<FlowChart>` | `stages` `{label, value, drop?}[]` (square-root band widths, exact labels) | Alerts → triaged → incidents → contained |
| `<Timeline>` | `phases` `{label, start, end}[]`, `weeks` (axis length, counted in `unit`s), `today?`, `unit?` (singular: `"week"` default, `"day"`, `"hour"`; names the axis, tooltip and table columns) | Engagement plan, done / in progress / planned |
| `<AttackGraph>` | `nodes` `{id, label, x, y, note?}` (400×260 space), `edges`, `path` | Attack path lighting hop by hop |
| `<Sparklines>` | `items` `{label, values, unit?, decimals?, goodWhen}`, `live?` | Several trends at a glance |
| `<KpiTiles>` | `items` `{label, value, decimals?, prefix?, suffix?, delta?, good?}` | Headline numbers that count up |
| `<ChartFrame>` | `table`, `legend?`, `controls?`, `children` | Wrap a new chart: in-view play, tooltip, hidden table, caption |

**Where they belong:** NIST radar on GRC / vCISO, AI readiness radar on AI Security governance, vendor radar on third-party risk; `TrendChart` + `StackedBars` on pentest and remediation; `FlowChart` + `Sparklines` on Managed SOC/MDR; `RiskHeatmap` on risk assessment; `Timeline` on how-we-work/engagement pages; `AttackGraph` on exposure management and threat hunting; `Gauge`/`Donut`/`KpiTiles` in proof bands. At most two charts in view at once, and keep Lighthouse mobile performance ≥ 95 on any page you add one to.
