import type { Faq } from './seo.js';

export type Field = {
  model: string;
  label: string;
  input?: 'text' | 'textarea' | 'select' | 'checkbox';
  options?: [value: string, label: string][];
  placeholder?: string;
  half?: boolean;
};

export type QrType = {
  slug: string;
  type: string;
  label: string;
  title: string;
  desc: string;
  h1: string;
  intro: string;
  fields: Field[];
  faq: Faq[];
};

export const QR_TYPES: QrType[] = [
  {
    slug: 'url-qr-code',
    type: 'url',
    label: 'URL',
    title: 'URL QR Code Generator — Free Link to QR Code',
    desc: 'Turn any link into a QR code for free. Downloads as PNG, SVG or JPG, no sign-up, no watermark, and the code never expires.',
    h1: 'URL QR Code Generator',
    intro:
      'Paste a link and get a scannable QR code instantly. Everything runs in your browser — the URL is never uploaded to a server — and the generated code is static, so it keeps working forever.',
    fields: [{ model: 'f.url', label: 'Website URL', placeholder: 'example.com/page' }],
    faq: [
      {
        q: 'Does the QR code expire?',
        a: 'No. This generator produces static QR codes: the URL is encoded directly into the image, so it works for as long as the link itself works. There is no account and nothing stored on our side.',
      },
      {
        q: 'Can I use the QR code commercially?',
        a: 'Yes. QR codes generated here are free for personal and commercial use — print them on packaging, menus, posters or business cards without attribution.',
      },
      {
        q: 'What size should I print a QR code?',
        a: 'A rule of thumb is a 10:1 distance-to-size ratio: a code scanned from 25 cm away should be at least 2.5 cm wide. Download the SVG for crisp printing at any size.',
      },
    ],
  },
  {
    slug: 'text-qr-code',
    type: 'text',
    label: 'Text',
    title: 'Text QR Code Generator — Encode Any Text Free',
    desc: 'Create a QR code from plain text for free. Works offline in your browser, downloads as PNG, SVG or JPG with no watermark.',
    h1: 'Text QR Code Generator',
    intro:
      'Encode any plain text — a note, a serial number, a coupon code — into a QR code. Scanners will display the text directly, no internet connection required.',
    fields: [
      { model: 'f.text', label: 'Your text', input: 'textarea', placeholder: 'Type or paste any text…' },
    ],
    faq: [
      {
        q: 'How much text fits in a QR code?',
        a: 'Up to 4,296 alphanumeric characters at the lowest error-correction level, but codes get dense and hard to scan past a few hundred characters. Keep it short, or raise the size if you need more.',
      },
      {
        q: 'Does scanning a text QR code need internet?',
        a: 'No. The text is stored inside the code itself, so any camera app can decode it fully offline.',
      },
    ],
  },
  {
    slug: 'wifi-qr-code',
    type: 'wifi',
    label: 'WiFi',
    title: 'WiFi QR Code Generator — Share Your Network Free',
    desc: 'Create a WiFi QR code so guests connect to your network with one scan. Free, no sign-up, password never leaves your browser.',
    h1: 'WiFi QR Code Generator',
    intro:
      'Let guests join your WiFi by pointing their camera at a code — no typing long passwords. iPhones and Android phones both support WiFi QR codes natively. Your network name and password are encoded locally in your browser and never uploaded anywhere.',
    fields: [
      { model: 'f.ssid', label: 'Network name (SSID)', placeholder: 'MyHomeWiFi', half: true },
      { model: 'f.password', label: 'Password', placeholder: 'Network password', half: true },
      {
        model: 'f.security',
        label: 'Security',
        input: 'select',
        options: [
          ['WPA', 'WPA / WPA2 / WPA3'],
          ['WEP', 'WEP (legacy)'],
          ['nopass', 'Open network (no password)'],
        ],
        half: true,
      },
      { model: 'f.hidden', label: 'Hidden network', input: 'checkbox', half: true },
    ],
    faq: [
      {
        q: 'Is it safe to make a WiFi QR code online?',
        a: 'With this tool, yes: the code is generated entirely in your browser with JavaScript. Your SSID and password are never sent to a server. You can even load the page, go offline, and generate the code.',
      },
      {
        q: 'How do guests use the WiFi QR code?',
        a: 'On iPhone (iOS 11+) and Android (10+), opening the camera and pointing it at the code shows a "Join network" prompt. One tap connects — no password typing.',
      },
      {
        q: 'What if I change my WiFi password?',
        a: 'The old code stops working, since the password is stored inside it. Just generate a new code — it takes seconds and is free.',
      },
    ],
  },
  {
    slug: 'vcard-qr-code',
    type: 'vcard',
    label: 'vCard',
    title: 'vCard QR Code Generator — Contact Card QR Free',
    desc: 'Create a vCard QR code that adds your contact details to any phone with one scan. Free, unlimited, no watermark, data stays in your browser.',
    h1: 'vCard QR Code Generator',
    intro:
      'A vCard QR code puts your name, phone, email and company into a scannable code. Scanning it opens the "Add contact" screen on iPhone and Android — perfect for business cards, email signatures and conference badges. All details are encoded locally; nothing is uploaded.',
    fields: [
      { model: 'f.firstName', label: 'First name', half: true },
      { model: 'f.lastName', label: 'Last name', half: true },
      { model: 'f.org', label: 'Company', half: true },
      { model: 'f.title', label: 'Job title', half: true },
      { model: 'f.workPhone', label: 'Work phone', half: true },
      { model: 'f.mobile', label: 'Mobile', half: true },
      { model: 'f.vEmail', label: 'Email', half: true },
      { model: 'f.website', label: 'Website', half: true },
      { model: 'f.street', label: 'Street', half: true },
      { model: 'f.city', label: 'City', half: true },
      { model: 'f.state', label: 'State / Region', half: true },
      { model: 'f.zip', label: 'Postcode', half: true },
      { model: 'f.country', label: 'Country', half: true },
    ],
    faq: [
      {
        q: 'What is a vCard QR code?',
        a: 'It is a QR code containing a vCard (VCF) contact file. When scanned, the phone offers to save the contact — name, numbers, email, company and address — in one tap.',
      },
      {
        q: 'Will it work on both iPhone and Android?',
        a: 'Yes. This tool generates vCard 3.0, the version with the broadest support across iOS and Android camera apps.',
      },
      {
        q: 'Can I update the details later?',
        a: 'Static vCard codes embed the details at generation time, so a change means generating a new code. The upside: it is free, never expires, and needs no account.',
      },
    ],
  },
  {
    slug: 'email-qr-code',
    type: 'email',
    label: 'Email',
    title: 'Email QR Code Generator — Mailto QR Free',
    desc: 'Create a QR code that opens a pre-filled email. Set the recipient, subject and message. Free, no sign-up, no watermark.',
    h1: 'Email QR Code Generator',
    intro:
      'Scanning an email QR code opens the phone’s mail app with the address, subject and message already filled in. Great for feedback requests, support contacts and event RSVPs.',
    fields: [
      { model: 'f.emailTo', label: 'Recipient email', placeholder: 'hello@example.com' },
      { model: 'f.emailSubject', label: 'Subject (optional)', placeholder: 'Enquiry' },
      { model: 'f.emailBody', label: 'Message (optional)', input: 'textarea', placeholder: 'Pre-filled message…' },
    ],
    faq: [
      {
        q: 'What happens when someone scans an email QR code?',
        a: 'Their default mail app opens a new draft with your address in the To field, plus any subject and body you pre-filled. They just press send.',
      },
    ],
  },
  {
    slug: 'sms-qr-code',
    type: 'sms',
    label: 'SMS',
    title: 'SMS QR Code Generator — Text Message QR Free',
    desc: 'Create a QR code that opens a pre-written SMS to your number. Free, unlimited, generated locally in your browser.',
    h1: 'SMS QR Code Generator',
    intro:
      'An SMS QR code opens the messaging app with your number and a pre-written text. Used for opt-in campaigns, quick enquiries and "text us" signs.',
    fields: [
      { model: 'f.smsPhone', label: 'Phone number', placeholder: '+60 12 345 6789' },
      { model: 'f.smsMessage', label: 'Pre-filled message (optional)', input: 'textarea', placeholder: 'JOIN' },
    ],
    faq: [
      {
        q: 'Does the SMS send automatically when scanned?',
        a: 'No — scanning only opens the messaging app with the number and text pre-filled. The person always has to tap send themselves.',
      },
    ],
  },
  {
    slug: 'phone-qr-code',
    type: 'phone',
    label: 'Phone',
    title: 'Phone Number QR Code Generator — Call QR Free',
    desc: 'Create a QR code that dials your phone number when scanned. Free, no sign-up, works with any camera app.',
    h1: 'Phone Call QR Code Generator',
    intro:
      'Scanning a phone QR code brings up your number ready to call — one tap and the phone dials. Ideal for service stickers, delivery notes and storefronts.',
    fields: [
      { model: 'f.phone', label: 'Phone number', placeholder: '+60 12 345 6789' },
    ],
    faq: [
      {
        q: 'Should I include the country code?',
        a: 'Yes — use the full international format (e.g. +60 12 345 6789) so the code works for both local and overseas callers.',
      },
    ],
  },
  {
    slug: 'location-qr-code',
    type: 'geo',
    label: 'Location',
    title: 'Location QR Code Generator — Map Coordinates QR Free',
    desc: 'Create a QR code that opens a map pin at your coordinates. Free geo QR generator, no sign-up, no watermark.',
    h1: 'Location QR Code Generator',
    intro:
      'A location QR code encodes latitude and longitude in the geo: format. Scanning opens the spot in the phone’s default maps app — handy for event flyers, rentals and meeting points. Tip: in Google Maps, right-click a spot and the coordinates appear first in the menu.',
    fields: [
      { model: 'f.lat', label: 'Latitude', placeholder: '3.1390', half: true },
      { model: 'f.lng', label: 'Longitude', placeholder: '101.6869', half: true },
    ],
    faq: [
      {
        q: 'Which maps app opens when scanned?',
        a: 'The geo: format is app-neutral: Android opens the user’s default maps app; iPhones open Apple Maps. Either way the pin lands on the same coordinates.',
      },
    ],
  },
];

export type Guide = {
  slug: string;
  title: string;
  desc: string;
  h1: string;
  sections: { h: string; body: string[] }[];
  faq: Faq[];
};

export const PAYMENT_GUIDES: Guide[] = [
  {
    slug: 'duitnow-qr-code',
    title: 'DuitNow QR Code — How to Get and Use One (Malaysia)',
    desc: 'What a DuitNow QR is, how Malaysian businesses get an official one from their bank or e-wallet, and how to print and display it properly.',
    h1: 'DuitNow QR: How to Get and Use One',
    sections: [
      {
        h: 'What is DuitNow QR?',
        body: [
          'DuitNow QR is Malaysia’s national QR payment standard, operated by PayNet. One code accepts payments from any participating bank app or e-wallet — Maybank, CIMB, Touch ’n Go eWallet, GrabPay, Boost and dozens more — with money arriving directly in your account.',
        ],
      },
      {
        h: 'How do I get an official DuitNow QR?',
        body: [
          'Merchant DuitNow QR codes are issued by your bank or e-wallet provider, because the code encodes your registered account inside a signed EMVCo payload. Apply through your business banking app or portal (most Malaysian banks issue one free), or through e-wallet merchant programmes.',
          'Personal users can generate a receive-money DuitNow QR inside their own banking app — look for "Receive" or "My QR".',
        ],
      },
      {
        h: 'Can an online QR generator create a DuitNow QR?',
        body: [
          'Not from scratch — the payment payload must reference your registered bank account and follow the EMVCo/PayNet specification, which only issuers produce. What a generator like our free QR tool can do is re-encode a payload you already have (banks let you download it) at higher resolution, or create a URL QR that links to your payment page.',
        ],
      },
      {
        h: 'Display tips that increase scans',
        body: [
          'Print at least 8×8 cm at the counter, keep strong contrast (dark modules on white), laminate against glare, and show the DuitNow logo so customers recognise it. Test with two different bank apps before printing in bulk.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is DuitNow QR free for merchants?',
        a: 'Most banks currently waive merchant fees for small businesses on DuitNow QR transactions, but confirm the fee schedule with your own bank as policies differ.',
      },
      {
        q: 'Can foreigners pay a DuitNow QR?',
        a: 'Yes — cross-border linkages let users of participating apps from Singapore (NETS), Thailand (PromptPay), Indonesia and others scan DuitNow QR codes in Malaysia.',
      },
    ],
  },
  {
    slug: 'paynow-qr-code',
    title: 'PayNow QR Code — How to Get and Use One (Singapore)',
    desc: 'What a PayNow QR is, how Singapore businesses and individuals get one, and how SGQR fits in. Practical display tips included.',
    h1: 'PayNow QR: How to Get and Use One',
    sections: [
      {
        h: 'What is PayNow QR?',
        body: [
          'PayNow is Singapore’s national instant-payment service. A PayNow QR encodes your proxy — mobile number, NRIC or business UEN — so payers in any participating bank app (DBS, OCBC, UOB and others) can scan and transfer directly to your account. Merchant PayNow QRs are usually presented inside the combined SGQR label.',
        ],
      },
      {
        h: 'How do I get an official PayNow QR?',
        body: [
          'Individuals: open your banking app, link your mobile or NRIC to PayNow, and use the "My QR" screen to show or export your personal code.',
          'Businesses: register your UEN with your corporate bank, which issues a PayNow Corporate QR or an SGQR sticker combining PayNow with other schemes.',
        ],
      },
      {
        h: 'Can an online generator create a PayNow QR?',
        body: [
          'The payment payload follows the EMVCo SGQR specification tied to your registered proxy, so official codes come from your bank. A general-purpose generator is still useful for re-printing an exported payload at larger sizes, or for URL codes that link to an invoice or payment page.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does a PayNow QR expire?',
        a: 'A static PayNow QR tied to your mobile, NRIC or UEN keeps working while the proxy stays registered. Dynamic QRs generated per-transaction (with a fixed amount) expire after the session.',
      },
      {
        q: 'Can tourists use PayNow QR?',
        a: 'Cross-border links let users of partner schemes — such as Thailand’s PromptPay and Malaysia’s DuitNow — scan PayNow/SGQR codes at participating merchants.',
      },
    ],
  },
  {
    slug: 'upi-qr-code',
    title: 'UPI QR Code — How to Get and Use One (India)',
    desc: 'What a UPI QR is, how to get an official one via GPay, PhonePe, Paytm or your bank, and how UPI IDs work in the QR payload.',
    h1: 'UPI QR: How to Get and Use One',
    sections: [
      {
        h: 'What is a UPI QR code?',
        body: [
          'UPI (Unified Payments Interface) is India’s instant payment system, processing over ten billion transactions a month. A UPI QR encodes a upi:// payment link with your Virtual Payment Address (VPA, e.g. name@bank), so any UPI app — Google Pay, PhonePe, Paytm, BHIM — can scan it and pay you directly.',
        ],
      },
      {
        h: 'How do I get an official UPI QR?',
        body: [
          'Every UPI app shows a personal receive QR under "Receive" or "My QR" — free and instant. Merchants get a printed QR standee by registering as a business with any UPI app or their bank; merchant QRs settle to a current account and support unlimited receiving.',
        ],
      },
      {
        h: 'Can a generic generator create a UPI QR?',
        body: [
          'Technically the static format is documented (upi://pay?pa=VPA&pn=Name), so a URL-type QR with a upi:// link can work for simple person-to-person payments. For business use, always take the QR issued by your UPI provider — it is verified, shows your trading name to payers, and avoids typos in the VPA that would send money elsewhere.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is there a fee for UPI QR payments?',
        a: 'Person-to-person UPI payments and merchant payments below common thresholds are free; interchange applies only in limited wallet cases. Check current NPCI rules if you process large volumes.',
      },
    ],
  },
  {
    slug: 'promptpay-qr-code',
    title: 'PromptPay QR Code — How to Get and Use One (Thailand)',
    desc: 'What a PromptPay QR is, how Thai individuals and merchants get one, and what tourists need to know about scanning it.',
    h1: 'PromptPay QR: How to Get and Use One',
    sections: [
      {
        h: 'What is PromptPay QR?',
        body: [
          'PromptPay is Thailand’s national payment rail. A PromptPay QR encodes your registered proxy — mobile number, national ID or e-wallet ID — in an EMVCo payload, letting anyone with a Thai banking app scan and transfer instantly.',
        ],
      },
      {
        h: 'How do I get one?',
        body: [
          'Register your mobile number or ID with your Thai bank account, then use the bank app’s "My QR" to display or download your code. Merchants apply through their bank for a shop QR that can include a fixed amount per bill (dynamic QR).',
        ],
      },
      {
        h: 'Notes for generators and tourists',
        body: [
          'Static personal PromptPay payloads follow a published EMVCo format, so re-encoding an existing payload for print is fine; creating one from scratch still requires your registered proxy to be correct, so verify with a test scan. Tourists from Singapore, Malaysia and other linked countries can pay PromptPay QRs through their home apps via ASEAN cross-border links.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can I receive PromptPay payments without a Thai bank account?',
        a: 'No — PromptPay proxies must be linked to a Thai bank account or licensed e-wallet. Visitors can pay, but receiving requires local registration.',
      },
    ],
  },
];

// --- Barcode symbologies ---
// All four formats already work in the shared generator (client/barcode.ts).
// These give each one its own URL: people search "code 128 barcode generator",
// not "barcode generator", and TEC-IT ranks a separate page per symbology.
// /barcode-generator stays as the all-formats hub.

export type Symbology = {
  slug: string;
  format: string; // JsBarcode format id
  label: string;
  title: string;
  desc: string;
  h1: string;
  intro: string;
  placeholder: string;
  faq: Faq[];
};

const barcodePrivacyFaq: Faq = {
  q: 'Is this barcode generator really free, and is my data uploaded?',
  a: 'Yes, free with no sign-up or watermark. The barcode is drawn in your browser — whatever you type is never sent to a server, so product codes and internal part numbers stay on your device.',
};

export const SYMBOLOGIES: Symbology[] = [
  {
    slug: 'code-128-barcode-generator',
    format: 'CODE128',
    label: 'CODE128',
    title: 'CODE 128 Barcode Generator — Free, SVG & PNG, No Sign-Up',
    desc: 'Generate CODE 128 barcodes free in your browser. Encodes letters, digits and symbols compactly. Download print-ready SVG or PNG — nothing is uploaded.',
    h1: 'CODE 128 Barcode Generator',
    intro:
      'CODE 128 is the workhorse of internal barcoding: it encodes the full ASCII set — letters, digits and punctuation — in a compact symbol, which is why warehouses, shipping labels and asset tags use it. Type your content and download vector SVG that stays sharp at any print size.',
    placeholder: 'e.g. ITEM-0042 or SHIP-99120',
    faq: [
      barcodePrivacyFaq,
      {
        q: 'What can a CODE 128 barcode contain?',
        a: 'Any ASCII character — uppercase and lowercase letters, digits, spaces and punctuation. There is no fixed length, though very long content produces a wide symbol that needs more label space to stay scannable.',
      },
      {
        q: 'What is the difference between CODE 128 A, B and C?',
        a: 'They are subsets: A covers uppercase and control characters, B adds lowercase, and C encodes digit pairs at double density. The generator picks the most efficient subset for your content automatically.',
      },
      {
        q: 'Should I use CODE 128 or CODE 39?',
        a: 'CODE 128 unless a legacy system requires otherwise. It is denser and supports lowercase, so the same data produces a narrower symbol than CODE 39.',
      },
    ],
  },
  {
    slug: 'ean-13-barcode-generator',
    format: 'EAN13',
    label: 'EAN-13',
    title: 'EAN-13 Barcode Generator — Free Retail Barcodes, SVG & PNG',
    desc: 'Generate EAN-13 retail barcodes free in your browser. Enter 12 digits and the check digit is calculated automatically. Print-ready SVG or PNG, no upload.',
    h1: 'EAN-13 Barcode Generator',
    intro:
      'EAN-13 is the barcode on retail products outside North America. Enter the 12-digit number issued to you and the 13th check digit is calculated automatically — then download a vector SVG that stays sharp at packaging print sizes.',
    placeholder: 'e.g. 590123412345',
    faq: [
      barcodePrivacyFaq,
      {
        q: 'How many digits does EAN-13 need?',
        a: 'Twelve digits, and the generator appends the thirteenth check digit for you. You can also paste all thirteen — it will be accepted if the check digit is already correct, and rejected if it is not.',
      },
      {
        q: 'Can I sell products using a barcode I generated here?',
        a: 'The image is yours to use, but the number is not ours to give. Retail EAN numbers are assigned by GS1, and retailers reject made-up numbers. Get your GS1 prefix first, then generate the barcode here from the number they issue.',
      },
      {
        q: 'What is the difference between EAN-13 and UPC-A?',
        a: 'UPC-A is the 12-digit North American format; EAN-13 is the 13-digit international superset. An EAN-13 starting with a leading zero is the same product code as the equivalent UPC-A.',
      },
    ],
  },
  {
    slug: 'upc-a-barcode-generator',
    format: 'UPC',
    label: 'UPC-A',
    title: 'UPC-A Barcode Generator — Free UPC Codes, SVG & PNG',
    desc: 'Generate UPC-A barcodes free in your browser for North American retail. Enter 11 digits and the check digit is added automatically. SVG or PNG, no upload.',
    h1: 'UPC-A Barcode Generator',
    intro:
      'UPC-A is the 12-digit barcode used on retail products in the United States and Canada. Enter your 11-digit number and the check digit is computed automatically — download as vector SVG for packaging or PNG for quick use.',
    placeholder: 'e.g. 03600029145',
    faq: [
      barcodePrivacyFaq,
      {
        q: 'How many digits does UPC-A need?',
        a: 'Eleven digits, with the twelfth check digit calculated for you. Pasting all twelve works too, provided the check digit is correct.',
      },
      {
        q: 'Can I use a generated UPC to sell in stores?',
        a: 'Only if the number was issued to you by GS1. The barcode image here is free to use, but retailers verify that the company prefix is registered — self-invented numbers will be rejected.',
      },
      {
        q: 'Do I need UPC-A or EAN-13?',
        a: 'UPC-A for North American retail, EAN-13 elsewhere. Most modern scanners read both, and many brands register a single GS1 number that can be printed in either format.',
      },
    ],
  },
  {
    slug: 'code-39-barcode-generator',
    format: 'CODE39',
    label: 'CODE39',
    title: 'CODE 39 Barcode Generator — Free, SVG & PNG, No Sign-Up',
    desc: 'Generate CODE 39 barcodes free in your browser for legacy industrial, logistics and military systems. Download print-ready SVG or PNG — nothing is uploaded.',
    h1: 'CODE 39 Barcode Generator',
    intro:
      'CODE 39 is the older industrial standard, still required by many logistics, automotive and defence systems (it underpins LOGMARS and older MIL-STD labelling). It encodes uppercase letters, digits and a few symbols, and every scanner ever built reads it.',
    placeholder: 'e.g. PART-1234',
    faq: [
      barcodePrivacyFaq,
      {
        q: 'What characters can CODE 39 encode?',
        a: 'Uppercase A–Z, digits 0–9, space, and the symbols - . $ / + %. Lowercase is not supported — if you need it, use CODE 128 instead.',
      },
      {
        q: 'Why is my CODE 39 barcode so wide?',
        a: 'CODE 39 uses nine bars per character, so it is roughly 30% wider than CODE 128 for the same content. For long values on a small label, CODE 128 is the better fit.',
      },
      {
        q: 'Does CODE 39 need a check digit?',
        a: 'Not usually. The optional modulo-43 check digit is required only by specific standards such as LOGMARS and HIBC; most applications omit it.',
      },
    ],
  },
];
