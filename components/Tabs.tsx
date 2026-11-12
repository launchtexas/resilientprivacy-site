"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "./ui";

export type TabItem = { label: string; icon?: ReactNode; content: ReactNode };

/** WAI-ARIA tabs: arrow keys / Home / End move focus and selection. */
const LIST = {
  pill: "flex gap-1 overflow-x-auto rounded-full bg-cloud p-1 [scrollbar-width:none]",
  strip: "grid grid-cols-2 gap-2 sm:flex sm:justify-center sm:gap-3",
};
const TAB = {
  pill: ["h-10 rounded-full px-4", "bg-canvas text-navy-950 shadow-card", "text-navy-600 hover:text-navy-950"],
  strip: ["h-12 justify-center rounded-control px-5 sm:min-w-44", "bg-navy-950 text-white shadow-pill", "bg-canvas text-navy-800 shadow-card hover:-translate-y-0.5 hover:shadow-lift"],
};

/** `variant="strip"`: large product-switcher buttons (homepage hero).
 *  `auto={ms}`: advance every ms with a progress bar on the active tab (motion users only). The bar is a CSS
 *  animation, so hover, focus and offscreen pause it for free; the first click or key stops it for good.
 *  Panels share one grid cell so switching never shifts the page. */
export function Tabs({ items, className, listClassName, panelClassName, variant = "pill", auto }: { items: TabItem[]; className?: string; listClassName?: string; panelClassName?: string; variant?: "pill" | "strip"; auto?: number }) {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const el = root.current;
    if (!auto || !el || !matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    setRunning(true);
    const io = new IntersectionObserver(([e]) => { el.toggleAttribute("data-off", !e.isIntersecting); });
    io.observe(el);
    return () => io.disconnect();
  }, [auto]);
  const pick = (i: number) => { setRunning(false); setActive(i); };

  const onKey = (e: KeyboardEvent) => {
    const last = items.length - 1;
    const next = { ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const i = next < 0 ? last : next > last ? 0 : next;
    pick(i);
    refs.current[i]?.focus();
  };

  return (
    <div ref={root} data-auto={running || undefined} style={auto ? { "--tab-ms": `${auto}ms` } as CSSProperties : undefined} className={cx(auto ? "rp-tabs" : undefined, className)}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={onKey}
        className={cx(LIST[variant], listClassName)}
      >
        {items.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            id={`${id}-t${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-p${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => pick(i)}
            className={cx(
              "relative inline-flex shrink-0 items-center gap-2 text-sm font-medium transition-[background-color,box-shadow,color,transform] duration-(--duration-fast) ease-(--ease-out)",
              TAB[variant][0],
              i === active ? TAB[variant][1] : TAB[variant][2],
            )}
          >
            {t.icon}
            {t.label}
            {running && i === active && <span aria-hidden className="rp-tabprog" onAnimationEnd={() => setActive((a) => (a + 1) % items.length)} />}
          </button>
        ))}
      </div>
      <div className={auto ? "rp-stack" : undefined}>
        {items.map((t, i) => (
          <div
            key={t.label}
            role="tabpanel"
            id={`${id}-p${i}`}
            aria-labelledby={`${id}-t${i}`}
            hidden={!auto && i !== active}
            inert={auto && i !== active ? true : undefined}
            tabIndex={i === active ? 0 : -1}
            className={cx("mt-8 focus-visible:outline-offset-4", auto && i !== active ? "invisible" : undefined, panelClassName)}
          >
            {t.content}
          </div>
        ))}
      </div>
    </div>
  );
}
