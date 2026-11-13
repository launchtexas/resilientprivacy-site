// Consulting division content. One entry per detail page at /consulting/<slug>.
// AI security services live in components/ai/data.ts (same Service shape, own `path`).
// Every stat, duration, price and certification stays unbracketed but unconfirmed until the company confirms it; never add new numbers.
import { ENGAGEMENT, FINDING } from "@/lib/example";

export type Sev = "critical" | "high" | "medium" | "ok";

export type Service = {
  slug: string;
  name: string;
  icon: string; // 24px-grid SVG path
  kicker: string;
  path?: string; // defaults to /consulting/<slug>
  desc: string; // meta description, <= 160 chars
  related: string[]; // hrefs for "Often paired with"
  card: string; // one line for hub cards and cross-links
  title: string; // page H1
  lead: string;
  glance: [string, string][];
  scope: [string, string][];
  steps: [string, string, string?][]; // title, body, artefact chip
  report: {
    window: string;
    engagement: string;
    counts: [number, number, number, number]; // critical, high, medium, low
    list: [string, Sev][];
    finding: {
      id: string;
      title: string;
      sev: Sev;
      score: string;
      asset: string;
      summary: string;
      evidenceLabel: string;
      evidence: string[];
      fix: string;
      status: [string, Sev];
    };
  };
  deliverables: [string, string][];
  faq: [string, string][];
};

export const SERVICES: Service[] = [
  {
    slug: "penetration-testing",
    desc: "Web, API, mobile, network and cloud penetration testing by senior testers, mapped to OWASP and PTES, with a retest until every fix is verified.",
    related: ["/consulting/red-team", "/consulting/appsec", "/ai-security/red-teaming"],
    name: "Penetration Testing",
    icon: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM12 9v4M12 16h.01",
    kicker: "Offensive",
    card: "Web, API, mobile, network and cloud testing with reproducible findings and a retest.",
    title: "Penetration testing that ends in fixes, not a PDF.",
    lead: "Senior testers attack your applications, APIs and infrastructure the way a real adversary would, then stay with your engineers until every finding is verified fixed.",
    glance: [["Typical length", "1–3 weeks"], ["Retest", "Included"], ["Standards", "OWASP WSTG, ASVS, API Top 10, PTES, NIST SP 800-115"]],
    scope: [
      ["Web applications", "Authentication, session handling, access control, injection and business-logic abuse."],
      ["APIs", "REST, GraphQL and gRPC: broken object-level auth, mass assignment, rate limits and data exposure."],
      ["Mobile apps", "iOS and Android binaries, local storage, certificate pinning and the APIs behind them."],
      ["External network", "Internet-facing hosts, VPNs and edge devices, tested from an attacker's starting point."],
      ["Internal network", "Assumed-breach testing: lateral movement, Active Directory paths and privilege escalation."],
      ["Cloud", "AWS, Azure and GCP: IAM paths, exposed storage, metadata abuse and tenant isolation."],
    ],
    steps: [
      ["Scope", "We agree targets, test windows, rules of engagement and who to call if something breaks.", "Rules of engagement"],
      ["Map", "Automated discovery plus manual review builds a full picture of the attack surface.", "Attack-surface map"],
      ["Exploit", "Testers chain weaknesses to prove real impact, and flag criticals to you the same day.", "Critical flagged same day"],
      ["Report", "Every finding has reproduction steps, business impact and a specific fix.", "Report v1"],
      ["Retest", "We verify each fix and issue an updated report and attestation letter.", "Attestation letter"],
    ],
    report: {
      window: "Engagement · Web & API test",
      engagement: ENGAGEMENT.name,
      counts: ENGAGEMENT.counts,
      list: ENGAGEMENT.findings.slice(0, 4).map(([, t, sev]) => [t, sev] as [string, Sev]),
      finding: {
        id: FINDING.id,
        title: FINDING.title,
        sev: FINDING.sev,
        score: `CVSS ${FINDING.cvss} · ${FINDING.cwe}`,
        asset: `${FINDING.host} · ${FINDING.endpoint}`,
        summary: "The endpoint looks an invoice up by its ID only. Any signed-in user can read any other tenant's invoices by changing the ID.",
        evidenceLabel: "Steps to reproduce",
        evidence: ["$ curl -H 'X-Api-Key: <public web-app key>' \\", "    https://api.example.com/v2/invoices/981", "HTTP/1.1 200 OK", '{"tenant":"A","contact":"billing@…","total":"18,400.00"}'],
        fix: "Check the tenant on every invoice lookup in the service layer, return 404 for objects the caller does not own, and add a regression test.",
        status: ["Fixed · retest passed", "ok"],
      },
    },
    deliverables: [
      ["Technical report", "Every finding with severity, evidence, reproduction steps and a specific fix."],
      ["Executive summary", "Two pages on risk, trends and what to fund first, written for leadership."],
      ["Findings in the platform", "Issues sync to your tracker and the Resilient Privacy console for owners and due dates."],
      ["Retest and attestation", "Verified fixes and a shareable letter for customers and auditors."],
    ],
    faq: [
      ["How long does a test take?", "Usually one to three weeks of testing, depending on scope."],
      ["Will testing break production?", "We agree safe windows and rules of engagement first, avoid destructive payloads, and stop and call you if anything looks unstable."],
      ["Can we share results with customers or auditors?", "Yes. You get a letter of attestation that summarizes scope, dates and outcome without exposing details."],
      ["Do you offer continuous testing?", "Yes. Rolling tests on a schedule with a live findings view, for teams that ship every week."],
    ],
  },
  {
    slug: "red-team",
    desc: "Objective-based red and purple team campaigns mapped to MITRE ATT&CK. Every gap we find becomes a working detection in your SOC.",
    related: ["/consulting/penetration-testing", "/managed-services/threat-hunting", "/consulting/how-we-work"],
    name: "Red & Purple Team",
    icon: "M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0M12 12h.01",
    kicker: "Offensive",
    card: "Objective-based attack campaigns, run against your defenders or alongside them.",
    title: "Find out whether your defenses hold against a real attack.",
    lead: "A red team pursues a business objective with the tradecraft of a real adversary. A purple team runs the same techniques with your SOC in the room, so every gap becomes a working detection.",
    glance: [["Typical length", "4–8 weeks"], ["Method", "MITRE ATT&CK, threat-led objectives (TIBER-EU-style)"], ["Formats", "Red, purple or assumed breach"]],
    scope: [
      ["Objective-based red team", "A goal such as reaching payment data or the CEO's mailbox, pursued covertly end to end."],
      ["Purple team exercises", "Techniques run openly with your analysts, tuned until each one is detected."],
      ["Assumed breach", "Start from a compromised laptop or account to test internal detection and response."],
      ["Social engineering", "Phishing, vishing and pretexting campaigns against agreed groups."],
      ["Physical intrusion", "Badge cloning, tailgating and on-site device drops, where in scope."],
      ["Threat-led scenarios", "Campaigns modeled on groups that target your sector."],
    ],
    steps: [
      ["Threat model", "Pick the adversaries and objectives that matter to your business.", "Threat profile"],
      ["Plan", "Agree rules of engagement, a control group that knows, and safe stop conditions.", "Rules of engagement"],
      ["Operate", "Run the campaign, logging every action with timestamps for later replay.", "Action log"],
      ["Replay", "Walk your SOC through the timeline to see what fired, what was missed and why.", "Detection-gap timeline"],
      ["Harden", "Build and test new detections together until the gaps close.", "New detections"],
    ],
    report: {
      window: "Campaign · Objective: payment data",
      engagement: "RT-2026-0207 · Assumed breach to cardholder environment",
      counts: [2, 4, 5, 3],
      list: [["Kerberoastable service account", "critical"], ["No alert on LSASS access", "critical"], ["Flat route from VDI to CDE", "high"], ["Phish reached 18% click rate", "medium"]],
      finding: {
        id: "RT-0207-03",
        title: "Credential dumping went undetected",
        sev: "critical",
        score: "ATT&CK T1003.001",
        asset: "FIN-WS-118 · EDR policy 'Workstations'",
        summary: "Memory was read from LSASS on a finance workstation. The EDR logged the event but no rule raised an alert, so the SOC never saw it.",
        evidenceLabel: "Campaign timeline",
        evidence: ["09:12  Initial access via phished session token", "09:47  LSASS memory read, no alert raised", "10:31  Domain admin credentials recovered", "11:05  Objective reached: CDE file share"],
        fix: "Enable the credential-access rule set, alert on LSASS handle requests, and add Credential Guard to finance workstations.",
        status: ["Detection built · validated", "ok"],
      },
    },
    deliverables: [
      ["Attack narrative", "The full campaign as a timeline, with each step mapped to ATT&CK."],
      ["Detection gap matrix", "Which techniques were prevented, detected, logged only or missed."],
      ["Detection content", "Rules and queries built in the purple-team phase, ready for your SIEM."],
      ["Detections delivered", "Every missed technique handed to your SOC, or ours, as a tested detection and a threat-hunting lead."],
    ],
    faq: [
      ["What is the difference between red and purple teaming?", "Red teaming is covert and tests your response end to end. Purple teaming is collaborative and builds detections as you go. Many clients run red first, then purple."],
      ["Who in our company needs to know?", "A small control group, usually the CISO and one or two others, who can stop the exercise and tell real incidents apart."],
      ["How do you keep it safe?", "Written rules of engagement, no destructive actions, and agreed stop conditions. Every action is logged."],
      ["Can our managed SOC take part?", "Yes. If our SOC monitors you, the exercise also tests that service, and we report on it openly."],
    ],
  },
  {
    slug: "appsec",
    desc: "Secure code review, threat modeling, DevSecOps guardrails and review of AI-written code, delivered with your engineers.",
    related: ["/consulting/penetration-testing", "/ai-security/secure-adoption", "/consulting/architecture"],
    name: "Application Security",
    icon: "M8 8l-4 4 4 4M16 8l4 4-4 4M13 6l-2 12",
    kicker: "Offensive",
    card: "Code review, threat modeling and secure SDLC for teams that ship fast.",
    title: "Security built into the way your team ships.",
    lead: "We review code and design with your engineers, find the flaws scanners miss, and leave behind threat models, guardrails and habits that keep new code safe.",
    glance: [["Typical length", "2–4 weeks"], ["Languages", "Most mainstream stacks"], ["Standards", "OWASP ASVS, SAMM"]],
    scope: [
      ["Secure code review", "Manual review of authentication, authorization, crypto and data handling, guided by tooling."],
      ["Threat modeling", "Data-flow diagrams and abuse cases for new features, before they are built."],
      ["Architecture review", "Trust boundaries, service-to-service auth, secrets and multi-tenant isolation."],
      ["Secure SDLC / DevSecOps", "SAST, SCA, secrets scanning, SBOMs and policy gates tuned to your pipeline."],
      ["AI coding assistants", "Safe use of coding assistants and agents: review of AI-written code, repo and secret exposure, and agent permissions in CI."],
      ["Developer training", "Hands-on sessions built from the flaws we found in your own code."],
    ],
    steps: [
      ["Walkthrough", "Your engineers show us the system, the riskiest flows and what changed recently.", "Walkthrough notes"],
      ["Threat model", "We map assets, trust boundaries and the attacks that matter most.", "Threat model"],
      ["Review", "Targeted manual review of high-risk code paths, backed by tuned scanners.", "Code findings"],
      ["Fix together", "Findings come as pull-request-ready guidance; we pair on the hard ones.", "Fix pull requests"],
      ["Embed", "Guardrails go into CI so the same class of bug cannot ship again.", "CI guardrails"],
    ],
    report: {
      window: "Review · payments-service",
      engagement: "AS-2026-0319 · payments-service @ 4f2c9e1",
      counts: [0, 2, 5, 11],
      list: [["Webhook signature not verified", "high"], ["Tenant ID taken from request body", "high"], ["Secrets in CI logs", "medium"], ["Outdated XML parser", "medium"]],
      finding: {
        id: "AS-0319-02",
        title: "Tenant ID is trusted from the request body",
        sev: "high",
        score: "ASVS V4.2.1",
        asset: "payments-service · src/routes/refunds.ts:88",
        summary: "The refund handler reads tenantId from JSON instead of the authenticated session, so one tenant can issue refunds against another tenant's charges.",
        evidenceLabel: "Vulnerable code",
        evidence: ["86  const { chargeId, tenantId } = req.body;", "87  // tenant should come from req.auth", "88  await refunds.create({ chargeId, tenantId });"],
        fix: "Derive tenantId from req.auth, scope the charge lookup to it, and add a lint rule that bans tenantId in request bodies.",
        status: ["PR #2841 merged", "ok"],
      },
    },
    deliverables: [
      ["Findings with code references", "File, line, impact and a suggested patch for each issue."],
      ["Threat models", "Diagrams and abuse cases your team can keep updating."],
      ["Pipeline guardrails", "Tuned scanner rules and CI policy gates, committed to your repo."],
      ["Team training", "Sessions built from your codebase, recorded for new hires."],
    ],
    faq: [
      ["Do you need access to our source code?", "For code review, yes, read-only. We can work in your environment or on a secured copy."],
      ["How is this different from a pentest?", "A pentest attacks the running system from outside. AppSec review reads the code and design, so it finds flaws a black-box test cannot reach."],
      ["Will you slow our releases down?", "No. Guardrails are tuned for low noise, and we agree which findings block a release before turning anything on."],
      ["Which languages do you cover?", "Most mainstream web, mobile and backend stacks."],
    ],
  },
  {
    slug: "architecture",
    desc: "Zero Trust, identity, cloud and secure AI architecture reviews that end in a phased roadmap your team can build.",
    related: ["/ai-security/secure-adoption", "/consulting/vciso", "/consulting/appsec"],
    name: "Security Architecture",
    icon: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6zM10 7h4M7 10v4M17 10v4",
    kicker: "Advisory",
    card: "Zero Trust, cloud and identity design reviews with a phased roadmap.",
    title: "A Zero Trust design your team can actually build.",
    lead: "We review how identity, network, cloud and data fit together today, design the target state, and turn it into a phased plan with owners and milestones.",
    glance: [["Typical length", "3–6 weeks"], ["Reference", "NIST SP 800-207, CISA ZTMM"], ["Domains", "Identity, cloud, network, data"]],
    scope: [
      ["Zero Trust strategy", "Target architecture, micro-segmentation and maturity scoring against CISA's model."],
      ["Identity and access", "SSO, MFA, privileged access, service identities and joiner-mover-leaver flows."],
      ["Cloud architecture", "Landing zones, guardrails, network segmentation and CNAPP rollout."],
      ["Secure AI architecture", "Model, data and tool boundaries for AI features and agents, reviewed before they ship."],
      ["Data protection", "Classification, encryption, key management and data-loss controls."],
      ["Post-quantum readiness", "A cryptography inventory and a migration plan for quantum-safe algorithms."],
    ],
    steps: [
      ["Discover", "Interviews, config reviews and diagrams to understand the current state.", "Current-state map"],
      ["Assess", "Score maturity per pillar and find the paths an attacker would use.", "Maturity scorecard"],
      ["Design", "Agree a target architecture that fits your stack and budget.", "Target architecture"],
      ["Plan", "Sequence the work into phases with owners, effort and quick wins first.", "Phased roadmap"],
      ["Support", "Stay on to review designs and changes as your team builds.", "Design reviews"],
    ],
    report: {
      window: "Review · Zero Trust maturity",
      engagement: "SA-2026-0503 · Hybrid estate, AWS and on-premises",
      counts: [1, 3, 4, 2],
      list: [["Shared local admin passwords", "critical"], ["VPN grants full network access", "high"], ["Long-lived cloud access keys", "high"], ["No data classification", "medium"]],
      finding: {
        id: "SA-0503-02",
        title: "VPN users reach the whole internal network",
        sev: "high",
        score: "ZTMM · Networks: Traditional",
        asset: "Corporate VPN · 1 flat /16",
        summary: "Any authenticated VPN user can reach every internal subnet, including domain controllers and the backup network. One stolen laptop exposes everything.",
        evidenceLabel: "Observed path",
        evidence: ["contractor-laptop → VPN (MFA ok)", "  → 10.20.0.0/16  any:any  allow", "  → dc01.corp:445, backup01:22  reachable"],
        fix: "Phase 1: per-app access through an identity-aware proxy for the top 20 apps. Phase 2: retire full-tunnel VPN for staff.",
        status: ["Phase 1 in progress", "medium"],
      },
    },
    deliverables: [
      ["Current-state assessment", "Architecture diagrams and maturity scores per Zero Trust pillar."],
      ["Target architecture", "The design you are building toward, with key decisions recorded."],
      ["Phased roadmap", "12–24 months of work with owners, effort and dependencies."],
      ["Design support", "Ongoing review of designs and changes as the plan is delivered, in hours set in your SOW."],
    ],
    faq: [
      ["Do we have to buy new tools?", "Not necessarily. We start from what you own and recommend new spend only where it closes a real gap."],
      ["Can you help with implementation?", "Yes. We can review your team's designs, or pair with your engineers on the hardest parts."],
      ["Is this only for large enterprises?", "No. The scope scales; growth-stage teams often need the identity and cloud parts most."],
      ["What about post-quantum cryptography?", "We inventory where cryptography is used and plan a migration as standards and vendors mature."],
    ],
  },
  {
    slug: "vciso",
    desc: "A named virtual CISO for strategy, board reporting, AI governance and customer assurance, without the full-time hire.",
    related: ["/ai-security/governance", "/grc", "/consulting/architecture"],
    name: "Virtual CISO",
    icon: "M12 8m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0M4 21c0-4 3.5-7 8-7s8 3 8 7",
    kicker: "Advisory",
    card: "Fractional security leadership, roadmaps, board reporting and risk quantification.",
    title: "Senior security leadership, without the full-time hire.",
    lead: "A named virtual CISO sets your security strategy, runs the program, reports to the board and answers customer questions, for a fraction of a full-time executive.",
    glance: [["Commitment", "Monthly retainer"], ["Time", "2–8 days per month"], ["Lead", "One named, senior CISO"]],
    scope: [
      ["Strategy and roadmap", "A 12–24 month plan tied to business goals and the risks that matter."],
      ["Board and investor reporting", "Quarterly reporting on risk, progress and spend, with loss scenarios in financial terms."],
      ["AI governance", "An AI usage policy, an AI risk register and a board briefing on where AI is used and what could go wrong."],
      ["Policy and program", "Policies, standards and the operating rhythm that keeps them current."],
      ["Customer assurance", "Security questionnaires, sales calls and trust-center content."],
      ["Incident leadership", "Executive decision-making and communications during a serious incident."],
    ],
    steps: [
      ["Baseline", "Assess the program, interview leaders and review recent incidents and audits.", "Program baseline"],
      ["Prioritize", "Agree the top risks and a roadmap the leadership team signs off.", "Risk roadmap"],
      ["Run", "Lead the program day to day: meetings, owners, decisions and vendors.", "Owner tracker"],
      ["Report", "Monthly metrics for leadership and quarterly board reporting.", "Board pack"],
      ["Hand over", "When you are ready to hire, help recruit and onboard a full-time CISO.", "Hiring brief"],
    ],
    report: {
      window: "Board pack · Q3 risk register",
      engagement: "VC-2026 · Quarterly board security report",
      counts: [1, 3, 5, 4],
      list: [["Ransomware on core ERP", "critical"], ["Third-party SaaS data loss", "high"], ["No tested recovery plan", "high"], ["Phishing-led account takeover", "medium"]],
      finding: {
        id: "RISK-01",
        title: "Ransomware takes core ERP offline",
        sev: "critical",
        score: "Est. loss $1.8–4.2M",
        asset: "Finance and operations · ERP and file servers",
        summary: "Backups are online and share credentials with production. A ransomware event could stop invoicing and shipping for one to three weeks.",
        evidenceLabel: "Treatment plan",
        evidence: ["Q3  Immutable, offline backups for ERP", "Q3  Separate backup admin identities", "Q4  Recovery test with a 72-hour target", "Q4  Ransomware tabletop with executives"],
        fix: "Approve the Q3 backup project and schedule a leadership tabletop. Residual risk falls to medium on completion.",
        status: ["Board approved · on track", "ok"],
      },
    },
    deliverables: [
      ["Security strategy", "A roadmap the leadership team has agreed and can track."],
      ["Board reporting", "A quarterly pack with risks, progress and decisions needed."],
      ["Risk register", "Top risks with owners, treatment plans and financial estimates."],
      ["Policy set", "Policies and standards ready for SOC 2, ISO 27001 and customer reviews."],
    ],
    faq: [
      ["Who will our vCISO be?", "One named, senior practitioner who stays with you, backed by our wider consulting and GRC team."],
      ["How much time do we get?", "Usually two to eight days a month, adjusted as needs change."],
      ["Can the vCISO handle customer security reviews?", "Yes. Questionnaires, security calls with prospects and trust-center content are a common part of the role."],
      ["Can the vCISO own AI governance?", "Yes. Most boards now ask about AI. Your vCISO keeps the AI inventory, policy and risk register, backed by our AI Security practice."],
      ["What happens when we hire a full-time CISO?", "We help write the role, interview candidates and hand over the program cleanly."],
    ],
  },
];

export const bySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const hrefOf = (s: Service) => s.path ?? `/consulting/${s.slug}`;

export const SEV_LABEL: Record<Sev, string> = { critical: "Critical", high: "High", medium: "Medium", ok: "Resolved" };
