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

- [ ] Scaffold package
- [ ] ~40 core calculators (data-driven pages, assert self-checks per module)
- [ ] Malaysia: KWSP/EPF, SOCSO+EIS, PCB (MTD), take-home salary
- [ ] Country salary-after-tax: US, UK, SG, AU, IN, DE, CA, JP
- [ ] Per-calculator SEO pages + verify + commit

## Phase 6 — SEO/AEO/GEO sweep

- [ ] Run /seo-geo per tool, act on findings
- [ ] Final verify: sitemaps, robots, llms.txt, JSON-LD across all four tools
