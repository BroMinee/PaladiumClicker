"use server";
import { codeToHtml } from "shiki";
import { ProxyApiKeyGuideClient } from "./proxy-api-key-guide.client";

const JS_EXAMPLE = [
  "const API_KEY = \"ta_cle_api\";",
  "",
  "async function fetchPaladium(endpoint) {",
  "  const res = await fetch(`https://palatracker.bromine.fr/v1${endpoint}`, {",
  "    headers: {",
  "      \"Authorization\": `Bearer ${API_KEY}`,",
  "    },",
  "  });",
  "",
  "  const limit     = res.headers.get(\"X-RateLimit-Limit\");",
  "  const remaining = res.headers.get(\"X-RateLimit-Remaining\");",
  "  const reset     = res.headers.get(\"X-RateLimit-Reset\");",
  "",
  "  console.log(`Rate limit: ${remaining}/${limit}, reset dans ${reset}s`);",
  "",
  "  if (remaining !== null && parseInt(remaining) === 0) {",
  "    const waitMs = (parseFloat(reset) + 1) * 1000;",
  "    console.log(`Rate limit atteint, attente de ${waitMs / 1000}s...`);",
  "    await new Promise((resolve) => setTimeout(resolve, waitMs));",
  "  }",
  "",
  "  if (!res.ok) {",
  "    throw new Error(`HTTP ${res.status}`);",
  "  }",
  "  return res.json();",
  "}",
  "",
  "// Exemple : récupérer les infos d'un joueur",
  "const data = await fetchPaladium(\"/paladium/player/profile/BroMine__\");",
  "console.log(data);",
].join("\n");

const PYTHON_EXAMPLE = [
  "import time",
  "import requests",
  "",
  "API_KEY = \"ta_cle_api\"",
  "",
  "def fetch_paladium(endpoint):",
  "    res = requests.get(",
  "        f\"https://palatracker.bromine.fr/v1{endpoint}\",",
  "        headers={\"Authorization\": f\"Bearer {API_KEY}\"},",
  "    )",
  "",
  "    limit     = res.headers.get(\"X-RateLimit-Limit\")",
  "    remaining = res.headers.get(\"X-RateLimit-Remaining\")",
  "    reset     = res.headers.get(\"X-RateLimit-Reset\")",
  "",
  "    print(f\"Rate limit: {remaining}/{limit}, reset dans {reset}s\")",
  "",
  "    if remaining is not None and int(remaining) == 0:",
  "        wait = float(reset) + 1",
  "        print(f\"Rate limit atteint, attente de {wait}s...\")",
  "        time.sleep(wait)",
  "",
  "    res.raise_for_status()",
  "    return res.json()",
  "",
  "# Exemple : récupérer les infos d'un joueur",
  "data = fetch_paladium(\"/paladium/player/profile/BroMine__\")",
  "print(data)",
].join("\n");

const CURL_EXAMPLE = [
  "# Exemple : récupérer les infos d'un joueur",
  "curl -s \\",
  "  -H \"Authorization: Bearer ta_cle_api\" \\",
  "  https://palatracker.bromine.fr/v1/paladium/player/profile/BroMine__",
].join("\n");

/**
 * Example of code to use the API key
 */
export async function ProxyApiKeyGuide() {
  const [jsHtml, pythonHtml, curlHtml] = await Promise.all([
    codeToHtml(JS_EXAMPLE, { lang: "javascript", theme: "github-dark" }),
    codeToHtml(PYTHON_EXAMPLE, { lang: "python", theme: "github-dark" }),
    codeToHtml(CURL_EXAMPLE, { lang: "bash", theme: "github-dark" }),
  ]);

  return <ProxyApiKeyGuideClient jsHtml={jsHtml} pythonHtml={pythonHtml} curlHtml={curlHtml} />;
}
