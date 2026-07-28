export const SITE = {
  name: 'MakeQR',
  tagline: 'Free QR Code Generator',
  // Runs on <worker>.workers.dev until the custom domain exists; canonical URLs
  // derive from the request origin so they stay correct on either host.
  twitter: '',
};

export type Faq = { q: string; a: string };

export function webAppJsonLd(origin: string, path: string, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: origin + path,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: SITE.name, url: origin },
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function articleJsonLd(origin: string, path: string, headline: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: origin + path,
    author: { '@type': 'Organization', name: SITE.name, url: origin },
    publisher: { '@type': 'Organization', name: SITE.name, url: origin },
  };
}
