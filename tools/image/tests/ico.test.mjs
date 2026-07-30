// ICO output is the one place this tool hand-writes a binary format, so it is
// the one place a silent corruption would ship. encode() is exercised for real
// here — only the canvas is faked, because the ICO payload is a PNG that
// canvas.toBlob produces and we do not need a real rasterizer to check framing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { encode, icoFit, ICO_MAX } from "../src/client/ops.ts";

// 8-byte PNG signature + a little filler; encodeIco must copy it through verbatim.
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const fakePng = new Uint8Array([...PNG_MAGIC, 1, 2, 3, 4, 5, 6, 7, 8]);

function fakeCanvas(width, height, png = fakePng) {
  return {
    width,
    height,
    toBlob(cb, type) {
      assert.equal(type, "image/png", "ICO payload must be encoded as PNG");
      cb(new Blob([png], { type }));
    },
  };
}

async function parseIco(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const v = new DataView(bytes.buffer);
  return {
    bytes,
    reserved: v.getUint16(0, true),
    type: v.getUint16(2, true),
    count: v.getUint16(4, true),
    width: bytes[6],
    height: bytes[7],
    paletteSize: bytes[8],
    entryReserved: bytes[9],
    planes: v.getUint16(10, true),
    bpp: v.getUint16(12, true),
    byteLength: v.getUint32(14, true),
    offset: v.getUint32(18, true),
    payload: bytes.slice(22),
  };
}

test("encode() emits a structurally valid single-image ICO", async () => {
  const blob = await encode(fakeCanvas(32, 32), "image/x-icon", 0.8);
  assert.equal(blob.type, "image/x-icon");

  const ico = await parseIco(blob);
  assert.equal(ico.reserved, 0, "ICONDIR.reserved must be 0");
  assert.equal(ico.type, 1, "type 1 = icon (2 would be a cursor)");
  assert.equal(ico.count, 1, "we write exactly one image");
  assert.equal(ico.planes, 1);
  assert.equal(ico.bpp, 32);
  assert.equal(ico.paletteSize, 0, "0 = no colour palette");
  assert.equal(ico.entryReserved, 0);

  // The two fields a decoder actually uses to find the image.
  assert.equal(ico.offset, 22, "payload starts after the 6+16 byte header");
  assert.equal(
    ico.byteLength,
    fakePng.length,
    "declared length must match reality",
  );
  assert.equal(ico.payload.length, ico.byteLength, "no truncation or padding");
  assert.deepEqual(
    [...ico.payload.slice(0, 8)],
    PNG_MAGIC,
    "PNG copied through intact",
  );
});

test("ICO size byte: 0 encodes 256, anything smaller is literal", async () => {
  const small = await parseIco(
    await encode(fakeCanvas(48, 16), "image/x-icon", 1),
  );
  assert.equal(small.width, 48);
  assert.equal(small.height, 16);

  // 256 does not fit in a byte, so the format spells it 0. Getting this wrong
  // makes a 256px icon report as 0x0 and decoders skip it.
  const max = await parseIco(
    await encode(fakeCanvas(256, 256), "image/x-icon", 1),
  );
  assert.equal(max.width, 0, "256 must be written as 0");
  assert.equal(max.height, 0, "256 must be written as 0");
});

test("declared payload length tracks the real PNG, not a fixed guess", async () => {
  const big = new Uint8Array([...PNG_MAGIC, ...new Uint8Array(500).fill(9)]);
  const ico = await parseIco(
    await encode(fakeCanvas(64, 64, big), "image/x-icon", 1),
  );
  assert.equal(ico.byteLength, big.length);
  assert.equal(ico.bytes.length, 22 + big.length);
});

test("icoFit clamps to 256 preserving aspect, passes small images through", () => {
  assert.equal(ICO_MAX, 256);
  // Untouched when already within bounds — no needless resampling.
  assert.deepEqual(icoFit(32, 32), { w: 32, h: 32 });
  assert.deepEqual(icoFit(256, 256), { w: 256, h: 256 });
  // Oversized scales down on the long edge, aspect preserved.
  assert.deepEqual(icoFit(300, 300), { w: 256, h: 256 });
  assert.deepEqual(icoFit(1024, 512), { w: 256, h: 128 });
  assert.deepEqual(icoFit(512, 1024), { w: 128, h: 256 });
  // Extreme aspect must not collapse a side to zero — decoders reject 0-px images.
  const sliver = icoFit(4000, 3);
  assert.equal(sliver.w, 256);
  assert.ok(sliver.h >= 1, `height clamped to ${sliver.h}, must stay >= 1`);
});

test("non-ICO targets still go through canvas.toBlob unchanged", async () => {
  let askedFor = null;
  const canvas = {
    width: 10,
    height: 10,
    toBlob(cb, type, quality) {
      askedFor = { type, quality };
      cb(new Blob([new Uint8Array([1, 2, 3])], { type }));
    },
  };
  const jpg = await encode(canvas, "image/jpeg", 0.7);
  assert.equal(jpg.type, "image/jpeg");
  assert.deepEqual(askedFor, { type: "image/jpeg", quality: 0.7 });

  // PNG is lossless — passing a quality would be meaningless, so it must be undefined.
  await encode(canvas, "image/png", 0.7);
  assert.equal(
    askedFor.quality,
    undefined,
    "PNG must not receive a quality argument",
  );
});
