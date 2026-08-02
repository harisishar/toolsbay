import type { Comparison, Faq } from "./seo.js";

export type Section = { h: string; body: string[] };

export type Tool = {
  slug: string;
  kind: string; // Alpine component / body template key
  preset?: string; // passed to the Alpine factory — lets one component serve several URLs
  label: string;
  category: "Organize" | "Convert" | "Edit & Sign" | "Security" | "More";
  server?: boolean; // processed by the approved server path (Phase 4)
  title: string;
  desc: string;
  h1: string;
  intro: string; // the short line under the h1, above the widget
  lead: string; // 120-190 words: the citable block opening the article
  sections: Section[];
  faq: Faq[];
};

const privacyFaq: Faq = {
  q: "Are my PDF files uploaded to a server?",
  a: "No — this tool runs entirely in your browser using WebAssembly and JavaScript. Your files never leave your device, which also means there are no size limits and no queues.",
};

const serverFaq: Faq = {
  q: "How are my files handled?",
  a: "This conversion needs a rendering engine that browsers do not have, so the file is processed on our server: it is streamed through the converter and the result is streamed back — nothing is stored, and files are discarded the moment the response is sent.",
};

// Sitemap lastmod for the tool pages. These are written in one pass, so one
// date is honest for all of them — bump it when the copy below actually changes.
export const CONTENT_UPDATED = "2026-08-01";

// Routing, labels and SEO strings. The article body for each of these lives in
// TOOL_DEPTH below and is merged in at the bottom of this file, so a tool cannot
// ship without one — the test suite asserts every slug has an entry.
const TOOL_BASE: Omit<Tool, "lead" | "sections">[] = [
  {
    slug: "merge-pdf",
    kind: "merge",
    label: "Merge PDF",
    category: "Organize",
    title: "Merge PDF Files Online Free — Combine PDFs in Any Order",
    desc: "Combine multiple PDFs into one file in the order you choose. Free, no size limits, no watermark — merging happens in your browser, files are never uploaded.",
    h1: "Merge PDF Files",
    intro:
      "Combine two or more PDFs into a single document. Drop your files, drag them into order, and download the merged result — all locally in your browser.",
    faq: [
      privacyFaq,
      {
        q: "Can I change the order of the merged PDFs?",
        a: "Yes — after adding files, use the arrows to reorder them. Pages are merged in exactly the order shown in the list.",
      },
      {
        q: "Is there a limit on how many PDFs I can merge?",
        a: "No fixed limit. Because merging runs on your own device, capacity depends only on your browser memory — dozens of files and hundreds of pages are fine.",
      },
    ],
  },
  {
    slug: "split-pdf",
    kind: "split",
    label: "Split PDF",
    category: "Organize",
    title: "Split PDF Online Free — Extract Pages or Ranges",
    desc: "Split a PDF into separate files by page ranges, or extract every page individually. Free, private, in-browser — no upload.",
    h1: "Split PDF",
    intro:
      "Separate one PDF into several. Give page ranges like “1-3, 7, 10-12” — each comma group becomes its own file — or split every page into its own PDF.",
    faq: [
      privacyFaq,
      {
        q: "How do page ranges work?",
        a: "Each comma-separated group becomes one output file. “1-3, 7” produces two PDFs: one with pages 1–3 and one with page 7. Multiple outputs download together as a ZIP.",
      },
    ],
  },
  {
    slug: "rotate-pdf",
    kind: "rotate",
    label: "Rotate PDF",
    category: "Organize",
    title: "Rotate PDF Online Free — All Pages or a Range",
    desc: "Rotate PDF pages 90°, 180° or 270°, for the whole document or specific pages. Free and private — rotation happens in your browser.",
    h1: "Rotate PDF",
    intro:
      "Fix sideways or upside-down pages. Rotate the whole document or only the pages you specify, then download — the rotation is saved into the file permanently.",
    faq: [
      privacyFaq,
      {
        q: "Will the rotation stay when I open the PDF elsewhere?",
        a: "Yes. Unlike rotating the view in a PDF reader, this tool writes the rotation into the page objects, so every viewer and printer shows the corrected orientation.",
      },
    ],
  },
  {
    slug: "organize-pdf",
    kind: "organize",
    label: "Organize PDF",
    category: "Organize",
    title: "Organize PDF Pages Online Free — Reorder, Rotate, Delete",
    desc: "Reorder PDF pages visually with thumbnails, rotate or delete individual pages, and save. Free, private, no upload.",
    h1: "Organize PDF Pages",
    intro:
      "See every page as a thumbnail, then move, rotate or delete pages until the document is exactly how you want it. Nothing leaves your browser.",
    faq: [
      privacyFaq,
      {
        q: "Can I add pages from another PDF?",
        a: "To combine documents, run Merge PDF first, then come back here to reorder and prune pages of the merged file.",
      },
    ],
  },
  {
    slug: "add-page-numbers",
    kind: "pagenum",
    label: "Page Numbers",
    category: "Edit & Sign",
    title: "Add Page Numbers to PDF Online Free",
    desc: "Stamp page numbers onto a PDF — choose position, starting number and size. Free, in-browser, no upload, no watermark.",
    h1: "Add Page Numbers to PDF",
    intro:
      "Number every page of your PDF. Pick a corner or centre position, a starting number and a font size, then download the numbered document.",
    faq: [
      privacyFaq,
      {
        q: "Can numbering start from a page other than 1?",
        a: "Yes — set any starting number. Useful when the document continues from another file or has an unnumbered cover page.",
      },
    ],
  },
  {
    slug: "watermark-pdf",
    kind: "watermark",
    label: "Watermark",
    category: "Edit & Sign",
    title: "Watermark PDF Online Free — Text or Image Stamp",
    desc: "Stamp a text or image watermark over every PDF page. Control opacity, rotation, colour and tiling. Free and private — no upload.",
    h1: "Watermark PDF",
    intro:
      "Protect or brand your document with a diagonal text stamp like “CONFIDENTIAL” or your logo image, applied to every page at the opacity you choose.",
    faq: [
      privacyFaq,
      {
        q: "Can the watermark be removed later?",
        a: "The watermark is drawn into the page content, so casual removal is not possible. It is not, however, a substitute for redaction — use the Redact tool to permanently remove sensitive content.",
      },
    ],
  },
  {
    slug: "crop-pdf",
    kind: "crop",
    label: "Crop PDF",
    category: "Edit & Sign",
    title: "Crop PDF Online Free — Trim Margins Visually",
    desc: "Crop PDF margins by dragging a box on a live preview, applied to one page or all pages. Free, private, in-browser.",
    h1: "Crop PDF",
    intro:
      "Drag a crop box on the first-page preview and apply it to the whole document — ideal for trimming scanner margins or focusing slides.",
    faq: [
      privacyFaq,
      {
        q: "Does cropping delete the content outside the box?",
        a: "Cropping sets the page’s visible area (CropBox). Content outside is hidden in viewers and printouts but still exists in the file — use Redact PDF if you need content permanently removed.",
      },
    ],
  },
  {
    slug: "jpg-to-pdf",
    kind: "img2pdf",
    label: "JPG to PDF",
    category: "Convert",
    title: "JPG to PDF Converter Free — Images to One PDF",
    desc: "Convert JPG, PNG and other images to a single PDF. Reorder pages, choose A4/Letter or auto size. Free, private, no upload.",
    h1: "JPG to PDF",
    intro:
      "Turn photos and scans into a tidy PDF. Drop images in any browser-supported format, put them in order, pick a page size, and download.",
    faq: [
      privacyFaq,
      {
        q: "Can I mix JPG and PNG images in one PDF?",
        a: "Yes — any mix of JPG, PNG, WebP and other browser-supported formats can go into the same PDF, one image per page.",
      },
    ],
  },
  {
    slug: "pdf-to-jpg",
    kind: "pdf2jpg",
    label: "PDF to JPG",
    category: "Convert",
    title: "PDF to JPG Converter Free — Pages to Images",
    desc: "Convert PDF pages to high-resolution JPG or PNG images, or extract the images embedded in the PDF. Free, private, in-browser.",
    h1: "PDF to JPG",
    intro:
      "Export each PDF page as a sharp JPG or PNG at up to 3× resolution, or pull out the original images embedded inside the file. Multiple results download as a ZIP.",
    faq: [
      privacyFaq,
      {
        q: "What resolution are the exported images?",
        a: "The scale option multiplies the page’s natural size: 2× turns an A4 page into roughly 1190×1684 px, 3× into 1785×2526 px. Higher scales mean sharper but larger files.",
      },
    ],
  },
  {
    slug: "compress-pdf",
    kind: "compress",
    label: "Compress PDF",
    category: "Convert",
    title: "Compress PDF Online Free — Reduce File Size",
    desc: "Shrink PDF file size in your browser with adjustable quality. Great for scanned documents and email limits. Free, private, no upload.",
    h1: "Compress PDF",
    intro:
      "Reduce a PDF to a fraction of its size by re-encoding pages at the quality you choose. Best on scanned and image-heavy documents — a 20 MB scan often lands under 3 MB.",
    faq: [
      privacyFaq,
      {
        q: "Will text stay selectable after compression?",
        a: "No — this compressor re-renders pages as images, which is what makes big savings possible in the browser. Text remains perfectly readable but is no longer selectable. For text-heavy PDFs that must stay selectable, try lowering the export quality in the app that created the PDF.",
      },
      {
        q: "How much smaller will my PDF get?",
        a: "Scanned documents typically shrink 70–90% at default settings. PDFs that are already highly optimised may not shrink — the tool tells you instead of silently inflating the file.",
      },
    ],
  },
  {
    slug: "edit-pdf",
    kind: "edit",
    label: "Edit PDF",
    category: "Edit & Sign",
    title: "Edit PDF Online Free — Add Text, Shapes & Drawings",
    desc: "Annotate a PDF in your browser: add text, freehand drawing, rectangles, ellipses and images on any page, then save. Free and private.",
    h1: "Edit PDF",
    intro:
      "Add text boxes, freehand notes, shapes and image stamps directly onto PDF pages. Flip through pages, place your edits, and save a new PDF — locally.",
    faq: [
      privacyFaq,
      {
        q: "Can I edit the existing text of the PDF?",
        a: "This editor overlays new content on top of the page — it does not rewrite the original text layer. To change underlying text, convert the PDF to Word, edit it there, and convert back.",
      },
    ],
  },
  {
    slug: "sign-pdf",
    kind: "sign",
    label: "Sign PDF",
    category: "Edit & Sign",
    title: "Sign PDF Online Free — Draw, Type or Upload a Signature",
    desc: "Sign a PDF electronically: draw your signature, type it in a script font, or upload an image, then place it on any page. Free, private, no upload.",
    h1: "Sign PDF",
    intro:
      "Create your signature by drawing with mouse or finger, typing your name in a handwriting font, or uploading an image — then click where it should go and download the signed PDF.",
    faq: [
      privacyFaq,
      {
        q: "Is this a legally binding electronic signature?",
        a: "It produces a simple electronic signature (an image of your signature in the document), which many jurisdictions accept for everyday agreements. It is not a cryptographic digital signature with a certificate — regulated documents may require one from a qualified provider.",
      },
      {
        q: "Can I sign in multiple places?",
        a: "Yes — click once per spot, across any pages. Every placement uses the signature you created.",
      },
    ],
  },
  {
    slug: "redact-pdf",
    kind: "redact",
    label: "Redact PDF",
    category: "Security",
    title: "Redact PDF Online Free — Permanently Remove Content",
    desc: "Black out sensitive text and images so they are truly removed, not just covered. Redacted pages are rasterized for real removal. Free, private, in-browser.",
    h1: "Redact PDF",
    intro:
      "Draw black boxes over anything sensitive. On save, affected pages are re-rendered as images with the boxed content gone — unlike a drawn rectangle, the text underneath is not recoverable.",
    faq: [
      privacyFaq,
      {
        q: "Is the redacted content really removed?",
        a: "Yes. Pages containing redactions are converted to flat images with the boxed areas blacked out, so the underlying text no longer exists in the file. The trade-off: those pages lose selectable text.",
      },
    ],
  },
  {
    slug: "pdf-forms",
    kind: "forms",
    label: "Fill Forms",
    category: "Edit & Sign",
    title: "Fill PDF Forms Online Free — Detect & Complete Fields",
    desc: "Detect AcroForm fields in a PDF automatically, fill text boxes, checkboxes and dropdowns, optionally flatten, and download. Free and private.",
    h1: "Fill PDF Forms",
    intro:
      "Drop a fillable PDF and its fields appear as a simple form: type your answers, tick the boxes, choose dropdown options, and save — with an option to flatten so the answers can no longer be edited.",
    faq: [
      privacyFaq,
      {
        q: "What if my PDF has no fillable fields?",
        a: "Scanned or flat forms have no field data to detect. Use the Edit PDF tool instead and place text exactly where each answer belongs.",
      },
    ],
  },
  {
    slug: "protect-pdf",
    kind: "protect",
    label: "Protect PDF",
    category: "Security",
    title: "Password Protect PDF Online Free — AES Encryption",
    desc: "Encrypt a PDF with a password and set printing/copying permissions. Encryption happens in your browser — the password never leaves your device.",
    h1: "Protect PDF with a Password",
    intro:
      "Add a password so the PDF cannot be opened without it, and optionally restrict printing and copying. Both the file and your password stay on your device.",
    faq: [
      privacyFaq,
      {
        q: "What encryption is used?",
        a: "Files are encrypted with AES — the standard PDF encryption every modern reader (Adobe, Preview, browsers) can open given the correct password.",
      },
      {
        q: "What if I forget the password?",
        a: "There is no backdoor — without the password the file cannot be decrypted. Keep an unprotected copy somewhere safe.",
      },
    ],
  },
  {
    slug: "unlock-pdf",
    kind: "unlock",
    label: "Unlock PDF",
    category: "Security",
    title: "Unlock PDF Online Free — Remove Password You Know",
    desc: "Remove a PDF password so the file opens freely. Enter the current password once and download an unencrypted copy. Free, private, in-browser.",
    h1: "Unlock PDF",
    intro:
      "Tired of typing the password every time? Enter it once and download a copy without encryption. The file and password never leave your browser.",
    faq: [
      privacyFaq,
      {
        q: "Can this crack a password I do not know?",
        a: "No. It removes protection only when you can supply the correct password — it is a convenience tool, not a password cracker.",
      },
    ],
  },
  {
    slug: "compare-pdf",
    kind: "compare",
    label: "Compare PDF",
    category: "More",
    title: "Compare PDF Files Online Free — Side by Side with Diff",
    desc: "View two PDF versions side by side and highlight pixel differences per page. Free, private, in-browser comparison.",
    h1: "Compare PDFs",
    intro:
      "Load two versions of a document, flip through pages side by side, and toggle a difference overlay that highlights changed areas in red.",
    faq: [
      privacyFaq,
      {
        q: "How does the difference highlighting work?",
        a: "Both pages are rendered at the same scale and compared pixel by pixel; areas that differ are marked red and a change percentage is shown. It catches layout, image and text changes alike.",
      },
    ],
  },
  {
    slug: "pdf-to-markdown",
    kind: "totext",
    preset: "md",
    label: "PDF to Markdown",
    category: "Convert",
    title: "PDF to Markdown / Text Converter Free — In Your Browser",
    desc: "Extract PDF text as clean plain text or Markdown with heading detection and bullets. Free, private, no upload.",
    h1: "PDF to Markdown",
    intro:
      "Pull the text out of a PDF as plain text or Markdown. Larger headings become #/## headings and bullet glyphs become list items — handy for notes, LLM prompts and docs.",
    faq: [
      privacyFaq,
      {
        q: "Does it work on scanned PDFs?",
        a: "Only PDFs with a real text layer. Scans are images — run OCR PDF first to add a text layer, then convert to Markdown.",
      },
    ],
  },
  {
    slug: "scan-to-pdf",
    kind: "scan",
    label: "Scan to PDF",
    category: "More",
    title: "Scan to PDF Online Free — Camera to Document",
    desc: "Use your phone or laptop camera to capture pages and combine them into a PDF. Free, private — photos never leave your device.",
    h1: "Scan to PDF",
    intro:
      "Open this page on your phone, point the camera at each page, capture, and download everything as one PDF. Captures stay on your device.",
    faq: [
      privacyFaq,
      {
        q: "How do I get the best scan quality?",
        a: "Use even lighting without shadows, fill the frame with the page, and hold steady for a beat before capturing. The rear camera at full resolution is used automatically when available.",
      },
    ],
  },
  // ---------- server-path tools (approved exception; engine ships in Phase 4) ----------
  {
    slug: "pdf-to-word",
    kind: "api:docx",
    label: "PDF to Word",
    category: "Convert",
    server: true,
    title: "PDF to Word Converter Free — Editable DOCX",
    desc: "Convert PDF to editable Word (DOCX) documents with layout preserved. Free conversion, files streamed and never stored.",
    h1: "PDF to Word",
    intro:
      "Turn a PDF into an editable Word document. Conversion uses a full document engine on our server: your file is streamed through and never stored.",
    faq: [
      serverFaq,
      {
        q: "How accurate is the conversion?",
        a: "Text, fonts, tables and images convert well for digitally-created PDFs. Heavily designed layouts may need touch-ups. Scanned PDFs need OCR PDF first, since they contain no text.",
      },
    ],
  },
  {
    slug: "pdf-to-excel",
    kind: "api:xlsx",
    label: "PDF to Excel",
    category: "Convert",
    server: true,
    title: "PDF to Excel Converter Free — Extract Tables to XLSX",
    desc: "Pull tables from PDF into editable Excel spreadsheets. Free conversion, files streamed and never stored.",
    h1: "PDF to Excel",
    intro:
      "Extract tabular data from a PDF into an XLSX spreadsheet you can actually work with — no retyping.",
    faq: [serverFaq],
  },
  {
    slug: "pdf-to-powerpoint",
    kind: "api:pptx",
    label: "PDF to PowerPoint",
    category: "Convert",
    server: true,
    title: "PDF to PowerPoint Converter Free — Editable PPTX",
    desc: "Convert PDF pages into editable PowerPoint slides. Free conversion, files streamed and never stored.",
    h1: "PDF to PowerPoint",
    intro:
      "Turn each PDF page into a PowerPoint slide you can edit and present.",
    faq: [serverFaq],
  },
  {
    slug: "word-to-pdf",
    kind: "api:pdf:doc",
    label: "Word to PDF",
    category: "Convert",
    server: true,
    title: "Word to PDF Converter Free — DOC & DOCX",
    desc: "Convert Word documents to PDF with fonts and layout intact. Free, streamed, never stored.",
    h1: "Word to PDF",
    intro:
      "Make your DOC or DOCX universally readable: converted to PDF by a real document engine so fonts, margins and page breaks hold.",
    faq: [serverFaq],
  },
  {
    slug: "excel-to-pdf",
    kind: "api:pdf:xls",
    label: "Excel to PDF",
    category: "Convert",
    server: true,
    title: "Excel to PDF Converter Free — XLS & XLSX",
    desc: "Convert Excel spreadsheets to easy-to-read PDFs. Free, streamed, never stored.",
    h1: "Excel to PDF",
    intro:
      "Share spreadsheets that look the same everywhere — converted to PDF page by page.",
    faq: [serverFaq],
  },
  {
    slug: "powerpoint-to-pdf",
    kind: "api:pdf:ppt",
    label: "PowerPoint to PDF",
    category: "Convert",
    server: true,
    title: "PowerPoint to PDF Converter Free — PPT & PPTX",
    desc: "Convert PowerPoint slideshows to PDF for easy sharing. Free, streamed, never stored.",
    h1: "PowerPoint to PDF",
    intro:
      "Turn slides into a PDF anyone can open — one slide per page, formatting intact.",
    faq: [serverFaq],
  },
  {
    slug: "ocr-pdf",
    kind: "api:ocr",
    label: "OCR PDF",
    category: "More",
    server: true,
    title: "OCR PDF Online Free — Make Scans Searchable",
    desc: "Add a searchable, selectable text layer to scanned PDFs with OCR. Free, streamed, never stored.",
    h1: "OCR PDF",
    intro:
      "Turn scanned pages into searchable, copyable documents. OCR runs on our server engine and the result keeps the original scan image with an invisible text layer.",
    faq: [
      serverFaq,
      {
        q: "Which languages are supported?",
        a: "English works out of the box; the engine also handles most Latin-script languages. Tell us if you need others — additional language packs can be enabled.",
      },
    ],
  },
  {
    slug: "pdf-to-pdfa",
    kind: "api:pdfa",
    label: "PDF to PDF/A",
    category: "More",
    server: true,
    title: "Convert PDF to PDF/A Free — ISO Archival Format",
    desc: "Convert PDFs to ISO-standardized PDF/A for long-term archiving. Free, streamed, never stored.",
    h1: "PDF to PDF/A",
    intro:
      "PDF/A embeds fonts and colour profiles so the document renders identically decades from now — required by many courts, registries and archives.",
    faq: [serverFaq],
  },
  {
    slug: "repair-pdf",
    kind: "api:repair",
    label: "Repair PDF",
    category: "More",
    server: true,
    title: "Repair PDF Online Free — Recover Corrupt Files",
    desc: "Attempt to repair damaged or corrupt PDFs and recover their content. Free, streamed, never stored.",
    h1: "Repair PDF",
    intro:
      "A damaged PDF that refuses to open can often be rebuilt: the repair engine re-parses what remains and writes a fresh, well-formed file.",
    faq: [
      serverFaq,
      {
        q: "Can every corrupt PDF be repaired?",
        a: "No — success depends on how much of the internal structure survives. Truncated downloads and broken cross-reference tables usually recover well; heavily overwritten files may not.",
      },
    ],
  },
  {
    slug: "html-to-pdf",
    kind: "html2pdf",
    label: "HTML to PDF",
    category: "Convert",
    server: true,
    title: "HTML to PDF Converter Free — Webpage URL to PDF",
    desc: "Convert any public webpage to a PDF by pasting its URL. Rendered in a real browser engine for accurate results. Free.",
    h1: "HTML to PDF",
    intro:
      "Paste a URL and get the page as a PDF, rendered by a real headless browser — styles, fonts and images included.",
    faq: [
      {
        // Not the shared serverFaq: this tool takes a URL, not a file, so the
        // "your file is streamed through" wording would describe the wrong thing.
        q: "How is my URL handled?",
        a: "Browsers cannot render another site and capture it as a PDF, so this one runs on our server: the URL you paste is sent to a headless browser, the rendered PDF is streamed straight back to you, and neither the URL nor the PDF is stored afterwards.",
      },
      {
        q: "Can it convert pages behind a login?",
        a: "No — the converter sees the page as a logged-out visitor. Save such pages from your own browser with Print → Save as PDF instead.",
      },
    ],
  },
  // --- Added from keyword research (task/keywords/pdf.md) ---
  // Each reuses a shipped engine; only content and a preset are new.
  {
    slug: "pdf-to-png",
    kind: "pdf2jpg",
    preset: "png",
    label: "PDF to PNG",
    category: "Convert",
    title: "PDF to PNG Online Free — Lossless Page Images, No Upload",
    desc: "Convert PDF pages to lossless PNG images at up to 3× resolution. Free, no watermark, and the file never leaves your browser.",
    h1: "PDF to PNG",
    intro:
      "Turn each PDF page into a PNG image. PNG is lossless, so text and line art stay crisp with no JPEG smudging around the edges — the right choice for screenshots, diagrams and anything you plan to edit afterwards.",
    faq: [
      privacyFaq,
      {
        q: "Should I choose PNG or JPG?",
        a: "PNG for pages with text, tables, charts or line art — it is lossless, so edges stay sharp. JPG for photo-heavy pages where a much smaller file matters more than perfect edges.",
      },
      {
        q: "What resolution should I use?",
        a: "2× is sharp enough for screens and most documents. Use 3× if you intend to print the image or zoom in on fine print; 1× matches the PDF's own page size and produces the smallest files.",
      },
      {
        q: "Can I convert only some pages?",
        a: "Yes — enter page ranges like “1-4, 9”. Leave the field blank to convert every page. Multiple pages download together as a ZIP.",
      },
    ],
  },
  {
    slug: "png-to-pdf",
    kind: "img2pdf",
    label: "PNG to PDF",
    category: "Convert",
    title: "PNG to PDF Online Free — Combine PNGs, No Upload",
    desc: "Convert PNG images to a PDF, or combine many PNGs into one document. Set page size and margins. Free, private — runs in your browser.",
    h1: "PNG to PDF",
    intro:
      "Turn one PNG into a PDF, or combine a folder of them into a single document in the order you choose. Transparent areas are flattened onto the page background, since PDF pages are opaque.",
    faq: [
      privacyFaq,
      {
        q: "What happens to transparency in my PNG?",
        a: "PDF pages have no alpha channel, so transparent regions are composited onto the page background — white by default. If transparency matters, keep the PNG alongside the PDF.",
      },
      {
        q: "Can I combine several PNGs into one PDF?",
        a: "Yes — drop them all in and drag to reorder. Each image becomes one page, in the order shown.",
      },
      {
        q: "Will the image quality drop?",
        a: "No. PNG data is embedded losslessly, so the PDF holds exactly the pixels you started with.",
      },
    ],
  },
  {
    slug: "pdf-to-text",
    kind: "totext",
    preset: "txt",
    label: "PDF to Text",
    category: "Convert",
    title: "PDF to Text Online Free — Extract Plain Text, No Upload",
    desc: "Extract plain text from a PDF in your browser. Copy it straight out or download a .txt file. Free, no sign-up, nothing uploaded.",
    h1: "PDF to Text",
    intro:
      "Pull the raw text out of a PDF — no formatting, no layout, just the words in reading order. Useful for quoting, search, or pasting a document into a chat assistant without handing the file to anyone.",
    faq: [
      privacyFaq,
      {
        q: "Does this work on scanned PDFs?",
        a: "No. Extraction reads the text layer that a PDF already contains, and a scan is only an image — there is nothing to read. Run it through OCR PDF first, then extract.",
      },
      {
        q: "How is this different from PDF to Markdown?",
        a: "Same extraction, different output. Plain text gives you the words alone; Markdown additionally detects headings and bullets and marks them up, which is usually better for feeding a document into an LLM.",
      },
      {
        q: "Why is the spacing odd in places?",
        a: "PDFs store positioned glyphs rather than paragraphs, so multi-column layouts and tables can interleave when flattened to a single reading order. Simple single-column documents extract cleanly.",
      },
    ],
  },
  {
    slug: "delete-pages-from-pdf",
    kind: "organize",
    label: "Delete PDF Pages",
    category: "Organize",
    title: "Delete Pages from PDF Online Free — No Upload, No Watermark",
    desc: "Remove unwanted pages from a PDF and download the rest as one file. Free, no sign-up — pages are deleted in your browser.",
    h1: "Delete Pages from a PDF",
    intro:
      "Drop in a PDF, deselect the pages you do not want, and download what is left. Handy for stripping cover sheets, blank scans and terms-and-conditions pages before sharing a document.",
    faq: [
      privacyFaq,
      {
        q: "Can I get the deleted pages back?",
        a: "Not from the downloaded file — deletion is permanent in the output. Your original is untouched though, since nothing is modified in place, so just re-drop it to start over.",
      },
      {
        q: "Does deleting pages shrink the file?",
        a: "Usually, but less than you would expect: fonts and images shared across the document are kept. Run the result through Compress PDF if size is what you are after.",
      },
      {
        q: "Can I delete and reorder in one pass?",
        a: "Yes — the same view lets you drag pages into a new order and remove others before you download.",
      },
    ],
  },
  {
    slug: "extract-pages-from-pdf",
    kind: "split",
    label: "Extract PDF Pages",
    category: "Organize",
    title: "Extract Pages from PDF Online Free — Pull Out Any Range",
    desc: "Pull specific pages or ranges out of a PDF into a new file. Free, no watermark, no upload — extraction runs in your browser.",
    h1: "Extract Pages from a PDF",
    intro:
      "Take just the pages you need out of a larger PDF. Give ranges like “1-3, 7, 10-12” and each group becomes its own file — or extract every page separately.",
    faq: [
      privacyFaq,
      {
        q: "How do I extract a single page?",
        a: "Enter just that page number, for example “7”. One range produces one PDF containing only that page.",
      },
      {
        q: "What is the difference between extracting and splitting?",
        a: "They are the same operation viewed from either end. Extracting keeps the pages you name; splitting divides the whole document at the boundaries you give. This page is set up for the first.",
      },
      {
        q: "Do the extracted pages keep links and form fields?",
        a: "Page content, links and annotations come across. Interactive form fields and bookmarks that point at pages you did not extract are dropped, since their targets no longer exist.",
      },
    ],
  },
];

// The article body for each tool page, keyed by slug.
//
// `intro` above stays the short line under the h1 — it has to be scannable
// above the widget. `lead` is the 120-190 word self-contained block that opens
// the article, which is the shape AI answers quote. Both are wanted; they are
// not the same job. scripts/assert-prose.mjs enforces the lead's bounds.
//
// The ten server-path tools carry the same honesty constraint as the rest of
// this file: they may not claim files stay on the device, and they must say
// where the work actually happens. tools/pdf/tests/tools.test.mjs enforces it.
type Depth = { lead: string; sections: Section[]; faq: Faq[] };

const ORGANIZE_DEPTH: Record<string, Depth> = {
  "merge-pdf": {
    lead: "Merging joins two or more PDFs end to end into one document, in the order you arrange them. Every page keeps its own size and orientation, so a portrait report followed by a landscape appendix stays exactly that rather than being squashed to a common shape. The work happens in your browser through pdf-lib: the files are read into memory, the pages are copied into a new document, and the result downloads straight from the tab — nothing is uploaded, there is no size cap and no queue. Text stays selectable and searchable because the pages are copied rather than re-rendered, and the same is true of links and annotations within each file. What does not survive is anything that pointed at the document as a whole: bookmarks, the outline tree and form field names that now collide with a second copy of themselves.",
    sections: [
      {
        h: "What survives the merge and what does not",
        body: [
          "Page content comes across untouched. Because the pages are copied rather than re-rendered, text remains selectable, vector graphics stay sharp at any zoom, and embedded fonts travel with the pages that use them. Internal links keep working as long as both ends of the link are inside the same source file.",
          "Document-level structures are the casualties. Bookmarks and the outline tree describe a document that no longer exists, so they are dropped. Form fields are the subtler problem: field names have to be unique, and merging two copies of the same form produces two fields called the same thing. If the inputs are filled forms, flatten them first so the answers become page content.",
        ],
      },
      {
        h: "Order is the thing people get wrong",
        body: [
          "Files are merged in the order shown, not the order you selected them, and browsers hand over multi-file selections in an order that is not always alphabetical. Dragging the thumbnails into place takes a moment and removes the most common reason a merged document has to be redone.",
          "Where documents have their own numbering — a contract and its schedules, chapters of a report — the merged file will have several page 1s. Adding page numbers afterwards over the top of the merged document is the fix, and it is a separate step precisely because the numbering you want depends on what you merged.",
        ],
      },
      {
        h: "File size after merging",
        body: [
          "The result is roughly the sum of the inputs, sometimes slightly less where the same font is embedded in more than one source and can be shared. It is never dramatically smaller: merging is not compression, and a 20 MB scan joined to a 5 MB report produces about 25 MB.",
          "If the total lands over an email or upload limit, compress afterwards rather than expecting the merge to help. Scanned documents are where compression pays — re-encoding the page images typically takes a large scan down by most of its size, while a text-based PDF has very little to give up.",
        ],
      },
    ],
    faq: [
      {
        q: "Do bookmarks and the table of contents survive?",
        a: "No. Bookmarks describe the structure of a single document, so they cannot be carried into a merged one that has a different structure. Page content, internal links and annotations do come across.",
      },
      {
        q: "Can I merge PDFs of different page sizes?",
        a: "Yes, and each page keeps its own size and orientation. A landscape appendix stays landscape inside an otherwise portrait document — nothing is scaled or rotated to match.",
      },
    ],
  },
  "split-pdf": {
    lead: "Splitting takes one PDF and produces several, either by page ranges you specify or by breaking out every page as its own file. Ranges are written the way you would say them aloud — 1-3, 7, 10-12 — and each comma-separated group becomes one output document, so that example yields three files rather than six. The pages are copied into new documents rather than re-rendered, which means text stays selectable, vector artwork stays sharp and the visual result is identical to the original. Everything runs in your browser: the file is never uploaded, so there is no size limit and no waiting behind other people's jobs. Multiple outputs are bundled into a single ZIP for download. The usual reason to split is that someone needs one section of a long document and should not receive the rest.",
    sections: [
      {
        h: "How to write the ranges",
        body: [
          "A range is a group of pages that will end up in one file. Write single pages as a number, spans with a hyphen, and separate the groups with commas: 1-3, 7, 10-12 produces three documents — one holding pages 1 to 3, one holding page 7, one holding pages 10 to 12.",
          "Page numbers here mean physical positions in the file, counting from 1, which is not always what is printed on the page. A report with unnumbered covers and roman-numeral front matter will have a printed page 1 several positions in. Check against the page thumbnails rather than the printed numbers.",
        ],
      },
      {
        h: "Splitting against extracting",
        body: [
          "The two overlap and the difference is what you get back. Splitting is for dividing a document into several parts you keep — chapters, one file per invoice, a copy per recipient. Extracting is for pulling a few pages out and ignoring the rest.",
          "In practice, if your ranges cover the whole document you are splitting; if they cover a fraction of it you are extracting. Both produce the same kind of output, so the choice is about which mental model matches what you are trying to achieve rather than a technical distinction.",
        ],
      },
      {
        h: "What comes across into each part",
        body: [
          "Each output is a real PDF with the original page content, links and annotations intact. Because pages are copied at the object level, a split file opens and prints identically to the corresponding pages of the original.",
          "Links that pointed to pages now in a different output file cannot resolve and are dropped, as are bookmarks referring to pages outside the range. Form fields spanning the split are the one case worth checking by eye before sending anything on: a field that belonged to a page in another part will not come with it.",
        ],
      },
    ],
    faq: [
      {
        q: "Does splitting reduce the file size?",
        a: "Usually, but not proportionally. Shared resources like embedded fonts are duplicated into each output that needs them, so ten single-page files from a ten-page document typically add up to more than the original.",
      },
      {
        q: "Can I split a password-protected PDF?",
        a: "Remove the password first with the unlock tool, then split the unprotected copy. An encrypted file cannot have its pages read until it is decrypted.",
      },
    ],
  },
  "rotate-pdf": {
    lead: "Rotating fixes pages that open sideways or upside down, usually because a scanner fed them in the wrong orientation or a phone camera recorded a rotation the PDF writer ignored. The change is written into the file itself rather than applied in a viewer, so the page opens correctly everywhere afterwards: in a browser, in Acrobat, on a phone, and — the one that matters most — on a printer. You can turn the whole document at once or name specific pages, which is the common case for a scan where one sheet went through rotated. Rotation is stored as a property of the page rather than by redrawing anything, so nothing is re-encoded and no quality is lost, and the file size barely changes. Everything runs in your browser; the file is never uploaded.",
    sections: [
      {
        h: "Why a viewer rotation does not stick",
        body: [
          "Most PDF readers let you turn the view, and that setting usually lives in the reader rather than the file. Send the document on and the recipient sees it exactly as it was, which is why a page that looks fine on your screen arrives sideways in someone else's inbox.",
          "Writing the rotation into the file changes the page's own orientation property, so every reader honours it. That is what happens here, and it is the difference between a document that looks fixed and one that is fixed.",
        ],
      },
      {
        h: "Rotation costs nothing in quality",
        body: [
          "A PDF page carries a rotation value of 0, 90, 180 or 270 degrees, and changing it tells the renderer how to present the existing content. Nothing is re-drawn, re-compressed or resampled — scanned page images stay bit-for-bit identical, and text stays selectable in the same reading order.",
          "That also means the file size is effectively unchanged and the operation is instant regardless of document length. Arbitrary angles are not possible: PDF only defines quarter turns, and anything else would require re-rendering the page as an image.",
        ],
      },
      {
        h: "Fixing a mixed-orientation scan",
        body: [
          "Batch scanners routinely produce documents where most pages are upright and a handful are not, particularly where landscape tables or a stapled insert went through the feeder differently. Rotating everything would fix those and break the rest.",
          "Name the affected pages instead. Work from the thumbnails, note the positions, and apply the turn only to those — then check the result before sending it, because a page rotated 180 rather than 90 looks obviously wrong on screen and is easy to correct while the file is still open.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I rotate by an angle other than 90 degrees?",
        a: "No. The PDF format stores page rotation in quarter turns only. A five-degree correction on a crooked scan would mean re-rendering the page as an image, which loses selectable text and adds file size.",
      },
      {
        q: "Will rotating affect the text layer?",
        a: "No. Text stays selectable and searchable in the same reading order — only the page's orientation property changes, so nothing about the content is touched.",
      },
    ],
  },
  "organize-pdf": {
    lead: "Organizing gives you every page as a thumbnail so you can rearrange the document by sight rather than by page number. Drag pages into a new order, rotate the ones that came through sideways, delete what should not be there, and download the result as a new PDF. It is the tool to reach for when a document needs several different changes at once — the alternative is running a scan through delete, then rotate, then reorder as three separate passes, re-downloading between each. Everything happens in your browser: the file is read into memory, the page objects are reassembled in the order you set, and nothing is uploaded at any point. Because pages are moved rather than re-rendered, text stays selectable, image quality is untouched and the file size stays roughly where it started.",
    sections: [
      {
        h: "Working from thumbnails instead of page numbers",
        body: [
          "Page numbers are a poor interface for a document you have not read recently. Thumbnails show you which page is the cover, which is blank, which one came through the scanner sideways, and where a section actually begins — the information you need to make the decision, rather than a number you have to look up first.",
          "This matters most on scans, where the printed numbering rarely matches the physical positions. Working visually removes the off-by-one errors that come from mixing the two.",
        ],
      },
      {
        h: "Several operations in one pass",
        body: [
          "Reordering, rotating and deleting are separate tools elsewhere because each is a clean single job. When a document needs all three — the usual state of a freshly scanned stack — doing them separately means three downloads and three re-uploads of the intermediate file.",
          "Doing them together also means you can see the consequences as you go. Deleting a blank page shifts everything after it; if you had noted page numbers for a later rotation, they are now wrong. Working on the thumbnails keeps the document and your intentions in sync.",
        ],
      },
      {
        h: "What is preserved",
        body: [
          "Page content, embedded images, selectable text and per-page annotations all come across, because the pages themselves are reused rather than regenerated. A rotation applied here is written into the page properties, so it holds in every reader and on paper.",
          "Document-level structure does not survive rearrangement, and could not: bookmarks and an outline tree describe an order that no longer exists. If the document had a table of contents drawn as page content, it is still there and now potentially wrong — worth a check before sending it on.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I add pages from a different PDF here?",
        a: "Not in this tool — it works on one document at a time. Merge the two files first, then organize the combined document, which also lets you interleave the new pages wherever they belong.",
      },
      {
        q: "Does reordering pages hurt quality or size?",
        a: "Neither. Pages are copied as objects rather than re-rendered, so images are untouched, text stays selectable, and the file ends up about the same size minus anything you deleted.",
      },
    ],
  },
  "delete-pages-from-pdf": {
    lead: "Deleting pages produces a copy of your PDF without the pages you deselected — cover sheets, blank versos from a duplex scan, an internal appendix, the boilerplate terms nobody needs. Work from the thumbnails, untick what should go, and download what remains. The pages that stay are copied at the object level rather than re-rendered, so text stays selectable, images keep their original quality and the visual result is indistinguishable from the source. Nothing is uploaded: the file is read into memory in your browser and the new document is assembled there, which means no size limit and no copy of your document sitting on anyone's server. The important thing to understand is that this removes the pages entirely rather than hiding them — the content is genuinely absent from the file you download.",
    sections: [
      {
        h: "The pages are gone, not hidden",
        body: [
          "A deleted page is not carried along invisibly. The output document is built from the pages you kept, so the removed pages have no representation in it at all — no content stream, no thumbnail, nothing recoverable by a determined recipient.",
          "That distinguishes deletion from the sort of tidying that only changes what a viewer shows. It also makes it a reasonable step before sending a document externally, though for sensitive material inside a page you are keeping, redaction rather than deletion is the tool that applies.",
        ],
      },
      {
        h: "Why the file might not shrink much",
        body: [
          "Removing half the pages rarely halves the file. PDFs share resources: an embedded font is stored once and used by every page that needs it, so dropping pages does not drop the font. Neither does it remove images still referenced by pages you kept.",
          "Where deletion does save meaningfully is on scans, because each page carries its own image and that image is most of its weight. Deleting ten scanned pages from a forty-page scan takes roughly a quarter off. For a text document, expect the saving to be modest and compress separately if size is the goal.",
        ],
      },
      {
        h: "Check the numbering afterwards",
        body: [
          "Deleting shifts every subsequent page up, which is fine for the pages themselves and awkward for anything that referred to them. A printed table of contents, cross-references in the text and page numbers drawn onto the pages all keep pointing at their old positions.",
          "Nothing here can fix that, because those are page content rather than document metadata. If the document relies on internal references, either delete before the numbering is applied, or renumber afterwards with the page-numbers tool.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I recover a page I deleted by mistake?",
        a: "Not from the downloaded file — the page is genuinely absent. Your original is untouched though, since the tool never modifies the file you dropped in; start again from it.",
      },
      {
        q: "Is deleting a page the same as redacting it?",
        a: "No. Deleting removes whole pages; redaction removes selected content from pages you are keeping, by re-rendering the affected page so the underlying text cannot be recovered. Use redaction when the sensitive part is a paragraph rather than a page.",
      },
    ],
  },
  "extract-pages-from-pdf": {
    lead: "Extracting pulls the pages you name out of a larger PDF and leaves the rest behind. Give ranges the way you would say them — 1-3, 7, 10-12 — and each comma-separated group becomes its own file, or ask for every page separately if you want them individually. The pages are copied rather than re-rendered, so the extracted file is visually identical to those pages of the original, with selectable text and unchanged image quality. Everything happens in your browser, so a confidential document is never uploaded and there is no size limit on what you can work with. This is the tool for sending someone exactly the three pages they asked for: the signature page of a contract, one invoice out of a monthly batch, the section of a report that concerns them and nothing else.",
    sections: [
      {
        h: "Extracting against splitting",
        body: [
          "Both take ranges and both produce new PDFs; the difference is intent and therefore coverage. Extraction takes a subset and discards the remainder — you want three pages out of ninety. Splitting divides a document into parts you intend to keep, so the ranges usually account for everything.",
          "The practical consequence is what you do with the output. Extracted pages are usually about to be sent to someone; split parts are usually about to be filed. If your ranges add up to the whole document, splitting is the tool you actually want.",
        ],
      },
      {
        h: "Sending exactly what was asked for",
        body: [
          "Sharing a whole document because someone needs one page of it is a small, routine information leak — salary tables in an appendix, other clients' names in a schedule, internal comments in the notes. Extraction is the least effortful fix available.",
          "Do check what remains on the pages you extract. A page carries whatever is on it, including headers, footers, watermarks and any marginal annotation, and those travel with the extracted copy. If something on a kept page is sensitive, redaction is the next step.",
        ],
      },
      {
        h: "What comes with the pages",
        body: [
          "Content, images, selectable text, per-page annotations and links whose targets are inside the extracted range all come across intact. Fonts used by those pages are embedded into the new document, so it renders correctly on a machine that does not have them installed.",
          "Links pointing at pages you did not extract cannot resolve and are dropped, along with bookmarks whose targets are gone. Interactive form fields belonging to pages outside the range go too. Everything that remains is self-contained, which is the point: the output has to work on its own.",
        ],
      },
    ],
    faq: [
      {
        q: "How do I extract just one page?",
        a: "Enter the single page number as its own range — 7 on its own produces a one-page PDF containing page 7. Several single numbers separated by commas produce one file per page.",
      },
      {
        q: "Does the original file change?",
        a: "No. The tool reads your file and builds new documents from it; the file you dropped in is never modified, and it is never uploaded anywhere either.",
      },
    ],
  },
};

const EDIT_DEPTH: Record<string, Depth> = {
  "add-page-numbers": {
    lead: "Adding page numbers draws a number onto every page at a position, size and starting value you choose. It is genuine page content once applied, not a viewer setting, so the numbers print and survive being sent on. The common reasons to need this are all about documents that were assembled rather than written: a merged bundle with several page 1s, a scanned set that has to be referenced in a meeting, an exhibit bundle where a court or client expects continuous numbering across everything. Starting from something other than 1 matters more than it sounds — a document that follows a covering letter usually needs to continue that letter's numbering rather than restart. The work runs in your browser, so the file is never uploaded and there is no page-count limit. Numbers are drawn in an embedded standard font, so they render identically everywhere.",
    sections: [
      {
        h: "Choosing a position that does not collide",
        body: [
          "Bottom centre is the safe default because it is the area least likely to already contain something. Bottom right suits documents that will be printed single-sided and flicked through; the outer corner is where a thumb lands.",
          "Check the margins before committing, particularly on scans, where the content often sits lower on the page than a born-digital document would. A number placed over existing text is worse than no number at all, and the fix is to move the number rather than the content.",
        ],
      },
      {
        h: "Starting from a number other than one",
        body: [
          "Bundles are the reason this option exists. When a document is one part of a larger set — a schedule to a contract, an exhibit in a bundle, a chapter in a report — the numbering usually has to continue from where the previous part ended rather than restarting.",
          "The other case is front matter. A report with a cover and a contents page conventionally does not number them, so the numbering should begin on the third physical page with the value 1. Both cases are the same operation: decide which physical page carries which printed number, then set the start accordingly.",
        ],
      },
      {
        h: "Numbers are drawn, not linked",
        body: [
          "The number becomes part of the page, which is why it prints and why it cannot be edited afterwards in a reader. It also means the numbering is a snapshot: delete or insert a page later and the drawn numbers no longer match the document.",
          "So number last. If a document still needs pages removed, reordered or merged, do all of that first and add the numbers once the page order is final — otherwise the numbering has to be redone from the original anyway.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I skip numbering the cover page?",
        a: "Yes — set the starting page so numbering begins after the front matter. The pages before it are left clean, and the first numbered page can still carry whichever value you want it to show.",
      },
      {
        q: "Can I remove the numbers later?",
        a: "Not cleanly. Once applied they are page content like any other text. Keep the un-numbered original if you expect the document to change — renumbering from it is far easier than trying to strip numbers out.",
      },
    ],
  },
  "watermark-pdf": {
    lead: "A watermark stamps text or an image across every page — DRAFT, CONFIDENTIAL, a client name, a company logo — at a rotation and opacity you control. It marks a document's status in a way that survives printing, forwarding and screenshotting, which is precisely what a note in the covering email does not do. Two things it is worth being clear about: a watermark is a deterrent and a label, not a security control, and anyone determined to remove one from a PDF can. Its real value is preventing honest mistakes, like a draft being read as final or an internal copy being circulated as though it were approved. The stamp is drawn into the page content in your browser, so nothing is uploaded, and it applies to every page in one pass regardless of document length.",
    sections: [
      {
        h: "Opacity is the whole design decision",
        body: [
          "Too faint and it fails at its job — nobody notices it in print, which is where it matters most. Too strong and the document becomes unpleasant to read, so people work from an un-watermarked copy instead and the control quietly stops existing.",
          "Somewhere around 15–25% opacity is usually the balance: clearly visible as a label, still comfortable to read through. Diagonal placement across the middle is conventional because it is hard to crop out and hard to overlook, and because it avoids the header and footer areas where real content usually sits.",
        ],
      },
      {
        h: "What a watermark actually protects against",
        body: [
          "It is effective against confusion. A draft contract stamped DRAFT does not get signed by mistake. An internal pricing sheet stamped with the recipient's name is less likely to be forwarded casually, because the label makes the leak traceable in the mind of the person considering it.",
          "It is not effective against anyone technically motivated. The stamp is page content, and page content can be edited or the page re-rendered without it. Treat a watermark as a label, and use passwords, redaction or simply not sending the file for anything that genuinely must not be seen.",
        ],
      },
      {
        h: "Text or image",
        body: [
          "Text is right for status — DRAFT, COPY, CONFIDENTIAL, a date, a recipient's name. It stays crisp at any zoom because it is drawn as text, and it costs almost nothing in file size.",
          "An image is right for a logo or a signed-off stamp, and needs a little more care: use a PNG with a transparent background so the page shows through, and remember it is embedded once and referenced by every page, so a large image adds its weight to the file only once rather than per page.",
        ],
      },
    ],
    faq: [
      {
        q: "Can the watermark be removed by the recipient?",
        a: "By someone who wants to, yes. It is page content, and PDF content can be edited. A watermark reliably prevents accidents and misunderstandings; it does not prevent deliberate removal.",
      },
      {
        q: "Will the watermark appear on printouts?",
        a: "Yes. It is drawn into the pages rather than being a viewer overlay, so it prints exactly as it appears on screen — which is usually the whole point of applying one.",
      },
    ],
  },
  "crop-pdf": {
    lead: "Cropping trims the visible area of every page to a box you draw on the first-page preview. The usual reasons are scanner margins — the black borders and skewed edges a flatbed adds — and slide decks exported with generous whitespace that wastes half the screen when read on a phone. Drag the box once and it applies throughout, which works because documents are generally consistent: if page one has a two-centimetre dead margin, so does page forty. What actually changes is the page's crop box, the rectangle that tells a reader which part of the page to display. The content outside it is still in the file, just not shown, so cropping is a presentation change rather than a way of removing anything. It runs in your browser with nothing uploaded, and takes no toll on quality because nothing is re-rendered.",
    sections: [
      {
        h: "Cropping hides, it does not delete",
        body: [
          "A PDF page has both a media box, its full physical extent, and a crop box, the region a reader displays. Cropping sets the crop box, and everything outside it remains in the file — extractable by anyone who resets the boxes or runs the text extraction that ignores them.",
          "That is fine for tidying margins and dangerous for anything else. If the material outside your box is sensitive rather than merely untidy, cropping is the wrong tool: redaction re-renders the page so the content is genuinely gone.",
        ],
      },
      {
        h: "Why one box usually fits the whole document",
        body: [
          "Documents from a single source share a geometry. A scanned book has the same gutter on every page, a slide deck has the same margins on every slide, a printed report has the same header band. So a box drawn once from a representative page is normally correct throughout.",
          "The exceptions are documents that were assembled from several sources — a merged bundle, or a scan where some pages went through rotated. Check a few pages at different depths before committing, because a box that suits page 1 can clip content on page 30 of a mixed document.",
        ],
      },
      {
        h: "What cropping does for file size and reading",
        body: [
          "File size barely moves, because the content is still there. What improves is the reading experience: on a phone or an e-reader, removing dead margin means the text can fill the screen, which is often the difference between a scan being readable on a small display and not.",
          "Printing benefits too, in a different way. A cropped page scaled to fit paper puts more ink on useful content and less on white space, so a book scan with the margins trimmed prints noticeably larger at the same paper size.",
        ],
      },
    ],
    faq: [
      {
        q: "Is cropped-out content really removed from the file?",
        a: "No. Cropping changes which region readers display; the content outside the box stays in the file and can be recovered. Use redaction if the point is to remove something rather than to tidy the layout.",
      },
      {
        q: "Can I crop different pages differently?",
        a: "Not in one pass here — the box applies to the whole document. For a file with genuinely different geometries, split it into consistent parts, crop each, and merge the results back together.",
      },
    ],
  },
  "edit-pdf": {
    lead: "Editing here means adding your own content on top of the page: text boxes, freehand drawing, shapes, highlights and image stamps, placed wherever you need them and saved into a new PDF. It is the tool for filling in a form that has no form fields, annotating a drawing, initialling a document, marking up a proof or covering something with a box. What it deliberately does not do is rewrite the text that is already in the file. That distinction frustrates people until they know the reason, and the reason is structural: a PDF stores text as positioned glyphs with no concept of paragraphs or reflow, so editing a sentence in the middle of one would leave every following word exactly where it was. Everything happens in your browser — the document is never uploaded, whatever it contains.",
    sections: [
      {
        h: "Why existing text cannot simply be edited",
        body: [
          "A word processor stores a document as text with formatting rules and works out the layout when it displays. A PDF stores the finished layout: each glyph with a position, a font and a size, and no record of the paragraph it belonged to.",
          "So changing a word means the words after it do not move, because nothing in the file knows they are part of the same sentence. Tools that advertise true text editing are reconstructing that structure by inference, which works well on simple, born-digital documents and poorly on anything else. Adding a text box over the top is the honest alternative, and for filling forms and correcting a line it is usually what you actually needed.",
        ],
      },
      {
        h: "What you can add",
        body: [
          "Text boxes with a font, size and colour, for filling gaps and annotating. Freehand drawing for initials, ticks, circles and the sort of markup you would do with a pen. Rectangles and highlights for drawing attention or covering something visually. Image stamps for logos, a scanned signature or a photo.",
          "Everything you add is drawn into the page when you save, so it prints and survives forwarding. It also stops being editable at that point — save a copy if the annotations are still in flux, and keep the original untouched so you can start again.",
        ],
      },
      {
        h: "Covering is not removing",
        body: [
          "A filled rectangle over a paragraph hides it on screen and in print, and leaves the text underneath perfectly intact in the file. Copy and paste from the saved PDF and it comes straight back out, which is how confidential information gets published on a regular basis.",
          "If the goal is to conceal rather than to annotate, use the redaction tool: it re-renders the affected pages so the covered content is genuinely absent from the file. The visual result looks the same; only one of them is actually true.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I change the wording of the existing text?",
        a: "No — this adds content on top rather than rewriting what is there. PDFs store text as positioned glyphs with no paragraph structure, so an edited word would leave everything after it in place. Cover the old text and add a text box for corrections.",
      },
      {
        q: "Are my edits permanent once saved?",
        a: "They become page content in the saved file, so they print and travel with the document but can no longer be moved or edited. Keep the original if you may need to revise the annotations later.",
      },
    ],
  },
  "sign-pdf": {
    lead: "Signing places your signature onto the page: draw it with a mouse or finger, type your name in a handwriting font, or upload a photo or scan of a signature you already have. Position it where it belongs, add a date or initials if the document needs them, and download the signed PDF. This produces an electronic signature — a visible mark that, together with the surrounding evidence of who sent what and when, is legally sufficient for most everyday agreements in most jurisdictions. It is not a cryptographic digital signature, which binds an identity certificate to the document and can prove mathematically that nothing changed afterwards. Knowing which one a document needs matters. Everything happens in your browser: the document and the signature image are never uploaded, which is worth something given what people sign.",
    sections: [
      {
        h: "Electronic signature or digital signature",
        body: [
          "An electronic signature is the broad legal category: a mark applied with intent to sign. Under frameworks like the US ESIGN Act and the EU's eIDAS, a typed name, a drawn squiggle or a clicked checkbox can all qualify, and the evidence that matters is usually contextual — the email trail, the timestamps, the parties' conduct.",
          "A digital signature is a specific technology: a certificate issued to an identity, used to sign the document's hash, so any later change invalidates the signature. Some documents demand it — regulated filings, certain government submissions, qualified signatures under eIDAS. This tool does not produce one, and no tool can without an issued certificate.",
        ],
      },
      {
        h: "Which method looks right",
        body: [
          "Drawing is the most natural on a touchscreen and the least so with a mouse, where signatures tend toward an unconvincing wobble. Typing in a handwriting font is consistent and legible, and reads as what it is: a typed signature, which is perfectly acceptable in most contexts.",
          "Uploading a scan gives the closest match to a wet signature. Photograph a signature on white paper in good light, and crop tightly. A PNG with a transparent background sits cleanly over the page; a JPEG brings its white rectangle with it, which shows against any shading or a line it is meant to sit on.",
        ],
      },
      {
        h: "Before you send it back",
        body: [
          "Check the signature is on the right page and not overlapping a line or box it should sit above. Add the date if the document has a date field — an unsigned date field is one of the more common reasons a signed document comes back.",
          "Once saved, the signature is page content and cannot be repositioned, so keep the unsigned original if there is any chance of another round. And if a counterparty asks for a digitally signed document with a verifiable certificate, this is the point to say so rather than sending an image and hoping.",
        ],
      },
    ],
    faq: [
      {
        q: "Is a signature added here legally binding?",
        a: "In most jurisdictions an electronic signature is legally recognised for ordinary agreements — ESIGN in the US and eIDAS in the EU both accept them. Some documents, such as certain regulated filings and notarised deeds, require a certificate-based digital signature or a wet signature. If a document says which it needs, follow it.",
      },
      {
        q: "Can I sign in several places in one document?",
        a: "Yes. Place the signature as many times as the document requires, along with initials, dates or any other mark, then save once when everything is in position.",
      },
    ],
  },
  "pdf-forms": {
    lead: "Dropping a fillable PDF here surfaces its fields as an ordinary web form: text boxes to type into, checkboxes to tick, dropdowns to choose from. Fill it in, then save either a normal PDF that stays editable or a flattened one where the answers become permanent page content. Flattening is the option most people actually want when returning a form to someone: it stops the answers from being changed accidentally by the next reader, and it guarantees they display in software that renders form fields badly or not at all. The work happens in your browser, so a completed application containing your address, salary or medical details is never uploaded anywhere. If the PDF has no fields — which is true of most scanned forms — the editor tool is the fallback, adding text boxes wherever they are needed.",
    sections: [
      {
        h: "Fillable and flat forms are different things",
        body: [
          "A fillable PDF contains AcroForm fields: named, typed objects the reader knows how to accept input into. A flat form is a picture of a form, whether scanned from paper or exported without the interactive layer, and has nowhere to put anything.",
          "Most forms encountered in the wild are flat, which is why filling one so often ends in printing, writing and scanning. The way out is to add text boxes over the top with the editor: the result looks the same to whoever receives it, and does not require the sender to have produced a proper form.",
        ],
      },
      {
        h: "What flattening does",
        body: [
          "Flattening draws the field values into the page and removes the interactive fields. The answers stay visible and printable but are no longer editable, and no longer depend on the recipient's reader supporting form fields — which some mobile viewers and browser previewers handle poorly.",
          "The cost is that it is one-way. Keep the un-flattened version if the form may need revising, because recovering editable fields from a flattened document is not possible: the fields are gone and only their rendered values remain.",
        ],
      },
      {
        h: "Filling forms with personal information",
        body: [
          "Forms are, by their nature, the documents most likely to contain exactly what you would not want on someone else's server: identity numbers, financial details, medical history, addresses. Most online form fillers upload the file to do the work.",
          "This one does not. The PDF is parsed and rewritten entirely in the browser tab, so the completed form exists only on your machine until you send it wherever it is going. That property is the reason to prefer a local tool for this particular job, more than for any other in this set.",
        ],
      },
    ],
    faq: [
      {
        q: "My PDF has no fillable fields — what now?",
        a: "Use the PDF editor and add text boxes where the answers belong. Most forms, especially scanned ones, have no interactive layer at all, and typed text over the top produces the same result for the recipient.",
      },
      {
        q: "Should I flatten before sending the form back?",
        a: "Usually yes. Flattening fixes the answers into the page so they cannot be altered by accident and display correctly in readers with poor form support. Keep an un-flattened copy for yourself in case the form comes back for revision.",
      },
    ],
  },
};

const CONVERT_DEPTH: Record<string, Depth> = {
  "compress-pdf": {
    lead: "Compressing re-encodes the images inside a PDF at a quality level you choose, which is where nearly all the size in a large document actually lives. Scans respond dramatically — a 20 MB scanned contract commonly lands under 3 MB with no practical loss of legibility — because each page is a photograph and photographs compress. A text-based PDF exported from a word processor is a different story: its pages are text and vector instructions that are already compact, and there is very little for a compressor to take. Knowing which kind of document you have predicts the result better than any setting does. The work runs in your browser, so a large file is not limited by an upload cap or a queue, and the document is never sent anywhere. Your original is untouched; you download a new, smaller copy.",
    sections: [
      {
        h: "Where the size in a PDF actually is",
        body: [
          "Open the file size question honestly and it nearly always resolves to images. A scanned page is a photograph of paper, typically several megabytes at 300 dpi in colour; forty of them is a large file made of forty large pictures. Compression re-encodes those images and the total falls proportionally.",
          "Text and vector content is already efficient. Glyph positions and drawing instructions compress well by default and there is no equivalent lever to pull, which is why a 2 MB text-based report will not become a 200 KB one no matter what setting you choose. Embedded fonts are the other fixed cost, and stripping them would break the document's rendering elsewhere.",
        ],
      },
      {
        h: "Does text stay selectable",
        body: [
          "Yes, where it was selectable to begin with. Compression here targets the images; the text layer is left as text, so search, copy and screen readers keep working exactly as before.",
          "A scanned document is the case people get confused about. Its text was never text — it is part of the page image — so it was not selectable before compression and will not be afterwards. Running OCR is what adds a text layer, and it is a separate operation for a separate purpose.",
        ],
      },
      {
        h: "Choosing a quality level",
        body: [
          "For a scan destined to be read on screen or emailed, a moderate setting is generally invisible: the document is a picture of black text on white paper, which survives compression better than almost any other content. For anything with photographs where detail matters — product shots, medical images, artwork proofs — stay high.",
          "Test with one file before doing a batch, and check the smallest text on the busiest page rather than the document as a whole. That is where over-compression shows first, as softening around character edges, and it is the difference between a file that is smaller and one that is smaller and unusable.",
        ],
      },
    ],
    faq: [
      {
        q: "Why did my PDF barely shrink?",
        a: "Because it is probably text-based rather than scanned. Compression works on the images inside a document, and a PDF exported from a word processor contains almost none — its pages are text and vector drawing instructions that are already compact.",
      },
      {
        q: "Does compressing lose quality permanently?",
        a: "In the new file, yes — the image data is re-encoded and the discarded detail does not come back. Your original is untouched though, so keep it and work from it if you later need a higher-quality version.",
      },
    ],
  },
  "jpg-to-pdf": {
    lead: "Converting images to PDF wraps them into a single paged document, in the order you arrange them, at a page size you pick. It is the standard answer to an upload form that will not accept photographs, a receipts claim that wants one file rather than fourteen, or a set of phone photos of paperwork that should arrive as a document rather than a gallery. Each image becomes one page, scaled to fit the page size while keeping its proportions, so nothing is stretched. Photographs are placed as-is rather than re-encoded, which means the quality that comes out is the quality that went in and the resulting PDF is roughly the sum of the images. Everything happens in your browser: photographs of your passport, bank statements or medical documents are never uploaded to anyone's server, which for this particular conversion is usually the point.",
    sections: [
      {
        h: "Page size, orientation and fitting",
        body: [
          "A4 and Letter are the sensible defaults because they are what printers and document workflows expect. Each image is scaled to fit inside the page while keeping its aspect ratio, so a landscape photo on a portrait page sits centred with space above and below rather than being cropped or distorted.",
          "Where the images are consistently landscape — slides, wide scans, spreadsheets photographed sideways — choosing a landscape page removes that empty space and makes the document much better to read. Mixed orientations are the awkward case, and are usually better solved by rotating the images first so the document is at least consistent.",
        ],
      },
      {
        h: "Order, and why it is rarely what you expect",
        body: [
          "Browsers hand over multi-file selections in an order that is neither the order you clicked nor reliably alphabetical, and phone photo names sort in ways that surprise people once the counter rolls over. Drag the thumbnails into the order you want before converting.",
          "For a document that was photographed page by page, this is worth two minutes of care: a bank statement or a signed agreement with pages out of sequence reads as carelessness to whoever receives it, and reassembling it afterwards means starting over.",
        ],
      },
      {
        h: "File size and quality",
        body: [
          "The images are embedded rather than re-encoded, so the PDF is approximately the sum of the input files plus a small overhead. Modern phone photos are several megabytes each, which means a dozen pages of paperwork can produce a document too large for the form you are filling in.",
          "The fix is to resize or compress the photographs before converting, or to compress the PDF afterwards. Paperwork does not need 12 megapixels — a page of text is perfectly legible at a fraction of that, and reducing the images first gives a much better result than heavy compression later.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I mix JPG and PNG images in one PDF?",
        a: "Yes — drop any mixture of formats your browser can decode and they will be combined in the order you arrange them. PNG transparency is flattened onto the page, since PDF pages are opaque.",
      },
      {
        q: "Why is my PDF so large?",
        a: "Because the photos are. Images are embedded rather than re-compressed, so a dozen multi-megapixel phone photos make a multi-megabyte PDF. Shrink the images first, or run the finished PDF through the compress tool.",
      },
    ],
  },
  "pdf-to-jpg": {
    lead: "Exporting to images renders each PDF page as a JPG or PNG at up to three times the default resolution, or alternatively pulls out the original images embedded inside the file rather than rendering pages at all. Those two modes answer different questions. Rendering is what you want to put a page into a slide deck, a document that cannot embed PDFs, or a message thread — you get a picture of the page as it looks. Extracting is what you want when the PDF contains a photograph or diagram you need at its original quality, without the page around it. Multiple results download as a ZIP. All rendering happens in your browser through PDF.js, so the document is never uploaded, and there is no page limit beyond your machine's patience.",
    sections: [
      {
        h: "Rendering pages against extracting images",
        body: [
          "Rendering draws the page — text, vectors, images, all of it — into a new bitmap at whatever resolution you ask for. The output is a picture of the page, which is right when the layout is the thing you want to show.",
          "Extraction pulls the image objects out of the file at their stored resolution, without the surrounding page. That is the mode for recovering the photograph someone placed in a report, or the diagram you need to reuse, at whatever quality it was embedded with — often higher than a rendered screenshot of the page would give you.",
        ],
      },
      {
        h: "Choosing a resolution",
        body: [
          "The default is fine for on-screen use. Two or three times that is worth it for anything that will be zoomed, projected or printed, because a rendered page has no vectors left to redraw — the resolution you choose is all the detail it will ever have.",
          "The cost is size and memory. A three-times render of an A4 page is around 3500 pixels across, and a long document at that setting will make a large ZIP and can exhaust a browser tab's memory. Render the pages you actually need rather than the whole document, where you can.",
        ],
      },
      {
        h: "JPG or PNG for the output",
        body: [
          "JPG suits pages that are mostly photographic — scanned photos, image-heavy brochures — and produces much smaller files. It handles hard edges least well, which on a page of text means faint halos around the letters.",
          "PNG is lossless and is the better choice for anything with text, line art, tables or diagrams: crisp edges, no artifacts, at the cost of a significantly larger file. For a text page destined for a slide or a document, PNG is almost always the right answer.",
        ],
      },
    ],
    faq: [
      {
        q: "Why is my exported page blurry?",
        a: "Because it was rendered at the default resolution and then enlarged. A rendered page is a bitmap with no vectors left to redraw, so choose 2x or 3x at export time rather than scaling up afterwards.",
      },
      {
        q: "Can I export only some pages?",
        a: "Yes — select the pages you need rather than the whole document. That also keeps the ZIP manageable and avoids running a long document at high resolution through a browser tab's memory.",
      },
    ],
  },
  "pdf-to-markdown": {
    lead: "This pulls the text out of a PDF and marks it up as Markdown, inferring structure from the way the document looks: text noticeably larger than the body becomes a heading, bullet glyphs become list items, and paragraph breaks are preserved. The result is a plain text file you can paste into notes, a documentation repository, an issue tracker or a chat assistant. That last use is increasingly the common one — pasting a document's text into an LLM rather than handing over the file itself, which keeps the document on your machine and costs far fewer tokens than an image of every page. Everything runs in your browser through PDF.js. The limitation to know before you start is that this reads the text layer, so a scanned PDF with no text layer yields nothing until it has been through OCR.",
    sections: [
      {
        h: "How the structure is inferred",
        body: [
          "A PDF does not record that something is a heading. It records glyphs with positions and font sizes, and the heading-ness is something a human infers visually. The conversion does the same inference: text set noticeably larger than the surrounding body is promoted to a heading, with the largest becoming a top-level one.",
          "That works well on documents with a consistent typographic hierarchy — reports, papers, manuals — and less well on marketing material where size is used for emphasis rather than structure. Expect to fix a few headings by hand on a design-led document; expect very little work on a plain one.",
        ],
      },
      {
        h: "What does not survive",
        body: [
          "Tables are the big one. A PDF table is lines and positioned text with no notion of rows and columns, so it comes out as a sequence of cell contents rather than a Markdown table. Complex tables need rebuilding by hand or a purpose-built extraction tool.",
          "Multi-column layouts can interleave, because reading order in the file does not always match visual order. Images are not carried into a text format at all. Footnotes usually land at the end of the page's text rather than beside their reference.",
        ],
      },
      {
        h: "Markdown or plain text",
        body: [
          "Choose Markdown when the destination understands it: documentation, a wiki, an issue tracker, a note-taking app, or an assistant that benefits from seeing the document's hierarchy.",
          "Choose plain text when you want the words and nothing else — for search, for quoting, or for pasting somewhere that would render the hash symbols literally. The extraction is identical; only the formatting applied to the output differs.",
        ],
      },
    ],
    faq: [
      {
        q: "Does this work on a scanned PDF?",
        a: "No. It reads the text layer, and a scan is a picture of text with no such layer. Run the document through OCR first — that adds a real text layer, after which extraction works normally.",
      },
      {
        q: "Why did my tables come out mangled?",
        a: "Because a PDF table is drawn lines plus positioned text, with nothing recording which cell is in which row. The words come across; the grid does not. For data you need to work with, PDF to Excel is the better route.",
      },
    ],
  },
  "pdf-to-png": {
    lead: "Rendering each page to PNG produces a lossless image of the page, which is the right choice whenever the page contains text, tables, diagrams or line art. Lossless matters here for a specific reason: JPEG compression works by discarding fine detail around hard edges, and a page of text is nothing but hard edges, so a JPEG export shows faint grey halos around the characters. PNG has none of that — the exported image is exactly what was rendered, character edges included. The trade is file size, which is typically several times a JPEG of the same page. Choose the resolution to match what the image is for, because a rendered page is a fixed bitmap with no vectors left to redraw. Rendering runs in your browser through PDF.js; the document is never uploaded.",
    sections: [
      {
        h: "Why text pages need lossless",
        body: [
          "JPEG divides the image into blocks and discards high-frequency detail within each one. High-frequency detail is precisely what a letterform edge is, so the compressor spends its budget trying to approximate something it is structurally bad at, and the result is ringing — a faint halo around each character, most visible on small text.",
          "PNG stores every pixel exactly, so a rendered page of text looks identical to the page. On a photographic page the difference is invisible and JPEG's much smaller file wins; on a text page PNG is the only sensible answer.",
        ],
      },
      {
        h: "Picking a resolution",
        body: [
          "For on-screen use at roughly page size, the default is adequate. For anything projected, printed or zoomed, choose 2x or 3x: a three-times render of A4 is around 3500 pixels wide, which holds up to a full-screen presentation and to print at a reasonable size.",
          "Enlarging afterwards does not work, because the vectors are gone — the render captured a fixed grid of pixels and interpolation cannot invent the missing detail. Choosing the resolution at export time is the only opportunity you get.",
        ],
      },
      {
        h: "Transparency and what PNG carries",
        body: [
          "PNG supports an alpha channel and a rendered page uses it for the background, so a page can be exported with the paper transparent rather than white — useful when the image is being placed onto a coloured slide or composited into another design.",
          "It does not carry a text layer of any kind. A PNG of a page is a picture, so the text in it is no longer searchable, selectable or accessible to a screen reader. If those properties matter to the destination, extract the text separately or keep the PDF.",
        ],
      },
    ],
    faq: [
      {
        q: "PNG or JPG for exported pages?",
        a: "PNG for anything with text, tables or line art — JPEG's compression puts visible halos around hard edges. JPG for photographic pages, where the artifacts are invisible and the file is several times smaller.",
      },
      {
        q: "Can I get a transparent background?",
        a: "Yes. PNG carries an alpha channel, so the page background can be exported transparent rather than white — handy when the page is going onto a coloured slide or into another design.",
      },
    ],
  },
  "png-to-pdf": {
    lead: "Turning PNGs into a PDF wraps one or many images into a paged document at the page size and order you choose. It is what upload forms want when they refuse images, and what makes a set of screenshots into something that reads as a document rather than a folder. One point specific to PNG: transparency is flattened onto the page background, because PDF pages are opaque and there is nowhere for see-through to go. An image with a transparent background therefore arrives with a white one, which is almost always what you wanted but is worth knowing before you send a logo sheet to a printer. The images are embedded rather than re-encoded, so quality is preserved exactly and the PDF is roughly the sum of its inputs. It all runs in your browser, with nothing uploaded.",
    sections: [
      {
        h: "What happens to transparency",
        body: [
          "A PDF page is a physical sheet with a colour, and PNG's alpha channel has no equivalent in it. Transparent regions are composited onto the page background — white by default — at the moment the image is placed.",
          "For screenshots and diagrams this is invisible and correct. It matters when the image was designed to sit on something else: a logo with a transparent background becomes a logo on a white rectangle, which will show against any coloured stock it is printed on. Where that matters, composite the image onto the intended background first.",
        ],
      },
      {
        h: "Screenshots make good PDF pages",
        body: [
          "PNG is what every operating system produces when you capture the screen, which makes this the natural route for turning a sequence of captures into a walkthrough, a bug report or a record of something before it changed.",
          "Screenshots are usually wider than they are tall, so a landscape page will use the space far better than portrait. Keeping them in capture order matters as much as with any document — drag the thumbnails rather than trusting the order the browser hands over.",
        ],
      },
      {
        h: "Quality and size",
        body: [
          "PNGs are embedded as they are, so nothing is re-compressed and the pages look exactly like the source images. PNG is lossless, which is excellent for fidelity and unhelpful for size: a set of full-resolution screenshots produces a large PDF.",
          "If the result is too big for an email or an upload limit, compress the finished PDF rather than accepting a lower-quality capture. Screenshot text tolerates moderate compression better than people expect, and it is easier to redo than the captures are.",
        ],
      },
    ],
    faq: [
      {
        q: "Will my transparent background stay transparent?",
        a: "No. PDF pages are opaque, so transparency is flattened onto the page background — white unless you set otherwise. Composite the image onto the background you want first if that matters.",
      },
      {
        q: "Does image quality drop when converting?",
        a: "No. The PNGs are embedded rather than re-encoded, so each page shows exactly the source image. The consequence is size: lossless images make large PDFs, so compress afterwards if you hit a limit.",
      },
    ],
  },
  "pdf-to-text": {
    lead: "This extracts the raw text of a PDF in reading order and gives it back as plain text — no headings, no layout, no formatting, just the words. It is the fastest route to quoting a passage, searching a document your reader will not search properly, feeding text into a script, or pasting a document into a chat assistant without handing over the file. That last case is worth calling out: pasting text keeps the document on your machine, and costs a fraction of what uploading a page image would. Extraction reads the text layer that born-digital PDFs carry, which means a scan produces nothing until it has been through OCR. Occasional oddities in spacing are normal and have a specific cause worth understanding. Everything runs in your browser through PDF.js, so the document itself is never uploaded.",
    sections: [
      {
        h: "Why the spacing is sometimes strange",
        body: [
          "A PDF does not necessarily store spaces. It stores glyphs at coordinates, and the gap between two words may be an actual space character or may simply be the next glyph being positioned further along. Extraction has to infer which, from the distance between them.",
          "That inference is usually right and occasionally not, particularly with justified text where word spacing varies line by line, with kerned headings, and with fonts that use unusual glyph widths. The result is the odd missing space or an unexpected one, which is a property of the format rather than a fault in the extraction.",
        ],
      },
      {
        h: "Reading order and columns",
        body: [
          "Text comes out in the order the file stores it, which for a normal single-column document is the order you read it in. Multi-column layouts are where this breaks down: if the file stores the page left to right rather than column by column, the extracted text interleaves the columns.",
          "Academic papers and newsletters are the usual sufferers. There is no way to fix it from the text alone — the information about which column a line belongs to is visual. For those documents, extracting page by page and reassembling manually is often quicker than untangling the whole file.",
        ],
      },
      {
        h: "Plain text or Markdown",
        body: [
          "Take plain text when you want the words unadorned: for quoting, for a search index, for a script, or for pasting somewhere that would show Markdown syntax literally rather than rendering it.",
          "Take Markdown when the structure is useful — headings and lists inferred from the document's typography, which helps when the destination renders it or when an assistant benefits from seeing the hierarchy. The underlying extraction is identical; only the output formatting differs.",
        ],
      },
    ],
    faq: [
      {
        q: "Nothing came out — why?",
        a: "The PDF is almost certainly a scan. A scanned page is an image of text with no text layer to extract, so there is genuinely nothing there. Run OCR first to add one, then extract normally.",
      },
      {
        q: "How is this different from PDF to Markdown?",
        a: "The extraction is the same; the output differs. Plain text gives you the words alone. Markdown additionally infers headings from font sizes and turns bullet glyphs into list items, which helps when the destination renders Markdown.",
      },
    ],
  },
};

const SECURITY_DEPTH: Record<string, Depth> = {
  "redact-pdf": {
    lead: "Redaction removes content rather than covering it. Draw boxes over whatever must not be seen, and on save the affected pages are re-rendered as images with the boxed areas gone — so the text underneath is not merely hidden, it is absent from the file. That distinction is the entire point, and it is where most attempts at redaction fail: a black rectangle drawn in an editor sits on top of text that copies straight back out, which is how confidential names, figures and addresses reach the public in documents that looked redacted. Because the pages are flattened to images, the redacted pages stop being searchable and their text stops being selectable — a real cost, accepted deliberately, because it is what guarantees nothing survives underneath. Everything happens in your browser, so the unredacted document is never uploaded anywhere.",
    sections: [
      {
        h: "Why covering does not work",
        body: [
          "A PDF stores text and graphics as separate objects in a stack. Drawing a filled rectangle adds an object on top; it does not alter the text object beneath, which remains complete in the file. Select the region and copy, or run any text extractor, and the hidden text comes out intact.",
          "This has produced a long series of public failures — court filings, government disclosures and corporate documents released with names, addresses and figures recoverable by anyone who pressed Ctrl-A. The visual result of covering and redacting is identical, which is exactly why the mistake keeps being made.",
        ],
      },
      {
        h: "What happens when you save",
        body: [
          "Each page carrying a redaction box is rendered to a bitmap with the boxed regions painted out, and that bitmap replaces the page. There is no text layer left on it, no vector objects, and nothing underneath the black areas — because the page is now a picture in which those pixels are black.",
          "Pages you did not touch are left as they are, so a hundred-page document with two redacted pages keeps ninety-eight pages of selectable text. The trade-off is contained rather than applied wholesale.",
        ],
      },
      {
        h: "What redaction cannot reach",
        body: [
          "It works on what is visible on the page. Document metadata — author, title, creation software — sits outside the page content and is not touched, and neither are attachments or the contents of comment threads if the file carries them.",
          "Nor does it know what is sensitive. Check the whole document rather than the paragraph you were told about: names repeated in headers, an email address in a footer, a filename in a screenshot on another page. Redaction is a precise instrument applied by an imprecise process, and the review is the part that matters.",
        ],
      },
    ],
    faq: [
      {
        q: "Can the redacted text be recovered?",
        a: "No. The affected pages are re-rendered as images with the boxed content painted out, so there is no hidden text object left to extract. This is the difference between redacting and drawing a black box in an editor.",
      },
      {
        q: "Why is my redacted page no longer searchable?",
        a: "Because it has become an image. Removing the text layer is what makes the redaction real — the same property that stops anyone recovering the hidden content stops search finding the text you kept. Only the pages you redacted are affected.",
      },
    ],
  },
  "protect-pdf": {
    lead: "Protecting a PDF encrypts it with AES so it cannot be opened without the password, and optionally restricts printing and copying for people who can open it. The encryption is real cryptography rather than a flag a reader chooses to honour: without the password, the content is not readable by any software. The permission restrictions are a weaker thing — they are instructions in the file that well-behaved readers obey and others ignore — so treat the open password as the control that matters and the permissions as a statement of intent. Both the file and the password are handled in your browser, which means the password you are about to rely on is never transmitted to anyone. Choose it accordingly, and send it to the recipient by some channel other than the email carrying the document.",
    sections: [
      {
        h: "Two kinds of password",
        body: [
          "A user password — sometimes called the open password — is required to decrypt and view the document. Without it there is nothing to read, and no reader can bypass it.",
          "An owner password governs permissions: whether printing, copying text or editing is allowed for someone who has already opened the file. The distinction matters because the second is enforced by convention. Compliant readers honour it; plenty of tools do not. If content must not be extracted, do not distribute it rather than relying on a permissions flag.",
        ],
      },
      {
        h: "The password is the whole security",
        body: [
          "AES encryption is not the weak point; the password is. A short or guessable one can be attacked offline at whatever speed the attacker's hardware allows, and there is no lockout to slow them down because the file is in their possession.",
          "Use a long passphrase rather than a clever short password. And send it separately — a password in the same email as the attachment protects against nothing except accidental forwarding, which is a real risk but not the one encryption is for.",
        ],
      },
      {
        h: "Before you encrypt",
        body: [
          "Do the other work first. An encrypted PDF cannot be merged, split, compressed or edited until it is decrypted again, so if the document still needs assembling, assemble it and encrypt the finished file.",
          "Consider whether encryption is the right control at all. If the concern is a specific paragraph, redaction removes it and leaves a document anyone can open. If the concern is the whole document reaching the wrong person, encryption is exactly right — provided the recipient can be given the password by another route.",
        ],
      },
    ],
    faq: [
      {
        q: "What happens if I forget the password?",
        a: "The document is unrecoverable. That is what encryption means — there is no backdoor here or anywhere else. Keep a copy of the password in a password manager, or keep the unencrypted original somewhere safe.",
      },
      {
        q: "Do the printing and copying restrictions actually work?",
        a: "Only with readers that choose to honour them; they are instructions in the file rather than cryptographic enforcement. The open password is the real control. Treat permissions as a statement of intent, not a guarantee.",
      },
    ],
  },
  "unlock-pdf": {
    lead: "Unlocking takes a PDF you can already open and writes out a copy without the encryption, so you stop typing the password every time you look at it. You supply the password; it is used to decrypt the file in your browser and is never sent anywhere. This is not a password cracker and cannot be: without the correct password there is no way to read the contents, which is the property that makes encryption worth using in the first place. The practical need is usually a document you legitimately own — a bank statement, a payslip, an insurance policy — that arrives encrypted by policy and then has to be opened repeatedly, or fed to another tool that cannot handle encrypted input. Decrypting once and storing the result somewhere already secure is often the more sensible arrangement.",
    sections: [
      {
        h: "This needs the password",
        body: [
          "Decryption requires the key, and the password is the key. There is no bypass, no reset and no vendor override — a properly encrypted PDF whose password is unknown is unreadable, and any service claiming otherwise is either guessing weak passwords or not telling you the truth.",
          "That is a feature. The same property that makes a forgotten password unrecoverable is what makes encryption meaningful when you are relying on it to protect something of your own.",
        ],
      },
      {
        h: "Why remove encryption at all",
        body: [
          "Because many documents are encrypted by an institution's policy rather than by your judgement about the risk. Statements arriving with a date-of-birth password, payslips with an employee number — these are protecting the email in transit, and the protection is often actively unhelpful once the file is in your own storage.",
          "The other reason is tooling. Encrypted PDFs cannot be merged, compressed, searched by desktop indexers or processed by most automation. Decrypt once, keep the result somewhere already protected, and the document behaves like a document again.",
        ],
      },
      {
        h: "Think about where the decrypted copy goes",
        body: [
          "Removing encryption removes a layer of protection, and the file is only as safe afterwards as the place you keep it. On an encrypted disk in a personal folder, that is usually fine. In a shared drive or a synced folder others can browse, it is not.",
          "Note also that owner-password restrictions on printing and copying are lifted along with the rest, since they are part of the same structure. And do the decrypting before any other processing — everything else in this toolkit needs an unencrypted file to work with.",
        ],
      },
    ],
    faq: [
      {
        q: "Can this open a PDF whose password I do not know?",
        a: "No. Decryption requires the password, and there is no bypass in the format. Anything advertising password recovery is attempting to guess weak passwords, not defeating the encryption.",
      },
      {
        q: "Is my password sent anywhere?",
        a: "No. Both the file and the password stay in your browser — the decryption runs locally, which is the only arrangement that makes sense for a credential protecting a document you care about.",
      },
    ],
  },
  "compare-pdf": {
    lead: "Comparing loads two versions of a document side by side, page by page, with an overlay that highlights the areas that differ in red. It answers the question that comes up whenever a contract, a specification or a policy comes back from someone else: what actually changed? Reading two long documents in parallel is slow and unreliable — the human eye is very good at seeing what it expects — while a visual diff surfaces a changed figure or an inserted clause immediately. The comparison is visual rather than semantic: it renders both pages and looks for regions that do not match, which catches everything from a reworded sentence to a moved table, but flags reflowed text as changed even when the words are identical. Both files are processed in your browser, so two versions of a confidential agreement are never uploaded.",
    sections: [
      {
        h: "How the difference is computed",
        body: [
          "Both pages are rendered to bitmaps at the same scale and compared region by region; areas that do not match are tinted. This is deliberately dumb and therefore complete — it cannot miss a change, because any visible change alters the pixels.",
          "The trade is that it does not understand what changed. A paragraph inserted on page 3 pushes everything after it down, and every subsequent page then reads as almost entirely different, even though the text is unchanged. That is the main thing to be ready for when comparing documents that have grown.",
        ],
      },
      {
        h: "Reading the result",
        body: [
          "Work page by page and treat the highlights as candidates rather than conclusions. Small isolated marks are usually the real edits: a changed number, a new clause, a different date, a swapped name.",
          "Large uniform highlighting across a page usually means reflow rather than rewriting. When you see it, find the first genuine change above it — that is the insertion or deletion that shifted everything, and the pages after it are often unchanged in substance.",
        ],
      },
      {
        h: "What this is good and bad at",
        body: [
          "It is good at documents from the same source with the same layout: two exports of a contract, two revisions of a drawing, a policy before and after amendment. It catches everything, including changes to images, tables and figures that a text diff would miss entirely.",
          "It is poor at documents that were regenerated with different fonts or margins, and at comparing a scan to a digital original, where nothing lines up and everything highlights. For those, extracting the text from both and comparing that is the more useful approach.",
        ],
      },
    ],
    faq: [
      {
        q: "Why is a whole page highlighted when I only changed one line?",
        a: "Because the comparison is visual. An insertion pushes the following text down, so every line after it sits in a different place and reads as changed. Look for the first real difference — the pages below it are often unchanged in substance.",
      },
      {
        q: "Can it compare a scan against the digital original?",
        a: "Poorly. Scans differ in alignment, contrast and scale, so almost everything highlights. Extract the text from both and compare that instead when the two versions did not come from the same source.",
      },
    ],
  },
  "scan-to-pdf": {
    lead: "Scanning with a phone camera turns paper into a PDF without a scanner: open this page on the phone, photograph each page, and download the set as a single document. The captures stay on the device — they are held in the browser tab and assembled there, so a photographed passport, contract or medical letter is never uploaded to anyone's server, which is a meaningful difference from most scanning apps. Quality depends almost entirely on how the photographs are taken rather than on any processing afterwards: even, indirect light, the phone held parallel to the page rather than at an angle, and the page filling the frame will produce something legible enough for any official purpose. Shadows are the usual culprit when a scan comes out unusable, and the phone's own shadow is the one people forget about.",
    sections: [
      {
        h: "Light is most of the result",
        body: [
          "Diffuse indirect light is what you want: near a window on an overcast day, or under general room lighting rather than a single spotlight. Direct sun produces harsh shadows and blown-out highlights; a desk lamp produces a bright patch and dark corners.",
          "Watch for your own shadow and the phone's. Holding the camera directly above a page under a ceiling light frequently puts the phone's shadow across the middle of the shot. Move so the light comes past you rather than from behind you.",
        ],
      },
      {
        h: "Angle, framing and focus",
        body: [
          "Hold the phone parallel to the page rather than tilted. A tilted shot gives keystoned pages — narrower at the top than the bottom — which look wrong in a document and can make automatic processing fail later.",
          "Fill the frame with the page, leaving a small margin, so the resolution is spent on the document rather than the table. Tap to focus before capturing, especially in dimmer light, and check the smallest text on screen before moving on: a blurred page is much easier to retake now than after you have put the paper away.",
        ],
      },
      {
        h: "Assembling the document",
        body: [
          "Capture in order and the pages arrive in order. If you photograph out of sequence, fix it before downloading — it is far quicker than reordering the finished PDF.",
          "The result is a set of photographs in a PDF wrapper, which means the text is not selectable and the file can be large. Compressing afterwards helps with size; OCR is what adds a searchable text layer if the document needs to be searched or read by a screen reader.",
        ],
      },
    ],
    faq: [
      {
        q: "How do I get the best quality from a phone camera?",
        a: "Even indirect light, the phone held parallel to the page, the page filling the frame, and a tap to focus before each capture. Avoid direct sun and watch for your own shadow — bad lighting ruins more scans than low resolution does.",
      },
      {
        q: "Will the scanned text be searchable?",
        a: "Not on its own — the pages are photographs. Run the finished PDF through OCR to add a text layer if you need to search it, copy from it, or have it read by a screen reader.",
      },
    ],
  },
};

// The ten tools that cannot run in a browser, because they need a document
// engine (LibreOffice), an OCR pipeline or a real rendering browser. Every lead
// and section here says so plainly: no "never leaves your device", no "no
// upload", and an explicit statement of what the server does with the file.
const SERVER_DEPTH: Record<string, Depth> = {
  "pdf-to-word": {
    lead: "Converting a PDF to Word rebuilds the document as DOCX with editable text, paragraphs, tables and images. This is one of the tools that cannot run in your browser: reconstructing a word-processing document from a PDF needs a full document engine, so the file is sent to our server, streamed through the converter and streamed straight back. Nothing is stored — the file is discarded the moment the response is sent — but it does leave your device, and you should treat it accordingly for anything highly sensitive. Accuracy depends almost entirely on how the PDF was made. A document exported from Word converts back close to perfectly, because the structure it needs is still described in the file. A scan converts to a page of images, because there is no text in it to recover until OCR has been run first.",
    sections: [
      {
        h: "Why this one needs a server",
        body: [
          "Most tools here run on your machine because the operations are structural — moving pages, drawing on them, encrypting them. Rebuilding a Word document is different in kind: it means inferring paragraphs, styles, tables and reading order from a page of positioned glyphs, and that reconstruction is the work of a document engine measured in hundreds of megabytes.",
          "There is no browser equivalent. So this conversion runs on a container we operate: the upload streams into the converter, the DOCX streams back out, and nothing is written to disk or retained. It is an honest trade rather than a hidden one — the alternative would be not offering the tool.",
        ],
      },
      {
        h: "What determines the accuracy",
        body: [
          "The origin of the PDF decides almost everything. A file exported from Word or Google Docs carries structural hints that survive into the PDF, and converting back recovers most of the original layout — headings, lists, tables and all.",
          "A PDF from a design tool is harder, because its text is positioned for appearance rather than structure, and multi-column or heavily designed layouts frequently come back as text boxes rather than flowing paragraphs. A scanned PDF is the hardest case of all: there is no text to recover, so the output is images of pages. Run OCR first if the document is a scan.",
        ],
      },
      {
        h: "What usually needs fixing afterwards",
        body: [
          "Expect to tidy rather than to retype. Complex tables sometimes lose a merged cell or a border; text in columns can arrive as separate boxes; headers and footers occasionally land in the body rather than in the page furniture.",
          "Fonts are the other common surprise. If the PDF embedded a font you do not have installed, Word substitutes something, and line breaks shift as a result. Checking pagination after conversion is worth the minute it takes on any document where the page count matters.",
        ],
      },
    ],
    faq: [
      {
        q: "Why can this not run in my browser like the other tools?",
        a: "Because rebuilding a Word document from a PDF needs a full document engine, which is far too large to ship to a browser. The file is streamed through a converter on our server and streamed back; nothing is stored, but it does leave your device.",
      },
      {
        q: "My scanned PDF converted to pictures — why?",
        a: "Because a scan contains no text, only an image of text. There is nothing for the converter to turn into editable paragraphs. Run the document through OCR first to add a real text layer, then convert.",
      },
    ],
  },
  "pdf-to-excel": {
    lead: "Extracting tables from a PDF into XLSX gives you cells you can sort, filter and calculate with instead of numbers you would otherwise retype. Table recovery needs a document engine rather than a browser, so this runs on our server: the file is streamed through the converter and the spreadsheet streams back, with nothing stored afterwards — but the file does leave your device, which is worth weighing for confidential financial data. The difficulty of the job is that a PDF table is not a table. It is a set of drawn lines and independently positioned text, with nothing recording which value belongs to which row. The converter infers the grid from alignment and rules, which works well on clean bordered tables and struggles with merged cells, multi-line entries and tables split across pages. Check the output against the original before you rely on it.",
    sections: [
      {
        h: "Why PDF tables are hard",
        body: [
          "In a spreadsheet, a cell knows its row and column. In a PDF, a table is lines drawn on a page and numbers placed at coordinates — the grid is something a human perceives, not something the file records.",
          "Reconstruction therefore means inferring structure from geometry: values that share a vertical position are probably a row, values sharing a horizontal band are probably a column, and drawn rules probably indicate boundaries. That inference is reliable on a plain bordered table and progressively less so as the design gets cleverer.",
        ],
      },
      {
        h: "What converts well and what does not",
        body: [
          "Clean tables with visible borders, one line per cell and consistent alignment convert accurately. Financial statements, price lists and simple data tables are usually close to correct on the first pass.",
          "Merged cells, cells wrapping to several lines, nested headers, tables without ruling lines, and tables continuing across a page break are the recurring failure cases. Numbers can land in the wrong column, and a wrapped cell can become two rows. A scanned PDF, again, has nothing to extract until OCR has been run.",
        ],
      },
      {
        h: "Check before you calculate",
        body: [
          "The dangerous failure is not the obviously mangled sheet — it is the one that looks right and has a value in the wrong column. Compare row and column totals against the source document before building anything on the data.",
          "Watch the number formatting too: currency symbols, thousands separators and negatives in parentheses sometimes arrive as text rather than numbers, which makes a column silently refuse to sum. Fixing that in the spreadsheet is quick once you know to look.",
        ],
      },
    ],
    faq: [
      {
        q: "Where does the conversion run?",
        a: "On our server. Table reconstruction needs a document engine that cannot run in a browser, so the file is streamed through the converter and the XLSX streamed back. Nothing is stored, but the file does leave your device.",
      },
      {
        q: "Why did my numbers land in the wrong columns?",
        a: "Because the grid has to be inferred from positions and ruling lines rather than read from the file — PDFs do not record cells. Merged cells, multi-line entries and borderless tables are the usual causes. Always check totals against the original.",
      },
      {
        q: "Can it extract a table that runs across several pages?",
        a: "It extracts each page, but it does not know the table continues — so a table spanning pages usually arrives as separate blocks with the header repeated. Stitching them together in the spreadsheet is quick once the data is out.",
      },
    ],
  },
  "pdf-to-powerpoint": {
    lead: "Converting a PDF to PowerPoint turns each page into a slide in an editable PPTX deck. It is the tool for getting a deck back when only the exported PDF survives, and for turning a document into something you can present from and annotate. The conversion runs on our server, because building a presentation file requires a document engine that has no browser equivalent: the PDF streams through the converter and the PPTX streams back, with nothing retained afterwards — but the file does leave your device. What you get back depends on the source. A PDF exported from PowerPoint returns close to its original structure with text you can edit. A PDF from any other origin becomes slides that look right and are built from imported content rather than native shapes, which is fine for presenting and awkward for heavy editing.",
    sections: [
      {
        h: "One page, one slide",
        body: [
          "The mapping is direct: page 1 becomes slide 1, and the page's proportions carry over. A document laid out for A4 portrait produces tall slides, which look odd in a 16:9 deck and usually want resizing once you are in PowerPoint.",
          "Where the PDF started life as a presentation, this is invisible — the pages were already slide-shaped. Where it did not, deciding the target slide size before you start editing saves rearranging everything twice.",
        ],
      },
      {
        h: "How editable the result is",
        body: [
          "Text that existed as text in the PDF generally comes back as text you can edit, though as free-floating boxes rather than as title and content placeholders. The deck will not have a working outline view or theme-driven layouts, because that structure was lost when the original was exported to PDF.",
          "Vector graphics and images come across as objects on the slide. Complex designs sometimes arrive as a single flattened image, which presents perfectly and cannot be picked apart. If you need genuinely editable slides, chasing down the original file is faster than reconstructing one.",
        ],
      },
      {
        h: "When this is the right tool",
        body: [
          "It earns its place when the original is gone: a deck that only exists as the PDF someone circulated, a report that has to be presented tomorrow, a set of diagrams you need to talk through and mark up.",
          "It is the wrong tool for polishing. If the deck needs restyling, rebranding or restructuring, converting gives you a pile of boxes to fight rather than a foundation to build on. Rebuilding from the content, in a proper template, is usually less work than it appears.",
        ],
      },
    ],
    faq: [
      {
        q: "Does this run in my browser?",
        a: "No. Building a PPTX file needs a document engine, so the PDF is streamed through a converter on our server and the presentation streamed back. Nothing is stored afterwards, but the file does leave your device.",
      },
      {
        q: "Will I get editable text on the slides?",
        a: "Usually yes, where the PDF contained real text — though as free-floating text boxes rather than proper title and content placeholders. Heavily designed pages sometimes arrive as flattened images, which present fine but cannot be edited.",
      },
      {
        q: "Why are my slides the wrong shape?",
        a: "Because pages convert at their own proportions. A PDF laid out for A4 produces tall slides rather than 16:9 ones. Set the slide size in PowerPoint after converting, before you start rearranging content.",
      },
    ],
  },
  "word-to-pdf": {
    lead: "Converting DOC or DOCX to PDF fixes the document's appearance so it looks the same for everyone who opens it — fonts, margins, page breaks and all. That is the whole reason the format exists: a Word file reflows according to the fonts, printer drivers and application version on the reader's machine, which is why a document that was two pages when you sent it arrives as three. Conversion runs on our server using a real document engine, since rendering Word's layout faithfully is not something a browser can do: the file is streamed through and the PDF streamed back, with nothing stored — but the file does leave your device. Fonts are embedded into the result, so the document renders correctly on machines that do not have them installed, which is the other half of what makes a PDF portable.",
    sections: [
      {
        h: "Why a Word file looks different elsewhere",
        body: [
          "A DOCX describes content and formatting rules, then leaves the layout to be computed when it is opened. That computation depends on the fonts installed, the default printer's page metrics and the version of Word doing the work — so the same file legitimately produces different pagination on two machines.",
          "PDF stores the finished layout instead. Every glyph has a fixed position and the fonts travel with the file, so what you approve is what the recipient sees. For anything being signed, filed, printed or submitted, that difference is not cosmetic.",
        ],
      },
      {
        h: "What converts faithfully, and what to check",
        body: [
          "Standard documents — text, headings, tables, images, headers and footers — convert accurately, and internal structure like a table of contents generally survives as working links.",
          "Worth checking: documents relying on unusual fonts, where a substitution shifts line breaks; content in text boxes and floating frames, which can move; and tracked changes and comments, which are either rendered or dropped depending on how the document was set up. Accept or reject changes before converting rather than discovering them in the output.",
        ],
      },
      {
        h: "Before you convert",
        body: [
          "Finish the document first. A PDF is a poor editing format, so the natural order is to complete the Word file, convert, and keep the DOCX as the source you revise next time.",
          "If the document has to be filled in or signed by someone else, decide which format they need. A PDF with form fields or a signature block works well; a PDF of a form expecting handwriting means printing and scanning, which is worth avoiding if the recipient has any alternative.",
        ],
      },
    ],
    faq: [
      {
        q: "Where does the conversion happen?",
        a: "On our server. Rendering Word's layout faithfully requires a document engine, so the file is streamed through the converter and the PDF streamed back. Nothing is stored, though the file does leave your device.",
      },
      {
        q: "Will my fonts look right for the recipient?",
        a: "Yes — fonts are embedded into the PDF, so it renders correctly even on a machine that does not have them installed. That is one of the main reasons to convert before sending a document out.",
      },
      {
        q: "What happens to tracked changes and comments?",
        a: "Depending on how the document is set up they are either rendered into the PDF or dropped entirely — neither of which is usually what you want. Accept or reject the changes and remove the comments before converting.",
      },
    ],
  },
  "excel-to-pdf": {
    lead: "Converting a spreadsheet to PDF produces a fixed, paginated document that looks identical everywhere — useful for circulating figures that should be read rather than edited, and for attaching to anything that expects a document instead of a workbook. The conversion runs on our server, because laying out a spreadsheet for print requires a document engine: the file is streamed through and the PDF streamed back, with nothing stored, though the file does leave your device. The thing to understand before converting is that a spreadsheet has no natural page size. A wide sheet has to be broken across pages somewhere, and where that break falls is decided by the print settings inside the workbook rather than by the conversion. Setting the print area, orientation and scaling in Excel first is what separates a clean result from forty pages of stray columns.",
    sections: [
      {
        h: "Set the print area before converting",
        body: [
          "The single most common bad outcome is a document far longer than expected, with columns spilling onto pages of their own. It happens because the sheet is wider than a page and nothing told the layout engine what to do about it.",
          "Fix it in the spreadsheet, where the controls are: define the print area so stray cells outside the data are excluded, choose landscape for wide tables, and use fit-to-width scaling so the columns are compressed onto one page rather than split. The conversion honours those settings.",
        ],
      },
      {
        h: "Repeat the headers",
        body: [
          "A table running over several pages is unreadable from page two onward if the column headings only appear on page one. Excel's print titles setting repeats chosen rows at the top of every page, and it carries through into the PDF.",
          "The same applies to the first column on very wide tables. Between repeated headers and sensible page breaks, a long table becomes a document someone can actually read rather than a stack of anonymous numbers.",
        ],
      },
      {
        h: "What does not come across",
        body: [
          "Everything interactive is lost by design, which is usually the point: formulas become their computed values, filters and slicers disappear, and nothing recalculates. Anyone who needs to work with the data needs the workbook, not the PDF.",
          "Hidden rows and columns stay hidden, which is worth verifying rather than assuming — a hidden column with a working formula still influences the values you are publishing. Charts and conditional formatting render as they appear on screen.",
        ],
      },
    ],
    faq: [
      {
        q: "Why did my spreadsheet become dozens of pages?",
        a: "Because the sheet is wider than the page and nothing defined how to break it. Set the print area, switch to landscape and use fit-to-width scaling in Excel before converting — the conversion honours those settings.",
      },
      {
        q: "Do formulas still work in the PDF?",
        a: "No. A PDF is a fixed document, so formulas are replaced by the values they had at conversion time and nothing recalculates. Send the workbook to anyone who needs to work with the numbers.",
      },
      {
        q: "Do hidden rows and columns appear in the PDF?",
        a: "No — hidden stays hidden. Worth verifying rather than assuming, though: a hidden column can still feed a formula whose result you are publishing.",
      },
    ],
  },
  "powerpoint-to-pdf": {
    lead: "Converting a presentation to PDF produces one page per slide, rendered exactly as designed, in a format that opens anywhere without PowerPoint. It is what you send when handouts are wanted, when the deck is going into a document bundle, or when you simply need the recipient to see what you built rather than a version reflowed by whatever software they happen to have. The conversion runs on our server, because rendering a deck's layout needs a document engine that has no browser equivalent: the file streams through the converter and the PDF streams back, with nothing stored, though the file does leave your device. Fonts are embedded, so the typography holds on machines that do not have them. Everything that moves — animations, transitions, embedded video — flattens to its static appearance, which is the trade a fixed format makes.",
    sections: [
      {
        h: "What flattens",
        body: [
          "Animations and transitions have no representation in a PDF, so a slide built as a sequence of reveals converts to its final state with everything visible at once. Where the build order carried meaning, the slide can read as cluttered.",
          "The fix is to design for it: split a heavily animated slide into several slides before converting, so each stage becomes its own page. Embedded video and audio become the poster frame and nothing respectively, so a deck depending on them needs the original file alongside.",
        ],
      },
      {
        h: "Speaker notes and handouts",
        body: [
          "Notes are not included by default — the conversion produces slides. If the audience needs the notes, either export a notes-pages version from PowerPoint first, or accept that the PDF carries only what is on the slides.",
          "That is often the right call anyway. Speaker notes tend to contain the things you would say rather than the things you would publish, and sending a deck with the notes attached has embarrassed more than one presenter.",
        ],
      },
      {
        h: "Check the aspect ratio",
        body: [
          "Slides convert at their own proportions, so a 16:9 deck produces wide pages and a legacy 4:3 deck produces squarer ones. Neither matches A4, which means printing will letterbox unless the deck was designed for paper.",
          "For handouts that must sit alongside other documents, setting the slide size to A4 in PowerPoint before converting gives a much tidier result than fighting the print dialogue afterwards.",
        ],
      },
    ],
    faq: [
      {
        q: "Do animations survive the conversion?",
        a: "No — a PDF is static, so an animated slide converts to its final state with everything visible. Split build-heavy slides into several slides before converting if the sequence matters.",
      },
      {
        q: "Are my speaker notes included?",
        a: "No. The conversion produces slides only. Export a notes-pages version from PowerPoint if the notes are needed — and check that you want them shared before you do.",
      },
      {
        q: "What happens to embedded video?",
        a: "It becomes its poster frame — a still image on the slide. A deck that depends on playing video needs the original file sent alongside the PDF.",
      },
    ],
  },
  "ocr-pdf": {
    lead: "OCR reads the text in a scanned document and adds it back to the PDF as a real, invisible text layer sitting behind the page image. The page looks exactly as it did; the difference is that it becomes searchable, its text can be selected and copied, and a screen reader can read it aloud. That last point makes OCR an accessibility measure as much as a convenience — an un-OCR'd scan is completely opaque to anyone using assistive technology. This runs on our server, because the OCR engine and its language models are far too large to ship to a browser: the file streams through the pipeline and the searchable PDF streams back, with nothing stored, though the file does leave your device. Accuracy tracks scan quality closely, so a clean 300 dpi scan is worth far more than any setting.",
    sections: [
      {
        h: "What OCR adds and what it does not change",
        body: [
          "The page image stays exactly as it was. The engine recognises the characters, works out where each one sits, and writes an invisible text layer positioned to match. Visually nothing has changed; structurally the document now contains its own text.",
          "That is what makes search, copy and screen readers work. It is also why an OCR'd scan is still a scan: the file size stays roughly the same, the image is unimproved, and any smudge or skew in the original is still there behind the text you can now select.",
        ],
      },
      {
        h: "Scan quality decides accuracy",
        body: [
          "300 dpi is the working standard for text; below about 200 dpi, small type starts to be guessed rather than read. Straight pages matter as much as resolution — skew is one of the most reliable ways to degrade recognition — and even lighting matters more than sharpness.",
          "Clean printed text in a common typeface reaches very high accuracy. Handwriting is largely out of reach for this kind of engine. Unusual fonts, heavy background patterns, faint carbon copies and text over images are the other predictable trouble, and no amount of processing recovers what the scan did not capture.",
        ],
      },
      {
        h: "Expect to check, not to trust",
        body: [
          "Even at high accuracy, a long document contains errors, and the characteristic ones are quiet: a 0 read as an O, a 1 as an l, a comma as a full stop. For prose that is harmless; in a reference number or an amount it is not.",
          "So treat the text layer as a search index rather than a transcript. Search it, copy from it, let a screen reader use it — but verify anything numeric against the image, which is still right there behind it.",
        ],
      },
    ],
    faq: [
      {
        q: "Why does OCR need a server when other tools do not?",
        a: "Because the recognition engine and its language data are hundreds of megabytes — far beyond what a browser can reasonably download. The file is streamed through the pipeline on our server and streamed back; nothing is stored, but it does leave your device.",
      },
      {
        q: "Will OCR make my scan look better?",
        a: "No. It adds an invisible text layer behind the existing page image and changes nothing visible. If the scan is crooked or faint it stays crooked or faint — and recognition accuracy suffers accordingly.",
      },
    ],
  },
  "pdf-to-pdfa": {
    lead: "PDF/A is the ISO-standardised subset of PDF intended for long-term archiving, and converting to it makes a document self-contained: fonts embedded, colour profiles included, and everything that depends on the outside world removed. The point is that the file should render identically in twenty years on software nobody has written yet — which an ordinary PDF cannot promise, because it may rely on fonts installed locally or content fetched over a network. Courts, land registries, national archives and regulated submissions commonly require it for exactly this reason. The conversion runs on our server, since validating and rebuilding a document to the standard needs a document engine: the file streams through and the PDF/A streams back, with nothing stored, though it does leave your device. Expect the file to grow, because self-contained means carrying everything it needs.",
    sections: [
      {
        h: "What the standard forbids",
        body: [
          "PDF/A removes anything whose rendering could depend on the environment. JavaScript, embedded audio and video, external content references and encryption are all excluded, and transparency is restricted in the stricter conformance levels.",
          "Fonts must be embedded — no exceptions, including the ones every reader is assumed to have — and colour must be defined by an embedded profile rather than left to the device. Together these make the file a closed system: everything needed to draw the page is inside it.",
        ],
      },
      {
        h: "The conformance levels",
        body: [
          "PDF/A-1b is the baseline: the document will look right. PDF/A-1a adds structural tagging so the reading order and semantics are recorded, which is what makes a document accessible as well as durable.",
          "Later parts, PDF/A-2 and PDF/A-3, permit newer PDF features such as transparency and, in the case of A-3, embedded source files. Which level you need is dictated by whoever is asking for it, and it is worth confirming rather than assuming — a submission rejected for the wrong conformance level is a slow way to find out.",
        ],
      },
      {
        h: "Practical consequences",
        body: [
          "Files get larger. Embedding fonts that were previously assumed, and colour profiles that were previously implied, adds weight — sometimes substantially on a document using several typefaces.",
          "Some content cannot be converted without changing it. Encrypted documents must be decrypted first, since PDF/A forbids encryption. Interactive elements and multimedia are dropped rather than preserved. And a scanned PDF converts happily to PDF/A while remaining unsearchable — the standard governs durability, not whether there is any text in the file.",
        ],
      },
    ],
    faq: [
      {
        q: "Why is my PDF/A file bigger than the original?",
        a: "Because it now contains everything it needs to render itself: every font fully embedded, plus colour profiles. That self-sufficiency is the entire point of the format, and the size is what it costs.",
      },
      {
        q: "Does converting to PDF/A make a scan searchable?",
        a: "No. PDF/A governs long-term renderability, not content. A scanned page converts to a PDF/A that is still an image of text — run OCR if you need it to be searchable.",
      },
      {
        q: "Which conformance level do I need?",
        a: "Whichever the body asking for it specifies — commonly PDF/A-1b for appearance or PDF/A-1a where tagged structure and accessibility are required. Confirm rather than guess; a submission rejected on conformance level is a slow round trip.",
      },
    ],
  },
  "repair-pdf": {
    lead: "A PDF that will not open is often not as broken as it looks. The format keeps a cross-reference table pointing at where each object lives in the file, and if that table is damaged — by an interrupted download, a failed transfer, a crash mid-save or a storage error — readers give up even though the actual page content is intact. Repair re-parses the file from the beginning, finds the objects that are still there, and writes a fresh, well-formed document around them. The work runs on our server, because a repair engine cannot sensibly be shipped to a browser: the damaged file streams through and the rebuilt one streams back, with nothing stored, though it does leave your device. What comes back depends entirely on how much survived — recovery is not reconstruction, and content that is genuinely absent stays absent.",
    sections: [
      {
        h: "What usually goes wrong",
        body: [
          "The cross-reference table is the most common casualty. It is an index of byte offsets, and it is written last, so a save or a download that stops early produces a file whose content is largely present and whose map is missing or truncated.",
          "The other frequent cause is transfer damage: a file sent through a system that mangled line endings, an email gateway that altered the encoding, or a partial copy from failing storage. In all of these the object data is often recoverable even when no reader will touch the file.",
        ],
      },
      {
        h: "What repair can and cannot do",
        body: [
          "It can rebuild the index, recover the objects that are still present, and produce a file that opens — frequently with everything intact, because the damage was structural rather than substantive.",
          "It cannot invent what is missing. A file truncated at 60% of its length has 40% of its pages genuinely gone, and no amount of parsing brings them back. Nor can it repair a file that is not a PDF at all: a download that returned an error page, or an encrypted file mistaken for a corrupt one, both need a different fix.",
        ],
      },
      {
        h: "Before you resort to repair",
        body: [
          "Try downloading or copying the file again from the source. A large share of unopenable PDFs are incomplete transfers, and a clean copy is a better outcome than any repair.",
          "Check the file size against the original if you can — an obviously small file is truncated rather than corrupt. And open it in a different reader first: browsers, Acrobat and macOS Preview have different tolerances, and a file one refuses will sometimes open in another well enough to print or re-save.",
        ],
      },
    ],
    faq: [
      {
        q: "Can every corrupt PDF be repaired?",
        a: "No. Repair recovers what is still in the file — if it was truncated mid-download, the missing pages are genuinely gone. Damage to the cross-reference table usually recovers well; missing data never does.",
      },
      {
        q: "Where does the repair run?",
        a: "On our server. The file is streamed through the repair engine and the rebuilt document streamed back, with nothing stored afterwards — though the damaged file does leave your device.",
      },
    ],
  },
  "html-to-pdf": {
    lead: "Paste a URL and the page is rendered to PDF by a real headless browser — the same engine that would display it — so stylesheets, web fonts, images and layout come through as they appear rather than as an approximation. It is the tool for archiving a page before it changes, capturing a receipt or booking confirmation, or turning documentation into something readable offline. Only the URL leaves your device: our server fetches the page, renders it and streams the PDF back, storing nothing. Two limits follow from that arrangement and are worth knowing before you try. The renderer visits the page as an anonymous visitor, so anything behind a login is unreachable. And a page written without print styles frequently produces a PDF with navigation bars and cookie banners embedded in it.",
    sections: [
      {
        h: "Pages behind a login cannot be captured",
        body: [
          "Our renderer requests the URL with no session, no cookies and no credentials. A page requiring a login returns the login screen, and that is what gets rendered — which is the correct behaviour rather than a limitation to work around.",
          "For a page you are logged into, use your own browser's Print to PDF, which renders the session you already have. That covers the common cases people reach for this tool with: an order confirmation, a bank statement, an internal wiki page.",
        ],
      },
      {
        h: "What the rendered page looks like",
        body: [
          "Sites that define print styles convert beautifully, because the site's own authors decided what a printed version should contain — navigation removed, content widened, ink-heavy backgrounds dropped.",
          "Sites that do not are captured as they appear on screen, complete with sticky headers, cookie banners and consent dialogues frozen into the document. Content that loads as you scroll may be missing entirely, since it never had a reason to load. Neither is recoverable from the PDF afterwards, which is why an important capture is worth checking rather than filing unseen.",
        ],
      },
      {
        h: "Archiving a page properly",
        body: [
          "A PDF captures how a page looked at one moment, which is exactly what you want for a receipt, a published price, a set of terms or anything that may be disputed later. Note the date somewhere in or alongside the file, because the PDF itself will not say when it was taken.",
          "It is a snapshot rather than a copy of the site: interactive elements are static, links leaving the page still point outward, and video is a still frame. For something that must be preserved as evidence, capture it as soon as you notice it — the page you are archiving is one deploy away from being different.",
        ],
      },
    ],
    faq: [
      {
        q: "Can it convert a page behind a login?",
        a: "No. Our renderer fetches the URL as an anonymous visitor with no session, so a page requiring authentication returns its login screen. Use your browser's own Print to PDF for pages you are signed in to.",
      },
      {
        q: "What is sent to the server?",
        a: "The URL. Our server fetches and renders that page and streams the PDF back, storing nothing — so unlike the file-based tools, there is no document of yours involved at all.",
      },
    ],
  },
};

export const TOOL_DEPTH: Record<string, Depth> = {
  ...ORGANIZE_DEPTH,
  ...EDIT_DEPTH,
  ...CONVERT_DEPTH,
  ...SECURITY_DEPTH,
  ...SERVER_DEPTH,
};

export const TOOLS: Tool[] = TOOL_BASE.map((t) => {
  const depth = TOOL_DEPTH[t.slug];
  if (!depth) throw new Error(`${t.slug} has no TOOL_DEPTH entry`);
  return {
    ...t,
    lead: depth.lead,
    sections: depth.sections,
    faq: [...t.faq, ...depth.faq],
  };
});

export const CATEGORIES = [
  "Organize",
  "Convert",
  "Edit & Sign",
  "Security",
  "More",
] as const;

// --- Competitor comparison ---
// Kept out of TOOLS on purpose: a prose page has no `kind`, no client
// component, and would trip the registry invariants in tests/tools.test.mjs.
//
// The honesty rule that governs TOOLS governs this page harder. 10 of our 34
// tools run server-side (Office conversions, OCR, PDF/A, repair, URL-to-PDF),
// so a blanket "your files never leave your device — unlike iLovePDF" claim
// would be false on exactly the axis this page asks readers to trust us on.
// Every privacy statement below is scoped to the tools it is true of, and
// tests/tools.test.mjs enforces that.
//
// Competitor numbers are quoted from iLovePDF's own pricing and legal pages
// (see `sources`) and were checked on the `updated` date. Re-check before edit.

export const COMPARISONS: Comparison[] = [
  {
    slug: "ilovepdf-alternative",
    competitor: "iLovePDF",
    title: "iLovePDF Alternative — Free PDF Tools, No Task Limits",
    desc: "A free iLovePDF alternative with no task caps and no $7/mo upgrade: 34 PDF tools, 24 running entirely in your browser. Honest comparison, including where iLovePDF wins.",
    h1: "The free iLovePDF alternative",
    intro:
      "iLovePDF is a genuinely good product and this page is not going to pretend otherwise. But its free tier is metered — two Compress tasks, no OCR, no PDF/A — and lifting those limits costs $7 a month. PaperKit is our PDF suite: 34 tools, no task counters, no account. Here is the honest comparison, including the parts where iLovePDF is the better choice.",
    sections: [
      {
        h: "Should you switch? The short answer",
        body: [
          "Switch if you keep running into iLovePDF's task counters, if you do not want to pay $7 a month to compress more than two files, or if you handle documents that should not be uploaded anywhere — contracts, medical records, payslips, anything under NDA. Twenty-four of our thirty-four tools do their work in the browser tab and never transmit the file.",
          "Stay with iLovePDF if you need its desktop or mobile apps, if you want an account that keeps a task history across devices, or if you need the highest-fidelity PDF-to-Word conversion and are willing to pay for it. Those are real advantages and we do not match them.",
          "Disclosure: PaperKit is our tool. Every iLovePDF figure below is quoted from their own pricing and legal pages, linked at the bottom.",
        ],
      },
      {
        h: "The free-tier limits you are hitting",
        body: [
          "iLovePDF's free tier is not limited by file size so much as by how often you may use it. As published on their pricing page: Compress PDF allows 200 MB but only 2 tasks; Merge PDF allows 100 MB across 25 tasks; Rotate allows 20 tasks; Image to PDF caps at 40 MB and PDF to JPG at 25 MB.",
          'Two whole features are simply switched off for free accounts: OCR — both "PDF to Word (OCR)" and "PDF to Excel (OCR)" are listed as unavailable — and PDF to PDF/A, the archival format people usually need precisely once, under deadline, for a submission portal.',
          "Removing the caps means Premium at $7 per month, or $48 billed annually (about $4 a month). That is a fair price for a tool you use daily. It is a strange price for compressing three PDFs in a year.",
          "PaperKit has no task counter and no account, so there is nothing to meter. What we do have is a practical ceiling in the other direction: browser-based tools are bounded by your device's memory, so a 500 MB scanned PDF may struggle on an old phone where a server-side service would not.",
        ],
      },
      {
        h: "Where your files actually go — the part that needs precision",
        body: [
          'iLovePDF uploads. Their legal page states it plainly: "Files you upload and process are encrypted and deleted from our servers within 2 hours", and that iLovePDF "does not access, use, analyze or store any processed data". That is a reasonable policy, honestly disclosed. It is still an upload.',
          "PaperKit is split, and we are not going to blur it. Twenty-four tools — merge, split, compress, rotate, organise, crop, watermark, page numbers, sign, redact, protect, unlock, compare, PDF to JPG, JPG to PDF, PDF to text and the rest — run on pdf-lib and pdf.js inside your browser. Open your network tab while you use them: the file never goes anywhere. They keep working with your connection switched off after the page loads.",
          "Ten tools cannot work that way. PDF to Word, Excel and PowerPoint, the three reverse Office conversions, OCR, PDF/A, Repair and URL-to-PDF need LibreOffice, an OCR engine or a real browser — none of which fit in a tab. Those stream through our server and are never written to disk, but they are uploads, and each of those pages says so on its own page rather than hiding it here.",
          "So the accurate version of the privacy claim is: for most of what people do with PDFs, PaperKit does not transmit the file at all; for the hard conversions, both services upload, and the difference narrows to what happens afterwards.",
        ],
      },
      {
        h: "Where iLovePDF is genuinely better",
        body: [
          "Conversion fidelity. Server-side LibreOffice and commercial PDF engines produce different results, and for a heavily formatted PDF to Word conversion iLovePDF's output is often cleaner than ours. If the document is a legal contract whose layout must survive intact, test both before committing.",
          "Apps and continuity. iLovePDF ships desktop and mobile apps and an account that carries your work between them. PaperKit is a website with no account, which means nothing to sync and also nothing to come back to.",
          "Very large files on weak hardware. Because their processing happens on a server, a 300 MB scan is their server's problem. On PaperKit it is your laptop's problem, and on a low-memory device that is a real difference.",
        ],
      },
      {
        h: "How to switch",
        body: [
          "There is nothing to migrate — no account, no stored files, no export step. Bookmark the tool you use most and carry on.",
          "The most common starting points are merging, splitting and compressing; all three are linked below. If you arrived here because you hit the two-task compression limit, that is the one to try first.",
        ],
      },
    ],
    matrix: [
      {
        feature: "Price",
        us: "Free",
        them: "Free / $7 mo",
        note: "iLovePDF Premium is $7 monthly or $48 billed annually (about $4/month). Business is custom-priced.",
      },
      { feature: "Account required", us: "No", them: "No (free tier)" },
      {
        feature: "Compress PDF limit",
        us: "No task cap",
        them: "2 tasks · 200 MB",
      },
      {
        feature: "Merge PDF limit",
        us: "No task cap",
        them: "25 tasks · 100 MB",
      },
      {
        feature: "OCR on the free tier",
        us: "Yes",
        them: "No",
        note: "iLovePDF lists PDF to Word (OCR) and PDF to Excel (OCR) as unavailable on Basic. Our OCR is a server-side conversion.",
      },
      {
        feature: "PDF/A on the free tier",
        us: "Yes",
        them: "No",
        note: "Also a server-side conversion on our side.",
      },
      { feature: "Watermark on output", us: "None", them: "None" },
      { feature: "Number of tools", us: "34", them: "33" },
      {
        feature: "Runs in your browser, no upload",
        us: "24 of 34 tools",
        them: "No",
        note: "Our Office conversions, OCR, PDF/A, repair and URL-to-PDF stream through a server like theirs. Every other tool does not transmit the file at all.",
      },
      {
        feature: "Files stored after processing",
        us: "Never written to disk",
        them: "Deleted within 2h",
        note: 'Their wording: files are "encrypted and deleted from our servers within 2 hours".',
      },
      {
        feature: "Works offline after page load",
        us: "The 24 in-browser tools",
        them: "No",
      },
      {
        feature: "Desktop & mobile apps",
        us: "No",
        them: "Premium",
      },
    ],
    sources: [
      { label: "iLovePDF pricing", url: "https://www.ilovepdf.com/pricing" },
      {
        label: "iLovePDF legal & privacy",
        url: "https://www.ilovepdf.com/help/legal",
      },
    ],
    updated: "2026-08-01",
    faq: [
      {
        q: "Is there a completely free alternative to iLovePDF?",
        a: "PaperKit is free with no task counter, no account and no watermark across all 34 tools, including OCR and PDF/A, which iLovePDF reserves for paid plans. It is ad-supported, which is how it stays free.",
      },
      {
        q: "What are iLovePDF's free limits exactly?",
        a: "Per their pricing page: Compress PDF is 2 tasks at up to 200 MB, Merge PDF is 25 tasks at up to 100 MB, Rotate is 20 tasks, Image to PDF caps at 40 MB and PDF to JPG at 25 MB. OCR and PDF/A are not available on the free tier at all. Premium is $7 a month or $48 a year.",
      },
      {
        q: "Do my PDFs get uploaded here?",
        a: "It depends on the tool, and we would rather be precise than reassuring. Twenty-four of the thirty-four tools — merge, split, compress, rotate, organise, sign, redact, protect, unlock and the rest — process the file inside your browser and transmit nothing. The other ten (Office conversions, OCR, PDF/A, repair and URL-to-PDF) are processed on our server because they need LibreOffice or an OCR engine; those files stream through and are never written to disk. Each of those pages says so.",
      },
      {
        q: "Does iLovePDF keep my files?",
        a: "Their legal page states files are encrypted and deleted from their servers within 2 hours, and that they do not access, analyse or store processed data. It is a clear policy — but the file does get uploaded, which is the part you are choosing between.",
      },
      {
        q: "Which is better for PDF to Word?",
        a: "Often iLovePDF, if the document is heavily formatted. Both of us run the conversion on a server, and their engine frequently produces a cleaner result on complex layouts. The difference is that ours is not behind a task counter. For an important document, run it through both and keep the better output.",
      },
      {
        q: "Is PaperKit's OCR really free?",
        a: "Yes. OCR is one of the ten conversions that run on our server rather than in your browser, and it is not metered or gated. On iLovePDF, OCR requires Premium.",
      },
    ],
  },
];
