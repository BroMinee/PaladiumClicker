import ImportProfil from "@/pages/OptimizerClicker/Components/ImportProfil/ImportProfil";
import "./NoPseudoPage.css"

const NoPseudoPage = () => {

  return (
    <div className={"NoPseudoPage"}>
      <p style={{ display: "flex", justifyContent: "center", fontSize: "50px" }}>
        Afficher le profil&nbsp;
        <span className={"BroMine"}>Paladium</span>
        &nbsp;de&nbsp;
      </p>
      <ImportProfil showResetButton={false} />
    </div>
  );
}

export default NoPseudoPage;