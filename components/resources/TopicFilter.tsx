"use client";
// Blog topic filter driven by ?topic=<id>. Cards are rendered on the server and passed in; this only picks which to show.
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { cx } from "@/components/ui";
import { TOPICS, type Topic } from "@/components/resources/data";

export type TopicItem = { key: string; topic: Topic; card: ReactNode; large: ReactNode };

const CHIP = "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors duration-(--duration-fast)";

/** Topic links; `active` null = "All". Usable from server components too (no hooks). */
export function TopicChips({ base, active, className }: { base: string; active: string | null; className?: string }) {
  const chips: (readonly [string | null, string])[] = [[null, "All"], ...TOPICS];
  return (
    <nav aria-label="Filter by topic" className={className}>
      <ul className="flex flex-wrap gap-2">
        {chips.map(([id, label]) => {
          const on = id === active;
          return (
            <li key={label}>
              <Link href={id ? `${base}?topic=${id}` : base} scroll={false} aria-current={on ? "page" : undefined} className={cx(CHIP, on ? "bg-navy-950 text-white" : "bg-canvas text-navy-700 shadow-hairline hover:text-navy-950 hover:shadow-card")}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Chips + grid for a given topic; the first match is shown large. Unknown topics show everything. */
export function TopicGrid({ items, base, topic }: { items: TopicItem[]; base: string; topic: string | null }) {
  const known = TOPICS.some(([id]) => id === topic) ? topic : null;
  const shown = known ? items.filter((i) => i.topic === known) : items;
  const label = TOPICS.find(([id]) => id === known)?.[1];
  return (
    <>
      <TopicChips base={base} active={known} />
      <p role="status" className="mt-4 text-sm text-navy-500">{label ? `${shown.length} ${shown.length === 1 ? "article" : "articles"} on ${label}` : `${shown.length} articles`}</p>
      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((i, n) => <li key={i.key} className={n === 0 ? "md:col-span-2 lg:col-span-3" : undefined}>{n === 0 ? i.large : i.card}</li>)}
      </ul>
    </>
  );
}

/** Reads ?topic from the URL. Wrap in <Suspense fallback={<TopicGrid … topic={null} />}> so the static HTML lists every article. */
export function TopicFilter({ items, base }: { items: TopicItem[]; base: string }) {
  return <TopicGrid items={items} base={base} topic={useSearchParams().get("topic")} />;
}

/** Opens the browser print dialog (save as PDF). */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-full bg-canvas px-4 text-sm font-medium text-navy-800 shadow-hairline transition-shadow duration-(--duration-fast) hover:shadow-card print:hidden">
      <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z" /></svg>
      Print or save as PDF
    </button>
  );
}
