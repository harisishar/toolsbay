// PDF engine — lazy-loaded chunk bundling @cantoo/pdf-lib (pdf-lib + encryption)
// and pdfjs-dist. Everything runs client-side.
import {
  PDFDocument,
  degrees,
  rgb,
  StandardFonts,
  type PDFPage,
  type PDFImage,
} from '@cantoo/pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import { zipSync } from 'fflate';
import type { PDFDocumentProxy } from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = '/vendor/pdf.worker.min.mjs';

export { PDFDocument, degrees, rgb, StandardFonts, pdfjs };
export type { PDFPage, PDFImage, PDFDocumentProxy };

export async function loadLib(file: File | Uint8Array, password?: string): Promise<PDFDocument> {
  const bytes = file instanceof File ? new Uint8Array(await file.arrayBuffer()) : file;
  return PDFDocument.load(bytes, password ? { password } : undefined);
}

export async function loadView(file: File | Uint8Array, password?: string): Promise<PDFDocumentProxy> {
  const bytes = file instanceof File ? new Uint8Array(await file.arrayBuffer()) : file;
  return pdfjs.getDocument({ data: bytes, password }).promise;
}

export async function renderPage(
  view: PDFDocumentProxy,
  pageNum: number,
  scale: number,
  onCanvas?: HTMLCanvasElement,
): Promise<HTMLCanvasElement> {
  const page = await view.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const canvas = onCanvas ?? document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext('2d')!;
  // intent 'print' renders without requestAnimationFrame scheduling, so batch
  // conversions keep running while the tab is in the background.
  await page.render({ canvasContext: ctx, viewport, intent: 'print' }).promise;
  return canvas;
}

export function downloadBlob(data: BlobPart, name: string, mime = 'application/pdf') {
  const url = URL.createObjectURL(new Blob([data], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export async function saveAndDownload(doc: PDFDocument, name: string) {
  const bytes = await doc.save();
  downloadBlob(bytes as unknown as BlobPart, name);
}

export function zipAndDownload(entries: Record<string, Uint8Array>, zipName: string) {
  const zip = zipSync(entries, { level: 0 });
  downloadBlob(zip as unknown as BlobPart, zipName, 'application/zip');
}

export function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), 'image/jpeg', quality),
  );
}

export function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), 'image/png'),
  );
}

// Embed any browser-supported image file (jpg/png/webp/etc.) into a pdf-lib doc.
// Non-JPG/PNG inputs are transcoded through Canvas first.
export async function embedAnyImage(doc: PDFDocument, file: File): Promise<PDFImage> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (file.type === 'image/jpeg') return doc.embedJpg(bytes);
  if (file.type === 'image/png') return doc.embedPng(bytes);
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const canvas = document.createElement('canvas');
  canvas.width = bmp.width;
  canvas.height = bmp.height;
  canvas.getContext('2d')!.drawImage(bmp, 0, 0);
  bmp.close();
  const blob = await canvasToPng(canvas);
  return doc.embedPng(new Uint8Array(await blob.arrayBuffer()));
}

// Extract text grouped into lines per page. Returns array of pages, each an
// array of {text, height, y} line objects (reading order, top to bottom).
export async function extractLines(view: PDFDocumentProxy, pageNum: number) {
  const page = await view.getPage(pageNum);
  const content = await page.getTextContent();
  type Line = { text: string; height: number; y: number };
  const lines: Line[] = [];
  let cur: Line | null = null;
  for (const item of content.items) {
    if (!('str' in item)) continue;
    const y = item.transform[5] as number;
    const h = Math.abs(item.transform[3] as number) || Math.abs(item.transform[0] as number);
    if (cur && Math.abs(cur.y - y) < 2) {
      cur.text += item.str;
      cur.height = Math.max(cur.height, h);
    } else {
      if (cur && cur.text.trim()) lines.push(cur);
      cur = { text: item.str, height: h, y };
    }
    if ('hasEOL' in item && item.hasEOL && cur) {
      if (cur.text.trim()) lines.push(cur);
      cur = null;
    }
  }
  if (cur && cur.text.trim()) lines.push(cur);
  return lines;
}
