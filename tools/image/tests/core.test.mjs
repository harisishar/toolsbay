// CORE is the single list the nav, footer, homepage tiles, sitemap, llms.txt and
// the hub catalogue all read. It used to be five separate literal lists; these
// assertions are what make consolidating them safe.
import { test } from "node:test";
import assert from "node:assert/strict";
import { CORE, TOOL_FAQ, MODEL_MB } from "../src/content.ts";

test("core pages have unique, route-shaped paths", () => {
  const seen = new Set();
  for (const t of CORE) {
    assert.match(t.path, /^\/[a-z0-9]+(-[a-z0-9]+)*$/, `bad path: ${t.path}`);
    assert.ok(!seen.has(t.path), `duplicate core path: ${t.path}`);
    seen.add(t.path);
  }
});

test("every core page carries the labels its consumers render", () => {
  for (const t of CORE) {
    for (const field of ["label", "tile", "blurb", "llms"]) {
      assert.ok(t[field]?.trim(), `${t.path} missing ${field}`);
    }
    // The homepage tile heading sits in a five-column grid.
    assert.ok(t.tile.length <= 12, `${t.path}: tile "${t.tile}" is too long`);
  }
});

test("the four original core pages are still listed", () => {
  const paths = new Set(CORE.map((t) => t.path));
  for (const p of [
    "/compress-image",
    "/resize-image",
    "/crop-image",
    "/image-converter",
  ]) {
    assert.ok(paths.has(p), `${p} dropped out of CORE`);
  }
});

// Background removal is the only tool here that downloads tens of megabytes and
// runs for seconds. Both facts have to reach the user before they drop a file,
// or the page reads as broken on a phone.
test("the background-removal FAQ discloses the download and the privacy claim", () => {
  const faq = TOOL_FAQ.removeBackground;
  assert.ok(faq && faq.length >= 2, "remove-background needs a real FAQ");
  const text = faq.map((f) => `${f.q} ${f.a}`).join(" ");

  assert.match(text, new RegExp(`${MODEL_MB}\\s*MB`), "FAQ hides the download size");
  assert.match(text, /browser|device/i, "FAQ does not say where the work happens");
  assert.match(
    text,
    /never leaves|no upload|not upload|never uploaded/i,
    "FAQ omits the no-upload claim that is this page's whole differentiator",
  );
  assert.match(text, /PNG/, "FAQ does not say what file comes back");
});

test("the page promising transparency is the one that outputs PNG", () => {
  const bg = CORE.find((t) => t.path === "/remove-background");
  assert.ok(bg, "/remove-background missing from CORE");
  assert.match(bg.llms, /transparent PNG/i, "llms.txt entry undersells the output");
  assert.match(bg.llms, new RegExp(`${MODEL_MB}`), "llms.txt entry hides the download");
});
