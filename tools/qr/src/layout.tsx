import type { Child } from "hono/jsx";
import { ADSENSE_CLIENT, AD_SLOTS } from "@claudetools/seo";
import { QR_TYPES, PAYMENT_GUIDES } from "./content.js";
import { SITE } from "./seo.js";

// Manual AdSense unit inside a height-reserved container (no CLS). The push is
// skipped when the slot is display:none (mobile rail) to avoid availableWidth=0 errors.
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
  children: Child;
};

export function Layout({
  title,
  desc,
  path,
  origin,
  jsonLd = [],
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
