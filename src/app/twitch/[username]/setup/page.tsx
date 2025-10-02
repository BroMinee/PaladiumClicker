import React from "react";
import constants, { API_PALATRACKER } from "@/lib/constants.ts";
import ProfileFetcherWrapper from "@/components/ProfileFetcher";
import TwitchOverlay from "@/components/Twitch/TwichAnimation";

export function generateMetadata() {
  return {
    title: "PalaTracker | Twitch",
    description: "Obtiens un overlay twitch avec tes niveaux de métiers",
    openGraph: {
      title: "PalaTracker | Twitch",
      description: "Obtiens un overlay twitch avec tes niveaux de métiers"
    },
  };
}

export default async function WebHooksPage(props: { params: Promise<{ username: string }> }) {
  const username = await props.params.then(p => p.username);
  return (
    <ProfileFetcherWrapper username={username}>
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-3">Guide d&apos;installation</h1>
          <p className="text-lg md:text-xl opacity-90 text-black">Overlay Twitch avec statistiques en temps réel</p>
        </div>

        <div className="p-6 md:p-10 bg-card/80">

          <div className="bg-card border-l-4 border-primary rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-primary mb-4">Fonctionnalités de l&apos;overlay</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-0.5">✓</span>
                <span>Affichage des 4 métiers en temps semi-réel</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-0.5">✓</span>
                <span>Actualisation automatique toutes les <strong>6 minutes</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-0.5">✓</span>
                <span>Auto-promotion du site pendant <strong>15 secondes</strong> toutes les 6 minutes</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-0.5">✓</span>
                <span>Taille fixe de 900x250px avec background opaque pour masquer des coordonnées</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-0.5">✓</span>
                <span>Design moderne avec animations fluides</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border-l-4 border-primary rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-primary mb-4">Prévisualisation</h3>
            <p className="mb-3">La prévisualisation est 10 fois plus rapide que l&apos;overlay normal.</p>
            <TwitchOverlay preview/>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-primary-dark mb-6 pb-3 border-b-4 border-primary" id="obs">
                        Installation
            </h2>

            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-5 mt-6 mb-6">
              <p className="text-green-800">
                <strong className="font-bold">💡 Note :</strong> Que ça soit dans OBS ou Streamlabs l&apos;installation est identique.</p>
            </div>

            <div className="bg-card rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            Ajouter une source &quot;Navigateur&quot;
              </h3>
              <p className="mb-3">Dans OBS Studio / Streamlabs :</p>
              <ul className="ml-6 space-y-2 list-disc ">
                <li>Cliquez sur le <strong>+</strong> dans la section &quot;Sources&quot;</li>
                <li>Sélectionnez <span className="bg-yellow-100 px-2 py-1 rounded font-medium text-black">Navigateur web</span></li>
                <li>Donnez-lui un nom (ex: &quot;Overlay Paladium Métier&quot;)</li>
              </ul>
            </div>

            <div className="bg-card rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            Configurer l&apos;URL
              </h3>
              <p className="mb-3">Dans le champ URL, entrez l&apos;adresse suivante :</p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-3">
                {API_PALATRACKER}/twitch/{username}
              </div>
              <p className="text-sm">Le pseudo <span className="bg-yellow-100 px-2 py-0.5 rounded font-medium text-black">{username}</span> sera utilisé.</p>
            </div>

            <div className="bg-card rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                            Paramètres recommandés
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Paramètre</th>
                      <th className="px-6 py-3 text-left font-semibold">Valeur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-card/80 bg-card">
                      <td className="px-6 py-3 font-medium">Largeur</td>
                      <td className="px-6 py-3">900 (minimum)</td>
                    </tr>
                    <tr className="hover:bg-card/80 bg-card">
                      <td className="px-6 py-3 font-medium">Hauteur</td>
                      <td className="px-6 py-3">250 (minimum)</td>
                    </tr>
                    <tr className="hover:bg-card/80 bg-card">
                      <td className="px-6 py-3 font-medium">Contrôler l&apos;audio via OBS</td>
                      <td className="px-6 py-3">❌ Désactivé</td>
                    </tr>
                    <tr className="hover:bg-card/80 bg-card">
                      <td className="px-6 py-3 font-medium">Rafraîchir le navigateur lorsque la scène devient active</td>
                      <td className="px-6 py-3">☑️ Activé</td>
                    </tr>
                    <tr className="hover:bg-card/80 bg-card">
                      <td className="px-6 py-3 font-medium">Désactiver la source quand elle n&apos;est pas visible</td>
                      <td className="px-6 py-3">☑️ Activé (recommandé)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                            Redimensionner l&apos;overlay
              </h3>
              <p className="mb-3">Il est fortement conseiller de redimensionner l&apos;overlay sur la scène pour correspondre à tes besoins, mais ne modifie pas la largeur et hauteur dans les options de l&apos;élément.</p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-primary-dark mb-6 pb-3 border-b-4 border-primary">
                        Comportement de l&apos;overlay
            </h2>

            <div className="bg-card border-l-4 border-primary rounded-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Timeline du cycle d&apos;affichage</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3 mt-0.5">✓</span>
                  <span><strong>6 minutes</strong> → Affichage des 4 métiers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3 mt-0.5">✓</span>
                  <span><strong>0.5 seconde</strong> → Transition en fondu</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3 mt-0.5">✓</span>
                  <div>
                    <strong>15 secondes</strong> → Auto-promotion et actualisation des métiers.
                    <ul className="ml-6 mt-2 space-y-1 ">
                      <li>• Affichage du texte &quot;Palatracker&quot; pendant l&apos;actualisation</li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3 mt-0.5">✓</span>
                  <span><strong>0.5 seconde</strong> → Transition en fondu</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3 mt-0.5">✓</span>
                  <span><strong>🔄 Retour au début</strong> du cycle</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-5 mt-6">
              <p className="text-green-800">
                <strong className="font-bold">💡 Astuce :</strong> Les données sont mises à jour pendant première phase de transition vers les statistiques, garantissant que vous affichez toujours les informations les plus récentes.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary-dark mb-6 pb-3 border-b-4 border-primary" id="depannage">
                        🐛 Dépannage
            </h2>

            <div className="space-y-6">

              <div className="bg-card rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-primary mb-3">L&apos;overlay ne s&apos;affiche pas</h3>
                <ul className="ml-6 space-y-2 list-disc ">
                  <li>Vérifiez que l&apos;URL est correcte et accessible dans votre navigateur : <a href="https://palatracker.bromine.fr/twitch/Tytouine" rel="noopener noreferrer" target="_blank"
                    className="text-primary hover:text-orange-700 transform transition-transform ease-in-out duration-500 hover:scale-[1.15] active:scale-95">clique ici pour tester</a></li>
                  <li>Assurez-vous que les dimensions (900x250) sont bien configurées</li>
                  <li>Essayez d&apos;actualiser la source en allant dans ses paramètres et en cliquant sur &quot;Rafraîchir le cache de cette page&quot;</li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-primary mb-3">Les données ne se mettent pas à jour</h3>
                <ul className="ml-6 space-y-2 list-disc ">
                  <li>La donnée se mettent à jour automatiquement toutes les 6 minutes.</li>
                  <li>Les changements de niveau peuvent mettre du temps pour nous parvenir, il faut parfois attendre plusieurs heures.</li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-primary mb-3">L&apos;overlay cause des ralentissements</h3>
                <ul className="ml-6 space-y-2 list-disc ">
                  <li>Activez &quot;Désactiver la source quand elle n&apos;est pas visible&quot;</li>
                  <li>Réduisez la fréquence d&apos;images à 30 FPS</li>
                  <li>Assurez-vous qu&apos;il n&apos;y a qu&apos;une seule instance de l&apos;overlay</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card px-6 py-8 md:px-10 text-center text-gray-600 border-t border-gray-200">
          <p className="text-sm mt-2">Besoin d&apos;aide ? Contacte moi sur <a
            href={constants.discord.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-orange-700 transition-colors duration-300"
          >
            discord
          </a>.</p>
        </div>
      </div>
    </ProfileFetcherWrapper>
  );
}
