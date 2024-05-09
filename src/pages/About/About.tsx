const AboutPage = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ flexDirection: "row", display: "flex" }}>
          <h2 style={{ marginBottom: "0px", zIndex: 1, position: "relative" }}>
            Ce site a été entièrement réalisé par&nbsp;<div className={"BroMine"}>BroMine__</div>
          </h2>
        </div>
      </header>
      <br />
      <AboutBody />
    </div>
  );
}

const AboutBody = () => {
  return (
    <div>
      <h3>
        TODO
      </h3>
      <h3>Langage utilisé : HTML, CSS, ReactJS</h3>
      <h3>
        Code source : <a href="https://github.com/BroMinee/PaladiumClicker">GitHub</a>
      </h3>
    </div>
  );
}

export default AboutPage;