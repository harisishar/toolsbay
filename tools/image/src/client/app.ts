// Alpine components for the image tools. All processing is local — no uploads.
import { zipSync } from "fflate";
import {
  decode,
  draw,
  encode,
  isHeic,
  type Target,
  type CropRect,
} from "./ops.js";
import {
  resolveResize,
  scaleByPercent,
  renameForType,
  formatBytes,
  savings,
} from "../lib/imgmath.js";

type Mode = "compress" | "resize" | "convert";

// Alpine magic properties, available at runtime on every component.
type Magic = {
  $refs: Record<string, HTMLCanvasElement>;
  $nextTick: (cb: () => void) => void;
};

type Item = {
  id: number;
  file: File;
  name: string;
  w: number;
  h: number;
  outBlob: Blob | null;
  outName: string;
  status: "queued" | "working" | "done" | "error";
  error: string;
};

const ACCEPT = ".jpg,.jpeg,.png,.webp,.gif,.bmp,.svg,.heic,.heif,.avif,image/*";
let nextId = 1;

function targetFor(file: File, choice: string): Target {
  if (choice !== "keep") return choice as Target;
  if (file.type === "image/png") return "image/png";
  if (file.type === "image/webp") return "image/webp";
  return "image/jpeg"; // jpg stays jpg; heic/avif/gif/bmp/svg → jpg
}

export function imgApp(mode: Mode, presetTarget = "keep") {
  return {
    mode,
    items: [] as Item[],
    dragover: false,
    accept: ACCEPT,
    // settings
    quality: 80,
    target: presetTarget,
    wIn: "",
    hIn: "",
    lock: true,
    usePercent: false,
    percent: 50,
    busy: false,

    fmtBytes: formatBytes,
    saved(it: Item) {
      return it.outBlob ? savings(it.file.size, it.outBlob.size) : 0;
    },

    addFiles(list: FileList | File[]) {
      for (const file of Array.from(list)) {
        if (
          !/^image\//.test(file.type) &&
          !isHeic(file) &&
          !/\.(svg|avif|bmp)$/i.test(file.name)
        )
          continue;
        this.items.push({
          id: nextId++,
          file,
          name: file.name,
          w: 0,
          h: 0,
          outBlob: null,
          outName: "",
          status: "queued",
          error: "",
        });
      }
      void this.processAll();
    },

    onDrop(e: DragEvent) {
      this.dragover = false;
      if (e.dataTransfer?.files.length) this.addFiles(e.dataTransfer.files);
    },

    async processAll() {
      if (this.busy) return;
      this.busy = true;
      for (const it of this.items) {
        if (it.status === "done" && it.outBlob) continue;
        await this.processOne(it);
      }
      this.busy = false;
    },

    async reprocess() {
      for (const it of this.items) it.status = "queued";
      await this.processAll();
    },

    async processOne(it: Item) {
      it.status = "working";
      it.error = "";
      try {
        const bmp = await decode(it.file);
        it.w = bmp.width;
        it.h = bmp.height;
        let dims = { w: bmp.width, h: bmp.height };
        if (this.mode === "resize") {
          dims = this.usePercent
            ? scaleByPercent(dims, Number(this.percent) || 100)
            : resolveResize(dims, this.wIn, this.hIn, this.lock);
        }
        const tgt = targetFor(it.file, this.target);
        const canvas = draw(bmp, dims.w, dims.h, tgt);
        it.outBlob = await encode(canvas, tgt, Number(this.quality) / 100);
        it.outName = renameForType(it.name, tgt);
        it.status = "done";
        bmp.close();
      } catch (e) {
        it.status = "error";
        it.error =
          e instanceof Error ? e.message : "Could not process this file";
      }
    },

    remove(id: number) {
      this.items = this.items.filter((i) => i.id !== id);
    },
    clear() {
      this.items = [];
    },

    downloadOne(it: Item) {
      if (!it.outBlob) return;
      const url = URL.createObjectURL(it.outBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = it.outName;
      a.click();
      URL.revokeObjectURL(url);
    },

    async downloadAll() {
      const done = this.items.filter((i) => i.status === "done" && i.outBlob);
      if (!done.length) return;
      if (done.length === 1) return this.downloadOne(done[0]!);
      const entries: Record<string, Uint8Array> = {};
      for (const it of done) {
        let name = it.outName;
        let n = 2;
        while (entries[name])
          name = it.outName.replace(/(\.[^.]+)$/, `-${n++}$1`);
        entries[name] = new Uint8Array(await it.outBlob!.arrayBuffer());
      }
      const zip = zipSync(entries, { level: 0 });
      const url = URL.createObjectURL(
        new Blob([zip], { type: "application/zip" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.zip";
      a.click();
      URL.revokeObjectURL(url);
    },
  };
}

export function cropApp() {
  return {
    file: null as File | null,
    bmp: null as ImageBitmap | null,
    dragover: false,
    accept: ACCEPT,
    scale: 1,
    sel: null as CropRect | null, // display coords
    dragging: false,
    startX: 0,
    startY: 0,
    aspect: 0, // 0 = free
    target: "keep",
    quality: 90,
    error: "",

    get hasSel() {
      return !!this.sel && this.sel.w > 4 && this.sel.h > 4;
    },
    selText() {
      if (!this.sel) return "";
      const s = this.scale;
      return `${Math.round(this.sel.w / s)} × ${Math.round(this.sel.h / s)} px`;
    },

    async load(list: FileList | File[]) {
      this.dragover = false;
      const file = Array.from(list)[0];
      if (!file) return;
      this.error = "";
      try {
        this.file = file;
        this.bmp = await decode(file);
        this.sel = null;
        (this as unknown as Magic).$nextTick(() => this.paint());
      } catch (e) {
        this.error =
          e instanceof Error ? e.message : "Could not open this image";
        this.file = null;
        this.bmp = null;
      }
    },

    paint() {
      const canvas = (this as unknown as Magic).$refs.stage;
      if (!this.bmp || !canvas) return;
      const avail = canvas.parentElement!.clientWidth - 32; // p-4 padding
      if (avail <= 0) {
        // ponytail: x-show reveals async; retry next frame until laid out
        requestAnimationFrame(() => this.paint());
        return;
      }
      const maxW = Math.min(avail, 688);
      this.scale = Math.min(maxW / this.bmp.width, 520 / this.bmp.height, 1);
      canvas.width = Math.round(this.bmp.width * this.scale);
      canvas.height = Math.round(this.bmp.height * this.scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(this.bmp, 0, 0, canvas.width, canvas.height);
      if (this.sel) {
        ctx.fillStyle = "rgba(10,10,14,0.55)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          this.bmp,
          this.sel.x / this.scale,
          this.sel.y / this.scale,
          this.sel.w / this.scale,
          this.sel.h / this.scale,
          this.sel.x,
          this.sel.y,
          this.sel.w,
          this.sel.h,
        );
        ctx.strokeStyle = "#ff6b4a";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          this.sel.x + 1,
          this.sel.y + 1,
          this.sel.w - 2,
          this.sel.h - 2,
        );
      }
    },

    pointer(e: PointerEvent, phase: "down" | "move" | "up") {
      const canvas = (this as unknown as Magic).$refs.stage;
      if (!this.bmp || !canvas || !canvas.width) return;
      const r = canvas.getBoundingClientRect();
      const k = canvas.width / r.width;
      const x = Math.min(Math.max((e.clientX - r.left) * k, 0), canvas.width);
      const y = Math.min(Math.max((e.clientY - r.top) * k, 0), canvas.height);
      if (phase === "down") {
        this.dragging = true;
        this.startX = x;
        this.startY = y;
        this.sel = { x, y, w: 0, h: 0 };
      } else if (phase === "move" && this.dragging) {
        let w = x - this.startX;
        let h = y - this.startY;
        if (this.aspect > 0) {
          const sign = h < 0 ? -1 : 1;
          h = (Math.abs(w) / this.aspect) * sign;
        }
        this.sel = {
          x: Math.min(this.startX, this.startX + w),
          y: Math.min(this.startY, this.startY + h),
          w: Math.abs(w),
          h: Math.abs(h),
        };
        this.paint();
      } else if (phase === "up") {
        this.dragging = false;
        this.paint();
      }
    },

    async download() {
      if (!this.bmp || !this.file || !this.hasSel || !this.sel) return;
      const s = this.scale;
      const crop: CropRect = {
        x: Math.round(this.sel.x / s),
        y: Math.round(this.sel.y / s),
        w: Math.round(this.sel.w / s),
        h: Math.round(this.sel.h / s),
      };
      const tgt = targetFor(this.file, this.target);
      const canvas = draw(this.bmp, crop.w, crop.h, tgt, crop);
      const blob = await encode(canvas, tgt, Number(this.quality) / 100);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = renameForType(
        this.file.name.replace(/(\.[^.]+)$/, "-cropped$1"),
        tgt,
      );
      a.click();
      URL.revokeObjectURL(url);
    },
  };
}

declare global {
  interface Window {
    Alpine: { data(name: string, fn: (...args: never[]) => unknown): void };
  }
}

document.addEventListener("alpine:init", () => {
  window.Alpine.data("imgApp", imgApp as (...args: never[]) => unknown);
  window.Alpine.data("cropApp", cropApp as (...args: never[]) => unknown);
});
