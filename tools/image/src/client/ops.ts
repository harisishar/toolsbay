// Image decode/transform/encode — all in-browser via Canvas.

export type Target = 'image/jpeg' | 'image/png' | 'image/webp';

const HEIC_TYPES = ['image/heic', 'image/heif'];

export function isHeic(file: File): boolean {
  return HEIC_TYPES.includes(file.type) || /\.heic$|\.heif$/i.test(file.name);
}

export async function decode(file: File): Promise<ImageBitmap> {
  let blob: Blob = file;
  if (isHeic(file)) {
    // libheif WASM is ~1 MB — loaded lazily only when a HEIC file shows up.
    const { heicTo } = await import('./heic.js');
    blob = await heicTo(file);
  }
  if (file.type === 'image/svg+xml' || /\.svg$/i.test(file.name)) {
    return decodeSvg(blob);
  }
  return createImageBitmap(blob, { imageOrientation: 'from-image' });
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
    const canvas = document.createElement('canvas');
    canvas.width = Math.round((img.naturalWidth || 512) * scale);
    canvas.height = Math.round((img.naturalHeight || 512) * scale);
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
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
  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d')!;
  if (target === 'image/jpeg') {
    // JPEG has no alpha — composite transparent sources onto white.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outW, outH);
  }
  ctx.imageSmoothingQuality = 'high';
  if (crop) {
    ctx.drawImage(bmp, crop.x, crop.y, crop.w, crop.h, 0, 0, outW, outH);
  } else {
    ctx.drawImage(bmp, 0, 0, outW, outH);
  }
  return canvas;
}

export function encode(canvas: HTMLCanvasElement, target: Target, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Encoding failed — format may be unsupported in this browser'))),
      target,
      target === 'image/png' ? undefined : quality,
    );
  });
}
