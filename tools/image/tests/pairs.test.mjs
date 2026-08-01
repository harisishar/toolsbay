// PAIRS is generated (SOURCES × TARGETS), so a single bad entry in either map
// silently multiplies into a row of broken pages. These assertions are about the
// generated surface, not the generator.
import { test } from "node:test";
import assert from "node:assert/strict";
import { PAIRS, SOURCES, TARGETS, COMPARISONS } from "../src/content.ts";
import { SITE } from "../src/seo.ts";
import { assertComparisons } from "../../../scripts/assert-comparisons.mjs";

// Read the brand rather than repeating it: this assertion exists to catch prose
// that forgets to name the tool, not to pin the tool's name. Hardcoding it here
// made a rename fail the suite for the wrong reason.
assertComparisons(test, COMPARISONS, { toolName: SITE.name });

// Every ImgSquash tool really is client-side, so unlike the PDF page this one
// may make the claim flatly — but only about tools that exist. Upscaling and
// background removal do not, and pretending otherwise in a comparison against
// a competitor that ships both is the easiest lie to tell here.
test("the image comparison does not claim tools we do not have", () => {
  for (const c of COMPARISONS) {
    for (const r of c.matrix) {
      if (/upscale|background|editor/i.test(r.feature)) {
        assert.match(
          r.us,
          /^(No|Not offered)/i,
          `${c.slug}: "${r.feature}" claims a tool ${SITE.name} does not ship`,
        );
      }
    }
    const slugs = new Set(PAIRS.map((p) => p.slug));
    assert.ok(slugs.has("heic-to-jpg"), "the comparison links /heic-to-jpg");
    assert.ok(slugs.has("png-to-jpg"), "the comparison links /png-to-jpg");
    assert.ok(slugs.has("jpg-to-webp"), "the comparison links /jpg-to-webp");
  }
});

test("one page per source/target combination, minus the no-ops", () => {
  const srcs = Object.keys(SOURCES);
  const tgts = Object.keys(TARGETS);
  const sameFormat = srcs.filter((s) => tgts.includes(s)).length;
  assert.equal(PAIRS.length, srcs.length * tgts.length - sameFormat);

  // No jpg-to-jpg pages: they would be duplicate-content no-ops.
  for (const p of PAIRS)
    assert.notEqual(p.src, p.tgt, `${p.slug} converts to itself`);

  const slugs = PAIRS.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate pair slug");
});

test("slugs follow the src-to-tgt route pattern index.tsx registers", () => {
  for (const p of PAIRS) {
    assert.equal(
      p.slug,
      `${p.src}-to-${p.tgt}`,
      `${p.slug} does not match its src/tgt`,
    );
    assert.match(p.slug, /^[a-z0-9]+-to-[a-z0-9]+$/);
  }
});

test("every target maps to a mime the encoder understands", () => {
  const ENCODABLE = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/x-icon",
  ]);
  for (const [key, t] of Object.entries(TARGETS)) {
    assert.ok(
      ENCODABLE.has(t.mime),
      `target ${key}: encoder cannot produce ${t.mime}`,
    );
    assert.ok(
      t.label?.trim() && t.long?.trim() && t.pros?.trim(),
      `target ${key} incomplete`,
    );
  }
  for (const [key, s] of Object.entries(SOURCES)) {
    assert.ok(
      s.label?.trim() && s.long?.trim() && s.blurb?.trim(),
      `source ${key} incomplete`,
    );
  }
});

test("pages carry the SEO fields and stay within SERP limits", () => {
  for (const p of PAIRS) {
    for (const field of ["title", "desc", "h1", "intro"]) {
      assert.ok(p[field]?.trim(), `${p.slug} missing ${field}`);
    }
    assert.ok(
      p.title.length <= 75,
      `${p.slug}: title ${p.title.length} chars (>75)`,
    );
    assert.ok(
      p.desc.length <= 175,
      `${p.slug}: desc ${p.desc.length} chars (>175)`,
    );
    assert.ok(p.faq.length >= 2, `${p.slug} has a thin FAQ (${p.faq.length})`);
  }
});

// Lossy or lossless, transparent or not — a converter that quietly drops
// information has to say so on the page where it happens.
test("pages disclose the information each conversion loses", () => {
  const byslug = Object.fromEntries(PAIRS.map((p) => [p.slug, p]));
  const faqText = (p) => p.faq.map((f) => `${f.q} ${f.a}`).join(" ");

  for (const p of PAIRS) {
    // Alpha source into a non-alpha target must warn about transparency.
    if (SOURCES[p.src].alpha && !TARGETS[p.tgt].alpha) {
      assert.match(
        faqText(p),
        /transparen/i,
        `${p.slug} drops transparency without saying so`,
      );
    }
    // GIF is the only animated source; output is always a still.
    if (p.src === "gif") {
      assert.match(
        faqText(p),
        /animat/i,
        `${p.slug} does not mention losing animation`,
      );
    }
  }

  // ICO has a hard 256px ceiling that surprises people converting a photo.
  for (const p of PAIRS.filter((x) => x.tgt === "ico")) {
    assert.match(
      faqText(p),
      /256/,
      `${p.slug} does not mention the 256px ICO limit`,
    );
    assert.match(
      faqText(p),
      /favicon/i,
      `${p.slug} should explain the favicon use case`,
    );
  }

  assert.equal(
    byslug["heic-to-jpg"].src,
    "heic",
    "heic-to-jpg is the tool’s top target",
  );
  assert.match(
    faqText(byslug["heic-to-jpg"]),
    /iphone/i,
    "HEIC pages should name the iPhone",
  );
});
