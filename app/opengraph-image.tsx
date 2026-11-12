// Default share image for every route (pages may add their own opengraph-image to override).
import { ImageResponse } from "next/og";

export const alt = "Resilient Privacy: cybersecurity and AI security consulting";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/og can't read CSS tokens; these mirror app/globals.css (navy-950, accent, accent-on-dark, navy-300).
const INK = "#110d2e", ACCENT = "#5b47e0", ACCENT_DARK = "#a59bff", MUTED = "#c3c1d8";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: `radial-gradient(circle at 85% 10%, ${ACCENT} 0%, #2a1f7a 35%, ${INK} 70%)`, color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 28 28">
            <rect width="28" height="28" rx="8" fill="white" />
            <path d="M14 6.5 20.5 9v5.2c0 3.9-2.7 6.4-6.5 7.8-3.8-1.4-6.5-3.9-6.5-7.8V9L14 6.5Z" fill={ACCENT} />
            <path d="M11 14.2 13.2 16.4 17.4 12" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: -1 }}>Resilient Privacy</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: ACCENT_DARK }}>Cybersecurity · AI security · Compliance</div>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, maxWidth: 960 }}>Cybersecurity and AI security consulting, from first test to final evidence.</div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: MUTED }}>
          <span>Offensive security</span><span style={{ color: ACCENT_DARK }}>/</span>
          <span>AI red teaming</span><span style={{ color: ACCENT_DARK }}>/</span>
          <span>Risk &amp; compliance</span><span style={{ color: ACCENT_DARK }}>/</span>
          <span>24/7 operations</span>
        </div>
      </div>
    ),
    size,
  );
}
