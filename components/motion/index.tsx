// Motion primitives. Server components here; pointer/observer ones live in ./client. Rules: DESIGN.md › Motion.
import type { CSSProperties, ReactNode } from "react";
import { cx } from "../ui";
import { Live } from "./client";
import "./motion.css";

export { Live, Reveal, Stagger, CountUp, Spotlight, TabUnderline } from "./client";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Endless horizontal loop of `children` (logos, chips). Pauses on hover/focus and offscreen; wraps statically for reduced motion. */
export function Marquee({ children, duration = 40, gap = "3rem", label, className }: { children: ReactNode; duration?: number; gap?: string; label: string; className?: string }) {
  return (
    <Live role="region" aria-label={label} className={cx("rp-marquee", className)} style={{ "--dur": `${duration}s`, "--gap": gap } as Vars}>
      <div className="rp-marquee-track">
        <div className="rp-marquee-group">{children}</div>
        <div className="rp-marquee-group" aria-hidden>{children}</div>
      </div>
    </Live>
  );
}

/** Drifts up to 40px × `speed` against the scroll (CSS scroll timeline, zero JS). Decoration only. */
export function Parallax({ speed = 1, className, children }: { speed?: number; className?: string; children: ReactNode }) {
  return <div className={cx("rp-parallax", className)} style={{ "--speed": speed } as Vars}>{children}</div>;
}

/** A 1px border with a violet highlight travelling around it. `fill` is the inner background (a CSS color, default canvas). */
export function GradientBorder({ fill, className, children }: { fill?: string; className?: string; children: ReactNode }) {
  return <Live className={cx("rp-gborder rounded-card", className)} style={fill ? ({ "--rp-gb-fill": fill } as Vars) : undefined}>{children}</Live>;
}

export type TermLine = { text: string; tone?: "prompt" | "muted" | "accent" | "warn" | "plain"; pause?: number };
const TONE: Record<NonNullable<TermLine["tone"]>, string> = {
  prompt: "text-white",
  plain: "text-white/80",
  muted: "text-navy-300",
  accent: "text-accent-on-dark",
  warn: "text-high",
};

/** Dark terminal that types its lines once, in order, when scrolled into view. The first `start` lines are already there, so the box is never empty.
 *  Keep lines ≤ 40 characters so they fit at 375px. `card` slides in under the last line once typing ends. */
export function Terminal({ title = "zsh", lines, cps = 24, start = 0, label, card, className }: { title?: string; lines: TermLine[]; cps?: number; start?: number; label: string; card?: ReactNode; className?: string }) {
  let t = 300;
  const timed = lines.map((l, i) => {
    const d = t;
    if (i >= start) t += l.text.length * cps + (l.pause ?? 220);
    return { ...l, d };
  });
  return (
    <figure role="img" aria-label={label} className={cx("overflow-hidden rounded-panel bg-navy-950 shadow-window ring-1 ring-white/10", className)}>
      <div aria-hidden className="flex h-9 items-center gap-1.5 border-b border-white/10 px-4">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-3 font-mono text-micro text-navy-300">{title}</span>
      </div>
      <Live aria-hidden className="overflow-x-auto p-5 font-mono text-xs leading-6 sm:text-[0.8125rem]" style={{ "--cps": `${cps}ms` } as Vars}>
        {timed.map((l, i) => (
          <span key={i} className={cx(i < start ? "block whitespace-pre" : "rp-type", TONE[l.tone ?? "plain"])} style={{ "--n": Math.max(1, l.text.length), "--d": `${l.d}ms` } as Vars}>
            {l.text}
          </span>
        ))}
        <span className="block text-white">
          ${" "}<span className="rp-caret" style={{ "--d": `${t}ms` } as Vars} />
        </span>
        {card && <div className="rp-term-card mt-3 w-fit" style={{ "--d": `${t + 200}ms` } as Vars}>{card}</div>}
      </Live>
    </figure>
  );
}

export { Scene, type Beat } from "./client";

/** Pointer for a <Scene>: the scene moves it to `[data-target]` elements on beats with `click`. Decorative. */
export function Cursor() {
  return (
    <svg data-cursor aria-hidden viewBox="0 0 20 22" className="rp-cursor">
      <path d="M2 1.5v16.2l4.3-3.9 2.9 6.6 3-1.3-2.9-6.5 5.9-.3z" fill="var(--color-navy-950)" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/** Staged page-load entrance: wrap hero pieces with i = 0, 1, 2… (110ms apart). Not for the h1. */
export function Enter({ i = 0, className, children }: { i?: number; className?: string; children: ReactNode }) {
  return <div className={cx("rp-enter", className)} style={{ "--i": i } as Vars}>{children}</div>;
}

/** Scroll-linked: the child rises 40px and scales from 96% as it enters the viewport. For product windows and section visuals. */
export function ScrollRise({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("rp-rise", className)}>{children}</div>;
}
