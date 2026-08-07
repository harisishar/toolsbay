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
  articleJsonLd,
  ORG_ID,
  breadcrumbJsonLd,
  faqJsonLd,
  privacySections,
  PRIVACY_UPDATED,
  robotsTxt,
  sitemapXml,
} from "@claudetools/seo";
import { Layout, Prose, FaqSection } from "./layout.js";
import { SITE, TOOLS, ACCENT_BG, ACCENT_TEXT } from "./site-meta.js";
import { TRUST_PAGES, type Page } from "./pages.js";
import { GUIDES, GUIDES_INDEX } from "./guides.js";
import { ARTICLES } from "./articles.gen.js";

// Sitemap lastmod for the directory page — bump when the catalogue changes.
const CATALOGUE_UPDATED = "2026-08-01";

// The four tool Workers publish their own sitemaps; the apex robots.txt points
// at all of them so one fetch reaches all 150 URLs.
const TOOL_SITEMAPS = TOOLS.map((t) => `https://${t.host}/sitemap.xml`);

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

const itemListLd = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `All ${TOTAL_PAGES} ToolsBay tools`,
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
      <Layout
        title={title}
        desc={SITE.desc}
        path="/"
        origin={origin}
        jsonLd={[itemListLd()]}
        bare
      >
        <div class="mx-auto max-w-3xl px-5 pt-16 sm:pt-24">
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
              {TOTAL_PAGES} tools that run entirely in your browser — no signup,
              no accounts, and nothing you open is ever uploaded. Pick a dock:
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

          <section class="mt-20" aria-labelledby="guides">
            <h2
              id="guides"
              class="font-display text-3xl tracking-tight sm:text-4xl"
            >
              Guides
            </h2>
            <p class="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
              The parts that do not fit on a tool page — how to check whether a
              site is uploading your files, what really comes out of a Malaysian
              salary, and why some PDFs refuse to shrink.
            </p>
            <ul class="mt-5 divide-y divide-line border-y border-line">
              {GUIDES.map((g) => (
                <li>
                  <a href={`/guides/${g.slug}`} class="group block py-4">
                    <h3 class="font-semibold group-hover:underline">{g.h1}</h3>
                    <p class="mt-1 text-sm leading-relaxed text-ink-soft">
                      {g.desc}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {ARTICLES.length > 0 && (
            <section class="mt-20" aria-labelledby="articles">
              <h2
                id="articles"
                class="font-display text-3xl tracking-tight sm:text-4xl"
              >
                Articles
              </h2>
              <p class="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
                Shorter, more practical write-ups on the problems people arrive
                here with.
              </p>
              <ul class="mt-5 divide-y divide-line border-y border-line">
                {ARTICLES.slice(0, 5).map((a) => (
                  <li>
                    <a href={`/articles/${a.slug}`} class="group block py-4">
                      <h3 class="font-semibold group-hover:underline">
                        {a.title}
                      </h3>
                      <p class="mt-1 text-sm leading-relaxed text-ink-soft">
                        {a.description}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
              {ARTICLES.length > 5 && (
                <p class="mt-4 text-sm">
                  <a href="/articles" class="underline">
                    All {ARTICLES.length} articles
                  </a>
                </p>
              )}
            </section>
          )}

          <section class="mt-20" aria-labelledby="directory">
            <h2
              id="directory"
              class="font-display text-3xl tracking-tight sm:text-4xl"
            >
              All {TOTAL_PAGES} tools
            </h2>
            <p class="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
              Every tool, linked directly. All of them are free, none require an
              account, and apart from a handful of PDF conversions that need a
              rendering engine browsers do not have, none of them upload your
              files anywhere.
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
        </div>
      </Layout>
    ),
  );
});

// --- Trust pages: about, how-we-build, contact, terms, ai-information --------

const pageLd = (origin: string, p: Page) => {
  const type =
    p.slug === "about"
      ? "AboutPage"
      : p.slug === "contact"
        ? "ContactPage"
        : "WebPage";
  return [
    {
      "@context": "https://schema.org",
      "@type": type,
      name: p.h1,
      description: p.desc,
      url: `${origin}/${p.slug}`,
      isPartOf: { "@id": `${origin}/#website` },
      dateModified: p.updated,
    },
    ...(p.faq?.length ? [faqJsonLd(p.faq)] : []),
    breadcrumbJsonLd(origin, [
      ["ToolsBay", "/"],
      [p.h1, `/${p.slug}`],
    ]),
  ];
};

for (const p of TRUST_PAGES) {
  app.get(`/${p.slug}`, (c) => {
    const origin = new URL(c.req.url).origin;
    return c.html(
      "<!doctype html>" +
      (
        <Layout
          title={p.title}
          desc={p.desc}
          path={`/${p.slug}`}
          origin={origin}
          jsonLd={pageLd(origin, p)}
          crumbs={[
            ["ToolsBay", "/"],
            [p.h1, `/${p.slug}`],
          ]}
        >
          <Prose
            title={p.h1}
            lead={p.lead}
            sections={p.sections}
            updated={p.updated}
          />
          {p.faq && <FaqSection faq={p.faq} />}
        </Layout>
      ),
    );
  });
}

// --- Guides ------------------------------------------------------------------

app.get("/guides", (c) => {
  const origin = new URL(c.req.url).origin;
  return c.html(
    "<!doctype html>" +
    (
      <Layout
        title={GUIDES_INDEX.title}
        desc={GUIDES_INDEX.desc}
        path="/guides"
        origin={origin}
        crumbs={[
          ["ToolsBay", "/"],
          ["Guides", "/guides"],
        ]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: GUIDES_INDEX.h1,
            description: GUIDES_INDEX.desc,
            url: origin + "/guides",
            isPartOf: { "@id": `${origin}/#website` },
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: GUIDES.map((g, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: g.h1,
              url: `${origin}/guides/${g.slug}`,
            })),
          },
          breadcrumbJsonLd(origin, [
            ["ToolsBay", "/"],
            ["Guides", "/guides"],
          ]),
        ]}
      >
        <div class="mx-auto max-w-3xl px-5 pt-10">
          <h1 class="font-display text-4xl tracking-tight sm:text-5xl">
            {GUIDES_INDEX.h1}
          </h1>
          <p class="mt-5 text-lg leading-relaxed text-ink-soft">
            {GUIDES_INDEX.lead}
          </p>
          <ul class="mt-10 divide-y divide-line border-y border-line">
            {GUIDES.map((g) => (
              <li>
                <a href={`/guides/${g.slug}`} class="group block py-5">
                  <h2 class="font-display text-xl tracking-tight group-hover:underline">
                    {g.h1}
                  </h2>
                  <p class="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {g.desc}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Layout>
    ),
  );
});

for (const g of GUIDES) {
  app.get(`/guides/${g.slug}`, (c) => {
    const origin = new URL(c.req.url).origin;
    const path = `/guides/${g.slug}`;
    return c.html(
      "<!doctype html>" +
      (
        <Layout
          title={g.title}
          desc={g.desc}
          path={path}
          origin={origin}
          crumbs={[
            ["ToolsBay", "/"],
            ["Guides", "/guides"],
            [g.h1, path],
          ]}
          jsonLd={[
            articleJsonLd({
              origin,
              path,
              headline: g.h1,
              description: g.desc,
              siteName: SITE.name,
              updated: g.updated,
            }),
            faqJsonLd(g.faq),
            breadcrumbJsonLd(origin, [
              ["ToolsBay", "/"],
              ["Guides", "/guides"],
              [g.h1, path],
            ]),
          ]}
        >
          <article>
            <Prose
              title={g.h1}
              lead={g.lead}
              sections={g.sections}
              updated={g.updated}
            />
            <div class="mx-auto mt-10 max-w-3xl px-5">
              <div class="border border-line bg-paper p-5">
                <p class="text-xs font-semibold tracking-wide text-ink-soft uppercase">
                  Next
                </p>
                <a
                  href={g.cta.href}
                  class="mt-1 block font-display text-xl tracking-tight underline"
                >
                  {g.cta.label}
                </a>
                <p class="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {g.cta.note}
                </p>
              </div>
            </div>
            <FaqSection faq={g.faq} />
          </article>
        </Layout>
      ),
    );
  });
}

// --- Articles ----------------------------------------------------------------
//
// Authored as markdown in tools/hub/articles/ and baked into articles.gen.ts by
// scripts/build-articles.mjs at build time — Workers have no filesystem, so
// nothing can be read from disk here. Adding a .md file and deploying is the
// whole publishing workflow.

const ARTICLES_INDEX = {
  title: "Articles — ToolsBay",
  desc: "Practical write-ups on the problems these tools exist for: upload limits, attachment sizes, document specifications and file formats.",
  h1: "Articles",
  lead: "Shorter, more practical pieces than the guides: the specific problems people arrive here with — an upload form rejecting a photo, an attachment that will not send, a portal demanding an exact pixel size — written out properly rather than answered in a sentence.",
};

const dateLabel = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

function ArticleCard({ a }: { a: (typeof ARTICLES)[number] }) {
  return (
    <li>
      <a href={`/articles/${a.slug}`} class="group block py-5">
        <h2 class="font-display text-xl tracking-tight group-hover:underline">
          {a.title}
        </h2>
        <p class="mt-1.5 text-sm leading-relaxed text-ink-soft">
          {a.description}
        </p>
        <p class="mt-2 text-xs tracking-wide text-ink-soft uppercase">
          <time datetime={a.date}>{dateLabel(a.date)}</time> ·{" "}
          {a.readingMinutes} min read
        </p>
      </a>
    </li>
  );
}

app.get("/articles", (c) => {
  const origin = new URL(c.req.url).origin;
  return c.html(
    "<!doctype html>" +
    (
      <Layout
        title={ARTICLES_INDEX.title}
        desc={ARTICLES_INDEX.desc}
        path="/articles"
        origin={origin}
        crumbs={[
          ["ToolsBay", "/"],
          ["Articles", "/articles"],
        ]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: ARTICLES_INDEX.h1,
            description: ARTICLES_INDEX.desc,
            url: origin + "/articles",
            isPartOf: { "@id": `${origin}/#website` },
            publisher: { "@id": ORG_ID },
            blogPost: ARTICLES.map((a) => ({
              "@type": "BlogPosting",
              headline: a.title,
              description: a.description,
              url: `${origin}/articles/${a.slug}`,
              datePublished: a.date,
              dateModified: a.updated,
            })),
          },
          breadcrumbJsonLd(origin, [
            ["ToolsBay", "/"],
            ["Articles", "/articles"],
          ]),
        ]}
      >
        <div class="mx-auto max-w-3xl px-5 pt-10">
          <h1 class="font-display text-4xl tracking-tight sm:text-5xl">
            {ARTICLES_INDEX.h1}
          </h1>
          <p class="mt-5 text-lg leading-relaxed text-ink-soft">
            {ARTICLES_INDEX.lead}
          </p>
          {ARTICLES.length ? (
            <ul class="mt-10 divide-y divide-line border-y border-line">
              {ARTICLES.map((a) => (
                <ArticleCard a={a} />
              ))}
            </ul>
          ) : (
            <p class="mt-10 text-ink-soft">Nothing published yet.</p>
          )}
          <p class="mt-8 text-sm leading-relaxed text-ink-soft">
            Looking for something longer? The{" "}
            <a href="/guides" class="underline">
              guides
            </a>{" "}
            cover the underlying subjects — file privacy, take-home pay, image
            formats, PDF internals and QR codes — in more depth.
          </p>
        </div>
      </Layout>
    ),
  );
});

for (const a of ARTICLES) {
  const path = `/articles/${a.slug}`;
  app.get(path, (c) => {
    const origin = new URL(c.req.url).origin;
    const related = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3);
    return c.html(
      "<!doctype html>" +
      (
        <Layout
          title={`${a.title} — ToolsBay`}
          desc={a.description}
          path={path}
          origin={origin}
          crumbs={[
            ["ToolsBay", "/"],
            ["Articles", "/articles"],
            [a.title, path],
          ]}
          jsonLd={[
            {
              ...articleJsonLd({
                origin,
                path,
                headline: a.title,
                description: a.description,
                siteName: SITE.name,
              }),
              "@type": "BlogPosting",
              datePublished: a.date,
              dateModified: a.updated,
              wordCount: a.words,
              ...(a.tags.length ? { keywords: a.tags.join(", ") } : {}),
            },
            breadcrumbJsonLd(origin, [
              ["ToolsBay", "/"],
              ["Articles", "/articles"],
              [a.title, path],
            ]),
          ]}
        >
          <article class="mx-auto max-w-3xl px-5 pt-10">
            <h1 class="font-display text-4xl tracking-tight sm:text-5xl">
              {a.title}
            </h1>
            <p class="mt-4 text-xs tracking-wide text-ink-soft uppercase">
              <time datetime={a.date}>{dateLabel(a.date)}</time> ·{" "}
              {a.readingMinutes} min read
              {a.updated !== a.date && <> · updated {dateLabel(a.updated)}</>}
            </p>
            <div
              class="prose-md mt-8"
              dangerouslySetInnerHTML={{ __html: a.html }}
            />
            {a.tags.length > 0 && (
              <p class="mt-10 flex flex-wrap gap-2 text-xs text-ink-soft">
                {a.tags.map((t) => (
                  <span class="border border-line px-2 py-1">{t}</span>
                ))}
              </p>
            )}
            {related.length > 0 && (
              <section class="mt-12">
                <h2 class="font-display text-2xl tracking-tight">
                  More articles
                </h2>
                <ul class="mt-3 divide-y divide-line border-y border-line">
                  {related.map((r) => (
                    <ArticleCard a={r} />
                  ))}
                </ul>
              </section>
            )}
          </article>
        </Layout>
      ),
    );
  });
}

// --- Privacy policy ----------------------------------------------------------

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
      <Layout
        title={title}
        desc={desc}
        path="/privacy-policy"
        origin={origin}
        crumbs={[
          ["ToolsBay", "/"],
          ["Privacy Policy", "/privacy-policy"],
        ]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            url: origin + "/privacy-policy",
            isPartOf: { "@id": `${origin}/#website` },
            dateModified: PRIVACY_UPDATED,
          },
          breadcrumbJsonLd(origin, [
            ["ToolsBay", "/"],
            ["Privacy Policy", "/privacy-policy"],
          ]),
        ]}
      >
        <Prose
          title="Privacy Policy"
          lead="Privacy here is not a policy promise — it is how the tools are built: your data is processed in your browser and never reaches our servers."
          sections={sections}
          updated={PRIVACY_UPDATED}
        />
      </Layout>
    ),
  );
});

app.get("/robots.txt", (c) =>
  c.text(robotsTxt(new URL(c.req.url).origin, { sitemaps: TOOL_SITEMAPS })),
);

// The four tool Workers each serve their own llms.txt; this is the only place an
// AI crawler can see the whole catalogue in one fetch.
app.get("/llms.txt", (c) => {
  const origin = new URL(c.req.url).origin;
  const section = (title: string, host: string, entries: Entry[]) =>
    `## ${title} (${host})\n${entries.map(([s, n]) => `- https://${host}/${s}: ${n}`).join("\n")}`;
  return c.text(
    `# ${SITE.name}

${SITE.desc}

Every tool is free and needs no account. All processing is client-side except a
few PDF conversions (Office formats, OCR, PDF/A, repair, URL-to-PDF) that need a
rendering engine browsers lack — those stream through a server and store nothing.

How to cite and describe ToolsBay accurately: ${origin}/ai-information

## About ToolsBay (${origin.replace(/^https?:\/\//, "")})
${TRUST_PAGES.map((p) => `- ${origin}/${p.slug}: ${p.desc}`).join("\n")}
- ${origin}/privacy-policy: How ToolsBay handles data — processing is client-side and files are not uploaded.

## Guides (${origin.replace(/^https?:\/\//, "")})
${GUIDES.map((g) => `- ${origin}/guides/${g.slug}: ${g.desc}`).join("\n")}

## Articles (${origin.replace(/^https?:\/\//, "")})
${ARTICLES.map((a) => `- ${origin}/articles/${a.slug}: ${a.description}`).join("\n")}

${section("Calculators", "calc.toolsbay.app", CALC)}

${section("Image tools", "image.toolsbay.app", [...IMAGE_CORE, ...IMAGE_PAIRS])}

${section("PDF tools", "pdf.toolsbay.app", PDF)}

${section("QR codes and barcodes", "qr.toolsbay.app", [...QR_TYPES, ...BARCODES, ...QR_GUIDES])}
`,
  );
});

app.get("/sitemap.xml", (c) =>
  c.body(
    sitemapXml(new URL(c.req.url).origin, [
      { path: "/", lastmod: CATALOGUE_UPDATED },
      { path: "/guides", lastmod: GUIDES_INDEX.updated },
      ...(ARTICLES.length
        ? [{ path: "/articles", lastmod: ARTICLES[0]!.updated }]
        : []),
      ...ARTICLES.map((a) => ({
        path: `/articles/${a.slug}`,
        lastmod: a.updated,
      })),
      ...GUIDES.map((g) => ({
        path: `/guides/${g.slug}`,
        lastmod: g.updated,
      })),
      ...TRUST_PAGES.map((p) => ({ path: `/${p.slug}`, lastmod: p.updated })),
      { path: "/privacy-policy", lastmod: PRIVACY_UPDATED },
    ]),
    200,
    { "Content-Type": "application/xml" },
  ),
);

export default app;
