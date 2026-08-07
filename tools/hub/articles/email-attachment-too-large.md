---
title: What to do when an email attachment is too large to send
description: Why the 25 MB limit is really about 18 MB, which files actually shrink, and the order to try things in before falling back to a link.
date: 2026-08-08
tags: [pdf, images, email, how-to]
---

Attachment limits are lower than they look. Gmail and most corporate mail systems
advertise 25 MB, but that ceiling applies to the _encoded_ message rather than to your
file: attachments are MIME-encoded for transport, which inflates them by roughly a
third. A 24 MB file becomes about 32 MB on the wire and bounces. The practical limit
on a "25 MB" system is closer to 18 MB, and the recipient's server gets a veto too —
plenty of corporate mail gateways cap inbound mail at 10 MB regardless of what your
provider allows. So the first useful thing to know is that you have less headroom than
the number suggests, and the second is that what you should do about it depends
entirely on what kind of file you are sending.

## Find out what is actually big

Before compressing anything, look at what you are attaching. Three cases behave
completely differently:

- **A scanned PDF** — every page is a photograph of a page. These are almost always
  the culprit, and they shrink dramatically.
- **A text PDF** — exported from Word, a report, an invoice. Already internally
  compressed. Will barely move.
- **Photos** — shrink well, and usually should be resized rather than just compressed.

The quickest test for a PDF is to try selecting text in it with your cursor. If you
can, it is a text PDF and there is little to remove. If dragging just draws a box over
an image, it is a scan, and you are about to save 80% or more.

## Scanned PDFs: the big win

Scanners default to high resolution and full colour, which is right for archiving and
wildly excessive for reading. A 20-page contract scanned at 600 DPI in colour can
easily be 40 MB; the same document at 200 DPI in greyscale is legible, prints fine,
and lands under 2 MB.

Run it through [PDF compression](https://pdf.toolsbay.app/compress-pdf). Almost all of
the saving comes from downsampling the page images, which is why scans respond so well
and text documents do not. If you need to know what is happening under the hood and
why some files refuse to move at all,
[how PDF compression works](/guides/how-pdf-compression-works) covers it properly.

One caveat: if the recipient needs to search or copy text out of the document, run
[OCR](https://pdf.toolsbay.app/ocr-pdf) first. Compressing a scan does not create
text, and a compressed scan is still a picture of words.

## Photos: resize first, compress second

A phone photo is 3 to 8 MB, so ten of them will not send. The instinct is to compress
them; the better first move is to resize them.

Nobody viewing a holiday photo, a receipt or a progress shot on a laptop needs 6000
pixels of width. Resizing to 1500 or 2000 pixels on the long edge typically cuts the
file by 80% or more before you touch quality, and looks identical on any screen the
recipient will use. Then compress gently if you are still over.
[Resize](https://image.toolsbay.app/resize-image) and
[compress](https://image.toolsbay.app/compress-image) both handle a whole batch at
once, so twenty photos is the same amount of work as one.

The exception is when the recipient needs the originals — a photographer, a printer,
an insurance assessor documenting damage. Do not quietly degrade files somebody needs
at full resolution. That is a case for a link, covered below.

## Office documents that are secretly full of photos

A Word document or a PowerPoint deck that will not send is nearly always carrying
full-resolution images that were dragged straight in from a phone or a camera. The
text is a rounding error; the pictures are the file.

Both Word and PowerPoint have a built-in "Compress Pictures" option that downsamples
every embedded image at once, which is the fastest fix and keeps the document
editable. If the recipient only needs to read it, exporting to PDF and compressing
that is usually smaller still — and has the side benefit that your layout arrives
looking the way you left it.

## Combine before you send

If the problem is fifteen separate attachments rather than one huge one, the answer is
different: [merge the PDFs](https://pdf.toolsbay.app/merge-pdf) into a single
document, or convert a set of photos into
[one PDF](https://pdf.toolsbay.app/jpg-to-pdf).

This is worth doing even when you are under the limit. One well-ordered file is easier
for the recipient to handle than fifteen loose ones, it survives being forwarded
intact, and it removes the chance that somebody misses attachment eleven. For expense
claims, applications and anything that gets filed, a single document is what the
person on the other end actually wanted.

## When to stop compressing and send a link

Compression has a floor, and pushing past it wastes your time and degrades the file.
Send a link instead when:

- The file is genuinely large — video, raw photography, a large dataset. No amount of
  compression brings a 2 GB video into an email.
- The recipient needs the original quality.
- You are sending to an unknown mail system whose inbound limit you cannot predict.
- The document is highly sensitive and you would rather control access and revoke it
  later than push a permanent copy into somebody's mailbox and their backups.

A shared link also survives the case where the recipient's gateway silently strips
attachments, which happens more than people realise and produces a confusing thread
where you are certain you sent something and they are certain you did not.

## The order that works

1. Check what kind of file it is — scan, text PDF, photos, or an office document full
   of photos.
2. Resize photos. Compress scans. Compress pictures inside office documents.
3. Merge multiple files into one.
4. Compress the result if you are still over.
5. Aim for 10 MB rather than 25, so the recipient's gateway does not reject what yours
   accepted.
6. If you are fighting the file, send a link.

Everything in steps two to four runs in your browser here — a contract, a payslip or a
medical letter is never uploaded to anyone's server on the way to being made smaller,
which for exactly those documents is the point.
