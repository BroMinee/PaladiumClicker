import { Suspense } from "react";
import { ErrorContent } from "./error-content.client";

/** Generate metadata. */
export function generateMetadata() {
  return {
    title: "PalaTracker | Erreur",
    description: "PalaTracker : boostez votre progression et votre clicker sur Paladium comme jamais auparavant !",
  };
}

/** Error page. */
export default function Error500Page() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <ErrorContent />
    </Suspense>
  );
}
