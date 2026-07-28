import {
  webAppJsonLd as webApp,
  faqJsonLd,
  sitemapXml,
  type Faq,
} from '@claudetools/seo';

export { faqJsonLd, sitemapXml };
export type { Faq };

export const SITE = {
  name: 'CalcHub',
  tagline: 'Free Online Calculators',
};

export const webAppJsonLd = (origin: string, path: string, name: string, description: string) =>
  webApp({ origin, path, name, description, siteName: SITE.name });
