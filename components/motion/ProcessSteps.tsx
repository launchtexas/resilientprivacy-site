"use client";
// Animated process rail (design-review-2 #1). Server HTML = every step lit, chips shown, rail full: that is the
// reduced-motion / no-JS frame. In view, steps light in turn (~1.8s each) twice, then rest on the last one.
// Hover/focus jumps to a step and pauses. State is written to data attributes, so React never re-renders.
import { useEffect, useRef, type CSSProperties } from "react";
import { cx } from "../ui";
import "./motion.css"; // ProcessSteps rules live at the end of motion.css (no extra stylesheet request)

/** [title, body, artefact chip?, duration label?] — the same tuple shape the page data files already use. */
export type Step = readonly [title: string, body: string, artefact?: string, when?: string];

const STEP_MS = 1800;
const RUNS = 2;

export function ProcessSteps({ steps, className }: { steps: readonly Step[]; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(el.children) as HTMLElement[];
    const n = items.length;
    let k = 0, ticks = 0, timer = 0, held = false, seen = false;
    const show = (a: number) => {
      k = a;
      items.forEach((li, i) => { li.dataset.st = i < a ? "done" : i === a ? "cur" : "todo"; });
    };
    const stop = () => { clearTimeout(timer); timer = 0; };
    const done = () => ticks >= RUNS * n - 1;
    const tick = () => {
      if (held || done()) return;
      timer = window.setTimeout(() => { ticks++; show((k + 1) % n); tick(); }, STEP_MS);
    };
    // dim nothing until first seen, so the page loads (and audits) with the finished frame
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return stop();
      if (!seen) { seen = true; el.dataset.on = ""; show(0); }
      if (!timer) tick();
    }, { threshold: 0.35 });
    io.observe(el);
    const enter = (e: Event) => {
      const li = (e.target as HTMLElement).closest<HTMLElement>(".rp-step");
      if (!li) return;
      held = true; stop(); show(items.indexOf(li));
    };
    const leave = (e: Event) => {
      // focus moving between steps, or pointer still inside: stay held
      const to = (e as FocusEvent).relatedTarget as Node | null;
      if (to && el.contains(to)) return;
      held = false;
      if (seen && !done()) tick();
    };
    el.addEventListener("pointerover", enter);
    el.addEventListener("focusin", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focusout", leave);
    return () => {
      io.disconnect(); stop();
      el.removeEventListener("pointerover", enter);
      el.removeEventListener("focusin", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focusout", leave);
    };
  }, []);
  return (
    <div className={cx("rp-steps-box", className)}>
      <ol ref={ref} className="rp-steps" style={{ "--n": steps.length } as CSSProperties}>
        {steps.map(([t, b, art, when], i) => (
          <li key={t} className="rp-step" tabIndex={0}>
            <span className="rp-step-num">{String(i + 1).padStart(2, "0")}</span>
            <div className="rp-step-card">
              {when && <p className="rp-step-when">{when}</p>}
              <h3 className="text-h3 font-semibold tracking-[-0.015em] text-navy-950">{t}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{b}</p>
              {art && <p className="rp-step-chip"><span className="sr-only">Output: </span>{art}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
