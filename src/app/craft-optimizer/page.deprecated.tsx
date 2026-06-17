import { CraftOptimizerDisplay } from "@/components/craft/craft-optimizer.client";

/**
 * Generate Metadata
 * @param props.searchParams - Craft search params
 */
export function generateMetadata() {
  const title = "PalaTracker | Craft Optimizer";
  const description = "Optimise les crafts les plus rentables.";
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };
}
/**
 * [Craft Optimizer page](https://palatracker.bromine.fr/craft-optimizer)
 */
export default function Page() {
  return (
    <CraftOptimizerDisplay/>
  );
}