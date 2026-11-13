// Static-site strict CSP: build once, hash every inline <script> Next wrote into the
// prerendered HTML, then build again with those hashes in script-src (next.config.ts reads
// csp-hashes.json). Pass 2 reuses pass 1's build id so the HTML, and so the hashes, match;
// the final check fails the build if any inline script is not covered.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "csp-hashes.json";
const APP = ".next/server"; // Vercel writes prerendered pages as .body files, local builds as .html

function inlineHashes() {
  const hashes = new Set();
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (p.endsWith(".html") || p.endsWith(".body"))
        for (const [, attrs, body] of readFileSync(p, "utf8").matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g))
          // src scripts are covered by 'self'; JSON-LD is data, never executed, so CSP ignores it.
          if (!/\bsrc=/.test(attrs) && !/application\/ld\+json/.test(attrs) && body)
            hashes.add(`'sha256-${createHash("sha256").update(body).digest("base64")}'`);
    }
  };
  walk(APP);
  return [...hashes].sort();
}

const build = (env) => execFileSync("npx", ["next", "build"], { stdio: "inherit", env: { ...process.env, ...env } });

rmSync(OUT, { force: true });
build({ CSP_PASS: "1" });
const first = inlineHashes();
writeFileSync(OUT, JSON.stringify({ buildId: readFileSync(".next/BUILD_ID", "utf8").trim(), hashes: first }));
build({});

const header = readFileSync(".next/routes-manifest.json", "utf8");
const missing = inlineHashes().filter((h) => !header.includes(h));
if (missing.length) {
  console.error(`csp-build: ${missing.length} inline script(s) not in the CSP header (non-deterministic build?):\n${missing.join("\n")}`);
  process.exit(1);
}
console.log(first.length
  ? `csp-build: ${first.length} inline script hashes in script-src, all covered.`
  : "csp-build: WARNING no prerendered HTML found; script-src falls back to 'unsafe-inline'.");
