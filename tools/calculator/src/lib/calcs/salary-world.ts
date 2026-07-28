// Salary-after-tax estimators for 8 countries. Single filer, standard
// deductions only, employment income — labelled estimates with rate year.
import {
  type Calc,
  num,
  money,
  fmt,
  pct,
  taxFromBrackets,
} from "../calc-types.ts";

export type CountryResult = { tax: number; social: number; net: number };

const B = (pairs: [number, number][]) => pairs;

// --- per-country engines (exported for tests) ---

export function usTax(gross: number): CountryResult {
  const taxable = Math.max(0, gross - 15000); // 2025 standard deduction
  const tax = taxFromBrackets(
    taxable,
    B([
      [11925, 0.1],
      [48475, 0.12],
      [103350, 0.22],
      [197300, 0.24],
      [250525, 0.32],
      [626350, 0.35],
      [Infinity, 0.37],
    ]),
  );
  const ss = Math.min(gross, 176100) * 0.062;
  const medicare = gross * 0.0145 + Math.max(0, gross - 200000) * 0.009;
  const social = ss + medicare;
  return { tax, social, net: gross - tax - social };
}

export function ukTax(gross: number): CountryResult {
  const pa = Math.max(0, 12570 - Math.max(0, gross - 100000) / 2);
  const taxable = Math.max(0, gross - pa);
  // bands measured above the (tapered) allowance
  const tax = taxFromBrackets(
    taxable,
    B([
      [37700, 0.2],
      [125140 - 12570, 0.4],
      [Infinity, 0.45],
    ]),
  );
  const ni =
    Math.max(0, Math.min(gross, 50270) - 12570) * 0.08 +
    Math.max(0, gross - 50270) * 0.02;
  return { tax, social: ni, net: gross - tax - ni };
}

export function sgTax(gross: number): CountryResult {
  // CPF employee 20% (age ≤55), ordinary wage ceiling S$8,000/month (2026).
  const cpf = Math.min(gross, 96000) * 0.2;
  const chargeable = Math.max(0, gross - cpf - 1000); // earned income relief
  const tax = taxFromBrackets(
    chargeable,
    B([
      [20000, 0],
      [30000, 0.02],
      [40000, 0.035],
      [80000, 0.07],
      [120000, 0.115],
      [160000, 0.15],
      [200000, 0.18],
      [240000, 0.19],
      [280000, 0.195],
      [320000, 0.2],
      [500000, 0.22],
      [1000000, 0.23],
      [Infinity, 0.24],
    ]),
  );
  return { tax, social: cpf, net: gross - tax - cpf };
}

export function auTax(gross: number): CountryResult {
  const tax = taxFromBrackets(
    gross,
    B([
      [18200, 0],
      [45000, 0.16],
      [135000, 0.3],
      [190000, 0.37],
      [Infinity, 0.45],
    ]),
  );
  const medicare = gross > 27222 ? gross * 0.02 : 0;
  return { tax: tax + medicare, social: 0, net: gross - tax - medicare };
}

export function inTax(gross: number): CountryResult {
  // New regime FY2025-26, standard deduction ₹75,000, §87A rebate to ₹12L.
  const taxable = Math.max(0, gross - 75000);
  let tax = taxFromBrackets(
    taxable,
    B([
      [400000, 0],
      [800000, 0.05],
      [1200000, 0.1],
      [1600000, 0.15],
      [2000000, 0.2],
      [2400000, 0.25],
      [Infinity, 0.3],
    ]),
  );
  if (taxable <= 1200000) tax = 0; // §87A rebate
  tax *= 1.04; // health & education cess
  return { tax, social: 0, net: gross - tax };
}

export function deTax(gross: number): CountryResult {
  // Employee social insurance 2025 (approx): pension+unemployment 10.6% to
  // €96,600; health+care ~10.35% to €66,150.
  const social =
    Math.min(gross, 96600) * 0.106 + Math.min(gross, 66150) * 0.1035;
  const zvE = Math.max(0, gross - social - 1230); // Arbeitnehmer-Pauschbetrag
  let tax: number;
  if (zvE <= 12096) tax = 0;
  else if (zvE <= 17443) {
    const y = (zvE - 12096) / 10000;
    tax = (932.3 * y + 1400) * y;
  } else if (zvE <= 68480) {
    const z = (zvE - 17443) / 10000;
    tax = (176.64 * z + 2397) * z + 1015.13;
  } else if (zvE <= 277825) {
    tax = 0.42 * zvE - 10911.92;
  } else {
    tax = 0.45 * zvE - 19246.67;
  }
  return { tax, social, net: gross - tax - social };
}

export function caTax(gross: number): CountryResult {
  // Federal only (add your province). BPA credit 16,129 @ 15%.
  let tax = taxFromBrackets(
    gross,
    B([
      [57375, 0.15],
      [114750, 0.205],
      [177882, 0.26],
      [253414, 0.29],
      [Infinity, 0.33],
    ]),
  );
  tax = Math.max(0, tax - 16129 * 0.15);
  const cpp =
    Math.max(0, Math.min(gross, 71300) - 3500) * 0.0595 +
    Math.max(0, Math.min(gross, 81200) - 71300) * 0.04;
  const ei = Math.min(gross, 65700) * 0.0164;
  const social = cpp + ei;
  return { tax, social, net: gross - tax - social };
}

export function jpTax(gross: number): CountryResult {
  const empDed =
    gross <= 1625000
      ? 550000
      : gross <= 1800000
        ? gross * 0.4 - 100000
        : gross <= 3600000
          ? gross * 0.3 + 80000
          : gross <= 6600000
            ? gross * 0.2 + 440000
            : gross <= 8500000
              ? gross * 0.1 + 1100000
              : 1950000;
  const social = Math.min(gross, 10400000) * 0.1465;
  const taxableNat = Math.max(0, gross - empDed - social - 480000);
  const national =
    taxFromBrackets(
      taxableNat,
      B([
        [1950000, 0.05],
        [3300000, 0.1],
        [6950000, 0.2],
        [9000000, 0.23],
        [18000000, 0.33],
        [40000000, 0.4],
        [Infinity, 0.45],
      ]),
    ) * 1.021; // reconstruction surtax
  const residence = Math.max(0, gross - empDed - social - 430000) * 0.1;
  return {
    tax: national + residence,
    social,
    net: gross - national - residence - social,
  };
}

type CountryCfg = {
  code: string;
  country: string;
  cur: string;
  defSalary: number;
  year: string;
  engine: (gross: number) => CountryResult;
  socialLabel: string;
  note: string;
  faqExtra: { q: string; a: string };
};

export const COUNTRIES: CountryCfg[] = [
  {
    code: "us",
    country: "United States",
    cur: "$",
    defSalary: 85000,
    year: "2025",
    engine: usTax,
    socialLabel: "Social Security + Medicare",
    note: "Federal tax only (single filer, standard deduction) — state and local income taxes vary from 0% (TX, FL, WA…) to 13%+ (CA) and are not included.",
    faqExtra: {
      q: "Why is state tax not included?",
      a: "State income tax ranges from zero (Texas, Florida, Washington and others) to over 13% (California top rate). Add your state’s rate on top of this federal estimate.",
    },
  },
  {
    code: "uk",
    country: "United Kingdom",
    cur: "£",
    defSalary: 45000,
    year: "2025/26",
    engine: ukTax,
    socialLabel: "National Insurance",
    note: "England/Wales/NI rates (Scotland differs). Personal allowance tapers away above £100,000. Student loan repayments not included.",
    faqExtra: {
      q: "Why does £100k–£125k feel so heavily taxed?",
      a: "The personal allowance shrinks by £1 for every £2 earned above £100,000, creating an effective 60% marginal rate in that band until the allowance is gone at £125,140.",
    },
  },
  {
    code: "singapore",
    country: "Singapore",
    cur: "S$",
    defSalary: 72000,
    year: "YA2026",
    engine: sgTax,
    socialLabel: "CPF (employee 20%)",
    note: "Resident rates, employee under 55, CPF on ordinary wages up to S$8,000/month. Employer adds 17% CPF on top of gross (not deducted here).",
    faqExtra: {
      q: "Is CPF really a tax?",
      a: "No — it is forced savings you keep, split across Ordinary, Special and MediSave accounts for housing, retirement and healthcare. That is why Singapore take-home looks low while actual wealth retention is high.",
    },
  },
  {
    code: "australia",
    country: "Australia",
    cur: "A$",
    defSalary: 95000,
    year: "2025-26",
    engine: auTax,
    socialLabel: "Medicare levy",
    note: "Includes the 2% Medicare levy; excludes the Medicare levy surcharge and HELP/HECS repayments. Superannuation (12%) is paid by employers on top.",
    faqExtra: {
      q: "Where is superannuation in this calculation?",
      a: "Employers pay 12% super on top of your salary into your fund — it does not reduce the take-home pay shown here unless you salary-sacrifice extra.",
    },
  },
  {
    code: "india",
    country: "India",
    cur: "₹",
    defSalary: 1500000,
    year: "FY2025-26",
    engine: inTax,
    socialLabel: "Social contributions",
    note: "New tax regime with ₹75,000 standard deduction and §87A rebate (zero tax up to ₹12L taxable). EPF (12% of basic) varies by salary structure and is not deducted here.",
    faqExtra: {
      q: "Old regime or new regime — which is better?",
      a: "The new regime has lower rates but almost no deductions; the old regime suits people with large 80C investments, HRA and home-loan interest. Above ₹15–20L with few deductions, the new regime usually wins.",
    },
  },
  {
    code: "germany",
    country: "Germany",
    cur: "€",
    defSalary: 60000,
    year: "2025",
    engine: deTax,
    socialLabel: "Social insurance",
    note: "Tax class I (single), no church tax, statutory health insurance with average supplementary rate. Social insurance ≈ 20% of gross up to the contribution ceilings.",
    faqExtra: {
      q: "What is the Grundfreibetrag?",
      a: "The tax-free basic allowance — €12,096 in 2025. Income tax applies only above it, with rates rising progressively from 14% to 45%.",
    },
  },
  {
    code: "canada",
    country: "Canada",
    cur: "C$",
    defSalary: 80000,
    year: "2025",
    engine: caTax,
    socialLabel: "CPP + EI",
    note: "Federal tax only, with the basic personal amount credit. Provincial tax (from ~4% to 25.75% top rates) must be added for your province.",
    faqExtra: {
      q: "Why is provincial tax excluded?",
      a: "Each province sets its own brackets — Alberta and Ontario differ hugely from Quebec. This shows the federal layer that applies everywhere; add your province’s tax for the full picture.",
    },
  },
  {
    code: "japan",
    country: "Japan",
    cur: "¥",
    defSalary: 6000000,
    year: "2025",
    engine: jpTax,
    socialLabel: "Social insurance",
    note: "Includes national income tax (with reconstruction surtax), ~10% residence tax, and ~14.7% social insurance. Employment income deduction applied automatically.",
    faqExtra: {
      q: "What is residence tax?",
      a: "A flat ~10% local tax on the previous year’s income, billed from June. New arrivals pay none in year one — then it starts, which surprises many expats.",
    },
  },
];

const cCalc = (cfg: CountryCfg): Calc => ({
  slug: `${cfg.code}-salary-tax-calculator`
    .replace("us-", "us-")
    .replace(" ", "-"),
  name: `${cfg.country} Salary Calculator`,
  category: "Salary & Tax",
  title: `${cfg.country} Salary After Tax Calculator ${cfg.year}`,
  desc: `Calculate take-home pay in ${cfg.country} for ${cfg.year}: income tax, ${cfg.socialLabel} and net salary from your gross pay.`,
  intro: `Estimate your net salary in ${cfg.country}. ${cfg.note}`,
  inputs: [
    {
      key: "salary",
      label: `Annual gross salary (${cfg.cur})`,
      def: cfg.defSalary,
      half: true,
    },
  ],
  faq: [
    {
      q: `How much tax do I pay in ${cfg.country}?`,
      a: `Enter your gross salary above — the result shows income tax, ${cfg.socialLabel}, the effective rate and monthly take-home for ${cfg.year}. ${cfg.note}`,
    },
    cfg.faqExtra,
  ],
  compute(v) {
    const gross = num(v.salary);
    const r = cfg.engine(gross);
    return {
      rows: [
        {
          label: "Net salary / year",
          value: money(r.net, cfg.cur),
          strong: true,
        },
        { label: "Take-home / month", value: money(r.net / 12, cfg.cur) },
        { label: "Income tax", value: `− ${money(r.tax, cfg.cur)}` },
        { label: cfg.socialLabel, value: `− ${money(r.social, cfg.cur)}` },
        {
          label: "Effective deduction rate",
          value: pct(gross > 0 ? ((r.tax + r.social) / gross) * 100 : 0),
        },
      ],
      note: `${cfg.year} rates. ${cfg.note} Estimates only — not tax advice.`,
    };
  },
});

const hourly: Calc = {
  slug: "salary-calculator",
  name: "Salary Calculator (Hourly ↔ Annual)",
  category: "Salary & Tax",
  title: "Salary Calculator — Convert Hourly, Monthly & Annual Pay",
  desc: "Convert an hourly wage to annual, monthly, weekly and daily salary — or any of them back to hourly — based on your work schedule.",
  intro:
    "Convert between pay periods using your real hours per week and weeks per year.",
  inputs: [
    { key: "amount", label: "Pay amount", def: 25, step: 0.01, half: true },
    {
      key: "per",
      label: "Per",
      type: "select",
      def: "hour",
      options: [
        ["hour", "Hour"],
        ["week", "Week"],
        ["month", "Month"],
        ["year", "Year"],
      ],
      half: true,
    },
    { key: "hours", label: "Hours per week", def: 40, half: true },
    { key: "weeks", label: "Working weeks per year", def: 52, half: true },
  ],
  faq: [
    {
      q: "How do I convert hourly pay to annual salary?",
      a: "Hourly × hours per week × weeks worked per year. $25/hour at 40 h/week for 52 weeks = $52,000. Use 50 weeks if you take two unpaid weeks off.",
    },
  ],
  compute(v) {
    const hours = num(v.hours, 40);
    const weeks = num(v.weeks, 52);
    const amt = num(v.amount);
    const annual =
      v.per === "year"
        ? amt
        : v.per === "month"
          ? amt * 12
          : v.per === "week"
            ? amt * weeks
            : amt * hours * weeks;
    const hourlyRate = hours * weeks > 0 ? annual / (hours * weeks) : 0;
    return {
      rows: [
        { label: "Annual", value: money(annual), strong: true },
        { label: "Monthly", value: money(annual / 12) },
        { label: "Weekly", value: money(annual / weeks) },
        { label: "Daily (5-day week)", value: money(annual / weeks / 5) },
        { label: "Hourly", value: money(hourlyRate) },
      ],
    };
  },
};

export const SALARY_WORLD: Calc[] = [hourly, ...COUNTRIES.map(cCalc)];
