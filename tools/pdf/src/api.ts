// Server path for the approved hard conversions (see CLAUDE.md exception):
// - /api/html-to-pdf     -> Browser Rendering binding
// - /api/convert/:slug   -> Cloudflare Container (LibreOffice + ocrmypdf + qpdf)
// Files are streamed through and never stored.
import { Hono } from "hono";
import puppeteer from "@cloudflare/puppeteer";
import { Container, getContainer } from "@cloudflare/containers";

export class Converter extends Container<Env> {
  defaultPort = 8080;
  sleepAfter = "10m";
}

export type Env = {
  BROWSER?: Fetcher;
  CONVERTER?: DurableObjectNamespace<Converter>;
};

const MAX_BYTES = 50 * 1024 * 1024;

const CONVERT_SLUGS = new Set([
  "pdf-to-word",
  "pdf-to-excel",
  "pdf-to-powerpoint",
  "word-to-pdf",
  "excel-to-pdf",
  "powerpoint-to-pdf",
  "ocr-pdf",
  "pdf-to-pdfa",
  "repair-pdf",
]);

const PDF_INPUT = new Set([
  "pdf-to-word",
  "pdf-to-excel",
  "pdf-to-powerpoint",
  "ocr-pdf",
  "pdf-to-pdfa",
  "repair-pdf",
]);

function blockedUrl(raw: string): string | null {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return "Invalid URL.";
  }
  if (u.protocol !== "http:" && u.protocol !== "https:")
    return "Only http(s) URLs are supported.";
  const host = u.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    /^\d+\.\d+\.\d+\.\d+$/.test(host) || // IP literals: refuse outright, avoids private-range games
    host.includes("[") // IPv6 literal
  ) {
    return "This host cannot be converted.";
  }
  return null;
}

export const api = new Hono<{ Bindings: Env }>();

api.post("/api/html-to-pdf", async (c) => {
  if (!c.env.BROWSER)
    return c.text("HTML to PDF is not available in this environment yet.", 503);
  let url = "";
  try {
    ({ url } = await c.req.json<{ url: string }>());
  } catch {
    return c.text('Send JSON: {"url": "https://…"}', 400);
  }
  const blocked = blockedUrl(url);
  if (blocked) return c.text(blocked, 400);

  const browser = await puppeteer.launch(c.env.BROWSER);
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30_000 });
    const pdf = await page.pdf({ format: "a4", printBackground: true });
    return c.body(pdf as unknown as ArrayBuffer, 200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="webpage.pdf"',
    });
  } catch {
    return c.text(
      "Could not render that page — it may be slow, blocked, or offline.",
      422,
    );
  } finally {
    await browser.close();
  }
});

api.post("/api/convert/:slug", async (c) => {
  const slug = c.req.param("slug");
  if (!CONVERT_SLUGS.has(slug)) return c.text("Unknown conversion.", 404);
  if (!c.env.CONVERTER)
    return c.text(
      "This conversion engine is not deployed yet — coming very soon.",
      503,
    );

  const length = Number(c.req.header("content-length") ?? 0);
  if (!length) return c.text("Send the file as the raw request body.", 400);
  if (length > MAX_BYTES) return c.text("File too large — 50 MB max.", 413);

  const body = new Uint8Array(await c.req.arrayBuffer());
  if (PDF_INPUT.has(slug)) {
    const head = new TextDecoder().decode(body.slice(0, 5));
    if (!head.startsWith("%PDF")) return c.text("That file is not a PDF.", 415);
  }

  const container = getContainer(c.env.CONVERTER);
  const res = await container.fetch("http://container/convert", {
    method: "POST",
    headers: {
      "x-task": slug,
      "x-filename": c.req.header("x-filename") ?? "input",
      "content-type": "application/octet-stream",
    },
    body,
  });
  if (!res.ok) return c.text(await res.text(), res.status as 400);
  return new Response(res.body, {
    headers: {
      "Content-Type":
        res.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": "no-store",
    },
  });
});
