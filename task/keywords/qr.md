# Keyword map — QR & barcode (`qr.toolsbay.app`)

Shipped: index, 12 QR type pages, `/barcode-generator`. Source of truth: `tools/qr/src/content.ts`
and `tools/qr/src/index.tsx`.

Note the four APAC payment pages (`duitnow-qr-code`, `paynow-qr-code`, `upi-qr-code`,
`promptpay-qr-code`) are **guide pages**, not generators — their H1s read _"… QR: How to Get and Use
One"_. That is the correct call (you cannot mint a valid merchant payment QR client-side) and it puts
them in a different, easier SERP than the generator pages.

## Best opportunity theme

**"Never expires, no subscription" — static QR against the dynamic-QR subscription trap.**

The `qr code generator free` SERP tells on itself. Look at what the ranking pages promise:
TEC-IT — _"free and last forever"_; QRCode Monkey — _"will work forever, do not expire and have no
scanning limits"_; The QR Code Generator — _"up to 2 dynamic QR Codes for free"_. Three of the top
results are competing on permanence, and the fourth is quietly capping you at two codes.

The reason is that the category leaders (qr-code-generator.com, me-qr.com, Flowcode) monetise
dynamic QR subscriptions — codes that die when you stop paying, after they have been printed on
signage. `intruction.md` already spotted this: _"many rivals monetize via dynamic-QR subscriptions,
not ads."_

Ours are static, ad-funded, and genuinely permanent. That is a sharper wedge than "free" and it is
the one thing the subscription incumbents structurally cannot say.

## Top keywords to target now

1. `wifi qr code generator` → `/wifi-qr-code` (best generator target — see below)
2. `vcard qr code generator` → `/vcard-qr-code`
3. `qr code that never expires` / `permanent qr code free` → `/` (positioning page)
4. `duitnow qr how to` → `/duitnow-qr-code` (near-zero competition, MY home market)
5. `code 128 barcode generator` → `/barcode-generator` (per-symbology gap, see Gaps)

## Keywords to save

Tag `intent:permanence` — `never expires`, `no subscription`, `static qr code`, `forever`.
Tag `topic:apac-payments` — DuitNow / PayNow / UPI / PromptPay query sets.
Tag `topic:symbology` — the per-barcode-format cluster.

## Risks / SERP caveats

- **`qr code generator` head term is unwinnable and partly non-organic.** Canva, Adobe, Flowcode and
  qr-code-generator.com hold it with brand strength plus paid support. Compete on type-specific and
  attribute-specific queries.
- **WiFi is the best generator opening.** Its SERP contains `qifi.org` (a bare "pure JS WiFi QR Code
  Generator") and `wifiqrcode.com` ranking beside Canva. Single-purpose, no-authority sites rank
  there — meaning relevance still beats authority on this query.
- **The payment QR pages must stay guides.** Do not add a "generate DuitNow QR" widget; merchant
  payment QRs are issued by the payment network, and a generated one will not work. The guide framing
  is both honest and easier to rank.
- **Barcode ≠ QR audience.** `/barcode-generator` serves retail/inventory intent (GS1, labels,
  Avery sheets) with completely different competitors (TEC-IT, Cognex, MobileDemand). It is
  effectively a second product on the same subdomain and needs its own internal-link cluster.
- **We do not ship dynamic QR.** Queries containing `dynamic`, `editable`, `trackable`, `qr code
analytics` should be treated as out of scope, not chased. Optional KV-backed dynamic QR is flagged
  in `intruction.md` — that is a product decision, not an SEO one.

## Opportunity table — shipped pages

| Keyword                              | Intent        | Target page        |  Volume |      KD |     CPC | Priority | Notes                                                                          |
| ------------------------------------ | ------------- | ------------------ | ------: | ------: | ------: | -------- | ------------------------------------------------------------------------------ |
| qr code generator                    | transactional | /                  | unknown | unknown | unknown | P3       | Head term; Canva/Adobe/Flowcode. Brand play only                               |
| free qr code generator no expiration | transactional | /                  | unknown | unknown | unknown | P1       | Our wedge, stated as a query. Three top-10 rivals already fight on this axis   |
| static qr code generator             | transactional | /                  | unknown | unknown | unknown | P1       | Explicitly names what we are and they aren't                                   |
| wifi qr code generator               | transactional | /wifi-qr-code      | unknown | unknown | unknown | P1       | Best generator target — `qifi.org` and `wifiqrcode.com` rank with no authority |
| wifi qr code for guests              | transactional | /wifi-qr-code      | unknown | unknown | unknown | P2       | Café/Airbnb use-case framing; Canva ranks on exactly this angle                |
| vcard qr code generator              | transactional | /vcard-qr-code     | unknown | unknown | unknown | P1       | Named in the brief; business-card intent, good CPC                             |
| qr code for business card            | transactional | /vcard-qr-code     | unknown | unknown | unknown | P2       | Natural-language form of the same intent                                       |
| url qr code generator                | transactional | /url-qr-code       | unknown | unknown | unknown | P2       | The default case — competes closest to the head term                           |
| text qr code generator               | transactional | /text-qr-code      | unknown | unknown | unknown | P2       | TEC-IT ranks #1 for `qr code generator free` on a plain-text page              |
| email qr code generator              | transactional | /email-qr-code     | unknown | unknown | unknown | P2       | Thin competition                                                               |
| sms qr code generator                | transactional | /sms-qr-code       | unknown | unknown | unknown | P2       | Thin competition                                                               |
| phone number qr code                 | transactional | /phone-qr-code     | unknown | unknown | unknown | P2       | Thin competition                                                               |
| location qr code generator           | transactional | /location-qr-code  | unknown | unknown | unknown | P2       | `google maps qr code` is the phrasing most people use — add it on-page         |
| duitnow qr code how to get           | informational | /duitnow-qr-code   | unknown | unknown | unknown | P1       | MY home market, near-zero English competition, guide intent already matched    |
| paynow qr code how to                | informational | /paynow-qr-code    | unknown | unknown | unknown | P1       | SG market, same shape                                                          |
| upi qr code how to get               | informational | /upi-qr-code       | unknown | unknown | unknown | P1       | IN market — largest of the four by population                                  |
| promptpay qr code how to             | informational | /promptpay-qr-code | unknown | unknown | unknown | P2       | TH market; consider a Thai-language version                                    |
| barcode generator                    | transactional | /barcode-generator | unknown | unknown | unknown | P2       | TEC-IT/BarcodesInc/Cognex. Beatable via per-symbology pages                    |
| free online barcode generator        | transactional | /barcode-generator | unknown | unknown | unknown | P2       | `free` + `online` both appear in nearly every ranking title                    |

## Gaps

### Per-symbology barcode pages — the clearest programmatic win in this tool

TEC-IT ranks separate pages per symbology (`barcode.tec-it.com/en/Code128`, `/en/KIX`, …) and those
pages show up individually in the `barcode generator free online` results. We serve four formats
(CODE128, EAN-13, UPC-A, CODE39 — `tools/qr/src/client/barcode.ts`) from **one** page, so we compete
for none of them by name.

| Proposed slug              | Keyword                    | Priority | Notes                                                                   |
| -------------------------- | -------------------------- | -------- | ----------------------------------------------------------------------- |
| code-128-barcode-generator | code 128 barcode generator | P1       | Already supported; page just needs to exist                             |
| ean-13-barcode-generator   | ean 13 barcode generator   | P1       | Already supported; retail intent, add the GS1 caveat already in the FAQ |
| upc-a-barcode-generator    | upc barcode generator      | P1       | Already supported                                                       |
| code-39-barcode-generator  | code 39 barcode generator  | P1       | Already supported                                                       |
| isbn-barcode-generator     | isbn barcode generator     | P2       | Needs EAN-13 with an ISBN prefix — small addition to existing code      |
| data-matrix-generator      | data matrix generator      | P3       | New encoder dependency; TEC-IT and Morovia both list it                 |

Four P1 pages here require **zero new encoding logic** — the formats already work in the shipped
generator. This is the cheapest ranked-page growth available in the repo.

### Missing QR types — validated against me-qr.com's type list

| Proposed slug         | Keyword                     | Priority | Feasibility                                     | Notes                                                                      |
| --------------------- | --------------------------- | -------- | ----------------------------------------------- | -------------------------------------------------------------------------- |
| whatsapp-qr-code      | whatsapp qr code generator  | P1       | Trivial — `https://wa.me/<number>` payload      | Huge in APAC/LATAM; it is just a URL QR with a preset                      |
| app-store-qr-code     | app store qr code           | P2       | Trivial — URL payload                           | me-qr lists it; developer/marketing intent                                 |
| instagram-qr-code     | instagram qr code           | P2       | Trivial — URL payload                           | Social family; me-qr ships per-network pages                               |
| tiktok-qr-code        | tiktok qr code generator    | P2       | Trivial — URL payload                           | me-qr `/page/video/tiktok-qr-code`                                         |
| google-review-qr-code | google review qr code       | P1       | Trivial — URL payload                           | Strong SMB commercial intent; restaurants and retail actively search this  |
| menu-qr-code          | qr code for restaurant menu | P1       | Trivial if it points at a hosted PDF/URL        | me-qr spun a whole product (me-menu.com) out of this query                 |
| crypto-qr-code        | bitcoin qr code generator   | P3       | Easy — URI payload                              | me-qr `/page/video/crypto-qr-code`; niche, watch the scam-adjacent framing |
| qr-code-with-logo     | qr code generator with logo | P2       | Medium — centre-overlay + error correction bump | QRCode Monkey's entire ranking position rests on this feature              |

Most of the P1/P2 rows above are **preset URL payloads over the existing generator** — the same
pattern `tools/qr/src/lib/payloads.ts` already uses. Page cost is content, not engineering.

### Positioning page — no build required, high leverage

| Proposed slug              | Keyword                   | Priority | Notes                                                                                                                                                           |
| -------------------------- | ------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| static-vs-dynamic-qr-codes | static vs dynamic qr code | P1       | Informational page that converts the whole theme above into a rankable asset and funnels to every generator. Also the honest place to explain what we do not do |
