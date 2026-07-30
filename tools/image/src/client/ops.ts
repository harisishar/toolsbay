// Image decode/transform/encode — all in-browser via Canvas.

// image/x-icon is ours, not the browser's — canvas.toBlob cannot produce ICO, so
// encode() wraps a PNG in an ICO container (see encodeIco).
export type Target = "image/jpeg" | "image/png" | "image/webp" | "image/x-icon";

// ICO stores each image at 256px or less; the size byte spells 256 as 0.
// Kept here rather than in lib/imgmath so this module stays free of value
// imports — the bundler rewrites ".js" specifiers, `node --test` does not, and
// tests/ico.test.mjs imports this file directly.
export const ICO_MAX = 256;

export function icoFit(w: number, h: number): { w: number; h: number } {
  if (w <= ICO_MAX && h <= ICO_MAX) return { w, h };
  const scale = ICO_MAX / Math.max(w, h);
  return {
    w: Math.max(1, Math.round(w * scale)),
    h: Math.max(1, Math.round(h * scale)),
  };
}

const HEIC_TYPES = ["image/heic", "image/heif"];

export function isHeic(file: File): boolean {
  return HEIC_TYPES.includes(file.type) || /\.heic$|\.heif$/i.test(file.name);
}

export async function decode(file: File): Promise<ImageBitmap> {
  let blob: Blob = file;
  if (isHeic(file)) {
    // libheif WASM is ~1 MB — loaded lazily only when a HEIC file shows up.
    const { heicTo } = await import("./heic.js");
    blob = await heicTo(file);
  }
  if (file.type === "image/svg+xml" || /\.svg$/i.test(file.name)) {
    return decodeSvg(blob);
  }
  return createImageBitmap(blob, { imageOrientation: "from-image" });
}

async function decodeSvg(blob: Blob): Promise<ImageBitmap> {
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    // Rasterize vectors at 2x their intrinsic size (min 1024) so output is crisp.
    const w = Math.max(img.naturalWidth * 2, 1024);
    const scale = w / (img.naturalWidth || 1);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round((img.naturalWidth || 512) * scale);
    canvas.height = Math.round((img.naturalHeight || 512) * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return createImageBitmap(canvas);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export type CropRect = { x: number; y: number; w: number; h: number };

export function draw(
  bmp: ImageBitmap,
  outW: number,
  outH: number,
  target: Target,
  crop?: CropRect,
): HTMLCanvasElement {
  // ICO cannot store anything larger than 256px, so clamp here rather than in
  // each caller — both the batch and crop paths go through draw().
  if (target === "image/x-icon") {
    ({ w: outW, h: outH } = icoFit(outW, outH));
  }
  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d")!;
  if (target === "image/jpeg") {
    // JPEG has no alpha — composite transparent sources onto white.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outW, outH);
  }
  ctx.imageSmoothingQuality = "high";
  if (crop) {
    ctx.drawImage(bmp, crop.x, crop.y, crop.w, crop.h, 0, 0, outW, outH);
  } else {
    ctx.drawImage(bmp, 0, 0, outW, outH);
  }
  return canvas;
}

export async function encode(
  canvas: HTMLCanvasElement,
  target: Target,
  quality: number,
): Promise<Blob> {
  if (target === "image/x-icon") return encodeIco(canvas);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) =>
        b
          ? resolve(b)
          : reject(
              new Error(
                "Encoding failed — format may be unsupported in this browser",
              ),
            ),
      target,
      target === "image/png" ? undefined : quality,
    );
  });
}

// Minimal single-image ICO: 6-byte ICONDIR + 16-byte ICONDIRENTRY + a PNG.
// PNG-inside-ICO is valid and read by every browser and by Windows since Vista,
// which lets us skip writing a BMP/DIB encoder entirely.
// ponytail: one size per file. A real favicon set (16/32/48 in one .ico) means
// concatenating several entries — add that when a favicon-generator page needs
// it, not before.
async function encodeIco(canvas: HTMLCanvasElement): Promise<Blob> {
  const png = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("ICO encoding failed"))),
      "image/png",
    ),
  );
  const data = new Uint8Array(await png.arrayBuffer());
  const header = new Uint8Array(22);
  const view = new DataView(header.buffer);
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type 1 = icon
  view.setUint16(4, 1, true); // one image in this file
  header[6] = canvas.width >= ICO_MAX ? 0 : canvas.width; // 0 encodes 256
  header[7] = canvas.height >= ICO_MAX ? 0 : canvas.height;
  header[8] = 0; // palette entries (0 = no palette)
  header[9] = 0; // reserved
  view.setUint16(10, 1, true); // colour planes
  view.setUint16(12, 32, true); // bits per pixel
  view.setUint32(14, data.length, true); // image byte length
  view.setUint32(18, header.length, true); // offset to image data
  return new Blob([header, data], { type: "image/x-icon" });
}
