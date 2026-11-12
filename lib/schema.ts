// JSON-LD (schema.org) helpers. Render with <JsonLd data={...} /> anywhere in a server or client component.
import { createElement } from "react";
import { CONTACT } from "@/lib/nav";

export const SITE_URL = "https://resilientprivacy.com";
export const SITE_NAME = "Resilient Privacy";
const ORG_ID = `${SITE_URL}/#organization`;
const FOUNDER_ID = `${SITE_URL}/company#vishva-patel`;
const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path === "/" ? "" : path}`);

type Thing = Record<string, unknown>;

/** Script tag for one or more schema.org objects. `<` is escaped so text can't close the tag. */
export function JsonLd({ data }: { data: Thing | Thing[] }) {
  const graph = Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : { "@context": "https://schema.org", ...data };
  return createElement("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(graph).replace(/</g, "\\u003c") } });
}

export const organization = (): Thing => ({
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  legalName: CONTACT.legalName,
  url: SITE_URL,
  logo: abs("/icon.svg"),
  email: CONTACT.email,
  address: { "@type": "PostalAddress", streetAddress: CONTACT.address[0], addressLocality: "Richardson", addressRegion: "TX", postalCode: "75082", addressCountry: "US" },
  founder: { "@id": FOUNDER_ID },
  areaServed: "Worldwide",
  location: { "@type": "Place", name: "Headquarters and main hub", address: { "@type": "PostalAddress", addressLocality: "Richardson", addressRegion: "TX", addressCountry: "US" } },
  contactPoint: [
    { "@type": "ContactPoint", contactType: "sales", email: CONTACT.email },
    { "@type": "ContactPoint", contactType: "security", email: CONTACT.security },
    { "@type": "ContactPoint", contactType: "technical support", description: `Critical incidents: response ${CONTACT.critical}. Follow-the-sun support from the USA and India.`, email: CONTACT.email, areaServed: "Worldwide", hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" } },
    { "@type": "ContactPoint", contactType: "legal", email: CONTACT.legal },
  ],
  knowsAbout: [
    "Penetration testing", "Red teaming", "AI red teaming", "LLM security", "AI agent and MCP security", "Application security",
    "ISO/IEC 42001", "NIST AI RMF", "EU AI Act", "SOC 2", "ISO/IEC 27001", "Managed detection and response",
  ],
});

const cert = (name: string, by: string): Thing => ({ "@type": "EducationalOccupationalCredential", credentialCategory: "certification", name, recognizedBy: { "@type": "Organization", name: by } });

/** Founder. Facts from the human (board v6); never add employers, awards or counts here. */
export const founder = (): Thing => ({
  "@type": "Person",
  "@id": FOUNDER_ID,
  name: "Vishva Patel",
  jobTitle: "Founder & CEO",
  description: "Serial entrepreneur, investor and advisor with 10+ years in cybersecurity. Ethical hacker and mentor.",
  image: abs("/team/vishva-patel.png"),
  url: abs("/company"),
  worksFor: { "@id": ORG_ID },
  knowsAbout: ["Ethical hacking", "Penetration testing", "Cybersecurity", "Information security governance", "IT audit"],
  hasCredential: [cert("CompTIA Security+", "CompTIA"), cert("CCNA", "Cisco"), cert("CISA", "ISACA"), cert("CISM", "ISACA")],
});

export const website = (): Thing => ({ "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL, publisher: { "@id": ORG_ID } });

export const faqPage = (items: [string, string][]): Thing => ({
  "@type": "FAQPage",
  mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

/** Detail pages use "Service"; practice hubs pass type "ProfessionalService". */
export const service = (s: { name: string; description: string; path: string; serviceType?: string; type?: "Service" | "ProfessionalService" }): Thing => ({
  "@type": s.type ?? "Service",
  name: s.name,
  description: s.description,
  url: abs(s.path),
  serviceType: s.serviceType ?? s.name,
  areaServed: "Worldwide",
  provider: { "@id": ORG_ID },
});

/** crumbs: [label, path] from the home page down to the current page. */
export const breadcrumbs = (crumbs: [string, string][]): Thing => ({
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
});

export const article = (a: { headline: string; description: string; path: string; datePublished: string; author: string }): Thing => ({
  "@type": "Article",
  headline: a.headline,
  description: a.description,
  url: abs(a.path),
  datePublished: a.datePublished,
  author: { "@type": "Person", name: a.author },
  publisher: { "@id": ORG_ID },
});

/** Site-wide share image (app/opengraph-image.tsx), used as the `image` of articles. */
export const OG_IMAGE = abs("/opengraph-image");

/** Extra Article fields Google uses; spread over article(). */
export const articleMeta = (a: { dateModified: string; keywords: string[] }): Thing => ({
  dateModified: a.dateModified,
  image: OG_IMAGE,
  keywords: a.keywords.join(", "),
});

/** items: [name, path] in display order. */
export const itemList = (items: [string, string][]): Thing => ({
  "@type": "ItemList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, url: abs(path) })),
});

/** posts: headline, path and ISO date of each post, newest first. */
export const blog = (b: { name: string; description: string; path: string; posts: { headline: string; path: string; datePublished: string }[] }): Thing => ({
  "@type": "Blog",
  name: b.name,
  description: b.description,
  url: abs(b.path),
  publisher: { "@id": ORG_ID },
  blogPost: b.posts.map((p) => ({ "@type": "BlogPosting", headline: p.headline, url: abs(p.path), datePublished: p.datePublished })),
});
