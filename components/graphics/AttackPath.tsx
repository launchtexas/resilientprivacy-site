import { Check, Chip, Cross, Frame, Swap } from "./kit";
import { Cursor } from "../motion";
import { cx } from "../ui";

const HOPS = [
  { name: "Internet", sub: "anonymous" },
  { name: "Exposed API", sub: "api.example.test /v1/export" },
  { name: "Leaked token", sub: "CI log · deploy-bot" },
  { name: "Admin role", sub: "iam: AdminAccess" },
  { name: "Customer DB", sub: "crown jewel · PII" },
];
const FIX = 6; // beat where the token is rotated
const CUT = 2; // the token hop (index) the fix lands on

/** Attack path drawn hop by hop across real assets to the customer DB, then the leaked token is rotated and the path closes. Plays once in view. */
export function AttackPath({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      title="exposure graph · example-prod"
      status={<Swap steps={[[<Chip key="s" tone="neutral">Scanning</Chip>, undefined, 5], [<Chip key="r" tone="critical" dot>Path reachable</Chip>, 5, FIX], [<Chip key="c" tone="ok"><Check className="size-3" />Path closed</Chip>, FIX]]} />}
      beats={[600, 1300, 2000, 2700, 3400, { at: 5000, click: "fix" }]}
      label="Attack path from the internet through an exposed API, a leaked token and an admin role to the customer database; rotating the token closes the path."
    >
      <ol className="space-y-2 p-3.5 @md:p-4">
        {HOPS.map((h, i) => {
          const hit = i + 1; // beat when the attacker reaches this hop
          const after = i > CUT; // hops the fix protects
          return (
            <li key={h.name} className="relative flex h-12 items-center gap-3 rounded-control bg-mist px-2.5">
              {i < HOPS.length - 1 && (
                <span className="absolute top-[38px] left-[23px] h-[28px] w-0.5 bg-line-strong">
                  <span data-at={hit + 1} data-until={i >= CUT ? FIX : undefined} className="rp-grow-y absolute inset-0 bg-critical" />
                </span>
              )}
              {i === CUT && (
                <span data-at={FIX} className="rp-pop absolute top-[44px] left-[16px] z-10 grid size-4 place-items-center rounded-full bg-ok text-white ring-2 ring-canvas"><Cross className="size-2.5" /></span>
              )}
              <span className="rp-stack size-7 shrink-0">
                <span className="rounded-full border-2 border-line-strong bg-canvas" />
                <span data-at={hit} data-until={after ? FIX : undefined} className="rp-pop rounded-full border-2 border-critical bg-critical-soft" />
                {i === CUT && <span data-at={FIX} className="rp-pop grid place-items-center rounded-full bg-ok text-white"><Check /></span>}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cx("block truncate text-[13px] font-semibold", i === HOPS.length - 1 ? "text-navy-950" : "text-navy-900")}>{h.name}</span>
                <span className="block truncate font-mono text-micro text-navy-500">{h.sub}</span>
              </span>
              {i === CUT && (
                <Swap
                  className="shrink-0"
                  steps={[
                    [<span key="f" data-target="fix" className="rounded-chip bg-accent px-2 py-1 text-[11px] font-semibold text-white">Rotate token</span>, 5, FIX],
                    [<Chip key="d" tone="ok"><Check className="size-3" />Rotated</Chip>, FIX],
                  ]}
                />
              )}
              {i === HOPS.length - 1 && (
                <Swap className="shrink-0" steps={[[<Chip key="r" tone="critical">Reachable</Chip>, 5, FIX], [<Chip key="s" tone="ok">Safe</Chip>, FIX]]} />
              )}
            </li>
          );
        })}
      </ol>
      <Cursor />
    </Frame>
  );
}
