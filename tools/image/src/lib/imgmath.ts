// Pure sizing/naming logic — tested in tests/imgmath.test.mjs.

export type Dims = { w: number; h: number };

// Fit source into max box, preserving aspect. Never upscales.
export function fitWithin(src: Dims, maxW: number, maxH: number): Dims {
  if (src.w <= 0 || src.h <= 0) return { w: 0, h: 0 };
  const scale = Math.min(maxW / src.w, maxH / src.h, 1);
  return { w: Math.max(1, Math.round(src.w * scale)), h: Math.max(1, Math.round(src.h * scale)) };
}

// Resolve target dims from user input: either dimension may be blank (auto).
export function resolveResize(src: Dims, wIn: string, hIn: string, lockAspect: boolean): Dims {
  const w = parseInt(wIn, 10);
  const h = parseInt(hIn, 10);
  const hasW = Number.isFinite(w) && w > 0;
  const hasH = Number.isFinite(h) && h > 0;
  if (!hasW && !hasH) return src;
  if (lockAspect || !hasW || !hasH) {
    const scale = hasW ? w / src.w : h / src.h;
    return {
      w: hasW ? w : Math.max(1, Math.round(src.w * scale)),
      h: hasW ? Math.max(1, Math.round(src.h * scale)) : h,
    };
  }
  return { w, h };
}

export function scaleByPercent(src: Dims, percent: number): Dims {
  const s = percent / 100;
  return { w: Math.max(1, Math.round(src.w * s)), h: Math.max(1, Math.round(src.h * s)) };
}

// photo.heic + image/jpeg -> photo.jpg
export function renameForType(name: string, mime: string): string {
  const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[mime] ?? 'bin';
  const base = name.replace(/\.[^.]+$/, '');
  return `${base}.${ext}`;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

// Percentage saved, negative if bigger.
export function savings(before: number, after: number): number {
  if (before <= 0) return 0;
  return Math.round((1 - after / before) * 100);
}
