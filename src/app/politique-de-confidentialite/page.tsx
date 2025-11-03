import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardTitleH1 } from "@/components/ui/card.tsx";
import { GradientText } from "@/components/shared/GradientText\.tsx";
import { constants } from "@/lib/constants.ts";
import React from "react";

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

/**
 * [Politique de confidentialité](https://palatracker.bromine.fr/politique-de-confidentialite)
 */
export default function Home() {

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitleH1 className="text-primary">
            Politique de confidentialité de{" "}
            <GradientText className="font-extrabold">PalaTracker</GradientText>
          </CardTitleH1>
          <CardDescription>
            Dernière mise à jour : 09/09/2024
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Chers utilisateurs,</CardTitle>
        </CardHeader>
        <CardContent>
          Nous sommes ravis que vous ayez choisi de visiter notre site web, PalaTracker. Nous sommes engagés à protéger
          votre vie privée et à assurer la sécurité de vos données personnelles. Cette politique de confidentialité
          décrit comment nous collectons, utilisons, divulguons et protégeons vos données personnelles lorsque vous
          utilisez notre site web.
        </CardContent>
      </Card>
      <Card id="Collect de données">
        <CardHeader>
          <CardTitle className="text-primary">Collecte de données</CardTitle>
        </CardHeader>
        <CardContent>
          Nous collectons des données sur les utilisateurs de PalaTracker à partir de l&apos;<a
            href="https://api.paladium.games/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-orange-700 transition-colors duration-300"
          >
          API de Paladium
          </a>, conformément
          à <a
            href="https://paladium-pvp.fr/pages/tos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-orange-700 transition-colors duration-300"
          >
          leur politique de confidentialité.
          </a> Les données collectées incluent des informations telles que la faction,
          les niveaux de métiers, la place dans les différents classements, etc. Ces données sont
          stockées une fois
          par jour sur nos serveurs à conditions que votre pseudo Minecraft ait été cherché une fois.
        </CardContent>
      </Card>
      <Card id="Utilisation de données">
        <CardHeader>
          <CardTitle className="text-primary">Utilisation des données</CardTitle>
        </CardHeader>
        <CardContent>
          Nous utilisons les données collectées via l&apos;API pour fournir et améliorer nos services, notamment en
          permettant aux
          utilisateurs de suivre leur progression et de comparer leurs performances avec d&apos;autres joueurs. Nous ne
          vendons pas, ne louons pas et ne partageons pas vos données personnelles avec des tiers. Vos données sont
          sécurisées par un système d&apos;authentification pour garantir la protection de vos données contre tout accès
          non
          autorisé.
        </CardContent>
      </Card>
      <Card id="Conservations des données">
        <CardHeader>
          <CardTitle className="text-primary">Conservation des données</CardTitle>
        </CardHeader>
        <CardContent>
          Les données collectées sont stockées sur nos serveurs pour une durée indéterminée. Vous pouvez à tout moment
          demander la suppression de vos données en nous contactant via notre <a
            href={constants.discord.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-orange-700 transition-colors duration-300"
          >
          discord
          </a>.
        </CardContent>
      </Card>

      <Card id="Modification de la politique de confidentialité">
        <CardHeader>
          <CardTitle className="text-primary">Modification de la politique de confidentialité</CardTitle>
        </CardHeader>
        <CardContent>
          Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment, sans préavis. Nous
          vous encourageons à consulter régulièrement cette page pour prendre connaissance des éventuelles
          modifications. En continuant à utiliser notre site web, vous acceptez les conditions de cette politique de
          confidentialité.
        </CardContent>
      </Card>
      <Card id="Contactez-nous">
        <CardHeader>
          <CardTitle className="text-primary">Contactez-nous</CardTitle>
        </CardHeader>
        <CardContent>
          Si vous avez des questions ou des préoccupations concernant notre politique de confidentialité, n&apos;hésitez
          pas
          à nous contacter via notre <a
            href={constants.discord.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-orange-700 transition-colors duration-300"
          >
          discord
          </a>.<br/><br/>
          Merci de votre confiance.<br/>
          L&apos;équipe de PalaTracker.
        </CardContent>
      </Card>

    </div>
  );
}