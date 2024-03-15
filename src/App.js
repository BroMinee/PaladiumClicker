import logo from './logo.svg';
import './App.css';
import Building from "./Components/Building/Building";

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <img src={process.env.PUBLIC_URL + "/" + "coin.png"} className="App-logo" alt="logo" />
          <ul id={"list-batiment"}>
              <Building buildingName={"Building1"} imgPath={"/ImgBuilding/1.png"}/>
              <Building buildingName={"Building2"} imgPath={"/ImgBuilding/2.png"}/>
              <Building buildingName={"Building3"} imgPath={"/ImgBuilding/3.png"}/>
              <Building buildingName={"Building4"} imgPath={"/ImgBuilding/4.png"}/>
              <Building buildingName={"Building5"} imgPath={"/ImgBuilding/5.png"}/>
              <Building buildingName={"Building6"} imgPath={"/ImgBuilding/6.png"}/>
              <Building buildingName={"Building7"} imgPath={"/ImgBuilding/7.png"}/>

          </ul>
      </header>
    </div>
  );
}

export default App;
