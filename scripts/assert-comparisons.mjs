// Shared invariants for the competitor comparison pages. Each tool has its own
// COMPARISONS array but they render through the same template and carry the
// same risk: a stale price, an unsourced claim, or a privacy statement that is
// true of some tools and not others.
//
// Imported by tools/*/tests/*.test.mjs so the rules live in one place — four
// copies of these assertions would drift, and the whole point of them is that
// they do not.
import assert from "node:assert/strict";

export function assertComparisons(test, COMPARISONS, opts = {}) {
  const { toolName } = opts;

  test("comparison pages have the fields the template renders", () => {
    assert.ok(COMPARISONS.length > 0, "no comparison pages defined");
    for (const c of COMPARISONS) {
      assert.match(c.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `bad slug: ${c.slug}`);
      for (const field of [
        "title",
        "desc",
        "h1",
        "intro",
        "competitor",
        "updated",
      ]) {
        assert.ok(c[field]?.trim(), `${c.slug} is missing ${field}`);
      }
      // Same SERP limits the tool pages are held to.
      assert.ok(
        c.title.length <= 75,
        `${c.slug}: title ${c.title.length} chars (>75)`,
      );
      assert.ok(
        c.desc.length <= 175,
        `${c.slug}: desc ${c.desc.length} chars (>175)`,
      );
      assert.match(
        c.updated,
        /^\d{4}-\d{2}-\d{2}$/,
        `${c.slug}: updated must be YYYY-MM-DD`,
      );

      assert.ok(
        Array.isArray(c.sections) && c.sections.length >= 3,
        `${c.slug}: too few sections`,
      );
      for (const s of c.sections) {
        assert.ok(s.h?.trim(), `${c.slug} has a section with no heading`);
        assert.ok(
          Array.isArray(s.body) && s.body.length > 0,
          `${c.slug}: empty section body`,
        );
        for (const p of s.body)
          assert.ok(p?.trim(), `${c.slug}: empty paragraph`);
      }

      assert.ok(
        Array.isArray(c.faq) && c.faq.length >= 3,
        `${c.slug}: needs at least 3 FAQ entries`,
      );
      for (const f of c.faq) {
        assert.ok(
          f.q?.trim() && f.a?.trim(),
          `${c.slug} has an empty FAQ entry`,
        );
      }
    }
  });

  test("every matrix row is complete", () => {
    for (const c of COMPARISONS) {
      assert.ok(
        Array.isArray(c.matrix) && c.matrix.length >= 5,
        `${c.slug}: matrix too thin`,
      );
      for (const r of c.matrix) {
        assert.ok(
          r.feature?.trim(),
          `${c.slug}: matrix row with no feature label`,
        );
        // Empty cells read as "unknown" and invite the reader to assume the worst
        // of the competitor. Say something in both columns or drop the row.
        assert.ok(
          r.us?.trim(),
          `${c.slug}: "${r.feature}" has no value for us`,
        );
        assert.ok(
          r.them?.trim(),
          `${c.slug}: "${r.feature}" has no value for ${c.competitor}`,
        );
      }
    }
  });

  // Every number quoted about a competitor has to be checkable, or the page is
  // just assertion — which is exactly what these pages accuse competitors of.
  test("competitor claims are sourced", () => {
    for (const c of COMPARISONS) {
      assert.ok(
        Array.isArray(c.sources) && c.sources.length > 0,
        `${c.slug} cites no sources`,
      );
      for (const s of c.sources) {
        assert.ok(s.label?.trim(), `${c.slug}: source with no label`);
        assert.match(
          s.url,
          /^https:\/\//,
          `${c.slug}: source URL must be absolute https`,
        );
      }
    }
  });

  // The comparison page is the most tempting place to overclaim, because it is
  // the one page whose whole job is to draw a contrast.
  if (toolName) {
    test("the page names the tool and discloses the affiliation", () => {
      for (const c of COMPARISONS) {
        const prose = [c.intro, ...c.sections.flatMap((s) => s.body)].join(" ");
        assert.ok(
          prose.includes(toolName),
          `${c.slug} never names ${toolName}`,
        );
        assert.match(
          prose,
          /Disclosure:/,
          `${c.slug}: must disclose that ${toolName} is ours`,
        );
      }
    });

    test("the competitor gets a section saying where it wins", () => {
      for (const c of COMPARISONS) {
        assert.ok(
          c.sections.some((s) => /better|wins/i.test(s.h)),
          `${c.slug}: no "where ${c.competitor} is better" section`,
        );
      }
    });
  }
}
