// Reads tools/hub/articles/*.md into structured article objects.
//
// Shared deliberately: scripts/build-articles.mjs bakes the result into
// tools/hub/src/articles.gen.ts for the Worker (Cloudflare has no filesystem at
// runtime, so nothing can be globbed there), and tools/hub/tests read this
// directly. Tests reading the .md files rather than the generated module means
// a new article is held to the depth bar the moment it is written, not after
// somebody remembers to rebuild.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";

export const ARTICLES_DIR = new URL("../tools/hub/articles/", import.meta.url)
  .pathname;

// A YAML subset: `key: value` per line, plus `[a, b]` inline lists. Fifteen
// lines instead of a dependency, and it fails loudly rather than guessing.
function parseFrontmatter(raw, file) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(raw);
  if (!m) throw new Error(`${file}: no frontmatter block`);
  const meta = {};
  for (const line of m[1].split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const i = line.indexOf(":");
    if (i === -1) throw new Error(`${file}: bad frontmatter line: ${line}`);
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    )
      value = value.slice(1, -1);
    meta[key] =
      value.startsWith("[") && value.endsWith("]")
        ? value
            .slice(1, -1)
            .split(",")
            .map((s) => s.trim().replace(/^["']|["']$/g, ""))
            .filter(Boolean)
        : value;
  }
  return { meta, body: raw.slice(m[0].length) };
}

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

// First paragraph, as plain text. Used for the index listing and as the
// citable opening block, so it has to survive without its markup.
function leadOf(body) {
  const para = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .find((p) => p && !p.startsWith("#") && !p.startsWith(">"));
  return (para ?? "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → their text
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function readArticles() {
  const files = readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();
  const articles = files.map((file) => {
    const raw = readFileSync(join(ARTICLES_DIR, file), "utf8");
    const { meta, body } = parseFrontmatter(raw, file);
    for (const key of ["title", "description", "date"])
      if (!meta[key])
        throw new Error(`${file}: frontmatter is missing "${key}"`);

    const slug = file.replace(/\.md$/, "");
    const n = words(body.replace(/```[\s\S]*?```/g, " "));
    return {
      slug,
      file,
      title: meta.title,
      description: meta.description,
      date: meta.date,
      updated: meta.updated || meta.date,
      tags: Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [],
      lead: leadOf(body),
      html: marked.parse(body, {
        async: false,
        mangle: false,
        headerIds: false,
      }),
      words: n,
      readingMinutes: Math.max(1, Math.round(n / 200)),
      body,
    };
  });
  // Newest first — the order the index and the sitemap both want.
  return articles.sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );
}
