---
title: Getting a passport or visa photo to the exact size a form wants
description: Millimetres, pixels and DPI are three ways of saying the same thing. How to convert between them and hit an exact spec without distorting the photo.
date: 2026-08-08
tags: [images, documents, how-to]
---

Passport and visa portals reject photos for reasons they rarely explain, and the
underlying problem is almost always a units mismatch. The specification is written in
millimetres, your photo is measured in pixels, and the thing that connects them is DPI
— a number the form may or may not mention. Get that conversion wrong and you submit
something that is the right shape and the wrong size, or the right size and too
coarse to print. The arithmetic is one multiplication, but you have to know which
numbers to put in it. Requirements also differ by country and change without notice,
so this is about the method rather than a table of measurements: check your issuing
authority's current specification, then use what follows to hit it exactly.

## The one calculation

Millimetres, pixels and DPI are three views of the same image:

**pixels = millimetres ÷ 25.4 × DPI**

The 25.4 is millimetres per inch. DPI (dots per inch) is the printing density, and it
is the number people leave out.

Take the common 35 × 45 mm photo at 600 DPI:

- Width: 35 ÷ 25.4 × 600 = **827 px**
- Height: 45 ÷ 25.4 × 600 = **1063 px**

At 300 DPI the same photo is 413 × 531 px. Same physical print, half the pixels. This
is why "35 × 45 mm" on its own does not tell you what to produce — and why two people
following the same spec can submit files that differ by a factor of four.

If the form gives you pixel dimensions directly, use those and ignore DPI entirely.
If it gives millimetres and a DPI, run the calculation. If it gives millimetres and no
DPI, 600 is a safe assumption for something that will be printed, and 300 is the
minimum worth submitting.

## Get the aspect ratio right first

Before any resizing, crop to the correct proportions. A 35 × 45 mm photo has a ratio
of about 1:1.286; a 2 × 2 inch photo is square.

If you resize a photo whose ratio does not match, one of two bad things happens.
Either the tool stretches it — which distorts the face, and facial distortion is an
explicit rejection reason in most photo standards — or it letterboxes it, leaving
bands that break the framing rules about head position.

So [crop first](https://image.toolsbay.app/crop-image), to the target ratio, with the
head positioned as the specification requires. Most standards define both the head
height as a proportion of the image and the space above the head, and getting the crop
right is what satisfies those. Then resize the correctly-proportioned crop to the exact
pixel dimensions, with aspect-ratio lock on so nothing shifts.

## Then hit the file size

Photo portals frequently cap file size aggressively — commonly a few hundred
kilobytes, sometimes under 100 KB — and they enforce it after all the dimension rules,
so this is the last step rather than the first.

The order matters. Crop, resize to the exact pixels, and only then
[compress](https://image.toolsbay.app/compress-image) to fit the size cap. Compressing
before resizing means you compress data you are about to throw away, then compress
again afterwards, which costs quality twice for no benefit.

Watch the background as you lower quality. Passport photos are shot against plain
light backgrounds, and flat areas are exactly where JPEG compression shows first — a
clean background develops blotches and faint banding well before anything else in the
frame looks wrong. If the background starts to mottle, you have gone too far; go back
and reduce the pixel dimensions slightly instead, if the spec allows any latitude.

## Format, and the iPhone problem

Nearly every photo portal accepts JPG and many accept nothing else.

Photos taken on an iPhone are HEIC by default, which almost nothing outside Apple's
ecosystem reads, so the upload fails with an unhelpful error even when the dimensions
and size are perfect. [Convert HEIC to JPG](https://image.toolsbay.app/heic-to-jpg)
before you start — and do it first, because there is no point tuning a file that will
be rejected on its extension.

Avoid PNG for photographs here even where it is accepted. It is lossless, so files are
several times larger for no visible gain, which fights directly against the size cap.

## Things that get photos rejected beyond the numbers

Getting the file right is necessary and not sufficient. The rejections that survive
correct dimensions are almost always about the photograph itself:

- **Shadows** — on the face, or cast onto the background behind the subject. This is
  the most common failure by a distance, and it comes from a single light source or
  from standing too close to the wall.
- **Background** — must be plain and even. A wall that looks uniform to your eye often
  is not to a reviewer, particularly with a shadow gradient across it.
- **Expression and eyes** — neutral expression, mouth closed, eyes open and clearly
  visible, nothing obscuring them.
- **Glasses** — increasingly disallowed outright, and where permitted, no glare and no
  frames crossing the eyes.
- **Head position and size** — the head must occupy a specified proportion of the
  frame, which is the whole reason the crop step comes first.
- **Recency** — most authorities require a photo taken within the last six months.

None of these are fixable by resizing. If a photo is rejected after the dimensions are
demonstrably correct, retake it rather than reprocessing it.

## A checklist

1. Read the current specification from the issuing authority — dimensions, DPI or
   pixels, file size cap, accepted formats.
2. Convert to JPG if the source is HEIC or anything else.
3. Crop to the required aspect ratio with the head correctly positioned.
4. Resize to the exact pixel dimensions, aspect-ratio lock on.
5. Compress to fit the size cap, checking the background for blotching.
6. Check the photograph itself against the rules that have nothing to do with file
   handling — shadows, background, expression, glasses.

Every step runs in your browser on this site, so a passport photograph is never
uploaded anywhere on its way to being the right size. Given what a passport photo is
attached to elsewhere in your life, that is worth more than the convenience — and if
you would rather verify it than trust it, the guide on
[checking whether a tool uploads your files](/guides/is-this-tool-uploading-my-files)
shows you how.
