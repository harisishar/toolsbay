// The mask pipeline fails silently: a wrong channel order or a bad normalisation
// still yields a picture, just the wrong one. These pin the two transforms that
// have no visual tell.
import { test } from "node:test";
import assert from "node:assert/strict";
import { toNCHW, normalizeMask, maskToRgba, SIZE } from "../src/lib/segmath.ts";

const solid = (r, g, b, size) => {
  const a = new Uint8ClampedArray(size * size * 4);
  for (let i = 0; i < a.length; i += 4) {
    a[i] = r;
    a[i + 1] = g;
    a[i + 2] = b;
    a[i + 3] = 255;
  }
  return a;
};

test("toNCHW lays out planar RGB, not interleaved", () => {
  const size = 2;
  const px = new Uint8ClampedArray([
    255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 255, 255,
  ]);
  const out = toNCHW(px, size);
  const n = size * size;
  assert.equal(out.length, 3 * n, "must be 3 planes of size²");

  // Brightest channel is 255, so the divisor is 255 and channel maths is exact.
  const norm = (v, c) =>
    (v / 255 - [0.485, 0.456, 0.406][c]) / [0.229, 0.224, 0.225][c];

  // Pixel 0 is pure red: full in the R plane, zero in G and B.
  assert.ok(
    Math.abs(out[0] - norm(255, 0)) < 1e-6,
    "R plane holds pixel 0 red",
  );
  assert.ok(
    Math.abs(out[n] - norm(0, 1)) < 1e-6,
    "G plane holds pixel 0 green",
  );
  assert.ok(
    Math.abs(out[2 * n] - norm(0, 2)) < 1e-6,
    "B plane holds pixel 0 blue",
  );

  // Pixel 1 is pure green — catches an interleaved layout, which would put
  // green at index 1 instead of index n+1.
  assert.ok(
    Math.abs(out[n + 1] - norm(255, 1)) < 1e-6,
    "G plane holds pixel 1",
  );
  assert.ok(Math.abs(out[1] - norm(0, 0)) < 1e-6, "R plane is zero at pixel 1");
});

test("toNCHW divides by the image max, matching rembg rather than a fixed 255", () => {
  // A dim image: brightest channel is 128, so rembg stretches it to full range
  // before normalising. Dividing by 255 here would darken every mask input.
  const out = toNCHW(solid(128, 128, 128, 2), 2);
  const expected = (1 - 0.485) / 0.229; // 128/128 = 1, not 128/255
  assert.ok(
    Math.abs(out[0] - expected) < 1e-6,
    `got ${out[0]}, want ${expected}`,
  );
});

test("toNCHW survives a fully black image instead of dividing by zero", () => {
  const out = toNCHW(solid(0, 0, 0, 2), 2);
  assert.ok(
    out.every((v) => Number.isFinite(v)),
    "black image produced NaN/Infinity",
  );
});

test("toNCHW rejects a buffer that is too small for the declared size", () => {
  assert.throws(() => toNCHW(new Uint8ClampedArray(4), 2), /expected 16 bytes/);
});

test("normalizeMask stretches to 0..1", () => {
  const out = normalizeMask(new Float32Array([-3, 0, 5]));
  assert.equal(out[0], 0);
  assert.equal(out[2], 1);
  assert.ok(out[1] > 0 && out[1] < 1);
});

test("normalizeMask returns transparent, not NaN, for a flat output", () => {
  const out = normalizeMask(new Float32Array([2, 2, 2, 2]));
  assert.ok(
    out.every((v) => v === 0),
    "a flat mask must be fully transparent, not NaN",
  );
});

test("maskToRgba puts the mask in alpha and leaves RGB opaque white", () => {
  const out = maskToRgba(new Float32Array([0, 1]));
  assert.deepEqual([...out.slice(0, 4)], [255, 255, 255, 0], "0 → transparent");
  assert.deepEqual([...out.slice(4, 8)], [255, 255, 255, 255], "1 → opaque");
});

test("SIZE is the 320 the model was exported for", () => {
  assert.equal(SIZE, 320);
});
