// Shared schema.org JSON-LD builders used by every tool site.
export { ADSENSE_CLIENT, AD_SLOTS, GA_ID, GA_INIT } from "./ads.ts";
export {
  privacySections,
  PRIVACY_UPDATED,
  type PrivacySection,
} from "./privacy.ts";

export type Faq = { q: string; a: string };

// The prose-body shape every long-form page uses: privacy sections, QR payment
// guides, comparison pages and — since the depth pass — every tool page.
export type Section = { h: string; body: string[] };

// A real procedure, rendered as an <ol> and emitted as HowTo JSON-LD. Optional:
// plenty of pages (a converter, a QR type) have no meaningful step sequence.
export type Step = { name: string; text: string };

// Competitor comparison pages. Data only — each tool renders it with its own
// Layout/FaqSection, exactly like privacySections(). `sections` is the same
// { h, body[] } shape the privacy page and the QR guides already use.
//
// `us`/`them` are short cell strings ("No cap", "2 tasks"); `note` is the
// qualifier that keeps a cell honest when a bare tick would overclaim.
export type CompareRow = {
  feature: string;
  us: string;
  them: string;
  note?: string;
};

export type Comparison = {
  slug: string;
  competitor: string;
  title: string;
  desc: string;
  h1: string;
  intro: string;
  sections: Section[];
  matrix: CompareRow[];
  // Every competitor claim on the page is checkable from one of these.
  sources: { label: string; url: string }[];
  updated: string;
  faq: Faq[];
};

export function webAppJsonLd(o: {
  origin: string;
  path: string;
  name: string;
  description: string;
  siteName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: o.name,
    description: o.description,
    url: o.origin + o.path,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: o.siteName, url: o.origin },
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleJsonLd(o: {
  origin: string;
  path: string;
  headline: string;
  description: string;
  siteName: string;
  updated?: string;
}) {
  const org = { "@type": "Organization", name: o.siteName, url: o.origin };
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: o.headline,
    description: o.description,
    url: o.origin + o.path,
    author: org,
    publisher: org,
    ...(o.updated ? { datePublished: o.updated, dateModified: o.updated } : {}),
  };
}

// "How to merge PDF" is the query on half these pages; the markup should say so.
export function howToJsonLd(o: {
  origin: string;
  path: string;
  name: string;
  description: string;
  steps: Step[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: o.name,
    description: o.description,
    url: o.origin + o.path,
    step: o.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

// Trail excludes the current page's own link target by convention — pass the
// full trail including self; schema.org wants the current page as the last item.
export function breadcrumbJsonLd(
  origin: string,
  trail: [name: string, path: string][],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: origin + path,
    })),
  };
}

// Explicitly welcome AI search crawlers (GEO): being listed by name is the
// recommended signal even though `*` already allows them.
export function robotsTxt(origin: string, opts?: { disallow?: string[] }) {
  const dis = (opts?.disallow ?? []).map((d) => `Disallow: ${d}`).join("\n");
  return `User-agent: *
Allow: /
${dis ? dis + "\n" : ""}
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${origin}/sitemap.xml`;
}

// Accepts a bare path or a { path, lastmod } pair so pages that track an
// `updated` date can advertise it. Bare paths stay bare — a made-up lastmod is
// worse than none.
export function sitemapXml(
  origin: string,
  paths: (string | { path: string; lastmod?: string })[],
) {
  const url = (p: (typeof paths)[number]) => {
    const { path, lastmod } =
      typeof p === "string"
        ? ({ path: p } as { path: string; lastmod?: string })
        : p;
    const mod = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
    return `  <url><loc>${origin}${path}</loc>${mod}</url>`;
  };
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(url).join("\n")}
</urlset>`;
}
