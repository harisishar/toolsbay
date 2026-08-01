// Shared schema.org JSON-LD builders used by every tool site.
export { ADSENSE_CLIENT, AD_SLOTS } from "./ads.ts";
export {
  privacySections,
  PRIVACY_UPDATED,
  type PrivacySection,
} from "./privacy.ts";

export type Faq = { q: string; a: string };

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
  sections: { h: string; body: string[] }[];
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

export function sitemapXml(origin: string, paths: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${origin}${p}</loc></url>`).join("\n")}
</urlset>`;
}
