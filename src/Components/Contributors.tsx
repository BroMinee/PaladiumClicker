import {Card, CardContent} from "@/components/ui/card.tsx";

const Contributors = () => {
  const contributeurs = [
    {
      pseudo: "BroMine__",
      uuid: "10b887ce-133b-4d5e-8b54-41376b832536",
      description: "Développeur",
      url: "https://github.com/BroMinee",
      urlImg: `https://crafatar.com/avatars/10b887ce-133b-4d5e-8b54-41376b832536?size=8`
    },
    {
      pseudo: "Hyper23_",
      uuid: "74b0f9b7-89ca-42ea-a93b-93681c9c83a3",
      description: "Fournisseur de données pour le PalaClicker",
      url: "",
      urlImg: `https://crafatar.com/avatars/74b0f9b7-89ca-42ea-a93b-93681c9c83a3?size=8`
    },
    {
      pseudo: "LipikYT",
      uuid: "258ec2e8-411e-4b9a-af19-4a1f684a54f5",
      description: "Autoproclamé : \"Le plus grand fan\"",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      urlImg: `https://crafatar.com/avatars/258ec2e8-411e-4b9a-af19-4a1f684a54f5?size=8`
    },
    {
      pseudo: "Riveur",
      uuid: "93db5a60-1a6d-407f-afc8-b41803efe5fa",
      description: "Refactorisation du code en TS et TailwindCSS",
      url: "https://github.com/riveur",
      urlImg: `https://crafatar.com/avatars/93db5a60-1a6d-407f-afc8-b41803efe5fa?size=8`
    }
  ];

  function handleOnClick(url: string, pseudo: string) {
    // open url in a new tab
    if (url !== "")
      window.open(url, "_blank");
    else {
      // search profil of the contributor
      let realPseudo = pseudo;
      if (pseudo.includes(" ") && pseudo.split(" ").length > 1)
        realPseudo = pseudo.split(" ")[1];
      const pseudoInput = document.getElementById("pseudo");
      const searchButton = document.getElementById("pseudo-submit");
      if (pseudoInput && searchButton) {
        pseudoInput.value = realPseudo;
        searchButton.click();
        pseudoInput.value = "";
        console.log("TODO check that the both element selected are in the same div")
      }

    }
  }

  return <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 gap-6">
    {contributeurs.map((contributeur, index) => (

        <Card key={index} className="hover:scale-105 duration-300" onClick={() => {
          handleOnClick(contributeur["url"], contributeur["pseudo"]);
        }}>
          <CardContent className="h-full pt-6 flex items-center gap-4">
            <div className="flex flex-col items-center gap-4">
              <img src={contributeur["urlImg"]} className="w-16 h-16 object-contain pixelated"
                   alt={`Skin de ${contributeur["pseudo"]}`}/>
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
    ))}
  </div>


}

export default Contributors;