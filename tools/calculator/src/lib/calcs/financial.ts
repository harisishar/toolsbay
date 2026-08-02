import {
  type Calc,
  num,
  money,
  fmt,
  pct,
  monthlyPayment,
} from "../calc-types.ts";

const c = (partial: Calc) => partial;

const UPDATED = "2026-08-01";

export const FINANCIAL: Calc[] = [
  c({
    slug: "loan-calculator",
    name: "Loan Calculator",
    category: "Financial",
    title: "Loan Calculator — Monthly Payment & Total Interest",
    desc: "Calculate monthly loan payments, total interest and total cost for any amount, rate and term. Free, instant, no sign-up.",
    intro:
      "A loan calculator answers one question: what will this cost me every month, and what will it cost me in total? Those two numbers pull in opposite directions, which is the reason the tool is worth using. Lengthening the term lowers the monthly payment and raises the total interest, sometimes dramatically — a five-year loan stretched to seven can add half again to the interest bill while saving a modest amount each month. This calculator uses the standard amortisation formula that banks, credit unions and online lenders all use, so the monthly payment it produces should match a real quote for the same amount, rate and term. Enter the three inputs and it returns the monthly payment, the total of all payments over the life of the loan, and how much of that total is interest rather than principal.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "The monthly payment comes from the amortisation formula: M = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), where P is the principal, r is the annual rate divided by twelve, and n is the number of months. Total of payments is M × n, and total interest is that figure minus the principal you borrowed.",
          "Worked example on $20,000 at 6.5% over five years: the monthly rate is 0.0054167 and n is 60. The formula gives a payment of about $391.32. Over 60 months that is $23,479, of which $3,479 is interest — roughly 17% on top of what you borrowed.",
          "Stretch the same loan to seven years and the payment drops to about $296 while total interest rises to around $4,880. You save $95 a month and pay $1,400 more overall. That trade is the entire decision, and it is why the total-interest row matters as much as the monthly one.",
        ],
      },
      {
        h: "Why early payments are almost all interest",
        body: [
          "Interest each month is charged on the balance still outstanding, so it is largest at the start when you owe the most. On the $20,000 example, the first payment splits roughly $108 interest and $283 principal. By the final payment it is about $2 interest and $389 principal.",
          "This is why an extra payment early in the loan is worth far more than the same payment later — it removes principal that would otherwise have accrued interest for the whole remaining term. It is also why refinancing late in a loan rarely helps much: by then you have already paid most of the interest.",
        ],
      },
      {
        h: "What the calculator assumes",
        body: [
          "A fixed rate for the whole term, equal payments every month, and no fees. Real loans often add an origination fee, which is why the APR quoted on a loan agreement is usually higher than the nominal interest rate — APR folds fees into the rate so that offers can be compared honestly.",
          "It also assumes no early repayment penalty. Some lenders charge one, which changes the maths on paying a loan off ahead of schedule. Check the agreement before assuming extra payments are free.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter the loan amount",
        text: "The principal you are borrowing, after any deposit or trade-in, and before fees rolled into the loan.",
      },
      {
        name: "Enter the annual interest rate",
        text: "Use the nominal rate the lender quotes. If you have an APR that includes fees, use that instead for a more honest total.",
      },
      {
        name: "Set the term in years",
        text: "Try more than one. Comparing the monthly payment against the total interest across two or three terms is the point of the exercise.",
      },
    ],
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
      {
        q: "What is the difference between interest rate and APR?",
        a: "The interest rate is what you pay on the balance. APR includes the rate plus fees — origination, administration, sometimes insurance — expressed as an annual percentage. Two loans at the same rate can have very different APRs, which is why APR is the number to compare offers on.",
      },
      {
        q: "Should I take a longer term for a lower payment?",
        a: "Only if the monthly figure is genuinely unaffordable at the shorter term. Lengthening the term always increases total interest, and on a large loan the difference runs into thousands. Run both terms here and compare the total-interest row before deciding.",
      },
      {
        q: "Does an extra payment reduce my monthly amount?",
        a: "Usually not — most lenders apply extra payments to principal and keep the monthly payment the same, so the loan simply ends earlier. Some allow recasting, which recalculates the payment on the reduced balance. Ask which your lender does, because the two produce very different outcomes.",
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
      "Most mortgage calculators show principal and interest and stop there, which is why the number people budget against is routinely 20% to 30% below what they actually pay. The full monthly cost of owning a home has four parts, usually abbreviated PITI: principal, interest, property taxes and insurance — plus HOA or service charges where they apply. Taxes and insurance are not optional and in the United States are typically collected by the lender through an escrow account alongside the loan payment, so they arrive as one combined bill. This calculator asks for all of them. Enter the purchase price, your down payment, the rate and term, and your annual property tax and insurance, and it returns the all-in monthly payment, the principal-and-interest portion separately, and the total interest across the life of the loan.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "The loan amount is the purchase price minus your down payment. Principal and interest come from the standard amortisation formula: M = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), with r the annual rate divided by twelve and n the term in months. Annual property tax and insurance are divided by twelve and added on top to give the all-in figure.",
          "Worked example on a $400,000 home with $80,000 down at 6.5% over 30 years: the loan is $320,000, giving principal and interest of about $2,023 a month. Property tax of $4,800 and insurance of $2,400 add $600. The all-in payment is roughly $2,623 — nearly 30% more than the figure a principal-and-interest calculator would show.",
          "Total interest over the 30 years comes to about $408,000, which is more than the loan itself. That is the defining feature of a long mortgage at a mid single-digit rate, and it is the number most worth looking at before choosing a term.",
        ],
      },
      {
        h: "Why 20% down is the number everyone quotes",
        body: [
          "In the United States, a down payment below 20% generally triggers private mortgage insurance, which protects the lender rather than you and typically costs between 0.5% and 1% of the loan amount each year. On a $360,000 loan that is $150 to $300 a month for nothing you benefit from directly.",
          "PMI is removable. Once you reach 20% equity — through payments, extra principal, or appreciation — you can request cancellation, and it must be terminated automatically at 22% equity on most conforming loans. Many borrowers pay it for years past the point they could have removed it simply because they never asked.",
          "Outside the US the mechanism differs but the principle is the same: a larger deposit usually unlocks a materially better rate tier, and the jump is often at 10%, 15% or 20%.",
        ],
      },
      {
        h: "The 15-year versus 30-year decision",
        body: [
          "On the same $320,000 loan, a 15-year term at a comparable rate raises the monthly principal and interest to roughly $2,788 but cuts total interest to around $182,000 — saving well over $200,000 against the 30-year.",
          "The counter-argument is flexibility. A 30-year mortgage with voluntary extra payments gets you most of the interest saving while leaving you the option to fall back to the lower required payment if your income changes. Whether that flexibility is worth the slightly higher rate that usually accompanies longer terms is a judgement about your own income stability, not an arithmetic question.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter the purchase price and your down payment",
        text: "The loan amount is the difference between them. Closing costs are separate and are not usually financed.",
      },
      {
        name: "Add the rate and term",
        text: "Use a quoted rate if you have one. Try both 15 and 30 years to see the total-interest difference.",
      },
      {
        name: "Enter annual property tax and insurance",
        text: "Property tax is on the listing or available from the county assessor. Insurance and any HOA or service charge go in the second field, as an annual total.",
      },
      {
        name: "Read the all-in payment",
        text: "That is what leaves your account each month. The principal-and-interest row below shows how much of it is actually the loan.",
      },
    ],
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
      {
        q: "What is PITI?",
        a: "Principal, Interest, Taxes and Insurance — the four components of a full mortgage payment. Lenders assess affordability on PITI, not on principal and interest alone, which is why a pre-approval figure often looks lower than buyers expect.",
      },
      {
        q: "How much house can I afford?",
        a: "A common guideline is that PITI should stay under 28% of gross monthly income, and total debt payments under 36%. Those are lender conventions rather than laws, and they say nothing about your other commitments — run your real budget against the all-in figure here rather than against a rule of thumb.",
      },
      {
        q: "Is it better to make extra payments or invest the money?",
        a: "Paying extra on the mortgage earns you a guaranteed return equal to your interest rate, tax-free in most jurisdictions. Investing might earn more but is not guaranteed. At a 6.5% mortgage rate the guaranteed return is high enough that many people reasonably choose the mortgage; at 2.5% the case is much weaker.",
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
      "A car loan differs from a personal loan in one important way: the thing you are borrowing against loses value faster than you repay the debt. A new car typically drops 20% or more in its first year, while a 72-month loan has barely touched the principal by then. The result is negative equity — owing more than the car is worth — which is the single most common financial trap in vehicle buying. This calculator works from the real numbers rather than the sticker price: vehicle price less trade-in and down payment, plus sales tax and fees rolled into the loan, at the rate and term you are being offered. It returns the monthly payment, the amount actually financed, and the total interest, so you can see what the deal costs rather than only what it costs per month.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "The financed amount is the vehicle price, plus sales tax and fees, minus your trade-in value and down payment. That figure goes through the standard amortisation formula — M = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1) — with r the annual rate divided by twelve and n the term in months. Total interest is the sum of payments minus the amount financed.",
          "Because tax and fees are financed here rather than paid upfront, they accrue interest for the whole term. On a $2,500 tax bill at 7% over 60 months, that adds roughly $470 of interest to the deal — money paid for the privilege of not writing a cheque at signing.",
        ],
      },
      {
        h: "Why the monthly payment is the wrong number to negotiate",
        body: [
          "Dealers negotiate in monthly payments because it is the number buyers care about, and it is the easiest one to manipulate. Extending a term from 60 to 84 months can drop the payment by $100 while adding thousands in interest, and it does so without changing the price of the car at all.",
          "Negotiate the vehicle price, the trade-in value and the financing rate as three separate conversations, then use this calculator to see what monthly payment falls out. If the payment is wrong, the fix is a bigger down payment or a cheaper car — not a longer term.",
        ],
      },
      {
        h: "Negative equity and how long it lasts",
        body: [
          "With a small down payment and a long term, most buyers spend the first two to three years underwater. Selling or writing off the car during that window means paying the difference out of pocket, and rolling that shortfall into the next car loan is how people end up financing two vehicles at once.",
          "A 20% down payment and a term of 60 months or less usually keeps you close to break-even throughout. Gap insurance covers the difference if the car is written off while underwater, and is worth considering on any long-term loan with little money down.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter the vehicle price",
        text: "Use the negotiated out-the-door price, not the sticker. Add dealer fees separately if they are not included.",
      },
      {
        name: "Subtract trade-in and down payment",
        text: "Both reduce the amount financed directly, and therefore reduce interest across the whole term.",
      },
      {
        name: "Enter sales tax, rate and term",
        text: "Compare 48, 60 and 72 months. The monthly payment falls each time; watch what the total-interest row does.",
      },
    ],
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
      {
        q: "What is negative equity on a car loan?",
        a: "Owing more than the car is currently worth. It happens because cars depreciate faster than long loans amortise — typically 20% or more in year one against a loan that has repaid far less. It matters if you need to sell or the car is written off, since you owe the shortfall in cash.",
      },
      {
        q: "Should I take dealer financing or arrange my own?",
        a: "Get a quote from your own bank or credit union first, then let the dealer try to beat it. Dealer financing is sometimes genuinely cheaper thanks to manufacturer subsidy, but having an outside offer in hand is the only way to know. Never disclose your target monthly payment before the price is settled.",
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
      "Simple interest is charged on the original principal only, never on interest that has already accrued. That makes it grow in a straight line: the same amount is added every period, forever. It is the arithmetic behind most short-term consumer credit, car title loans, many bonds' coupon payments, and the classic textbook interest problem. It is also the honest baseline against which compound interest should be compared, because the gap between the two is the whole reason compounding matters. This calculator takes a principal, an annual rate and a period in years, and returns the interest earned or owed plus the final total. For anything longer than a few years, or anything where interest is reinvested rather than paid out, use compound interest instead — the difference over a decade is not small.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Interest = principal × annual rate × time in years. Total = principal + interest. There is no exponent anywhere in the formula, which is exactly what makes it simple: each year adds the same amount as the year before.",
          "Worked example on $10,000 at 5% for 3 years: interest is 10,000 × 0.05 × 3 = $1,500, and the total is $11,500. Every year contributes exactly $500, whether it is the first year or the thirtieth.",
          "Partial years work the same way. Six months at 5% on $10,000 is 10,000 × 0.05 × 0.5 = $250. This is why simple interest is standard for short-term lending, where compounding would barely change the answer anyway.",
        ],
      },
      {
        h: "Simple versus compound: how big is the gap?",
        body: [
          "On $10,000 at 5%, simple interest pays $500 a year indefinitely. Compound interest pays $500 in year one, $525 in year two, $551 in year three, and keeps accelerating.",
          "Over 3 years the difference is small — $1,500 against $1,576. Over 30 years it is enormous: $15,000 against $33,219. The gap widens with both rate and time, which is why the distinction is trivial on a six-month loan and decisive on a retirement account.",
        ],
      },
      {
        h: "Where you will actually meet simple interest",
        body: [
          "Short-term personal and payday loans, car title loans, and many auto loans in practice, since the balance is recalculated each month and interest does not compound on unpaid interest if you pay on time. Bond coupons are also simple: a bond paying 5% on $1,000 pays $50 a year regardless of how long you hold it.",
          "It also appears in legal and tax contexts — statutory interest on late payments and judgment debts is frequently defined as simple. If a rate is quoted without stating a compounding frequency, simple interest is the safe assumption.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter the principal",
        text: "The original amount lent, borrowed or invested. Simple interest never adds to this base.",
      },
      {
        name: "Enter the annual rate",
        text: "As a percentage. If the rate is quoted for a different period, convert it to annual first.",
      },
      {
        name: "Enter the time in years",
        text: "Decimals are fine — 0.5 for six months, 1.25 for fifteen months.",
      },
    ],
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
      {
        q: "How do I calculate simple interest for months instead of years?",
        a: "Convert the months to a fraction of a year and use that as the time input. Nine months is 0.75. The formula is unchanged: principal × rate × 0.75.",
      },
      {
        q: "Is my savings account simple or compound interest?",
        a: "Almost certainly compound — banks credit interest monthly or quarterly and it starts earning interest itself. Simple interest on savings is rare enough that if a product advertises it, that is usually a warning rather than a feature.",
      },
      {
        q: "Which is better for a borrower?",
        a: "Simple interest, always. It costs less than compound interest at the same nominal rate, and the gap grows with the length of the loan. When comparing loan offers, check the compounding frequency as well as the rate — two loans at 8% are not the same loan if one compounds monthly and the other does not compound at all.",
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
      "Compound interest is interest earned on interest already earned, and it is the reason a modest amount saved consistently over decades outperforms a large amount saved late. The mechanism is simple — each period's interest joins the principal and starts earning too — but the effect is exponential rather than linear, which is genuinely hard to intuit. Most people substantially underestimate long-run growth as a result. This calculator takes a starting balance, an optional monthly contribution, an annual rate, a compounding frequency and a time horizon, then shows the final balance, how much of it you contributed, and how much the interest generated on its own. That last split is the one worth looking at: over long horizons the interest component routinely exceeds everything you put in.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "The lump sum grows by A = P × (1 + r/n)^(n×t), where P is the principal, r the annual rate, n the compounding periods per year and t the years. Monthly contributions are handled by the future value of an annuity, which sums each deposit's own growth over the time it has left to compound. The two are added for the final balance.",
          "Worked example on $10,000 at 7% compounded annually for 20 years, with no contributions: 10,000 × 1.07²⁰ = $38,697. You contributed $10,000; compounding produced the other $28,697.",
          "Add $200 a month to the same scenario and the final balance rises to roughly $126,000. Your total contributions are $58,000, so interest supplied around $68,000 — more than you put in. That crossover is what people mean by letting money work.",
        ],
      },
      {
        h: "Time matters far more than rate",
        body: [
          "Doubling the return from 7% to 14% on a 20-year horizon multiplies the outcome by about 3.5. Doubling the horizon from 20 to 40 years at 7% multiplies it by about 15. Time is the dominant variable, and it is the one you cannot buy back later.",
          "This is the argument for starting early with whatever you can rather than waiting until you can afford more. Someone investing $200 a month from age 25 to 35 and then stopping ends up ahead of someone investing the same amount from 35 to 65, purely because the first ten years had thirty more years to compound.",
        ],
      },
      {
        h: "Compounding frequency is mostly a distraction",
        body: [
          "Moving from annual to daily compounding on $10,000 at 7% over 20 years takes the result from $38,697 to $40,489 — a 4.6% improvement. Real, but trivial next to the effect of contributing more or waiting longer.",
          "The rule of 72 is the useful mental shortcut here: divide 72 by the annual return to get the approximate years to double. At 7% that is a bit over ten years. At 3% it is twenty-four. Inflation compounds against you by exactly the same mechanism, which is why a nominal return below the inflation rate loses money in real terms no matter how impressive the balance looks.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter your starting balance",
        text: "Whatever you already have invested. Zero is fine if you are starting from contributions alone.",
      },
      {
        name: "Add a monthly contribution",
        text: "Regular deposits usually dominate the outcome over long horizons. Try changing this before changing the rate.",
      },
      {
        name: "Set the rate and time horizon",
        text: "Use a realistic long-run return rather than a recent one. Then look at the interest-earned row, not just the total.",
      },
    ],
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
      {
        q: "What return rate should I assume?",
        a: "Use a long-run figure rather than recent performance. Broad equity markets have historically returned somewhere around 7% a year after inflation over multi-decade periods, though with severe variation along the way. For a cash savings account, use the actual advertised rate. Assuming a rate you cannot achieve is the fastest way to make a plan that fails.",
      },
      {
        q: "Does inflation affect these results?",
        a: "Yes, and the figures here are nominal. Inflation compounds against you by the same mechanism, so a balance that looks large in thirty years buys less than the number suggests. Subtract your inflation assumption from the return rate to model growth in today's money instead.",
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
      "There are two ways to think about paying off a debt, and this calculator does both. The first is the ordinary one: you know the term you want, and you need the monthly payment that clears the balance in that time. The second runs the other way and is far more useful for existing debt: you know what you can afford to pay, and you want to know how long it will take and what it will cost. That second mode is where credit card balances become clear. Paying the minimum on a card often means decades of payments and interest exceeding the original balance, while adding a modest fixed amount each month can cut the payoff period to a fraction. Switch between the two modes to see both sides of the same debt.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "In fixed-term mode the payment comes from the amortisation formula: M = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), with r the monthly rate and n the number of months.",
          "In fixed-payment mode the same relationship is solved for n instead: n = −log(1 − P×r/M) / log(1+r). If the monthly payment is less than or equal to the interest accruing each month, there is no solution — the balance never falls, and the debt is mathematically permanent.",
          "Worked example on $8,000 at 19.99%: paying $200 a month clears it in about 56 months with roughly $3,200 of interest. Paying $300 clears it in 32 months with about $1,600. Half again the payment, half the interest, and two years of your life back.",
        ],
      },
      {
        h: "Why minimum payments are designed the way they are",
        body: [
          "Credit card minimums are typically set as a small percentage of the balance, often 1% to 3% plus that month's interest. Because the percentage applies to a falling balance, the required payment falls too, which stretches the payoff over an extraordinarily long period.",
          "The practical fix is to fix the payment. Choose an amount above the current minimum and keep paying exactly that as the balance drops. This one change converts a shrinking-payment schedule into a fixed-payment one and typically cuts years off the term without any increase in what you pay this month.",
        ],
      },
      {
        h: "Which debt to attack first",
        body: [
          "Mathematically, pay the highest interest rate first — it costs the most per dollar owed. This is the avalanche method and it minimises total interest.",
          "Behaviourally, paying the smallest balance first produces a cleared debt sooner, which some people find far easier to sustain. This is the snowball method, and it costs a little more in interest in exchange for a higher chance of finishing. Run both here and see how large the difference actually is for your numbers — it is often smaller than expected, in which case the method you will actually stick to is the right one.",
        ],
      },
    ],
    steps: [
      {
        name: "Pick your mode",
        text: "Fixed term if you know how long you want to take. Fixed payment if you know what you can afford.",
      },
      {
        name: "Enter the balance and rate",
        text: "For a credit card, use the purchase APR from your statement — cash advance and balance transfer rates differ.",
      },
      {
        name: "Compare two or three payment levels",
        text: "The point of fixed-payment mode is the comparison. Add $50 or $100 and watch what happens to both the term and the total interest.",
      },
    ],
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
      {
        q: "How long will it take to pay off my credit card?",
        a: "Switch to fixed-payment mode and enter your balance, APR and what you can pay monthly. Paying only the minimum on a typical card balance often takes well over a decade; a fixed payment slightly above the minimum usually cuts that by more than half.",
      },
      {
        q: "Should I pay off the highest rate or the smallest balance first?",
        a: "Highest rate first costs less in total interest. Smallest balance first clears a debt sooner and is easier to sustain. Run both — for most people the interest difference is smaller than expected, and the method you will actually finish is the better one.",
      },
      {
        q: "Does a balance transfer help?",
        a: "It can, if the promotional rate is genuinely low and you clear the balance before it expires. Factor in the transfer fee, usually 3% to 5% of the amount, and be aware that new purchases on the card may not get the promotional rate. Enter the post-transfer balance including the fee here to see the real payoff.",
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
      "An amortisation schedule is the year-by-year record of what your loan payments actually do. Every payment is the same size, but its composition changes continuously: at the start it is mostly interest, at the end it is mostly principal. The schedule makes that visible, and it answers questions a single monthly-payment figure cannot — how much you will still owe in five years, when you cross the halfway point on the balance, and how much interest you will have paid by any given date. This calculator produces the full schedule alongside the summary figures. The pattern it reveals is the same for every fixed-rate loan, from a mortgage to a car loan, and understanding it is what makes decisions about extra payments and refinancing tractable rather than guesswork.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "The payment is fixed by the amortisation formula and never changes. Each month, interest = current balance × monthly rate. Principal = payment − interest. The new balance is the old balance minus that principal, and the process repeats until the balance reaches zero.",
          "Worked example on $200,000 at 6% over 30 years: the monthly payment is about $1,199. In month one, interest is 200,000 × 0.005 = $1,000, so only $199 goes to principal. In month 360, interest is about $6 and principal about $1,193.",
          "The crossover — the month where principal first exceeds interest — comes far later than most people expect. On this loan it is around year 18 of 30. Until then, more than half of every payment is rent on the money.",
        ],
      },
      {
        h: "What the schedule tells you that the payment does not",
        body: [
          "After five years on that $200,000 loan you will have paid roughly $72,000 and reduced the balance to about $186,000. Around $58,000 of what you paid was interest. This is the number that matters when deciding whether to move, refinance, or sell in the near term.",
          "It also explains why refinancing resets a clock. Taking a fresh 30-year loan ten years into an existing one returns you to the interest-heavy part of the curve, so a lower rate can still mean more total interest. Compare total remaining interest, not the monthly payment, when evaluating a refinance.",
        ],
      },
      {
        h: "Where extra payments do the most work",
        body: [
          "An extra payment applied to principal removes that amount from the balance permanently, so it saves every future month's interest on it. Early in the loan that is decades of avoided interest; late in the loan it is a few months.",
          "On the $200,000 example, one extra $1,199 payment in year one saves around $3,900 of interest over the life of the loan and shortens it by about a month. The same payment in year 25 saves under $200. If you intend to overpay, front-load it.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter the loan amount, rate and term",
        text: "The same three inputs as any loan calculation. The schedule is derived from them.",
      },
      {
        name: "Read the yearly breakdown",
        text: "Each row shows interest paid, principal repaid and the remaining balance for that year.",
      },
      {
        name: "Find your own horizon",
        text: "If you expect to sell or refinance in five years, read that row. The remaining balance there is what you will owe, and the interest paid to date is what the period actually cost you.",
      },
    ],
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
      {
        q: "When does principal start exceeding interest?",
        a: "Later than most people expect. On a 30-year loan at 6%, the crossover is around year 18. At a lower rate it comes sooner; at a higher rate, later. Until that point, more than half of every payment is interest.",
      },
      {
        q: "How much will I owe after five years?",
        a: "Read the year-five row of the schedule. On a $200,000 loan at 6% over 30 years you will have paid about $72,000 and still owe roughly $186,000 — the balance falls by about 7% in the first sixth of the term.",
      },
      {
        q: "Does refinancing restart the amortisation?",
        a: "Yes, if you take a fresh full-length term. That returns you to the interest-heavy start of the curve, so a lower rate does not automatically mean less total interest. Compare remaining total interest on your current loan against total interest on the proposed one, rather than comparing monthly payments.",
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
      "Retirement planning reduces to two numbers: what you will have accumulated by the time you stop working, and what monthly income that pot can sustain afterwards. This calculator produces both. The accumulation half compounds your current savings and monthly contributions forward to your retirement age. The withdrawal half converts that balance into a sustainable monthly income using a withdrawal rate you can set. The second number is the one that matters, and it is usually smaller than people anticipate — a seven-figure balance sounds like security until you divide it across a thirty-year retirement. Because the projection runs across decades, small changes to the contribution amount and the retirement age move the result far more than any plausible change in investment return.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "The accumulation phase compounds your current balance forward at the expected return, and separately compounds each monthly contribution for the time it has remaining. Those two are added to give the projected balance at retirement.",
          "The income phase applies a withdrawal rate to that balance and divides by twelve. A 4% rate on a $1,000,000 balance gives $40,000 a year, or about $3,333 a month.",
          "Worked example: age 30, $50,000 saved, $500 a month, 7% return, retiring at 65. The existing balance grows to roughly $534,000 over 35 years. The contributions add roughly $830,000. Projected balance around $1,364,000, supporting about $4,550 a month at a 4% withdrawal rate.",
        ],
      },
      {
        h: "Where the 4% rule comes from, and its limits",
        body: [
          "The 4% figure comes from research into historical US market returns suggesting that withdrawing 4% of the initial balance, adjusted for inflation each year, survived a 30-year retirement in nearly all historical periods.",
          "It is a rule of thumb, not a guarantee. It assumes a particular asset mix, a 30-year horizon, and market behaviour resembling the past. Retiring early lengthens the horizon and argues for a lower rate; a pension or state benefit covering base expenses argues for a higher one. Treat it as a starting point to adjust, not a constant.",
        ],
      },
      {
        h: "The two levers that actually move the number",
        body: [
          "Contribution amount and years of compounding dominate everything else. Adding $200 a month to the example above raises the projected balance by roughly $330,000. Retiring at 67 instead of 65 adds two more years of contributions and growth while shortening the withdrawal period from both ends.",
          "Return rate matters too, but it is the one input you do not control. Planning around an optimistic return is how projections quietly fail; planning around a higher contribution is how they succeed. If the number here falls short, change what you save before you change what you assume.",
          "Everything shown is in nominal terms. Over 35 years inflation substantially reduces what a given monthly income buys, so either subtract your inflation assumption from the return rate, or read the final income figure as future dollars rather than today's.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter your age and target retirement age",
        text: "The gap between them is your compounding runway, and it is the most powerful input on the page.",
      },
      {
        name: "Add current savings and monthly contribution",
        text: "Include employer matching in the monthly figure if you receive it — it compounds identically.",
      },
      {
        name: "Set the return and withdrawal rate",
        text: "Use a conservative long-run return. Start at a 4% withdrawal rate and lower it if you plan to retire early.",
      },
    ],
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
      {
        q: "Is the 4% rule still safe?",
        a: "It is a historical rule of thumb, not a law. It was derived from a 30-year US retirement horizon and a particular asset mix. Retiring early lengthens the horizon and argues for 3% to 3.5%; a pension covering base expenses lets you go higher. Adjust the withdrawal rate here to match your own situation.",
      },
      {
        q: "Does this account for inflation?",
        a: "No — the projection is nominal. Over a 35-year horizon inflation substantially erodes what a given monthly income buys. To model in today's money, subtract your inflation assumption from the expected return rate.",
      },
      {
        q: "What about state pensions and social security?",
        a: "Not included. Any guaranteed retirement income reduces how much your own portfolio has to cover, sometimes dramatically. Work out your expected monthly need, subtract expected state or employer pension income, and treat the remainder as the target this calculator should meet.",
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
      "This projects what an investment becomes over time: a starting amount, plus whatever you add each month, growing at an expected annual return. The output separates the final balance into what you contributed and what the market supplied, which is the split most worth seeing. Over short horizons contributions dominate and the return rate barely matters. Over long ones the relationship inverts, and growth on growth becomes the larger share. Where this differs from a pure compound interest calculation is in what you should assume: investment returns are not a fixed rate but a long-run average around which individual years vary enormously. A projection at 7% does not mean 7% every year — it means something closer to a plausible average across decades, with substantial losses in some of them.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "The initial amount grows as FV = P × (1 + r)ᵗ, where r is the annual return and t the years. Monthly contributions are treated as an annuity, with each deposit compounding for the time remaining after it is made. The two components are summed for the projected value.",
          "Worked example: $10,000 initial, $300 a month, 7% return, 25 years. The lump sum grows to about $54,300. The contributions total $90,000 and grow to about $243,000. Projected value roughly $297,000, of which $100,000 is money you put in.",
          "Shorten that to 10 years and the picture reverses: contributions of $36,000 against total growth of around $17,000. Time is what shifts the balance between the two.",
        ],
      },
      {
        h: "Average return is not annual return",
        body: [
          "Broad equity markets have historically averaged somewhere around 7% to 10% a year before inflation over multi-decade periods. Individual years look nothing like that — losses above 20% and gains above 30% both occur, sometimes consecutively.",
          "This matters because sequence risk is real. Two portfolios with identical average returns can end at very different values if one suffers its bad years while the balance is large. Regular contributions actually help here, since they buy more units when prices are low — but a projection using a smooth rate always looks tidier than the path it represents.",
        ],
      },
      {
        h: "What the projection ignores",
        body: [
          "Fees, taxes and inflation. An annual fund fee of 1% does not sound like much, but over 25 years at a 7% gross return it removes roughly a fifth of the final balance — the fee compounds against you exactly as returns compound for you.",
          "Taxes depend on the account and jurisdiction: tax-sheltered accounts change the outcome substantially. And every figure here is nominal, so the purchasing power of the final balance is materially lower than the number suggests. Subtract your assumptions for fees and inflation from the return rate to model the real outcome.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter your starting amount",
        text: "What you have invested today. Zero is fine if you are starting from monthly contributions alone.",
      },
      {
        name: "Set the monthly contribution",
        text: "Over long horizons this usually matters more than the return rate. Try changing it first.",
      },
      {
        name: "Choose a return rate and horizon",
        text: "Use a conservative long-run figure, then subtract about 1% for fees to see a more realistic net outcome.",
      },
    ],
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
      {
        q: "How much do fees affect the result?",
        a: "More than almost anyone expects. A 1% annual fee against a 7% gross return removes roughly a fifth of the final balance over 25 years, because the fee compounds against you just as returns compound for you. The simplest way to model it is to subtract the fee from the return rate before running the projection.",
      },
      {
        q: "Is this the same as a compound interest calculator?",
        a: "The arithmetic is identical. The difference is in what the rate means: interest is contractual and known, investment return is a long-run average with severe year-to-year variation. Treat the output as a central estimate rather than a forecast.",
      },
      {
        q: "Should I invest a lump sum or spread it out?",
        a: "Historically, investing a lump sum immediately has beaten spreading it out more often than not, simply because markets rise more often than they fall. Spreading it reduces the risk of investing everything just before a decline, at the cost of some expected return. This calculator models a lump sum plus regular additions, which is what most people actually do.",
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
      "Inflation is compounding in reverse. The same mechanism that makes savings grow makes money shrink, and because it works quietly at a few percent a year, its long-run effect is consistently underestimated. At 3% annual inflation, money loses roughly half its purchasing power over 24 years — so a salary, a pension, or a fixed sum set aside for the future buys about half as much by the time you reach it. This calculator projects that erosion. Enter an amount, an inflation rate and a number of years, and it shows what that money will effectively be worth in today's terms, and what you would need in future money to match today's purchasing power. Both directions are useful: the first for judging a fixed future sum, the second for setting a target that will still mean something when you get there.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Future purchasing power = amount ÷ (1 + rate)ʸ, where rate is annual inflation and y the number of years. Running it the other way, the amount needed to preserve today's purchasing power = amount × (1 + rate)ʸ.",
          "Worked example on $10,000 at 3% over 20 years: 10,000 ÷ 1.03²⁰ = $5,537. The same shopping basket that costs $10,000 today would cost $18,061 in twenty years, which is the reverse calculation on the same numbers.",
          "The rule of 72 works here too, in reverse. Divide 72 by the inflation rate to find the years until money halves in value: 24 years at 3%, 14 years at 5%, and just 7 years at 10%.",
        ],
      },
      {
        h: "Why this changes how you read a return rate",
        body: [
          "A savings account paying 2% during a period of 3% inflation loses 1% a year in real terms, no matter how the balance looks on the statement. Nominal growth is not growth; only the gap between your return and inflation is.",
          "This is the strongest argument against holding long-term savings in cash. Over a working lifetime, the difference between a real return of roughly zero and a real return of 4% or 5% is the difference between preserving money and multiplying it.",
        ],
      },
      {
        h: "What rate to assume",
        body: [
          "Most developed-economy central banks target around 2%, and the long-run US average has been closer to 3%. Recent years have shown that it can spike well above target and stay there for a while, so 3% is a sensible planning default and higher figures are worth stress-testing against.",
          "Note also that headline inflation is an average across a basket of goods, and your personal rate may differ substantially. Housing, education and healthcare have historically risen faster than the general index in many countries, while consumer electronics have fallen. If your spending is concentrated in the fast-rising categories, the official figure understates your experience.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter the amount",
        text: "A sum of money today, or a fixed future amount you want to evaluate.",
      },
      {
        name: "Set the inflation rate",
        text: "3% is a reasonable long-run default. Try 5% as a stress test.",
      },
      {
        name: "Choose the number of years",
        text: "The effect is roughly linear over short periods and compounds noticeably beyond about ten years.",
      },
    ],
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
      {
        q: "How long until my money is worth half as much?",
        a: "Divide 72 by the inflation rate. At 3% that is about 24 years; at 5%, about 14; at 10%, about 7. This is the rule of 72 applied in reverse, and it is accurate enough for planning.",
      },
      {
        q: "Does inflation cancel out a pay rise?",
        a: "Partly, and sometimes entirely. A 3% rise during 3% inflation leaves your real income unchanged. Anything below the inflation rate is a real-terms pay cut regardless of how the number looks. Compare offers and raises against the inflation rate, not against zero.",
      },
      {
        q: "Why does my personal inflation feel higher than the official figure?",
        a: "Because the headline index averages a basket that may not resemble your spending. Housing, education and healthcare have historically risen faster than the general index in many countries, while electronics have fallen. If your budget is weighted toward the former, your lived rate is genuinely higher than the published one.",
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
      "Sales tax calculations run in two directions and people routinely get the second one wrong. Adding tax to a price is easy: multiply by one plus the rate. Extracting tax from a total that already includes it is where the common error lives — subtracting the tax percentage from the total gives the wrong answer, because the percentage was applied to the smaller pre-tax figure, not to the total. This calculator handles both. Enter a net price to get the tax and the gross total, or enter a tax-inclusive total to recover the base price and the tax component. The same arithmetic applies to VAT, GST, and any other percentage levied on a sale, which makes this useful well beyond the United States — the name differs by country, the calculation does not.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Adding tax: tax = net × rate, and total = net × (1 + rate). Removing tax: net = total ÷ (1 + rate), and tax = total − net.",
          "Worked example at 8.875%. Adding: a $100.00 item incurs $8.88 of tax for a total of $108.88. Removing: a $108.88 total divided by 1.08875 gives $100.00 net and $8.88 tax.",
          "The mistake to avoid is taking 8.875% of $108.88, which gives $9.66 — off by 78 cents, and the error grows with both the rate and the amount. At a 20% VAT rate, taking 20% of a gross figure overstates the tax by a sixth.",
        ],
      },
      {
        h: "Why the reverse calculation trips people up",
        body: [
          "The percentage is always applied to the pre-tax price. Once tax is included, that price is no longer the number in front of you, so the percentage no longer corresponds to any share of the total you can see.",
          "The shortcut worth remembering: at a 20% rate, the tax is one sixth of the gross, not one fifth. At 10% it is one eleventh. The general form is rate ÷ (1 + rate) of the gross — which is what dividing by (1 + rate) does for you.",
        ],
      },
      {
        h: "Sales tax, VAT and GST are not the same thing",
        body: [
          "US sales tax is levied once, at the point of retail sale, and is normally quoted separately from the shelf price — the total at the register is higher than the tag. It is set by state and often by county and city too, so the combined rate varies within a single metropolitan area.",
          "VAT and GST are collected at each stage of production with credits along the chain, and in most countries the advertised price already includes them. The consumer-facing arithmetic is identical, but the expectation is reversed: in Europe or Australia the price you see is the price you pay, which is why the reverse calculation is the one that gets used there.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter the amount",
        text: "Either a pre-tax price or a tax-inclusive total, depending on which direction you need.",
      },
      {
        name: "Enter the tax rate",
        text: "Use your combined state and local rate for US sales tax, or the applicable VAT or GST rate elsewhere.",
      },
      {
        name: "Read the matching row",
        text: "The calculator shows both directions, so pick the one whose input you supplied.",
      },
    ],
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
      {
        q: "Why can't I just subtract the tax percentage from the total?",
        a: "Because the percentage was applied to the smaller pre-tax price, not to the total. Taking 20% off a gross figure removes more than the tax that was added. The correct extraction is rate ÷ (1 + rate) of the gross — at 20% that is one sixth, not one fifth.",
      },
      {
        q: "Does this work for VAT and GST?",
        a: "Yes — the arithmetic is identical. The practical difference is that VAT and GST prices are usually advertised inclusive, so you will mostly want the reverse calculation, whereas US sales tax is added at the register and you will mostly want the forward one.",
      },
      {
        q: "What sales tax rate should I use?",
        a: "Your combined rate, which stacks state, county and city components. Two addresses a few miles apart can differ by more than a percentage point, and the rate that applies is generally the one where the buyer takes delivery rather than where the seller is based.",
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
    intro:
      "A tip calculator does two things at once: works out the gratuity on a bill, and divides the result across however many people are paying. Doing it in one step avoids the usual table-side confusion where someone calculates the tip, someone else divides the bill, and the two never quite reconcile. Enter the bill, choose a tip percentage, and set the number of people — the calculator returns the tip amount, the total including tip, and the per-person share. Tipping convention varies enormously by country, and it is one of the few areas where getting the arithmetic right matters less than knowing the local norm. In much of Europe and Asia a service charge is already on the bill and an additional 15% is not expected; in the United States it very much is.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Tip = bill × tip percentage. Total = bill + tip. Per person = total ÷ number of people.",
          "Worked example on an $86.40 bill at 18% split three ways: the tip is $15.55, the total is $101.95, and each person pays $33.98.",
          "The mental shortcut for 20% is to move the decimal one place left and double it: 10% of $86.40 is $8.64, so 20% is $17.28. For 15%, take that 10% figure and add half of it again — $8.64 plus $4.32 gives $12.96.",
        ],
      },
      {
        h: "Should you tip on the pre-tax or post-tax total?",
        body: [
          "Convention in the United States is to tip on the pre-tax bill, since sales tax is not part of the service. In practice many people tip on the total because it is the number printed largest, and the difference on an $86 bill at 9% tax is around $1.40.",
          "Card terminals that suggest tip amounts frequently calculate them on the post-tax total, which quietly raises the effective rate. If you want to tip exactly 18% of the food and drink, enter the pre-tax figure here rather than accepting the suggested button.",
        ],
      },
      {
        h: "Tipping norms differ sharply by country",
        body: [
          "In the United States, 15% to 20% for table service is standard and staff wages are structured on the assumption that it will be paid. Below 15% is read as a complaint. Bars, taxis and hairdressers have their own conventions.",
          "In most of continental Europe, service is included by law or custom and rounding up or leaving 5% to 10% is generous rather than expected. In Japan and South Korea tipping is not customary and can cause genuine awkwardness. In much of Southeast Asia a 10% service charge often appears on the bill already — check for it before adding more.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter the bill amount",
        text: "Use the pre-tax subtotal if you want to tip on the food and drink only, which is the conventional basis.",
      },
      {
        name: "Choose a tip percentage",
        text: "15% to 20% for US table service. Check whether a service charge is already included before tipping elsewhere.",
      },
      {
        name: "Set the number of people",
        text: "The per-person row divides the total including tip, so everyone contributes their share of both.",
      },
    ],
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
      {
        q: "Do I tip on the total before or after tax?",
        a: "Convention is before tax, since tax is not part of the service. Card terminals often suggest amounts based on the post-tax total, which raises the effective rate slightly. Enter the pre-tax subtotal here if you want to tip on the food and drink alone.",
      },
      {
        q: "How do I work out a 20% tip in my head?",
        a: "Move the decimal point one place left to get 10%, then double it. On $86.40 that is $8.64, so 20% is $17.28. For 15%, take the 10% figure and add half again.",
      },
      {
        q: "Should I tip if a service charge is already on the bill?",
        a: "Usually not, or only a small rounding-up. A service charge is the establishment collecting gratuity on your behalf. Adding a full tip on top means paying twice — common in tourist areas where visitors do not notice the line item.",
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
      "A discount calculator answers what you actually pay, and the second, more useful question of what the advertised percentage really amounts to once more than one discount is involved. Stacked discounts are the common trap: 25% off followed by an extra 10% off is not 35% off. The second reduction applies to the already-reduced price, so the true combined discount is 32.5%. Retailers rely on the intuition being wrong. This calculator handles a single discount or two stacked ones, showing the final price, the amount saved and the effective total discount as a percentage of the original. That last figure is the one to compare offers on, because it is the only number that makes 'extra 10% off sale items' comparable with a flat reduction.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "A single discount: sale price = original × (1 − discount). Two stacked discounts: sale price = original × (1 − first) × (1 − second). The effective total discount is 1 − (1 − first) × (1 − second).",
          "Worked example on a $200 item at 25% off then a further 10% off: 200 × 0.75 = $150, then 150 × 0.90 = $135. You saved $65, which is 32.5% of the original — not the 35% the two percentages suggest.",
          "The order does not matter. Applying 10% first and 25% second gives the same $135, because multiplication commutes. This is worth knowing when a cashier applies coupons in an order you did not expect.",
        ],
      },
      {
        h: "Why stacked discounts are always worth less than they sound",
        body: [
          "The shortfall grows with the size of the discounts. 10% plus 10% gives 19%, not 20% — a small gap. 50% plus 50% gives 75%, not 100%, which is the extreme case that makes the principle obvious.",
          "The general rule: stacked discounts always total less than their sum, and the gap is the product of the two rates. For 25% and 10%, that is 0.25 × 0.10 = 2.5 percentage points, exactly the difference between the intuitive 35% and the real 32.5%.",
        ],
      },
      {
        h: "Comparing offers that are not in the same form",
        body: [
          "Convert everything to an effective percentage off the original price. A '$50 off $200' offer is 25%. 'Buy one get one half price' on two identical items is 25% off the pair. 'Buy two get one free' is 33.3% off three.",
          "Once every offer is expressed that way, they are directly comparable, and the largest headline number frequently is not the best deal. This matters most where a percentage discount is offered against a price that was recently raised — the effective saving against the genuine market price may be nothing at all.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter the original price",
        text: "The pre-discount price, before any reductions are applied.",
      },
      {
        name: "Enter the first discount",
        text: "As a percentage. For a fixed-amount offer, divide the amount by the original price to get the equivalent percentage.",
      },
      {
        name: "Add a second discount if one applies",
        text: "The calculator stacks it multiplicatively and reports the effective combined discount, which is the number to compare offers on.",
      },
    ],
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
      {
        q: "Does the order of two discounts matter?",
        a: "No. Multiplication commutes, so 25% then 10% gives exactly the same final price as 10% then 25%. If a cashier applies coupons in an unexpected order, the total is unaffected.",
      },
      {
        q: "How do I convert a fixed-amount discount to a percentage?",
        a: "Divide the amount saved by the original price. $50 off a $200 item is 50 ÷ 200 = 25%. Doing this makes fixed-amount and percentage offers directly comparable.",
      },
      {
        q: "What is 'buy one get one free' as a percentage?",
        a: "50% off two items. 'Buy one get one half price' is 25% off the pair, and 'buy two get one free' is 33.3% off three. Converting multi-buy offers to an effective percentage is the only reliable way to compare them against a straight discount.",
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
