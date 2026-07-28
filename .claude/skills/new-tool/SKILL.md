---
name: new-tool
description: Scaffold a new tool package under tools/<name>/ with its own Worker, Tailwind setup, and SEO baseline. Use when starting a new tool from intruction.md.
disable-model-invocation: true
---

Scaffold a new tool. Tool name: $ARGUMENTS (kebab-case; it becomes the folder name and the subdomain).

If no name was given, ask which tool from @intruction.md to build.

## 1. Bootstrap the workspace root (first tool only)

Skip if `pnpm-workspace.yaml` already exists. Otherwise create it (`packages: ['tools/*', 'packages/*']`),
a root `package.json` (private, no deps beyond dev tooling), a root `tsconfig.json` with
`"strict": true`, and install `prettier` + `typescript` at the root.

## 2. Create `tools/$ARGUMENTS/`

- `package.json` — name `@tools/$ARGUMENTS`; scripts `dev` (`wrangler dev`), `deploy`
  (`wrangler deploy`), `typecheck` (`tsc --noEmit`)
- `wrangler.jsonc` — `main` pointing at the entry, `compatibility_date` set to today, and the
  route/custom-domain for `$ARGUMENTS.<domain>`. Ask for the apex domain if it isn't already
  set in a sibling tool's config.
- `src/index.tsx` — Hono app using Hono JSX for server-rendered HTML. HTMX and Alpine loaded
  from the page; no build step for them.
- Tailwind via the CLI, output to `public/`. No PostCSS pipeline unless something needs it.

## 3. SEO baseline — non-negotiable

Before the tool is considered scaffolded, the rendered page must have: unique `<title>` and
meta description, `<link rel="canonical">`, Open Graph + Twitter tags, schema.org JSON-LD
(`SoftwareApplication` or `WebApplication`), and the tool's URLs added to `sitemap.xml` and
`robots.txt`. Run the `/seo-geo` skill against the tool and act on what it reports.

## 4. Rules that apply to every tool

- All actual processing runs client-side (Canvas/WASM). The Worker serves HTML and assets only.
- No database. `localStorage` if state must persist.
- No React, no shadcn/ui.

## 5. Verify

Run `pnpm --filter @tools/$ARGUMENTS typecheck` and `wrangler dev`, confirm the page renders,
then report what was created and what still needs filling in. Do not deploy.
