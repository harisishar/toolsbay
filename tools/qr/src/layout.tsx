import type { Child } from "hono/jsx";
import {
  ADSENSE_CLIENT,
  AD_SLOTS,
  GA_ID,
  GA_INIT,
  siteGraph,
} from "@claudetools/seo";
import { QR_TYPES, PAYMENT_GUIDES } from "./content.js";
import { SITE } from "./seo.js";

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
      <p class="mb-1 text-[10px] tracking-widest text-ink-soft uppercase">
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
  // Overrides the self-canonical. Used by /privacy-policy, which is the same
  // copy on five hostnames and canonicalises to the apex.
  canonicalUrl?: string;
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
  canonicalUrl,
  jsonLd = [],
  crumbs,
  children,
}: LayoutProps) {
  const canonical = canonicalUrl ?? origin + path;
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
        {[
          siteGraph({
            origin,
            siteName: SITE.name,
            description: `${SITE.name} — ${SITE.tagline}`,
          }),
          ...jsonLd,
        ].map((ld) => (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          />
        ))}
      </head>
      <body class="bg-paper font-sans text-ink antialiased">
        <header class="border-b border-line bg-white">
          <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <a href="/" class="font-display text-lg tracking-tight">
              <span
                aria-hidden="true"
                class="mr-2 inline-block h-3 w-3 bg-accent"
              />
              {SITE.name}
            </a>
            <nav class="flex items-center gap-5 text-sm font-semibold text-ink-soft">
              <a href="/wifi-qr-code" class="hover:text-accent-deep">
                WiFi QR
              </a>
              <a href="/vcard-qr-code" class="hover:text-accent-deep">
                vCard QR
              </a>
              <a href="/barcode-generator" class="hover:text-accent-deep">
                Barcodes
              </a>
            </nav>
          </div>
        </header>
        {crumbs && (
          <nav
            aria-label="Breadcrumb"
            class="mx-auto max-w-5xl px-4 pt-3 text-[13px] text-ink-soft"
          >
            <ol class="flex flex-wrap items-center gap-1.5">
              {crumbs.map(([label, href], i) => (
                <li class="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page">{label}</span>
                  ) : (
                    <a href={href} class="hover:text-accent-deep">
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
        <footer class="mt-16 border-t border-line bg-white">
          <div class="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm sm:grid-cols-3">
            <div>
              <h2 class="font-display mb-3 text-sm text-ink">QR code types</h2>
              <ul class="space-y-1.5 text-ink-soft">
                {QR_TYPES.map((t) => (
                  <li>
                    <a href={`/${t.slug}`} class="hover:text-accent-deep">
                      {t.h1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 class="font-display mb-3 text-sm text-ink">
                Payment QR guides
              </h2>
              <ul class="space-y-1.5 text-ink-soft">
                {PAYMENT_GUIDES.map((g) => (
                  <li>
                    <a href={`/${g.slug}`} class="hover:text-accent-deep">
                      {g.h1}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="/barcode-generator" class="hover:text-accent-deep">
                    Barcode Generator
                  </a>
                </li>
              </ul>
            </div>
            <div class="text-ink-soft">
              <h2 class="font-display mb-3 text-sm text-ink">{SITE.name}</h2>
              <p class="leading-6">
                Free static QR codes, generated entirely in your browser. No
                sign-up, no watermark, no expiry — your data never touches a
                server.{" "}
                <a
                  href="/privacy-policy"
                  class="font-semibold text-ink hover:text-accent-deep"
                >
                  Read our privacy policy
                </a>
                .
              </p>
            </div>
          </div>
          <div class="border-t border-line">
            <div class="mx-auto max-w-5xl px-4 py-5 text-xs leading-5 text-ink-soft">
              <p>
                Published by{" "}
                <a
                  href="https://toolsbay.app"
                  class="font-semibold text-ink hover:text-accent-deep"
                >
                  ToolsBay
                </a>{" "}
                — free browser-based tools for files, images, PDFs and numbers.
                Who runs it, where the figures come from and how to report an
                error are on the{" "}
                <a
                  href="https://toolsbay.app/about"
                  class="hover:text-accent-deep underline"
                >
                  about
                </a>{" "}
                and{" "}
                <a
                  href="https://toolsbay.app/how-we-build"
                  class="hover:text-accent-deep underline"
                >
                  how we build
                </a>{" "}
                pages.
              </p>
              <nav
                aria-label="ToolsBay"
                class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5"
              >
                <a
                  href="https://calc.toolsbay.app"
                  class="hover:text-accent-deep"
                >
                  Calculators
                </a>
                <a
                  href="https://image.toolsbay.app"
                  class="hover:text-accent-deep"
                >
                  Image tools
                </a>
                <a
                  href="https://pdf.toolsbay.app"
                  class="hover:text-accent-deep"
                >
                  PDF tools
                </a>
                <a
                  href="https://toolsbay.app/about"
                  class="hover:text-accent-deep"
                >
                  About
                </a>
                <a
                  href="https://toolsbay.app/how-we-build"
                  class="hover:text-accent-deep"
                >
                  How we build
                </a>
                <a
                  href="https://toolsbay.app/guides"
                  class="hover:text-accent-deep"
                >
                  Guides
                </a>
                <a
                  href="https://toolsbay.app/contact"
                  class="hover:text-accent-deep"
                >
                  Contact
                </a>
                <a
                  href="https://toolsbay.app/terms"
                  class="hover:text-accent-deep"
                >
                  Terms
                </a>
                <a href="/privacy-policy" class="hover:text-accent-deep">
                  Privacy
                </a>
              </nav>
            </div>
          </div>
        </footer>
        <script
          type="module"
          src={path.startsWith("/barcode") ? "/js/barcode.js" : "/js/qr.js"}
        />
        <script defer src="/vendor/alpine.min.js" />
      </body>
    </html>
  );
}
