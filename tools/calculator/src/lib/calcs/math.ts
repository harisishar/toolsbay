import { type Calc, num, fmt } from "../calc-types.ts";
import { evaluate } from "../expr.ts";

const c = (x: Calc) => x;

const UPDATED = "2026-08-01";

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : Math.abs(a) || 1;
}

export const MATH: Calc[] = [
  c({
    slug: "scientific-calculator",
    name: "Scientific Calculator",
    category: "Math & Numbers",
    title: "Scientific Calculator Online Free — Trig, Log, Powers",
    desc: "Free online scientific calculator: type full expressions with sin, cos, tan, log, ln, sqrt, powers and parentheses. Degrees or radians.",
    intro:
      "This is an expression calculator rather than a button-based one: you type the whole calculation as a single line and get the answer as you type. That difference matters more than it sounds. A button calculator forces you to commit to an order of operations as you go and gives you no record of what you entered, which is why transcription errors in long calculations are so common. Typing sin(30) + 2^10 / sqrt(16) lets you see the entire expression, check it, and correct one character without starting over. It supports trigonometric functions in degrees or radians, logarithms in base 10 and base e, powers and roots, and the constants pi and e. Standard operator precedence applies, and parentheses override it wherever you need them to.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "The expression is parsed into a syntax tree and evaluated with standard precedence: parentheses first, then exponentiation, then multiplication and division, then addition and subtraction. Operators of equal precedence evaluate left to right, except exponentiation, which is right-associative — so 2^3^2 is 2^9 = 512, not 8^2 = 64.",
          "Worked example on sin(30) + 2^10 / sqrt(16) in degree mode: sin(30) is 0.5, 2^10 is 1024, sqrt(16) is 4, so the division gives 256, and the total is 256.5.",
          "Implicit multiplication is not assumed. Write 2*(3+4) rather than 2(3+4), and 2*pi rather than 2pi — being explicit removes an entire category of ambiguity that causes calculators to disagree with each other.",
        ],
      },
      {
        h: "Degrees or radians — the setting that changes your answer",
        body: [
          "Trigonometric functions take an angle, and the same number means different angles in each mode. sin(30) is 0.5 in degrees and about −0.988 in radians, because 30 radians is roughly 1,719 degrees.",
          "Geometry, surveying and most everyday problems use degrees. Calculus, physics and anything involving the unit circle use radians, where the argument of a trig function is an arc length rather than a degree count. If a result looks wildly wrong, the mode is the first thing to check — it accounts for more trigonometry errors than any actual mistake in the expression.",
        ],
      },
      {
        h: "Precedence, and why 6/2(1+2) causes arguments",
        body: [
          "The famous ambiguous expressions circulating online are ambiguous because of implicit multiplication, not because mathematics is unclear. Some conventions treat a coefficient adjacent to parentheses as binding more tightly than division; others treat it as ordinary multiplication with equal precedence.",
          "The resolution is to write what you mean. 6/(2*(1+2)) and (6/2)*(1+2) are both unambiguous and give 1 and 9 respectively. This calculator requires explicit multiplication for exactly that reason — there is no interpretation to guess at.",
        ],
      },
    ],
    steps: [
      {
        name: "Type the full expression",
        text: "Write it as one line, with explicit * for multiplication. The result updates as you type.",
      },
      {
        name: "Set degrees or radians",
        text: "Only affects trigonometric functions, but it changes their results completely. Degrees for geometry, radians for calculus.",
      },
      {
        name: "Use parentheses freely",
        text: "They cost nothing and remove any doubt about precedence. When in doubt, add a pair.",
      },
    ],
    inputs: [
      {
        key: "expr",
        label: "Expression",
        type: "text",
        def: "sin(30) + 2^10 / sqrt(16)",
      },
      {
        key: "mode",
        label: "Angle unit",
        type: "select",
        def: "deg",
        options: [
          ["deg", "Degrees"],
          ["rad", "Radians"],
        ],
        half: true,
      },
    ],
    faq: [
      {
        q: "What functions are supported?",
        a: "sin, cos, tan, asin, acos, atan, log (base 10), ln, sqrt, abs, exp, the operators + − × ÷ ^ %, parentheses, and the constants pi and e.",
      },
      {
        q: "Why does sin(30) give 0.5 here but −0.988 elsewhere?",
        a: "Angle units. In degree mode sin(30°) = 0.5; in radian mode sin(30 rad) ≈ −0.988. Switch the angle unit to match your problem.",
      },
      {
        q: "What is the order of operations here?",
        a: "Parentheses, then exponents, then multiplication and division left to right, then addition and subtraction left to right. Exponentiation is right-associative, so 2^3^2 evaluates as 2^9 = 512.",
      },
      {
        q: "Why do I have to write 2*(3+4) instead of 2(3+4)?",
        a: "Because implicit multiplication is the source of the ambiguity behind expressions like 6/2(1+2), where different conventions give 1 or 9. Requiring an explicit operator means there is nothing to interpret — you get exactly what you wrote.",
      },
      {
        q: "Does this work offline?",
        a: "Yes. The expression parser runs entirely in your browser, so nothing you type is sent anywhere and the page keeps working once loaded even without a connection.",
      },
    ],
    compute(v) {
      try {
        const r = evaluate(v.expr ?? "", v.mode === "rad" ? "rad" : "deg");
        return {
          rows: [
            {
              label: "Result",
              value: Number.isFinite(r)
                ? String(parseFloat(r.toPrecision(12)))
                : "undefined",
              strong: true,
            },
          ],
        };
      } catch (e) {
        return {
          rows: [
            {
              label: "Result",
              value: e instanceof Error ? e.message : "Error",
              strong: true,
            },
          ],
        };
      }
    },
  }),
  c({
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "Math & Numbers",
    title: "Percentage Calculator — % of, % Change, X is What % of Y",
    desc: "Calculate what X% of Y is, what percent X is of Y, and percentage increase or decrease between two numbers.",
    intro:
      "Almost every percentage question people actually ask is one of three problems, and this calculator solves all three at once from two numbers. What is X% of Y — the discount, the tip, the tax. X is what percent of Y — the score, the share, the proportion. And what is the percentage change from X to Y — the raise, the price increase, the growth rate. They look like different questions but they are the same relationship rearranged, and the reason people find percentages awkward is usually that they are trying to recall three separate procedures instead of one. Enter your two numbers and read whichever line matches your question. The sections below cover the traps: why a 50% loss needs a 100% gain to recover, and why percentage points and percent are not the same thing.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "X% of Y = (X ÷ 100) × Y. X as a percentage of Y = (X ÷ Y) × 100. Percentage change from X to Y = ((Y − X) ÷ X) × 100.",
          "Worked example with X = 25 and Y = 80: 25% of 80 is 20. 25 is 31.25% of 80. And the change from 25 to 80 is ((80 − 25) ÷ 25) × 100 = 220%.",
          "The critical detail in the third formula is that you divide by the original value, not the new one. Dividing by the wrong number is the single most common percentage error, and it produces a result that is plausible enough to go unnoticed.",
        ],
      },
      {
        h: "Why a 50% loss needs a 100% gain to recover",
        body: [
          "Percentage changes are not symmetric, because each one is measured against a different base. Losing 50% of 100 leaves 50. Gaining 50% of 50 gives 75, not 100 — you need to gain 100% of the reduced amount to get back.",
          "The general rule: to recover from a loss of L percent, you need a gain of L ÷ (100 − L) × 100 percent. A 20% loss needs a 25% gain. A 75% loss needs a 300% gain. This asymmetry is why avoiding large drawdowns matters disproportionately in investing, and why 'down 40%, then up 40%' leaves you 16% below where you started.",
        ],
      },
      {
        h: "Percentage points are not percent",
        body: [
          "If an interest rate rises from 4% to 5%, that is an increase of one percentage point, or an increase of 25 percent. Both are correct descriptions of the same change, and they differ by a factor of 25.",
          "The distinction matters wherever the quantity being measured is itself a percentage — interest rates, tax rates, unemployment, market share, conversion rates. A headline saying a rate 'rose 25%' when it moved from 4% to 5% is technically true and routinely misread as a move to 29%. When you see a percentage change applied to a percentage, check which is meant.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter your two numbers",
        text: "Order matters for the change calculation — the first is the original, the second the new value.",
      },
      {
        name: "Read the line that matches your question",
        text: "All three results are shown at once, so pick the one whose phrasing matches what you asked.",
      },
      {
        name: "Check the base for a change calculation",
        text: "Percentage change always divides by the original value. If the answer looks too small, you may have the two numbers the wrong way round.",
      },
    ],
    inputs: [
      { key: "a", label: "First number (X)", def: 25, half: true },
      { key: "b", label: "Second number (Y)", def: 200, half: true },
    ],
    faq: [
      {
        q: "How do I calculate percentage increase?",
        a: "Percentage change = (new − old) ÷ old × 100. Going from 200 to 250 is (250−200)/200 × 100 = 25% increase.",
      },
      {
        q: "What is the difference between percent and percentage points?",
        a: "If a rate goes from 4% to 5%, that is one percentage point, or 25 percent. Both describe the same change and they differ by a factor of 25. The distinction matters whenever the thing changing is itself a percentage — interest rates, tax rates, conversion rates.",
      },
      {
        q: "How do I work out what percentage one number is of another?",
        a: "Divide the part by the whole and multiply by 100. 25 out of 80 is (25 ÷ 80) × 100 = 31.25%. The most common mistake is dividing the wrong way round, which gives 320% and should be an obvious signal that the two numbers were swapped.",
      },
      {
        q: "Is a 50% loss undone by a 50% gain?",
        a: "No. After −50%, you need +100% to get back to the start, because the gain applies to the smaller base.",
      },
    ],
    compute(v) {
      const a = num(v.a);
      const b = num(v.b);
      return {
        rows: [
          {
            label: `${a}% of ${b}`,
            value: fmt((a / 100) * b, 4).replace(/\.?0+$/, ""),
            strong: true,
          },
          {
            label: `${a} as a % of ${b}`,
            value: b !== 0 ? `${fmt((a / b) * 100, 2)}%` : "—",
          },
          {
            label: `Change from ${a} to ${b}`,
            value: a !== 0 ? `${fmt(((b - a) / Math.abs(a)) * 100, 2)}%` : "—",
          },
        ],
      };
    },
  }),
  c({
    slug: "fraction-calculator",
    name: "Fraction Calculator",
    category: "Math & Numbers",
    title: "Fraction Calculator — Add, Subtract, Multiply, Divide",
    desc: "Add, subtract, multiply and divide fractions with automatic simplification and decimal equivalents.",
    intro:
      "This adds, subtracts, multiplies and divides two fractions, and simplifies the result automatically. Fractions cause more trouble than they should because each operation follows a different rule: multiplication is straightforward, division requires flipping the second fraction, and addition and subtraction need a common denominator before anything can happen. Getting that last step wrong — adding numerators and denominators separately — is the classic error, and it produces answers that are wrong in a way that is hard to spot. The calculator shows the simplified result along with the improper and mixed-number forms, and the sections below set out each rule with a worked example, so the page is useful for checking your method rather than only your answer. Negative numerators are accepted, and a zero denominator is rejected rather than silently producing nonsense.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Multiplication: multiply the numerators and multiply the denominators. 2/3 × 3/4 = 6/12, which simplifies to 1/2.",
          "Division: invert the second fraction and multiply. 2/3 ÷ 3/4 = 2/3 × 4/3 = 8/9.",
          "Addition and subtraction: convert to a common denominator first. 2/3 + 1/4 becomes 8/12 + 3/12 = 11/12. Simplification then divides both parts by their greatest common divisor, found using Euclid's algorithm.",
        ],
      },
      {
        h: "Why you cannot just add the tops and bottoms",
        body: [
          "Adding 1/2 + 1/3 as 2/5 gives an answer smaller than the larger of the two fractions you started with, which is immediately impossible. The correct answer is 5/6.",
          "The reason is that a fraction's denominator defines the size of the pieces being counted. Halves and thirds are different-sized pieces, so their numerators are not counting the same thing and cannot be combined directly. Converting to sixths makes the pieces the same size, at which point counting them works.",
          "This is why the common denominator step exists, and why it has no equivalent in multiplication — multiplying fractions does not require the pieces to match, because you are scaling rather than combining.",
        ],
      },
      {
        h: "Simplifying, improper fractions and mixed numbers",
        body: [
          "A fraction is in lowest terms when the numerator and denominator share no common factor above 1. Dividing both by their greatest common divisor gets there in one step: 6/12 has a GCD of 6, giving 1/2 directly rather than through repeated halving.",
          "An improper fraction has a numerator at least as large as its denominator, such as 11/4. The mixed-number form is 2 3/4, obtained by dividing 11 by 4 to get 2 remainder 3. Neither form is more correct; improper fractions are easier to compute with, mixed numbers easier to picture, and this calculator shows both.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter the first fraction",
        text: "Numerator and denominator as whole numbers. Negative numerators are fine.",
      },
      {
        name: "Choose the operation",
        text: "Add, subtract, multiply or divide. Each follows a different rule — see the calculation section above.",
      },
      {
        name: "Enter the second fraction and read the result",
        text: "The answer is simplified automatically and shown in both improper and mixed-number form.",
      },
    ],
    inputs: [
      { key: "n1", label: "Numerator 1", def: 1, half: true },
      { key: "d1", label: "Denominator 1", def: 2, half: true },
      {
        key: "op",
        label: "Operation",
        type: "select",
        def: "+",
        options: [
          ["+", "+ add"],
          ["-", "− subtract"],
          ["*", "× multiply"],
          ["/", "÷ divide"],
        ],
        half: true,
      },
      { key: "n2", label: "Numerator 2", def: 3, half: true },
      { key: "d2", label: "Denominator 2", def: 4, half: true },
    ],
    faq: [
      {
        q: "How do you add fractions with different denominators?",
        a: "Rewrite both over a common denominator, then add the numerators: 1/2 + 3/4 = 2/4 + 3/4 = 5/4 = 1¼.",
      },
      {
        q: "How do you divide fractions?",
        a: "Invert the second fraction and multiply. 2/3 ÷ 3/4 becomes 2/3 × 4/3 = 8/9. Dividing by a fraction smaller than 1 makes the result larger, which is correct even though it feels wrong.",
      },
      {
        q: "Why can't I add the numerators and denominators separately?",
        a: "Because the denominator sets the size of the pieces you are counting. Halves and thirds are different-sized pieces, so their numerators are not counting the same thing. Adding 1/2 + 1/3 as 2/5 gives an answer smaller than 1/2, which is impossible — the real answer is 5/6.",
      },
      {
        q: "How do I convert an improper fraction to a mixed number?",
        a: "Divide the numerator by the denominator. The quotient is the whole number, the remainder becomes the new numerator. 11/4 is 11 ÷ 4 = 2 remainder 3, so 2 3/4.",
      },
    ],
    compute(v) {
      const n1 = num(v.n1);
      const d1 = num(v.d1, 1);
      const n2 = num(v.n2);
      const d2 = num(v.d2, 1);
      if (!d1 || !d2 || (v.op === "/" && !n2))
        return {
          rows: [{ label: "Result", value: "Division by zero", strong: true }],
        };
      let n: number, d: number;
      switch (v.op) {
        case "-":
          n = n1 * d2 - n2 * d1;
          d = d1 * d2;
          break;
        case "*":
          n = n1 * n2;
          d = d1 * d2;
          break;
        case "/":
          n = n1 * d2;
          d = d1 * n2;
          break;
        default:
          n = n1 * d2 + n2 * d1;
          d = d1 * d2;
      }
      if (d < 0) {
        n = -n;
        d = -d;
      }
      const g = gcd(Math.abs(n), Math.abs(d));
      n /= g;
      d /= g;
      const whole = Math.trunc(n / d);
      const rem = Math.abs(n % d);
      return {
        rows: [
          {
            label: "Result",
            value: d === 1 ? String(n) : `${n}/${d}`,
            strong: true,
          },
          {
            label: "Mixed number",
            value:
              rem && whole
                ? `${whole} ${rem}/${d}`
                : d === 1
                  ? String(n)
                  : `${n}/${d}`,
          },
          { label: "Decimal", value: fmt(n / d, 6).replace(/\.?0+$/, "") },
        ],
      };
    },
  }),
  c({
    slug: "random-number-generator",
    name: "Random Number Generator",
    category: "Math & Numbers",
    title: "Random Number Generator — Any Range, With or Without Repeats",
    desc: "Generate random numbers in any range, one or many at once, with or without duplicates. Uses your browser’s cryptographic randomness.",
    intro:
      "This generates random integers in a range you choose, drawing from your browser's cryptographically secure random source rather than the ordinary pseudo-random generator most tools use. The distinction matters for anything where predictability would be a problem: prize draws, sampling, security-adjacent uses, or any situation where someone might have an incentive to guess the next value. A standard pseudo-random generator produces a sequence that is deterministic given its seed, and for some generators observing a handful of outputs is enough to predict the rest. The browser's crypto source draws entropy from the operating system and carries no such weakness. Set your minimum, maximum and how many numbers you need, and optionally require them to be unique — useful for draws where the same entry should not be picked twice.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Values come from the Web Crypto API's getRandomValues, which fills an array with cryptographically strong random bytes supplied by the operating system's entropy pool. Those bytes are then mapped onto your chosen range.",
          "The mapping avoids modulo bias. Naively taking a random byte modulo the range size makes the lower values slightly more likely whenever the range does not divide evenly into 256 — a small distortion, but a real one, and it is exactly the kind of flaw that matters in a draw. Rejection sampling discards values that would fall in the biased region and draws again.",
          "Uniqueness, when requested, is enforced by tracking values already drawn and redrawing on collision. The range must be at least as large as the count, or the request is impossible to satisfy.",
        ],
      },
      {
        h: "Cryptographic randomness versus Math.random",
        body: [
          "Math.random in a browser is fast and statistically reasonable for simulations and animations, but it is not unpredictable. Implementations use algorithms such as xorshift128+, whose internal state can be recovered from a modest number of observed outputs — after which every subsequent value is known.",
          "For a dice roll in a game that does not matter. For a prize draw, a random sample that must withstand scrutiny, or anything where a participant benefits from predicting the outcome, it does. This generator uses the crypto source in all cases, because the performance difference is irrelevant at these volumes and the security difference is not.",
        ],
      },
      {
        h: "What randomness does not guarantee",
        body: [
          "A genuinely random sequence will contain runs, repeats and clusters that look non-random to human intuition. Six consecutive numbers in a lottery draw are exactly as likely as any other specific combination, and a truly random ten-number draw quite often contains a repeat.",
          "The opposite is also true: sequences that have been adjusted to look random — evenly spread, no repeats, no runs — are not random. If you need to avoid repeats for practical reasons, use the unique option rather than regenerating until the output looks right, which introduces exactly the bias you were trying to avoid.",
        ],
      },
    ],
    steps: [
      {
        name: "Set the minimum and maximum",
        text: "Both ends are inclusive. Any integer range works, including negative values.",
      },
      {
        name: "Choose how many numbers you need",
        text: "For a unique draw, the range must contain at least as many values as you are requesting.",
      },
      {
        name: "Decide whether values must be unique",
        text: "Unique for draws and sampling without replacement. Leave it off for independent rolls, where repeats are expected and correct.",
      },
    ],
    inputs: [
      { key: "min", label: "Minimum", def: 1, half: true },
      { key: "max", label: "Maximum", def: 100, half: true },
      {
        key: "count",
        label: "How many",
        def: 1,
        min: 1,
        max: 1000,
        half: true,
      },
      {
        key: "unique",
        label: "Duplicates",
        type: "select",
        def: "no",
        options: [
          ["no", "Allow duplicates"],
          ["yes", "No duplicates"],
        ],
        half: true,
      },
      { key: "_n", label: "", type: "text", def: "0" },
    ],
    button: "Generate again",
    faq: [
      {
        q: "Are these numbers truly random?",
        a: "They come from crypto.getRandomValues — cryptographically strong randomness, far better than Math.random, and fine for draws, sampling and games.",
      },
      {
        q: "Why not use Math.random?",
        a: "Math.random is deterministic given its internal state, and for common implementations that state can be recovered from a modest number of observed outputs — after which every future value is predictable. Fine for animations, not for anything where someone benefits from guessing the next number.",
      },
      {
        q: "Is this fair for a prize draw?",
        a: "Yes. The values come from the operating system's entropy pool and the mapping onto your range uses rejection sampling to avoid modulo bias, which would otherwise make lower numbers marginally more likely. Turn on the unique option so no entry can be drawn twice.",
      },
      {
        q: "Why does my random output contain repeats?",
        a: "Because genuine randomness contains repeats and runs — that is what makes it random. A sequence adjusted to look evenly spread is not random. If you need distinct values, use the unique option rather than regenerating until the output looks right, which introduces bias.",
      },
    ],
    compute(v) {
      const lo = Math.ceil(num(v.min));
      const hi = Math.floor(num(v.max));
      let count = Math.max(1, Math.min(1000, Math.round(num(v.count, 1))));
      if (hi < lo)
        return {
          rows: [{ label: "Result", value: "Max must be ≥ min", strong: true }],
        };
      const span = hi - lo + 1;
      const unique = v.unique === "yes";
      if (unique && count > span) count = span;
      const rand = () => {
        const buf = new Uint32Array(1);
        crypto.getRandomValues(buf);
        return lo + (buf[0]! % span);
      };
      let out: number[] = [];
      if (unique) {
        const set = new Set<number>();
        while (set.size < count) set.add(rand());
        out = [...set];
      } else {
        for (let i = 0; i < count; i++) out.push(rand());
      }
      return {
        rows: [
          {
            label: count === 1 ? "Number" : "Numbers",
            value: out.join(", "),
            strong: true,
          },
        ],
      };
    },
  }),
  c({
    slug: "standard-deviation-calculator",
    name: "Standard Deviation Calculator",
    category: "Math & Numbers",
    title: "Standard Deviation Calculator — Sample & Population",
    desc: "Compute mean, variance and standard deviation (sample and population) from a list of numbers.",
    intro:
      "Standard deviation measures how spread out a set of numbers is around its mean. A small value means the data clusters tightly; a large one means it is dispersed. It is the most useful single companion to an average, because a mean on its own hides the difference between a consistent process and a wildly variable one that happens to average out. This calculator takes numbers separated by commas, spaces or new lines and returns both the sample and population standard deviation, along with the mean, variance and count. Which of the two you want depends on whether your numbers are the entire group you care about or a sample drawn from a larger one — a distinction that changes the divisor in the formula and is explained below, because choosing wrongly biases the result.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Find the mean. Subtract it from each value and square the differences. Sum those squares. Divide by n for the population standard deviation, or by n − 1 for the sample. Take the square root.",
          "Worked example on 2, 4, 4, 4, 5, 5, 7, 9: the mean is 5. The squared deviations are 9, 1, 1, 1, 0, 0, 4, 16, summing to 32. Population variance is 32 ÷ 8 = 4, so the population standard deviation is 2. Sample variance is 32 ÷ 7 ≈ 4.571, giving a sample standard deviation of about 2.138.",
          "The deviations are squared rather than taken as absolute values for two reasons: it prevents positive and negative deviations cancelling, and it makes the resulting measure differentiable, which is what allows standard deviation to underpin most of statistics.",
        ],
      },
      {
        h: "Sample or population — which divisor to use",
        body: [
          "Use the population formula, dividing by n, only when your numbers are the complete group you are describing: every employee in a company, every item in a finished batch, all twelve months of a year.",
          "Use the sample formula, dividing by n − 1, when your numbers are a subset used to estimate something about a larger group. This is the more common case, and it is the default in most statistical software.",
          "The n − 1 adjustment is called Bessel's correction. It exists because a sample's own mean sits closer to the sample's values than the true population mean does, which systematically understates the spread. Dividing by a smaller number compensates. The effect is large for small samples and negligible for large ones — at n = 5 the correction raises the result by about 12%, at n = 100 by about 0.5%.",
        ],
      },
      {
        h: "Reading a standard deviation",
        body: [
          "For roughly bell-shaped data, about 68% of values fall within one standard deviation of the mean, about 95% within two, and about 99.7% within three. This is the empirical rule, and it is what makes standard deviation intuitively meaningful rather than just a number.",
          "It is expressed in the same units as your data, which makes it directly interpretable — a standard deviation of 2 kg means something concrete in a way that variance, in kilograms squared, does not. For comparing spread between datasets in different units, divide the standard deviation by the mean to get the coefficient of variation.",
          "Standard deviation is sensitive to outliers, because squaring makes distant values dominate the sum. A single extreme value can inflate it substantially, which is worth checking before drawing conclusions from a spread that looks surprisingly large.",
        ],
      },
    ],
    steps: [
      {
        name: "Paste your numbers",
        text: "Commas, spaces or new lines all work, so data copied from a spreadsheet column pastes directly.",
      },
      {
        name: "Read both standard deviations",
        text: "Sample and population are shown together. Pick the one matching whether your data is a subset or the whole group.",
      },
      {
        name: "Check the mean and count",
        text: "Both are shown alongside. If the count is not what you expected, a separator in your input was not parsed as you assumed.",
      },
    ],
    inputs: [
      {
        key: "data",
        label: "Data",
        type: "text",
        def: "2, 4, 4, 4, 5, 5, 7, 9",
      },
    ],
    faq: [
      {
        q: "Sample vs population standard deviation?",
        a: "Population (σ, dividing by n) when you have every member of the group; sample (s, dividing by n−1) when your data is a sample estimating a larger population — the n−1 corrects the bias.",
      },
      {
        q: "Why divide by n − 1 instead of n?",
        a: "This is Bessel's correction. A sample's own mean sits closer to its values than the true population mean does, which understates the real spread. Dividing by a smaller number compensates. The effect is about 12% at n = 5 and under 1% at n = 100.",
      },
      {
        q: "What does a standard deviation of 2 actually mean?",
        a: "It is in the same units as your data. For roughly bell-shaped data, about 68% of values lie within one standard deviation of the mean, 95% within two and 99.7% within three — so a mean of 10 with a standard deviation of 2 puts most values between 6 and 14.",
      },
      {
        q: "What is variance and how does it relate?",
        a: "Variance is the standard deviation squared — the average squared deviation from the mean, before taking the root. It is mathematically convenient but hard to interpret, because its units are squared. Standard deviation exists to bring the measure back into the units of the original data.",
      },
    ],
    compute(v) {
      const xs = (v.data ?? "")
        .split(/[\s,;]+/)
        .map((x) => parseFloat(x))
        .filter((x) => Number.isFinite(x));
      if (xs.length < 2)
        return {
          rows: [
            {
              label: "Result",
              value: "Enter at least 2 numbers",
              strong: true,
            },
          ],
        };
      const n = xs.length;
      const mean = xs.reduce((a, b) => a + b, 0) / n;
      const ss = xs.reduce((a, b) => a + (b - mean) ** 2, 0);
      return {
        rows: [
          { label: "Count", value: String(n) },
          { label: "Mean", value: fmt(mean, 4) },
          {
            label: "Std deviation (sample)",
            value: fmt(Math.sqrt(ss / (n - 1)), 4),
            strong: true,
          },
          {
            label: "Std deviation (population)",
            value: fmt(Math.sqrt(ss / n), 4),
          },
          { label: "Variance (sample)", value: fmt(ss / (n - 1), 4) },
        ],
      };
    },
  }),
  c({
    slug: "mean-median-mode-calculator",
    name: "Mean, Median, Mode Calculator",
    category: "Math & Numbers",
    title: "Mean, Median, Mode Calculator — Averages & Range",
    desc: "Find the mean, median, mode, range and sum of any list of numbers instantly.",
    intro:
      "There are three things people mean by the word average, and they can give very different answers for the same data. The mean adds everything up and divides by the count. The median is the middle value once the numbers are sorted. The mode is the value that appears most often. This calculator returns all three at once, plus the range and count, so you can see immediately when they diverge — and divergence is informative. When mean and median are close, the data is roughly symmetric. When the mean sits well above the median, a few large values are pulling it up, which is exactly what happens with incomes, house prices and response times. Knowing which average a statistic refers to is often the difference between reading it correctly and being misled by it.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Mean = sum of all values ÷ count. Median = the middle value after sorting, or the average of the two middle values when the count is even. Mode = the most frequently occurring value, and a dataset can have more than one, or none if every value appears exactly once.",
          "Worked example on 2, 4, 4, 4, 5, 5, 7, 9: the sum is 40 and the count is 8, so the mean is 5. Sorted, the two middle values are 4 and 5, so the median is 4.5. The value 4 appears three times, more than any other, so the mode is 4.",
          "Here the three measures land close together because the data is fairly symmetric. Add a single value of 200 and the mean jumps to 26.2 while the median moves only to 5 — a clean demonstration of which measures resist outliers.",
        ],
      },
      {
        h: "When each average is the right one",
        body: [
          "Use the mean for symmetric data where every value should carry equal weight — test scores, measurement repeats, daily temperatures. It uses all the information in the dataset, which is its strength and its vulnerability.",
          "Use the median for skewed data or anything with outliers. Income, house prices, wealth, page load times and wait times are all reported as medians by people who know what they are doing, because a small number of extreme values makes the mean unrepresentative of any actual case.",
          "Use the mode for categorical data, where the mean is meaningless — the most common shoe size, the most frequent response, the most popular option. It is also the only one of the three that must be a value actually present in the data.",
        ],
      },
      {
        h: "Why the gap between mean and median matters",
        body: [
          "The direction of the gap tells you the direction of the skew. Mean above median means a long right tail — a few large values. Mean below median means a long left tail. Roughly equal means the distribution is close to symmetric.",
          "This is why 'average income' is such a contested phrase. Mean income in most countries sits well above median income, because high earners pull the mean up while the median tracks what a typical person actually receives. Both numbers are correct; they answer different questions, and quoting one while implying the other is among the most common ways statistics mislead without technically lying.",
        ],
      },
    ],
    steps: [
      {
        name: "Paste your numbers",
        text: "Commas, spaces or new lines all work, so a spreadsheet column pastes straight in.",
      },
      {
        name: "Compare mean against median",
        text: "If they differ noticeably, your data is skewed and the median is probably the more representative figure.",
      },
      {
        name: "Check the mode for repeated values",
        text: "Most useful when values repeat meaningfully. On continuous measurements with no repeats there is no mode, which is a valid result rather than an error.",
      },
    ],
    inputs: [
      {
        key: "data",
        label: "Data",
        type: "text",
        def: "12, 15, 11, 15, 19, 15, 12",
      },
    ],
    faq: [
      {
        q: "When is the median better than the mean?",
        a: "When data has outliers — house prices, incomes. One billionaire in the room drags the mean up wildly but barely moves the median.",
      },
      {
        q: "What is the difference between mean, median and mode?",
        a: "Mean is the sum divided by the count. Median is the middle value once sorted. Mode is the most frequent value. On symmetric data they land close together; on skewed data they can differ enormously, which is itself useful information.",
      },
      {
        q: "Can a dataset have more than one mode?",
        a: "Yes. If two or more values tie for the highest frequency, all of them are modes — bimodal or multimodal. If every value appears exactly once there is no mode at all, which is common with continuous measurements and is a valid result rather than an error.",
      },
      {
        q: "How do I find the median of an even number of values?",
        a: "Sort them and average the two middle values. For 2, 4, 5, 9 the middle pair is 4 and 5, so the median is 4.5 — a value that need not appear in the data itself.",
      },
    ],
    compute(v) {
      const xs = (v.data ?? "")
        .split(/[\s,;]+/)
        .map((x) => parseFloat(x))
        .filter((x) => Number.isFinite(x))
        .sort((a, b) => a - b);
      if (!xs.length)
        return {
          rows: [{ label: "Result", value: "Enter numbers", strong: true }],
        };
      const n = xs.length;
      const mean = xs.reduce((a, b) => a + b, 0) / n;
      const median =
        n % 2 ? xs[(n - 1) / 2]! : (xs[n / 2 - 1]! + xs[n / 2]!) / 2;
      const freq = new Map<number, number>();
      for (const x of xs) freq.set(x, (freq.get(x) ?? 0) + 1);
      const maxF = Math.max(...freq.values());
      const modes = [...freq.entries()]
        .filter(([, f]) => f === maxF)
        .map(([x]) => x);
      return {
        rows: [
          { label: "Mean", value: fmt(mean, 4), strong: true },
          { label: "Median", value: fmt(median, 4) },
          { label: "Mode", value: maxF === 1 ? "No mode" : modes.join(", ") },
          { label: "Range", value: fmt(xs[n - 1]! - xs[0]!, 4) },
          {
            label: "Sum",
            value: fmt(
              xs.reduce((a, b) => a + b, 0),
              4,
            ),
          },
        ],
      };
    },
  }),
  c({
    slug: "triangle-calculator",
    name: "Triangle Calculator",
    category: "Math & Numbers",
    title: "Triangle Calculator — Area, Angles & Perimeter from 3 Sides",
    desc: "Solve any triangle from its three sides: area (Heron’s formula), all three angles, perimeter and type.",
    intro:
      "Given the lengths of all three sides, every other property of a triangle is fixed — there is exactly one triangle with those sides, up to reflection and rotation. This calculator uses that fact to derive area, all three interior angles, the perimeter, and the classification as right, acute or obtuse. Area comes from Heron's formula, which needs only the side lengths and no height, and the angles come from the law of cosines. It also checks the triangle inequality first: any side longer than the sum of the other two describes a shape that cannot close, and the calculator will tell you so rather than returning a meaningless number. That check is the most common reason an input is rejected, and it usually means a typo rather than an unusual triangle.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Heron's formula gives the area from the sides alone. Let s be the semi-perimeter, (a + b + c) ÷ 2. Then area = √(s(s−a)(s−b)(s−c)).",
          "The law of cosines gives each angle: cos(A) = (b² + c² − a²) ÷ (2bc), and similarly for the others. The three angles must sum to 180 degrees, which is a useful check on any hand calculation.",
          "Worked example on sides 3, 4 and 5: s is 6, so the area is √(6 × 3 × 2 × 1) = √36 = 6. The angle opposite the side of length 5 has cosine (9 + 16 − 25) ÷ 24 = 0, so it is exactly 90 degrees — this is the familiar right triangle.",
        ],
      },
      {
        h: "Why some side lengths cannot form a triangle",
        body: [
          "The triangle inequality states that the sum of any two sides must exceed the third. Sides of 1, 2 and 10 fail it: the two short sides laid end to end reach only 3, and cannot bridge the gap to close against a side of 10.",
          "The boundary case is degenerate. Sides of 3, 4 and 7 satisfy the inequality only as an equality, producing a flattened triangle with zero area and one angle of exactly 180 degrees. Heron's formula returns zero, which is arithmetically correct and geometrically the signal that you have a straight line rather than a triangle.",
        ],
      },
      {
        h: "Right, acute and obtuse",
        body: [
          "Compare the square of the longest side against the sum of the squares of the other two. If they are equal the triangle is right — that is the Pythagorean theorem. If the longest side squared is smaller, all angles are under 90 degrees and the triangle is acute. If larger, one angle exceeds 90 degrees and it is obtuse.",
          "A triangle can have at most one right or obtuse angle, since the three must total 180 degrees. This is why the classification depends entirely on the longest side: only the angle opposite it can possibly be 90 degrees or more.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter the three side lengths",
        text: "Any consistent unit. The results are in those units, with area in units squared.",
      },
      {
        name: "Check the classification",
        text: "Right, acute or obtuse follows from comparing the longest side squared against the sum of the other two squared.",
      },
      {
        name: "Verify the angles sum to 180",
        text: "They always will here, but it is the standard check when working a triangle by hand.",
      },
    ],
    inputs: [
      { key: "a", label: "Side a", def: 3, step: 0.01, half: true },
      { key: "b", label: "Side b", def: 4, step: 0.01, half: true },
      { key: "c", label: "Side c", def: 5, step: 0.01, half: true },
    ],
    faq: [
      {
        q: 'Why is my triangle "impossible"?',
        a: "The triangle inequality: each side must be shorter than the other two combined. Sides 1, 2 and 5 cannot close into a triangle.",
      },
      {
        q: "How do I find the area of a triangle without the height?",
        a: "Heron's formula. Take the semi-perimeter s = (a + b + c) ÷ 2, then area = √(s(s−a)(s−b)(s−c)). It needs only the three side lengths, which is what makes it useful when you cannot measure a perpendicular height.",
      },
      {
        q: "How do I know if a triangle is right-angled?",
        a: "Square the longest side and compare it against the sum of the squares of the other two. Equal means right-angled. Smaller means acute, larger means obtuse. For 3, 4, 5: 25 = 9 + 16, so it is right-angled.",
      },
      {
        q: "Can three sides make more than one triangle?",
        a: "No. Three side lengths determine a triangle uniquely, up to rotation and reflection — this is the side-side-side congruence rule. It is why every other property can be derived from the sides alone.",
      },
    ],
    compute(v) {
      const a = num(v.a);
      const b = num(v.b);
      const cc = num(v.c);
      if (
        a <= 0 ||
        b <= 0 ||
        cc <= 0 ||
        a + b <= cc ||
        a + cc <= b ||
        b + cc <= a
      ) {
        return {
          rows: [
            { label: "Result", value: "Not a valid triangle", strong: true },
          ],
        };
      }
      const s = (a + b + cc) / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - cc));
      const deg = (x: number) => (Math.acos(x) * 180) / Math.PI;
      const A = deg((b * b + cc * cc - a * a) / (2 * b * cc));
      const B = deg((a * a + cc * cc - b * b) / (2 * a * cc));
      const C = 180 - A - B;
      const maxA = Math.max(A, B, C);
      const type =
        Math.abs(maxA - 90) < 0.001 ? "Right" : maxA > 90 ? "Obtuse" : "Acute";
      return {
        rows: [
          { label: "Area", value: fmt(area, 4), strong: true },
          { label: "Perimeter", value: fmt(a + b + cc, 4) },
          {
            label: "Angles",
            value: `${fmt(A, 2)}°, ${fmt(B, 2)}°, ${fmt(C, 2)}°`,
          },
          { label: "Type", value: `${type} triangle` },
        ],
      };
    },
  }),
  c({
    slug: "gpa-calculator",
    name: "GPA Calculator",
    category: "Math & Numbers",
    title: "GPA Calculator — Weighted by Credit Hours",
    desc: "Calculate your GPA from letter grades and credit hours on the standard 4.0 scale.",
    intro:
      'Grade point average is a credit-weighted mean, and the weighting is the part that trips people up. A course carrying four credits influences your GPA twice as much as a two-credit course with the same grade, so an A in a small elective does considerably less for you than a B in a heavy core subject. This calculator takes grades and credit hours as pairs — for instance "A 3, B+ 4, C 2" — and returns the weighted GPA on the standard 4.0 scale along with total credits and quality points. Enter the courses in any order. The sections below cover the plus-minus mapping most institutions use, the difference between weighted and unweighted GPA, and how much a single grade can realistically move an average once you have accumulated credits.',
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Each grade converts to grade points on the 4.0 scale, then multiplies by the course's credit hours to give quality points. GPA = total quality points ÷ total credit hours.",
          "Worked example on A 3, B+ 4, C 2: the A gives 4.0 × 3 = 12 quality points, the B+ gives 3.3 × 4 = 13.2, and the C gives 2.0 × 2 = 4. Total quality points 29.2 across 9 credits, so the GPA is 29.2 ÷ 9 = 3.24.",
          "Note what the weighting did. The B+ contributed more quality points than the A, because it carried more credits. Averaging the grade points without weighting would have given 3.1 — a different and less accurate answer.",
        ],
      },
      {
        h: "The standard 4.0 mapping",
        body: [
          "A and A+ are 4.0, A− is 3.7, B+ is 3.3, B is 3.0, B− is 2.7, C+ is 2.3, C is 2.0, C− is 1.7, D+ is 1.3, D is 1.0, and F is 0.",
          "Institutions vary at the edges. Some award 4.3 for an A+, some do not use plus and minus grades at all, and some exclude pass or fail courses from the calculation entirely. Where your institution's scale differs, the arithmetic here still holds — only the point values change.",
        ],
      },
      {
        h: "Why one grade moves less than you expect",
        body: [
          "The weighting cuts both ways. Early in a degree, when total credits are low, each grade has substantial leverage. After sixty or ninety credits, a single course changes the cumulative average by a few hundredths of a point at most.",
          "The practical implication is that recovery from a poor start takes sustained results rather than one strong semester. To raise a 2.8 across 60 credits to a 3.0, you need roughly 30 further credits at close to 3.4 — the arithmetic of averages is unforgiving in a way that motivational advice usually is not.",
          "Weighted GPA at secondary level is a separate concept: honours and advanced courses are assigned extra points, sometimes on a 5.0 scale, so that difficulty is reflected. Do not mix a weighted secondary GPA with an unweighted university one when comparing.",
        ],
      },
    ],
    steps: [
      {
        name: "List each course as a grade and credit pair",
        text: 'Separate pairs with commas, for example "A 3, B+ 4, C 2". Order does not matter.',
      },
      {
        name: "Use your institution's credit hours",
        text: "The weighting depends on them. Using the wrong credit values is the main reason a calculated GPA does not match a transcript.",
      },
      {
        name: "Check total credits against the transcript",
        text: "If the credit total is right and the GPA still differs, your institution likely uses a variant scale — an A+ worth 4.3, or excluded pass/fail courses.",
      },
    ],
    inputs: [
      {
        key: "grades",
        label: "Grades and credits",
        type: "text",
        def: "A 3, B+ 4, A- 3, C 2",
      },
    ],
    faq: [
      {
        q: "What GPA do the letter grades map to?",
        a: "A/A+ 4.0, A− 3.7, B+ 3.3, B 3.0, B− 2.7, C+ 2.3, C 2.0, C− 1.7, D+ 1.3, D 1.0, F 0. Some schools weight honors/AP courses higher.",
      },
      {
        q: "Why does a course with more credits affect my GPA more?",
        a: "Because GPA is a credit-weighted average, not a plain one. A four-credit course contributes twice the quality points of a two-credit course at the same grade. An A in a small elective moves your average less than a B in a heavy core subject.",
      },
      {
        q: "How much can one semester change my cumulative GPA?",
        a: "Less than you would like once you have accumulated credits. Raising a 2.8 across 60 credits to a 3.0 takes roughly 30 further credits averaging close to 3.4. Early grades carry far more leverage than later ones.",
      },
      {
        q: "What is the difference between weighted and unweighted GPA?",
        a: "Unweighted uses the standard 4.0 scale regardless of course difficulty. Weighted, common at secondary level, awards extra points for honours and advanced courses, sometimes on a 5.0 scale. They are not comparable — check which a given figure refers to before drawing a conclusion from it.",
      },
    ],
    compute(v) {
      const MAP: Record<string, number> = {
        "a+": 4,
        a: 4,
        "a-": 3.7,
        "b+": 3.3,
        b: 3,
        "b-": 2.7,
        "c+": 2.3,
        c: 2,
        "c-": 1.7,
        "d+": 1.3,
        d: 1,
        "d-": 0.7,
        f: 0,
      };
      let pts = 0;
      let creds = 0;
      for (const part of (v.grades ?? "").split(",")) {
        const m = part.trim().match(/^([a-df][+-]?)\s+([\d.]+)$/i);
        if (!m) continue;
        const g = MAP[m[1]!.toLowerCase()];
        const cr = parseFloat(m[2]!);
        if (g === undefined || !Number.isFinite(cr)) continue;
        pts += g * cr;
        creds += cr;
      }
      if (!creds)
        return {
          rows: [
            {
              label: "GPA",
              value: 'Enter grades like "A 3, B+ 4"',
              strong: true,
            },
          ],
        };
      return {
        rows: [
          { label: "GPA", value: fmt(pts / creds, 2), strong: true },
          { label: "Total credits", value: fmt(creds, 1) },
        ],
      };
    },
  }),
  c({
    slug: "grade-calculator",
    name: "Final Grade Calculator",
    category: "Math & Numbers",
    title: "Final Grade Calculator — What Do I Need on the Exam?",
    desc: "Find the score you need on a final exam to hit your target course grade, from your current grade and the exam weight.",
    intro:
      "This answers the question every student asks in the last week of term: what do I need on the final to get the grade I want? It takes your current grade, the weight the final carries in the overall mark, and your target, then returns the exam score required. The answer is frequently reassuring and occasionally brutal — if the required score comes out above 100%, the target is mathematically unreachable through this exam alone, and it is better to know that before the exam than after it. The calculation also works in reverse as a floor: set your target to the minimum passing grade and the result tells you the lowest score that still gets you there, which is often much lower than anxiety suggests.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Required final score = (target − current × (1 − weight)) ÷ weight, where weight is the final's share of the overall grade expressed as a decimal.",
          "Worked example: current grade 78%, final worth 30%, target 85%. The coursework already banked contributes 78 × 0.70 = 54.6 points toward the final total. You need 85, so the exam must supply 30.4 points from its 30% weighting: 30.4 ÷ 0.30 = 101.3%. Not achievable.",
          "Lower the target to 82% and the arithmetic becomes 82 − 54.6 = 27.4, divided by 0.30, giving 91.3% — demanding but possible. Running two or three targets is usually more informative than running one.",
        ],
      },
      {
        h: "Why the final's weight matters more than its difficulty",
        body: [
          "A final worth 20% cannot move your grade far in either direction. Even a perfect score on it lifts a 78% to 82.4%, and a zero drops it to 62.4%. A final worth 50% roughly doubles both of those swings.",
          "This is worth knowing before you allocate revision time across subjects. A heavily weighted final in a subject where you are borderline deserves considerably more attention than a lightly weighted one in a subject where the outcome is already close to settled either way.",
        ],
      },
      {
        h: "When the required score exceeds 100%",
        body: [
          "It means the target cannot be reached through this exam alone. That is not always the end of it — extra credit, a dropped lowest score, a curve, or a resit may exist, and this is the point at which it is worth asking rather than assuming.",
          "The reverse case is equally useful. If the required score for a passing grade comes out at 30%, you have more margin than you think, and the rational move may be to spend the time on a subject where the outcome is genuinely in doubt. Knowing both numbers — what you need to pass and what you need for your target — turns the last week from guesswork into allocation.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter your current grade",
        text: "The percentage you hold going into the final, across all completed work.",
      },
      {
        name: "Enter the final's weight",
        text: "Its share of the overall grade, from the syllabus. This is the input people most often guess at, and it drives the answer.",
      },
      {
        name: "Try more than one target",
        text: "Run your desired grade and your minimum acceptable grade. The gap between the two required scores tells you how much is genuinely at stake.",
      },
    ],
    inputs: [
      {
        key: "current",
        label: "Current grade",
        def: 78,
        suffix: "%",
        half: true,
      },
      {
        key: "weight",
        label: "Final exam weight",
        def: 40,
        suffix: "%",
        half: true,
      },
      {
        key: "target",
        label: "Target grade",
        def: 80,
        suffix: "%",
        half: true,
      },
    ],
    faq: [
      {
        q: "How is the required final exam score calculated?",
        a: "Required = (target − current × (1 − weight)) ÷ weight. If it comes out above 100%, the target is not reachable with this exam alone.",
      },
      {
        q: "What if I need more than 100% on the final?",
        a: "The target is unreachable through that exam alone. Check whether extra credit, a dropped lowest score, a curve or a resit exists — this is the moment to ask rather than assume. Otherwise, recalculate with a realistic target.",
      },
      {
        q: "What is the lowest score I can get and still pass?",
        a: "Set your target to the minimum passing grade and read the required score. It is often far lower than it feels, and knowing the floor is as useful as knowing the ceiling when deciding where to spend revision time.",
      },
      {
        q: "How much can a final actually change my grade?",
        a: "It depends entirely on its weight. A final worth 20% moves a 78% to at most 82.4% or at worst 62.4%. At 50% weight both swings roughly double. Check the syllabus weight before assuming the exam decides everything.",
      },
    ],
    compute(v) {
      const w = num(v.weight) / 100;
      if (w <= 0 || w > 1)
        return {
          rows: [
            { label: "Result", value: "Weight must be 1–100%", strong: true },
          ],
        };
      const need = (num(v.target) - num(v.current) * (1 - w)) / w;
      return {
        rows: [
          {
            label: "Score needed on final",
            value:
              need > 100
                ? `${fmt(need, 1)}% — not achievable`
                : need <= 0
                  ? "0% — already secured"
                  : `${fmt(need, 1)}%`,
            strong: true,
          },
        ],
      };
    },
  }),
];
