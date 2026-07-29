// Google AdSense — manual units only; Auto ads stay OFF in the dashboard so
// Google can never inject anchors/vignettes/popups.
export const ADSENSE_CLIENT = "ca-pub-4725551882364441";

// ponytail: placeholder unit IDs — swap for the real ones after creating the
// two display units in the AdSense dashboard.
export const AD_SLOTS = {
  contentBottom: "0000000001", // responsive horizontal, below content on every page
  rail: "0000000002", // desktop-only box under the sticky sidebar (calc + qr)
} as const;
