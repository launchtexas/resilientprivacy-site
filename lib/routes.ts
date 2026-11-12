// Server-only (reads the app folder at build time): which nav hrefs still have no real page.
import fs from "node:fs";
import path from "node:path";
import { ALL_HREFS } from "@/lib/nav";

// A real page (static, or a sibling dynamic segment) owns the href; emitting a stub too would overwrite its HTML at build.
const APP = path.join(process.cwd(), "app");
const hasPage = (href: string) => {
  const dir = path.join(APP, href);
  if (fs.existsSync(path.join(dir, "page.tsx"))) return true;
  const parent = path.dirname(dir);
  return fs.existsSync(parent) && fs.readdirSync(parent).some((n) => /^\[[^.]/.test(n) && fs.existsSync(path.join(parent, n, "page.tsx")));
};
export const STUBS = ALL_HREFS.filter((h) => !hasPage(h));
export const REAL = ["/", ...ALL_HREFS.filter((h) => !STUBS.includes(h))];
