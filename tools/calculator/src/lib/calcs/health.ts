import { type Calc, num, fmt } from "../calc-types.ts";

const c = (x: Calc) => x;

const UPDATED = "2026-08-01";

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
      "Body Mass Index is weight divided by height squared, and it is the most widely used screening measure for weight status in the world. Its appeal is that it needs only two numbers anyone can obtain, which is also its central weakness: it cannot distinguish muscle from fat, or tell where fat is carried. A lean, muscular athlete and a sedentary person of the same height and weight receive the same score. Used as designed — as a population-level screen that flags people who may warrant a closer look — BMI is genuinely useful. Used as a diagnosis of an individual's health, it misleads often enough to be actively unhelpful. This calculator returns your BMI and the standard World Health Organization category, and the sections below explain where that category is likely to be wrong for you.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "BMI = weight in kilograms ÷ (height in metres)². For imperial units the formula is weight in pounds ÷ (height in inches)² × 703, which is the same relationship with a unit conversion folded in.",
          "Worked example at 170 cm and 70 kg: height in metres is 1.70, squared is 2.89. BMI = 70 ÷ 2.89 = 24.2, which falls in the normal-weight range.",
          "The WHO categories are: under 18.5 underweight, 18.5 to 24.9 normal, 25.0 to 29.9 overweight, and 30.0 and above obese, subdivided into three classes. The boundaries are round numbers chosen for convenience, not thresholds where anything biological changes — 24.9 and 25.1 are not meaningfully different.",
        ],
      },
      {
        h: "Where BMI gets it wrong",
        body: [
          "Muscle is denser than fat, so muscular people are routinely classified as overweight or obese while carrying low body fat. Many professional athletes score above 30. In the other direction, someone who has lost muscle with age can sit in the normal range while carrying a high fat percentage — sometimes called normal-weight obesity.",
          "BMI also says nothing about fat distribution, which is what most strongly predicts metabolic risk. Visceral fat around the abdomen is considerably more dangerous than the same mass carried on hips and thighs, and BMI cannot see the difference.",
          "Population differences matter too. Several health authorities apply lower thresholds for people of South and East Asian descent, who show elevated metabolic risk at BMI values within the standard normal range. If that applies to you, treat the standard categories as optimistic.",
        ],
      },
      {
        h: "Better measures to use alongside it",
        body: [
          "Waist circumference is the simplest and most informative addition. Above roughly 94 cm for men and 80 cm for women indicates raised risk, with higher thresholds marking substantially raised risk — and these numbers capture the abdominal fat that BMI misses entirely.",
          "Waist-to-height ratio is simpler still and arguably better: keep your waist under half your height. It needs no tables, works across most adult populations, and correlates with metabolic risk more closely than BMI does. Body fat percentage, measured by the Navy method or by a scan, gives the most direct answer if you can obtain it.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter your height in centimetres",
        text: "Measure without shoes. A few centimetres of error changes BMI noticeably, because height is squared.",
      },
      {
        name: "Enter your weight in kilograms",
        text: "Weigh yourself at a consistent time of day — morning, before eating, is the usual convention.",
      },
      {
        name: "Read the category as a screen, not a verdict",
        text: "If you are muscular, or of South or East Asian descent, check your waist circumference before drawing any conclusion from the category.",
      },
    ],
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
      {
        q: "What is a better measure than BMI?",
        a: "Waist-to-height ratio: keep your waist under half your height. It needs no tables, captures abdominal fat that BMI cannot see, and tracks metabolic risk more closely. Waist circumference alone works too — above about 94 cm for men and 80 cm for women indicates raised risk.",
      },
      {
        q: "Is BMI calculated differently for men and women?",
        a: "No — the formula is identical. That is part of the criticism, since men and women carry fat differently at the same BMI. The categories are also the same, though several health authorities apply lower thresholds for people of South and East Asian descent, who show elevated risk within the standard normal range.",
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
      "Basal metabolic rate is the energy your body uses at complete rest, keeping your heart beating, your lungs working and your temperature stable. It is the floor beneath every calorie calculation, and for most people it accounts for 60% to 70% of daily energy expenditure — considerably more than exercise does. This calculator uses the Mifflin-St Jeor equation, which dietitians generally prefer over the older Harris-Benedict formula because it was validated on a more representative modern population and produces more accurate estimates for most adults. Enter your sex, weight, height and age, and it returns your BMR along with total daily energy expenditure at several activity levels. BMR alone is not a calorie target; it is what you would burn lying still all day, and eating at that level is not a plan.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "The Mifflin-St Jeor equation is BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + 5 for men, or − 161 for women.",
          "Worked example for a 30-year-old man at 80 kg and 180 cm: (10 × 80) + (6.25 × 180) − (5 × 30) + 5 = 800 + 1125 − 150 + 5 = 1,780 calories a day at complete rest.",
          "Total daily energy expenditure multiplies BMR by an activity factor: 1.2 for sedentary, 1.375 for light exercise, 1.55 for moderate, 1.725 for heavy, and 1.9 for very heavy. The same man at moderate activity would need about 2,759 calories to maintain weight.",
        ],
      },
      {
        h: "Why the activity multiplier is where the error lives",
        body: [
          "The BMR equation is reasonably accurate — typically within 10% for most adults. The activity multiplier is not. It is a coarse five-point scale standing in for enormous individual variation in daily movement, occupation and unconscious activity.",
          "Non-exercise activity thermogenesis, the energy spent fidgeting, standing, walking around and maintaining posture, varies by hundreds of calories a day between people of the same size doing the same formal exercise. That variation is invisible to any multiplier.",
          "The practical consequence: treat the TDEE figure as a starting hypothesis. Eat at it for two or three weeks, track your weight, and adjust from what actually happens rather than from what the equation predicted.",
        ],
      },
      {
        h: "BMR, RMR and TDEE",
        body: [
          "BMR is measured under strict conditions — fasted, fully rested, thermally neutral. Resting metabolic rate is the same idea measured under looser conditions, and comes out slightly higher, typically by a few percent. The two terms are used interchangeably in practice and the difference rarely matters.",
          "TDEE is the number you actually eat against. It is BMR plus activity plus the thermic effect of food, which is the energy spent digesting what you eat — roughly 10% of intake, and higher for protein than for fat or carbohydrate.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter sex, weight, height and age",
        text: "All four affect the result. Age matters because BMR declines with it, largely through loss of muscle mass.",
      },
      {
        name: "Read your BMR",
        text: "This is resting energy expenditure — the floor, not a calorie target.",
      },
      {
        name: "Pick a realistic activity level",
        text: "Most people overestimate. If you exercise three times a week and otherwise sit at a desk, that is light, not moderate.",
      },
    ],
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
      {
        q: "Why Mifflin-St Jeor rather than Harris-Benedict?",
        a: "Harris-Benedict dates from 1919 and was derived from a small, unrepresentative sample. Mifflin-St Jeor, published in 1990, was validated against a broader modern population and is generally more accurate — typically within 10% for most adults. It is the equation most clinical dietitians use.",
      },
      {
        q: "How accurate is a calculated BMR?",
        a: "The equation is usually within 10%, but individual variation in metabolic rate at the same size can be wider than that. The activity multiplier introduces far more error than the BMR formula does. Use the number as a starting point, then adjust based on two or three weeks of actual weight data.",
      },
      {
        q: "Can I eat at my BMR to lose weight?",
        a: "You should not. BMR is what you would burn lying still all day; eating at that level while living normally creates a very large deficit, which tends to cost muscle alongside fat and is difficult to sustain. Calculate TDEE and subtract a moderate amount from that instead.",
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
      "This finds your maintenance calories — the intake at which your weight holds steady — and then the targets for losing or gaining at a sustainable rate. The arithmetic rests on a well-worn approximation: roughly 7,700 calories correspond to a kilogram of body mass, so a deficit of about 500 calories a day produces something near half a kilogram a week. That approximation is useful for setting a starting point and unreliable as a long-run prediction, because the body adapts. Maintenance calories fall as you lose weight, both because a smaller body costs less to run and because unconscious activity tends to decline during a deficit. Expect to recalculate every few kilograms rather than to follow one number to a goal.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "BMR comes from the Mifflin-St Jeor equation, then is multiplied by your activity factor to give total daily energy expenditure — your maintenance level. Loss and gain targets adjust that figure by roughly 500 calories a day for a half-kilogram weekly change, and about 1,000 for a kilogram.",
          "Worked example for a 30-year-old woman at 65 kg, 165 cm, lightly active: BMR is about 1,364 calories. At an activity factor of 1.375, maintenance is roughly 1,875. A moderate loss target would be around 1,375 a day.",
          "The 7,700-calories-per-kilogram figure is an approximation derived from the energy density of adipose tissue. It holds reasonably in the short term and drifts over longer periods as body composition and metabolic rate change.",
        ],
      },
      {
        h: "Why weight loss stalls even when you keep eating the same",
        body: [
          "A lighter body burns fewer calories doing everything, so the deficit you started with shrinks as you succeed. Someone who began at a 500-calorie deficit may be at 300 after losing ten kilograms, without changing a thing.",
          "Adaptive thermogenesis compounds this. During sustained restriction, unconscious activity falls — less fidgeting, less spontaneous movement — and this can account for several hundred calories a day. It is not a metabolic defect; it is the body doing exactly what it evolved to do.",
          "The fix is to recalculate maintenance every few kilograms and to build in maintenance breaks rather than extending a deficit indefinitely.",
        ],
      },
      {
        h: "Setting a rate you can actually sustain",
        body: [
          "Half a kilogram a week is the usual recommendation for most people, and around 1% of body weight per week is a reasonable ceiling. Faster loss increases the share coming from muscle rather than fat, and is much harder to adhere to.",
          "Protein intake matters more than the exact deficit for preserving muscle — commonly cited targets are in the range of 1.6 to 2.2 grams per kilogram of body weight during a deficit. Resistance training alongside the deficit does more to protect lean mass than any adjustment to the calorie number.",
          "For weight gain the same logic runs in reverse: a surplus of 250 to 500 calories a day supports muscle growth without excessive fat gain, and larger surpluses mostly add fat.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter your details and activity level",
        text: "Be honest about activity. Overestimating it is the most common reason a calculated target does not work.",
      },
      {
        name: "Start at the maintenance figure",
        text: "Eat at it for two weeks and track your weight. If it holds steady, the estimate is right for you.",
      },
      {
        name: "Apply a deficit or surplus from there",
        text: "Use the loss or gain rows. Recalculate every few kilograms, because maintenance moves as your weight does.",
      },
    ],
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
      {
        q: "Why did my weight loss stall?",
        a: "Because maintenance calories fall as you get lighter — the deficit you started with shrinks as you succeed. Sustained restriction also reduces unconscious daily movement, which can account for several hundred calories. Recalculate your maintenance every few kilograms rather than following one number to the goal.",
      },
      {
        q: "How fast should I lose weight?",
        a: "Around 0.5 kg a week suits most people, with about 1% of body weight per week as a sensible ceiling. Faster loss takes a larger share from muscle and is much harder to sustain. Adequate protein and resistance training protect lean mass more effectively than adjusting the calorie figure does.",
      },
      {
        q: "Is 1,200 calories a safe target?",
        a: "It is often too low for an adult and is frequently the output of an unrealistically sedentary activity setting rather than a considered plan. Very low intakes make adequate protein and micronutrients hard to achieve and tend to produce rebound. If your calculated target lands near that figure, check the activity level you selected first.",
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
      "The US Navy body fat method estimates body fat percentage from a handful of tape measurements — height, neck and waist, plus hips for women. It was developed so that the military could assess personnel quickly without expensive equipment, and it remains one of the better no-equipment estimates available, typically landing within three to four percentage points of a DEXA scan for most people. Its logic is that neck and waist circumferences at a given height correlate with the proportion of fat mass. Body fat percentage is a considerably more useful number than BMI, because it distinguishes the tissue that matters from the tissue that does not. Measure carefully — a centimetre of error on the waist moves the result more than most people expect — and use the trend across repeated measurements rather than any single reading.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "The Navy method uses logarithmic regressions. For men, body fat % = 495 ÷ (1.0324 − 0.19077 × log₁₀(waist − neck) + 0.15456 × log₁₀(height)) − 450. For women the equation adds hip circumference: 495 ÷ (1.29579 − 0.35004 × log₁₀(waist + hip − neck) + 0.22100 × log₁₀(height)) − 450. All measurements are in centimetres.",
          "Worked example for a man at 180 cm with a 85 cm waist and 38 cm neck: waist minus neck is 47 cm, and the equation returns roughly 18% body fat.",
          "The women's formula includes hips because fat distribution differs, and a waist measurement alone would systematically misestimate. This is why the two equations are not interchangeable.",
        ],
      },
      {
        h: "How to measure so the number means something",
        body: [
          "Waist: for men, at the navel; for women, at the narrowest point of the torso. Keep the tape horizontal and snug without compressing the skin, and measure at the end of a normal exhale rather than holding your breath in.",
          "Neck: just below the larynx, with the tape sloping slightly downward at the front. Hips, for women: at the widest point of the buttocks.",
          "Consistency matters more than absolute precision. Measuring at the same time of day, in the same conditions, using the same landmarks, makes the trend across weeks reliable even if any single reading is a little off.",
        ],
      },
      {
        h: "What body fat percentage is healthy?",
        body: [
          "Commonly cited ranges for men are 6% to 13% for athletes, 14% to 17% for fit, 18% to 24% acceptable, and 25% and above obese. For women the equivalent ranges run roughly ten points higher — 14% to 20% for athletes, 21% to 24% fit, 25% to 31% acceptable, and 32% and above obese.",
          "Women carry more essential fat than men for physiological reasons, which is why the ranges differ rather than one scale applying to everyone. Very low body fat is not a health goal in either sex; below the athletic range it carries real costs to hormonal function, immunity and bone density.",
        ],
      },
    ],
    steps: [
      {
        name: "Select your sex",
        text: "The formulas differ, and the women's version requires a hip measurement as well.",
      },
      {
        name: "Measure height, neck and waist in centimetres",
        text: "Use a flexible tape, snug but not compressing. Measure at the end of a normal exhale.",
      },
      {
        name: "Track the trend, not the reading",
        text: "A single measurement carries a few points of uncertainty. Repeat under the same conditions every couple of weeks and watch the direction.",
      },
    ],
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
      {
        q: "How accurate is the Navy method?",
        a: "Typically within three to four percentage points of a DEXA scan for most people — good enough to track progress, not precise enough to obsess over a single reading. It is less reliable at the extremes of body composition, where the underlying regressions were fitted on fewer people.",
      },
      {
        q: "Why do women need a hip measurement and men do not?",
        a: "Because fat distribution differs. Women carry a greater proportion on the hips and thighs, which a waist measurement alone would miss, so the women's equation includes hip circumference to capture it. The two formulas are not interchangeable.",
      },
      {
        q: "Is body fat percentage better than BMI?",
        a: "For an individual, yes. BMI cannot distinguish muscle from fat, so a muscular person and a sedentary one of identical height and weight get the same score. Body fat percentage measures the tissue that actually relates to metabolic risk.",
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
      "Four formulas dominate the literature on ideal body weight — Devine, Robinson, Miller and Hamwi — and they disagree with each other by several kilograms at the same height. That disagreement is the most informative thing about them. None was derived from health outcomes; they were built for clinical purposes such as drug dosing and ventilator settings, where a standardised figure matters more than a physiologically meaningful one. This calculator runs all four and shows the spread, because the range they produce is a far more honest answer than any single number. Treat it as a rough zone rather than a target. Body composition, frame size and what you can maintain without misery all matter more than hitting a figure a formula produced from height alone.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "All four formulas share a structure: a base weight at 152 cm (5 feet), plus a fixed increment per additional inch of height, with different constants for men and women.",
          "Devine, the most widely used, sets men at 50 kg + 2.3 kg per inch over 5 feet, and women at 45.5 kg + 2.3 kg per inch. Robinson uses 52 kg + 1.9 kg for men and 49 kg + 1.7 kg for women. Miller uses 56.2 kg + 1.41 kg and 53.1 kg + 1.36 kg. Hamwi uses 48 kg + 2.7 kg and 45.5 kg + 2.2 kg.",
          "Worked example for a man at 180 cm, which is about 11 inches over 5 feet: Devine gives 75.3 kg, Robinson 72.9 kg, Miller 71.7 kg and Hamwi 77.7 kg. A six-kilogram spread from the same height.",
        ],
      },
      {
        h: "Why the formulas disagree by so much",
        body: [
          "They were developed independently, decades apart, for different purposes and from different populations. Devine's came from pharmacokinetics in 1974 — it exists so that drug doses can be standardised, not so that people can set weight goals. Hamwi's dates from 1964 and was intended for diabetic diet planning.",
          "None of them incorporates frame size, muscle mass or body composition, and all of them are linear in height, which real human proportions are not. At the extremes of height they become noticeably less plausible in both directions.",
        ],
      },
      {
        h: "What to use instead",
        body: [
          "A BMI range is a more defensible target zone than any single ideal weight: the normal range of 18.5 to 24.9 at 180 cm corresponds to roughly 60 to 81 kg, which is wide because healthy weight genuinely is.",
          "Beyond that, waist-to-height ratio and body fat percentage tell you more about health than total weight does. Two people at the same weight and height can differ enormously in composition, and the one carrying more muscle is generally in better metabolic shape despite the identical number on the scale.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter your height and sex",
        text: "These are the only inputs any of the four formulas use — which is itself a reason not to over-trust the output.",
      },
      {
        name: "Read the spread, not one figure",
        text: "The gap between the highest and lowest formula is typically several kilograms. That range is the honest answer.",
      },
      {
        name: "Cross-check against a BMI range",
        text: "The healthy BMI band at your height gives a wider and better-grounded target zone than any single ideal-weight number.",
      },
    ],
    inputs: [
      sexInput,
      { key: "height", label: "Height (cm)", def: 170, half: true },
    ],
    faq: [
      {
        q: "Why do the formulas disagree?",
        a: "Each was fitted to different clinical populations decades apart. The healthy-BMI range (18.5–24.9) is the more evidence-based guide; the formulas remain popular for medication dosing.",
      },
      {
        q: "Which ideal weight formula is most accurate?",
        a: "None of them is accurate in the sense people mean, because none was derived from health outcomes. Devine is the most widely used, but it exists to standardise drug dosing rather than to describe a healthy weight. Use the spread across all four as a rough zone.",
      },
      {
        q: "Do these formulas account for muscle or frame size?",
        a: "No. Every one of them uses height and sex alone. A heavily muscled person and a sedentary person of the same height receive the same ideal weight, which is the clearest illustration of the limitation.",
      },
      {
        q: "What should I use instead?",
        a: "A healthy BMI range gives a wider and better-grounded target — at 180 cm that is roughly 60 to 81 kg. Waist-to-height ratio and body fat percentage say more about health than total weight does at any given height.",
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
      "Pace is the inverse of speed, expressed as time per unit of distance, and it is how runners actually think about effort. This calculator takes a distance and a finish time and returns your pace per kilometre and per mile, along with predicted equivalent times for the standard race distances — 5K, 10K, half marathon and marathon. Those predictions come from Riegel's formula, which models the well-observed fact that pace degrades as distance grows, at a fairly consistent rate across runners. The predictions assume you have trained appropriately for the longer distance, which is the assumption that most often breaks. A 5K time predicts a marathon time only for someone who has actually put in marathon mileage; without it, the real result will be considerably slower than the formula suggests.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Pace = total time ÷ distance. A 5 km run in 25 minutes is 25 ÷ 5 = 5:00 per kilometre, or about 8:03 per mile.",
          "Equivalent race times use Riegel's endurance formula: T₂ = T₁ × (D₂ ÷ D₁)^1.06. The exponent of 1.06 encodes how much pace slows as distance increases — if you could hold pace perfectly, the exponent would be 1.",
          "Worked example from a 25:00 5K: the predicted 10K is 25 × 2^1.06 ≈ 52:07, the half marathon about 1:55:30, and the marathon about 4:00:40. Notice the marathon prediction is more than eight times the 5K time, not the six-and-a-bit that a naive scaling would give.",
        ],
      },
      {
        h: "Why longer races cannot be run at short-race pace",
        body: [
          "Short races are limited by how much oxygen you can process and how much lactate you can tolerate. Longer ones are limited by fuel and by the accumulating cost of ground contact — glycogen depletion and muscular fatigue become the binding constraints rather than cardiovascular capacity.",
          "The marathon sits at the far end of this, which is why it punishes inadequate preparation so dramatically. The Riegel prediction is a ceiling on what your current fitness allows, not a promise. A runner who has never exceeded 15 km in training will not hit their predicted marathon time regardless of how fast their 5K is.",
        ],
      },
      {
        h: "Using pace in training",
        body: [
          "Most training should be considerably slower than race pace. The widely used guideline is that around 80% of weekly volume should sit at an easy conversational effort, with the remaining 20% at genuinely hard intensities — a distribution that consistently outperforms spending every session at moderate effort.",
          "Threshold pace, roughly the effort you could hold for an hour, is close to 10K race pace for most recreational runners. Interval work sits nearer 5K pace or faster. Knowing your current pace across distances is what makes those targets concrete rather than guesswork.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter the distance",
        text: "Any distance in kilometres. Use a recent race or a hard effort rather than an easy run.",
      },
      {
        name: "Enter your finish time",
        text: "Hours, minutes and seconds. The more recent the effort, the more meaningful the predictions.",
      },
      {
        name: "Read the equivalent times as ceilings",
        text: "They show what your current fitness permits if you have trained for that distance. Without the appropriate mileage, the longer predictions will overstate what you can do.",
      },
    ],
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
      {
        q: "How do I convert min/km to min/mile?",
        a: "Multiply by 1.609. A 5:00 per kilometre pace is about 8:03 per mile. Going the other way, divide by 1.609 — a 10:00 mile is roughly 6:13 per kilometre.",
      },
      {
        q: "Can I predict my marathon time from a 5K?",
        a: "Riegel's formula will give you a number, and it is a reasonable ceiling on what your current fitness allows. It assumes you have trained for the distance. A runner whose longest run is 15 km will not hit the predicted marathon time no matter how fast their 5K is — the marathon is limited by fuel and durability, not by the capacity a 5K measures.",
      },
      {
        q: "Why does pace slow down over longer distances?",
        a: "Short races are limited by oxygen processing and lactate tolerance; long ones by glycogen depletion and accumulated muscular fatigue. Riegel's exponent of 1.06 captures the average rate at which this happens. If pace held perfectly across distances the exponent would be 1.",
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
      "The estimated due date is calculated as 280 days — forty weeks — from the first day of the last menstrual period, or 266 days from conception. The forty-week convention embeds an assumption worth knowing about: it counts from a point roughly two weeks before conception actually occurred, because the last period is a date most people can recall while the moment of conception is not. This is why a pregnancy described as eight weeks along is typically six weeks past conception. The calculator returns the estimated due date along with the current gestational age and the trimester boundaries. Treat the date as the centre of a range rather than an appointment: only about 4% of babies arrive on it, and the great majority are born within two weeks either side.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Naegele's rule, the standard method, adds 280 days to the first day of the last menstrual period. The traditional formulation is the same thing stated differently: take the first day of the last period, subtract three months, and add seven days and one year.",
          "Worked example with a last period beginning 1 March: subtracting three months gives 1 December of the previous year, adding seven days gives 8 December, and adding a year gives 8 December of the current year as the estimated due date.",
          "Dating from conception uses 266 days instead, since conception typically occurs about two weeks after the period begins. If you know the conception date — from IVF, for instance — that route is more accurate than the period-based one.",
        ],
      },
      {
        h: "Why the due date is a range, not a date",
        body: [
          "Naegele's rule assumes a 28-day cycle with ovulation on day 14. Cycle length varies substantially between people and between cycles, and a longer or shorter cycle shifts the real due date accordingly — someone with a consistent 35-day cycle will typically deliver about a week later than the rule predicts.",
          "Term is defined as 37 to 42 weeks, a five-week window, which is a fair reflection of the natural variation. Around 4% of births occur on the estimated date itself, and roughly 90% within two weeks either side of it.",
          "A first-trimester ultrasound gives more accurate dating than the last menstrual period, because early fetal size varies little between pregnancies. Where the two disagree by more than about a week, clinicians generally revise the due date to the scan.",
        ],
      },
      {
        h: "How the trimesters divide",
        body: [
          "The first trimester runs from week 1 to the end of week 13, the second from week 14 to the end of week 27, and the third from week 28 to birth. The boundaries are conventions rather than sharp biological transitions, though they correspond loosely to real shifts in risk and development.",
          "Gestational age is always counted from the last menstrual period, which is why the count starts about two weeks before conception. This is a persistent source of confusion — it means the first two weeks of a forty-week pregnancy precede the pregnancy itself.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter the first day of your last period",
        text: "The first day of bleeding, not the last. This is the date clinicians use.",
      },
      {
        name: "Read the estimated due date",
        text: "It is 280 days from the date you entered. Treat it as the centre of a five-week term window.",
      },
      {
        name: "Check against a dating scan",
        text: "A first-trimester ultrasound dates a pregnancy more accurately than the last period, particularly if your cycle is not close to 28 days.",
      },
    ],
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
      {
        q: "Why is pregnancy counted from the last period rather than conception?",
        a: "Because the first day of the last period is a date most people can recall, while the moment of conception usually is not. It means the count starts about two weeks before conception — so eight weeks pregnant is roughly six weeks past conception.",
      },
      {
        q: "Does an irregular cycle change the due date?",
        a: "Yes. Naegele's rule assumes a 28-day cycle with ovulation on day 14. A consistently longer cycle shifts the real due date later by roughly the difference — someone on a 35-day cycle typically delivers about a week after the rule predicts. A dating scan resolves this.",
      },
      {
        q: "When do the trimesters start and end?",
        a: "First trimester: weeks 1 to 13. Second: weeks 14 to 27. Third: week 28 to birth. These are conventions rather than sharp biological boundaries, though they track loosely with shifts in risk and development.",
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
