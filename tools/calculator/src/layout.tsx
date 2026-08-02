import type { Child } from "hono/jsx";
import { ADSENSE_CLIENT, AD_SLOTS, GA_ID, GA_INIT } from "@claudetools/seo";
import { SITE } from "./seo.ts";
import { ALL_CALCS, CATEGORIES } from "./lib/calcs/index.ts";

// Manual AdSense unit inside a height-reserved container (no CLS). The push is
// skipped when the slot is display:none (mobile rail) to avoid availableWidth=0 errors.
export function AdSlot({
  slot,
  size,
  class: cls,
}: {
  slot: string;
  size?: [number, number]; // fixed-size unit; omit for responsive
  class?: string;
}) {
  return (
    <div class={cls}>
      <p class="mb-1 text-[10px] tracking-widest text-navy-soft uppercase">
        Advertisement
      </p>
      <ins
        class="adsbygoogle"
        style={
          size
            ? `display:inline-block;width:${size[0]}px;height:${size[1]}px`
            : "display:block"
        }
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={size ? undefined : "auto"}
        data-full-width-responsive={size ? undefined : "true"}
      />
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){var i=document.currentScript.previousElementSibling;if(i&&i.offsetParent){(adsbygoogle=window.adsbygoogle||[]).push({});}})();",
        }}
      />
    </div>
  );
}

type LayoutProps = {
  title: string;
  desc: string;
  path: string;
  origin: string;
  jsonLd?: object[];
  // [label, href] including the current page as the last entry.
  crumbs?: [string, string][];
  children: Child;
};

export function Layout({
  title,
  desc,
  path,
  origin,
  jsonLd = [],
  crumbs,
  children,
}: LayoutProps) {
  const canonical = origin + path;
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={canonical} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE.name} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <link rel="stylesheet" href="/styles.css" />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <script dangerouslySetInnerHTML={{ __html: GA_INIT }} />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossorigin="anonymous"
        />
        {jsonLd.map((ld) => (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          />
        ))}
      </head>
      <body class="bg-paper font-sans text-navy antialiased">
        <header class="border-b border-line bg-panel">
          <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <a href="/" class="font-display text-lg tracking-tight">
              <span
                aria-hidden="true"
                class="mr-2 inline-block h-3 w-3 rounded-full bg-amber"
              />
              {SITE.name}
            </a>
            <nav class="flex items-center gap-5 text-sm font-semibold text-navy-soft">
              <a
                href="/malaysia-salary-calculator"
                class="hidden hover:text-amber-deep sm:inline"
              >
                Malaysia Salary
              </a>
              <a
                href="/loan-calculator"
                class="hidden hover:text-amber-deep sm:inline"
              >
                Loan
              </a>
              <a
                href="/bmi-calculator"
                class="hidden hover:text-amber-deep sm:inline"
              >
                BMI
              </a>
              <a href="/#all" class="hover:text-amber-deep">
                All calculators
              </a>
            </nav>
          </div>
        </header>
        {crumbs && (
          <nav
            aria-label="Breadcrumb"
            class="mx-auto max-w-5xl px-4 pt-3 text-[13px] text-navy-soft"
          >
            <ol class="flex flex-wrap items-center gap-1.5">
              {crumbs.map(([label, href], i) => (
                <li class="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page">{label}</span>
                  ) : (
                    <a href={href} class="hover:text-amber-deep">
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <main>{children}</main>
        <AdSlot
          slot={AD_SLOTS.contentBottom}
          class="mx-auto mt-16 min-h-[110px] max-w-3xl px-4"
        />
        <footer class="mt-16 border-t border-line bg-panel">
          <div class="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm sm:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <div>
                <h2 class="font-display mb-3 text-sm">{cat}</h2>
                <ul class="space-y-1.5 text-navy-soft">
                  {ALL_CALCS.filter((t) => t.category === cat)
                    .slice(0, 9)
                    .map((t) => (
                      <li>
                        <a href={`/${t.slug}`} class="hover:text-amber-deep">
                          {t.name}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
          <div class="border-t border-line">
            <p class="mx-auto max-w-5xl px-4 py-4 text-xs leading-5 text-navy-soft">
              {SITE.name} calculators run entirely in your browser — your
              numbers never leave your device (
              <a
                href="/privacy-policy"
                class="font-semibold text-navy hover:text-amber-deep"
              >
                privacy policy
              </a>
              ). Results are estimates, not financial, tax, medical or legal
              advice.
            </p>
          </div>
        </footer>
        <script type="module" src="/js/app.js" />
        <script defer src="/vendor/alpine.min.js" />
      </body>
    </html>
  );
}
