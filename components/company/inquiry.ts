// Pure inquiry-form logic, kept import-free so inquiry.check.mjs can run it in plain Node.

export type Field = { name: string; label: string; type?: "text" | "email" | "textarea" | "select"; required?: boolean; options?: string[]; autoComplete?: string };

export const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

export const maxLen = (f: Field) => (f.type === "textarea" ? 2000 : f.type === "email" ? 254 : f.name === "name" ? 100 : 120);

/** Trim, cap length, drop control characters; single-line values also lose CR/LF (no header injection in the mailto). */
export function clean(v: unknown, multiline = false, max = 2000) {
  const s = String(v ?? "").replace(multiline ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, "");
  return s.trim().slice(0, max).trim();
}

const cleanField = (f: Field, v: unknown) => clean(v, f.type === "textarea", maxLen(f));

export function validate(fields: Field[], data: Record<string, unknown>) {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const raw = String(data[f.name] ?? "").trim();
    const v = cleanField(f, raw);
    if (f.required && !v) errors[f.name] = `Enter your ${f.label.toLowerCase()}.`;
    else if (raw.length > maxLen(f)) errors[f.name] = `Keep this under ${maxLen(f).toLocaleString("en-US")} characters.`;
    else if (f.type === "email" && v && !EMAIL.test(v)) errors[f.name] = "Enter a valid email address, like name@company.com.";
    else if (f.type === "select" && v && !f.options?.includes(v)) errors[f.name] = "Choose one of the options.";
  }
  return errors;
}

/** Subject (topic appended, no CR/LF) and plain-text body; shared by the mailto fallback and the Resend email. */
export function compose(subject: string, fields: Field[], data: Record<string, unknown>) {
  const topic = clean(data.topic, false, 120);
  if (topic) subject = `${subject}: ${topic}`; // routes the inbox by topic
  const body = fields.map((f) => `${f.label}: ${cleanField(f, data[f.name]) || "-"}`).join("\n");
  return { subject: clean(subject, false, 200), body };
}

export function mailtoHref(to: string, subject: string, fields: Field[], data: Record<string, string>) {
  const m = compose(subject, fields, data);
  return `mailto:${to}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`;
}

// The forms the site has; the API route validates against these, never against fields the client sends.
const INTENTS = ["Talk to an expert", "Scope an engagement", "Ask a question"];
const TOPICS = ["Consulting & penetration testing", "AI security", "Managed SOC & NOC", "Security platform", "Risk & compliance (GRC)", "Partnerships", "Something else"];

export const FORMS = {
  contact: {
    subject: "Website inquiry",
    fields: [
      { name: "name", label: "Full name", required: true, autoComplete: "name" },
      { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email" },
      { name: "company", label: "Company", required: true, autoComplete: "organization" },
      { name: "phone", label: "Phone", autoComplete: "tel" },
      { name: "intent", label: "I'd like to", type: "select", required: true, options: INTENTS },
      { name: "topic", label: "Topic", type: "select", required: true, options: TOPICS },
      { name: "message", label: "Message", type: "textarea", required: true },
    ],
  },
  demo: {
    subject: "Demo request",
    fields: [
      { name: "name", label: "Full name", required: true, autoComplete: "name" },
      { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email" },
      { name: "company", label: "Company", required: true, autoComplete: "organization" },
      { name: "role", label: "Job title", autoComplete: "organization-title" },
      { name: "size", label: "Company size", type: "select", required: true, options: ["1–50", "51–200", "201–1,000", "1,001–5,000", "5,000+"] },
      { name: "interest", label: "Main interest", type: "select", required: true, options: ["Security platform", "Managed SOC & NOC", "Consulting & penetration testing", "Audit & GRC", "All of it"] },
      { name: "message", label: "What should we focus on?", type: "textarea" },
    ],
  },
} satisfies Record<string, { subject: string; fields: Field[] }>;

export type FormId = keyof typeof FORMS;
