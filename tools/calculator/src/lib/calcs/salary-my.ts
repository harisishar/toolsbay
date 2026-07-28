// Malaysia statutory contributions + PCB. Rates: YA2025 tax brackets,
// EPF/SOCSO/EIS rates current as of 2025/2026 — each page states this.
import {
  type Calc,
  num,
  money,
  fmt,
  pct,
  taxFromBrackets,
} from "../calc-types.ts";

const c = (x: Calc) => x;
const RM = (x: number) => money(x, "RM ");

// --- statutory formulas (exported for tests) ---

export function epfParts(monthly: number, employeeRate = 0.11) {
  const employee = monthly * employeeRate;
  const employer = monthly * (monthly <= 5000 ? 0.13 : 0.12);
  return { employee, employer };
}

// SOCSO category 1 approximated by rate on capped wage (ceiling RM6,000).
export function socsoParts(monthly: number) {
  const capped = Math.min(monthly, 6000);
  return { employee: capped * 0.005, employer: capped * 0.0175 };
}

export function eisParts(monthly: number) {
  const capped = Math.min(monthly, 6000);
  return { employee: capped * 0.002, employer: capped * 0.002 };
}

// YA2025 resident brackets (chargeable income).
const MY_BRACKETS: [number, number][] = [
  [5000, 0],
  [20000, 0.01],
  [35000, 0.03],
  [50000, 0.06],
  [70000, 0.11],
  [100000, 0.19],
  [400000, 0.25],
  [600000, 0.26],
  [2000000, 0.28],
  [Infinity, 0.3],
];

// Simplified annual PCB: single resident, no dependents.
// Reliefs: individual 9,000; EPF capped 4,000; SOCSO+EIS capped 350.
export function myAnnualTax(
  annualGross: number,
  annualEpfEmployee: number,
  annualSocsoEis: number,
) {
  const chargeable = Math.max(
    0,
    annualGross -
      9000 -
      Math.min(annualEpfEmployee, 4000) -
      Math.min(annualSocsoEis, 350),
  );
  let tax = taxFromBrackets(chargeable, MY_BRACKETS);
  if (chargeable <= 35000) tax = Math.max(0, tax - 400); // rebate
  return { chargeable, tax };
}

const RATE_NOTE =
  "Rates: EPF 11% employee / 12–13% employer; SOCSO & EIS on wages capped at RM6,000 (rate approximation of the official table, within sen); PCB uses YA2025 resident brackets assuming single status with standard reliefs (individual RM9,000, EPF max RM4,000, SOCSO+EIS max RM350). Estimates only — verify with LHDN/KWSP for payroll.";

export const SALARY_MY: Calc[] = [
  c({
    slug: "kwsp-epf-calculator",
    name: "KWSP EPF Calculator (Malaysia)",
    category: "Salary & Tax",
    title: "KWSP EPF Calculator — Employee & Employer Contribution 2025",
    desc: "Calculate monthly KWSP/EPF contributions in Malaysia: 11% employee, 12–13% employer, with yearly totals.",
    intro:
      "EPF (KWSP) contributions: employees contribute 11% of monthly wages; employers add 13% for wages up to RM5,000 and 12% above that.",
    inputs: [
      { key: "salary", label: "Monthly salary (RM)", def: 5000, half: true },
      {
        key: "empRate",
        label: "Employee rate",
        type: "select",
        def: "0.11",
        options: [
          ["0.11", "11% (statutory)"],
          ["0.09", "9% (opt-in reduced)"],
        ],
        half: true,
      },
    ],
    faq: [
      {
        q: "Why does the employer pay 13% for some salaries?",
        a: "For monthly wages of RM5,000 and below, the statutory employer rate is 13%; above RM5,000 it is 12%. The employee share is 11% at all wage levels.",
      },
      {
        q: "Can I contribute more than 11%?",
        a: "Yes — you can elect to contribute above the statutory rate through your employer, and voluntary self-contributions (up to RM100,000 per year) can be made directly to KWSP.",
      },
    ],
    compute(v) {
      const s = num(v.salary);
      const { employee, employer } = epfParts(s, num(v.empRate, 0.11));
      return {
        rows: [
          { label: "Employee contribution", value: RM(employee), strong: true },
          { label: "Employer contribution", value: RM(employer) },
          { label: "Total monthly", value: RM(employee + employer) },
          { label: "Total per year", value: RM((employee + employer) * 12) },
        ],
        note: "Employer rate: 13% for wages ≤ RM5,000, otherwise 12%. Rates current as of 2025.",
      };
    },
  }),
  c({
    slug: "socso-eis-calculator",
    name: "SOCSO & EIS Calculator (Malaysia)",
    category: "Salary & Tax",
    title: "SOCSO (PERKESO) & EIS Calculator Malaysia 2025",
    desc: "Calculate monthly SOCSO and EIS contributions for employees and employers, using the RM6,000 wage ceiling.",
    intro:
      "SOCSO Category 1 (below 60): roughly 0.5% employee and 1.75% employer; EIS adds 0.2% each — all on wages capped at RM6,000.",
    inputs: [
      { key: "salary", label: "Monthly salary (RM)", def: 5000, half: true },
    ],
    faq: [
      {
        q: "What does SOCSO cover?",
        a: "The Employment Injury Scheme (workplace accidents and occupational disease) and the Invalidity Scheme (non-work-related disability or death before 60). EIS covers retrenchment benefits and job-search allowances.",
      },
      {
        q: "Is there a salary cap for SOCSO?",
        a: "Yes — contributions are computed on wages up to RM6,000 per month (ceiling raised from RM5,000 in October 2024). Higher salaries contribute at the ceiling amount.",
      },
    ],
    compute(v) {
      const s = num(v.salary);
      const so = socsoParts(s);
      const ei = eisParts(s);
      return {
        rows: [
          { label: "SOCSO — employee", value: RM(so.employee), strong: true },
          { label: "SOCSO — employer", value: RM(so.employer) },
          { label: "EIS — employee", value: RM(ei.employee) },
          { label: "EIS — employer", value: RM(ei.employer) },
          {
            label: "Employee total / month",
            value: RM(so.employee + ei.employee),
          },
        ],
        note: "Category 1 (employees under 60). Percentage approximation of the PERKESO contribution table — actual table values may differ by a few sen.",
      };
    },
  }),
  c({
    slug: "pcb-calculator",
    name: "PCB Income Tax Calculator (Malaysia)",
    category: "Salary & Tax",
    title: "PCB / MTD Calculator Malaysia — Monthly Tax Deduction YA2025",
    desc: "Estimate your Malaysian monthly tax deduction (PCB/MTD) and annual income tax from monthly salary, using YA2025 resident rates.",
    intro:
      "PCB (Potongan Cukai Bulanan) is the monthly tax your employer deducts. This estimates it by annualising your salary, applying standard reliefs and YA2025 resident brackets.",
    inputs: [
      { key: "salary", label: "Monthly salary (RM)", def: 6000, half: true },
    ],
    faq: [
      {
        q: "Why is my actual PCB slightly different?",
        a: "The official LHDN computerised formula accounts for marital status, spouse income, children, and cumulative months. This estimate assumes a single resident with standard reliefs — close for most single filers, but not payroll-exact.",
      },
      {
        q: "What income is tax-free in Malaysia?",
        a: "With the RM9,000 individual relief and EPF relief, a single person earning around RM3,100 per month or less typically pays no income tax after the RM400 rebate.",
      },
    ],
    compute(v) {
      const s = num(v.salary);
      const annual = s * 12;
      const epfYr = epfParts(s).employee * 12;
      const seYr = (socsoParts(s).employee + eisParts(s).employee) * 12;
      const { chargeable, tax } = myAnnualTax(annual, epfYr, seYr);
      return {
        rows: [
          { label: "Estimated PCB / month", value: RM(tax / 12), strong: true },
          { label: "Annual income tax", value: RM(tax) },
          { label: "Chargeable income", value: RM(chargeable) },
          {
            label: "Effective tax rate",
            value: pct(annual > 0 ? (tax / annual) * 100 : 0),
          },
        ],
        note: RATE_NOTE,
      };
    },
  }),
  c({
    slug: "malaysia-salary-calculator",
    name: "Malaysia Salary Calculator",
    category: "Salary & Tax",
    title:
      "Malaysia Salary Calculator — Take-Home Pay 2025 (EPF, SOCSO, EIS, PCB)",
    desc: "Calculate Malaysian take-home salary after EPF, SOCSO, EIS and PCB deductions, with the full monthly breakdown.",
    intro:
      "Your gross salary minus EPF (11%), SOCSO, EIS and estimated PCB tax — the actual amount that lands in your bank account each month.",
    inputs: [
      {
        key: "salary",
        label: "Monthly gross salary (RM)",
        def: 6000,
        half: true,
      },
      {
        key: "bonusMonths",
        label: "Bonus (months per year)",
        def: 0,
        step: 0.5,
        half: true,
      },
    ],
    faq: [
      {
        q: "What percentage of salary is deducted in Malaysia?",
        a: "For a RM6,000 salary: EPF 11%, SOCSO ~0.5%, EIS 0.2% and PCB tax — typically 13–16% total for mid incomes. Employers pay separately (EPF 12–13%, SOCSO 1.75%, EIS 0.2%) on top of your gross.",
      },
      {
        q: "Is a bonus subject to EPF and tax?",
        a: "Yes — bonuses attract EPF contributions and income tax (though not SOCSO/EIS in the same way as ordinary wages). This calculator includes bonus months in the annual tax estimate.",
      },
    ],
    compute(v) {
      const s = num(v.salary);
      const months = 12 + num(v.bonusMonths);
      const epf = epfParts(s);
      const so = socsoParts(s);
      const ei = eisParts(s);
      const annualGross = s * months;
      const epfYr = s * months * 0.11;
      const seYr = (so.employee + ei.employee) * 12;
      const { tax } = myAnnualTax(annualGross, epfYr, seYr);
      const pcb = tax / 12;
      const deductions = epf.employee + so.employee + ei.employee + pcb;
      const net = s - deductions;
      return {
        rows: [
          { label: "Take-home pay / month", value: RM(net), strong: true },
          { label: "EPF (11%)", value: `− ${RM(epf.employee)}` },
          { label: "SOCSO", value: `− ${RM(so.employee)}` },
          { label: "EIS", value: `− ${RM(ei.employee)}` },
          { label: "PCB (est. tax)", value: `− ${RM(pcb)}` },
          {
            label: "Total deductions",
            value: pct(s > 0 ? (deductions / s) * 100 : 0),
          },
          {
            label: "Employer cost / month",
            value: RM(s + epf.employer + so.employer + ei.employer),
          },
        ],
        note: RATE_NOTE,
      };
    },
  }),
];
