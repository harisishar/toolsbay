// Invariants over the TOOLS registry. These are cheap to break by hand-editing
// content.ts and expensive to notice: a wrong `kind` renders the wrong tool, a
// duplicate slug silently shadows a page, and a privacy claim on a server-path
// tool is a false statement about where the user's file goes.
import { test } from "node:test";
import assert from "node:assert/strict";
import { TOOLS, CATEGORIES, COMPARISONS } from "../src/content.ts";
import { assertComparisons } from "../../../scripts/assert-comparisons.mjs";

// Alpine components registered in src/client/app.ts, plus the ApiBody fallback
// used by every server-path conversion.
const CLIENT_KINDS = new Set([
  "merge",
  "split",
  "rotate",
  "organize",
  "pagenum",
  "watermark",
  "crop",
  "img2pdf",
  "pdf2jpg",
  "compress",
  "edit",
  "sign",
  "redact",
  "forms",
  "protect",
  "unlock",
  "compare",
  "totext",
  "scan",
  "html2pdf",
]);

test("slugs are unique and URL-safe", () => {
  const seen = new Set();
  for (const t of TOOLS) {
    assert.ok(!seen.has(t.slug), `duplicate slug: ${t.slug}`);
    seen.add(t.slug);
    assert.match(t.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `bad slug: ${t.slug}`);
  }
});

test("every tool has the SEO fields the page template renders", () => {
  for (const t of TOOLS) {
    for (const field of ["title", "desc", "h1", "intro", "label"]) {
      assert.ok(t[field]?.trim(), `${t.slug} is missing ${field}`);
    }
    assert.ok(Array.isArray(t.faq) && t.faq.length > 0, `${t.slug} has no FAQ`);
    for (const f of t.faq) {
      assert.ok(f.q?.trim() && f.a?.trim(), `${t.slug} has an empty FAQ entry`);
    }
    assert.ok(
      CATEGORIES.includes(t.category),
      `${t.slug}: bad category ${t.category}`,
    );
    // Long titles get truncated in the SERP; long descriptions get rewritten.
    assert.ok(
      t.title.length <= 75,
      `${t.slug}: title ${t.title.length} chars (>75)`,
    );
    assert.ok(
      t.desc.length <= 175,
      `${t.slug}: desc ${t.desc.length} chars (>175)`,
    );
  }
});

test("kind maps to a real component, or is a server conversion", () => {
  for (const t of TOOLS) {
    if (!CLIENT_KINDS.has(t.kind)) {
      assert.equal(
        t.server,
        true,
        `${t.slug}: kind "${t.kind}" has no client component and is not marked server:true`,
      );
    }
  }
});

// The honesty rule. CLAUDE.md allows a server path for the hard conversions, so
// those pages must not repeat the "never leaves your device" line the in-browser
// tools use — that would be a false claim on exactly the axis users trust us on.
test("server-path tools never claim files stay on the device", () => {
  const CLIENT_CLAIM = /never leave your device|runs entirely in your browser/i;
  for (const t of TOOLS.filter((x) => x.server)) {
    for (const f of t.faq) {
      assert.doesNotMatch(
        f.a,
        CLIENT_CLAIM,
        `${t.slug} is server-processed but its FAQ claims files stay local`,
      );
    }
    assert.doesNotMatch(
      `${t.title} ${t.desc}`,
      /no upload|never uploaded/i,
      `${t.slug} is server-processed but its title/desc says "no upload"`,
    );
    assert.ok(
      t.faq.some((f) => /processed on our server|streamed/i.test(f.a)),
      `${t.slug} is server-processed but never says so`,
    );
  }
});

test("in-browser tools do say the files stay local", () => {
  for (const t of TOOLS.filter((x) => !x.server)) {
    assert.ok(
      t.faq.some((f) =>
        /never leave your device|entirely in your browser/i.test(f.a),
      ),
      `${t.slug} runs locally but does not say so — that is the whole differentiator`,
    );
  }
});

// Presets are interpolated straight into an x-data attribute, so a stray quote
// would break the component; and only two components read one.
test("presets are valid for their component", () => {
  const ALLOWED = { pdf2jpg: ["jpeg", "png"], totext: ["txt", "md"] };
  for (const t of TOOLS.filter((x) => x.preset !== undefined)) {
    const allowed = ALLOWED[t.kind];
    assert.ok(allowed, `${t.slug}: kind "${t.kind}" does not read a preset`);
    assert.ok(
      allowed.includes(t.preset),
      `${t.slug}: preset "${t.preset}" not one of ${allowed.join("/")}`,
    );
    assert.match(
      t.preset,
      /^[a-z]+$/,
      `${t.slug}: preset must be a bare identifier`,
    );
  }
});

assertComparisons(test, COMPARISONS, { toolName: "PaperKit" });

// The honesty rule again, aimed at the one page most likely to break it. A
// comparison page argues "we do not upload and they do" — but 10 of our 34
// tools do upload, so an unqualified claim here would be a lie told louder
// than anywhere else on the site.
test("the PDF comparison never makes an unqualified no-upload claim", () => {
  const serverSlugs = TOOLS.filter((t) => t.server).map((t) => t.slug);
  assert.ok(serverSlugs.length > 0, "expected some server-path tools");

  for (const c of COMPARISONS) {
    const prose = [
      c.intro,
      ...c.sections.flatMap((s) => s.body),
      ...c.faq.map((f) => f.a),
      ...c.matrix.map((r) => `${r.us} ${r.them} ${r.note ?? ""}`),
    ].join(" ");

    // "never leaves your device" is only true when scoped. Every occurrence
    // must sit near a qualifier naming the subset it applies to.
    for (const m of prose.matchAll(
      /never (?:leave|leaves|uploaded|transmit)/gi,
    )) {
      const window = prose.slice(Math.max(0, m.index - 250), m.index + 250);
      assert.match(
        window,
        /\b(24|twenty-four|most|some)\b|in-browser tools|of (?:the|our) 34/i,
        `unqualified no-upload claim in ${c.slug}: "...${window.slice(200, 300)}..."`,
      );
    }

    // And the page must say out loud that the server path exists.
    assert.match(
      prose,
      /server/i,
      `${c.slug} never mentions the server-side conversions`,
    );
    assert.ok(
      /OCR|Office|PDF\/A|repair|URL-to-PDF/i.test(prose),
      `${c.slug} does not name which conversions are server-side`,
    );
  }
});

// A matrix row claiming a blanket browser-only tick would slip past the prose
// check above, so the cell itself has to be scoped.
test("the no-upload matrix row is scoped, not a bare yes", () => {
  for (const c of COMPARISONS) {
    const row = c.matrix.find((r) => /browser|upload/i.test(r.feature));
    assert.ok(row, `${c.slug}: expected a row about browser processing`);
    assert.doesNotMatch(
      row.us,
      /^(yes|all)$/i,
      `${c.slug}: "${row.feature}" claims all tools run locally — 10 do not`,
    );
    assert.match(
      row.us,
      /\d/,
      `${c.slug}: "${row.feature}" must say how many tools`,
    );
  }
});

test("the pages added from keyword research are wired correctly", () => {
  const bySlug = Object.fromEntries(TOOLS.map((t) => [t.slug, t]));
  const expected = {
    "pdf-to-png": { kind: "pdf2jpg", preset: "png" },
    "pdf-to-jpg": { kind: "pdf2jpg", preset: undefined },
    "pdf-to-text": { kind: "totext", preset: "txt" },
    "pdf-to-markdown": { kind: "totext", preset: "md" },
    "png-to-pdf": { kind: "img2pdf", preset: undefined },
    "delete-pages-from-pdf": { kind: "organize", preset: undefined },
    "extract-pages-from-pdf": { kind: "split", preset: undefined },
  };
  for (const [slug, want] of Object.entries(expected)) {
    const t = bySlug[slug];
    assert.ok(t, `missing tool: ${slug}`);
    assert.equal(t.kind, want.kind, `${slug}: wrong kind`);
    assert.equal(t.preset, want.preset, `${slug}: wrong preset`);
    assert.ok(!t.server, `${slug} should be client-side`);
  }
});
