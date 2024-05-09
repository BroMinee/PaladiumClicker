import MetierList from "@/components/Metier/MetierList";
import { printPricePretty } from "@/lib/misc";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactSkinview3d from "react-skinview3d";
import ImportProfil from "../OptimizerClicker/Components/ImportProfil/ImportProfil";
import "./Profil.css";

const Profil = () => {

  const { data: playerInfo } = usePlayerInfoStore();

  const pseudo = playerInfo?.username ?? "Guest";

  return (
    <div className="App">
      <header className="App-header">
        <h3 style={{
          marginBottom: "0px",
          zIndex: 1,
          position: "relative",
          flexDirection: "row",
          display: "flex"
        }}>
          Profil de&nbsp;
          <div className={"BroMine"}>{pseudo}</div>
          <div>&nbsp; - &nbsp;</div>
          <div className={"BroMine"}>{playerInfo?.faction}</div>
        </h3>
      </header>
      <br />
      <ProfilBody />
    </div>
  )
}

const ProfilBody = () => {

  const { data: playerInfo } = usePlayerInfoStore();
  const [skinUrl, setSkinUrl] = useState("");

  const pseudo = playerInfo?.username ?? "Guest";

  useEffect(() => {
    axios.get(`https://api.ashcon.app/mojang/v2/user/${pseudo}`)
      .then(response => {
        const skinUrl = response.data.textures.skin.url;
        setSkinUrl(skinUrl);
      })
      .catch(error => {
        console.error(error);
      });
  }, [pseudo]);

  if (!playerInfo) {
    return null;
  }

  return (
    <div>
      <div style={{ fontSize: "3vmin" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          Rank:&nbsp;
          <div className={"BroMine"}>{playerInfo.rank}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          Tu joues depuis le&nbsp;
          <div className={"BroMine"}>{convertEpochToDateUTC2(playerInfo["firstJoin"])}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          Tu possèdes&nbsp;
          <div className={"BroMine"}>{printPricePretty(playerInfo["money"])}</div>
          &nbsp;$
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          Tu as joué un total de&nbsp;
          <div className={"BroMine"}>{computeTimePlayed(playerInfo["timePlayed"])}</div>
        </div>
        {playerInfo["timePlayed"] > 43200 ? <div>Ca explique l'odeur si forte 😘</div> : ""}
      </div>

      <div className={"Profil"}>
        <div>
          <ReactSkinview3d className={"SkinViewer"}
            skinUrl={skinUrl}
            height="250"
            width="250"
          />
          <ImportProfil showResetButton={false} />
        </div>
        <MetierList editable={false} />
      </div>
    </div>
  );
}

function computeTimePlayed(timeInMinutes: number) {
  const minute = timeInMinutes % 60;
  const hour = Math.floor(timeInMinutes / 60) % 24;
  const day = Math.floor(timeInMinutes / 60 / 24);
  let res = "";
  if (day > 0) {
    res += day + "j ";
  }
  if (hour > 0) {
    res += hour + "h ";
  }
  res += minute + "m";

  return res;
}

function convertEpochToDateUTC2(epoch: number) {
  const date = new Date(0); // The 0 there is the key, which sets the date to the epoch
  date.setUTCSeconds(epoch / 1000);
  return date.toLocaleString();
}

export default Profil;