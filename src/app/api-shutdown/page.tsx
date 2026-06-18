import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/page";
import { textFormatting } from "@/lib/misc";
import { constants } from "@/lib/constants";

/**
 * Generate Metadata
 */
export async function generateMetadata() {
  const title = "PalaTracker | Arrêt de l'API";
  const description = "Explication de la disparition des fonctionnalités du PalaTracker suite à l'arrêt de l'API publique de Paladium.";
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };
}

const Section = ({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) => (
  <div>
    <div className="flex items-center gap-4 mb-3">
      <div className="h-[2px] w-8 sm:w-12 bg-primary rounded-full shrink-0" />
      <h3 className="font-bold uppercase tracking-widest text-xs sm:text-sm">
        {title}
      </h3>
    </div>
    <Card>
      {icon && (
        <div className="flex items-center gap-3 mb-3 text-primary">
          {icon}
        </div>
      )}
      <div className="leading-relaxed text-sm sm:text-base text-card-foreground">
        {children}
      </div>
    </Card>
  </div>
);

const FeatureRow = ({ name, available }: { name: string; available: boolean }) => (
  <div className={"flex items-center gap-3 py-2 border-b border-secondary last:border-0"}>
    <div className={`w-2 h-2 rounded-full shrink-0 ${available ? "bg-green-500" : "bg-red-500/60"}`} />
    <span className="text-sm">{name}</span>
  </div>
);

/**
 * [API Shutdown explanation page](https://palatracker.bromine.fr/api-shutdown)
 */
export default function ApiShutdownPage() {
  return (
    <div className="flex flex-col gap-10">

      <PageHeader>
        <PageHeaderHeading>
          {textFormatting("Arrêt de l'°API° Paladium")}
        </PageHeaderHeading>
        <PageHeaderDescription>
          Pourquoi une grande partie des fonctionnalités du site a disparu.
        </PageHeaderDescription>
      </PageHeader>

      <div className="flex flex-col gap-8">

        <Section title="Ce qui s'est passé" icon={<span className="font-semibold text-base">L&apos;accès à l&apos;API a été coupé</span>}>
          PalaTracker fonctionnait en très grande partie grâce à une <strong>API publique</strong>{" "}mise à disposition par Paladium.
          Concrètement, c&apos;est ce qui permettait au site de récupérer votre profil, vos niveaux de métiers, votre argent, vos classements, les prix du marché, etc.<br /><br />
          Paladium a décidé de mettre fin à cet accès. Sans cette source de données, toutes les fonctionnalités qui en dépendaient sont devenues inutilisables du jour au lendemain.
          Cette décision est pour l&apos;instant définitive.
        </Section>

        <Section title="Ce qui a disparu" icon={<span className="font-semibold text-base">Fonctionnalités retirées</span>}>
          <p className="mb-4">Les pages suivantes ont été désactivées car elles reposaient entièrement sur les données de l&apos;API :</p>
          <FeatureRow name="Profil joueur" available={false} />
          <FeatureRow name="Classement" available={false} />
          <FeatureRow name="AH Tracker" available={false} />
          <FeatureRow name="Admin-Shop" available={false} />
          <FeatureRow name="Craft Optimizer" available={false} />
          <FeatureRow name="QDF" available={false} />
          <FeatureRow name="Alertes Discord" available={false} />
          <FeatureRow name="Overlay Twitch" available={false} />
          <FeatureRow name="Page de statut du serveur" available={false} />
        </Section>

        <Section title="Ce qui reste disponible" icon={<span className="font-semibold text-base">Outils hors-ligne</span>}>
          <p className="mb-4">
            Certains outils ne dépendaient pas de données en temps réel fonctionnent toujours <strong>entièrement hors-ligne</strong>.
            Vous devez en revanche saisir vos informations vous-même, et le site fait les calculs de son côté.
          </p>
          <FeatureRow name="Clicker Optimizer" available={true} />
          <FeatureRow name="Calculateur d'XP Java & Bedrock" available={true} />
          <FeatureRow name="PalaAnimation Trainer" available={true} />
          <FeatureRow name="Calculateur de Craft" available={true} />
          <FeatureRow name="Craft Wordle" available={true} />
          <FeatureRow name="Craft Finder" available={true} />
        </Section>

        <Section title="La suite" icon={<span className="font-semibold text-base">Aucune alternative prévue</span>}>
          Il n&apos;existe pas à ce jour d&apos;alternative pour remplacer les données que fournissait l&apos;API de Paladium.
          Le projet continue d&apos;exister autour des outils hors-ligne qui restent utiles.
          Si la situation venait à évoluer, une mise à jour sera publiée sur le{" "}
          <a
            href={constants.discord.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-orange-700 transition-colors duration-300"
          >
            Discord
          </a>.
        </Section>

      </div>
    </div>
  );
}
