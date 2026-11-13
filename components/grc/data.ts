// Copy and example mockup data for the Risk & Compliance practice pages (routes stay under /grc).
// Control IDs are the public ones (SOC 2 TSC 2017, ISO/IEC 27001:2022, NIST CSF 2.0, HIPAA, GDPR, DORA); numbers are example data and match
// the rest of the site (SOC 2 = 82 of 89 passing, 92%; ISO = 70 of 88 applicable implemented, 79%). Pages caption it "Example data".

export type Status = "pass" | "progress" | "gap" | "todo";
export type GrcService = {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  lead: string;
  forWho: string;
  /** One line on where AI lands in this service; rendered with a link to /ai-security/governance. */
  ai: string;
  mockup: {
    url: string;
    heading: string;
    stats: [string, string, string][]; // label, value, sub-line
    families: [string, number][];
    controls: [string, string, string, Status, string?][]; // id, control, owner, status, evidence file or framework mapping
  };
  steps: [string, string, string?][]; // title, body, artefact chip
  /** [eyebrow, title] over the steps; omitted = the readiness default (SOC 2, ISO 27001). */
  stepsHead?: [string, string];
  deliverables: string[];
  timeline: [string, string, string][]; // phase, span, body
  faq: [string, string][];
  related: string[];
};

export const GRC: Record<string, GrcService> = {
  "soc-2": {
    slug: "soc-2",
    name: "SOC 2",
    eyebrow: "SOC 2 Type I & Type II",
    title: "SOC 2 without the guesswork.",
    lead: "We scope the trust criteria, close the gaps, collect the evidence and sit beside you through fieldwork. You walk into the audit already knowing the answer.",
    forWho: "SaaS and service companies whose customers ask for a SOC 2 report before they sign.",
    ai: "Shipping AI features? We scope model providers, prompts and training data into the system description, so the report covers what customers now ask about.",
    mockup: {
      url: "app.resilientprivacy.com/grc/soc-2",
      heading: "SOC 2 Type II · Security, Availability",
      stats: [["Controls passing", "82 / 89", "92% · 7 left"], ["Evidence collected", "88%", "312 items"], ["Open gaps", "3", "4 not yet tested"]],
      families: [["CC1 Control environment", 100], ["CC6 Logical access", 86], ["CC7 System operations", 92], ["CC8 Change management", 74], ["A1 Availability", 63]],
      controls: [
        ["CC6.1", "MFA enforced for production access", "IT", "pass", "mfa_policy_export.json"],
        ["CC6.3", "Quarterly access reviews", "Security", "progress", "access_review_q3.csv"],
        ["CC7.2", "Security events monitored and triaged", "Managed SOC", "pass", "siem_alert_rules.json"],
        ["CC8.1", "Change approval before deploy", "Engineering", "pass", "branch_protection_billing.json"],
        ["A1.3", "Backup restore test documented", "Infra", "progress", "restore_job_log.txt · expires 6d"],
      ],
    },
    steps: [
      ["Scope", "Pick the trust services criteria, systems and Type I or Type II based on what your customers actually need.", "Scope memo"],
      ["Gap assessment", "Map your current controls to the criteria and rank the gaps by audit risk and effort.", "Gap register"],
      ["Remediate", "Write the policies, set up the controls and connect evidence sources so nothing is screenshots in a folder.", "Policies and controls"],
      ["Observation window", "Run the controls, review evidence monthly and fix drift before an auditor finds it.", "Evidence log"],
      ["Audit support", "Coordinate the independent auditor, answer requests and manage fieldwork through to the final report.", "Auditor request list"],
    ],
    deliverables: ["Scoping memo and system description draft", "Gap assessment with a prioritized remediation plan", "Policy and procedure set mapped to the criteria", "Control matrix with owners and evidence sources", "Evidence library ready for auditor requests", "Auditor coordination through the final report"],
    timeline: [["Scope and gaps", "Weeks 1–3", "Workshops, system inventory, gap report."], ["Remediation", "Weeks 3–10", "Policies, controls and evidence automation."], ["Type I or window opens", "Week 10+", "Point-in-time audit or start of the Type II observation period."], ["Type II report", "3–12 month window", "Fieldwork support and report delivery by the auditor."]],
    faq: [
      ["Type I or Type II?", "Type I checks design at a point in time; Type II checks that controls ran over a period. Most enterprise buyers ask for Type II. A Type I can unblock deals sooner."],
      ["Do you issue the SOC 2 report?", "The report is issued by an independent licensed CPA firm. We prepare you and coordinate the audit."],
      ["Which trust criteria do we need?", "Security is always in scope. Add Availability, Confidentiality, Processing Integrity or Privacy only when customers or contracts require it."],
      ["Can we reuse this for ISO 27001?", "Yes. Most SOC 2 controls map to ISO 27001 Annex A, so the second framework costs a fraction of the first."],
    ],
    related: ["iso-27001", "internal-audit", "vendor-risk"],
  },

  "iso-27001": {
    slug: "iso-27001",
    name: "ISO 27001",
    eyebrow: "ISO/IEC 27001:2022",
    title: "An ISMS your team will actually run.",
    lead: "We build the ISMS around how you already work, test it with an internal audit and prepare you for certification with an accredited body.",
    forWho: "Companies selling into Europe and global enterprises that expect a certificate, not a questionnaire.",
    ai: "ISO/IEC 42001 uses the same management-system structure. Our AI governance practice extends this ISMS to an AI management system without a second set of policies.",
    mockup: {
      url: "app.resilientprivacy.com/grc/iso-27001",
      heading: "ISO 27001:2022 · Statement of Applicability",
      stats: [["Annex A controls applicable", "88 / 93", "5 excluded with reason"], ["Implemented", "79%", "+11% in 30 days"], ["Nonconformities", "3", "1 major, 2 minor"]],
      families: [["A.5 Organizational", 84], ["A.6 People", 92], ["A.7 Physical", 100], ["A.8 Technological", 71], ["Clause 9 Evaluation", 58]],
      controls: [
        ["A.5.9", "Inventory of information assets", "IT", "pass", "asset_inventory_2026-11.csv"],
        ["A.5.15", "Access control policy", "Security", "pass", "access_control_policy_v3.pdf"],
        ["A.5.23", "Cloud services security", "Platform", "progress", "cloud_services_register.xlsx"],
        ["A.8.16", "Monitoring activities", "Managed SOC", "progress", "siem_log_source_coverage.csv"],
        ["Cl. 9.2", "Internal audit programme", "Compliance", "todo"],
      ],
    },
    steps: [
      ["Context and scope", "Define the ISMS boundary, interested parties and the objectives leadership signs off.", "ISMS scope statement"],
      ["Risk assessment", "Identify risks to information, pick treatments and produce the Statement of Applicability.", "Risk treatment plan"],
      ["Build the ISMS", "Policies, procedures and Annex A controls fitted to your stack, not copied from a template.", "Statement of Applicability"],
      ["Internal audit and review", "An independent internal audit and a management review, both required before certification.", "Internal audit report"],
      ["Certification support", "Stage 1 and Stage 2 audit preparation and response with an accredited certification body.", "Certification audit pack"],
    ],
    deliverables: ["ISMS scope and context document", "Risk register and risk treatment plan", "Statement of Applicability", "Policy set and control procedures", "Internal audit report and management review minutes", "Certification body shortlist and Stage 1 readiness check"],
    timeline: [["Scope and risk", "Weeks 1–4", "Context, asset inventory, risk assessment."], ["Build", "Weeks 4–12", "Policies, controls, Statement of Applicability."], ["Operate and audit", "Weeks 12–16", "Evidence of operation, internal audit, management review."], ["Certification", "Stage 1 and 2", "Audits by an accredited certification body."]],
    faq: [
      ["Do you certify us?", "Certification comes from an accredited certification body. We build the ISMS and prepare you for its audits."],
      ["What about ISO 42001?", "It is the AI management system standard and shares the ISMS clause structure. Our AI governance practice runs it as an extension of this work, so policies, risk method and internal audit are reused."],
      ["We already have SOC 2. How much is reusable?", "Most technical controls carry over. The new work is mostly the management system itself: risk method, objectives, internal audit and review."],
      ["What happens after certification?", "Surveillance audits each year and recertification every three years. We can run the internal audits in between."],
    ],
    related: ["soc-2", "risk-assessment", "frameworks"],
  },

  privacy: {
    slug: "privacy",
    name: "Privacy (GDPR, CCPA)",
    eyebrow: "GDPR · CCPA/CPRA · global privacy",
    title: "Privacy programs built on what your data really does.",
    lead: "We map the personal data you hold, write the records regulators expect and set up request, assessment and breach processes. Then we help you run them.",
    forWho: "Data protection officers, general counsel and product teams handling personal data across regions.",
    ai: "Personal data in AI systems is in scope: DPIAs for AI features, lawful basis for training and fine-tuning data, and retention for prompts and outputs.",
    mockup: {
      url: "app.resilientprivacy.com/grc/privacy",
      heading: "Privacy program · GDPR, CCPA",
      stats: [["Processing activities", "46", "38 documented"], ["DPIAs", "7", "2 in review"], ["Open data requests", "12", "1 due today"]],
      families: [["Records of processing", 83], ["Lawful basis and notices", 90], ["Data subject rights", 76], ["DPIAs", 58], ["Transfers and vendors", 69]],
      controls: [
        ["GDPR Art. 30", "Records of processing activities", "DPO", "progress", "ropa_2026-11.xlsx"],
        ["GDPR Art. 35", "DPIA for customer analytics", "Product", "progress", "dpia_customer_analytics_v2.docx"],
        ["CCPA §1798.120", "Do-not-sell-or-share link", "Web", "pass", "dns_link_footer.png"],
        ["GDPR Art. 33", "72-hour breach notification runbook", "Legal", "gap"],
      ],
    },
    stepsHead: ["How the program runs", "From data discovery to a privacy program that runs itself."],
    steps: [
      ["Data discovery", "Find where personal data lives across apps, warehouses and vendors, and who touches it.", "Data map"],
      ["Records and basis", "Build the record of processing, confirm lawful bases and fix notices and consent.", "Record of processing"],
      ["Assess", "Run DPIAs on high-risk processing, AI features included, and bake privacy by design into product reviews.", "DPIA"],
      ["Operate", "Data subject request handling, retention schedules, transfer mechanisms and breach response.", "Request log"],
      ["Govern", "Ongoing program management, with a virtual DPO when you need one.", "Privacy roadmap"],
    ],
    deliverables: ["Data map and record of processing activities", "Gap assessment against GDPR and US state laws", "Privacy notices and consent review", "DPIA templates and completed assessments", "Data subject request and breach runbooks", "Virtual DPO service"],
    timeline: [["Discover", "Weeks 1–3", "Interviews, system scan, data inventory."], ["Document", "Weeks 3–6", "Records of processing, lawful basis, notices."], ["Build processes", "Weeks 6–10", "Requests, DPIAs, retention, breach response."], ["Run", "Ongoing", "Quarterly reviews and program support."]],
    faq: [
      ["Do we need a DPO?", "Under GDPR, if you process sensitive data or monitor people at scale as a core activity. Many companies appoint one anyway; a virtual DPO covers the role without a full-time hire."],
      ["Which US laws do you cover?", "CCPA/CPRA and the other state privacy laws with similar rights. We map overlapping duties so you build one process, not one per state."],
      ["Can the platform automate this?", "Data discovery and request workflows, yes. Decisions about lawful basis and risk still need people, and we help with both."],
      ["Is this legal advice?", "No. We run privacy operations and assessments. Work with your counsel on legal positions; we coordinate with them."],
    ],
    related: ["vendor-risk", "risk-assessment", "frameworks"],
  },

  "risk-assessment": {
    slug: "risk-assessment",
    name: "Risk Assessment",
    eyebrow: "Cyber risk assessment",
    title: "Know which risks matter, and what they would cost.",
    lead: "We identify the threats to your business, rate them against your controls and put a range on the loss. A short list to fund, not a long list to ignore.",
    forWho: "CISOs, CFOs and boards deciding where the next security dollar goes.",
    ai: "AI risk sits in the same register: model misuse, training-data exposure and third-party AI providers, rated with the same method as every other scenario.",
    mockup: {
      url: "app.resilientprivacy.com/grc/risk-register",
      heading: "Risk register · FY27 assessment",
      stats: [["Risks assessed", "34", "6 rated high"], ["Treatment plans", "28", "82% owned"], ["Residual risk", "−37%", "after planned controls"]],
      families: [["Identity and access", 81], ["Third parties", 64], ["Ransomware resilience", 72], ["Data protection", 88], ["AI models and data", 57]],
      controls: [
        ["R-07", "Ransomware disrupts order processing", "COO", "progress", "CSF PR.DS-11 · RC.RP-01"],
        ["R-12", "Compromised vendor credentials", "Security", "gap", "CSF GV.SC-07 · PR.AA-01"],
        ["R-03", "Customer data exposed via API", "Engineering", "pass", "CSF PR.AA-05 · PR.DS-01"],
        ["R-24", "Customer data sent to an external LLM", "CTO", "todo", "CSF ID.AM-07 · NIST AI RMF MAP 4.1"],
      ],
    },
    stepsHead: ["How the assessment runs", "Five steps from risk framing to a treatment plan."],
    steps: [
      ["Frame", "Agree the scope, risk appetite and method (qualitative, quantified, or both) with leadership.", "Risk method"],
      ["Identify", "Interviews, architecture review and threat data, AI systems included, to build realistic loss scenarios.", "Risk inventory"],
      ["Analyze", "Rate likelihood and impact against existing controls; quantify the top scenarios as loss ranges.", "Rated risk register"],
      ["Treat", "Recommend treatments with cost and risk reduction, and assign owners and dates.", "Treatment plan"],
      ["Report", "A register your team maintains and a board-ready summary in plain language.", "Board summary"],
    ],
    deliverables: ["Risk methodology aligned to ISO 27005 or NIST", "Risk register with owners and ratings", "Quantified top scenarios with loss ranges", "Treatment plan with cost and effect", "Board and executive summary", "Annual refresh option"],
    timeline: [["Frame", "Week 1", "Kickoff, scope, appetite."], ["Identify", "Weeks 2–3", "Interviews, document and architecture review."], ["Analyze and treat", "Weeks 3–5", "Ratings, quantification, treatment options."], ["Report", "Week 6", "Register hand-over and executive readout."]],
    faq: [
      ["Qualitative or quantified?", "Both have a place. Qualitative ratings cover the full register quickly; we quantify the handful of scenarios that drive budget decisions."],
      ["Does this satisfy a framework requirement?", "Yes. The output meets the risk-assessment requirements in ISO 27001, SOC 2, HIPAA, PCI DSS and NIST CSF."],
      ["How often should we repeat it?", "Once a year, and after a major change such as an acquisition, a new product line or a serious incident."],
      ["Who needs to be involved?", "A sponsor from leadership, owners from IT, engineering and operations, and finance for the quantified scenarios."],
    ],
    related: ["vendor-risk", "internal-audit", "iso-27001"],
  },

  "vendor-risk": {
    slug: "vendor-risk",
    name: "Vendor Risk",
    eyebrow: "Third-party risk management",
    title: "Trust your vendors on evidence, not on a questionnaire.",
    lead: "We tier suppliers by what they can touch, assess the ones that matter and keep watching after signature. Procurement stays fast; risk stays visible.",
    forWho: "Security, procurement and compliance teams managing dozens to thousands of suppliers.",
    ai: "AI vendors get their own track: model provenance, training on your data, sub-processors, output retention and the provider's own AI governance evidence.",
    mockup: {
      url: "app.resilientprivacy.com/grc/vendors",
      heading: "Vendor inventory · 214 suppliers",
      stats: [["Critical vendors", "18", "all assessed"], ["Assessments due", "9", "next 30 days"], ["Open findings", "23", "5 high"]],
      families: [["Tier 1 assessed", 100], ["Tier 2 assessed", 78], ["Contracts with security terms", 84], ["SOC 2 / ISO reports on file", 71], ["Offboarding completed", 92]],
      controls: [
        ["V-001", "Payroll provider · Tier 1", "HR", "pass", "soc2_type2_report_2026.pdf"],
        ["V-014", "Analytics SDK · Tier 2", "Product", "gap", "security_questionnaire.xlsx · 3 high"],
        ["V-022", "Cloud backup · Tier 1", "IT", "progress", "iso27001_certificate.pdf · bridge letter due"],
        ["V-109", "Marketing agency · Tier 3", "Marketing", "todo"],
      ],
    },
    stepsHead: ["How vendor risk works", "Five steps from supplier list to monitored vendors."],
    steps: [
      ["Inventory", "Build one list of suppliers from finance, procurement and SSO data, with owners.", "Vendor list"],
      ["Tier", "Rate each vendor on data, access and business criticality so effort matches risk.", "Vendor tiers"],
      ["Assess", "Right-sized questionnaires, report review and, for critical and AI vendors, deeper validation.", "Assessment file"],
      ["Contract", "Security and privacy terms, breach notification and right-to-audit clauses that fit the tier.", "Contract clauses"],
      ["Monitor", "Reassessment on a schedule, external signals between reviews and clean offboarding.", "Reassessment schedule"],
    ],
    deliverables: ["Vendor inventory with tiers and owners", "Tiering model and assessment playbook", "Questionnaire set by tier, plus an AI vendor due-diligence module", "Assessment reports with findings", "Contract clause library", "Ongoing monitoring and reassessment calendar"],
    timeline: [["Inventory and tier", "Weeks 1–2", "Supplier list, owners, tiering."], ["Assess critical vendors", "Weeks 2–6", "Tier 1 reviews and findings."], ["Program hand-off", "Weeks 6–8", "Playbooks, templates, intake process."], ["Run", "Ongoing", "Managed assessments and monitoring, if you want us to."]],
    faq: [
      ["Can you run the program for us?", "Yes. We can design it and hand it over, or run assessments and monitoring as an ongoing service."],
      ["Do you accept vendors' SOC 2 reports?", "Yes, and we read them properly: scope, exceptions, carve-outs and complementary controls you must operate."],
      ["How do we handle vendors that won't fill in questionnaires?", "Use their public trust materials and external signals, and decide at the right level whether the residual risk is acceptable."],
      ["Does this cover DORA's register of information?", "Yes. For EU financial entities we structure the inventory to produce the register DORA requires."],
    ],
    related: ["risk-assessment", "privacy", "frameworks"],
  },

  "internal-audit": {
    slug: "internal-audit",
    name: "Internal Audit",
    eyebrow: "IT and security internal audit",
    title: "Find the control failures before the external auditor does.",
    lead: "Independent testers check that your controls are designed well and actually operate. Clear findings, agreed actions and a follow-up that confirms the fix.",
    forWho: "Audit committees, compliance leads and companies preparing for SOC 2, ISO 27001 or SOX IT controls.",
    ai: "Optional AI controls audit: model inventory, change control for prompts and models, access to AI tooling and human oversight, tested like any ITGC.",
    mockup: {
      url: "app.resilientprivacy.com/grc/internal-audit",
      heading: "Internal audit · H2 IT general controls",
      stats: [["Controls tested", "64", "of 64 in plan"], ["Effective", "57", "89% of tested"], ["Findings", "7", "1 high, 6 medium"]],
      families: [["Access management", 91], ["Change management", 83], ["IT operations", 94], ["Backup and recovery", 70], ["Vendor oversight", 76]],
      controls: [
        ["ITGC-04", "Terminated users removed in 24h", "IT", "pass", "wp_itgc04_leaver_sample_25.xlsx"],
        ["ITGC-11", "Emergency changes reviewed", "Engineering", "gap", "wp_itgc11_emergency_changes.xlsx"],
        ["ITGC-17", "Restore test performed quarterly", "Infra", "progress", "restore_job_log.txt"],
        ["ITGC-21", "Privileged access recertified", "Security", "pass", "wp_itgc21_admin_recert.xlsx"],
      ],
    },
    stepsHead: ["How the audit runs", "From audit plan to management letter."],
    steps: [
      ["Plan", "A risk-based audit plan agreed with your audit committee or compliance lead.", "Audit plan"],
      ["Walkthroughs", "Confirm each control's design with the people who run it.", "Walkthrough notes"],
      ["Test", "Sample-based testing of operating effectiveness, documented to the standard external auditors expect.", "Test workpapers"],
      ["Report", "Findings rated by risk, with root cause and management action plans.", "Audit report"],
      ["Follow up", "Retest remediated controls and close findings with evidence.", "Closed findings"],
    ],
    deliverables: ["Risk-based internal audit plan", "Control walkthrough documentation", "Test workpapers with samples and evidence", "Findings report with management responses", "Follow-up testing and closure memo", "Audit committee summary"],
    timeline: [["Plan", "Week 1", "Scope, risk ranking, request list."], ["Fieldwork", "Weeks 2–4", "Walkthroughs and testing."], ["Report", "Week 5", "Draft findings, management responses, final report."], ["Follow-up", "60–90 days later", "Retest and closure."]],
    faq: [
      ["Are you independent of our compliance work?", "Internal audit is staffed by people who did not design or run the controls they test."],
      ["Does ISO 27001 require an internal audit?", "Yes. Clause 9.2 requires a planned internal audit programme, and the certification body will ask to see it."],
      ["Can external auditors rely on your work?", "Often, for walkthroughs and evidence. Whether they rely on testing is their call; we document to make that easy."],
      ["Can you run internal audit as an ongoing function?", "Yes, as a co-sourced or fully outsourced function on an annual plan."],
    ],
    related: ["soc-2", "iso-27001", "risk-assessment"],
  },

  frameworks: {
    slug: "frameworks",
    name: "All frameworks",
    eyebrow: "Frameworks we support",
    title: "One control set. Every framework you are asked for.",
    lead: "Healthcare, payments, government, EU regulation and AI. We map your controls once, then reuse the work across each framework your customers and regulators name.",
    forWho: "Teams facing more than one framework, or a regulation that arrived with a deadline.",
    ai: "AI frameworks (ISO/IEC 42001, NIST AI RMF, EU AI Act) are run by our AI governance practice on this same unified control set.",
    mockup: {
      url: "app.resilientprivacy.com/grc/frameworks",
      heading: "Cross-framework coverage · 1 control set",
      stats: [["Unified controls", "146", "mapped to 9 frameworks"], ["Reuse rate", "68%", "evidence used more than once"], ["Frameworks in scope", "5", "2 audits this year"]],
      families: [["HIPAA Security Rule", 81], ["PCI DSS v4.0", 66], ["NIST CSF 2.0", 88], ["CMMC Level 2", 54], ["DORA", 47]],
      controls: [
        ["UC-004", "Unique user IDs and MFA", "IT", "pass", "HIPAA §164.312(a)(2)(i) · CSF PR.AA-01 · SOC 2 CC6.1"],
        ["UC-012", "Encryption of data at rest", "Platform", "pass", "HIPAA §164.312(a)(2)(iv) · PCI DSS 3.5.1 · CSF PR.DS-01"],
        ["UC-033", "Incident reporting within deadlines", "Security", "progress", "DORA Art. 19 · CSF RS.CO-02"],
        ["UC-058", "ICT third-party register", "Procurement", "gap", "DORA Art. 28(3)"],
        ["UC-071", "AI system risk classification", "AI lead", "todo", "EU AI Act Art. 6 · NIST AI RMF MAP 1.1"],
      ],
    },
    stepsHead: ["How the mapping works", "From framework list to one control set that serves them all."],
    steps: [
      ["Applicability", "Confirm which frameworks and regulations apply, and to which parts of the business.", "Applicability matrix"],
      ["Unified control set", "One set of controls mapped to every framework in scope, so each control is built once.", "Unified control set"],
      ["Gap and plan", "Gaps ranked by deadline and by how many frameworks each fix satisfies.", "Gap plan"],
      ["Implement and evidence", "Controls, policies and evidence collection shared across frameworks.", "Evidence library"],
      ["Assess", "Readiness review and coordination with the assessor, auditor or regulator for each framework.", "Readiness review"],
    ],
    deliverables: ["Applicability assessment by framework", "Unified control set with cross-mapping", "Gap report and sequenced roadmap", "Framework-specific documents (SSP, ROPA, ICT risk framework and more)", "Evidence library tagged by framework", "Assessment and audit coordination"],
    timeline: [["Applicability", "Weeks 1–2", "Which rules apply and where."], ["Map and gap", "Weeks 2–5", "Unified controls, gap report."], ["Implement", "Months 2–6", "Sequenced by deadline and reuse."], ["Assess", "Per framework", "Readiness check and assessor coordination."]],
    faq: [
      ["Which framework should we start with?", "Usually the one a customer or regulator has asked for by name. We map it to the others so the next one reuses the work."],
      ["Does the EU AI Act apply to us?", "If you place AI systems on the EU market or use them there, probably. Obligations are phased and the timetable has been under review, so we classify each system by role and risk tier and confirm the dates that apply at engagement."],
      ["Are you a CMMC assessor (C3PAO) or PCI QSA?", "We prepare you and coordinate with the accredited assessor, who issues the result."],
      ["Can software keep us compliant?", "It handles evidence collection and monitoring. People still own the decisions, and we help with both."],
    ],
    related: ["soc-2", "iso-27001", "privacy"],
  },
};

/** Framework catalogue shown on the frameworks overview page. */
export const FRAMEWORKS: [string, string, string, string, string?][] = [
  ["HIPAA", "Healthcare", "Security risk analysis, safeguards, policies and evidence for health data.", "Health-tech, providers, business associates"],
  ["PCI DSS v4.0", "Payments", "Scoping, segmentation review, gap assessment and SAQ or ROC preparation.", "Merchants, payment and e-commerce platforms"],
  ["NIST CSF 2.0 · 800-53 · 800-171", "Government", "Gap assessment and control mapping against the NIST families.", "Public sector, federal contractors"],
  ["CMMC 2.0", "Defense", "Scoping, system security plan, POA&M and assessment preparation.", "Defense industrial base suppliers"],
  ["DORA", "EU finance", "ICT risk framework, register of information, incident reporting and resilience testing.", "EU financial entities, ICT providers"],
  ["NIS2", "EU critical sectors", "Gap assessment, governance duties and the incident reporting process.", "Essential and important entities"],
  ["EU AI Act", "AI", "Role and risk classification, technical documentation and conformity preparation. Phased obligations; dates confirmed at engagement.", "AI providers and deployers", "/ai-security/governance"],
  ["NIST AI RMF", "AI", "Govern, Map, Measure, Manage, with the generative AI profile (NIST AI 600-1).", "Teams building or buying AI", "/ai-security/governance"],
  ["ISO/IEC 42001", "AI", "An AI management system that reuses your ISO 27001 structure.", "Teams building or buying AI", "/ai-security/governance"],
];
