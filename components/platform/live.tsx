"use client";
// Live pieces of the /platform hub: a console whose feed keeps moving, and a tab panel wrapper that replays its scene.
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Badge, type Tone } from "@/components/ui";

// Illustrative events, alternating a new finding (+1 open incident, gets an owner) and a resolution (−1).
const POOL: { sev: Tone; title: string; meta: string; owner?: string }[] = [
  { sev: "critical", title: "Admin endpoint with no auth · CWE-306", meta: "APIWall · GET /v2/admin/users", owner: "API" },
  { sev: "ok", title: "Token replay contained", meta: "Detection · INC-2304 · T1550.004" },
  { sev: "high", title: "S3 ListBucket allowed to *", meta: "CloudGrade · arn:aws:s3:::prod-exports", owner: "Data" },
  { sev: "ok", title: "OAuth app with Mail.Read revoked · T1528", meta: "Detection · auto-contained" },
  { sev: "critical", title: "Exploitable path to prod-db-01", meta: "Exposure · CVE-2024-21762 on vpn.example.com", owner: "Infra" },
  { sev: "ok", title: "Access review evidence collected", meta: "Compliance · SOC 2 CC6.3 · ISO A.5.18" },
  { sev: "high", title: "Session cookie replayed from 198.51.100.9", meta: "Detection · INC-2304 · T1550.004", owner: "SOC" },
  { sev: "ok", title: "Deletion request completed", meta: "Privacy · DSR-1039" },
];
const LABEL: Partial<Record<Tone, string>> = { critical: "Critical", high: "High", ok: "Resolved" };
const ROWS = 4;

/** Hub hero console. Every 3.5 s on screen a new row slides in, the oldest fades out, ages tick and the incident
 *  count (`[data-open]` inside the server-rendered `tiles`) moves; 2 s after a finding lands it gets an owner.
 *  Server HTML and reduced motion show the first frame. */
export function HubConsole({ tiles }: { tiles: ReactNode }) {
  const [n, setN] = useState(0);
  const [assigned, setAssigned] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let seen = false, t: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; });
    io.observe(el);
    const id = setInterval(() => {
      if (!seen || document.hidden) return;
      setN((x) => x + 1);
      setAssigned(false);
      t = setTimeout(() => setAssigned(true), 2000);
    }, 3500);
    return () => { io.disconnect(); clearInterval(id); clearTimeout(t); };
  }, []);

  const at = (k: number) => POOL[(n + ROWS - k) % POOL.length]; // k = 0 is the newest
  const open = POOL.indexOf(at(0)) % 2 ? 8 : 9;
  useEffect(() => {
    const o = ref.current?.querySelector<HTMLElement>("[data-open]");
    if (!o || !n) return;
    o.textContent = String(open);
    o.animate([{ opacity: 0, translate: "0 -8px" }, { opacity: 1, translate: "0 0" }], { duration: 420, easing: "ease-out" });
  }, [n, open]);
  return (
    <div ref={ref} className="bg-mist p-4">
      {tiles}
      <div className="mt-3 rounded-card bg-canvas p-4 shadow-card">
        <p className="mb-1 text-[0.8125rem] font-semibold text-navy-950">Across the platform</p>
        <ul className="relative divide-y divide-line">
          {Array.from({ length: n ? ROWS + 1 : ROWS }, (_, k) => {
            const a = at(k), fresh = n > 0 && k === 0;
            return (
              <li key={n - k} className={k === ROWS ? "rp-feed-out" : fresh ? "rp-feed-in" : undefined}>
                <div className="flex min-h-0 items-start gap-3 overflow-hidden py-2.5">
                  <Badge tone={a.sev} dot className="mt-px w-[74px] justify-start">{LABEL[a.sev]}</Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.8125rem] font-medium text-navy-950">{a.title}</p>
                    <p className="truncate text-xs text-navy-500">{a.meta}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="font-mono text-micro text-navy-500">{fresh ? "now" : `${2 * k + 2}m`}</span>
                    {a.owner && (k > 0 || assigned) && <span className={`rounded-full bg-accent-soft px-1.5 text-[11px] leading-4 font-medium text-accent-ink${fresh ? " rp-pop-in" : ""}`}>{a.owner}</span>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Auto-tab panel mockup. `eager` (first tab) is server-rendered; the rest mount after hydration, which keeps
 *  /platform's HTML small (the section is below the fold, so the late mount shifts nothing on screen).
 *  Remounts each time its panel becomes active, so the <Scene> inside replays. */
export function TabMockup({ eager, children }: { eager?: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(eager ? 0 : -1);
  useEffect(() => {
    setK((x) => Math.max(x, 0));
    const panel = ref.current?.closest("[role=tabpanel]");
    if (!panel || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mo = new MutationObserver(() => {
      if (panel.hasAttribute("inert")) return;
      setK((x) => x + 1);
      // keep the active tab visible in the phone tab strip (horizontal only, never scrolls the page)
      const tab = document.getElementById(panel.getAttribute("aria-labelledby") ?? ""), list = tab?.parentElement;
      if (tab && list) list.scrollTo({ left: tab.offsetLeft - list.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
    });
    mo.observe(panel, { attributes: true, attributeFilter: ["inert"] });
    return () => mo.disconnect();
  }, []);
  return <div ref={ref}>{k >= 0 && <Fragment key={k}>{children}</Fragment>}</div>;
}

/** Product hero: if the bottom of the console was below the fold when its scene played, replay once when it scrolls in. */
export function ReplayAtEnd({ children }: { children: ReactNode }) {
  const end = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = end.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let first = true, wasHidden = false;
    const io = new IntersectionObserver(([e]) => {
      if (first) { first = false; wasHidden = !e.isIntersecting; return; }
      if (e.isIntersecting && wasHidden) { setK(1); io.disconnect(); }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <><Fragment key={k}>{children}</Fragment><div ref={end} aria-hidden /></>;
}
