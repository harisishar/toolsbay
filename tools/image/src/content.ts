import type { Faq } from './seo.js';

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
    label: 'JPG',
    long: 'JPEG photographs',
    blurb: 'JPG is universal, but it is lossy and cannot store transparency',
    alpha: false,
  },
  png: {
    label: 'PNG',
    long: 'PNG graphics',
    blurb: 'PNG is lossless and supports transparency, but files are often far larger than needed',
    alpha: true,
  },
  webp: {
    label: 'WebP',
    long: 'WebP images',
    blurb: 'WebP compresses well, but some older apps, printers and CMSs still reject it',
    alpha: true,
  },
  heic: {
    label: 'HEIC',
    long: 'iPhone HEIC photos',
    blurb: 'HEIC is what iPhones shoot by default, and almost nothing outside Apple opens it reliably',
    alpha: false,
  },
  avif: {
    label: 'AVIF',
    long: 'AVIF images',
    blurb: 'AVIF makes tiny files, but many editors and older apps cannot open it',
    alpha: true,
  },
  gif: {
    label: 'GIF',
    long: 'GIF images',
    blurb: 'GIF is limited to 256 colours; converting a static GIF gives smaller, better-looking files',
    alpha: true,
  },
  bmp: {
    label: 'BMP',
    long: 'BMP bitmaps',
    blurb: 'BMP is uncompressed — files are enormous for no visual benefit',
    alpha: false,
  },
  svg: {
    label: 'SVG',
    long: 'SVG vector graphics',
    blurb: 'SVG is a vector format; converting rasterizes it so it works anywhere an image is expected',
    alpha: true,
  },
};

export const TARGETS: Record<string, TargetMeta> = {
  jpg: {
    label: 'JPG',
    long: 'JPEG',
    mime: 'image/jpeg',
    pros: 'small files that open everywhere — every browser, phone, editor and printer',
    alpha: false,
  },
  png: {
    label: 'PNG',
    long: 'PNG',
    mime: 'image/png',
    pros: 'pixel-perfect lossless quality with full transparency support',
    alpha: true,
  },
  webp: {
    label: 'WebP',
    long: 'WebP',
    mime: 'image/webp',
    pros: 'files roughly 25–35% smaller than JPG at the same visual quality — ideal for websites',
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
      if (src === 'heic') {
        faq.push({
          q: 'Why does my iPhone save photos as HEIC?',
          a: 'Apple uses HEIC because it halves file size at the same quality. To make your iPhone shoot JPG directly, go to Settings → Camera → Formats → Most Compatible.',
        });
      }
      if (src === 'gif') {
        faq.push({
          q: 'Will an animated GIF stay animated?',
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
      q: 'How does the image compressor reduce file size?',
      a: 'It re-encodes your image at a quality level you control. At 75–85% quality, JPG and WebP files typically shrink by 60–80% with no visible difference on screens.',
    },
    {
      q: 'Are my photos uploaded anywhere?',
      a: 'No. Compression runs entirely in your browser using the Canvas API. Files never leave your device — you can even use the tool offline once the page is loaded.',
    },
    {
      q: 'What quality setting should I use?',
      a: 'For web photos, 75–85% is the sweet spot. For archiving, use 90%+. If a file must hit a size limit (say a 2 MB form upload), lower the slider until the output size fits.',
    },
  ],
  resize: [
    {
      q: 'How do I resize an image without stretching it?',
      a: 'Keep "Lock aspect ratio" on and set just one dimension — the other is calculated automatically, so nothing distorts.',
    },
    {
      q: 'Does resizing reduce quality?',
      a: 'Downscaling keeps images sharp (we use high-quality resampling). Upscaling beyond the original size cannot add detail and will look soft — this tool resizes to exactly the pixels you ask for.',
    },
    {
      q: 'Can I resize many images to the same width at once?',
      a: 'Yes — drop a batch, set the width once, and every image is resized proportionally, then download everything as a ZIP.',
    },
  ],
  crop: [
    {
      q: 'How do I crop an image online?',
      a: 'Drop an image, drag a selection over the area you want to keep, optionally lock a ratio like 1:1 or 16:9, then download the cropped result. Nothing is uploaded.',
    },
    {
      q: 'What aspect ratio should I crop to?',
      a: '1:1 for profile pictures and Instagram posts, 16:9 for YouTube thumbnails and presentations, 4:3 for classic photos, 9:16 for stories and reels.',
    },
  ],
  convert: [
    {
      q: 'Which format should I convert my images to?',
      a: 'JPG for photos that must open anywhere, PNG for graphics that need transparency or lossless quality, WebP for websites where smaller files mean faster loading.',
    },
    {
      q: 'Is there a file size or count limit?',
      a: 'No hard limit — processing happens on your own device, so capacity depends only on your browser memory. Batches of hundreds of typical photos work fine.',
    },
  ],
};
