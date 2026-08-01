// Asset facts about the segmentation model, in one place because two very
// different things need them: scripts/vendor.mjs downloads, verifies and splits
// the file at build time, and client/bgremove.ts fetches and reassembles it at
// runtime. If the part count drifted between those two, the model would
// reassemble short and ONNX would fail with something unreadable.

// silueta — U²-Net, quantised, 320×320. Apache-2.0 via xuebinqin/U-2-Net,
// redistributed by rembg (MIT). Chosen over the alternatives on licensing:
// @imgly/background-removal is AGPL-3.0 and BRIA RMBG is CC BY-NC, neither of
// which is usable on an ad-funded site.
export const MODEL_URL =
  "https://github.com/danielgatis/rembg/releases/download/v0.0.0/silueta.onnx";
export const MODEL_SHA256 =
  "75da6c8d2f8096ec743d071951be73b4a8bc7b3e51d9a6625d63644f90ffeedb";
export const MODEL_BYTES = 44_173_029;

// Cloudflare Workers caps a single static asset at 25 MiB, so the 42 MiB model
// ships as parts. Three keeps each one comfortably under the limit.
export const MODEL_PARTS = 3;

export const MODEL_DIR = "/models";
export const MODEL_NAME = "silueta.onnx";
export const ORT_DIR = "/ort";

export const partUrl = (i: number) =>
  `${MODEL_DIR}/${MODEL_NAME}.part${i}`;
