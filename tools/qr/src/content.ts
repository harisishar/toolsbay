import type { Comparison, Faq } from "./seo.js";

export type Field = {
  model: string;
  label: string;
  input?: "text" | "textarea" | "select" | "checkbox";
  options?: [value: string, label: string][];
  placeholder?: string;
  half?: boolean;
};

export type Section = { h: string; body: string[] };

export type QrType = {
  slug: string;
  type: string;
  label: string;
  title: string;
  desc: string;
  h1: string;
  // 120-190 words: the self-contained block AI answers can quote. Enforced by
  // scripts/assert-prose.mjs.
  intro: string;
  fields: Field[];
  sections: Section[];
  faq: Faq[];
};

// Sitemap lastmod for the QR, barcode and guide pages. These are written in one
// pass, so one date is honest for all of them — bump it when the copy changes.
export const CONTENT_UPDATED = "2026-08-01";

export const QR_TYPES: QrType[] = [
  {
    slug: "url-qr-code",
    type: "url",
    label: "URL",
    title: "URL QR Code Generator — Free Link to QR Code",
    desc: "Turn any link into a QR code for free. Downloads as PNG, SVG or JPG, no sign-up, no watermark, and the code never expires.",
    h1: "URL QR Code Generator",
    intro:
      "Paste a link and get a scannable QR code instantly. What you get here is a static code: the address is written directly into the pattern of light and dark modules, so there is no redirect service sitting in the middle, no account, and nothing that can be switched off later. It also means the work happens in your browser — the URL you type is never sent to a server. Longer addresses produce a denser grid, which needs a bigger print size to stay comfortable to scan, so trimming tracking parameters before you generate is usually worth the few seconds. Download as SVG when the code is going to print, since it stays sharp at any size, or PNG for screens and slide decks. Free for commercial use, no watermark, no cap on how many you make.",
    fields: [
      { model: "f.url", label: "Website URL", placeholder: "example.com/page" },
    ],
    sections: [
      {
        h: "Static and dynamic QR codes are not the same thing",
        body: [
          "A static code stores the destination inside the image itself. Nothing is looked up when someone scans it, which is why it works offline, costs nothing to keep alive and cannot be disabled by a company going out of business. The trade-off is that the destination is fixed: changing it means printing a new code.",
          "A dynamic code stores a short redirect address instead, and the provider maps that to your real destination. You can repoint it later and count scans, but the code only keeps working while that provider does — and most charge a subscription for the privilege. For a poster, a menu or packaging that will be reprinted anyway, static is usually the honest choice.",
        ],
      },
      {
        h: "How URL length changes the code",
        body: [
          "QR codes come in 40 sizes, called versions, from 21×21 modules up to 177×177. The generator picks the smallest version your data fits into, so a 30-character link produces a visibly simpler grid than a 200-character one with campaign parameters attached.",
          "Density matters because a scanner has to resolve individual modules. A dense code printed small, or shown on a low-resolution screen, is the usual reason a code that worked on your monitor fails on a poster. If your link is long and the print area is fixed, shorten the URL first — that is a formatting decision, not a marketing one.",
        ],
      },
      {
        h: "Printing: the 10:1 rule and the quiet zone",
        body: [
          "Size the code for the distance it will be scanned from at roughly ten to one: readable at 25 cm means about 2.5 cm across, at 3 m means about 30 cm. Below about 2 cm, phone cameras start to struggle regardless of how simple the code is.",
          "Leave the margin alone. The specification calls for a quiet zone of four modules of blank space on every side, and cropping it tight against artwork or a coloured background is one of the most common reasons a printed code will not scan.",
        ],
      },
      {
        h: "Counting scans without paying for a dynamic code",
        body: [
          "Add UTM parameters to the link before generating — for example ?utm_source=poster&utm_medium=qr — and your existing analytics will attribute the visits without any QR service in the loop. A separate parameter per placement tells you which poster worked.",
          "The cost is a longer URL and therefore a denser code, which is the trade-off described above. If the link is already long, point the code at a short page on your own domain that redirects; you keep both the tracking and control of the destination.",
        ],
      },
    ],
    faq: [
      {
        q: "Does the QR code expire?",
        a: "No. This generator produces static QR codes: the URL is encoded directly into the image, so it works for as long as the link itself works. There is no account and nothing stored on our side.",
      },
      {
        q: "Can I use the QR code commercially?",
        a: "Yes. QR codes generated here are free for personal and commercial use — print them on packaging, menus, posters or business cards without attribution.",
      },
      {
        q: "What size should I print a QR code?",
        a: "A rule of thumb is a 10:1 distance-to-size ratio: a code scanned from 25 cm away should be at least 2.5 cm wide. Download the SVG for crisp printing at any size.",
      },
      {
        q: "Can I change where the code points after printing it?",
        a: "Not with a static code — the address lives inside the image. If you need to repoint it later, encode a URL on your own domain and set up a redirect there; you keep control of the destination without depending on a QR provider that may start charging or shut down.",
      },
      {
        q: "Do I need to shorten the URL first?",
        a: "Only if the code has to be printed small. Shorter links produce a lower QR version with fewer modules, which is easier for a camera to resolve. Under about 60 characters the difference rarely matters at normal print sizes.",
      },
    ],
  },
  {
    slug: "text-qr-code",
    type: "text",
    label: "Text",
    title: "Text QR Code Generator — Encode Any Text Free",
    desc: "Create a QR code from plain text for free. Works offline in your browser, downloads as PNG, SVG or JPG with no watermark.",
    h1: "Text QR Code Generator",
    intro:
      "Encode any plain text — a note, a serial number, a coupon code, a machine's maintenance history — into a QR code that displays the words themselves rather than opening anything. Because the characters live inside the symbol, a scanner shows them with no network connection at all, which is what makes text codes useful on equipment labels, in warehouses, on trail markers and anywhere else a signal cannot be assumed. Capacity is generous but not unlimited: roughly 4,296 alphanumeric characters at the lowest error-correction level, though anything past a few hundred produces a symbol dense enough that scanning gets fussy. Line breaks survive, so short instructions stay readable. Everything is generated in your browser, so serial numbers and internal codes never reach a server, and the result downloads as SVG for print or PNG for screens.",
    fields: [
      {
        model: "f.text",
        label: "Your text",
        input: "textarea",
        placeholder: "Type or paste any text…",
      },
    ],
    sections: [
      {
        h: "What actually fits inside the symbol",
        body: [
          "Capacity depends on the character set you use. At the largest version and the lowest error-correction level a QR code holds 7,089 digits, 4,296 alphanumeric characters, or 2,953 bytes of arbitrary data. The alphanumeric mode is a restricted set — digits, uppercase letters, space and a handful of symbols — so lowercase text falls back to byte mode and takes more room per character.",
          "Those ceilings are theoretical rather than practical. A symbol holding two thousand characters is 149 modules across, and resolving that many cells needs either a large print or a very good camera. Treat a few hundred characters as the working limit for anything that will be scanned in the field.",
        ],
      },
      {
        h: "Error correction is a trade, not a free upgrade",
        body: [
          "Reed–Solomon error correction lets a code survive damage: level L recovers about 7% of the symbol, M 15%, Q 25% and H 30%. That is what allows scratched, smudged or partly covered codes to keep working, and it is why a logo can be dropped into the middle of a code without breaking it.",
          "The recovery data occupies the same symbol, so raising the level either shrinks how much text you can store or pushes the code to a higher version with more modules. For a label that will live on a clean surface indoors, L or M is enough. For something destined for a workshop floor or outdoor equipment, the extra density of Q is worth it.",
        ],
      },
      {
        h: "Where offline text codes earn their keep",
        body: [
          "Asset tags are the obvious case: a serial number, install date and model on the machine itself, readable in a basement with no signal. Warehouse bin labels work the same way, and so do the small placards on trail markers and utility cabinets where the whole point is that no server is involved.",
          "The limitation is that the text cannot change. If the information is expected to be updated — a maintenance log rather than a serial number — encode an identifier and keep the changing part in your own system, rather than reprinting labels every time something moves.",
        ],
      },
      {
        h: "What scanners do with plain text",
        body: [
          "A text code has no URI scheme, so there is nothing for the phone to open. Camera apps show the decoded string and offer to copy it or run a search; dedicated scanner apps usually add a share action. This is different from a URL code, which prompts to open a browser, and it is the behaviour you want when the content is a number rather than a destination.",
          "Line breaks are preserved, so a two- or three-line label reads as written. Very long paragraphs technically work but end up displayed in a cramped notification-style panel, which is another argument for keeping the content short.",
        ],
      },
    ],
    faq: [
      {
        q: "How much text fits in a QR code?",
        a: "Up to 4,296 alphanumeric characters at the lowest error-correction level, but codes get dense and hard to scan past a few hundred characters. Keep it short, or raise the size if you need more.",
      },
      {
        q: "Does scanning a text QR code need internet?",
        a: "No. The text is stored inside the code itself, so any camera app can decode it fully offline.",
      },
      {
        q: "Are line breaks kept?",
        a: "Yes. Newlines are encoded along with the rest of the characters, so a short multi-line label displays the way you typed it. Very long text still ends up in a small panel on most phones, so keep lines short.",
      },
      {
        q: "Which error-correction level should I pick for a label?",
        a: "L or M for anything indoors and clean. Step up to Q for labels that will be handled, scuffed or exposed to weather — you trade some capacity for the ability to keep scanning once a quarter of the symbol is damaged.",
      },
    ],
  },
  {
    slug: "wifi-qr-code",
    type: "wifi",
    label: "WiFi",
    title: "WiFi QR Code Generator — Share Your Network Free",
    desc: "Create a WiFi QR code so guests connect to your network with one scan. Free, no sign-up, password never leaves your browser.",
    h1: "WiFi QR Code Generator",
    intro:
      "Let guests join your network by pointing a camera at a code instead of typing a password that was designed to be hard to type. The code holds three things — the network name, the password and the security type — in a short structured string beginning WIFI:, which iOS and Android both recognise natively, so no app is needed at either end. Everything is assembled in your browser: the password is never sent anywhere, and you can load this page, disconnect, and still generate a working code. Print it small and put it where guests already look — inside a menu, on the back of a room door, taped under the counter. The obvious caution is that anyone who can see the code can join the network, so a printed code belongs on the guest network rather than the one your NAS and printers live on.",
    fields: [
      {
        model: "f.ssid",
        label: "Network name (SSID)",
        placeholder: "MyHomeWiFi",
        half: true,
      },
      {
        model: "f.password",
        label: "Password",
        placeholder: "Network password",
        half: true,
      },
      {
        model: "f.security",
        label: "Security",
        input: "select",
        options: [
          ["WPA", "WPA / WPA2 / WPA3"],
          ["WEP", "WEP (legacy)"],
          ["nopass", "Open network (no password)"],
        ],
        half: true,
      },
      {
        model: "f.hidden",
        label: "Hidden network",
        input: "checkbox",
        half: true,
      },
    ],
    sections: [
      {
        h: "What the code actually contains",
        body: [
          "A WiFi code is plain text in a documented format: WIFI:T:WPA;S:MyNetwork;P:hunter2;H:false;; where T is the security type, S the SSID, P the password and H whether the network is hidden. There is no encryption and no lookup — the password is sitting in the symbol in readable form, which is exactly why the code works without an internet connection.",
          "That format is the reason semicolons, commas, colons and backslashes in a password have to be escaped with a backslash. This generator handles that for you, which matters more than it sounds: a mis-escaped password produces a code that scans cleanly and then silently fails to connect.",
        ],
      },
      {
        h: "Which phones support it, and which do not",
        body: [
          "iOS has recognised WiFi codes in the built-in Camera app since iOS 11, and Android since version 10 — both show a join prompt rather than a link. Android additionally goes the other way: in the WiFi settings, the Share button produces a code for the network you are already on, which is often faster than typing the password into this form.",
          "Laptops are the gap. Windows and macOS do not scan WiFi codes from the camera, so a code on a meeting-room wall helps phones and tablets and does nothing for a visitor with a laptop. Keep the written password available as well.",
        ],
      },
      {
        h: "Hidden networks and the security type",
        body: [
          "If the SSID is not broadcast, tick the hidden option. It sets H:true, which tells the phone to probe for the network by name instead of waiting to see it in a scan — without that flag, a code for a hidden network appears to do nothing at all.",
          "Pick WPA for anything modern; the same setting covers WPA2 and WPA3. WEP exists in the format for legacy equipment and should be treated as a signal to replace the router rather than as a working option. For an open network with no password, choose the no-password option so the phone does not sit waiting for a credential that will never come.",
        ],
      },
      {
        h: "Where to put a printed code — and where not to",
        body: [
          "Cafés, waiting rooms, holiday rentals and meeting rooms are the natural fit, because the alternative is reading a 16-character password aloud. Laminate it if it will be handled; a code with a torn corner may still scan thanks to error correction, but a missing corner marker will not.",
          "Treat the printed code as equivalent to the password written out, because that is what it is. Anyone who photographs it keeps access until the password changes. Put guests on a guest network, and if your router supports it, isolate that network from the devices you actually care about.",
        ],
      },
    ],
    faq: [
      {
        q: "Is it safe to make a WiFi QR code online?",
        a: "With this tool, yes: the code is generated entirely in your browser with JavaScript. Your SSID and password are never sent to a server. You can even load the page, go offline, and generate the code.",
      },
      {
        q: "How do guests use the WiFi QR code?",
        a: 'On iPhone (iOS 11+) and Android (10+), opening the camera and pointing it at the code shows a "Join network" prompt. One tap connects — no password typing.',
      },
      {
        q: "What if I change my WiFi password?",
        a: "The old code stops working, since the password is stored inside it. Just generate a new code — it takes seconds and is free.",
      },
      {
        q: "Does a WiFi QR code work on a laptop?",
        a: "No. Windows and macOS have no built-in way to join a network by scanning, so the code only helps phones and tablets. Keep the password written somewhere for laptop users.",
      },
      {
        q: "My password has a semicolon in it — will that break the code?",
        a: "Not here. Semicolons, colons, commas and backslashes are special characters in the WIFI: format and have to be escaped; this generator escapes them for you. A tool that does not is the usual cause of a code that scans but then fails to connect.",
      },
    ],
  },
  {
    slug: "vcard-qr-code",
    type: "vcard",
    label: "vCard",
    title: "vCard QR Code Generator — Contact Card QR Free",
    desc: "Create a vCard QR code that adds your contact details to any phone with one scan. Free, unlimited, no watermark, data stays in your browser.",
    h1: "vCard QR Code Generator",
    intro:
      'A vCard QR code carries a whole contact record — name, company, job title, numbers, email, website and address — inside the symbol, so scanning it opens the "Add contact" screen with the fields already populated instead of leaving someone to retype a business card. The format is vCard 3.0, the version with the broadest support across iOS and Android camera apps, and the code is static: it works forever, needs no account, and keeps working if this site disappears. Everything is assembled in your browser, so a personal mobile number never touches a server. Fill in only the fields you actually want to hand out — every extra one adds characters, and a fully populated card with a long address produces a noticeably denser code that needs more room on a printed badge or card to stay easy to scan.',
    fields: [
      { model: "f.firstName", label: "First name", half: true },
      { model: "f.lastName", label: "Last name", half: true },
      { model: "f.org", label: "Company", half: true },
      { model: "f.title", label: "Job title", half: true },
      { model: "f.workPhone", label: "Work phone", half: true },
      { model: "f.mobile", label: "Mobile", half: true },
      { model: "f.vEmail", label: "Email", half: true },
      { model: "f.website", label: "Website", half: true },
      { model: "f.street", label: "Street", half: true },
      { model: "f.city", label: "City", half: true },
      { model: "f.state", label: "State / Region", half: true },
      { model: "f.zip", label: "Postcode", half: true },
      { model: "f.country", label: "Country", half: true },
    ],
    sections: [
      {
        h: "vCard, MECARD and which one to use",
        body: [
          "Two contact formats show up in QR codes. vCard is the RFC-standard format also used by .vcf files, verbose but universally understood. MECARD is a compact alternative from the same NTT Docomo lineage as the WiFi format, which packs the same basic details into far fewer characters and therefore a simpler code.",
          "MECARD's brevity comes at the cost of fields — it covers name, phone, email and address, and little else. This generator emits vCard 3.0 because job title, company and website are usually the point of a business card, and because support is consistent across scanners. If you only need a name and a mobile number and the code has to print very small, MECARD is the denser-information choice.",
        ],
      },
      {
        h: "Keep the card short",
        body: [
          "Every field is stored literally, so a contact with a long company name, a job title, two numbers and a full postal address can run past 300 characters. That pushes the symbol to a higher version with many more modules, and a dense code printed at business-card size is exactly the combination that fails to scan in bad lighting.",
          "The fix is editorial rather than technical: put the details someone actually needs on the card and leave the rest to the conversation. Name, company, one number, one email and a website is usually enough, and it keeps the code sparse enough to print at two centimetres.",
        ],
      },
      {
        h: "Photos, logos and why they do not belong in the code",
        body: [
          "The vCard spec allows an embedded photo, and it is a bad idea in a QR code. Even a heavily compressed image runs to thousands of bytes, which exceeds what a QR symbol can hold at any reasonable print size. Contact codes with photos are almost always dynamic codes pointing at a hosted card.",
          "Adding your logo on top of the code is a different matter and generally fine, because error correction can absorb a covered area. Keep the overlay under roughly the level's recovery capacity, leave the three corner finder patterns completely clear, and test the result with more than one phone before committing it to print.",
        ],
      },
      {
        h: "Where a contact code beats a link",
        body: [
          "Conference badges are the strongest case: the person scanning is standing in front of you, may have poor signal in a hall, and wants the details in their address book rather than in a browser tab. A static vCard works with no network at all.",
          "Email signatures and slide decks are the weaker case. There the reader is already on a device with connectivity, and a plain link to a contact page gives you the ability to change the details later. Use the code where the destination is a phone's contacts app, and a link where it is a website.",
        ],
      },
    ],
    faq: [
      {
        q: "What is a vCard QR code?",
        a: "It is a QR code containing a vCard (VCF) contact file. When scanned, the phone offers to save the contact — name, numbers, email, company and address — in one tap.",
      },
      {
        q: "Will it work on both iPhone and Android?",
        a: "Yes. This tool generates vCard 3.0, the version with the broadest support across iOS and Android camera apps.",
      },
      {
        q: "Can I update the details later?",
        a: "Static vCard codes embed the details at generation time, so a change means generating a new code. The upside: it is free, never expires, and needs no account.",
      },
      {
        q: "Can I put my photo in the vCard QR code?",
        a: "In practice, no. The vCard format allows an embedded image, but even a small compressed photo runs to thousands of bytes — far more than a scannable QR symbol can carry. Contact codes with photos are hosted cards behind a link, not static codes.",
      },
      {
        q: "Why is my vCard code so much denser than a URL code?",
        a: "Because it stores every field literally. A full card with company, job title, two numbers and a postal address can pass 300 characters, which forces a higher QR version. Dropping the fields you do not need is the quickest way to simplify the code.",
      },
    ],
  },
  {
    slug: "email-qr-code",
    type: "email",
    label: "Email",
    title: "Email QR Code Generator — Mailto QR Free",
    desc: "Create a QR code that opens a pre-filled email. Set the recipient, subject and message. Free, no sign-up, no watermark.",
    h1: "Email QR Code Generator",
    intro:
      "An email QR code encodes a mailto: address, optionally with a subject line and message body attached, so scanning it opens a new draft in whatever mail app the phone uses with the fields already filled in. Nothing sends by itself — the person always sees the draft and taps send — which makes it a good fit for feedback cards, support stickers on equipment, event RSVPs and anywhere a written-out address would be mistyped. Pre-filling the subject is the underused part: give each placement its own subject line and your inbox sorts itself without any tracking. The code is generated in your browser and is static, so it costs nothing, never expires and works without a signal at the moment of scanning. The one thing to think about before printing is that a published address is a scrapeable address.",
    fields: [
      {
        model: "f.emailTo",
        label: "Recipient email",
        placeholder: "hello@example.com",
      },
      {
        model: "f.emailSubject",
        label: "Subject (optional)",
        placeholder: "Enquiry",
      },
      {
        model: "f.emailBody",
        label: "Message (optional)",
        input: "textarea",
        placeholder: "Pre-filled message…",
      },
    ],
    sections: [
      {
        h: "How mailto: encoding works",
        body: [
          "The code contains a mailto: URI: the address, then subject and body as query parameters. Spaces, line breaks and punctuation in those parameters have to be percent-encoded, which is why a subject typed with an ampersand can silently truncate everything after it in tools that skip the escaping. This generator encodes the parameters properly.",
          "Because it is a URI rather than a message, nothing is transmitted at scan time. The phone hands the string to its default mail client, which composes a draft locally. If the person has no mail app configured, the scan appears to do nothing at all — the commonest support question about email codes, and not something the code itself can fix.",
        ],
      },
      {
        h: "Use the subject line as your routing",
        body: [
          "A pre-filled subject is free segmentation. Print one code with the subject Warranty claim on the packaging, another with Showroom enquiry on the display card, and the two arrive in your inbox pre-labelled without a tracking service or a redirect in between.",
          'Keep the pre-filled body short and treat it as a prompt rather than a script. A body that already contains three paragraphs reads as a form to be edited and gets abandoned; a single line like "Order number:" gets filled in.',
        ],
      },
      {
        h: "Publishing an address means publishing it",
        body: [
          "A printed email code exposes the address to anyone who scans it, and photographs of posters end up online. Address-harvesting is largely automated, so treat a code on public signage the same way you would treat the address in plain text on a web page.",
          "The practical answer is a role address rather than a personal one: support@, hello@ or a purpose-made alias you can retire if it starts attracting spam. It also survives staff changes, which a personal address printed on a thousand leaflets does not.",
        ],
      },
      {
        h: "When a form works better",
        body: [
          "Email is the right choice when the reply needs to be a conversation, when attachments are likely, or when the scanner may be offline at the moment of scanning and will send later from their drafts.",
          "A link to a web form is better when you need structured answers, want the response to land in a ticketing system, or need fields the person cannot forget to include. The trade-off is that a form requires a working connection and a browser; email degrades more gracefully.",
        ],
      },
    ],
    faq: [
      {
        q: "What happens when someone scans an email QR code?",
        a: "Their default mail app opens a new draft with your address in the To field, plus any subject and body you pre-filled. They just press send.",
      },
      {
        q: "Does the email send automatically?",
        a: "No, and it cannot. The code only opens a draft — the person reads it and taps send themselves. Anything that claimed to send on scan would be sending from their account without consent.",
      },
      {
        q: "Will pre-filled subject and body work on every phone?",
        a: "The subject is reliable across iOS and Android mail apps. The body is nearly as reliable but occasionally dropped by third-party clients, so put anything essential in the subject rather than the body.",
      },
      {
        q: "Should I use my personal address?",
        a: "Better not to on anything printed and public. Use a role address like support@ or a dedicated alias — it can be retired if it starts collecting spam, and it survives the person who set it up moving on.",
      },
    ],
  },
  {
    slug: "sms-qr-code",
    type: "sms",
    label: "SMS",
    title: "SMS QR Code Generator — Text Message QR Free",
    desc: "Create a QR code that opens a pre-written SMS to your number. Free, unlimited, generated locally in your browser.",
    h1: "SMS QR Code Generator",
    intro:
      "An SMS QR code opens the phone's messaging app with your number in the recipient field and, if you want, a keyword already typed in the message. The person still has to tap send, which is the whole point: it removes the transcription errors that kill short-code campaigns without sending anything on anyone's behalf. It suits opt-in keywords, \"text us for a quote\" signage, appointment confirmations and out-of-hours contact cards on a locked shopfront. The encoding is the SMSTO: form, which has the widest scanner support, and the number should be in full international format so it works for someone roaming. Pre-filled message text is well supported on modern Android and iOS but is the part most likely to be dropped by an unusual scanner app, so never put anything essential there. Generated in your browser; nothing is uploaded.",
    fields: [
      {
        model: "f.smsPhone",
        label: "Phone number",
        placeholder: "+60 12 345 6789",
      },
      {
        model: "f.smsMessage",
        label: "Pre-filled message (optional)",
        input: "textarea",
        placeholder: "JOIN",
      },
    ],
    sections: [
      {
        h: "SMSTO: and why the format matters",
        body: [
          "There are two competing encodings. SMSTO:number:message comes from the same de facto family as the WiFi and MECARD formats and is understood by essentially every scanner. The RFC 5724 form, sms:number?body=text, is the standards-track version but has patchier handling of the body parameter across apps.",
          "This generator emits SMSTO:, which is why a pre-filled keyword survives on the widest range of devices. If you have ever scanned a code that opened an empty message thread with the right number, you have met a scanner that recognised the number but discarded the body.",
        ],
      },
      {
        h: "Write the number the way a stranger's phone needs it",
        body: [
          "Use full international format with the country code — +60 12 345 6789, not 012 345 6789. A national-format number works for a local handset and fails for a visitor whose phone assumes a different country, which is the exact audience a sign in a hotel lobby or airport is aimed at.",
          "Spaces and dashes are cosmetic; the messaging app strips them. What matters is the leading plus sign and country code. Shortcodes are the exception — they are national by definition and cannot be dialled internationally, so a code built around one only works domestically.",
        ],
      },
      {
        h: "Keywords, opt-in and the message you pre-fill",
        body: [
          "Keyword campaigns are the classic use: a single word like JOIN or QUOTE that your SMS platform routes on. Pre-filling it removes the two failure modes of printed campaigns — mistyped keywords and mistyped numbers — and costs nothing to produce.",
          "Keep the pre-filled text to one short line. It is a starting point the person can edit, and a long pre-written paragraph reads as something to delete rather than send. Where consent matters, remember the tap-to-send step is what makes the opt-in the person's own action rather than yours.",
        ],
      },
      {
        h: "SMS against the alternatives",
        body: [
          "Against a phone call code: messaging works when the recipient cannot take calls, leaves a written record on both sides, and is far less intimidating for a simple enquiry. Against an email code: SMS reaches a phone that has signal but no data, and gets read faster.",
          "The costs are real though. Messages may carry a charge for the sender, particularly internationally, and there is no delivery guarantee. For anything with a long or detailed response, a link to a page will serve the reader better than a thread of texts.",
        ],
      },
    ],
    faq: [
      {
        q: "Does the SMS send automatically when scanned?",
        a: "No — scanning only opens the messaging app with the number and text pre-filled. The person always has to tap send themselves.",
      },
      {
        q: "Will the pre-filled message appear on every phone?",
        a: "On current iOS and Android, yes. A few third-party scanner apps recognise the number and drop the body, so treat the pre-filled text as a convenience and never put anything essential in it.",
      },
      {
        q: "Do I need the country code?",
        a: "Yes, if anyone scanning might be from elsewhere. Use full international format so a roaming phone resolves the number correctly. Shortcodes cannot be used internationally at all.",
      },
      {
        q: "Does sending the message cost the person anything?",
        a: "It may — standard message rates apply, and international messages can be expensive. If your audience is likely to be overseas visitors, a WhatsApp or email code is usually kinder than SMS.",
      },
    ],
  },
  {
    slug: "phone-qr-code",
    type: "phone",
    label: "Phone",
    title: "Phone Number QR Code Generator — Call QR Free",
    desc: "Create a QR code that dials your phone number when scanned. Free, no sign-up, works with any camera app.",
    h1: "Phone Call QR Code Generator",
    intro:
      "A phone QR code holds a tel: URI, so scanning it brings your number up in the dialler ready to call. No phone will place the call on its own — every platform shows the number and waits for a tap, which is a deliberate safeguard rather than a limitation, and it means a code on a sticker cannot be used to make someone's handset dial a premium line. The natural homes for one are places where a number is read off a surface and typed wrong: service stickers on boilers and lifts, delivery notes, out-of-hours signs on a locked door, vehicle livery, equipment nameplates. Use full international format so a visitor's phone resolves it correctly. The code is static and generated in your browser, so it costs nothing, never expires, and keeps working when the number itself does.",
    fields: [
      {
        model: "f.phone",
        label: "Phone number",
        placeholder: "+60 12 345 6789",
      },
    ],
    sections: [
      {
        h: "Nothing dials by itself",
        body: [
          "The tel: scheme is a request, not a command. Both iOS and Android present the number and require an explicit tap, and browsers behave the same way with tel: links. This is by design: auto-dialling from a scanned image would be an obvious route to premium-rate fraud.",
          "It also shapes how you should design the sign around the code. The person will see a bare number on screen before they commit, so if it matters that they are calling the right department, put that in the printed text next to the code — the dialler will not tell them.",
        ],
      },
      {
        h: "Write the number in E.164",
        body: [
          "E.164 is the international numbering format: a plus sign, country code, then the national number with no leading zero — +60 12 345 6789 rather than 012 345 6789. Written that way, the number resolves identically whether the scanner's phone is registered locally or roaming.",
          "Punctuation inside the number is ignored by the dialler, so spaces and dashes are purely for the human reading it. Extensions are the weak spot: the pause characters used to dial one automatically are inconsistently supported, so for a direct line, publish the direct number rather than a switchboard and an extension.",
        ],
      },
      {
        h: "Where a call code beats printed digits",
        body: [
          "The value is proportional to how awkward the surface is. A number on a lift plate, a parking meter, a machine in a plant room or the back of a van gets read at an angle, in poor light, often by someone holding something else. Scanning removes the transcription step entirely.",
          "It also helps on anything with an international audience. A visitor who does not know whether to drop a leading zero or add a country code has a real chance of getting it wrong; a code carrying E.164 gives them no opportunity to.",
        ],
      },
      {
        h: "Durability of a printed code",
        body: [
          "Codes on equipment live in bad conditions. Print with strong contrast — dark on light, never light on dark, which many scanners will not invert — and leave the four-module quiet zone clear of the sticker's border.",
          "Error correction covers scuffing but not the corners: the three large finder patterns are how a scanner locates the symbol at all, so a code with a worn corner is unreadable regardless of level. For outdoor or workshop use, laminate it or use a printed vinyl label, and size it for the distance someone will actually stand at.",
        ],
      },
    ],
    faq: [
      {
        q: "Should I include the country code?",
        a: "Yes — use the full international format (e.g. +60 12 345 6789) so the code works for both local and overseas callers.",
      },
      {
        q: "Will scanning place the call straight away?",
        a: "No. Both iOS and Android show the number in the dialler and wait for the person to tap call. There is no way to make a scanned code dial automatically, which is a deliberate protection against premium-rate abuse.",
      },
      {
        q: "Can I encode an extension?",
        a: "You can add pause characters, but support is inconsistent across phones and it often ends up dialling the switchboard and stopping. If people need a specific person, publish the direct line instead.",
      },
      {
        q: "Does it work without a data connection?",
        a: "Yes. The number is inside the symbol, so the scan itself needs no signal — only the call does. That is what makes these codes suitable for basements, lift lobbies and plant rooms.",
      },
    ],
  },
  {
    slug: "location-qr-code",
    type: "geo",
    label: "Location",
    title: "Location QR Code Generator — Map Coordinates QR Free",
    desc: "Create a QR code that opens a map pin at your coordinates. Free geo QR generator, no sign-up, no watermark.",
    h1: "Location QR Code Generator",
    intro:
      "A location QR code encodes a latitude and longitude as a geo: URI, the format defined in RFC 5870, so scanning it drops a pin at exact coordinates instead of handing over an address that a maps app has to guess at. That distinction is the reason to use one: coordinates are unambiguous where a street address is not — a field entrance, a trailhead, a marina berth, a wedding venue down an unnamed track, a site office on a plot with no number yet. To get the numbers, right-click the spot in Google Maps and the coordinates sit at the top of the menu, ready to copy. Four decimal places is accurate to roughly eleven metres, which is enough for a building; six gets you to about a metre. The code is static and made in your browser, so it needs no account and never expires.",
    fields: [
      { model: "f.lat", label: "Latitude", placeholder: "3.1390", half: true },
      {
        model: "f.lng",
        label: "Longitude",
        placeholder: "101.6869",
        half: true,
      },
    ],
    sections: [
      {
        h: "How many decimal places you actually need",
        body: [
          "A degree of latitude is about 111 km, and each decimal place divides that by ten. Two places lands within roughly a kilometre, three within a hundred metres, four within eleven metres, five within about a metre, six within ten centimetres. Longitude behaves the same way at the equator and tightens as you move toward the poles.",
          "Four decimal places is the sweet spot for getting a person to a building or a gate. Beyond six you are encoding precision that consumer GPS cannot deliver anyway — a phone in the open is typically accurate to a few metres, and considerably worse between tall buildings.",
        ],
      },
      {
        h: "Getting the coordinates right",
        body: [
          "Latitude comes first and runs from -90 to 90; longitude second, from -180 to 180. Southern latitudes and western longitudes are negative. Transposing the two is the classic error and produces a pin that is confidently wrong rather than obviously broken, so it is worth scanning your own code once before printing a thousand flyers.",
          "In Google Maps, right-click the exact spot and the coordinates appear at the top of the context menu; clicking copies them. On a phone, dropping a pin and opening the detail sheet shows the same pair. Decimal degrees are what this format expects — if you have degrees, minutes and seconds from a survey document, convert first.",
        ],
      },
      {
        h: "What happens on the scanning phone",
        body: [
          "The geo: scheme is deliberately app-neutral, which is its strength and its weakness. Android hands it to whichever maps application the person has set as default and drops the pin there. On iOS, behaviour depends on the app doing the scanning: the coordinates resolve to a map, but the route from scan to pin is less consistent than it is for a URL.",
          "If your audience is mostly iPhone users and the destination has a proper listing, a plain link to that listing in Apple or Google Maps is more predictable than a raw geo: code. Use coordinates where the place has no address to link to, which is exactly when they are worth the most.",
        ],
      },
      {
        h: "Where a pin beats an address",
        body: [
          "Anywhere the postal address does not describe where a person should physically stand. Large sites where the delivery entrance is not the front door, festival gates, remote holiday lets, construction plots, boat moorings, car park levels, and meeting points in parks all fall into this category.",
          "Print the human directions next to the code rather than relying on it alone. A scan gets someone to the right coordinates; a line of text telling them it is the blue gate behind the depot is what stops them phoning you when they arrive.",
        ],
      },
    ],
    faq: [
      {
        q: "Which maps app opens when scanned?",
        a: "The geo: format is app-neutral: Android hands it to whichever maps app is set as default. On iPhone the result depends on the scanning app, so if your audience is mostly iOS and the venue has a map listing, a link to that listing behaves more predictably.",
      },
      {
        q: "How precise should my coordinates be?",
        a: "Four decimal places puts the pin within about eleven metres, which is enough to identify a building or gate. Six gets to roughly a metre — more precision than a phone's GPS can resolve in most conditions.",
      },
      {
        q: "Does a location QR code work offline?",
        a: "The scan does — the coordinates are inside the symbol. Displaying the map around them needs either a data connection or offline maps already downloaded on the phone.",
      },
      {
        q: "I mixed up latitude and longitude. How do I tell?",
        a: "Latitude is the first value and never exceeds 90; if your first number is larger than that, the pair is reversed. The safest check is to scan your own code before it goes to print — a transposed pin looks perfectly valid, just in the wrong place.",
      },
    ],
  },
];

export type Guide = {
  slug: string;
  title: string;
  desc: string;
  h1: string;
  // 120-190 words: the self-contained block AI answers can quote. These four
  // pages were 183-286 words end to end and carried no lead at all, which made
  // them the thinnest thing on the estate — pure prose with no widget. They are
  // now held to the same bar as every other page by assertProse.
  intro: string;
  sections: { h: string; body: string[] }[];
  faq: Faq[];
};

export const PAYMENT_GUIDES: Guide[] = [
  {
    slug: "duitnow-qr-code",
    title: "DuitNow QR Code — How to Get and Use One (Malaysia)",
    desc: "What a DuitNow QR is, how Malaysian businesses get an official one from their bank or e-wallet, and how to print and display it properly.",
    h1: "DuitNow QR: How to Get and Use One",
    intro:
      "DuitNow QR is Malaysia’s national QR payment standard, operated by PayNet, and the practical thing to know before you go looking for a generator is that you cannot make one. A merchant DuitNow QR encodes a registered merchant identifier issued by a bank or e-wallet provider against a settlement account, and no third-party tool can allocate that. What you can do is get one free from your bank, re-print a payload your bank has already issued you at a larger size, and pair it with QR codes you generate yourself for things that are not payments — your menu, your ordering page, your review link, your WiFi. This page covers how to obtain the official code, what the difference between a personal and a merchant code actually is, and the display mistakes that cost real scans at a counter.",
    sections: [
      {
        h: "What DuitNow QR is",
        body: [
          "DuitNow QR is the interoperable standard that replaced a fragmented set of wallet-specific codes: one code accepts payment from any participating Malaysian bank app or e-wallet — Maybank, CIMB, Public Bank, Touch ’n Go eWallet, GrabPay, Boost, ShopeePay and dozens more — with funds arriving in your account rather than in a wallet balance you then have to withdraw.",
          "It follows the EMVCo QR specification, which is why it looks like the payment codes used in Singapore, Thailand and Indonesia, and why cross-border acceptance is possible where PayNet has established a link with the other country’s operator.",
        ],
      },
      {
        h: "Personal versus merchant codes",
        body: [
          "A personal DuitNow QR lives inside your own banking app under a heading like “Receive” or “My QR”. It is free, instant, and intended for transfers between individuals — splitting a bill, paying a friend. It is not intended for trade, and using one to run a business creates problems at reconciliation time and with your bank’s terms.",
          "A merchant DuitNow QR is issued by your bank or acquirer after a merchant application, settles to a business account, and comes with the transaction reporting a business actually needs. Most Malaysian banks issue one free to small businesses, and the application is usually handled inside the business banking app or portal.",
        ],
      },
      {
        h: "Can a QR generator create one?",
        body: [
          "Not from scratch. The payload has to carry a merchant identifier that only an issuer can allocate, so any tool offering to build a DuitNow QR from your name and phone number is producing something that will not work — or worse, something that scans and points at nothing.",
          "What a general-purpose generator is legitimately for: re-encoding a payload your bank has already given you at a higher resolution for a large print run, and making the non-payment codes that sit alongside it. A counter card carrying the bank-issued payment QR plus a self-made QR for your menu or Google review page covers what most small businesses need.",
        ],
      },
      {
        h: "Printing and display",
        body: [
          "Print at least 8 × 8 cm for a counter code and considerably larger for anything scanned from a distance. Keep dark modules on a white background — inverted or low-contrast codes fail on older phone cameras — and leave the quiet zone, the blank margin around the pattern, completely clear. Crowding it with a border or a logo is the most common reason a technically valid code will not scan.",
          "Laminate or use a matte finish: glare from overhead lighting on a glossy card is the second most common failure. Show the DuitNow logo so customers recognise what they are scanning, and test with at least two different bank apps before committing to a print run.",
        ],
      },
      {
        h: "Watch for sticker replacement",
        body: [
          "Pasting a different QR over a merchant’s code is a well-documented fraud across every market that uses payment QRs, and it costs the merchant the sale as well as the customer the money. The defence on the customer side is simply reading the payee name the app displays before confirming — it comes from the code, and it will be wrong if the sticker was swapped.",
          "On the merchant side, check the code on your counter periodically against your own, and prefer a fixed, tamper-evident mounting to a loose card that can be covered in a moment.",
        ],
      },
    ],
    faq: [
      {
        q: "Is DuitNow QR free for merchants?",
        a: "Most banks currently waive merchant fees for small businesses on DuitNow QR transactions, but fee schedules differ by bank and by transaction type, and they change. Confirm with your own bank rather than relying on a general statement.",
      },
      {
        q: "Can foreigners pay a DuitNow QR?",
        a: "Where PayNet has a cross-border link with the visitor’s home scheme, yes — arrangements exist with schemes in Singapore, Thailand, Indonesia and others. It depends on the specific bilateral link and the visitor’s bank participating, not on the QR format, so do not assume it works for every tourist.",
      },
      {
        q: "Can I generate a DuitNow QR with an online tool?",
        a: "No. The payload must carry a merchant identifier issued by a bank or licensed provider against a settlement account. Apply through your bank. A generator can re-print a payload you already have, and can make non-payment codes for your menu or ordering page.",
      },
      {
        q: "What is the difference between a static and a dynamic DuitNow QR?",
        a: "A static code identifies you but carries no amount, so the customer types it in. A dynamic code is generated per transaction with the amount and a reference already encoded, which removes typing errors and makes reconciliation automatic. Dynamic codes come from a terminal or a payment SDK.",
      },
      {
        q: "Does my DuitNow QR expire?",
        a: "A static merchant code stays valid while your merchant registration and settlement account remain active. It is not a subscription-backed redirect, so there is nothing to lapse — unlike a marketing QR from a dynamic QR vendor, which stops working if you stop paying.",
      },
    ],
  },
  {
    slug: "paynow-qr-code",
    title: "PayNow QR Code — How to Get and Use One (Singapore)",
    desc: "What a PayNow QR is, how Singapore individuals and businesses get one, how SGQR fits in, and why a generator cannot make one for you.",
    h1: "PayNow QR: How to Get and Use One",
    intro:
      "PayNow is Singapore’s instant transfer service, and a PayNow QR is unusual among payment codes in that it routes to a proxy rather than to an account number: a mobile number, an NRIC, or a business UEN that you have registered with your bank. That indirection is the useful part — you can give someone a code without giving them your account details, and you can change the underlying account without changing the code. In practice most merchant codes arrive as part of SGQR, the unified label that combines PayNow with the other schemes a shop accepts on one sticker, which is why a Singapore counter usually shows one code rather than a wall of them. Official codes come from your bank; a general-purpose generator is for everything on the counter that is not a payment.",
    sections: [
      {
        h: "How PayNow routes a payment",
        body: [
          "Rather than encoding an account number, a PayNow QR carries a proxy you have registered — your mobile number or NRIC as an individual, or your UEN as a business — and the banking system resolves that to the account currently linked to it. Payers in any participating bank app scan and transfer directly, and funds move immediately rather than clearing overnight.",
          "The practical benefit of the proxy model is portability: change the account behind your proxy and every code you have already given out keeps working, because the code never named the account in the first place.",
        ],
      },
      {
        h: "SGQR: one sticker, several schemes",
        body: [
          "SGQR is the national unified label. Because the underlying EMVCo format allows a code to carry several merchant identifiers at once, one SGQR sticker can present PayNow alongside other accepted schemes, and each payer’s app reads the identifier it recognises and ignores the rest.",
          "This is why Singapore merchants generally display a single code rather than a row of wallet-specific ones, and it is a good illustration of what the EMVCo format is for. It also means you cannot meaningfully assemble an SGQR yourself: the combination is registered, not concatenated.",
        ],
      },
      {
        h: "Getting your code",
        body: [
          "Individuals: open your banking app, link your mobile number or NRIC to PayNow, and use the “My QR” screen to display or export a personal receiving code. It costs nothing and takes a minute.",
          "Businesses: register your UEN with your corporate bank, which issues a PayNow Corporate QR or arranges an SGQR label combining PayNow with your other accepted schemes. Business codes settle to a corporate account and give you the transaction references that make reconciliation possible.",
        ],
      },
      {
        h: "What a generator can and cannot do",
        body: [
          "It cannot create a valid PayNow payload, because the payload is tied to a proxy registered in the banking system and, for merchants, to a registration only your bank can make. A tool that claims otherwise is producing a pattern that will not resolve.",
          "It is genuinely useful for the rest of the counter: a QR to your online ordering page, your menu, a feedback form, or your WiFi credentials. Those are static codes in the ordinary sense — the data is in the pattern, nothing expires and no intermediary is involved.",
        ],
      },
      {
        h: "Printing that actually scans",
        body: [
          "Print large enough for the distance it will be scanned from, keep dark modules on white, and leave the quiet zone around the pattern clear. Avoid glossy laminate under bright ceiling lights; a matte finish removes most glare failures.",
          "Test with more than one bank app before a print run — cameras and decoders differ, and a code that scans on one phone at arm’s length can fail on another in poor light.",
        ],
      },
    ],
    faq: [
      {
        q: "Does a PayNow QR expire?",
        a: "A static code tied to your mobile, NRIC or UEN keeps working as long as that proxy stays registered. Dynamic codes generated per transaction with a fixed amount are session-bound and do expire, which is intended — they represent one bill.",
      },
      {
        q: "Can tourists pay a PayNow or SGQR code?",
        a: "Where a cross-border link exists with the visitor’s home scheme and their bank participates, yes. It depends on the specific arrangement rather than on the QR format, so it is not safe to assume it works for every visitor.",
      },
      {
        q: "Can I make a PayNow QR with an online generator?",
        a: "No. The payload references a proxy registered in the banking system, and merchant codes additionally require a bank registration. Get the code from your banking app or your corporate bank; use a generator for non-payment codes.",
      },
      {
        q: "What is the difference between PayNow and SGQR?",
        a: "PayNow is the payment service. SGQR is the unified label standard that can carry PayNow together with other accepted schemes in a single code, so a merchant displays one sticker instead of several.",
      },
      {
        q: "Can I change the bank account behind my PayNow QR?",
        a: "Yes — that is the advantage of the proxy model. Re-link the proxy to a different account and codes already in circulation continue to work, because they encode the proxy rather than the account.",
      },
    ],
  },
  {
    slug: "upi-qr-code",
    title: "UPI QR Code — How to Get and Use One (India)",
    desc: "What a UPI QR encodes, how to get an official one from GPay, PhonePe, Paytm or your bank, and why UPI codes work differently from EMVCo ones.",
    h1: "UPI QR: How to Get and Use One",
    intro:
      "UPI is India’s instant payment system and the busiest retail payment rail in the world, and its QR codes are built differently from the ones used elsewhere in Asia. Where DuitNow, PayNow, PromptPay and QRIS follow the EMVCo tag format, a UPI QR encodes a plain URI — upi://pay with query parameters — naming a Virtual Payment Address such as name@bank. Because it is a URI rather than a proprietary payload, scanning it fires an app intent on the phone, which is why India has a genuinely competitive app market on one shared rail rather than a single dominant wallet. It also means a simple person-to-person UPI code is technically something you can construct yourself, with a caveat about business use that is worth reading before you do.",
    sections: [
      {
        h: "What is inside a UPI QR",
        body: [
          "A UPI QR carries a URI of the form upi://pay?pa=…&pn=…, where pa is the payee address (the VPA, such as name@bank), pn is the payee name shown to the payer, and optional parameters can carry an amount (am), a currency (cu) and a transaction note (tn).",
          "Because the phone treats it as a link rather than as a payment blob, scanning opens whichever UPI app the user has installed and prefills the payment. This is the structural reason UPI feels different from the EMVCo schemes, and why the same code works across Google Pay, PhonePe, Paytm, BHIM and bank apps without anything being registered per-app.",
        ],
      },
      {
        h: "Getting an official code",
        body: [
          "Every UPI app shows a personal receiving QR under “Receive” or “My QR”, free and instantly. That is the right code for splitting bills and paying individuals.",
          "Merchants register as a business with a UPI app or through their bank, which issues a merchant QR — usually as a printed standee — that settles to a current account, displays a verified trading name to payers, and supports the transaction volumes and reporting a business needs. Running trade through a personal VPA causes problems with limits and with reconciliation.",
        ],
      },
      {
        h: "Can you generate one yourself?",
        body: [
          "For simple person-to-person payments, yes in principle: the URI format is documented, so encoding upi://pay?pa=yourvpa@bank&pn=Your%20Name as a plain URL QR will open a UPI app correctly.",
          "For business use, do not. A typo in the VPA produces a code that silently sends money to whoever owns the address you mistyped, with no error and no recourse. A bank-issued merchant code is verified, shows your registered trading name so payers can confirm they are paying the right business, and removes that entire class of error. If you do encode one yourself, scan and test it with a small real payment before it goes anywhere near a print run.",
        ],
      },
      {
        h: "Static and dynamic in practice",
        body: [
          "A static UPI QR carries no amount and the payer enters it. A dynamic one includes the amount and often a transaction reference, generated per bill, which removes typing errors and makes reconciliation automatic.",
          "For a shop with any volume, dynamic codes from a merchant app or a billing integration are worth the setup. For a stall, a market trader or a service provider issuing occasional invoices, a static code plus a spoken amount is entirely normal and works.",
        ],
      },
      {
        h: "Verifying before you pay",
        body: [
          "The payee name your app shows before confirming comes from the code and from the resolved VPA. Read it. QR sticker replacement — pasting one code over another — is the common fraud across every QR payment market, and the displayed name is the check that catches it.",
          "For merchants, inspect the standee periodically and prefer fixed mountings to loose cards. A swapped sticker can operate for a full day before anyone notices the money is missing.",
        ],
      },
    ],
    faq: [
      {
        q: "Is there a fee for UPI QR payments?",
        a: "Person-to-person UPI transfers and ordinary merchant payments are generally free to both parties, with interchange applying only in specific wallet-funded cases. Rules are set by NPCI and change, so check the current position if you process significant volume.",
      },
      {
        q: "Can I create a UPI QR with a generic QR generator?",
        a: "Technically yes for personal use, by encoding a upi://pay URI as a URL QR. For business, take the merchant code from your UPI provider — it is verified, displays your registered trading name, and avoids a mistyped VPA silently paying a stranger.",
      },
      {
        q: "Why does scanning a UPI QR open a choice of apps?",
        a: "Because a UPI QR is a URI rather than a proprietary payload, so the phone treats it as a link and offers the apps registered to handle upi:// intents. That is by design and is why one code works with every UPI app.",
      },
      {
        q: "Can a UPI QR include the amount?",
        a: "Yes — the am parameter carries an amount, and tn carries a note or reference. Merchant systems generate these per transaction so the payer cannot mistype, and the reference ties the payment to the bill.",
      },
      {
        q: "Do UPI QR codes work for international payers?",
        a: "Increasingly, through specific cross-border arrangements with partner countries and for NRI accounts with linked international numbers. It depends on the arrangement and the payer’s provider, not on the code, so verify rather than assume.",
      },
    ],
  },
  {
    slug: "promptpay-qr-code",
    title: "PromptPay QR Code — How to Get and Use One (Thailand)",
    desc: "What a PromptPay QR is, how Thai individuals and merchants get one, what tourists can and cannot do with it, and how to print one that scans.",
    h1: "PromptPay QR: How to Get and Use One",
    intro:
      "PromptPay is Thailand’s national payment rail, and its QR codes are the reason a Bangkok street stall can take a cashless payment without a card terminal. Like Singapore’s PayNow it routes to a registered proxy — a mobile number, a national ID, or an e-wallet identifier — rather than to an account number, and like Malaysia’s DuitNow it follows the EMVCo specification, which is what makes cross-border scanning possible where the operators have linked their networks. The one point that catches visitors is asymmetric: tourists from linked countries can often pay a PromptPay code with their home app, but receiving money through PromptPay requires a Thai bank account or licensed e-wallet, and no amount of generator software substitutes for that registration.",
    sections: [
      {
        h: "How PromptPay works",
        body: [
          "You register a proxy — most commonly your Thai mobile number or your national ID number — against a bank account. A PromptPay QR encodes that proxy in an EMVCo payload, and anyone with a Thai banking app can scan it and transfer instantly, with the funds arriving in seconds rather than clearing later.",
          "Because the code names a proxy rather than an account, you can move the underlying account without invalidating codes already printed or shared. That is the same design PayNow uses, and it is a meaningful practical advantage over encoding account numbers directly.",
        ],
      },
      {
        h: "Getting your code",
        body: [
          "Individuals: register your mobile number or ID with your Thai bank, then use the bank app’s “My QR” screen to display or download the code. There is no charge and it is available immediately.",
          "Merchants: apply through your bank for a shop code. Merchant setups can issue dynamic codes carrying a fixed amount per bill, which removes the customer-typing step and gives you a reference on each transaction for reconciliation.",
        ],
      },
      {
        h: "What tourists can and cannot do",
        body: [
          "Paying: visitors from countries whose payment operator has an active link with Thailand — arrangements exist with Singapore, Malaysia and others — can often scan a PromptPay code directly in their home banking app, with the currency conversion handled between the two schemes. This depends on the specific link and on your bank participating, so confirm before travelling rather than assuming.",
          "Receiving: not possible without local registration. A PromptPay proxy must be linked to a Thai bank account or a licensed Thai e-wallet, so a visitor cannot set themselves up to receive PromptPay payments, and no generator changes that.",
        ],
      },
      {
        h: "Re-encoding an existing payload",
        body: [
          "Because the static payload format is a published EMVCo standard, re-encoding a payload your bank has already issued you — to print it larger, or to place it in a design — is legitimate and works, provided the payload string is copied exactly. A single altered character invalidates the checksum at the end of the payload and the code stops resolving.",
          "Building one from scratch is a different matter: the proxy has to be genuinely registered for the code to resolve to anything, so verify with a small real payment before printing at volume. A code that looks correct and pays nobody is an expensive thing to discover after the standees arrive.",
        ],
      },
      {
        h: "Printing and safety",
        body: [
          "Print large, keep dark modules on white, leave the quiet zone clear, and prefer matte to glossy so the code survives overhead lighting. Test on more than one phone before a print run.",
          "Read the payee name before confirming a payment — swapped stickers are the standard fraud in every QR payment market, and the displayed name is what catches them. Merchants should check their own standee regularly.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I receive PromptPay payments without a Thai bank account?",
        a: "No. PromptPay proxies must be linked to a Thai bank account or a licensed Thai e-wallet. Visitors can pay where a cross-border link exists, but receiving requires local registration.",
      },
      {
        q: "Can I make a PromptPay QR with an online generator?",
        a: "You can re-encode a payload your bank has already issued, exactly as given, to print it at a different size. Creating one from scratch only works if the proxy is genuinely registered, and the payload carries a checksum that fails if a single character is altered. Test with a real payment first.",
      },
      {
        q: "What is the difference between a static and a dynamic PromptPay QR?",
        a: "A static code carries your proxy and no amount, so the payer enters it. A dynamic code is generated per bill with the amount and a reference included, which removes typing errors and lets you reconcile payments against sales automatically.",
      },
      {
        q: "Does a PromptPay QR expire?",
        a: "A static code keeps working while the proxy stays registered to an active account. Dynamic per-transaction codes are session-bound by design, because each one represents a single bill.",
      },
      {
        q: "Which proxy should I register?",
        a: "A mobile number is the usual choice for individuals and is easy to share verbally as a fallback. National ID is also supported. Businesses should register through the bank as a merchant rather than using a personal proxy, so transactions settle correctly and carry references.",
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
  // 120-190 words: the self-contained block AI answers can quote. Enforced by
  // scripts/assert-prose.mjs.
  intro: string;
  placeholder: string;
  sections: Section[];
  faq: Faq[];
};

const barcodePrivacyFaq: Faq = {
  q: "Is this barcode generator really free, and is my data uploaded?",
  a: "Yes, free with no sign-up or watermark. The barcode is drawn in your browser — whatever you type is never sent to a server, so product codes and internal part numbers stay on your device.",
};

export const SYMBOLOGIES: Symbology[] = [
  {
    slug: "code-128-barcode-generator",
    format: "CODE128",
    label: "CODE128",
    title: "CODE 128 Barcode Generator — Free, SVG & PNG, No Sign-Up",
    desc: "Generate CODE 128 barcodes free in your browser. Encodes letters, digits and symbols compactly. Download print-ready SVG or PNG — nothing is uploaded.",
    h1: "CODE 128 Barcode Generator",
    intro:
      "CODE 128 is the workhorse of internal barcoding. It encodes the full ASCII set — uppercase, lowercase, digits and punctuation — more compactly than any other widely supported linear symbology, which is why warehouses, shipping labels, asset registers and library systems settled on it. There is no fixed length and no registration body involved: unlike retail codes, the numbers are yours to define, because they only have to mean something inside your own system. The encoder picks between three character subsets automatically to keep the symbol as narrow as possible, and appends a modulo-103 check character that scanners verify silently. Type your content and download a vector SVG that stays sharp at any label size, or a PNG for screen use. Nothing is uploaded — the barcode is drawn in your browser, so internal part numbers and consignment references never leave the machine you typed them on.",
    placeholder: "e.g. ITEM-0042 or SHIP-99120",
    sections: [
      {
        h: "Subsets A, B and C, and why they matter",
        body: [
          "CODE 128 defines three overlapping character sets. Subset A covers digits, uppercase letters and ASCII control characters; B swaps the control characters for lowercase; C is the interesting one, encoding pairs of digits in a single symbol character for double density.",
          "A good encoder switches between them mid-symbol to minimise width, which is what this one does. The practical consequence is that a purely numeric value with an even number of digits produces a dramatically narrower barcode than the same length of mixed text — worth knowing when label width is fixed and your reference format is still up for discussion.",
        ],
      },
      {
        h: "GS1-128 is CODE 128 with rules attached",
        body: [
          "GS1-128, formerly UCC/EAN-128, uses exactly this symbology but adds a layer of meaning: a leading FNC1 character and standard Application Identifiers that mark what follows as a batch number, expiry date, weight or serial. It is what appears on pallet labels and in regulated supply chains.",
          "This generator produces plain CODE 128, not GS1-128. For internal asset tags, bin locations and shipping references that is exactly what you want. If a trading partner has asked for GS1-128 with specific AIs, you need software that understands those structures — a visually identical barcode carrying unstructured text will be rejected by their scanning rules.",
        ],
      },
      {
        h: "Sizing, quiet zones and print quality",
        body: [
          "The X-dimension is the width of the narrowest bar and everything else scales from it. For labels read by handheld scanners at close range, around 0.25 mm is comfortable; smaller demands better printing. Height is a legibility matter rather than a data one — roughly 15% of the symbol width, or about 12 mm, gives a scanner enough to aim at.",
          "Leave a quiet zone of at least ten times the X-dimension at each end, clear of borders and text. Print dark-on-light with real black rather than a rich black that can register imperfectly, and if you are using thermal transfer, check the first labels off the roll: a worn printhead thins bars in a way that reads fine to the eye and fails at the scanner.",
        ],
      },
      {
        h: "Choosing your own numbering scheme",
        body: [
          "Because nobody assigns these numbers, the design is yours — which means it is worth doing deliberately. Fixed-length references sort and validate more easily than variable ones, and a short prefix per category makes a scanned code readable by a human as well as a machine.",
          "Two practical cautions. Avoid encoding information that changes, such as a location, in the identifier itself; the label outlives the fact. And if the value will ever be typed by hand as a fallback, keep it short and avoid characters that are easy to confuse — the density advantage of a long alphanumeric string disappears the moment someone has to read it aloud.",
        ],
      },
    ],
    faq: [
      barcodePrivacyFaq,
      {
        q: "What can a CODE 128 barcode contain?",
        a: "Any ASCII character — uppercase and lowercase letters, digits, spaces and punctuation. There is no fixed length, though very long content produces a wide symbol that needs more label space to stay scannable.",
      },
      {
        q: "What is the difference between CODE 128 A, B and C?",
        a: "They are subsets: A covers uppercase and control characters, B adds lowercase, and C encodes digit pairs at double density. The generator picks the most efficient subset for your content automatically.",
      },
      {
        q: "Should I use CODE 128 or CODE 39?",
        a: "CODE 128 unless a legacy system requires otherwise. It is denser and supports lowercase, so the same data produces a narrower symbol than CODE 39.",
      },
    ],
  },
  {
    slug: "ean-13-barcode-generator",
    format: "EAN13",
    label: "EAN-13",
    title: "EAN-13 Barcode Generator — Free Retail Barcodes, SVG & PNG",
    desc: "Generate EAN-13 retail barcodes free in your browser. Enter 12 digits and the check digit is calculated automatically. Print-ready SVG or PNG, no upload.",
    h1: "EAN-13 Barcode Generator",
    intro:
      "EAN-13 is the barcode on retail products almost everywhere outside North America — thirteen digits, made up of a GS1 company prefix, your item reference and a final check digit. Enter the first twelve and the thirteenth is calculated for you using the standard weighted modulo-10 formula, then download a vector SVG that stays crisp at packaging print sizes. The important thing to understand before you print anything: this tool draws the barcode, but it cannot issue the number. Retail EAN numbers are allocated by GS1, and a made-up number will either be rejected by the retailer or collide with someone else's product in their system. If you already have a prefix, this is the fastest way to turn a number into artwork. Everything renders in your browser, so unreleased product codes stay on your machine.",
    placeholder: "e.g. 590123412345",
    sections: [
      {
        h: "What the thirteen digits mean",
        body: [
          "The number splits into three parts. The GS1 company prefix identifies you and runs from seven to ten digits depending on how many products you registered for. The item reference fills the space that leaves. The last digit is a check digit, computed rather than chosen.",
          "The first two or three digits of the prefix are commonly read as a country code, and that is a persistent misunderstanding: they identify the GS1 member organisation that issued the prefix, not where the product was made. A UK company can perfectly legitimately sell goods manufactured anywhere carrying a 50x prefix.",
        ],
      },
      {
        h: "How the check digit is calculated",
        body: [
          "Take the first twelve digits and multiply each alternately by 1 and 3, starting with 1 at the leftmost position. Sum the results, then the check digit is whatever value brings that sum up to the next multiple of ten — equivalently, (10 − sum mod 10) mod 10.",
          "That single digit is what lets a scanner reject a misread rather than silently return the wrong product. It is also why pasting all thirteen digits here either validates or fails: if the final digit does not match the calculation, something upstream is wrong and printing it would produce a barcode that scanners refuse.",
        ],
      },
      {
        h: "You need a GS1 prefix before you print",
        body: [
          "GS1 is the body that allocates prefixes, through national member organisations, for a joining fee and an annual renewal. Retailers verify that a barcode resolves to the brand that claims it, and the major grocers and marketplaces check this at onboarding.",
          "Resold or 'lifetime' barcode numbers bought from third-party sellers are a recurring trap. They are usually blocks issued before GS1 tightened its licensing, and while they scan perfectly, they are registered to another company — which surfaces as a rejected listing at exactly the wrong moment. If the product is going to a retailer, buy the prefix directly.",
        ],
      },
      {
        h: "Print size and the quiet zone",
        body: [
          "The nominal EAN-13 symbol is about 37.29 mm wide by 25.93 mm high at 100% magnification, and the standard permits scaling between 80% and 200%. Going below 80% is the usual cause of a code that scans in the design studio and fails at a busy checkout.",
          "The quiet zones are part of the symbol, not the margin around it: eleven modules on the left and seven on the right, which is why the '>' marker often appears at the right edge of packaging artwork. Do not let a design put text or a fold there. Keep bars dark on a light background, avoid red for the bars — many older scanners read with red light and will see nothing — and never rotate a linear barcode into a gradient.",
        ],
      },
    ],
    faq: [
      barcodePrivacyFaq,
      {
        q: "How many digits does EAN-13 need?",
        a: "Twelve digits, and the generator appends the thirteenth check digit for you. You can also paste all thirteen — it will be accepted if the check digit is already correct, and rejected if it is not.",
      },
      {
        q: "Can I sell products using a barcode I generated here?",
        a: "The image is yours to use, but the number is not ours to give. Retail EAN numbers are assigned by GS1, and retailers reject made-up numbers. Get your GS1 prefix first, then generate the barcode here from the number they issue.",
      },
      {
        q: "What is the difference between EAN-13 and UPC-A?",
        a: "UPC-A is the 12-digit North American format; EAN-13 is the 13-digit international superset. An EAN-13 starting with a leading zero is the same product code as the equivalent UPC-A.",
      },
    ],
  },
  {
    slug: "upc-a-barcode-generator",
    format: "UPC",
    label: "UPC-A",
    title: "UPC-A Barcode Generator — Free UPC Codes, SVG & PNG",
    desc: "Generate UPC-A barcodes free in your browser for North American retail. Enter 11 digits and the check digit is added automatically. SVG or PNG, no upload.",
    h1: "UPC-A Barcode Generator",
    intro:
      "UPC-A is the twelve-digit barcode on retail products in the United States and Canada, and the oldest barcode still in everyday use — the format scanned at a supermarket checkout in Ohio in 1974 and largely unchanged since. Enter your eleven digits and the twelfth check digit is computed automatically, then download vector SVG for packaging artwork or PNG for a quick mock-up. As with EAN-13, the number itself comes from GS1 rather than from us: a barcode drawn around an invented number scans perfectly and gets rejected at retailer onboarding. If you already hold a company prefix, this turns it into print-ready artwork in a few seconds. The rendering happens in your browser, so an unannounced product's code is not sent anywhere.",
    placeholder: "e.g. 03600029145",
    sections: [
      {
        h: "UPC-A and EAN-13 are the same system",
        body: [
          "A UPC-A is an EAN-13 with a leading zero. Take any twelve-digit UPC, put a zero in front, and you have the equivalent thirteen-digit GTIN — the check digit is unchanged, because the calculation treats the added zero as contributing nothing.",
          "That is why scanners everywhere read both, and why a product registered once with GS1 can be printed in either format for different markets. The practical difference is width: UPC-A is slightly narrower, which occasionally matters on small packaging, and North American retailers are more used to seeing it.",
        ],
      },
      {
        h: "Reading the twelve digits",
        body: [
          "The first digit is the number system character, which historically signalled the type of product: 0, 1, 6, 7, 8 for general goods, 2 for variable-weight items priced in store, 3 for pharmaceuticals under the National Drug Code, 4 for retailer-internal use, and 5 or 9 for coupons.",
          "Number system 2 and 4 are the two worth knowing. Type 2 is what a supermarket deli scale prints, where part of the code is the price rather than the item. Type 4 is reserved for a retailer's own internal numbering and is explicitly not for products crossing between companies — using it because it is unallocated will cause exactly the collision it exists to prevent.",
        ],
      },
      {
        h: "The check digit, and why zero-suppressed UPC-E differs",
        body: [
          "The check digit uses the same weighted modulo-10 scheme as EAN-13: alternate weights of 3 and 1 across the first eleven digits, summed, then whatever brings the total to a multiple of ten. Paste twelve digits here and the tool validates rather than recalculates — a mismatch means the number is wrong, not the barcode.",
          "UPC-E is the compressed six-digit variant found on small items like lip balm and single cans. It is not a different number: it is a UPC-A with specific patterns of zeros suppressed, expanded back by the scanner. Because only certain number shapes can be compressed, you cannot decide to use UPC-E for an arbitrary product.",
        ],
      },
      {
        h: "Printing for a checkout, not for a design review",
        body: [
          "Nominal size is about 37.29 mm by 25.91 mm, scalable from 80% to 200%. The truncation temptation — trimming the bar height to fit a design — is the single most common cause of retail scan failures, because an omnidirectional checkout scanner needs height to catch the symbol at an angle.",
          "Keep nine modules of quiet zone at each end, print the bars in solid black on white or a very light background, and never in red. If the packaging is glossy or curved, ask the printer for a proof and test it on a real scanner: specular reflection off a curved bottle defeats more barcodes than any encoding mistake.",
        ],
      },
    ],
    faq: [
      barcodePrivacyFaq,
      {
        q: "How many digits does UPC-A need?",
        a: "Eleven digits, with the twelfth check digit calculated for you. Pasting all twelve works too, provided the check digit is correct.",
      },
      {
        q: "Can I use a generated UPC to sell in stores?",
        a: "Only if the number was issued to you by GS1. The barcode image here is free to use, but retailers verify that the company prefix is registered — self-invented numbers will be rejected.",
      },
      {
        q: "Do I need UPC-A or EAN-13?",
        a: "UPC-A for North American retail, EAN-13 elsewhere. Most modern scanners read both, and many brands register a single GS1 number that can be printed in either format.",
      },
    ],
  },
  {
    slug: "code-39-barcode-generator",
    format: "CODE39",
    label: "CODE39",
    title: "CODE 39 Barcode Generator — Free, SVG & PNG, No Sign-Up",
    desc: "Generate CODE 39 barcodes free in your browser for legacy industrial, logistics and military systems. Download print-ready SVG or PNG — nothing is uploaded.",
    h1: "CODE 39 Barcode Generator",
    intro:
      "CODE 39 is the old industrial standard, and it survives because so much still depends on it: automotive supply chains, defence labelling under LOGMARS and older MIL-STD requirements, healthcare systems and a long tail of equipment too expensive to replace. It encodes uppercase letters, digits, space and the symbols - . $ / + %, which is a deliberately small set, and it wraps the data in asterisk start and stop characters. Two properties keep it in service. It is self-checking, meaning a single misprinted element cannot decode as a different valid character, and every scanner ever built reads it without configuration. The cost is width: CODE 39 needs roughly 40% more space than CODE 128 for the same content. If a specification does not require it, use CODE 128 instead. Generated in your browser — part numbers are never uploaded.",
    placeholder: "e.g. PART-1234",
    sections: [
      {
        h: "Self-checking, and what that actually buys you",
        body: [
          "Each CODE 39 character is nine elements, three of them wide, and that fixed structure is checked as the scanner decodes. A printing defect that alters one element produces an invalid pattern rather than a different valid character, so the symbol fails to read instead of reading wrong.",
          "That is a meaningful safety property in an environment where labels get printed on worn thermal printers and read in poor conditions. It is not the same as a check digit covering the whole message, though: an optional modulo-43 check character exists for that, required by some specifications and ignored by most general use.",
        ],
      },
      {
        h: "Why it is so wide",
        body: [
          "Every character takes the same nine elements regardless of what it is, and there is no numeric compression of the kind CODE 128's subset C provides. A twelve-character part number can therefore run half as wide again as the same string in CODE 128.",
          "On a large carton that is irrelevant. On a small component label or a cable flag it is the deciding constraint, and it is the usual reason a legacy scheme gets migrated. Full ASCII CODE 39, which encodes lowercase and symbols as two-character sequences, roughly doubles the width again — a workaround rather than a feature.",
        ],
      },
      {
        h: "The asterisks and the character set",
        body: [
          "The symbol is delimited by an asterisk at each end. Most software adds these automatically, and this generator does; the confusion arises when a system prints the human-readable line as *PART-1234* and someone types the asterisks into a field expecting the bare value.",
          "The character set is uppercase only. Lowercase input is a common source of failure — it either gets silently uppercased or rejected, depending on the encoder. If your identifiers are case-sensitive, CODE 39 cannot represent them and the choice is already made for you.",
        ],
      },
      {
        h: "When a specification is the reason",
        body: [
          "Choose CODE 39 when something external requires it: a customer's inbound labelling standard, a defence contract citing MIL-STD-129, an existing scanner fleet configured for it, or a database of historical labels that must stay readable alongside new ones.",
          "For anything genuinely new and internal, CODE 128 is denser, supports lowercase and carries a proper check character. The exception is where labels may be read by very old or oddly configured equipment you do not control — CODE 39's universality is its last real advantage, and occasionally it is the one that matters.",
        ],
      },
    ],
    faq: [
      barcodePrivacyFaq,
      {
        q: "What characters can CODE 39 encode?",
        a: "Uppercase A–Z, digits 0–9, space, and the symbols - . $ / + %. Lowercase is not supported — if you need it, use CODE 128 instead.",
      },
      {
        q: "Why is my CODE 39 barcode so wide?",
        a: "CODE 39 uses nine bars per character, so it is roughly 30% wider than CODE 128 for the same content. For long values on a small label, CODE 128 is the better fit.",
      },
      {
        q: "Does CODE 39 need a check digit?",
        a: "Not usually. The optional modulo-43 check digit is required only by specific standards such as LOGMARS and HIBC; most applications omit it.",
      },
    ],
  },
];

// --- Competitor comparison ---
// Commercial-intent pages for people already using a competitor. Deliberately
// NOT part of QR_TYPES/SYMBOLOGIES/PAYMENT_GUIDES: those arrays feed the hub
// catalogue and the generator routes, and a prose page is neither.
//
// Every number about QRCode Monkey below is quoted from their own site — see
// `sources`. Re-check before editing; stale competitor pricing is worse than
// no comparison page at all.

export const COMPARISONS: Comparison[] = [
  {
    slug: "qr-code-monkey-alternative",
    competitor: "QRCode Monkey",
    title: "QRCode Monkey Alternative — Free QR Codes, No Upload",
    desc: "A free QRCode Monkey alternative: static QR codes made in your browser, nothing cached on a server, no account, no PRO upsell. Honest side-by-side comparison.",
    h1: "The free QRCode Monkey alternative",
    intro:
      "QRCode Monkey is a good free generator, and this page is not going to pretend otherwise. But two things send people looking for an alternative: it caches your generated image on its servers for 24 hours, and everything past a plain static code — dynamic QR, scan statistics, bulk creation — is gated behind its paid PRO product. MakeQR is our free QR generator; here is exactly where it differs.",
    sections: [
      {
        h: "Should you switch? The short answer",
        body: [
          "Switch if you want the code generated and downloaded without any copy of it touching someone else’s server, or if you also need barcodes (CODE128, EAN-13, UPC-A, CODE39) from the same tool. Stay with QRCode Monkey if you want a logo in the middle of the code, gradient colours, custom eye shapes, or EPS/PDF export — it does all four and MakeQR does none of them.",
          "Disclosure: MakeQR is our tool. The comparison below is built from QRCode Monkey’s own published claims, linked at the bottom of this page, and we have listed the features where it beats us.",
        ],
      },
      {
        h: "Generate a QR code free — what you actually get",
        body: [
          "MakeQR generates static QR codes for URLs, WiFi networks, vCard contact details, email, SMS, phone numbers and map locations. There is no account, no watermark, no daily cap and no code limit. Set the size, foreground and background colour and error-correction level, then download PNG, JPG or SVG.",
          "Static means the destination is baked into the pattern itself. Nobody — including us — can change it, expire it, or switch it off later. That is the trade: no scan analytics, but also nothing that can be taken away from a code you already printed.",
        ],
      },
      {
        h: "Where QRCode Monkey puts limits",
        body: [
          'The generator itself genuinely is free and unlimited — QRCode Monkey says its codes "do not expire and will work forever!" with no scanning limits, and that is accurate for static codes. The limits are elsewhere.',
          'First, storage. QRCode Monkey states plainly: "We cache your qr code image files for 24h on our server." For a restaurant menu link that is irrelevant. For a QR encoding an internal WiFi password, a private booking URL or a staff contact card, it means a copy existed off your machine. MakeQR draws the code in the browser canvas — there is no upload step to cache.',
          "Second, the upsell. Dynamic QR codes, scan statistics, bulk creation and editing, and campaign folders all sit behind the separate paid QR Code Generator PRO product. If your reason for looking at QRCode Monkey was tracking scans, the free tool was never going to do it.",
        ],
      },
      {
        h: "Static vs dynamic: the subscription trap",
        body: [
          "A dynamic QR code does not contain your destination. It contains a short redirect URL owned by the vendor, which forwards to wherever their dashboard currently points. That is what makes scan tracking and editable destinations possible — and it is also what makes the code stop working the month you stop paying, on signage that may already be printed and mounted.",
          "This is worth being blunt about, because it cuts against us too: MakeQR does not offer dynamic QR codes, so if you genuinely need editable destinations or scan counts, neither the free QRCode Monkey tool nor MakeQR is your answer — you need a paid product, and you should price in what happens to your printed codes if you ever cancel.",
          "For the large majority of uses — a link on a poster, a WiFi code on a table tent, a vCard on a business card — a static code is the safer object. It works offline, forever, with no vendor in the path between the scan and the destination.",
        ],
      },
      {
        h: "Where QRCode Monkey is genuinely better",
        body: [
          "Design. QRCode Monkey lets you drop a logo into the centre of the code (up to 2 MB), apply gradient colours, recolour and reshape the eyes and the body modules, and export EPS and PDF alongside PNG and SVG. MakeQR gives you a solid foreground colour, a background colour, size and error-correction level. That is it.",
          "If you are producing brand-controlled print collateral and the code has to carry a logo, use QRCode Monkey. It is the better tool for that job and the 24-hour cache of a public marketing URL costs you nothing.",
        ],
      },
      {
        h: "How to switch",
        body: [
          "There is nothing to migrate — a static QR code is just a pattern, and codes you already made with QRCode Monkey keep working forever. Point your next code at the generator you prefer.",
          "Start with the type you need: a URL QR code, a WiFi QR code, a vCard QR code, or a barcode. Everything is on the same page below with no sign-up step.",
        ],
      },
    ],
    matrix: [
      {
        feature: "Price",
        us: "Free",
        them: "Free (static)",
        note: "QRCode Monkey gates dynamic QR, scan stats and bulk creation behind its paid PRO product.",
      },
      {
        feature: "Account required",
        us: "No",
        them: "No",
      },
      {
        feature: "Codes stored on a server",
        us: "No",
        them: "Cached 24h",
        note: 'Their site: "We cache your qr code image files for 24h on our server." MakeQR draws the code in your browser — there is no upload.',
      },
      {
        feature: "Codes expire",
        us: "Never",
        them: "Never",
        note: "True of static codes on both. Dynamic codes from any vendor stop resolving when the subscription lapses.",
      },
      {
        feature: "Watermark",
        us: "None",
        them: "None",
      },
      {
        feature: "Download formats",
        us: "PNG, JPG, SVG",
        them: "PNG, SVG, PDF, EPS",
      },
      {
        feature: "Logo in the code",
        us: "No",
        them: "Yes",
        note: "Up to 2 MB. This is QRCode Monkey’s strongest feature and we do not match it.",
      },
      {
        feature: "Gradients, custom eye shapes",
        us: "No",
        them: "Yes",
      },
      {
        feature: "Barcodes (CODE128, EAN-13, UPC-A, CODE39)",
        us: "Yes",
        them: "No",
      },
      {
        feature: "Dynamic QR & scan statistics",
        us: "No",
        them: "Paid PRO",
      },
      {
        feature: "Works with no network after page load",
        us: "Yes",
        them: "No",
      },
    ],
    sources: [
      {
        label: "QRCode Monkey homepage",
        url: "https://www.qrcode-monkey.com/",
      },
    ],
    updated: "2026-08-01",
    faq: [
      {
        q: "How do I generate a QR code for free?",
        a: "Pick the type of code you need — URL, WiFi, vCard, email, SMS, phone or location — type the details, and download the PNG, JPG or SVG. There is no account and no cap on how many you make. On MakeQR the code is drawn in your browser, so what you type is never uploaded.",
      },
      {
        q: "Is QRCode Monkey actually free?",
        a: "Yes, for static QR codes. Its site states the generated codes are 100% free, do not expire and have no scanning limits, which is accurate. What costs money is the separate PRO product for dynamic codes, scan statistics and bulk creation.",
      },
      {
        q: "Does QRCode Monkey store my QR codes?",
        a: 'It caches the generated image file. QRCode Monkey states: "We cache your qr code image files for 24h on our server." That is fine for a public marketing link and worth avoiding for a WiFi password or a private URL. MakeQR has no upload step, so there is nothing to cache.',
      },
      {
        q: "Can I add a logo to my QR code here?",
        a: "No. MakeQR supports a custom foreground colour, background colour, size and error-correction level, but not logo embedding, gradients or custom eye shapes. If you need a logo in the code, QRCode Monkey does that well and is the better choice for it.",
      },
      {
        q: "Will my QR codes stop working if I stop using this site?",
        a: "No. Every code MakeQR produces is static: the destination is encoded in the pattern itself, and nothing routes through our servers when someone scans it. The code keeps working whether or not this site exists. That is not true of dynamic QR codes from any vendor, which resolve through the vendor’s redirect.",
      },
      {
        q: "Do you offer dynamic QR codes or scan tracking?",
        a: "No. Dynamic codes require a server to own the redirect and count the scans, which would mean the destination lives with us rather than in your code. We have chosen not to do that, so if scan analytics are a requirement, you need a paid product — from QRCode Monkey PRO or elsewhere.",
      },
    ],
  },
];

// Prose for the homepage. It lives here rather than inline in index.tsx so the
// depth assertion can see it: the homepage is the landing page for "qr code
// generator" and was the thinnest page on this Worker at ~340 rendered words,
// most of which were navigation links rather than anything a reader learns from.
export const HOME_SECTIONS: Section[] = [
  {
    h: "Which type of code do you need?",
    body: [
      "A QR code is a container for text, and the type you pick decides what the phone does with that text once it has read it. A URL code opens a link. A WiFi code joins a network without anyone reading a password aloud. A vCard code adds a full contact entry — name, phone, email, company, address — in one scan rather than eight fields of typing. Email, SMS and phone codes pre-fill a message or a number so the recipient only has to press send.",
      "The mistake worth avoiding is putting a plain URL in a code that should carry structured data. A link to a page that displays your phone number makes the reader do the copying; a phone or vCard code does it for them. The structured types cost nothing extra and work offline, because the data is in the pattern rather than at the other end of a network request.",
    ],
  },
  {
    h: "Error correction, size and the quiet zone",
    body: [
      "QR codes carry Reed–Solomon error correction at one of four levels. Level L recovers from about 7% damage and produces the smallest, simplest pattern; level H recovers from around 30% but needs considerably more modules for the same data. Higher is not automatically better: more modules at the same printed size means smaller modules, which is harder for a camera to resolve, so a high correction level on a small print can scan worse than a low one.",
      "For a screen or a clean printed card, L or M is right. Reserve Q and H for codes that will be scanned in poor light, from an angle, or printed on something that will get scuffed — a sticker on a machine, a label on packaging, anything outdoors.",
      "The quiet zone is the blank margin around the pattern, and it is part of the code rather than decoration. Crowding it with a border, a logo or text is the single most common reason a technically valid code refuses to scan.",
    ],
  },
  {
    h: "Printing codes that work",
    body: [
      "Keep dark modules on a light background. Inverted codes — light on dark — are readable by some decoders and not others, and there is no benefit worth that risk. Contrast matters more than colour: a dark blue on white scans fine, while a mid-grey on light grey fails on older cameras.",
      "Size follows scanning distance. A rough working rule is that the printed code should be about a tenth of the distance it will be scanned from, so a code read at a metre wants roughly ten centimetres. Download SVG for anything going to print, since it scales without the soft edges a stretched PNG produces, and test with more than one phone before committing to a print run.",
    ],
  },
];
