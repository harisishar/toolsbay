import type { Comparison, Faq } from "./seo.js";

export type Section = { h: string; body: string[] };

// The 29 pair pages are generated from one template, which is the shape search
// engines treat as doorway content unless the pages carry facts of their own.
// So every format gets its own history, compression behaviour and support
// story below, and the page body is assembled from the source's facts, the
// target's facts, and a note specific to that combination. The similarity
// guard in scripts/assert-prose.mjs is what keeps this honest.
type SourceMeta = {
  label: string;
  long: string;
  blurb: string; // why people convert away from it
  short: string; // the same, compressed to fit a meta description under 160 chars
  alpha: boolean;
  what: string; // what the format is and how it compresses
  origin: string; // where files in this format come from
  limit: string; // the constraint that makes people convert
};

type TargetMeta = {
  label: string;
  long: string;
  mime: string;
  pros: string; // why convert to it
  alpha: boolean;
  what: string; // what the format does technically
  support: string; // where it opens, and where it does not
  bestFor: string; // the job it is actually right for
};

export const SOURCES: Record<string, SourceMeta> = {
  jpg: {
    label: "JPG",
    long: "JPEG photographs",
    blurb: "JPG is universal, but it is lossy and cannot store transparency",
    short: "JPG cannot store transparency",
    alpha: false,
    what: "JPEG has been the default photographic format since 1992. It divides the image into 8×8 blocks and discards the high-frequency detail within each one, which is why it compresses photographs so well and why hard edges and flat colour — screenshots, logos, text — pick up the smeared halos known as ringing artifacts.",
    origin:
      "Almost every camera, scanner and non-Apple phone writes JPG, and it is what a website will hand you when you save an image. If a file came from somewhere and you have no idea what produced it, JPG is the safe bet.",
    limit:
      "Two limits push people off JPEG: it has no alpha channel at all, so there is no way to store a transparent background, and every re-save discards more detail. That second one accumulates — an image edited and re-saved a dozen times looks visibly worse than the original with no single step to blame.",
  },
  png: {
    label: "PNG",
    long: "PNG graphics",
    blurb:
      "PNG is lossless and supports transparency, but files are often far larger than needed",
    short: "PNGs are often far larger than needed",
    alpha: true,
    what: "PNG arrived in 1996 as a patent-free replacement for GIF and compresses with DEFLATE — the same algorithm as ZIP. Nothing is discarded, so a PNG decodes to exactly the pixels that went in, and it carries a full 8-bit alpha channel rather than GIF's single transparent colour.",
    origin:
      "Screenshots on every operating system default to PNG, as do exports from design tools and most logo and icon assets. Anything with crisp edges, flat colour or a transparent background has probably been living as a PNG.",
    limit:
      "Lossless compression works by finding repetition, and photographs have very little. A photo saved as PNG is routinely five to ten times the size of the same photo as a good-quality JPEG with no visible difference — which is the single most common cause of a slow-loading page.",
  },
  webp: {
    label: "WebP",
    long: "WebP images",
    blurb:
      "WebP compresses well, but some older apps, printers and CMSs still reject it",
    short: "some apps and printers still reject WebP",
    alpha: true,
    what: "WebP is Google's 2010 format, derived from the VP8 video codec. It offers both lossy and lossless modes and, unusually, supports transparency in both — the reason it can replace JPG and PNG with one format. Google's own comparisons put it roughly 25–35% smaller than JPEG at matched quality.",
    origin:
      "Files usually arrive as WebP because they were saved from a website: browsers and CDNs serve it widely, so 'save image as' on a modern site frequently produces a .webp you then cannot open in the application you needed it for.",
    limit:
      "Support outside the browser is the problem. Older Photoshop versions, many print workflows, plenty of CMS uploaders and a long tail of desktop software either refuse WebP or handle it badly — which is exactly why people convert it back to something older.",
  },
  heic: {
    label: "HEIC",
    long: "iPhone HEIC photos",
    blurb:
      "HEIC is what iPhones shoot by default, and almost nothing outside Apple opens it reliably",
    short: "little outside Apple opens HEIC",
    alpha: false,
    what: "HEIC is a HEIF container holding HEVC-compressed stills. It stores roughly the same visible quality as JPEG in about half the space, and it can hold extras a JPEG cannot: depth maps, edit history, and the paired frames behind Live Photos.",
    origin:
      "Every iPhone since iOS 11 in 2017 shoots HEIC by default. Files reach other people through AirDrop, direct copies off the device, or an iCloud download that skips Apple's automatic conversion — which is why the problem usually appears at the moment of sharing.",
    limit:
      "HEVC carries patent licensing, and that has kept native support thin outside Apple. Windows needs a paid codec extension from the Microsoft Store, Android support is inconsistent, and no browser displays HEIC — so uploads to web forms tend to fail outright.",
  },
  avif: {
    label: "AVIF",
    long: "AVIF images",
    blurb:
      "AVIF makes tiny files, but many editors and older apps cannot open it",
    short: "many editors cannot open AVIF",
    alpha: true,
    what: "AVIF wraps the royalty-free AV1 video codec as a still-image format. It compresses harder than anything else in wide use — commonly around half the size of an equivalent JPEG — and adds real range: 10- and 12-bit colour, HDR, wide gamut and an alpha channel.",
    origin:
      "AVIF files come from modern websites and image pipelines that adopted it for the bandwidth saving. Chrome shipped support in 2020 and Safari in 16.4 in 2023, so it is common on the web and rare on the desktop.",
    limit:
      "Encoding is slow and application support lags well behind browsers. Older editors, office suites, printers and any number of internal tools simply will not open an .avif, so a file that displays perfectly in a browser can be unusable in the software you actually need.",
  },
  gif: {
    label: "GIF",
    long: "GIF images",
    blurb:
      "GIF is limited to 256 colours; converting a static GIF gives smaller, better-looking files",
    short: "GIF is capped at 256 colours",
    alpha: true,
    what: "GIF dates to 1987 and stores at most 256 colours from a palette, compressed losslessly with LZW. Transparency is a single on/off flag on one palette entry rather than a real alpha channel, which is why GIF edges against a coloured background look jagged.",
    origin:
      "GIFs come from the reaction-image corner of the internet, from old web assets, and from screen recorders that default to it. Anything animated and low-colour that has been passed around for years is probably still a GIF.",
    limit:
      "The palette is the whole problem. A photograph forced into 256 colours gains visible banding across skies and skin tones, and dithering to hide it adds noise that then compresses badly — so a photographic GIF is both worse-looking and larger than it needs to be.",
  },
  bmp: {
    label: "BMP",
    long: "BMP bitmaps",
    blurb: "BMP is uncompressed — files are enormous for no visual benefit",
    short: "BMP files are enormous for no benefit",
    alpha: false,
    what: "BMP is Microsoft's original raster format and in normal use stores pixels with no compression at all: three bytes per pixel, plus a header. A 12-megapixel photo lands around 36 MB. An optional run-length mode exists but is rarely produced.",
    origin:
      "BMPs turn up from legacy Windows software, older scanner drivers, industrial and medical equipment, and Paint on an ancient machine. New files in this format are almost always a sign that something in the chain has not been updated in a long time.",
    limit:
      "The size is the entire issue — email attachment limits, upload caps and disk space all bite long before quality does. Common BMP variants also carry no alpha channel, so there is no transparency to lose, and none to gain by staying put.",
  },
  svg: {
    label: "SVG",
    long: "SVG vector graphics",
    blurb:
      "SVG is a vector format; converting rasterizes it so it works anywhere an image is expected",
    short: "rasterized so it works anywhere",
    alpha: true,
    what: "SVG is not a grid of pixels at all: it is an XML document describing shapes, paths and text, which the renderer draws at whatever size it is asked for. That is why a 4 KB logo stays perfectly sharp on a billboard, and why the file is often smaller than a thumbnail of itself.",
    origin:
      "SVGs come out of Illustrator, Figma, Inkscape and icon libraries. Logos, icons, charts and diagrams are the natural cases — anything built from shapes rather than captured from a camera.",
    limit:
      "Plenty of software refuses vectors outright: office documents, most social platforms, email clients, printers' upload portals and any tool that expects a bitmap. Rasterizing is the price of admission, and the resolution has to be chosen at that moment rather than left flexible.",
  },
};

export const TARGETS: Record<string, TargetMeta> = {
  jpg: {
    label: "JPG",
    long: "JPEG",
    mime: "image/jpeg",
    pros: "small files that open everywhere — every browser, phone, editor and printer",
    alpha: false,
    what: "Saving as JPEG re-encodes the image with lossy DCT compression at a quality level you choose. Around 80% is the usual sweet spot: files shrink dramatically and the difference is invisible at normal viewing sizes.",
    support:
      "Nothing in mainstream computing fails to open a JPEG. Thirty-year-old software, print shops, hospital systems, government upload forms, every phone and every browser — if a system takes images at all, it takes JPG.",
    bestFor:
      "Photographs headed somewhere you do not control: an email attachment, a form upload, a print order, a document, or anyone else's computer.",
  },
  png: {
    label: "PNG",
    long: "PNG",
    mime: "image/png",
    pros: "pixel-perfect lossless quality with full transparency support",
    alpha: true,
    what: "PNG output is lossless, so the saved pixels are exactly the pixels that went in and re-saving costs nothing in quality. It keeps a full 8-bit alpha channel, which means soft shadows and anti-aliased edges survive against any background.",
    support:
      "Universal since the early 2000s, and the format every design tool, browser and operating system handles without argument. It is also the safest format to hand to a printer or a colleague when you do not know their software.",
    bestFor:
      "Logos, icons, screenshots, diagrams, anything with text or hard edges, and any image that needs a genuinely transparent background.",
  },
  webp: {
    label: "WebP",
    long: "WebP",
    mime: "image/webp",
    pros: "files roughly 25–35% smaller than JPG at the same visual quality — ideal for websites",
    alpha: true,
    what: "WebP output uses lossy compression with a quality control, but unlike JPEG it can keep an alpha channel at the same time — one format for photographs and for graphics with transparency.",
    support:
      "Every current browser reads WebP; Safari joined in version 14 in 2020, which was the last real holdout. Desktop applications are patchier, so it is a format to publish in rather than to archive in.",
    bestFor:
      "Images going onto a website, where the 25–35% saving over JPEG is bandwidth and Core Web Vitals rather than an abstraction.",
  },
  ico: {
    label: "ICO",
    long: "Windows ICO icons",
    mime: "image/x-icon",
    pros: "the icon format browsers look for at /favicon.ico and Windows uses for shortcuts",
    alpha: true,
    what: "ICO is a container that holds one or more small square images, with transparency, for use as an icon. It caps out at 256×256 — anything larger has to be scaled down, and the format is not intended for general pictures.",
    support:
      "Every browser requests /favicon.ico by default, with no HTML required, and Windows uses ICO for application and shortcut icons. It is a narrow format that is completely reliable inside its niche.",
    bestFor:
      "Website favicons and Windows shortcut icons — a square source with clear shapes that still read at 16 pixels.",
  },
};

export type Pair = {
  slug: string;
  src: string;
  tgt: string;
  title: string;
  desc: string;
  h1: string;
  intro: string;
  sections: Section[];
  faq: Faq[];
};

// What actually happens to the pixels in this particular direction. This is the
// section that makes each pair page its own page rather than a template fill,
// so it is keyed on the combination, not on either format alone.
function conversionNote(src: string, tgt: string): string[] {
  const s = SOURCES[src]!;
  const t = TARGETS[tgt]!;
  const out: string[] = [];

  const lossySrc = ["jpg", "webp", "heic", "avif"].includes(src);
  const lossyTgt = ["jpg", "webp"].includes(tgt);

  if (lossySrc && lossyTgt) {
    out.push(
      tgt === "jpg"
        ? `Both formats are lossy, so this is a re-encode rather than a copy: the ${s.label} is decoded to pixels and those pixels are compressed again as JPEG. Detail the original already discarded cannot come back, and the second pass removes a little more. Going to JPEG specifically means giving up the more modern codec's efficiency — expect the file to grow, sometimes considerably, for the same apparent quality. That is the price of a format everything can open.`
        : `Both formats are lossy, so this is a re-encode rather than a copy: the ${s.label} is decoded to pixels and those pixels are compressed again as WebP. Detail the original already discarded cannot come back, and the second pass removes a little more. One generation at a sensible quality is not something you will notice, and WebP's efficiency means the result usually lands close to or below the original's size — a rare case where re-encoding does not cost you space.`,
    );
  } else if (lossySrc && !lossyTgt) {
    out.push(
      tgt === "ico"
        ? `An icon is being built here, not a picture converted. The ${s.label} is decoded, scaled to fit within 256×256 and stored losslessly inside the ICO container — so whatever compression artifacts the original carried are preserved faithfully, then shrunk to the point where nobody will ever see them. Detail is lost to the scaling, which is the intended outcome.`
        : `PNG is lossless, so the conversion preserves exactly what the ${s.label} decoded to — but not the detail the ${s.label} had already discarded. You are freezing the current state, not recovering the original, and a common misunderstanding is that saving to PNG somehow restores quality. Expect the file to grow, often several times over, because lossless compression cannot match what lossy compression already did.`,
    );
  } else if (!lossySrc && lossyTgt) {
    out.push(
      tgt === "jpg"
        ? `This is where the file size actually drops. A ${s.label} stores its image without discarding anything; JPEG works in 8×8 blocks and throws away the fine detail inside each one, then usually halves the colour resolution as well through chroma subsampling. Photographs take that treatment invisibly. Flat colour, text and sharp edges do not — they are where the block boundaries and coloured fringing show up, so keep the quality high if the image contains any.`
        : `This is where the file size actually drops. A ${s.label} stores its image without discarding anything, and WebP's lossy mode decides what the eye will not miss — typically landing 25–35% below a JPEG of matching quality, and keeping the alpha channel while it does so, which JPEG cannot. The catch is not visual but practical: WebP is a format to publish in, and a poor choice for anything you are handing to someone else's desktop software.`,
    );
  } else {
    out.push(
      `Both formats are lossless, so nothing is thrown away in either direction — this is a container change rather than a quality decision. What differs is how efficiently each one packs the same pixels, and how widely each is supported by the software you need to open it in.`,
    );
  }

  if (s.alpha && !t.alpha) {
    out.push(
      `Transparency is the thing to watch. ${s.label} can store transparent areas and ${t.label} cannot, so anything see-through is composited onto a white background during conversion. A logo with soft edges will show a white fringe when placed on a coloured background afterwards. If the transparency matters, convert to PNG or WebP instead.`,
    );
  } else if (s.alpha && t.alpha) {
    out.push(
      src === "gif"
        ? `Transparency technically survives, but it improves on the way. GIF has no alpha channel — just one palette entry flagged as transparent — which is why GIF cut-outs have hard, jagged edges. ${t.label} stores a full 8-bit alpha, so anything you composite afterwards can have genuinely smooth edges, even though the original's jaggedness is baked in.`
        : `Transparency survives intact. Both ${s.label} and ${t.label} carry a full 8-bit alpha channel, so cut-outs, drop shadows and anti-aliased edges convert without a white box appearing behind them, and the result still composites cleanly onto any background colour.`,
    );
  } else if (!s.alpha) {
    out.push(
      `There is no transparency to preserve — ${s.label} files do not carry an alpha channel, so every pixel is opaque to begin with. Converting to a format that supports transparency does not create any; it only means you could add it later in an editor.`,
    );
  }

  if (src === "svg") {
    out.push(
      `The important loss here is scalability rather than quality. An SVG is drawn fresh at whatever size it is asked for; the moment it becomes a ${t.label} it is a fixed grid of pixels, and enlarging it later softens the edges. Rasterize at the largest size you will realistically need, and keep the original SVG — it remains the master copy.`,
    );
  }
  if (src === "gif") {
    out.push(
      `Only the first frame survives. GIF is the one source here that can be animated, and ${t.label} output is a still image, so an animated GIF converts to its opening frame. The upside for static GIFs is real: escaping the 256-colour palette removes the banding, and the file usually gets smaller at the same time.`,
    );
  }
  if (tgt === "ico") {
    out.push(
      `ICO cannot exceed 256×256, so anything larger is scaled down to fit while keeping its aspect ratio. Work from a square source if you can — a wide image gets letterboxed into the square, and fine detail disappears entirely at the 16-pixel size a browser tab actually renders.`,
    );
    const iconAdvice: Record<string, string> = {
      svg: "A vector is the ideal starting point for an icon, because the shapes were designed rather than sampled and they scale down cleanly. If the logo has fine strokes or small lettering, consider simplifying it in the SVG first: what reads on a business card disappears completely in a browser tab.",
      png: "PNG is the usual favicon source and needs no preparation beyond being square. Because both formats are lossless, the icon is exactly the design you drew, right down to the transparent corners of a rounded badge.",
      webp: "WebP as an icon source is almost always a file that came off a website, so check what you have before committing: it may already be a downscaled thumbnail rather than the original artwork, and upscaling it into an icon will look soft at every size. If the WebP was saved in lossless mode — likely for a logo or screenshot — the pixels are pristine and it makes an excellent source. If it was lossy, look for the design file before settling.",
      avif: "AVIF sources are usually pulled from a modern web page, which means the file has been compressed hard for bandwidth and may carry 10-bit or HDR colour that an icon has no use for. Both facts stop mattering at 256 pixels: the artifacts vanish along with every other fine detail, and the colour is flattened to ordinary 8-bit. The real risk is resolution — a hero image scaled for a page banner may be wider than it is tall, and cropping it square is where a logo loses its balance.",
      jpg: "A JPEG is an awkward icon source because it cannot carry transparency, so the icon arrives with whatever background the photo had, as a solid square. For a logo on white that is often fine; for anything meant to sit on a coloured toolbar it is not, and the background needs removing first.",
      heic: "Starting from an iPhone photo means starting from a rectangle, usually 4:3, so expect substantial cropping into the square. Photographs also make poor icons in general: at 16 pixels a face or a scene reduces to indistinct colour, where a simple mark stays recognisable.",
      gif: "An old GIF is a plausible icon source precisely because it is already small and low-colour. The catch is the hard-edged transparency: GIF's single transparent colour leaves jagged edges that become obvious once the icon sits on a dark background.",
      bmp: "",
    };
    if (iconAdvice[src]) out.push(iconAdvice[src]!);
  }
  if (src === "avif" && tgt !== "ico") {
    out.push(
      `One thing worth checking before you convert: AVIF can store 10- and 12-bit colour, HDR and a wide gamut, and ${t.label} cannot. If the file came from an HDR pipeline it is tone-mapped down to 8-bit SDR here, which is usually invisible on an ordinary screen but flattens the highlight range a display capable of showing it would have used.`,
    );
  }
  if (src === "webp" && tgt !== "ico") {
    out.push(
      `WebP files are a mixed bag, because the format has both a lossy and a lossless mode and nothing in the filename tells you which one you have. A lossless WebP — typically a graphic or screenshot — converts to ${t.label} with the quality trade described above; a lossy one has already been through a codec once. If the image has flat colour and hard edges, treat it as the former and keep the quality setting high.`,
    );
  }
  if (src === "bmp") {
    out.push(
      tgt === "png"
        ? `Expect the file size to collapse without giving anything up. Both formats are lossless, so this is the rare conversion with no trade-off at all: DEFLATE finds the repetition that BMP stores verbatim, and a screenshot or line-art bitmap commonly ends up under a tenth of its original size with identical pixels.`
        : tgt === "ico"
          ? `Size stops being the interesting question here, because the image is being scaled to at most 256×256 regardless. What matters is that a BMP from an old Windows tool is often already small and square, which makes it an unusually good icon source — the pixels are unprocessed and there is no prior compression to fight.`
          : `Expect the file size to collapse. BMP stores three bytes per pixel with no compression at all, so a 12-megapixel image sits around 36 MB before anything is done to it. Re-encoding as ${t.label} routinely produces a file a fiftieth of that size with nothing visible lost, because there was never any compression to preserve.`,
    );
  }
  if (src === "heic") {
    out.push(
      tgt === "jpg"
        ? `This is the conversion most people need, and it is worth knowing what does not come with it: Live Photo motion, depth maps and Apple's edit history live in the HEIC container and are dropped. The visible photograph converts faithfully; the extras stay behind. Orientation is handled properly here, which is the other classic HEIC complaint — photos arriving sideways because a converter ignored the rotation flag.`
        : `Going from HEIC to ${t.label} keeps you in modern-codec territory rather than falling back to JPEG, so file sizes stay closer to what the iPhone produced. The trade is where the result can be used: HEIC fails almost everywhere outside Apple, and ${t.label} succeeds almost everywhere inside a browser — but neither is a safe bet for someone else's desktop software, which is what JPG is for.`,
    );
  }
  return out;
}

export const PAIRS: Pair[] = Object.keys(SOURCES).flatMap((src) =>
  Object.keys(TARGETS)
    .filter((tgt) => tgt !== src)
    .map((tgt) => {
      const s = SOURCES[src]!;
      const t = TARGETS[tgt]!;
      const faq: Faq[] = [
        {
          q: `Is this ${s.label} to ${t.label} converter really free and private?`,
          a: `Yes. Conversion happens entirely in your browser using the Canvas API — your ${s.long} are never uploaded to a server, there is no file limit, no watermark and no sign-up.`,
        },
        {
          q: `Can I convert multiple ${s.label} files at once?`,
          a: `Yes — drop any number of files and they convert in one batch. Use "Download all" to save the results as a single ZIP.`,
        },
      ];
      if (s.alpha && !t.alpha) {
        faq.push({
          q: `What happens to transparency when converting ${s.label} to ${t.label}?`,
          a: `${t.long} does not support transparency, so transparent areas are composited onto a white background. If you need transparency preserved, convert to PNG or WebP instead.`,
        });
      }
      if (src === "heic") {
        faq.push({
          q: "Why does my iPhone save photos as HEIC?",
          a: "Apple uses HEIC because it halves file size at the same quality. To make your iPhone shoot JPG directly, go to Settings → Camera → Formats → Most Compatible.",
        });
      }
      if (tgt === "ico") {
        faq.push(
          {
            q: "What size will my ICO file be?",
            a: "ICO cannot store an image larger than 256×256, so anything bigger is scaled down to fit while keeping its aspect ratio. For a browser favicon a square source works best — 256×256 covers every modern use, and browsers scale it down to the 16 or 32 pixel tab icon themselves.",
          },
          {
            q: "How do I use this as my website favicon?",
            a: 'Save the file as favicon.ico in your site\'s root directory. Browsers request /favicon.ico automatically, so no HTML is strictly needed — though adding <link rel="icon" href="/favicon.ico"> makes it explicit.',
          },
        );
      }
      if (src === "gif") {
        faq.push({
          q: "Will an animated GIF stay animated?",
          a: `No — ${t.label} output is a still image, so only the first frame is kept. For animations, keep the GIF or use a video format.`,
        });
      }
      faq.push({
        q: `Does converting ${s.label} to ${t.label} lose quality?`,
        a: conversionNote(src, tgt)[0]!,
      });

      const targetFaq: Record<string, Faq> = {
        jpg: {
          q: "What quality setting should I use for the JPG?",
          a: "Around 80% suits almost everything. Below about 60% the block artifacts become visible on flat areas and around hard edges; above 90% the file grows quickly for a difference nobody sees. If the image contains text or a logo, err higher — lossy compression treats sharp edges worst.",
        },
        png: {
          q: "Why is the PNG larger than the original?",
          a: "Because PNG is lossless and cannot cheat. Lossy formats reach their size by discarding detail; PNG has to store every pixel it is given, so a photograph converted to PNG is routinely several times bigger. That is expected, not a fault — if size matters more than losing nothing, JPG or WebP is the right target.",
        },
        webp: {
          q: "Will a WebP file open on every device?",
          a: "In a browser, yes — every current browser has supported WebP since Safari 14 in 2020. Outside the browser it is less certain: older desktop editors, some print workflows and a number of CMS uploaders still reject it. Use WebP for the web and JPG or PNG for anything you are handing to someone else.",
        },
        ico: {
          q: "Should the icon be square?",
          a: "Yes. ICO holds square images, so a wide or tall source is fitted into the square and ends up with empty space around it. Start from a square design with generous margins — the tab icon renders at 16 pixels, where anything intricate turns to mush.",
        },
      };
      faq.push(targetFaq[tgt]!);

      const sourceFaq: Record<string, Faq> = {
        jpg: {
          q: "I converted a JPG and re-saved it a few times — why does it look worse?",
          a: "Every JPEG save re-runs the lossy compression, and the damage accumulates across generations. The fix is to keep one original and always export from it, rather than editing and re-saving the same JPG repeatedly.",
        },
        png: {
          q: "Is it worth converting my screenshots away from PNG?",
          a: "Usually not. Screenshots are exactly what PNG is good at — flat colour, sharp text, few gradients — so they compress well losslessly and JPEG would smear the text. Convert photographs out of PNG, not interface captures.",
        },
        webp: {
          q: "Why did a site give me a WebP I cannot open?",
          a: "Because browsers and CDNs serve WebP widely for the bandwidth saving, so 'save image as' hands you the format the site was optimised in rather than a universal one. Converting is the standard fix; nothing about the image itself is unusual.",
        },
        avif: {
          q: "AVIF looks great — why convert away from it at all?",
          a: "Support outside the browser. Older editors, office suites, print portals and plenty of internal tools cannot open an .avif at all, so a file that displays perfectly on a web page is unusable in the software you actually need.",
        },
        bmp: {
          q: "Will I lose anything by leaving BMP behind?",
          a: "Effectively nothing. BMP stores raw pixels with no compression and, in its common variants, no transparency — so there is no quality advantage to preserve. The conversion is close to pure size saving.",
        },
        svg: {
          q: "What resolution should I rasterize the SVG at?",
          a: "The largest size you will realistically use, then scale down as needed — enlarging a raster afterwards softens every edge. Keep the SVG itself as the master, because it is the only version that stays sharp at any size.",
        },
        heic: {
          q: "Can I stop my iPhone producing HEIC in the first place?",
          a: "Yes — Settings, then Camera, then Formats, then Most Compatible makes the camera shoot JPG directly. You trade roughly double the file size for files that open anywhere without a conversion step.",
        },
        gif: {
          q: "Why does my GIF photo look banded?",
          a: "GIF stores at most 256 colours, and a photograph needs far more, so smooth gradients break into visible steps. Converting to any modern format removes the ceiling — which is why static photographic GIFs almost always improve.",
        },
      };
      faq.push(sourceFaq[src]!);

      return {
        slug: `${src}-to-${tgt}`,
        src,
        tgt,
        title: `${s.label} to ${t.label} Converter — Free, Private, No Upload`,
        desc: `Convert ${s.label} to ${t.label} free in your browser — no upload, no watermark, batch supported. ${s.short}.`,
        h1: `${s.label} to ${t.label} Converter`,
        intro: `${s.blurb}. Converting to ${t.long} gives you ${t.pros}. ${s.limit} ${t.bestFor} Drop your files below and the work happens on your own machine: the conversion runs in the browser through the Canvas API, so nothing is uploaded, there is no file-size cap, no watermark and no sign-up. Batches are fine — drop a folder's worth and take them back as a single ZIP.`,
        sections: [
          {
            h: `What a ${s.label} file actually is`,
            body: [s.what, s.origin],
          },
          {
            h: `What you get from ${t.label}`,
            body: [t.what, t.support],
          },
          {
            h: `What changes when you convert ${s.label} to ${t.label}`,
            body: conversionNote(src, tgt),
          },
        ],
        faq,
      };
    }),
);

// Approximate first-use download (segmentation model + ONNX runtime), quoted in
// the FAQ and on the page. Declared before TOOL_FAQ because the FAQ copy
// interpolates it at module load.
export const MODEL_MB = 55;

// Article bodies for the five core tool pages, keyed by path. Kept beside
// TOOL_FAQ rather than inline in index.tsx so the prose invariants can reach it.
export const TOOL_SECTIONS: Record<string, Section[]> = {
  "/compress-image": [
    {
      h: "What compression actually removes",
      body: [
        "Lossy compression does not shrink a file by storing the same picture more cleverly. It decides which information the eye is least likely to miss and discards it: fine detail inside small blocks, and roughly half the colour resolution, because human vision is far more sensitive to brightness than to hue. What comes back out is a close approximation, not the original.",
        "That is why the same quality setting behaves so differently on different images. A photograph of foliage or skin hides the loss completely. A screenshot, a logo or anything with text sits at the opposite extreme — hard edges are exactly what the algorithm handles worst, and they pick up the faint halos known as ringing.",
      ],
    },
    {
      h: "Where to set the quality slider",
      body: [
        "Around 80% is the working default and the range 75–85% covers almost every real use, typically cutting a photograph by 60–80% with nothing visible at normal viewing size. Below roughly 60% the block structure starts to show on flat areas like skies and walls.",
        "Above 90% you are mostly buying file size. The curve is steep at the top: going from 85% to 95% can double the file for a difference invisible outside a pixel-level comparison. If an image contains text or line art, that trade is worth making; for an ordinary photograph it is not.",
      ],
    },
    {
      h: "Compress once, from the original",
      body: [
        "Every lossy save re-runs the process on whatever it is given, so compressing an already-compressed file compounds the damage. The artifacts from the first pass become detail the second pass tries faithfully to preserve, which wastes bits on noise and degrades the image further.",
        "Keep one master file and export from it each time you need a different size or quality. If you only have a compressed copy, compress it as little as possible — and never run a file through repeatedly hoping to squeeze more out, because that is how images acquire the mottled look of something forwarded too many times.",
      ],
    },
    {
      h: "How much size you actually need to save",
      body: [
        "Work backwards from the constraint. Email attachments generally cap around 20–25 MB; most web forms are stricter. For a website, images below roughly 200 KB keep pages responsive on mobile connections, and the largest image on the page is usually the one deciding your Largest Contentful Paint score.",
        "Resizing often beats compressing. An 8-megapixel photo displayed in a 600-pixel-wide column is carrying more than ten times the pixels it can show; reducing the dimensions first, then compressing, produces a far smaller file than quality reduction alone and looks better doing it.",
      ],
    },
  ],
  "/resize-image": [
    {
      h: "Pixels are the only dimension that matters",
      body: [
        "An image has one real size: its pixel dimensions. The DPI or PPI figure stored alongside is metadata used by print software to decide how large to lay the image out on paper, and it has no effect whatsoever on a screen. Changing it without changing the pixel count changes nothing about the file.",
        "This is why the advice to 'save at 72 DPI for web' is a myth that refuses to die. A 1200×800 image is 1200×800 whether it claims 72 or 300 DPI. What matters for print is the ratio: 1200 pixels across a 4-inch print is 300 pixels per inch, and that arithmetic is where the number becomes real.",
      ],
    },
    {
      h: "Keep the aspect ratio unless you mean not to",
      body: [
        "Set one dimension and let the other follow. The lock is on by default here because stretching an image to fit a shape is immediately obvious to a viewer even when they cannot say why — faces widen, circles become ovals, and text leans.",
        "When a target shape genuinely differs from the source, crop rather than stretch. Cropping discards the parts you do not need and leaves the rest correctly proportioned, which is what every platform's own image tool does when it fits your photo to a banner.",
      ],
    },
    {
      h: "Downscaling is safe, upscaling is not",
      body: [
        "Making an image smaller averages existing pixels together and generally improves apparent sharpness, because noise and compression artifacts average out along with everything else. There is no quality penalty worth worrying about.",
        "Enlarging has to invent pixels that were never captured. Interpolation produces a smooth, soft result rather than new detail — the missing information does not exist anywhere in the file. Beyond roughly 150% of the original, the softness becomes obvious. Going back to the original source at a higher resolution is the only real fix.",
      ],
    },
    {
      h: "Common target sizes",
      body: [
        "For a website, match the largest size the image will actually be displayed at, then double it if it must stay crisp on high-density screens — a 600-pixel column wants a 1200-pixel image and no more. Anything beyond that is bandwidth spent on pixels the browser throws away.",
        "For documents and forms, the requirement is usually stated in pixels or in file size, and the two interact: reducing dimensions is the fastest way to meet a size cap without touching quality. For print, work from the physical size and 300 pixels per inch — a 6×4 inch photo needs 1800×1200 pixels.",
      ],
    },
  ],
  "/image-converter": [
    {
      h: "Choosing the target format",
      body: [
        "The question is not which format is best but where the file is going. JPG for anything leaving your control — email, forms, print shops, other people's software — because nothing fails to open it. PNG when the image has transparency, text or hard edges, or when it must stay pixel-exact. WebP when the destination is a web page and the 25–35% saving over JPEG is worth having.",
        "Formats that compress harder are not automatically better. AVIF and HEIC produce beautiful small files that a surprising amount of software cannot open at all, and a file nobody can read has no quality at all from the recipient's point of view.",
      ],
    },
    {
      h: "Transparency is the constraint that bites",
      body: [
        "Only some formats carry an alpha channel. Converting a transparent PNG or WebP to JPG composites the transparent areas onto white, which is invisible until the image is placed on a coloured background and a white box appears behind it.",
        "If you need transparency, the safe targets are PNG and WebP. Note that GIF's transparency is not the same thing: it is a single palette entry flagged as see-through, which is why GIF cut-outs have hard, jagged edges rather than smooth ones.",
      ],
    },
    {
      h: "Converting does not restore quality",
      body: [
        "A recurring misunderstanding is that saving a JPEG as PNG improves it. It does not: PNG faithfully preserves whatever the JPEG decoded to, artifacts included, in a much larger file. Detail discarded by an earlier lossy save is gone from the file and no conversion recovers it.",
        "The useful direction is the opposite one. Converting from a lossless or modern format to a widely supported one costs something and buys compatibility; converting to a lossless format costs size and buys the ability to edit and re-save without further degradation.",
      ],
    },
    {
      h: "Batches and file names",
      body: [
        "Drop as many files as you like and they convert in one pass, then download as a single ZIP. The work happens on your own machine through the Canvas API, so a hundred files is a question of how fast your processor is rather than how patient your connection is.",
        "Names are preserved with the extension swapped, which keeps a converted batch matched up with whatever referenced the originals. Nothing is uploaded at any point, which is the practical difference between this and a server-based converter when the files are photographs of documents or anything else you would rather not hand to a stranger.",
      ],
    },
  ],
  "/remove-background": [
    {
      h: "How the model decides what to keep",
      body: [
        "A segmentation model predicts, for every pixel, how likely it is to belong to the foreground subject. That produces a mask rather than a hard outline, which is what lets soft edges — hair, fur, motion blur — come out semi-transparent instead of being cut off with scissors.",
        "It is a learned judgement, not a measurement, so it works best on the kinds of images it saw most during training: a clear subject, reasonable separation from the background, ordinary lighting. It has no understanding of what you consider the subject, only a statistical sense of what usually is one.",
      ],
    },
    {
      h: "Where it struggles",
      body: [
        "Low contrast between subject and background is the main failure mode — a grey coat against a grey wall gives the model very little to work with. Fine detail like flyaway hair, chain-link, lace or foliage is the second, because a single pixel genuinely contains both subject and background.",
        "Transparent and reflective objects are the hardest case of all: glass, water and glossy surfaces show the background through the subject, and no per-pixel mask can resolve that cleanly. Where the result is close but imperfect, the usual approach is to use the mask as a starting point and clean up the edge in an editor.",
      ],
    },
    {
      h: "Why this one runs in your browser",
      body: [
        `Every other background remover uploads your photograph to a server. This one downloads the model instead — around ${MODEL_MB} MB the first time — and runs it on your own device, so the image never leaves the machine.`,
        "The trade is that first download and a slower first result, since your laptop is doing work a datacentre GPU would do faster. After the initial download the model is cached, and subsequent images are processed without touching the network at all. For photographs of people, documents or products that are not public yet, that difference is the entire point.",
      ],
    },
    {
      h: "Save as PNG or WebP, never JPG",
      body: [
        "The output has a transparent background, and JPEG has no alpha channel — saving as JPG would flatten the transparency straight back onto white and undo the work. PNG is the safe choice; WebP is smaller if the destination is a web page.",
        "Bear in mind that a cut-out's edges are semi-transparent by design, so the result looks correct only when composited over something. Viewed in a file manager against a white preview it can appear to have a fringe that is not really there.",
      ],
    },
  ],
  "/crop-image": [
    {
      h: "Cropping and resizing are different operations",
      body: [
        "Cropping discards the parts of the frame outside your selection and leaves the remaining pixels untouched at their original resolution. Resizing keeps the whole frame and changes how many pixels describe it. Reaching for the wrong one is why images end up stretched or unexpectedly soft.",
        "When a photograph has to fit a specific shape, crop first and resize second. Cropping to the target aspect ratio decides what stays in frame; resizing then brings it to the pixel dimensions the destination wants, without distorting anything.",
      ],
    },
    {
      h: "The ratios worth knowing",
      body: [
        "1:1 for profile pictures and most product listings. 4:3 is what phone cameras and older screens produce. 16:9 is video, presentation slides and hero banners. 9:16 is the vertical full-screen shape used by phone-first video and story formats.",
        "Platforms crop automatically when your image does not match, and their automatic crop is centred and indifferent to your composition. Doing it yourself is the only way to guarantee that a face, a product or a headline survives the process.",
      ],
    },
    {
      h: "Crop for composition, not just for fit",
      body: [
        "The strongest reason to crop is rarely the shape — it is removing everything that competes with the subject. Distracting edges, empty foreground and accidental background clutter all dilute an image, and cutting them is the fastest improvement available without an editor.",
        "Leave a little room around the subject rather than cropping tight to it. Faces in particular need space above the head, and a subject pressed against the frame edge reads as a mistake. If the image will be used in more than one shape, crop conservatively so there is margin left for the next one.",
      ],
    },
    {
      h: "What happens to the file",
      body: [
        "Cropping in a browser decodes the image, keeps the selected region and re-encodes it. For a PNG that is lossless and costs nothing. For a JPEG it is one further lossy generation — negligible at a sensible quality, but a reason not to crop the same file repeatedly.",
        "Metadata is not carried through. Location, camera settings and timestamps are dropped along with the discarded pixels, which is a privacy benefit more often than a loss: a cropped screenshot or photograph leaves this page without the GPS coordinates the original was carrying.",
        "It is worth saying what does not happen: nothing is uploaded. The crop is performed on a canvas in your own browser, so a screenshot containing account details or a photograph of a document is processed on your machine and never sent anywhere. That also means the tool keeps working with the network disconnected once the page has loaded.",
      ],
    },
  ],
};

export const TOOL_FAQ: Record<string, Faq[]> = {
  compress: [
    {
      q: "How does the image compressor reduce file size?",
      a: "It re-encodes your image at a quality level you control. At 75–85% quality, JPG and WebP files typically shrink by 60–80% with no visible difference on screens.",
    },
    {
      q: "Are my photos uploaded anywhere?",
      a: "No. Compression runs entirely in your browser using the Canvas API. Files never leave your device — you can even use the tool offline once the page is loaded.",
    },
    {
      q: "What quality setting should I use?",
      a: "For web photos, 75–85% is the sweet spot. For archiving, use 90%+. If a file must hit a size limit (say a 2 MB form upload), lower the slider until the output size fits.",
    },
  ],
  resize: [
    {
      q: "How do I resize an image without stretching it?",
      a: 'Keep "Lock aspect ratio" on and set just one dimension — the other is calculated automatically, so nothing distorts.',
    },
    {
      q: "Does resizing reduce quality?",
      a: "Downscaling keeps images sharp (we use high-quality resampling). Upscaling beyond the original size cannot add detail and will look soft — this tool resizes to exactly the pixels you ask for.",
    },
    {
      q: "Can I resize many images to the same width at once?",
      a: "Yes — drop a batch, set the width once, and every image is resized proportionally, then download everything as a ZIP.",
    },
  ],
  crop: [
    {
      q: "How do I crop an image online?",
      a: "Drop an image, drag a selection over the area you want to keep, optionally lock a ratio like 1:1 or 16:9, then download the cropped result. Nothing is uploaded.",
    },
    {
      q: "What aspect ratio should I crop to?",
      a: "1:1 for profile pictures and Instagram posts, 16:9 for YouTube thumbnails and presentations, 4:3 for classic photos, 9:16 for stories and reels.",
    },
  ],
  convert: [
    {
      q: "Which format should I convert my images to?",
      a: "JPG for photos that must open anywhere, PNG for graphics that need transparency or lossless quality, WebP for websites where smaller files mean faster loading.",
    },
    {
      q: "Is there a file size or count limit?",
      a: "No hard limit — processing happens on your own device, so capacity depends only on your browser memory. Batches of hundreds of typical photos work fine.",
    },
  ],
  removeBackground: [
    {
      q: "Is the background removed on your servers?",
      a: "No. The segmentation model is downloaded to your browser and runs there, so the photo itself never leaves your device — you can watch the network panel and see no upload, or disconnect after the model has loaded and keep working offline.",
    },
    {
      q: "Why is the first image slow?",
      a: `The model is about ${MODEL_MB} MB and downloads the first time you use this page, then stays in your browser cache. After that, expect a few seconds per image — the work runs on your own processor rather than a server farm, which is the trade for not uploading anything. Older phones will be slower.`,
    },
    {
      q: "What kind of photos work best?",
      a: "A clear main subject against a background that is reasonably distinct from it — people, products, pets, objects on a desk. Edges are computed at 320×320 and scaled up, so fine detail like flyaway hair or fur comes out soft. At normal web sizes that is rarely visible; at 100% zoom on a large photo it is.",
    },
    {
      q: "What file do I get back?",
      a: "A PNG with a transparent background, which is what you want for logos, product shots and anything you are placing onto another background. JPG cannot store transparency, so it is not offered here.",
    },
  ],
};

export type Core = {
  path: string;
  label: string; // nav, footer, hub catalogue
  tile: string; // homepage tile heading
  blurb: string; // homepage tile subtitle
  llms: string; // one-line summary for /llms.txt
};

// The core pages, listed once. These were previously five separate literal
// lists (homepage tiles, sitemap, llms.txt, layout nav/footer, and IMAGE_CORE
// in scripts/check-catalogue.mjs), which is four chances to add a page and
// forget one of them.
// Sitemap lastmod for the tool and pair pages. These are written in one pass, so
// one date is honest for all of them — bump it when the copy below changes.
export const CONTENT_UPDATED = "2026-08-01";

export const CORE: Core[] = [
  {
    path: "/compress-image",
    label: "Compress Image",
    tile: "Compress",
    blurb: "Shrink file sizes up to 80%",
    llms: "Reduce image file size with a quality slider (batch + ZIP).",
  },
  {
    path: "/resize-image",
    label: "Resize Image",
    tile: "Resize",
    blurb: "Exact pixels or percentage",
    llms: "Resize to exact pixels or percentage, aspect-ratio locked.",
  },
  {
    path: "/crop-image",
    label: "Crop Image",
    tile: "Crop",
    blurb: "Freeform or fixed ratios",
    llms: "Crop freeform or to 1:1, 4:3, 16:9, 9:16.",
  },
  {
    path: "/image-converter",
    label: "Image Converter",
    tile: "Convert",
    blurb: "JPG · PNG · WebP · HEIC",
    llms: "Convert between JPG, PNG, WebP (also reads HEIC, AVIF, GIF, BMP, SVG).",
  },
  {
    path: "/remove-background",
    label: "Remove Background",
    tile: "Remove BG",
    blurb: "Cut out the subject, get a PNG",
    llms: `Remove an image background and download a transparent PNG. Runs a segmentation model in the browser (~${MODEL_MB} MB, downloaded once).`,
  },
];

// --- Competitor comparison ---
// Deliberately not part of PAIRS: that array is generated from SOURCES ×
// TARGETS and its length is asserted arithmetically in tests/pairs.test.mjs.
//
// iLoveIMG numbers are quoted from their own pricing page (see `sources`),
// checked on the `updated` date. Re-check before editing — a stale competitor
// price is worse than no comparison page.

export const COMPARISONS: Comparison[] = [
  {
    slug: "iloveimg-alternative",
    competitor: "iLoveIMG",
    title: "iLoveIMG Alternative — Free Image Compressor, No Task Limits",
    desc: "A free iLoveIMG alternative with no task counter and no $7/mo upgrade. Compress, resize, crop and convert in your browser — nothing uploaded. Honest comparison.",
    h1: "The free iLoveIMG alternative",
    intro:
      "iLoveIMG is a solid image toolkit, and its free tier is more generous than most — 200 MB and 30 tasks on compression. The catch is what happens on the tools you reach for once: Crop and the Image Editor allow exactly one task, and background removal and upscaling allow three at 6 MB. ImgSquash is our image suite: every tool runs in your browser, so there is no task to count. Here is the honest comparison.",
    sections: [
      {
        h: "Should you switch? The short answer",
        body: [
          "Switch if you compress or convert images regularly and do not want a counter watching you, if you work with photos that should not be uploaded — client work, ID documents, screenshots with customer data — or if you mostly need the core four: compress, resize, crop, convert.",
          "Stay with iLoveIMG if you need AI upscaling, watermarking or its photo editor. ImgSquash does not have those. It does now remove backgrounds, and does it without uploading anything — but the model runs on your device, so it is slower than their server and softer on fine detail like hair.",
          "Disclosure: ImgSquash is our tool. Every iLoveIMG figure below comes from their published pricing page, linked at the bottom.",
        ],
      },
      {
        h: "The free-tier limits you are hitting",
        body: [
          "iLoveIMG's free allowances are per tool, and they fall off a cliff outside the basics. Compress, Resize, Convert, Rotate and Watermark get 200 MB and 30 tasks. Crop gets 90 MB and 1 task. The Image Editor gets 50 MB and 1 task. Upscale and Remove Background get 6 MB and 3 tasks.",
          "That 6 MB ceiling is the one that bites hardest, because it lands on exactly the tools you would use a modern phone photo with — and a modern phone photo is frequently larger than 6 MB before you start.",
          "Lifting the caps is Premium at $7 a month or $48 billed annually. The free tier is also ad-supported and web-only; mobile access sits behind the paid plan.",
          "ImgSquash has no task counter, because there is no task to count — the work happens on your own device. The honest limit on our side is your device's memory: a batch of several hundred photos is fine on a laptop and will struggle on an old phone.",
        ],
      },
      {
        h: "Where your images go",
        body: [
          "iLoveIMG processes on its servers, which means your images are uploaded. That is not a criticism — a server can run a far larger model than a browser tab can, which is why their upscaler exists and ours does not, and why their background removal handles hair better than ours.",
          "ImgSquash uses the browser's Canvas API and never sends the file anywhere. This is checkable rather than promised: open your browser's network tab while you compress a batch and you will see no upload, and the tools keep working if you disconnect after the page has loaded.",
          'This is worth being sceptical about generally, because "processed in your browser" is now a claim on almost every image tool\'s homepage, including competitors that then upload anyway. The network tab settles it in about five seconds, for us or for anyone else.',
        ],
      },
      {
        h: "Where iLoveIMG is genuinely better",
        body: [
          "Feature range. iLoveIMG ships thirteen tools; we ship five plus twenty-nine format-conversion pages. Their upscaler, watermarking tool, meme generator and photo editor have no equivalent here.",
          "Background-removal quality. We both do it; theirs is better. A server can run a model many times larger than one a browser will download, and it shows on hair, fur and semi-transparent edges. Ours is computed at 320×320 and scaled up, which is fine at web sizes and visibly soft at full zoom. The trade you get for that is that the photo never leaves your device.",
          "Very large files on weak hardware. Server-side processing does not care how much memory your device has. If you are compressing a 400 MB TIFF on a Chromebook, their architecture is the right one.",
          "Mobile apps, on the paid plan. We are a website only.",
        ],
      },
      {
        h: "How to switch",
        body: [
          "Nothing to migrate — no account, no library, no export. Bookmark whichever tool you use most.",
          "Most people arrive here for compression or a specific format conversion; both are linked below, along with the HEIC converter, which is the single most-requested one because iPhones keep producing files that other software refuses to open.",
        ],
      },
    ],
    matrix: [
      {
        feature: "Price",
        us: "Free",
        them: "Free / $7 mo",
        note: "iLoveIMG Premium is $7 monthly or $48 billed annually (about $4/month).",
      },
      { feature: "Account required", us: "No", them: "No (free tier)" },
      {
        feature: "Compress limit",
        us: "No task cap",
        them: "30 tasks · 200 MB",
      },
      { feature: "Crop limit", us: "No task cap", them: "1 task · 90 MB" },
      {
        feature: "Photo editor limit",
        us: "Not offered",
        them: "1 task · 50 MB",
      },
      {
        feature: "Remove background",
        us: "Yes, on-device",
        them: "3 tasks · 6 MB",
        note: "Ours downloads a 42 MB model to your browser once, then runs locally. Theirs is a larger model on a server, so it handles hair better — and needs the upload.",
      },
      {
        feature: "AI upscale",
        us: "Not offered",
        them: "3 tasks · 6 MB",
        note: "Upscaling needs a model far larger than a browser should download.",
      },
      {
        feature: "Images uploaded to a server",
        us: "No",
        them: "Yes",
        note: "ImgSquash uses the Canvas API in your tab. Check it in your network panel.",
      },
      {
        feature: "Works offline after page load",
        us: "Yes",
        them: "No",
      },
      { feature: "Batch processing + ZIP download", us: "Yes", them: "Yes" },
      {
        feature: "Format conversions",
        us: "29 pairs",
        them: "Convert tool",
        note: "We read JPG, PNG, WebP, HEIC, AVIF, GIF, BMP and SVG, and write JPG, PNG, WebP and ICO.",
      },
      { feature: "Number of tools", us: "5 core", them: "13" },
      { feature: "Mobile apps", us: "No", them: "Premium" },
    ],
    sources: [
      { label: "iLoveIMG pricing", url: "https://www.iloveimg.com/pricing" },
      {
        label: "iLoveIMG compress tool",
        url: "https://www.iloveimg.com/compress-image",
      },
    ],
    updated: "2026-08-01",
    faq: [
      {
        q: "Is there a free alternative to iLoveIMG with no limits?",
        a: "ImgSquash has no task counter and no account. Compression, resizing, cropping and format conversion all run in your browser, so there is nothing for us to meter — the only ceiling is your own device's memory. It is ad-supported, which is how it stays free.",
      },
      {
        q: "What are iLoveIMG's free limits?",
        a: "Per their pricing page: Compress, Resize, Convert, Rotate and Watermark get 200 MB and 30 tasks; Crop gets 90 MB and 1 task; the Image Editor gets 50 MB and 1 task; Upscale and Remove Background get 6 MB and 3 tasks. Premium is $7 a month or $48 a year.",
      },
      {
        q: "Are my images uploaded?",
        a: "Not here. ImgSquash compresses, resizes, crops and converts using the Canvas API inside your browser tab, so the file never leaves your device. You do not have to take that on trust — open your browser's network panel while you use it, or disconnect from the internet after the page loads and watch it keep working.",
      },
      {
        q: "Can I compress an image without losing quality?",
        a: "For a genuinely lossless result, convert to PNG or WebP rather than compressing a JPG — re-encoding a JPG always discards some data. If you want a smaller JPG, the practical answer is to drop quality to around 80%, which typically halves the file with no visible difference. The compressor's slider lets you compare before downloading.",
      },
      {
        q: "Does ImgSquash do background removal or AI upscaling?",
        a: `Background removal, yes — at /remove-background, with no task cap and no upload. It downloads a ${MODEL_MB} MB model to your browser the first time and runs on your own processor after that, which is slower than a server and softer on fine detail like hair. AI upscaling, no: that needs a model far larger than is reasonable to download. iLoveIMG offers both, capped at 3 tasks and 6 MB on the free tier.`,
      },
      {
        q: "Can I convert HEIC photos from my iPhone?",
        a: "Yes, and it is the most common reason people arrive here. HEIC decoding runs in your browser alongside everything else, and you can convert to JPG, PNG or WebP in batches.",
      },
    ],
  },
];
