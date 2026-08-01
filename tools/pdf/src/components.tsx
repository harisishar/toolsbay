import type { Child } from "hono/jsx";
import { SITE, type CompareRow, type Faq } from "./seo.js";
import type { Tool } from "./content.js";

export function Hero({ h1, intro }: { h1: string; intro: string }) {
  return (
    <div class="border-b border-line bg-panel">
      <div class="paper-edge h-1.5" />
      <div class="mx-auto max-w-5xl px-4 py-10">
        <h1 class="font-display max-w-2xl text-3xl leading-tight sm:text-4xl">
          {h1}
        </h1>
        <p class="mt-3 max-w-2xl text-[15px] leading-7 text-muted">{intro}</p>
      </div>
    </div>
  );
}

export function FaqSection({ faq }: { faq: Faq[] }) {
  if (!faq.length) return null;
  return (
    <section class="mt-12">
      <h2 class="font-display mb-4 text-xl">Frequently asked questions</h2>
      <div class="space-y-2">
        {faq.map((f) => (
          <details class="rounded-md border border-line bg-panel px-4 py-3">
            <summary class="cursor-pointer text-[15px] font-semibold marker:text-brick">
              {f.q}
            </summary>
            <p class="mt-2 text-[15px] leading-7 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// Feature matrix for the comparison pages. The wrapper scrolls, not the page —
// three columns of prose do not fit 375px.
export function CompareTable({
  rows,
  competitor,
}: {
  rows: CompareRow[];
  competitor: string;
}) {
  return (
    <section class="mt-10">
      <h2 class="font-display mb-4 text-xl">Feature comparison</h2>
      <div class="overflow-x-auto rounded-md border border-line bg-panel">
        <table class="w-full min-w-[34rem] border-collapse text-left text-[15px]">
          <thead>
            <tr class="border-b border-line">
              <th class="px-4 py-3 font-semibold">Feature</th>
              <th class="px-4 py-3 font-semibold">{SITE.name}</th>
              <th class="px-4 py-3 font-semibold">{competitor}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr class="border-b border-line align-top last:border-0">
                <td class="px-4 py-3">
                  {r.feature}
                  {r.note ? (
                    <span class="mt-1 block text-[13px] leading-6 text-muted">
                      {r.note}
                    </span>
                  ) : null}
                </td>
                <td class="px-4 py-3 font-semibold">{r.us}</td>
                <td class="px-4 py-3 text-muted">{r.them}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Drop({
  handler = "pick",
  multiple = false,
  label = "Drop PDF here",
  sub = "or click to browse",
}: {
  handler?: string;
  multiple?: boolean;
  label?: string;
  sub?: string;
}) {
  return (
    <div
      class="cursor-pointer rounded-lg border-2 border-dashed border-line bg-panel p-10 text-center transition-colors hover:border-brick"
      x-bind:class="dragover && 'border-brick'"
      x-on:click="$refs.file.click()"
      x-on:dragover="$event.preventDefault(); dragover = true"
      x-on:dragleave="dragover = false"
      x-on:drop={`$event.preventDefault(); dragover = false; ${handler}($event.dataTransfer.files)`}
    >
      <input
        type="file"
        class="hidden"
        x-ref="file"
        multiple={multiple}
        x-bind:accept="accept"
        x-on:change={`${handler}($event.target.files); $event.target.value = ''`}
      />
      <p class="font-display text-lg">{label}</p>
      <p class="mt-1 text-sm text-muted">{sub}</p>
      <p class="mt-3 inline-block rounded-full border border-line px-3 py-1 text-xs text-muted">
        Private: files never leave your device
      </p>
    </div>
  );
}

export function ErrorNote() {
  return (
    <p
      x-cloak
      x-show="error"
      class="mt-4 rounded-md border border-brick/30 bg-brick/5 px-3 py-2 text-sm text-brick-deep"
      x-text="error"
    />
  );
}

export function RunButton({
  label,
  guard = "file",
}: {
  label: string;
  guard?: string;
}) {
  return (
    <button
      type="button"
      class="btn-primary mt-5 w-full"
      x-on:click="run()"
      x-bind:class={`(!(${guard}) || busy) && 'opacity-40 pointer-events-none'`}
    >
      <span x-show="!busy">{label}</span>
      <span x-cloak x-show="busy">
        Working…
      </span>
    </button>
  );
}

export function PickedBar() {
  return (
    <div
      x-cloak
      x-show="file"
      class="mb-4 flex items-center justify-between rounded-md border border-line bg-panel px-4 py-2.5 text-sm"
    >
      <p class="truncate">
        <span class="font-semibold" x-text="name" />
        <span class="ml-2 text-muted" x-text="pages ? pages + ' pages' : ''" />
      </p>
      <button
        type="button"
        class="ml-3 shrink-0 text-muted hover:text-brick"
        x-on:click="reset()"
      >
        Change file
      </button>
    </div>
  );
}

export function PageNav() {
  return (
    <div class="mt-3 flex items-center justify-center gap-4 text-sm">
      <button type="button" class="btn-ghost px-3 py-1" x-on:click="go(-1)">
        ← Prev
      </button>
      <span class="text-muted">
        Page <span x-text="page" /> / <span x-text="pages" />
      </span>
      <button type="button" class="btn-ghost px-3 py-1" x-on:click="go(1)">
        Next →
      </button>
    </div>
  );
}

function Panel({ children }: { children: Child }) {
  return (
    <div class="mt-5 grid gap-4 rounded-lg border border-line bg-panel p-5">
      {children}
    </div>
  );
}

/* ------------------------- per-tool bodies ------------------------- */

function MergeBody() {
  return (
    <div x-data="mergePdf()">
      <Drop multiple label="Drop PDFs here (2 or more)" />
      <div x-cloak x-show="items.length" class="mt-5 space-y-2">
        <template x-for="(it, i) in items">
          <div class="flex items-center gap-2 rounded-md border border-line bg-panel px-4 py-2.5 text-sm">
            <span class="w-6 text-muted" x-text="i + 1 + '.'" />
            <span
              class="min-w-0 flex-1 truncate font-semibold"
              x-text="it.name"
            />
            <span class="text-muted" x-text="it.pages + 'p'" />
            <button
              type="button"
              class="btn-ghost px-2 py-1"
              x-on:click="move(i, -1)"
            >
              ↑
            </button>
            <button
              type="button"
              class="btn-ghost px-2 py-1"
              x-on:click="move(i, 1)"
            >
              ↓
            </button>
            <button
              type="button"
              class="text-muted hover:text-brick"
              x-on:click="remove(i)"
            >
              ✕
            </button>
          </div>
        </template>
      </div>
      <ErrorNote />
      <RunButton label="Merge PDFs" guard="items.length >= 2" />
    </div>
  );
}

function SplitBody() {
  return (
    <div x-data="splitPdf()">
      <PickedBar />
      <div x-show="!file">
        <Drop />
      </div>
      <div x-cloak x-show="file">
        <Panel>
          <label class="flex items-center gap-2 text-sm font-semibold">
            <input
              type="radio"
              value="groups"
              x-model="mode"
              class="accent-brick"
            />
            Split by ranges
          </label>
          <div x-show="mode === 'groups'">
            <span class="field-label">
              Page ranges — each comma group becomes one file
            </span>
            <input
              type="text"
              class="field"
              x-model="ranges"
              placeholder="e.g. 1-3, 4, 5-8"
            />
          </div>
          <label class="flex items-center gap-2 text-sm font-semibold">
            <input
              type="radio"
              value="each"
              x-model="mode"
              class="accent-brick"
            />
            Extract every page as a separate PDF
          </label>
        </Panel>
        <ErrorNote />
        <RunButton label="Split PDF" />
      </div>
    </div>
  );
}

function RotateBody() {
  return (
    <div x-data="rotatePdf()">
      <PickedBar />
      <div x-show="!file">
        <Drop />
      </div>
      <div x-cloak x-show="file">
        <Panel>
          <div class="grid gap-4 sm:grid-cols-2">
            <label>
              <span class="field-label">Rotation</span>
              <select class="field" x-model="angle">
                <option value="90">90° clockwise</option>
                <option value="180">180°</option>
                <option value="270">90° counter-clockwise</option>
              </select>
            </label>
            <label>
              <span class="field-label">Pages (blank = all)</span>
              <input
                type="text"
                class="field"
                x-model="ranges"
                placeholder="e.g. 2, 5-7"
              />
            </label>
          </div>
        </Panel>
        <ErrorNote />
        <RunButton label="Rotate & Download" />
      </div>
    </div>
  );
}

function OrganizeBody() {
  return (
    <div x-data="organizePdf()">
      <PickedBar />
      <div x-show="!file">
        <Drop />
      </div>
      <p
        x-cloak
        x-show="busy && !thumbs.length"
        class="mt-4 text-center text-sm text-muted"
      >
        Rendering page thumbnails…
      </p>
      <div
        x-cloak
        x-show="thumbs.length"
        class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <template x-for="(t, i) in thumbs">
          <div class="rounded-md border border-line bg-panel p-2">
            <img
              x-bind:src="t.src"
              x-bind:style="'transform: rotate(' + t.rot + 'deg)'"
              class="mx-auto max-h-40 transition-transform"
              alt=""
            />
            <p
              class="mt-1 text-center text-xs text-muted"
              x-text="'Page ' + (t.idx + 1)"
            />
            <div class="mt-1 flex justify-center gap-1">
              <button
                type="button"
                class="btn-ghost px-2 py-0.5 text-xs"
                x-on:click="move(i, -1)"
              >
                ←
              </button>
              <button
                type="button"
                class="btn-ghost px-2 py-0.5 text-xs"
                x-on:click="rotate(i)"
              >
                ⟳
              </button>
              <button
                type="button"
                class="btn-ghost px-2 py-0.5 text-xs"
                x-on:click="move(i, 1)"
              >
                →
              </button>
              <button
                type="button"
                class="btn-ghost px-2 py-0.5 text-xs text-brick"
                x-on:click="remove(i)"
              >
                ✕
              </button>
            </div>
          </div>
        </template>
      </div>
      <ErrorNote />
      <div x-cloak x-show="thumbs.length">
        <RunButton label="Save organized PDF" />
      </div>
    </div>
  );
}

function PageNumBody() {
  return (
    <div x-data="pageNumbersPdf()">
      <PickedBar />
      <div x-show="!file">
        <Drop />
      </div>
      <div x-cloak x-show="file">
        <Panel>
          <div class="grid gap-4 sm:grid-cols-3">
            <label>
              <span class="field-label">Position</span>
              <select class="field" x-model="pos">
                <option value="bc">Bottom centre</option>
                <option value="bl">Bottom left</option>
                <option value="br">Bottom right</option>
                <option value="tc">Top centre</option>
                <option value="tl">Top left</option>
                <option value="tr">Top right</option>
              </select>
            </label>
            <label>
              <span class="field-label">Start at</span>
              <input type="number" class="field" x-model="start" min="0" />
            </label>
            <label>
              <span class="field-label">Font size</span>
              <input
                type="number"
                class="field"
                x-model="size"
                min="6"
                max="36"
              />
            </label>
          </div>
        </Panel>
        <ErrorNote />
        <RunButton label="Add page numbers" />
      </div>
    </div>
  );
}

function WatermarkBody() {
  return (
    <div x-data="watermarkPdf()">
      <PickedBar />
      <div x-show="!file">
        <Drop />
      </div>
      <div x-cloak x-show="file">
        <Panel>
          <div class="flex gap-4 text-sm font-semibold">
            <label class="flex items-center gap-2">
              <input
                type="radio"
                value="text"
                x-model="mode"
                class="accent-brick"
              />{" "}
              Text
            </label>
            <label class="flex items-center gap-2">
              <input
                type="radio"
                value="image"
                x-model="mode"
                class="accent-brick"
              />{" "}
              Image
            </label>
          </div>
          <div x-show="mode === 'text'" class="grid gap-4 sm:grid-cols-2">
            <label class="sm:col-span-2">
              <span class="field-label">Watermark text</span>
              <input type="text" class="field" x-model="text" />
            </label>
            <label>
              <span class="field-label">Size</span>
              <input
                type="number"
                class="field"
                x-model="size"
                min="8"
                max="144"
              />
            </label>
            <label>
              <span class="field-label">Rotation (°)</span>
              <input
                type="number"
                class="field"
                x-model="rotation"
                min="-90"
                max="90"
              />
            </label>
            <label>
              <span class="field-label">Colour</span>
              <input type="color" class="field h-[42px] p-1" x-model="color" />
            </label>
            <label class="flex items-center gap-2 pt-5 text-sm font-semibold text-muted">
              <input
                type="checkbox"
                class="h-4 w-4 accent-brick"
                x-model="tile"
              />
              Tile across page
            </label>
          </div>
          <div x-cloak x-show="mode === 'image'">
            <span class="field-label">
              Watermark image (PNG with transparency works best)
            </span>
            <input
              type="file"
              accept="image/*"
              class="field"
              x-on:change="pickImg($event.target.files)"
            />
          </div>
          <label>
            <span class="field-label">
              Opacity: <span x-text="Math.round(opacity * 100) + '%'" />
            </span>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              x-model="opacity"
              class="w-full accent-brick"
            />
          </label>
        </Panel>
        <ErrorNote />
        <RunButton label="Apply watermark" />
      </div>
    </div>
  );
}

function CropBody() {
  return (
    <div x-data="cropPdf()">
      <PickedBar />
      <div x-show="!file">
        <Drop />
      </div>
      <div x-cloak x-show="file">
        <div class="rounded-lg border border-line bg-panel p-4">
          <canvas
            x-ref="stage"
            class="mx-auto block max-w-full cursor-crosshair touch-none"
            x-on:pointerdown="$event.target.setPointerCapture($event.pointerId); pointer($event, 'down')"
            x-on:pointermove="pointer($event, 'move')"
            x-on:pointerup="pointer($event, 'up')"
          />
          <p class="mt-2 text-center text-xs text-muted">
            Drag on the preview (page 1) to set the crop area
          </p>
        </div>
        <Panel>
          <label class="flex items-center gap-2 text-sm font-semibold text-muted">
            <input
              type="checkbox"
              class="h-4 w-4 accent-brick"
              x-model="applyAll"
            />
            Apply to all pages (otherwise only page 1)
          </label>
        </Panel>
        <ErrorNote />
        <RunButton label="Crop PDF" />
      </div>
    </div>
  );
}

function Img2PdfBody() {
  return (
    <div x-data="imgToPdf()">
      <Drop
        multiple
        label="Drop images here"
        sub="JPG, PNG, WebP and more — one page each"
      />
      <div x-cloak x-show="files.length" class="mt-5 space-y-2">
        <template x-for="(f, i) in files">
          <div class="flex items-center gap-2 rounded-md border border-line bg-panel px-4 py-2 text-sm">
            <span class="w-6 text-muted" x-text="i + 1 + '.'" />
            <span
              class="min-w-0 flex-1 truncate font-semibold"
              x-text="f.name"
            />
            <button
              type="button"
              class="btn-ghost px-2 py-1"
              x-on:click="move(i, -1)"
            >
              ↑
            </button>
            <button
              type="button"
              class="btn-ghost px-2 py-1"
              x-on:click="move(i, 1)"
            >
              ↓
            </button>
            <button
              type="button"
              class="text-muted hover:text-brick"
              x-on:click="remove(i)"
            >
              ✕
            </button>
          </div>
        </template>
        <Panel>
          <label>
            <span class="field-label">Page size</span>
            <select class="field" x-model="pageSize">
              <option value="auto">Fit to each image</option>
              <option value="a4">A4 with margins</option>
              <option value="letter">Letter with margins</option>
            </select>
          </label>
        </Panel>
      </div>
      <ErrorNote />
      <RunButton label="Create PDF" guard="files.length" />
    </div>
  );
}

function Pdf2JpgBody({ tool }: { tool: Tool }) {
  return (
    <div x-data={tool.preset ? `pdfToJpg('${tool.preset}')` : "pdfToJpg()"}>
      <PickedBar />
      <div x-show="!file">
        <Drop />
      </div>
      <div x-cloak x-show="file">
        <Panel>
          <label class="flex items-center gap-2 text-sm font-semibold text-muted">
            <input
              type="checkbox"
              class="h-4 w-4 accent-brick"
              x-model="extractMode"
            />
            Extract embedded images instead of converting pages
          </label>
          <div x-show="!extractMode" class="grid gap-4 sm:grid-cols-3">
            <label>
              <span class="field-label">Resolution</span>
              <select class="field" x-model="scale">
                <option value="1">1× (screen)</option>
                <option value="2">2× (sharp)</option>
                <option value="3">3× (print)</option>
              </select>
            </label>
            <label>
              <span class="field-label">Format</span>
              <select class="field" x-model="fmt">
                <option value="jpeg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </label>
            <label>
              <span class="field-label">Pages (blank = all)</span>
              <input
                type="text"
                class="field"
                x-model="ranges"
                placeholder="e.g. 1-4"
              />
            </label>
          </div>
        </Panel>
        <ErrorNote />
        <RunButton label="Convert & Download" />
      </div>
    </div>
  );
}

function CompressBody() {
  return (
    <div x-data="compressPdf()">
      <PickedBar />
      <div x-show="!file">
        <Drop />
      </div>
      <div x-cloak x-show="file">
        <Panel>
          <div class="grid gap-4 sm:grid-cols-2">
            <label>
              <span class="field-label">Quality</span>
              <select class="field" x-model="quality">
                <option value="0.5">Strong compression</option>
                <option value="0.7">Balanced (recommended)</option>
                <option value="0.85">High quality</option>
              </select>
            </label>
            <label>
              <span class="field-label">Detail</span>
              <select class="field" x-model="scale">
                <option value="1">Standard</option>
                <option value="1.5">Sharp (recommended)</option>
                <option value="2">Maximum</option>
              </select>
            </label>
          </div>
          <p class="text-xs leading-5 text-muted">
            Pages are re-encoded as images for maximum savings — ideal for
            scans. Text stays readable but is no longer selectable.
          </p>
        </Panel>
        <ErrorNote />
        <p
          x-cloak
          x-show="resultText"
          class="mt-4 rounded-md border border-moss/30 bg-moss/5 px-3 py-2 text-sm text-moss"
          x-text="resultText"
        />
        <RunButton label="Compress PDF" />
      </div>
    </div>
  );
}

function EditBody() {
  return (
    <div x-data="editPdf()">
      <PickedBar />
      <div x-show="!file">
        <Drop />
      </div>
      <div x-cloak x-show="file">
        <div class="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-line bg-panel p-3 text-sm">
          {(["draw", "rect", "ellipse", "text", "image"] as const).map((t) => (
            <button
              type="button"
              class="btn-ghost px-3 py-1.5 capitalize"
              x-bind:class={`tool === '${t}' && 'border-brick text-brick-deep'`}
              x-on:click={`tool = '${t}'`}
            >
              {t}
            </button>
          ))}
          <input
            type="color"
            class="h-8 w-10 cursor-pointer rounded border border-line"
            x-model="color"
          />
          <label class="flex items-center gap-1 text-xs text-muted">
            Stroke
            <input
              type="number"
              class="field w-16 px-2 py-1"
              x-model="strokeW"
              min="1"
              max="20"
            />
          </label>
          <button
            type="button"
            class="btn-ghost px-3 py-1.5"
            x-on:click="undo()"
          >
            Undo
          </button>
        </div>
        <div x-show="tool === 'text'" class="mb-3 flex gap-2">
          <input
            type="text"
            class="field"
            x-model="text"
            placeholder="Text to place — then click on the page"
          />
          <input
            type="number"
            class="field w-24"
            x-model="fontSize"
            min="8"
            max="72"
          />
        </div>
        <div x-cloak x-show="tool === 'image'" class="mb-3">
          <input
            type="file"
            accept="image/*"
            class="field"
            x-on:change="pickImg($event.target.files)"
          />
        </div>
        <div class="overflow-auto rounded-lg border border-line bg-panel p-4">
          <div class="relative mx-auto w-fit">
            <canvas x-ref="base" class="block max-w-full" />
            <canvas
              x-ref="ov"
              class="absolute inset-0 cursor-crosshair touch-none"
              x-on:pointerdown="$event.target.setPointerCapture($event.pointerId); pointer($event, 'down')"
              x-on:pointermove="pointer($event, 'move')"
              x-on:pointerup="pointer($event, 'up')"
            />
          </div>
        </div>
        <PageNav />
        <ErrorNote />
        <RunButton label="Save edited PDF" />
      </div>
    </div>
  );
}

function SignBody() {
  return (
    <div x-data="signPdf()">
      <PickedBar />
      <div x-show="!file">
        <Drop />
      </div>
      <div x-cloak x-show="file">
        <div class="grid gap-4 lg:grid-cols-[380px_1fr]">
          <div class="rounded-lg border border-line bg-panel p-4">
            <div class="mb-2 flex gap-2 text-sm font-semibold">
              {(["draw", "type", "upload"] as const).map((m) => (
                <button
                  type="button"
                  class="btn-ghost px-3 py-1.5 capitalize"
                  x-bind:class={`sigMode === '${m}' && 'border-brick text-brick-deep'`}
                  x-on:click={`sigMode = '${m}'`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div x-show="sigMode === 'draw'">
              <canvas
                x-ref="pad"
                class="w-full cursor-crosshair touch-none rounded border border-line bg-cream"
                x-on:pointerdown="$event.target.setPointerCapture($event.pointerId); pad($event, 'down')"
                x-on:pointermove="pad($event, 'move')"
                x-on:pointerup="pad($event, 'up')"
              />
              <button
                type="button"
                class="btn-ghost mt-2 px-3 py-1 text-xs"
                x-on:click="clearPad()"
              >
                Clear
              </button>
            </div>
            <div x-cloak x-show="sigMode === 'type'">
              <input
                type="text"
                class="field sig-font text-2xl"
                x-model="typed"
                x-on:input="renderTyped()"
                placeholder="Type your name"
              />
            </div>
            <div x-cloak x-show="sigMode === 'upload'">
              <input
                type="file"
                accept="image/*"
                class="field"
                x-on:change="pickSig($event.target.files)"
              />
            </div>
            <label class="mt-3 block">
              <span class="field-label">
                Signature width: <span x-text="widthPct + '%'" /> of page
              </span>
              <input
                type="range"
                min="10"
                max="60"
                x-model="widthPct"
                class="w-full accent-brick"
              />
            </label>
            <button
              type="button"
              class="btn-ghost mt-2 w-full text-xs"
              x-on:click="clearPlacements()"
            >
              Remove placed signatures
            </button>
          </div>
          <div class="rounded-lg border border-line bg-panel p-4">
            <canvas
              x-ref="stage"
              class="mx-auto block max-w-full cursor-copy"
              x-on:click="place($event)"
            />
            <p class="mt-2 text-center text-xs text-muted">
              Click on the page to place your signature
            </p>
            <PageNav />
          </div>
        </div>
        <ErrorNote />
        <RunButton label="Sign & Download" />
      </div>
    </div>
  );
}

function RedactBody() {
  return (
    <div x-data="redactPdf()">
      <PickedBar />
      <div x-show="!file">
        <Drop />
      </div>
      <div x-cloak x-show="file">
        <div class="rounded-lg border border-line bg-panel p-4">
          <canvas
            x-ref="stage"
            class="mx-auto block max-w-full cursor-crosshair touch-none"
            x-on:pointerdown="$event.target.setPointerCapture($event.pointerId); pointer($event, 'down')"
            x-on:pointermove="pointer($event, 'move')"
            x-on:pointerup="pointer($event, 'up')"
          />
          <p class="mt-2 text-center text-xs text-muted">
            Drag black boxes over content to remove — <span x-text="count()" />{" "}
            box(es) placed
          </p>
          <div class="flex justify-center">
            <button
              type="button"
              class="btn-ghost px-3 py-1 text-xs"
              x-on:click="clearPage()"
            >
              Clear this page
            </button>
          </div>
          <PageNav />
        </div>
        <ErrorNote />
        <RunButton label="Redact & Download" />
      </div>
    </div>
  );
}

function FormsBody() {
  return (
    <div x-data="formsPdf()">
      <PickedBar />
      <div x-show="!file">
        <Drop />
      </div>
      <div x-cloak x-show="fields.length" class="mt-2 space-y-3">
        <template x-for="f in fields">
          <div class="rounded-md border border-line bg-panel px-4 py-3">
            <span class="field-label" x-text="f.name" />
            <template x-if="f.kind === 'PDFTextField'">
              <input type="text" class="field" x-model="f.value" />
            </template>
            <template x-if="f.kind === 'PDFCheckBox'">
              <label class="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  class="h-4 w-4 accent-brick"
                  x-model="f.checked"
                />{" "}
                Checked
              </label>
            </template>
            <template x-if="f.options.length > 0">
              <select class="field" x-model="f.value">
                <option value="">— select —</option>
                <template x-for="o in f.options">
                  <option x-bind:value="o" x-text="o" />
                </template>
              </select>
            </template>
          </div>
        </template>
        <label class="flex items-center gap-2 text-sm font-semibold text-muted">
          <input
            type="checkbox"
            class="h-4 w-4 accent-brick"
            x-model="flatten"
          />
          Flatten after filling (answers become permanent)
        </label>
      </div>
      <ErrorNote />
      <div x-cloak x-show="fields.length">
        <RunButton label="Fill & Download" />
      </div>
    </div>
  );
}

function ProtectBody() {
  return (
    <div x-data="protectPdf()">
      <PickedBar />
      <div x-show="!file">
        <Drop />
      </div>
      <div x-cloak x-show="file">
        <Panel>
          <div class="grid gap-4 sm:grid-cols-2">
            <label>
              <span class="field-label">Password (required to open)</span>
              <input type="password" class="field" x-model="userPw" />
            </label>
            <label>
              <span class="field-label">Owner password (optional)</span>
              <input type="password" class="field" x-model="ownerPw" />
            </label>
          </div>
          <div class="flex gap-6 text-sm font-semibold text-muted">
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                class="h-4 w-4 accent-brick"
                x-model="allowPrint"
              />{" "}
              Allow printing
            </label>
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                class="h-4 w-4 accent-brick"
                x-model="allowCopy"
              />{" "}
              Allow copying
            </label>
          </div>
        </Panel>
        <ErrorNote />
        <RunButton label="Encrypt PDF" />
      </div>
    </div>
  );
}

function UnlockBody() {
  return (
    <div x-data="unlockPdf()">
      <PickedBar />
      <div x-show="!file">
        <Drop />
      </div>
      <div x-cloak x-show="file">
        <Panel>
          <label>
            <span class="field-label">Current password</span>
            <input type="password" class="field" x-model="password" />
          </label>
        </Panel>
        <ErrorNote />
        <RunButton label="Remove password" />
      </div>
    </div>
  );
}

function CompareBody() {
  return (
    <div x-data="comparePdf()">
      <div class="grid gap-4 sm:grid-cols-2">
        {(["A", "B"] as const).map((side) => (
          <div
            class="cursor-pointer rounded-lg border-2 border-dashed border-line bg-panel p-6 text-center transition-colors hover:border-brick"
            x-on:click={`$refs.file${side}.click()`}
            x-on:dragover="$event.preventDefault()"
            x-on:drop={`$event.preventDefault(); pickSide($event.dataTransfer.files, '${side}')`}
          >
            <input
              type="file"
              class="hidden"
              x-ref={`file${side}`}
              accept=".pdf,application/pdf"
              x-on:change={`pickSide($event.target.files, '${side}')`}
            />
            <p class="font-display">
              {side === "A" ? "Original PDF" : "Revised PDF"}
            </p>
            <p
              class="mt-1 truncate text-sm text-muted"
              x-text={`name${side} || 'Drop or click'`}
            />
          </div>
        ))}
      </div>
      <ErrorNote />
      <div x-cloak x-show="fileA && fileB">
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div class="overflow-auto rounded-lg border border-line bg-panel p-2">
            <canvas x-ref="ca" class="mx-auto block max-w-full" />
          </div>
          <div class="overflow-auto rounded-lg border border-line bg-panel p-2">
            <canvas x-ref="cb" class="mx-auto block max-w-full" />
          </div>
        </div>
        <div class="mt-3 flex items-center justify-center gap-4 text-sm">
          <button type="button" class="btn-ghost px-3 py-1" x-on:click="go(-1)">
            ← Prev
          </button>
          <span class="text-muted">
            Page <span x-text="page" /> / <span x-text="maxPages()" />
          </span>
          <button type="button" class="btn-ghost px-3 py-1" x-on:click="go(1)">
            Next →
          </button>
          <button
            type="button"
            class="btn-ghost px-3 py-1"
            x-bind:class="diffOn && 'border-brick text-brick-deep'"
            x-on:click="toggleDiff()"
          >
            Highlight differences
          </button>
        </div>
        <div
          x-cloak
          x-show="diffOn"
          class="mt-4 overflow-auto rounded-lg border border-line bg-panel p-2"
        >
          <p class="mb-1 text-center text-xs text-muted">
            <span x-text="diffPct" />% of pixels differ on this page
          </p>
          <canvas x-ref="cd" class="mx-auto block max-w-full" />
        </div>
      </div>
    </div>
  );
}

function ToTextBody({ tool }: { tool: Tool }) {
  return (
    <div x-data={tool.preset ? `pdfToText('${tool.preset}')` : "pdfToText()"}>
      <PickedBar />
      <div x-show="!file">
        <Drop />
      </div>
      <div x-cloak x-show="file">
        <Panel>
          <label>
            <span class="field-label">Output</span>
            <select class="field" x-model="mode">
              <option value="md">Markdown (headings + bullets)</option>
              <option value="txt">Plain text</option>
            </select>
          </label>
        </Panel>
        <ErrorNote />
        <RunButton label="Extract text" />
        <div x-cloak x-show="output" class="mt-4">
          <textarea class="field min-h-64 font-mono text-xs" x-model="output" />
          <button type="button" class="btn-ghost mt-2" x-on:click="download()">
            Download file
          </button>
        </div>
      </div>
    </div>
  );
}

function ScanBody() {
  return (
    <div x-data="scanPdf()">
      <div class="rounded-lg border border-line bg-panel p-4 text-center">
        <video
          x-ref="video"
          autoplay
          playsinline
          class="mx-auto max-h-96 rounded"
          x-show="active"
        />
        <div class="mt-3 flex justify-center gap-2">
          <button
            type="button"
            class="btn-primary"
            x-show="!active"
            x-on:click="start()"
          >
            Start camera
          </button>
          <button
            type="button"
            class="btn-primary"
            x-cloak
            x-show="active"
            x-on:click="capture()"
          >
            Capture page
          </button>
          <button
            type="button"
            class="btn-ghost"
            x-cloak
            x-show="active"
            x-on:click="stop()"
          >
            Stop
          </button>
        </div>
      </div>
      <div
        x-cloak
        x-show="shots.length"
        class="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5"
      >
        <template x-for="(s, i) in shots">
          <div class="relative">
            <img x-bind:src="s" class="rounded border border-line" alt="" />
            <button
              type="button"
              class="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-brick text-xs text-white"
              x-on:click="remove(i)"
            >
              ✕
            </button>
          </div>
        </template>
      </div>
      <ErrorNote />
      <RunButton label="Create PDF from captures" guard="shots.length" />
    </div>
  );
}

const API_ACCEPT: Record<string, [accept: string, outExt: string]> = {
  "api:docx": [".pdf,application/pdf", "docx"],
  "api:xlsx": [".pdf,application/pdf", "xlsx"],
  "api:pptx": [".pdf,application/pdf", "pptx"],
  "api:pdf:doc": [".doc,.docx", "pdf"],
  "api:pdf:xls": [".xls,.xlsx,.csv", "pdf"],
  "api:pdf:ppt": [".ppt,.pptx", "pdf"],
  "api:ocr": [".pdf,application/pdf", "pdf"],
  "api:pdfa": [".pdf,application/pdf", "pdf"],
  "api:repair": [".pdf,application/pdf", "pdf"],
};

function ApiBody({ tool }: { tool: Tool }) {
  const [accept, outExt] = API_ACCEPT[tool.kind]!;
  return (
    <div
      x-data={`convertApi('/api/convert/${tool.slug}', '${accept}', '${outExt}')`}
    >
      <div
        x-cloak
        x-show="file"
        class="mb-4 flex items-center justify-between rounded-md border border-line bg-panel px-4 py-2.5 text-sm"
      >
        <p class="truncate font-semibold" x-text="name" />
        <button
          type="button"
          class="ml-3 shrink-0 text-muted hover:text-brick"
          x-on:click="file = null; name = ''"
        >
          Change file
        </button>
      </div>
      <div x-show="!file">
        <Drop
          label={`Drop your file here`}
          sub="Processed server-side: streamed through, never stored"
        />
      </div>
      <ErrorNote />
      <RunButton label={tool.label} />
    </div>
  );
}

function HtmlToPdfBody() {
  return (
    <div x-data="htmlToPdf()">
      <div class="rounded-lg border border-line bg-panel p-5">
        <label>
          <span class="field-label">Webpage URL</span>
          <input
            type="url"
            class="field"
            x-model="url"
            placeholder="https://example.com/article"
          />
        </label>
      </div>
      <ErrorNote />
      <RunButton label="Convert to PDF" guard="url" />
    </div>
  );
}

export function ToolBody({ tool }: { tool: Tool }) {
  switch (tool.kind) {
    case "merge":
      return <MergeBody />;
    case "split":
      return <SplitBody />;
    case "rotate":
      return <RotateBody />;
    case "organize":
      return <OrganizeBody />;
    case "pagenum":
      return <PageNumBody />;
    case "watermark":
      return <WatermarkBody />;
    case "crop":
      return <CropBody />;
    case "img2pdf":
      return <Img2PdfBody />;
    case "pdf2jpg":
      return <Pdf2JpgBody tool={tool} />;
    case "compress":
      return <CompressBody />;
    case "edit":
      return <EditBody />;
    case "sign":
      return <SignBody />;
    case "redact":
      return <RedactBody />;
    case "forms":
      return <FormsBody />;
    case "protect":
      return <ProtectBody />;
    case "unlock":
      return <UnlockBody />;
    case "compare":
      return <CompareBody />;
    case "totext":
      return <ToTextBody tool={tool} />;
    case "scan":
      return <ScanBody />;
    case "html2pdf":
      return <HtmlToPdfBody />;
    default:
      return <ApiBody tool={tool} />;
  }
}
