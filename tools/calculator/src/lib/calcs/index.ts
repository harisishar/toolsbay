import type { Calc } from "../calc-types.ts";
import { FINANCIAL } from "./financial.ts";
import { HEALTH } from "./health.ts";
import { MATH } from "./math.ts";
import { DATETIME } from "./datetime.ts";
import { EVERYDAY } from "./everyday.ts";
import { SALARY_MY } from "./salary-my.ts";
import { SALARY_WORLD } from "./salary-world.ts";

export const ALL_CALCS: Calc[] = [
  ...FINANCIAL,
  ...HEALTH,
  ...MATH,
  ...DATETIME,
  ...EVERYDAY,
  ...SALARY_MY,
  ...SALARY_WORLD,
];

export const CALC_BY_SLUG: Record<string, Calc> = Object.fromEntries(
  ALL_CALCS.map((c) => [c.slug, c]),
);

export const CATEGORIES = [
  "Salary & Tax",
  "Financial",
  "Health & Fitness",
  "Math & Numbers",
  "Date & Time",
  "Everyday",
] as const;
