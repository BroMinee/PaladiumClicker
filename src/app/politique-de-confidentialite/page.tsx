import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/page";
import { constants } from "@/lib/constants";
import { textFormatting } from "@/lib/misc";

/**
 * Generate Metadata
 */
export async function generateMetadata() {
  const title = "PalaTracker | Politique de confidentialité";
  const description = "Politique de confidentialité de PalaTracker, un site web permettant de suivre sa progression sur Paladium.";
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div>
    <div className="flex items-center gap-4 mb-3">
      <div className="h-[2px] w-8 sm:w-12 bg-primary rounded-full shrink-0" />
      <h3 className="font-bold uppercase tracking-widest text-xs sm:text-sm">
        {title}
      </h3>
    </div>
    <Card>
      <p className="leading-relaxed text-sm sm:text-base text-card-foreground">
        {children}
      </p>
    </Card>
  </div>
);

/**
 * [Politique de confidentialité](https://palatracker.bromine.fr/politique-de-confidentialite)
 */
export default function PolitiqueDeConfidentialitePage() {
  return (
    <div className="flex flex-col gap-10">

      <PageHeader>
        <PageHeaderHeading>
          {textFormatting("Politique de °confidentialité°")}
        </PageHeaderHeading>
        <PageHeaderDescription>
          Dernière mise à jour : 09/09/2024
        </PageHeaderDescription>
      </PageHeader>

      <div className="flex flex-col gap-8">

        <Section title="Chers utilisateurs,">
          Nous sommes ravis que vous ayez choisi de visiter notre site web, PalaTracker. Nous sommes engagés à protéger
          votre vie privée et à assurer la sécurité de vos données personnelles. Cette politique de confidentialité
          décrit comment nous collectons, utilisons, divulguons et protégeons vos données personnelles lorsque vous
          utilisez notre site web.
        </Section>

        <Section title="Collecte de données">
          Nous collectons des données sur les utilisateurs de PalaTracker à partir de l&apos;
          <a
            href="https://api.paladium.games/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-orange-700 transition-colors duration-300"
          >
            API de Paladium
          </a>
          , conformément à{" "}
          <a
            href="https://paladium-pvp.fr/pages/tos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-orange-700 transition-colors duration-300"
          >
            leur politique de confidentialité.
          </a>{" "}Les données collectées incluent des informations telles que la faction,
          les niveaux de métiers, la place dans les différents classements, etc. Ces données sont stockées une fois
          par jour sur nos serveurs à conditions que votre pseudo Minecraft ait été cherché une fois.
        </Section>

        <Section title="Utilisation des données">
          Nous utilisons les données collectées via l&apos;API pour fournir et améliorer nos services, notamment en
          permettant aux utilisateurs de suivre leur progression et de comparer leurs performances avec d&apos;autres joueurs.
          Nous ne vendons pas, ne louons pas et ne partageons pas vos données personnelles avec des tiers.
          Vos données sont sécurisées par un système d&apos;authentification pour garantir la protection de vos données contre tout accès non autorisé.
        </Section>

        <Section title="Conservation des données">
          Les données collectées sont stockées sur nos serveurs pour une durée indéterminée. Vous pouvez à tout moment
          demander la suppression de vos données en nous contactant via notre{" "}
          <a
            href={constants.discord.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-orange-700 transition-colors duration-300"
          >
            Discord
          </a>
          .
        </Section>

        <Section title="Modification de la politique de confidentialité">
          Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment, sans préavis. Nous
          vous encourageons à consulter régulièrement cette page pour prendre connaissance des éventuelles
          modifications. En continuant à utiliser notre site web, vous acceptez les conditions de cette politique de
          confidentialité.
        </Section>

        <Section title="Contactez-nous">
          Si vous avez des questions ou des préoccupations concernant notre politique de confidentialité, n&apos;hésitez
          pas à nous contacter via notre{" "}
          <a
            href={constants.discord.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-orange-700 transition-colors duration-300"
          >
            discord
          </a>.<br/><br/>
          Merci de votre confiance.<br/>
          L&apos;équipe de PalaTracker.
        </Section>

      </div>
    </div>
  );
}
