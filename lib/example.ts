// The site's one canonical example finding and engagement (illustrative data, no client, no real CVE).
// Every page that shows RP-0142 or the example engagement imports from here, so they never disagree.

export type ExampleSev = "critical" | "high" | "medium" | "low";
export type ExampleStatus = "fixed" | "fix" | "accepted";

export const FINDING = {
  id: "RP-0142",
  title: "Broken object-level authorization on invoices API",
  sev: "critical" as const,
  cvss: "9.1",
  vector: "AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N",
  endpoint: "GET /v2/invoices/{id}",
  host: "api.example.com",
  fix: "Check the tenant in Invoice.get()",
};

// One web app and API test: 9-week plan, testing in weeks 3 to 5 (two weeks of active testing after recon).
const FINDINGS: [string, string, ExampleSev, string, ExampleStatus][] = [
  [FINDING.id, FINDING.title, FINDING.sev, FINDING.cvss, "fixed"],
  ["RP-0140", "Password reset token can be reused", "high", "8.1", "fixed"],
  ["RP-0139", "Verbose errors leak stack traces and hostnames", "high", "7.5", "fixed"],
  ["RP-0137", "No rate limit on /login", "medium", "5.3", "fix"],
  ["RP-0138", "Session stays valid after logout", "medium", "5.4", "fixed"],
  ["RP-0135", "Content Security Policy missing", "medium", "4.7", "fix"],
  ["RP-0133", "Server version disclosed in headers", "low", "3.7", "fixed"],
  ["RP-0131", "Outdated TLS cipher suite on legacy host", "low", "3.1", "accepted"],
];
const SEVS: ExampleSev[] = ["critical", "high", "medium", "low"];

export const ENGAGEMENT = {
  name: "RP-2026-0142 · Customer portal and invoices API",
  weeks: 9,
  testingWeeks: 2,
  findings: FINDINGS,
  /** Critical, high, medium, low. */
  counts: SEVS.map((s) => FINDINGS.filter((f) => f[2] === s).length) as [number, number, number, number],
  fixed: FINDINGS.filter((f) => f[4] === "fixed").length,
};

// Quarter-level sample numbers (home findings board, home and platform KPI tiles).
export const QUARTER = { reported: 142, fixed: 133, retested: 131, accepted: 9, inFix: 2, mttrHours: 6.5 };
