# Keyword map — Calculators (`calc.toolsbay.app`)

51 shipped calculators. Source of truth: `ALL_CALCS` in
`tools/calculator/src/lib/calcs/index.ts` — import it, do not grep for `slug:`. Eight of the
country calculators build their slug with a template literal, so a regex over the source misses
them (this file said 43 in its first revision for exactly that reason).
Metrics are `unknown` throughout — see [README](README.md).

## Best opportunity theme

**Malaysia salary & statutory deductions, with the year in the title.** Four pages already ship
(`kwsp-epf-calculator`, `socso-eis-calculator`, `pcb-calculator`, `malaysia-salary-calculator`) and
the SERP for `kwsp epf calculator malaysia` is _not_ held by incumbents — it is held by eight small
single-purpose sites (omnihr.co, calculatormalaysia.com, kiramymoney.com, salarycalculatorsmalaysia.com,
ringgitcalc.com, malaysiasalarycalculator.com, quickcalcs.app). Every one of them carries **"2026"**
in the title tag. That is a beatable field on a query with high commercial intent, and it is the one
place where this repo has content calculator.net does not.

The mirror-image opportunity: calculator.net ranks for ~200 calculators; we ship 51. The gap list at
the bottom is pre-validated demand.

## Top keywords to target now

1. `epf calculator malaysia 2026` / `kwsp calculator 2026` → `/kwsp-epf-calculator`
2. `pcb calculator 2026` / `income tax calculator malaysia` → `/pcb-calculator`
3. `socso eis calculator 2026` → `/socso-eis-calculator`
4. `malaysia salary calculator 2026` / `gaji bersih calculator` → `/malaysia-salary-calculator`
5. `uk take home pay calculator` → `/uk-salary-tax-calculator` (shipped; needs the phrase in its title)

## Keywords to save

Tag `topic:malaysia-payroll` — the four MY queries above plus their `2026` and Bahasa variants.
Tag `topic:calculator-gaps` — the P1 rows in the Gaps table.
(No MCP is connected to save to; recorded here for a later `save_keywords` pass.)

## Risks / SERP caveats

- **Year modifier is mandatory for the tax/statutory pages.** 8/8 ranking results for the KWSP query
  put `2026` in the title. Our shipped titles do not. This is the single cheapest fix on the tool and
  it needs an annual refresh, not a one-off edit.
- **calculator.net owns the generic English head terms.** `bmi calculator`, `loan calculator`,
  `percentage calculator` — the incumbent has 20 years of links. Do not plan on winning these
  head-on; win the qualified long tail (`bmi calculator for women`, `loan calculator with extra
payments`) and the localized variants.
- **Health/finance queries are YMYL.** Google applies elevated E-E-A-T scrutiny. Thin calculator
  pages with no methodology explanation are at risk; each of these pages needs its formula stated and
  sourced.
- **The eight country salary calculators are the most under-sold asset here.** They ship with real
  tax engines and tests, but their titles are templated (`{Country} Salary After Tax Calculator
  {year}`) and miss the phrasing each market actually searches — "take home pay" in the UK,
  "in hand salary" in India, "brutto netto rechner" in Germany. Retitling is cheaper than any new
  page in this file.

## Opportunity table — shipped pages

| Keyword                            | Intent        | Target page                    |  Volume |      KD |     CPC | Priority | Notes                                                                                        |
| ---------------------------------- | ------------- | ------------------------------ | ------: | ------: | ------: | -------- | -------------------------------------------------------------------------------------------- |
| epf calculator malaysia 2026       | transactional | /kwsp-epf-calculator           | unknown | unknown | unknown | P1       | Year in title is table stakes; every ranking competitor has it                               |
| kwsp calculator                    | transactional | /kwsp-epf-calculator           | unknown | unknown | unknown | P1       | Local-brand spelling; competitors title both KWSP and EPF                                    |
| epf contribution calculator        | transactional | /kwsp-epf-calculator           | unknown | unknown | unknown | P2       | omnihr.co ranks with a combined EPF+PCB+SOCSO page                                           |
| pcb calculator 2026                | transactional | /pcb-calculator                | unknown | unknown | unknown | P1       | Statutory rates change yearly — refresh cadence needed                                       |
| income tax calculator malaysia     | transactional | /pcb-calculator                | unknown | unknown | unknown | P1       | Broader synonym for the same page; add to title/H1                                           |
| socso eis calculator               | transactional | /socso-eis-calculator          | unknown | unknown | unknown | P1       | Thin competitor field                                                                        |
| malaysia salary calculator         | transactional | /malaysia-salary-calculator    | unknown | unknown | unknown | P1       | Two ranking competitors are exact-match domains — page quality can beat that                 |
| gaji bersih calculator             | transactional | /malaysia-salary-calculator    | unknown | unknown | unknown | P2       | Bahasa variant; needs the term on-page to have a chance                                      |
| salary calculator hourly to annual | transactional | /salary-calculator             | unknown | unknown | unknown | P2       | Matches what the page actually does; generic `salary calculator` does not                    |
| mortgage calculator                | transactional | /mortgage-calculator           | unknown | unknown | unknown | P3       | calculator.net + every bank + Zillow. Head term unwinnable                                   |
| loan calculator                    | transactional | /loan-calculator               | unknown | unknown | unknown | P3       | Same                                                                                         |
| auto loan calculator               | transactional | /auto-loan-calculator          | unknown | unknown | unknown | P3       | Same                                                                                         |
| compound interest calculator       | transactional | /compound-interest-calculator  | unknown | unknown | unknown | P2       | Long tail (`daily`, `monthly`, `with contributions`) is reachable                            |
| simple interest calculator         | transactional | /interest-calculator           | unknown | unknown | unknown | P2       | Note slug/name mismatch: page is "Simple Interest" but slug is generic `interest-calculator` |
| amortization calculator            | transactional | /amortization-calculator       | unknown | unknown | unknown | P2       | `amortization schedule` is the stronger phrasing                                             |
| payment calculator                 | transactional | /payment-calculator            | unknown | unknown | unknown | P3       | Ambiguous intent; SERP is mixed                                                              |
| retirement calculator              | transactional | /retirement-calculator         | unknown | unknown | unknown | P2       | Pairs naturally with the EPF page — internal link                                            |
| investment calculator              | transactional | /investment-calculator         | unknown | unknown | unknown | P2       | —                                                                                            |
| inflation calculator               | informational | /inflation-calculator          | unknown | unknown | unknown | P2       | Intent is "what is X worth today" — needs a data source note                                 |
| sales tax calculator               | transactional | /sales-tax-calculator          | unknown | unknown | unknown | P2       | US-state long tail is large and largely uncontested per-state                                |
| tip calculator                     | transactional | /tip-calculator                | unknown | unknown | unknown | P2       | Mobile-dominant query; page must be fast and thumb-friendly                                  |
| discount calculator                | transactional | /discount-calculator           | unknown | unknown | unknown | P2       | `percent off calculator` is a separate page on calculator.net                                |
| bmi calculator                     | transactional | /bmi-calculator                | unknown | unknown | unknown | P3       | Head term held by CDC/NHS/calculator.net. Long tail only                                     |
| bmr calculator                     | transactional | /bmr-calculator                | unknown | unknown | unknown | P2       | Less contested than BMI                                                                      |
| calorie calculator                 | transactional | /calorie-calculator            | unknown | unknown | unknown | P3       | `tdee calculator` is the higher-intent synonym — not shipped                                 |
| body fat calculator                | transactional | /body-fat-calculator           | unknown | unknown | unknown | P2       | `navy body fat calculator` is the specific long tail                                         |
| ideal weight calculator            | transactional | /ideal-weight-calculator       | unknown | unknown | unknown | P2       | —                                                                                            |
| pace calculator                    | transactional | /pace-calculator               | unknown | unknown | unknown | P2       | Running niche; `marathon pace calculator` long tail                                          |
| due date calculator                | transactional | /due-date-calculator           | unknown | unknown | unknown | P3       | YMYL + BabyCenter/WhatToExpect own it                                                        |
| age calculator                     | transactional | /age-calculator                | unknown | unknown | unknown | P2       | Very high volume, low CPC — good ad-impression page                                          |
| date calculator                    | transactional | /date-calculator               | unknown | unknown | unknown | P2       | `days between dates` is the phrasing people actually type                                    |
| time calculator                    | transactional | /time-calculator               | unknown | unknown | unknown | P2       | —                                                                                            |
| hours calculator                   | transactional | /hours-calculator              | unknown | unknown | unknown | P2       | `time card calculator` is the payroll-intent variant — not shipped                           |
| unit converter                     | transactional | /unit-converter                | unknown | unknown | unknown | P3       | Google answers this in-SERP with a widget. Low ceiling                                       |
| square footage calculator          | transactional | /square-footage-calculator     | unknown | unknown | unknown | P2       | Home-improvement CPC is strong                                                               |
| concrete calculator                | transactional | /concrete-calculator           | unknown | unknown | unknown | P2       | Same; contractor intent                                                                      |
| ip subnet calculator               | transactional | /subnet-calculator             | unknown | unknown | unknown | P2       | Technical audience, low ad RPM but easy to rank                                              |
| password generator                 | transactional | /password-generator            | unknown | unknown | unknown | P3       | 1Password/LastPass/Bitwarden own it with brand strength                                      |
| scientific calculator              | transactional | /scientific-calculator         | unknown | unknown | unknown | P3       | Google's own widget takes the click                                                          |
| percentage calculator              | transactional | /percentage-calculator         | unknown | unknown | unknown | P2       | `what is X percent of Y` phrasing is the long tail                                           |
| fraction calculator                | transactional | /fraction-calculator           | unknown | unknown | unknown | P2       | Student intent, seasonal with term time                                                      |
| random number generator            | transactional | /random-number-generator       | unknown | unknown | unknown | P3       | Google widget again                                                                          |
| standard deviation calculator      | transactional | /standard-deviation-calculator | unknown | unknown | unknown | P2       | Student intent; show the working, not just the answer                                        |
| mean median mode calculator        | transactional | /mean-median-mode-calculator   | unknown | unknown | unknown | P2       | calculator.net's page adds `range` — consider matching                                       |
| triangle calculator                | transactional | /triangle-calculator           | unknown | unknown | unknown | P2       | `right triangle` is a separate high-volume page there                                        |
| gpa calculator                     | transactional | /gpa-calculator                | unknown | unknown | unknown | P2       | Strongly seasonal (semester ends)                                                            |
| final grade calculator             | transactional | /grade-calculator              | unknown | unknown | unknown | P2       | `what do I need on my final` is the question form                                            |

## Gaps — validated by calculator.net's inventory, no page here

calculator.net ships ~200 calculators; we ship 51. These are the ones worth building, ranked.

| Proposed slug                  | Keyword                       | Intent        | Priority | Evidence                                                                                                       |
| ------------------------------ | ----------------------------- | ------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| take-home-pay-calculator       | take home pay calculator      | transactional | P1       | calculator.net `/take-home-pay-calculator.html`; also the whole `salaryaftertax.com` business model            |
| tdee-calculator                | tdee calculator               | transactional | P1       | calculator.net `/tdee-calculator.html`; higher intent than the calorie page we already ship                    |
| tax-calculator                 | income tax calculator         | transactional | P1       | calculator.net `/tax-calculator.html`; our only tax page is Malaysia-specific                                  |
| savings-calculator             | savings calculator            | transactional | P1       | calculator.net `/savings-calculator.html`; natural internal link from retirement                               |
| currency-calculator            | currency converter            | transactional | P1       | calculator.net `/currency-calculator.html`; needs a rates source — the one page here that isn't purely offline |
| time-card-calculator           | time card calculator          | transactional | P1       | calculator.net `/time-card-calculator.html`; payroll intent, we only have generic `hours-calculator`           |
| macro-calculator               | macro calculator              | transactional | P1       | calculator.net `/macro-calculator.html`; completes the fitness cluster with BMR/TDEE                           |
| percent-off-calculator         | percent off calculator        | transactional | P2       | calculator.net ships this separately from `discount-calculator`                                                |
| credit-card-payoff-calculator  | credit card payoff calculator | transactional | P2       | calculator.net `/credit-card-payoff-calculator.html`; high CPC vertical                                        |
| debt-payoff-calculator         | debt payoff calculator        | transactional | P2       | calculator.net `/debt-payoff-calculator.html`; same vertical                                                   |
| student-loan-calculator        | student loan calculator       | transactional | P2       | calculator.net `/student-loan-calculator.html`                                                                 |
| house-affordability-calculator | how much house can i afford   | transactional | P2       | calculator.net `/house-affordability-calculator.html`; question-form query                                     |
| 401k-calculator                | 401k calculator               | transactional | P2       | calculator.net `/401k-calculator.html`; US analogue of our EPF page                                            |
| roi-calculator                 | roi calculator                | transactional | P2       | calculator.net `/roi-calculator.html`; B2B intent, strong CPC                                                  |
| vat-calculator                 | vat calculator                | transactional | P2       | calculator.net `/vat-calculator.html`; UK/EU market we have nothing for                                        |
| ovulation-calculator           | ovulation calculator          | transactional | P2       | calculator.net `/ovulation-calculator.html`; YMYL — needs care                                                 |
| calories-burned-calculator     | calories burned calculator    | transactional | P2       | calculator.net `/calories-burned-calculator.html`                                                              |
| one-rep-max-calculator         | one rep max calculator        | transactional | P2       | calculator.net `/one-rep-max-calculator.html`; easy win, low competition                                       |
| sleep-calculator               | sleep calculator              | transactional | P2       | calculator.net `/sleep-calculator.html`; trivial to build, viral-ish                                           |
| z-score-calculator             | z score calculator            | transactional | P2       | calculator.net `/z-score-calculator.html`; extends the stats cluster                                           |
| probability-calculator         | probability calculator        | transactional | P2       | calculator.net `/probability-calculator.html`                                                                  |
| ratio-calculator               | ratio calculator              | transactional | P2       | calculator.net `/ratio-calculator.html`                                                                        |
| exponent-calculator            | exponent calculator           | transactional | P3       | calculator.net `/exponent-calculator.html`                                                                     |
| binary-calculator              | binary calculator             | transactional | P3       | calculator.net `/binary-calculator.html`; pairs with subnet page's technical audience                          |
| roman-numeral-converter        | roman numeral converter       | transactional | P3       | calculator.net `/roman-numeral-converter.html`                                                                 |
| fuel-cost-calculator           | fuel cost calculator          | transactional | P3       | calculator.net `/fuel-cost-calculator.html`                                                                    |
| tile-calculator                | tile calculator               | transactional | P3       | calculator.net `/tile-calculator.html`; home-improvement cluster with concrete/sq-ft                           |
| roofing-calculator             | roofing calculator            | transactional | P3       | calculator.net `/roofing-calculator.html`; same cluster                                                        |
| gravel-calculator              | gravel calculator             | transactional | P3       | calculator.net `/gravel-calculator.html`; same cluster                                                         |
| mulch-calculator               | mulch calculator              | transactional | P3       | calculator.net `/mulch-calculator.html`; same cluster                                                          |

### Country salary-deduction cluster — already built, and under-exploited

**Correction (2026-07-31):** the first revision of this file said this cluster was unbuilt. It is
not. `tools/calculator/src/lib/calcs/salary-world.ts` ships eight country calculators with real tax
engines (`usTax`, `ukTax`, `sgTax`, `auTax`, `inTax`, `deTax`, `caTax`, `jpTax`), all covered by
tests in `tools/calculator/tests/calcs.test.mjs`. The error came from extracting slugs with a regex;
these are template literals (`${cfg.code}-salary-tax-calculator`).

The real opportunity is therefore not building them — it is that they are titled generically and
carry no year in the slug-adjacent copy, on queries where competitors do.

| Slug                              | Keyword                                   | Intent        | Priority | Notes                                                                   |
| --------------------------------- | ----------------------------------------- | ------------- | -------- | ----------------------------------------------------------------------- |
| uk-salary-tax-calculator          | uk take home pay calculator               | transactional | P1       | `salaryaftertax.com` and `whatstheincometax.com` rank; add "take home pay" — the phrase people type — to the title |
| australia-salary-tax-calculator   | australia income tax calculator           | transactional | P1       | `au.talent.com` and MoneySmart rank; title should name the Medicare levy |
| singapore-salary-tax-calculator   | singapore salary calculator cpf           | transactional | P1       | CPF is the searched term and is the direct EPF analogue — get it in the title |
| india-salary-tax-calculator       | in hand salary calculator india           | transactional | P1       | "in hand salary" is the local phrasing, not "take home"; pairs with the shipped `upi-qr-code` page |
| us-salary-tax-calculator          | paycheck calculator                       | transactional | P2       | ADP/Gusto/SmartAsset entrenched; the page already discloses that state tax is excluded, which is the honest angle |
| germany-salary-tax-calculator     | brutto netto rechner                      | transactional | P2       | The German query massively outweighs the English one — worth a localized title |
| canada-salary-tax-calculator      | canada take home pay calculator           | transactional | P2       | Page is federal-only; provincial tax is the gap to disclose and eventually add |
| japan-salary-tax-calculator       | japan salary after tax calculator         | transactional | P3       | Thin English-language competition, small English-language demand |

**Actual gaps in this cluster** (countries with no page at all):

| Proposed slug                 | Keyword                                   | Priority | Evidence                                                    |
| ----------------------------- | ----------------------------------------- | -------- | ----------------------------------------------------------- |
| indonesia-salary-tax-calculator | kalkulator gaji bpjs pph21              | P2       | APAC per the brief; near-zero English-language competition   |
| philippines-salary-tax-calculator | philippines sss pagibig salary calculator | P2   | Same; large diaspora search volume                           |

**Pattern to follow:** `salary-world.ts` already has the shape — a `CountryCfg` entry plus a tax
engine function and a test. Adding a country is one config block, one engine, one test.
