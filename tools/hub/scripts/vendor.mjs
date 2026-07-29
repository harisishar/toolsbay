// Copies self-hosted fonts from node_modules into public/.
import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nm = (p) => join(root, "node_modules", p);
const pub = (p) => join(root, "public", p);

mkdirSync(pub("fonts"), { recursive: true });

const copies = [
  [
    "@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff2",
    "fonts/bricolage-800.woff2",
  ],
  [
    "@fontsource/instrument-sans/files/instrument-sans-latin-400-normal.woff2",
    "fonts/instrument-400.woff2",
  ],
  [
    "@fontsource/instrument-sans/files/instrument-sans-latin-600-normal.woff2",
    "fonts/instrument-600.woff2",
  ],
];

for (const [src, dest] of copies) cpSync(nm(src), pub(dest));
console.log(`vendored ${copies.length} files`);
