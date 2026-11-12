import Link from "next/link";

/** Placeholder brand mark [placeholder]: replace when the real logo arrives. */
export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" aria-label="Resilient Privacy home" className="inline-flex items-center gap-2.5">
      <svg aria-hidden viewBox="0 0 28 28" className="size-7">
        <rect width="28" height="28" rx="8" className={inverse ? "fill-white" : "fill-navy-900"} />
        <path d="M14 6.5 20.5 9v5.2c0 3.9-2.7 6.4-6.5 7.8-3.8-1.4-6.5-3.9-6.5-7.8V9L14 6.5Z" className="fill-accent" />
        <path d="M11 14.2 13.2 16.4 17.4 12" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`text-[1.0625rem] font-semibold tracking-[-0.02em] ${inverse ? "text-white" : "text-navy-950"}`}>
        Resilient Privacy
      </span>
    </Link>
  );
}
