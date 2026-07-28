import { type Calc, num, fmt } from "../calc-types.ts";

const c = (x: Calc) => x;

// Mifflin-St Jeor BMR
function bmr(sex: string, kg: number, cm: number, age: number): number {
  return 10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161);
}

const ACTIVITY: [string, string][] = [
  ["1.2", "Sedentary (little exercise)"],
  ["1.375", "Light (1–3 days/week)"],
  ["1.55", "Moderate (3–5 days/week)"],
  ["1.725", "Active (6–7 days/week)"],
  ["1.9", "Very active (physical job)"],
];

const sexInput = {
  key: "sex",
  label: "Sex",
  type: "select" as const,
  def: "male",
  options: [
    ["male", "Male"],
    ["female", "Female"],
  ] as [string, string][],
  half: true,
};

export const HEALTH: Calc[] = [
  c({
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "Health & Fitness",
    title: "BMI Calculator — Body Mass Index (Metric & Imperial)",
    desc: "Calculate your Body Mass Index from height and weight and see which WHO category you fall into. Free and instant.",
    intro:
      "BMI estimates body fatness from height and weight. It is a screening measure — muscular people can score “overweight” while lean — but it remains the standard population gauge.",
    inputs: [
      { key: "height", label: "Height (cm)", def: 170, half: true },
      { key: "weight", label: "Weight (kg)", def: 70, half: true },
    ],
    faq: [
      {
        q: "What is a healthy BMI?",
        a: "WHO categories: under 18.5 underweight, 18.5–24.9 normal, 25–29.9 overweight, 30+ obese. Some Asian populations use a lower overweight threshold of 23.",
      },
      {
        q: "Is BMI accurate for athletes?",
        a: "Not very — muscle is denser than fat, so muscular people often read “overweight” with low body fat. Waist circumference or a body-fat measurement is a better check.",
      },
    ],
    compute(v) {
      const h = num(v.height) / 100;
      const bmi = h > 0 ? num(v.weight) / (h * h) : 0;
      const cat =
        bmi < 18.5
          ? "Underweight"
          : bmi < 25
            ? "Normal weight"
            : bmi < 30
              ? "Overweight"
              : "Obese";
      const lo = 18.5 * h * h;
      const hi = 24.9 * h * h;
      return {
        rows: [
          { label: "BMI", value: fmt(bmi, 1), strong: true },
          { label: "Category", value: cat },
          {
            label: "Healthy weight range",
            value: `${fmt(lo, 1)}–${fmt(hi, 1)} kg`,
          },
        ],
      };
    },
  }),
  c({
    slug: "bmr-calculator",
    name: "BMR Calculator",
    category: "Health & Fitness",
    title: "BMR Calculator — Basal Metabolic Rate (Mifflin-St Jeor)",
    desc: "Calculate the calories your body burns at complete rest using the Mifflin-St Jeor equation, plus daily needs by activity level.",
    intro:
      "Your basal metabolic rate is the energy your body uses just to stay alive. This uses Mifflin-St Jeor, the equation most dietitians prefer.",
    inputs: [
      sexInput,
      { key: "age", label: "Age", def: 30, half: true },
      { key: "height", label: "Height (cm)", def: 170, half: true },
      { key: "weight", label: "Weight (kg)", def: 70, half: true },
    ],
    faq: [
      {
        q: "BMR vs TDEE — what is the difference?",
        a: "BMR is energy burned at complete rest. TDEE (total daily energy expenditure) multiplies BMR by an activity factor — that is the number to eat at to maintain weight.",
      },
    ],
    compute(v) {
      const b = bmr(v.sex ?? "male", num(v.weight), num(v.height), num(v.age));
      return {
        rows: [
          { label: "BMR", value: `${fmt(b, 0)} calories/day`, strong: true },
          ...ACTIVITY.map(([f, label]) => ({
            label: `TDEE — ${label.split(" (")[0]}`,
            value: `${fmt(b * parseFloat(f), 0)} cal`,
          })),
        ],
      };
    },
  }),
  c({
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    category: "Health & Fitness",
    title: "Calorie Calculator — Daily Needs & Weight Loss Targets",
    desc: "Calculate daily calories to maintain, lose or gain weight based on the Mifflin-St Jeor equation and your activity level.",
    intro:
      "Find your maintenance calories, then the daily targets for losing or gaining at a sustainable pace (±0.5 kg per week ≈ ±500 cal/day).",
    inputs: [
      sexInput,
      { key: "age", label: "Age", def: 30, half: true },
      { key: "height", label: "Height (cm)", def: 170, half: true },
      { key: "weight", label: "Weight (kg)", def: 70, half: true },
      {
        key: "activity",
        label: "Activity level",
        type: "select",
        def: "1.375",
        options: ACTIVITY,
      },
    ],
    faq: [
      {
        q: "How many calories should I cut to lose weight?",
        a: "A 500 cal/day deficit loses roughly 0.5 kg (1 lb) per week — a sustainable pace. Avoid eating below your BMR for extended periods without medical supervision.",
      },
      {
        q: "Why am I not losing weight at my calculated calories?",
        a: "Formulas estimate averages; individuals vary ±10–15%, and intake is easy to under-count. Track honestly for two weeks and adjust by 100–200 calories based on actual results.",
      },
    ],
    compute(v) {
      const tdee =
        bmr(v.sex ?? "male", num(v.weight), num(v.height), num(v.age)) *
        num(v.activity, 1.375);
      return {
        rows: [
          {
            label: "Maintain weight",
            value: `${fmt(tdee, 0)} cal/day`,
            strong: true,
          },
          { label: "Lose 0.5 kg/week", value: `${fmt(tdee - 500, 0)} cal/day` },
          {
            label: "Lose 1 kg/week",
            value: `${fmt(Math.max(1200, tdee - 1000), 0)} cal/day`,
          },
          { label: "Gain 0.5 kg/week", value: `${fmt(tdee + 500, 0)} cal/day` },
        ],
      };
    },
  }),
  c({
    slug: "body-fat-calculator",
    name: "Body Fat Calculator",
    category: "Health & Fitness",
    title: "Body Fat Calculator — US Navy Method",
    desc: "Estimate body fat percentage from tape measurements using the US Navy circumference method. No calipers needed.",
    intro:
      "The US Navy method estimates body fat from neck, waist (and for women, hip) measurements — accurate to within a few percent for most people.",
    inputs: [
      sexInput,
      { key: "height", label: "Height (cm)", def: 170, half: true },
      { key: "neck", label: "Neck (cm)", def: 37, half: true },
      { key: "waist", label: "Waist (cm)", def: 85, half: true },
      { key: "hip", label: "Hip (cm) — women only", def: 95, half: true },
    ],
    faq: [
      {
        q: "How do I measure correctly?",
        a: "Neck: just below the larynx, tape sloping slightly down at the front. Waist: at the navel for men, at the narrowest point for women, after a normal exhale. Hip (women): at the widest point.",
      },
      {
        q: "What is a healthy body fat percentage?",
        a: "Typical healthy ranges: men 10–20%, women 18–28%. Athletes run lower; essential fat is about 3% for men and 12% for women.",
      },
    ],
    compute(v) {
      const h = num(v.height);
      const log10 = Math.log10;
      let bf: number;
      if ((v.sex ?? "male") === "male") {
        bf =
          495 /
            (1.0324 -
              0.19077 * log10(num(v.waist) - num(v.neck)) +
              0.15456 * log10(h)) -
          450;
      } else {
        bf =
          495 /
            (1.29579 -
              0.35004 * log10(num(v.waist) + num(v.hip) - num(v.neck)) +
              0.221 * log10(h)) -
          450;
      }
      if (!Number.isFinite(bf) || bf < 2 || bf > 70) {
        return {
          rows: [
            {
              label: "Result",
              value: "Check measurements — out of range",
              strong: true,
            },
          ],
        };
      }
      return {
        rows: [
          { label: "Body fat", value: `${fmt(bf, 1)}%`, strong: true },
          {
            label: "Category",
            value:
              bf < (v.sex === "female" ? 14 : 6)
                ? "Essential fat"
                : bf < (v.sex === "female" ? 21 : 14)
                  ? "Athletic"
                  : bf < (v.sex === "female" ? 25 : 18)
                    ? "Fit"
                    : bf < (v.sex === "female" ? 32 : 25)
                      ? "Average"
                      : "Above average",
          },
        ],
      };
    },
  }),
  c({
    slug: "ideal-weight-calculator",
    name: "Ideal Weight Calculator",
    category: "Health & Fitness",
    title: "Ideal Weight Calculator — Four Standard Formulas",
    desc: "Estimate ideal body weight with the Devine, Robinson, Miller and Hamwi formulas plus the healthy BMI range.",
    intro:
      "Four classic formulas estimate “ideal” weight from height and sex. Treat the spread — not any single number — as the target zone.",
    inputs: [
      sexInput,
      { key: "height", label: "Height (cm)", def: 170, half: true },
    ],
    faq: [
      {
        q: "Why do the formulas disagree?",
        a: "Each was fitted to different clinical populations decades apart. The healthy-BMI range (18.5–24.9) is the more evidence-based guide; the formulas remain popular for medication dosing.",
      },
    ],
    compute(v) {
      const inches = num(v.height) / 2.54;
      const over60 = Math.max(0, inches - 60);
      const male = (v.sex ?? "male") === "male";
      const devine = (male ? 50 : 45.5) + 2.3 * over60;
      const robinson = (male ? 52 : 49) + (male ? 1.9 : 1.7) * over60;
      const miller = (male ? 56.2 : 53.1) + (male ? 1.41 : 1.36) * over60;
      const hamwi = (male ? 48 : 45.5) + (male ? 2.7 : 2.2) * over60;
      const h = num(v.height) / 100;
      return {
        rows: [
          {
            label: "Devine formula",
            value: `${fmt(devine, 1)} kg`,
            strong: true,
          },
          { label: "Robinson formula", value: `${fmt(robinson, 1)} kg` },
          { label: "Miller formula", value: `${fmt(miller, 1)} kg` },
          { label: "Hamwi formula", value: `${fmt(hamwi, 1)} kg` },
          {
            label: "Healthy BMI range",
            value: `${fmt(18.5 * h * h, 1)}–${fmt(24.9 * h * h, 1)} kg`,
          },
        ],
      };
    },
  }),
  c({
    slug: "pace-calculator",
    name: "Pace Calculator",
    category: "Health & Fitness",
    title: "Running Pace Calculator — Pace, Time & Race Predictions",
    desc: "Calculate running pace per km/mile from distance and time, with splits for 5K, 10K, half and full marathon.",
    intro:
      "Enter a distance and finish time to get your pace and equivalent times for common races.",
    inputs: [
      {
        key: "distance",
        label: "Distance (km)",
        def: 5,
        step: 0.01,
        half: true,
      },
      { key: "h", label: "Hours", def: 0, half: true },
      { key: "m", label: "Minutes", def: 27, half: true },
      { key: "s", label: "Seconds", def: 30, half: true },
    ],
    faq: [
      {
        q: "What is a good 5K pace?",
        a: "Recreational runners typically finish a 5K in 25–35 minutes (5:00–7:00 min/km). Sub-20 is a strong club-level time.",
      },
    ],
    compute(v) {
      const secs = num(v.h) * 3600 + num(v.m) * 60 + num(v.s);
      const d = num(v.distance);
      if (d <= 0 || secs <= 0)
        return { rows: [{ label: "Pace", value: "—", strong: true }] };
      const perKm = secs / d;
      const mmss = (s: number) =>
        `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
      const hms = (s: number) => {
        const hh = Math.floor(s / 3600);
        return `${hh ? hh + ":" : ""}${String(Math.floor((s % 3600) / 60)).padStart(hh ? 2 : 1, "0")}:${String(Math.round(s % 60)).padStart(2, "0")}`;
      };
      return {
        rows: [
          { label: "Pace per km", value: `${mmss(perKm)} /km`, strong: true },
          { label: "Pace per mile", value: `${mmss(perKm * 1.60934)} /mi` },
          { label: "Speed", value: `${fmt(d / (secs / 3600), 2)} km/h` },
          { label: "10K at this pace", value: hms(perKm * 10) },
          { label: "Half marathon", value: hms(perKm * 21.0975) },
          { label: "Marathon", value: hms(perKm * 42.195) },
        ],
      };
    },
  }),
  c({
    slug: "due-date-calculator",
    name: "Due Date Calculator",
    category: "Health & Fitness",
    title: "Pregnancy Due Date Calculator — Naegele’s Rule",
    desc: "Estimate your due date from the last menstrual period or conception date, with current week of pregnancy.",
    intro:
      "The estimated due date is 280 days (40 weeks) from the first day of the last menstrual period, or 266 days from conception.",
    inputs: [
      {
        key: "method",
        label: "Count from",
        type: "select",
        def: "lmp",
        options: [
          ["lmp", "Last menstrual period (LMP)"],
          ["conception", "Conception date"],
        ],
        half: true,
      },
      { key: "date", label: "Date", type: "date", def: "", half: true },
    ],
    faq: [
      {
        q: "How accurate is a due date?",
        a: "Only about 4% of babies arrive on the estimated date; most are born within two weeks either side. A first-trimester ultrasound gives the most accurate dating.",
      },
    ],
    compute(v) {
      if (!v.date)
        return {
          rows: [{ label: "Due date", value: "Pick a date", strong: true }],
        };
      const start = new Date(v.date + "T00:00:00");
      if (isNaN(+start))
        return { rows: [{ label: "Due date", value: "—", strong: true }] };
      const days = v.method === "conception" ? 266 : 280;
      const due = new Date(+start + days * 86400000);
      const today = new Date();
      const week = Math.floor((+today - +start) / 86400000 / 7);
      const dueStr = due.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return {
        rows: [
          { label: "Estimated due date", value: dueStr, strong: true },
          {
            label: "Current progress",
            value:
              v.method === "lmp" && week >= 0 && week <= 42
                ? `Week ${week} of 40`
                : "—",
          },
        ],
      };
    },
  }),
];
