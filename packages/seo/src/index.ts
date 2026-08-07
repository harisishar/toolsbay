// Shared schema.org JSON-LD builders used by every tool site.
export { ADSENSE_CLIENT, AD_SLOTS, GA_ID, GA_INIT } from "./ads.ts";
export {
  privacySections,
  PRIVACY_UPDATED,
  type PrivacySection,
} from "./privacy.ts";
export {
  PUBLISHER_ORIGIN,
  PUBLISHER_NAME,
  CONTACT_EMAIL,
  OPERATOR,
  OPERATOR_LOCATION,
  SITES,
} from "./site.ts";
import { PUBLISHER_ORIGIN } from "./site.ts";

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

// ---------------------------------------------------------------------------
// Publisher identity
//
// CalcHub / ImgSquash / PaperKit / MakeQR are sub-brands of one operator, not
// four sites. The @id is absolute and apex-anchored on purpose: derived from the
// requesting origin it would declare four separate organizations, which is
// exactly the "network of thin sites" reading we are trying to avoid.
// ---------------------------------------------------------------------------

export const ORG_ID = `${PUBLISHER_ORIGIN}/#organization`;
export const websiteId = (origin: string) => `${origin}/#website`;

// Real profiles only. An invented sameAs is a structured-data policy violation,
// and an empty array is dropped rather than emitted.
const SAME_AS: string[] = [];

/**
 * The sitewide @graph, emitted once per page from every Layout. Page-level
 * blocks reference these nodes by @id instead of redeclaring the organization,
 * so Google resolves one entity across all 150 pages.
 */
export function siteGraph(o: {
  origin: string;
  siteName: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "ToolsBay",
        url: PUBLISHER_ORIGIN + "/",
        description:
          "ToolsBay builds free browser-based tools for files, images, PDFs and numbers. Processing happens on your device, not on a server.",
        // ponytail: the 1200x630 social card doubles as the logo. Replace with a
        // dedicated square wordmark if a knowledge panel ever matters.
        logo: {
          "@type": "ImageObject",
          url: PUBLISHER_ORIGIN + "/og.png",
          width: 1200,
          height: 630,
        },
        ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
      },
      {
        "@type": "WebSite",
        "@id": websiteId(o.origin),
        name: o.siteName,
        description: o.description,
        url: o.origin + "/",
        publisher: { "@id": ORG_ID },
        inLanguage: "en",
      },
    ],
  };
}

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
    isPartOf: { "@id": websiteId(o.origin) },
    publisher: { "@id": ORG_ID },
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
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: o.headline,
    description: o.description,
    url: o.origin + o.path,
    mainEntityOfPage: { "@type": "WebPage", "@id": o.origin + o.path },
    isPartOf: { "@id": websiteId(o.origin) },
    // Attributed to the organization until a named operator exists. Naming a
    // person we cannot back with real profiles would be worse than this.
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
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
export function robotsTxt(
  origin: string,
  opts?: { disallow?: string[]; sitemaps?: string[] },
) {
  const dis = (opts?.disallow ?? []).map((d) => `Disallow: ${d}`).join("\n");
  // The apex lists the four subdomain sitemaps too, so one robots.txt fetch
  // reaches all 150 URLs instead of 15.
  const maps = [`${origin}/sitemap.xml`, ...(opts?.sitemaps ?? [])]
    .map((s) => `Sitemap: ${s}`)
    .join("\n");
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

${maps}`;
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
