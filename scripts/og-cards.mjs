// Emits one 1200x630 og:image card per tool, styled from that tool's own palette
// and display font (both already vendored into its public/ by build:vendor).
//
// Rasterising needs a browser, so this is a manual step, not part of `build` —
// the PNGs are committed. Regenerate after a rename or palette change:
//
//   node scripts/og-cards.mjs
//   for t in hub calculator image pdf qr; do
//     "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
//       --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
//       --window-size=1200,630 --allow-file-access-from-files \
//       --screenshot="tools/$t/public/og.png" "file://$PWD/scripts/.og/$t.html"
//   done
import { writeFileSync, mkdirSync } from "node:fs";

const REPO = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const out = `${REPO}/scripts/.og/`;

const CARDS = [
  {
    tool: "hub",
    name: "ToolsBay",
    line: "Free online tools —\nno signup, nothing uploaded",
    foot: "toolsbay.app",
    bg: "#f7f4ec",
    fg: "#1a1f2b",
    soft: "#4b5265",
    line_: "#ddd7c8",
    accent: "#e08914",
    marks: ["#e08914", "#c2417f", "#cf4531", "#009a5a"],
    font: "Bricolage Grotesque",
    file: "bricolage-800.woff2",
    radius: "2px",
  },
  {
    tool: "calculator",
    name: "CalcHub",
    line: "Free online calculators —\nfinance, health, salary & math",
    foot: "calc.toolsbay.app",
    bg: "#f8f7f2",
    fg: "#14213d",
    soft: "#40506e",
    line_: "#e2ded2",
    accent: "#e8a20c",
    marks: ["#e8a20c"],
    font: "Familjen Grotesk",
    file: "familjen-700.woff2",
    radius: "999px",
  },
  {
    tool: "pdf",
    name: "PaperKit",
    line: "Free PDF tools —\nmerge, split, compress, convert",
    foot: "pdf.toolsbay.app",
    bg: "#faf6ee",
    fg: "#221c15",
    soft: "#6f6759",
    line_: "#e6ddcc",
    accent: "#b3402a",
    marks: ["#b3402a"],
    // 10 pdf tools are server-processed, so no sitewide "nothing uploaded" claim
    // here — tools/pdf/tests/tools.test.mjs:84 guards exactly that wording.
    note: "free · no account · no task limits",
    font: "Fraunces",
    file: "fraunces-700.woff2",
    radius: "2px",
    rotate: true,
  },
  {
    tool: "image",
    name: "ImgSquash",
    line: "Compress, resize and convert\nimages in your browser",
    foot: "image.toolsbay.app",
    bg: "#0d0e12",
    fg: "#e8e9ee",
    soft: "#9aa0af",
    line_: "#272b36",
    accent: "#ff6b4a",
    marks: ["#ff6b4a"],
    font: "Bricolage Grotesque",
    file: "bricolage-700.woff2",
    radius: "2px",
  },
  {
    tool: "qr",
    name: "MakeQR",
    line: "Free QR codes and barcodes —\nno account, never expires",
    foot: "qr.toolsbay.app",
    bg: "#f6f8f6",
    fg: "#101314",
    soft: "#3d4645",
    line_: "#dbe2dd",
    accent: "#00b569",
    marks: ["#00b569"],
    font: "Chakra Petch",
    file: "chakra-petch-700.woff2",
    radius: "2px",
  },
];

const html = (c) => `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: "${c.font}";
    src: url("file://${REPO}/tools/${c.tool}/public/fonts/${c.file}") format("woff2");
    font-weight: 700 800;
  }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: ${c.bg}; color: ${c.fg};
         font-family: "${c.font}", sans-serif; overflow: hidden; }
  .card { height: 100%; padding: 84px 88px; display: flex; flex-direction: column;
          justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 18px; }
  .marks { display: flex; gap: 8px; }
  .m { width: 26px; height: 26px; border-radius: ${c.radius};
       ${c.rotate ? "transform: rotate(45deg);" : ""} }
  .name { font-size: 40px; letter-spacing: -0.02em; }
  h1 { font-size: 72px; line-height: 1.12; letter-spacing: -0.035em;
       white-space: pre; }
  .rule { height: 6px; width: 128px; background: ${c.accent}; margin-bottom: 34px; }
  .foot { display: flex; align-items: baseline; justify-content: space-between;
          border-top: 2px solid ${c.line_}; padding-top: 28px;
          font-size: 27px; color: ${c.soft}; letter-spacing: -0.01em; }
  .dom { color: ${c.fg}; }
</style>
<div class="card">
  <div class="brand">
    <div class="marks">${c.marks
      .map(() => "")
      .map((_, i) => `<div class="m" style="background:${c.marks[i]}"></div>`)
      .join("")}</div>
    <div class="name">${c.name}</div>
  </div>
  <div>
    <div class="rule"></div>
    <h1>${c.line}</h1>
  </div>
  <div class="foot">
    <span class="dom">${c.foot}</span>
    <span>${c.note ?? "runs in your browser · nothing uploaded"}</span>
  </div>
</div>`;

mkdirSync(out, { recursive: true });
for (const c of CARDS) writeFileSync(`${out}${c.tool}.html`, html(c));
console.log(CARDS.map((c) => `${out}${c.tool}.html`).join("\n"));
