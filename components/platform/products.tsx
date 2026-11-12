// Platform product catalog: one entry per product page. Names are descriptive until RP supplies real ones (DESIGN.md).
import type { ReactNode } from "react";
import { Badge } from "@/components/ui";
import {
  AlertList, AppSidebar, AppWindow, AreaChart, DataTable, Legend, Panel, Progress, ScoreRing, SeverityBars, StatTile,
} from "@/components/mockup";
import {
  AttackGraph, ATTACK_PATH, CONTROLS, Donut, FlowChart, Gauge, INK, RiskHeatmap, RISK_MATRIX, SERIES, SEV, SOC_SPARKS, Sparklines, StackedBars, TrendChart,
} from "@/components/charts";
import { SocAlertStream } from "@/components/graphics";
import { Bars, type IconName } from "./kit";
import { Scene } from "@/components/motion";
import { Swap } from "@/components/graphics/kit";
import { FindingsJourney } from "@/components/graphics";

export type Capability = { label: string; title: string; body: string; points: string[]; outputs: [string, string][] };
export type Product = {
  slug: string;
  name: string;
  /** Descriptive category shown next to the brand name, e.g. "APIWall · API Protection". */
  kind: string;
  category: string;
  icon: IconName;
  summary: string;
  h1: string;
  lead: string;
  mockup: ReactNode;
  /** The animated charts that prove the product does its job (1-2), with the claim they back. */
  proof: { title: string; lead: string; charts: ReactNode[] };
  capabilities: Capability[];
  steps: [string, string, string?][]; // title, body, artefact chip
  integrations: string[];
  faqs: [string, string][];
  /** Consulting and managed services delivered with this product: [label, href, how]. */
  consulting: [string, string, string][];
};

const SIDEBAR = ["Overview", "APIs", "Privacy", "Detections", "Exposure", "Cloud", "Compliance", "Reports"];
const sidebar = (active: number) => <AppSidebar items={SIDEBAR} active={active} />;
const code = (s: string) => <code key={s} className="font-mono text-xs">{s}</code>;
const Head = ({ title, sub, right }: { title: string; sub: string; right?: ReactNode }) => (
  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
    <div>
      <p className="text-sm font-semibold text-navy-950">{title}</p>
      <p className="text-xs text-navy-500">{sub}</p>
    </div>
    {right}
  </div>
);
const Live = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-micro font-medium text-navy-700 shadow-card">
    <span className="pulse-dot size-1.5 rounded-full bg-accent" /> {children}
  </span>
);

/* ---------------------------------------------------------------- mockups */
const shieldMock = (
  <AppWindow title="app.resilientprivacy.com/apis" label="APIWall API inventory: endpoint, shadow API, sensitive endpoint and blocked request counts, attacks blocked by type, and a table of risky endpoints." sidebar={sidebar(1)}>
    <Scene beats={[900, 2600, 3400]} className="bg-mist p-4 sm:p-5">
      <Head title="API inventory" sub="14 gateways · 3 clusters · last 24h" right={<Live>Inline protection on</Live>} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Endpoints" value="1,284" delta="+36 discovered" good spark={[1180, 1200, 1210, 1236, 1250, 1270, 1284]} />
        <StatTile label="Shadow APIs" value={<Swap steps={[["23", undefined, 1], ["24", 1]]} />} delta={<Swap steps={[["+4 this week", undefined, 1], ["+5 this week", 1]]} />} />
        <StatTile label="Return sensitive data" value="312" delta="88 PII · 41 PCI" good className="hidden sm:block" />
        <StatTile label="Requests blocked" value={<Swap steps={[["18.2k", undefined, 3], ["18.3k", 3]]} />} delta="−12% vs yesterday" good className="hidden lg:block" />
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-5">
        <Panel title="Attacks blocked by type" className="lg:col-span-2">
          <Bars rows={[["BOLA / IDOR", 6420], ["Credential stuffing", 5110], ["Scraping bots", 3870], ["Injection", 1940], ["Mass assignment", 860]]} />
        </Panel>
        <Panel title="Endpoints at risk" action={<span className="text-micro font-medium text-accent">Export</span>} className="lg:col-span-3">
          <DataTable
            className="-mx-3"
            columns={["Endpoint", "Data", "Auth", "Risk"]}
            rowAt={[1]}
            rows={[
              [<span key="n" className="flex flex-col items-start gap-1">{code("GET /v1/users/export")}<Badge tone="medium">Shadow</Badge></span>, "PII", <Swap steps={[[<Badge key="x" tone="critical">None</Badge>, undefined, 2], [<Badge key="y" tone="ok">Blocked</Badge>, 2]]} />, <Progress key="p0" value={88} tone="bg-critical" />],
              [code("GET /v2/admin/users"), "PII", <Badge key="a" tone="critical">None</Badge>, <Progress key="p" value={94} tone="bg-critical" />],
              [code("GET /v1/orders/:id"), "PII", <Badge key="b" tone="high">API key</Badge>, <Progress key="p2" value={71} tone="bg-high" />],
              [code("POST /v1/payments"), "PCI", <Badge key="c" tone="ok">OAuth</Badge>, <Progress key="p3" value={38} tone="bg-medium" />],
              [code("GET /internal/health"), "None", <Badge key="d" tone="neutral">mTLS</Badge>, <Progress key="p4" value={8} tone="bg-ok" />],
            ]}
          />
        </Panel>
      </div>
    </Scene>
  </AppWindow>
);

const veilMock = (
  <AppWindow title="app.resilientprivacy.com/privacy" label="PrivacyFlow privacy dashboard: systems scanned, data categories, open requests and consent coverage, personal data by system, and a queue of data subject requests with due dates." sidebar={sidebar(2)}>
    <Scene beats={[1200, 2400, 3600]} className="bg-mist p-4 sm:p-5">
      <Head title="Data map" sub="46 systems · scanned 2h ago" right={<Badge tone="accent">GDPR · CCPA</Badge>} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Systems with personal data" value="46" delta="+2 found this week" />
        <StatTile label="Data categories" value="18" delta="3 special category" />
        <StatTile label="Open requests" value={<Swap steps={[["12", undefined, 3], ["11", 3]]} />} delta="1 due today" className="hidden sm:block" />
        <StatTile label="Consent coverage" value="97%" delta="+3 pts" good className="hidden lg:block" />
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Panel title="Personal records by system">
          <Bars rows={[["Salesforce", 82], ["Snowflake", 64], ["Zendesk", 41], ["HubSpot", 33], ["S3 · exports", 27]]} unit="k" />
        </Panel>
        <Panel title="Data subject requests" action={<span className="text-micro font-medium text-accent">View queue</span>}>
          <DataTable
            className="-mx-3"
            columns={["Request", "Type", "Systems", "Due"]}
            rows={[
              ["DSR-1039", "Deletion", "7", <Badge key="a" tone="critical">Today</Badge>],
              ["DSR-1042", "Access", "5", <Badge key="b" tone="medium">3 days</Badge>],
              ["DSR-1044", "Correction", "2", <Swap key="c" steps={[[<Badge key="c0" tone="medium">9 days</Badge>, undefined, 1], [<Badge key="c1" tone="accent">Running 1/2</Badge>, 1, 2], [<Badge key="c2" tone="accent">Running 2/2</Badge>, 2, 3], [<Badge key="c3" tone="ok">Done</Badge>, 3]]} />],
              ["DSR-1031", "Access", "6", <Badge key="d" tone="ok">Done</Badge>],
            ]}
          />
        </Panel>
      </div>
    </Scene>
  </AppWindow>
);

const sentinelMock = (
  <AppWindow title="app.resilientprivacy.com/detections" label="AlertRank detections: open incidents, response time, alerts suppressed and auto-contained counts, an alerts versus incidents trend, an AI incident summary and a ranked incident queue." sidebar={sidebar(3)}>
    <Scene beats={[1000, 2000, 3000]} className="bg-mist p-4 sm:p-5">
      <Head title="Detections" sub="Endpoint · identity · cloud · SaaS" right={<Live>Correlating</Live>} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Open incidents" value={<Swap steps={[["9", undefined, 3], ["8", 3]]} />} delta={<Swap steps={[["−5 vs yesterday", undefined, 3], ["−6 vs yesterday", 3]]} />} good spark={[16, 15, 13, 14, 12, 11, 9]} />
        <StatTile label="Mean time to respond" value="11m" delta="−3m" good spark={[18, 16, 17, 14, 13, 12, 11]} />
        <StatTile label="Alerts folded into incidents" value="97.5%" delta="12,480 raw today" good className="hidden sm:block" />
        <StatTile label="Auto-contained" value={<Swap steps={[["31", undefined, 3], ["32", 3]]} />} delta="by approved playbooks" good className="hidden lg:block" />
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-5">
        <Panel title="INC-2304 · Token theft" action={<Swap steps={[[<Badge key="i" tone="high" dot>Investigating</Badge>, undefined, 3], [<Badge key="c" tone="ok" dot>Contained</Badge>, 3]]} />} className="lg:col-span-2">
          <div className="rounded-control bg-accent-soft p-3 text-xs leading-relaxed text-accent-ink">
            <p className="mb-1 font-mono text-micro tracking-[0.08em] uppercase">Why this ranks first</p>
            A session token for a finance admin was replayed from a new country 4 minutes after a phishing click. The account can approve payments.
          </div>
          <ul className="mt-3 space-y-1.5 text-xs text-navy-700">
            <li><Swap steps={[["→ Revoke sessions and reset MFA", undefined, 1], [<span className="text-ok-ink">✓ Revoke sessions and reset MFA</span>, 1]]} /></li>
            <li><Swap steps={[["→ Block sender domain in mail gateway", undefined, 2], [<span className="text-ok-ink">✓ Block sender domain in mail gateway</span>, 2]]} /></li>
            <li><Swap steps={[["→ Hand off to SOC on-call", undefined, 3], [<span className="text-ok-ink">✓ Hand off to SOC on-call</span>, 3]]} /></li>
          </ul>
        </Panel>
        <Panel title="Incident queue" action={<Legend items={[["bg-accent", "Incidents"], ["bg-navy-300", "Raw alerts ÷100"]]} />} className="lg:col-span-3">
          <AreaChart className="mb-2" data={[6, 8, 7, 11, 9, 12, 9]} compare={[9, 10, 12, 13, 12, 14, 12]} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} />
          <AlertList
            alerts={[
              { sev: "critical", title: "Session token replayed from new country", meta: "Identity · finance-admin · 6 alerts", time: "4m" },
              { sev: "high", title: "Encoded PowerShell spawning from Excel", meta: "Endpoint · FIN-LT-044 · 9 alerts", time: "18m" },
              { sev: "ok", title: "OAuth app with mail.read revoked", meta: "SaaS · auto-contained", time: "1h" },
            ]}
          />
        </Panel>
      </div>
    </Scene>
  </AppWindow>
);

const atlasMock = (
  <AppWindow title="app.resilientprivacy.com/exposure" label="ReachMap exposure view: an exposure score, open findings by severity over six weeks, a validated attack path from the internet to a production database, and a ranked fix list." sidebar={sidebar(4)}>
    <Scene beats={[700, 1100, 1500, 1900, 4000]} className="bg-mist p-4 sm:p-5">
      <Head title="Exposure" sub="2,912 assets · 4 cloud accounts · 38 domains" right={<Badge tone="accent">Cycle 14 · validate</Badge>} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Panel title="Exposure score" className="flex flex-col">
          <div className="flex justify-center py-2"><ScoreRing value={78} label="of 100" /></div>
          <p className="text-center text-xs text-ok-ink">+9 in 30 days</p>
        </Panel>
        <Panel title="Open findings by week" action={<Legend items={[["bg-critical", "Critical"], ["bg-high", "High"], ["bg-medium/70", "Medium"]]} />} className="md:col-span-2">
          <SeverityBars rows={[[9, 22, 30], [8, 20, 31], [6, 18, 27], [5, 15, 26], [4, 12, 22], [3, 9, 19]]} labels={["W1", "W2", "W3", "W4", "W5", "W6"]} />
        </Panel>
        <Panel title="Validated attack path" action={<Swap steps={[[<Badge key="e" tone="critical">Exploitable</Badge>, undefined, 5], [<Badge key="f" tone="ok">Path closed</Badge>, 5]]} />} className="md:col-span-3">
          <ol className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center">
            {[["Internet", "entry"], ["vpn.example.com", "CVE, exploit public"], ["jump-01", "shared local admin"], ["prod-db", "customer PII"]].map(([n, d], i, a) => (
              <li key={n} data-at={i + 1} className="rp-slide flex items-center gap-2 sm:flex-1">
                <div className="relative flex-1 rounded-control bg-critical-soft px-3 py-2">
                  <span data-at="5" className="absolute inset-0 rounded-control bg-ok-soft" />
                  <p className="relative font-mono font-medium text-navy-950">{n}</p>
                  <p className="relative text-micro text-navy-500">{d}</p>
                </div>
                {i < a.length - 1 && <span aria-hidden className="text-navy-500 max-sm:hidden">→</span>}
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="Fix first" className="md:col-span-3">
          <DataTable
            className="-mx-3"
            columns={["Asset", "Issue", "Severity", "Owner"]}
            rows={[
              ["vpn.example.com", "Outdated SSL VPN, known exploit", <Swap steps={[[<Badge key="c" tone="critical">Critical</Badge>, undefined, 5], [<Badge key="c2" tone="ok">Fixed</Badge>, 5]]} />, "Infra"],
              ["staging-k8s", "Dashboard exposed without auth", <Badge key="h" tone="high">High</Badge>, "Platform"],
              ["prod-exports", "Public bucket listing", <Badge key="h2" tone="high">High</Badge>, "Data"],
            ]}
          />
        </Panel>
      </div>
    </Scene>
  </AppWindow>
);

const cloudMock = (
  <AppWindow title="app.resilientprivacy.com/cloud" label="Cloud posture view: misconfigurations, exposed workloads, risky identities and infrastructure-as-code findings, a per-account benchmark table, and pull-request fix suggestions." sidebar={sidebar(5)}>
    <Scene beats={[900, 2200, 3500]} className="bg-mist p-4 sm:p-5">
      <Head title="Cloud posture" sub="AWS · Azure · GCP · 212 accounts and projects" right={<Live>Scanning continuously</Live>} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Misconfigurations" value={<Swap steps={[["146", undefined, 3], ["145", 3]]} />} delta={<Swap steps={[["−31 this week", undefined, 3], ["−32 this week", 3]]} />} good spark={[220, 205, 198, 180, 171, 160, 146]} />
        <StatTile label="Internet-exposed workloads" value="12" delta="3 with critical CVEs" />
        <StatTile label="Over-privileged identities" value="57" delta="9 unused admin roles" className="hidden sm:block" />
        <StatTile label="IaC findings blocked" value="38" delta="before deploy" good className="hidden lg:block" />
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-5">
        <Panel title="Benchmark by account" className="lg:col-span-3">
          <DataTable
            className="-mx-3"
            columns={["Account", "Cloud", "Critical", "CIS benchmark"]}
            rows={[
              ["prod-core", "AWS", <Swap steps={[[<Badge key="a" tone="critical">4</Badge>, undefined, 3], [<Badge key="a2" tone="critical">3</Badge>, 3]]} />, <Progress key="p1" value={82} />],
              ["payments", "AWS", <Badge key="b" tone="high">2</Badge>, <Progress key="p2" value={88} />],
              ["data-lake", "GCP", <Badge key="c" tone="critical">3</Badge>, <Progress key="p3" value={71} />],
              ["corp-it", "Azure", <Badge key="d" tone="ok">0</Badge>, <Progress key="p4" value={94} />],
            ]}
          />
        </Panel>
        <Panel title="Suggested fixes" className="lg:col-span-2">
          <ul className="space-y-2.5 text-xs">
            {[["storage.tf:41", "Block public ACLs on prod-exports"], ["iam.tf:12", "Remove *:* from ci-deployer role"], ["gke.tf:88", "Enable private control plane"]].map(([f, t], i) => (
              <li key={f} data-at={i ? undefined : 1} className="rp-slide rounded-control bg-cloud p-2.5">
                <p className="font-mono text-micro text-navy-500">{f}</p>
                <p className="mt-0.5 font-medium text-navy-950">{t}</p>
                {i ? <p className="mt-1 text-micro font-medium text-accent">Open pull request →</p> : (
                  <Swap className="mt-1 text-micro font-medium" steps={[
                    [<span key="a" className="text-critical-ink">Flagged · bucket is public</span>, undefined, 2],
                    [<span key="b" className="text-accent">Fix pull request opened</span>, 2, 3],
                    [<span key="c" className="text-ok-ink">✓ Merged · remediated</span>, 3]]} />
                )}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Scene>
  </AppWindow>
);

const assureMock = (
  <AppWindow title="app.resilientprivacy.com/compliance" label="ComplyLoop compliance view: framework readiness, controls passing, evidence collected automatically, and a control table with evidence source and status." sidebar={sidebar(6)}>
    <Scene beats={[1200, 2800]} className="bg-mist p-4 sm:p-5">
      <Head title="Compliance" sub="Audit window opens in 41 days" right={<Badge tone="ok" dot>Trust center live</Badge>} />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <Panel title="Framework readiness" className="lg:col-span-2">
          <ul className="space-y-3.5">
            {[["SOC 2 Type II", 92], ["ISO 27001", 74], ["HIPAA", 61], ["DORA", 48]].map(([f, v]) => (
              <li key={f}>
                <div className="mb-1.5 flex justify-between text-xs"><span className="font-medium text-navy-950">{f}</span><span className="tabular-nums text-navy-500">{v}%</span></div>
                <div className="h-2 rounded-full bg-cloud"><div className="h-full rounded-full bg-accent" style={{ width: `${v}%` }} /></div>
              </li>
            ))}
          </ul>
        </Panel>
        <div className="grid grid-cols-2 gap-3 lg:col-span-3">
          <StatTile label="Controls passing" value={<Swap steps={[["184 / 201", undefined, 2], ["185 / 201", 2]]} />} delta={<Swap steps={[["+6 this week", undefined, 2], ["+7 this week", 2]]} />} good />
          <StatTile label="Evidence auto-collected" value={<Swap steps={[["1,932", undefined, 2], ["1,933", 2]]} />} delta="from 27 integrations" good />
          <Panel title="Controls needing attention" className="col-span-2">
            <DataTable
              className="-mx-3"
              columns={["Control", "Evidence from", "Status"]}
              rows={[
                ["Access reviews (CC6.2)", "Okta", <Swap key="a" steps={[[<Badge key="a0" tone="high" dot>Overdue</Badge>, undefined, 1], [<Badge key="a1" tone="accent" dot>Collecting</Badge>, 1, 2], [<Badge key="a2" tone="ok" dot>Passing</Badge>, 2]]} />],
                ["Encryption at rest (CC6.1)", "AWS", <Badge key="b" tone="ok" dot>Passing</Badge>],
                ["Vendor assessments (CC9.2)", "Manual", <Badge key="c" tone="medium" dot>Due in 9d</Badge>],
              ]}
            />
          </Panel>
        </div>
      </div>
    </Scene>
  </AppWindow>
);

/* ---------------------------------------------------------------- catalog */
export const PRODUCTS: Product[] = [
  {
    slug: "api-protection",
    name: "APIWall",
    kind: "API Protection",
    category: "API discovery and runtime defense",
    icon: "api",
    summary: "Discovers every API, including forgotten ones, scores the data they expose, and blocks abuse at runtime.",
    h1: "Every API found, tested and defended.",
    lead: "APIWall builds your API inventory from real traffic, shows which endpoints expose sensitive data, and stops abuse in line before it reaches your services.",
    mockup: shieldMock,
    proof: {
      title: "Blocking switched on. Attackers moved on.",
      lead: "Once blocking is enabled per endpoint, abuse stops paying off and the volume falls week after week.",
      charts: [
        <StackedBars key="b" title="Attacks blocked per week, by type" desc="Requests blocked at the edge, in hundreds per week, after blocking was enabled in week 1."
          keys={[{ label: "Credential stuffing", color: SERIES[0] }, { label: "Scraping", color: SERIES[1] }, { label: "BOLA attempts", color: SERIES[2] }]}
          groups={[{ label: "W1", values: [31, 12, 4] }, { label: "W2", values: [28, 14, 6] }, { label: "W3", values: [19, 10, 4] }, { label: "W4", values: [14, 7, 2] }, { label: "W5", values: [9, 5, 1] }, { label: "W6", values: [6, 3, 1] }]} />,
      ],
    },
    capabilities: [
      { label: "Discover", title: "An inventory that keeps itself current", body: "APIWall reads traffic from gateways, load balancers and clusters to list every endpoint, including the ones nobody documented.", points: ["Shadow and zombie API detection", "Spec drift against your OpenAPI files", "Owner and environment for every endpoint"], outputs: [["Live API inventory", "Security, engineering"], ["Spec drift report", "API owners"]] },
      { label: "Posture", title: "Know which endpoints matter", body: "Each endpoint is scored on the data it returns, how it authenticates and whether it is reachable from the internet.", points: ["PII, PCI and secrets detection in responses", "Missing or weak authentication flagged", "Risk score you can sort and assign"], outputs: [["Risk-ranked endpoint list", "CISO, VP Eng"], ["Sensitive data flow map", "Privacy team"]] },
      { label: "Test", title: "Find broken logic before attackers do", body: "Automated tests run against your APIs in staging or production-safe mode, with the checks attackers use most.", points: ["BOLA and broken function-level authorization", "Injection and mass assignment checks", "Runs on every deploy from your pipeline"], outputs: [["Findings with reproduction steps", "Developers"], ["Pipeline gate results", "Platform team"]] },
      { label: "Protect", title: "Block abuse without breaking clients", body: "Inline policies stop attacks and bots at the edge. Start in monitor mode, then switch on blocking per endpoint.", points: ["Credential stuffing and scraping defense", "Per-endpoint rate and behavior limits", "Monitor-first rollout"], outputs: [["Blocking policies", "SecOps"], ["Alert stream to your SIEM", "SOC"]] },
    ],
    steps: [["Connect", "Point APIWall at your gateways, ingress controllers or traffic mirror. No code changes.", "Gateway connected"], ["Inventory", "Endpoints appear as traffic flows, tagged by data type, auth method and owner.", "API inventory"], ["Prioritize", "APIWall ranks risky endpoints and opens tickets for the owning team.", "Owner tickets"], ["Enforce", "Turn on blocking per endpoint once you trust the policy.", "Blocking policy"]],
    consulting: [["Penetration Testing", "/consulting/penetration-testing", "Testers take any shadow or risky endpoint further, from authorization flaws to business-logic abuse."], ["Application Security Review", "/consulting/appsec", "Code and design review for the services behind your highest-risk APIs."]],
    integrations: ["API gateways", "Kubernetes ingress", "CDN and WAF", "CI/CD pipelines", "SIEM", "Ticketing"],
    faqs: [
      ["Does APIWall sit in the request path?", "Only if you want it to. Discovery and posture work from mirrored traffic or logs. Inline blocking is optional and enabled per endpoint."],
      ["Which gateways do you support?", "Major API gateways and ingress controllers; we confirm yours at scoping. If yours is not listed, a traffic mirror or log export usually works."],
      ["Will it break my clients?", "New policies start in monitor mode. You see what would be blocked before anything is."],
      ["Does it handle GraphQL and gRPC?", "We confirm protocol support against your stack at scoping."],
    ],
  },
  {
    slug: "privacy-automation",
    name: "PrivacyFlow",
    kind: "Privacy Automation",
    category: "Data mapping and privacy requests",
    icon: "lock",
    summary: "Maps personal data, runs access and deletion requests, and enforces consent and retention.",
    h1: "Personal data, mapped and under control.",
    lead: "PrivacyFlow finds personal data across your systems, keeps your data map current, and runs privacy requests and retention rules without spreadsheets.",
    mockup: veilMock,
    proof: {
      title: "Every request answered, well inside the deadline.",
      lead: "Requests are verified, matched to the systems that hold the data and closed with a record, so the regulator's clock is never the one that runs out.",
      charts: [
        <FindingsJourney key="f" title="Privacy requests, last 90 days" board="privacy requests · last 90 days"
          item={{ id: "DSR-4821", title: "Access request from an EU customer", tag: "GDPR · 30-day clock", tone: "accent", owner: "MK" }}
          stages={[{ label: "Received", value: 1240 }, { label: "Verified", value: 1032, stamp: ["check", "Identity verified"] }, { label: "Data found", value: 640, stamp: ["search", "In 6 systems"] }, { label: "Fulfilled", value: 622, stamp: ["file", "Sent on day 4"] }]}
          notes={[["sign", "208 failed identity check", "closed with a record"], ["check", "392 held no data", "answered"], ["clock", "18 open, in deadline", "on track"]]}
          others={[["Deletion request, CA", "CCPA"], ["Access request, UK", "UK GDPR"], ["Opt-out of sale", "CPRA"], ["Rectification, DE", "GDPR"], ["Deletion request, FR", "GDPR"], ["Access request, VA", "VCDPA"], ["Portability, NL", "GDPR"], ["Access request, CO", "CPA"], ["Deletion request, IE", "GDPR"], ["Access request, ES", "GDPR"], ["Deletion request, CA", "CCPA"], ["Opt-out of sale", "CPRA"]]}
          done="All accounted for"
          label="Privacy requests over the last 90 days on a board. An EU customer's access request is verified, found in 6 systems and fulfilled on day 4. Totals: 1,240 received, 1,032 verified, 640 with data found, 622 fulfilled; 208 failed the identity check, 392 held no data and were answered, 18 are open within the deadline." />,
        <TrendChart key="t" title="Median days to close a request" desc="Per month, against the 30-day legal deadline." unit="d" target={{ label: "Deadline 30d", value: 30 }} points={[{ label: "Jan", value: 21 }, { label: "Feb", value: 18 }, { label: "Mar", value: 14 }, { label: "Apr", value: 11 }, { label: "May", value: 9 }, { label: "Jun", value: 7 }, { label: "Jul", value: 6 }, { label: "Aug", value: 5 }]} />,
      ],
    },
    capabilities: [
      { label: "Data map", title: "A data map built from your systems", body: "PrivacyFlow connects to SaaS apps, warehouses and storage to find personal data and classify it by category and sensitivity.", points: ["Automatic discovery and classification", "Records of processing kept current", "Data flows between systems"], outputs: [["Live data map", "DPO, privacy team"], ["Records of processing", "Regulators, auditors"]] },
      { label: "Requests", title: "Access and deletion requests on rails", body: "Requests come in through one intake, identity is verified, and PrivacyFlow finds the subject's data in every connected system.", points: ["Branded intake form and identity checks", "Deadlines tracked per jurisdiction", "Deletion confirmed system by system"], outputs: [["Request workflow and audit log", "DPO, legal"], ["Response packages", "Data subjects"]] },
      { label: "Consent", title: "Consent that follows the data", body: "Capture consent once and push the choice to every system that uses the data.", points: ["Consent and preference center", "Sync to marketing and analytics tools", "Proof of consent on demand"], outputs: [["Consent records", "Legal, marketing"], ["Coverage report", "DPO"]] },
      { label: "Retention", title: "Keep data only as long as you should", body: "Set retention rules by category and system. PrivacyFlow flags or removes data that outlives them.", points: ["Policy engine by data category", "Scheduled deletion with approvals", "Exceptions for legal holds"], outputs: [["Retention policy register", "GC, DPO"], ["Deletion reports", "Auditors"]] },
    ],
    steps: [["Connect", "Link the systems that hold customer and employee data. Read-only by default.", "Read-only connectors"], ["Discover", "PrivacyFlow scans and classifies personal data and builds the first data map.", "Data map"], ["Automate", "Turn on request workflows, consent sync and retention rules.", "Request workflows"], ["Prove", "Export records of processing, request logs and deletion proof when asked.", "Deletion proof"]],
    consulting: [["Privacy (GDPR, CCPA)", "/grc/privacy", "Privacy consultants design the program, DPIAs and records the product keeps current."], ["AI Governance", "/ai-security/governance", "Personal data in prompts, training sets and RAG stores, governed under ISO/IEC 42001 and NIST AI RMF."]],
    integrations: ["CRM and support tools", "Data warehouses", "Cloud storage", "HR systems", "Marketing tools", "Identity providers"],
    faqs: [
      ["Which privacy laws does PrivacyFlow cover?", "Workflows ship with deadlines and templates for common regimes such as GDPR and CCPA/CPRA. We confirm coverage for the regimes you name at scoping."],
      ["Does PrivacyFlow copy our personal data?", "Discovery works on samples and metadata where possible."],
      ["Can it work with systems you don't integrate with?", "Yes. Those systems get manual tasks inside the same request, so the audit trail stays complete."],
      ["Who runs it day to day?", "Your privacy team, or our GRC team as a virtual DPO service."],
    ],
  },
  {
    slug: "threat-detection",
    name: "AlertRank",
    kind: "Threat Detection",
    category: "AI-assisted detection and response",
    icon: "eye",
    summary: "Correlates signals across endpoint, cloud and identity, then explains each alert and ranks it by real risk.",
    h1: "Fewer alerts. Clearer incidents. Faster response.",
    lead: "AlertRank correlates telemetry across endpoint, identity, cloud and SaaS into incidents, explains each one in plain language, and ranks them by what an attacker could reach.",
    mockup: sentinelMock,
    proof: {
      title: "Thousands of signals in. A short list of incidents out.",
      lead: "Correlation and AI-assisted triage group the noise; analysts confirm what is real, and every incident is followed to contained.",
      charts: [<SocAlertStream key="f" />, <Sparklines key="s" {...SOC_SPARKS} />],
    },
    capabilities: [
      { label: "Correlate", title: "Thousands of alerts, a handful of incidents", body: "AlertRank groups related alerts from your existing tools into one incident with a timeline, so analysts start with the story.", points: ["Cross-source correlation", "Entity timelines for users, hosts and apps", "Duplicate and benign alert suppression"], outputs: [["Incident queue", "SOC analysts"], ["Noise reduction report", "SOC lead"]] },
      { label: "Explain", title: "Every incident explained in plain language", body: "AI summaries say what happened, why it ranks where it does, and what to do next. Analysts can see the evidence behind every claim.", points: ["Summaries linked to raw evidence", "Ranking based on blast radius", "Suggested next steps"], outputs: [["Incident summaries", "Analysts, managers"], ["Executive incident brief", "CISO"]] },
      { label: "Identity", title: "Catch the attacks that log in", body: "Identity threat detection spots stolen sessions, privilege abuse and risky OAuth grants that endpoint tools miss.", points: ["Session hijack and token replay detection", "Privilege escalation alerts", "Risky third-party app grants"], outputs: [["Identity detections", "SOC, IAM team"], ["Response playbooks", "SOC"]] },
      { label: "Respond", title: "Contain in minutes, with guardrails", body: "Approved playbooks isolate hosts, revoke sessions and block senders. Anything outside a playbook waits for a person.", points: ["Playbooks you approve in advance", "One-click hand-off to our SOC", "Full action log for review"], outputs: [["Response actions and log", "SOC, auditors"], ["Post-incident report", "CISO, GC"]] },
    ],
    steps: [["Connect", "Stream telemetry from your EDR, identity provider, cloud and SaaS apps.", "Telemetry streams"], ["Baseline", "AlertRank learns normal behavior for users, hosts and services.", "Behavior baseline"], ["Triage", "Incidents arrive correlated, explained and ranked.", "Ranked incidents"], ["Respond", "Your team or our SOC acts through approved playbooks.", "Playbook actions"]],
    consulting: [["Managed detection & response", "/managed-services/mdr", "Our analysts work every incident in this console, 24/7, under playbooks you approve."], ["Red & Purple Team", "/consulting/red-team", "Adversary simulation that checks the detections fire, then closes the gaps with your team."]],
    integrations: ["EDR and XDR", "Identity providers", "Cloud audit logs", "Email security", "SIEM", "Chat and paging"],
    faqs: [
      ["Does it replace my SIEM or EDR?", "It can sit beside them or take over the SIEM role. We map it to your stack during onboarding."],
      ["How does the AI make decisions?", "It ranks and summarizes. Containment only runs through playbooks you approve, and every summary links to the evidence behind it."],
      ["Where is telemetry stored?", "In the US by default; EU on request. Retention is agreed in your contract."],
      ["Can your SOC run it for us?", "Yes. Managed Detection and Response uses AlertRank as its console, so your team sees every action our analysts take."],
    ],
  },
  {
    slug: "exposure-management",
    name: "ReachMap",
    kind: "Exposure Management",
    category: "Attack surface and validation",
    icon: "radar",
    summary: "A continuous view of your attack surface and cloud risk, with validated, prioritized fixes.",
    h1: "See what an attacker sees. Fix what they'd use.",
    lead: "ReachMap maps your internet-facing assets and cloud estate continuously, validates which weaknesses are actually exploitable, and hands each owner a short list of fixes.",
    mockup: atlasMock,
    proof: {
      title: "One path to the crown jewels, closed at the cheapest hop.",
      lead: "ReachMap chains findings into the paths an attacker would walk, so you fix the one hop that breaks the most routes, then watch the risk grid empty.",
      charts: [
        <AttackGraph key="g" {...ATTACK_PATH} />,
        <RiskHeatmap key="h" {...RISK_MATRIX} title="Open exposures: likelihood × impact" desc="Number of open exposures in each cell; score = likelihood × impact." />,
      ],
    },
    capabilities: [
      { label: "Discover", title: "Find assets you didn't know you had", body: "ReachMap starts from your domains and cloud accounts and finds everything reachable: subdomains, hosts, buckets, certificates and services.", points: ["External attack surface discovery", "Cloud asset inventory", "New-asset alerts"], outputs: [["Asset inventory", "Security, IT"], ["New exposure alerts", "SecOps"]] },
      { label: "Prioritize", title: "Ranked by exploitability, not CVSS alone", body: "Findings are scored on reachability, known exploits and the value of what sits behind them.", points: ["Exploit and threat-intel context", "Business criticality per asset", "Attack paths to crown jewels"], outputs: [["Ranked exposure list", "CISO"], ["Attack path graphs", "Security architects"]] },
      { label: "Validate", title: "Proof that a fix matters", body: "Safe validation checks confirm whether a weakness can be used, so teams fix real problems first.", points: ["Non-destructive exploit checks", "Retest after each fix", "Evidence attached to every finding"], outputs: [["Validation evidence", "Owners, auditors"], ["Retest results", "SecOps"]] },
      { label: "Mobilize", title: "Fixes routed to the people who own them", body: "ReachMap assigns findings to owning teams in the tools they already use and tracks them to closure.", points: ["Ownership mapping from tags and repos", "Tickets with fix guidance", "SLA tracking by severity"], outputs: [["Remediation tickets", "Engineering teams"], ["Exposure trend report", "Board, CISO"]] },
    ],
    steps: [["Scope", "Start with your domains, IP ranges and cloud accounts.", "Seed list"], ["Discover", "ReachMap maps every reachable asset and cloud resource.", "Asset inventory"], ["Validate", "Weaknesses are checked for real exploitability and ranked.", "Validated exposures"], ["Mobilize", "Owners get tickets with fixes; ReachMap retests when they close.", "Fix tickets"]],
    consulting: [["Penetration Testing", "/consulting/penetration-testing", "Testers exploit the reachable paths the product validates and report back into the same view."], ["Red & Purple Team", "/consulting/red-team", "Objective-based simulation that starts where ReachMap says an attacker can reach."]],
    integrations: ["Cloud providers", "Vulnerability scanners", "CMDB", "Code repositories", "Ticketing", "Chat"],
    faqs: [
      ["How is this different from a vulnerability scanner?", "Scanners list issues. ReachMap adds discovery, attack paths and validation so you fix the few issues that are actually reachable."],
      ["Is validation safe in production?", "Checks are non-destructive and can be scheduled or limited by asset."],
      ["Does it include cloud posture?", "Yes. Cloud posture is part of ReachMap; see CloudGrade for detail."],
      ["Can your consultants test what ReachMap finds?", "Yes. Our penetration testers can take any ReachMap finding further and report back into the same view."],
    ],
  },
  {
    slug: "cloud-posture",
    name: "CloudGrade",
    kind: "Cloud Posture",
    category: "Cloud configuration and identity",
    icon: "cloud",
    summary: "Misconfigurations, workload and identity risk across AWS, Azure and GCP, with fixes as code.",
    h1: "Cloud misconfigurations, found and fixed as code.",
    lead: "CloudGrade, the cloud module of ReachMap, checks every account and project against benchmarks, connects misconfigurations to exposed workloads and identities, and suggests the code change that fixes each one.",
    mockup: cloudMock,
    proof: {
      title: "Risk down, checks green, across every account.",
      lead: "CloudGrade grades posture across accounts and tracks every check, so you can show the grade improving instead of a one-off scan.",
      charts: [
        <Gauge key="g" title="Cloud posture risk score" desc="Weighted from open misconfigurations, public exposure and identity risk across accounts." label="Risk score" value={34} note="Down from 71 at onboarding" />,
        <Donut key="d" title="Posture checks, last scan" centerLabel="passing"
          segments={[{ label: "Passing", value: 412, color: "#138a52" }, { label: "Failing", value: 23, color: SEV.critical }, { label: "Accepted risk", value: 18, color: INK.soft }]} />,
      ],
    },
    capabilities: [
      { label: "Posture", title: "Every account checked, all the time", body: "Agentless scans compare your AWS, Azure and GCP configuration against CIS benchmarks and your own policies.", points: ["Multi-cloud benchmark checks", "Custom policies as code", "Drift alerts when settings change"], outputs: [["Posture dashboard", "Cloud team"], ["Benchmark reports", "Auditors"]] },
      { label: "Workloads", title: "Vulnerable workloads in context", body: "Containers, VMs and serverless functions are scanned and linked to the network exposure around them.", points: ["Image and host vulnerability scanning", "Internet exposure per workload", "Runtime risk signals"], outputs: [["Workload risk list", "Platform team"], ["Exposure-linked findings", "SecOps"]] },
      { label: "Identity", title: "Least privilege you can prove", body: "CloudGrade finds unused permissions, admin roles and risky trust relationships across accounts.", points: ["Unused and excessive permissions", "Cross-account trust review", "Right-sized policy suggestions"], outputs: [["Entitlement report", "IAM team"], ["Policy diffs", "Cloud team"]] },
      { label: "Code", title: "Stop misconfigurations before deploy", body: "Infrastructure-as-code scanning catches issues in pull requests and suggests the fix inline.", points: ["Terraform, CloudFormation and Helm checks", "Pull request comments with fixes", "Pipeline gates by severity"], outputs: [["PR findings and fixes", "Developers"], ["Gate results", "Platform team"]] },
    ],
    steps: [["Connect", "Grant read-only access to cloud accounts and projects.", "Read-only access"], ["Grade", "CloudGrade grades configuration, workloads and identities.", "Config findings"], ["Prioritize", "Findings are ranked by exposure and attack path.", "Attack-path ranking"], ["Fix", "Teams get code-level fixes in pull requests or tickets.", "Fix pull requests"]],
    consulting: [["Security Architecture", "/consulting/architecture", "Architects turn recurring misconfigurations into guardrails and landing-zone design."], ["Penetration Testing", "/consulting/penetration-testing", "Cloud and identity testing that proves which misconfigurations an attacker can chain."]],
    integrations: ["AWS", "Microsoft Azure", "Google Cloud", "Kubernetes", "Code repositories", "CI/CD pipelines"],
    faqs: [
      ["Is it agentless?", "Posture and identity checks use read-only cloud APIs."],
      ["Which benchmarks are included?", "CIS benchmarks for each major cloud, plus custom policies."],
      ["Is this a separate product from ReachMap?", "No. It is the cloud module of ReachMap, so cloud and external findings share one ranking."],
      ["Can it fix things automatically?", "It suggests code changes and can open pull requests. Applying them stays with your team."],
    ],
  },
  {
    slug: "compliance-automation",
    name: "ComplyLoop",
    kind: "Continuous Compliance",
    category: "Evidence and control monitoring",
    icon: "grc",
    summary: "Pulls evidence from your tools and keeps controls current for auditors.",
    h1: "Audit-ready every day, not just audit week.",
    lead: "ComplyLoop maps your controls to the frameworks you need, collects evidence from your tools automatically, and shows auditors and customers the current state.",
    mockup: assureMock,
    proof: {
      title: "Controls proven continuously, not the week before the audit.",
      lead: "ComplyLoop tests controls against your live tools and keeps the evidence, so coverage climbs month by month and the audit is a review, not a scramble.",
      charts: [
        <Donut key="d" {...CONTROLS} centerLabel="passing" />,
        <TrendChart key="t" title="Controls with live evidence" desc="Share of SOC 2 controls with evidence collected automatically, per month." unit="%" target={{ label: "Audit-ready 90%", value: 90 }} points={[{ label: "Jan", value: 48 }, { label: "Feb", value: 55 }, { label: "Mar", value: 61 }, { label: "Apr", value: 68 }, { label: "May", value: 74 }, { label: "Jun", value: 81 }, { label: "Jul", value: 88 }, { label: "Aug", value: 94 }]} />,
      ],
    },
    capabilities: [
      { label: "Controls", title: "One control set, many frameworks", body: "Controls are pre-mapped across common frameworks, so work done once counts everywhere it applies.", points: ["SOC 2, ISO 27001, HIPAA and more", "Cross-framework control mapping", "Gap view per framework"], outputs: [["Control library", "GRC lead"], ["Gap reports", "CISO, CFO"]] },
      { label: "Evidence", title: "Evidence that collects itself", body: "Integrations pull configuration, access and change evidence on a schedule and attach it to the right control.", points: ["Scheduled evidence collection", "Platform and SOC findings as evidence", "Failing controls flagged early"], outputs: [["Evidence locker", "Auditors"], ["Control health alerts", "Control owners"]] },
      { label: "Audit", title: "Auditors get what they need, once", body: "Share a scoped workspace with your auditor. Requests, evidence and comments stay in one place.", points: ["Auditor workspace", "Request tracking", "Exportable evidence packages"], outputs: [["Audit workspace", "External auditors"], ["Evidence exports", "GRC team"]] },
      { label: "Trust center", title: "Answer security reviews before they're asked", body: "A hosted trust page shows your current posture and shares documents behind an approval step.", points: ["Hosted, branded trust center", "NDA-gated document access", "Questionnaire answer library"], outputs: [["Public trust center", "Sales, prospects"], ["Questionnaire answers", "Sales"]] },
    ],
    steps: [["Choose frameworks", "Select the frameworks you need; ComplyLoop loads the mapped controls.", "Mapped controls"], ["Connect", "Link cloud, identity, HR and ticketing tools for evidence.", "Evidence sources"], ["Close gaps", "Work the gap list with owners and due dates.", "Gap list"], ["Stay current", "Evidence refreshes on schedule; auditors see it live.", "Live evidence"]],
    consulting: [["SOC 2", "/grc/soc-2", "Readiness through report, with evidence collected by the product."], ["ISO 27001", "/grc/iso-27001", "ISMS build and certification support on the same control set."]],
    integrations: ["Identity providers", "Cloud providers", "HR systems", "Ticketing", "Code repositories", "Device management"],
    faqs: [
      ["Do you issue the audit report?", "No. ComplyLoop gets you ready and keeps you ready. Our GRC team can run readiness and coordinate the audit."],
      ["Which frameworks are supported?", "Common ones include SOC 2, ISO 27001, HIPAA, PCI DSS, NIST CSF and DORA."],
      ["Can we bring our own controls?", "Yes. Add custom controls and map them to any framework."],
      ["What does the trust center include?", "A hosted page with your posture summary, policies and reports, with access approvals for sensitive documents."],
    ],
  },
];

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
