import { Hono } from "hono";
import { Layout } from "./layout.js";
import { Generator, FaqSection, CompareTable } from "./generator.js";
import {
  QR_TYPES,
  PAYMENT_GUIDES,
  SYMBOLOGIES,
  COMPARISONS,
  CONTENT_UPDATED,
} from "./content.js";
import {
  SITE,
  webAppJsonLd,
  faqJsonLd,
  articleJsonLd,
  robotsTxt,
  breadcrumbJsonLd,
  sitemapXml,
} from "./seo.js";
import { privacySections, PRIVACY_UPDATED } from "@claudetools/seo";

function privacyLd(origin: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Privacy Policy — ${SITE.name}`,
    url: origin + "/privacy-policy",
    dateModified: PRIVACY_UPDATED,
  };
}

const app = new Hono();

const originOf = (url: string) => new URL(url).origin;

app.use("*", async (c, next) => {
  await next();
  if (c.res.headers.get("content-type")?.includes("text/html")) {
    c.res.headers.set("Cache-Control", "public, max-age=600");
  }
});

app.get("/", (c) => {
  const origin = originOf(c.req.url);
  const active = QR_TYPES[0]!;
  const title = "Free QR Code Generator — URL, WiFi, vCard, Email & More";
  const desc =
    "Generate QR codes for links, WiFi, contact cards, email, SMS and locations — free, no sign-up, no watermark. Codes are created in your browser and never expire.";
  return c.html(
    <Layout
      title={title}
      desc={desc}
      path="/"
      origin={origin}
      jsonLd={[
        webAppJsonLd(origin, "/", `${SITE.name} — ${SITE.tagline}`, desc),
      ]}
    >
      <div class="module-grid border-b border-line bg-white">
        <div class="mx-auto max-w-5xl px-4 py-10">
          <h1 class="font-display max-w-2xl text-3xl leading-tight sm:text-4xl">
            Free QR Code Generator
          </h1>
          <p class="mt-3 max-w-2xl text-[15px] leading-7 text-ink-soft">
            Create QR codes for links, WiFi networks, contact cards and more.
            Everything runs in your browser — nothing is uploaded — and every
            code is static: free forever, no expiry, no watermark.
          </p>
        </div>
      </div>
      <div class="mx-auto max-w-5xl px-4 py-8">
        <Generator active={active} />
        <section class="prose-tool mt-12 max-w-3xl">
          <h2>How to make a QR code</h2>
          <ol>
            <li>
              Pick a type — URL for links, WiFi for network access, vCard for
              contact details.
            </li>
            <li>Fill in the form. The preview updates as you type.</li>
            <li>
              Adjust size, colours and error correction if you plan to print.
            </li>
            <li>
              Download as PNG for screens, SVG for print, or JPG for documents.
            </li>
          </ol>
          <h2>Why static QR codes?</h2>
          <p>
            Static codes encode your data directly in the image, so they work
            offline, never expire, and need no account or subscription. Dynamic
            QR services can edit the target later, but they charge monthly and
            the code dies if you stop paying. For most uses — menus, posters,
            business cards, WiFi sharing — static is the safer choice.
          </p>
        </section>
      </div>
    </Layout>,
  );
});

for (const t of QR_TYPES) {
  app.get(`/${t.slug}`, (c) => {
    const origin = originOf(c.req.url);
    return c.html(
      <Layout
        title={t.title}
        desc={t.desc}
        path={`/${t.slug}`}
        origin={origin}
        crumbs={[
          ["QR codes", "/"],
          [t.h1, `/${t.slug}`],
        ]}
        jsonLd={[
          webAppJsonLd(origin, `/${t.slug}`, t.h1, t.desc),
          faqJsonLd(t.faq),
          breadcrumbJsonLd(origin, [
            ["QR codes", "/"],
            [t.h1, `/${t.slug}`],
          ]),
        ]}
      >
        <div class="module-grid border-b border-line bg-white">
          <div class="mx-auto max-w-5xl px-4 py-10">
            <h1 class="font-display max-w-2xl text-3xl leading-tight sm:text-4xl">
              {t.h1}
            </h1>
            <p class="mt-3 max-w-2xl text-[15px] leading-7 text-ink-soft">
              {t.intro}
            </p>
          </div>
        </div>
        <div class="mx-auto max-w-5xl px-4 py-8">
          <Generator active={t} />
          <div class="max-w-3xl">
            <article class="prose-tool mt-12">
              {t.sections.map((s) => (
                <section>
                  <h2>{s.h}</h2>
                  {s.body.map((p) => (
                    <p>{p}</p>
                  ))}
                </section>
              ))}
            </article>
            <FaqSection faq={t.faq} />
            <section class="mt-10">
              <h2 class="font-display mb-3 text-lg">Other QR code types</h2>
              <div class="flex flex-wrap gap-2">
                {QR_TYPES.filter((x) => x.slug !== t.slug).map((x) => (
                  <a
                    href={`/${x.slug}`}
                    class="rounded-md border border-line bg-white px-3 py-1.5 text-sm text-ink-soft hover:border-accent hover:text-accent-deep"
                  >
                    {x.label}
                  </a>
                ))}
                <a
                  href="/barcode-generator"
                  class="rounded-md border border-line bg-white px-3 py-1.5 text-sm text-ink-soft hover:border-accent hover:text-accent-deep"
                >
                  Barcodes
                </a>
              </div>
            </section>
          </div>
        </div>
      </Layout>,
    );
  });
}

const BARCODE_HUB = {
  slug: "barcode-generator",
  format: null as string | null,
  name: "Barcode Generator",
  h1: "Barcode Generator",
  title: "Free Barcode Generator — CODE128, EAN-13, UPC, CODE39",
  desc: "Generate CODE128, EAN-13, UPC-A and CODE39 barcodes free in your browser. Download as SVG or PNG for labels, retail packaging and inventory.",
  intro:
    "Create print-ready barcodes in CODE128, EAN-13, UPC-A or CODE39 — free, in your browser, with SVG output that stays sharp at any size.",
  placeholder: "e.g. 5901234123457 or ITEM-0042",
  sections: [
    {
      h: "Retail codes and internal codes are different problems",
      body: [
        "EAN-13 and UPC-A identify products moving between companies, so the numbers are allocated centrally by GS1 and a retailer will check that the prefix belongs to you. Any tool can draw the bars; none can issue a number that will survive onboarding.",
        "CODE128 and CODE39 carry identifiers that only mean something inside your own operation — asset tags, bin locations, work orders, consignment references. Nobody assigns those, so you can start printing immediately. Picking the wrong side of this line is the most expensive barcode mistake: an invented EAN scans perfectly and fails commercially.",
      ],
    },
    {
      h: "Choosing between CODE128 and CODE39",
      body: [
        "CODE128 is the default for anything new. It encodes the full ASCII set, compresses digit pairs, and produces a symbol roughly 40% narrower than CODE39 for the same content — which is what decides it on small labels.",
        "CODE39 is worth using when an external specification demands it, when the scanner fleet is old or unknown, or when existing labels have to stay consistent. It is uppercase-only and wider, but it is self-checking and readable by essentially every scanner ever built.",
      ],
    },
    {
      h: "What makes a barcode fail in the field",
      body: [
        "Almost never the encoding. The usual culprits are a quiet zone cropped by artwork, bar height truncated to fit a layout, insufficient contrast, or bars printed in red — which is invisible to the red-light scanners still common at checkouts and in warehouses.",
        "Print from the SVG rather than a scaled-up PNG, keep the bars solid black on a light background, and test on the actual scanner before committing to a print run. A curved or glossy surface defeats more barcodes than any choice of symbology.",
      ],
    },
  ],
  faq: [
    {
      q: "Which barcode format should I use?",
      a: "CODE128 for general use (it encodes any text compactly), EAN-13 for retail products sold outside North America, UPC-A for North American retail, and CODE39 for legacy industrial or logistics systems.",
    },
    {
      q: "Why is my EAN-13 barcode invalid?",
      a: "EAN-13 requires exactly 12 digits (the 13th is a check digit calculated automatically) or 13 digits with a correct check digit. UPC-A similarly requires 11 or 12 digits.",
    },
    {
      q: "Can I sell products with these barcodes?",
      a: "The image is yours to use, but retail EAN/UPC numbers must be assigned by GS1 — retailers reject made-up numbers. Generate the barcode here from the number GS1 issued to you.",
    },
  ],
};

// One renderer for the all-formats hub and the four per-symbology pages.
// `format: null` shows the format picker; a preset hides it and locks the encoder.
type BarcodePage = typeof BARCODE_HUB;

const barcodePages: BarcodePage[] = [
  BARCODE_HUB,
  ...SYMBOLOGIES.map((s) => ({
    slug: s.slug,
    format: s.format as string | null,
    name: `${s.label} Barcode Generator`,
    h1: s.h1,
    title: s.title,
    desc: s.desc,
    intro: s.intro,
    placeholder: s.placeholder,
    sections: s.sections,
    faq: s.faq,
  })),
];

for (const b of barcodePages) {
  app.get(`/${b.slug}`, (c) => {
    const origin = originOf(c.req.url);
    const { title, desc, faq } = b;
    return c.html(
      <Layout
        title={title}
        desc={desc}
        path={`/${b.slug}`}
        origin={origin}
        crumbs={[
          ["QR codes", "/"],
          ["Barcodes", "/barcode-generator"],
          [b.name, `/${b.slug}`],
        ]}
        jsonLd={[
          webAppJsonLd(origin, `/${b.slug}`, b.name, desc),
          faqJsonLd(faq),
          breadcrumbJsonLd(origin, [
            ["QR codes", "/"],
            ["Barcodes", "/barcode-generator"],
            [b.name, `/${b.slug}`],
          ]),
        ]}
      >
        <div class="module-grid border-b border-line bg-white">
          <div class="mx-auto max-w-5xl px-4 py-10">
            <h1 class="font-display max-w-2xl text-3xl leading-tight sm:text-4xl">
              {b.h1}
            </h1>
            <p class="mt-3 max-w-2xl text-[15px] leading-7 text-ink-soft">
              {b.intro}
            </p>
          </div>
        </div>
        <div class="mx-auto max-w-5xl px-4 py-8">
          <div
            x-data={b.format ? `barcodeApp('${b.format}')` : "barcodeApp()"}
            x-effect="render()"
            class="grid items-start gap-8 lg:grid-cols-[1fr_380px]"
          >
            <div class="rounded-lg border border-line bg-white p-5">
              <div class="grid gap-4 sm:grid-cols-2">
                <label class="sm:col-span-2">
                  <span class="field-label">Barcode content</span>
                  <input
                    type="text"
                    class="field"
                    x-model="value"
                    placeholder={b.placeholder}
                  />
                </label>
                {b.format ? null : (
                  <label>
                    <span class="field-label">Format</span>
                    <select class="field" x-model="format">
                      <option value="CODE128">CODE128</option>
                      <option value="EAN13">EAN-13</option>
                      <option value="UPC">UPC-A</option>
                      <option value="CODE39">CODE39</option>
                    </select>
                  </label>
                )}
                <label>
                  <span class="field-label">Bar height</span>
                  <select class="field" x-model="height">
                    <option value="60">60 px</option>
                    <option value="90" selected>
                      90 px
                    </option>
                    <option value="120">120 px</option>
                  </select>
                </label>
                <label>
                  <span class="field-label">Bar colour</span>
                  <input
                    type="color"
                    class="field h-[42px] p-1"
                    x-model="lineColor"
                  />
                </label>
                <label class="flex items-center gap-2 pt-5 text-sm font-semibold text-ink-soft">
                  <input
                    type="checkbox"
                    class="h-4 w-4 accent-accent"
                    x-model="displayValue"
                  />
                  Show number under bars
                </label>
              </div>
              <p
                x-cloak
                x-show="value && !valid"
                class="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                This content is not valid for the selected format — EAN-13 needs
                12–13 digits, UPC-A needs 11–12.
              </p>
            </div>
            <aside class="lg:sticky lg:top-6">
              <div class="rounded-lg border border-line bg-white p-5">
                <div class="flex min-h-[200px] items-center justify-center overflow-x-auto rounded-md border border-dashed border-line bg-paper p-4">
                  <svg x-ref="svg" x-show="value && valid" />
                  <p
                    x-show="!value || !valid"
                    class="px-6 text-center text-sm text-ink-soft"
                  >
                    Enter content to preview your barcode.
                  </p>
                </div>
                <div class="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    class="btn-primary"
                    x-on:click="download('png')"
                    x-bind:class="(!value || !valid) && 'opacity-40 pointer-events-none'"
                  >
                    PNG
                  </button>
                  <button
                    type="button"
                    class="btn-ghost"
                    x-on:click="download('svg')"
                    x-bind:class="(!value || !valid) && 'opacity-40 pointer-events-none'"
                  >
                    SVG
                  </button>
                </div>
              </div>
            </aside>
          </div>
          <div class="max-w-3xl">
            {b.sections && (
              <article class="prose-tool mt-12 mb-10">
                {b.sections.map((s) => (
                  <section>
                    <h2>{s.h}</h2>
                    {s.body.map((p) => (
                      <p>{p}</p>
                    ))}
                  </section>
                ))}
              </article>
            )}
            <p class="mb-6 text-sm leading-6 text-ink-soft">
              Other barcode formats:{" "}
              {barcodePages
                .filter((o) => o.slug !== b.slug)
                .map((o, i) => (
                  <>
                    {i > 0 ? ", " : ""}
                    <a class="underline" href={`/${o.slug}`}>
                      {o.format ? o.name : "all formats"}
                    </a>
                  </>
                ))}
              . Need a QR code instead?{" "}
              <a class="underline" href="/">
                Generate one free
              </a>
              .
            </p>
            <FaqSection faq={faq} />
          </div>
        </div>
      </Layout>,
    );
  });
}

for (const g of PAYMENT_GUIDES) {
  app.get(`/${g.slug}`, (c) => {
    const origin = originOf(c.req.url);
    return c.html(
      <Layout
        title={g.title}
        desc={g.desc}
        path={`/${g.slug}`}
        origin={origin}
        crumbs={[
          ["QR codes", "/"],
          [g.h1, `/${g.slug}`],
        ]}
        jsonLd={[
          articleJsonLd(origin, `/${g.slug}`, g.h1, g.desc),
          faqJsonLd(g.faq),
          breadcrumbJsonLd(origin, [
            ["QR codes", "/"],
            [g.h1, `/${g.slug}`],
          ]),
        ]}
      >
        <div class="module-grid border-b border-line bg-white">
          <div class="mx-auto max-w-3xl px-4 py-10">
            <h1 class="font-display text-3xl leading-tight sm:text-4xl">
              {g.h1}
            </h1>
          </div>
        </div>
        <div class="mx-auto max-w-3xl px-4 py-8">
          <article class="prose-tool">
            {g.sections.map((s) => (
              <section>
                <h2>{s.h}</h2>
                {s.body.map((p) => (
                  <p>{p}</p>
                ))}
              </section>
            ))}
            <p>
              Need a general-purpose code instead? Use the free{" "}
              <a href="/">QR code generator</a> — it runs entirely in your
              browser.
            </p>
          </article>
          <FaqSection faq={g.faq} />
        </div>
      </Layout>,
    );
  });
}

for (const cmp of COMPARISONS) {
  app.get(`/${cmp.slug}`, (c) => {
    const origin = originOf(c.req.url);
    return c.html(
      <Layout
        title={cmp.title}
        desc={cmp.desc}
        path={`/${cmp.slug}`}
        origin={origin}
        crumbs={[
          ["QR codes", "/"],
          [cmp.competitor, `/${cmp.slug}`],
        ]}
        jsonLd={[
          articleJsonLd(origin, `/${cmp.slug}`, cmp.h1, cmp.desc),
          faqJsonLd(cmp.faq),
          breadcrumbJsonLd(origin, [
            ["QR codes", "/"],
            [cmp.competitor, `/${cmp.slug}`],
          ]),
        ]}
      >
        <div class="module-grid border-b border-line bg-white">
          <div class="mx-auto max-w-3xl px-4 py-10">
            <h1 class="font-display text-3xl leading-tight sm:text-4xl">
              {cmp.h1}
            </h1>
            <p class="mt-3 text-[15px] leading-7 text-ink-soft">{cmp.intro}</p>
          </div>
        </div>
        <div class="mx-auto max-w-3xl px-4 py-8">
          <article class="prose-tool">
            {cmp.sections.map((s) => (
              <section>
                <h2>{s.h}</h2>
                {s.body.map((p) => (
                  <p>{p}</p>
                ))}
              </section>
            ))}
          </article>
          <CompareTable rows={cmp.matrix} competitor={cmp.competitor} />
          <section class="mt-10">
            <h2 class="font-display mb-3 text-xl">Start here</h2>
            <p class="text-[15px] leading-7 text-ink-soft">
              {QR_TYPES.slice(0, 4).map((t, i) => (
                <>
                  {i > 0 ? " · " : ""}
                  <a class="underline" href={`/${t.slug}`}>
                    {t.label}
                  </a>
                </>
              ))}
              {" · "}
              <a class="underline" href="/barcode-generator">
                Barcodes
              </a>
            </p>
          </section>
          <section class="mt-10 text-[13px] leading-6 text-ink-soft">
            <h2 class="font-display mb-2 text-base text-ink">Sources</h2>
            <p>
              Every claim about {cmp.competitor} on this page is taken from its
              own published pages, checked on {cmp.updated}:{" "}
              {cmp.sources.map((s, i) => (
                <>
                  {i > 0 ? ", " : ""}
                  <a
                    class="underline"
                    href={s.url}
                    rel="nofollow noopener"
                    target="_blank"
                  >
                    {s.label}
                  </a>
                </>
              ))}
              . Pricing and limits change — if you spot something out of date,
              treat their page as authoritative over ours.
            </p>
            <p class="mt-2">Last updated: {cmp.updated}</p>
          </section>
          <FaqSection faq={cmp.faq} />
        </div>
      </Layout>,
    );
  });
}

app.get("/privacy-policy", (c) => {
  const origin = originOf(c.req.url);
  const desc = `How ${SITE.name} handles your data: QR codes, barcodes and everything you type into them are processed in your browser and are never uploaded. No accounts, no tracking by us.`;
  const sections = privacySections({
    siteName: SITE.name,
    what: "QR codes, barcodes and everything you type into them",
  });
  return c.html(
    <Layout
      title={`Privacy Policy — ${SITE.name}`}
      desc={desc}
      path="/privacy-policy"
      origin={origin}
      jsonLd={[privacyLd(origin)]}
    >
      <div class="module-grid border-b border-line bg-white">
        <div class="mx-auto max-w-3xl px-4 py-10">
          <h1 class="font-display text-3xl leading-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p class="mt-3 text-[15px] leading-7 text-ink-soft">
            Privacy here is not a policy promise — it is how the product is
            built: your data is processed in your browser and never reaches our
            servers.
          </p>
        </div>
      </div>
      <div class="mx-auto max-w-3xl px-4 py-8">
        <article class="prose-tool">
          {sections.map((s) => (
            <section>
              <h2>{s.h}</h2>
              {s.body.map((p) => (
                <p>{p}</p>
              ))}
            </section>
          ))}
          <p class="text-sm">Last updated: {PRIVACY_UPDATED}</p>
        </article>
      </div>
    </Layout>,
  );
});

app.get("/sitemap.xml", (c) => {
  const origin = originOf(c.req.url);
  const at = (path: string) => ({ path, lastmod: CONTENT_UPDATED });
  const paths = [
    at("/"),
    ...QR_TYPES.map((t) => at(`/${t.slug}`)),
    ...barcodePages.map((b) => at(`/${b.slug}`)),
    ...PAYMENT_GUIDES.map((g) => at(`/${g.slug}`)),
    ...COMPARISONS.map((c) => ({ path: `/${c.slug}`, lastmod: c.updated })),
    { path: "/privacy-policy", lastmod: PRIVACY_UPDATED },
  ];
  return c.body(sitemapXml(origin, paths), 200, {
    "Content-Type": "application/xml",
  });
});

app.get("/robots.txt", (c) => c.text(robotsTxt(originOf(c.req.url))));

app.get("/llms.txt", (c) => {
  const origin = originOf(c.req.url);
  return c.text(`# ${SITE.name} — Free QR Code Generator

Free, browser-based static QR code and barcode generator. No sign-up, no watermark,
codes never expire, and all generation happens client-side (data is never uploaded).

## Tools
${QR_TYPES.map((t) => `- ${origin}/${t.slug}: ${t.desc}`).join("\n")}
${barcodePages.map((b) => `- ${origin}/${b.slug}: ${b.desc}`).join("\n")}

## Guides
${PAYMENT_GUIDES.map((g) => `- ${origin}/${g.slug}: ${g.desc}`).join("\n")}

## Comparisons
${COMPARISONS.map((c) => `- ${origin}/${c.slug}: ${c.desc}`).join("\n")}`);
});

app.notFound((c) =>
  c.html(
    <Layout
      title={`Page not found — ${SITE.name}`}
      desc="This page does not exist."
      path="/404"
      origin={originOf(c.req.url)}
    >
      <div class="mx-auto max-w-5xl px-4 py-24 text-center">
        <h1 class="font-display text-3xl">Page not found</h1>
        <p class="mt-3 text-ink-soft">
          The page you are looking for does not exist.{" "}
          <a href="/" class="text-accent-deep underline">
            Go to the QR generator
          </a>
          .
        </p>
      </div>
    </Layout>,
    404,
  ),
);

export default app;
