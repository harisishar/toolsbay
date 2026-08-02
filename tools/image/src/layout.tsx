import type { Child } from "hono/jsx";
import { ADSENSE_CLIENT, AD_SLOTS, GA_ID, GA_INIT } from "@claudetools/seo";
import { SITE } from "./seo.js";
import { PAIRS, CORE } from "./content.js";

// Manual AdSense unit inside a height-reserved container (no CLS). The push is
// skipped when the slot is display:none (mobile rail) to avoid availableWidth=0 errors.
export function AdSlot({ slot, class: cls }: { slot: string; class?: string }) {
  return (
    <div class={cls}>
      <p class="mb-1 text-[10px] tracking-widest text-mist uppercase">
        Advertisement
      </p>
      <ins
        class="adsbygoogle"
        style="display:block"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
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

const TOOLS = CORE.map((c) => [c.path, c.label] as const);

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
        <meta property="og:image" content={origin + "/og.png"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={origin + "/og.png"} />
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
      <body class="bg-night font-sans text-fog antialiased">
        <header class="border-b border-line">
          <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <a href="/" class="font-display text-lg tracking-tight">
              <span
                aria-hidden="true"
                class="mr-2 inline-block h-3 w-3 rounded-sm bg-ember"
              />
              {SITE.name}
            </a>
            <nav class="flex items-center gap-5 text-sm font-semibold text-mist">
              {TOOLS.map(([href, label]) => (
                <a href={href} class="hidden hover:text-ember sm:inline">
                  {label}
                </a>
              ))}
              <a href="/image-converter" class="hover:text-ember sm:hidden">
                Tools
              </a>
            </nav>
          </div>
        </header>
        {crumbs && (
          <nav
            aria-label="Breadcrumb"
            class="mx-auto max-w-5xl px-4 pt-3 text-[13px] text-mist"
          >
            <ol class="flex flex-wrap items-center gap-1.5">
              {crumbs.map(([label, href], i) => (
                <li class="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page">{label}</span>
                  ) : (
                    <a href={href} class="hover:text-ember">
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
        <footer class="mt-16 border-t border-line">
          <div class="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm sm:grid-cols-3">
            <div>
              <h2 class="font-display mb-3 text-sm text-fog">Tools</h2>
              <ul class="space-y-1.5 text-mist">
                {TOOLS.map(([href, label]) => (
                  <li>
                    <a href={href} class="hover:text-ember">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 class="font-display mb-3 text-sm text-fog">
                Popular conversions
              </h2>
              <ul class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-mist">
                {PAIRS.slice(0, 12).map((p) => (
                  <li>
                    <a href={`/${p.slug}`} class="hover:text-ember">
                      {p.h1.replace(" Converter", "")}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div class="text-mist">
              <h2 class="font-display mb-3 text-sm text-fog">{SITE.name}</h2>
              <p class="leading-6">
                Free image tools that run entirely in your browser. No uploads,
                no accounts, no watermarks — your photos never leave your
                device.{" "}
                <a
                  href="/privacy-policy"
                  class="font-semibold text-fog hover:text-ember"
                >
                  Read our privacy policy
                </a>
                . Part of{" "}
                <a
                  href="https://toolsbay.app"
                  class="font-semibold text-fog hover:text-ember"
                >
                  ToolsBay
                </a>
                — free browser-based tools for files, images, PDFs and numbers.
              </p>
            </div>
          </div>
        </footer>
        <script type="module" src="/js/app.js" />
        <script defer src="/vendor/alpine.min.js" />
      </body>
    </html>
  );
}
