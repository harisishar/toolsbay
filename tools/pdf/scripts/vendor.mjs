// Copies self-hosted client libs + fonts from node_modules into public/.
import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nm = (p) => join(root, "node_modules", p);
const pub = (p) => join(root, "public", p);

mkdirSync(pub("vendor"), { recursive: true });
mkdirSync(pub("fonts"), { recursive: true });

const copies = [
  ["alpinejs/dist/cdn.min.js", "vendor/alpine.min.js"],
  ["pdfjs-dist/build/pdf.worker.min.mjs", "vendor/pdf.worker.min.mjs"],
  [
    "@fontsource/fraunces/files/fraunces-latin-700-normal.woff2",
    "fonts/fraunces-700.woff2",
  ],
  [
    "@fontsource/public-sans/files/public-sans-latin-400-normal.woff2",
    "fonts/public-sans-400.woff2",
  ],
  [
    "@fontsource/public-sans/files/public-sans-latin-600-normal.woff2",
    "fonts/public-sans-600.woff2",
  ],
  [
    "@fontsource/caveat/files/caveat-latin-700-normal.woff2",
    "fonts/caveat-700.woff2",
  ],
];

for (const [src, dest] of copies) cpSync(nm(src), pub(dest));
console.log(`vendored ${copies.length} files`);
