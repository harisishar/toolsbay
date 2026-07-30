import type { Faq } from "./seo.js";

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
  intro: string;
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

export const TOOLS: Tool[] = [
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

export const CATEGORIES = [
  "Organize",
  "Convert",
  "Edit & Sign",
  "Security",
  "More",
] as const;
