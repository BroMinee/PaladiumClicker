import { ClickerPage } from "@/components/clicker/clicker-page";
import ProfileFetcherWrapper from "@/components/ProfileFetcher.client";

/**
 * Generate Metadata
 * @param props.params - Username parameter
 */
export async function generateMetadata(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  return {
    title: `PalaTracker | Clicker Optimizer | ${params.username}`,
    description: "🚀 Tu cherches à optimiser le PalaClicker ? C'est ici que ça se passe !! 📈 Ce site calcule le meilleur achat en fonction de tes métiers, tes améliorations et tes bâtiments.",
    openGraph: {
      title: `PalaTracker | Clicker Optimizer | ${params.username}`,
      description: "🚀 Tu cherches à optimiser le PalaClicker ? C'est ici que ça se passe !! 📈 Ce site calcule le meilleur achat en fonction de tes métiers, tes améliorations et tes bâtiments."
    },
  };
}

/**
 * [Clicker Page](https://palatracker.bromine.fr/clicker-optimizer/BroMine__)
 * @param props.params - Username parameter
 */
export default async function ClickerOptimizerPage(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  return (
    <>
      <h1 className="text-4xl font-bold mb-2 ">Optimiseur de Clicker</h1>
      <ProfileFetcherWrapper username={params.username}>
        <ClickerPage/>
      </ProfileFetcherWrapper>
    </>
  );
}