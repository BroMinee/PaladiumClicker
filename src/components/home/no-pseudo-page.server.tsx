import { getGithubContributors } from "@/lib/api/api-pala.server";
import { NoPseudoPageProps, NoPseudoPageWithContributeur } from "./no-pseudo-page.client";

export const dynamic = "force-static"; // Static generation

/**
 * Component that fetches contributors and renders NoPseudoPageWithContributeur on server side.
 * The list of contributors is fetched at build time to ensure static generation.
 */
export async function NoPseudoPage({ texth1, texth2, inputWrapper }: Omit<NoPseudoPageProps, "contributors">) {
  const contributors = await getGithubContributors();
  return (
    <NoPseudoPageWithContributeur contributors={contributors} texth1={texth1} texth2={texth2} inputWrapper={inputWrapper} />
  );
}
