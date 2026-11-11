import { ClickerPage } from "@/components/clicker/clicker-page";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/page";
import { textFormatting } from "@/lib/misc";

/**
 * Generate Metadata.
 */
export function generateMetadata() {
  return {
    title: "PalaTracker | Clicker Optimizer",
    description: "Tu cherches a optimiser le PalaClicker ? C'est ici que ca se passe ! Ce site calcule le meilleur achat en fonction de tes metiers, tes ameliorations et tes batiments.",
    openGraph: {
      title: "PalaTracker | Clicker Optimizer",
      description: "Tu cherches a optimiser le PalaClicker ? C'est ici que ca se passe ! Ce site calcule le meilleur achat en fonction de tes metiers, tes ameliorations et tes batiments.",
    },
  };
}

/**
 * Clicker Optimizer page.
 */
export default function ClickerOptimizerPage() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>
          {textFormatting("Optimiseur du °Clicker°")}
        </PageHeaderHeading>
        <PageHeaderDescription>
          {"Optimisez vos achats dans le PalaClicker en fonction de vos métiers, améliorations et bâtiments."}
        </PageHeaderDescription>
      </PageHeader>
      <ClickerPage/>
    </>
  );
}