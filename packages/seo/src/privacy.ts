// Shared privacy-policy copy. Each tool renders these sections in its own
// layout. Honest and tool-accurate: client-side processing is the default;
// the PDF tool's approved server path is disclosed explicitly.

export type PrivacySection = { h: string; body: string[] };

export const PRIVACY_UPDATED = "2026-07-29";

export function privacySections(o: {
  siteName: string;
  what: string; // e.g. "QR codes and barcodes", "images", "PDF files", "calculations"
  serverPath?: boolean; // pdf tool: some conversions run server-side
}): PrivacySection[] {
  const sections: PrivacySection[] = [
    {
      h: "The short version",
      body: [
        `${o.siteName} is built privacy-first: the ${o.what} you work with are processed by JavaScript running in your own browser. ${
          o.serverPath
            ? 'For the small set of conversions that require a server engine (marked "server" on the tool), files are streamed through, converted in memory, and discarded the moment the result is returned — they are never written to storage, logged, or looked at.'
            : "They are never uploaded, stored, or seen by us — you can load a tool, disconnect from the internet, and it still works."
        }`,
        "We do not require accounts, we do not ask for your name or email, and we do not sell data — we have none to sell.",
      ],
    },
    {
      h: "What we do not collect",
      body: [
        `Your files and inputs: everything you type or drop into ${o.siteName} stays on your device${
          o.serverPath
            ? " (except the explicitly marked server-side conversions described above)"
            : ""
        }. We cannot recover, view, or restore anything you process here.`,
        "Personal information: there is no sign-up, no login, and no form asking who you are.",
      ],
    },
    {
      h: "What is processed automatically",
      body: [
        "Hosting logs: this site is served by Cloudflare, which processes standard technical data (IP address, user agent, requested URL) to deliver pages and protect against abuse. These logs are handled under Cloudflare’s privacy policy and are not used by us to identify you.",
        "Local storage: if a tool remembers a preference (like a chosen setting), it is saved in your browser’s localStorage only. It never leaves your device, and clearing your browser data removes it.",
      ],
    },
    {
      h: "Advertising",
      body: [
        "This site is free because it may show advertising. If ads are displayed, they are served by a third-party network (such as Google AdSense) which may use cookies or similar technologies under its own privacy policy, and you can opt out of personalised advertising in your ad settings. Ad networks never receive the content you process with the tools — that stays in your browser.",
      ],
    },
    {
      h: "Changes and contact",
      body: [
        `This policy was last updated on ${PRIVACY_UPDATED}. If the way ${o.siteName} handles data ever changes, this page will change first — and the privacy-first rule above is the product’s core promise, not a temporary policy.`,
        "Questions about privacy? Contact the site operator via the contact details on the homepage of this site.",
      ],
    },
  ];
  return sections;
}
