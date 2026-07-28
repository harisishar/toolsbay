import { Hono } from 'hono';
import type { Child } from 'hono/jsx';
import { Layout } from './layout.js';
import {
  Dropzone,
  FileList,
  QualityControl,
  FormatControl,
  ResizeControls,
  FaqSection,
  Hero,
} from './components.js';
import { PAIRS, TOOL_FAQ, SOURCES, TARGETS } from './content.js';
import { SITE, webAppJsonLd, faqJsonLd, sitemapXml, type Faq } from './seo.js';

const app = new Hono();
const originOf = (url: string) => new URL(url).origin;

app.use('*', async (c, next) => {
  await next();
  if (c.res.headers.get('content-type')?.includes('text/html')) {
    c.res.headers.set('Cache-Control', 'public, max-age=600');
  }
});

function BatchPage(props: {
  mode: 'compress' | 'resize' | 'convert';
  presetTarget?: string;
  showFormat?: boolean;
  showResize?: boolean;
}) {
  const preset = props.presetTarget ?? 'keep';
  return (
    <div
      x-data={`imgApp('${props.mode}', '${preset}')`}
      class="mx-auto max-w-3xl px-4 py-8"
    >
      <Dropzone />
      <div class="mt-6 grid gap-5 rounded-lg border border-line bg-panel p-5 sm:grid-cols-2">
        {props.showResize && (
          <div class="sm:col-span-2">
            <ResizeControls />
          </div>
        )}
        <QualityControl />
        {props.showFormat !== false && <FormatControl />}
      </div>
      <FileList />
    </div>
  );
}

function toolPage(o: {
  path: string;
  title: string;
  desc: string;
  h1: string;
  intro: string;
  faq: Faq[];
  body: Child;
}) {
  return (origin: string) => (
    <Layout
      title={o.title}
      desc={o.desc}
      path={o.path}
      origin={origin}
      jsonLd={[webAppJsonLd(origin, o.path, o.h1, o.desc), faqJsonLd(o.faq)]}
    >
      <Hero h1={o.h1} intro={o.intro} />
      {o.body}
      <div class="mx-auto max-w-3xl px-4">
        <FaqSection faq={o.faq} />
      </div>
    </Layout>
  );
}

const pages: Record<string, (origin: string) => unknown> = {
  '/compress-image': toolPage({
    path: '/compress-image',
    title: 'Compress Image Online Free — No Upload, No Watermark',
    desc: 'Reduce JPG, PNG, WebP and HEIC file sizes by up to 80% without visible quality loss. Runs in your browser — photos are never uploaded.',
    h1: 'Compress Images',
    intro:
      'Shrink photos for email, websites and forms without visible quality loss. Drop a batch, pick a quality level, and download — compression runs on your device, so nothing is uploaded.',
    faq: TOOL_FAQ.compress!,
    body: <BatchPage mode="compress" />,
  }),
  '/resize-image': toolPage({
    path: '/resize-image',
    title: 'Resize Image Online Free — Exact Pixels or Percentage',
    desc: 'Resize images to exact pixel dimensions or by percentage, alone or in batches. Aspect-ratio lock prevents stretching. No upload — runs in your browser.',
    h1: 'Resize Images',
    intro:
      'Set an exact width or height — the other side follows automatically so nothing stretches — or scale by percentage. Works on whole batches at once, entirely in your browser.',
    faq: TOOL_FAQ.resize!,
    body: <BatchPage mode="resize" showResize />,
  }),
  '/image-converter': toolPage({
    path: '/image-converter',
    title: 'Image Converter Online Free — JPG, PNG, WebP, HEIC & More',
    desc: 'Convert images between JPG, PNG and WebP — including HEIC, AVIF, GIF, BMP and SVG sources. Free, private, batch-capable, no upload.',
    h1: 'Convert Images',
    intro:
      'Convert between JPG, PNG and WebP — and open formats like HEIC, AVIF, GIF, BMP or SVG and save them as any of the three. Batch-friendly and fully private: files never leave your device.',
    faq: TOOL_FAQ.convert!,
    body: <BatchPage mode="convert" showFormat />,
  }),
};

app.get('/', (c) => {
  const origin = originOf(c.req.url);
  const desc =
    'Free image tools that run in your browser: compress, resize, crop and convert JPG, PNG, WebP, HEIC and more. No uploads, no watermarks, no sign-up.';
  return c.html(
    <Layout
      title="PixSquash — Free Image Compressor, Resizer & Converter"
      desc={desc}
      path="/"
      origin={origin}
      jsonLd={[webAppJsonLd(origin, '/', `${SITE.name} — ${SITE.tagline}`, desc), faqJsonLd(TOOL_FAQ.compress!)]}
    >
      <Hero
        h1="Image tools that never upload your images"
        intro="Compress, resize, crop and convert — powered by your own browser, not our servers. That makes every tool here fast, free without limits, and private by construction."
      />
      <div class="mx-auto max-w-5xl px-4 pt-8">
        <div class="grid gap-3 sm:grid-cols-4">
          {[
            ['/compress-image', 'Compress', 'Shrink file sizes up to 80%'],
            ['/resize-image', 'Resize', 'Exact pixels or percentage'],
            ['/crop-image', 'Crop', 'Freeform or fixed ratios'],
            ['/image-converter', 'Convert', 'JPG · PNG · WebP · HEIC'],
          ].map(([href, t, s]) => (
            <a
              href={href}
              class="rounded-lg border border-line bg-panel p-4 transition-colors hover:border-ember"
            >
              <span class="font-display block">{t}</span>
              <span class="mt-1 block text-sm text-mist">{s}</span>
            </a>
          ))}
        </div>
      </div>
      <BatchPage mode="compress" />
      <div class="mx-auto max-w-5xl px-4">
        <h2 class="font-display mb-4 text-xl">All conversions</h2>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PAIRS.map((p) => (
            <a
              href={`/${p.slug}`}
              class="rounded-md border border-line bg-panel px-3 py-2 text-sm text-mist transition-colors hover:border-ember hover:text-ember"
            >
              {SOURCES[p.src]!.label} → {TARGETS[p.tgt]!.label}
            </a>
          ))}
        </div>
        <div class="max-w-3xl">
          <FaqSection faq={TOOL_FAQ.compress!} />
        </div>
      </div>
    </Layout>,
  );
});

for (const [path, render] of Object.entries(pages)) {
  app.get(path, (c) => c.html(render(originOf(c.req.url)) as Parameters<typeof c.html>[0]));
}

app.get('/crop-image', (c) => {
  const origin = originOf(c.req.url);
  const path = '/crop-image';
  const title = 'Crop Image Online Free — Freeform & Fixed Ratios';
  const desc =
    'Crop images online free: drag to select, snap to 1:1, 4:3, 16:9 or 9:16, download instantly. No upload — cropping runs in your browser.';
  return c.html(
    <Layout
      title={title}
      desc={desc}
      path={path}
      origin={origin}
      jsonLd={[webAppJsonLd(origin, path, 'Crop Images', desc), faqJsonLd(TOOL_FAQ.crop!)]}
    >
      <Hero
        h1="Crop Images"
        intro="Drag a selection over the part you want to keep — freeform or locked to a ratio — and download the result. Everything happens in your browser."
      />
      <div x-data="cropApp()" class="mx-auto max-w-3xl px-4 py-8">
        <div x-show="!bmp">
          <Dropzone multiple={false} handler="load" />
        </div>
        <p x-cloak x-show="error" class="mt-3 text-sm text-ember" x-text="error" />
        <div x-cloak x-show="bmp">
          <div class="rounded-lg border border-line bg-panel p-4">
            <canvas
              x-ref="stage"
              class="mx-auto block max-w-full cursor-crosshair touch-none rounded"
              x-on:pointerdown="$event.target.setPointerCapture($event.pointerId); pointer($event, 'down')"
              x-on:pointermove="pointer($event, 'move')"
              x-on:pointerup="pointer($event, 'up')"
            />
            <p class="mt-2 text-center text-xs text-mist">
              <span x-show="!hasSel">Drag on the image to select the crop area</span>
              <span x-show="hasSel" x-text="'Selection: ' + selText()" />
            </p>
          </div>
          <div class="mt-4 grid gap-4 rounded-lg border border-line bg-panel p-5 sm:grid-cols-3">
            <label>
              <span class="field-label">Aspect ratio</span>
              <select class="field" x-model="aspect" x-on:change="aspect = Number(aspect)">
                <option value="0">Freeform</option>
                <option value="1">1:1 square</option>
                <option value="1.3333">4:3</option>
                <option value="1.7778">16:9</option>
                <option value="0.5625">9:16</option>
              </select>
            </label>
            <label>
              <span class="field-label">Format</span>
              <select class="field" x-model="target">
                <option value="keep">Keep format</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
            </label>
            <div class="flex items-end gap-2">
              <button
                type="button"
                class="btn-primary flex-1"
                x-on:click="download()"
                x-bind:class="!hasSel && 'opacity-40 pointer-events-none'"
              >
                Download crop
              </button>
            </div>
            <button
              type="button"
              class="text-left text-sm text-mist hover:text-ember"
              x-on:click="file = null; bmp = null; sel = null"
            >
              ← Choose a different image
            </button>
          </div>
        </div>
      </div>
      <div class="mx-auto max-w-3xl px-4">
        <FaqSection faq={TOOL_FAQ.crop!} />
      </div>
    </Layout>,
  );
});

for (const p of PAIRS) {
  app.get(`/${p.slug}`, (c) => {
    const origin = originOf(c.req.url);
    return c.html(
      <Layout
        title={p.title}
        desc={p.desc}
        path={`/${p.slug}`}
        origin={origin}
        jsonLd={[webAppJsonLd(origin, `/${p.slug}`, p.h1, p.desc), faqJsonLd(p.faq)]}
      >
        <Hero h1={p.h1} intro={p.intro} />
        <BatchPage mode="convert" presetTarget={TARGETS[p.tgt]!.mime} showFormat={false} />
        <div class="mx-auto max-w-3xl px-4">
          <FaqSection faq={p.faq} />
          <section class="mt-10">
            <h2 class="font-display mb-3 text-lg">Related conversions</h2>
            <div class="flex flex-wrap gap-2">
              {PAIRS.filter((x) => x.slug !== p.slug && (x.src === p.src || x.tgt === p.tgt))
                .slice(0, 6)
                .map((x) => (
                  <a
                    href={`/${x.slug}`}
                    class="rounded-md border border-line bg-panel px-3 py-1.5 text-sm text-mist hover:border-ember hover:text-ember"
                  >
                    {SOURCES[x.src]!.label} → {TARGETS[x.tgt]!.label}
                  </a>
                ))}
            </div>
          </section>
        </div>
      </Layout>,
    );
  });
}

app.get('/sitemap.xml', (c) => {
  const origin = originOf(c.req.url);
  const paths = [
    '/',
    '/compress-image',
    '/resize-image',
    '/crop-image',
    '/image-converter',
    ...PAIRS.map((p) => `/${p.slug}`),
  ];
  return c.body(sitemapXml(origin, paths), 200, { 'Content-Type': 'application/xml' });
});

app.get('/robots.txt', (c) => {
  const origin = originOf(c.req.url);
  return c.text(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml`);
});

app.get('/llms.txt', (c) => {
  const origin = originOf(c.req.url);
  return c.text(`# ${SITE.name} — ${SITE.tagline}

Free browser-based image tools. All processing is client-side (Canvas API) — images are
never uploaded. No sign-up, no watermarks, no file limits.

## Tools
- ${origin}/compress-image: Reduce image file size with a quality slider (batch + ZIP).
- ${origin}/resize-image: Resize to exact pixels or percentage, aspect-ratio locked.
- ${origin}/crop-image: Crop freeform or to 1:1, 4:3, 16:9, 9:16.
- ${origin}/image-converter: Convert between JPG, PNG, WebP (also reads HEIC, AVIF, GIF, BMP, SVG).

## Conversion pages
${PAIRS.map((p) => `- ${origin}/${p.slug}: ${p.h1}`).join('\n')}`);
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
        <p class="mt-3 text-mist">
          <a href="/" class="text-ember underline">
            Back to the image tools
          </a>
        </p>
      </div>
    </Layout>,
    404,
  ),
);

export default app;
