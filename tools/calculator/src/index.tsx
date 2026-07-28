import { Hono } from 'hono';
import { Layout } from './layout.tsx';
import { ALL_CALCS, CALC_BY_SLUG, CATEGORIES } from './lib/calcs/index.ts';
import type { Calc, Input } from './lib/calc-types.ts';
import { SITE, webAppJsonLd, faqJsonLd, sitemapXml } from './seo.ts';

const app = new Hono();
const originOf = (url: string) => new URL(url).origin;

app.use('*', async (c, next) => {
  await next();
  if (c.res.headers.get('content-type')?.includes('text/html')) {
    c.res.headers.set('Cache-Control', 'public, max-age=600');
  }
});

function InputField({ i }: { i: Input }) {
  if (i.type === 'select') {
    return (
      <label>
        <span class="field-label">{i.label}</span>
        <select class="field" x-model={`v.${i.key}`}>
          {(i.options ?? []).map(([val, label]) => (
            <option value={val}>{label}</option>
          ))}
        </select>
      </label>
    );
  }
  const type = i.type === 'date' ? 'date' : i.type === 'time' ? 'time' : i.type === 'text' ? 'text' : 'number';
  if (i.key === '_n') return <input type="hidden" x-model="v._n" />;
  return (
    <label>
      <span class="field-label">
        {i.label}
        {i.suffix ? <span class="ml-1 text-navy-soft/70">({i.suffix})</span> : null}
      </span>
      <input
        type={type}
        class="field"
        x-model={`v.${i.key}`}
        min={i.min}
        max={i.max}
        step={i.step ?? (type === 'number' ? 'any' : undefined)}
      />
    </label>
  );
}

function CalcWidget({ calc }: { calc: Calc }) {
  return (
    <div
      x-data={`calcApp('${calc.slug}')`}
      x-effect="recalc()"
      class="grid items-start gap-6 lg:grid-cols-[1fr_360px]"
    >
      <div class="rounded-lg border border-line bg-panel p-5">
        <div class="grid gap-4 sm:grid-cols-2">
          {calc.inputs.map((i) => (
            <div class={i.half ? '' : 'sm:col-span-2'}>
              <InputField i={i} />
            </div>
          ))}
        </div>
        {calc.button && (
          <button type="button" class="btn-primary mt-4" x-on:click="bump()">
            {calc.button}
          </button>
        )}
      </div>
      <aside class="rounded-lg border border-line bg-navy p-5 text-white lg:sticky lg:top-6">
        <h2 class="font-display mb-3 text-sm tracking-wide text-white/70 uppercase">Results</h2>
        <dl class="space-y-2.5">
          <template x-for="row in rows">
            <div class="flex items-baseline justify-between gap-3 border-b border-white/10 pb-2">
              <dt class="text-sm text-white/70" x-text="row.label" />
              <dd
                class="text-right font-semibold break-all"
                x-bind:class="row.strong && 'text-amber text-xl'"
                x-text="row.value"
              />
            </div>
          </template>
        </dl>
        <p x-cloak x-show="note" class="mt-3 text-xs leading-5 text-white/60" x-text="note" />
      </aside>
      <div x-cloak x-show="table" class="overflow-x-auto rounded-lg border border-line bg-panel p-5 lg:col-span-2">
        <h2 class="font-display mb-3 text-lg" x-text="table?.title || 'Schedule'" />
        <table class="w-full min-w-[480px] text-sm">
          <thead>
            <tr>
              <template x-for="h in table?.headers">
                <th class="border-b border-line pb-2 text-left font-semibold text-navy-soft" x-text="h" />
              </template>
            </tr>
          </thead>
          <tbody>
            <template x-for="r in table?.rows">
              <tr>
                <template x-for="cell in r">
                  <td class="border-b border-line/60 py-1.5 pr-4" x-text="cell" />
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  );
}

app.get('/', (c) => {
  const origin = originOf(c.req.url);
  const desc = `${ALL_CALCS.length}+ free online calculators: loans, mortgages, BMI, salary after tax for Malaysia and 8 countries, dates, math and more. Instant results, no sign-up.`;
  return c.html(
    <Layout
      title="CalcHub — Free Online Calculators: Finance, Health, Salary & Math"
      desc={desc}
      path="/"
      origin={origin}
      jsonLd={[webAppJsonLd(origin, '/', `${SITE.name} — ${SITE.tagline}`, desc)]}
    >
      <div class="grid-dots border-b border-line bg-panel">
        <div class="mx-auto max-w-5xl px-4 py-12">
          <h1 class="font-display max-w-2xl text-3xl leading-tight sm:text-4xl">
            Every calculator you need, in one place
          </h1>
          <p class="mt-3 max-w-2xl text-[15px] leading-7 text-navy-soft">
            {ALL_CALCS.length} free calculators for money, health, dates and math — including
            Malaysia KWSP/PCB salary tools and take-home pay for 8 countries. Everything runs
            instantly in your browser.
          </p>
        </div>
      </div>
      <div id="all" class="mx-auto max-w-5xl px-4 py-10">
        {CATEGORIES.map((cat) => (
          <section class="mb-10">
            <h2 class="font-display mb-4 text-xl">{cat}</h2>
            <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {ALL_CALCS.filter((t) => t.category === cat).map((t) => (
                <a
                  href={`/${t.slug}`}
                  class="rounded-lg border border-line bg-panel p-4 transition-colors hover:border-amber"
                >
                  <span class="block font-semibold">{t.name}</span>
                  <span class="mt-1 block text-[13px] leading-5 text-navy-soft">
                    {t.desc.split('.')[0]}.
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

for (const calc of ALL_CALCS) {
  app.get(`/${calc.slug}`, (c) => {
    const origin = originOf(c.req.url);
    const related = ALL_CALCS.filter((t) => t.category === calc.category && t.slug !== calc.slug).slice(0, 6);
    return c.html(
      <Layout
        title={calc.title}
        desc={calc.desc}
        path={`/${calc.slug}`}
        origin={origin}
        jsonLd={[webAppJsonLd(origin, `/${calc.slug}`, calc.name, calc.desc), faqJsonLd(calc.faq)]}
      >
        <div class="grid-dots border-b border-line bg-panel">
          <div class="mx-auto max-w-5xl px-4 py-10">
            <h1 class="font-display max-w-2xl text-3xl leading-tight sm:text-4xl">{calc.name}</h1>
            <p class="mt-3 max-w-2xl text-[15px] leading-7 text-navy-soft">{calc.intro}</p>
          </div>
        </div>
        <div class="mx-auto max-w-5xl px-4 py-8">
          <CalcWidget calc={calc} />
          <div class="max-w-3xl">
            {calc.faq.length > 0 && (
              <section class="mt-12">
                <h2 class="font-display mb-4 text-xl">Frequently asked questions</h2>
                <div class="space-y-2">
                  {calc.faq.map((f) => (
                    <details class="rounded-md border border-line bg-panel px-4 py-3">
                      <summary class="cursor-pointer text-[15px] font-semibold marker:text-amber">
                        {f.q}
                      </summary>
                      <p class="mt-2 text-[15px] leading-7 text-navy-soft">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
            <section class="mt-10">
              <h2 class="font-display mb-3 text-lg">Related calculators</h2>
              <div class="flex flex-wrap gap-2">
                {related.map((t) => (
                  <a
                    href={`/${t.slug}`}
                    class="rounded-md border border-line bg-panel px-3 py-1.5 text-sm text-navy-soft hover:border-amber hover:text-amber-deep"
                  >
                    {t.name}
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </Layout>,
    );
  });
}

app.get('/sitemap.xml', (c) => {
  const origin = originOf(c.req.url);
  return c.body(sitemapXml(origin, ['/', ...ALL_CALCS.map((t) => `/${t.slug}`)]), 200, {
    'Content-Type': 'application/xml',
  });
});

app.get('/robots.txt', (c) => {
  const origin = originOf(c.req.url);
  return c.text(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml`);
});

app.get('/llms.txt', (c) => {
  const origin = originOf(c.req.url);
  return c.text(`# ${SITE.name} — ${SITE.tagline}

${ALL_CALCS.length} free browser-based calculators. All computation is client-side and instant.
Includes Malaysia KWSP/EPF, SOCSO/EIS, PCB and take-home salary tools, plus salary-after-tax
estimators for the US, UK, Singapore, Australia, India, Germany, Canada and Japan.

## Calculators
${ALL_CALCS.map((t) => `- ${origin}/${t.slug}: ${t.desc}`).join('\n')}`);
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
        <p class="mt-3 text-navy-soft">
          <a href="/" class="text-amber-deep underline">
            Browse all calculators
          </a>
        </p>
      </div>
    </Layout>,
    404,
  ),
);

export default app;
