// Page-range parsing and file naming — tested in tests/ranges.test.mjs.

// "1-3, 5, 8-10" -> [0,1,2,4,7,8,9] (0-based, clamped to pageCount, order kept, deduped).
// Empty/blank input -> all pages.
export function parseRanges(input: string, pageCount: number): number[] {
  const trimmed = input.trim();
  if (!trimmed) return Array.from({ length: pageCount }, (_, i) => i);
  const out: number[] = [];
  const seen = new Set<number>();
  for (const part of trimmed.split(",")) {
    const p = part.trim();
    if (!p) continue;
    const m = p.match(/^(\d+)\s*-\s*(\d+)$/);
    let from: number, to: number;
    if (m) {
      from = parseInt(m[1]!, 10);
      to = parseInt(m[2]!, 10);
    } else if (/^\d+$/.test(p)) {
      from = to = parseInt(p, 10);
    } else {
      throw new Error(`Invalid range: "${p}"`);
    }
    if (from > to) [from, to] = [to, from];
    for (let n = from; n <= to; n++) {
      const idx = n - 1;
      if (idx >= 0 && idx < pageCount && !seen.has(idx)) {
        seen.add(idx);
        out.push(idx);
      }
    }
  }
  if (!out.length) throw new Error("No pages in range");
  return out;
}

// Split "1-3,5" into groups for split-by-range: each comma group becomes one output file.
export function parseRangeGroups(input: string, pageCount: number): number[][] {
  const trimmed = input.trim();
  if (!trimmed) return Array.from({ length: pageCount }, (_, i) => [i]);
  return trimmed
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean)
    .map((g) => parseRanges(g, pageCount));
}

export function baseName(name: string): string {
  return name.replace(/\.pdf$/i, "");
}

export function outName(name: string, suffix: string, ext = "pdf"): string {
  return `${baseName(name)}-${suffix}.${ext}`;
}
