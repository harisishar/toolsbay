import type { Comparison, Faq } from "./seo.js";

type SourceMeta = {
  label: string;
  long: string;
  blurb: string; // why people convert away from it
  alpha: boolean;
};

type TargetMeta = {
  label: string;
  long: string;
  mime: string;
  pros: string; // why convert to it
  alpha: boolean;
};

export const SOURCES: Record<string, SourceMeta> = {
  jpg: {
    label: "JPG",
    long: "JPEG photographs",
    blurb: "JPG is universal, but it is lossy and cannot store transparency",
    alpha: false,
  },
  png: {
    label: "PNG",
    long: "PNG graphics",
    blurb:
      "PNG is lossless and supports transparency, but files are often far larger than needed",
    alpha: true,
  },
  webp: {
    label: "WebP",
    long: "WebP images",
    blurb:
      "WebP compresses well, but some older apps, printers and CMSs still reject it",
    alpha: true,
  },
  heic: {
    label: "HEIC",
    long: "iPhone HEIC photos",
    blurb:
      "HEIC is what iPhones shoot by default, and almost nothing outside Apple opens it reliably",
    alpha: false,
  },
  avif: {
    label: "AVIF",
    long: "AVIF images",
    blurb:
      "AVIF makes tiny files, but many editors and older apps cannot open it",
    alpha: true,
  },
  gif: {
    label: "GIF",
    long: "GIF images",
    blurb:
      "GIF is limited to 256 colours; converting a static GIF gives smaller, better-looking files",
    alpha: true,
  },
  bmp: {
    label: "BMP",
    long: "BMP bitmaps",
    blurb: "BMP is uncompressed — files are enormous for no visual benefit",
    alpha: false,
  },
  svg: {
    label: "SVG",
    long: "SVG vector graphics",
    blurb:
      "SVG is a vector format; converting rasterizes it so it works anywhere an image is expected",
    alpha: true,
  },
};

export const TARGETS: Record<string, TargetMeta> = {
  jpg: {
    label: "JPG",
    long: "JPEG",
    mime: "image/jpeg",
    pros: "small files that open everywhere — every browser, phone, editor and printer",
    alpha: false,
  },
  png: {
    label: "PNG",
    long: "PNG",
    mime: "image/png",
    pros: "pixel-perfect lossless quality with full transparency support",
    alpha: true,
  },
  webp: {
    label: "WebP",
    long: "WebP",
    mime: "image/webp",
    pros: "files roughly 25–35% smaller than JPG at the same visual quality — ideal for websites",
    alpha: true,
  },
  ico: {
    label: "ICO",
    long: "Windows ICO icons",
    mime: "image/x-icon",
    pros: "the icon format browsers look for at /favicon.ico and Windows uses for shortcuts",
    alpha: true,
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
  faq: Faq[];
};

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
      return {
        slug: `${src}-to-${tgt}`,
        src,
        tgt,
        title: `${s.label} to ${t.label} Converter — Free, Private, No Upload`,
        desc: `Convert ${s.label} to ${t.label} free in your browser. No upload, no watermark, batch supported. ${s.blurb}.`,
        h1: `${s.label} to ${t.label} Converter`,
        intro: `${s.blurb}. Converting to ${t.long} gives you ${t.pros}. Drop your files below — conversion runs locally in your browser, so nothing is ever uploaded.`,
        faq,
      };
    }),
);

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
};

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
    desc: "A free iLoveIMG alternative with no task counter and no $7/mo upgrade. Compress, resize, crop and convert in your browser — images are never uploaded. Honest comparison.",
    h1: "The free iLoveIMG alternative",
    intro:
      "iLoveIMG is a solid image toolkit, and its free tier is more generous than most — 200 MB and 30 tasks on compression. The catch is what happens on the tools you reach for once: Crop and the Image Editor allow exactly one task, and background removal and upscaling allow three at 6 MB. PixSquash is our image suite: every tool runs in your browser, so there is no task to count. Here is the honest comparison.",
    sections: [
      {
        h: "Should you switch? The short answer",
        body: [
          "Switch if you compress or convert images regularly and do not want a counter watching you, if you work with photos that should not be uploaded — client work, ID documents, screenshots with customer data — or if you mostly need the core four: compress, resize, crop, convert.",
          "Stay with iLoveIMG if you need AI upscaling, background removal, watermarking or its photo editor. PixSquash does not have any of those, and the free tier of iLoveIMG will at least let you do a few.",
          "Disclosure: PixSquash is our tool. Every iLoveIMG figure below comes from their published pricing page, linked at the bottom.",
        ],
      },
      {
        h: "The free-tier limits you are hitting",
        body: [
          "iLoveIMG's free allowances are per tool, and they fall off a cliff outside the basics. Compress, Resize, Convert, Rotate and Watermark get 200 MB and 30 tasks. Crop gets 90 MB and 1 task. The Image Editor gets 50 MB and 1 task. Upscale and Remove Background get 6 MB and 3 tasks.",
          "That 6 MB ceiling is the one that bites hardest, because it lands on exactly the tools you would use a modern phone photo with — and a modern phone photo is frequently larger than 6 MB before you start.",
          "Lifting the caps is Premium at $7 a month or $48 billed annually. The free tier is also ad-supported and web-only; mobile access sits behind the paid plan.",
          "PixSquash has no task counter, because there is no task to count — the work happens on your own device. The honest limit on our side is your device's memory: a batch of several hundred photos is fine on a laptop and will struggle on an old phone.",
        ],
      },
      {
        h: "Where your images go",
        body: [
          "iLoveIMG processes on its servers, which means your images are uploaded. That is not a criticism — it is what makes their upscaling and background removal possible at all, since those need models that cannot run in a tab.",
          "PixSquash uses the browser's Canvas API and never sends the file anywhere. This is checkable rather than promised: open your browser's network tab while you compress a batch and you will see no upload, and the tools keep working if you disconnect after the page has loaded.",
          'This is worth being sceptical about generally, because "processed in your browser" is now a claim on almost every image tool\'s homepage, including competitors that then upload anyway. The network tab settles it in about five seconds, for us or for anyone else.',
        ],
      },
      {
        h: "Where iLoveIMG is genuinely better",
        body: [
          "Feature range. iLoveIMG ships thirteen tools; we ship four plus twenty-nine format-conversion pages. Their upscaler, background remover, watermarking tool, meme generator and photo editor have no equivalent here, and the first two are not things a browser tab can realistically do well.",
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
        feature: "Upscale / remove background",
        us: "Not offered",
        them: "3 tasks · 6 MB",
        note: "These need models that cannot run in a browser tab, so we do not offer them at all.",
      },
      {
        feature: "Images uploaded to a server",
        us: "No",
        them: "Yes",
        note: "PixSquash uses the Canvas API in your tab. Check it in your network panel.",
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
      { feature: "Number of tools", us: "4 core", them: "13" },
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
        a: "PixSquash has no task counter and no account. Compression, resizing, cropping and format conversion all run in your browser, so there is nothing for us to meter — the only ceiling is your own device's memory. It is ad-supported, which is how it stays free.",
      },
      {
        q: "What are iLoveIMG's free limits?",
        a: "Per their pricing page: Compress, Resize, Convert, Rotate and Watermark get 200 MB and 30 tasks; Crop gets 90 MB and 1 task; the Image Editor gets 50 MB and 1 task; Upscale and Remove Background get 6 MB and 3 tasks. Premium is $7 a month or $48 a year.",
      },
      {
        q: "Are my images uploaded?",
        a: "Not here. PixSquash compresses, resizes, crops and converts using the Canvas API inside your browser tab, so the file never leaves your device. You do not have to take that on trust — open your browser's network panel while you use it, or disconnect from the internet after the page loads and watch it keep working.",
      },
      {
        q: "Can I compress an image without losing quality?",
        a: "For a genuinely lossless result, convert to PNG or WebP rather than compressing a JPG — re-encoding a JPG always discards some data. If you want a smaller JPG, the practical answer is to drop quality to around 80%, which typically halves the file with no visible difference. The compressor's slider lets you compare before downloading.",
      },
      {
        q: "Does PixSquash do background removal or AI upscaling?",
        a: "No. Both need machine-learning models that are impractical to run in a browser tab, and running them on a server would mean uploading your images — which is the thing this tool exists to avoid. iLoveIMG offers both, capped at 3 tasks and 6 MB on the free tier.",
      },
      {
        q: "Can I convert HEIC photos from my iPhone?",
        a: "Yes, and it is the most common reason people arrive here. HEIC decoding runs in your browser alongside everything else, and you can convert to JPG, PNG or WebP in batches.",
      },
    ],
  },
];
