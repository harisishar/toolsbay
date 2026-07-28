import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthlyPayment, taxFromBrackets } from '../src/lib/calc-types.ts';
import { evaluate } from '../src/lib/expr.ts';
import { epfParts, socsoParts, eisParts, myAnnualTax } from '../src/lib/calcs/salary-my.ts';
import { usTax, ukTax, sgTax, auTax, inTax, deTax, caTax, jpTax } from '../src/lib/calcs/salary-world.ts';
import { ALL_CALCS, CALC_BY_SLUG } from '../src/lib/calcs/index.ts';

const close = (actual, expected, tolPct = 1) => {
  const tol = Math.abs(expected) * (tolPct / 100) + 1;
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ~${expected}, got ${actual} (tol ±${tol.toFixed(2)})`,
  );
};

test('monthlyPayment matches known amortization', () => {
  close(monthlyPayment(300000, 6, 30), 1798.65, 0.1);
  close(monthlyPayment(20000, 0, 5), 333.33, 0.1);
});

test('taxFromBrackets', () => {
  const b = [
    [10000, 0.1],
    [Infinity, 0.2],
  ];
  assert.equal(taxFromBrackets(5000, b), 500);
  assert.equal(taxFromBrackets(15000, b), 2000);
  assert.equal(taxFromBrackets(0, b), 0);
});

test('expression evaluator', () => {
  assert.equal(evaluate('2+3*4'), 14);
  assert.equal(evaluate('(2+3)*4'), 20);
  assert.equal(evaluate('2^10'), 1024);
  close(evaluate('sin(30)'), 0.5, 0.01);
  close(evaluate('sqrt(16)+ln(e)', 'rad'), 5, 0.01);
  assert.equal(evaluate('-5+10'), 5);
  assert.throws(() => evaluate('2++'));
  assert.throws(() => evaluate('foo(2)'));
});

test('Malaysia EPF/SOCSO/EIS', () => {
  // RM5,000: employee 550, employer 13% = 650
  close(epfParts(5000).employee, 550, 0.01);
  close(epfParts(5000).employer, 650, 0.01);
  close(epfParts(6000).employer, 720, 0.01); // 12% above 5k
  close(socsoParts(4000).employee, 20, 1);
  close(socsoParts(10000).employee, 30, 1); // capped at 6k
  close(eisParts(10000).employee, 12, 1);
});

test('Malaysia annual tax (single, YA2025)', () => {
  // RM72,000 gross, EPF 7,920 (capped 4,000 relief), SOCSO+EIS ~350
  // chargeable = 72,000 - 9,000 - 4,000 - 350 = 58,650
  // LHDN cumulative: 1,500 at 50k + 8,650 × 11% = 2,451.50
  const { chargeable, tax } = myAnnualTax(72000, 7920, 500);
  close(chargeable, 58650, 0.01);
  close(tax, 2451.5, 0.1);
  // low income → zero after rebate
  assert.equal(myAnnualTax(30000, 3300, 350).tax, 0);
});

test('US federal 2025', () => {
  // $100k single: taxable 85,000 → 13,614 federal; FICA 7,650
  const r = usTax(100000);
  close(r.tax, 13614, 0.5);
  close(r.social, 7650, 0.5);
});

test('UK 2025/26', () => {
  // £45,000: tax 20% of 32,430 = 6,486; NI 8% of 32,430 = 2,594.40
  const r = ukTax(45000);
  close(r.tax, 6486, 0.5);
  close(r.social, 2594.4, 0.5);
});

test('Singapore', () => {
  // S$72,000: CPF 14,400; chargeable 56,650 → 550 + 16,650*7% = 1,715.50
  const r = sgTax(72000);
  close(r.social, 14400, 0.1);
  close(r.tax, 1715.5, 1);
});

test('Australia 2025-26', () => {
  // A$95,000: 4,288 + 30% of 50,000 = 19,288 + medicare 1,900 = 21,188
  const r = auTax(95000);
  close(r.tax, 21188, 0.5);
});

test('India FY2025-26 new regime', () => {
  assert.equal(inTax(1200000).tax, 0); // rebate zone
  // ₹20L: taxable 19.25L → 20k+40k+60k+65k... slabs: 4L@0,4L@5%,4L@10%,4L@15%,3.25L@20% = 0.2+0.4+0.6+0.65 = 1.85L → cess ×1.04 = 192,400
  close(inTax(2000000).tax, 192400, 1);
});

test('Germany 2025 sanity', () => {
  const r = deTax(60000);
  // Social ≈ 60,000 × 20.95% ≈ 12,570; tax roughly 10–12k
  close(r.social, 12570, 2);
  assert.ok(r.tax > 8000 && r.tax < 13000, `de tax ${r.tax}`);
  assert.ok(r.net > 34000 && r.net < 41000, `de net ${r.net}`);
});

test('Canada federal 2025', () => {
  const r = caTax(80000);
  // fed: 57,375*.15 + 22,625*.205 = 8,606.25+4,638.13 = 13,244.38 − BPA credit 2,419.35 = 10,825
  close(r.tax, 10825, 1);
  close(r.social, 4034.1 + 348 + 1077.48, 1); // CPP + CPP2 + EI
});

test('Japan 2025 sanity', () => {
  const r = jpTax(6000000);
  // Social ≈ 879k; empDed 1.64M; national taxable ≈ 3.0M → ~205k*1.021; residence ≈ 305k
  close(r.social, 879000, 1);
  assert.ok(r.tax > 400000 && r.tax < 620000, `jp tax ${r.tax}`);
});

test('registry: unique slugs, all compute with defaults', () => {
  assert.equal(new Set(ALL_CALCS.map((c) => c.slug)).size, ALL_CALCS.length);
  assert.ok(ALL_CALCS.length >= 50, `expected 50+ calculators, got ${ALL_CALCS.length}`);
  for (const calc of ALL_CALCS) {
    const v = Object.fromEntries(calc.inputs.map((i) => [i.key, String(i.def ?? '')]));
    const r = calc.compute(v);
    assert.ok(Array.isArray(r.rows) && r.rows.length > 0, `${calc.slug} returned no rows`);
    for (const row of r.rows) {
      assert.ok(typeof row.value === 'string' && !row.value.includes('NaN'), `${calc.slug}: ${row.label} -> ${row.value}`);
    }
  }
});

test('spot-check a few full compute() paths', () => {
  const loan = CALC_BY_SLUG['loan-calculator'].compute({ amount: '20000', rate: '6.5', years: '5' });
  assert.match(loan.rows[0].value, /391\.32/);
  const bmi = CALC_BY_SLUG['bmi-calculator'].compute({ height: '170', weight: '70' });
  assert.match(bmi.rows[0].value, /24\.2/);
  const subnet = CALC_BY_SLUG['subnet-calculator'].compute({ cidr: '192.168.1.10/24' });
  assert.match(subnet.rows[0].value, /192\.168\.1\.0\/24/);
  assert.match(subnet.rows[4].value, /254/);
  const my = CALC_BY_SLUG['malaysia-salary-calculator'].compute({ salary: '6000', bonusMonths: '0' });
  assert.match(my.rows[1].value, /660\.00/); // EPF 11% of 6000
});
