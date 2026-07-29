import { Hono } from 'hono';
import { api, Converter } from './api.js';
import { Layout } from './layout.js';

export { Converter };
import { Hero, FaqSection, ToolBody } from './components.js';
import { TOOLS, CATEGORIES } from './content.js';
import { SITE, webAppJsonLd, faqJsonLd, sitemapXml, robotsTxt } from './seo.js';
import { privacySections, PRIVACY_UPDATED } from '@claudetools/seo';

function privacyLd(origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Privacy Policy — ${SITE.name}`,
    url: origin + '/privacy-policy',
    dateModified: PRIVACY_UPDATED,
  };
}


const app = new Hono();
const originOf = (url: string) => new URL(url).origin;

app.use('*', async (c, next) => {
  await next();
  if (c.res.headers.get('content-type')?.includes('text/html')) {
    c.res.headers.set('Cache-Control', 'public, max-age=600');
  }
});

app.get('/', (c) => {
  const origin = originOf(c.req.url);
  const desc =
    'Every PDF tool you need, free: merge, split, compress, convert, edit, sign, protect and more. Browser-based and private — most tools never upload your files.';
  return c.html(
    <Layout
      title="PaperKit — Free PDF Tools: Merge, Split, Compress, Convert & More"
      desc={desc}
      path="/"
      origin={origin}
      jsonLd={[webAppJsonLd(origin, '/', `${SITE.name} — ${SITE.tagline}`, desc)]}
    >
      <Hero
        h1="Every PDF tool, free and private"
        intro="Merge, split, compress, convert, edit, sign and protect PDFs. Nearly everything runs in your browser — files never leave your device. The handful of conversions that need a document engine are streamed through our server and never stored."
      />
      <div id="tools" class="mx-auto max-w-5xl px-4 py-10">
        {CATEGORIES.map((cat) => (
          <section class="mb-10">
            <h2 class="font-display mb-4 text-xl">{cat}</h2>
            <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {TOOLS.filter((t) => t.category === cat).map((t) => (
                <a href={`/${t.slug}`} class="tool-card">
                  <span class="block font-semibold">
                    {t.label}
                    {t.server && (
                      <span class="ml-1.5 rounded-full border border-line px-1.5 py-0.5 text-[10px] font-normal text-muted">
                        server
                      </span>
                    )}
                  </span>
                  <span class="mt-1 block text-[13px] leading-5 text-muted">
                    {t.intro.split('.')[0]}.
                  </span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Layout>,
  );
});

for (const tool of TOOLS) {
  app.get(`/${tool.slug}`, (c) => {
    const origin = originOf(c.req.url);
    return c.html(
      <Layout
        title={tool.title}
        desc={tool.desc}
        path={`/${tool.slug}`}
        origin={origin}
        jsonLd={[webAppJsonLd(origin, `/${tool.slug}`, tool.h1, tool.desc), faqJsonLd(tool.faq)]}
      >
        <Hero h1={tool.h1} intro={tool.intro} />
        <div class="mx-auto max-w-3xl px-4 py-8">
          <ToolBody tool={tool} />
          <FaqSection faq={tool.faq} />
          <section class="mt-10">
            <h2 class="font-display mb-3 text-lg">More PDF tools</h2>
            <div class="flex flex-wrap gap-2">
              {TOOLS.filter((t) => t.slug !== tool.slug && t.category === tool.category)
                .slice(0, 6)
                .map((t) => (
                  <a
                    href={`/${t.slug}`}
                    class="rounded-md border border-line bg-panel px-3 py-1.5 text-sm text-muted hover:border-brick hover:text-brick-deep"
                  >
                    {t.label}
                  </a>
                ))}
            </div>
          </section>
        </div>
      </Layout>,
    );
  });
}


app.get('/privacy-policy', (c) => {
  const origin = originOf(c.req.url);
  const desc = `How ${SITE.name} handles your data: PDFs are processed in your browser; marked server-side conversions are streamed through and never stored. No accounts, no tracking.`;
  const sections = privacySections({ siteName: SITE.name, what: 'PDF documents', serverPath: true });
  return c.html(
    <Layout
      title={`Privacy Policy — ${SITE.name}`}
      desc={desc}
      path="/privacy-policy"
      origin={origin}
      jsonLd={[privacyLd(origin)]}
    >
      <Hero
        h1="Privacy Policy"
        intro="Privacy here is not a policy promise — it is how the product is built: nearly every tool processes your PDFs in your browser, and the few server-side conversions stream files through without ever storing them."
      />
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

app.get('/sitemap.xml', (c) => {
  const origin = originOf(c.req.url);
  return c.body(sitemapXml(origin, ['/', ...TOOLS.map((t) => `/${t.slug}`), '/privacy-policy']), 200, {
    'Content-Type': 'application/xml',
  });
});

app.get('/robots.txt', (c) => c.text(robotsTxt(originOf(c.req.url), { disallow: ['/api/'] })));

app.get('/llms.txt', (c) => {
  const origin = originOf(c.req.url);
  return c.text(`# ${SITE.name} — ${SITE.tagline}

Free PDF tools. Most run entirely in the browser (pdf-lib + pdf.js — files are never
uploaded); Office conversions, OCR, PDF/A, repair and URL-to-PDF use a stateless server
engine that streams files through without storing them.

## Tools
${TOOLS.map((t) => `- ${origin}/${t.slug}: ${t.desc}`).join('\n')}`);
});

// Approved server path: HTML→PDF (Browser Rendering) + Office/OCR/PDF-A/Repair (Container).
app.route('/', api);

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
        <p class="mt-3 text-muted">
          <a href="/" class="text-brick-deep underline">
            Browse all PDF tools
          </a>
        </p>
      </div>
    </Layout>,
    404,
  ),
);

export default app;
