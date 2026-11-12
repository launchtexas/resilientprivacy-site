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
              Cybersecurity and AI consulting, backed by 24/7 operations and our own platform.
            </p>
            <address className="mt-6 text-sm not-italic leading-relaxed">
              <a href={`mailto:${CONTACT.email}`} className="text-white hover:underline">{CONTACT.email}</a>
              {CONTACT.address.map((line) => <span key={line} className="block">{line}</span>)}
              <Link href="/legal/security" className="mt-3.5 block py-0.5 text-white hover:underline">Report a vulnerability</Link>
              <span className="block">Legal: <a href={`mailto:${CONTACT.legal}`} className="text-white hover:underline">{CONTACT.legal}</a></span>
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
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>{CONTACT.copyright.replace("©", `© ${new Date().getFullYear()}`)} All rights reserved.</p>
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
