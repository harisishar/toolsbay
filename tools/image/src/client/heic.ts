// Lazy-loaded HEIC decode chunk (libheif WASM via heic-to).
import { heicTo as convert } from 'heic-to';

export async function heicTo(file: File): Promise<Blob> {
  return convert({ blob: file, type: 'image/png' });
}
