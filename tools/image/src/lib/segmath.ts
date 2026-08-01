// Pure tensor math for the background-removal model. DOM-free on purpose, same
// reason as imgmath.ts: `node --test` imports this directly, and a wrong
// normalisation produces a plausible-looking mask rather than an error.

// The model is U²-Net (silueta), which expects 320×320 NCHW input normalised
// with the ImageNet statistics its training used.
export const SIZE = 320;
const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

// RGBA bytes → planar float NCHW [1,3,SIZE,SIZE].
//
// The divisor is the image's own brightest channel value, not a fixed 255. That
// looks like a bug and is not: it is what rembg's U²-Net preprocessing does, so
// matching it keeps our masks identical to the reference implementation. It
// also means a uniformly dark photo is stretched up before normalisation.
export function toNCHW(rgba: Uint8ClampedArray, size = SIZE): Float32Array {
  const n = size * size;
  if (rgba.length < n * 4) {
    throw new Error(`toNCHW: expected ${n * 4} bytes, got ${rgba.length}`);
  }
  let max = 0;
  for (let i = 0; i < n * 4; i += 4) {
    if (rgba[i] > max) max = rgba[i];
    if (rgba[i + 1] > max) max = rgba[i + 1];
    if (rgba[i + 2] > max) max = rgba[i + 2];
  }
  if (max === 0) max = 1; // a fully black image would otherwise divide by zero

  const out = new Float32Array(3 * n);
  for (let p = 0; p < n; p++) {
    const s = p * 4;
    out[p] = (rgba[s] / max - MEAN[0]) / STD[0];
    out[n + p] = (rgba[s + 1] / max - MEAN[1]) / STD[1];
    out[2 * n + p] = (rgba[s + 2] / max - MEAN[2]) / STD[2];
  }
  return out;
}

// The model's raw output is unbounded saliency, not a 0..1 alpha — rembg
// min-max stretches it before use. A flat output (every pixel identical, which
// happens on a blank image) has zero range and must not divide by zero.
export function normalizeMask(raw: Float32Array): Float32Array {
  let min = Infinity;
  let max = -Infinity;
  for (const v of raw) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const range = max - min;
  const out = new Float32Array(raw.length);
  if (range === 0) return out; // flat output → nothing salient → fully transparent
  for (let i = 0; i < raw.length; i++) out[i] = (raw[i] - min) / range;
  return out;
}

// Mask floats → an RGBA buffer whose alpha carries the mask, ready to hand to
// putImageData and scale up with the browser's own bilinear filtering.
// Return type is inferred on purpose: annotating it as a bare Uint8ClampedArray
// widens the buffer to ArrayBufferLike, which ImageData will not accept.
export function maskToRgba(mask: Float32Array) {
  const out = new Uint8ClampedArray(mask.length * 4);
  for (let i = 0; i < mask.length; i++) {
    const a = Math.round(mask[i] * 255);
    const s = i * 4;
    out[s] = 255;
    out[s + 1] = 255;
    out[s + 2] = 255;
    out[s + 3] = a;
  }
  return out;
}
