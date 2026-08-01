// Verifies tools/hub/src/catalogue.ts still matches the tool content files.
// The hub is its own Worker and cannot import from the tool packages, so the
// catalogue is a copy — this is what stops it silently going stale.
//
//   node scripts/check-catalogue.mjs        # verify
//   node scripts/check-catalogue.mjs --write # regenerate catalogue.ts, then verify
//
// This imports the real modules rather than grepping source. An earlier version
// regexed `slug: "..."` out of the text and silently missed the eight country
// salary calculators, whose slugs are template literals (`${cfg.code}-salary-
// tax-calculator`) — so it cheerfully validated a catalogue that was missing
// them. Node runs .ts directly; there is no reason to parse source by hand.

import { writeFileSync, readFileSync } from "node:fs";

const url = (p) => new URL(`../${p}`, import.meta.url);

const { ALL_CALCS } =
  await import("../tools/calculator/src/lib/calcs/index.ts");
const { TOOLS } = await import("../tools/pdf/src/content.ts");
const { PAIRS, CORE } = await import("../tools/image/src/content.ts");
const { QR_TYPES, SYMBOLOGIES, PAYMENT_GUIDES } =
  await import("../tools/qr/src/content.ts");

const GUIDE_LABEL = {
  "duitnow-qr-code": "DuitNow QR (Malaysia)",
  "paynow-qr-code": "PayNow QR (Singapore)",
  "upi-qr-code": "UPI QR (India)",
  "promptpay-qr-code": "PromptPay QR (Thailand)",
};

// [slug, label] pairs, plus the per-tool category each entry belongs to.
const expected = {
  CALC: ALL_CALCS.map((c) => [c.slug, c.name]),
  PDF: TOOLS.map((t) => [t.slug, t.label]),
  // CORE paths are routes ("/compress-image"); the catalogue stores bare slugs.
  IMAGE_CORE: CORE.map((t) => [t.path.slice(1), t.label]),
  IMAGE_PAIRS: PAIRS.map((p) => [
    p.slug,
    `${p.src.toUpperCase()} to ${p.tgt.toUpperCase()}`,
  ]),
  QR_TYPES: QR_TYPES.map((t) => [t.slug, t.label]),
  BARCODES: [
    ["barcode-generator", "All formats"],
    ...SYMBOLOGIES.map((s) => [s.slug, s.label]),
  ],
  QR_GUIDES: PAYMENT_GUIDES.map((g) => [g.slug, GUIDE_LABEL[g.slug] ?? g.slug]),
};

const calcCategory = Object.fromEntries(
  ALL_CALCS.map((c) => [c.slug, c.category]),
);
const pdfCategory = Object.fromEntries(TOOLS.map((t) => [t.slug, t.category]));

const total =
  expected.CALC.length +
  expected.PDF.length +
  expected.IMAGE_CORE.length +
  expected.IMAGE_PAIRS.length +
  expected.QR_TYPES.length +
  expected.BARCODES.length +
  expected.QR_GUIDES.length;

// --- generate ---------------------------------------------------------------

const q = (s) => JSON.stringify(s);
const entries = (list) =>
  list.map(([s, n]) => `  [${q(s)}, ${q(n)}],`).join("\n");
const record = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => `  [${q(k)}]: ${q(v)},`)
    .join("\n");

const generated = `// GENERATED — do not edit by hand.
//   node scripts/check-catalogue.mjs --write
//
// The hub is a separate Worker and cannot import the tool packages, so this is a
// copy of their page lists. The check script imports the real modules and fails
// if this drifts. Sources of truth:
//   tools/calculator/src/lib/calcs/index.ts  (ALL_CALCS)
//   tools/pdf/src/content.ts                 (TOOLS)
//   tools/image/src/content.ts               (PAIRS) + the 4 core pages below
//   tools/qr/src/content.ts                  (QR_TYPES, SYMBOLOGIES, PAYMENT_GUIDES)

export type Entry = [slug: string, label: string];

export const CALC: Entry[] = [
${entries(expected.CALC)}
];

export const CALC_CATEGORY: Record<string, string> = {
${record(calcCategory)}
};

export const PDF: Entry[] = [
${entries(expected.PDF)}
];

export const PDF_CATEGORY: Record<string, string> = {
${record(pdfCategory)}
};

export const IMAGE_CORE: Entry[] = [
${entries(expected.IMAGE_CORE)}
];

export const IMAGE_PAIRS: Entry[] = [
${entries(expected.IMAGE_PAIRS)}
];

export const QR_TYPES: Entry[] = [
${entries(expected.QR_TYPES)}
];

export const BARCODES: Entry[] = [
${entries(expected.BARCODES)}
];

export const QR_GUIDES: Entry[] = [
${entries(expected.QR_GUIDES)}
];

export const TOTAL_PAGES = ${total};
`;

const catPath = url("tools/hub/src/catalogue.ts");
if (process.argv.includes("--write")) {
  writeFileSync(catPath, generated);
  console.log(`wrote tools/hub/src/catalogue.ts (${total} pages)`);
}

// --- verify -----------------------------------------------------------------

const actual = readFileSync(catPath, "utf8");
let failed = false;

if (actual.trim() !== generated.trim()) {
  failed = true;
  console.error("✗ tools/hub/src/catalogue.ts is out of date.");
  console.error("  Run: node scripts/check-catalogue.mjs --write");
} else {
  for (const [name, list] of Object.entries(expected)) {
    console.log(`✓ ${name} (${list.length})`);
  }
  console.log(`✓ TOTAL_PAGES (${total})`);
}

// Marketing copy quoting counts goes stale exactly like a stale list does.
const hub = readFileSync(url("tools/hub/src/index.tsx"), "utf8");
for (const [re, real, what] of [
  [/(\d+) calculators/, expected.CALC.length, "calculators"],
  [/(\d+) PDF tools/, expected.PDF.length, "PDF tools"],
  [/(\d+) QR types/, expected.QR_TYPES.length, "QR types"],
  [/(\d+) format converters/, expected.IMAGE_PAIRS.length, "format converters"],
]) {
  const m = hub.match(re);
  if (m && Number(m[1]) !== real) {
    failed = true;
    console.error(`✗ hub copy claims "${m[0]}" but there are ${real} ${what}`);
  }
}

if (failed) process.exit(1);
console.log("\nCatalogue and hub copy match all tool sources.");
