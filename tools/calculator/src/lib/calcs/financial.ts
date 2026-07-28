import {
  type Calc,
  num,
  money,
  fmt,
  pct,
  monthlyPayment,
} from "../calc-types.ts";

const c = (partial: Calc) => partial;

export const FINANCIAL: Calc[] = [
  c({
    slug: "loan-calculator",
    name: "Loan Calculator",
    category: "Financial",
    title: "Loan Calculator — Monthly Payment & Total Interest",
    desc: "Calculate monthly loan payments, total interest and total cost for any amount, rate and term. Free, instant, no sign-up.",
    intro:
      "Enter the amount, interest rate and term to see your monthly payment, the total you will repay, and how much of that is interest.",
    inputs: [
      {
        key: "amount",
        label: "Loan amount",
        def: 20000,
        suffix: "$",
        half: true,
      },
      {
        key: "rate",
        label: "Annual interest rate",
        def: 6.5,
        step: 0.01,
        suffix: "%",
        half: true,
      },
      { key: "years", label: "Term (years)", def: 5, half: true },
    ],
    faq: [
      {
        q: "How is the monthly loan payment calculated?",
        a: "With the standard amortization formula: P·r·(1+r)ⁿ / ((1+r)ⁿ−1), where P is the principal, r the monthly rate and n the number of months. Early payments are mostly interest; later ones mostly principal.",
      },
      {
        q: "How can I pay less interest overall?",
        a: "Shorten the term, make extra principal payments, or refinance at a lower rate. Even one extra payment a year on a long loan cuts total interest substantially.",
      },
    ],
    compute(v) {
      const P = num(v.amount);
      const years = num(v.years);
      const m = monthlyPayment(P, num(v.rate), years);
      const total = m * years * 12;
      return {
        rows: [
          { label: "Monthly payment", value: money(m), strong: true },
          { label: "Total of payments", value: money(total) },
          { label: "Total interest", value: money(total - P) },
        ],
      };
    },
  }),
  c({
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "Financial",
    title: "Mortgage Calculator — Payment with Taxes & Insurance",
    desc: "Estimate your monthly mortgage payment including property tax, insurance and HOA, plus total interest over the life of the loan.",
    intro:
      "Work out your true monthly housing cost: principal and interest from the loan, plus property tax, home insurance and HOA fees.",
    inputs: [
      {
        key: "price",
        label: "Home price",
        def: 400000,
        suffix: "$",
        half: true,
      },
      {
        key: "down",
        label: "Down payment",
        def: 80000,
        suffix: "$",
        half: true,
      },
      {
        key: "rate",
        label: "Interest rate",
        def: 6.5,
        step: 0.01,
        suffix: "%",
        half: true,
      },
      { key: "years", label: "Term (years)", def: 30, half: true },
      {
        key: "tax",
        label: "Property tax (yearly)",
        def: 4800,
        suffix: "$",
        half: true,
      },
      {
        key: "ins",
        label: "Insurance + HOA (yearly)",
        def: 2400,
        suffix: "$",
        half: true,
      },
    ],
    faq: [
      {
        q: "What percentage should my down payment be?",
        a: "With 20% down you avoid private mortgage insurance (PMI) in the US. Many buyers put down less — some loans allow 3–5% — but PMI adds roughly 0.5–1% of the loan amount per year until you reach 20% equity.",
      },
      {
        q: "Why is so much of my payment interest at the start?",
        a: "Interest is charged on the outstanding balance, which is largest at the start. As the balance falls, the interest share of each fixed payment shrinks and the principal share grows.",
      },
    ],
    compute(v) {
      const loan = Math.max(0, num(v.price) - num(v.down));
      const years = num(v.years);
      const pi = monthlyPayment(loan, num(v.rate), years);
      const extras = (num(v.tax) + num(v.ins)) / 12;
      const total = pi * years * 12;
      return {
        rows: [
          {
            label: "Monthly payment (all-in)",
            value: money(pi + extras),
            strong: true,
          },
          { label: "Principal & interest", value: money(pi) },
          { label: "Tax + insurance monthly", value: money(extras) },
          { label: "Loan amount", value: money(loan) },
          { label: "Total interest over term", value: money(total - loan) },
        ],
      };
    },
  }),
  c({
    slug: "auto-loan-calculator",
    name: "Auto Loan Calculator",
    category: "Financial",
    title: "Auto Loan Calculator — Car Payment with Trade-in & Tax",
    desc: "Calculate monthly car payments including trade-in value, down payment and sales tax. See total interest and total cost.",
    intro:
      "Estimate your car payment from the vehicle price, trade-in, down payment, sales tax and loan terms.",
    inputs: [
      {
        key: "price",
        label: "Vehicle price",
        def: 35000,
        suffix: "$",
        half: true,
      },
      {
        key: "down",
        label: "Down payment + trade-in",
        def: 5000,
        suffix: "$",
        half: true,
      },
      {
        key: "tax",
        label: "Sales tax",
        def: 7,
        step: 0.1,
        suffix: "%",
        half: true,
      },
      {
        key: "rate",
        label: "Interest rate",
        def: 7,
        step: 0.01,
        suffix: "%",
        half: true,
      },
      { key: "months", label: "Term (months)", def: 60, half: true },
    ],
    faq: [
      {
        q: "Should I finance the sales tax?",
        a: "If tax is rolled into the loan (as here), you pay interest on it too. Paying tax and fees upfront keeps the financed amount — and total interest — lower.",
      },
      {
        q: "Is a longer car loan better?",
        a: "72–84 month loans lower the monthly payment but cost far more interest, and you risk owing more than the car is worth. 36–60 months is the usual sweet spot.",
      },
    ],
    compute(v) {
      const taxed = num(v.price) * (1 + num(v.tax) / 100);
      const loan = Math.max(0, taxed - num(v.down));
      const months = num(v.months);
      const m = monthlyPayment(loan, num(v.rate), months / 12);
      return {
        rows: [
          { label: "Monthly payment", value: money(m), strong: true },
          { label: "Amount financed", value: money(loan) },
          { label: "Total interest", value: money(m * months - loan) },
          {
            label: "Total cost (incl. tax)",
            value: money(num(v.down) + m * months),
          },
        ],
      };
    },
  }),
  c({
    slug: "interest-calculator",
    name: "Simple Interest Calculator",
    category: "Financial",
    title: "Simple Interest Calculator — I = P × r × t",
    desc: "Calculate simple interest and final balance from principal, rate and time. Instant and free.",
    intro:
      "Simple interest grows linearly: I = principal × rate × time, with no compounding.",
    inputs: [
      {
        key: "principal",
        label: "Principal",
        def: 10000,
        suffix: "$",
        half: true,
      },
      {
        key: "rate",
        label: "Annual rate",
        def: 5,
        step: 0.01,
        suffix: "%",
        half: true,
      },
      { key: "years", label: "Time (years)", def: 3, step: 0.1, half: true },
    ],
    faq: [
      {
        q: "What is the difference between simple and compound interest?",
        a: "Simple interest is charged only on the original principal. Compound interest is charged on principal plus accumulated interest, so it grows faster over time — use our compound interest calculator to compare.",
      },
    ],
    compute(v) {
      const i = num(v.principal) * (num(v.rate) / 100) * num(v.years);
      return {
        rows: [
          { label: "Interest earned", value: money(i), strong: true },
          { label: "Final balance", value: money(num(v.principal) + i) },
        ],
      };
    },
  }),
  c({
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "Financial",
    title: "Compound Interest Calculator — Growth with Contributions",
    desc: "See how savings grow with compound interest and monthly contributions. Choose the compounding frequency and time horizon.",
    intro:
      "Compound interest earns interest on interest. Add a monthly contribution to see how regular saving accelerates growth.",
    inputs: [
      {
        key: "principal",
        label: "Starting amount",
        def: 10000,
        suffix: "$",
        half: true,
      },
      {
        key: "monthly",
        label: "Monthly contribution",
        def: 200,
        suffix: "$",
        half: true,
      },
      {
        key: "rate",
        label: "Annual rate",
        def: 7,
        step: 0.01,
        suffix: "%",
        half: true,
      },
      { key: "years", label: "Years", def: 20, half: true },
      {
        key: "freq",
        label: "Compounding",
        type: "select",
        def: "12",
        options: [
          ["12", "Monthly"],
          ["4", "Quarterly"],
          ["1", "Yearly"],
          ["365", "Daily"],
        ],
        half: true,
      },
    ],
    faq: [
      {
        q: "How often should interest compound for the best return?",
        a: "More frequent compounding helps, but the effect is modest: $10,000 at 7% for 20 years yields $38,697 compounded annually versus $40,489 daily. Contribution amount and time matter far more.",
      },
      {
        q: "What is the rule of 72?",
        a: "Divide 72 by your annual return to estimate the years needed to double your money: at 7%, roughly 72 ÷ 7 ≈ 10.3 years.",
      },
    ],
    compute(v) {
      const P = num(v.principal);
      const pm = num(v.monthly);
      const years = num(v.years);
      const k = num(v.freq, 12);
      const r = num(v.rate) / 100;
      const growth = Math.pow(1 + r / k, k * years);
      const fvPrincipal = P * growth;
      // monthly contributions ≈ future value of annuity at monthly effective rate
      const rm = Math.pow(1 + r / k, k / 12) - 1;
      const nMon = years * 12;
      const fvContrib =
        rm === 0 ? pm * nMon : pm * ((Math.pow(1 + rm, nMon) - 1) / rm);
      const total = fvPrincipal + fvContrib;
      const contributed = P + pm * nMon;
      return {
        rows: [
          { label: "Future value", value: money(total), strong: true },
          { label: "Total contributed", value: money(contributed) },
          { label: "Interest earned", value: money(total - contributed) },
        ],
      };
    },
  }),
  c({
    slug: "payment-calculator",
    name: "Payment Calculator",
    category: "Financial",
    title: "Payment Calculator — Monthly Payment or Loan Term",
    desc: "Solve for the monthly payment on a fixed-term loan, or find how long a fixed payment takes to clear a balance.",
    intro:
      "Two modes: find the payment for a fixed term, or find how long a chosen payment takes to pay off the balance.",
    inputs: [
      {
        key: "amount",
        label: "Loan amount",
        def: 15000,
        suffix: "$",
        half: true,
      },
      {
        key: "rate",
        label: "Annual rate",
        def: 8,
        step: 0.01,
        suffix: "%",
        half: true,
      },
      {
        key: "mode",
        label: "Solve for",
        type: "select",
        def: "payment",
        options: [
          ["payment", "Monthly payment (fixed term)"],
          ["term", "Payoff time (fixed payment)"],
        ],
      },
      { key: "years", label: "Term (years)", def: 4, half: true },
      {
        key: "payment",
        label: "Monthly payment",
        def: 400,
        suffix: "$",
        half: true,
      },
    ],
    faq: [
      {
        q: "Why does my chosen payment say “never pays off”?",
        a: "If the payment is less than the first month’s interest, the balance grows instead of shrinking. Increase the payment above the monthly interest amount.",
      },
    ],
    compute(v) {
      const P = num(v.amount);
      const r = num(v.rate) / 100 / 12;
      if (v.mode !== "term") {
        const m = monthlyPayment(P, num(v.rate), num(v.years));
        return {
          rows: [
            { label: "Monthly payment", value: money(m), strong: true },
            {
              label: "Total interest",
              value: money(m * num(v.years) * 12 - P),
            },
          ],
        };
      }
      const pay = num(v.payment);
      if (pay <= P * r) {
        return {
          rows: [
            {
              label: "Result",
              value: "Payment too small — balance never falls",
              strong: true,
            },
          ],
        };
      }
      const n =
        r === 0 ? P / pay : Math.log(pay / (pay - P * r)) / Math.log(1 + r);
      return {
        rows: [
          {
            label: "Payoff time",
            value: `${Math.ceil(n)} months (${fmt(n / 12, 1)} years)`,
            strong: true,
          },
          { label: "Total interest", value: money(pay * n - P) },
        ],
      };
    },
  }),
  c({
    slug: "amortization-calculator",
    name: "Amortization Calculator",
    category: "Financial",
    title: "Amortization Calculator — Yearly Payment Schedule",
    desc: "Full amortization schedule showing principal, interest and remaining balance year by year for any loan.",
    intro:
      "See exactly how each year of payments splits between interest and principal, and how the balance falls to zero.",
    inputs: [
      {
        key: "amount",
        label: "Loan amount",
        def: 300000,
        suffix: "$",
        half: true,
      },
      {
        key: "rate",
        label: "Annual rate",
        def: 6,
        step: 0.01,
        suffix: "%",
        half: true,
      },
      { key: "years", label: "Term (years)", def: 30, half: true },
    ],
    faq: [
      {
        q: "What is an amortization schedule?",
        a: "A table showing every payment split into interest and principal, with the running balance. It reveals how slowly equity builds early in a long loan.",
      },
    ],
    compute(v) {
      const P = num(v.amount);
      const years = Math.min(50, Math.max(1, Math.round(num(v.years))));
      const r = num(v.rate) / 100 / 12;
      const m = monthlyPayment(P, num(v.rate), years);
      let bal = P;
      const rows: string[][] = [];
      for (let y = 1; y <= years; y++) {
        let int = 0;
        let pri = 0;
        for (let i = 0; i < 12; i++) {
          const thisInt = bal * r;
          int += thisInt;
          pri += m - thisInt;
          bal -= m - thisInt;
        }
        rows.push([String(y), money(pri), money(int), money(Math.max(0, bal))]);
      }
      return {
        rows: [
          { label: "Monthly payment", value: money(m), strong: true },
          { label: "Total interest", value: money(m * years * 12 - P) },
        ],
        table: {
          title: "Yearly schedule",
          headers: ["Year", "Principal", "Interest", "Balance"],
          rows,
        },
      };
    },
  }),
  c({
    slug: "retirement-calculator",
    name: "Retirement Calculator",
    category: "Financial",
    title: "Retirement Calculator — Will Your Savings Last?",
    desc: "Project your retirement savings from current age to retirement, and how much you can withdraw monthly.",
    intro:
      "Project your nest egg at retirement from current savings and monthly contributions, then see the monthly income it could sustain.",
    inputs: [
      { key: "age", label: "Current age", def: 30, half: true },
      { key: "retire", label: "Retirement age", def: 62, half: true },
      {
        key: "saved",
        label: "Current savings",
        def: 50000,
        suffix: "$",
        half: true,
      },
      {
        key: "monthly",
        label: "Monthly contribution",
        def: 800,
        suffix: "$",
        half: true,
      },
      {
        key: "rate",
        label: "Return before retirement",
        def: 7,
        step: 0.1,
        suffix: "%",
        half: true,
      },
      { key: "drawYears", label: "Years of withdrawals", def: 25, half: true },
    ],
    faq: [
      {
        q: "How much should I save for retirement?",
        a: "A common target is saving 15% of gross income from your 20s, reaching about 10× your salary by retirement. The 4% rule says a portfolio can sustain withdrawals of ~4% of its starting value per year, inflation-adjusted, for 30 years.",
      },
    ],
    compute(v) {
      const years = Math.max(0, num(v.retire) - num(v.age));
      const r = num(v.rate) / 100 / 12;
      const n = years * 12;
      const fv =
        num(v.saved) * Math.pow(1 + r, n) +
        (r === 0
          ? num(v.monthly) * n
          : num(v.monthly) * ((Math.pow(1 + r, n) - 1) / r));
      const drawR = 0.05 / 12; // assume 5% return during drawdown
      const dn = num(v.drawYears) * 12;
      const income =
        dn === 0 ? 0 : (fv * drawR) / (1 - Math.pow(1 + drawR, -dn));
      return {
        rows: [
          {
            label: `Savings at ${num(v.retire)}`,
            value: money(fv),
            strong: true,
          },
          {
            label: `Monthly income for ${num(v.drawYears)} years`,
            value: money(income),
          },
        ],
        note: "Drawdown assumes a 5% annual return during retirement. Estimates only — not financial advice.",
      };
    },
  }),
  c({
    slug: "investment-calculator",
    name: "Investment Calculator",
    category: "Financial",
    title: "Investment Calculator — Future Value of Regular Investing",
    desc: "Calculate how an investment grows with regular contributions and compounding returns over any period.",
    intro:
      "Project the future value of a starting investment plus regular monthly additions at your expected annual return.",
    inputs: [
      {
        key: "principal",
        label: "Starting amount",
        def: 5000,
        suffix: "$",
        half: true,
      },
      {
        key: "monthly",
        label: "Monthly investment",
        def: 500,
        suffix: "$",
        half: true,
      },
      {
        key: "rate",
        label: "Expected annual return",
        def: 8,
        step: 0.1,
        suffix: "%",
        half: true,
      },
      { key: "years", label: "Years", def: 15, half: true },
    ],
    faq: [
      {
        q: "What annual return should I assume?",
        a: "Long-run broad stock-market returns have averaged 7–10% before inflation; bonds less. Use a conservative figure (6–7%) for planning, and remember returns are never guaranteed.",
      },
    ],
    compute(v) {
      const r = num(v.rate) / 100 / 12;
      const n = num(v.years) * 12;
      const fv =
        num(v.principal) * Math.pow(1 + r, n) +
        (r === 0
          ? num(v.monthly) * n
          : num(v.monthly) * ((Math.pow(1 + r, n) - 1) / r));
      const contributed = num(v.principal) + num(v.monthly) * n;
      return {
        rows: [
          { label: "Future value", value: money(fv), strong: true },
          { label: "Total invested", value: money(contributed) },
          { label: "Growth", value: money(fv - contributed) },
        ],
      };
    },
  }),
  c({
    slug: "inflation-calculator",
    name: "Inflation Calculator",
    category: "Financial",
    title: "Inflation Calculator — Future Buying Power of Money",
    desc: "See what today's money will be worth in the future at a given inflation rate, or what past amounts equal today.",
    intro:
      "Inflation quietly shrinks buying power. See what an amount today will effectively be worth after years of inflation.",
    inputs: [
      {
        key: "amount",
        label: "Amount today",
        def: 10000,
        suffix: "$",
        half: true,
      },
      {
        key: "rate",
        label: "Annual inflation",
        def: 3,
        step: 0.1,
        suffix: "%",
        half: true,
      },
      { key: "years", label: "Years", def: 20, half: true },
    ],
    faq: [
      {
        q: "What inflation rate should I use?",
        a: "Central banks target ~2%; the long-run US average is about 3%. Recent years have shown it can spike well above that, so 3% is a reasonable planning default.",
      },
    ],
    compute(v) {
      const future =
        num(v.amount) / Math.pow(1 + num(v.rate) / 100, num(v.years));
      const needed =
        num(v.amount) * Math.pow(1 + num(v.rate) / 100, num(v.years));
      return {
        rows: [
          {
            label: `Buying power in ${num(v.years)} years`,
            value: money(future),
            strong: true,
          },
          { label: "Amount needed to match today", value: money(needed) },
        ],
      };
    },
  }),
  c({
    slug: "sales-tax-calculator",
    name: "Sales Tax Calculator",
    category: "Financial",
    title: "Sales Tax Calculator — Add or Back Out Tax",
    desc: "Add sales tax to a price, or extract the pre-tax price from a total. Works for any tax rate, VAT or GST.",
    intro:
      "Add tax to a net price, or work backwards from a tax-inclusive total to the base price.",
    inputs: [
      { key: "amount", label: "Amount", def: 100, suffix: "$", half: true },
      {
        key: "rate",
        label: "Tax rate",
        def: 8.875,
        step: 0.001,
        suffix: "%",
        half: true,
      },
      {
        key: "mode",
        label: "Direction",
        type: "select",
        def: "add",
        options: [
          ["add", "Amount is before tax — add tax"],
          ["back", "Amount includes tax — back it out"],
        ],
      },
    ],
    faq: [
      {
        q: "How do I remove sales tax from a total?",
        a: "Divide the total by (1 + rate). A $108.88 total at 8.875% tax: 108.88 ÷ 1.08875 = $100.00 base price, $8.88 tax.",
      },
    ],
    compute(v) {
      const a = num(v.amount);
      const r = num(v.rate) / 100;
      if (v.mode === "back") {
        const base = a / (1 + r);
        return {
          rows: [
            { label: "Price before tax", value: money(base), strong: true },
            { label: "Tax portion", value: money(a - base) },
          ],
        };
      }
      return {
        rows: [
          { label: "Price after tax", value: money(a * (1 + r)), strong: true },
          { label: "Tax added", value: money(a * r) },
        ],
      };
    },
  }),
  c({
    slug: "tip-calculator",
    name: "Tip Calculator",
    category: "Everyday",
    title: "Tip Calculator — Split the Bill with Tip",
    desc: "Calculate the tip and split the bill between any number of people. Fast, free, works offline.",
    intro: "Work out the tip and each person’s share in one step.",
    inputs: [
      { key: "bill", label: "Bill amount", def: 86.4, suffix: "$", half: true },
      { key: "tip", label: "Tip", def: 18, suffix: "%", half: true },
      { key: "people", label: "People splitting", def: 2, min: 1, half: true },
    ],
    faq: [
      {
        q: "How much should I tip?",
        a: "In the US, 15–20% for table service is standard; 10% signals below-par service. In much of Europe and Asia tipping is modest or already included as a service charge — check the bill first.",
      },
    ],
    compute(v) {
      const tip = num(v.bill) * (num(v.tip) / 100);
      const total = num(v.bill) + tip;
      const people = Math.max(1, num(v.people, 1));
      return {
        rows: [
          { label: "Tip", value: money(tip) },
          { label: "Total with tip", value: money(total) },
          { label: "Per person", value: money(total / people), strong: true },
        ],
      };
    },
  }),
  c({
    slug: "discount-calculator",
    name: "Discount Calculator",
    category: "Everyday",
    title: "Discount Calculator — Sale Price & Savings",
    desc: "Find the final price after a percentage discount (with optional stacked coupon) and how much you save.",
    intro:
      "Enter the price and discount to get the sale price — with support for a second stacked discount.",
    inputs: [
      {
        key: "price",
        label: "Original price",
        def: 129.99,
        suffix: "$",
        half: true,
      },
      { key: "disc", label: "Discount", def: 25, suffix: "%", half: true },
      {
        key: "extra",
        label: "Extra coupon (optional)",
        def: 0,
        suffix: "%",
        half: true,
      },
    ],
    faq: [
      {
        q: "Do two discounts add together?",
        a: "No — they stack multiplicatively. 25% off then 10% off is 32.5% total, not 35%: the second discount applies to the already-reduced price.",
      },
    ],
    compute(v) {
      const final =
        num(v.price) * (1 - num(v.disc) / 100) * (1 - num(v.extra) / 100);
      return {
        rows: [
          { label: "Final price", value: money(final), strong: true },
          { label: "You save", value: money(num(v.price) - final) },
          {
            label: "Effective discount",
            value: pct(num(v.price) > 0 ? (1 - final / num(v.price)) * 100 : 0),
          },
        ],
      };
    },
  }),
];
