// QR payload builders. Pure functions — tested in tests/payloads.test.mjs.

const escWifi = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");

export type WifiSecurity = "WPA" | "WEP" | "nopass";

export function wifi(o: {
  ssid: string;
  password?: string;
  security?: WifiSecurity;
  hidden?: boolean;
}): string {
  const security = o.security ?? "WPA";
  const pass = security === "nopass" ? "" : `P:${escWifi(o.password ?? "")};`;
  return `WIFI:T:${security};S:${escWifi(o.ssid)};${pass}${o.hidden ? "H:true;" : ""};`;
}

export function url(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  return /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`;
}

export function email(o: {
  to: string;
  subject?: string;
  body?: string;
}): string {
  const params = new URLSearchParams();
  if (o.subject) params.set("subject", o.subject);
  if (o.body) params.set("body", o.body);
  const q = params.toString();
  return `mailto:${o.to}${q ? `?${q}` : ""}`;
}

export function sms(o: { phone: string; message?: string }): string {
  return `SMSTO:${o.phone.trim()}:${o.message ?? ""}`;
}

export function phone(num: string): string {
  return `tel:${num.trim()}`;
}

export function geo(o: { lat: string | number; lng: string | number }): string {
  return `geo:${o.lat},${o.lng}`;
}

const escVcard = (s: string) =>
  s.replace(/([\\,;])/g, "\\$1").replace(/\n/g, "\\n");

export function vcard(o: {
  firstName?: string;
  lastName?: string;
  org?: string;
  title?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  website?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}): string {
  const e = (s?: string) => escVcard((s ?? "").trim());
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  if (o.firstName || o.lastName) {
    lines.push(`N:${e(o.lastName)};${e(o.firstName)};;;`);
    lines.push(
      `FN:${[o.firstName, o.lastName].filter(Boolean).map(e).join(" ")}`,
    );
  }
  if (o.org) lines.push(`ORG:${e(o.org)}`);
  if (o.title) lines.push(`TITLE:${e(o.title)}`);
  if (o.phone) lines.push(`TEL;TYPE=WORK,VOICE:${e(o.phone)}`);
  if (o.mobile) lines.push(`TEL;TYPE=CELL:${e(o.mobile)}`);
  if (o.email) lines.push(`EMAIL:${e(o.email)}`);
  if (o.website) lines.push(`URL:${e(o.website)}`);
  if (o.street || o.city || o.state || o.zip || o.country) {
    lines.push(
      `ADR;TYPE=WORK:;;${e(o.street)};${e(o.city)};${e(o.state)};${e(o.zip)};${e(o.country)}`,
    );
  }
  lines.push("END:VCARD");
  return lines.join("\n");
}
