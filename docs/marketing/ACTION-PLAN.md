# Action plan — RuntimeWire tactics applied to majliskenduri.com

Companion to `task/RUNTIMEWIRE-TEARDOWN.md`. Prioritised Critical → Low.

## Where you already stand

Worth saying before the gap list, because it changes what's worth doing: **you are closer to
RuntimeWire than expected.**

| Tactic | RuntimeWire | majliskenduri | Status |
|---|---|---|---|
| Server-rendered HTML for crawlers | hand-rolled crawler block in an SPA | Next.js App Router SSR/ISR | **already better** |
| `llms.txt` | 6.7 KB hand-written | 44 lines, bilingual, hand-written | **done, good** |
| AI crawlers named in robots.txt | `Allow: /` | named allow-group for 13 AI bots + block-list for `Bytespider`/`CCBot`/`Omgilibot` | **already better** |
| `@graph` with stable `@id`s | yes | yes — `#organization` + `#website` in `[locale]/layout.tsx` | **done** |
| hreflang | n/a (single locale) | full en/ms alternates in `sitemap.ts` | **already better** |
| Page-level schema linked by `@id` | yes | **no** — standalone blocks | gap → P1 |
| `BreadcrumbList` on every page | yes | **none** | gap → P1 |
| `/ai-information` citation page | yes | **no** | gap → P2 |
| Outbound primary-source citation | 17 links/article | **none** | gap → P3 |
| URL inventory | 2,567 | **37** | gap → **P0** |
| Compression / caching | broken on their side | `s-maxage=3600, stale-while-revalidate` — fine | **already better** |

So the work is narrow. One large item, three small ones.

---

## P0 — Critical: 166 catalogue designs sit behind 1 indexable URL

### The finding

`apps/marketing/src/lib/site-routes.ts` produces 37 sitemap URLs. The entire catalogue is one
entry: `/app/catalogue`.

Meanwhile `apps/web/src/app/catalogue/designs/[slug]/preview/page.tsx` **already renders every
design individually**. There is no `[slug]/page.tsx` landing page, and no slug appears in any
sitemap. Every design already has a real screenshot thumbnail (produced by
`bun run db:publish-design`, stored in `scripts/seed-data/catalogue-thumbnails.ts`).

You have the content and the assets. You have no URLs pointing at them.

This is the direct analogue of RuntimeWire's 2,500 article URLs, and it lands on search demand
you are *already* targeting — `/contoh-kad-kahwin` and `/template-kad-kahwin-boleh-edit` exist
precisely because people search for specific card examples. Right now those pages describe
designs that have no page of their own.

### The work

1. **New route** `apps/web/src/app/catalogue/designs/[slug]/page.tsx`
   - `h1` = design name; the existing thumbnail as the LCP image with a real `alt`
   - Descriptive copy: style (songket / batik / floral / Islamik / moden / klasik / rustik /
     cat air), palette, what occasion it suits, what is editable
   - Link to the existing `/preview` render; CTA into the editor
   - `generateMetadata` with canonical, matching the pattern in the `[locale]` marketing pages
2. **Schema**: `Product` or `CreativeWork` + `BreadcrumbList`, with
   `"publisher": { "@id": "${SITE_URL}/#organization" }` referencing the graph already declared
   in `apps/marketing/src/app/[locale]/layout.tsx`
3. **Sitemap**: slugs are DB-backed, so `apps/marketing/src/app/sitemap.ts` needs to read the
   published-design list rather than only mapping the static `ROUTES` array. A separate
   catalogue sitemap referenced from `robots.ts` is the cleaner split if the count grows.
4. **Internal linking**: link from `/contoh-kad-kahwin` and `/contoh-kad-kahwin-digital` to the
   individual design pages instead of only to `/app/catalogue`.

### The gate — read this before shipping

166 pages generated from one template with only a name swapped is thin content and reads as a
doorway-page pattern. It will cost you more than the URLs gain.

Ship only the designs that have genuinely distinct descriptive copy. Start with 15–20, confirm
they hold up (distinct titles, distinct 150+ word bodies, distinct imagery), then expand. If
writing 166 distinct descriptions is not realistic, cap the set — a well-covered 30 beats a
thin 166.

---

## P1 — High: schema is fragmented, and no page has breadcrumbs

### `@id` linking

`[locale]/layout.tsx` declares the graph correctly. But the page-level JSON-LD in
`features/`, `pricing/`, `soalan-lazim/`, `kad-kahwin-digital/`,
`components/seo/KeywordLanding.tsx` and `components/invitation/CoverGallery.tsx` each emit a
standalone `@context` block with its own inline organization/publisher data.

Replace those inline objects with `{ '@id': `${SITE_URL}/#organization` }`. Google then
resolves one entity instead of reconciling several. Small diff, real effect.

### `BreadcrumbList`

RuntimeWire has it on every template. You have it on none. Cheapest win in this document.

`components/seo/KeywordLanding.tsx` is already shared by the keyword pages, so adding it there
covers most of the site in one edit. Add it to `features`, `pricing`, `about`, `soalan-lazim`
individually.

---

## P2 — High: no `/ai-information` page

You have `llms.txt` but no page stating how AI systems should attribute you. That page is what
gets your brand named correctly when ChatGPT, Perplexity or an AI Overview answers
"kad kahwin digital murah" or "macam mana nak buat kad kahwin digital".

Add `apps/marketing/src/app/[locale]/ai-information/page.tsx` (bilingual, following the
existing route pattern). Contents:

- What MajlisKenduri is, in one paragraph, in both languages
- Attribution: publisher name, canonical URL, link-to-the-specific-page instruction
- Canonical facts an AI should get right: **pay-once, from RM10, no recurring subscription**;
  1/2/3-month plans at RM10/RM20/RM30; occasions covered (kahwin, kenduri, tunang, aqiqah,
  hari jadi); market Malaysia; languages ms + en
- Contact: hello@majliskenduri.com

Then: add `/ai-information` to `ROUTES` in `site-routes.ts`, link it from
`public/llms.txt` under "Halaman utama / Key pages", and add it to `/peta-laman`.

Copy goes in `src/i18n/messages/{en,ms}.json`, not in the component — per the existing
marketing-i18n convention.

---

## P3 — Medium: give the keyword pages something to cite

Your keyword pages assert facts — pricing comparisons, print-vs-digital cost claims, feature
capabilities — with nothing backing them. RuntimeWire's pages get cited partly *because* they
link out to primary sources.

Two changes, applied through `KeywordLanding.tsx` so they land everywhere at once:

1. **A summary block near the top** — the "Why it matters" equivalent. 2–3 sentences under
   its own heading, written as the passage you want quoted verbatim in an AI Overview. You
   already do the first-60-words definition on `/kad-kahwin-digital`; make it a component and
   apply it consistently.
2. **Outbound citation where you make an external claim.** Printing costs, postage rates,
   Malaysian wedding-industry figures — link the source. `rel="noopener noreferrer"`,
   followed. Cite yourself for product facts by linking `/pricing` and `/features`.

---

## P4 — Low

- **`lastmod` is a single constant.** `sitemap.ts` stamps every URL with one `LAST_MODIFIED`
  value from `site-routes.ts`. A shared constant that moves on every deploy is noise, not a
  freshness signal. Per-route dates, updated when the copy actually changes.
- **TTFB.** Measured 1.05 s on `https://majliskenduri.com/` (44 KB homepage) against
  RuntimeWire's 0.48 s. Caching headers are correct (`s-maxage=3600` +
  `stale-while-revalidate`), so this is likely a cold-start or origin-compute issue rather than
  a caching one. Worth a trace, well below the P0 work in value.

---

## Deliberately not recommended

RuntimeWire does these because it is a high-velocity publisher. You are a SaaS with a stable
page set — they would be cost without return:

- News sitemap · RSS · podcast feed
- Author `Person` entities and per-author pages
- A public MCP server
- `ads.txt`

---

## Order of work

1. **P1 breadcrumbs + `@id` linking** — hours, low risk, immediate. Do this first regardless.
2. **P2 `/ai-information`** — one page, one i18n block, follows a pattern you've used 10 times.
3. **P0 catalogue pages** — the real prize, and the only item needing a content decision
   (how many designs get real copy). Start it once you've decided the cap.
4. **P3 citations**, then **P4**.

## Verification

```bash
bun run dev                    # apps/marketing :3033, apps/web :3034
bun run lint && bun run check:types
curl -s localhost:3033/sitemap.xml | grep -c '<loc>'   # expect > 37
curl -s localhost:3034/catalogue/designs/<slug>        # h1/desc/canonical in RAW html
```

- Paste each changed page's JSON-LD into the Rich Results Test: `BreadcrumbList` valid,
  `Organization` resolving by `@id` rather than duplicated.
- Spot-check three design pages for genuinely distinct body copy before enabling the rest.
- Remember `rm -rf apps/marketing/.next` first — dev has served a stale sitemap compile before.
