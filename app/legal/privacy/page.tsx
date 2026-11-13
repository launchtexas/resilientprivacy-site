import type { Metadata } from "next";
import { CONTACT } from "@/lib/nav";
import { LegalPage } from "@/components/company/parts";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Resilient Privacy Inc. collects, uses, shares and protects personal information. Draft pending legal review.",
};

const mail = <a href={`mailto:${CONTACT.legal}`}>{CONTACT.legal}</a>;

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={<><p><strong>Last updated: November 9, 2026</strong></p><p>This policy explains how {CONTACT.legalName} (&ldquo;Resilient Privacy,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) collects, uses, shares and protects personal information when you visit resilientprivacy.com, contact us, or use our products and services.</p></>}
      sections={[
        ["Scope", <>
          <p>This policy covers personal information we handle as a business for our own purposes: website visitors, prospects, partners, job applicants and the contacts at our customers.</p>
          <p>When we process data on behalf of a customer through our platform or managed services, we act as a service provider (processor) under our agreement with that customer, and that agreement and the customer&rsquo;s own privacy notice govern that data.</p>
        </>],
        ["Information we collect", <>
          <ul>
            <li><strong>Information you give us:</strong> name, work email, company, job title, phone number and the content of messages, demo requests and job applications.</li>
            <li><strong>Account and service information:</strong> login details, settings, billing contacts and support history for customers.</li>
            <li><strong>Information collected automatically:</strong> IP address, browser and device type, pages visited, referring URL and similar technical data from our hosting provider&rsquo;s server logs. We do not use analytics, advertising or tracking tools on this website.</li>
            <li><strong>Information from others:</strong> business contact details from partners, events or public professional sources.</li>
          </ul>
          <p>We do not knowingly collect sensitive personal information through this website, and we do not sell personal information.</p>
        </>],
        ["How we use information", <ul>
          <li>To respond to inquiries, schedule demos and provide our products and services.</li>
          <li>To operate, secure and improve our website and services, including detecting fraud and abuse.</li>
          <li>To send service messages and, where permitted, marketing you can opt out of at any time.</li>
          <li>To evaluate job applicants.</li>
          <li>To meet legal obligations and enforce our agreements.</li>
        </ul>],
        ["How we share information", <>
          <p>We share personal information only as needed with:</p>
          <ul>
            <li>Service providers that host, support or help run our business, under contracts that limit their use of the data.</li>
            <li>Partners you ask us to work with, such as a reseller handling your purchase.</li>
            <li>Authorities, when required by law or to protect rights, property or safety.</li>
            <li>A buyer or successor in a merger, acquisition or sale of assets, subject to this policy.</li>
          </ul>
          <p>For example, when you submit our contact or demo request form, we use Resend (Resend, Inc.) to deliver your submission to our team by email. Resend processes that information on our behalf.</p>
        </>],
        ["Cookies", <p>This website does not use analytics, advertising or tracking cookies. If it sets a cookie, that cookie is strictly necessary for the site to work, so there is nothing to opt out of. You can still block or delete cookies in your browser settings. If we ever add optional cookies, we will update this policy and ask for your consent where the law requires it.</p>],
        ["Data retention", <p>We keep personal information only as long as needed for the purposes above, including legal, accounting and reporting requirements, then delete or de-identify it. Our standard periods: inquiries, 2 years after our last contact with you; job applications, 1 year (longer where local law requires); customer and billing records, the contract term plus 7 years for tax purposes; server logs, 30 to 90 days. You can ask us to delete your information at any time, and we will unless the law requires us to keep it.</p>],
        ["Security", <p>We protect personal information with administrative, technical and physical safeguards appropriate to its sensitivity, including encryption in transit, access controls and monitoring. No method of transmission or storage is completely secure. See our <a href="/legal/security">Security page</a> for more.</p>],
        ["Your rights and choices", <>
          <p>Depending on where you live, including Texas (Texas Data Privacy and Security Act), California (CCPA/CPRA) and other U.S. states, or the European Economic Area and United Kingdom (GDPR), you may have the right to access, correct, delete or obtain a copy of your personal information, to opt out of targeted advertising, sale or profiling, and to appeal a decision about your request.</p>
          <p>To make a request, email {mail}. We will verify your request and respond within the time the law requires. You will not be discriminated against for exercising your rights. If we deny your request, you may appeal by replying to our decision; if your appeal is denied you may contact your state attorney general.</p>
        </>],
        ["International transfers", <p>We are based in the United States. If you access our services from elsewhere, your information may be transferred to and processed in the United States. Where required, we use safeguards such as standard contractual clauses.</p>],
        ["Children", <p>Our website and services are intended for businesses and are not directed to children under 13 (or under 16 where applicable). We do not knowingly collect their personal information.</p>],
        ["Disputes", <p>Disputes about this policy or how we handle your personal information are governed by Delaware law and resolved through the notice, informal resolution and binding individual arbitration process in our <a href="/legal/terms#notice-of-dispute-and-informal-resolution">Terms of Use</a>, including its class action and jury trial waivers and the consumer opt-out. This does not limit your right to complain to a data protection authority or state attorney general, or any privacy right that the law says cannot be waived.</p>],
        ["Changes to this policy", <p>We may update this policy. We will post the new version here with a new &ldquo;Last updated&rdquo; date and, for material changes, give additional notice where required.</p>],
      ]}
    />
  );
}
