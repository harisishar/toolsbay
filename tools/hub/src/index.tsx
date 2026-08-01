import { Hono } from "hono";
import {
  CALC,
  CALC_CATEGORY,
  PDF,
  PDF_CATEGORY,
  IMAGE_CORE,
  IMAGE_PAIRS,
  QR_TYPES,
  BARCODES,
  QR_GUIDES,
  TOTAL_PAGES,
  type Entry,
} from "./catalogue.js";
import {
  ADSENSE_CLIENT,
  privacySections,
  PRIVACY_UPDATED,
  robotsTxt,
  sitemapXml,
} from "@claudetools/seo";

const SITE = {
  name: "ToolsBay",
  tagline: "Free online tools — no signup, nothing uploaded",
  desc: `${TOTAL_PAGES} free online tools that run entirely in your browser — calculators, image compression and conversion, PDF utilities, QR codes and barcodes. No signup, no accounts, and your files never leave your device.`,
};

const TOOLS = [
  {
    name: "CalcHub",
    url: "https://calc.toolsbay.app",
    host: "calc.toolsbay.app",
    tagline: "Free online calculators",
    desc: `${CALC.length} calculators — finance, health, math, dates and everyday, plus take-home salary after tax for 8 countries and Malaysian EPF/KWSP, SOCSO/EIS and PCB.`,
    accent: "calc",
  },
  {
    name: "ImgSquash",
    url: "https://image.toolsbay.app",
    host: "image.toolsbay.app",
    tagline: "Compress, resize & convert images",
    desc: `Compress, resize and crop, plus ${IMAGE_PAIRS.length} format converters across JPG, PNG, WebP, HEIC, AVIF, GIF, BMP and SVG. Photos never leave your device.`,
    accent: "image",
  },
  {
    name: "PaperKit",
    url: "https://pdf.toolsbay.app",
    host: "pdf.toolsbay.app",
    tagline: "Every PDF tool in one kit",
    desc: `${PDF.length} PDF tools — merge, split, compress, sign, redact, organise, OCR and convert to Word, Excel, PowerPoint or Markdown.`,
    accent: "pdf",
  },
  {
    name: "MakeQR",
    url: "https://qr.toolsbay.app",
    host: "qr.toolsbay.app",
    tagline: "QR codes & barcodes",
    desc: `${QR_TYPES.length} QR types — links, WiFi, vCards, SMS and more — plus CODE128, EAN-13, UPC-A and CODE39 barcodes. Static codes that never expire.`,
    accent: "qr",
  },
];

const ACCENT_TEXT: Record<string, string> = {
  calc: "text-calc",
  image: "text-image",
  pdf: "text-pdf",
  qr: "text-qr",
};
const ACCENT_BG: Record<string, string> = {
  calc: "bg-calc",
  image: "bg-image",
  pdf: "bg-pdf",
  qr: "bg-qr",
};

// Preserve the source order of `entries` while splitting them into the
// categories the tool itself uses, so the hub reads the same way the tool does.
function groupBy(
  entries: Entry[],
  category: Record<string, string>,
): [string, Entry[]][] {
  const out = new Map<string, Entry[]>();
  for (const e of entries) {
    const k = category[e[0]] ?? "More";
    if (!out.has(k)) out.set(k, []);
    out.get(k)!.push(e);
  }
  return [...out];
}

function Group({
  title,
  host,
  accent,
  groups,
}: {
  title: string;
  host: string;
  accent: string;
  groups: [string, Entry[]][];
}) {
  return (
    <div class="mt-10">
      <h3 class="flex items-baseline gap-3 font-display text-xl tracking-tight">
        <span aria-hidden="true" class={`h-2.5 w-2.5 ${ACCENT_BG[accent]}`} />
        {title}
        <a
          href={`https://${host}`}
          class={`text-xs font-semibold ${ACCENT_TEXT[accent]} underline`}
        >
          {host}
        </a>
      </h3>
      {groups.map(([label, items]) => (
        <div class="mt-4">
          <p class="text-xs font-semibold tracking-wide text-ink-soft uppercase">
            {label}
          </p>
          <ul class="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
            {items.map(([slug, name]) => (
              <li>
                <a href={`https://${host}/${slug}`} class="hover:underline">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const websiteLd = (origin: string) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  description: SITE.desc,
  url: origin + "/",
  publisher: { "@type": "Organization", name: SITE.name, url: origin },
});

const itemListLd = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: TOOLS.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    description: t.tagline,
    url: t.url,
  })),
});

const app = new Hono();

// www → apex, preserving path
app.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  if (url.hostname.startsWith("www.")) {
    url.hostname = url.hostname.slice(4);
    return c.redirect(url.toString(), 301);
  }
  await next();
});

app.get("/", (c) => {
  const origin = new URL(c.req.url).origin;
  const title = `${SITE.name} — ${SITE.tagline}`;
  return c.html(
    "<!doctype html>" +
    (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{title}</title>
          <meta name="description" content={SITE.desc} />
          <link rel="canonical" href={origin + "/"} />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={SITE.name} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={SITE.desc} />
          <meta property="og:url" content={origin + "/"} />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={SITE.desc} />
          <link rel="stylesheet" href="/styles.css" />
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossorigin="anonymous"
          />
          {[websiteLd(origin), itemListLd()].map((ld) => (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
            />
          ))}
        </head>
        <body class="chart-bg bg-paper font-sans text-ink antialiased">
          <main class="mx-auto max-w-3xl px-5 pt-16 pb-24 sm:pt-24">
            <header class="mb-16 sm:mb-20">
              <p class="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-ink-soft uppercase">
                <span aria-hidden="true" class="flex gap-1">
                  <span class="h-2.5 w-2.5 bg-calc" />
                  <span class="h-2.5 w-2.5 bg-image" />
                  <span class="h-2.5 w-2.5 bg-pdf" />
                  <span class="h-2.5 w-2.5 bg-qr" />
                </span>
                toolsbay.app
              </p>
              <h1 class="font-display text-5xl leading-none tracking-tight sm:text-7xl">
                A bay of free tools.
              </h1>
              <p class="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
                {TOTAL_PAGES} tools that run entirely in your browser — no
                signup, no accounts, and nothing you open is ever uploaded. Pick
                a dock:
              </p>
            </header>

            <nav aria-label="Tools">
              <ol class="divide-y divide-line border-y border-line">
                {TOOLS.map((t, i) => (
                  <li>
                    <a href={t.url} class="tool-row group block py-7 sm:py-8">
                      <div class="flex items-baseline gap-4 sm:gap-6">
                        <span
                          aria-hidden="true"
                          class={`font-display text-sm ${ACCENT_TEXT[t.accent]}`}
                        >
                          0{i + 1}
                        </span>
                        <div class="min-w-0 flex-1">
                          <div class="flex items-baseline justify-between gap-4">
                            <h2 class="font-display text-3xl tracking-tight group-hover:underline sm:text-4xl">
                              {t.name}
                            </h2>
                            <span
                              aria-hidden="true"
                              class={`arrow font-display text-2xl ${ACCENT_TEXT[t.accent]}`}
                            >
                              &rarr;
                            </span>
                          </div>
                          <span
                            aria-hidden="true"
                            class={`bar mt-2 block h-1 w-8 ${ACCENT_BG[t.accent]}`}
                          />
                          <p class="mt-3 font-semibold">{t.tagline}</p>
                          <p class="mt-1 max-w-xl text-sm leading-relaxed text-ink-soft">
                            {t.desc}
                          </p>
                          <p class="mt-2 text-xs font-semibold tracking-wide text-ink-soft">
                            {t.host}
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <section class="mt-20" aria-labelledby="directory">
              <h2
                id="directory"
                class="font-display text-3xl tracking-tight sm:text-4xl"
              >
                All {TOTAL_PAGES} tools
              </h2>
              <p class="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
                Every tool, linked directly. All of them are free, none require
                an account, and apart from a handful of PDF conversions that
                need a rendering engine browsers do not have, none of them
                upload your files anywhere.
              </p>
              <Group
                title="Calculators"
                host="calc.toolsbay.app"
                accent="calc"
                groups={groupBy(CALC, CALC_CATEGORY)}
              />
              <Group
                title="Image tools"
                host="image.toolsbay.app"
                accent="image"
                groups={[
                  ["Edit & compress", IMAGE_CORE],
                  ["Convert", IMAGE_PAIRS],
                ]}
              />
              <Group
                title="PDF tools"
                host="pdf.toolsbay.app"
                accent="pdf"
                groups={groupBy(PDF, PDF_CATEGORY)}
              />
              <Group
                title="QR codes & barcodes"
                host="qr.toolsbay.app"
                accent="qr"
                groups={[
                  ["QR codes", QR_TYPES],
                  ["Barcodes", BARCODES],
                  ["Payment QR guides", QR_GUIDES],
                ]}
              />
            </section>

            <footer class="mt-16 text-sm leading-relaxed text-ink-soft">
              <p>
                Your files and numbers stay on your device — every tool
                processes data locally in your browser. Each tool has its own
                privacy policy on its site.
              </p>
              <p class="mt-2">
                &copy; {new Date().getFullYear()} {SITE.name} &middot;{" "}
                <a href="/privacy-policy" class="underline">
                  Privacy Policy
                </a>
              </p>
            </footer>
          </main>
        </body>
      </html>
    ),
  );
});

app.get("/privacy-policy", (c) => {
  const origin = new URL(c.req.url).origin;
  const title = `Privacy Policy — ${SITE.name}`;
  const desc = `How ${SITE.name} handles your data: every tool processes your files and inputs locally in your browser — nothing is uploaded, stored, or seen by us.`;
  const sections = privacySections({
    siteName: SITE.name,
    what: "files, images, PDFs and numbers",
  });
  return c.html(
    "<!doctype html>" +
    (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{title}</title>
          <meta name="description" content={desc} />
          <link rel="canonical" href={origin + "/privacy-policy"} />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="stylesheet" href="/styles.css" />
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossorigin="anonymous"
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebPage",
                name: title,
                url: origin + "/privacy-policy",
                dateModified: PRIVACY_UPDATED,
              }),
            }}
          />
        </head>
        <body class="chart-bg bg-paper font-sans text-ink antialiased">
          <main class="mx-auto max-w-3xl px-5 pt-16 pb-24">
            <p class="mb-3 text-sm font-semibold tracking-wide text-ink-soft uppercase">
              <a href="/">&larr; toolsbay.app</a>
            </p>
            <h1 class="font-display text-4xl tracking-tight sm:text-5xl">
              Privacy Policy
            </h1>
            <p class="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
              Privacy here is not a policy promise — it is how the tools are
              built: your data is processed in your browser and never reaches
              our servers.
            </p>
            {sections.map((s) => (
              <section class="mt-10">
                <h2 class="font-display text-2xl tracking-tight">{s.h}</h2>
                {s.body.map((p) => (
                  <p class="mt-3 leading-relaxed text-ink-soft">{p}</p>
                ))}
              </section>
            ))}
            <p class="mt-10 text-sm text-ink-soft">
              Last updated: {PRIVACY_UPDATED}
            </p>
          </main>
        </body>
      </html>
    ),
  );
});

app.get("/robots.txt", (c) => c.text(robotsTxt(new URL(c.req.url).origin)));

// The four tool Workers each serve their own llms.txt; this is the only place an
// AI crawler can see the whole catalogue in one fetch.
app.get("/llms.txt", (c) => {
  const section = (title: string, host: string, entries: Entry[]) =>
    `## ${title} (${host})\n${entries.map(([s, n]) => `- https://${host}/${s}: ${n}`).join("\n")}`;
  return c.text(
    `# ${SITE.name}

${SITE.desc}

Every tool is free and needs no account. All processing is client-side except a
few PDF conversions (Office formats, OCR, PDF/A, repair, URL-to-PDF) that need a
rendering engine browsers lack — those stream through a server and store nothing.

${section("Calculators", "calc.toolsbay.app", CALC)}

${section("Image tools", "image.toolsbay.app", [...IMAGE_CORE, ...IMAGE_PAIRS])}

${section("PDF tools", "pdf.toolsbay.app", PDF)}

${section("QR codes and barcodes", "qr.toolsbay.app", [...QR_TYPES, ...BARCODES, ...QR_GUIDES])}
`,
  );
});

app.get("/sitemap.xml", (c) =>
  c.body(sitemapXml(new URL(c.req.url).origin, ["/", "/privacy-policy"]), 200, {
    "Content-Type": "application/xml",
  }),
);

export default app;
