// /llms.txt (llmstxt.org): a plain map of the site for AI answer engines, built from the nav so it never drifts.
import { CONTACT, LEGAL, NAV } from "@/lib/nav";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/schema";

export const dynamic = "force-static";

const link = (label: string, href: string, desc?: string) => `- [${label}](${SITE_URL}${href})${desc ? `: ${desc}` : ""}`;

export function GET() {
  const sections = NAV.map((m) => {
    const seen = new Set<string>();
    const links = [{ label: m.intro.cta.label, href: m.href, desc: m.intro.body }, ...m.groups.flatMap((g) => g.links)]
      .filter((l) => !l.href.includes("?") && !seen.has(l.href) && seen.add(l.href)) // query links repeat a page already listed
      .map((l) => link(l.label, l.href, l.desc));
    return `## ${m.label}\n\n${links.join("\n")}`;
  });
  const body = [
    `# ${SITE_NAME}`,
    `> ${SITE_DESCRIPTION}`,
    `${CONTACT.legalName}, headquartered in ${CONTACT.address[1]}.`,
    ...sections,
    `## Contact\n\n${[link("Contact form", "/contact"), `- Email: ${CONTACT.email}`, `- Security reports: ${CONTACT.security}`, `- LinkedIn: ${CONTACT.linkedin}`].join("\n")}`,
    `## Optional\n\n${LEGAL.map((l) => link(l.label, l.href)).join("\n")}`,
  ];
  return new Response(body.join("\n\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
