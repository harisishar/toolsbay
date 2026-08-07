// Depth and honesty invariants for the apex.
//
// The apex previously served two URLs — a link directory and a privacy policy —
// and Google AdSense flagged the site for "low value content". These assertions
// are the acceptance test for the fix, and the thing that stops it rotting: a
// guide that gets trimmed below the bar, a trust page that loses its contact
// route, or a factual claim that drifts away from the registry it describes all
// fail here rather than in a policy review.
import { test } from "node:test";
import assert from "node:assert/strict";
import { GUIDES, GUIDES_INDEX } from "../src/guides.ts";
import { TRUST_PAGES, SERVER_TOOLS } from "../src/pages.ts";
import { CONTACT_EMAIL, privacySections } from "@claudetools/seo";
import { assertProse, proseOf } from "../../../scripts/assert-prose.mjs";
import { readArticles } from "../../../scripts/articles.mjs";
import { ARTICLES } from "../src/articles.gen.ts";

const words = (s) =>
  String(s ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

// The guides carry the "unique high quality content" burden, so they are held
// to a higher floor than the tool pages: 800 words rather than 380, and four
// sections rather than three.
assertProse(test, GUIDES, {
  tool: "guides",
  leadField: "lead",
  minWords: 800,
  minSections: 4,
  minFaq: 4,
});

test("guides: every guide hands off to a tool", () => {
  for (const g of GUIDES) {
    assert.ok(g.cta?.href?.startsWith("https://"), `${g.slug}: no cta href`);
    assert.ok(g.cta.label?.trim(), `${g.slug}: no cta label`);
    assert.ok(g.cta.note?.trim(), `${g.slug}: no cta note`);
  }
});

test("guides: slugs are unique and URL-safe", () => {
  const seen = new Set();
  for (const g of GUIDES) {
    assert.ok(!seen.has(g.slug), `duplicate guide slug: ${g.slug}`);
    seen.add(g.slug);
    assert.match(g.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `bad slug: ${g.slug}`);
  }
});

test("trust pages: real prose, not a stub", () => {
  for (const p of TRUST_PAGES) {
    const lead = words(p.lead).length;
    // Lower than the guides: /contact and /ai-information are reference pages,
    // not essays, and padding them would be the exact thin-content instinct
    // this whole change exists to remove.
    assert.ok(
      lead >= 90 && lead <= 200,
      `${p.slug}: lead is ${lead} words, want 90-200`,
    );
    assert.ok(
      p.sections?.length >= 3,
      `${p.slug}: ${p.sections?.length ?? 0} sections, want >= 3`,
    );
    const total = words(proseOf(p, "lead")).length;
    assert.ok(total >= 400, `${p.slug}: ${total} words of prose, want >= 400`);
    assert.ok(p.title.length <= 75, `${p.slug}: title ${p.title.length} chars`);
    assert.ok(p.desc.length <= 160, `${p.slug}: desc ${p.desc.length} chars`);
    assert.match(p.updated, /^\d{4}-\d{2}-\d{2}$/, `${p.slug}: bad updated`);
  }
});

test("the four pages a policy reviewer looks for exist", () => {
  const slugs = TRUST_PAGES.map((p) => p.slug);
  for (const required of ["about", "contact", "terms", "how-we-build"])
    assert.ok(slugs.includes(required), `missing /${required}`);
});

test("no placeholder text reaches a live page", () => {
  // ToolsBay publishes unattributed, so there is no operator name to assert —
  // but /about and /ai-information still interpolate identity constants, and a
  // SET_ME placeholder rendering on the page whose whole job is answering "who
  // runs this site" would be worse than saying nothing. Catch the shape, not
  // one specific constant.
  const prose = [
    ...TRUST_PAGES.flatMap((p) => proseOf(p, "lead")),
    ...GUIDES.flatMap((g) => proseOf(g, "lead")),
    ...articles.map((a) => a.body),
  ].join(" ");
  assert.doesNotMatch(
    prose,
    /SET_[A-Z_]+|TODO|FIXME|\bLorem ipsum\b|\bXXX\b/,
    "placeholder text is rendering on a live page",
  );
});

test("the publisher is identifiable even without a name", () => {
  // The unattributed route is the weaker E-E-A-T option, so the compensating
  // signals have to actually be there: /about must say who runs it and where,
  // and must reach a working contact route.
  const about = TRUST_PAGES.find((p) => p.slug === "about");
  const text = proseOf(about, "lead");
  assert.match(text, /independent/i, "/about does not describe the operator");
  assert.match(text, /Malaysia/, "/about does not say where it operates from");
  assert.match(text, /\/contact|mailto:/, "/about does not reach contact");
});

test("no page promises contact details that do not exist", () => {
  // The privacy policy used to tell readers to "contact the site operator via
  // the contact details on the homepage of this site". There were none. A
  // policy page that breaks its own promise is the worst artefact to leave in
  // front of a policy reviewer, so it is asserted against rather than trusted.
  const prose = [
    ...TRUST_PAGES.flatMap((p) => proseOf(p, "lead")),
    ...GUIDES.flatMap((g) => proseOf(g, "lead")),
    ...privacySections({ siteName: "ToolsBay", what: "files" }).flatMap(
      (s) => s.body,
    ),
  ].join(" ");
  assert.doesNotMatch(prose, /contact details on the homepage/i);
  assert.match(prose, new RegExp(CONTACT_EMAIL.replace(".", "\\.")));
});

test("the server-side tool count matches the pdf registry", async () => {
  // /about, /how-we-build and /ai-information all state this number. If a new
  // server-path tool ships, those pages become wrong — so they break here.
  const { TOOLS } = await import("../../pdf/src/content.ts");
  const actual = TOOLS.filter((t) => t.server).length;
  assert.equal(
    SERVER_TOOLS,
    actual,
    `SERVER_TOOLS says ${SERVER_TOOLS}, pdf registry has ${actual}`,
  );
});

test("internal links point at routes that exist", () => {
  const routes = new Set([
    "/",
    "/guides",
    "/privacy-policy",
    ...TRUST_PAGES.map((p) => `/${p.slug}`),
    ...GUIDES.map((g) => `/guides/${g.slug}`),
  ]);
  const bodies = [
    ...TRUST_PAGES.flatMap((p) => [
      p.lead,
      ...p.sections.flatMap((s) => s.body),
      ...(p.faq ?? []).map((f) => f.a),
    ]),
    ...GUIDES.flatMap((g) => [
      g.lead,
      ...g.sections.flatMap((s) => s.body),
      ...g.faq.map((f) => f.a),
    ]),
  ].join(" ");
  for (const [, href] of bodies.matchAll(/href="(\/[^"#]*)"/g))
    assert.ok(routes.has(href), `link to a route that does not exist: ${href}`);
});

// --- Articles ---------------------------------------------------------------
//
// Read from tools/hub/articles/*.md rather than from the generated module, so a
// new article is held to the bar the moment it is written rather than after
// somebody remembers to rebuild. The whole point of a drop-in-a-file publishing
// path is that it is easy; the whole risk is that it makes thin posts easy too,
// which on a site that has just been flagged for low value content is the one
// mistake that cannot be repeated.
const articles = readArticles();

test("articles: every article carries real depth", () => {
  for (const a of articles) {
    assert.ok(
      a.words >= 700,
      `${a.file}: ${a.words} words, want >= 700 — publish it properly or not at all`,
    );
    const lead = words(a.lead).length;
    assert.ok(
      lead >= 90 && lead <= 200,
      `${a.file}: opening paragraph is ${lead} words, want 90-200`,
    );
    assert.ok(
      /<h2[ >]/.test(a.html),
      `${a.file}: no ## headings — an article this long needs structure`,
    );
    assert.ok(
      !/<h1[ >]/.test(a.html),
      `${a.file}: body contains an H1; the page renders the frontmatter title as the H1, so start at ##`,
    );
  }
});

test("articles: frontmatter fits the SERP and is well formed", () => {
  for (const a of articles) {
    assert.ok(a.title.length <= 75, `${a.file}: title ${a.title.length} chars`);
    assert.ok(
      a.description.length <= 160,
      `${a.file}: description ${a.description.length} chars (>160 truncates)`,
    );
    assert.match(a.date, /^\d{4}-\d{2}-\d{2}$/, `${a.file}: bad date`);
    assert.match(a.updated, /^\d{4}-\d{2}-\d{2}$/, `${a.file}: bad updated`);
    assert.ok(a.updated >= a.date, `${a.file}: updated is before date`);
    assert.ok(Array.isArray(a.tags), `${a.file}: tags must be a list`);
  }
});

test("articles: slugs are unique and URL-safe", () => {
  const seen = new Set();
  for (const a of articles) {
    assert.match(
      a.slug,
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      `${a.file}: filename must be lowercase-hyphenated — it becomes the URL`,
    );
    assert.ok(!seen.has(a.slug), `duplicate article slug: ${a.slug}`);
    seen.add(a.slug);
  }
});

test("articles: no two articles read the same", () => {
  // Same guard the tool pages get. A markdown drop-box is exactly where
  // near-duplicate posts appear first.
  const shingles = (t) => {
    const w = t
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    const out = new Set();
    for (let i = 0; i + 2 < w.length; i++)
      out.add(`${w[i]} ${w[i + 1]} ${w[i + 2]}`);
    return out;
  };
  const sets = articles.map((a) => [a.file, shingles(a.body)]);
  for (let i = 0; i < sets.length; i++)
    for (let k = i + 1; k < sets.length; k++) {
      const [a, x] = sets[i];
      const [b, y] = sets[k];
      let inter = 0;
      for (const s of x) if (y.has(s)) inter++;
      const score = inter / (x.size + y.size - inter);
      assert.ok(
        score < 0.4,
        `${a} and ${b} are ${Math.round(score * 100)}% alike`,
      );
    }
});

test("articles: relative links point at routes that exist", () => {
  const routes = new Set([
    "/",
    "/guides",
    "/articles",
    "/privacy-policy",
    ...TRUST_PAGES.map((p) => `/${p.slug}`),
    ...GUIDES.map((g) => `/guides/${g.slug}`),
    ...articles.map((a) => `/articles/${a.slug}`),
  ]);
  for (const a of articles)
    for (const [, href] of a.body.matchAll(/\]\((\/[^)#\s]*)/g))
      assert.ok(routes.has(href), `${a.file}: dead internal link ${href}`);
});

test("articles: the generated module matches the markdown", () => {
  // build-articles.mjs runs as part of `pnpm build`, which runs before dev and
  // deploy — but the generated file is committed, so this catches the case
  // where an .md was added and the module was not regenerated.
  assert.deepEqual(
    ARTICLES.map((a) => a.slug),
    articles.map((a) => a.slug),
    "articles.gen.ts is stale — run `pnpm --filter @tools/hub build:articles`",
  );
});

test("the guides index describes itself", () => {
  assert.ok(words(GUIDES_INDEX.lead).length >= 50);
  assert.ok(GUIDES_INDEX.desc.length <= 160);
  assert.ok(GUIDES_INDEX.title.length <= 75);
});
