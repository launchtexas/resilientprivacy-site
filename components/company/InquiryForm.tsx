"use client";
// No backend: a valid form opens the visitor's email app with a prefilled message to CONTACT.email.
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONTACT } from "@/lib/nav";
import { maxLen, mailtoHref, validate, type Field } from "./inquiry";

const INPUT =
  "w-full rounded-control bg-canvas px-3.5 text-[0.9375rem] text-navy-950 shadow-hairline outline-none transition-shadow duration-(--duration-fast) placeholder:text-navy-500 focus:shadow-[0_0_0_2px_var(--color-accent)] aria-invalid:shadow-[0_0_0_2px_var(--color-critical)]";

export function InquiryForm({ fields, subject, submitLabel }: { fields: Field[]; subject: string; submitLabel: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Preselect a select option from the URL, e.g. /contact?topic=ai picks the option containing the word "AI".
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    for (const f of fields) {
      const want = q.get(f.name)?.toLowerCase();
      const match = want && f.options?.find((o) => o.toLowerCase().split(/[^a-z0-9]+/).includes(want));
      const el = formRef.current?.elements.namedItem(f.name);
      if (match && el instanceof HTMLSelectElement) el.value = match;
    }
  }, [fields]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (data.website) return; // honeypot: only bots fill the hidden field
    const errs = validate(fields, data);
    // Clickwrap: affirmative assent to the Terms is required before anything is sent.
    if (!data.agree) errs.agree = "Check the box to agree to the Terms of Use before sending.";
    setErrors(errs);
    const first = [...fields.map((f) => f.name), "agree"].find((n) => errs[n]);
    if (first) {
      setSent(false);
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    // Cool-down so repeated clicks don't open a pile of email drafts.
    setBusy(true);
    setTimeout(() => setBusy(false), 5000);
    window.location.href = mailtoHref(CONTACT.email, subject, fields, data);
    setSent(true);
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {fields.map((f) => {
        const id = `f-${f.name}`;
        const err = errors[f.name];
        const common = {
          id,
          name: f.name,
          autoComplete: f.autoComplete,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? `${id}-err` : undefined,
          "aria-required": f.required || undefined,
          required: f.required,
        };
        const wide = f.type === "textarea" || f.type === "select";
        return (
          <div key={f.name} className={wide ? "sm:col-span-2" : undefined}>
            <label htmlFor={id} className="text-sm font-medium text-navy-900">
              {f.label} {f.required ? <span aria-hidden className="text-critical-ink">*</span> : <span className="font-normal text-navy-500">(optional)</span>}
            </label>
            <div className="mt-1.5">
              {f.type === "textarea" ? (
                <textarea {...common} rows={5} maxLength={maxLen(f)} className={`${INPUT} py-3`} />
              ) : f.type === "select" ? (
                <select {...common} defaultValue="" className={`${INPUT} h-11`}>
                  <option value="" disabled>Choose one</option>
                  {f.options!.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input {...common} type={f.type ?? "text"} maxLength={maxLen(f)} className={`${INPUT} h-11`} />
              )}
            </div>
            {err && <p id={`${id}-err`} className="mt-1.5 text-sm text-critical-ink">{err}</p>}
          </div>
        );
      })}
      {/* Honeypot: hidden from people and screen readers; a filled value means a bot. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-navy-700">
          <div className="flex items-start gap-2.5">
            <input id="f-agree" name="agree" type="checkbox" aria-required aria-invalid={errors.agree ? true : undefined} aria-describedby={errors.agree ? "f-agree-err" : undefined} className="mt-0.5 size-5 shrink-0 accent-accent" />
            <label htmlFor="f-agree">
              I agree to the <a href="/legal/terms" className="underline hover:text-accent">Terms of Use</a> and have read the <a href="/legal/privacy" className="underline hover:text-accent">Privacy Policy</a>. <span aria-hidden className="text-critical-ink">*</span>
            </label>
          </div>
          {errors.agree && <p id="f-agree-err" className="mt-1.5 text-critical-ink">{errors.agree}</p>}
          <p className="mt-2 text-navy-500">Opens your email app with the message filled in. Nothing is stored on this site.</p>
        </div>
        <button type="submit" disabled={busy} className="inline-flex disabled:opacity-60 h-12 shrink-0 items-center justify-center rounded-full bg-accent px-6 font-medium text-white transition-colors duration-(--duration-fast) hover:bg-accent-hover">
          {submitLabel}
        </button>
      </div>
      <p role="status" aria-live="polite" className="text-sm text-ok-ink sm:col-span-2 empty:hidden">
        {sent ? `Your email app should open now. If it doesn't, write to ${CONTACT.email}.` : ""}
      </p>
    </form>
  );
}

export type { Field };
