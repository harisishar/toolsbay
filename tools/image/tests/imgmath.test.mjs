import { test } from "node:test";
import assert from "node:assert/strict";
import {
  fitWithin,
  resolveResize,
  scaleByPercent,
  renameForType,
  formatBytes,
  savings,
} from "../src/lib/imgmath.ts";

test("fitWithin never upscales and preserves aspect", () => {
  assert.deepEqual(fitWithin({ w: 4000, h: 2000 }, 1920, 1920), {
    w: 1920,
    h: 960,
  });
  assert.deepEqual(fitWithin({ w: 800, h: 600 }, 1920, 1920), {
    w: 800,
    h: 600,
  });
  assert.deepEqual(fitWithin({ w: 0, h: 10 }, 100, 100), { w: 0, h: 0 });
});

test("resolveResize", () => {
  const src = { w: 1000, h: 500 };
  assert.deepEqual(resolveResize(src, "500", "", true), { w: 500, h: 250 });
  assert.deepEqual(resolveResize(src, "", "100", true), { w: 200, h: 100 });
  assert.deepEqual(resolveResize(src, "300", "300", false), { w: 300, h: 300 });
  assert.deepEqual(resolveResize(src, "300", "300", true), { w: 300, h: 150 });
  assert.deepEqual(resolveResize(src, "", "", true), src);
});

test("scaleByPercent", () => {
  assert.deepEqual(scaleByPercent({ w: 1000, h: 500 }, 50), { w: 500, h: 250 });
  assert.deepEqual(scaleByPercent({ w: 3, h: 3 }, 10), { w: 1, h: 1 });
});

test("renameForType", () => {
  assert.equal(renameForType("IMG_0042.HEIC", "image/jpeg"), "IMG_0042.jpg");
  assert.equal(renameForType("photo.png", "image/webp"), "photo.webp");
  assert.equal(renameForType("noext", "image/png"), "noext.png");
  // A downloaded favicon must end in .ico or the browser will not serve it as one.
  assert.equal(renameForType("logo.svg", "image/x-icon"), "logo.ico");
  assert.equal(renameForType("a.b.c.png", "image/x-icon"), "a.b.c.ico");
});

test("formatBytes / savings", () => {
  assert.equal(formatBytes(512), "512 B");
  assert.equal(formatBytes(2048), "2.0 KB");
  assert.equal(formatBytes(3 * 1024 * 1024), "3.00 MB");
  assert.equal(savings(1000, 250), 75);
  assert.equal(savings(1000, 1200), -20);
  assert.equal(savings(0, 100), 0);
});
