import Image from "next/image";
import Link from "next/link";
import { CONTACT, LEGAL, NAV } from "@/lib/nav";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-300 print:hidden">
      <div className="container-rp py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Logo inverse />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Securing the systems and AI the world depends on.
            </p>
            <address className="mt-6 text-sm not-italic leading-relaxed">
              <a href={`mailto:${CONTACT.email}`} className="text-white hover:underline">{CONTACT.email}</a>
              {CONTACT.address.map((line) => <span key={line} className="block">{line}</span>)}
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Resilient Privacy on LinkedIn (opens in a new tab)" className="mt-4 inline-block">
                <Image src="/logos/linkedin-in-bug-white.png" alt="" width={26} height={24} unoptimized />
              </a>
            </address>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-6">
            {NAV.map((m) => (
              <div key={m.label}>
                <h2 className="text-sm font-semibold text-white">{m.label}</h2>
                <ul className="mt-4 space-y-2.5">
                  {m.groups.flatMap((g) => g.links).slice(0, 5).map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm transition-colors hover:text-white">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <p className="text-navy-300">{CONTACT.copyright.replace("©", `© ${new Date().getFullYear()}`)} All rights reserved.</p>
            <p className="text-navy-400">Third-party trademarks belong to their respective owners.</p>
          </div>
          <ul className="flex gap-6">
            {LEGAL.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
