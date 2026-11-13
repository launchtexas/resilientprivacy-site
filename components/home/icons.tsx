/* Tiny homepage icon set (24px grid, 1.6 stroke). */
const ICONS = {
  platform: "M4 5h16v10H4zM8 19h8M12 15v4",
  soc: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM9 12l2 2 4-4",
  consult: "M4 18l5-5 3 3 8-8M15 8h5v5",
  grc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  ai: "M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3M6 6h12v12H6zM10 10h4v4h-4z",
  advisory: "M12 3a6 6 0 0 1 4 10.5V17H8v-3.5A6 6 0 0 1 12 3zM9 21h6",
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONS[name]} />
    </svg>
  );
}

export const PLACEHOLDER_NOTE = "Example data";
