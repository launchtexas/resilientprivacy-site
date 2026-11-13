import type { Metadata } from "next";
import { CONTACT } from "@/lib/nav";
import { LegalPage } from "@/components/company/parts";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing use of the Resilient Privacy Inc. website. Draft pending legal review.",
};

const mail = <a href={`mailto:${CONTACT.legal}`}>{CONTACT.legal}</a>;
// Cross-references: anchors match the slugs LegalPage builds from section titles.
const ref = (id: string, label: string) => <a href={`#${id}`}>{label}</a>;
const EXC = ref("exceptions-small-claims-and-court-relief", "Exceptions: small claims and court relief");

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro={<>
        <p><strong>Last updated: November 9, 2026</strong></p>
        <p>These Terms govern your use of resilientprivacy.com (the &ldquo;Site&rdquo;), operated by {CONTACT.legalName}, a Delaware corporation with offices in Richardson, Texas (&ldquo;Resilient Privacy,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo; or &ldquo;our&rdquo;), and they form a binding agreement between you and Resilient Privacy (these &ldquo;Terms&rdquo;). You accept these Terms when you check the agreement box on any form on the Site (including the contact, demo and newsletter forms) or, if you do not submit a form, by using the Site. If you do not agree, do not use the Site.</p>
        <div role="note" className="mt-4 rounded-card border border-medium/30 bg-medium-soft p-4 text-base text-medium-ink">
          <strong className="uppercase text-medium-ink">Important: please read the dispute sections carefully. Except for small claims and the other matters listed in the Exceptions section, any dispute between you and us will be decided by a neutral arbitrator in binding individual arbitration, not by a judge or jury. You give up the right to a jury trial and to take part in a class or collective action. These Terms also limit our liability and disclaim warranties.</strong> If you use the Site as a Consumer, you can opt out of arbitration within 30 days, as explained in {ref("your-right-to-opt-out-of-arbitration", "Your right to opt out of arbitration")}.
        </div>
      </>}
      sections={[
        ["Who these Terms apply to", <>
          <p>These Terms cover the public Site only. Our products and services are provided under a separate signed agreement (such as a master services agreement, statement of work or subscription terms). If that agreement conflicts with these Terms, that agreement controls.</p>
          <p>If you use the Site for a company or other organization, you confirm you are authorized to accept these Terms for it, and &ldquo;you&rdquo; includes that organization. Some sections treat Consumers differently. A &ldquo;Consumer&rdquo; is an individual using the Site for personal, family or household purposes rather than for a business.</p>
        </>],
        ["Acceptable use", <>
          <p>You may use the Site for lawful purposes. You agree not to:</p>
          <ul>
            <li>Probe, scan or test the Site or our systems, or try to gain unauthorized access to them or to other users&rsquo; data, except as allowed by our <a href="/legal/security">responsible disclosure policy</a>.</li>
            <li>Interfere with the Site&rsquo;s operation, including by denial-of-service, automated scraping at a harmful rate, or introducing malware.</li>
            <li>Copy, frame or harvest Site content in bulk, or use it to train models or build a competing product, without our written permission.</li>
            <li>Use the Site to send unlawful, misleading or infringing content.</li>
            <li>Misrepresent your identity or affiliation when contacting us.</li>
          </ul>
        </>],
        ["Security testing and no guarantee of security", <>
          <p>We perform penetration testing, red teaming and other security testing only under a signed agreement that defines the scope, the systems covered and written authorization from their owner. Nothing on the Site authorizes anyone, including us, to test any system.</p>
          <p>Security content on the Site, including articles, checklists, sample findings and tool output, is general information, not advice for your environment. Acting on it is your decision. No security product, service or assessment can find every weakness or prevent every attack, and we do not guarantee that any system, including the Site, is or will stay secure. Do not use techniques described on the Site against systems you are not authorized to test.</p>
        </>],
        ["Intellectual property", <p>The Site and its content, including text, graphics, logos and software, are owned by Resilient Privacy or its licensors and protected by intellectual property laws. You may view and print pages for your internal use. Any other use requires our written permission. Our names and logos are our trademarks; you may not use them without permission.</p>],
        ["Third-party trademarks", <p>Product names, logos and brands of other companies shown on the Site, such as cloud, identity and security platforms, are trademarks of their respective owners. We use them only to identify the technologies we work with. Their use does not mean that any of these companies endorses, sponsors or partners with Resilient Privacy, unless we say so expressly. If you own a mark shown here and want it removed, email {mail} and we will act promptly.</p>],
        ["Your submissions and confidentiality", <>
          <p>If you send us feedback, ideas or other information through the Site, you grant us a non-exclusive, royalty-free, perpetual right to use it to improve our products and services. Do not send confidential information, credentials or details of an unpatched vulnerability in someone else&rsquo;s system through the Site&rsquo;s general forms. Unless we have signed a confidentiality agreement with you, sending information through the Site does not create a duty of confidentiality, although we still protect personal information as our <a href="/legal/privacy">Privacy Policy</a> describes.</p>
          <p>Non-public material we share with you through the Site, such as pricing, proposals or security documentation, is our confidential information. Use it only to evaluate a business relationship with us, and do not share it without our written permission.</p>
        </>],
        ["Third-party links", <p>The Site may link to third-party sites we do not control. We are not responsible for their content, policies or practices.</p>],
        ["Export control and sanctions", <p>You may not use, download or export anything from the Site in violation of U.S. export control or sanctions laws, including the Export Administration Regulations and rules administered by the Office of Foreign Assets Control. You confirm you are not located in a country subject to a comprehensive U.S. embargo and are not on a U.S. government restricted-party list.</p>],
        ["Disclaimer of warranties", <p className="uppercase"><strong>The Site and its content are provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, title, accuracy and non-infringement, and any warranty that the Site will be uninterrupted, error-free or secure.</strong></p>],
        ["Limitation of liability", <>
          <p className="uppercase"><strong>To the fullest extent permitted by law, Resilient Privacy and its officers, directors, employees and agents will not be liable for any indirect, incidental, special, consequential, exemplary or punitive damages, or any loss of profits, revenue, data or goodwill, arising from or related to the Site or these Terms, even if advised of the possibility. Our total liability for all claims relating to the Site or these Terms will not exceed one hundred U.S. dollars (US$100).</strong></p>
          <p>Some jurisdictions do not allow certain of these limits, so some may not apply to you. Nothing in these Terms limits liability that cannot be limited by law, such as liability for fraud or, for Consumers, gross negligence or willful misconduct where the law prohibits limiting it.</p>
        </>],
        ["Indemnification", <p>You agree to defend, indemnify and hold harmless Resilient Privacy and its officers, directors, employees and agents from third-party claims, losses and expenses (including reasonable attorneys&rsquo; fees) arising from your misuse of the Site, your violation of law or third-party rights, or your breach of these Terms. If you are a Consumer, this applies only to the extent the law where you live allows.</p>],
        ["Events beyond our control", <p>We are not responsible for delay or failure caused by events beyond our reasonable control, such as natural disasters, power or internet outages, cyberattacks on third-party infrastructure, labor disputes, government action, war or pandemic.</p>],
        ["Governing law", <>
          <p>These Terms and any dispute relating to them or the Site are governed by the laws of the State of Delaware, without regard to its conflict-of-laws rules. The arbitration agreement below is governed by the Federal Arbitration Act (9 U.S.C. &sect; 1 et seq.) and federal arbitration law.</p>
          <p>Our operations are based in Richardson, Texas. Choosing Delaware law does not take away protections that the law of the state where you live gives Consumers and that cannot be waived by contract.</p>
        </>],
        ["Notice of dispute and informal resolution", <>
          <p>Before starting arbitration or any permitted court case, the person bringing the claim must send a written Notice of Dispute and try to resolve it informally. Send yours to {mail} or to {CONTACT.legalName}, Attn: Legal, {CONTACT.address.slice(0, 2).join(", ")}. We will send ours to the contact details we have for you.</p>
          <p>The notice must include your name and contact details, a description of the dispute, and the relief you want. For 60 days after the notice is received, we will both try in good faith to resolve the dispute, including by a call if either of us asks. Time limits to bring the claim are paused during this period. Either side may then start arbitration. This step does not apply to the court matters listed in {EXC} that need urgent relief.</p>
        </>],
        ["Binding individual arbitration", <>
          <p className="uppercase"><strong>Except as listed in Exceptions: small claims and court relief, you and Resilient Privacy agree that any dispute, claim or controversy arising from or relating to the Site, these Terms or our Privacy Policy (a &ldquo;Dispute&rdquo;) will be resolved by final and binding arbitration, not in court.</strong></p>
          <ul>
            <li><strong>Who runs it:</strong> the American Arbitration Association (&ldquo;AAA&rdquo;) under its Commercial Arbitration Rules. If you are a Consumer, the AAA Consumer Arbitration Rules apply instead. If 25 or more similar claims are filed by the same or coordinated counsel, the AAA Mass Arbitration Supplementary Rules also apply. The rules are at adr.org.</li>
            <li><strong>Where:</strong> the seat of arbitration is Wilmington, Delaware. For Consumers, hearings may take place by video, on documents only, or in the county where you live, as the rules provide.</li>
            <li><strong>Arbitrator:</strong> a single neutral arbitrator who may award the same individual relief a court could, but only in favor of the individual party seeking it and only as needed for that party&rsquo;s individual claim.</li>
            <li><strong>Who decides arbitrability:</strong> the arbitrator decides all questions about the scope, validity, enforceability or formation of this arbitration agreement, except that a court decides questions about the {ref("class-and-collective-action-waiver", "Class and collective action waiver")} and the mass-filing process below.</li>
            <li><strong>Fees:</strong> fees are paid as the AAA rules provide. For Consumer claims, we will pay all filing, administrative and arbitrator fees beyond the amount you would pay to file in court.</li>
            <li><strong>Award:</strong> the award is final and binding, and judgment on it may be entered in any court with jurisdiction.</li>
          </ul>
          <p>This agreement does not require arbitration of claims that federal law excludes from pre-dispute arbitration, such as sexual harassment and sexual assault claims under the Ending Forced Arbitration of Sexual Assault and Sexual Harassment Act.</p>
        </>],
        ["Class and collective action waiver", <>
          <p className="uppercase"><strong>You and Resilient Privacy may bring claims against each other only in an individual capacity, not as a plaintiff or class member in any class, collective, consolidated or representative proceeding.</strong> The arbitrator may not consolidate claims of more than one person or preside over any form of class or representative proceeding.</p>
          <p>If a court finds this waiver unenforceable for a particular claim or request for relief (such as public injunctive relief), that claim or request will be decided by a court under {EXC} after all individual claims are arbitrated, and will not be arbitrated on a class basis.</p>
        </>],
        ["Exceptions: small claims and court relief", <>
          <p>Either of us may bring an individual claim in small claims court if it qualifies there and stays there. Either of us may also go to court to seek an injunction or other equitable relief to protect intellectual property, confidential information or the security of our systems, and to confirm, enforce, modify or vacate an arbitration award.</p>
          <p>Any of these court matters, and any Dispute a court finds is not subject to arbitration, must be brought exclusively in the Court of Chancery or Superior Court of the State of Delaware, or the United States District Court for the District of Delaware, and you and we consent to their jurisdiction and venue. A party may also enforce a final award or judgment in any court where the other party or its assets are located.</p>
        </>],
        ["Jury trial waiver", <p className="uppercase"><strong>To the fullest extent permitted by law, you and Resilient Privacy each knowingly and voluntarily waive any right to a trial by jury in any lawsuit, proceeding or counterclaim arising from or relating to the Site or these Terms that is heard in court for any reason.</strong></p>],
        ["Time limit to bring claims", <p className="uppercase"><strong>Any claim relating to the Site or these Terms must be started within one year after it arises, or it is permanently barred. If the law that applies to you does not allow a period that short, the claim must be started within the shortest period that law allows.</strong></p>],
        ["Your right to opt out of arbitration", <>
          <p>If you are a Consumer, you may opt out of the arbitration agreement and the class and collective action waiver by emailing {mail} within 30 days after you first use the Site after November 9, 2026. Include your name, mailing address, email address and a clear statement that you opt out of arbitration.</p>
          <p>Opting out does not affect any other part of these Terms, including the time limit to bring claims, the jury trial waiver and the exclusive Delaware venue, and it does not affect any other arbitration agreement you have with us.</p>
        </>],
        ["Changes to these Terms", <p>We may change these Terms or the Site at any time by posting an updated version here with a new &ldquo;Last updated&rdquo; date. Continued use after changes take effect means you accept them. Changes to the dispute sections will not apply to a Dispute we already knew about or that is already pending. If we make a material change to the arbitration agreement, a Consumer may reject it by emailing {mail} within 30 days; the prior version will then continue to apply to that consumer. We may suspend access to the Site for anyone who violates these Terms.</p>],
        ["General", <>
          <p><strong>Severability:</strong> if any provision is found unenforceable, it will be enforced to the maximum extent allowed and the rest remain in effect, except as stated in the {ref("class-and-collective-action-waiver", "Class and collective action waiver")}.</p>
          <p><strong>Other terms:</strong> our failure to enforce a provision is not a waiver. You may not assign these Terms; we may assign them in connection with a merger, acquisition or sale of assets. These Terms, together with our Privacy Policy, are the entire agreement between you and us about the Site. Headings are for convenience only.</p>
          <p><strong>Survival:</strong> the sections on intellectual property, your submissions and confidentiality, disclaimer of warranties, limitation of liability, indemnification, governing law, and every dispute section survive any end of your use of the Site.</p>
          <p><strong>Electronic communications:</strong> you agree that checking a box, clicking a button or sending an email to us is an electronic signature and has the same effect as a handwritten one under the federal E-SIGN Act and Delaware&rsquo;s Uniform Electronic Transactions Act.</p>
          <p><strong>Notices:</strong> legal notices to us must go to {mail}. We may send notices to you by email or by posting them on the Site.</p>
        </>],
      ]}
    />
  );
}
