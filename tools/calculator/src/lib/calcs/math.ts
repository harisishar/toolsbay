import { type Calc, num, fmt } from "../calc-types.ts";
import { evaluate } from "../expr.ts";

const c = (x: Calc) => x;

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
      "Type a whole expression — like sin(30) + 2^10 / sqrt(16) — and get the answer instantly. Supports trig (degrees or radians), logarithms, powers, and the constants pi and e.",
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
      "The three everyday percentage problems, solved at once from two numbers.",
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
      "Enter two fractions and an operation; the result is simplified automatically.",
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
      "Pick a range and how many numbers you need. Numbers come from the browser’s crypto-grade random source.",
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
    intro: "Paste numbers separated by commas, spaces or new lines.",
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
    intro: "Paste your numbers and get every common average at once.",
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
      "Enter three side lengths; get area, angles, perimeter, and whether the triangle is right, acute or obtuse.",
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
      'Enter grades and credits as pairs, e.g. "A 3, B+ 4, C 2" — GPA is the credit-weighted average on the 4.0 scale.',
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
      "Enter your current grade, the final’s weight, and your target — see the exam score you need.",
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
