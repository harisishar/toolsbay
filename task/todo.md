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
