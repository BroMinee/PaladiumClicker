import fs from "fs";
import path from "path";

const EXPECTED_STATIC: string[] = [
  "/",
  "/about",
  "/account",
  "/account/login",
  "/admin-panel",
  "/admin-panel/login",
  "/admin-shop",
  "/ah",
  "/clicker-optimizer",
  "/craft",
  "/craft-optimizer",
  "/error",
  "/favicon.ico",
  "/login/callback",
  "/pala-animation",
  "/pala-animation/login",
  "/patchnote",
  "/politique-de-confidentialite",
  "/profil",
  "/qdf",
  "/ranking",
  "/rewind",
  "/robots.txt",
  "/status",
  "/sitemap.xml",
  "/webhook",
  "/webhook/create",
  "/webhook/edit",
  "/webhook/login",
  "/xp-calculator",
  "/xp-calculator/bedrock",
];

const EXPECTED_DYNAMIC: string[] = [
  "/clicker-optimizer/[username]",
  "/profil/[username]",
  "/twitch/[username]",
  "/twitch/[username]/setup",
  "/blog/faction/[backgroundColor]/[backgroundId]/[borderColor]/[foregroundColor]/[foregroundId]/[iconBorderColor]/[iconColor]/[iconId]/opengraph-image",
  "/xp-calculator/[username]",
];

const IGNORED: string[] = [
  "/_global-error",
  "/_not-found",
];

const manifestPath = path.join(process.cwd(), ".next", "routes-manifest.json");

if (!fs.existsSync(manifestPath)) {
  console.error("ERROR: .next/routes-manifest.json not found. Run `npm run build` first.");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
const staticRoutes: Set<string> = new Set(manifest.staticRoutes.map((r: { page: string }) => r.page));
const dynamicRoutes: Set<string> = new Set(manifest.dynamicRoutes.map((r: { page: string }) => r.page));

let failures = 0;

function pass(route: string) {
  console.log(`  [OK]   ${route}`);
}
function fail(route: string, reason: string) {
  console.error(`  [FAIL] ${route} - ${reason}`); failures++;
}

console.log("Static routes (fixed URL):");
for (const route of EXPECTED_STATIC) {
  if (staticRoutes.has(route)) {
    pass(route);
  } else if (dynamicRoutes.has(route)) {
    fail(route, "is now a dynamic route");
  } else {
    fail(route, "not found in build output");
  }
}
console.log("\nDynamic routes (parameterized URL):");
for (const route of EXPECTED_DYNAMIC) {
  if (dynamicRoutes.has(route)) {
    pass(route);
  } else if (staticRoutes.has(route)) {
    fail(route, "is now a static route");
  } else {
    fail(route, "not found in build output");
  }
}

const known = new Set([...EXPECTED_STATIC, ...EXPECTED_DYNAMIC, ...IGNORED]);
const unlisted = [
  ...manifest.staticRoutes.map((r: { page: string }) => r.page),
  ...manifest.dynamicRoutes.map((r: { page: string }) => r.page),
].filter((r: string) => !known.has(r));

if (unlisted.length > 0) {
  console.log("\nUnlisted routes (add them to EXPECTED_STATIC or EXPECTED_DYNAMIC):");
  for (const route of unlisted) {
    fail(route, "not listed in check-build-output.ts");
  }
}

console.log();
if (failures === 0) {
  console.log(`All checks passed. (${EXPECTED_STATIC.length + EXPECTED_DYNAMIC.length} routes checked)`);
} else {
  console.error(`${failures} check(s) failed.`);
}

process.exit(failures === 0 ? 0 : 1);