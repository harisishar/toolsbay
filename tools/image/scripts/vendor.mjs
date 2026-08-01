// Copies self-hosted client libs + fonts from node_modules into public/, and
// fetches the background-removal model (the one asset not on npm).
import {
  cpSync,
  mkdirSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nm = (p) => join(root, "node_modules", p);
const pub = (p) => join(root, "public", p);

mkdirSync(pub("vendor"), { recursive: true });
mkdirSync(pub("fonts"), { recursive: true });
mkdirSync(pub("ort"), { recursive: true });
mkdirSync(pub("models"), { recursive: true });

const copies = [
  ["alpinejs/dist/cdn.min.js", "vendor/alpine.min.js"],
  // Both halves of the ORT runtime. The bundled build still resolves its glue
  // module through wasmPaths at runtime, so shipping only the .wasm fails with
  // "no available backend found".
  [
    "onnxruntime-web/dist/ort-wasm-simd-threaded.wasm",
    "ort/ort-wasm-simd-threaded.wasm",
  ],
  [
    "onnxruntime-web/dist/ort-wasm-simd-threaded.mjs",
    "ort/ort-wasm-simd-threaded.mjs",
  ],
  [
    "@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff2",
    "fonts/bricolage-700.woff2",
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

// --- background-removal model -------------------------------------------
// Not on npm, so it is fetched from its pinned release URL, checksummed, and
// split: Cloudflare caps a single static asset at 25 MiB and this is 42 MiB.
// Cached in node_modules/.cache so a rebuild is not a 42 MB download.
const { MODEL_URL, MODEL_SHA256, MODEL_BYTES, MODEL_PARTS, MODEL_NAME } =
  await import("../src/lib/model.ts");

const cache = nm(".cache/" + MODEL_NAME);
const sha = (buf) => createHash("sha256").update(buf).digest("hex");

let model = existsSync(cache) ? readFileSync(cache) : null;
if (model && sha(model) !== MODEL_SHA256) {
  console.warn("cached model failed its checksum — refetching");
  model = null;
}

if (!model) {
  console.log(
    `downloading ${MODEL_NAME} (${(MODEL_BYTES / 1e6).toFixed(0)} MB)…`,
  );
  const res = await fetch(MODEL_URL);
  if (!res.ok) throw new Error(`${MODEL_URL} → HTTP ${res.status}`);
  model = Buffer.from(await res.arrayBuffer());
  // Verify before it is written anywhere or served to a browser. A model file
  // is executable input to ONNX; an unverified one is an untrusted binary.
  const got = sha(model);
  if (got !== MODEL_SHA256) {
    throw new Error(
      `model checksum mismatch\n  expected ${MODEL_SHA256}\n  got      ${got}`,
    );
  }
  mkdirSync(dirname(cache), { recursive: true });
  writeFileSync(cache, model);
}

if (model.length !== MODEL_BYTES) {
  throw new Error(
    `model is ${model.length} bytes, MODEL_BYTES says ${MODEL_BYTES}`,
  );
}

const CF_ASSET_MAX = 25 * 1024 * 1024;
const chunk = Math.ceil(model.length / MODEL_PARTS);
if (chunk > CF_ASSET_MAX) {
  throw new Error(
    `each part would be ${chunk} bytes, over Cloudflare's ${CF_ASSET_MAX} limit — raise MODEL_PARTS`,
  );
}
for (let i = 0; i < MODEL_PARTS; i++) {
  writeFileSync(
    pub(`models/${MODEL_NAME}.part${i}`),
    model.subarray(i * chunk, (i + 1) * chunk),
  );
}
console.log(
  `model split into ${MODEL_PARTS} parts of <= ${(chunk / 1024 / 1024).toFixed(1)} MiB`,
);
