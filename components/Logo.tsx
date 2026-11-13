import Link from "next/link";

// Kit files used unaltered; <img> keeps each SVG's gradient ids scoped to its own document.
export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" aria-label="Resilient Privacy home" className="inline-flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={inverse ? "/brand/ResilientPrivacy_Symbol_White.svg" : "/brand/ResilientPrivacy_Symbol_Black.svg"}
        alt=""
        width={30}
        height={40}
        className="h-10 w-auto"
      />
      <span className={`text-[1.1875rem] font-semibold tracking-[-0.02em] ${inverse ? "text-white" : "text-navy-950"}`}>
        Resilient Privacy
      </span>
    </Link>
  );
}
