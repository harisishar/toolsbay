import { test } from "node:test";
import assert from "node:assert/strict";
import { parseRanges, parseRangeGroups, outName } from "../src/lib/ranges.ts";

test("parseRanges", () => {
  assert.deepEqual(parseRanges("1-3,5", 10), [0, 1, 2, 4]);
  assert.deepEqual(parseRanges("", 3), [0, 1, 2]);
  assert.deepEqual(parseRanges("3-1", 10), [0, 1, 2]); // reversed range normalised
  assert.deepEqual(parseRanges("2, 2, 2", 10), [1]); // dedup
  assert.deepEqual(parseRanges("8-12", 10), [7, 8, 9]); // clamped
  assert.throws(() => parseRanges("abc", 10));
  assert.throws(() => parseRanges("99", 10)); // out of bounds -> empty -> throws
});

test("parseRangeGroups", () => {
  assert.deepEqual(parseRangeGroups("1-2,4", 5), [[0, 1], [3]]);
  assert.deepEqual(parseRangeGroups("", 3), [[0], [1], [2]]);
});

test("outName", () => {
  assert.equal(outName("report.pdf", "merged"), "report-merged.pdf");
  assert.equal(outName("report.PDF", "page-1", "jpg"), "report-page-1.jpg");
  assert.equal(outName("noext", "split"), "noext-split.pdf");
});
