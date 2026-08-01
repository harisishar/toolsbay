# Keyword map — ImgSquash image suite (`image.toolsbay.app`)

Shipped: index, `/compress-image`, `/resize-image`, `/crop-image`, `/image-converter`, and **21**
generated format-pair pages. Source of truth: `tools/image/src/content.ts` (`SOURCES` × `TARGETS`,
slug is `${src}-to-${tgt}`).

Sources: jpg, png, webp, heic, avif, gif, bmp, svg. Targets: jpg, png, webp.

## Best opportunity theme

**Format-pair long tail, led by HEIC.** The `heic to jpg converter online free` SERP is the most
winnable in this whole repo: alongside iLoveIMG and Canva sit `heictojpg.com`, `heic.online` and
`jpg.now` — thin, single-purpose sites ranking on exact-match relevance rather than domain authority.
Picflow ranks at #1 with the pitch _"conversion happens in your browser… fast and private without
requiring software installation."_

That is verbatim what this tool already does, and unlike almost every competitor it is true here —
Canvas-based, nothing uploaded. The differentiator is real and the SERP is already rewarding it. It
just needs to be in the title tags, not only in the FAQ copy.

## Top keywords to target now

1. `heic to jpg` / `heic to jpg converter free` → `/heic-to-jpg`
2. `webp to jpg` → `/webp-to-jpg` (people hit WebP downloads they cannot open)
3. `png to jpg` → `/png-to-jpg`
4. `compress image to 100kb` → `/compress-image` (target-size intent, see Gaps)
5. `avif to jpg` → `/avif-to-jpg` (newest format, thinnest competition)

## Keywords to save

Tag `topic:format-pairs` — all 21 pair queries.
Tag `intent:privacy` — the `no upload` / `offline` / `without uploading` modifier set.
Tag `topic:target-size` — the `compress to <N>kb` family.

## Risks / SERP caveats

- **Head terms are an ad-heavy, incumbent-heavy field.** `image compressor` returns TinyPNG,
  Adobe Express, FreeConvert, imageresizer.com, imagecompressor.com plus app-store listings. Ranking
  page 1 for the bare head term is a multi-year project; the pair pages are this quarter's work.
- **Our differentiator is already a competitor's headline.** imagecompressor.com states _"all
  processing happens in your browser – your files never leave your device"_; Drawboard says the same
  on the PDF side. The claim alone no longer differentiates — being provably correct (no network tab
  activity, works offline after load) does, and that belongs in the copy as a testable claim.
- **21 pair pages generated from one template is thin-content exposure.** The FAQ blocks in
  `content.ts` do vary by source (transparency note, HEIC/iPhone note, GIF animation note), which
  helps. Any further programmatic expansion needs genuinely per-pair content or it risks index bloat.
- **SVG → raster needs an honest caveat.** SVG is resolution-independent; rasterising it to JPG at a
  fixed size loses that. The pages should say so rather than imply a lossless conversion.

## Opportunity table — shipped pages

| Keyword                    | Intent        | Target page      |  Volume |      KD |     CPC | Priority | Notes                                                               |
| -------------------------- | ------------- | ---------------- | ------: | ------: | ------: | -------- | ------------------------------------------------------------------- |
| image compressor           | transactional | /                | unknown | unknown | unknown | P3       | Head term; TinyPNG + Adobe + 6 others. Brand-building only          |
| compress image             | transactional | /compress-image  | unknown | unknown | unknown | P2       | Slightly softer than the `compressor` noun form                     |
| compress jpeg              | transactional | /compress-image  | unknown | unknown | unknown | P2       | Format-qualified variant of the same page                           |
| resize image               | transactional | /resize-image    | unknown | unknown | unknown | P2       | resizepixel/imageresizer own the head; pixel-size long tail is open |
| resize image to 1920x1080  | transactional | /resize-image    | unknown | unknown | unknown | P2       | Exact-dimension queries are numerous and individually easy          |
| crop image                 | transactional | /crop-image      | unknown | unknown | unknown | P2       | Only hand-written route in the tool (`index.tsx:183`)               |
| image converter            | transactional | /image-converter | unknown | unknown | unknown | P3       | Convertio/CloudConvert own the generic converter term               |
| heic to jpg                | transactional | /heic-to-jpg     | unknown | unknown | unknown | P1       | Best target in the tool — thin single-purpose competitors rank      |
| heic to png                | transactional | /heic-to-png     | unknown | unknown | unknown | P2       | Same cluster, less volume, even less competition                    |
| heic to webp               | transactional | /heic-to-webp    | unknown | unknown | unknown | P3       | Rare pairing; keep, do not promote                                  |
| webp to jpg                | transactional | /webp-to-jpg     | unknown | unknown | unknown | P1       | Driven by "downloaded a webp and can't open it" frustration         |
| webp to png                | transactional | /webp-to-png     | unknown | unknown | unknown | P2       | Transparency-preserving variant — say so on-page                    |
| png to jpg                 | transactional | /png-to-jpg      | unknown | unknown | unknown | P1       | Named explicitly in the brief; classic evergreen                    |
| png to webp                | transactional | /png-to-webp     | unknown | unknown | unknown | P2       | Developer/perf intent — different audience, lower ad RPM            |
| jpg to png                 | transactional | /jpg-to-png      | unknown | unknown | unknown | P1       | Named in the brief                                                  |
| jpg to webp                | transactional | /jpg-to-webp     | unknown | unknown | unknown | P2       | Developer/perf intent                                               |
| avif to jpg                | transactional | /avif-to-jpg     | unknown | unknown | unknown | P1       | Newest format = thinnest competitor field; grows as AVIF spreads    |
| avif to png                | transactional | /avif-to-png     | unknown | unknown | unknown | P2       | Same                                                                |
| avif to webp               | transactional | /avif-to-webp    | unknown | unknown | unknown | P3       | Niche                                                               |
| gif to jpg                 | transactional | /gif-to-jpg      | unknown | unknown | unknown | P2       | Page must lead with the first-frame-only caveat                     |
| gif to png                 | transactional | /gif-to-png      | unknown | unknown | unknown | P2       | Same                                                                |
| gif to webp                | transactional | /gif-to-webp     | unknown | unknown | unknown | P3       | Users likely expect animated WebP — we output a still. State it     |
| bmp to jpg                 | transactional | /bmp-to-jpg      | unknown | unknown | unknown | P2       | Legacy/Windows audience, low competition                            |
| bmp to png                 | transactional | /bmp-to-png      | unknown | unknown | unknown | P3       | Same                                                                |
| bmp to webp                | transactional | /bmp-to-webp     | unknown | unknown | unknown | P3       | Rare                                                                |
| svg to png                 | transactional | /svg-to-png      | unknown | unknown | unknown | P1       | Designer/dev intent, steady volume, good long tail                  |
| svg to jpg                 | transactional | /svg-to-jpg      | unknown | unknown | unknown | P2       | Add the resolution-independence caveat                              |
| svg to webp                | transactional | /svg-to-webp     | unknown | unknown | unknown | P3       | Niche                                                               |
| png to webp converter free | transactional | /png-to-webp     | unknown | unknown | unknown | P2       | `free` modifier appears in most ranking titles across this SERP set |

## Gaps

### Missing tools — validated against iLoveIMG's 13-tool inventory

| Proposed slug     | Keyword                      | Priority | Feasibility                             | Evidence                                                                                         |
| ----------------- | ---------------------------- | -------- | --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| rotate-image      | rotate image online          | P1       | Trivial — Canvas transform              | iloveimg.com `/rotate-image`                                                                     |
| watermark-image   | add watermark to image       | P1       | Easy — Canvas draw                      | iloveimg.com `/watermark-image`; commercial intent                                               |
| convert-to-jpg    | convert to jpg               | P1       | Already built — needs a hub page        | iloveimg.com `/convert-to-jpg` is a hub over all sources; ours are 21 separate pages with no hub |
| image-to-pdf      | image to pdf                 | P2       | Exists on the PDF tool as `/jpg-to-pdf` | Cross-link rather than rebuild — decide which subdomain owns the query                           |
| photo-editor      | photo editor online free     | P2       | Medium — large surface area             | iloveimg.com `/photo-editor`                                                                     |
| upscale-image     | image upscaler               | P2       | Hard — needs a WASM/ONNX model          | iloveimg.com `/upscale-image`, bigjpg.com (~1.73M/mo per the brief). Big prize, real build cost  |
| remove-background | remove background from image | P2       | Hard — WASM segmentation model          | iloveimg.com `/remove-background`; remove.bg owns the term but demand is enormous                |
| meme-generator    | meme generator               | P3       | Easy                                    | iloveimg.com `/meme-generator`; low commercial intent                                            |
| blur-face         | blur faces in photo          | P3       | Medium — face detection                 | iloveimg.com `/blur-face`; privacy angle fits the tool's positioning                             |

**Note on upscale/remove-background:** both violate the "no server processing" rule unless done as
client-side WASM. Bundle size is the real constraint, not compute. Worth a spike before planning.

### Missing formats — extend `SOURCES` / `TARGETS` in `content.ts`

Adding a source costs one entry and generates 3 pages; adding a target costs one entry and generates 8. Cheapest page-count growth available anywhere in the repo.

| Change                | New pages                                 | Keyword examples                  | Priority                                                           |
| --------------------- | ----------------------------------------- | --------------------------------- | ------------------------------------------------------------------ |
| Add `tiff` to SOURCES | tiff-to-jpg, tiff-to-png, tiff-to-webp    | `tiff to jpg`                     | P1                                                                 |
| Add `ico` to SOURCES  | ico-to-png, ico-to-jpg, ico-to-webp       | `ico to png`                      | P2                                                                 |
| Add `avif` to TARGETS | 8 pages (`jpg-to-avif`, `png-to-avif`, …) | `jpg to avif`, `png to avif`      | P1                                                                 |
| Add `gif` to TARGETS  | 8 pages                                   | `png to gif`, `jpg to gif`        | P3 — animation expectation mismatch; only if we can do multi-frame |
| Add `ico` to TARGETS  | 8 pages                                   | `png to ico`, `favicon generator` | P1 — `favicon generator` is a strong standalone query              |

### Missing intent — target-size and use-case queries

These are among the highest-intent image queries and none of them have a page. All map to
`/compress-image` or `/resize-image` with a preset; each deserves its own landing page.

| Proposed slug              | Keyword                    | Priority | Notes                                                                                  |
| -------------------------- | -------------------------- | -------- | -------------------------------------------------------------------------------------- |
| compress-image-to-100kb    | compress image to 100kb    | P1       | Form-upload limits drive this; `20kb`, `50kb`, `200kb`, `1mb` are all separate queries |
| resize-image-in-kb         | reduce image size in kb    | P1       | Same family, phrased for the Indian/SEA market                                         |
| passport-photo-resizer     | passport size photo resize | P1       | Government-form intent, extremely high volume in IN/MY/PH, strong ad RPM               |
| resize-image-for-instagram | instagram image size       | P2       | Social-preset family (`youtube thumbnail size`, `facebook cover size`)                 |
| bulk-image-resizer         | bulk image resizer         | P2       | Batch already works — the page just needs to say the word "bulk"                       |
