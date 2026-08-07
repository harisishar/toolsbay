// Hand-written long-form guides published on the apex.
//
// These are deliberately NOT generated from a registry: the point of the apex
// is that it carries original editorial rather than another templated family.
// Each guide covers something that spans tools or sits underneath them, so none
// of them duplicates a tool page.
//
// Bodies allow inline HTML (see pages.ts) so claims can link their sources.
import { CONTACT_EMAIL, type Faq, type Section } from "@claudetools/seo";

export type Guide = {
  slug: string;
  title: string;
  desc: string;
  h1: string;
  // The citable opening passage: self-contained, 120-190 words, no "this
  // article will explain" throat-clearing.
  lead: string;
  sections: Section[];
  faq: Faq[];
  updated: string;
  // Where the reader goes next. Guides that answer a question should hand off
  // to the tool that does the work.
  cta: { label: string; href: string; note: string };
};

const UPDATED = "2026-08-07";

const ext = (href: string, text: string) =>
  `<a class="underline" href="${href}" rel="noopener noreferrer">${text}</a>`;
const a = (href: string, text: string) =>
  `<a class="underline" href="${href}">${text}</a>`;

const UPLOADING: Guide = {
  slug: "is-this-tool-uploading-my-files",
  title: "How to check whether an online tool is uploading your files",
  desc: "A free converter says it is private. Here is how to verify that yourself in about thirty seconds, using the browser you already have, on any site.",
  h1: "How to tell whether an online tool is uploading your files",
  lead: `Every free file converter claims to respect your privacy, and the claims are unfalsifiable as written: "we delete files after one hour" cannot be checked, and "your files are safe" means nothing at all. But there is one claim you can verify yourself in under a minute — whether the file leaves your device in the first place. A tool that processes files in your browser makes no upload request, and a tool that uploads makes one you can see. The browser's developer tools show you which, on any site, without installing anything. The distinction matters because "we delete it later" and "we never had it" are different risks: one depends on a company's retention policy, breach history and jurisdiction, and the other does not exist.`,
  sections: [
    {
      h: "The thirty-second version: watch the network",
      body: [
        `Open the tool's page. Press <kbd>F12</kbd> (or <kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd> on a Mac) to open developer tools, and click the <strong>Network</strong> tab. Clear the list with the ⃠ button so you are only looking at what happens next. Now add your file and run the tool.`,
        `If the file is being uploaded you will see a new request appear — usually <code>POST</code>, often to a path with <code>upload</code>, <code>convert</code> or <code>api</code> in it — and the important part is the size column. An upload request carrying a 4 MB photo is roughly 4 MB. That size, next to a request that appeared the moment you pressed the button, is the whole test. If nothing appears, or only small requests for scripts, fonts and adverts do, the work happened on your machine.`,
        `Two things commonly confuse this. Analytics and advert requests fire constantly and are a few kilobytes each — size tells them apart from an upload immediately. And some tools fetch a large WebAssembly module or model file <em>before</em> processing; that is a download, not an upload, and the Network tab labels the direction. A large incoming file followed by no outgoing request is the signature of a tool doing the work locally.`,
      ],
    },
    {
      h: "The stronger test: pull the plug",
      body: [
        `The network test tells you what happened once. This one tells you what is possible at all. Load the tool's page and let it finish loading. Then turn off your Wi-Fi, or switch developer tools to <strong>Offline</strong> in the Network tab's throttling dropdown. Now use the tool.`,
        `If it still works, the processing is unambiguously local — there is nothing left for it to talk to. If it hangs, errors, or tells you the upload failed, the work was being done somewhere else. This test cannot be faked, which is what makes it worth more than any wording on a privacy page.`,
        `Every tool on this site except the ten server-side PDF conversions passes the offline test, and those ten are labelled on the tool before you use them. Run it here if you like; run it on the site you were about to use for your payslip, which matters more.`,
      ],
    },
    {
      h: "Reading the signals before you even upload",
      body: [
        `Some things are visible without opening any tooling. A tool that shows a progress bar during "uploading" is telling you what it does. A tool that produces a shareable download <em>link</em> rather than a file has necessarily stored your document somewhere addressable. A file size limit is a strong hint: browsers do not care how large your file is, so a 10 MB cap usually reflects what a server is willing to accept.`,
        `Speed is a weaker but real signal. Local processing starts instantly and scales with your machine; a converter that takes exactly the same time for a small file as a large one, or that queues you behind other users, is not running on your computer.`,
        `None of these are proof on their own — check the network. But they tell you which sites are worth checking.`,
      ],
    },
    {
      h: "When it actually matters",
      body: [
        `For a meme you are resizing, it does not. For the documents people most often run through free converters, it does: payslips and bank statements, passport and identity card scans, signed contracts, medical letters, tax filings, and photographs of documents taken for a visa or loan application. These carry exactly the identifiers used for account takeover and identity fraud.`,
        `The realistic risk is not usually that a company reads your file. It is that a copy of it exists on infrastructure you have no visibility into, governed by a retention policy you did not read, in a jurisdiction you did not choose, at a company whose future breach you cannot predict. Deletion promises are made in good faith and are still promises about the future.`,
        `There is also a narrower case worth naming: documents you are contractually or legally not allowed to disclose to a third party. Uploading a client's contract to a free converter can be a confidentiality breach regardless of what the converter does with it, because the disclosure happened at the upload.`,
      ],
    },
    {
      h: "What server-side processing legitimately looks like",
      body: [
        `Not every upload is a red flag. Some conversions genuinely cannot run in a browser — rebuilding an editable Word document from a PDF, running OCR over a scan, or rendering a live web page to PDF all need a document engine far too large to ship to a tab. A tool that does those things honestly will say so.`,
        `What separates an honest server tool from an evasive one is disclosure before the fact: it tells you the file will be sent, says what happens to it afterwards, and does not bury that in a policy page. The pattern to distrust is the one that claims everything is local while quietly uploading, because a site willing to be wrong about that is not a good candidate for your trust on retention either.`,
      ],
    },
  ],
  faq: [
    {
      q: "Does an HTTPS padlock mean my file is private?",
      a: "No. HTTPS encrypts the file in transit, so nobody between you and the server can read it. It says nothing about what the server does with the file once it arrives, how long it is kept, or who can see it there. A padlock and an upload are entirely compatible.",
    },
    {
      q: "Can I do this test on a phone?",
      a: "Not easily — mobile browsers do not expose developer tools. The offline test works everywhere though: load the page, switch on aeroplane mode, then try the tool. If it works, it is local. On iOS and Android that is the practical version of this check.",
    },
    {
      q: "The tool downloaded a large file before working. Is that bad?",
      a: "No, that is usually the opposite. Tools that process locally often need to fetch a WebAssembly codec or a machine-learning model first, which can be tens of megabytes. That is data coming to you. What matters is whether your file goes the other way afterwards.",
    },
    {
      q: "What if a site says files are deleted after an hour?",
      a: "Take it at face value and note what it concedes: the file was uploaded and stored. That is a different risk profile from a file that never left your device, and the promise is unverifiable from outside. Judge it on how sensitive the document is.",
    },
    {
      q: "Is client-side processing always better?",
      a: "For privacy, yes. For capability, no — some conversions need engines that cannot run in a browser, and a local tool that produces a worse result is not a win. The right question is whether the trade is disclosed before you make it.",
    },
  ],
  updated: UPDATED,
  cta: {
    label: "Try it on our image compressor",
    href: "https://image.toolsbay.app/compress-image",
    note: "Open the Network tab, compress a photo, and watch nothing leave.",
  },
};

const MALAYSIA_PAY: Guide = {
  slug: "malaysia-take-home-pay",
  title: "Malaysian take-home pay: EPF, SOCSO, EIS and PCB explained",
  desc: "What comes out of a Malaysian salary: the four statutory deductions, the order they apply in, and why EPF and SOCSO step in bands rather than percentages.",
  h1: "Malaysian take-home pay, end to end",
  lead: `Four statutory deductions stand between a Malaysian gross salary and the amount that reaches the bank: EPF (KWSP) retirement contributions, SOCSO (PERKESO) social security, EIS employment insurance, and PCB monthly income tax. They are administered by three different agencies, calculated on three different definitions of "wages", and only one of them is a straightforward percentage. The most common reason a payslip does not match a rough mental estimate is that EPF and SOCSO are read from statutory contribution tables in wage bands rather than multiplied out, so the answer moves in steps rather than smoothly. Understanding the order they apply in — and which ones your employer pays on top rather than deducting from you — is the difference between checking a payslip and guessing at it.`,
  sections: [
    {
      h: "The four deductions, and who pays what",
      body: [
        `Two of the four are shared between you and your employer, and the split matters because only your half reduces your take-home pay. <strong>EPF</strong> is the largest: an employee share deducted from your salary and an employer share paid on top of it, both landing in your EPF account. The employer share is part of the cost of employing you but never appears in your net pay.`,
        `<strong>SOCSO</strong> covers two schemes — Employment Injury and Invalidity — and is likewise split, with the employer carrying the larger share. <strong>EIS</strong>, the Employment Insurance System, is the smallest of the four and split evenly. <strong>PCB</strong> (Potongan Cukai Bulanan) is entirely yours: it is monthly income tax withheld by your employer and remitted to LHDN against your eventual assessment.`,
        `So of the four, all reduce your take-home, but only PCB is wholly a tax in the ordinary sense. EPF is deferred savings you keep; SOCSO and EIS buy insurance cover. A "deduction" of 11% into your own retirement account is not the same kind of loss as an 11% tax, and payslip anxiety often comes from treating them identically.`,
      ],
    },
    {
      h: "Why EPF is a table, not a percentage",
      body: [
        `This is the single most common source of confusion. The headline EPF rates are well known, but for wages up to a statutory threshold, contributions are not calculated by multiplying your salary by a rate. They are read from the ${ext("https://www.kwsp.gov.my/", "EPF Third Schedule")}, a table that divides wages into bands and states an exact ringgit contribution for each band.`,
        `The practical consequence is that contributions step. Two colleagues on salaries a few ringgit apart can contribute the same amount, and a small raise can push you into the next band and move your contribution by more than the raise would suggest. Anyone who multiplies salary by the headline rate will be a ringgit or two out on most salaries, and will conclude their payslip is wrong when it is not.`,
        `Rates also vary by circumstance rather than being universal: they differ by age band, and the employer rate differs above and below a wage threshold. Non-citizens are treated differently again. This is why a calculator that asks only for your salary cannot be right for everyone, and why the ${a("/guides/why-salary-calculators-disagree", "different answers you get from different calculators")} usually come down to which of these it asked about.`,
      ],
    },
    {
      h: "SOCSO and EIS: contribution ceilings",
      body: [
        `SOCSO and EIS are also table-driven, and both apply a wage ceiling: above a certain monthly wage, contributions stop increasing. Everyone earning above that ceiling contributes the same fixed amount, which is why these two lines on a payslip look frozen for higher earners while EPF keeps rising.`,
        `That ceiling is periodically raised by ${ext("https://www.perkeso.gov.my/", "PERKESO")}, and a raise is exactly the kind of change that quietly makes every stale calculator wrong at once. If your SOCSO deduction changed without your salary changing, a ceiling revision is the usual explanation.`,
        `The two schemes differ in who they cover. EIS is employment insurance — it pays out if you lose your job — and has an upper age limit for contribution. SOCSO's Employment Injury scheme covers workplace accidents and commuting accidents, and applies more broadly. Neither is optional for eligible employees.`,
      ],
    },
    {
      h: "PCB: the one that depends on your whole year",
      body: [
        `PCB is monthly withholding against an annual tax liability, which makes it structurally different from the other three. Your employer computes it using the ${ext("https://www.hasil.gov.my/", "LHDN")} formula, which projects your annual income from your current month, applies the progressive band structure, and subtracts the reliefs it knows about.`,
        `The phrase doing the work there is "the reliefs it knows about". By default that is a narrow set — your own individual relief and your EPF contributions, which are themselves deductible. It does not know about your medical expenses, education fees, lifestyle purchases, insurance premiums, or a spouse with no income, unless you have filed a TP1 form with your employer to declare them.`,
        `This is why so many people receive a refund at filing time: PCB deliberately errs toward over-withholding, because under-withholding creates a bill. It also explains why PCB can jump sharply in a month with a bonus — the formula treats additional remuneration separately, and a one-off payment does not simply get taxed at your usual rate.`,
      ],
    },
    {
      h: "The order matters",
      body: [
        `The sequence is not arbitrary. EPF, SOCSO and EIS are computed from your gross wages. PCB is then computed on income <em>after</em> the EPF deduction has been applied as relief, because employee EPF contributions are tax-deductible up to an annual cap shared with life insurance premiums.`,
        `The effect is that EPF costs you less in take-home than its headline rate suggests: contributing an extra ringgit to EPF reduces your taxable income by a ringgit, so part of it is offset by lower PCB. For anyone in a higher band, voluntary additional EPF contributions are meaningfully cheaper in net terms than they look — up to the relief cap, after which the effect stops entirely.`,
        `Get the order wrong — apply PCB to gross, or forget the relief — and your estimate will be too low, sometimes by a lot. That single ordering error is behind a large share of "why is my payslip different" questions.`,
      ],
    },
    {
      h: "Checking a payslip",
      body: [
        `Work down the four lines in order. Confirm the EPF employee amount against the current Third Schedule band for your wage, not against a percentage. Check SOCSO and EIS against the contribution tables, remembering the ceiling. Then confirm the PCB figure — this is the one most likely to be legitimately surprising, especially in a bonus month or after a salary change mid-year.`,
        `If a figure is out, the usual causes are an age band that changed, a ceiling revision that took effect, a wage definition question (whether an allowance counts as wages for EPF purposes is a real and frequently misapplied distinction), or a TP1 that was filed but not applied. All four are worth raising with payroll with the specific table row in hand.`,
      ],
    },
  ],
  faq: [
    {
      q: "Does my employer's EPF contribution affect my take-home pay?",
      a: "No. The employer share is paid on top of your salary and goes into your EPF account; only the employee share is deducted from what you are paid. It is part of the total cost of employing you, which is why it appears in cost-to-company figures but never in your net pay.",
    },
    {
      q: "Why did my EPF deduction change when my salary barely moved?",
      a: "Because contributions for most wage levels are read from a banded table rather than multiplied out. Crossing into the next wage band moves your contribution by a fixed step, so a small raise can produce a disproportionate-looking change.",
    },
    {
      q: "Why is PCB so much higher in the month I get a bonus?",
      a: "Bonuses are treated as additional remuneration and are calculated separately from your regular monthly PCB rather than simply being added to that month's salary. The result is usually higher withholding than your normal rate, and often a refund at filing.",
    },
    {
      q: "Can I reduce my PCB during the year?",
      a: "Yes — file a TP1 with your employer declaring reliefs you are entitled to, such as medical expenses, education fees, insurance premiums or a spouse with no income. Without it, PCB is computed on a minimal set of reliefs and you recover the difference only at filing.",
    },
    {
      q: "Are allowances subject to EPF?",
      a: "It depends on the allowance. Some payments fall within the statutory definition of wages and some are specifically excluded, and misclassification is a common payroll error. Check the EPF definition for the specific allowance rather than assuming, because the answer differs between EPF, SOCSO and tax.",
    },
  ],
  updated: UPDATED,
  cta: {
    label: "Work out your Malaysian take-home pay",
    href: "https://calc.toolsbay.app/malaysia-salary-calculator",
    note: "EPF, SOCSO, EIS and PCB in one calculation, with the table rows shown.",
  },
};

const DISAGREE: Guide = {
  slug: "why-salary-calculators-disagree",
  title: "Why two salary calculators give you different numbers",
  desc: "Same salary, same country, two different take-home figures. The six assumptions that cause it, and how to tell which calculator is wrong.",
  h1: "Why two salary calculators disagree",
  lead: `Put the same gross salary into two take-home pay calculators and you will often get two different answers, sometimes hundreds apart. Neither is necessarily broken. Take-home pay is not a function of salary alone — it depends on a set of assumptions about your circumstances that most calculators make silently, because asking about all of them would produce a form nobody finishes. The differences cluster into six causes, and once you know them you can usually work out within a minute which calculator is modelling your situation and which is modelling a hypothetical single person with no dependants and no reliefs. The useful skill is not finding the "right" calculator but knowing which questions a calculator did not ask you.`,
  sections: [
    {
      h: "1. They disagree about what your salary is",
      body: [
        `"Gross salary" is ambiguous in ways that matter. Does the figure include a fixed allowance, a thirteenth month, a guaranteed bonus, employer contributions, or overtime? Different calculators default differently, and some countries have a statutory definition of "wages" for contribution purposes that excludes items your employment contract calls salary.`,
        `This bites hardest where contributions are involved. An allowance that counts as wages for one scheme and not another will change a contribution line without changing anything you would think of as your pay, and a calculator that takes one number cannot know which parts of it qualify.`,
      ],
    },
    {
      h: "2. They assume different reliefs and allowances",
      body: [
        `Almost every income tax system reduces taxable income before applying rates, and almost every calculator has to assume a default. Typically that default is the most conservative one: a single filer, no dependants, no additional deductions, taking only the standard personal allowance.`,
        `If you are married, filing jointly where that is permitted, supporting children or parents, paying deductible insurance premiums, repaying a qualifying student loan, or claiming education or medical relief, the default is wrong for you — usually in the direction of understating your take-home. A calculator that asks about marital status and dependants will diverge from one that does not, and the one that asked is closer for you specifically.`,
      ],
    },
    {
      h: "3. Table-driven contributions versus percentages",
      body: [
        `Several countries compute social contributions from statutory tables in wage bands rather than as a flat percentage. Malaysia's EPF is the clearest example: contributions are read from a schedule that steps in wage bands, so the true figure and the percentage approximation differ by small amounts at most salaries.`,
        `A calculator that multiplies by the headline rate will be consistently a little off, and it will be off in a way that never quite matches a payslip. Two calculators that disagree by a couple of units on a contribution line, while agreeing on everything else, are almost always a table implementation and a percentage approximation sitting next to each other. ${a("/guides/malaysia-take-home-pay", "The Malaysian breakdown")} goes through this in detail.`,
      ],
    },
    {
      h: "4. Ceilings, floors and thresholds",
      body: [
        `Most contribution schemes stop at a ceiling: above a certain wage, the contribution is capped. Many also have a floor, and some have a separate threshold at which a different rate applies. These are revised periodically, often at a budget, and a revision instantly makes every calculator that has not been updated wrong for everyone above the old ceiling.`,
        `This is the most common cause of a large, sudden disagreement between two calculators for a high salary and no disagreement at all for a low one. If two calculators agree at 3,000 and diverge at 15,000, look for a ceiling one of them has not updated.`,
      ],
    },
    {
      h: "5. Which tax year they are using",
      body: [
        `Tax years do not align with calendar years everywhere, rates change at the boundary, and a calculator may be using last year's bands, this year's, or next year's announced-but-not-yet-effective ones. Around a budget announcement, all three exist simultaneously on different sites.`,
        `A calculator that does not state which year it applies to cannot be checked, which is a reasonable basis for preferring one that does. Mid-year rate changes are worse still, because the correct annual figure is then a blend and calculators handle it inconsistently.`,
      ],
    },
    {
      h: "6. Rounding and order of operations",
      body: [
        `Statutory rounding is more specific than it sounds: some contributions round up to the next whole unit, some round to the nearest, some round at each step and some only at the end. Applied across twelve months these differences accumulate into a visible annual gap.`,
        `Order matters at least as much. Whether income tax is computed before or after deducting pension contributions changes the answer materially, and the correct order is a matter of statute rather than preference. A calculator that applies tax to gross where the law applies it after a deductible contribution will overstate tax for everyone.`,
      ],
    },
    {
      h: "How to tell which one to trust",
      body: [
        `Three questions settle it. Does it state the tax year or assessment period it applies to? Does it show the bands, tables and rates it used, or only the final number? Does it link the agency that publishes them?`,
        `A calculator that shows its working can be checked against the source in a minute. One that returns a single figure cannot be checked at all, and its confidence is not evidence. When two disagree, the one that shows its bands lets you find the discrepancy; the other only lets you pick a side.`,
        `Then check the questions it asked. If it never asked whether you have dependants and you do, it is not wrong so much as answering a different question than the one you meant.`,
      ],
    },
  ],
  faq: [
    {
      q: "Which calculator should I believe when two disagree?",
      a: "The one that shows the bands, tables and rates it applied, states its tax year, and links the agency that publishes them. That is checkable in a minute against the source. A single confident number with no working cannot be verified at all.",
    },
    {
      q: "Why does my payslip differ from every calculator?",
      a: "Usually because your employer knows things the calculator does not: declared reliefs, a mid-year salary change, an allowance classified differently for contribution purposes, or a prior-month adjustment. Payroll is computing a year-to-date position, not a standalone month.",
    },
    {
      q: "Do calculators account for bonuses correctly?",
      a: "Often not. Many tax systems treat one-off payments separately from regular pay, with their own withholding method. Adding a bonus to your monthly salary and running that through a standard calculator will usually give the wrong answer for both the bonus month and the year.",
    },
    {
      q: "How current do these need to be?",
      a: "Rates change at each country's budget and sometimes mid-year. A calculator that does not say which period it covers cannot tell you whether it is current, which is why every calculator here states its period and links its source.",
    },
  ],
  updated: UPDATED,
  cta: {
    label: "Compare take-home pay across countries",
    href: "https://calc.toolsbay.app/salary-calculator",
    note: "Each calculator shows the bands it used and links the agency that publishes them.",
  },
};

const IMAGE_FORMAT: Guide = {
  slug: "which-image-format-to-use",
  title: "Which image format should you actually use?",
  desc: "JPG, PNG, WebP, AVIF, HEIC, GIF and SVG compared by what they are for — with the transparency, compression and compatibility trade-offs that decide it.",
  h1: "Which image format to actually use",
  lead: `Most image format advice is a feature table that leaves you no better off. The decision is simpler than it looks, because the formats divide cleanly by what they were designed to do. JPEG throws away detail to make photographs small. PNG keeps every pixel exactly and supports transparency, which makes it right for graphics and wrong for photographs. WebP and AVIF do both jobs better than either but are newer, so the question becomes where the image has to work. GIF is obsolete for everything except nostalgia. SVG is not a picture at all but a set of drawing instructions. Answer three questions — is it a photograph, does it need transparency, and where will it be opened — and the format picks itself.`,
  sections: [
    {
      h: "The three questions",
      body: [
        `<strong>Is it a photograph or a graphic?</strong> Photographs have continuous gradients and no hard edges at the pixel level, which is exactly what lossy compression is built to exploit. Graphics — logos, screenshots, diagrams, text — have flat colour and sharp edges, which lossy compression turns into visible mush around every edge. This one question eliminates half the options.`,
        `<strong>Does it need transparency?</strong> If any part of the image must show what is behind it, JPEG is out entirely; it has no alpha channel and transparent areas will be flattened onto a background, usually white.`,
        `<strong>Where does it have to open?</strong> A web page, any modern browser, someone's ten-year-old desktop software, or a government upload form that accepts three formats. This is the question that overrides the other two, and the one people skip.`,
      ],
    },
    {
      h: "The photograph formats",
      body: [
        `<strong>JPEG</strong> is thirty years old and still the correct answer more often than any other format, because it opens everywhere without exception. It is lossy, and re-saving repeatedly compounds that loss, so keep an original. No transparency, no animation. If the destination is unknown, an upload form, or anything outside a browser, this is the safe choice.`,
        `<strong>WebP</strong> produces meaningfully smaller files than JPEG at comparable quality, supports transparency and animation, and works in every current browser. It is the sensible default for images on a web page you control. Outside browsers, support is patchier — some desktop and office software still refuses it, which is why it is a web format rather than a universal one.`,
        `<strong>AVIF</strong> compresses better still, especially at low file sizes and in gradients where JPEG shows banding, and handles wide colour and high dynamic range. Browser support is now broad. The trade is encoding time — AVIF is slow to produce compared with JPEG or WebP — and support outside browsers that is weaker than WebP's.`,
        `<strong>HEIC</strong> is what an iPhone produces by default. It compresses well, but support outside Apple's ecosystem is poor enough that it is a capture format rather than a sharing one. Converting to JPEG is the usual answer, and the thing to know is that Live Photo motion, depth data and edit history live in the HEIC container and do not survive.`,
      ],
    },
    {
      h: "The graphics formats",
      body: [
        `<strong>PNG</strong> is lossless with full alpha transparency. For logos, screenshots, diagrams, UI assets and anything containing text, it is correct: edges stay sharp and colours stay exact. Used on a photograph it produces a file several times larger than JPEG with no visible benefit, which is the single most common format mistake.`,
        `<strong>SVG</strong> stores drawing instructions rather than pixels, so it is resolution-independent: the same file is crisp on a watch and on a billboard, and it is usually tiny. It is right for logos, icons and diagrams that were drawn as vectors, and impossible for photographs. Converting a photograph to SVG does not vectorise it in any useful sense.`,
        `<strong>GIF</strong> is limited to 256 colours and is worse than PNG at everything except one thing: universally supported animation. Even there, an animated WebP or a short video file is smaller and better. Use it when something specifically requires GIF.`,
        `<strong>ICO</strong> exists for favicons and Windows icons and holds several sizes in one file. It is a packaging format, not a choice you make on quality grounds.`,
      ],
    },
    {
      h: "The compatibility trap",
      body: [
        `The most expensive format mistake is not choosing a slightly larger file. It is uploading an image the destination cannot read. Government portals, banking applications, job boards, university admissions systems and older enterprise software commonly accept only JPEG and PNG, and reject anything else with an unhelpful error.`,
        `The rule that avoids nearly all of this: <em>you</em> choose modern formats for images on a site you control, where you can measure the saving and control the browsers. For anything going to someone else's system, use JPEG for photographs and PNG for graphics. The bandwidth saved by being clever with a passport photograph upload is zero, and the cost of a rejected application is not.`,
      ],
    },
    {
      h: "Practical defaults",
      body: [
        `Photograph on your own web page: WebP, with AVIF if you can afford the encoding time and are serving many users. Photograph going anywhere else: JPEG. Logo, icon or diagram that exists as vector artwork: SVG. Screenshot, or any graphic containing text: PNG. Anything needing transparency where SVG is not possible: PNG, or WebP on the web.`,
        `Photograph from an iPhone that you need to send to somebody: convert to JPEG. Something that must animate and must work absolutely everywhere: GIF, reluctantly. Favicon: ICO, or SVG for modern browsers with an ICO fallback.`,
        `And whatever you choose, keep the original. Every lossy re-save compounds, and there is no way back to detail that has been discarded.`,
      ],
    },
  ],
  faq: [
    {
      q: "Is WebP always better than JPEG?",
      a: "Smaller at the same visual quality, yes, typically by a substantial margin. Better overall only where it opens. On a web page you control, use WebP. For a file going to an upload form, an email attachment or someone else's software, JPEG's universal support is worth more than the bytes.",
    },
    {
      q: "Why is my PNG photograph so large?",
      a: "PNG is lossless, so it stores every pixel exactly. That is efficient for flat colour and sharp edges and very inefficient for the continuous gradients in a photograph. Use JPEG or WebP for photographs; PNG only when you need transparency or exact pixels.",
    },
    {
      q: "Does converting between formats lose quality?",
      a: "Converting to a lossy format (JPEG, WebP, AVIF, HEIC) discards detail, and doing it repeatedly compounds. Converting to a lossless format (PNG) preserves what is there but cannot recover what a previous lossy save already removed. Always convert from the original.",
    },
    {
      q: "Should I use AVIF yet?",
      a: "For photographs on a site you control, yes — support is broad and the compression is the best available. Keep a WebP or JPEG fallback if you serve a wide audience, and expect encoding to be noticeably slower.",
    },
    {
      q: "What should I convert my iPhone photos to?",
      a: "JPEG, unless you know the destination handles HEIC. The photograph converts faithfully; what does not survive is Live Photo motion, depth maps and Apple's edit history, which live in the HEIC container rather than in the image.",
    },
  ],
  updated: UPDATED,
  cta: {
    label: "Convert between image formats",
    href: "https://image.toolsbay.app/image-converter",
    note: "29 format pairs, converted in your browser — nothing uploaded.",
  },
};

const PDF_COMPRESSION: Guide = {
  slug: "how-pdf-compression-works",
  title: "How PDF compression works, and why some PDFs will not shrink",
  desc: "What actually takes up space in a PDF, which parts can be reduced, and why a text document that is already small stays that way no matter what you do.",
  h1: "How PDF compression works",
  lead: `A PDF that will not compress is not a broken compressor — it is usually a document with nothing left to remove. PDFs are containers holding several kinds of object, and only some of them are worth compressing. Scanned documents are almost entirely image data and shrink dramatically. Text documents exported from a word processor are mostly instructions and embedded fonts, are already compressed internally, and will barely move. Knowing which kind you have tells you what to expect before you start, and stops you compressing a 200 KB contract five times looking for a saving that does not exist. The single question that predicts everything is one you can answer in two seconds: can you select the text with your cursor? If you can, the file is mostly instructions and already compressed. If you cannot, it is a stack of images and there is a great deal to remove.`,
  sections: [
    {
      h: "What is actually inside a PDF",
      body: [
        `A PDF is a set of numbered objects with a cross-reference table telling readers where each one lives. The objects that matter for size are images, embedded font programs, and content streams — the drawing instructions describing where each glyph and line goes on the page.`,
        `Most content streams are already compressed with Flate, the same algorithm as ZIP, when the file is written. This is why "just zip the PDF" achieves almost nothing: you are compressing data that is already compressed. It also means the text of even a long document is small. A hundred pages of prose is a few hundred kilobytes at most.`,
        `Which leaves images and fonts. In nearly every PDF that is uncomfortably large, images are the answer.`,
      ],
    },
    {
      h: "The one question that predicts everything",
      body: [
        `Open the document and try to select a line of text with your cursor. If you can, it is a <strong>text PDF</strong>: the words exist as text with embedded fonts, and the file is mostly instructions. Expect modest savings — often ten to thirty per cent, sometimes nothing.`,
        `If you cannot select anything, and dragging just draws a box, it is a <strong>scanned PDF</strong>: every page is a photograph of a page, and the file is essentially a bundle of images in a PDF wrapper. Expect dramatic savings, frequently seventy to ninety per cent, because scanners produce images at far higher resolution and quality than reading requires.`,
        `A large text PDF is usually a hybrid — a report with embedded photographs or charts. It compresses in proportion to how much of its size is those images.`,
      ],
    },
    {
      h: "What a compressor actually does",
      body: [
        `<strong>Downsampling</strong> is the big one. A page scanned at 600 DPI holds four times the pixel data of the same page at 300 DPI, and for reading on screen or printing normally, 150 to 200 DPI is usually indistinguishable. Reducing resolution is where the majority of any large saving comes from.`,
        `<strong>Re-encoding</strong> converts images to a more efficient format or a lower quality setting — typically JPEG at a chosen quality. This is lossy and cannot be undone, which is why compressing an already-compressed PDF repeatedly degrades it while saving progressively less.`,
        `<strong>Font subsetting</strong> strips the unused glyphs from embedded fonts. A full font file carries thousands of characters; a document uses a few hundred. This matters most in short documents with several embedded fonts, where fonts can be most of the file.`,
        `<strong>Structural cleanup</strong> removes orphaned objects, deduplicates identical resources — the same logo embedded once per page instead of once — and packs objects into compressed object streams. Individually small, and occasionally startling on files produced by badly behaved generators.`,
      ],
    },
    {
      h: "Why yours will not shrink",
      body: [
        `<strong>It is already small.</strong> A 150 KB text document has essentially nothing to remove. Compression is not a percentage that applies to any file; below a certain size you are trying to squeeze structural overhead.`,
        `<strong>It has been compressed before.</strong> Lossy compression is not repeatable. Once resolution and quality are down, a second pass has little left to take and mostly degrades quality further.`,
        `<strong>It is mostly vector content.</strong> A CAD drawing or a complex chart can be enormous because it contains hundreds of thousands of individual drawing instructions. There are no images to downsample and the instructions are already Flate-compressed.`,
        `<strong>The images are already efficient.</strong> Photographs exported at sensible resolution from software that knew what it was doing leave nothing on the table.`,
      ],
    },
    {
      h: "Choosing a target sensibly",
      body: [
        `Work backwards from the destination. Email attachment limits are commonly 10 to 25 MB. Government and banking upload forms are frequently far stricter — 2 MB, sometimes 1 MB, and often per file. Print production wants the opposite: 300 DPI images and embedded fonts, so compressing before sending to a printer can be actively harmful.`,
        `For a scan that only needs to be readable on screen and legible when printed, 150 DPI in greyscale is usually enough and often turns a 20 MB scan into under 1 MB. For a document with photographs where the photographs matter, compress less and accept a larger file.`,
        `If a scanned document has to be small <em>and</em> searchable, run ${ext("https://pdf.toolsbay.app/ocr-pdf", "OCR")} first. It adds an invisible text layer, which makes the document selectable and searchable, and then compression of the underlying image works as normal.`,
      ],
    },
  ],
  faq: [
    {
      q: "Why did compressing my PDF barely change the size?",
      a: "It is almost certainly a text document rather than a scan. Text and drawing instructions are already Flate-compressed when the PDF is written, so there is little left to remove. Try selecting text with your cursor: if you can, expect small savings.",
    },
    {
      q: "Does compressing a PDF lose quality?",
      a: "It depends what is being compressed. Structural cleanup and font subsetting are lossless. Downsampling and re-encoding images are lossy and permanent, which is where nearly all large savings come from. Keep the original.",
    },
    {
      q: "Why is my scanned PDF so enormous?",
      a: "Scanners default to high resolution and often full colour, producing a large image per page. A 600 DPI colour scan holds many times the data needed to read the page. Downsampling to 150-200 DPI, and to greyscale where colour is not needed, usually removes most of it.",
    },
    {
      q: "Can I compress a PDF twice to make it smaller?",
      a: "You can, but the second pass saves little and degrades quality further, because lossy compression is not repeatable. If one pass did not reach your target, compress the original again at a stronger setting rather than compressing the output.",
    },
    {
      q: "Will compressing break the text or the links?",
      a: "It should not. Text, links, bookmarks and form fields are structural and survive image compression. What changes is image resolution and quality. If text becomes unselectable after compression, the document was a scan to begin with and never had real text.",
    },
  ],
  updated: UPDATED,
  cta: {
    label: "Compress a PDF",
    href: "https://pdf.toolsbay.app/compress-pdf",
    note: "Runs in your browser — the file is never uploaded.",
  },
};

const PDF_TO_WORD: Guide = {
  slug: "why-pdf-to-word-is-never-perfect",
  title: "Why PDF to Word conversion is never perfect",
  desc: "A PDF holds no paragraphs, tables or reading order. What converters must infer, why some files convert cleanly, and when to run OCR first.",
  h1: "Why PDF to Word is never perfect",
  lead: `PDF to Word conversion disappoints people because of a reasonable but wrong assumption: that the Word document is in there somewhere and the converter just has to get it out. It is not. A PDF is a page description language — it records that a particular glyph sits at particular coordinates in a particular font, and nothing about paragraphs, headings, tables, columns or reading order. Converting to Word means <em>inferring</em> all of that from geometry. Sometimes the inference is easy and the result is near-perfect; sometimes the information required was never in the file. Which of those you get is largely decided by how the PDF was made, and you can usually predict it before you convert rather than discovering it afterwards in a mangled table.`,
  sections: [
    {
      h: "What a PDF actually stores",
      body: [
        `A PDF page is a sequence of drawing operations. Set a font, move to a position, show a string of glyphs, move again. There is no object representing "a paragraph" and no object representing "a table" — a table is some horizontal and vertical lines drawn on the page, with text positioned in the gaps.`,
        `Reading order is not stored either. The order glyphs appear in the file is the order the generator emitted them, which for a two-column layout may be down the left column then down the right, or may alternate between them, or may be scattered by an optimiser. Nothing in the file says which is meant to be read first.`,
        `Even words are an inference. Many PDFs contain no space characters at all — the gap between words is a positioning instruction, and the converter must decide from the gap width whether two glyph runs are one word or two. Get the threshold wrong and you get "th e docum ent".`,
      ],
    },
    {
      h: "What the converter has to guess",
      body: [
        `<strong>Paragraphs</strong> from vertical gaps and line-start positions. <strong>Headings</strong> from font size and weight relative to surrounding text. <strong>Lists</strong> from repeated leading characters and indentation. <strong>Tables</strong> from drawn rules and from text alignment where no rules exist. <strong>Columns</strong> from horizontal whitespace running down the page. <strong>Reading order</strong> from all of the above combined.`,
        `Each of these is a heuristic, and each fails in a predictable way. Borderless tables become tab-separated text or a jumble. Merged cells break grid detection. A table split across two pages becomes two unrelated tables. A pull quote in the middle of a column gets spliced into the sentence it interrupts. A footer repeated on every page becomes a paragraph in the body.`,
      ],
    },
    {
      h: "Why some PDFs convert beautifully",
      body: [
        `The best case is a PDF exported from a word processor. The layout is simple and regular, the fonts are embedded with proper character mappings, and the generator emitted content in reading order. The converter's guesses are all easy and the result can be close to the original document.`,
        `Better still is a <strong>tagged PDF</strong>. Tagging adds a structure tree describing headings, paragraphs, lists, table rows and reading order explicitly — the very information the format otherwise lacks. It exists for accessibility, so screen readers can navigate a document, and it is a requirement of PDF/UA and of accessibility rules in many jurisdictions. A properly tagged PDF converts well because the converter no longer has to guess.`,
        `You can check: in most readers, document properties will indicate whether the file is tagged. Untagged, complex, multi-column, heavily designed layouts are where conversion goes wrong, and design-tool output — magazine layouts, brochures, annual reports — is the hardest case, because visual position carries meaning that was never written down.`,
      ],
    },
    {
      h: "The scanned document case",
      body: [
        `If you cannot select text in the PDF, there is no text in it. Every page is an image, and a converter will faithfully produce a Word document containing pictures of pages — technically correct and completely useless.`,
        `The fix is ${ext("https://pdf.toolsbay.app/ocr-pdf", "OCR")}: optical character recognition reads the pixels and produces text, adding a searchable layer. Convert after that and you get real editable text.`,
        `The caveat is that OCR introduces its own errors, and they are different from conversion errors. Character confusions in poor scans, mangled table structure, and lost formatting are all normal. OCR output should be proofread rather than trusted — particularly for numbers, where a misread digit will not look wrong the way a misread word does.`,
      ],
    },
    {
      h: "Getting the best result",
      body: [
        `Check whether the source document still exists before converting anything. A conversion is always worse than the original, and the person who sent the PDF often still has the DOCX.`,
        `Ask what you actually need. If you need the text, converting to plain text or Markdown is far more reliable than DOCX, because it discards the layout the converter would otherwise guess at badly. If you need a specific table, extracting to ${ext("https://pdf.toolsbay.app/pdf-to-excel", "Excel")} targets that problem directly. If you need to change three words on a page, ${ext("https://pdf.toolsbay.app/edit-pdf", "editing the PDF")} avoids the round trip entirely — a full conversion to make a small edit is usually the wrong move.`,
        `And check the output against the original, especially tables and numbers. The failure mode of conversion is not a file that obviously breaks; it is a file that looks right and has a column silently shifted.`,
      ],
    },
  ],
  faq: [
    {
      q: "Why did my tables come out scrambled?",
      a: "A PDF has no table objects — just lines and positioned text. Converters infer the grid from rules and alignment, which works on clean bordered tables and fails on borderless ones, merged cells, multi-line entries, and tables split across pages. Always check tables against the original.",
    },
    {
      q: "The converted file is just images. What happened?",
      a: "The PDF was a scan, so it contains no text to convert. Run OCR first to add a text layer, then convert. You can check in advance by trying to select text in the PDF: if you cannot, it is a scan.",
    },
    {
      q: "Which converter is the most accurate?",
      a: "Accuracy is dominated by the source file rather than the converter. A tagged PDF exported from a word processor converts well almost anywhere; an untagged multi-column design layout converts badly everywhere. Check whether your PDF is tagged before blaming the tool.",
    },
    {
      q: "Is there a way to convert with no loss at all?",
      a: "No. The information a Word document needs — paragraphs, reading order, table structure — is not stored in an untagged PDF, so it must be inferred. If the original document exists, use it; that is the only lossless path.",
    },
    {
      q: "Why do words run together or split apart?",
      a: "Many PDFs contain no space characters. Word boundaries are gaps between positioned glyph runs, and the converter decides from gap width whether a gap is a space. Unusual letter spacing or justified text pushes those gaps outside the expected range.",
    },
  ],
  updated: UPDATED,
  cta: {
    label: "Convert a PDF to Word",
    href: "https://pdf.toolsbay.app/pdf-to-word",
    note: "One of the ten server-side tools — the file is streamed through and stored nowhere.",
  },
};

const QR_STATIC_DYNAMIC: Guide = {
  slug: "static-vs-dynamic-qr-codes",
  title: "Static vs dynamic QR codes: what you gain and what you give up",
  desc: "Dynamic QR codes let you change the destination and see scan counts. They also stop working if you stop paying. When each one is the right choice.",
  h1: "Static vs dynamic QR codes",
  lead: `A static QR code contains the destination itself: scan it and your phone reads the URL, the WiFi credentials, or the contact details directly out of the pattern. A dynamic QR code contains a short link to a vendor's server, which redirects to wherever you have currently pointed it. That single difference produces every other difference between them. Dynamic codes can be edited after printing and can count scans, which is genuinely useful. They also depend on a third party staying in business, keeping that redirect alive, and on you continuing to pay — and a printed dynamic code whose subscription lapsed is a dead code on a permanent object. Neither is better; they solve different problems, and the wrong one is expensive in a way that is not obvious until later.`,
  sections: [
    {
      h: "The mechanical difference",
      body: [
        `Scan a static QR code for this site and your phone reads the address out of the pattern itself. Nothing is contacted to resolve it; the data is in the ink. Scan a dynamic one and your phone reads something like <code>qr-vendor.example/a7Bx2</code>, requests it, and the vendor's server responds with a redirect to the real destination.`,
        `That indirection is the entire feature set. Because the printed pattern encodes only the short link, you can change what it points to without reprinting. Because every scan passes through the vendor's server, it can be counted, timed and geolocated.`,
        `It is also the entire risk. The printed pattern is now a pointer to somebody else's infrastructure, and its usefulness lasts exactly as long as that infrastructure and your relationship with it.`,
      ],
    },
    {
      h: "What dynamic codes genuinely give you",
      body: [
        `<strong>Editability after printing.</strong> This is the real value. A code on a restaurant menu stand can point at this season's menu; a code on packaging printed a year in advance can point at a support page that has since moved. Anything printed in volume, or fixed to something permanent, benefits from the destination not being set in ink.`,
        `<strong>Scan analytics.</strong> Counts, times, rough locations, device types. If you are running a campaign across several placements and need to know which poster worked, static codes cannot tell you — though pointing several static codes at different URLs with tracking parameters gets you most of the way for free.`,
        `<strong>A smaller, more reliable pattern.</strong> A short redirect link encodes into fewer modules than a long URL with campaign parameters, producing a visually simpler code that scans faster, from further away, and survives more damage. For a long destination URL printed small, this is a real practical gain rather than a marketing one.`,
      ],
    },
    {
      h: "What you give up",
      body: [
        `<strong>The code dies with the subscription.</strong> This is the one that catches people. Stop paying, or exceed a scan quota on a free tier, and every printed code stops working — often redirecting to the vendor's upgrade page, which is worse than a plain failure because customers see it. Codes on business cards, packaging, signage and vehicle livery outlive most subscriptions.`,
        `<strong>The vendor becomes a dependency.</strong> If they have an outage, your codes are down. If they are acquired or shut down, your codes are gone. Many QR vendors are small businesses, and a code printed on ten thousand product boxes has a longer expected life than the average startup.`,
        `<strong>Scanning gets slower and more fragile.</strong> Every scan makes a network request before reaching the destination. In a car park, a basement, a trade hall with congested WiFi, or anywhere with poor signal, the extra hop is where the scan fails. A static code carrying WiFi credentials works with no connectivity at all, which is precisely when you need it.`,
        `<strong>Scan data goes to a third party.</strong> Your customers' scan events are logged by a company they have never heard of, which may matter for your privacy notice.`,
      ],
    },
    {
      h: "What is actually being sold",
      body: [
        `Worth being clear about the economics, because it shapes the advice you find elsewhere. Generating a QR code is a solved problem — the encoding is a published standard and the libraries are free and open source. Nobody can build a subscription business on generating patterns.`,
        `What is being sold is the redirect service and the analytics dashboard: hosting a short link, logging scans, and letting you change the target. That is a real service with real running costs. But it explains why so many "QR generator" sites push hard toward dynamic codes, put static ones behind a smaller button, and sometimes make static codes expire — which is a business decision, not a technical constraint. A static QR code cannot expire. The pattern is the data.`,
      ],
    },
    {
      h: "Choosing",
      body: [
        `<strong>Use static</strong> when the destination will not change: WiFi credentials, contact details on a business card, a link to your homepage, a permanent product page, anything on a museum label or a plaque. Use it whenever the code needs to work without connectivity, and whenever the printed object will outlive your certainty about paying a subscription.`,
        `<strong>Use dynamic</strong> when the destination genuinely will change, when you are running a campaign that needs per-placement measurement, or when the URL is long and the printed code must be small. Then treat it as infrastructure: know what happens when the subscription lapses, whether you can export or redirect your codes if you leave, and whether the vendor offers a custom domain — which is the one feature that makes a dynamic code portable, because you can repoint the domain if the vendor disappears.`,
        `A reasonable middle path for measurement without lock-in: a static code pointing at a URL on your own domain, with a redirect you control. You get editability and analytics from your own server logs, and nothing expires but your own hosting.`,
      ],
    },
  ],
  faq: [
    {
      q: "Do static QR codes expire?",
      a: "No. The destination is encoded in the pattern, so there is nothing to expire and no server involved. A static code printed today will scan identically in twenty years. Any site telling you its static codes expire has made that a business decision, not a technical one.",
    },
    {
      q: "Can I convert a printed dynamic code to a static one?",
      a: "Not the printed code — its pattern encodes the vendor's short link, and that cannot be changed without reprinting. You can generate a new static code with the final destination and reprint. This is the trap: the switching cost is a reprint of everything already in the world.",
    },
    {
      q: "Can I track scans without a subscription?",
      a: "Yes, partly. Point a static code at a URL on your own domain with campaign parameters, and your own analytics or server logs record the visits. You lose per-scan detail such as device and precise timing, but you get placement-level measurement with nothing to renew.",
    },
    {
      q: "Which type is more reliable at scanning?",
      a: "Static, in poor conditions. It resolves with no network request at all, while a dynamic code must reach the vendor's server first. Dynamic codes can be visually simpler when the real URL is long, which helps in poor light or at distance — so the answer depends on whether your constraint is connectivity or print size.",
    },
    {
      q: "What happens if the QR vendor goes out of business?",
      a: "Every dynamic code they host stops resolving, and there is no recovery short of reprinting. Using a vendor that supports your own custom domain for the short links is the practical mitigation, since you can repoint the domain elsewhere.",
    },
  ],
  updated: UPDATED,
  cta: {
    label: "Generate a static QR code",
    href: "https://qr.toolsbay.app",
    note: "Made in your browser, encoded in the pattern, no account and nothing to expire.",
  },
};

const PAYMENT_QR: Guide = {
  slug: "payment-qr-codes-in-asia",
  title: "Payment QR codes in Asia: DuitNow, PayNow, UPI, PromptPay and QRIS",
  desc: "How the major Asian payment QR schemes work, what is actually encoded in them, and why you cannot generate a valid merchant payment code with a generic QR tool.",
  h1: "Payment QR codes across Asia",
  lead: `Asia settled on QR codes for payments while much of the world was still tapping cards, and the result is a set of national schemes that look identical and are not interchangeable. Malaysia's DuitNow QR, Singapore's PayNow and SGQR, India's UPI, Thailand's PromptPay and Indonesia's QRIS each encode payment instructions that only their own banking apps understand. Most are built on the same EMVCo specification, which is why they look alike; UPI is the outlier, using a URI scheme rather than EMVCo's tag structure. The practical thing to know before you try to make one: a merchant payment QR must be issued through a licensed bank or payment provider, because it carries a registered merchant identifier that only they can allocate. A generic QR generator cannot produce one, and any tool claiming otherwise is producing something that will not work.`,
  sections: [
    {
      h: "The common foundation: EMVCo",
      body: [
        `Most of these schemes implement the ${ext("https://www.emvco.com/emv-technologies/qr-codes/", "EMVCo QR Code Specification for Payment Systems")}, which defines a compact format of numbered tags: a payload format indicator, whether the code is static or dynamic, one or more merchant account identifiers, a merchant category code, the transaction currency as an ISO 4217 number, an optional amount, the country code, the merchant name and city, and a CRC checksum at the end.`,
        `That shared structure is why a Malaysian and a Thai payment QR look the same to a camera and why a single printed code can carry several schemes at once — the format allows multiple merchant account identifiers, each tagged for a different network. Singapore's SGQR is the clearest example, combining many schemes into one label.`,
        `What it does not give you is interoperability by default. A banking app reads the identifiers it recognises and ignores the rest. Cross-border acceptance — a Malaysian app paying a Thai merchant — exists where the two operators have specifically linked their networks, not as a property of the format.`,
      ],
    },
    {
      h: "The national schemes",
      body: [
        `<strong>DuitNow QR (Malaysia)</strong>, operated by ${ext("https://www.paynet.my/", "PayNet")}, is the national standard: one code accepted by every participating Malaysian banking and e-wallet app. Merchant codes are issued through banks and acquirers; consumers can also display a personal DuitNow QR from their banking app for transfers between individuals.`,
        `<strong>PayNow and SGQR (Singapore)</strong> route payments to a mobile number, NRIC or entity registration number rather than an account number. SGQR is the unified label that combines PayNow with other accepted schemes on a single sticker.`,
        `<strong>UPI (India)</strong>, run by ${ext("https://www.npci.org.in/what-we-do/upi/product-overview", "NPCI")}, is the structural outlier. A UPI QR encodes a <code>upi://pay</code> URI with parameters — <code>pa</code> for the payee address (the Virtual Payment Address, like <code>name@bank</code>), <code>pn</code> for the payee name, <code>am</code> for an amount, <code>tn</code> for a note. Because it is a URI, scanning it opens whichever UPI app is installed via an intent, which is why the ecosystem is so app-diverse.`,
        `<strong>PromptPay (Thailand)</strong> follows EMVCo and links payments to a mobile number, national ID or tax ID. <strong>QRIS (Indonesia)</strong>, mandated by Bank Indonesia, unified a fragmented wallet market into one standard that every provider must accept — a single merchant code works with every Indonesian wallet.`,
      ],
    },
    {
      h: "Static and dynamic, in the payments sense",
      body: [
        `Payment QR codes use "static" and "dynamic" differently from ${a("/guides/static-vs-dynamic-qr-codes", "the general QR meaning")}, and confusing the two causes real errors.`,
        `A <strong>static payment QR</strong> is the printed sticker on the counter. It identifies the merchant but carries no amount, so the customer types it in. One code serves every transaction forever, which is cheap and simple, and shifts the risk of a mistyped amount to the customer.`,
        `A <strong>dynamic payment QR</strong> is generated per transaction with the amount and a reference already in it, usually shown on a terminal or phone screen. The customer cannot mistype, and reconciliation is automatic because the reference ties the payment to the sale. This has nothing to do with a redirect service — the data is still fully encoded in the pattern.`,
        `For anything above trivial volume, dynamic is what you want, and it is what an acquirer's terminal or payment SDK produces.`,
      ],
    },
    {
      h: "Why you cannot generate a merchant code yourself",
      body: [
        `A merchant payment QR contains a merchant identifier allocated by an acquiring bank or licensed payment provider, tied to a settlement account, under a merchant agreement, subject to KYC. That identifier is what tells the network where money goes. It is not a value you can invent, and no generator can allocate one.`,
        `So a tool that offers to "generate a DuitNow QR" from a name and a phone number is producing a pattern that is either malformed or points nowhere. The correct route to a merchant code is your bank or a licensed payment provider, who will issue the code and the sticker.`,
        `Personal transfer codes are different: your own banking app can display a personal receiving QR, generated by the bank against your own account. That is the app's job, not a third-party generator's, and you should be sceptical of any site asking for banking details to make one for you.`,
        `The security point that follows is the one worth passing on: <strong>QR sticker replacement fraud</strong> is common across every one of these markets. Someone pastes their own code over a merchant's. Because the customer's app shows the payee name before confirming, the defence is simply to read that name — and for merchants, to check periodically that the sticker on the counter is still theirs.`,
      ],
    },
    {
      h: "What generic QR tools are legitimately for",
      body: [
        `Plenty of useful codes are not payment instructions, and those you can and should make yourself: a link to your online ordering page, your menu, a review or feedback form, your WiFi credentials for customers, your business contact details as a vCard.`,
        `These are static codes in the ordinary sense — the data is in the pattern, nothing expires, and no intermediary is involved. Pairing a bank-issued payment code with a self-made link code covers most of what a small business actually needs at the counter.`,
        `If you are printing either, test with more than one phone before committing to a print run, and leave the quiet zone — the blank margin around the pattern — intact. Crowding it is the most common reason a technically valid code fails to scan.`,
      ],
    },
  ],
  faq: [
    {
      q: "Can I make my own DuitNow, PayNow or QRIS merchant code?",
      a: "No. Merchant payment codes carry an identifier issued by a licensed bank or payment provider, tied to a settlement account under a merchant agreement. Apply through your bank. A personal receiving code, where the scheme supports one, is generated inside your own banking app.",
    },
    {
      q: "Why does one code work in some apps and not others?",
      a: "Each app reads the merchant identifiers belonging to networks it participates in and ignores the rest. Unified schemes such as SGQR and QRIS exist precisely to solve this by carrying multiple identifiers, or by mandating one standard everyone must accept.",
    },
    {
      q: "Can I pay a Thai merchant with a Malaysian app?",
      a: "Only where the two national operators have established a cross-border link, and usually only through participating banks. It works because of a specific bilateral arrangement rather than because both use the EMVCo format. Check with your bank before travelling and assume nothing.",
    },
    {
      q: "How do I avoid a tampered payment QR?",
      a: "Read the payee name your app shows before confirming — it comes from the code and will be wrong if the sticker was swapped. Be wary of a code pasted over another, and check the amount. Merchants should periodically verify the sticker on the counter is still their own.",
    },
    {
      q: "Is UPI different from the others?",
      a: "Structurally, yes. UPI encodes a upi:// URI with query parameters rather than EMVCo's tag format, so scanning it triggers an app intent on the device. The others follow the EMVCo tag specification, which is why they can be combined into a single unified label.",
    },
  ],
  updated: UPDATED,
  cta: {
    label: "Make a QR code for your link, menu or WiFi",
    href: "https://qr.toolsbay.app",
    note: "For payment codes, go to your bank — these are the ones you can make yourself.",
  },
};

export const GUIDES: Guide[] = [
  UPLOADING,
  MALAYSIA_PAY,
  DISAGREE,
  IMAGE_FORMAT,
  PDF_COMPRESSION,
  PDF_TO_WORD,
  QR_STATIC_DYNAMIC,
  PAYMENT_QR,
];

export const GUIDES_INDEX = {
  title: "Guides — ToolsBay",
  desc: "Practical guides on file privacy, take-home pay, image formats, PDF internals and QR codes — the parts that do not fit on a tool page.",
  h1: "Guides",
  lead: `Some things are worth explaining properly rather than squeezing into a tool page: how to check whether a website is uploading your files, what actually comes out of a Malaysian salary, why two salary calculators disagree, which image format to pick, what makes a PDF refuse to compress, and what you give up when a QR code is dynamic. These are written to be read once and remembered, and each links the primary sources behind its claims.`,
  updated: UPDATED,
};
