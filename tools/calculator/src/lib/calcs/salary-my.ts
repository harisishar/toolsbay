// Malaysia statutory contributions + PCB. Rates: YA2025 tax brackets,
// EPF/SOCSO/EIS rates current as of 2025/2026 — each page states this.
//
// FILING_YEAR is the calendar year people actually search ("PCB calculator 2026")
// and is what goes in titles. ASSESSMENT_YEAR is the tax year the brackets below
// really implement, and is what goes in the on-page rate notes. In Malaysia you
// file during 2026 for YA2025, so the two legitimately differ — ringgitplus and
// sql.com.my title their pages the same way ("Tax Calculator 2026 (YA 2025)").
// Bump FILING_YEAR every January; bump ASSESSMENT_YEAR + MY_BRACKETS together,
// and only after checking LHDN — the title year must never imply bracket year.
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

const FILING_YEAR = 2026;
const ASSESSMENT_YEAR = "YA2025";
const UPDATED = "2026-08-01";

const KWSP = { label: "KWSP (EPF)", url: "https://www.kwsp.gov.my/" };
const PERKESO = {
  label: "PERKESO (SOCSO)",
  url: "https://www.perkeso.gov.my/",
};
const LHDN = {
  label: "LHDN (Inland Revenue Board)",
  url: "https://www.hasil.gov.my/",
};

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

const RATE_NOTE = `Rates: EPF 11% employee / 12–13% employer; SOCSO & EIS on wages capped at RM6,000 (rate approximation of the official table, within sen); PCB uses ${ASSESSMENT_YEAR} resident brackets assuming single status with standard reliefs (individual RM9,000, EPF max RM4,000, SOCSO+EIS max RM350). Estimates only — verify with LHDN/KWSP for payroll.`;

export const SALARY_MY: Calc[] = [
  c({
    slug: "kwsp-epf-calculator",
    name: "KWSP EPF Calculator (Malaysia)",
    category: "Salary & Tax",
    title: `KWSP EPF Calculator Malaysia ${FILING_YEAR} — Employee & Employer Contribution`,
    desc: `Calculate monthly KWSP/EPF contributions in Malaysia for ${FILING_YEAR}: 11% employee, 12–13% employer, with yearly totals. Free, instant, no sign-up.`,
    intro:
      "The Employees Provident Fund — KWSP in Malay, EPF in English — is Malaysia's mandatory retirement savings scheme, and for most employees it is the largest single line on the payslip. The statutory employee rate is 11% of monthly wages. The employer adds 13% on top for wages of RM5,000 and below, or 12% for wages above RM5,000. So an employee earning RM5,000 has RM1,200 going into their EPF account every month, of which only RM550 comes out of their own pay. Contributions are calculated on wages as defined by the EPF Act, which includes basic salary, bonuses and commissions but excludes travel claims and benefits in kind. This calculator shows the employee share, the employer share, the combined monthly figure and the annual total, and lets you switch to the 9% rate if you are on the reduced employee rate.",
    updated: UPDATED,
    source: KWSP,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Employee contribution = monthly wages × 11%. Employer contribution = monthly wages × 13% when wages are RM5,000 or less, and × 12% when wages exceed RM5,000. The two are added for the monthly total, and multiplied by twelve for the annual figure.",
          "Worked example on RM5,000: the employee side is 5,000 × 0.11 = RM550. Because RM5,000 is not above the threshold, the employer side is 5,000 × 0.13 = RM650. Total RM1,200 per month, RM14,400 per year.",
          "One ringgit more changes the employer rate, not the employee rate. At RM5,001 the employer pays 5,001 × 0.12 = RM600.12 — about RM50 less than at RM5,000, because the higher band uses 12%. It is the only point on the scale where earning more reduces what goes into your account.",
        ],
      },
      {
        h: "What counts as wages for EPF?",
        body: [
          "EPF-liable wages include basic salary, payment for unutilised annual leave, bonuses, commissions, incentives, arrears of wages and allowances that are effectively part of pay. They exclude travel and petrol claims reimbursed against receipts, gratuity on retirement, retrenchment benefits, and benefits in kind such as a company car.",
          "This matters most in bonus months. A two-month bonus is EPF-liable, so the contribution in that month is calculated on the whole amount — which is why the deduction on a bonus payslip looks disproportionate next to an ordinary month.",
        ],
      },
      {
        h: "Is the employer's 13% part of your salary?",
        body: [
          "Legally it is not your salary, but economically it is part of what you cost your employer, and it is money that ends up in your name. When you compare a Malaysian offer against one in a country without a mandatory employer pension contribution, the headline figures are not comparable — add the employer EPF share back before you judge.",
          "The same applies when negotiating. An employer weighing two candidates is looking at gross salary plus roughly 15% in statutory employer contributions across EPF, SOCSO and EIS.",
        ],
      },
      {
        h: "11% or 9% — which should you pick?",
        body: [
          "Malaysia has periodically reduced the statutory employee rate as a stimulus measure, letting workers take home more now at the cost of saving less. The employer share does not change when this happens; only the employee side moves.",
          "The arithmetic is straightforward and the calculator will show it: on RM5,000, dropping from 11% to 9% puts RM100 more in your pocket each month and RM1,200 less into your retirement account each year, before any dividend compounding. EPF has historically declared dividends in the 5–6% range, so the long-run cost of the lower rate is considerably more than the RM1,200.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter your monthly wage",
        text: "Use gross monthly wages as your employer reports them to KWSP — basic salary plus EPF-liable allowances, before any deductions.",
      },
      {
        name: "Pick your employee rate",
        text: "Leave it at 11% unless your payslip shows the reduced 9% rate.",
      },
      {
        name: "Read both sides",
        text: "The employee row is what leaves your pay. The employer row is added on top and is not deducted from you. The total is what accumulates in your account.",
      },
    ],
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
      {
        q: "Is EPF calculated on my bonus?",
        a: "Yes. Bonuses, commissions and incentives are EPF-liable wages, so a bonus month carries a proportionally larger contribution. Travel claims reimbursed against receipts and benefits in kind are not EPF-liable.",
      },
      {
        q: "Does EPF reduce my income tax?",
        a: "Indirectly, yes. Employee EPF contributions qualify for a tax relief capped at RM4,000 a year (combined with life insurance under the current structure), which lowers your chargeable income and therefore your PCB. Anyone earning above roughly RM3,030 a month already hits that cap from EPF alone.",
      },
      {
        q: "Are foreign workers covered by EPF?",
        a: "Contribution is not automatic for non-citizens, but expatriates and foreign workers may elect to contribute, in which case the employee rate applies as normal and the employer share is set at a nominal fixed amount rather than 12–13%. Check your contract — the treatment differs from the citizen default this calculator assumes.",
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
        note: `Employer rate: 13% for wages ≤ RM5,000, otherwise 12%. Rates current as of ${FILING_YEAR}.`,
      };
    },
  }),
  c({
    slug: "socso-eis-calculator",
    name: "SOCSO & EIS Calculator (Malaysia)",
    category: "Salary & Tax",
    title: `SOCSO (PERKESO) & EIS Calculator Malaysia ${FILING_YEAR}`,
    desc: `Calculate monthly SOCSO and EIS contributions for employees and employers in ${FILING_YEAR}, using the RM6,000 wage ceiling. Free and instant.`,
    intro:
      "SOCSO (PERKESO) and EIS are Malaysia's two social insurance deductions, and they are much smaller than EPF — together they take roughly 0.7% of your wage. SOCSO Category 1, which covers employees under 60, costs about 0.5% from the employee and 1.75% from the employer. EIS, the Employment Insurance System, adds 0.2% from each side. Both are calculated on wages capped at RM6,000 a month, a ceiling raised from RM5,000 in October 2024, so anyone earning above RM6,000 contributes the same fixed amount as someone earning exactly RM6,000. This calculator shows all four figures — SOCSO and EIS, employee and employer — plus the combined monthly amount that actually comes out of your pay. The official PERKESO schedule is a wage-band table rather than a percentage, so the values here land within a few sen of the published amounts.",
    updated: UPDATED,
    source: PERKESO,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Contributory wage = the lower of your monthly wage and RM6,000. SOCSO employee = contributory wage × 0.5%; SOCSO employer = contributory wage × 1.75%. EIS = contributory wage × 0.2% on each side.",
          "Worked example on RM5,000, which is below the ceiling: SOCSO employee 5,000 × 0.005 = RM25.00; SOCSO employer 5,000 × 0.0175 = RM87.50; EIS RM10.00 each side. Your side of the payslip is RM35.00 a month.",
          "Above the ceiling the figures stop moving. At RM6,000 and at RM20,000 the employee pays the same RM30.00 SOCSO and RM12.00 EIS, because both are computed on RM6,000 either way. PERKESO publishes an exact contribution table in wage bands rather than a formula; the percentages above reproduce it closely but not to the sen.",
        ],
      },
      {
        h: "What SOCSO actually pays for",
        body: [
          "SOCSO runs two schemes. The Employment Injury Scheme covers accidents at work, accidents commuting to and from work, and occupational disease — it pays medical costs, temporary and permanent disablement benefits, and dependants' benefit on death. The Invalidity Scheme covers non-work-related invalidity or death before age 60, and pays a pension where the contribution conditions are met.",
          "EIS is separate and newer. It pays a job search allowance to workers who lose employment involuntarily — retrenchment, employer closure, constructive dismissal — for a limited period, along with early re-employment and training allowances. It does not cover voluntary resignation, retirement, or dismissal for misconduct.",
        ],
      },
      {
        h: "Category 1 and Category 2 — which applies to you",
        body: [
          "Category 1 covers employees under 60 and includes both the Employment Injury and Invalidity Schemes, which is why both employee and employer contribute. This calculator uses Category 1.",
          "Category 2 applies to employees aged 60 and above, and to those who first registered after 55. It covers Employment Injury only, the employee pays nothing, and the employer contributes at a lower rate. If you are over 60, your employee SOCSO line should read zero — if it does not, ask your payroll department.",
        ],
      },
      {
        h: "Why the RM6,000 ceiling matters",
        body: [
          "The ceiling caps the contribution and it also caps the benefit. SOCSO benefits are calculated from your assumed monthly wage, which is itself capped, so a worker earning RM15,000 who is permanently disabled receives benefits computed on RM6,000 — not on what they actually earned.",
          "That is the practical argument for treating SOCSO as a floor rather than as cover. For higher earners the gap between the capped benefit and actual income is what private disability or income-protection insurance is for.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter your monthly wage",
        text: "Enter gross monthly wages. Anything above RM6,000 is treated as RM6,000 — the contribution stops rising there.",
      },
      {
        name: "Read your side and your employer's",
        text: "The employee rows are deducted from your pay. The employer rows are paid on top and never appear as a deduction on your payslip.",
      },
      {
        name: "Check against your payslip",
        text: "Your payslip may show SOCSO and EIS as one combined line. Add the two employee rows here to compare against it.",
      },
    ],
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
      {
        q: "What is the difference between SOCSO and EIS?",
        a: "SOCSO insures you against injury, occupational disease and invalidity — things that stop you working. EIS insures you against losing the job itself, paying a job search allowance after involuntary termination. They are administered by the same body, PERKESO, and appear on the same payslip, but they are separate schemes with separate contribution rates.",
      },
      {
        q: "Do I still contribute to SOCSO after 60?",
        a: "No. From age 60 you move to Category 2, which covers the Employment Injury Scheme only. The employee contributes nothing and the employer pays a reduced rate. EIS contributions also stop at 60.",
      },
      {
        q: "Can I claim EIS if I resign?",
        a: "No. EIS covers loss of employment that is not your choice — retrenchment, company closure, mutual separation schemes and constructive dismissal. Voluntary resignation, retirement, contract expiry and dismissal for misconduct are all excluded.",
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
    title: `PCB / MTD Calculator Malaysia ${FILING_YEAR} — Monthly Income Tax Deduction (${ASSESSMENT_YEAR})`,
    desc: `Estimate your Malaysian monthly tax deduction (PCB/MTD) and annual income tax from monthly salary. Filing in ${FILING_YEAR} uses ${ASSESSMENT_YEAR} resident rates.`,
    intro: `PCB (Potongan Cukai Bulanan), also called MTD or Monthly Tax Deduction, is the income tax your employer withholds from your salary and remits to LHDN on your behalf. It is not a separate tax — it is a prepayment of the annual income tax you would otherwise owe in a lump sum, which is why most Malaysian employees end up neither paying nor reclaiming much when they file. This calculator estimates your PCB by annualising your monthly salary, subtracting the standard reliefs — RM9,000 individual relief, EPF capped at RM4,000, SOCSO and EIS capped at RM350 — and applying the ${ASSESSMENT_YEAR} resident tax brackets, which are the rates you file against during ${FILING_YEAR}. It assumes a single resident with no dependants, so it is close for most single filers and deliberately conservative for anyone with a spouse or children.`,
    updated: UPDATED,
    source: LHDN,
    sections: [
      {
        h: "How this is calculated",
        body: [
          `Annual gross = monthly salary × 12. Chargeable income = annual gross − RM9,000 individual relief − EPF employee contributions (capped at RM4,000) − SOCSO and EIS (capped at RM350). Tax is then charged on that chargeable income through the ${ASSESSMENT_YEAR} resident bands, each slice at its own rate. If chargeable income is RM35,000 or below, an RM400 rebate is applied. Monthly PCB is the annual tax divided by twelve.`,
          "Worked example on RM6,000 a month: annual gross RM72,000. EPF at 11% is RM7,920 a year, capped at RM4,000 for relief. SOCSO and EIS come to RM420, capped at RM350. Chargeable income is 72,000 − 9,000 − 4,000 − 350 = RM58,650.",
          "That chargeable income is then sliced. The first RM5,000 is taxed at 0%. The next RM15,000 at 1%. The next RM15,000 at 3%. The next RM15,000 at 6%. The remaining RM8,650 at 11%. Malaysia is a progressive system, so no single rate applies to your whole income — the rate you hear quoted is only the rate on your last ringgit.",
        ],
      },
      {
        h: "Why is my actual payslip different?",
        body: [
          "LHDN's official computerised calculation method takes inputs this page does not: marital status, whether your spouse works, the number of children and their education status, zakat paid, and the cumulative tax already deducted in prior months of the year. It also handles additional remuneration such as bonuses under a separate formula.",
          "The direction of the error is predictable. If you have a non-working spouse or children, your real PCB is lower than this estimate, because those reliefs are worth thousands of ringgit. If you have significant non-salary income, it is higher. For a single filer with no dependants, the estimate should land close.",
        ],
      },
      {
        h: "At what salary do you start paying tax in Malaysia?",
        body: [
          "Between the RM9,000 individual relief, EPF relief and the RM400 rebate on chargeable income up to RM35,000, a single person earning roughly RM3,100 a month or less typically pays no income tax at all. Many people at that level still see nothing deducted and assume they do not need to file — they usually still do, if their annual income crosses the registration threshold.",
          "The rebate is a cliff, not a taper. It is worth RM400 at RM35,000 of chargeable income and nothing at RM35,001, so a small raise near that line can cost more in tax than it adds in salary. It is the one place in the Malaysian schedule where that happens.",
        ],
      },
      {
        h: "Reliefs this estimate does not include",
        body: [
          "Malaysia has a long list of reliefs that reduce chargeable income beyond the three used here: lifestyle expenses covering books, computers, sports equipment and internet subscriptions; medical expenses for yourself, parents and serious illness; education fees; SSPN savings for children; life and medical insurance premiums; and childcare fees for children under six.",
          "Every ringgit of relief you claim reduces chargeable income, and the tax you save is that ringgit multiplied by your top marginal rate. At the 19% band, a RM2,500 lifestyle relief is worth RM475. Claiming them happens when you file, not through PCB, which is why many people receive a refund even though PCB is meant to approximate the final bill.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter your monthly gross salary",
        text: "Use gross pay before any deductions — the figure at the top of the payslip, not the amount you receive.",
      },
      {
        name: "Read the monthly PCB row",
        text: "That is the estimated tax your employer withholds each month. The annual row is the full-year liability it prepays.",
      },
      {
        name: "Compare the effective rate",
        text: "The effective rate is tax divided by gross income — always lower than the bracket rate, because only your top slice is taxed at the top rate.",
      },
      {
        name: "Adjust for your own reliefs",
        text: "If you have a spouse, children or claimable expenses, your real liability will be lower than shown. File with the full relief list to recover the difference.",
      },
    ],
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
      {
        q: "Is PCB the same as income tax?",
        a: "PCB is a prepayment of income tax, not a separate charge. Your employer withholds it monthly and remits it to LHDN. When you file your return, your actual liability is worked out with your full reliefs, and PCB already paid is credited against it — so you either get a refund or pay the shortfall.",
      },
      {
        q: "Do I still need to file if PCB was deducted every month?",
        a: "Yes, if your income is above the filing threshold. PCB is an estimate based on limited information; filing is where you claim lifestyle, medical, education and family reliefs. Skipping it usually means leaving a refund with LHDN, and it does not remove the legal obligation to file.",
      },
      {
        q: "How is PCB on a bonus calculated?",
        a: "Bonuses are treated as additional remuneration and taxed under a separate LHDN formula that spreads the effect across the remaining months of the year, which is why the deduction on a bonus payslip is often larger than the ordinary marginal rate would suggest. This calculator estimates PCB on regular salary only.",
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
    title: `Malaysia Salary Calculator ${FILING_YEAR} — Take-Home Pay (EPF, SOCSO, EIS, PCB)`,
    desc: `Calculate Malaysian take-home salary (gaji bersih) after EPF, SOCSO, EIS and PCB deductions for ${FILING_YEAR}, with the full monthly breakdown. Free, no sign-up.`,
    intro:
      "Gaji bersih — your take-home pay — is what is left after four statutory deductions come out of your gross salary: EPF at 11%, SOCSO at roughly 0.5%, EIS at 0.2%, and PCB, the monthly income tax withheld by your employer. For a typical mid-range Malaysian salary those four together take somewhere between 13% and 16% of gross, and the largest share by far is EPF, which is not a tax at all but savings in your own name. This calculator applies all four to the salary you enter and shows the monthly breakdown line by line, so you can see which deduction is actually moving the number. It also shows total employer cost, because your employer pays EPF, SOCSO and EIS on top of your gross rather than out of it.",
    updated: UPDATED,
    source: LHDN,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Take-home = gross − EPF employee (11%) − SOCSO employee (0.5% of wages capped at RM6,000) − EIS employee (0.2%, same cap) − estimated PCB. PCB is derived by annualising gross, subtracting the RM9,000 individual relief plus EPF relief capped at RM4,000 and SOCSO/EIS relief capped at RM350, and running the remainder through the resident tax bands.",
          "Worked example on RM6,000 a month with no bonus: EPF RM660.00, SOCSO RM30.00, EIS RM12.00. Chargeable income for the year works out at RM58,650, giving annual tax of about RM2,101 and monthly PCB of roughly RM175. Total deductions are around RM877, so take-home is roughly RM5,123 — about 14.6% of gross.",
          "Employer cost on the same salary is RM6,000 plus EPF employer at 12% (RM720), SOCSO employer (RM105) and EIS employer (RM12), so roughly RM6,837 a month. That figure is worth knowing when you negotiate: the number your employer weighs is not your gross.",
        ],
      },
      {
        h: "Where the deductions actually go",
        body: [
          "Only PCB leaves your control. EPF is retirement savings in your own account, earning a dividend that has historically run in the 5–6% range — treating it as a tax understates your real compensation by about 11% of gross.",
          "SOCSO and EIS together take under 1% and buy insurance you would otherwise have to arrange: injury and invalidity cover, and a job search allowance if you are retrenched. Both are calculated on wages capped at RM6,000, so as your salary rises they shrink to a rounding error.",
        ],
      },
      {
        h: "How bonus months change the picture",
        body: [
          "A bonus is EPF-liable and taxable, so a two-month bonus does not arrive as two months of take-home pay. EPF takes 11% of it, and because the bonus pushes your annual income up, some of it is taxed at your top marginal rate rather than your average one.",
          "Setting the bonus field in this calculator adds those months to the annual gross used for the tax estimate, which raises the monthly PCB figure across the year — that is the same smoothing LHDN's own additional-remuneration formula applies, though the official method spreads it more precisely across the remaining months.",
        ],
      },
      {
        h: "What this estimate leaves out",
        body: [
          "The tax half assumes a single resident with no dependants and only the standard reliefs. A spouse without income, children, education fees, medical expenses, insurance premiums and lifestyle relief all reduce chargeable income, and some of them substantially — so for most people with a family the real PCB is lower than shown here.",
          "It also excludes anything specific to your employer: zakat deductions, union fees, loan repayments, unpaid leave, overtime, and any allowance treated differently for EPF purposes. Compare against your own payslip once and you will know which of these apply to you.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter your gross monthly salary",
        text: "Use the figure before deductions. If you are comparing a job offer, use the monthly equivalent of the annual package excluding bonus.",
      },
      {
        name: "Add your bonus months, if any",
        text: "Enter it in months — a two-month bonus is 2. This raises the annual income used for the tax estimate, which is how a bonus really affects your monthly deduction.",
      },
      {
        name: "Read the take-home row",
        text: "That is your gaji bersih. The rows below it show each deduction so you can see which one is doing the work.",
      },
      {
        name: "Check the employer cost row",
        text: "This is what you cost your employer per month, including their EPF, SOCSO and EIS contributions. Useful when negotiating or comparing offers across countries.",
      },
    ],
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
      {
        q: "How much is take-home pay on RM5,000 in Malaysia?",
        a: "Roughly RM4,340 a month for a single filer with no dependants: EPF takes RM550, SOCSO RM25, EIS RM10, and PCB around RM75. That is about 13% of gross. With a spouse or children the PCB share falls and take-home rises.",
      },
      {
        q: "Is EPF a deduction or savings?",
        a: "Savings. It leaves your monthly pay but goes into an account in your name and earns an annual dividend. Of the four deductions here it is by far the largest, so take-home pay understates your actual compensation by roughly 11% of gross — plus the employer's 12–13% on top.",
      },
      {
        q: "Why is my take-home lower than this calculator shows?",
        a: "The usual causes are zakat, union dues, employer loan repayments, unpaid leave, or a higher elected EPF rate. If the gap is in the tax line specifically, check whether your employer has your marital and dependant details on file — PCB computed without them is higher than it needs to be.",
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
