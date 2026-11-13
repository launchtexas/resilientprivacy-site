import type { Metadata } from "next";
import { Badge, Card, Eyebrow, Section, SectionHeading, ILLUSTRATIVE, type Tone } from "@/components/ui";
import { FinalCta } from "@/components/sections";
import { DataTable } from "@/components/mockup";
import { FindingsTable, FixDiff } from "@/components/graphics";
import { AUTHOR } from "@/components/resources/data";
import { PageHero } from "@/components/resources/parts";
import { JsonLd, article, breadcrumbs } from "@/lib/schema";
import { ENGAGEMENT, FINDING } from "@/lib/example";

const TITLE = "Sample penetration test report";
const DESC = "An example findings report: executive summary, severity breakdown, findings with reproduction steps, impact, fix and retest status, mapped to audit evidence. Illustrative data.";
const PATH = "/resources/sample-report";

export const metadata: Metadata = { title: TITLE, description: DESC, alternates: { canonical: PATH } };

// Every row is illustrative: an example web app and API test, no client, no real CVE.
type Sev = "critical" | "high" | "medium" | "low";
const SEV: Record<Sev, [string, Tone]> = { critical: ["Critical", "critical"], high: ["High", "high"], medium: ["Medium", "medium"], low: ["Low", "neutral"] };
const BAR: Record<Sev, string> = { critical: "bg-critical", high: "bg-high", medium: "bg-medium", low: "bg-navy-400" };
const STATUS = { fixed: ["Fixed · retest passed", "ok"], fix: ["In fix · retest booked", "accent"], accepted: ["Risk accepted", "neutral"] } as const;
type Status = keyof typeof STATUS;

const INDEX: [string, string, Sev, string, Status][] = ENGAGEMENT.findings;
const COUNTS = (["critical", "high", "medium", "low"] as Sev[]).map((s) => [s, INDEX.filter((r) => r[2] === s).length] as const);
const FIXED = INDEX.filter((r) => r[4] === "fixed").length;

const FINDINGS: {
  id: string; title: string; sev: Sev; cvss: string; asset: string; status: Status; retest: string;
  summary: string; steps: string[]; evidence: string[]; impact: string; fix: string; map: [string, string][]; diff?: boolean;
}[] = [
  {
    id: FINDING.id, title: FINDING.title, sev: FINDING.sev, cvss: `${FINDING.cvss} · ${FINDING.vector}`,
    asset: `${FINDING.host} · ${FINDING.endpoint}`, status: "fixed", retest: "Retested day 9: tenant B now gets 403 for tenant A's invoices.",
    summary: "The invoices endpoint looks an invoice up by its numeric ID only. Any signed-in user can read any other tenant's invoices by changing the ID.",
    steps: ["Sign in as a user of tenant B and copy the bearer token.", "Request an invoice ID that belongs to tenant A.", "The API returns 200 with the full invoice, including billing contact and line items."],
    evidence: ["$ curl -H 'Authorization: Bearer <tenant_B>' \\", "    https://api.example.com/v2/invoices/981", "HTTP/1.1 200 OK", '{"tenant":"A","contact":"billing@…","total":"18,400.00"}'],
    impact: "Every invoice on the platform is readable by any customer account. That exposes customer names, contacts and amounts, and is reportable under most customer contracts.",
    fix: "Check the tenant on every object lookup in the service layer, not in the route, and add a regression test that requests another tenant's object.",
    map: [["OWASP API Top 10", "API1:2023 Broken Object Level Authorization"], ["CWE", "CWE-639"], ["SOC 2", "CC6.1 logical access"], ["ISO 27001", "A.8.3 information access restriction"]],
    diff: true,
  },
  {
    id: "RP-0139", title: "Verbose errors leak stack traces and hostnames", sev: "high", cvss: "7.5 · AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N",
    asset: "app.example.com · POST /api/search", status: "fixed", retest: "Retested day 9: malformed input now returns a generic 400 with a correlation ID.",
    summary: "Malformed search input raises an unhandled exception. The response carries the full stack trace, framework version, internal hostnames and a database query.",
    steps: ["Send a search request with a JSON array where a string is expected.", "The API answers 500 with the exception and stack trace in the body."],
    evidence: ["POST /api/search  {\"q\": [\"x\"]}", "HTTP/1.1 500 Internal Server Error", "TypeError: q.trim is not a function", "  at search (/srv/app/search.js:41)", "  db: pg-primary.internal:5432"],
    impact: "The internal hostnames, versions and query structure shorten an attacker's reconnaissance and make other findings easier to chain.",
    fix: "Return a generic error with a correlation ID, log the detail server-side, and validate input types at the API edge.",
    map: [["OWASP ASVS", "V7.4.1 generic error messages"], ["CWE", "CWE-209"], ["SOC 2", "CC7.1 detection of configuration issues"], ["ISO 27001", "A.8.28 secure coding"]],
  },
  {
    id: "RP-0137", title: "No rate limit on /login", sev: "medium", cvss: "5.3 · AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N",
    asset: "app.example.com · POST /login", status: "fix", retest: "Fix in review. Retest booked within the free retest window.",
    summary: "The login endpoint accepts unlimited attempts per account and per source address, with no lockout, delay or challenge.",
    steps: ["Send 500 login attempts for one account from one address in a minute.", "Every attempt is processed; none is delayed or blocked."],
    evidence: ["500 × POST /login  user=test.user@example.com", "500 × HTTP/1.1 401 Unauthorized", "median response 84 ms · no 429 returned"],
    impact: "Password spraying and credential stuffing run at full speed. Accounts without MFA are exposed to takeover.",
    fix: "Rate-limit per account and per address, add a progressive delay, and alert the SOC on spikes in failed logins.",
    map: [["OWASP ASVS", "V2.2.1 anti-automation"], ["CWE", "CWE-307"], ["SOC 2", "CC6.6 boundary protection"], ["ISO 27001", "A.8.5 secure authentication"]],
  },
];

const meta = (label: string, value: string) => (
  <div key={label}>
    <dt className="font-mono text-micro tracking-[0.06em] text-navy-500 uppercase">{label}</dt>
    <dd className="mt-1 text-sm font-medium text-navy-950">{value}</dd>
  </div>
);
const Label = ({ children }: { children: string }) => <p className="text-micro font-medium tracking-[0.06em] text-navy-500 uppercase">{children}</p>;

export default function SampleReport() {
  const total = INDEX.length;
  return (
    <>
      <JsonLd data={[article({ headline: TITLE, description: DESC, path: PATH, datePublished: "2026-11-10", author: AUTHOR }), breadcrumbs([["Resources", "/resources"], ["Sample report", PATH]])]} />
      <PageHero
        eyebrow="Sample report"
        title="What you get at the end of a test."
        lead="A shortened example of our penetration test report: the summary your leadership reads, the findings your engineers fix, and the retest and evidence mapping your auditor asks for."
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone="medium" dot>Example report</Badge>
          <Badge>{ILLUSTRATIVE}</Badge>
        </div>
      </PageHero>

      <Section tone="mist" labelledBy="summary-title">
        <Card className="p-6 lg:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
            <div>
              <Eyebrow>Executive summary</Eyebrow>
              <h2 id="summary-title" className="mt-3 text-h2 font-semibold tracking-[-0.025em] text-balance">Web application and API penetration test</h2>
            </div>
            <Badge tone="medium">Example report</Badge>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-line py-6 md:grid-cols-4">
            {meta("Client", "Example organization")}
            {meta("Scope", "Web app, REST API, 2 roles")}
            {meta("Method", "OWASP WSTG, ASVS L2")}
            {meta("Report", "v1.1, after retest")}
          </dl>
          <div className="grid grid-cols-1 gap-10 pt-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="leading-relaxed text-navy-700 text-pretty">
                We found {total} issues over {ENGAGEMENT.testingWeeks === 2 ? "two" : ENGAGEMENT.testingWeeks} weeks of testing. One is critical: any customer account could read every other customer&apos;s invoices through the API. Engineering fixed it within two days and our retest confirmed the fix. Two high-severity issues are also fixed. Two medium issues are in fix with a retest booked, and one low issue was accepted as a documented risk.
              </p>
              <ul className="mt-6 space-y-3 text-[0.9375rem] text-navy-800">
                <li><span className="font-semibold text-navy-950">Fix first:</span> object-level authorization. The same lookup pattern appears in three other services we did not test.</li>
                <li><span className="font-semibold text-navy-950">Strength:</span> authentication, session cookies and TLS on the main domains are configured well.</li>
              </ul>
            </div>
            <div className="lg:col-span-5">
              <Label>Severity breakdown</Label>
              <ul className="mt-3 space-y-3">
                {COUNTS.map(([s, n]) => (
                  <li key={s} className="grid grid-cols-[5rem_1fr_1.5rem] items-center gap-3">
                    <Badge tone={SEV[s][1]} className="justify-center">{SEV[s][0]}</Badge>
                    <span className="h-2 overflow-hidden rounded-full bg-cloud"><span className={`block h-full rounded-full ${BAR[s]}`} style={{ width: `${(n / total) * 100}%` }} /></span>
                    <span className="text-right text-sm font-semibold tabular-nums text-navy-950">{n}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-control bg-ok-soft px-4 py-3 text-sm text-ok-ink">
                <span className="font-semibold">{FIXED} of {total} fixed and verified</span> by retest at report v1.1.
              </div>
            </div>
          </div>
        </Card>
      </Section>

      <Section labelledBy="index-title">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <SectionHeading id="index-title" eyebrow="Findings index" title="Every finding, ranked and owned." lead="Severity uses CVSS 3.1 adjusted for your context. You follow each fix in the portal through to a passed retest, not only in the PDF." className="lg:col-span-5" />
          <FindingsTable className="lg:col-span-7" />
        </div>
        <Card className="mt-10 p-2 sm:p-4">
          <DataTable
            columns={["ID", "Finding", "Severity", "CVSS", "Status"]}
            rows={INDEX.map(([id, t, s, c, st]) => [
              <span key="i" className="font-mono text-micro">{id}</span>, t,
              <Badge key="s" tone={SEV[s][1]}>{SEV[s][0]}</Badge>, <span key="c" className="tabular-nums">{c}</span>,
              <Badge key="t" tone={STATUS[st][1]} dot>{STATUS[st][0]}</Badge>,
            ])}
          />
        </Card>
        <p className="mt-3 text-micro text-navy-500">{ILLUSTRATIVE}</p>
      </Section>

      <Section tone="mist" labelledBy="detail-title">
        <SectionHeading id="detail-title" eyebrow="Finding detail" title="Reproducible, with the fix written down." lead="Each finding gives your engineers the steps and evidence to reproduce it, the business impact, a specific fix and where it maps in your audit frameworks. Three are shown here." />
        <div className="mt-10 space-y-6">
          {FINDINGS.map((f) => (
            <Card key={f.id} className="p-6 lg:p-8">
              <article aria-labelledby={`${f.id}-t`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-micro text-navy-500">{f.id}</span>
                  <Badge tone={SEV[f.sev][1]} dot>{SEV[f.sev][0]}</Badge>
                  <Badge tone={STATUS[f.status][1]}>{STATUS[f.status][0]}</Badge>
                </div>
                <h3 id={`${f.id}-t`} className="mt-3 text-h3 font-semibold tracking-[-0.015em] text-balance">{f.title}</h3>
                <p className="mt-2 font-mono text-micro break-words text-navy-500">{f.asset} · CVSS {f.cvss}</p>
                <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
                  <div className="min-w-0 space-y-5 lg:col-span-7">
                    <p className="text-[0.9375rem] leading-relaxed text-navy-700 text-pretty">{f.summary}</p>
                    <div>
                      <Label>Steps to reproduce</Label>
                      <ol className="mt-2 list-decimal space-y-1 pl-5 text-[0.9375rem] text-navy-800">{f.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                    </div>
                    <div>
                      <Label>Evidence</Label>
                      <pre className="mt-2 overflow-x-auto rounded-control bg-navy-950 p-4 font-mono text-micro leading-relaxed text-navy-300">{f.evidence.join("\n")}</pre>
                    </div>
                    <div>
                      <Label>Impact</Label>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-700 text-pretty">{f.impact}</p>
                    </div>
                  </div>
                  <div className="min-w-0 space-y-5 lg:col-span-5">
                    <div>
                      <Label>Recommended fix</Label>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-700 text-pretty">{f.fix}</p>
                      {f.diff && <FixDiff className="mt-4" />}
                    </div>
                    <div className="rounded-control bg-mist p-4">
                      <Label>Retest</Label>
                      <p className="mt-2 text-sm text-navy-800">{f.retest}</p>
                    </div>
                    <div>
                      <Label>Evidence mapping</Label>
                      <dl className="mt-2 divide-y divide-line text-sm">
                        {f.map.map(([k, v]) => (
                          <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 py-2">
                            <dt className="text-navy-500">{k}</dt><dd className="text-navy-900">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </div>
              </article>
            </Card>
          ))}
        </div>
      </Section>

      <FinalCta kind="expert" title="Want this report for your own systems?" lead="A 30-minute call with a senior tester. You leave with a scope, a timeline and a fixed quote." />
    </>
  );
}
