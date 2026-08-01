# Keyword maps — ToolsBay

One file per tool. Each maps shipped pages to their target queries and flags gaps worth building.

| File                           | Tool                  | Subdomain          | Shipped pages                    |
| ------------------------------ | --------------------- | ------------------ | -------------------------------- |
| [calculator.md](calculator.md) | Calculators           | calc.toolsbay.app  | 51 + index                       |
| [image.md](image.md)           | ImgSquash image suite | image.toolsbay.app | 4 core + 29 format pairs + index |
| [pdf.md](pdf.md)               | PDF suite             | pdf.toolsbay.app   | 29 + index                       |
| [qr.md](qr.md)                 | QR + barcode          | qr.toolsbay.app    | 12 QR types + barcode + index    |
| [hub.md](hub.md)               | Hub landing           | toolsbay.app       | 1                                |

## How these were built

No keyword metrics API was reachable at time of writing (2026-07-30): OpenSEO MCP is not connected,
and the Semrush MCP returns _"corporate sub-account, not enough API units"_. So every `Volume`, `KD`
and `CPC` cell reads `unknown` — per the `/keyword-research` guardrail, nothing is invented.

What the maps _are_ grounded in:

- **Competitor page inventories**, fetched live. A competitor's page list is a demand signal they
  already paid to validate: `calculator.net/sitemap.html` (~200 calculators), `ilovepdf.com` (33
  tools), `iloveimg.com` (13 tools), `me-qr.com`.
- **Live SERPs** for the head term of each tool — who ranks, what page type ranks, and which
  modifiers appear in ranking titles.
- **The actual page lists in this repo.** Read them by importing the modules
  (`ALL_CALCS`, `TOOLS`, `PAIRS`, `QR_TYPES`), the way `scripts/check-catalogue.mjs` does — never by
  grepping for `slug:`. Several slugs are template literals and a regex silently misses them; that
  bug put a wrong count in the first revision of every file here.

## Hydrating with real metrics later

The table shape is deliberate. Once Semrush API units exist (or OpenSEO MCP is connected), pull the
`Keyword` column out of all five files and run one bulk `get_keyword_metrics`-equivalent call, then
fill `Volume` / `KD` / `CPC` in place. The keyword→page mapping does not need redoing.

## Next steps after these maps

1. `/keyword-clustering` — turn the tables into content briefs.
2. Apply the **year-modifier** and **privacy-modifier** title findings (see each file's Risks
   section) to shipped `title`/`desc` strings in `tools/*/src/content.ts` and `seo.ts`.
3. Build the highest-priority gaps.
