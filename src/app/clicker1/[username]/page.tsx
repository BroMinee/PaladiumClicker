import { ClickerPage } from "@/components/clicker/clicker-page";
import ProfileFetcherWrapper from "@/components/ProfileFetcher.client";

/**
 * [Clicker Page](https://palatracker.bromine.fr/clicker-optimizer/BroMine__)
 * @param props.params - Username parameter
 */
export default async function ClickerOptimizerPage(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  return (
    <>
      <h1 className="text-4xl font-bold mb-2 text-white">Optimiseur de Clicker</h1>
      <ProfileFetcherWrapper username={params.username}>
        <ClickerPage/>
      </ProfileFetcherWrapper>
    </>
  );
}