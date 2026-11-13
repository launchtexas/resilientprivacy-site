// Self-check for POST /api/inquiry with fetch mocked; no real email is sent. Run: npm run check:forms
import assert from "node:assert/strict";
import { POST } from "./route.ts";

const sent = [];
globalThis.fetch = async (url, init) => (sent.push({ url, init }), new Response("{}", { status: 200 }));

let n = 0;
const ok = { form: "contact", name: "Ann", email: "ann@acme.com", company: "Acme", intent: "Ask a question", topic: "AI security", message: "Hi\nthere", agree: true };
const req = (body, { ip = `10.0.0.${++n}`, origin = "https://rp.test", type = "application/json" } = {}) =>
  new Request("https://rp.test/api/inquiry", {
    method: "POST",
    headers: { host: "rp.test", "content-type": type, "x-forwarded-for": ip, ...(origin && { origin }) },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
const post = async (...a) => { const r = await POST(req(...a)); return { status: r.status, body: await r.json() }; };

// Missing key: valid input answers 503 + mailto fallback and nothing is sent.
delete process.env.RESEND_API_KEY;
assert.deepEqual(await post(ok), { status: 503, body: { ok: false, fallback: "mailto" } });
assert.equal(sent.length, 0);

process.env.RESEND_API_KEY = "re_test_dummy";
// Honeypot filled: 200, nothing sent.
assert.deepEqual(await post({ ...ok, website: "spam.example" }), { status: 200, body: { ok: true } });
assert.equal(sent.length, 0);
// Guardrails.
assert.equal((await post(ok, { origin: "https://evil.test" })).status, 403);
assert.equal((await post(ok, { origin: null })).status, 403);
assert.equal((await post(ok, { type: "text/plain" })).status, 415);
assert.equal((await post({ ...ok, message: "x".repeat(17 * 1024) })).status, 413);
assert.equal((await post("{not json")).status, 400);
assert.equal((await post({ ...ok, form: "__proto__" })).status, 400);
assert.equal((await post({ ...ok, topic: "Evil" })).status, 400);
assert.equal((await post({ ...ok, agree: "yes" })).status, 400);
assert.equal((await post({ ...ok, name: ["Ann"] })).status, 400);
const bad = await post({ ...ok, email: "ann@acme" });
assert.equal(bad.status, 400);
assert.ok(!JSON.stringify(bad.body).includes("ann@acme")); // never echoes input
assert.equal(sent.length, 0);

// Valid: one Resend call, CR/LF stripped from subject, reply_to is the visitor.
const good = await post({ ...ok, topic: "AI security", name: "Ann\r\nBcc: x@evil.test" });
assert.deepEqual(good, { status: 200, body: { ok: true } });
assert.equal(sent.length, 1);
assert.equal(sent[0].url, "https://api.resend.com/emails");
assert.equal(sent[0].init.headers.Authorization, "Bearer re_test_dummy");
const mail = JSON.parse(sent[0].init.body);
assert.deepEqual(mail.to, ["vishva@resilientprivacy.com"]);
assert.equal(mail.from, "Website <no-reply@resilientprivacy.com>");
assert.equal(mail.reply_to, "ann@acme.com");
assert.equal(mail.subject, "Website Inquiry from AnnBcc: x@evil.test");
assert.match(mail.text, /^Form: Website inquiry: AI security\nFull name: AnnBcc: x@evil.test\nWork email: ann@acme.com\n/);
assert.ok(!("html" in mail));

// Demo form: same subject shape, form type in the body.
const demo = { form: "demo", name: "Bo", email: "bo@acme.com", company: "Acme", size: "1–50", interest: "All of it", agree: true };
assert.equal((await post(demo)).status, 200);
const dm = JSON.parse(sent[1].init.body);
assert.equal(dm.subject, "Website Inquiry from Bo");
assert.equal(dm.reply_to, "bo@acme.com");
assert.match(dm.text, /^Form: Demo request\n/);

// Resend failure: generic 502, no internal detail.
globalThis.fetch = async () => new Response("boom", { status: 500 });
const orig = console.error; console.error = () => {};
assert.deepEqual(await post(ok), { status: 502, body: { ok: false, error: "We couldn't send your message." } });
console.error = orig;

// Rate limit: 5 per 10 minutes per IP, the 6th gets 429.
for (let i = 0; i < 5; i++) assert.notEqual((await post({ ...ok, website: "x" }, { ip: "9.9.9.9" })).status, 429);
const lim = await POST(req(ok, { ip: "9.9.9.9" }));
assert.equal(lim.status, 429);
assert.equal(lim.headers.get("retry-after"), "600");
console.log("inquiry route self-check: ok");
