// Generic Alpine shell: every calculator page uses calcApp(slug), which pulls
// the pure compute() from the shared registry and re-runs it on any input.
import { CALC_BY_SLUG } from '../lib/calcs/index.ts';
import type { OutRow, OutTable } from '../lib/calc-types.ts';

function calcApp(slug: string) {
  const calc = CALC_BY_SLUG[slug];
  const v: Record<string, string> = {};
  for (const i of calc?.inputs ?? []) v[i.key] = String(i.def ?? '');
  return {
    v,
    rows: [] as OutRow[],
    table: null as OutTable | null,
    note: '',
    bump() {
      this.v._n = String(Number(this.v._n ?? 0) + 1);
    },
    recalc() {
      if (!calc) return;
      try {
        const r = calc.compute({ ...this.v });
        this.rows = r.rows;
        this.table = r.table ?? null;
        this.note = r.note ?? '';
      } catch {
        /* keep last good result while user is mid-edit */
      }
    },
    copy(text: string) {
      void navigator.clipboard?.writeText(text);
    },
  };
}

declare global {
  interface Window {
    Alpine: { data(name: string, fn: (...args: never[]) => unknown): void };
  }
}

document.addEventListener('alpine:init', () => {
  window.Alpine.data('calcApp', calcApp as never);
});
