import type { Child } from 'hono/jsx';
import { SITE } from './seo.js';
import { PAIRS } from './content.js';

type LayoutProps = {
  title: string;
  desc: string;
  path: string;
  origin: string;
  jsonLd?: object[];
  children: Child;
};

const TOOLS = [
  ['/compress-image', 'Compress Image'],
  ['/resize-image', 'Resize Image'],
  ['/crop-image', 'Crop Image'],
  ['/image-converter', 'Convert Image'],
] as const;

export function Layout({ title, desc, path, origin, jsonLd = [], children }: LayoutProps) {
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
              <span aria-hidden="true" class="mr-2 inline-block h-3 w-3 rounded-sm bg-ember" />
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
        <main>{children}</main>
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
              <h2 class="font-display mb-3 text-sm text-fog">Popular conversions</h2>
              <ul class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-mist">
                {PAIRS.slice(0, 12).map((p) => (
                  <li>
                    <a href={`/${p.slug}`} class="hover:text-ember">
                      {p.h1.replace(' Converter', '')}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div class="text-mist">
              <h2 class="font-display mb-3 text-sm text-fog">{SITE.name}</h2>
              <p class="leading-6">
                Free image tools that run entirely in your browser. No uploads, no accounts, no
                watermarks — your photos never leave your device.{' '}
                <a href="/privacy-policy" class="font-semibold text-fog hover:text-ember">
                  Read our privacy policy
                </a>
                .
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
