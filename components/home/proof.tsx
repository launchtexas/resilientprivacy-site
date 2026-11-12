import Link from "next/link";
import { Arrow } from "@/components/ui";
import { CountUp, Reveal, Stagger } from "@/components/motion";
import { POSTS } from "@/components/resources/data";

/* Proof band under the hero. Founder details live on /company only (human, 2026-11-10). Facts only from board.md "Human facts 2026-11-09 (v6)"; no logos, no invented numbers. */
const FRAMEWORKS = ["NIST CSF 2.0", "ISO/IEC 27001", "OWASP", "MITRE ATLAS"];
const STATS: { value: number; prefix?: string; suffix: string; label: string }[] = [
  { value: 15, suffix: "+", label: "countries served remotely" },
  { value: 15, prefix: "< ", suffix: " min", label: "critical incident response" },
  { value: 24, suffix: "/7", label: "support from the USA and India" },
];

const lift = "transition duration-200 motion-safe:hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card";
const label = "font-mono text-micro tracking-[0.08em] text-navy-500 uppercase";

export function Proof() {
  const post = [...POSTS].sort((a, b) => b.date.localeCompare(a.date))[0];
  return (
    <section aria-labelledby="proof-title" className="border-y border-line bg-canvas py-10 lg:py-14">
      <h2 id="proof-title" className="sr-only">Why teams work with us</h2>
      <div className="container-rp grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="grid grid-cols-1 gap-4 lg:col-span-12">
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className={`rounded-card border border-line bg-canvas p-5 lg:p-6 ${lift}`}>
                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} className="block text-[2rem] leading-none font-semibold tracking-[-0.03em] text-navy-950 lg:text-[2.5rem]" />
                <p className="mt-2 text-sm text-navy-600">{s.label}</p>
              </div>
            ))}
          </Stagger>

          <Reveal delay={150} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-card border border-line bg-canvas p-5">
              <p className={label}>Frameworks we map to</p>
              <ul className="flex flex-wrap gap-2">
                {FRAMEWORKS.map((f) => <li key={f} className="rounded-chip bg-cloud px-2.5 py-1 text-sm font-medium text-navy-800">{f}</li>)}
              </ul>
              <Link href="/resources/trust" className="group mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">Trust center <Arrow /></Link>
            </div>
            <Link href={`/resources/blog/${post.slug}`} className={`group flex flex-col gap-2 rounded-card border border-line bg-canvas p-5 ${lift}`}>
              <span className={label}>Latest research</span>
              <span className="text-pretty font-semibold text-navy-950 group-hover:text-accent">{post.title}</span>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-accent">Read it <Arrow /></span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
