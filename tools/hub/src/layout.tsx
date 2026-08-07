import type { Child } from "hono/jsx";
import {
  ADSENSE_CLIENT,
  AD_SLOTS,
  GA_ID,
  GA_INIT,
  siteGraph,
} from "@claudetools/seo";
import { SITE, TOOLS } from "./site-meta.js";

// Manual AdSense unit inside a height-reserved container (no CLS). The push is
// skipped when the slot is display:none to avoid availableWidth=0 errors.
// Same implementation as the four tool layouts.
export function AdSlot({ slot, class: cls }: { slot: string; class?: string }) {
  return (
    <div class={cls}>
      <p class="mb-1 text-[10px] tracking-widest text-ink-soft uppercase">
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
  // The homepage brings its own hero; everything else uses the default header.
  bare?: boolean;
  children: Child;
};

export function Layout({
  title,
  desc,
  path,
  origin,
  jsonLd = [],
  crumbs,
  bare = false,
  children,
}: LayoutProps) {
  const canonical = origin + path;
  // Every page carries the linked @graph, so page-level blocks can reference
  // #organization by @id instead of redeclaring it 150 times.
  const graph = siteGraph({
    origin,
    siteName: SITE.name,
    description: SITE.desc,
  });
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
        {[graph, ...jsonLd].map((ld) => (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          />
        ))}
      </head>
      <body class="chart-bg bg-paper font-sans text-ink antialiased">
        {!bare && (
          <header class="border-b border-line">
            <div class="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
              <a
                href="/"
                class="flex items-center gap-2 font-display text-lg tracking-tight"
              >
                <span aria-hidden="true" class="flex gap-1">
                  <span class="h-2.5 w-2.5 bg-calc" />
                  <span class="h-2.5 w-2.5 bg-image" />
                  <span class="h-2.5 w-2.5 bg-pdf" />
                  <span class="h-2.5 w-2.5 bg-qr" />
                </span>
                {SITE.name}
              </a>
              <nav class="flex items-center gap-5 text-sm font-semibold text-ink-soft">
                <a href="/guides" class="hover:text-ink">
                  Guides
                </a>
                <a href="/articles" class="hover:text-ink">
                  Articles
                </a>
                <a href="/about" class="hover:text-ink">
                  About
                </a>
                <a href="/#directory" class="hover:text-ink">
                  All tools
                </a>
              </nav>
            </div>
          </header>
        )}
        {crumbs && (
          <nav
            aria-label="Breadcrumb"
            class="mx-auto max-w-3xl px-5 pt-4 text-[13px] text-ink-soft"
          >
            <ol class="flex flex-wrap items-center gap-1.5">
              {crumbs.map(([label, href], i) => (
                <li class="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page">{label}</span>
                  ) : (
                    <a href={href} class="hover:text-ink">
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
          class="mx-auto mt-16 min-h-[110px] max-w-3xl px-5"
        />
        <SiteFooter />
      </body>
    </html>
  );
}

// One footer for the apex. The four tool Workers carry a matching trust column
// so all 150 pages point at the same About/Contact/Terms set.
export function SiteFooter() {
  return (
    <footer class="mt-16 border-t border-line">
      <div class="mx-auto grid max-w-3xl gap-8 px-5 py-10 text-sm sm:grid-cols-3">
        <div>
          <h2 class="mb-3 font-display text-sm">Tools</h2>
          <ul class="space-y-1.5 text-ink-soft">
            {TOOLS.map((t) => (
              <li>
                <a href={t.url} class="hover:text-ink">
                  {t.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 class="mb-3 font-display text-sm">ToolsBay</h2>
          <ul class="space-y-1.5 text-ink-soft">
            <li>
              <a href="/about" class="hover:text-ink">
                About
              </a>
            </li>
            <li>
              <a href="/how-we-build" class="hover:text-ink">
                How we build &amp; check
              </a>
            </li>
            <li>
              <a href="/guides" class="hover:text-ink">
                Guides
              </a>
            </li>
            <li>
              <a href="/articles" class="hover:text-ink">
                Articles
              </a>
            </li>
            <li>
              <a href="/contact" class="hover:text-ink">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 class="mb-3 font-display text-sm">Legal</h2>
          <ul class="space-y-1.5 text-ink-soft">
            <li>
              <a href="/privacy-policy" class="hover:text-ink">
                Privacy policy
              </a>
            </li>
            <li>
              <a href="/terms" class="hover:text-ink">
                Terms of use
              </a>
            </li>
            <li>
              <a href="/ai-information" class="hover:text-ink">
                AI &amp; attribution
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="border-t border-line">
        <p class="mx-auto max-w-3xl px-5 py-4 text-xs leading-5 text-ink-soft">
          &copy; {new Date().getFullYear()} {SITE.name}. Free browser-based
          tools for files, images, PDFs and numbers. Your files and numbers stay
          on your device — every tool processes data locally in your browser,
          apart from a few PDF conversions that need a document engine and are
          disclosed on the tool itself.
        </p>
      </div>
    </footer>
  );
}

// Shared article furniture for the trust pages and the guides.
export function Prose({
  title,
  lead,
  sections,
  updated,
}: {
  title: string;
  lead: string;
  sections: { h: string; body: string[] }[];
  updated?: string;
}) {
  return (
    <div class="mx-auto max-w-3xl px-5 pt-10 pb-4">
      <h1 class="font-display text-4xl tracking-tight sm:text-5xl">{title}</h1>
      {/* Same treatment as the section bodies: leads carry inline links too
          (the contact address on /contact), and escaping them printed raw
          markup on the page. Content is authored in-repo, not user input. */}
      <p
        class="mt-5 text-lg leading-relaxed text-ink-soft"
        dangerouslySetInnerHTML={{ __html: lead }}
      />
      {sections.map((s) => (
        <section class="mt-10">
          <h2 class="font-display text-2xl tracking-tight">{s.h}</h2>
          {s.body.map((p) => (
            <p
              class="mt-3 leading-relaxed text-ink-soft"
              dangerouslySetInnerHTML={{ __html: p }}
            />
          ))}
        </section>
      ))}
      {updated && (
        <p class="mt-10 text-sm text-ink-soft">Last updated: {updated}</p>
      )}
    </div>
  );
}

export function FaqSection({ faq }: { faq: { q: string; a: string }[] }) {
  return (
    <section class="mx-auto max-w-3xl px-5 pt-10">
      <h2 class="font-display text-2xl tracking-tight">
        Frequently asked questions
      </h2>
      <dl class="mt-4 divide-y divide-line border-y border-line">
        {faq.map((f) => (
          <div class="py-4">
            <dt class="font-semibold">{f.q}</dt>
            <dd
              class="mt-1.5 leading-relaxed text-ink-soft"
              dangerouslySetInnerHTML={{ __html: f.a }}
            />
          </div>
        ))}
      </dl>
    </section>
  );
}
