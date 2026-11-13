// The site's one canonical example finding, engagement, tenant and incident (example data: no client, no real CVE).
// Naming follows real conventions: RFC 2606 domains, RFC 5737 documentation IPs, the AWS docs account 111122223333,
// MITRE ATT&CK technique IDs, CWE IDs and CVSS 3.1 vectors whose base score matches the stated score.
// Every page that shows RP-0142 or the example engagement imports from here, so they never disagree.

export type ExampleSev = "critical" | "high" | "medium" | "low";
export type ExampleStatus = "fixed" | "fix" | "accepted";

export const FINDING = {
  id: "RP-0142",
  title: "Broken object-level authorization on invoices API",
  sev: "critical" as const,
  cvss: "9.1",
  // PR:N: the public web-app API key is enough, no user login. This vector scores 9.1.
  vector: "AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N",
  cwe: "CWE-639",
  owasp: "API1:2023",
  endpoint: "GET /v2/invoices/{id}",
  host: "api.example.com",
  fix: "Check the tenant in Invoice.get()",
  found: "2026-10-14T09:42:17Z",
};

/** The example customer every console shows. */
export const TENANT = { name: "Example Corp", aws: "111122223333", domain: "example.com" };

/** One SOC incident shared by the SOC, MDR and hunt scenes, so times, hosts and IDs agree. */
export const INCIDENT = {
  id: "INC-2026-0419",
  title: "Valid account used from new country",
  technique: "T1078.004",
  user: "svc-billing@example.com",
  host: "prod-api-02.internal",
  srcIp: "203.0.113.47",
  detected: "2026-11-03T02:14:06Z",
  contained: "2026-11-03T02:22:41Z",
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
