import type { NextConfig } from "next";
const config: NextConfig = {
  reactStrictMode: true,
  // AI work moved to its own practice (audit v3, section 3).
  redirects: async () => [{ source: "/consulting/ai-security", destination: "/ai-security/red-teaming", permanent: true }],
};
export default config;
