import { type Calc, num, fmt } from "../calc-types.ts";

const c = (x: Calc) => x;
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
      "Enter a birth date to get exact age today, total days lived, and the countdown to the next birthday.",
    inputs: [
      { key: "dob", label: "Date of birth", type: "date", def: "", half: true },
    ],
    faq: [
      {
        q: "How is age calculated exactly?",
        a: "Calendar-aware: years advance on each birthday, then remaining whole months, then days — so “30 years, 4 months, 12 days” matches how ages are stated legally.",
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
      "Two modes: the gap between two dates, or a date plus/minus a number of days.",
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
      "Add or subtract durations — useful for timesheets, editing timelines and cooking.",
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
      "Clock-in to clock-out, minus break — with the decimal-hours figure payroll systems want.",
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
