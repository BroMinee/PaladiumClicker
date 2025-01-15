import "./WebHookMsg.css";
export function GenerateWebHookContent() {
  return (
    <div>
      <div className="alert-container">
        <div className="header">
          <img className="avatar"
               src="https://cdn.discordapp.com/avatars/1326985714629345311/df9807160558a49c4aa45eab94230471.webp?size=80"
               alt=""/>
          <div className="header-text">
            <span className="title">PalaTracker Alert</span>
            <span className="app-badge">APP</span>
            <time className="timestamp" dateTime="2025-01-13T18:54:47.235Z">13/01/2025 19:45</time>
          </div>
        </div>
        <div className="message-content">
          <p>C'est l'heure de la nouvelle QDF</p>
        </div>
        <div className="embed">
          <div className="embed-header">
            <span className="embed-title">Une nouvelle QDF est disponible!</span>
          </div>
          <div className="embed-description">
            <p>La qdf de la semaine est <strong>nether-brick-stairs</strong> en <strong>{100}</strong> exemplaires.
            </p>
            <p>Plus d'informations sur le site <a href="https://palatracker.bromine.fr/webhooks"
                                                  target="_blank">palatracker</a>.</p>
          </div>
          <div className="embed-footer">
            <img className="footer-icon"
                 src="https://images-ext-1.discordapp.net/external/8feIkTDAVpH2R9hEE4MACbaTAxHp2hYSaBFgTvSs-IU/https/palatracker.bromine.fr/favicon.png"
                 alt=""/>
            <span>PalaTracker | La QDF est mise à jour toutes les 15 minutes. • 13/01/2025 19:45</span>
          </div>
        </div>
      </div>
    </div>);
}