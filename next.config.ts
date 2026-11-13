import type { NextConfig } from "next";
import { existsSync, readFileSync } from "node:fs";

const dev = process.env.NODE_ENV === "development";

// Static site, no nonces: Next's inline bootstrap/flight scripts are allowed by sha256 hash,
// written by scripts/csp-build.mjs (npm run build) after a first build pass. Dev keeps 'unsafe-inline'.
const built: { buildId: string; hashes: string[] } | null = existsSync("csp-hashes.json")
  ? JSON.parse(readFileSync("csp-hashes.json", "utf8"))
  : null;
if (!dev && !built && !process.env.CSP_PASS && process.argv.includes("build"))
  throw new Error("Run `npm run build` (scripts/csp-build.mjs), not `next build`: the CSP script hashes come from it.");

const csp = [
  "default-src 'self'",
  `script-src 'self' ${dev ? "'unsafe-inline' 'unsafe-eval'" : (built?.hashes.join(" ") ?? "")}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  `connect-src 'self'${dev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "object-src 'none'",
  // Dev runs on plain http://localhost, so only upgrade in production.
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pass 2 must reuse pass 1's build id: it is embedded in the hashed inline scripts.
  ...(built && { generateBuildId: async () => built.buildId }),
  experimental: { sri: { algorithm: "sha256" } },
  headers: async () => [{ source: "/(.*)", headers: securityHeaders }],
  // AI work moved to its own practice (audit v3, section 3).
  redirects: async () => [{ source: "/consulting/ai-security", destination: "/ai-security/red-teaming", permanent: true }],
};
export default config;
