// Shared depth invariants for the tool pages themselves — the 136 pages that
// are not comparison pages and not the privacy page.
//
// Before the depth pass these averaged 71 words (calculators) to 162 (image
// pairs): an <h1>, one sentence, a widget and a single FAQ. That is thin
// content by any measure, and the image pair pages were additionally generated
// from one template with the format names swapped, which is the shape search
// engines treat as doorway pages.
//
// These assertions are the acceptance test for fixing that. They live here
// rather than in four test files for the same reason assert-comparisons.mjs
// does: four copies would drift, and the whole point is that they do not.
import assert from "node:assert/strict";

const words = (s) =>
  String(s ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

// Full human prose of a page: the lead block, every section paragraph, every
// step, and both halves of every FAQ entry. Not UI labels, not form fields.
export function proseOf(p, leadField = "intro") {
  return [
    p[leadField],
    ...(p.sections ?? []).flatMap((s) => [s.h, ...(s.body ?? [])]),
    ...(p.steps ?? []).flatMap((s) => [s.name, s.text]),
    ...(p.faq ?? []).flatMap((f) => [f.q, f.a]),
  ]
    .filter(Boolean)
    .join(" ");
}

// Word trigrams, with digits and punctuation stripped. Digits go because two
// otherwise-identical templated pages differing only in "200 MB" vs "100 MB"
// are still the same page.
function shingles(text) {
  const w = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const out = new Set();
  for (let i = 0; i + 2 < w.length; i++)
    out.add(`${w[i]} ${w[i + 1]} ${w[i + 2]}`);
  return out;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const s of a) if (b.has(s)) shared++;
  return shared / (a.size + b.size - shared);
}

/**
 * @param test       node:test's `test`
 * @param pages      the registry array
 * @param opts.tool  name used in failure messages
 * @param opts.leadField   which field carries the citable opening block
 * @param opts.minLead/maxLead  word bounds for that block
 * @param opts.minWords    total prose floor for the page
 * @param opts.minSections / opts.minFaq
 * @param opts.maxSimilarity  Jaccard ceiling between any two pages
 * @param opts.skip  slugs exempt from the depth floor (hubs, index pages)
 */
export function assertProse(test, pages, opts = {}) {
  const {
    tool = "pages",
    leadField = "intro",
    minLead = 120,
    maxLead = 190,
    minWords = 380,
    minSections = 3,
    minFaq = 4,
    maxSimilarity = 0.5,
    skip = [],
  } = opts;

  const subject = pages.filter((p) => !skip.includes(p.slug));

  test(`${tool}: every page opens with a citable block`, () => {
    for (const p of subject) {
      const n = words(p[leadField]).length;
      // AI Overviews and ChatGPT quote self-contained passages of roughly
      // 134-167 words. Shorter is not quotable; longer stops being a passage.
      assert.ok(
        n >= minLead && n <= maxLead,
        `${p.slug}: ${leadField} is ${n} words, want ${minLead}-${maxLead}`,
      );
    }
  });

  test(`${tool}: every page has a real article body`, () => {
    for (const p of subject) {
      assert.ok(
        Array.isArray(p.sections) && p.sections.length >= minSections,
        `${p.slug}: ${p.sections?.length ?? 0} sections, want >= ${minSections}`,
      );
      for (const s of p.sections) {
        assert.ok(s.h?.trim(), `${p.slug}: section with no heading`);
        assert.ok(
          Array.isArray(s.body) && s.body.length > 0,
          `${p.slug}: section "${s.h}" has an empty body`,
        );
        for (const para of s.body)
          assert.ok(para?.trim(), `${p.slug}: empty paragraph in "${s.h}"`);
      }
      const total = words(proseOf(p, leadField)).length;
      assert.ok(
        total >= minWords,
        `${p.slug}: ${total} words of prose, want >= ${minWords}`,
      );
    }
  });

  test(`${tool}: every page answers at least ${minFaq} questions`, () => {
    for (const p of subject) {
      assert.ok(
        Array.isArray(p.faq) && p.faq.length >= minFaq,
        `${p.slug}: ${p.faq?.length ?? 0} FAQ entries, want >= ${minFaq}`,
      );
      for (const f of p.faq)
        assert.ok(f.q?.trim() && f.a?.trim(), `${p.slug}: empty FAQ entry`);
    }
  });

  test(`${tool}: titles and descriptions fit the SERP`, () => {
    for (const p of pages) {
      assert.ok(p.title?.trim(), `${p.slug}: no title`);
      assert.ok(p.desc?.trim(), `${p.slug}: no desc`);
      assert.ok(
        p.title.length <= 75,
        `${p.slug}: title ${p.title.length} chars (>75)`,
      );
      // Google truncates the snippet around 155-160 characters on desktop and
      // shorter on mobile. 175 was letting descriptions ship pre-truncated.
      assert.ok(
        p.desc.length <= 160,
        `${p.slug}: desc ${p.desc.length} chars (>160)`,
      );
    }
  });

  test(`${tool}: steps, where present, are complete`, () => {
    for (const p of pages) {
      if (!p.steps) continue;
      assert.ok(
        p.steps.length >= 2,
        `${p.slug}: a one-step HowTo is not a HowTo`,
      );
      for (const s of p.steps)
        assert.ok(
          s.name?.trim() && s.text?.trim(),
          `${p.slug}: incomplete step`,
        );
    }
  });

  // The one that matters. Depth added by templating is only worth having if the
  // pages actually differ — otherwise it converts a thin-content problem into a
  // duplicate-content problem. Digits are stripped before comparison so varying
  // only the numbers does not count as varying the page.
  //
  // ponytail: O(n^2) trigram Jaccard. Fine at 51 pages; reach for minhash if a
  // registry ever runs to thousands.
  test(`${tool}: no two pages read the same`, () => {
    const sets = subject.map((p) => [p.slug, shingles(proseOf(p, leadField))]);
    let worst = { score: 0, a: null, b: null };
    for (let i = 0; i < sets.length; i++) {
      for (let j = i + 1; j < sets.length; j++) {
        const score = jaccard(sets[i][1], sets[j][1]);
        if (score > worst.score)
          worst = { score, a: sets[i][0], b: sets[j][0] };
      }
    }
    assert.ok(
      worst.score <= maxSimilarity,
      `${worst.a} and ${worst.b} are ${(worst.score * 100).toFixed(0)}% identical ` +
        `(ceiling ${maxSimilarity * 100}%) — template on per-page facts, not adjectives`,
    );
  });
}
