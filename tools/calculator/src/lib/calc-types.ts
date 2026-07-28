// Core types + helpers for the data-driven calculator registry.
// Every calculator is pure data + a pure compute() — shared by server pages,
// the client bundle, and node:test self-checks.

export type Faq = { q: string; a: string };

export type Input = {
  key: string;
  label: string;
  type?: "number" | "select" | "date" | "text" | "time";
  def?: number | string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  options?: [value: string, label: string][];
  half?: boolean;
};

export type OutRow = { label: string; value: string; strong?: boolean };
export type OutTable = { title?: string; headers: string[]; rows: string[][] };
export type Result = { rows: OutRow[]; table?: OutTable; note?: string };

export type Calc = {
  slug: string;
  name: string;
  category:
    | "Financial"
    | "Health & Fitness"
    | "Math & Numbers"
    | "Date & Time"
    | "Everyday"
    | "Salary & Tax";
  title: string;
  desc: string;
  intro: string;
  inputs: Input[];
  faq: Faq[];
  button?: string; // optional action button label (e.g. "Generate again")
  compute: (v: Record<string, string>) => Result;
};

export const num = (v: string | undefined, def = 0): number => {
  const n = parseFloat(String(v ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : def;
};

export const fmt = (x: number, dp = 2): string =>
  x.toLocaleString("en-US", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });

export const money = (x: number, symbol = "$", dp = 2): string => {
  const sign = x < 0 ? "−" : "";
  return `${sign}${symbol}${fmt(Math.abs(x), dp)}`;
};

export const pct = (x: number, dp = 1): string => `${fmt(x, dp)}%`;

// Progressive tax: brackets as [upperLimit, rate][], last limit = Infinity.
export function taxFromBrackets(
  taxable: number,
  brackets: [number, number][],
): number {
  let tax = 0;
  let prev = 0;
  for (const [limit, rate] of brackets) {
    if (taxable <= prev) break;
    const slice = Math.min(taxable, limit) - prev;
    tax += slice * rate;
    prev = limit;
  }
  return Math.max(0, tax);
}

// Loan payment (monthly) for principal P, annual rate %, years n.
export function monthlyPayment(
  principal: number,
  annualRatePct: number,
  years: number,
): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (n <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}
