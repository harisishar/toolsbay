// Lazy-loaded background-removal chunk: ONNX Runtime Web + the silueta U²-Net
// model, both self-hosted. Same shape as the HEIC chunk in ops.ts — nothing
// here is touched until someone drops a file on /remove-background.
import * as ort from "onnxruntime-web/wasm";
import { toNCHW, normalizeMask, maskToRgba, SIZE } from "../lib/segmath.js";
import {
  MODEL_BYTES,
  MODEL_PARTS,
  ORT_DIR,
  partUrl,
} from "../lib/model.js";

ort.env.wasm.wasmPaths = `${ORT_DIR}/`;
// AdSense rules out COOP/COEP, so there is no crossOriginIsolated and no
// SharedArrayBuffer. Saying 1 explicitly keeps ORT from warning about threads
// it cannot start anyway.
ort.env.wasm.numThreads = 1;

export type Progress = (loaded: number, total: number) => void;

let sessP: Promise<ort.InferenceSession> | null = null;

async function load(onProgress?: Progress): Promise<ort.InferenceSession> {
  const buf = new Uint8Array(MODEL_BYTES);
  let at = 0;
  for (let i = 0; i < MODEL_PARTS; i++) {
    const res = await fetch(partUrl(i));
    if (!res.ok) {
      throw new Error(
        `Could not download the background-removal model (part ${i + 1} of ${MODEL_PARTS})`,
      );
    }
    const part = new Uint8Array(await res.arrayBuffer());
    if (at + part.length > buf.length) break; // caught by the size check below
    buf.set(part, at);
    at += part.length;
    onProgress?.(at, MODEL_BYTES);
  }
  // A stale or partial build reassembles into a buffer ONNX rejects with an
  // unreadable parser error. Fail here instead, where the cause is obvious.
  if (at !== MODEL_BYTES) {
    throw new Error(
      `Model reassembled to ${at} bytes, expected ${MODEL_BYTES} — run \`pnpm build\` to refresh the model parts`,
    );
  }
  return ort.InferenceSession.create(buf, { executionProviders: ["wasm"] });
}

// Memoised so the 42 MB model is built once per page, but cleared on failure so
// a transient network error does not poison every later attempt.
function session(onProgress?: Progress): Promise<ort.InferenceSession> {
  return (sessP ??= load(onProgress).catch((e) => {
    sessP = null;
    throw e;
  }));
}

// Returns a canvas the size of the input with the background cut to transparent.
export async function cutout(
  bmp: ImageBitmap,
  onProgress?: Progress,
): Promise<HTMLCanvasElement> {
  const sess = await session(onProgress);

  // The model only ever sees 320×320 — this downscale is the quality ceiling.
  const small = document.createElement("canvas");
  small.width = SIZE;
  small.height = SIZE;
  const sctx = small.getContext("2d", { willReadFrequently: true })!;
  sctx.imageSmoothingQuality = "high";
  sctx.drawImage(bmp, 0, 0, SIZE, SIZE);
  const input = toNCHW(sctx.getImageData(0, 0, SIZE, SIZE).data);

  const out = await sess.run({
    [sess.inputNames[0]]: new ort.Tensor("float32", input, [1, 3, SIZE, SIZE]),
  });
  // U²-Net emits seven side outputs; the first is the fused one rembg uses.
  const raw = out[sess.outputNames[0]].data as Float32Array;
  const mask = normalizeMask(raw.subarray(0, SIZE * SIZE));

  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = SIZE;
  maskCanvas.height = SIZE;
  maskCanvas
    .getContext("2d")!
    .putImageData(new ImageData(maskToRgba(mask), SIZE, SIZE), 0, 0);

  // Paint the upscaled mask first, then draw the photo through it with
  // source-in, which multiplies the two alphas. The browser's own bilinear
  // filter does the 320 → full-size upscale.
  const result = document.createElement("canvas");
  result.width = bmp.width;
  result.height = bmp.height;
  const ctx = result.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(maskCanvas, 0, 0, result.width, result.height);
  ctx.globalCompositeOperation = "source-in";
  ctx.drawImage(bmp, 0, 0);
  return result;
}
