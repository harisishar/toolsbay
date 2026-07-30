# Keyword map — PDF suite (`pdf.toolsbay.app`)

29 shipped tools. Source of truth: `tools/pdf/src/content.ts`.

## Best opportunity theme

**"No upload" as the wedge on the client-side tools.** The `merge pdf free online` SERP is ten deep
in incumbents (Smallpdf, Adobe, iLovePDF, PDF24, Jotform, PDFgear), and every one of them competes on
the same three claims: _free_, _no registration_, _no watermark_. Only one — Drawboard — competes on
_"all processing happens directly in your browser and your files never leave your device"_, and it
ranks on that alone with no comparable domain authority.

That is the opening. Roughly 20 of our 29 tools are genuinely client-side (`client/engine.ts`), which
makes the claim defensible in a way it is not for Smallpdf or iLovePDF. It has to be in the title
tags of the client-side tools specifically, and it has to be _absent_ from the server-path ones.

## Top keywords to target now

1. `merge pdf without uploading` / `merge pdf offline browser` → `/merge-pdf`
2. `split pdf` / `extract pages from pdf` → `/split-pdf`
3. `compress pdf` → `/compress-pdf`
4. `rotate pdf` / `organize pdf pages` → `/rotate-pdf`, `/organize-pdf`
5. `pdf to markdown` → `/pdf-to-markdown` (see below — this is the sleeper)

## Keywords to save

Tag `intent:privacy` — the `without uploading` / `offline` / `files never leave` modifier set,
restricted to client-side tools.
Tag `topic:pdf-ai` — `pdf to markdown`, `pdf for chatgpt`, `pdf to text for llm`.
Tag `topic:page-ops` — the delete/extract/rearrange gap cluster.

## Risks / SERP caveats

- **Do not apply the privacy claim site-wide.** Per `CLAUDE.md`, the hard conversions
  (`pdf-to-word`, `pdf-to-excel`, `pdf-to-powerpoint`, `word-to-pdf`, `excel-to-pdf`,
  `powerpoint-to-pdf`, `ocr-pdf`, `pdf-to-pdfa`, `repair-pdf`, `html-to-pdf`) run **server-side** via
  Container/Browser Rendering. Putting "your files never leave your device" on those pages would be
  a false claim on the exact axis we are asking users to trust us on. Those pages get a different,
  honest line: streamed through, nothing stored.
- **The conversion terms are the hardest and least defensible.** `pdf to word` is where Adobe,
  Smallpdf and iLovePDF spend the most; it is also where our unit cost is highest (Container compute)
  and our differentiator is weakest. Rank-chase the client-side tools first.
- **`edit-pdf` and `pdf-forms` are broad-intent terms** that often mean "I want Acrobat". Expect a
  higher bounce rate and treat conversion-to-ad-impression accordingly.
- **`unlock-pdf` attracts abuse-adjacent intent.** The page should be explicit that it removes owner
  restrictions from PDFs the user can already open, not that it cracks encryption.

## Opportunity table — shipped pages

| Keyword                     | Intent        | Target page        |  Volume |      KD |     CPC | Priority | Notes                                                                        |
| --------------------------- | ------------- | ------------------ | ------: | ------: | ------: | -------- | ---------------------------------------------------------------------------- |
| merge pdf                   | transactional | /merge-pdf         | unknown | unknown | unknown | P2       | Head term owned by Smallpdf/Adobe; go via the modifier long tail             |
| combine pdf files           | transactional | /merge-pdf         | unknown | unknown | unknown | P2       | `combinepdf.com` ranks on exact match — softer variant                       |
| merge pdf without uploading | transactional | /merge-pdf         | unknown | unknown | unknown | P1       | Our actual differentiator; Drawboard proves the angle ranks                  |
| split pdf                   | transactional | /split-pdf         | unknown | unknown | unknown | P2       | —                                                                            |
| extract pages from pdf      | transactional | /split-pdf         | unknown | unknown | unknown | P1       | iLovePDF routes this to `/split_pdf#split,extract` — we can serve it cleaner |
| compress pdf                | transactional | /compress-pdf      | unknown | unknown | unknown | P2       | `reduce pdf size to 100kb` is the high-intent tail                           |
| rotate pdf                  | transactional | /rotate-pdf        | unknown | unknown | unknown | P1       | Low competition, trivially client-side                                       |
| organize pdf pages          | transactional | /organize-pdf      | unknown | unknown | unknown | P1       | Also serves `reorder pdf pages`, `rearrange pdf`                             |
| add page numbers to pdf     | transactional | /add-page-numbers  | unknown | unknown | unknown | P1       | Narrow query, thin competition, fully client-side                            |
| watermark pdf               | transactional | /watermark-pdf     | unknown | unknown | unknown | P2       | Also `add watermark to pdf`, `remove watermark` (different page, not built)  |
| crop pdf                    | transactional | /crop-pdf          | unknown | unknown | unknown | P1       | Low competition                                                              |
| jpg to pdf                  | transactional | /jpg-to-pdf        | unknown | unknown | unknown | P2       | Overlaps the image tool — pick one owner and canonicalise                    |
| pdf to jpg                  | transactional | /pdf-to-jpg        | unknown | unknown | unknown | P2       | `pdf to png` is a separate query with no page (see Gaps)                     |
| edit pdf                    | transactional | /edit-pdf          | unknown | unknown | unknown | P3       | Broad intent, Acrobat-shaped expectations                                    |
| sign pdf                    | transactional | /sign-pdf          | unknown | unknown | unknown | P2       | DocuSign/Adobe dominate; `sign pdf free without account` is the tail         |
| redact pdf                  | transactional | /redact-pdf        | unknown | unknown | unknown | P1       | Legal/compliance intent, high CPC, thin competition                          |
| fill pdf forms              | transactional | /pdf-forms         | unknown | unknown | unknown | P2       | `fill and sign pdf` is the combined phrasing                                 |
| protect pdf with password   | transactional | /protect-pdf       | unknown | unknown | unknown | P1       | Client-side password protection is a genuinely strong privacy pitch          |
| unlock pdf                  | transactional | /unlock-pdf        | unknown | unknown | unknown | P2       | `remove password from pdf` is the natural-language form. Scope it honestly   |
| compare pdf                 | transactional | /compare-pdf       | unknown | unknown | unknown | P1       | Narrow, professional intent, few competitors                                 |
| pdf to markdown             | transactional | /pdf-to-markdown   | unknown | unknown | unknown | P1       | Sleeper: LLM-era query, growing fast, iLovePDF only just shipped theirs      |
| scan to pdf                 | transactional | /scan-to-pdf       | unknown | unknown | unknown | P2       | Mobile-first query — the page must work well on a phone camera               |
| pdf to word                 | transactional | /pdf-to-word       | unknown | unknown | unknown | P3       | Server path. Highest competition, highest unit cost                          |
| pdf to excel                | transactional | /pdf-to-excel      | unknown | unknown | unknown | P3       | Server path                                                                  |
| pdf to powerpoint           | transactional | /pdf-to-powerpoint | unknown | unknown | unknown | P3       | Server path                                                                  |
| word to pdf                 | transactional | /word-to-pdf       | unknown | unknown | unknown | P3       | Server path                                                                  |
| excel to pdf                | transactional | /excel-to-pdf      | unknown | unknown | unknown | P3       | Server path                                                                  |
| powerpoint to pdf           | transactional | /powerpoint-to-pdf | unknown | unknown | unknown | P3       | Server path                                                                  |
| ocr pdf                     | transactional | /ocr-pdf           | unknown | unknown | unknown | P2       | Server path. `make scanned pdf searchable` is the descriptive tail           |
| pdf to pdfa                 | transactional | /pdf-to-pdfa       | unknown | unknown | unknown | P2       | Server path. Archival/government intent, very thin competition               |
| repair pdf                  | transactional | /repair-pdf        | unknown | unknown | unknown | P2       | Server path. `fix corrupted pdf` is the natural phrasing                     |
| html to pdf                 | transactional | /html-to-pdf       | unknown | unknown | unknown | P2       | Server path (Browser Rendering). `url to pdf`, `webpage to pdf` are variants |

## Gaps

### Page-operation cluster — iLovePDF ships these as separate pages, we fold them into `/organize-pdf`

Separate URLs, separate rankings. iLovePDF `/remove-pages` and `/split_pdf#split,extract` exist for
exactly this reason.

| Proposed slug          | Keyword                | Priority | Evidence                                                         |
| ---------------------- | ---------------------- | -------- | ---------------------------------------------------------------- |
| delete-pages-from-pdf  | delete pages from pdf  | P1       | iLovePDF `/remove-pages`; distinct query from "organize"         |
| extract-pages-from-pdf | extract pages from pdf | P1       | iLovePDF routes it separately; we bury it in split               |
| rearrange-pdf-pages    | rearrange pdf pages    | P2       | Same intent family; currently only reachable via `/organize-pdf` |

### Format gaps

| Proposed slug           | Keyword                 | Priority | Notes                                                                                          |
| ----------------------- | ----------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| pdf-to-png              | pdf to png              | P1       | We ship `/pdf-to-jpg` only; PNG is a separate high-volume query and the engine already renders |
| png-to-pdf              | png to pdf              | P1       | We ship `/jpg-to-pdf` only; same engine, one more page                                         |
| pdf-to-text             | pdf to text             | P1       | Distinct from `pdf-to-word`; fully client-side, so it gets the privacy pitch                   |
| extract-images-from-pdf | extract images from pdf | P2       | Named in the brief's `intruction.md` PDF-to-JPG description but not shipped as its own page    |
| pdf-to-csv              | pdf to csv              | P2       | Data-extraction intent adjacent to `pdf-to-excel`, lighter to serve                            |
| pdf-viewer              | pdf viewer online       | P3       | Informational/utility; keeps sessions on-site but weak commercial intent                       |

### AI-era gaps — validated by iLovePDF adding both in the last cycle

| Proposed slug | Keyword          | Priority | Notes                                                                                                  |
| ------------- | ---------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| summarize-pdf | summarize pdf ai | P2       | iLovePDF `/pdf-summarize`. Needs an LLM call — a new server path, so it needs approval per `CLAUDE.md` |
| translate-pdf | translate pdf    | P2       | iLovePDF `/translate-pdf`. Same constraint                                                             |

`/pdf-to-markdown` already ships and is the free, no-approval-needed member of this cluster — it is
the "get my PDF into ChatGPT/Claude" query. Worth optimising for `pdf to markdown for llm`,
`pdf to text for chatgpt` before building either of the above.
