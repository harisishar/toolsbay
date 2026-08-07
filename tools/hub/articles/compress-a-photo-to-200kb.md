---
title: How to get a photo under a 200 KB upload limit
description: Upload forms reject photos for size, dimensions or both — and the fix is different for each. How to hit an exact file size without wrecking the image.
date: 2026-08-08
tags: [images, uploads, how-to]
---

Government portals, job boards, university applications and banking forms all like to
cap uploads at a specific number — 200 KB, 100 KB, sometimes 50 KB — and then reject
your photo without saying which limit you actually hit. A modern phone photo is
somewhere between 2 MB and 8 MB, so you are usually an order of magnitude over, and
the instinct is to compress harder until the number goes down. That works, but it is
often the wrong lever, and pushed far enough it produces a smeared image that gets
rejected for a different reason. There are three separate knobs — dimensions, quality
and format — and knowing which one your rejection is about saves a lot of guessing.

## Work out which limit you actually hit

Before touching anything, read the error properly. Upload forms enforce three limits
and rarely tell you which one failed:

- **File size** — "must be under 200 KB". This is about bytes on disk.
- **Pixel dimensions** — "maximum 1000 × 1000 px", or a required exact size.
- **Format** — "JPG or PNG only", which is where an iPhone HEIC or a downloaded WebP
  fails despite being small enough.

They are independent. A 900 × 600 image can be over the size limit, and a 150 KB
image can be rejected for being 6000 pixels wide. If the form states a pixel
dimension anywhere, deal with that first: resizing is what actually removes data,
and it often takes you under the size cap for free.

## Resize before you compress

This is the part most people skip, and it is the one that does the heavy lifting.

File size scales roughly with pixel count. Halving both the width and the height
leaves you with a quarter of the pixels, and usually something close to a quarter of
the file — before you touch quality at all. Compressing a 6000-pixel-wide photo down
to 200 KB means throwing away so much detail that the result looks like a bad fax.
Resizing that same photo to 1200 pixels wide and _then_ compressing it gently
produces a far better image at the same file size, because you removed data the form
was never going to display anyway.

How small is small enough? If the image is going to be looked at on a screen, 1000 to
1500 pixels on the long edge is plenty. If it is going to be printed at passport size,
you need more, but the form will normally tell you. Use the
[image resizer](https://image.toolsbay.app/resize-image) with the aspect-ratio lock
on so nothing stretches — a stretched face is its own rejection reason.

## Then compress, and watch the right things

Now reduce quality. JPEG quality is a scale, not a switch, and the relationship
between it and file size is steep at the top: dropping from 100 to 85 typically halves
the file with no visible difference at all, because you are discarding detail that was
never perceptible. Below about 60 it starts to show, and it shows first in specific
places:

- **Flat areas** — skies, walls, studio backgrounds — develop blotches and banding.
- **Hard edges** — text, logos, the boundary between a face and a plain background —
  pick up faint halos, the artifact known as ringing.
- **Fine texture** — hair, fabric weave, grass — turns mushy and slightly plastic.

Check those three areas at 100% zoom rather than judging from a thumbnail. A photo
that looks fine shrunk to postage-stamp size on your screen can be visibly degraded
at the size the reviewer opens it.

The [image compressor](https://image.toolsbay.app/compress-image) shows the resulting
file size as you move the quality slider, which turns this into one adjustment instead
of a save-check-repeat loop.

## Fix the format if that was the problem

If the form only accepts JPG or PNG, format is a separate fix.

Photos from an iPhone are HEIC by default, and almost nothing outside Apple's
ecosystem opens them — which is why the upload fails even when the file is small.
Convert to JPG. Images saved from a website are frequently WebP, with the same result.
[Converting HEIC to JPG](https://image.toolsbay.app/heic-to-jpg) or
[WebP to JPG](https://image.toolsbay.app/webp-to-jpg) takes a second and removes the
problem entirely.

One thing to know: converting a HEIC photo drops Live Photo motion, depth data and
Apple's edit history, because those live in the HEIC container rather than in the
picture. The visible photograph converts faithfully. For an upload form, none of the
extras mattered anyway.

## If it is a screenshot or a document photo

Different rules. Screenshots, scanned forms and anything containing text should be
**PNG**, not JPG — lossy compression is designed for photographs and turns text into a
haze of ringing artifacts, which is a real problem when somebody has to read an
account number off it.

If a PNG screenshot is too large, resize rather than compress: PNG is lossless, so
there is no quality slider to pull. Cropping helps enormously here too. Most
screenshots contain a great deal of empty interface that nobody needs, and
[cropping](https://image.toolsbay.app/crop-image) to the part that matters can take a
2 MB screenshot under 200 KB on its own.

## A working order that avoids the loop

1. Convert the format first, if the form demands one. There is no point tuning a file
   that will be rejected for its extension.
2. Crop out anything the reviewer does not need to see.
3. Resize to the dimensions the form asks for, or to about 1200 pixels on the long
   edge if it does not say.
4. Compress, starting around 80% quality, and lower it only if you are still over.
5. Check at 100% zoom before uploading.

Follow that order and you almost never need a second pass. Do it in reverse —
compress first, then discover you also needed to resize — and you compress an already
compressed image, which loses quality twice for a saving you would have got free from
the resize.

## Keep the original

Every lossy save discards detail permanently, and it compounds: an image compressed,
re-opened and compressed again is meaningfully worse than one compressed once to the
same final size. Work from the original photo each time rather than from your last
attempt, and keep that original somewhere. If a second form later asks for a larger
version, you will still have one.

Everything above runs in your browser on this site — the photo is never uploaded,
which for a passport scan or a bank document is worth more than the convenience. If
you want to verify that rather than take our word for it, the guide on
[checking whether a tool uploads your files](/guides/is-this-tool-uploading-my-files)
shows you how in about thirty seconds.
