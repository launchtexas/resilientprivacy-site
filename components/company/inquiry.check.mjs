// Self-check for the inquiry form's sanitising. Run: npm run check:forms
import assert from "node:assert/strict";
import { clean, mailtoHref, validate, EMAIL } from "./inquiry.ts";

const fields = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Work email", type: "email", required: true },
  { name: "topic", label: "Topic", type: "select", required: true, options: ["Sales"] },
  { name: "message", label: "Message", type: "textarea", required: true },
];
const ok = { name: "Ann", email: "ann@acme.com", topic: "Sales", message: "Hi\nthere" };

assert.deepEqual(validate(fields, ok), {});
assert.ok(validate(fields, { ...ok, email: "ann@acme" }).email);
assert.ok(validate(fields, { ...ok, email: "a b@acme.com" }).email);
assert.ok(validate(fields, { ...ok, topic: "Evil" }).topic);
assert.ok(validate(fields, { ...ok, name: "  " }).name);
assert.ok(validate(fields, { ...ok, message: "x".repeat(2001) }).message);
assert.ok(EMAIL.test("first.last+tag@sub.example.co"));

// CR/LF and control chars are stripped from single-line fields, kept as newlines in the message.
assert.equal(clean("Ann\r\nBcc: x@evil.com\u0000", false, 100), "AnnBcc: x@evil.com");
assert.equal(clean(" a\nb\u0007 ", true), "a\nb");
assert.equal(clean("x".repeat(500), false, 100).length, 100);

const href = mailtoHref("info@example.com", "Inquiry", fields, { ...ok, name: "Ann\r\nBcc: x@evil.com", topic: "Sales\r\nCc: y@evil.com" });
const u = new URL(href);
assert.equal(u.protocol, "mailto:");
assert.equal(u.pathname, "info@example.com");
assert.deepEqual([...u.searchParams.keys()], ["subject", "body"]); // no injected cc/bcc params
assert.equal(u.searchParams.get("subject"), "Inquiry: SalesCc: y@evil.com");
assert.match(u.searchParams.get("body"), /^Full name: AnnBcc: x@evil.com\nWork email: ann@acme.com\n/);
assert.ok(!href.includes("&cc=") && !href.includes("&bcc="));
console.log("inquiry form self-check: ok");
