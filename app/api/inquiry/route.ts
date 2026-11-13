// POST /api/inquiry: validates a contact/demo form and emails it to the inbox through Resend.
// The only server code on the site; every page stays static. Other methods get Next's automatic 405.
import { FORMS, compose, validate, clean, type FormId } from "../../../components/company/inquiry.ts";

const MAX_BODY = 16 * 1024;
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
// shortcut: per-instance memory, move to Upstash/Vercel KV when deployed at scale
const hits = new Map<string, number[]>();

const json = (status: number, body: object, headers?: HeadersInit) => Response.json(body, { status, headers });
const fail = (status: number, error: string, headers?: HeadersInit) => json(status, { ok: false, error }, headers);

function sameOrigin(req: Request) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const from = req.headers.get("origin") ?? req.headers.get("referer");
  if (!host || !from) return false;
  try {
    return new URL(from).host === host;
  } catch {
    return false;
  }
}

function limited(ip: string, now = Date.now()) {
  if (hits.size > 10_000) hits.clear(); // bounded memory under a flood
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail(403, "Request not allowed.");
  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return fail(415, "Send JSON.");
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return fail(413, "Message too large.");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  if (limited(ip)) return fail(429, "Too many messages. Try again in a few minutes.", { "Retry-After": "600" });

  let data: Record<string, unknown>;
  try {
    const text = await req.text();
    if (new TextEncoder().encode(text).length > MAX_BODY) return fail(413, "Message too large.");
    data = JSON.parse(text);
    if (!data || typeof data !== "object" || Array.isArray(data)) throw 0;
  } catch {
    return fail(400, "Invalid request.");
  }

  if (data.website) return json(200, { ok: true }); // honeypot: pretend success, send nothing

  if (typeof data.form !== "string" || !Object.hasOwn(FORMS, data.form)) return fail(400, "Invalid request.");
  const form = FORMS[data.form as FormId];
  if (form.fields.some((f) => data[f.name] != null && typeof data[f.name] !== "string")) return fail(400, "Invalid request.");
  if (data.agree !== true || Object.keys(validate(form.fields, data)).length) return fail(400, "Check the form and try again.");

  const key = process.env.RESEND_API_KEY;
  if (!key) return json(503, { ok: false, fallback: "mailto" }); // Resend not set up yet: the client opens the email app

  const { subject, body } = compose(form.subject, form.fields, data);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.INQUIRY_FROM || "Website <no-reply@resilientprivacy.com>",
        to: [process.env.INQUIRY_TO || "info@resilientprivacy.com"],
        reply_to: clean(data.email, false, 254),
        subject,
        text: body,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}`);
  } catch (e) {
    console.error("inquiry: send failed", e instanceof Error ? e.message : "unknown"); // no input or key in logs
    return fail(502, "We couldn't send your message.");
  }
  return json(200, { ok: true });
}
