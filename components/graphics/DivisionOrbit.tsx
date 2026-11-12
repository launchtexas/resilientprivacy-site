import { Check, Chip, Frame, Swap } from "./kit";
import { cx } from "../ui";

// Consulting and AI Security lead; Managed and Platform support. [name, task, beat it starts, beat it settles, settled label]
const ROWS = [
  ["Consulting", "Pentest finds the token leak", 1, 2, "Done"],
  ["AI Security", "Red team on the support bot", 2, 3, "Done"],
  ["Managed SOC/NOC", "Watches the fixed systems", 3, 4, "Monitoring"],
  ["Platform", "Maps evidence to SOC 2", 4, 5, "Reporting"],
] as const;

/** One engagement handed across the four practices under one named lead: each row goes Queued → Active → Done/Ongoing. Plays once in view. */
export function DivisionOrbit({ core = "One accountable team", className }: { core?: string; className?: string }) {
  return (
    <Frame
      className={cx("mx-auto max-w-md", className)}
      title="engagement · your-org"
      status={<Chip tone="accent">{core}</Chip>}
      beats={[500, 1700, 2900, 4100, 5300]}
      label={`${core}: one engagement passes from Consulting to AI Security, then Managed SOC/NOC monitors and Platform maps the evidence.`}
    >
      <ol className="space-y-2 p-3.5 @md:p-4">
        {ROWS.map(([name, task, on, off, end], i) => (
          <li key={name} className="relative flex h-14 items-center gap-3 rounded-control bg-mist px-2.5">
            {i < ROWS.length - 1 && (
              <span className="absolute top-[44px] left-[25px] h-[20px] w-0.5 bg-line-strong">
                <span data-at={off} className="rp-grow-y absolute inset-0 bg-accent" />
              </span>
            )}
            <span className={cx("grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold", i < 2 ? "bg-accent text-white" : "bg-canvas text-navy-950 ring-1 ring-line-strong")}>
              {name.slice(0, 2).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="truncate text-[13px] font-semibold text-navy-950">{name}</span>
                <span className="shrink-0 font-mono text-micro text-navy-500">{i < 2 ? "lead" : "support"}</span>
              </span>
              <span className="block truncate text-xs text-navy-600">{task}</span>
            </span>
            <Swap
              className="shrink-0"
              steps={[
                [<Chip key="q">Queued</Chip>, undefined, on],
                [<Chip key="a" tone="accent" dot>Active</Chip>, on, off],
                [<Chip key="d" tone="ok">{end === "Done" && <Check className="size-3" />}{end}</Chip>, off],
              ]}
            />
          </li>
        ))}
      </ol>
    </Frame>
  );
}
