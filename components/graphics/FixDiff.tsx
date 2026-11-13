import { Check, Chip, Frame, Swap, lag } from "./kit";

// [marker, code]. Lines stay ≤ 40 characters so they fit a 343px frame at 11px mono.
const LINES: [" " | "-" | "+", string][] = [
  [" ", "async get(id, user) {"],
  ["-", "  return db.invoice.find({ id });"],
  ["+", "  const inv = await db.invoice"],
  ["+", "    .find({ id });"],
  ["+", "  if (inv?.tenant !== user.tenant)"],
  ["+", "    throw new Forbidden();"],
  ["+", "  return inv;"],
  [" ", "}"],
];

/** The fix for a finding as a code diff: the vulnerable line is flagged, the tenant check is added, the retest passes. Plays once in view. */
export function FixDiff({ className }: { className?: string }) {
  let add = 0;
  return (
    <Frame
      className={className}
      title="example-corp/billing · PR #418 · invoices/service.ts"
      status={<Swap steps={[[<Chip key="o" tone="critical" dot>RP-0142 open</Chip>, undefined, 3], [<Chip key="c" tone="ok"><Check className="size-3" />Retest passed</Chip>, 3]]} />}
      beats={[600, 1600, 3600]}
      label="Code diff fixing an insecure direct object reference: the line that returned any tenant's invoice is replaced by a tenant check that throws Forbidden, and the retest passes."
    >
      <pre className="overflow-hidden py-3 font-mono text-[11px] leading-[1.6rem] @md:text-xs">
        {LINES.map(([m, code], i) => {
          const isAdd = m === "+";
          const at = m === "-" ? 1 : isAdd ? 2 : undefined;
          const style = isAdd ? lag(add++ * 140) : undefined;
          return (
            <span key={i} className="relative block px-3.5">
              {m !== " " && <span data-at={at} style={style} className={`rp-grow-x absolute inset-0 ${m === "-" ? "bg-critical-soft" : "bg-ok-soft"}`} />}
              <span data-at={isAdd ? 2 : undefined} style={style} className={`relative ${m === "-" ? "text-critical-ink" : isAdd ? "text-ok-ink" : "text-navy-700"}`}>
                <span className="inline-block w-4 select-none opacity-70">{m}</span>{code}
              </span>
            </span>
          );
        })}
      </pre>
      <div className="flex items-center justify-between gap-2 border-t border-line px-3.5 py-2.5">
        <span className="min-w-0 truncate font-mono text-micro text-navy-500">retest 2026-10-21 · GET /v2/invoices/981 (tenant B)</span>
        <Swap className="shrink-0" steps={[[<Chip key="a">200 · leaked</Chip>, undefined, 3], [<Chip key="b" tone="ok">403 · blocked</Chip>, 3]]} />
      </div>
    </Frame>
  );
}
