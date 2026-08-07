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
- [x] Deploy: all five workers live as of 2026-08-02
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

## ImgSquash rename + /remove-background (2026-08-01)

Plan: `~/.claude/plans/for-pixsquash-change-to-tender-wombat.md`.

Was paused mid-flight: a second Claude session was writing the same four image files
concurrently (the competitor-comparison work, now committed as f8b818a). Resumed after it
landed. Cost of the collision: the rename surface grew 5 -> 13 occurrences, because the new
comparison prose names the tool nine times in `content.ts`.

### Part 1 - rename (commit b0e095c)

- [x] `SITE.name` in `tools/image/src/seo.ts` - the source of truth
- [x] `index.tsx` homepage title was the one literal bypassing `SITE.name`. Now built from
      `SITE.name`/`SITE.tagline`, the same string the line below it already used
- [x] The 9 occurrences in the comparison prose, plus the hub `TOOLS` entry (separate Worker,
      genuinely a second copy), `task/keywords/image.md`, `task/keywords/README.md`
- [x] `tests/pairs.test.mjs` pinned the brand in `assertComparisons()`. That assertion catches
      prose that forgets to name the tool - it should not pin what the tool is called. Now
      reads `SITE.name`, so a rename cannot fail the suite for the wrong reason again

### Part 2 - /remove-background

- [x] **Collapsed five duplicated core-page lists into one `CORE` array** in `content.ts`
      (homepage tiles, sitemap, llms.txt, layout nav/footer, and `IMAGE_CORE` hardcoded in
      `scripts/check-catalogue.mjs`). The script already imported that module for `PAIRS`, so
      its copy just deleted. This is what made the new page a one-line addition
- [x] Engine: `onnxruntime-web` 1.27 (MIT), CPU/WASM, `numThreads = 1` - AdSense rules out
      COOP/COEP so there is no SharedArrayBuffer and no threading
- [x] Model: `silueta.onnx`, 42 MiB, 320x320, U-2-Net. Apache-2.0 upstream
      (xuebinqin/U-2-Net), redistributed by rembg (MIT)
- [x] **Licensing dead ends, do not revisit:** `@imgly/background-removal` is AGPL-3.0;
      BRIA RMBG-1.4 and 2.0 are CC BY-NC ("commercial use subject to a commercial agreement").
      Neither is usable on an ad-funded site. They are the better models; that is the trade
- [x] Cloudflare caps a static asset at 25 MiB, so `vendor.mjs` splits the model into three
      14 MiB parts and the client concatenates them. `InferenceSession.create()` takes a
      `Uint8Array`, so this avoids ONNX `externalData`, which would have needed Python
- [x] `vendor.mjs` downloads from a pinned release URL and **verifies sha256 before writing**,
      caching in `node_modules/.cache`. A model file is executable input to ONNX
- [x] Constants shared between build and client in `src/lib/model.ts` - a part-count drift
      between the splitter and the reassembler would surface as an unreadable ONNX parse error
- [x] Lazy chunk `client/bgremove.ts` (the HEIC pattern from `ops.ts`, memoised like the PDF
      engine, and cleared on failure so a network blip does not poison later attempts)
- [x] **No new Alpine component.** `'removebg'` is one branch in `imgApp.processOne`, so batch,
      ZIP, per-file status and error handling all came free
- [x] `public/_headers` pins the model and runtime to `immutable` - verified honoured by
      Workers static assets, not just assumed

### Bug found by testing it for real

- [x] Shipping only `ort-wasm-simd-threaded.wasm` failed with "no available backend found":
      the bundled ORT build still resolves its glue `.mjs` through `wasmPaths` at runtime.
      Vendored both halves. Would not have shown up in any unit test

### Tests (13 new, 90 across the repo, all green)

- [x] `tests/segmath.test.mjs` (8) - the two transforms with no visual tell: planar-vs-
      interleaved NCHW layout, the max-divisor normalisation (rembg divides by the image's
      brightest channel, not 255 - it looks like a bug and is not), all-black input not
      dividing by zero, flat mask returning transparent rather than NaN
- [x] `tests/core.test.mjs` (5) - `CORE` invariants, and that the remove-background FAQ
      actually discloses the download size, the no-upload claim and the PNG output
- [x] Root-caused the honesty test instead of editing its expectation: it hardcoded a feature
      list, so shipping background removal made it fail on a row that had become _true_. It
      now gates on `CORE`, so shipping a page releases its own guard
- [x] Mutation-checked: breaking the max-divisor kills 3 assertions; restoring is green

### Measured in the browser, not estimated

- [x] Cutout verified visually and numerically: subject alpha 255, all three background
      sample points 0, 15.2% opaque / 84.1% transparent / 0.7% feathered, dimensions preserved
- [x] **~10 s warm for one 800x600 image; ~14 s each in a batch of three.** Upper half of the
      5-15 s I predicted. Honest, and the reason the FAQ says so out loud
- [x] ~30 MB over the wire (gzip takes each 14.7 MiB part to ~8.9 MiB), not the 55 MB the copy
      quotes - the constant is the uncompressed ceiling, which is the safe number to promise
- [x] No model or runtime fetch until a file is dropped - confirmed empty on page load, so LCP
      is untouched. Model parts fetched exactly once across five images
- [x] **No POST of any kind.** Every request is a static asset GET
- [x] `pnpm typecheck` + `pnpm check` (90 tests + catalogue) green, 5/5 builds; catalogue at
      136 pages

### Deliberately skipped

- [ ] WebGPU tier (BiRefNet-lite, MIT, much better edges) - ORT's WebGPU binary is 25.6 MiB,
      itself over the Cloudflare per-file cap. Gate on `navigator.gpu` if quality costs traffic
- [ ] Guided-filter mask refinement. Bilinear upscale ships; 320x320 is the quality ceiling
- [ ] Mobile fallback to the 4.4 MiB `u2netp`. One model shipped; measure phone traffic first.
      At ~14 s on a laptop this is the most likely thing to need doing
- [ ] AI upscaling stays unbuilt - same architecture, but 170 MB+ models at 1024x1024

- [x] **Deployed 2026-08-02** — see the deploy section at the end of this file

## Content depth pass — fixing thin pages (2026-08-01)

Measured before starting: 119 of 150 routes rendered under 200 words of prose. Calculator pages
averaged **71 words** (min 33) — an `<h1>`, one sentence, a widget and a single FAQ. The four
comparison pages were the only content on the estate a crawler would recognise as such.

### Phase 0 — infrastructure (done)

- [x] `packages/seo`: `howToJsonLd`, `breadcrumbJsonLd`, `datePublished`/`dateModified` on
      `articleJsonLd`, `lastmod` support in `sitemapXml`, shared `Section`/`Step` types
- [x] `scripts/assert-prose.mjs` — shared depth invariants: lead block 120–190 words, >= 3 sections, >= 4 FAQ, title <= 75 / desc <= 175 (the calculator registry had **no**
      SERP-length assertion before this), `updated` date format, and a **cross-page similarity
      guard** (trigram Jaccard, digits stripped, 50% ceiling) so templated depth cannot become
      duplicate content
- [x] Calculator `prose-tool` CSS gained `h3`, `strong`, `ol`/`ul` (it styled only h2/p/a)
- [x] Visible breadcrumb `<nav>` + `crumbs` prop on the calculator Layout; category anchors
      added to the homepage so the trail resolves

### Phase 1 — calculator, all 51 pages (done)

- [x] `Calc` gained `sections`, `steps?`, `source?`, `updated`; `intro` is now the 130–170 word
      citable lead block. Rendered through the same `<article class="prose-tool">` loop the
      comparison pages already used — no new component
- [x] Every page carries a **"How this is calculated"** section with the real formula and a
      worked example. Unique per page by construction, and the thing Calculator.net mostly
      does not do
- [x] Statutory pages cite the authority: KWSP, PERKESO, LHDN, HMRC, IRAS, ATO, IRS, CRA, NTA
- [x] `HowTo` + `BreadcrumbList` JSON-LD on every calculator page; sitemap now carries `lastmod`
- [x] Result: **min 647 / median 743 / max 1,032 words** (was min 33 / avg 71). 38,949 words
      total. Worst cross-page similarity 10.1% against a 50% ceiling
- [x] `pnpm typecheck` + `pnpm check` green; 27/27 calculator tests pass; `TOTAL_PAGES` still 136
      (no new URLs, catalogue untouched)

### Phase 4 — QR, 13 generator pages (done 2026-08-02)

- [x] `QrType` and `Symbology` gained `sections`; `intro` is now the 137–147 word citable lead
- [x] Per-format fact, not filler: SMSTO vs RFC 5724 encoding, the `WIFI:` string format and its
      escaping rules, `geo:` precision by decimal place, vCard against MECARD, CODE 128 subsets
      and GS1-128, the EAN-13 check digit calculation, UPC number system characters, why CODE 39
      runs ~40% wider
- [x] QR type pages gained the related-links block — they were the only tool without one
- [x] `assertProse` wired into `tools/qr/tests/content.test.mjs` for `QR_TYPES` + `SYMBOLOGIES`
- [x] Result: **343 / 913 / 1,456 words** (min/median/max, was 240 / 355 / 1,456)

### Phase 3 — image, 34 pages (done 2026-08-02)

- [x] `SOURCES`/`TARGETS` extended with `what` / `origin` / `limit` and `what` / `support` /
      `bestFor`; each pair page is assembled from the source's facts, the target's facts and a
      `conversionNote(src, tgt)` keyed to that combination
- [x] `TOOL_SECTIONS` added for the five core pages, with a floor asserted in `core.test.mjs`
      (they are keyed by path rather than being a registry array, so `assertProse` cannot reach
      them)
- [x] `assertProse` wired into `pairs.test.mjs`. **It rejected four drafts at 52–55% similarity
      and was right every time** — the shared block genuinely was carrying the page. Passing
      required the per-combination facts to outweigh the template
- [x] Result: **456 / 948 / 1,449 words** (was 248 / 313 / 1,432); 0 pages under 300

### Phase 2 — PDF, 34 pages (done 2026-08-02)

- [x] `intro` stays the short line above the widget; new `lead` field carries the 131–145 word
      citable block, plus `sections` and extra FAQ. `TOOL_DEPTH` merges into `TOOL_BASE` and
      **throws if a slug has no entry**, so a new tool cannot ship without prose
- [x] Honesty constraint held and extended: `tools.test.mjs` now applies the no-false-privacy
      rule to `lead` and `sections` as well as the FAQ, and additionally requires each server
      tool's lead to say where the work happens
- [x] Result: **535 / 836 / 1,567 words** (was 253 / 298 / 1,567); 0 pages under 300

### Phase 5 — linking (partly done)

- [x] Every tool footer now links back to `toolsbay.app` — the cross-subdomain graph was
      one-directional
- [x] Visible breadcrumb `<nav>` + `BreadcrumbList` on pdf, image and qr, reusing the calculator
      `crumbs` prop. Only the 5 homepages and 5 privacy pages have no trail, which is correct
- [x] Calculator footers still `.slice(0, 9)` per category and image shows `PAIRS.slice(0, 12)`,
      so ~20 pages have no sitewide link — both slices removed 2026-08-08
- [ ] Hub `ItemList` covers 4 tools, not the directory; `WebSite` has no `SearchAction`
      (`SearchAction` deliberately not added — there is no search endpoint to point it at)

### Estate-wide SEO fixes (2026-08-02)

Found by auditing all 150 live URLs, not by reading the source — worth repeating periodically.

- [x] `og:image` + `twitter:image` on all 150 pages (was **0**); `twitter:card` upgraded to
      `summary_large_image`. Cards are committed PNGs regenerated by `scripts/og-cards.mjs`;
      the pdf card omits "nothing uploaded" because 10 of its tools are server-path
- [x] Hub `/privacy-policy` had no OG or Twitter tags at all — it hand-rolls its own `<head>`
- [x] Sitemap `lastmod` on pdf, image, qr and hub (was calculator only); qr now uses the shared
      `sitemapXml` instead of building the XML by hand
- [x] 9 titles over 60 chars fixed. Note: the first count said 12 — `&amp;` was being counted as
      5 characters in the raw HTML. Decode entities before measuring
- [x] 26 descriptions over 160 chars fixed, and **`assert-prose.mjs` tightened from 175 to 160**
      — the old ceiling sat above Google's truncation point, so it permitted the exact problem
      it looked like it was preventing
- [x] GA4 (`G-8DXNR0KTVT`) on all five Workers via `GA_ID`/`GA_INIT` in `packages/seo`

### Deploy and CI (2026-08-02)

- [x] **All five Workers live and verified.** hub, calculator, image, qr deploy from the CLI;
      pdf deploys from `.github/workflows/deploy-pdf.yml` (it needs a Docker builder for the
      container), now gated on typecheck + tests
- [x] `packageManager: pnpm@11.17.0` added — Workers Builds reads it to pick the pnpm version
- [ ] **Connect hub, calculator, image and qr to Cloudflare Workers Builds** so a push deploys
      them the way it already deploys pdf. Dashboard-side; settings are in the plan file. Build
      command is not optional — `public/styles.css`, `js/`, `vendor/` and `fonts/` are gitignored

### Still open

- [ ] Roll `assert-prose.mjs` over the comparison pages too — they are covered by
      `assert-comparisons.mjs`, which has no SERP-length assertion, which is how a 169-char
      description survived the pass that fixed the other 25

---

## AdSense "Low value content" remediation (2026-08-08)

Google AdSense flagged **toolsbay.app** for low value content. Measuring first changed the
diagnosis: the 145 tool pages were never the problem — median 591-803 words per family with
cross-page trigram overlap of 0-11%, already guarded by `assert-prose.mjs`. **The apex was.**
It served exactly two URLs — a 136-link directory and a privacy policy — with no identifiable
publisher, no About, no Contact, no Terms and no article of any kind.

Plan of record: `~/.claude/plans/we-have-gotten-feedback-cryptic-hamster.md`.

### P0 — the apex was a two-page link directory

- [x] `tools/hub/src/layout.tsx` — the hub had no `Layout` at all and hand-rolled `<head>`
      twice inline. One shell now, with `AdSlot`, breadcrumbs, `Prose` and `FaqSection`
- [x] `tools/hub/src/pages.ts` — `/about`, `/contact`, `/terms`, `/how-we-build`,
      `/ai-information`. 428-1,209 words each, all naming primary sources
- [x] `tools/hub/src/guides.ts` — 8 hand-written guides at `/guides/<slug>`, 1,081-1,415
      words of prose each (1,225-1,531 rendered), each with a 120-190 word citable lead,
      4-5 FAQ, outbound primary-source links and a hand-off into the relevant tool
- [x] Hub sitemap **2 → 16 URLs**; apex `robots.txt` now also lists the four subdomain
      sitemaps (`robotsTxt` gained a `sitemaps` option)
- [x] `llms.txt` extended with the trust pages and the guides

### P1 — one publisher identity

- [x] `siteGraph()` in `packages/seo` — a linked `@graph` with a stable
      `https://toolsbay.app/#organization` `@id`, emitted from all five Layouts.
      `webAppJsonLd` and `articleJsonLd` now reference it by `@id` instead of redeclaring an
      anonymous Organization stub on every page. `grep '"@id"'` returned **zero** hits before
- [x] Publisher bar in all four tool footers: ToolsBay named as publisher, plus About /
      How we build / Guides / Contact / Terms / Privacy and **sibling-tool links** — no tool
      linked to any other tool before, the hub was the only connector and only one-way
- [x] **Fixed the live broken promise**: `packages/seo/src/privacy.ts` told readers to use
      "the contact details on the homepage of this site". There were none. Now a real address
      and a link to `/contact`, asserted against in the hub tests
- [x] Privacy policy was byte-identical on five hostnames with five self-canonicals; the four
      subdomain copies now carry a cross-domain canonical to the apex (`canonicalUrl` prop)

### P2 — the pages that genuinely were thin

- [x] **The four payment QR guides** — 183/227/286 words, no lead, no widget, and the one
      family `assert-prose.mjs` did not cover. Rewritten to the family standard (~1,100
      rendered words each) and wired into `assertProse`
- [x] QR homepage 343 → 847 rendered words, image homepage 456 → ~950, via `HOME_SECTIONS`
      in each tool's `content.ts` so the depth assertion can see them
- [x] `"What a AVIF file actually is"` — an `a`/`an` bug on 8 of 29 pair pages, which is
      exactly the artefact that reads as unreviewed machine generation. `article()` in
      `tools/image/src/content.ts` picks by spoken sound, not by letter
- [x] The identical 54-word tail on all 29 pair intros is now target-specific.
      Median pair similarity **11% → 7%**
- [x] `/ai-information` — the RuntimeWire tactic we had not copied

### Articles — markdown publishing on the apex (2026-08-08)

Drop a `.md` file in `tools/hub/articles/`, deploy, done. Filename becomes the URL.

- [x] `scripts/articles.mjs` — reads and parses the directory. Frontmatter is a YAML
      subset parsed in ~15 lines rather than with a dependency; markdown goes through
      `marked` (root **devDependency** — it runs at build time and never ships to the Worker)
- [x] `scripts/build-articles.mjs` → `tools/hub/src/articles.gen.ts`, wired into
      `build:articles` so it runs on every `dev` and `deploy`. Workers have no filesystem,
      so nothing can be globbed at request time — it has to be baked in
- [x] `/articles` index + `/articles/<slug>`, `BlogPosting` + `Blog` JSON-LD referencing
      `#organization` by `@id`, breadcrumbs, reading time, tags, related posts
- [x] Homepage section, header nav, footer, sitemap and `llms.txt` all pick articles up
      automatically. Sitemap **16 → 20 URLs**
- [x] `.prose-md` styling in `tools/hub/src/styles.css` for the rendered markdown
- [x] Three seed articles, 1,026-1,125 words each, none overlapping the eight guides
- [x] **Guards** (`tools/hub/tests/content.test.mjs`): ≥700 words, 90-190 word opening
      paragraph, `##` structure required and `#` rejected, title ≤75, description ≤160,
      valid dates, URL-safe unique slugs, <40% cross-article similarity, dead internal
      links, and a staleness check against the generated module. Tests read the `.md`
      files directly, so a new article is checked the moment it is written rather than
      after somebody remembers to rebuild
- [x] Verified: a 7-word post fails the depth guard; a dropped-in file is live at its
      route with the sitemap updated after one build

**Frontmatter:** `title`, `description`, `date` required; `updated`, `tags` optional.
Body starts at `##` — the page renders the frontmatter title as the `<h1>`.

### Deployed 2026-08-08

- [x] All five Workers live. Apex sitemap **2 → 20 URLs**; every trust page, guide
      and article returns 200; the five apex links in the tool footers resolve
- [x] Operator named: `OPERATOR = "Haris"` in `packages/seo/src/site.ts`, rendered on
      /about and /ai-information and emitted as the Organization's `founder`
- [x] All four tool Workers carry the `#organization` graph and the publisher bar;
      subdomain privacy pages canonicalise to the apex

### Open — blocking the review request

- [ ] **`CONTACT_EMAIL` is set to `hello@toolsbay.app` in the repo but NOT deployed.**
      toolsbay.app publishes no MX records — Cloudflare Email Routing is not enabled — so
      that address bounces today. Production still serves the working Gmail. Enable Email
      Routing on the zone and verify a destination address, then redeploy all five. Shipping
      it before then recreates the exact defect this work removed: a policy page promising
      contact that does not work
- [ ] `SAME_AS` in `packages/seo/src/index.ts` is empty. Real profiles (LinkedIn, GitHub, X)
      on the Organization would materially strengthen the operator signal — a bare `Person`
      with a first name is the weakest form of it
- [ ] **Request the AdSense review from the apex** once the contact address is settled.
      Everything else is live
- [ ] Dashboard: confirm Auto ads are OFF and enable the GDPR consent message
- [ ] Hub renders no ad unit today; the `AdSlot` is in the new Layout, so it will once deployed

### Not done, deliberately

- Extracting a shared `Layout` into `packages/seo`. Five near-identical copies is real
  duplication, and collapsing them touches all 150 pages while fixing nothing AdSense cares
  about. Debt, not a blocker
- Tightening `maxSimilarity` below 0.5. Same-_target_ pair clusters (`png-to-jpg` vs
  `svg-to-jpg`) sit at ~47%: pages about converting _to_ JPG legitimately share what they say
  about JPG. Median is 7% and every page carries 700+ words of its own; forcing 0.4 would mean
  rewriting 29 pages for a metric, not for a reader
- Rewriting the 145 tool pages. They already pass on depth and uniqueness, the flag was not
  about them, and churning them risks the guardrails that currently hold
