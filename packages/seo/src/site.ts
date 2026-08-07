// Publisher identity, in one place, because it is asserted in three formats
// that must agree: the schema.org Organization node, the /about and /contact
// prose, and the privacy policy on all five hostnames. When they disagree, the
// site reads as a network of unrelated thin sites rather than one publisher —
// which is exactly what the AdSense "low value content" review flagged.

export const PUBLISHER_ORIGIN = "https://toolsbay.app";
export const PUBLISHER_NAME = "ToolsBay";

// CHANGE ME BEFORE DEPLOY if you want a branded address: hello@toolsbay.app
// needs Cloudflare Email Routing on the zone. Whatever is here must be a
// mailbox somebody actually reads — the previous copy pointed at "contact
// details on the homepage" that never existed, and a policy page that breaks
// its own promise is the worst thing to leave in front of a policy reviewer.
export const CONTACT_EMAIL = "jvrhqmarketing@gmail.com";

// REQUIRED before deploy — see tools/hub/tests/content.test.mjs, which fails
// while this is still the placeholder. /about names the operator, and an About
// page with no identifiable publisher does not do the job it exists to do:
// "who is behind this site" is the first thing a policy reviewer looks for.
// A registered company name is ideal; a real personal name is fine.
export const OPERATOR = "SET_OPERATOR_NAME";

// Where the operator is based. Drives the governing-law line in /terms and the
// "who you are dealing with" line in /about.
export const OPERATOR_LOCATION = "Malaysia";

// The four sub-brands. Sub-brands are fine; an invisible publisher is not.
export const SITES = [
  {
    name: "CalcHub",
    host: "calc.toolsbay.app",
    what: "Calculators",
    blurb: "Finance, health, math, dates and take-home pay after tax",
  },
  {
    name: "ImgSquash",
    host: "image.toolsbay.app",
    what: "Image tools",
    blurb: "Compress, resize, crop, remove backgrounds and convert formats",
  },
  {
    name: "PaperKit",
    host: "pdf.toolsbay.app",
    what: "PDF tools",
    blurb: "Merge, split, compress, sign, redact, OCR and convert",
  },
  {
    name: "MakeQR",
    host: "qr.toolsbay.app",
    what: "QR codes & barcodes",
    blurb: "URL, WiFi, vCard and payment QR codes, plus retail barcodes",
  },
] as const;
