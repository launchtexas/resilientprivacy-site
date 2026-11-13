// Single source of truth for navigation, footer and stub routes.
// Phase-2 builders: add a real page at the href; the stub route stops matching automatically.

export type NavLink = { label: string; href: string; desc?: string };
export type NavGroup = { title: string; links: NavLink[] };
export type NavMenu = {
  label: string;
  href: string;
  intro: { title: string; body: string; cta: NavLink };
  groups: NavGroup[];
};

export const NAV: NavMenu[] = [
  {
    label: "Consulting",
    href: "/consulting",
    intro: {
      title: "Cybersecurity and AI consulting",
      body: "Cybersecurity and AI consulting. Practitioners who test, advise and stay until the fix ships.",
      cta: { label: "Consulting overview", href: "/consulting" },
    },
    groups: [
      {
        title: "Offensive Security",
        links: [
          { label: "Penetration Testing", href: "/consulting/penetration-testing", desc: "Web, API, network and cloud" },
          { label: "Red & Purple Team", href: "/consulting/red-team", desc: "Objective-based adversary simulation" },
          { label: "Application Security Review", href: "/consulting/appsec", desc: "Code and architecture review" },
        ],
      },
      {
        title: "Security Advisory",
        links: [
          { label: "Security Architecture", href: "/consulting/architecture", desc: "Design reviews and roadmaps" },
          { label: "Virtual CISO", href: "/consulting/vciso", desc: "Senior leadership, part-time" },
          { label: "How we work", href: "/consulting/how-we-work", desc: "Method, engagement models, retests" },
        ],
      },
      {
        // GRC folded in as a practice; /grc/* URLs are unchanged.
        title: "Risk & Compliance",
        links: [
          { label: "Risk & Compliance overview", href: "/grc", desc: "Readiness, evidence and audits" },
          { label: "SOC 2", href: "/grc/soc-2", desc: "Readiness through report" },
          { label: "ISO 27001", href: "/grc/iso-27001", desc: "ISMS build and certification support" },
          { label: "Privacy (GDPR, CCPA)", href: "/grc/privacy", desc: "Programs, DPIAs and records" },
          { label: "All frameworks", href: "/grc/frameworks", desc: "HIPAA, PCI DSS, NIST, CMMC, DORA, NIS2" },
          { label: "Risk Assessment", href: "/grc/risk-assessment", desc: "Quantified, prioritized risk" },
          { label: "Internal Audit", href: "/grc/internal-audit", desc: "Independent control testing" },
          { label: "Vendor Risk", href: "/grc/vendor-risk", desc: "Third-party due diligence" },
        ],
      },
    ],
  },
  {
    label: "AI Security",
    href: "/ai-security",
    intro: {
      title: "AI Security practice",
      body: "Test, govern and safely adopt the models, agents and AI tools you run.",
      cta: { label: "AI Security overview", href: "/ai-security" },
    },
    groups: [
      {
        title: "Services",
        links: [
          { label: "AI Red Teaming", href: "/ai-security/red-teaming", desc: "LLM, agent, RAG and MCP testing" },
          { label: "AI Governance", href: "/ai-security/governance", desc: "ISO/IEC 42001, NIST AI RMF, EU AI Act" },
          { label: "Secure AI Adoption", href: "/ai-security/secure-adoption", desc: "Architecture, policy, shadow AI, data controls" },
        ],
      },
      {
        title: "Research",
        links: [
          { label: "AI security research", href: "/resources/blog?topic=ai", desc: "Notes from our AI red team" },
        ],
      },
    ],
  },
  {
    label: "Managed Services",
    href: "/managed-services",
    intro: {
      title: "SOC & NOC, run for you",
      body: "24/7 analysts who monitor, investigate and respond inside your environment.",
      cta: { label: "Managed services overview", href: "/managed-services" },
    },
    groups: [
      {
        title: "Operations",
        links: [
          { label: "Managed SOC", href: "/managed-services/soc", desc: "Around-the-clock security monitoring" },
          { label: "Managed Detection & Response", href: "/managed-services/mdr", desc: "Investigation and containment" },
          { label: "Managed NOC", href: "/managed-services/noc", desc: "Network health and uptime" },
        ],
      },
      {
        title: "Readiness",
        links: [
          { label: "Incident Response Retainer", href: "/managed-services/incident-response", desc: "Responders on call when it counts" },
          { label: "Threat Hunting", href: "/managed-services/threat-hunting", desc: "Hypothesis-led hunts in your data" },
        ],
      },
    ],
  },
  {
    label: "Platform",
    href: "/platform",
    intro: {
      title: "Resilient Privacy Platform",
      body: "One console for exposure, API security, detection and data privacy.",
      cta: { label: "Platform overview", href: "/platform" },
    },
    groups: [
      {
        title: "Protect",
        links: [
          { label: "APIWall", href: "/platform/api-protection", desc: "API Protection · Discover, test and shield every API" },
          { label: "ReachMap", href: "/platform/exposure-management", desc: "Exposure Management · Attack surface and vulnerability risk" },
          { label: "CloudGrade", href: "/platform/cloud-posture", desc: "Cloud Posture · Misconfigurations across AWS, Azure, GCP" },
        ],
      },
      {
        title: "Detect & govern",
        links: [
          { label: "AlertRank", href: "/platform/threat-detection", desc: "Threat Detection · AI-assisted correlation and triage" },
          { label: "PrivacyFlow", href: "/platform/privacy-automation", desc: "Privacy Automation · Data maps, DSARs and consent" },
          { label: "ComplyLoop", href: "/platform/compliance-automation", desc: "Continuous Compliance · Controls, evidence and trust center" },
          { label: "Integrations", href: "/platform/integrations", desc: "SIEM, ticketing, identity, cloud" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    intro: {
      title: "Resources",
      body: "Research, guides and notes from our analysts and testers.",
      cta: { label: "All resources", href: "/resources" },
    },
    groups: [
      {
        title: "Learn",
        links: [
          { label: "Blog", href: "/resources/blog" },
          { label: "AI security research", href: "/resources/blog?topic=ai" },
          { label: "Guides & reports", href: "/resources/guides" },
          { label: "Case studies", href: "/resources/case-studies" },
          { label: "Sample report", href: "/resources/sample-report" },
        ],
      },
      {
        title: "Product",
        links: [
          { label: "Documentation", href: "/resources/docs" },
          { label: "Trust center", href: "/resources/trust" },
        ],
      },
    ],
  },
  {
    label: "Company",
    href: "/company",
    intro: {
      title: "Resilient Privacy Inc.",
      body: "A cybersecurity and AI consultancy, backed by 24/7 operations and our own platform.",
      cta: { label: "About us", href: "/company" },
    },
    groups: [
      {
        title: "Company",
        links: [
          { label: "About", href: "/company" },
          { label: "How we work", href: "/consulting/how-we-work" },
          { label: "Careers", href: "/company/careers" },
          { label: "Partners", href: "/company/partners" },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
  },
];

export const CTA = {
  demo: { label: "Book a demo", href: "/demo" },
  expert: { label: "Talk to an expert", href: "/contact?intent=expert" },
  scope: { label: "Scope an engagement", href: "/contact?intent=engagement" }, // preselects the contact form's "intent" field
  report: { label: "See a sample report", href: "/resources/sample-report" },
};

/** One CTA set per page type (DESIGN.md CTA rule). Heroes and FinalCta both read it, so the order never differs on a page. */
export const CTA_FOR = {
  practice: [CTA.expert, CTA.report], // home, consulting, AI security, Risk & Compliance, managed hub
  engagement: [CTA.scope, CTA.report], // closing band of consulting detail pages only
  platform: [CTA.demo, CTA.expert],
  expert: [CTA.expert], // managed services, company, resources
};
export type CtaKind = keyof typeof CTA_FOR;

/** Company contact facts (human-confirmed 2026-11-09). Footer, contact and legal pages read these. */
export const CONTACT = {
  legalName: "Resilient Privacy Inc.",
  email: "info@resilientprivacy.com",
  security: "security@resilientprivacy.com", // vulnerability reports, security policy
  legal: "legal@resilientprivacy.com", // legal, privacy and contract notices
  careers: "careers@resilientprivacy.com", // job applications
  linkedin: "https://www.linkedin.com/company/resilientprivacy/",
  address: ["2100 N Greenville Ave", "Richardson, TX 75082", "United States"],
  copyright: "© Resilient Privacy Inc.",
  /** Human facts 2026-11-09 (v6). */
  critical: "under 15 minutes, 24/7",
};

export const LEGAL: NavLink[] = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Security", href: "/legal/security" },
];

/** Every href the site links to, used to pre-render phase-2 stub pages. */
export const ALL_HREFS: string[] = Array.from(
  new Set(
    [
      ...NAV.flatMap((m) => [m.href, m.intro.cta.href, ...m.groups.flatMap((g) => g.links.map((l) => l.href))]),
      ...Object.values(CTA).map((c) => c.href),
      ...LEGAL.map((l) => l.href),
    ].map((h) => h.split(/[?#]/)[0]), // query/hash links point at an existing path
  ),
).filter((h) => h !== "/");
