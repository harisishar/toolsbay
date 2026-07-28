import type { Faq } from './seo.js';

export function Dropzone({ multiple = true, handler = 'addFiles' }: { multiple?: boolean; handler?: string }) {
  return (
    <div
      class="cursor-pointer rounded-lg border-2 border-dashed border-line bg-panel/60 p-10 text-center transition-colors hover:border-ember"
      x-bind:class="dragover && 'border-ember bg-panel'"
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
      <p class="font-display text-lg">Drop images here</p>
      <p class="mt-1 text-sm text-mist">
        or click to browse — JPG, PNG, WebP, HEIC, AVIF, GIF, BMP, SVG
      </p>
      <p class="mt-3 inline-block rounded-full border border-line px-3 py-1 text-xs text-mist">
        Private: files never leave your device
      </p>
    </div>
  );
}

export function FileList() {
  return (
    <div x-cloak x-show="items.length" class="mt-6 space-y-2">
      <template x-for="it in items" x-bind:key="it.id">
        <div class="flex items-center gap-3 rounded-md border border-line bg-panel px-4 py-3">
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold" x-text="it.name" />
            <p class="mt-0.5 text-xs text-mist">
              <span x-text="fmtBytes(it.file.size)" />
              <template x-if="it.status === 'done'">
                <span>
                  <span> → </span>
                  <span class="text-fog" x-text="fmtBytes(it.outBlob.size)" />
                  <span
                    class="ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    x-bind:class="saved(it) >= 0 ? 'bg-mint/15 text-mint' : 'bg-ember/15 text-ember'"
                    x-text="(saved(it) >= 0 ? '−' : '+') + Math.abs(saved(it)) + '%'"
                  />
                </span>
              </template>
              <template x-if="it.status === 'working'">
                <span class="text-ember"> · processing…</span>
              </template>
              <template x-if="it.status === 'error'">
                <span class="text-ember" x-text="' · ' + it.error" />
              </template>
            </p>
          </div>
          <button
            type="button"
            class="btn-ghost px-3 py-1.5 text-xs"
            x-show="it.status === 'done'"
            x-on:click="downloadOne(it)"
          >
            Download
          </button>
          <button
            type="button"
            class="text-mist hover:text-ember"
            aria-label="Remove"
            x-on:click="remove(it.id)"
          >
            ✕
          </button>
        </div>
      </template>
      <div class="flex items-center justify-between pt-2">
        <button type="button" class="text-sm text-mist hover:text-ember" x-on:click="clear()">
          Clear all
        </button>
        <div class="flex gap-2">
          <button type="button" class="btn-ghost" x-on:click="reprocess()">
            Re-process
          </button>
          <button type="button" class="btn-primary" x-on:click="downloadAll()">
            Download all
          </button>
        </div>
      </div>
    </div>
  );
}

export function QualityControl() {
  return (
    <label class="block">
      <span class="field-label">
        Quality: <span x-text="quality + '%'" />
      </span>
      <input
        type="range"
        min="30"
        max="100"
        step="5"
        x-model="quality"
        class="w-full accent-ember"
        x-on:change="reprocess()"
      />
    </label>
  );
}

export function FormatControl() {
  return (
    <label class="block">
      <span class="field-label">Output format</span>
      <select class="field" x-model="target" x-on:change="reprocess()">
        <option value="keep">Keep format (HEIC/AVIF → JPG)</option>
        <option value="image/jpeg">JPG</option>
        <option value="image/png">PNG</option>
        <option value="image/webp">WebP</option>
      </select>
      <span
        x-cloak
        x-show="target === 'keep' && items.some(i => i.file.type === 'image/png')"
        class="mt-1.5 block text-xs text-mist"
      >
        PNG is lossless, so "keep format" barely shrinks it — choose JPG or WebP for big savings.
      </span>
    </label>
  );
}

export function ResizeControls() {
  return (
    <div class="grid gap-4 sm:grid-cols-2">
      <div x-show="!usePercent" class="grid grid-cols-2 gap-3 sm:col-span-2">
        <label>
          <span class="field-label">Width (px)</span>
          <input type="number" class="field" x-model="wIn" placeholder="auto" x-on:change="reprocess()" />
        </label>
        <label>
          <span class="field-label">Height (px)</span>
          <input type="number" class="field" x-model="hIn" placeholder="auto" x-on:change="reprocess()" />
        </label>
      </div>
      <div x-cloak x-show="usePercent" class="sm:col-span-2">
        <label>
          <span class="field-label">
            Scale: <span x-text="percent + '%'" />
          </span>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            x-model="percent"
            class="w-full accent-ember"
            x-on:change="reprocess()"
          />
        </label>
      </div>
      <label class="flex items-center gap-2 text-sm font-semibold text-mist">
        <input type="checkbox" class="h-4 w-4 accent-ember" x-model="lock" x-on:change="reprocess()" />
        Lock aspect ratio
      </label>
      <label class="flex items-center gap-2 text-sm font-semibold text-mist">
        <input type="checkbox" class="h-4 w-4 accent-ember" x-model="usePercent" x-on:change="reprocess()" />
        Resize by percentage
      </label>
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
            <summary class="cursor-pointer text-[15px] font-semibold marker:text-ember">
              {f.q}
            </summary>
            <p class="mt-2 text-[15px] leading-7 text-mist">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Hero({ h1, intro }: { h1: string; intro: string }) {
  return (
    <div class="halo border-b border-line">
      <div class="mx-auto max-w-5xl px-4 py-10">
        <h1 class="font-display max-w-2xl text-3xl leading-tight sm:text-4xl">{h1}</h1>
        <p class="mt-3 max-w-2xl text-[15px] leading-7 text-mist">{intro}</p>
      </div>
    </div>
  );
}
