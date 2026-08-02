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

const UPDATED = "2026-08-01";

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

// These pages are generated from one template, which is exactly the shape that
// turns into duplicate content if the template does the talking. So the only
// templated parts are the headings and the input row — `lead`, `formula`,
// `quirk` and `excluded` are written per country and carry the real facts
// (the UK's 60% allowance taper, Japan's year-two residence tax bill, CPF).
// tests/calcs.test.mjs asserts no two of these pages read alike.
type CountryCfg = {
  code: string;
  country: string;
  cur: string;
  defSalary: number;
  year: string;
  engine: (gross: number) => CountryResult;
  socialLabel: string;
  note: string;
  source: { label: string; url: string };
  lead: string;
  formula: string[];
  quirk: { h: string; body: string[] };
  excluded: string[];
  faqs: { q: string; a: string }[];
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
    source: { label: "IRS", url: "https://www.irs.gov/" },
    lead: "Take-home pay in the United States depends on two separate systems that most people mentally merge into one. Federal income tax is progressive: a $15,000 standard deduction comes off first, then the remainder is charged through seven brackets running from 10% to 37%. FICA is flat and separate: 6.2% for Social Security on wages up to the annual wage base, and 1.45% for Medicare on everything, with an extra 0.9% Medicare surtax above $200,000. This calculator applies both for a single filer taking the standard deduction, and shows income tax, FICA, the combined effective rate and monthly take-home. It deliberately stops at the federal layer, because state income tax is the single biggest variable in American pay — zero in Texas or Florida, over 13% at the top in California.",
    formula: [
      "Taxable income = gross − $15,000 standard deduction. Federal tax is charged in slices: 10% on the first $11,925 of taxable income, 12% to $48,475, 22% to $103,350, 24% to $197,300, 32% to $250,525, 35% to $626,350, and 37% above that. FICA runs on gross, not taxable income: Social Security at 6.2% up to the $176,100 wage base, Medicare at 1.45% with no ceiling, plus 0.9% on wages over $200,000.",
      "Worked example on $85,000: taxable income is $70,000. That is $1,192.50 at 10%, $4,386.00 at 12%, and $4,735.50 at 22% — federal income tax of about $10,314. FICA adds $5,270 in Social Security and $1,232.50 in Medicare. Total deductions around $16,817, so net is roughly $68,183, or $5,682 a month.",
      "The effective rate there is about 19.8%, while the top bracket touched is 22%. That gap is the whole point of a progressive system, and it is why quoting your bracket as your tax rate always overstates what you pay.",
    ],
    quirk: {
      h: "Why the Social Security cap matters more than the brackets",
      body: [
        "Social Security stops at the wage base — $176,100 — and does not resume. Above that line your marginal FICA drops from 7.65% to 1.45%, so the first dollar over the cap is taxed noticeably more lightly than the dollar before it.",
        "This is the one genuinely regressive step in the federal system, and it partly offsets the jump into the 32% income tax bracket that happens nearby. Someone going from $170,000 to $190,000 sees a smaller increase in total deductions than the bracket table alone suggests.",
      ],
    },
    excluded: [
      "State and local income tax, which is the largest omission. Nine states levy none; California, Hawaii, New York and New Jersey top 10%. New York City and a handful of other municipalities add a local income tax on top of the state one.",
      "Also excluded: 401(k) and HSA contributions, which reduce taxable income and are usually the biggest lever an employee actually controls; employer-sponsored health insurance premiums, which are typically pre-tax; itemised deductions where they beat the standard deduction; and the filing statuses other than single, which move every bracket threshold.",
    ],
    faqs: [
      {
        q: "Why is state tax not included?",
        a: "State income tax ranges from zero (Texas, Florida, Washington and others) to over 13% (California top rate). Add your state's rate on top of this federal estimate.",
      },
      {
        q: "What is FICA and is it the same as income tax?",
        a: "FICA is Social Security plus Medicare — 7.65% combined for most workers. It is separate from income tax, calculated on gross rather than taxable income, and it has no brackets and no standard deduction. Your employer pays a matching 7.65% that never appears on your payslip.",
      },
      {
        q: "How much is $85,000 a year after tax?",
        a: "Roughly $68,200 federally for a single filer taking the standard deduction — about $5,680 a month. In a no-income-tax state that is close to your real take-home; in California expect to lose another $4,500 or so to state tax.",
      },
      {
        q: "Does a 401(k) contribution reduce this?",
        a: "Traditional 401(k) contributions reduce taxable income, so they lower federal income tax but not FICA. Contributing $10,000 at a 22% marginal rate saves $2,200 in tax while still being your money. Roth contributions do not reduce current-year tax.",
      },
    ],
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
    source: { label: "HMRC", url: "https://www.gov.uk/income-tax-rates" },
    lead: "Take-home pay in the United Kingdom is gross salary less two deductions: Income Tax and National Insurance. Income Tax starts after the £12,570 personal allowance, then runs at 20% to £50,270, 40% to £125,140, and 45% above that. National Insurance is charged separately on the same earnings — 8% between £12,570 and £50,270, then 2% on everything above, which means NI gets cheaper at the margin exactly where Income Tax gets dearer. This calculator applies England, Wales and Northern Ireland rates for a standard tax code, and shows tax, NI, the effective deduction rate and monthly take-home. Scotland sets its own bands and rates and will differ, and student loan repayments are a separate deduction not included here. The most important number on the page is the effective rate rather than your band: almost nobody pays their headline rate on their whole income.",
    formula: [
      "Taxable income = gross − £12,570 personal allowance. Income Tax is then 20% on the first £37,700 of taxable income, 40% on the next slice up to £125,140 of gross, and 45% above. National Insurance is calculated on gross directly: 8% on earnings between £12,570 and £50,270, then 2% on everything over £50,270.",
      "Worked example on £45,000: taxable income is £32,430, all within the basic rate band, so Income Tax is £6,486. National Insurance is 8% of the £32,430 between the thresholds, or £2,594.40. Total deductions £9,080.40, leaving about £35,920 a year — roughly £2,993 a month.",
      "The effective rate is around 20.2% even though the person is a 20% taxpayer, because NI sits on top. Combined marginal rate in the basic band is 28%, and 42% in the higher band — the numbers that actually matter when deciding whether a raise or a pension contribution is worth it.",
    ],
    quirk: {
      h: "The 60% trap between £100,000 and £125,140",
      body: [
        "The personal allowance is withdrawn by £1 for every £2 of income above £100,000. Because that withdrawn allowance was previously untaxed and is now taxed at 40%, the effective marginal rate in this band is 60% — higher than the 45% additional rate that applies above it.",
        "The allowance is fully gone at £125,140. Between those two figures, £1,000 of extra salary nets about £400 after tax and NI. This is why pension salary sacrifice is so heavily used at that income level: contributing enough to bring adjusted income back to £100,000 is effectively a 60% relief, and it also protects tax-free childcare and the 30 free hours, both of which cut off at £100,000 per parent.",
      ],
    },
    excluded: [
      "Scottish Income Tax, which has its own bands and adds intermediate and advanced rates — a Scottish taxpayer on £45,000 pays several hundred pounds more than the figure shown here. National Insurance is UK-wide and unaffected.",
      "Also excluded: student loan repayments (9% above the plan threshold, or 6% for postgraduate loans, and many graduates pay both); workplace pension contributions under auto-enrolment, typically 5% of qualifying earnings; salary sacrifice arrangements; the High Income Child Benefit Charge; and any non-standard tax code, which is common if you have a company car or previously underpaid.",
    ],
    faqs: [
      {
        q: "Why does £100k–£125k feel so heavily taxed?",
        a: "The personal allowance shrinks by £1 for every £2 earned above £100,000, creating an effective 60% marginal rate in that band until the allowance is gone at £125,140.",
      },
      {
        q: "What is the difference between Income Tax and National Insurance?",
        a: "Income Tax funds general government spending and is charged on taxable income after your allowance. National Insurance nominally funds the state pension and contributory benefits, is charged on earnings rather than income, and stops being significant above £50,270 where the rate falls to 2%. Both come off the same payslip, which is why people underestimate their real deduction rate.",
      },
      {
        q: "How much is £45,000 after tax in the UK?",
        a: "About £35,900 a year, or roughly £2,990 a month, on a standard tax code in England, Wales or Northern Ireland. Add a student loan and it drops by around £2,900 a year on Plan 2.",
      },
      {
        q: "Do pension contributions reduce the tax shown here?",
        a: "Yes, and substantially. Contributions made by salary sacrifice reduce both Income Tax and National Insurance, because they cut your gross pay before either is calculated. Contributions from net pay attract tax relief but not NI relief. This calculator assumes no pension contribution.",
      },
    ],
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
    source: { label: "IRAS", url: "https://www.iras.gov.sg/" },
    lead: "Singapore has some of the lowest personal income tax rates in the developed world, and the largest mandatory savings deduction. For a resident employee under 55, CPF takes 20% of ordinary wages up to a S$8,000 monthly ceiling — far more than the income tax most people pay. Income tax itself starts at zero on the first S$20,000 of chargeable income and rises gently through 2%, 3.5%, 7%, 11.5% and beyond, so a resident earning S$72,000 pays only a low four-figure sum. This calculator applies CPF, the S$1,000 earned income relief and resident rates to show tax, CPF, the effective deduction rate and monthly take-home. The employer's 17% CPF contribution is paid on top of your gross and is not deducted here.",
    formula: [
      "CPF employee = 20% of ordinary wages, capped at S$8,000 a month or S$96,000 a year. Chargeable income = gross − CPF − S$1,000 earned income relief. Tax is then charged in slices: nothing on the first S$20,000, 2% to S$30,000, 3.5% to S$40,000, 7% to S$80,000, 11.5% to S$120,000, and upward from there.",
      "Worked example on S$72,000 a year: CPF is 20% of S$72,000 = S$14,400, since the salary is below the ceiling. Chargeable income is 72,000 − 14,400 − 1,000 = S$56,600. Tax is nil on the first S$20,000, S$200 on the next S$10,000, S$350 on the next S$10,000, and 7% on the remaining S$16,600 — about S$1,712 in total.",
      "Total deductions are around S$16,112, giving net pay of roughly S$55,888 or S$4,657 a month. The effective rate looks like 22%, but only 2.4 percentage points of that is actual tax — the rest is money going into your own CPF accounts.",
    ],
    quirk: {
      h: "CPF is not a tax, and it changes how you should read the number",
      body: [
        "CPF is split across three accounts you keep: Ordinary, usable for housing, education and investment; Special, for retirement; and MediSave, for healthcare and approved insurance. The balances earn a floor rate of 2.5% on Ordinary and 4% on Special and MediSave, guaranteed by the government.",
        "This is why Singapore take-home pay looks low next to Hong Kong or the Gulf while household wealth accumulation is high. Comparing a Singapore offer against one elsewhere on take-home alone systematically understates it — add back the 20% employee CPF and the employer's 17%, and the picture changes considerably.",
        "The contribution rates also step down with age. From 55 the employee rate falls, and it keeps falling through the 60, 65 and 70 thresholds. This calculator uses the under-55 rate.",
      ],
    },
    excluded: [
      "The Ordinary Wage ceiling means CPF is capped at S$8,000 a month, so anyone above that contributes on S$8,000 only. Additional Wages such as bonuses attract CPF separately under their own annual ceiling, which this calculator does not model.",
      "Also excluded: the many personal reliefs that reduce chargeable income — spouse, child, parent, grandparent-caregiver, course fees, life insurance and CPF top-ups — as well as the personal income tax rebates announced in some budget years. Non-resident rates are entirely different, taxing employment income at a flat 15% or resident rates, whichever is higher.",
    ],
    faqs: [
      {
        q: "Is CPF really a tax?",
        a: "No — it is forced savings you keep, split across Ordinary, Special and MediSave accounts for housing, retirement and healthcare. That is why Singapore take-home looks low while actual wealth retention is high.",
      },
      {
        q: "How much tax do I pay on S$72,000 in Singapore?",
        a: "Around S$1,700 a year as a tax resident — an effective income tax rate of about 2.4%. CPF takes far more, at S$14,400, but that goes into accounts in your own name rather than to the government.",
      },
      {
        q: "Does my employer's CPF contribution reduce my salary?",
        a: "No. The employer's 17% is paid on top of your gross salary and never appears as a deduction. It does land in your CPF accounts, so your total annual CPF inflow on a S$72,000 salary is around S$26,600 once both sides are counted.",
      },
      {
        q: "What changes at age 55?",
        a: "CPF contribution rates step down at 55, 60, 65 and 70 for both employee and employer, and part of your balance transfers into a Retirement Account. This calculator uses the standard under-55 rate of 20%, so it overstates the deduction for older workers.",
      },
    ],
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
    source: {
      label: "Australian Taxation Office",
      url: "https://www.ato.gov.au/",
    },
    lead: "Australian take-home pay is gross salary less income tax and the Medicare levy. The tax-free threshold covers the first $18,200, after which rates run at 16%, then 30% across a wide band, 37%, and 45% at the top. The Medicare levy adds a flat 2% of taxable income on top for most earners, funding the public health system. Superannuation does not appear as a deduction: employers pay 12% into your super fund on top of your salary, so it raises your total package without lowering the number in your bank account. This calculator applies resident rates and the Medicare levy to show tax, levy, effective rate and monthly take-home. HELP and HECS student loan repayments are a separate deduction and are not included.",
    formula: [
      "Income tax is charged on the whole of taxable income in slices: nothing on the first $18,200, 16% to $45,000, 30% to $135,000, 37% to $190,000, and 45% above. The Medicare levy is a separate flat 2% of taxable income, with a low-income exemption and shading-in range near the bottom of the scale.",
      "Worked example on $95,000: tax is 16% of the $26,800 between $18,200 and $45,000, which is $4,288, plus 30% of the $50,000 between $45,000 and $95,000, which is $15,000 — $19,288 in total. The Medicare levy adds 2% of $95,000, or $1,900.",
      "Total deductions of $21,188 leave about $73,812 a year, roughly $6,151 a month, at an effective rate of 22.3%. Separately, your employer pays $11,400 in superannuation into your fund, so the real cost of employing you is around $106,400.",
    ],
    quirk: {
      h: "Superannuation is on top, not taken out",
      body: [
        "Australian job ads quote salary in two ways and the difference is 12%. A package quoted as '$95,000 plus super' means $95,000 in taxable salary with $11,400 going into your fund separately. A package quoted as '$106,400 including super' means the same total but a lower salary — and therefore lower take-home pay.",
        "Always establish which one an offer uses. It is the most common source of confusion in Australian salary negotiation, and the gap on a six-figure package is worth more than most annual pay rises.",
        "Salary sacrificing extra into super does reduce take-home, because sacrificed amounts come out of gross salary. They are taxed at 15% inside the fund instead of your marginal rate, which is why it is attractive for anyone in the 30% bracket or above.",
      ],
    },
    excluded: [
      "The Medicare levy surcharge, an extra 1% to 1.5% for higher earners without private hospital cover — a genuine cost for singles above $97,000 and families above $194,000, and usually cheaper to avoid by buying basic hospital cover than by paying.",
      "Also excluded: HELP and HECS repayments, which are compulsory above the repayment threshold and scale from 1% to 10% of income; the low income tax offset; salary sacrifice arrangements including novated leases; and the different rates that apply to non-residents, who get no tax-free threshold at all.",
    ],
    faqs: [
      {
        q: "Where is superannuation in this calculation?",
        a: "Employers pay 12% super on top of your salary into your fund — it does not reduce the take-home pay shown here unless you salary-sacrifice extra.",
      },
      {
        q: "How much is $95,000 after tax in Australia?",
        a: "About $73,800 a year, or roughly $6,150 a month, for a resident with no HELP debt and private hospital cover. Your employer additionally pays $11,400 into your super fund.",
      },
      {
        q: "What is the Medicare levy and does everyone pay it?",
        a: "It is a flat 2% of taxable income funding the public health system. Low earners are exempt or pay a reduced amount through a shading-in range. Separately, the Medicare levy surcharge of 1% to 1.5% applies to higher earners who do not hold private hospital cover — that one is avoidable and is not included here.",
      },
      {
        q: "Does a HECS debt change my take-home pay?",
        a: "Yes, significantly. Repayments are compulsory once income passes the threshold and are withheld through PAYG like tax, rising in steps to 10% of income at the top. On $95,000 that is several thousand dollars a year, none of which is reflected in the figures above.",
      },
    ],
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
    source: {
      label: "Income Tax Department, India",
      url: "https://www.incometax.gov.in/",
    },
    lead: "In-hand salary in India depends first on which tax regime you are under. The new regime, now the default, offers lower rates and a ₹75,000 standard deduction but almost no other exemptions — no HRA, no 80C, no home loan interest against salary income. Under it, a §87A rebate means zero tax up to ₹12 lakh of taxable income, after which rates step up from 5% to 30%. This calculator applies the new regime for a salaried filer, showing income tax, effective rate and monthly in-hand pay. It does not deduct EPF, because EPF is calculated on basic salary rather than CTC and Indian salary structures vary enormously in how much of the package is basic — which is also why your in-hand figure rarely matches a naive CTC division.",
    formula: [
      "Taxable income = gross − ₹75,000 standard deduction. Tax is then charged in slices under the new regime, rising from 5% through 10%, 15%, 20% and 25% to 30% at the top. Where taxable income falls at or below ₹12 lakh, the §87A rebate cancels the tax entirely, so the effective liability is nil.",
      "Worked example on ₹15,00,000: taxable income is ₹14,25,000, which is above the rebate threshold, so the full slice calculation applies and tax works out to roughly ₹97,500 before cess. The effective rate is around 6.5% — low, because the first ₹4 lakh is untaxed and the slabs below ₹12 lakh are shallow.",
      "The cliff at ₹12 lakh is the number worth knowing. At ₹12,00,000 of taxable income the rebate takes tax to zero; a little above it, tax becomes payable on the whole computed amount. Marginal relief exists to soften the immediate step, but the region just above the threshold is still the least efficient place on the Indian salary scale to sit.",
    ],
    quirk: {
      h: "CTC is not salary, and in-hand is neither",
      body: [
        "Indian offers are quoted as Cost to Company, which bundles things you never see: the employer's EPF contribution, gratuity provision, insurance premiums, and often a performance bonus that is not guaranteed. Dividing CTC by twelve overstates monthly in-hand by a wide margin — commonly 15% to 25%.",
        "The structure matters as much as the number. A package with a high basic component means more EPF (12% of basic from each side), which lowers in-hand but raises retirement savings. A package loaded with allowances does the opposite. Two offers with identical CTC can differ by thousands of rupees a month in what actually reaches your account.",
        "This calculator works from gross salary rather than CTC deliberately, because gross is the only figure that maps cleanly onto tax.",
      ],
    },
    excluded: [
      "EPF, which for most salaried employees is 12% of basic salary from the employee side, matched by the employer. Because basic is typically 40% to 50% of gross and varies by employer, deducting it generically would be a guess rather than a calculation.",
      "Also excluded: professional tax, levied by some states at a few hundred rupees a month; the 4% health and education cess on tax payable; surcharge on incomes above ₹50 lakh; and everything specific to the old regime — HRA exemption, 80C investments, 80D medical insurance, and home loan interest — which is why anyone with a large 80C portfolio should compare both regimes before choosing.",
    ],
    faqs: [
      {
        q: "Old regime or new regime — which is better?",
        a: "The new regime has lower rates but almost no deductions; the old regime suits people with large 80C investments, HRA and home-loan interest. Above ₹15–20L with few deductions, the new regime usually wins.",
      },
      {
        q: "Why is my in-hand salary lower than CTC divided by 12?",
        a: "CTC includes the employer's EPF contribution, gratuity provision, insurance and often an unguaranteed bonus — none of which reach your bank account monthly. The gap is commonly 15% to 25%. Ask for the salary structure breakup, not just the CTC figure.",
      },
      {
        q: "Do I pay tax on ₹12 lakh under the new regime?",
        a: "No. The §87A rebate takes tax to zero at or below ₹12 lakh of taxable income. With the ₹75,000 standard deduction, that corresponds to a gross salary of about ₹12.75 lakh. Above it, tax becomes payable on the computed amount, with marginal relief limiting the immediate jump.",
      },
      {
        q: "Is EPF deducted in this calculation?",
        a: "No. EPF is 12% of basic salary, and basic is a component of your package that differs by employer — anywhere from 40% to 50% of gross is typical. Deducting a fixed percentage of gross would be wrong for almost everyone, so this calculator leaves it out and shows tax only.",
      },
    ],
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
    source: {
      label: "Bundesministerium der Finanzen",
      url: "https://www.bundesfinanzministerium.de/",
    },
    lead: "Brutto-netto in Germany means separating two large deductions from your gross salary: Lohnsteuer, the wage tax, and Sozialversicherung, the social insurance contributions. Social insurance is the bigger surprise for newcomers — around 20% of gross from the employee, split across pension, health, long-term care and unemployment insurance, each with its own contribution ceiling. Income tax begins above the Grundfreibetrag, the tax-free basic allowance, and then rises on a continuous curve rather than in flat steps, from 14% up to 45%. This calculator assumes tax class I, a single person with no church tax and statutory health insurance at the average supplementary rate, and shows tax, social insurance, the effective deduction rate and monthly net pay. Married employees on tax class III see a considerably higher monthly net for the same gross, which is a withholding effect rather than a real tax saving.",
    formula: [
      "Social insurance comes off first for the purposes of understanding your payslip, at roughly 20% of gross up to the contribution ceilings — pension and unemployment insurance share one ceiling, health and long-term care insurance a lower one. Income tax is then calculated on income above the Grundfreibetrag using Germany's continuous formula, where the marginal rate climbs smoothly from 14% at the bottom of the first zone to 42% at the top of the third, with 45% applying at the highest incomes.",
      "Worked example on €60,000: social insurance takes roughly €12,000. Income tax on the remainder, after the basic allowance, lands in the region of €10,000. Net is therefore around €38,000 a year, or roughly €3,170 a month.",
      "Germany has no brackets in the usual sense. Between the allowance and the top of the second zone, the marginal rate rises with every euro rather than stepping at fixed thresholds — which is why German net-pay tables look smooth where British or American ones have visible jumps.",
    ],
    quirk: {
      h: "Tax class changes your monthly net more than your annual tax",
      body: [
        "Germany assigns every employee a Steuerklasse, from I to VI, and it determines how much wage tax is withheld each month. Class I is single. Class III gives a married sole or main earner a much larger monthly net, while their spouse on class V takes a much smaller one. Classes IV and IV with factor split the difference more evenly.",
        "The important point is that tax class affects withholding, not your final liability. Annual assessment settles the real number, so a couple on III/V is not paying less tax overall — they are front-loading the cash flow to one partner. This calculator uses class I throughout.",
        "Church tax is the other common surprise: 8% or 9% of your income tax, depending on the federal state, automatically withheld if you are registered as a member of a taxed religious body. It is excluded here.",
      ],
    },
    excluded: [
      "Church tax, at 8% in Bavaria and Baden-Württemberg and 9% elsewhere, calculated on your income tax rather than your income. On a €10,000 tax bill that is €800 to €900 a year.",
      "Also excluded: the solidarity surcharge, which now applies only to high earners; private health insurance, which many higher earners and self-employed people choose instead of the statutory scheme at very different cost; child allowances and the Kinderfreibetrag; tax classes other than I; and any Werbungskosten claimed above the standard employee lump sum.",
    ],
    faqs: [
      {
        q: "What is the Grundfreibetrag?",
        a: "The tax-free basic allowance — €12,096 in 2025. Income tax applies only above it, with rates rising progressively from 14% to 45%.",
      },
      {
        q: "Why is my German net salary so much lower than gross?",
        a: "Social insurance is the reason, not income tax. Pension, health, long-term care and unemployment contributions take around 20% of gross from the employee, and your employer pays a broadly matching amount on top. That buys statutory healthcare and a state pension, but it makes the brutto-netto gap larger than in most English-speaking countries.",
      },
      {
        q: "Does my tax class change how much tax I pay?",
        a: "It changes how much is withheld each month, not what you ultimately owe. The annual assessment reconciles the difference. A married couple on classes III and V sees a very uneven monthly split, but their combined annual liability is the same as on IV and IV.",
      },
      {
        q: "How much is €60,000 net in Germany?",
        a: "Roughly €38,000 a year, or about €3,170 a month, for a single person in tax class I with statutory health insurance and no church tax. Adding church tax would reduce that by around €70 a month.",
      },
    ],
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
    source: {
      label: "Canada Revenue Agency",
      url: "https://www.canada.ca/en/revenue-agency.html",
    },
    lead: "Canadian take-home pay is reduced by three things: federal income tax, provincial income tax, and payroll contributions to CPP and EI. This calculator covers the federal layer plus CPP and EI, and deliberately stops short of provincial tax, because provincial rates differ so much that averaging them would mislead — Alberta's top combined rate is far below Quebec's. Federal tax runs from 15% to 33% across five brackets, reduced by the basic personal amount credit. CPP is charged between the basic exemption and the year's maximum pensionable earnings, with a second tier above that, and EI applies up to its own ceiling. The result shows federal tax, CPP plus EI, the effective rate and monthly take-home, which you should read as a floor rather than a final figure until you have added your own province's schedule on top.",
    formula: [
      "Federal tax is charged in slices across five brackets from 15% to 33%, then reduced by the basic personal amount credit, which is calculated as the amount times the lowest rate rather than deducted from income. CPP is 5.95% of earnings between the $3,500 basic exemption and the year's maximum pensionable earnings, plus a second-tier 4% on earnings between that ceiling and the higher additional ceiling. EI is 1.64% of insurable earnings up to its own maximum.",
      "Worked example on C$80,000: federal tax before credits works out at roughly C$12,300, and the basic personal amount credit reduces it by about C$2,420, giving federal tax near C$9,900. CPP is about C$4,030 and EI about C$1,077.",
      "Total federal-level deductions of roughly C$15,000 leave about C$65,000, or C$5,400 a month — before provincial tax, which on C$80,000 typically adds another C$4,000 to C$6,000 depending on where you live.",
    ],
    quirk: {
      h: "Province changes the answer more than anything else",
      body: [
        "Provincial income tax is a separate schedule with its own brackets and its own basic personal amount, stacked on top of the federal one. Combined top marginal rates range from around 44% in Alberta to over 53% in Quebec and Newfoundland — a spread wide enough to outweigh most salary differences between provinces.",
        "Quebec is a further special case: it collects its own provincial tax directly, runs the Quebec Pension Plan instead of CPP at a higher contribution rate, and levies a separate parental insurance premium. A Quebec payslip does not resemble an Ontario one.",
        "The practical consequence is that a Canadian salary comparison is meaningless without the province attached. Treat the figure here as the common federal floor and add your provincial layer on top.",
      ],
    },
    excluded: [
      "Provincial and territorial income tax, which is the largest omission and applies everywhere except through different schedules in each jurisdiction. On C$80,000 it commonly adds C$4,000 to C$6,000, and considerably more in Quebec.",
      "Also excluded: RRSP contributions, which reduce taxable income and are the main lever most employees control; employer pension plan contributions; union dues; the Canada Employment Amount and other non-refundable credits beyond the basic personal amount; and Quebec's QPP and QPIP, which replace CPP and add a premium respectively.",
    ],
    faqs: [
      {
        q: "Why is provincial tax excluded?",
        a: "Each province sets its own brackets — Alberta and Ontario differ hugely from Quebec. This shows the federal layer that applies everywhere; add your province's tax for the full picture.",
      },
      {
        q: "What are CPP and EI?",
        a: "CPP is the Canada Pension Plan, a contributory public pension you draw from in retirement — so like EPF or CPF, it is partly savings rather than pure tax. EI is Employment Insurance, funding unemployment, sickness and parental benefits. Both are capped, so their share of your pay falls as your salary rises.",
      },
      {
        q: "How much is C$80,000 after tax in Canada?",
        a: "About C$65,000 at the federal level including CPP and EI, or roughly C$5,400 a month. Subtract another C$4,000 to C$6,000 for provincial tax depending on your province — Alberta at the low end, Quebec at the high end.",
      },
      {
        q: "Do RRSP contributions reduce this?",
        a: "Yes. RRSP contributions are deducted from taxable income, so they reduce both federal and provincial tax at your marginal rate, though not CPP or EI. At a 30% combined marginal rate, a C$10,000 contribution saves C$3,000 in tax while remaining your money. This calculator assumes no RRSP contribution.",
      },
    ],
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
    source: {
      label: "National Tax Agency, Japan",
      url: "https://www.nta.go.jp/english/",
    },
    lead: "Japanese take-home pay is gross salary less three deductions: national income tax, residence tax, and social insurance. Social insurance is the largest at roughly 14.7% of salary, covering health insurance, pension, and employment insurance, and it is matched by your employer. National income tax is progressive from 5% to 45%, applied after an employment income deduction that scales with salary and a basic personal exemption, with a small reconstruction surtax on top. Residence tax is a flat 10% levied by your city and prefecture, and it is charged on last year's income rather than this year's. This calculator applies all three to show total tax, social insurance, the effective rate and monthly take-home for a single employee. It shows the steady state, in which a full year of residence tax is being deducted — not the first year in Japan, when none is.",
    formula: [
      "The employment income deduction comes off first and scales with salary — a tapering allowance that replaces itemised expenses for salaried workers. Social insurance at about 14.65% is deducted next, then a basic exemption. National income tax is charged on what remains through seven brackets from 5% to 45%, multiplied by 1.021 for the reconstruction surtax. Residence tax is a separate flat 10% on a slightly different base.",
      "Worked example on ¥6,000,000: the employment income deduction is ¥1,640,000. Social insurance takes roughly ¥879,000. After the basic exemption, national income tax lands near ¥200,000 including the surtax, and residence tax around ¥305,000.",
      "Total deductions of roughly ¥1,384,000 leave about ¥4,616,000 a year, or ¥385,000 a month. The effective rate is around 23%, of which more than half is social insurance rather than tax.",
    ],
    quirk: {
      h: "Residence tax arrives a year late — and hurts most in year two",
      body: [
        "Residence tax is assessed on your previous calendar year's income and billed from June of the following year. Someone who arrives in Japan in April pays no residence tax at all in their first year, then starts paying it in June of the second — a step down in take-home of roughly ¥25,000 a month on a ¥6,000,000 salary, with no change in gross.",
        "The reverse catches people leaving. If you quit or leave Japan partway through a year, residence tax on the income you already earned is still due, and employers commonly deduct the remaining balance in a lump sum from your final payslip.",
        "Both effects are invisible in any simple salary calculation, including this one, which shows the steady state where a full year of residence tax applies.",
      ],
    },
    excluded: [
      "The many personal deductions that reduce taxable income: spouse and dependant deductions, life and earthquake insurance premiums, medical expenses above the threshold, and the hometown tax (furusato nozei) scheme, which lets you redirect part of your residence tax to another municipality in exchange for goods.",
      "Also excluded: the exact social insurance rate, which varies by prefecture and by health insurance society and is set from a standard monthly remuneration grade rather than your literal salary; bonuses, which carry their own social insurance calculation; and the year-end adjustment that most employers run in December, which reconciles withholding against actual liability.",
    ],
    faqs: [
      {
        q: "What is residence tax?",
        a: "A flat ~10% local tax on the previous year's income, billed from June. New arrivals pay none in year one — then it starts, which surprises many expats.",
      },
      {
        q: "Why did my take-home pay drop in my second year in Japan?",
        a: "Residence tax started. It is assessed on the prior calendar year, so your first year in Japan generates a bill that only begins to be deducted from June of your second year. Gross pay is unchanged; roughly 10% of last year's income is now coming out monthly.",
      },
      {
        q: "How much is ¥6,000,000 after tax in Japan?",
        a: "Around ¥4,600,000 a year, or roughly ¥385,000 a month, for a single employee. Social insurance accounts for more of the deduction than income tax and residence tax combined.",
      },
      {
        q: "Is the employment income deduction the same as a standard deduction?",
        a: "It serves a similar purpose but works differently. Rather than a flat amount, it scales with salary — generous at low incomes and tapering to a fixed ceiling at high ones. It exists because salaried workers cannot itemise work expenses the way the self-employed can.",
      },
    ],
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
  intro: cfg.lead,
  updated: UPDATED,
  source: cfg.source,
  sections: [
    { h: "How this is calculated", body: cfg.formula },
    cfg.quirk,
    { h: "What this estimate leaves out", body: cfg.excluded },
  ],
  steps: [
    {
      name: "Enter your annual gross salary",
      text: `Use the headline figure from your contract or offer letter, in ${cfg.cur}, before any deductions.`,
    },
    {
      name: "Read the net and monthly rows",
      text: "Net salary is what remains for the year; take-home per month is that divided by twelve.",
    },
    {
      name: "Check the effective rate",
      text: `Income tax and ${cfg.socialLabel} as a share of gross. This is the number to compare across countries — not the top bracket rate, which almost nobody actually pays on their whole income.`,
    },
  ],
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
    ...cfg.faqs,
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
    "Converting between hourly, weekly, monthly and annual pay sounds like simple multiplication, and it is — but the two numbers that make it accurate are the ones people guess at. Hours per week is rarely exactly 40, and working weeks per year is almost never 52 for anyone who takes unpaid leave. This calculator converts in any direction from any pay period, using the schedule you actually work rather than an assumed one. Enter what you know, pick the period it applies to, set your real hours and weeks, and it produces annual, monthly, weekly, daily and hourly equivalents together. It is a gross-pay conversion — no tax, no deductions — which makes it the right tool for comparing a contract rate against a salaried offer, or for working out what an hourly job is really worth over a year.",
  updated: UPDATED,
  sections: [
    {
      h: "How this is calculated",
      body: [
        "Everything routes through an annual figure. From an hourly rate, annual = hourly × hours per week × working weeks per year. From a weekly rate, annual = weekly × working weeks. From a monthly rate, annual = monthly × 12. From an annual figure it passes straight through. Every other output is then derived from that annual number: monthly is annual ÷ 12, weekly is annual ÷ working weeks, daily assumes a five-day week, and hourly is annual ÷ (hours × weeks).",
        "Worked example: $25 an hour at 40 hours a week for 52 weeks is $52,000 a year, $4,333 a month, $1,000 a week and $200 a day. Drop to 48 working weeks — four weeks of unpaid leave — and the annual falls to $48,000 while the hourly rate is unchanged. That $4,000 gap is what an unpaid holiday actually costs.",
        "Monthly is always annual ÷ 12, never weekly × 4. A month averages about 4.33 weeks, so multiplying weekly pay by four understates monthly income by roughly 8% — one of the most common arithmetic errors in personal budgeting.",
      ],
    },
    {
      h: "Why working weeks per year is the field that matters",
      body: [
        "For a salaried employee with paid holiday, 52 is correct: you are paid across the whole year regardless of when you take leave. For a contractor, a freelancer, or anyone on an hourly rate without paid time off, it is not — every week you do not work is a week you are not paid.",
        "A contractor taking four weeks off and allowing a further two for public holidays and gaps between engagements is working 46 weeks, not 52. That is an 11.5% difference in annual income from the same hourly rate, and it is the single biggest reason contract rates need to exceed salaried equivalents before they are genuinely comparable.",
      ],
    },
    {
      h: "Comparing a contract rate against a salary",
      body: [
        "Converting an hourly rate to an annual figure is only the first step. A salaried role usually carries paid leave, sick pay, employer pension or retirement contributions, and in some countries employer-paid health cover — none of which a raw hourly rate includes.",
        "A workable rule of thumb is to convert the contract rate using realistic working weeks, then compare against the salary plus its employer-side costs. If the contract figure does not clear the salary by a meaningful margin, the extra flexibility is being paid for out of your own pocket.",
      ],
    },
  ],
  steps: [
    {
      name: "Enter the amount you know",
      text: "Any pay figure you already have — an hourly rate, a monthly salary, an annual package.",
    },
    {
      name: "Select its period",
      text: "Tell the calculator whether that amount is per hour, week, month or year. Everything else is derived from it.",
    },
    {
      name: "Set your real schedule",
      text: "Hours per week and working weeks per year. Use 52 weeks if you are salaried with paid leave; subtract your unpaid weeks if you are not.",
    },
  ],
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
    {
      q: "Why is monthly pay not weekly pay times four?",
      a: "Because a month is about 4.33 weeks, not four. Multiplying weekly pay by four understates monthly income by roughly 8%. Always divide the annual figure by twelve instead — which is what this calculator does.",
    },
    {
      q: "How many working weeks should a contractor use?",
      a: "Take 52, subtract the weeks of holiday you intend to take, and subtract a further one to two weeks for public holidays and gaps between contracts. Most full-time contractors land between 44 and 48. Using 52 overstates annual income by 8% to 15%.",
    },
    {
      q: "Does this account for tax?",
      a: "No — every figure here is gross. That is deliberate, because tax depends on your country and circumstances. Use the country salary calculators for take-home pay after tax and social contributions.",
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
