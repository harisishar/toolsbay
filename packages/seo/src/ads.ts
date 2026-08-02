// Google AdSense — manual units only; Auto ads stay OFF in the dashboard so
// Google can never inject anchors/vignettes/popups.
export const ADSENSE_CLIENT = "ca-pub-4725551882364441";

// Google Analytics 4 — one property across every subdomain.
export const GA_ID = "G-8DXNR0KTVT";
export const GA_INIT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`;

export const AD_SLOTS = {
  contentBottom: "8992161056", // responsive horizontal, below content on every page
  rail: "2571202877", // fixed 300×250 under the sticky sidebar (calc + qr), desktop only
} as const;
