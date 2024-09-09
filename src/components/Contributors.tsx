import { Card, CardContent } from "@/components/ui/card.tsx";

import Image from "next/image";

const Contributors = () => {
  const contributeurs = [
    {
      pseudo: "BroMine__",
      uuid: "10b887ce-133b-4d5e-8b54-41376b832536",
      description: "Développeur Frontend et Backend",
      url: "https://github.com/BroMinee",
      urlImg: `https://crafatar.com/avatars/10b887ce-133b-4d5e-8b54-41376b832536?size=8&overlay`
    },
    {
      pseudo: "Riveur",
      uuid: "93db5a60-1a6d-407f-afc8-b41803efe5fa",
      description: "Refactorisation du code en TS et TailwindCSS",
      url: "https://github.com/riveur",
      urlImg: `https://crafatar.com/avatars/93db5a60-1a6d-407f-afc8-b41803efe5fa?size=8&overlay`
    },
    {
      pseudo: "Berchbrown",
      uuid: "2f570125-bde4-4838-8c32-ca122f6e14a0",
      description: "Contributeur du backend",
      url: "https://github.com/berchbrown/",
      urlImg: `https://crafatar.com/avatars/2f570125-bde4-4838-8c32-ca122f6e14a0?size=8&overlay`
    }
  ];


  return <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 gap-6">
    {contributeurs.map((contributeur, index) => (
      <a href={contributeur["url"]} key={contributeur.pseudo + contributeur.uuid}>
        <Card key={index} className="hover:scale-105 duration-300 cursor-pointer">
          <CardContent className="h-full pt-6 flex items-center gap-4">
            <div className="flex flex-col items-center gap-4">
              <Image src={contributeur["urlImg"]} className="w-16 h-16 object-contain pixelated rounded-md"
                     alt={`Skin de ${contributeur["pseudo"]}`} width={128} height={128}
                     unoptimized={true}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-bold  text-primary">
                {contributeur["pseudo"]}
              </div>
              <span className="font-semibold">
              {contributeur["description"]}
            </span>
            </div>
          </CardContent>
        </Card>
      </a>
    ))}
  </div>


}

export default Contributors;