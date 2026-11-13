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

export function validate(fields: Field[], data: Record<string, string>) {
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

export function mailtoHref(to: string, subject: string, fields: Field[], data: Record<string, string>) {
  const topic = clean(data.topic, false, 120);
  if (topic) subject = `${subject}: ${topic}`; // routes the inbox by topic
  const body = fields.map((f) => `${f.label}: ${cleanField(f, data[f.name]) || "-"}`).join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(clean(subject, false, 200))}&body=${encodeURIComponent(body)}`;
}
