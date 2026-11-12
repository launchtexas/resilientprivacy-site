// Shared chart constants + illustrative presets. Plain module (no "use client") so server charts can read the values.

import { ENGAGEMENT as EXAMPLE, QUARTER } from "@/lib/example";

/** Categorical series, fixed order (dataviz validator: all-pairs pass on white; slots 2-3 need the dash + legend + table they ship with). */
export const SERIES = ["#5b47e0", "#1baf7a", "#e87ba4"] as const;
export const DASH = [undefined, "6 4", "2 4"] as const;
/** Severity = status tokens (globals.css). "low" is ink, not a status hue. */
export const SEV = { critical: "#d4331f", high: "#e0700b", medium: "#b98900", low: "#9896b8" } as const;
export const INK = { line: "#e7e5f2", strong: "#d4d1e6", muted: "#636088", text: "#353166", strongText: "#110d2e", soft: "#c3c1d8" } as const;

export const fmt = (n: number, d = 0) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
/** Smallest clean axis max with 4 even whole-number steps (ticks print with 0 decimals, so 2.5 would show as 3). */
export function niceMax(m: number) {
  const step = Math.max(1, 10 ** Math.floor(Math.log10(m / 4 || 1)));
  for (const c of [1, 2, 2.5, 5, 10]) if (Number.isInteger(c * step) && 4 * c * step >= m) return 4 * c * step;
  return 40 * step;
}
/** Split a label into lines of at most `max` characters, on spaces. */
export const wrap = (s: string, max = 16) => s.split(" ").reduce<string[]>((ls, w) => {
  const last = ls[ls.length - 1];
  if (last && (last + " " + w).length <= max) ls[ls.length - 1] = last + " " + w; else ls.push(w);
  return ls;
}, []);

// ---------- Radar presets ----------
export const RADAR_NIST = {
  title: "NIST CSF 2.0 maturity",
  desc: "Implementation tier per function (1 Partial, 2 Risk informed, 3 Repeatable, 4 Adaptive).",
  axes: ["Govern", "Identify", "Protect", "Detect", "Respond", "Recover"],
  max: 4,
  series: [
    { name: "Today", values: [1.5, 2.5, 2.5, 1.5, 2, 1] },
    { name: "After 6 months", values: [3, 3, 3, 3, 3, 2.5] },
  ],
};
export const RADAR_AI = {
  title: "AI readiness",
  desc: "Maturity 0 to 5 per area of an AI governance programme (ISO 42001 / NIST AI RMF aligned).",
  axes: ["Governance", "Data", "Model risk", "Transparency", "Monitoring", "Third parties"],
  max: 5,
  series: [
    { name: "Today", values: [2, 3, 1, 1.5, 1, 2] },
    { name: "After 90 days", values: [4, 3.5, 3, 3, 3.5, 3] },
  ],
};
export const RADAR_VENDOR = {
  title: "Vendor risk comparison",
  desc: "Assessment score 0 to 5 per domain; higher is safer.",
  axes: ["Security", "Privacy", "Resilience", "Compliance", "AI use"],
  max: 5,
  series: [
    { name: "Vendor A", values: [4.5, 4, 3.5, 4.5, 3] },
    { name: "Vendor B", values: [3, 2.5, 4, 3, 1.5] },
    { name: "Vendor C", values: [2, 3.5, 2, 2.5, 4] },
  ],
};

// ---------- Other presets ----------
export const MTTR = {
  title: "Mean time to remediate critical findings",
  desc: "Hours from report to verified fix, per month.",
  unit: "h",
  points: [["Jan", 38], ["Feb", 31], ["Mar", 27], ["Apr", 19], ["May", 15], ["Jun", 11], ["Jul", 9], ["Aug", 6.5]].map(([label, value]) => ({ label: label as string, value: value as number })),
  target: { label: "SLA 8h", value: 8 },
};

export const SPRINT_FINDINGS = {
  title: "Open findings by severity per sprint",
  desc: "Open findings at the end of each sprint after the pentest report.",
  keys: [
    { label: "Critical", color: SEV.critical },
    { label: "High", color: SEV.high },
    { label: "Medium", color: SEV.medium },
    { label: "Low", color: SEV.low },
  ],
  groups: [
    { label: "S1", values: [4, 9, 14, 11] },
    { label: "S2", values: [2, 7, 12, 10] },
    { label: "S3", values: [1, 4, 9, 9] },
    { label: "S4", values: [0, 3, 6, 7] },
    { label: "S5", values: [0, 1, 4, 5] },
    { label: "S6", values: [0, 0, 2, 4] },
  ],
};

export const CONTROLS = {
  title: "SOC 2 controls passing",
  desc: "Automated control tests in the last run.",
  segments: [
    { label: "Passing", value: 74, color: "#138a52" },
    { label: "Failing", value: 6, color: SEV.critical },
    { label: "Not yet tested", value: 9, color: INK.soft },
  ],
};

/** counts[likelihood-1][impact-1] */
export const RISK_MATRIX = {
  title: "Risk register: likelihood × impact",
  desc: "Number of open risks in each cell; score = likelihood × impact.",
  counts: [
    [3, 2, 1, 0, 0],
    [2, 4, 2, 1, 0],
    [1, 3, 3, 2, 1],
    [0, 1, 2, 2, 1],
    [0, 0, 1, 1, 1],
  ],
};

export const SOC_FLOW = {
  title: "From alert to contained, last 30 days",
  stages: [
    { label: "Alerts", value: 12480, drop: "auto-closed as noise" },
    { label: "Triaged", value: 1920, drop: "benign after triage" },
    { label: "Incidents", value: 46, drop: "still open" },
    { label: "Contained", value: 46 },
  ],
};

export const ENGAGEMENT = {
  title: "Pentest engagement plan",
  desc: "Phases by week; the line marks today.",
  weeks: EXAMPLE.weeks,
  today: 4.5,
  phases: [
    { label: "Scoping", start: 0, end: 1 },
    { label: "Recon & threat model", start: 1, end: 3 },
    { label: "Web + API testing", start: 3, end: 5 },
    { label: "AI red teaming", start: 3, end: 5 },
    { label: "Reporting", start: 5, end: 6 },
    { label: "Fix window", start: 6, end: 8 },
    { label: "Retest", start: 8, end: 9 },
  ],
};

export const ATTACK_PATH = {
  title: "Attack path to the customer database",
  desc: "Five hops from one phishing email; the other assets were reachable but not on the path.",
  nodes: [
    { id: "phish", label: "Phishing email", x: 58, y: 46, note: "Macro-enabled invoice opened" },
    { id: "ws", label: "Workstation", x: 120, y: 132, note: "Payload runs as the user" },
    { id: "vpn", label: "VPN gateway", x: 50, y: 214, note: "Reachable, MFA enforced" },
    { id: "creds", label: "Cached admin creds", x: 206, y: 46, note: "Admin token in browser storage" },
    { id: "fs", label: "File server", x: 206, y: 214, note: "Reachable, nothing sensitive" },
    { id: "dc", label: "Domain controller", x: 286, y: 132, note: "Token reused for directory admin" },
    { id: "db", label: "Customer DB", x: 356, y: 46, note: "Target: 1.2M customer records" },
    { id: "bk", label: "Backups", x: 356, y: 214, note: "Reachable, immutable copies" },
  ],
  edges: [["phish", "ws"], ["vpn", "ws"], ["ws", "creds"], ["ws", "fs"], ["creds", "dc"], ["fs", "dc"], ["dc", "db"], ["dc", "bk"]] as [string, string][],
  path: ["phish", "ws", "creds", "dc", "db"],
};

export const SOC_SPARKS = {
  title: "SOC health, last 12 weeks",
  items: [
    { label: "Mean time to detect", unit: "h", decimals: 1, goodWhen: "down" as const, values: [9.1, 8.4, 8.8, 7.2, 6.9, 6.1, 5.8, 5.2, 4.6, 4.1, 3.6, 3.2] },
    { label: "Alerts per analyst / day", unit: "", decimals: 0, goodWhen: "down" as const, values: [210, 198, 205, 176, 160, 151, 140, 122, 118, 104, 96, 88] },
    { label: "Detections mapped to ATT&CK", unit: "%", decimals: 0, goodWhen: "up" as const, values: [42, 45, 47, 51, 55, 58, 61, 66, 70, 73, 77, 81] },
    { label: "False positive rate", unit: "%", decimals: 0, goodWhen: "down" as const, values: [38, 36, 37, 33, 30, 28, 27, 24, 22, 20, 19, 17] },
  ],
};

export const KPIS = [
  { label: "Findings fixed and retested", value: QUARTER.fixed, delta: `of ${QUARTER.reported} reported`, good: true },
  { label: "Median time to remediate", value: 6.5, decimals: 1, suffix: "h", delta: "−31.5h since January", good: true },
  { label: "Controls with live evidence", value: 94, suffix: "%", delta: "+22 pts vs last audit", good: true },
  { label: "Risks accepted in writing", value: QUARTER.accepted, delta: "each signed by its owner", good: true },
];
