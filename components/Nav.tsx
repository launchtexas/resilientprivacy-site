"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CTA, NAV, type NavMenu } from "@/lib/nav";
import { Logo } from "./Logo";
import { Arrow, Button, cx } from "./ui";

const Chevron = ({ open }: { open: boolean }) => (
  <svg aria-hidden viewBox="0 0 10 10" className={cx("size-2.5 transition-transform duration-(--duration-fast)", open && "rotate-180")}>
    <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function MegaPanel({ menu, id }: { menu: NavMenu; id: string }) {
  return (
    <div id={id} className="absolute inset-x-0 top-full pt-3">
      <div className={cx("mx-auto grid grid-cols-[260px_1fr] overflow-hidden rounded-panel bg-canvas shadow-lift", menu.groups.length > 2 ? "max-w-[1120px]" : "max-w-[880px]")}>
        <div className="flex flex-col justify-between bg-mist p-6">
          <div>
            <p className="text-sm font-semibold text-navy-950">{menu.intro.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">{menu.intro.body}</p>
          </div>
          <Link href={menu.intro.cta.href} className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">
            {menu.intro.cta.label} <Arrow />
          </Link>
        </div>
        <div className={cx("grid gap-x-6 p-5", menu.groups.length > 2 ? "grid-cols-3" : menu.groups.length > 1 && "grid-cols-2")}>
          {menu.groups.map((g) => (
            <div key={g.title}>
              <p className="px-3 pt-1 pb-2 font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">{g.title}</p>
              <ul>
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block rounded-control px-3 py-2 transition-colors hover:bg-accent-soft/60">
                      <span className="block text-sm font-medium text-navy-950">{l.label}</span>
                      {l.desc && <span className="mt-0.5 block text-[0.8125rem] text-navy-500">{l.desc}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Nav() {
  const [open, setOpen] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => { setOpen(null); setMobile(false); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(null); setMobile(false); } };
    const onClick = (e: MouseEvent) => { if (!navRef.current?.contains(e.target as Node)) setOpen(null); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => { document.body.style.overflow = mobile ? "hidden" : ""; }, [mobile]);

  // Small hover delay so diagonal mouse travel into the panel doesn't close it.
  const hover = (i: number | null) => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(i), i === null ? 140 : 60); };

  return (
    <header className={cx("sticky top-0 z-50 print:hidden transition-colors duration-(--duration-base)", mobile ? "bg-canvas shadow-[0_1px_0_var(--color-line)]" : scrolled ? "bg-canvas/85 backdrop-blur-md shadow-[0_1px_0_var(--color-line)]" : "bg-transparent")}>
      {/* No backdrop-filter while the phone menu is open: it makes the header the containing block for the fixed #mobile-menu (0px tall). */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded-control focus:bg-canvas focus:px-3 focus:py-2 focus:shadow-lift">Skip to content</a>
      <nav ref={navRef} aria-label="Main" className="container-rp relative flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        {/* shrink-0 + nowrap: the wordmark must never wrap when the pill gets tight */}
        <div className="shrink-0 whitespace-nowrap"><Logo /></div>

        {/* Desktop pill */}
        <ul className="hidden items-center gap-0.5 rounded-full bg-navy-950 p-1 shadow-pill xl:flex" onMouseLeave={() => hover(null)}>
          {NAV.map((m, i) => (
            <li key={m.label} onMouseEnter={() => hover(i)}>
              <button
                type="button"
                aria-expanded={open === i}
                aria-controls={`mega-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                className={cx(
                  "inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full px-3 text-sm 2xl:px-4 font-medium transition-colors duration-(--duration-fast)",
                  open === i ? "bg-white/15 text-white" : "text-navy-300 hover:bg-white/10 hover:text-white",
                )}
              >
                {m.label}
                <Chevron open={open === i} />
              </button>
              {open === i && <MegaPanel menu={m} id={`mega-${i}`} />}
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 items-center gap-2 whitespace-nowrap xl:flex">
          <Button href={CTA.demo.href} variant="ghost" size="sm">{CTA.demo.label}</Button>
          <Button href={CTA.expert.href} size="sm">{CTA.expert.label}</Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-navy-900 hover:bg-cloud xl:hidden"
          aria-expanded={mobile}
          aria-controls="mobile-menu"
          aria-label={mobile ? "Close menu" : "Open menu"}
          onClick={() => setMobile(!mobile)}
        >
          <svg aria-hidden viewBox="0 0 20 20" className="size-5">
            {mobile
              ? <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              : <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />}
          </svg>
        </button>
      </nav>

      {mobile && (
        <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-canvas lg:top-[72px] xl:hidden" onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setMobile(false); }}>
          <div className="container-rp py-4">
            {NAV.map((m) => (
              <details key={m.label} className="group border-b border-line">
                <summary className="flex h-14 cursor-pointer list-none items-center justify-between text-base font-medium text-navy-950 [&::-webkit-details-marker]:hidden">
                  {m.label}
                  <svg aria-hidden viewBox="0 0 10 10" className="size-3 transition-transform group-open:rotate-180">
                    <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </summary>
                <div className="pb-4">
                  <Link href={m.intro.cta.href} className="mb-2 block rounded-control bg-mist px-3 py-2.5 text-sm font-medium text-accent">{m.intro.cta.label}</Link>
                  {m.groups.flatMap((g) => g.links).map((l) => (
                    <Link key={l.href} href={l.href} className="block rounded-control px-3 py-2.5 text-[0.9375rem] text-navy-700 hover:bg-cloud">{l.label}</Link>
                  ))}
                </div>
              </details>
            ))}
            <div className="mt-6 grid gap-3">
              <Button href={CTA.expert.href} size="lg">{CTA.expert.label}</Button>
              <Button href={CTA.demo.href} variant="secondary" size="lg">{CTA.demo.label}</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
