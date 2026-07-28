import {
  webAppJsonLd as webApp,
  articleJsonLd as article,
  faqJsonLd,
  robotsTxt,
  type Faq,
} from "@claudetools/seo";

export { faqJsonLd, robotsTxt };
export type { Faq };

export const SITE = {
  name: "MakeQR",
  tagline: "Free QR Code Generator",
  // Runs on <worker>.workers.dev until the custom domain exists; canonical URLs
  // derive from the request origin so they stay correct on either host.
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
