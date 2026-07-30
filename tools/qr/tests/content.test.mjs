// Registry invariants for the QR types, barcode symbologies and payment guides.
// The symbology pages exist purely to rank for "code 128 barcode generator" and
// friends, so a wrong `format` string would render the wrong barcode on a page
// whose title promises a specific one.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QR_TYPES, SYMBOLOGIES, PAYMENT_GUIDES } from '../src/content.ts';

const ALL = [...QR_TYPES, ...SYMBOLOGIES, ...PAYMENT_GUIDES];

test('slugs are unique across every page type and URL-safe', () => {
  const seen = new Set();
  for (const p of ALL) {
    assert.ok(!seen.has(p.slug), `duplicate slug: ${p.slug}`);
    seen.add(p.slug);
    assert.match(p.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `bad slug: ${p.slug}`);
  }
  // The barcode hub route is registered separately in index.tsx; nothing in the
  // content arrays may claim it or the two would collide.
  assert.ok(!seen.has('barcode-generator'), 'barcode-generator is the hub route');
});

test('every page has the fields the template renders', () => {
  for (const p of ALL) {
    for (const field of ['title', 'desc', 'h1']) {
      assert.ok(p[field]?.trim(), `${p.slug} is missing ${field}`);
    }
    assert.ok(Array.isArray(p.faq) && p.faq.length > 0, `${p.slug} has no FAQ`);
    assert.ok(p.title.length <= 75, `${p.slug}: title ${p.title.length} chars (>75)`);
    assert.ok(p.desc.length <= 175, `${p.slug}: desc ${p.desc.length} chars (>175)`);
  }
});

// These four strings are passed to JsBarcode. A typo renders nothing and the
// page silently shows an empty preview.
test('symbology formats are the ones JsBarcode accepts and barcode.ts supports', () => {
  const SUPPORTED = new Set(['CODE128', 'EAN13', 'UPC', 'CODE39']);
  assert.equal(SYMBOLOGIES.length, 4);
  const formats = SYMBOLOGIES.map((s) => s.format);
  for (const f of formats) {
    assert.ok(SUPPORTED.has(f), `unsupported JsBarcode format: ${f}`);
  }
  assert.equal(new Set(formats).size, formats.length, 'one page per format, no duplicates');
});

// The format is interpolated into x-data="barcodeApp('...')" — a quote or
// backslash would break out of the attribute.
test('symbology formats are safe to inline into an x-data attribute', () => {
  for (const s of SYMBOLOGIES) {
    assert.match(s.format, /^[A-Z0-9]+$/, `${s.slug}: format must be bare uppercase`);
    assert.ok(s.placeholder?.trim(), `${s.slug} has no input placeholder`);
  }
});

test('each symbology page names its own format in the title', () => {
  // A page targeting "ean 13 barcode generator" that does not say EAN-13 in the
  // title is not targeting anything.
  const expect = {
    'code-128-barcode-generator': /code\s*128/i,
    'ean-13-barcode-generator': /ean-?13/i,
    'upc-a-barcode-generator': /upc/i,
    'code-39-barcode-generator': /code\s*39/i,
  };
  for (const s of SYMBOLOGIES) {
    const re = expect[s.slug];
    assert.ok(re, `unexpected symbology slug: ${s.slug}`);
    assert.match(s.title, re, `${s.slug}: title does not name its format`);
    assert.match(s.h1, re, `${s.slug}: h1 does not name its format`);
  }
});

// Merchant payment QRs are issued by the payment network. Shipping a generator
// for them would produce codes that silently fail at the till, so these four
// pages are guides and must stay guides.
test('payment pages are guides with prose sections, not generators', () => {
  assert.equal(PAYMENT_GUIDES.length, 4);
  for (const g of PAYMENT_GUIDES) {
    assert.ok(Array.isArray(g.sections) && g.sections.length > 0, `${g.slug} has no sections`);
    for (const s of g.sections) {
      assert.ok(s.h?.trim(), `${g.slug} has a section with no heading`);
      assert.ok(Array.isArray(s.body) && s.body.length > 0, `${g.slug}: empty section body`);
    }
    assert.ok(!('fields' in g), `${g.slug} must not define generator input fields`);
  }
});

test('QR type pages define the fields their generator renders', () => {
  for (const t of QR_TYPES) {
    assert.ok(Array.isArray(t.fields) && t.fields.length > 0, `${t.slug} has no fields`);
    for (const f of t.fields) {
      assert.ok(f.model?.trim(), `${t.slug} has a field with no model binding`);
      assert.ok(f.label?.trim(), `${t.slug} has an unlabelled field`);
    }
  }
});
