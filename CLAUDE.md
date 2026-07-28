# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A monorepo of standalone, ad-supported web tools. Each tool is a separate product on its own
subdomain. Full brief, including the tool list and the traffic/revenue rationale behind each:
@intruction.md (filename typo is intentional-by-accident — do not rename, things may reference it)

## Stack

- Hono + Bun + TypeScript on Cloudflare Workers
- HTMX + Alpine.js for interactivity — **no React, no shadcn/ui**. The brief mentions shadcn; it was
  ruled out because it is React-only. Tailwind for styling, hand-rolled components.
- No database. Persist to `localStorage` when persistence is needed.
- Cloudflare Workers **Paid plan ($5/mo)** — free-tier limits are not the binding constraint.

## Hard rules

- **Processing happens in the browser, not the Worker** — with one user-approved exception.
  Image compression/conversion, PDF manipulation, QR generation, calculators — all client-side
  via Canvas/WASM. The Worker serves HTML and static assets.
  **Exception (approved 2026-07-29):** the PDF tool's hard conversions — PDF↔Word/Excel/PPT,
  OCR, PDF/A, Repair, URL→PDF — may run server-side: URL→PDF via the Browser Rendering
  binding, the rest via a Cloudflare Container (LibreOffice + ocrmypdf + qpdf) proxied by the
  pdf Worker. Stream through, store nothing, enforce size caps and content-type checks at the
  Worker boundary. No other tool gets a server path without asking again.
- **A tool is not done until its SEO is done.** Server-rendered `<title>`/meta/canonical,
  schema.org JSON-LD, Open Graph, sitemap + robots entries. Use the `/seo-geo` skill.
- Use the `/frontend-design` skill for UI work. Modern and clean, not decorative.

## Layout

pnpm workspaces. One package per tool under `tools/<tool-name>/`, each with its own
`wrangler.jsonc` and its own deploy — one Worker per subdomain. Shared code goes in
`packages/<name>/` only once a second tool actually needs it.

## Resolved question

The brief asked whether this stack is sufficient or whether Next.js is needed. **Resolved
2026-07-29: no Next.js.** No auth, no DB, no client-side routing; SEO needs server-rendered
HTML, which Hono JSX does natively. The server-path conversions are covered by Cloudflare
primitives (Browser Rendering, Containers), not a framework change.

## Global coding rules

Moved here from the parent `Projects/` directory.

- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation or README files unless asked
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files
- Run tests after making code changes; verify the build before committing
- NEVER hardcode API keys, secrets, or credentials in source files
- Always validate user input at system boundaries
- Always sanitize file paths to prevent directory traversal
