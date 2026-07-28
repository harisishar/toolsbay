// Alpine components for every client-side PDF feature. The heavy engine
// (pdf-lib + pdfjs) is a lazy chunk loaded on first use.
import { parseRanges, parseRangeGroups, outName } from '../lib/ranges.js';

type Eng = typeof import('./engine.js');
let engP: Promise<Eng> | null = null;
const eng = (): Promise<Eng> => (engP ??= import('./engine.js'));

const isPdf = (f: File) => f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
const firstPdf = (list: FileList | File[]) => Array.from(list).find(isPdf) ?? null;

function friendly(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/encrypted/i.test(msg) || (e as Error)?.constructor?.name === 'EncryptedPDFError')
    return 'This PDF is password-protected. Use the Unlock PDF tool first.';
  if (/password/i.test(msg)) return 'Wrong password for this PDF.';
  return msg || 'Something went wrong processing this PDF.';
}

// Shared state/methods for tools that operate on one picked PDF.
function onePdf() {
  return {
    file: null as File | null,
    name: '',
    pages: 0,
    busy: false,
    error: '',
    dragover: false,
    accept: '.pdf,application/pdf',
    async pick(this: any, list: FileList | File[]) {
      this.dragover = false;
      const f = firstPdf(list);
      if (!f) return;
      this.error = '';
      this.busy = true;
      try {
        const E = await eng();
        const view = await E.loadView(f);
        this.pages = view.numPages;
        void view.destroy();
        this.file = f;
        this.name = f.name;
        if (this.onPicked) await this.onPicked();
      } catch (e) {
        this.error = friendly(e);
      } finally {
        this.busy = false;
      }
    },
    reset(this: any) {
      this.file = null;
      this.name = '';
      this.pages = 0;
      this.error = '';
    },
    async guard(this: any, fn: () => Promise<void>) {
      if (!this.file || this.busy) return;
      this.busy = true;
      this.error = '';
      try {
        await fn();
      } catch (e) {
        this.error = friendly(e);
      } finally {
        this.busy = false;
      }
    },
  };
}

/* ---------- merge ---------- */
function mergePdf() {
  return {
    items: [] as { file: File; name: string; pages: number }[],
    busy: false,
    error: '',
    dragover: false,
    accept: '.pdf,application/pdf',
    async pick(list: FileList | File[]) {
      this.dragover = false;
      this.error = '';
      const E = await eng();
      for (const f of Array.from(list).filter(isPdf)) {
        try {
          const view = await E.loadView(f);
          this.items.push({ file: f, name: f.name, pages: view.numPages });
          void view.destroy();
        } catch (e) {
          this.error = `${f.name}: ${friendly(e)}`;
        }
      }
    },
    move(i: number, d: number) {
      const j = i + d;
      if (j < 0 || j >= this.items.length) return;
      const [it] = this.items.splice(i, 1);
      this.items.splice(j, 0, it!);
    },
    remove(i: number) {
      this.items.splice(i, 1);
    },
    async run(this: any) {
      if (this.items.length < 2 || this.busy) return;
      this.busy = true;
      this.error = '';
      try {
        const E = await eng();
        const merged = await E.PDFDocument.create();
        for (const it of this.items) {
          const src = await E.loadLib(it.file);
          const pages = await merged.copyPages(src, src.getPageIndices());
          pages.forEach((p) => merged.addPage(p));
        }
        await E.saveAndDownload(merged, 'merged.pdf');
      } catch (e) {
        this.error = friendly(e);
      } finally {
        this.busy = false;
      }
    },
  };
}

/* ---------- split ---------- */
function splitPdf() {
  return {
    ...onePdf(),
    ranges: '',
    mode: 'groups' as 'groups' | 'each',
    run(this: any) {
      return this.guard(async () => {
        const E = await eng();
        const lib = await E.loadLib(this.file);
        const groups =
          this.mode === 'each'
            ? Array.from({ length: this.pages }, (_, i) => [i])
            : parseRangeGroups(this.ranges, this.pages);
        const outs: Record<string, Uint8Array> = {};
        for (let g = 0; g < groups.length; g++) {
          const nd = await E.PDFDocument.create();
          const ps = await nd.copyPages(lib, groups[g]!);
          ps.forEach((p) => nd.addPage(p));
          outs[outName(this.name, `part-${g + 1}`)] = await nd.save();
        }
        const names = Object.keys(outs);
        if (names.length === 1) {
          E.downloadBlob(outs[names[0]!]! as unknown as BlobPart, names[0]!);
        } else {
          E.zipAndDownload(outs, outName(this.name, 'split', 'zip'));
        }
      });
    },
  };
}

/* ---------- rotate ---------- */
function rotatePdf() {
  return {
    ...onePdf(),
    angle: 90,
    ranges: '',
    run(this: any) {
      return this.guard(async () => {
        const E = await eng();
        const lib = await E.loadLib(this.file);
        for (const idx of parseRanges(this.ranges, this.pages)) {
          const page = lib.getPage(idx);
          page.setRotation(E.degrees((page.getRotation().angle + Number(this.angle)) % 360));
        }
        await E.saveAndDownload(lib, outName(this.name, 'rotated'));
      });
    },
  };
}

/* ---------- organize ---------- */
function organizePdf() {
  return {
    ...onePdf(),
    thumbs: [] as { idx: number; src: string; rot: number }[],
    async onPicked(this: any) {
      const E = await eng();
      const view = await E.loadView(this.file);
      const thumbs: { idx: number; src: string; rot: number }[] = [];
      for (let i = 1; i <= view.numPages; i++) {
        const page = await view.getPage(i);
        const scale = 150 / page.getViewport({ scale: 1 }).width;
        const canvas = await E.renderPage(view, i, scale);
        thumbs.push({ idx: i - 1, src: canvas.toDataURL('image/jpeg', 0.7), rot: 0 });
      }
      void view.destroy();
      this.thumbs = thumbs;
    },
    move(i: number, d: number) {
      const j = i + d;
      if (j < 0 || j >= this.thumbs.length) return;
      const [t] = this.thumbs.splice(i, 1);
      this.thumbs.splice(j, 0, t!);
    },
    rotate(i: number) {
      this.thumbs[i]!.rot = (this.thumbs[i]!.rot + 90) % 360;
    },
    remove(i: number) {
      this.thumbs.splice(i, 1);
    },
    run(this: any) {
      return this.guard(async () => {
        if (!this.thumbs.length) throw new Error('All pages were deleted.');
        const E = await eng();
        const lib = await E.loadLib(this.file);
        const nd = await E.PDFDocument.create();
        const copied = await nd.copyPages(
          lib,
          this.thumbs.map((t: { idx: number }) => t.idx),
        );
        copied.forEach((p, i) => {
          const extra = this.thumbs[i]!.rot;
          if (extra) p.setRotation(E.degrees((p.getRotation().angle + extra) % 360));
          nd.addPage(p);
        });
        await E.saveAndDownload(nd, outName(this.name, 'organized'));
      });
    },
  };
}

/* ---------- page numbers ---------- */
function pageNumbersPdf() {
  return {
    ...onePdf(),
    pos: 'bc',
    start: 1,
    size: 12,
    run(this: any) {
      return this.guard(async () => {
        const E = await eng();
        const lib = await E.loadLib(this.file);
        const font = await lib.embedFont(E.StandardFonts.Helvetica);
        const size = Number(this.size);
        const margin = 28;
        let n = Number(this.start);
        for (const page of lib.getPages()) {
          const { width, height } = page.getSize();
          const text = String(n++);
          const tw = font.widthOfTextAtSize(text, size);
          const x = this.pos.endsWith('l') ? margin : this.pos.endsWith('r') ? width - margin - tw : (width - tw) / 2;
          const y = this.pos.startsWith('t') ? height - margin - size : margin;
          page.drawText(text, { x, y, size, font, color: E.rgb(0.2, 0.2, 0.2) });
        }
        await E.saveAndDownload(lib, outName(this.name, 'numbered'));
      });
    },
  };
}

/* ---------- watermark ---------- */
function hexRgb(hex: string) {
  const m = hex.match(/^#?(..)(..)(..)$/);
  return m ? m.slice(1).map((h) => parseInt(h!, 16) / 255) : [0.8, 0.1, 0.1];
}

function watermarkPdf() {
  return {
    ...onePdf(),
    mode: 'text' as 'text' | 'image',
    text: 'CONFIDENTIAL',
    size: 48,
    opacity: 0.25,
    rotation: 45,
    color: '#d33030',
    tile: false,
    imgFile: null as File | null,
    pickImg(list: FileList) {
      this.imgFile = Array.from(list).find((f) => /^image\//.test(f.type)) ?? null;
    },
    run(this: any) {
      return this.guard(async () => {
        const E = await eng();
        const lib = await E.loadLib(this.file);
        if (this.mode === 'text') {
          const font = await lib.embedFont(E.StandardFonts.HelveticaBold);
          const [r, g, b] = hexRgb(this.color);
          const size = Number(this.size);
          const tw = font.widthOfTextAtSize(this.text, size);
          for (const page of lib.getPages()) {
            const { width, height } = page.getSize();
            const opts = {
              size,
              font,
              color: E.rgb(r!, g!, b!),
              opacity: Number(this.opacity),
              rotate: E.degrees(Number(this.rotation)),
            };
            if (this.tile) {
              for (let x = -tw; x < width + tw; x += tw + 120)
                for (let y = -60; y < height + 60; y += 180) page.drawText(this.text, { ...opts, x, y });
            } else {
              page.drawText(this.text, { ...opts, x: (width - tw) / 2, y: height / 2 });
            }
          }
        } else {
          if (!this.imgFile) throw new Error('Choose a watermark image first.');
          const img = await E.embedAnyImage(lib, this.imgFile);
          for (const page of lib.getPages()) {
            const { width, height } = page.getSize();
            const w = width * 0.5;
            const h = (img.height / img.width) * w;
            page.drawImage(img, {
              x: (width - w) / 2,
              y: (height - h) / 2,
              width: w,
              height: h,
              opacity: Number(this.opacity),
            });
          }
        }
        await E.saveAndDownload(lib, outName(this.name, 'watermarked'));
      });
    },
  };
}

/* ---------- crop ---------- */
function cropPdf() {
  return {
    ...onePdf(),
    sel: null as { x: number; y: number; w: number; h: number } | null,
    dragging: false,
    sx: 0,
    sy: 0,
    applyAll: true,
    async onPicked(this: any) {
      const E = await eng();
      const view = await E.loadView(this.file);
      const page = await view.getPage(1);
      const scale = Math.min(640 / page.getViewport({ scale: 1 }).width, 2);
      const canvas = this.$refs.stage as HTMLCanvasElement;
      await E.renderPage(view, 1, scale, canvas);
      void view.destroy();
      this.sel = null;
      this.snapshot = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height);
    },
    paint(this: any) {
      const canvas = this.$refs.stage as HTMLCanvasElement;
      const ctx = canvas.getContext('2d')!;
      ctx.putImageData(this.snapshot, 0, 0);
      if (this.sel) {
        ctx.fillStyle = 'rgba(20,16,12,0.45)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(this.snapshot, 0, 0, this.sel.x, this.sel.y, this.sel.w, this.sel.h);
        ctx.strokeStyle = '#b3402a';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.sel.x, this.sel.y, this.sel.w, this.sel.h);
      }
    },
    pointer(this: any, e: PointerEvent, phase: string) {
      const canvas = this.$refs.stage as HTMLCanvasElement;
      const r = canvas.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - r.left, 0), canvas.width);
      const y = Math.min(Math.max(e.clientY - r.top, 0), canvas.height);
      if (phase === 'down') {
        this.dragging = true;
        this.sx = x;
        this.sy = y;
      } else if (phase === 'move' && this.dragging) {
        this.sel = {
          x: Math.min(this.sx, x),
          y: Math.min(this.sy, y),
          w: Math.abs(x - this.sx),
          h: Math.abs(y - this.sy),
        };
        this.paint();
      } else if (phase === 'up') {
        this.dragging = false;
      }
    },
    run(this: any) {
      return this.guard(async () => {
        if (!this.sel || this.sel.w < 8) throw new Error('Drag a crop area on the preview first.');
        const E = await eng();
        const lib = await E.loadLib(this.file);
        const first = lib.getPage(0);
        const canvas = this.$refs.stage as HTMLCanvasElement;
        const scale = canvas.width / first.getSize().width;
        const idxs = this.applyAll ? lib.getPageIndices() : [0];
        for (const i of idxs) {
          const page = lib.getPage(i);
          const h = page.getSize().height;
          page.setCropBox(
            this.sel.x / scale,
            h - (this.sel.y + this.sel.h) / scale,
            this.sel.w / scale,
            this.sel.h / scale,
          );
        }
        await E.saveAndDownload(lib, outName(this.name, 'cropped'));
      });
    },
  };
}

/* ---------- images -> pdf (also used by scan) ---------- */
async function buildPdfFromImages(
  files: (File | Blob)[],
  pageSize: string,
  E: Eng,
): Promise<import('@cantoo/pdf-lib').PDFDocument> {
  const doc = await E.PDFDocument.create();
  const SIZES: Record<string, [number, number]> = { a4: [595.28, 841.89], letter: [612, 792] };
  for (const f of files) {
    const file = f instanceof File ? f : new File([f], 'scan.jpg', { type: 'image/jpeg' });
    const img = await E.embedAnyImage(doc, file);
    if (pageSize === 'auto') {
      const w = img.width * 0.75;
      const h = img.height * 0.75;
      doc.addPage([w, h]).drawImage(img, { x: 0, y: 0, width: w, height: h });
    } else {
      let [pw, ph] = SIZES[pageSize] ?? SIZES.a4!;
      if (img.width > img.height) [pw, ph] = [ph!, pw!];
      const margin = 24;
      const s = Math.min((pw! - margin * 2) / img.width, (ph! - margin * 2) / img.height);
      const w = img.width * s;
      const h = img.height * s;
      doc.addPage([pw!, ph!]).drawImage(img, { x: (pw! - w) / 2, y: (ph! - h) / 2, width: w, height: h });
    }
  }
  return doc;
}

function imgToPdf() {
  return {
    files: [] as File[],
    pageSize: 'auto',
    busy: false,
    error: '',
    dragover: false,
    accept: 'image/*,.heic,.heif',
    pick(list: FileList | File[]) {
      this.dragover = false;
      this.files.push(...Array.from(list).filter((f) => /^image\//.test(f.type)));
    },
    move(i: number, d: number) {
      const j = i + d;
      if (j < 0 || j >= this.files.length) return;
      const [f] = this.files.splice(i, 1);
      this.files.splice(j, 0, f!);
    },
    remove(i: number) {
      this.files.splice(i, 1);
    },
    async run(this: any) {
      if (!this.files.length || this.busy) return;
      this.busy = true;
      this.error = '';
      try {
        const E = await eng();
        const doc = await buildPdfFromImages(this.files, this.pageSize, E);
        await E.saveAndDownload(doc, 'images.pdf');
      } catch (e) {
        this.error = friendly(e);
      } finally {
        this.busy = false;
      }
    },
  };
}

/* ---------- pdf -> jpg / extract images ---------- */
function pdfToJpg() {
  return {
    ...onePdf(),
    scale: 2,
    fmt: 'jpeg',
    ranges: '',
    extractMode: false,
    run(this: any) {
      return this.guard(async () => {
        const E = await eng();
        const view = await E.loadView(this.file);
        const outs: Record<string, Uint8Array> = {};
        if (this.extractMode) {
          let n = 0;
          const seen = new Set<string>();
          for (let p = 1; p <= view.numPages; p++) {
            const page = await view.getPage(p);
            const ops = await page.getOperatorList();
            for (let i = 0; i < ops.fnArray.length; i++) {
              if (ops.fnArray[i] !== E.pdfjs.OPS.paintImageXObject) continue;
              const id = ops.argsArray[i]![0] as string;
              if (seen.has(id)) continue;
              seen.add(id);
              try {
                const obj: any = await new Promise((res, rej) => {
                  try {
                    page.objs.get(id, res);
                  } catch (e) {
                    rej(e);
                  }
                });
                const canvas = document.createElement('canvas');
                if (obj?.bitmap) {
                  canvas.width = obj.bitmap.width;
                  canvas.height = obj.bitmap.height;
                  canvas.getContext('2d')!.drawImage(obj.bitmap, 0, 0);
                } else if (obj?.data) {
                  canvas.width = obj.width;
                  canvas.height = obj.height;
                  const imgData = new ImageData(new Uint8ClampedArray(obj.data), obj.width, obj.height);
                  canvas.getContext('2d')!.putImageData(imgData, 0, 0);
                } else {
                  continue;
                }
                const blob = await E.canvasToPng(canvas);
                outs[`image-${++n}.png`] = new Uint8Array(await blob.arrayBuffer());
              } catch {
                /* skip images pdfjs cannot decode standalone */
              }
            }
          }
          if (!n) throw new Error('No embedded images found — try "Convert pages to JPG" instead.');
        } else {
          const idxs = parseRanges(this.ranges, view.numPages);
          for (const idx of idxs) {
            const canvas = await E.renderPage(view, idx + 1, Number(this.scale));
            const blob =
              this.fmt === 'png' ? await E.canvasToPng(canvas) : await E.canvasToJpeg(canvas, 0.9);
            outs[outName(this.name, `page-${idx + 1}`, this.fmt === 'png' ? 'png' : 'jpg')] =
              new Uint8Array(await blob.arrayBuffer());
          }
        }
        void view.destroy();
        const names = Object.keys(outs);
        if (names.length === 1) {
          E.downloadBlob(outs[names[0]!]! as unknown as BlobPart, names[0]!, 'image/*');
        } else {
          E.zipAndDownload(outs, outName(this.name, 'images', 'zip'));
        }
      });
    },
  };
}

/* ---------- compress ---------- */
function compressPdf() {
  return {
    ...onePdf(),
    quality: 0.7,
    scale: 1.5,
    resultText: '',
    run(this: any) {
      return this.guard(async () => {
        this.resultText = '';
        const E = await eng();
        const view = await E.loadView(this.file);
        const doc = await E.PDFDocument.create();
        for (let p = 1; p <= view.numPages; p++) {
          const page = await view.getPage(p);
          const v1 = page.getViewport({ scale: 1 });
          const canvas = await E.renderPage(view, p, Number(this.scale));
          const blob = await E.canvasToJpeg(canvas, Number(this.quality));
          const img = await doc.embedJpg(new Uint8Array(await blob.arrayBuffer()));
          doc.addPage([v1.width, v1.height]).drawImage(img, {
            x: 0,
            y: 0,
            width: v1.width,
            height: v1.height,
          });
        }
        void view.destroy();
        const bytes = await doc.save();
        const pct = Math.round((1 - bytes.length / this.file.size) * 100);
        this.resultText =
          pct > 0
            ? `Compressed: ${(this.file.size / 1048576).toFixed(2)} MB → ${(bytes.length / 1048576).toFixed(2)} MB (−${pct}%)`
            : 'This PDF is already smaller than the rasterized version — original kept.';
        if (pct > 0) E.downloadBlob(bytes as unknown as BlobPart, outName(this.name, 'compressed'));
      });
    },
  };
}

/* ---------- protect / unlock ---------- */
function protectPdf() {
  return {
    ...onePdf(),
    userPw: '',
    ownerPw: '',
    allowPrint: true,
    allowCopy: false,
    run(this: any) {
      return this.guard(async () => {
        if (!this.userPw) throw new Error('Enter a password.');
        const E = await eng();
        const lib = await E.loadLib(this.file);
        lib.encrypt({
          userPassword: this.userPw,
          ownerPassword: this.ownerPw || undefined,
          permissions: {
            printing: this.allowPrint ? 'highResolution' : undefined,
            copying: this.allowCopy,
          },
        });
        await E.saveAndDownload(lib, outName(this.name, 'protected'));
      });
    },
  };
}

function unlockPdf() {
  return {
    ...onePdf(),
    password: '',
    // picking encrypted PDFs fails pageCount probe — override pick to skip probing
    async pick(this: any, list: FileList | File[]) {
      this.dragover = false;
      const f = firstPdf(list);
      if (!f) return;
      this.file = f;
      this.name = f.name;
      this.error = '';
    },
    run(this: any) {
      return this.guard(async () => {
        const E = await eng();
        const lib = await E.loadLib(this.file, this.password || undefined);
        await E.saveAndDownload(lib, outName(this.name, 'unlocked'));
      });
    },
  };
}

/* ---------- forms ---------- */
function formsPdf() {
  return {
    ...onePdf(),
    fields: [] as { name: string; kind: string; value: string; checked: boolean; options: string[] }[],
    flatten: false,
    async onPicked(this: any) {
      const E = await eng();
      const lib = await E.loadLib(this.file);
      const form = lib.getForm();
      this.fields = form.getFields().map((f: any) => {
        const kind = f.constructor.name;
        const out = { name: f.getName(), kind, value: '', checked: false, options: [] as string[] };
        try {
          if (kind === 'PDFTextField') out.value = f.getText() ?? '';
          if (kind === 'PDFCheckBox') out.checked = f.isChecked();
          if (kind === 'PDFDropdown' || kind === 'PDFOptionList' || kind === 'PDFRadioGroup') {
            out.options = f.getOptions();
            out.value = (kind === 'PDFRadioGroup' ? f.getSelected() : f.getSelected()?.[0]) ?? '';
          }
        } catch {
          /* leave defaults */
        }
        return out;
      });
      if (!this.fields.length) this.error = 'No fillable form fields found in this PDF.';
    },
    run(this: any) {
      return this.guard(async () => {
        const E = await eng();
        const lib = await E.loadLib(this.file);
        const form = lib.getForm();
        for (const f of this.fields) {
          try {
            const field: any = form.getField(f.name);
            if (f.kind === 'PDFTextField') field.setText(f.value);
            if (f.kind === 'PDFCheckBox') (f.checked ? field.check() : field.uncheck());
            if ((f.kind === 'PDFDropdown' || f.kind === 'PDFOptionList' || f.kind === 'PDFRadioGroup') && f.value)
              field.select(f.value);
          } catch {
            /* skip fields that reject values */
          }
        }
        if (this.flatten) form.flatten();
        await E.saveAndDownload(lib, outName(this.name, 'filled'));
      });
    },
  };
}

/* ---------- text / markdown ---------- */
function pdfToText() {
  return {
    ...onePdf(),
    mode: 'txt' as 'txt' | 'md',
    output: '',
    run(this: any) {
      return this.guard(async () => {
        const E = await eng();
        const view = await E.loadView(this.file);
        const pagesLines = [];
        for (let p = 1; p <= view.numPages; p++) pagesLines.push(await E.extractLines(view, p));
        void view.destroy();
        const heights = pagesLines.flat().map((l) => l.height).filter((h) => h > 0);
        heights.sort((a, b) => a - b);
        const med = heights[Math.floor(heights.length / 2)] ?? 12;
        const out: string[] = [];
        pagesLines.forEach((lines, pi) => {
          if (this.mode === 'md' && pi > 0) out.push('\n---\n');
          for (const l of lines) {
            let t = l.text.trimEnd();
            if (!t.trim()) continue;
            if (this.mode === 'md') {
              t = t.replace(/^[•▪‣◦]\s*/, '- ');
              if (l.height > med * 1.7) t = `# ${t}`;
              else if (l.height > med * 1.3) t = `## ${t}`;
            }
            out.push(t);
          }
          if (this.mode === 'txt') out.push('');
        });
        this.output = out.join('\n');
      });
    },
    download(this: any) {
      if (!this.output) return;
      void eng().then((E) =>
        E.downloadBlob(this.output, outName(this.name, 'text', this.mode), 'text/plain;charset=utf-8'),
      );
    },
  };
}

/* ---------- edit ---------- */
function editPdf() {
  return {
    ...onePdf(),
    page: 1,
    tool: 'draw',
    color: '#b3402a',
    strokeW: 3,
    fontSize: 20,
    text: '',
    imgFile: null as File | null,
    overlays: {} as Record<number, HTMLCanvasElement>,
    undoStack: [] as string[],
    drawing: false,
    lastX: 0,
    lastY: 0,
    dragBase: null as ImageData | null,
    async onPicked(this: any) {
      this.page = 1;
      this.overlays = {};
      await this.show();
    },
    async show(this: any) {
      const E = await eng();
      const view = await E.loadView(this.file);
      const pg = await view.getPage(this.page);
      const scale = Math.min(760 / pg.getViewport({ scale: 1 }).width, 2);
      const base = this.$refs.base as HTMLCanvasElement;
      await E.renderPage(view, this.page, scale, base);
      void view.destroy();
      const ov = this.$refs.ov as HTMLCanvasElement;
      const stored = this.overlays[this.page];
      ov.width = base.width;
      ov.height = base.height;
      const ctx = ov.getContext('2d')!;
      ctx.clearRect(0, 0, ov.width, ov.height);
      if (stored) ctx.drawImage(stored, 0, 0);
      this.undoStack = [];
    },
    persist(this: any) {
      const ov = this.$refs.ov as HTMLCanvasElement;
      const copy = document.createElement('canvas');
      copy.width = ov.width;
      copy.height = ov.height;
      copy.getContext('2d')!.drawImage(ov, 0, 0);
      this.overlays[this.page] = copy;
    },
    snapshot(this: any) {
      const ov = this.$refs.ov as HTMLCanvasElement;
      this.undoStack.push(ov.toDataURL());
      if (this.undoStack.length > 12) this.undoStack.shift();
    },
    undo(this: any) {
      const url = this.undoStack.pop();
      const ov = this.$refs.ov as HTMLCanvasElement;
      const ctx = ov.getContext('2d')!;
      ctx.clearRect(0, 0, ov.width, ov.height);
      if (url) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, ov.width, ov.height);
          ctx.drawImage(img, 0, 0);
          this.persist();
        };
        img.src = url;
      } else {
        this.persist();
      }
    },
    async go(this: any, d: number) {
      const n = this.page + d;
      if (n < 1 || n > this.pages) return;
      this.persist();
      this.page = n;
      await this.show();
    },
    pickImg(this: any, list: FileList) {
      this.imgFile = Array.from(list).find((f) => /^image\//.test(f.type)) ?? null;
    },
    async pointer(this: any, e: PointerEvent, phase: string) {
      const ov = this.$refs.ov as HTMLCanvasElement;
      const r = ov.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const ctx = ov.getContext('2d')!;
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;
      ctx.lineWidth = Number(this.strokeW);
      ctx.lineCap = 'round';
      if (phase === 'down') {
        this.snapshot();
        if (this.tool === 'text') {
          ctx.font = `${this.fontSize}px 'Public Sans', sans-serif`;
          ctx.fillText(this.text || 'Double-click to set text', x, y);
          this.persist();
          return;
        }
        if (this.tool === 'image') {
          if (!this.imgFile) return;
          const bmp = await createImageBitmap(this.imgFile);
          const w = Math.min(220, bmp.width);
          const h = (bmp.height / bmp.width) * w;
          ctx.drawImage(bmp, x - w / 2, y - h / 2, w, h);
          bmp.close();
          this.persist();
          return;
        }
        this.drawing = true;
        this.lastX = x;
        this.lastY = y;
        if (this.tool !== 'draw') this.dragBase = ctx.getImageData(0, 0, ov.width, ov.height);
      } else if (phase === 'move' && this.drawing) {
        if (this.tool === 'draw') {
          ctx.beginPath();
          ctx.moveTo(this.lastX, this.lastY);
          ctx.lineTo(x, y);
          ctx.stroke();
          this.lastX = x;
          this.lastY = y;
        } else if (this.dragBase) {
          ctx.putImageData(this.dragBase, 0, 0);
          ctx.strokeStyle = this.color;
          ctx.lineWidth = Number(this.strokeW);
          if (this.tool === 'rect') {
            ctx.strokeRect(this.lastX, this.lastY, x - this.lastX, y - this.lastY);
          } else if (this.tool === 'ellipse') {
            ctx.beginPath();
            ctx.ellipse(
              (this.lastX + x) / 2,
              (this.lastY + y) / 2,
              Math.abs(x - this.lastX) / 2,
              Math.abs(y - this.lastY) / 2,
              0,
              0,
              Math.PI * 2,
            );
            ctx.stroke();
          }
        }
      } else if (phase === 'up' && this.drawing) {
        this.drawing = false;
        this.dragBase = null;
        this.persist();
      }
    },
    run(this: any) {
      return this.guard(async () => {
        this.persist();
        const E = await eng();
        const lib = await E.loadLib(this.file);
        for (const [key, ov] of Object.entries(this.overlays)) {
          const canvas = ov as HTMLCanvasElement;
          const blank = !canvas
            .getContext('2d')!
            .getImageData(0, 0, canvas.width, canvas.height)
            .data.some((v: number) => v !== 0);
          if (blank) continue;
          const idx = Number(key) - 1;
          const page = lib.getPage(idx);
          const png = await E.canvasToPng(canvas);
          const img = await lib.embedPng(new Uint8Array(await png.arrayBuffer()));
          page.drawImage(img, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
        }
        await E.saveAndDownload(lib, outName(this.name, 'edited'));
      });
    },
  };
}

/* ---------- sign ---------- */
function signPdf() {
  return {
    ...onePdf(),
    page: 1,
    sigMode: 'draw' as 'draw' | 'type' | 'upload',
    typed: '',
    sigUrl: '',
    sigAspect: 0.35,
    widthPct: 25,
    placements: [] as { page: number; fx: number; fy: number; widthPct: number }[],
    padDrawing: false,
    async onPicked(this: any) {
      this.page = 1;
      this.placements = [];
      await this.show();
      this.initPad();
    },
    async show(this: any) {
      const E = await eng();
      const view = await E.loadView(this.file);
      const pg = await view.getPage(this.page);
      const scale = Math.min(700 / pg.getViewport({ scale: 1 }).width, 2);
      await E.renderPage(view, this.page, scale, this.$refs.stage as HTMLCanvasElement);
      void view.destroy();
      this.paintMarkers();
    },
    async go(this: any, d: number) {
      const n = this.page + d;
      if (n < 1 || n > this.pages) return;
      this.page = n;
      await this.show();
    },
    initPad(this: any) {
      const pad = this.$refs.pad as HTMLCanvasElement;
      pad.width = 400;
      pad.height = 140;
      const ctx = pad.getContext('2d')!;
      ctx.clearRect(0, 0, 400, 140);
      ctx.strokeStyle = '#1a1a1e';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
    },
    pad(this: any, e: PointerEvent, phase: string) {
      const pad = this.$refs.pad as HTMLCanvasElement;
      const r = pad.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const ctx = pad.getContext('2d')!;
      if (phase === 'down') {
        this.padDrawing = true;
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else if (phase === 'move' && this.padDrawing) {
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (phase === 'up') {
        this.padDrawing = false;
        this.updateSigFromPad();
      }
    },
    updateSigFromPad(this: any) {
      const pad = this.$refs.pad as HTMLCanvasElement;
      this.sigUrl = pad.toDataURL();
      this.sigAspect = pad.height / pad.width;
    },
    clearPad(this: any) {
      this.initPad();
      this.sigUrl = '';
    },
    async renderTyped(this: any) {
      if (!this.typed.trim()) return;
      await document.fonts.load("60px 'Caveat'");
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d')!;
      ctx.font = "60px 'Caveat', cursive";
      const w = Math.ceil(ctx.measureText(this.typed).width) + 40;
      c.width = w;
      c.height = 100;
      const ctx2 = c.getContext('2d')!;
      ctx2.font = "60px 'Caveat', cursive";
      ctx2.fillStyle = '#1a1a8e';
      ctx2.fillText(this.typed, 20, 68);
      this.sigUrl = c.toDataURL();
      this.sigAspect = c.height / c.width;
    },
    pickSig(this: any, list: FileList) {
      const f = Array.from(list).find((x) => /^image\//.test(x.type));
      if (!f) return;
      createImageBitmap(f).then((bmp) => {
        const c = document.createElement('canvas');
        c.width = bmp.width;
        c.height = bmp.height;
        c.getContext('2d')!.drawImage(bmp, 0, 0);
        this.sigAspect = bmp.height / bmp.width;
        this.sigUrl = c.toDataURL();
        bmp.close();
      });
    },
    place(this: any, e: MouseEvent) {
      if (!this.sigUrl) {
        this.error = 'Create a signature first (draw, type or upload).';
        return;
      }
      this.error = '';
      const stage = this.$refs.stage as HTMLCanvasElement;
      const r = stage.getBoundingClientRect();
      this.placements.push({
        page: this.page,
        fx: (e.clientX - r.left) / r.width,
        fy: (e.clientY - r.top) / r.height,
        widthPct: Number(this.widthPct),
      });
      this.paintMarkers();
    },
    paintMarkers(this: any) {
      if (!this.sigUrl) return;
      const stage = this.$refs.stage as HTMLCanvasElement;
      const ctx = stage.getContext('2d')!;
      const img = new Image();
      img.onload = () => {
        for (const pl of this.placements.filter((p: { page: number }) => p.page === this.page)) {
          const w = (pl.widthPct / 100) * stage.width;
          const h = w * this.sigAspect;
          ctx.drawImage(img, pl.fx * stage.width - w / 2, pl.fy * stage.height - h / 2, w, h);
        }
      };
      img.src = this.sigUrl;
    },
    clearPlacements(this: any) {
      this.placements = [];
      void this.show();
    },
    run(this: any) {
      return this.guard(async () => {
        if (!this.placements.length) throw new Error('Click on the page to place your signature.');
        const E = await eng();
        const lib = await E.loadLib(this.file);
        const png = await fetch(this.sigUrl).then((r) => r.arrayBuffer());
        const img = await lib.embedPng(new Uint8Array(png));
        for (const pl of this.placements) {
          const page = lib.getPage(pl.page - 1);
          const { width, height } = page.getSize();
          const w = (pl.widthPct / 100) * width;
          const h = w * this.sigAspect;
          page.drawImage(img, {
            x: pl.fx * width - w / 2,
            y: height - pl.fy * height - h / 2,
            width: w,
            height: h,
          });
        }
        await E.saveAndDownload(lib, outName(this.name, 'signed'));
      });
    },
  };
}

/* ---------- redact ---------- */
function redactPdf() {
  return {
    ...onePdf(),
    page: 1,
    rects: {} as Record<number, { fx: number; fy: number; fw: number; fh: number }[]>,
    dragging: false,
    sx: 0,
    sy: 0,
    async onPicked(this: any) {
      this.page = 1;
      this.rects = {};
      await this.show();
    },
    async show(this: any) {
      const E = await eng();
      const view = await E.loadView(this.file);
      const pg = await view.getPage(this.page);
      const scale = Math.min(700 / pg.getViewport({ scale: 1 }).width, 2);
      await E.renderPage(view, this.page, scale, this.$refs.stage as HTMLCanvasElement);
      void view.destroy();
      this.paintRects();
    },
    async go(this: any, d: number) {
      const n = this.page + d;
      if (n < 1 || n > this.pages) return;
      this.page = n;
      await this.show();
    },
    paintRects(this: any) {
      const stage = this.$refs.stage as HTMLCanvasElement;
      const ctx = stage.getContext('2d')!;
      ctx.fillStyle = '#111';
      for (const r of this.rects[this.page] ?? []) {
        ctx.fillRect(r.fx * stage.width, r.fy * stage.height, r.fw * stage.width, r.fh * stage.height);
      }
    },
    pointer(this: any, e: PointerEvent, phase: string) {
      const stage = this.$refs.stage as HTMLCanvasElement;
      const r = stage.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - r.left, 0), r.width);
      const y = Math.min(Math.max(e.clientY - r.top, 0), r.height);
      if (phase === 'down') {
        this.dragging = true;
        this.sx = x;
        this.sy = y;
      } else if (phase === 'up' && this.dragging) {
        this.dragging = false;
        const fw = Math.abs(x - this.sx) / r.width;
        const fh = Math.abs(y - this.sy) / r.height;
        if (fw < 0.005 || fh < 0.005) return;
        (this.rects[this.page] ??= []).push({
          fx: Math.min(this.sx, x) / r.width,
          fy: Math.min(this.sy, y) / r.height,
          fw,
          fh,
        });
        this.paintRects();
      }
    },
    clearPage(this: any) {
      delete this.rects[this.page];
      void this.show();
    },
    count(this: any) {
      return Object.values(this.rects).reduce((n: number, arr: any) => n + arr.length, 0);
    },
    run(this: any) {
      return this.guard(async () => {
        if (!this.count()) throw new Error('Draw at least one redaction box.');
        const E = await eng();
        const view = await E.loadView(this.file);
        const lib = await E.loadLib(this.file);
        const nd = await E.PDFDocument.create();
        for (let p = 1; p <= this.pages; p++) {
          const boxes = this.rects[p] ?? [];
          if (!boxes.length) {
            const [copied] = await nd.copyPages(lib, [p - 1]);
            nd.addPage(copied!);
            continue;
          }
          const pg = await view.getPage(p);
          const v1 = pg.getViewport({ scale: 1 });
          const canvas = await E.renderPage(view, p, 2);
          const ctx = canvas.getContext('2d')!;
          ctx.fillStyle = '#000';
          for (const b of boxes)
            ctx.fillRect(b.fx * canvas.width, b.fy * canvas.height, b.fw * canvas.width, b.fh * canvas.height);
          const blob = await E.canvasToJpeg(canvas, 0.85);
          const img = await nd.embedJpg(new Uint8Array(await blob.arrayBuffer()));
          nd.addPage([v1.width, v1.height]).drawImage(img, {
            x: 0,
            y: 0,
            width: v1.width,
            height: v1.height,
          });
        }
        void view.destroy();
        await E.saveAndDownload(nd, outName(this.name, 'redacted'));
      });
    },
  };
}

/* ---------- compare ---------- */
function comparePdf() {
  return {
    fileA: null as File | null,
    fileB: null as File | null,
    nameA: '',
    nameB: '',
    pagesA: 0,
    pagesB: 0,
    page: 1,
    diffOn: false,
    busy: false,
    error: '',
    accept: '.pdf,application/pdf',
    dragover: false,
    async pickSide(this: any, list: FileList | File[], side: 'A' | 'B') {
      const f = firstPdf(list);
      if (!f) return;
      try {
        const E = await eng();
        const view = await E.loadView(f);
        this[`file${side}`] = f;
        this[`name${side}`] = f.name;
        this[`pages${side}`] = view.numPages;
        void view.destroy();
        if (this.fileA && this.fileB) await this.show();
      } catch (e) {
        this.error = friendly(e);
      }
    },
    maxPages(this: any) {
      return Math.max(this.pagesA, this.pagesB);
    },
    async go(this: any, d: number) {
      const n = this.page + d;
      if (n < 1 || n > this.maxPages()) return;
      this.page = n;
      await this.show();
    },
    async show(this: any) {
      this.busy = true;
      try {
        const E = await eng();
        const render = async (file: File, pages: number, ref: string) => {
          const canvas = this.$refs[ref] as HTMLCanvasElement;
          if (this.page > pages) {
            canvas.width = 400;
            canvas.height = 200;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#f3ede2';
            ctx.fillRect(0, 0, 400, 200);
            ctx.fillStyle = '#8a8171';
            ctx.font = '16px sans-serif';
            ctx.fillText('No such page', 150, 100);
            return;
          }
          const view = await E.loadView(file);
          const pg = await view.getPage(this.page);
          const scale = 460 / pg.getViewport({ scale: 1 }).width;
          await E.renderPage(view, this.page, scale, canvas);
          void view.destroy();
        };
        await render(this.fileA, this.pagesA, 'ca');
        await render(this.fileB, this.pagesB, 'cb');
        if (this.diffOn) this.diff();
      } catch (e) {
        this.error = friendly(e);
      } finally {
        this.busy = false;
      }
    },
    diff(this: any) {
      const a = this.$refs.ca as HTMLCanvasElement;
      const b = this.$refs.cb as HTMLCanvasElement;
      const d = this.$refs.cd as HTMLCanvasElement;
      const w = Math.min(a.width, b.width);
      const h = Math.min(a.height, b.height);
      d.width = w;
      d.height = h;
      const da = a.getContext('2d')!.getImageData(0, 0, w, h).data;
      const db = b.getContext('2d')!.getImageData(0, 0, w, h).data;
      const ctx = d.getContext('2d')!;
      const out = ctx.createImageData(w, h);
      let changed = 0;
      for (let i = 0; i < da.length; i += 4) {
        const delta =
          Math.abs(da[i]! - db[i]!) + Math.abs(da[i + 1]! - db[i + 1]!) + Math.abs(da[i + 2]! - db[i + 2]!);
        if (delta > 40) {
          out.data[i] = 214;
          out.data[i + 1] = 40;
          out.data[i + 2] = 40;
          out.data[i + 3] = 255;
          changed++;
        } else {
          const g = (da[i]! + da[i + 1]! + da[i + 2]!) / 3;
          out.data[i] = out.data[i + 1] = out.data[i + 2] = 200 + g / 12;
          out.data[i + 3] = 255;
        }
      }
      ctx.putImageData(out, 0, 0);
      this.diffPct = ((changed / (w * h)) * 100).toFixed(2);
    },
    diffPct: '0',
    async toggleDiff(this: any) {
      this.diffOn = !this.diffOn;
      if (this.diffOn) this.diff();
    },
  };
}

/* ---------- scan ---------- */
function scanPdf() {
  return {
    stream: null as MediaStream | null,
    shots: [] as string[],
    busy: false,
    error: '',
    active: false,
    async start(this: any) {
      this.error = '';
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 2048 } },
        });
        (this.$refs.video as HTMLVideoElement).srcObject = this.stream;
        this.active = true;
      } catch {
        this.error = 'Camera unavailable — check permissions, or use JPG to PDF with photos instead.';
      }
    },
    stop(this: any) {
      this.stream?.getTracks().forEach((t: MediaStreamTrack) => t.stop());
      this.stream = null;
      this.active = false;
    },
    capture(this: any) {
      const video = this.$refs.video as HTMLVideoElement;
      const c = document.createElement('canvas');
      c.width = video.videoWidth;
      c.height = video.videoHeight;
      c.getContext('2d')!.drawImage(video, 0, 0);
      this.shots.push(c.toDataURL('image/jpeg', 0.9));
    },
    remove(i: number) {
      this.shots.splice(i, 1);
    },
    async run(this: any) {
      if (!this.shots.length || this.busy) return;
      this.busy = true;
      this.error = '';
      try {
        const E = await eng();
        const blobs = await Promise.all(
          this.shots.map((s: string) => fetch(s).then((r) => r.blob())),
        );
        const doc = await buildPdfFromImages(blobs, 'a4', E);
        await E.saveAndDownload(doc, 'scan.pdf');
      } catch (e) {
        this.error = friendly(e);
      } finally {
        this.busy = false;
      }
    },
  };
}

/* ---------- server-path tools (Phase 4 wiring) ---------- */
function convertApi(endpoint: string, acceptTypes: string, outExt: string) {
  return {
    file: null as File | null,
    name: '',
    busy: false,
    error: '',
    dragover: false,
    accept: acceptTypes,
    pick(list: FileList | File[]) {
      this.dragover = false;
      const f = Array.from(list)[0];
      if (!f) return;
      this.file = f;
      this.name = f.name;
      this.error = '';
    },
    async run(this: any) {
      if (!this.file || this.busy) return;
      this.busy = true;
      this.error = '';
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: this.file,
          headers: { 'x-filename': encodeURIComponent(this.name) },
        });
        if (!res.ok) throw new Error((await res.text()) || `Conversion failed (${res.status})`);
        const blob = await res.blob();
        const E = await eng();
        E.downloadBlob(blob, this.name.replace(/\.[^.]+$/, '') + '.' + outExt, blob.type);
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Conversion failed';
      } finally {
        this.busy = false;
      }
    },
  };
}

function htmlToPdf() {
  return {
    url: '',
    busy: false,
    error: '',
    async run(this: any) {
      if (!this.url || this.busy) return;
      this.busy = true;
      this.error = '';
      try {
        const res = await fetch('/api/html-to-pdf', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ url: this.url }),
        });
        if (!res.ok) throw new Error((await res.text()) || `Failed (${res.status})`);
        const blob = await res.blob();
        const E = await eng();
        E.downloadBlob(blob, 'webpage.pdf');
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Conversion failed';
      } finally {
        this.busy = false;
      }
    },
  };
}

declare global {
  interface Window {
    Alpine: { data(name: string, fn: (...args: never[]) => unknown): void };
  }
}

document.addEventListener('alpine:init', () => {
  const A = window.Alpine;
  A.data('mergePdf', mergePdf as never);
  A.data('splitPdf', splitPdf as never);
  A.data('rotatePdf', rotatePdf as never);
  A.data('organizePdf', organizePdf as never);
  A.data('pageNumbersPdf', pageNumbersPdf as never);
  A.data('watermarkPdf', watermarkPdf as never);
  A.data('cropPdf', cropPdf as never);
  A.data('imgToPdf', imgToPdf as never);
  A.data('pdfToJpg', pdfToJpg as never);
  A.data('compressPdf', compressPdf as never);
  A.data('protectPdf', protectPdf as never);
  A.data('unlockPdf', unlockPdf as never);
  A.data('formsPdf', formsPdf as never);
  A.data('pdfToText', pdfToText as never);
  A.data('editPdf', editPdf as never);
  A.data('signPdf', signPdf as never);
  A.data('redactPdf', redactPdf as never);
  A.data('comparePdf', comparePdf as never);
  A.data('scanPdf', scanPdf as never);
  A.data('convertApi', convertApi as never);
  A.data('htmlToPdf', htmlToPdf as never);
});
