import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/* ---------- Button ---------- */
type ButtonProps = {
  href: string;
  variant?: "primary" | "secondary" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
};
const BTN_VARIANT = {
  primary: "bg-accent text-white shadow-button hover:bg-accent-hover active:bg-accent-active",
  secondary: "bg-canvas text-navy-900 ring-1 ring-line-strong hover:bg-mist hover:ring-navy-300 active:bg-cloud",
  ghost: "text-navy-700 hover:text-navy-950 hover:bg-cloud active:bg-line",
  inverse: "bg-white text-navy-950 hover:bg-accent-soft active:bg-cloud",
};
const BTN_SIZE = { sm: "h-9 px-3.5 text-sm", md: "h-11 px-5 text-[0.9375rem]", lg: "h-12 px-6 text-base" };

export function Button({ href, variant = "primary", size = "md", children, className }: ButtonProps) {
  return (
    <Link
      href={href}
      className={cx(
        "group inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap",
        "transition-[background-color,box-shadow,color,transform] duration-(--duration-fast) ease-(--ease-out) active:translate-y-px",
        BTN_VARIANT[variant],
        BTN_SIZE[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export const Arrow = () => (
  <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className="transition-transform duration-(--duration-fast) group-hover:translate-x-0.5">
    <path d="M2 7h9M7.5 3.5 11 7l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- Badge ---------- */
const BADGE_TONE = {
  neutral: "bg-cloud text-navy-700",
  accent: "bg-accent-soft text-accent-ink",
  critical: "bg-critical-soft text-critical-ink",
  high: "bg-high-soft text-high-ink",
  medium: "bg-medium-soft text-medium-ink",
  ok: "bg-ok-soft text-ok-ink",
  dark: "bg-white/10 text-white",
};
export type Tone = keyof typeof BADGE_TONE;

export function Badge({ tone = "neutral", dot, children, className }: { tone?: Tone; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-chip px-2 py-0.5 text-xs font-medium whitespace-nowrap", BADGE_TONE[tone], className)}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/** Caption under illustrative mockups and charts (DESIGN.md "Honest gaps"). No visible [placeholder] tags. */
export const ILLUSTRATIVE = "Illustrative data";

/* ---------- Eyebrow (small label above a heading) ---------- */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("font-mono text-xs font-medium tracking-[0.08em] text-accent uppercase", className)}>{children}</p>
  );
}

/* ---------- Card ---------- */
export function Card({ className, interactive, ...rest }: ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cx(
        "rounded-card bg-canvas shadow-card",
        interactive && "transition-[box-shadow,transform] duration-(--duration-base) ease-(--ease-out) hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
      {...rest}
    />
  );
}

/* ---------- Section + heading ---------- */
// Layout rule: a 2-column copy + scene grid uses `items-start` with `lg:sticky lg:top-28` on the copy column (never items-center: copy floats mid-height).
export function Section({
  id,
  tone = "canvas",
  className,
  children,
  labelledBy,
}: {
  id?: string;
  tone?: "canvas" | "mist" | "navy";
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  const bg = { canvas: "bg-canvas", mist: "bg-mist", navy: "bg-navy-950 text-white" }[tone];
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx("section-y", bg, className)}>
      <div className="container-rp">{children}</div>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cx("reveal max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <h2 id={id} className="text-h2 font-semibold tracking-[-0.025em] text-balance">{title}</h2>
      {lead && <p className="mt-4 text-lead text-navy-600 text-pretty in-[.bg-navy-950]:text-navy-300">{lead}</p>}
    </div>
  );
}

/* ---------- Check list ---------- */
export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cx("space-y-2.5", className)}>
      {items.map((t) => (
        <li key={t} className="flex gap-2.5 text-[0.9375rem]">
          <svg aria-hidden viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-accent">
            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
