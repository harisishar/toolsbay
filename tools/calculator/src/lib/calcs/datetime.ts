import { type Calc, num, fmt } from "../calc-types.ts";

const c = (x: Calc) => x;

const UPDATED = "2026-08-01";
const DAY = 86400000;

const parseDate = (s?: string) => {
  if (!s) return null;
  const d = new Date(s + "T00:00:00");
  return isNaN(+d) ? null : d;
};

function ymdDiff(a: Date, b: Date) {
  if (+a > +b) [a, b] = [b, a];
  let years = b.getFullYear() - a.getFullYear();
  let months = b.getMonth() - a.getMonth();
  let days = b.getDate() - a.getDate();
  if (days < 0) {
    months--;
    days += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}

export const DATETIME: Calc[] = [
  c({
    slug: "age-calculator",
    name: "Age Calculator",
    category: "Date & Time",
    title: "Age Calculator — Exact Age in Years, Months & Days",
    desc: "Calculate exact age from a date of birth: years, months, days, plus total days lived and days to the next birthday.",
    intro:
      "Age sounds like the simplest calculation there is, and it is one of the more error-prone once you need it exactly. Subtracting birth year from current year gives a number that is wrong for everyone who has not yet had their birthday this year — roughly half the population on any given day. This calculator does it properly: it compares month and day as well as year, and returns your exact age in years, months and days, along with total days lived and a countdown to your next birthday. Enter a birth date and it works from today. The sections below explain the borrow logic that makes month arithmetic awkward, why leap years complicate a birthday on 29 February, and why total days lived is a larger number than most people expect.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Start with the difference in years. If the current month and day fall before the birth month and day, subtract one — the birthday has not happened yet this year. Months and days are then derived the same way, borrowing from the larger unit when the subtraction would go negative.",
          "Worked example for a birth date of 15 June 1990 evaluated on 1 August 2026: the year difference is 36, and since 1 August is after 15 June, no adjustment is needed. Months from 15 June to 15 July to 1 August gives 1 month and 17 days. Exact age: 36 years, 1 month, 17 days.",
          "Total days lived is a straight difference in calendar days, which correctly accounts for every leap day in between. Someone aged 36 has lived roughly 13,150 days — a number that surprises people because 36 × 365 understates it by about nine days of accumulated leap years.",
        ],
      },
      {
        h: "Why month arithmetic needs borrowing",
        body: [
          "Months have different lengths, so 'one month later' is not a fixed number of days. Going from 31 January to the same date in February is impossible, and different systems resolve it differently — some clamp to 28 or 29, some roll over into March.",
          "This calculator borrows from the month when the day difference would be negative, using the actual length of the preceding month. It is the convention most people intuitively apply, and it is why the days figure can range from 0 to 30 depending on which months the calculation spans.",
        ],
      },
      {
        h: "Leap years and the 29 February problem",
        body: [
          "A leap year occurs every four years, except century years, except those divisible by 400. So 2000 was a leap year and 1900 was not — a rule that exists because the solar year is about 365.2422 days rather than 365.25.",
          "People born on 29 February have a birthday in only about one year in four. Legal systems vary on which date counts in common years: some treat 28 February as the anniversary, others 1 March, and the distinction genuinely matters for things like reaching the age of majority. Total days lived is unaffected, since it counts real elapsed days regardless of which calendar date is designated the birthday.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter your date of birth",
        text: "Year, month and day. The calculation runs against today's date automatically.",
      },
      {
        name: "Read the exact age",
        text: "Years, months and days — not the rounded year figure that subtracting birth years would give.",
      },
      {
        name: "Check the birthday countdown",
        text: "Days until your next birthday, accounting for whether this year's has already passed.",
      },
    ],
    inputs: [
      { key: "dob", label: "Date of birth", type: "date", def: "", half: true },
    ],
    faq: [
      {
        q: "How is age calculated exactly?",
        a: "Calendar-aware: years advance on each birthday, then remaining whole months, then days — so “30 years, 4 months, 12 days” matches how ages are stated legally.",
      },
      {
        q: "Why can't I just subtract birth year from current year?",
        a: "Because it is wrong for anyone whose birthday has not yet occurred this year — about half the population on any given day. The comparison has to include month and day, not just year.",
      },
      {
        q: "How many days have I lived?",
        a: "Roughly 365.25 per year, so about 13,150 days at age 36. The quarter-day comes from leap years, which is why 36 × 365 understates the real figure by about nine days. This calculator counts actual calendar days rather than approximating.",
      },
      {
        q: "What happens if I was born on 29 February?",
        a: "You have a calendar birthday in about one year in four. Legal systems differ on which date counts in common years — some use 28 February, others 1 March — and it genuinely matters for things like reaching the age of majority. Total days lived is unaffected either way.",
      },
    ],
    compute(v) {
      const dob = parseDate(v.dob);
      if (!dob)
        return {
          rows: [
            { label: "Age", value: "Pick your date of birth", strong: true },
          ],
        };
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (+dob > +today)
        return {
          rows: [
            { label: "Age", value: "That date is in the future", strong: true },
          ],
        };
      const { years, months, days } = ymdDiff(dob, today);
      let next = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      if (+next < +today)
        next = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());
      return {
        rows: [
          {
            label: "Age",
            value: `${years} years, ${months} months, ${days} days`,
            strong: true,
          },
          {
            label: "Total days lived",
            value: fmt(Math.floor((+today - +dob) / DAY), 0),
          },
          {
            label: "Next birthday in",
            value: `${Math.round((+next - +today) / DAY)} days`,
          },
        ],
      };
    },
  }),
  c({
    slug: "date-calculator",
    name: "Date Calculator",
    category: "Date & Time",
    title: "Date Calculator — Days Between Dates, Add or Subtract Days",
    desc: "Count the days between two dates, or add/subtract days from a date. Includes weekday counts.",
    intro:
      "This works in two directions. Given two dates, it returns the gap between them in days, weeks, months and years. Given one date and a number of days, it returns the resulting date. Both are calculations people habitually attempt on their fingers and get wrong, because months have unequal lengths and February changes size every four years. The direction you need depends on the question: contract terms, notice periods and project deadlines usually run forward from a known date, while age, tenure and elapsed time run between two known dates. The sections below cover the inclusive-versus-exclusive counting question that causes most disputes over deadlines, and why counting in months is genuinely ambiguous in a way that counting in days is not.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Difference mode converts both dates to a day count and subtracts, which handles leap years and unequal month lengths automatically. Weeks are that figure divided by seven; months and years are derived calendar-aware rather than by dividing days by 30 or 365.",
          "Add-or-subtract mode takes the start date, converts to a day count, applies the offset, and converts back. This is why adding 30 days to 31 January gives 2 March in a common year and 1 March in a leap year — the arithmetic is in days throughout, and the calendar does the rest.",
          "Worked example: from 1 March 2026 to 1 August 2026 is 153 days, or 21 weeks and 6 days, or exactly 5 months. Adding 90 days to 1 March 2026 gives 30 May 2026.",
        ],
      },
      {
        h: "Inclusive or exclusive — the source of most deadline disputes",
        body: [
          "The difference between two dates counts the nights between them, not the calendar days touched. From Monday to Friday is 4 by this count, though the period spans 5 calendar days. Both answers are defensible; they answer different questions.",
          "Hotel bookings, interest accrual and age all use the exclusive count. Notice periods, jury service and many contractual deadlines use the inclusive one, and legal drafting usually states which explicitly for exactly this reason. If you need the inclusive figure, add one to the result here.",
        ],
      },
      {
        h: "Why counting in months is ambiguous",
        body: [
          "A month is not a fixed length, so 'three months from 31 December' has no single correct answer. 31 March is the obvious reading, but 'one month from 31 January' cannot be 31 February, and different conventions resolve it as 28 February, 29 February in a leap year, or 3 March.",
          "Contracts and legislation that care about this specify days instead, or state a convention explicitly. Where you have a choice, expressing a period in days removes the ambiguity entirely — which is why the day count is the figure to rely on when precision matters.",
        ],
      },
    ],
    steps: [
      {
        name: "Choose your mode",
        text: "Difference between two dates, or a date plus or minus a number of days.",
      },
      {
        name: "Enter the dates or offset",
        text: "For subtraction, enter a negative number of days.",
      },
      {
        name: "Decide whether you need an inclusive count",
        text: "The result counts nights between dates. If your deadline counts both endpoints, add one.",
      },
    ],
    inputs: [
      {
        key: "mode",
        label: "Mode",
        type: "select",
        def: "diff",
        options: [
          ["diff", "Days between two dates"],
          ["add", "Add / subtract days from a date"],
        ],
      },
      { key: "start", label: "Start date", type: "date", def: "", half: true },
      {
        key: "end",
        label: "End date (for “between”)",
        type: "date",
        def: "",
        half: true,
      },
      {
        key: "days",
        label: "Days to add (negative = subtract)",
        def: 30,
        half: true,
      },
    ],
    faq: [
      {
        q: "Does the count include both end dates?",
        a: "The difference counts nights between the dates (exclusive of the end date). Add 1 if you need an inclusive count of calendar days.",
      },
      {
        q: "How many days are there between two dates?",
        a: "Enter both in difference mode. The count is exclusive of the end date, so Monday to Friday is 4. Leap years are handled automatically, which is the main reason to use a calculator rather than counting by hand across a February.",
      },
      {
        q: "What date is 90 days from today?",
        a: "Use the add mode with today's date and 90 days. Note that 90 days is not three months — depending on which months it spans it can land several days either side of the three-month anniversary.",
      },
      {
        q: "Why does adding one month to 31 January give an odd result?",
        a: "Because 31 February does not exist, and conventions differ on how to resolve it — 28 February, 29 February in a leap year, or 3 March are all used somewhere. This is why contracts that need precision specify a number of days rather than months.",
      },
    ],
    compute(v) {
      const start = parseDate(v.start);
      if (!start)
        return {
          rows: [{ label: "Result", value: "Pick a start date", strong: true }],
        };
      if (v.mode === "add") {
        const out = new Date(+start + Math.round(num(v.days)) * DAY);
        return {
          rows: [
            {
              label: "Resulting date",
              value: out.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              strong: true,
            },
          ],
        };
      }
      const end = parseDate(v.end);
      if (!end)
        return {
          rows: [{ label: "Result", value: "Pick an end date", strong: true }],
        };
      const days = Math.round(Math.abs(+end - +start) / DAY);
      const d = ymdDiff(start, end);
      return {
        rows: [
          { label: "Difference", value: `${fmt(days, 0)} days`, strong: true },
          {
            label: "In calendar terms",
            value: `${d.years}y ${d.months}m ${d.days}d`,
          },
          { label: "In weeks", value: `${fmt(days / 7, 1)} weeks` },
        ],
      };
    },
  }),
  c({
    slug: "time-calculator",
    name: "Time Calculator",
    category: "Date & Time",
    title: "Time Calculator — Add or Subtract Hours, Minutes, Seconds",
    desc: "Add or subtract two time durations (hours : minutes : seconds) with results in multiple units.",
    intro:
      "Adding and subtracting durations is base-60 arithmetic, and that is why it goes wrong so often. Sixty seconds carry into a minute and sixty minutes into an hour, so 2:45 plus 1:30 is not 3:75 but 4:15. Anyone who has added a column of timesheet entries by hand has made this mistake at least once, and it compounds silently across a week. This calculator adds or subtracts durations in hours, minutes and seconds and handles the carrying for you, returning both the conventional h:mm:ss form and the total in each unit. It is built for the three places durations actually get added up: timesheets, where the total feeds a payroll calculation; media editing, where clip lengths accumulate; and cooking, where staged timings need to work backwards from a serving time.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Each duration is converted to total seconds, the operation is applied, and the result is converted back by integer division: hours = total ÷ 3600, minutes = (total mod 3600) ÷ 60, seconds = total mod 60.",
          "Worked example: 2:45:00 plus 1:30:00 is 9,900 plus 5,400 = 15,300 seconds. Dividing gives 4 hours with 900 seconds left over, which is 15 minutes — so 4:15:00.",
          "Working in total seconds throughout is what removes the carrying errors. The conversion back to hours and minutes happens once, at the end, rather than at every intermediate step where a mistake could creep in.",
        ],
      },
      {
        h: "Why timesheets use decimal hours instead",
        body: [
          "Payroll multiplies hours by a rate, and 7:30 cannot be multiplied directly — it has to become 7.5 first. The conversion is minutes divided by 60, so 30 minutes is 0.5 hours, 15 minutes is 0.25, and 20 minutes is 0.333.",
          "The awkward cases are the ones that do not divide evenly. Ten minutes is 0.1667 hours, and rounding it to 0.17 across a hundred entries introduces a real discrepancy. Payroll systems generally keep the full precision internally and round only the final total, which is why a hand-checked timesheet can disagree with the system by a few minutes.",
        ],
      },
      {
        h: "Negative results and subtraction",
        body: [
          "Subtracting a longer duration from a shorter one gives a negative result, which is meaningful in some contexts — time over or under budget, a schedule variance — and nonsense in others.",
          "Where the intent is elapsed time between two clock times rather than a duration difference, use the hours calculator instead. That one treats an end time earlier than the start as crossing midnight, which is what a night shift needs and what duration subtraction would get wrong.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter the first duration",
        text: "Hours, minutes and seconds. Leave any unit at zero if it does not apply.",
      },
      {
        name: "Choose add or subtract",
        text: "Subtraction can produce a negative result, which is meaningful for variance against a budget.",
      },
      {
        name: "Read both formats",
        text: "The h:mm:ss form is for people; the decimal-hours total is the one payroll and billing systems want.",
      },
    ],
    inputs: [
      { key: "h1", label: "Hours", def: 2, half: true },
      { key: "m1", label: "Minutes", def: 45, half: true },
      { key: "s1", label: "Seconds", def: 0, half: true },
      {
        key: "op",
        label: "Operation",
        type: "select",
        def: "+",
        options: [
          ["+", "+"],
          ["-", "−"],
        ],
        half: true,
      },
      { key: "h2", label: "Hours (2nd)", def: 1, half: true },
      { key: "m2", label: "Minutes (2nd)", def: 30, half: true },
      { key: "s2", label: "Seconds (2nd)", def: 0, half: true },
    ],
    faq: [
      {
        q: "How do you add times by hand?",
        a: "Add seconds, minutes, hours separately, then carry: 60 seconds → 1 minute, 60 minutes → 1 hour. 2:45 + 1:30 = 3:75 → 4:15.",
      },
      {
        q: "How do I convert minutes to decimal hours?",
        a: "Divide by 60. Thirty minutes is 0.5 hours, fifteen is 0.25, ten is 0.1667. Payroll and billing systems need this form because they multiply hours by a rate, and 7:30 cannot be multiplied directly.",
      },
      {
        q: "Why does my timesheet total differ from payroll by a few minutes?",
        a: "Rounding. Ten minutes is 0.1667 decimal hours, and rounding it to 0.17 on each of a hundred entries accumulates. Payroll systems normally keep full precision internally and round only the final total, so a hand-checked figure can drift slightly.",
      },
      {
        q: "Can I subtract a longer duration from a shorter one?",
        a: "Yes — the result is negative, which is useful for schedule variance or time over budget. If you actually want elapsed time between two clock times, use the hours calculator instead, since that one handles shifts crossing midnight.",
      },
    ],
    compute(v) {
      const t1 = num(v.h1) * 3600 + num(v.m1) * 60 + num(v.s1);
      const t2 = num(v.h2) * 3600 + num(v.m2) * 60 + num(v.s2);
      const t = v.op === "-" ? t1 - t2 : t1 + t2;
      const sign = t < 0 ? "−" : "";
      const abs = Math.abs(t);
      const h = Math.floor(abs / 3600);
      const m = Math.floor((abs % 3600) / 60);
      const s = Math.round(abs % 60);
      return {
        rows: [
          { label: "Result", value: `${sign}${h}h ${m}m ${s}s`, strong: true },
          { label: "In minutes", value: fmt(t / 60, 2) },
          { label: "In hours", value: fmt(t / 3600, 3) },
        ],
      };
    },
  }),
  c({
    slug: "hours-calculator",
    name: "Hours Calculator",
    category: "Date & Time",
    title: "Work Hours Calculator — Time Between Clock-in & Out",
    desc: "Calculate hours worked between a start and end time, minus break, with decimal hours for payroll.",
    intro:
      "This calculates worked hours from a clock-in time, a clock-out time and an unpaid break, and returns the result in both h:mm form and decimal hours. The decimal figure is the one that matters for pay, because payroll multiplies hours by a rate and 7:30 has to become 7.5 before that works. It also handles shifts that cross midnight: an end time earlier than the start is treated as the following day, so 22:00 to 06:00 correctly returns eight hours rather than a negative number. That single behaviour is the difference between a tool that works for night shifts and one that does not. Break time is subtracted from the total, which assumes it is unpaid — the usual arrangement, but worth checking against your own terms.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Both clock times convert to minutes past midnight. If the end value is less than the start, 24 hours are added to it, which is what makes an overnight shift come out positive. The break in minutes is then subtracted, and the remainder converts to hours and minutes.",
          "Worked example on a 09:00 to 17:30 shift with a 30-minute break: start is 540 minutes, end is 1,050, giving 510 minutes gross. Less the 30-minute break, that is 480 minutes — 8:00, or 8.0 decimal hours.",
          "Overnight example: 22:00 to 06:00 with no break. Start is 1,320 and end is 360; since 360 is less than 1,320, the end becomes 1,800. The difference is 480 minutes, again eight hours.",
        ],
      },
      {
        h: "Decimal hours, and why 7:30 is not 7.30",
        body: [
          "Clock time is base 60 and decimal hours are base 10, so the two forms only coincide at the hour. 7:30 is 7.5 decimal hours, not 7.30 — a difference of 12 minutes, and one of the most common payroll errors there is.",
          "The conversion is minutes divided by 60. Fifteen minutes is 0.25, twenty is 0.333, forty-five is 0.75. Entering clock time directly into a spreadsheet that expects decimals underpays or overpays on every entry that is not on the hour.",
        ],
      },
      {
        h: "Breaks, rounding and what your employer actually counts",
        body: [
          "This calculator treats the break as unpaid and subtracts it, which is the common arrangement but not universal — some employers pay short breaks and only deduct a meal period. Check your terms before reconciling against a payslip.",
          "Rounding conventions vary too. Some employers round each shift to the nearest quarter hour, some to the nearest five minutes, and some track to the minute. Rounding rules that consistently favour one party are restricted in many jurisdictions, so a persistent gap between your own total and the paid figure is worth raising rather than absorbing.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter clock-in and clock-out",
        text: "Use 24-hour time. If the end is earlier than the start, the shift is treated as crossing midnight.",
      },
      {
        name: "Enter your unpaid break in minutes",
        text: "Only the unpaid portion. If your employer pays short breaks, exclude those.",
      },
      {
        name: "Use the decimal hours figure for pay",
        text: "Multiply decimal hours by your rate. Never multiply the h:mm figure — 7:30 is 7.5 hours, not 7.3.",
      },
    ],
    inputs: [
      {
        key: "start",
        label: "Start time",
        type: "time",
        def: "09:00",
        half: true,
      },
      { key: "end", label: "End time", type: "time", def: "17:30", half: true },
      { key: "brk", label: "Break (minutes)", def: 60, half: true },
      {
        key: "rate",
        label: "Hourly rate (optional)",
        def: 0,
        suffix: "$",
        half: true,
      },
    ],
    faq: [
      {
        q: "What if the shift crosses midnight?",
        a: "End earlier than start is treated as next-day: 22:00 to 06:00 counts 8 hours.",
      },
      {
        q: "How do I convert 7 hours 30 minutes to decimal?",
        a: "7.5, not 7.30. Divide the minutes by 60: 30 ÷ 60 = 0.5. Fifteen minutes is 0.25, twenty is 0.333, forty-five is 0.75. Entering clock time into a spreadsheet expecting decimals is a common and costly payroll error.",
      },
      {
        q: "Is my break deducted from paid hours?",
        a: "This calculator subtracts it, which assumes it is unpaid — the usual arrangement. Some employers pay short breaks and deduct only a meal period, so enter just the unpaid portion if that applies to you.",
      },
      {
        q: "Why does my employer's total differ from mine?",
        a: "Usually rounding. Some employers round each shift to the nearest quarter hour or five minutes rather than tracking to the minute. Rules that consistently round in the employer's favour are restricted in many jurisdictions, so a persistent gap is worth raising.",
      },
    ],
    compute(v) {
      const parse = (s?: string) => {
        const m = (s ?? "").match(/^(\d{1,2}):(\d{2})$/);
        return m ? parseInt(m[1]!, 10) * 60 + parseInt(m[2]!, 10) : NaN;
      };
      const a = parse(v.start);
      const b = parse(v.end);
      if (!Number.isFinite(a) || !Number.isFinite(b))
        return {
          rows: [
            { label: "Result", value: "Enter times as HH:MM", strong: true },
          ],
        };
      let mins = b - a;
      if (mins <= 0) mins += 24 * 60;
      mins -= num(v.brk);
      if (mins < 0) mins = 0;
      const rate = num(v.rate);
      const rows = [
        {
          label: "Hours worked",
          value: `${Math.floor(mins / 60)}h ${mins % 60}m`,
          strong: true,
        },
        { label: "Decimal hours", value: fmt(mins / 60, 2) },
      ];
      if (rate > 0)
        rows.push({
          label: "Pay for this shift",
          value: `$${fmt((mins / 60) * rate, 2)}`,
          strong: false,
        });
      return { rows };
    },
  }),
];
