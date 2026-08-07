// Split out of index.tsx so layout.tsx can use it without a circular import.
import { CALC, IMAGE_PAIRS, PDF, QR_TYPES, TOTAL_PAGES } from "./catalogue.ts";

export const SITE = {
  name: "ToolsBay",
  tagline: "Free online tools — no signup, nothing uploaded",
  desc: `${TOTAL_PAGES} free online tools that run in your browser: calculators, image compression, PDF utilities, QR codes and barcodes. No signup, nothing uploaded.`,
};

export const TOOLS = [
  {
    name: "CalcHub",
    url: "https://calc.toolsbay.app",
    host: "calc.toolsbay.app",
    tagline: "Free online calculators",
    desc: `${CALC.length} calculators — finance, health, math, dates and everyday, plus take-home salary after tax for 8 countries and Malaysian EPF/KWSP, SOCSO/EIS and PCB.`,
    accent: "calc",
  },
  {
    name: "ImgSquash",
    url: "https://image.toolsbay.app",
    host: "image.toolsbay.app",
    tagline: "Compress, resize & convert images",
    desc: `Compress, resize, crop and remove backgrounds, plus ${IMAGE_PAIRS.length} format converters across JPG, PNG, WebP, HEIC, AVIF, GIF, BMP and SVG. Photos never leave your device.`,
    accent: "image",
  },
  {
    name: "PaperKit",
    url: "https://pdf.toolsbay.app",
    host: "pdf.toolsbay.app",
    tagline: "Every PDF tool in one kit",
    desc: `${PDF.length} PDF tools — merge, split, compress, sign, redact, organise, OCR and convert to Word, Excel, PowerPoint or Markdown.`,
    accent: "pdf",
  },
  {
    name: "MakeQR",
    url: "https://qr.toolsbay.app",
    host: "qr.toolsbay.app",
    tagline: "QR codes & barcodes",
    desc: `${QR_TYPES.length} QR types — links, WiFi, vCards, SMS and more — plus CODE128, EAN-13, UPC-A and CODE39 barcodes. Static codes that never expire.`,
    accent: "qr",
  },
];

export const ACCENT_TEXT: Record<string, string> = {
  calc: "text-calc",
  image: "text-image",
  pdf: "text-pdf",
  qr: "text-qr",
};
export const ACCENT_BG: Record<string, string> = {
  calc: "bg-calc",
  image: "bg-image",
  pdf: "bg-pdf",
  qr: "bg-qr",
};
