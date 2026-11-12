// Console mockups for the Managed Services pages. All data is illustrative.
import { Badge, cx, type Tone } from "@/components/ui";
import { AppSidebar, AppWindow, AreaChart, DataTable, Legend, Panel, Progress, SeverityBars, StatTile } from "@/components/mockup";

const SIDEBAR = ["Overview", "Cases", "Detections", "Hunts", "Network", "Reports", "Playbooks"];

const Live = ({ children = "Live" }: { children?: string }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-micro font-medium text-navy-700 shadow-card">
    <span className="pulse-dot size-1.5 rounded-full bg-accent" /> {children}
  </span>
);

function Header({ title, sub, right }: { title: string; sub: string; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div>
        <p className="text-sm font-semibold text-navy-950">{title}</p>
        <p className="text-xs text-navy-500">{sub}</p>
      </div>
      {right}
    </div>
  );
}

function Timeline({ items }: { items: [time: string, event: string, who: string][] }) {
  return (
    <ol className="relative space-y-3 border-l border-line pl-4">
      {items.map(([t, e, s]) => (
        <li key={t + e} className="relative">
          <span className="absolute top-1.5 -left-[21px] size-2 rounded-full bg-accent ring-4 ring-canvas" />
          <p className="text-[0.8125rem] font-medium text-navy-950">{e}</p>
          <p className="font-mono text-micro text-navy-500">{t} · {s}</p>
        </li>
      ))}
    </ol>
  );
}

const sev = (tone: Tone, label: string) => <Badge tone={tone} dot>{label}</Badge>;
const mono = (s: string) => <span className="font-mono text-xs">{s}</span>;

/* ---------- Hub: unified case queue across SOC, MDR and NOC ---------- */
export function OpsConsole() {
  return (
    <AppWindow
      title="ops.resilientprivacy.com/queue"
      label="Managed operations console with open cases, response time, uptime and a shared case queue across SOC, MDR and NOC."
      sidebar={<AppSidebar items={SIDEBAR} active={1} />}
    >
      <div className="bg-mist p-4 sm:p-5">
        <Header title="Case queue" sub="All services · Your company · last 24 hours" right={<Live>Analysts on shift: 6</Live>} />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile label="Open cases" value="14" delta="−5 since 08:00" good spark={[22, 21, 19, 18, 17, 15, 14]} />
          <StatTile label="Median time to triage" value="6m" delta="−2m vs last week" good spark={[11, 10, 9, 9, 8, 7, 6]} />
          <StatTile label="Contained today" value="3" delta="0 open criticals" good className="hidden sm:block" />
          <StatTile label="Network uptime" value="99.98%" delta="1 site degraded" className="hidden lg:block" />
        </div>
        <Panel title="Active cases" action={<span className="text-micro font-medium text-accent">View all</span>} className="mt-3">
          <DataTable
            className="-mx-3"
            columns={["Case", "Summary", "Service", "Severity", "Status"]}
            rows={[
              [mono("CASE-8812"), "Ransomware precursor on FIN-LT-044", "MDR", sev("critical", "Critical"), sev("ok", "Contained")],
              [mono("CASE-8810"), "OAuth app granted mail.read to all users", "SOC", sev("high", "High"), sev("accent", "Investigating")],
              [mono("CASE-8807"), "Core switch packet loss 4% · DAL-02", "NOC", sev("medium", "Medium"), sev("neutral", "Monitoring")],
              [mono("CASE-8803"), "Password spray on VPN gateway", "SOC", sev("high", "High"), sev("ok", "Blocked")],
            ]}
          />
        </Panel>
      </div>
    </AppWindow>
  );
}

/* ---------- MDR: one incident, end to end ---------- */
export function MdrConsole() {
  return (
    <AppWindow
      title="ops.resilientprivacy.com/cases/CASE-8812"
      label="MDR incident view: a ransomware precursor contained in minutes, with timeline, response actions and affected assets."
      sidebar={<AppSidebar items={SIDEBAR} active={1} />}
    >
      <div className="bg-mist p-4 sm:p-5">
        <Header title="CASE-8812 · Ransomware precursor on FIN-LT-044" sub="Opened 02:14 · lead analyst M. Osei" right={<Badge tone="ok" dot>Contained</Badge>} />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          <Panel title="Timeline" className="lg:col-span-3">
            <Timeline items={[
              ["02:14", "EDR: credential dumping tool on FIN-LT-044", "Detection"],
              ["02:17", "Analyst confirms malicious, pages on-call", "Triage"],
              ["02:19", "Host isolated from network", "Response · pre-approved"],
              ["02:22", "User sessions revoked, password reset forced", "Response · pre-approved"],
              ["02:41", "Customer notified with summary and next steps", "Escalation"],
            ]} />
          </Panel>
          <div className="grid grid-cols-1 gap-3 lg:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Detect → contain" value="8m" />
              <StatTile label="Hosts affected" value="1" />
            </div>
            <Panel title="Actions taken">
              <ul className="space-y-2 text-[0.8125rem]">
                {["Isolate host", "Revoke sessions", "Block hash in EDR", "Disable account"].map((a, i) => (
                  <li key={a} className="flex items-center justify-between gap-2">
                    <span className="text-navy-800">{a}</span>
                    {i < 3 ? sev("ok", "Done") : sev("neutral", "Awaiting you")}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

/* ---------- SOC: triage queue + detection tuning ---------- */
export function SocConsole() {
  return (
    <AppWindow
      title="ops.resilientprivacy.com/detections"
      label="Managed SOC console: alert volume after tuning, triage queue with time-to-acknowledge, and recently tuned detection rules."
      sidebar={<AppSidebar items={SIDEBAR} active={2} />}
    >
      <div className="bg-mist p-4 sm:p-5">
        <Header title="Detections and triage" sub="SIEM · EDR · identity · email" right={<Live>Shift B · 4 analysts</Live>} />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          <Panel title="Alerts needing a human" action={<Legend items={[["bg-accent", "After tuning"], ["bg-navy-300", "Before"]]} />} className="lg:col-span-3">
            <AreaChart data={[120, 104, 96, 80, 72, 61, 58, 50, 46, 44, 41, 38]} compare={[124, 128, 122, 130, 126, 132, 129, 135, 131, 128, 134, 130]} labels={["W1", "W3", "W5", "W7", "W9", "W12"]} />
          </Panel>
          <Panel title="Recently tuned" className="lg:col-span-2">
            <ul className="space-y-2.5 text-[0.8125rem]">
              {[["Impossible travel · VPN egress", "−71% noise"], ["PowerShell encoded command", "+2 sources"], ["Mailbox forwarding rule", "New rule"]].map(([r, c]) => (
                <li key={r} className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-navy-800">{r}</span>
                  <Badge tone="accent">{c}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Triage queue" className="lg:col-span-5">
            <DataTable
              className="-mx-3"
              columns={["Alert", "Source", "Severity", "Ack", "Owner"]}
              rows={[
                ["Mailbox rule forwards to external domain", "M365", sev("high", "High"), mono("3m"), "A. Khan"],
                ["Admin role assigned outside change window", "Entra ID", sev("high", "High"), mono("5m"), "R. Silva"],
                ["Beaconing to newly registered domain", "Firewall", sev("medium", "Medium"), mono("9m"), "A. Khan"],
                ["Disabled AV on build server", "EDR", sev("critical", "Critical"), mono("1m"), "L. Chen"],
              ]}
            />
          </Panel>
        </div>
      </div>
    </AppWindow>
  );
}

/* ---------- NOC: health, capacity, change ---------- */
export function NocConsole() {
  const sites: [string, "ok" | "medium" | "critical"][] = [
    ["NYC-01", "ok"], ["NYC-02", "ok"], ["DAL-01", "ok"], ["DAL-02", "medium"], ["LON-01", "ok"], ["FRA-01", "ok"],
    ["SGP-01", "ok"], ["SYD-01", "ok"], ["AWS-use1", "ok"], ["AWS-euw1", "ok"], ["Azure-weu", "ok"], ["SD-WAN hub", "ok"],
  ];
  const tone = { ok: "bg-ok", medium: "bg-medium", critical: "bg-critical" };
  return (
    <AppWindow
      title="ops.resilientprivacy.com/network"
      label="Managed NOC console: uptime, site health grid with one degraded site, latency trend and scheduled changes."
      sidebar={<AppSidebar items={SIDEBAR} active={4} />}
    >
      <div className="bg-mist p-4 sm:p-5">
        <Header title="Network health" sub="12 sites · 1,840 devices" right={<Live>NOC watching</Live>} />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile label="Uptime (30 days)" value="99.98%" delta="within target" good />
          <StatTile label="Devices patched" value="96%" delta="+4% this month" good />
          <StatTile label="Open tickets" value="7" delta="2 P2" className="hidden sm:block" />
          <StatTile label="Changes this week" value="5" delta="0 failed" good className="hidden lg:block" />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-5">
          <Panel title="Site health" action={<Legend items={[["bg-ok", "Healthy"], ["bg-medium", "Degraded"]]} />} className="lg:col-span-2">
            <ul className="grid grid-cols-3 gap-2">
              {sites.map(([s, t]) => (
                <li key={s} className="rounded-control bg-cloud px-2 py-1.5">
                  <span className={cx("mb-1 block h-1 rounded-full", tone[t])} />
                  <span className="block truncate font-mono text-micro text-navy-700">{s}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="WAN latency · DAL-02 (ms)" className="lg:col-span-3">
            <AreaChart data={[18, 19, 18, 20, 22, 21, 34, 48, 41, 30, 24, 21]} labels={["00:00", "06:00", "12:00", "18:00", "Now"]} />
          </Panel>
          <Panel title="Change calendar" className="lg:col-span-5">
            <DataTable
              className="-mx-3"
              columns={["Change", "Window", "Risk", "Status"]}
              rows={[
                [mono("CHG-2207"), "Firewall firmware · edge cluster", sev("medium", "Medium"), sev("neutral", "Sat 02:00")],
                [mono("CHG-2204"), "Replace optic · DAL-02 core", sev("high", "High"), sev("accent", "Approved")],
                [mono("CHG-2199"), "Monthly OS patching · 312 servers", sev("medium", "Medium"), sev("ok", "Done")],
              ]}
            />
          </Panel>
        </div>
      </div>
    </AppWindow>
  );
}

/* ---------- Incident response retainer + DFIR ---------- */
export function IrConsole() {
  const phases: [string, "done" | "now" | "next"][] = [["Scope", "done"], ["Contain", "done"], ["Investigate", "now"], ["Recover", "next"], ["Report", "next"]];
  return (
    <AppWindow
      title="ops.resilientprivacy.com/ir/ENG-0417"
      label="Incident response engagement view: phase tracker, retainer hours, evidence collected and next stakeholder update."
      sidebar={<AppSidebar items={["Overview", "Engagements", "Evidence", "Retainer", "IR plan", "Contacts"]} active={1} />}
    >
      <div className="bg-mist p-4 sm:p-5">
        <Header title="ENG-0417 · Business email compromise" sub="Declared Tue 09:02 · incident commander J. Park" right={<Badge tone="high" dot>Active</Badge>} />
        <ol className="mb-3 grid grid-cols-5 gap-1.5">
          {phases.map(([p, s]) => (
            <li key={p}>
              <span className={cx("block h-1.5 rounded-full", s === "done" ? "bg-accent" : s === "now" ? "bg-accent/40" : "bg-line-strong")} />
              <span className={cx("mt-1.5 block truncate text-micro", s === "next" ? "text-navy-500" : "font-medium text-navy-800")}>{p}</span>
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          <Panel title="Evidence collected" className="lg:col-span-3">
            <DataTable
              className="-mx-3"
              columns={["Source", "Item", "Hash verified"]}
              rows={[
                ["M365", "Unified audit log, 90 days", sev("ok", "Yes")],
                ["Entra ID", "Sign-in logs, 3 accounts", sev("ok", "Yes")],
                ["FIN-LT-021", "Memory image + triage package", sev("ok", "Yes")],
                ["Mail gateway", "Message traces, 412 items", sev("neutral", "Pending")],
              ]}
            />
          </Panel>
          <div className="grid grid-cols-1 gap-3 lg:col-span-2">
            <Panel title="Retainer hours">
              <p className="mb-2 text-2xl font-semibold tracking-[-0.02em] text-navy-950 tabular-nums">38 <span className="text-sm font-normal text-navy-500">of 120 used</span></p>
              <Progress value={32} />
            </Panel>
            <Panel title="Next update">
              <p className="text-[0.8125rem] text-navy-800">Stakeholder call with legal and insurer</p>
              <p className="mt-1 font-mono text-micro text-navy-500">Today 16:00 · bridge open</p>
            </Panel>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

/* ---------- Threat hunting: hypothesis board ---------- */
export function HuntConsole() {
  return (
    <AppWindow
      title="ops.resilientprivacy.com/hunts"
      label="Threat hunting board: hunts by hypothesis with technique, data searched and outcome, plus findings by week."
      sidebar={<AppSidebar items={SIDEBAR} active={3} />}
    >
      <div className="bg-mist p-4 sm:p-5">
        <Header title="Hunt board · Q4 cycle" sub="Hypotheses from current intel and your incident history" right={<Live>2 hunts running</Live>} />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          <Panel title="Hunts" className="lg:col-span-3">
            <DataTable
              className="-mx-3"
              columns={["Hypothesis", "Technique", "Outcome"]}
              rows={[
                ["Attackers persist through scheduled tasks on servers", mono("T1053"), sev("high", "2 findings")],
                ["Stolen tokens replayed from new ASNs", mono("T1550"), sev("accent", "Running")],
                ["Data staged in cloud storage before exfiltration", mono("T1074"), sev("ok", "Clean")],
                ["Living-off-the-land binaries on finance hosts", mono("T1218"), sev("accent", "Running")],
              ]}
            />
          </Panel>
          <Panel title="Findings by week" action={<Legend items={[["bg-critical", "Critical"], ["bg-high", "High"], ["bg-medium/70", "Medium"]]} />} className="lg:col-span-2">
            <SeverityBars rows={[[0, 2, 3], [1, 1, 4], [0, 3, 2], [0, 1, 3], [0, 2, 1], [0, 0, 2]]} labels={["W1", "W2", "W3", "W4", "W5", "W6"]} />
          </Panel>
        </div>
      </div>
    </AppWindow>
  );
}
