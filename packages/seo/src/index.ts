// Shared schema.org JSON-LD builders used by every tool site.

export type Faq = { q: string; a: string };

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

export function sitemapXml(origin: string, paths: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${origin}${p}</loc></url>`).join("\n")}
</urlset>`;
}
