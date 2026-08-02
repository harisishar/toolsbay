import {
  webAppJsonLd as webApp,
  articleJsonLd as article,
  faqJsonLd,
  howToJsonLd,
  breadcrumbJsonLd,
  sitemapXml,
  robotsTxt,
  type Faq,
  type Comparison,
  type CompareRow,
} from "@claudetools/seo";

export { faqJsonLd, howToJsonLd, breadcrumbJsonLd, sitemapXml, robotsTxt };
export type { Faq, Comparison, CompareRow };

export const SITE = {
  name: "CalcHub",
  tagline: "Free Online Calculators",
};

export const webAppJsonLd = (
  origin: string,
  path: string,
  name: string,
  description: string,
) => webApp({ origin, path, name, description, siteName: SITE.name });

export const articleJsonLd = (
  origin: string,
  path: string,
  headline: string,
  description: string,
) => article({ origin, path, headline, description, siteName: SITE.name });
