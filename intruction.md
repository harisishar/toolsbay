goal of this system is to build a multiple tools in single repo.

those tools will have its own sub domain.

tech stack use are:
- HTMX + AlpineJS + Typescript
- HONO + Bun
- Most of the application not require the database. If need to upload just use localstorage
- cloudflare workers


Manage each tools in its own folder.

These are the list of the tools:

#1 Recreate Calculator.net with all it calculator and include Malaysia KWSP calculation and Malaysia Salary deduction calculation. Also include all Famous country salary deduction calculator, maybe they have a tax include in those calculation etc

#2 — Client-Side Image Tools Suite (compress / resize / convert / crop)

What/why: "image compressor," "resize image," "jpg to png," "heic to jpg." Universal, recurring, all doable in-browser via Canvas/WebAssembly — zero server cost.
Demand: imageresizer.com, imagecompressor.com (~1.47M), resizepixel.com (~3.19M), bigjpg.com (~1.73M), TinyPNG, iloveimg.
Keywords: "image compressor," "resize image," "compress jpg," "png to jpg," "webp converter," "heic to jpg."
RPM/revenue: tech/graphics, mixed global ~$3–$8 RPM → ~$3,000–$8,000/mo at 1M.
Competition: medium-high, but format-pair long-tail is enormous ("x to y" across dozens of formats). Programmatic per-conversion pages.
Feasibility: excellent — fully client-side; Cloudflare's free bandwidth removes egress risk. No API cost.
APAC: localize UI strings; add region-popular formats.

#3 recreate ilovepdf.com
best if we can have these features:
Merge PDF
Combine PDFs in the order you want with the easiest PDF merger available.

Split PDF
Separate one page or a whole set for easy conversion into independent PDF files.

Compress PDF
Reduce file size while optimizing for maximal PDF quality.

PDF to Word
Easily convert your PDF files into easy to edit DOC and DOCX documents. The converted WORD document is almost 100% accurate.

PDF to PowerPoint
Turn your PDF files into easy to edit PPT and PPTX slideshows.

PDF to Excel
Pull data straight from PDFs into Excel spreadsheets in a few short seconds.

Word to PDF
Make DOC and DOCX files easy to read by converting them to PDF.

PowerPoint to PDF
Make PPT and PPTX slideshows easy to view by converting them to PDF.

Excel to PDF
Make EXCEL spreadsheets easy to read by converting them to PDF.

Edit PDF
Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.

PDF to JPG
Convert each PDF page into a JPG or extract all images contained in a PDF.

JPG to PDF
Convert JPG images to PDF in seconds. Easily adjust orientation and margins.

Sign PDF
Sign yourself or request electronic signatures from others.

Watermark
Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.

Rotate PDF
Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!

HTML to PDF
Convert webpages in HTML to PDF. Copy and paste the URL of the page you want and convert it to PDF with a click.

Unlock PDF
Remove PDF password security, giving you the freedom to use your PDFs as you want.

Protect PDF
Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.

Organize PDF
Sort pages of your PDF file however you like. Delete PDF pages or add PDF pages to your document at your convenience.

PDF to PDF/A
Transform your PDF to PDF/A, the ISO-standardized version of PDF for long-term archiving. Your PDF will preserve formatting when accessed in the future.

Repair PDF
Repair a damaged PDF and recover data from corrupt PDF. Fix PDF files with our Repair tool.

Page numbers
Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.

Scan to PDF
Capture document scans from your mobile device and send them instantly to your browser.

OCR PDF
Easily convert scanned PDF into searchable and selectable documents.

Compare PDF
Show a side-by-side document comparison and easily spot changes between different file versions.

Redact PDF
Redact text and graphics to permanently remove sensitive information from a PDF.

Crop PDF
Crop margins of PDF documents or select specific areas, then apply the changes to one page or the whole document.

PDF Forms
Detect form fields automatically, create interactive fillable PDFs, or fill PDF forms yourself. Add text fields, checkboxes, multiple choice fields, and lists.

PDF to Markdown


#4 — QR Code & Barcode Generator

What/why: "qr code generator," plus vCard/WiFi/URL QR. Big SMB and consumer demand; static QR is fully client-side.
Demand: qr-code-generator.com ~7.2M/mo; me-qr.com ~37.5M; the-qrcode-generator ~1.9M. 
Similarweb
Similarweb
Keywords: "qr code generator," "free qr code," "wifi qr code," "vcard qr."
RPM/revenue: general/SMB, mixed global ~$3–$8 RPM → ~$3,000–$8,000/mo. Note: many rivals monetize via dynamic-QR subscriptions, not ads.
Competition: high; the static-QR long-tail (per use case) is the opening.
Feasibility: static QR = client-side library, free. Dynamic QR needs storage (Cloudflare KV/D1) — keep optional.
APAC: QR payments are huge in APAC (PayNow, UPI, PromptPay) — localized "how to make a payment QR" content.

-----------

For the UI/UX its should be straight forward but keep the design modern and clean. if require use and ui libraries I believe utilise tailwind & shadcn is a must use /frontend-design skills

-----------

Use Fable 5 for planing and Opus 5 for execution.

---------

Also let me know if the tech stack are up to the task require to build these application or do we need to use modern framework like nextjs.

Lastly each of the tools much have they own SEO AEO GEO Optimasation to ensure the traffic come in organically use /seo-geo skills