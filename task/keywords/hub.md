# Keyword map — Hub (`toolsbay.app`)

One shipped page plus `/privacy-policy`. Source of truth: `tools/hub/src/index.tsx`.

## Best opportunity theme

**The hub should not chase tool queries — it should rank as a privacy-first tool directory.**

Every tool query (`compress pdf`, `heic to jpg`, `bmi calculator`) belongs to a subdomain page that
already exists. The hub competing for those would only cannibalise them. What the hub _can_ own is
the category query, and that SERP turns out to be soft: `gizmoop.com` ("130+ free online tools, no
signup"), `freetoolpark.com` ("100+ free browser-based tools… zero account"), `nosignuptools.com`,
`thefreeaitools.com` ("224+ … no signup, runs in your browser") and `solite.in` all rank as plain
directories. None is an authority site. All of them lead with the same two attributes: **no signup**
and **runs in your browser**.

Both are true of this repo, and unlike most of that field they are true because of how it is built,
not because of a marketing line. The hub's job is to say so and to link every tool page.

## Top keywords to target now

1. `free online tools no signup`
2. `browser based tools privacy`
3. `online tools that don't upload your files`
4. `free tools no registration`

## Keywords to save

Tag `page:hub` — the four above plus `all in one online tools`, `free web utilities`.

## Risks / SERP caveats

- **Directory queries have weak commercial intent.** These visitors bounce to a tool page fast. The
  hub's value is as a link hub and a brand entry point, not as an ad-impression page.
- **A four-link landing page will not rank against a 130-tool directory.** The competitors' page
  counts are their whole pitch. The hub needs to expose the _individual_ tools — all 51 calculators,
  34 PDF tools, 29 format pairs, 17 QR/barcode pages — not just the four subdomains, or the "one
  place for everything" claim is not supported by the page.
- **Cross-subdomain link equity does not flow like same-domain links.** `calc.toolsbay.app` and
  `pdf.toolsbay.app` are separate hosts to a crawler. The hub → tool links matter more here than an
  equivalent internal link would on a single-domain site, and the tool → hub links back matter too.
- **Brand queries are currently zero-volume.** `toolsbay` has no search demand yet. Nothing to do
  about that except build the tool pages; it is a lagging indicator, not a target.

## Opportunity table

| Keyword                              | Intent        | Target page |  Volume |      KD |     CPC | Priority | Notes                                                                    |
| ------------------------------------ | ------------- | ----------- | ------: | ------: | ------: | -------- | ------------------------------------------------------------------------ |
| free online tools no signup          | transactional | /           | unknown | unknown | unknown | P1       | Direct match to what the hub is; competitor field is thin directories    |
| browser based tools privacy          | informational | /           | unknown | unknown | unknown | P1       | `solite.in` and `privacyeight.com` rank on this framing alone            |
| online tools that don't upload files | informational | /           | unknown | unknown | unknown | P1       | Long-tail phrasing of the same intent; near-zero competition             |
| free tools no registration           | transactional | /           | unknown | unknown | unknown | P2       | `nosignuptools.com` is an exact-match domain on this — beatable on depth |
| all in one online tools              | transactional | /           | unknown | unknown | unknown | P2       | Generic; the 100+/224+ directories win on stated page count              |
| free web utilities                   | transactional | /           | unknown | unknown | unknown | P3       | Dated phrasing, low volume                                               |
| toolsbay                             | navigational  | /           | unknown | unknown | unknown | P3       | Brand; no demand yet by definition                                       |

## Gaps

| Change                                | Priority | Notes                                                                                                                                                                                               |
| ------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Expose the full tool index on the hub | P1       | Not a new page — the existing one needs to list every tool page across all four subdomains. This is what makes the directory query winnable and it is the highest-leverage single change on the hub |
| `/tools` full directory page          | P2       | If the landing page gets too long, split the exhaustive list here and keep the landing page curated                                                                                                 |
| `llms.txt` on the hub                 | P2       | Every tool subdomain serves one (`tools/*/src/index.tsx`); the hub does not. It is the natural place for an AI crawler to find the whole catalogue                                                  |
| Per-category landing pages            | P3       | e.g. `/image-tools`, `/pdf-tools` on the apex, linking into the subdomains. Only worth it once the subdomain pages have traction                                                                    |
