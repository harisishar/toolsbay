import { AD_SLOTS } from "@claudetools/seo";
import type { Faq } from "./seo.js";
import { QR_TYPES, type Field, type QrType } from "./content.js";
import { AdSlot } from "./layout.js";

function FieldInput({ f }: { f: Field }) {
  if (f.input === "textarea") {
    return (
      <label class={f.half ? "" : "block"}>
        <span class="field-label">{f.label}</span>
        <textarea
          class="field min-h-24"
          x-model={f.model}
          placeholder={f.placeholder ?? ""}
        />
      </label>
    );
  }
  if (f.input === "select") {
    return (
      <label>
        <span class="field-label">{f.label}</span>
        <select class="field" x-model={f.model}>
          {(f.options ?? []).map(([v, l]) => (
            <option value={v}>{l}</option>
          ))}
        </select>
      </label>
    );
  }
  if (f.input === "checkbox") {
    return (
      <label class="flex h-full items-center gap-2 pt-5 text-sm font-semibold text-ink-soft">
        <input
          type="checkbox"
          class="h-4 w-4 accent-accent"
          x-model={f.model}
        />
        {f.label}
      </label>
    );
  }
  return (
    <label>
      <span class="field-label">{f.label}</span>
      <input
        type="text"
        class="field"
        x-model={f.model}
        placeholder={f.placeholder ?? ""}
      />
    </label>
  );
}

export function Generator({ active }: { active: QrType }) {
  return (
    <div
      x-data={`qrApp('${active.type}')`}
      x-effect="render()"
      class="grid items-start gap-8 lg:grid-cols-[1fr_340px]"
    >
      <div>
        <nav aria-label="QR code type" class="mb-6 flex flex-wrap gap-1.5">
          {QR_TYPES.map((t) => (
            <a
              href={`/${t.slug}`}
              aria-current={t.type === active.type ? "page" : undefined}
              class={
                t.type === active.type
                  ? "rounded-md bg-ink px-3 py-1.5 text-sm font-semibold text-white"
                  : "rounded-md border border-line bg-white px-3 py-1.5 text-sm font-semibold text-ink-soft hover:border-accent hover:text-accent-deep"
              }
            >
              {t.label}
            </a>
          ))}
        </nav>

        <div class="rounded-lg border border-line bg-white p-5">
          <div class="grid gap-4 sm:grid-cols-2">
            {active.fields.map((f) => (
              <div class={f.half ? "" : "sm:col-span-2"}>
                <FieldInput f={f} />
              </div>
            ))}
          </div>

          <div class="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-4">
            <label>
              <span class="field-label">Size</span>
              <select class="field" x-model="size">
                <option value="240">240 px</option>
                <option value="320" selected>
                  320 px
                </option>
                <option value="480">480 px</option>
                <option value="640">640 px</option>
                <option value="1024">1024 px</option>
              </select>
            </label>
            <label>
              <span class="field-label">Error correction</span>
              <select class="field" x-model="ecc">
                <option value="L">L — 7%</option>
                <option value="M" selected>
                  M — 15%
                </option>
                <option value="Q">Q — 25%</option>
                <option value="H">H — 30%</option>
              </select>
            </label>
            <label>
              <span class="field-label">Foreground</span>
              <input type="color" class="field h-[42px] p-1" x-model="fg" />
            </label>
            <label>
              <span class="field-label">Background</span>
              <input type="color" class="field h-[42px] p-1" x-model="bg" />
            </label>
          </div>
        </div>
      </div>

      <aside class="lg:sticky lg:top-6">
        <div class="rounded-lg border border-line bg-white p-5">
          <div class="flex min-h-[280px] items-center justify-center rounded-md border border-dashed border-line bg-paper p-4">
            <canvas
              x-ref="canvas"
              x-show="payload"
              width="320"
              height="320"
              class="max-w-full"
            />
            <p x-show="!payload" class="px-6 text-center text-sm text-ink-soft">
              Fill in the form and your QR code appears here instantly.
            </p>
          </div>
          <div class="mt-4 grid grid-cols-3 gap-2">
            <button
              type="button"
              class="btn-primary"
              x-on:click="download('png')"
              x-bind:disabled="!payload"
              x-bind:class="!payload && 'opacity-40 pointer-events-none'"
            >
              PNG
            </button>
            <button
              type="button"
              class="btn-ghost"
              x-on:click="download('svg')"
              x-bind:disabled="!payload"
              x-bind:class="!payload && 'opacity-40 pointer-events-none'"
            >
              SVG
            </button>
            <button
              type="button"
              class="btn-ghost"
              x-on:click="download('jpg')"
              x-bind:disabled="!payload"
              x-bind:class="!payload && 'opacity-40 pointer-events-none'"
            >
              JPG
            </button>
          </div>
          <p class="mt-3 text-center text-xs text-ink-soft">
            Static code · never expires · generated locally
          </p>
        </div>
        <AdSlot
          slot={AD_SLOTS.rail}
          class="mt-6 hidden min-h-[250px] lg:block"
        />
      </aside>
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
          <details class="group rounded-md border border-line bg-white px-4 py-3">
            <summary class="cursor-pointer text-[15px] font-semibold marker:text-accent">
              {f.q}
            </summary>
            <p class="mt-2 text-[15px] leading-7 text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
