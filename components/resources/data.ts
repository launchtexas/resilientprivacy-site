// Resources content. A section body item is a paragraph (string) or a bullet list (string[]).
// In list items, text before the first ": " renders bold.
export type Body = (string | string[])[];
export type Section = { h: string; body: Body };
export type Doc = {
  slug: string;
  title: string;
  /** Shorter <title> when `title` would push the tab title past 60 chars. */
  seo?: string;
  category: string;
  excerpt: string;
  date: string; // ISO
  /** ISO date of the last substantive edit; defaults to `date`. */
  updated?: string;
  /** Search keywords for Article JSON-LD; defaults to the category. */
  keywords?: string[];
  sections: Section[];
  related: [string, string][]; // [label, href]
};

export const AUTHOR = "Resilient Privacy Research";
export const CONTACT = "info@resilientprivacy.com";

export const POSTS: Doc[] = [
  {
    slug: "ai-agent-mcp-security",
    title: "AI agents and MCP: securing the tools your models can call",
    seo: "AI agent and MCP security",
    category: "AI security",
    excerpt: "Agents turn text into actions. The Model Context Protocol makes connecting tools easy, which moves the real attack surface to tool permissions, tokens and the servers you install.",
    date: "2026-11-09",
    keywords: ["AI agent security", "Model Context Protocol", "MCP security", "tool poisoning", "prompt injection", "confused deputy", "OWASP Top 10 for Agentic Applications", "MITRE ATLAS", "NIST AI RMF"],
    related: [["MCP & Agent Tool-Permission Review", "/ai-security/red-teaming#mcp-review"], ["AI red teaming", "/ai-security/red-teaming"], ["LLM application threat model", "/resources/blog/llm-application-security"]],
    sections: [
      {
        h: "Why agents change the question",
        body: [
          "A chat assistant that only answers questions can embarrass you. An agent that can call tools can act for you: read a mailbox, query a database, open a pull request, issue a refund. The model is the same; what changed is what its output is wired to. Security review has to follow that wiring.",
          "The Model Context Protocol (MCP) is an open protocol that standardizes how AI applications connect to tools and data. A host application (an IDE, a desktop assistant, an internal agent platform) runs MCP clients, and each client talks to an MCP server that exposes tools, resources and prompts. That standardization is the point: one server can plug into many hosts. It also means one badly scoped server can plug into many hosts.",
          "The MCP specification says this plainly. Its security principles state that tools represent arbitrary code execution and must be treated with caution, that descriptions of tool behavior should be considered untrusted unless they come from a trusted server, and that hosts must obtain explicit user consent before invoking any tool. It also notes that MCP cannot enforce these principles at the protocol level. Enforcement is the implementer's job, which in practice means yours.",
        ],
      },
      {
        h: "Where the attack surface moved",
        body: [
          "Most agent incidents we would expect to see are not exotic model attacks. They are old problems (over-broad permissions, trusted input that isn't, unverified software) arriving through a new channel. The useful map has four parts:",
          [
            "The context window: every piece of text the model reads, including tool descriptions and tool results, can carry instructions.",
            "The tool layer: what each tool can do, with whose credentials, and whether anything checks the call before it runs.",
            "The server supply chain: who wrote each MCP server, how it was installed, and whether it can change after you approved it.",
            "The evidence trail: whether you can reconstruct which instruction led to which tool call, on whose behalf, with what result.",
          ],
          "The OWASP Top 10 for Agentic Applications (published December 2025 by the OWASP GenAI Security Project) gives these risks names, from ASI01 Agent Goal Hijack and ASI02 Tool Misuse and Exploitation to ASI03 Identity and Privilege Abuse and ASI04 Agentic Supply Chain Vulnerabilities. It extends the OWASP Top 10 for LLM Applications 2025, where the matching entries are LLM01 Prompt Injection, LLM03 Supply Chain and LLM06 Excessive Agency.",
        ],
      },
      {
        h: "Prompt injection through tool output",
        body: [
          "Indirect prompt injection is the agent-era version of an old lesson: data and instructions share a channel. An agent asked to summarize a web page, triage an inbox or read a ticket will also read any instructions an attacker placed there. If the agent holds a tool that can send data out, the injected text can ask it to.",
          "MITRE ATLAS, the knowledge base of adversary techniques against AI systems, now catalogs this chain directly: LLM Prompt Injection (AML.T0051) leading to AI Agent Tool Invocation (AML.T0053) and Exfiltration via AI Agent Tool Invocation (AML.T0086). Its case study AML.CS0045 describes a proof of concept in which a web-scraping MCP server returned a page containing instructions that told the coding agent to run a shell command exfiltrating credential files; the client's prompt before running commands was the control that could stop it.",
          "Filters and instruction-hierarchy training reduce the success rate of injection. None of them removes it. Design as if some injected instruction will eventually be followed, and decide in advance what it must not be able to reach. ATLAS lists that as a mitigation in its own right: Restrict AI Agent Tool Invocation on Untrusted Data (AML.M0030).",
        ],
      },
      {
        h: "Tool poisoning, shadowing and rug pulls",
        body: [
          "The model reads a tool's name, description and parameter schema to decide when and how to call it. The user usually sees a short label. In April 2025 Invariant Labs published a disclosure showing that a tool description can carry hidden instructions: a harmless-looking add tool whose description told the agent to read an SSH private key and the MCP configuration file and pass them along in an unused parameter, without mentioning it to the user.",
          "The same disclosure described two variants that matter for review:",
          [
            "Shadowing: a malicious server's description changes how the agent uses a different, trusted server's tool. In their demonstration it redirected every email sent through a legitimate send tool to the attacker, even when the user named another recipient. The malicious tool never has to be called.",
            "Rug pull: a server changes its tool descriptions after the user approved them. MCP lets servers notify clients that their tool list has changed, so an approval given on day one says little about what is running on day thirty.",
          ],
          "Sandboxing the server process does not help here, because the attack runs through the agent's own instruction following. The defenses are visibility (show the full description the model sees), pinning (hash approved tool definitions and alert on change), and isolation between servers so one server cannot steer another's tools. ATLAS tracks the same ideas as AI Agent Tool Poisoning (AML.T0110) and Publish Poisoned AI Agent Tool (AML.T0104).",
        ],
      },
      {
        h: "Confused deputies, token scope and passthrough",
        body: [
          "A confused deputy is a program with legitimate authority that is tricked into using it for someone else. Agents are deputies by design. Two versions show up in MCP deployments.",
          "The first is in the OAuth plumbing. The MCP Security Best Practices page describes an attack on MCP proxy servers that use a single static client ID with a third-party API and also allow dynamic client registration: a consent cookie from an earlier, legitimate approval lets an attacker's newly registered client receive an authorization code without the user seeing a consent screen. The specification requires per-client consent stored server side, exact redirect URI matching and single-use state values. It also forbids token passthrough: an MCP server must not accept tokens that were not issued for it, because forwarding them breaks audience checks, rate limits and the audit trail.",
          "The second is simpler and more common: the tool runs with a shared service account. The user asking the agent can read three records; the tool can read every record. An injected instruction then inherits the tool's authority, not the user's. The specification's scope guidance applies directly: start with minimal scopes, step up with targeted challenges when a privileged operation is first attempted, and avoid wildcard or omnibus scopes. The same page lists treating claimed scopes as sufficient without server-side authorization logic as a common mistake.",
        ],
      },
      {
        h: "The MCP server supply chain",
        body: [
          "An MCP server is software you run, often installed with one command from a public registry or a README. The specification's section on local MCP server compromise is blunt: a client configuration can carry a malicious startup command, a server can carry a malicious payload, and a local server left listening on localhost can be reached through DNS rebinding. Clients that offer one-click setup must show the exact command before running it and should run servers sandboxed with minimal privileges.",
          "Treat servers the way you treat dependencies. Know where each one came from, who maintains it, which version you approved and what changed since. Remote servers add a second question: who operates them, and what happens to the data and tokens they receive. The MCP specification also warns that a malicious server can feed a client URLs during OAuth discovery that point at internal addresses or cloud metadata endpoints (server-side request forgery), and authorization URLs with dangerous schemes that turn into script or command execution in a careless client.",
        ],
      },
      {
        h: "Logging and forensics for agents",
        body: [
          "When something goes wrong, the first question is which input caused which action. Many agent deployments cannot answer it, because the conversation, the tool calls and the downstream API logs live in three places with no shared identifier. Token passthrough makes this worse: the downstream service logs the request under an identity that is not the agent's.",
          "A minimum useful record, per tool call:",
          [
            "Who: the human user, the agent or host, the MCP client and server, and the token audience and scopes used.",
            "What: tool name, the hash of the tool definition at call time, arguments and a truncated result.",
            "Why: a reference to the context that preceded the call, including which tool results or documents were in the window.",
            "Decision: whether the call was auto-approved, approved by a person, or blocked, and by which rule.",
            "Correlation: one ID that joins the agent log, the MCP server log and the downstream API log.",
          ],
          "Send this to the same place your security operations team already looks, keep it under the retention rules of the data it contains, and alert on the patterns that matter: a tool definition hash that changed, a sensitive read followed by an external write in the same task, and scope step-ups outside normal hours.",
        ],
      },
      {
        h: "A review method that works",
        body: [
          "This is the method behind our MCP & Agent Tool-Permission Review. It fits in one to two weeks for a typical deployment and produces a permission matrix you can act on.",
          [
            "Inventory: list every host, agent, MCP server and tool in use, including servers developers installed locally. Record source, version, operator and owner.",
            "Map authority: for each tool, record the credential it uses, the scopes granted, and the widest action it can take. Mark tools that read sensitive data and tools that can send data out or change state.",
            "Find the dangerous pairs: any task where an untrusted input source and an outbound or destructive tool can share one context window. These are the paths an injection would use.",
            "Read the descriptions: review the full tool names, descriptions and schemas the model sees, not the UI label. Look for instructions, references to other tools, and requests for unrelated data.",
            "Check the OAuth path: token audience validation, no passthrough, per-client consent on proxies, exact redirect matching, scope minimization and step-up.",
            "Test it: plant instructions in content the agent will read and try to reach each dangerous pair; change a tool description after approval and see whether anyone notices.",
            "Verify the evidence: confirm each test produced a log record that your security team could find and reconstruct.",
            "Fix and retest: least privilege per tool and per user, human approval for destructive or costly calls, pinned definitions, and segmentation between servers. Retest after every model, prompt or server change.",
          ],
          "Use MITRE ATLAS techniques to scope the testing and its mitigations (for example AML.M0028 AI Agent Tools Permissions Configuration and AML.M0029 Human In-the-Loop for AI Agent Actions) to name the fixes. For governance, the results map onto the NIST AI Risk Management Framework functions: the inventory supports Govern and Map, testing is Measure, and the fix plan is Manage. NIST's Generative AI Profile (NIST AI 600-1) adds risks specific to generative systems, including information security.",
        ],
      },
      {
        h: "Checklist",
        body: [
          "Use this before connecting a new MCP server or giving an agent a new tool.",
          [
            "Inventory: every MCP server and tool has a named owner, a known source and a pinned version.",
            "Descriptions: full tool descriptions were read by a person and are hashed; a change triggers re-approval.",
            "Credentials: tools act with the requesting user's permissions, not a shared service account.",
            "Scopes: tokens carry the minimum scopes; no wildcard or omnibus scopes; step-up for privileged operations.",
            "Audience: servers reject tokens not issued to them and never pass client tokens through.",
            "Dangerous pairs: no task combines untrusted input with an outbound or destructive tool without a human check.",
            "Approval: destructive, costly or external actions require explicit human approval that shows the real arguments.",
            "Isolation: local servers run sandboxed with limited file system and network access.",
            "Outputs: tool results are treated as untrusted input and validated before reaching another system.",
            "Network: OAuth discovery and redirects block private address ranges and non-HTTPS schemes.",
            "Logging: every tool call is logged with user, tool, definition hash, arguments, decision and a correlation ID.",
            "Retesting: injection and rug-pull tests rerun after each model, prompt or server change.",
          ],
        ],
      },
      {
        h: "Sources",
        body: [
          [
            "MCP specification: Model Context Protocol, revision 2026-07-28, Security and Trust & Safety principles ([modelcontextprotocol.io/specification](https://modelcontextprotocol.io/specification)).",
            "MCP Security Best Practices: confused deputy, token passthrough, SSRF, local server compromise and scope minimization ([modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices](https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices)).",
            "OWASP Top 10 for Agentic Applications 2026: OWASP GenAI Security Project, December 2025 ([genai.owasp.org](https://genai.owasp.org)).",
            "OWASP Top 10 for LLM Applications 2025: LLM01 Prompt Injection, LLM03 Supply Chain, LLM06 Excessive Agency ([genai.owasp.org/llm-top-10](https://genai.owasp.org/llm-top-10)).",
            "MITRE ATLAS: techniques AML.T0051, AML.T0053, AML.T0086, AML.T0104, AML.T0110; mitigations AML.M0028, AML.M0029, AML.M0030; case study AML.CS0045 ([atlas.mitre.org](https://atlas.mitre.org)).",
            "Invariant Labs: MCP Security Notification: Tool Poisoning Attacks, April 2025 ([invariantlabs.ai/blog/mcp-security-notification](https://invariantlabs.ai/blog/mcp-security-notification)).",
            "NIST AI RMF: AI Risk Management Framework 1.0, NIST AI 100-1, and the Generative AI Profile, NIST AI 600-1 ([nist.gov/itl/ai-risk-management-framework](https://www.nist.gov/itl/ai-risk-management-framework)).",
          ],
        ],
      },
    ],
  },
  {
    slug: "llm-application-security",
    title: "Securing LLM applications: a threat model that fits on one page",
    seo: "LLM application threat model",
    category: "AI security",
    excerpt: "Prompt injection is not a bug you patch once. Treat the model as an untrusted component and design the controls around what it can reach.",
    date: "2026-11-03",
    related: [["AI security practice", "/ai-security"], ["Penetration testing", "/consulting/penetration-testing"]],
    sections: [
      {
        h: "Start from what the model can touch",
        body: [
          "An LLM feature is rarely just a model. It is a prompt template, a retrieval layer, a set of tools, and the data and permissions those tools carry. The useful security question is not whether the model can be tricked. Assume it can. Ask what happens when it is.",
          "Draw the data flow on one page. List every source that can put text into the context window: users, uploaded files, retrieved documents, web pages, emails, tool results. Then list everything the model's output can cause: a reply, a database query, an API call, a ticket, a code change. Risk sits where untrusted input meets a consequential action.",
        ],
      },
      {
        h: "The risks that matter in practice",
        body: [
          "The OWASP Top 10 for LLM Applications (2025 edition) is a good shared vocabulary. The entries that show up most in real assessments:",
          [
            "Prompt injection: instructions in a user message, or hidden in content the model reads (indirect injection), that override what the developer intended.",
            "Sensitive information disclosure: the model repeats data from its context, training or retrieval that the current user should not see.",
            "Improper output handling: model output passed straight into a shell, SQL query, HTML page or another system without validation.",
            "Excessive agency: tools that hold more permissions than the task needs, or act without a human check.",
            "System prompt leakage: secrets or business rules placed in the system prompt, which should be treated as public.",
            "Vector and embedding weaknesses: retrieval that ignores the requesting user's permissions, so search becomes a data-leak path.",
            "Unbounded consumption: no limits on tokens, calls or cost per user, which turns into a billing or availability problem.",
          ],
        ],
      },
      {
        h: "Controls that hold up",
        body: [
          [
            "Least privilege for tools: give each tool credentials scoped to the requesting user, not a shared service account.",
            "Human approval for high-impact actions: moving money, deleting data, changing access or sending messages outside the company.",
            "Authorization in the retrieval layer: filter documents by the caller's permissions before they reach the prompt.",
            "Output treated as untrusted input: validate against a schema, encode for the destination, use parameterized queries.",
            "No secrets in prompts: keys and tokens live in the tool layer, never in text the model can repeat.",
            "Provenance labels: mark which context is trusted instruction and which is untrusted content. This reduces injection; it does not remove it.",
            "Limits: per-user and per-tenant rate, token and spend caps.",
            "Logging: prompts, retrieved documents, tool calls and outputs, kept under the same retention rules as the data they contain.",
          ],
        ],
      },
      {
        h: "Test it like an attacker would",
        body: [
          "Generic jailbreak scanners catch known strings. They do not understand your business logic. Test the specific workflow: plant instructions in a document the assistant will summarize, ask it to act on another tenant's record, try to make it leak data through a rendered link or image.",
          "Retest after every model, prompt or tool change, because behavior shifts between versions. MITRE ATLAS catalogs adversary techniques against AI systems and works well as a scoping checklist.",
        ],
      },
      {
        h: "Governance without paperwork",
        body: [
          "Keep an inventory of the models, providers, prompts and tools you run in production, each with an owner. If you need a structure to show auditors or the board, the NIST AI Risk Management Framework (Govern, Map, Measure, Manage) and ISO/IEC 42001 both fit. Start with the inventory and the feature with the most agency.",
        ],
      },
    ],
  },
  {
    slug: "ctem-in-practice",
    title: "CTEM in practice: from vulnerability lists to exposure decisions",
    seo: "CTEM in practice",
    category: "Exposure management",
    excerpt: "More scanners produce more rows. Continuous Threat Exposure Management turns findings into a repeating cycle that ends in fixes.",
    date: "2026-10-27",
    related: [["ReachMap (exposure management)", "/platform/exposure-management"], ["Threat hunting", "/managed-services/threat-hunting"]],
    sections: [
      {
        h: "Why scanning more doesn't help",
        body: [
          "Most security teams already have more findings than they can fix. Adding another scanner adds rows, not decisions. Continuous Threat Exposure Management (CTEM), a framework Gartner described in 2022, reframes the work as a recurring cycle whose output is fixed exposures, not reports.",
          "CTEM is a program, not a product. Tools help with parts of it, but the cycle only works when security and the teams that own systems agree on what gets fixed and by when.",
        ],
      },
      {
        h: "The five stages",
        body: [
          [
            "Scoping: pick a business-relevant slice, such as the external attack surface, one critical application or SaaS identity. Not everything at once.",
            "Discovery: find the assets and exposures in that scope: vulnerabilities, misconfigurations, exposed credentials, risky identities and unmanaged assets.",
            "Prioritization: rank by exploitability and business impact, not severity score alone. Useful inputs are reachability, known exploitation (for example CISA's Known Exploited Vulnerabilities catalog), EPSS probability and what the asset leads to.",
            "Validation: prove whether an attack path actually works, with attack path analysis, breach and attack simulation or manual testing, and confirm your controls detect it.",
            "Mobilization: get the fix done. Named owners, tickets in the owning team's tracker, agreed timelines, and exceptions that expire.",
          ],
        ],
      },
      {
        h: "Where programs stall",
        body: [
          [
            "Mobilization: security finds, other teams fix. Without named owners and agreed timelines, exposures simply age.",
            "Scope creep: the first cycle tries to cover every asset and never finishes.",
            "Severity-only ranking: a critical score on an unreachable host outranks a medium on an internet-facing login page.",
            "No validation: teams argue about theoretical risk instead of looking at evidence that a path works.",
          ],
        ],
      },
      {
        h: "A first 90 days",
        body: [
          [
            "Weeks 1–2: choose one scope and name the system owners in it.",
            "Weeks 3–6: merge discovery sources into one asset and exposure inventory, and deduplicate.",
            "Weeks 7–10: rank with exploitability signals and validate the top items.",
            "Weeks 11–13: agree fix timelines, track closure, review what worked and pick the next scope.",
          ],
        ],
      },
      {
        h: "What to measure",
        body: [
          "Measure outcomes, not volume. Track the time from discovery to verified fix for validated exposures, the share of attack paths to critical assets that are closed, and the number of exceptions past their expiry date. A rising count of findings discovered tells you about your scanners, not your risk.",
        ],
      },
    ],
  },
  {
    slug: "soc-2-first-audit",
    title: "SOC 2 readiness: where first audits stall",
    seo: "Where first SOC 2 audits stall",
    category: "Compliance",
    excerpt: "Most first SOC 2 audits don't fail on missing policies. They stall on evidence that controls actually ran during the review period.",
    date: "2026-10-20",
    related: [["SOC 2 readiness checklist", "/resources/guides/soc-2-readiness-checklist"], ["SOC 2 services", "/grc/soc-2"]],
    sections: [
      {
        h: "What SOC 2 is",
        body: [
          "SOC 2 is an attestation report issued by an independent CPA firm against the AICPA's Trust Services Criteria. Security (the common criteria) is always in scope. Availability, Confidentiality, Processing Integrity and Privacy are added when customers need them.",
          "There is no SOC 2 certificate and no pass mark. The auditor gives an opinion on your controls and lists any exceptions found in testing. Customers read those exceptions.",
        ],
      },
      {
        h: "Type I or Type II",
        body: [
          "A Type I report evaluates whether controls are suitably designed at a point in time. A Type II report tests whether they operated effectively over a review period, commonly between three and twelve months. Many buyers ask for Type II. A Type I can unblock deals while the Type II period runs.",
        ],
      },
      {
        h: "Where first audits stall",
        body: [
          [
            "Vague scope: the system description doesn't match what you actually run, so the auditor finds systems you forgot.",
            "Policies that aren't followed: auditors sample evidence that controls ran, not the policy document.",
            "Access reviews: missing, late, or approved without anyone checking the list.",
            "Change management: changes that reach production outside the reviewed, ticketed path.",
            "Offboarding: accounts that outlive employment, especially in SaaS tools outside single sign-on.",
            "Vendor management: no inventory of vendors that hold customer data and no record of reviewing them.",
            "Evidence: screenshots collected the week before fieldwork, with no proof they reflect the whole period.",
          ],
        ],
      },
      {
        h: "Make evidence a by-product",
        body: [
          "Pull evidence continuously from systems of record (identity provider, cloud accounts, version control, ticketing) instead of building screenshot folders. Give every control a named owner. Run a readiness assessment, a gap analysis against the criteria, before the review period starts so that fixing gaps doesn't eat into it.",
        ],
      },
      {
        h: "Choosing the auditor",
        body: [
          "Only a licensed CPA firm can issue the report. Ask about experience with companies of your size and stack, how they sample, which evidence formats they accept from compliance platforms, and how long they take from fieldwork to report. Keep readiness and attestation separate: the firm that helps you build controls should not be the one that audits them.",
        ],
      },
    ],
  },
  {
    slug: "api-security-authorization",
    title: "API security starts with authorization, not the gateway",
    seo: "API security starts with authorization",
    category: "Application security",
    excerpt: "The most damaging API bugs need no exploit, just a valid token and someone else's object ID. Fix authorization first.",
    date: "2026-10-13",
    related: [["APIWall (API protection)", "/platform/api-protection"], ["Application security consulting", "/consulting/appsec"]],
    sections: [
      {
        h: "The common failure is logic, not syntax",
        body: [
          "Serious API incidents rarely need an exotic exploit. They need a valid session and a different identifier in the URL. A gateway, a WAF and TLS all see a well-formed request from a logged-in user, and let it through. That is why the OWASP API Security Top 10 (2023) puts Broken Object Level Authorization first.",
        ],
      },
      {
        h: "The OWASP API Security Top 10, in plain terms",
        body: [
          [
            "Broken object level authorization: a user can read or change objects that belong to someone else by changing an ID.",
            "Broken authentication: weak token handling, missing expiry, or login flows that allow credential stuffing.",
            "Broken object property level authorization: the API returns or accepts fields the caller should not see or set.",
            "Unrestricted resource consumption: no limits on request size, rate or cost.",
            "Broken function level authorization: ordinary users can call admin functions.",
            "Unrestricted access to sensitive business flows: automation abuse of flows like sign-up, checkout or booking.",
            "Server-side request forgery: the API fetches a URL the attacker supplies.",
            "Security misconfiguration: verbose errors, permissive CORS, missing hardening.",
            "Improper inventory management: old versions and forgotten hosts still answering.",
            "Unsafe consumption of APIs: trusting data from third-party APIs without validation.",
          ],
        ],
      },
      {
        h: "Inventory before protection",
        body: [
          "You cannot protect endpoints you don't know about: old versions, staging hosts exposed to the internet, partner integrations and endpoints added by one team in a hurry. Build the inventory from three sources and compare them: API specifications, gateway and load balancer logs, and live traffic. Endpoints in traffic but missing from the spec are shadow APIs. Deprecated versions that still answer are zombie APIs. Both should be owned or removed.",
        ],
      },
      {
        h: "Controls that work",
        body: [
          [
            "Central authorization: check object ownership on every request in a shared library or policy layer, never from client-supplied data alone.",
            "Explicit response schemas: return only the fields the caller may see, instead of serializing whole objects.",
            "Business-aware rate limits: limit by user, token and action, not just by IP address.",
            "Schema validation at the edge: reject requests that don't match the OpenAPI definition.",
            "Short-lived, audience-restricted tokens, revoked on logout and password change.",
            "Outbound allowlists: stop SSRF by limiting where the API may fetch from.",
            "Untrusted upstreams: validate responses from third-party APIs like any other input.",
          ],
        ],
      },
      {
        h: "Test the logic",
        body: [
          "Scanners find missing headers. They rarely find broken object level authorization, because they don't know which user owns which object. Write authorization tests with two users per role and assert that cross-access fails, then run them in CI on every change. Pair that with periodic manual testing focused on business flows.",
        ],
      },
    ],
  },
];

export const GUIDES: Doc[] = [
  {
    slug: "soc-2-readiness-checklist",
    title: "SOC 2 readiness checklist",
    category: "Checklist",
    excerpt: "The controls, evidence and decisions to have in place before your SOC 2 review period starts, grouped by area.",
    date: "2026-10-30",
    related: [["SOC 2 services", "/grc/soc-2"], ["ComplyLoop (continuous compliance)", "/platform/compliance-automation"]],
    sections: [
      {
        h: "Scope and planning",
        body: [
          [
            "Trust Services Criteria chosen: Security, plus any of Availability, Confidentiality, Processing Integrity and Privacy that customers ask for.",
            "System boundary written down: products, infrastructure, people, processes and data in scope.",
            "Report type and review period agreed (Type I, or Type II with start and end dates).",
            "Audit firm selected; it is independent of whoever helps with readiness.",
            "Executive sponsor named, and an owner assigned to every control.",
          ],
        ],
      },
      {
        h: "Governance and policies",
        body: [
          [
            "Information security policy approved by leadership and reviewed yearly.",
            "Supporting policies: acceptable use, access control, change management, incident response, vendor management, data retention.",
            "Risk assessment performed and documented, with treatment decisions.",
            "Security awareness training at hire and yearly, with completion records.",
            "Background checks performed as your policy defines.",
          ],
        ],
      },
      {
        h: "Access control",
        body: [
          [
            "Single sign-on and multi-factor authentication on production and business-critical systems.",
            "Role-based access with least privilege, and documented approval for access requests.",
            "Periodic access reviews with evidence of who reviewed what and what changed.",
            "Joiner, mover and leaver process tied to HR events; access removed promptly at exit.",
            "Privileged and production access logged.",
          ],
        ],
      },
      {
        h: "Change management",
        body: [
          [
            "Peer review required before merge; protected main branch.",
            "Deployments only through the CI/CD pipeline.",
            "The author of a change cannot approve it alone.",
            "Emergency change process documented, with after-the-fact review.",
          ],
        ],
      },
      {
        h: "Operations and monitoring",
        body: [
          [
            "Central logging with defined retention; security alerts routed to an owner and reviewed.",
            "Vulnerability scanning with remediation timelines by severity.",
            "Endpoint protection and disk encryption on company laptops.",
            "Backups configured and tested by restoring them.",
          ],
        ],
      },
      {
        h: "Incident response and continuity",
        body: [
          [
            "Incident response plan with roles, contacts and customer notification steps.",
            "Tabletop exercise run and documented.",
            "Business continuity and disaster recovery plan, tested.",
          ],
        ],
      },
      {
        h: "Vendors and data",
        body: [
          [
            "Inventory of vendors that store or process customer data.",
            "Risk review before onboarding a vendor; SOC 2 or equivalent reports collected for critical vendors.",
            "Data classification defined; encryption in transit and at rest.",
            "Retention and secure disposal schedule followed.",
          ],
        ],
      },
      {
        h: "Before the review period opens",
        body: [
          [
            "Readiness assessment complete and gaps closed.",
            "Evidence collection automated from systems of record where possible.",
            "System description drafted and checked against reality.",
            "Kickoff scheduled with the auditor; evidence request list agreed.",
          ],
        ],
      },
    ],
  },
  {
    slug: "choosing-an-mdr-provider",
    title: "Choosing an MDR provider: questions that separate the field",
    seo: "Choosing an MDR provider",
    category: "Buyer's guide",
    excerpt: "Every managed detection and response provider says 24/7. These questions show what they actually watch, what they do and who does it.",
    date: "2026-10-23",
    related: [["Managed detection and response", "/managed-services/mdr"], ["Incident response", "/managed-services/incident-response"]],
    sections: [
      {
        h: "Know what you're buying",
        body: [
          "Managed detection and response (MDR) means a provider watches your telemetry around the clock, investigates alerts and takes containment actions. A managed security service provider (MSSP) traditionally manages devices and forwards alerts for you to act on. A managed SOC can be either, depending on the contract. Write down which of these you need before you compare prices.",
        ],
      },
      {
        h: "Coverage",
        body: [
          [
            "Telemetry: which sources are covered: endpoint, identity provider, cloud control plane, email, network, SaaS apps.",
            "Tools: do they work with the tools you own, or require their own stack?",
            "Exclusions: what is explicitly out of scope, in writing.",
          ],
        ],
      },
      {
        h: "Response",
        body: [
          [
            "Actions: which can they take without asking, such as isolating a host, disabling an account or revoking sessions?",
            "Approval: which actions need your approval, and how fast can you give it at 3 a.m.?",
            "Playbooks: are they agreed during onboarding and reviewed afterwards?",
            "Escalation: is incident response included, or a separate retainer?",
          ],
        ],
      },
      {
        h: "People and detection quality",
        body: [
          [
            "Staffing: is 24/7 coverage in-house, or partly subcontracted? Where are analysts located?",
            "Detections: who writes and tunes them, and how often are they reviewed against your environment?",
            "Hunting: is proactive threat hunting included, and what does a hunt report look like?",
            "Evidence: ask for a redacted sample incident report and a sample monthly review.",
          ],
        ],
      },
      {
        h: "Transparency and data",
        body: [
          [
            "Visibility: can you see the raw events and the full investigation timeline, not just a summary?",
            "Ownership: who owns the data, where it is stored, and how you export it at contract end.",
            "Reporting: what you get each month, and who presents it.",
          ],
        ],
      },
      {
        h: "Contract terms",
        body: [
          [
            "Response time: define it precisely. Time to acknowledge an alert is not time to contain a threat.",
            "Price drivers: endpoints, users, data volume or a mix; what happens when you grow.",
            "Exit: notice period, data return and handover of detections you paid to build.",
          ],
        ],
      },
      {
        h: "Run a proof of value",
        body: [
          "Shortlist two or three providers and run each on your real environment for a few weeks. During the trial, run a controlled test, such as a purple-team exercise, and compare who detected what, how fast they told you, and how clear the explanation was.",
          [
            "Red flag: response times quoted without a definition.",
            "Red flag: no access to underlying data.",
            "Red flag: a sample report full of alert counts and no decisions.",
            "Red flag: onboarding with no tuning period.",
          ],
        ],
      },
    ],
  },
];

export type Story = {
  slug: string;
  sector: string;
  title: string;
  challenge: string;
  approach: string[];
  outcome: string[];
  services: [string, string][];
};

export const STORY_LABEL = "Illustrative example";

export const STORIES: Story[] = [
  {
    slug: "payments-api",
    sector: "Fintech · payments platform",
    title: "Mapping the API surface before a partner launch",
    challenge: "A payments company was about to open its APIs to partners. Its engineering teams had added endpoints over several years, and nobody could say with confidence which versions were still live or which returned card-adjacent data.",
    approach: [
      "Built an API inventory from specs, gateway logs and live traffic, and flagged endpoints present in traffic but missing from the specs.",
      "Ran a focused penetration test on authorization: two users per role, cross-tenant access attempts on every object type.",
      "Added schema validation and per-client rate limits at the edge, and authorization tests to CI.",
    ],
    outcome: [
      "Deprecated API versions retired before launch.",
      "Authorization findings fixed and retested before partners received credentials.",
    ],
    services: [["APIWall (API protection)", "/platform/api-protection"], ["Penetration testing", "/consulting/penetration-testing"]],
  },
  {
    slug: "healthtech-soc2",
    sector: "Healthcare SaaS",
    title: "From security questionnaires to a SOC 2 Type II report",
    challenge: "A healthcare software vendor was losing weeks on every hospital security review. It had policies, but no attestation and no way to show controls had operated over time.",
    approach: [
      "Ran a readiness assessment against the Trust Services Criteria and HIPAA Security Rule requirements, and closed the gaps.",
      "Connected the identity provider, cloud and code repositories to collect evidence continuously.",
      "A fractional CISO owned the program and the auditor relationship through the review period.",
    ],
    outcome: [
      "Type I report first, then Type II after the review period.",
      "Security reviews answered from a shared answer library and trust page.",
    ],
    services: [["SOC 2", "/grc/soc-2"], ["ComplyLoop (continuous compliance)", "/platform/compliance-automation"], ["vCISO", "/consulting/vciso"]],
  },
  {
    slug: "manufacturer-mdr",
    sector: "Manufacturing · multi-site",
    title: "24/7 coverage for a lean IT team across several plants",
    challenge: "A manufacturer with a small IT team ran plants on networks that had grown separately. Alerts from its endpoint tool went to a shared inbox that nobody watched at night.",
    approach: [
      "Onboarded endpoint, identity and firewall telemetry into managed detection and response, with containment playbooks agreed up front.",
      "Network operations monitoring for plant connectivity, with one escalation path for security and uptime issues.",
      "Ran a ransomware tabletop with plant managers and leadership.",
    ],
    outcome: [
      "Alerts triaged around the clock, with host isolation pre-approved for confirmed threats.",
      "A written, tested decision path for a ransomware event.",
    ],
    services: [["MDR", "/managed-services/mdr"], ["NOC", "/managed-services/noc"], ["Incident response", "/managed-services/incident-response"]],
  },
];

/** Blog topics for /resources/blog?topic=<id>; each Doc category maps to one. */
export const TOPICS = [["ai", "AI security"], ["offensive", "Offensive security"], ["compliance", "Compliance"], ["operations", "Operations"]] as const;
export type Topic = (typeof TOPICS)[number][0];
const TOPIC_OF: Record<string, Topic> = { "AI security": "ai", "Application security": "offensive", Compliance: "compliance", Checklist: "compliance", "Exposure management": "operations", "Buyer's guide": "operations" };
export const topicOf = (d: Doc): Topic => TOPIC_OF[d.category] ?? "operations";

export const postBySlug = (s: string) => POSTS.find((p) => p.slug === s);
export const guideBySlug = (s: string) => GUIDES.find((g) => g.slug === s);

const words = (d: Doc) => d.sections.flatMap((s) => s.body.flat()).join(" ").split(/\s+/).length;
export const readTime = (d: Doc) => `${Math.ceil(words(d) / 200)} min read`;
export const fmtDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
