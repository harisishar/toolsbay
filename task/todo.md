# claudetools build plan — status

Source plan: build all four tools from intruction.md (approved 2026-07-29).
Decisions: PDF hard conversions get a server path (Browser Rendering + Container);
calculator scope = ~40 core + Malaysia + 8-country salary; no custom domain yet (workers.dev,
no deploy).

## Phase 0 — workspace root

- [x] pnpm-workspace.yaml, root package.json, strict tsconfig
- [x] CLAUDE.md: PDF server-path exception recorded
- [x] CLAUDE.md: Next.js question resolved (stack is sufficient)

## Phase 1 — tools/qr

- [x] Scaffold package (wrangler.jsonc, tsconfigs, esbuild client build, Tailwind CLI)
- [x] Payload builders (url/text/wifi/vcard/email/sms/phone/geo) + node:test self-checks
- [x] QR generator UI (canvas render, ECC/size/colors, PNG/SVG/JPG download)
- [x] Barcode generator (CODE128, EAN-13, UPC, CODE39; SVG/PNG download)
- [x] Per-type SEO landing pages (/wifi-qr-code, /vcard-qr-code, …)
- [x] APAC payment-QR content pages (PayNow, DuitNow, UPI, PromptPay)
- [x] SEO baseline: title/meta/canonical/OG/JSON-LD, sitemap.xml, robots.txt, llms.txt
- [x] typecheck + check + wrangler dev verified in browser, commit

## Phase 2 — tools/image

- [x] Scaffold package
- [x] Compress / resize / convert / crop (Canvas), HEIC decode (WASM), batch drag-drop
- [x] Programmatic format-pair pages (/jpg-to-png, /heic-to-jpg, …)
- [x] SEO baseline + verify + commit

## Phase 3 — tools/pdf (client-side)

- [x] Scaffold package
- [x] pdf-lib features: merge, split, rotate, organize, page numbers, watermark, crop, jpg→pdf
- [x] pdf.js features: pdf→jpg, extract images, compare, pdf→markdown/text
- [x] Combined: compress, edit, sign, redact, forms, protect/unlock, scan-to-pdf
- [x] SEO baseline + verify + commit

## Phase 4 — tools/pdf (server path, approved exception)

- [x] HTML→PDF via Browser Rendering binding (URL validation, no internal hosts)
- [x] Container (LibreOffice + ocrmypdf + qpdf): PDF↔Office, OCR, PDF/A, Repair
- [x] Size caps + content-type validation at Worker boundary, stream-through, commit

## Phase 5 — tools/calculator

- [x] Scaffold package
- [x] ~40 core calculators (data-driven pages, assert self-checks per module)
- [x] Malaysia: KWSP/EPF, SOCSO+EIS, PCB (MTD), take-home salary
- [x] Country salary-after-tax: US, UK, SG, AU, IN, DE, CA, JP
- [x] Per-calculator SEO pages + verify + commit

## Phase 6 — SEO/AEO/GEO sweep

- [x] Run /seo-geo per tool, act on findings
- [x] Final verify: sitemaps, robots, llms.txt, JSON-LD across all four tools

## Bugfixes

- [x] Crop tool blank canvas: paint() measured clientWidth while x-show still hid the panel
      (scale 0 → 0×0 canvas) + p-4 padding skewing pointer coords — fixed in
      tools/image/src/client/app.ts, verify in browser

## Domain launch: toolsbay.app (2026-07-29)

- [x] Custom domain routes in all four wrangler.jsonc (calc./image./pdf./qr.toolsbay.app,
      custom_domain: true, workers_dev: false)
- [x] New tools/hub Worker: apex landing page on toolsbay.app + www→apex 301, robots/sitemap,
      WebSite + ItemList JSON-LD
- [x] wrangler login (auth expired — user interactive step)
- [x] Deploy calculator, image, qr, hub Workers
- [x] Deploy pdf Worker with --containers-rollout=none (no Docker; container conversions
      pending — Browser Rendering URL→PDF and client-side tools live)
- [x] Verify: 200 + correct canonical on each subdomain, www 301→apex, workers.dev disabled

## pdf container via GitHub Actions (2026-07-29)

- [x] .github/workflows/deploy-pdf.yml — CI builds the container image (GH runners have
      Docker) and deploys; Workers Builds can't build containers, no CF remote image build
- [x] User: create Cloudflare API token (Edit Cloudflare Workers template + Containers Edit),
      add as repo secret CLOUDFLARE_API_TOKEN on harisishar/toolsbay
- [x] Trigger first run (gh workflow run deploy-pdf.yml), watch until green
- [x] Validate pdf /api/convert/* end-to-end: word-to-pdf returned a valid PDF (200, %PDF-1.6)
- [ ] og:image artwork per tool (needs brand decision; OG tags ship without images for now)
- [ ] Optional per brief: dynamic QR codes (needs KV), currency converter (needs live FX rates)
- [x] AdSense/ad slots once domains + traffic exist → see "AdSense placement" below

## AdSense placement (manual units only, Auto ads off — no popups/overlays)

- [x] `packages/seo/src/ads.ts`: ADSENSE_CLIENT (ca-pub-4725551882364441) + AD_SLOTS
- [x] `public/ads.txt` in all 5 workers (served at each subdomain root by Workers Assets)
- [x] 4 layouts: async adsbygoogle script in head + AdSlot component + content-bottom slot between main and footer (min-h reserved, zero CLS)
- [x] Desktop rail (300×250 area, `hidden lg:block`) under sticky aside: calculator results panel + QR preview
- [x] Hub: ads.txt only, no ad units (clean brand page)
- [x] Build all workers green
- [x] User dashboard: created 2 display units; real slot IDs wired (contentBottom 8992161056 responsive, rail 2571202877 fixed 300×250)
- [x] Deploy all 5 workers + verify ads.txt live
- [ ] User dashboard (remaining): confirm Auto ads OFF for toolsbay.app; enable GDPR consent message (Privacy & messaging)

## Post-launch additions

- [x] /privacy-policy on all four tools (shared copy in @claudetools/seo, tool-accurate
      server-path disclosure for pdf) + footer privacy emphasis + sitemap entries (2026-07-29)
- [x] /privacy-policy on hub (toolsbay.app) — same shared copy, footer link, sitemap entry;
      deployed and verified live (2026-07-29)

## html-to-pdf 422 fix (2026-07-29)

- [x] tools/pdf/src/api.ts: reuse Browser Rendering sessions (sessions()+connect, launch keep_alive fallback) — root cause of "every URL fails" (new-browsers/min cap)
- [x] launch/connect failure → 429 "Converter is busy" instead of 422/500; log real errors in both catches
- [x] Render on networkidle0 timeout instead of failing; normal Chrome UA to dodge bot blocks
- [x] Build pdf worker, push → CI deploy, verify with rapid-fire curl + heavy page
      (6 concurrent → all 200 %PDF; nytimes.com → 200, 6.7MB PDF in 26s)

## Keyword research — all 5 tools (2026-07-30)

Output: `task/keywords/{README,calculator,image,pdf,qr,hub}.md` — 134 mapped queries + gap lists.

- [x] No metrics API reachable: OpenSEO MCP not connected; Semrush MCP = "corporate sub-account,
      not enough API units". Ran SERP-evidence based instead; every Volume/KD/CPC cell is `unknown`
- [x] Page inventory pulled from code (111 slugs): 43 calcs, 29 pdf, 21 image pairs + 4 core,
      12 qr types + barcode, hub
- [x] Competitor inventories fetched live: calculator.net (~200 calcs), ilovepdf.com (33 tools),
      iloveimg.com (13 tools), me-qr.com
- [x] SERP harvest across all 5 tools (image compressor, merge pdf, qr code generator, heic to jpg,
      kwsp epf 2026, barcode generator, wifi qr, multi-country salary, free online tools)
- [x] Verified: every Target page resolves to a shipped slug; every proposed gap is genuinely
      unbuilt; no fabricated metrics

### Acting on the findings (2026-07-31)

- [x] MY statutory pages carried a **stale 2025**, not a missing year. Added FILING_YEAR /
      ASSESSMENT_YEAR constants in `salary-my.ts`: titles say 2026 (what people search),
      rate notes say YA2025 (what the brackets are). Verified YA2026 brackets are unchanged
      and that MY convention is "file in 2026 for YA2025" — ringgitplus/sql.com.my title it
      the same way. EPF/SOCSO/EIS rates already current. Bump FILING_YEAR each January
- [x] "No upload" titles: **already done** on image (core + all pairs) and on the client-side
      pdf pages. No change needed; server-path pdf pages correctly omit the claim
- [x] QR: 4 per-symbology pages (code-128, ean-13, upc-a, code-39) + all-formats hub, from one
      renderer. `barcodeApp(format)` presets and hides the picker. Cross-linked, in sitemap
      and llms.txt. Zero new encoding logic — the formats already worked
- [x] Image: added **ico** target (8 new pairs, 21 → 29). Hand-rolled PNG-in-ICO container in
      `ops.ts`; `draw()` clamps to 256 for all callers. Verified in Chrome against the shipped
      bundle: valid header (type=1, count=1, bpp=32, size byte 0 = 256), browser decodes it at
      256×256 with pixels intact
- [x] Image: **skipped avif + tiff.** No browser can encode AVIF via canvas.toBlob (it would
      silently emit PNG), and no browser decodes TIFF without a new JS/WASM decoder. Both need
      a real encoder/decoder dependency — spike before planning
- [x] Hub: full directory of all 127 tool pages (was 4 links). New `catalogue.ts` + rendered
      Group sections + `/llms.txt` with the whole catalogue. Fixed two false claims that were
      live: "53 calculators" (43) and "salary calculators for 8 countries" (1)
- [x] `scripts/check-catalogue.mjs` — fails if the hub catalogue or its quoted counts drift
      from the tool sources. It caught the "53 calculators" lie on first run
- [x] PDF: +5 pages — pdf-to-png, png-to-pdf, pdf-to-text, delete-pages-from-pdf,
      extract-pages-from-pdf (29 → 34). All reuse shipped engines via a new `preset` field;
      each has its own intro + FAQ, not a title swap
- [x] Fixed in passing: `/pdf-to-markdown` defaulted to plain-text output. Now presets 'md'
- [x] All 5 workers build; all new routes verified 200 with correct presets in wrangler dev

### Still open from the keyword maps

- [x] **Correction:** I reported the country salary cluster as unbuilt. It was already built —
      8 countries in `salary-world.ts` (us/uk/singapore/australia/india/germany/canada/japan)
      with real tax engines and existing tests. My slug extraction used a regex and those slugs
      are template literals, so it silently missed them. Real count is 51 calculators, not 43.
      Fixed: catalogue, hub copy, `task/keywords/calculator.md`, README counts
- [ ] Calc: retitle the 8 country pages for local phrasing — "take home pay" (UK), "in hand
      salary" (IN), "brutto netto rechner" (DE), CPF (SG), Medicare levy (AU). They ship with
      generic templated titles and miss the phrase each market searches. See calculator.md
- [ ] Calc: only genuinely missing countries are Indonesia and Philippines (P2)
- [ ] Deploy: nothing here is live yet — 4 workers changed (calculator, image, pdf, qr, hub)
- [ ] Image P1 gaps still unbuilt: rotate-image, watermark-image, convert-to-jpg hub,
      compress-image-to-100kb / passport-photo-resizer (target-size intent)
- [ ] QR P1 gaps still unbuilt: whatsapp-qr-code, google-review-qr-code, menu-qr-code,
      static-vs-dynamic-qr-codes positioning page
- [ ] Re-run with real metrics once Semrush API units exist: pull the Keyword column from all 5
      files, one bulk metrics call, fill Volume/KD/CPC in place (mapping does not need redoing)
- [ ] `/keyword-clustering` on the maps → content briefs

## Competitor comparison pages (2026-08-01)

First pages on this repo targeting commercial-comparison intent rather than transactional
("merge pdf", "heic to jpg"). The keyword maps mined competitor _inventories_ and deliberately
skipped competitor _brand_ queries — this closes that gap. Positioning is limits-led, privacy
second: "runs in your browser" is already every rival's headline (see `keywords/image.md:40-43`
and the live "ilovepdf alternative" SERP), but nobody puts the competitor's actual free-tier
numbers on screen.

- [x] `packages/seo`: shared `Comparison` / `CompareRow` types next to `Faq`. Data only — each
      tool renders with its own Layout/FaqSection, same split as `privacySections()`
- [x] `pdf.toolsbay.app/ilovepdf-alternative` — iLovePDF free tier is Compress 2 tasks/200 MB,
      Merge 25/100 MB, no OCR, no PDF/A; Premium $7 mo / $48 yr; files "deleted within 2 hours"
- [x] `calc.toolsbay.app/calculator-net-alternative` — their income tax calculator is "for
      United States residents only"; concedes their ~200 calculators vs our 51
- [x] `qr.toolsbay.app/qr-code-monkey-alternative` — they cache generated images "for 24h on our
      server", dynamic/stats/bulk are paid PRO; concedes their logo + gradient support.
      Carries "generate qr code" as a secondary term; the head term stays the homepage's job
- [x] `image.toolsbay.app/iloveimg-alternative` — Crop and Editor are 1 task on free, Upscale
      and Remove-background 6 MB/3 tasks; $7 mo / $48 yr
- [x] Each page: Article + FAQPage JSON-LD, feature matrix, "where they're better" section,
      sourced claims with an as-of date, affiliation disclosed. **No AggregateRating** — there
      is no review data here and inventing one is a structured-data policy violation
- [x] `scripts/assert-comparisons.mjs` — shared invariants imported by all four test files
      (title ≤75, desc ≤175, ≥3 sections, ≥3 FAQ, complete matrix rows, https sources,
      disclosure present, a "where they're better" section)
- [x] PDF honesty guard in `tools/pdf/tests/tools.test.mjs`: 10 of 34 tools are server-path, so
      the page may not make an unqualified "never leaves your device" claim and the matrix cell
      must be a count, not a tick. `keywords/pdf.md:34-39` is the reasoning
- [x] Deliberately **not** added to `catalogue.ts` / `TOTAL_PAGES` — these are content, not
      tools, and `check-catalogue.mjs` only imports the tool registries. Still 135
- [x] All four verified 200 in wrangler dev with correct title, canonical, sitemap and llms.txt
      entries, and every "Start here" link resolving. `pnpm typecheck` + `pnpm check` green
- [ ] Deploy — still unshipped, along with everything under the two sections above
- [ ] Re-check competitor pricing/limits quarterly; the `updated` field on each page is the
      date the sources were last read (2026-08-01)

## Validation + unit tests (2026-07-31)

- [x] **Found and fixed my own error:** the 8 country salary calculators were already built.
      My slug extraction regexed `slug: "..."` out of source; those slugs are template literals
      (`${cfg.code}-salary-tax-calculator`) so it silently missed them. Real total: 51 calculators
- [x] Root-cause fix: `scripts/check-catalogue.mjs` now **imports the real modules**
      (ALL_CALCS/TOOLS/PAIRS/QR_TYPES) instead of parsing source, and can regenerate the
      catalogue with `--write`. Node runs .ts directly, so there was never a reason to grep
- [x] Corrected everywhere the wrong number leaked: catalogue (135 pages), hub copy (restored
      the accurate "8 countries" line I had wrongly deleted), calculator.md, hub.md, README
- [x] Wired the catalogue check into `pnpm check` via the hub package

### Tests added (24 new, 52 total, all green)

- [x] `tools/image/tests/ico.test.mjs` (5) — encode() drives the real shipped function with a
      faked canvas: header framing, 256-as-0 size byte, declared length vs actual, PNG passthrough,
      icoFit clamping, and that non-ICO targets still reach canvas.toBlob with the right quality
- [x] `tools/image/tests/pairs.test.mjs` (5) — generated pair surface: count matches
      SOURCES×TARGETS minus no-ops, slug pattern, encodable mimes, SERP length limits, and that
      every lossy conversion discloses what it drops (transparency / animation / 256px ICO cap)
- [x] `tools/pdf/tests/tools.test.mjs` (7) — registry invariants + **the honesty rule**:
      server-path tools must never claim files stay on-device, must disclose the server path;
      client tools must state they run locally. Preset validity and the 5 new pages' wiring
- [x] `tools/qr/tests/content.test.mjs` (7) — unique slugs, JsBarcode format validity, formats
      safe to inline into x-data, each symbology page names its own format, payment pages stay
      guides (never generators — a minted merchant QR fails at the till)
- [x] `renameForType` extended for the .ico extension
- [x] **Bug the tests caught:** `html-to-pdf` was `server: true` with no disclosure FAQ at all.
      Added an accurate one (it takes a URL, not a file, so the shared serverFaq did not fit)
- [x] Mutation-checked the new assertions: breaking the ICO offset, declared length, the clamp,
      a preset, or a server flag each fails the suite. (Writing the size byte literally does NOT
      fail — Uint8Array truncates 256 to 0, so that mutation is behaviourally identical)
- [x] Full sweep green: `pnpm typecheck`, `pnpm check` (52 tests + catalogue), 5/5 builds,
      all 8 country calculator pages verified 200 in wrangler dev
