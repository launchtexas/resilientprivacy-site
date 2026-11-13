import type { Metadata } from "next";
import { CONTACT } from "@/lib/nav";
import { LegalPage } from "@/components/company/parts";

export const metadata: Metadata = {
  title: "Security & Responsible Disclosure",
  description: "How Resilient Privacy Inc. protects its systems and how to report a security vulnerability. Draft pending legal review.",
};

export default function SecurityPage() {
  return (
    <LegalPage
      title="Security & Responsible Disclosure"
      intro={<><p><strong>Last updated: November 9, 2026</strong></p><p>Security is our business, and we welcome reports from researchers who find a weakness in our systems. This page explains how to report one and what you can expect from us.</p></>}
      sections={[
        ["How to report a vulnerability", <>
          <p>Email <a href={`mailto:${CONTACT.security}`}><strong>{CONTACT.security}</strong></a> with:</p>
          <ul>
            <li>A description of the issue and its potential impact.</li>
            <li>Steps to reproduce it, including affected URLs, requests or components.</li>
            <li>Any proof-of-concept code, screenshots or logs.</li>
            <li>How you would like to be credited, if at all.</li>
          </ul>
        </>],
        ["Scope", <>
          <p><strong>In scope:</strong> resilientprivacy.com and its subdomains, including the Resilient Privacy platform at app.resilientprivacy.com and its API at api.resilientprivacy.com.</p>
          <p><strong>Out of scope:</strong> denial-of-service, social engineering or phishing of our staff, physical attacks, third-party services we do not control, automated scanner output without a demonstrated impact, missing best-practice headers without a working exploit, and systems belonging to our customers.</p>
        </>],
        ["Rules of engagement", <ul>
          <li>Test only against accounts and data you own or have explicit permission to use.</li>
          <li>Stop as soon as you confirm a vulnerability; do not access, change, keep or share other people&rsquo;s data.</li>
          <li>Do not degrade service for other users.</li>
          <li>Give us reasonable time to fix the issue before any public disclosure. We aim to agree a disclosure date with you, typically within 90 days.</li>
        </ul>],
        ["What you can expect from us", <ul>
          <li>Acknowledgment that we received your report within 2 business days.</li>
          <li>An initial assessment and severity rating within 10 business days.</li>
          <li>Regular updates until the issue is resolved, and credit in our acknowledgments if you want it.</li>
        </ul>],
        ["Safe harbor", <p>If you make a good-faith effort to follow this policy, we will consider your research authorized, will not pursue legal action against you for it, and will not ask law enforcement to do so. If a third party brings action against you for activity that complied with this policy, we will make it known that your actions were authorized. This does not apply to activity that violates the law or this policy.</p>],
        ["Testing is authorized only as described here", <p>This policy authorizes good-faith research on our own systems only. It does not authorize testing of our customers&rsquo; systems or any third party&rsquo;s systems, and it does not create a services relationship or any guarantee that our systems are free of vulnerabilities. Any dispute about this policy is governed by Delaware law and resolved under the dispute sections of our <a href="/legal/terms#notice-of-dispute-and-informal-resolution">Terms of Use</a>, including binding individual arbitration and the jury trial waiver.</p>],
        ["Bug bounty", <p>We do not currently run a paid bug bounty program. We still welcome reports under this policy and credit researchers who want it.</p>],
        ["How we protect our systems", <>
          <p>We apply the same practices we deliver to customers:</p>
          <ul>
            <li>Encryption of data in transit and at rest.</li>
            <li>Single sign-on, multi-factor authentication and least-privilege access for staff.</li>
            <li>24/7 monitoring of our own environment by our security operations team.</li>
            <li>Regular penetration testing and vulnerability management.</li>
            <li>Security awareness training for all staff at hire and every year after.</li>
            <li>Background checks before hire where local law allows, and confidentiality agreements for all staff and contractors.</li>
          </ul>
          <p>The company does not hold an audit report or certification such as SOC 2 or ISO 27001. Our team holds individual industry certifications, including CISSP, CISM, CISA, OSCP, CEH, Security+ and CCNA. Customers can request our security documentation through their account team.</p>
        </>],
      ]}
    />
  );
}
