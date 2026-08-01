// --- Competitor comparison ---
// Kept out of ALL_CALCS on purpose: a `Calc` requires a compute() function and
// input fields, and tests/calcs.test.mjs runs compute() on every registry entry
// with default inputs. A prose page has neither.
//
// Calculator.net facts below are quoted from their own site (see `sources`),
// checked on the `updated` date. They are a good, genuinely free product with
// roughly four times our inventory — the comparison says so plainly, because a
// page that pretends otherwise is one search away from being disbelieved.

import type { Comparison } from "./seo.ts";

export const COMPARISONS: Comparison[] = [
  {
    slug: "calculator-net-alternative",
    competitor: "Calculator.net",
    title: "Calculator.net Alternative — Free Calculators, Non-US Tax Too",
    desc: "A free Calculator.net alternative with Malaysian EPF, SOCSO and PCB plus take-home pay for 8 countries — the statutory maths Calculator.net only does for US residents.",
    h1: "The Calculator.net alternative that handles non-US tax",
    intro:
      'Calculator.net is one of the better free tools on the web: around 200 calculators, no registration, no paywall. We are not going to pretend it is bad, because it is not. It has one specific gap, and it is a big one if you do not live in the United States — its Income Tax Calculator is, in its own words, "for United States residents only". CalcHub is our calculator suite, built around that gap.',
    sections: [
      {
        h: "Should you switch? The short answer",
        body: [
          "Use CalcHub if you need statutory payroll maths outside the US: Malaysian EPF/KWSP, SOCSO and EIS, monthly PCB tax deduction, or take-home pay in the UK, Singapore, Australia, India, Germany, Canada, Japan or the US. That is 13 of our 51 calculators and it is the reason this site exists.",
          "Use Calculator.net if you want breadth. It has roughly four times as many calculators as we do, and for anything specialised — a specific engineering, statistics or conversion calculator — it will usually have one and we will not. Bookmark both; that is genuinely the right answer.",
          "Disclosure: CalcHub is our tool. The Calculator.net claims below come from its own site, linked at the bottom of this page.",
        ],
      },
      {
        h: "The gap: tax and payroll outside the United States",
        body: [
          "Calculator.net's Income Tax Calculator states it is for United States residents only, and its salary tooling follows the same assumption. If you are working out what actually lands in your bank account in Kuala Lumpur, London, Singapore or Bangalore, a US federal-and-state model does not help — the deductions are different in kind, not just in rate.",
          "Malaysia is the clearest case. Take-home pay there is not one tax calculation but four interacting ones: the EPF/KWSP contribution split between employee and employer, SOCSO and EIS contributions on a banded schedule, and PCB, the monthly tax deduction that has to reconcile against the annual assessment. We have a calculator for each of those plus a combined salary calculator that runs them together.",
          "The other eight country calculators do the same job locally: National Insurance and PAYE for the UK, CPF for Singapore, the Medicare levy for Australia, the old-versus-new regime choice for India, and so on.",
        ],
      },
      {
        h: "Where Calculator.net is genuinely better",
        body: [
          "Inventory. Around 200 calculators against our 51. If you need a specific scientific, statistical, construction or conversion calculator, the odds strongly favour them, and there is no point sending you on a search you will lose.",
          "Longevity and familiarity. It has been the default answer for a decade, and its financial calculators in particular are well-tested and widely cross-checked.",
          "Both sites are free with no registration and no paywall, so there is no cost to using whichever has the calculator you need at that moment.",
        ],
      },
      {
        h: "What is the same on both",
        body: [
          "Free, no sign-up, no paid tier. Neither site asks you to register to get a number out of it, and both are ad-supported.",
          "One difference worth knowing: CalcHub runs every calculation in your browser using JavaScript, so the salary, loan balance or medical figures you type are never sent anywhere. For a tip calculator that is irrelevant. For entering your actual gross pay, or a due date, it is the difference between a private calculation and a form submission.",
        ],
      },
      {
        h: "How to switch",
        body: [
          "Nothing to migrate — no accounts on either side. The links below cover the calculators people arrive here for most: Malaysian EPF and PCB, the combined Malaysia salary calculator, and the country take-home pay pages.",
        ],
      },
    ],
    matrix: [
      { feature: "Price", us: "Free", them: "Free" },
      { feature: "Account required", us: "No", them: "No" },
      {
        feature: "Number of calculators",
        us: "51",
        them: "~200",
        note: "Their own figure. This is the one column where they clearly win.",
      },
      {
        feature: "US income tax",
        us: "Yes",
        them: "Yes",
      },
      {
        feature: "Malaysia EPF/KWSP, SOCSO, EIS, PCB",
        us: "Yes",
        them: "No",
      },
      {
        feature: "Take-home pay for non-US countries",
        us: "8 countries",
        them: "No",
        note: 'UK, Singapore, Australia, India, Germany, Canada, Japan and the US. Calculator.net states its Income Tax Calculator is "for United States residents only".',
      },
      {
        feature: "Runs in your browser, nothing submitted",
        us: "Yes",
        them: "Server-rendered",
      },
      {
        feature: "Financial calculators (loan, mortgage, compound interest)",
        us: "11",
        them: "Yes",
      },
      { feature: "Health & fitness calculators", us: "7", them: "Yes" },
      {
        feature: "Specialised scientific & engineering calculators",
        us: "Limited",
        them: "Extensive",
      },
    ],
    sources: [
      { label: "Calculator.net", url: "https://www.calculator.net/" },
      {
        label: "Calculator.net income tax calculator",
        url: "https://www.calculator.net/income-tax-calculator.html",
      },
    ],
    updated: "2026-08-01",
    faq: [
      {
        q: "Is there a Calculator.net alternative with Malaysian tax calculators?",
        a: "That is what CalcHub is for. It covers EPF/KWSP contributions, SOCSO and EIS, monthly PCB deduction and a combined Malaysia salary calculator that runs all of them together on one gross figure. Calculator.net does not have Malaysian statutory calculators.",
      },
      {
        q: "Does Calculator.net work for non-US tax?",
        a: "Not for income tax. Its Income Tax Calculator states it is for United States residents only. Its non-tax calculators — loans, geometry, health, unit conversion — are country-neutral and work fine wherever you are.",
      },
      {
        q: "Which site has more calculators?",
        a: "Calculator.net, by a wide margin — roughly 200 against our 51. If you need a specialised scientific or engineering calculator, go there. We have gone deep on salary, tax and statutory deductions instead of broad.",
      },
      {
        q: "Are my numbers sent to a server?",
        a: "Not on CalcHub. Every calculator runs in your browser in JavaScript, so a salary, a loan balance or a due date is computed on your own device and never submitted anywhere. There are no accounts and nothing is stored.",
      },
      {
        q: "Is CalcHub free?",
        a: "Yes, with no sign-up and no paid tier — the same as Calculator.net. Both sites are ad-supported.",
      },
    ],
  },
];
