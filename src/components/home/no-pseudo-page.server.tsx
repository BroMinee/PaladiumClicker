import { getGithubContributors } from "@/lib/api/apiPala";
import { NoPseudoPageWithContributeur } from "./no-pseudo-page.client";

export const dynamic = "force-static"; // Static generation

/**
 * Component that fetches contributors and renders NoPseudoPageWithContributeur on server side.
 * The list of contributors is fetched at build time to ensure static generation.
 */
export async function NoPseudoPage({ texth1, texth2}: { texth1: string, texth2: string }) {
  const contributors = await getGithubContributors();
  return (
    <NoPseudoPageWithContributeur contributors={contributors} texth1={texth1} texth2={texth2} />
  );
}
