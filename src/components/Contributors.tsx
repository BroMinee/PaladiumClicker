import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";
import { safeJoinPaths } from "@/lib/misc";

import { constants } from "@/lib/constants";

/**
 * Component that displays the list of contributors.
 */
export const Contributors = () => {
  const contributeurs = [
    {
      pseudo: "BroMine__",
      uuid: "10b887ce-133b-4d5e-8b54-41376b832536",
      description: "Développeur Frontend et Backend",
      url: "https://github.com/BroMinee",
      urlImg: "https://mineskin.eu/helm/10b887ce-133b-4d5e-8b54-41376b832536",
    },
    {
      pseudo: "Riveur",
      uuid: "93db5a60-1a6d-407f-afc8-b41803efe5fa",
      description: "Refactorisation du code en TS et TailwindCSS",
      url: "https://github.com/riveur",
      urlImg: "https://mineskin.eu/helm/93db5a60-1a6d-407f-afc8-b41803efe5fa",
      lastContribution: "13-08-2024"
    },
    {
      pseudo: "Berchbrown",
      uuid: "2f570125-bde4-4838-8c32-ca122f6e14a0",
      description: "Contributeur du backend",
      url: "https://github.com/berchbrown/",
      urlImg: "https://mineskin.eu/helm/2f570125-bde4-4838-8c32-ca122f6e14a0",
      lastContribution: "20-08-2024"
    },
    {
      pseudo: "0livierMinecraft",
      uuid: "108352f9-373e-4800-9f54-d55b0a35e520",
      description: "Optimisateur mathématique du PalaClicker",
      url: safeJoinPaths("/", constants.profilPath, "0livierMinecraft"),
      urlImg: "https://mineskin.eu/helm/108352f9-373e-4800-9f54-d55b0a35e520",
      lastContribution: "30-12-2024"
    }
  ];

  return <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 gap-6">
    {contributeurs.map((contributeur, index) => (
      <a href={contributeur["url"]} key={contributeur.pseudo + contributeur.uuid} className="h-full">
        <Card key={index} className="hover:scale-105 duration-300 cursor-pointer h-full">
          <CardContent className="h-full pt-6 flex items-center gap-4">
            <div className="flex flex-col items-center gap-4">
              <Image src={contributeur.urlImg} className="w-16 h-16 object-contain pixelated rounded-md"
                alt={`Skin de ${contributeur.pseudo}`} width={128} height={128}
                unoptimized={true}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-bold  text-primary">
                {contributeur.pseudo}
              </div>
              <span className="font-semibold">
                {contributeur.description}
              </span>
              {
                contributeur["lastContribution"] &&
                <span className="text-gray-500">
                  Dernière contribution le {contributeur["lastContribution"]}
                </span>
              }
            </div>
          </CardContent>
        </Card>
      </a>
    ))}
  </div>;

};