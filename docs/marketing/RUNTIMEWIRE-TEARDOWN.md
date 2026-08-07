# RuntimeWire SEO teardown

**Audited:** 2026-08-01 · `https://runtimewire.com`
**Method:** direct fetches of the live site — sitemaps, per-user-agent render comparison,
JSON-LD extraction, response-header analysis.

**Data caveat, stated up front:** third-party metrics were unavailable. The Semrush connector
returned "not enough API units" and the OpenSEO/DataForSEO account returned
`INSUFFICIENT_CREDITS`. So this document describes **how the site is built**, not how much
traffic it gets. I did not verify that it ranks well — I verified that it is engineered to.

Business type: **independent tech-news publisher** (AI / startup economy). Founded by
Ryan Merket; Austin TX + San Francisco CA.

---

## Scoreboard

| Area | Assessment |
|---|---|
| Crawlability / indexability | Excellent, with one real defect (soft 404s) |
| Content architecture | Excellent |
| Schema / structured data | Excellent — among the most complete I've audited |
| AI-search readiness (GEO) | Best-in-class |
| E-E-A-T signals | Excellent |
| Performance | Weak — uncompressed assets, ~1.2 MB of raw JS+CSS |
| On-page | Excellent |

---

## 1. Universal crawler HTML inside a React SPA

This is the foundation everything else rests on.

RuntimeWire is a client-rendered React SPA (single `/assets/index-*.js` entry, `#root` mount).
But every route also ships a server-rendered block inside `#root`:

```html
<div data-rw-crawler> … full article body, h1/h2, byline, links, footer nav … </div>
```

React hydrates over it on load. A `<noscript>`-style bar sits above it:

> "You're browsing RuntimeWire with JavaScript disabled. Articles and navigation work fully.
> Interactive features — search, comments, and newsletter signup — require JavaScript."

### Verified: it is not cloaking

Same URL, three user agents:

| User agent | Bytes | Visible text chars | `data-rw-crawler` |
|---|---|---|---|
| Googlebot/2.1 | 27,542 | 7,466 | yes |
| GPTBot/1.1 | 27,542 | 7,466 | yes |
| Chrome 120 (macOS) | 27,638 | 7,466 | yes |

Identical text to every agent. The 96-byte delta is incidental, not content. `vary: User-Agent`
is set in the response headers but the content does not actually vary — so it carries none of
the risk that dynamic-rendering setups do.

### Why it matters

1. No dependence on Google's render queue — content is indexable on first fetch.
2. AI crawlers that do not execute JavaScript (GPTBot, PerplexityBot, ClaudeBot) get the
   complete article, not an empty `#root`.
3. It degrades to a working site with JS off, which is a genuine accessibility win, not just
   an SEO trick.

**Structure inside the crawler block** (article template): 1 × `h1`, 8 × `h2`, 2 × `h3`,
1 × `article`, 3 × `nav`, 3 × `section`, 1 × `time`, 54 links (36 internal, 17 external),
1 × `img` with a descriptive `alt`.

---

## 2. Built for machines to ingest, not just crawl

This is where RuntimeWire is unusually far ahead.

### `/llms.txt` — 6.7 KB, hand-written

Not a generated dump. It is organised (About / Read / Jobs / Tools & Data / Sections / Feeds /
Advertise / Embargoes / Contact), each link carries a one-line description of *what the page
is for*, and it pre-empts agent confusion:

> "The job board and RuntimeWire's own careers page are different things — do not conflate
> them. RuntimeWire is NOT the employer for anything listed on the job board."

It even documents the ad-buying flow for agents ("no bidding, CPM, or real-time auctions…
booking returns a Stripe Checkout link").

### `/ai-information` — citation instructions as a page

A human-readable page telling AI systems how to attribute:

> Publisher name: RuntimeWire · Attribution: attribute claims to "RuntimeWire" and link to the
> specific article URL · Bylines: each article names its author; preserve the byline when quoting.

### `/mcp` — a public Model Context Protocol server

JSON-RPC over Streamable HTTP. Tools: `latest_headlines`, `top_stories`, `search_articles`,
`get_article`. No API key. Any Claude Code / Cursor / Codex user can wire the newsroom in as a
live source. (Probing it returns a correct protocol error — the endpoint requires
`Accept: application/json, text/event-stream` — so it is a real implementation, not a stub.)

### Other machine surfaces

`ads.txt` (documents direct-sale-only, no RTB), `/rss` (full-text, 192 KB),
`/podcast.xml`, `/news-sitemap.xml` (87 URLs), `/sitemap.xml` (2,567 URLs).

---

## 3. Structured data

### Sitewide, on every page — a linked `@graph`

```json
{ "@context": "https://schema.org", "@graph": [
  { "@type": "Organization", "@id": "https://runtimewire.com/#organization",
    "name": "RuntimeWire", "alternateName": "RW",
    "logo": { "@type": "ImageObject", "url": "…/runtimewire-wordmark.png", "width": 1468, "height": 212 },
    "sameAs": ["https://x.com/runtimewire", "https://www.youtube.com/@runtimewire",
               "https://podcasts.apple.com/us/podcast/id1896845816",
               "https://open.spotify.com/show/033ponGGZ51S8UMgMzhcgH"] },
  { "@type": "WebSite", "@id": "https://runtimewire.com/#website",
    "publisher": { "@id": "https://runtimewire.com/#organization" }, "inLanguage": "en-US" }
]}
```

The `@id` values are the important part. Page-level schema **references** them rather than
redeclaring the organization, so Google resolves one entity across 2,567 pages.

### Per template

| Template | Types emitted |
|---|---|
| Article | `NewsArticle` + `BreadcrumbList` |
| `/jobs` | `ItemList` + `BreadcrumbList` |
| `/models` | `WebApplication` + `Offer` |
| Author page | `Person` + `BreadcrumbList` |
| Category / `/stories` / `/fundings` | `BreadcrumbList` + `ListItem` |

`NewsArticle` is unusually complete — it includes `articleBody` (a truncated body copy inside
the JSON-LD itself), `keywords`, `articleSection`, `image` as a full `ImageObject` with
dimensions and `encodingFormat`, `datePublished` and `dateModified` to the millisecond, and
`publisher`/`isPartOf` as `@id` references.

The author object is a full `Person` with `jobTitle: "Editor in Chief"` and `sameAs` across
7 profiles: X, LinkedIn, Facebook, personal site, Threads, Instagram, Crunchbase.

### Matching OpenGraph / meta

```
robots: index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1
article:published_time / article:modified_time / article:section / article:author
article:tag × 5   (granola, ai notetakers, privacy, class action, enterprise ai)
twitter:card summary_large_image + site/creator/domain/image:alt
```

`max-snippet:-1` is deliberate — it removes Google's snippet length cap, which matters for
AI Overview extraction.

---

## 4. E-E-A-T as architecture, not as a paragraph

Most sites treat E-E-A-T as an "About" page. RuntimeWire treats it as URL inventory. Each of
these is a real page, in the sitemap **and** in llms.txt:

`/about` · `/editorial-policy` · `/corrections-policy` · `/ethics` · `/ai-use-policy` ·
`/ai-information` · `/faq` · `/in-public` · `/author/ryan-merket` · `/author/runtimewire-staff`

`/in-public` is the standout — open readership, growth and citation numbers:

> "Most media companies keep their numbers behind glass. We don't."

They also disclose AI use rather than hiding it: *"We use AI tools to work faster; every
article links back to its primary sources so claims can be verified."* Under the Dec 2025
E-E-A-T update this reads as a trust signal instead of a liability.

### The article template does two things worth stealing

**A "Why it matters" block** immediately after the headline — 1–2 sentences of analysis, set
off under its own heading. This is a pre-chunked passage engineered for featured snippets and
LLM extraction. From the audited article:

> **Why it matters** — Granola built its UX around invisible local capture. The suit asks
> whether shifting consent to the user is enough when everyone else's speech can feed
> transcripts and model improvement.

**A "Sources" `<h2>`** with the primary documents. The audited article carried 17 outbound
links — the actual court filing on CourtListener, Granola's privacy and model-training docs,
their Series A and C announcements, founder X accounts, personal sites. All
`rel="noopener noreferrer"` — **followed**, not nofollowed.

Outbound citation to primary sources is a large part of why these pages read as citable to
an LLM. Most sites do the opposite and hoard link equity.

---

## 5. Scale, freshness, structure

- **2,567 URLs** in `sitemap.xml`: articles, 10 category hubs (`top`, `latest`, `ai`,
  `startups`, `venture`, `products`, `scoops`, `funding`, `exits`, `founder-moves`), author
  pages, tools (`/models`, `/head-to-head`), extension pages, and the full policy set.
- **87 URLs** in `news-sitemap.xml` with `news:publication`, `news:language`, `news:title`.
- `lastmod` precise to the millisecond — real timestamps, not a build constant.
- Clean, keyword-bearing slugs:
  `/article/granola-sued-bot-free-meeting-capture-ai-training`
- **TTFB ~0.48 s** consistently across pages.

### robots.txt is thoughtfully written

```
Allow: /api/public/     # longest-match wins, so this overrides Disallow: /api
Disallow: /admin
Disallow: /api
Disallow: /sign-in
Disallow: /sign-up
```

With a comment explaining exactly why: the SPA fetches `/api/public/` to render, so Googlebot
must be able to load those resources during rendering. Someone thought about crawl mechanics
rather than pasting a template.

---

## 6. What they get wrong

Do not copy these.

### Assets served uncompressed — the big one

| Asset | Size | `content-encoding` |
|---|---|---|
| `/assets/index-BzWMh6Vw.js` | 990,986 B | **none** |
| `/assets/index-BGltQClA.css` | 242,857 B | **none** |
| `/` (HTML) | 21,238 B | **none** |

Requesting with `--compressed` returns the identical byte count, and no `content-encoding`
header is present. That is ~1.2 MB of uncompressed JS+CSS per cold visit. Gzip alone would cut
it roughly 70–80%. It does not hurt indexing — the crawler HTML is inline — but it hurts
mobile LCP and INP, which are ranking inputs.

### `cache-control: private` on immutable assets

```
cache-control: private, max-age=31536000, immutable
```

`private` on a content-hashed, immutable asset defeats every shared cache and CDN edge in the
path. It looks like a default leaking from the app-server config (Google Frontend / GAE)
rather than a decision.

### Soft 404s

```
GET /article/does-not-exist-xyz  →  HTTP 200
<meta name="robots" content="index, follow, …">
<link rel="canonical" href="https://runtimewire.com/">
```

A nonexistent article returns **200**, renders the homepage shell, and stays indexable. At
2,567 URLs and growing, any bad inbound link or stale URL becomes an indexable duplicate. The
canonical-to-`/` partly mitigates it, but the correct response is a 404 status with
`noindex`.

### `www.` is not redirected

`https://www.runtimewire.com/` returns **200**, not a 301. It does emit
`<link rel="canonical" href="https://runtimewire.com/">`, which mitigates the duplicate-host
problem, but a 301 is the correct fix and costs nothing.

---

## 7. The ranked takeaway

If you copy one thing, copy in this order:

1. **Server-render crawler HTML for every route**, identical for all agents. Everything else is
   worthless if the content is not in the first response.
2. **Write `llms.txt` and an `/ai-information` page by hand**, disambiguating anything an agent
   could get wrong about your business.
3. **Use one `@graph` with stable `@id`s** and reference them from page-level schema instead of
   redeclaring the organization on every page.
4. **Turn trust into URLs** — policies, methodology, open numbers, named authors with `sameAs`.
5. **Add a summary block and a Sources section** to every content page. Pre-chunk the passage
   you want cited; link out to the primary sources that make it credible.
6. **Build real URL inventory** on a template that can carry genuinely distinct content.
