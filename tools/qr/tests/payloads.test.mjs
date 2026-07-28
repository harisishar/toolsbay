import { test } from "node:test";
import assert from "node:assert/strict";
import {
  wifi,
  url,
  email,
  sms,
  phone,
  geo,
  vcard,
} from "../src/lib/payloads.ts";

test("wifi", () => {
  assert.equal(
    wifi({ ssid: "Home", password: "pw123" }),
    "WIFI:T:WPA;S:Home;P:pw123;;",
  );
  assert.equal(
    wifi({ ssid: "Open", security: "nopass" }),
    "WIFI:T:nopass;S:Open;;",
  );
  assert.equal(
    wifi({ ssid: "a;b", password: "p:w", hidden: true }),
    "WIFI:T:WPA;S:a\\;b;P:p\\:w;H:true;;",
  );
});

test("url", () => {
  assert.equal(url("example.com"), "https://example.com");
  assert.equal(url("http://x.io"), "http://x.io");
  assert.equal(url("  "), "");
});

test("email", () => {
  assert.equal(email({ to: "a@b.co" }), "mailto:a@b.co");
  assert.equal(
    email({ to: "a@b.co", subject: "Hi there", body: "x&y" }),
    "mailto:a@b.co?subject=Hi+there&body=x%26y",
  );
});

test("sms/phone/geo", () => {
  assert.equal(
    sms({ phone: "+60123456789", message: "hello" }),
    "SMSTO:+60123456789:hello",
  );
  assert.equal(phone(" +1 555 "), "tel:+1 555");
  assert.equal(geo({ lat: 3.139, lng: 101.6869 }), "geo:3.139,101.6869");
});

test("vcard", () => {
  const v = vcard({
    firstName: "Ana",
    lastName: "Lim",
    org: "Acme, Inc",
    email: "ana@acme.co",
  });
  assert.equal(
    v,
    [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Lim;Ana;;;",
      "FN:Ana Lim",
      "ORG:Acme\\, Inc",
      "EMAIL:ana@acme.co",
      "END:VCARD",
    ].join("\n"),
  );
  assert.equal(vcard({}), "BEGIN:VCARD\nVERSION:3.0\nEND:VCARD");
});
