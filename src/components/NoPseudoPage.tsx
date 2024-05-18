import GradientText from "@/components/shared/GradientText";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import ImportProfil from "@/pages/OptimizerClicker/Components/ImportProfil";
import {FaHeart} from "react-icons/fa";
import constants from "@/lib/constants.ts";



const Contributors = () => {
  const contributeurs = [
    {
      pseudo: "BroMine__",
      uuid: "10b887ce-133b-4d5e-8b54-41376b832536",
      description: "Développeur",
      url: "https://github.com/BroMinee"
    },
    {
      pseudo: "Hyper23_",
      uuid: "74b0f9b7-89ca-42ea-a93b-93681c9c83a3",
      description: "Fournisseur de données pour le PalaClicker",
      url: ""
    },
    {
      pseudo: "LipikYT",
      uuid: "258ec2e8-411e-4b9a-af19-4a1f684a54f5",
      description: "Autoproclamé : \"Le plus grand fan\"",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ];
  return contributeurs.map((contributeur, index) => (
      <Contributor key={index} pseudo={contributeur["pseudo"]}
                   urlSkin={`https://crafatar.com/avatars/${contributeur["uuid"]}?size=8`}
                   description={contributeur["description"]} url={contributeur["url"]}/>
  ))
}


export const Contributor = ({pseudo, urlSkin, description, url}: {
  pseudo: string,
  urlSkin: string,
  description: string,
  url: string
}) => {
  function handleOnClick() {
    // open url in a new tab
    if (url !== "")
      window.open(url, "_blank");
    else {
      // search profil of the contributor
      // let realPseudo = pseudo;
      // if (pseudo.includes(" ") && pseudo.split(" ").length > 1)
      //   realPseudo = pseudo.split(" ")[1];
      // document.getElementById("pseudoInputNavBar").value = realPseudo;
      // document.getElementById("pseudoInputNavBar-button").click();
      // document.getElementById("profilNavbar").click();

    }
  }

  return (
      <a className={"Contributor Contributor-hover"} onClick={handleOnClick}>
        <div>
          {urlSkin !== "" ?
              <div style={{padding: "10px 10px"}}>
                <img src={urlSkin} className="Building-img"
                     style={{borderRadius: "8px", imageRendering: "pixelated"}}/>
              </div> : ""}
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            paddingRight: "10px"
          }}>
            <div style={{fontWeight: "bold"}}>{pseudo}</div>
            <div style={{maxWidth: "20vmin"}}>{description}</div>
          </div>
        </div>
      </a>
  )
}


const NoPseudoPage = () => {

  return (
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Bienvenue sur l'optimiseur du{" "}
              <GradientText className="font-extrabold">PalaClicker</GradientText>
            </CardTitle>
            <CardDescription>
              Made with <FaHeart className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="pb-2">Pour commencer, entrez le pseudo d'utilisateur pour voir son profil</p>
            <ImportProfil/>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-row items-center pb-4 pt-4">
            <Discord />

          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Constributeurs
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row">
            <Contributors/>
          </CardContent>
        </Card>

      </div>

  );
}

const Discord = () => {
  return <div className="flex flex-row text-primary">
    <a href={constants.discord.url} target="_blank">
      <img src={import.meta.env.BASE_URL + `/discord_logo.jpg`} alt="Logo Discord"
           className="object-cover h-12 w-auto"/>
    </a>
    <div>
      {constants.discord.name}{" "}
      <p className="text-discord">Discord</p>
    </div>
  </div>
}

export default NoPseudoPage;