// Publisher identity, in one place, because it is asserted in three formats
// that must agree: the schema.org Organization node, the /about and /contact
// prose, and the privacy policy on all five hostnames. When they disagree, the
// site reads as a network of unrelated thin sites rather than one publisher —
// which is exactly what the AdSense "low value content" review flagged.

export const PUBLISHER_ORIGIN = "https://toolsbay.app";
export const PUBLISHER_NAME = "ToolsBay";

// The intended address is hello@toolsbay.app, but Cloudflare Email Routing is
// not enabled on the zone yet — toolsbay.app publishes no MX records, so mail
// to it bounces. Switching is this one line plus a redeploy, once routing is on
// and a destination address is verified.
//
// Whatever is here must be a mailbox somebody actually reads. The previous copy
// pointed at "contact details on the homepage" that never existed, and a policy
// page that breaks its own promise is the worst thing to put in front of a
// policy reviewer — shipping an address that bounces would be the same defect
// wearing a nicer domain.
export const CONTACT_EMAIL = "hello@toolsbay.app";

// The named operator, used by /about and /ai-information and emitted as the
// Organization's `founder`.
//
// A fuller name or a registered entity is a stronger signal than a first name,
// and real `sameAs` profiles (LinkedIn, GitHub, X) would be stronger still —
// `SAME_AS` in index.ts is where those go, and it is deliberately empty rather
// than filled with guesses. Worth revisiting before the review.
export const OPERATOR = "Haris";
export const OPERATOR_DESC = "an independent developer";
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
