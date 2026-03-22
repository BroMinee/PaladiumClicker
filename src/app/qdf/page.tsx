import { QdfDisplay } from "@/components/qdf/qdf-display";
import { getCurrentQdf, getQdfHistory } from "@/lib/api/api-server-action.server";
import { QDF } from "@/types";

/**
 * Generate Metadata
 */
export function generateMetadata() {
  const title = "PalaTracker | Quête de Faction";
  const description = "Consultez la quête de faction actuelle et l'historique des semaines passées.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

/**
 * [QDF page](https://palatracker.bromine.fr/qdf)
 */
export default async function Page() {
  const [current, history] = await Promise.all([
    getCurrentQdf().catch(() => null),
    getQdfHistory().catch(() => [] as QDF[]),
  ]);
  return <QdfDisplay current={current} history={history}/>;
}
