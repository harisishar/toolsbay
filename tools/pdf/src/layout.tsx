import type { Child } from 'hono/jsx';
import { SITE } from './seo.js';
import { TOOLS, CATEGORIES } from './content.js';

type LayoutProps = {
  title: string;
  desc: string;
  path: string;
  origin: string;
  jsonLd?: object[];
  children: Child;
};

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
      <body class="bg-cream font-sans text-ink antialiased">
        <header class="border-b border-line bg-panel">
          <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <a href="/" class="font-display text-lg tracking-tight">
              <span aria-hidden="true" class="mr-2 inline-block h-3 w-3 rotate-45 bg-brick" />
              {SITE.name}
            </a>
            <nav class="flex items-center gap-5 text-sm font-semibold text-muted">
              <a href="/merge-pdf" class="hidden hover:text-brick-deep sm:inline">
                Merge
              </a>
              <a href="/compress-pdf" class="hidden hover:text-brick-deep sm:inline">
                Compress
              </a>
              <a href="/pdf-to-word" class="hidden hover:text-brick-deep sm:inline">
                PDF to Word
              </a>
              <a href="/#tools" class="hover:text-brick-deep">
                All tools
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer class="mt-16 border-t border-line bg-panel">
          <div class="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((cat) => (
              <div>
                <h2 class="font-display mb-3 text-sm">{cat}</h2>
                <ul class="space-y-1.5 text-muted">
                  {TOOLS.filter((t) => t.category === cat).map((t) => (
                    <li>
                      <a href={`/${t.slug}`} class="hover:text-brick-deep">
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div class="border-t border-line">
            <p class="mx-auto max-w-5xl px-4 py-4 text-xs leading-5 text-muted">
              {SITE.name} — free PDF tools. Everything that can run in your browser does; the few
              conversions that need a document engine are streamed through our server and never
              stored.{' '}
              <a href="/privacy-policy" class="font-semibold text-ink hover:text-brick-deep">
                Read our privacy policy
              </a>
              .
            </p>
          </div>
        </footer>
        <script type="module" src="/js/app.js" />
        <script defer src="/vendor/alpine.min.js" />
      </body>
    </html>
  );
}
