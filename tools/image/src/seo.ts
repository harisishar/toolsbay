import {
  webAppJsonLd as webApp,
  articleJsonLd as article,
  faqJsonLd,
  sitemapXml,
  robotsTxt,
  type Faq,
} from '@claudetools/seo';

export { faqJsonLd, sitemapXml, robotsTxt };
export type { Faq };

export const SITE = {
  name: 'PixSquash',
  tagline: 'Free Image Compressor, Resizer & Converter',
};

export const webAppJsonLd = (origin: string, path: string, name: string, description: string) =>
  webApp({ origin, path, name, description, siteName: SITE.name });

export const articleJsonLd = (origin: string, path: string, headline: string, description: string) =>
  article({ origin, path, headline, description, siteName: SITE.name });
