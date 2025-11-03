"use client";
import React, { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { RankingType } from "@/types";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { Button } from "../ui/button";
import Select, { StylesConfig } from "react-select";
import makeAnimated from "react-select/animated";
import Image from "next/image";
import { getImagePathFromRankingType, rankingTypeToUserFriendlyText } from "@/lib/misc";
import TwitchOverlay from "./TwichAnimation";
import { constants,  API_PALATRACKER } from "@/lib/constants";

const customStyles: StylesConfig<SubOption, false> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    borderColor: state.isFocused ? "blue" : "gray",
    boxShadow: state.isFocused ? "0 0 0 1px blue" : "none",
    cursor: "text",
    "&:hover": {
      borderColor: state.isFocused ? "blue" : "gray",
    },
    padding: "0.5rem",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "lightgray" : "white",
    color: "black",
    padding: "0.5rem",
  }),
  menu: (provided) => ({
    ...provided,
    padding: "0.5rem",
  }),
};

const formatOptionLabel = ({ value } : {value: Exclude<RankingType, "vote">}) => (
  <div className="flex items-center">
    <Image src={getImagePathFromRankingType(value)} alt="label" width={48} height={48} unoptimized={true}
      className="h-8 w-8 pixelated mr-2 rounded-md"/>
    <div className="flex flex-col gap-1">
      <span className="ml-2 font-bold">{rankingTypeToUserFriendlyText(value)}</span>
    </div>

  </div>
);

const animatedComponents = makeAnimated();

enum Direction {
  "up",
  "down"
}

type SubOption = {
  value: Exclude<RankingType, "vote">;
  label: string;
};

type AvailableElementBase = {
  id: string;
  label: string;
  icon: string;
  hasSubOptions: boolean;
};

type AvailableElementWithSubOptions = AvailableElementBase & {
  hasSubOptions: true;
  subOptions: SubOption[];
};

type AvailableElementWithoutSubOptions = AvailableElementBase & {
  hasSubOptions: false;
};

export type AvailableElements = {
  metiers: AvailableElementWithoutSubOptions;
  classement: AvailableElementWithSubOptions;
  faction: AvailableElementWithoutSubOptions;
  money: AvailableElementWithoutSubOptions;
};

const AVAILABLE_ELEMENTS : AvailableElements = {
  metiers: {
    id: "metiers",
    label: "Métiers",
    icon: "⚒️",
    hasSubOptions: false
  },
  classement: {
    id: "classement",
    label: "Classement",
    icon: "🏆",
    hasSubOptions: true,
    subOptions: [
      { value: RankingType.money, label: "Money" },
      { value: RankingType["job.farmer"], label: "Farmer" },
      { value: RankingType["job.hunter"], label: "Hunter" },
      { value: RankingType["job.miner"], label: "Miner" },
      { value: RankingType["job.alchemist"], label: "Alchemist"},
      { value: RankingType.boss, label: "Boss" },
      { value: RankingType.egghunt, label: "Egghunt" },
      { value: RankingType.koth, label: "Koth" },
      { value: RankingType.clicker, label: "Clicker"},
      { value: RankingType.alliance, label: "Alignement"},

    ]
  },
  faction: {
    id: "faction",
    label: "Faction",
    icon: "⚔️",
    hasSubOptions: false
  },
  money: {
    id: "money",
    label: "Argent",
    icon: "💵",
    hasSubOptions: false,
  }
};

const AUTOPROMO_ELEMENT: AvailableElementWithoutSubOptions = {
  id: "auto-promo",
  label: "Promotion PalaTracker",
  icon: "📺",
  hasSubOptions: false
};

const AUTOPROMO : SelectedElement = {
  id: "auto-promo",
  type: constants.AUTOPROMO_CONFIG.type,
  duration: constants.AUTOPROMO_CONFIG.duration,
  subOption: constants.AUTOPROMO_CONFIG.subOption
};

export type SelectedElementConfig = {
  type: keyof AvailableElements | "autoPromo";
  duration: number;
  subOption: Exclude<RankingType, "vote"> | null;
}

export type SelectedElement = {
  id: string;
} & SelectedElementConfig;

export const TwitchOverlayConfig = ({username}: {username: string}) => {
  const {data: playerInfo} = usePlayerInfoStore();

  const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([
    { id: "metiers", type: "metiers", duration: 2 * 60, subOption: null }
  ]);
  const [previewUrl, setPreviewUrl] = useState("");

  const addElement = (elementType: keyof AvailableElements) => {
    const newElement = {
      id: `${elementType}-${Date.now()}`,
      type: elementType,
      duration: 2 * 60,
      subOption: AVAILABLE_ELEMENTS[elementType].hasSubOptions
        ? AVAILABLE_ELEMENTS[elementType].subOptions[0].value
        : null
    };
    setSelectedElements([...selectedElements, newElement]);
  };

  const removeElement = (id : string) => {
    setSelectedElements(selectedElements.filter((el: { id: string; }) => el.id !== id));
  };

  const moveElement = (index: number, direction : Direction) => {
    const newElements = [...selectedElements];
    const targetIndex = direction === Direction.up ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newElements.length) {
      [newElements[index], newElements[targetIndex]] = [newElements[targetIndex], newElements[index]];
      setSelectedElements(newElements);
    }
  };

  const updateDuration = (id : string, duration: string) => {
    setSelectedElements(selectedElements.map(el =>
      el.id === id ? { ...el, duration: parseInt(duration) ?? 0 } : el
    ));
  };

  const updateSubOption = (id : string, subOption : any) => {
    setSelectedElements(selectedElements.map(el =>
      el.id === id ? { ...el, subOption } : el
    ));
  };

  useEffect(() => {
    if (!playerInfo) {
      setPreviewUrl("Erreur playerInfo est null");
      return;
    }
    const username = playerInfo.username; // À remplacer dynamiquement
    const config = selectedElements.map(el => {
      if (el.subOption) {
        return `${el.type}:${el.subOption}:${el.duration}`;
      }
      return `${el.type}:${el.duration}`;
    }).join(",");

    const url = `${API_PALATRACKER}/twitch/${username}?config=${encodeURIComponent(config)}`;
    setPreviewUrl(url);
  },
  [selectedElements, playerInfo, setPreviewUrl]);

  const getTotalCycleTime = () => {
    return selectedElements.reduce((sum, el) => sum + el.duration, 0);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-white text-white p-8 md:p-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-3">Guide d&apos;installation</h1>
        <p className="text-lg md:text-xl opacity-90 text-black">Overlay Twitch avec statistiques en temps réel</p>
      </div>

      <div className="p-6 md:p-10 bg-card/80">

        <div className="bg-card border-l-4 border-primary rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-primary mb-4">Fonctionnalités de l&apos;overlay</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3 mt-0.5">✓</span>
              <span>Affichage des informations en temps semi-réel</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3 mt-0.5">✓</span>
              <span>Actualisation automatique à chaque <strong>fin de cycle</strong></span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3 mt-0.5">✓</span>
              <span>Auto-promotion du site pendant <strong>15 secondes</strong> à la fin d&apos;un cycle</span>
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
        <div className="mb-10 space-y-6">
          <div className="bg-gradient-to-r from-primary to-white rounded-xl p-6 shadow-lg text-black">
            <h2 className="text-3xl font-bold mb-2">⚙️ Configuration de l&apos;Overlay</h2>
            <p>Personnalise les éléments affichés et leur durée d&apos;affichage</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-5">
            <h4 className="font-bold text-blue-900 mb-2">ℹ️ Comment ça marche ?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ajoute les éléments que tu veux afficher dans ton overlay</li>
              <li>• Configure la durée d&apos;affichage de chaque élément (en secondes)</li>
              <li>• Réorganise l&apos;ordre avec les flèches ↑ ↓</li>
              <li>• L&apos;overlay changera automatiquement entre les éléments configurés</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-4 shadow border-l-4 border-primary">
            <div className="text-sm ">Durée totale du cycle</div>
            <div className="text-2xl font-bold text-blue-600">{formatTime(getTotalCycleTime())}</div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg">
            <h3 className="text-xl text-primary font-bold mb-4">Ajouter un élément</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.values(AVAILABLE_ELEMENTS).map((element) => (
                <button
                  key={element.id}
                  onClick={() => addElement(element.id as keyof AvailableElements)}
                  className="flex items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/20 transition-all duration-200 group"
                >
                  <span className="text-2xl">{element.icon}</span>
                  <span className="font-medium group-hover:text-primary">{element.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-primary">Éléments configurés</h3>

            {selectedElements.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg">Aucun élément configuré</p>
                <p className="text-sm">Ajoute des éléments ci-dessus pour commencer</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedElements.concat([AUTOPROMO]).map((element, index) => {
                  let elementData = AVAILABLE_ELEMENTS[element.type as keyof AvailableElements];
                  if (elementData === undefined) {
                    elementData = AUTOPROMO_ELEMENT;
                  }
                  return (
                    <div key={element.id} className="rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveElement(index, Direction.up)}
                            disabled={index === 0 || elementData.id === AUTOPROMO_ELEMENT.id}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveElement(index, Direction.down)}
                            disabled={index === selectedElements.length - 1 || elementData.id === AUTOPROMO_ELEMENT.id}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-4xl">{elementData.icon}</span>
                          <div className="flex-1">
                            <div className="font-bold text-2xl">{elementData.label}</div>
                            {elementData.hasSubOptions && (
                              <Select
                                className="mt-1"
                                formatOptionLabel={formatOptionLabel}
                                value={elementData.subOptions.find(opt => opt.value === element.subOption) ?? null}
                                onChange={(option) => updateSubOption(element.id, option?.value ?? null)}
                                options={elementData.subOptions}
                                isClearable={false}
                                components={{ ...animatedComponents}}
                                styles={customStyles}
                              />
                            )}

                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            disabled={elementData.id === AUTOPROMO_ELEMENT.id}
                            type="number"
                            min="1"
                            value={element.duration}
                            onChange={(e) => updateDuration(element.id, e.target.value)}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-medium"
                          />
                          <span className="text-sm w-8">sec</span>
                        </div>

                        <button
                          onClick={() => removeElement(element.id)}
                          className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                          disabled={elementData.id === AUTOPROMO_ELEMENT.id}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-card border-l-4 border-primary rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-primary mb-4">Prévisualisation</h3>
            <p className="mb-3">La prévisualisation est 10 fois plus rapide que l&apos;overlay normal.</p>
            <TwitchOverlay preview selectedElements={selectedElements}/>
          </div>
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
            {previewUrl && (
              <div className="bg-gray-900 rounded-lg p-4 border border-green-300">
                <div className="flex gap-3 items-center justify-center">
                  <div className="flex-1 overflow-x-auto">
                    <code className="text-gray-500 text-sm break-all">{previewUrl}</code>
                  </div>
                  <Button onClick={() => navigator.clipboard.writeText(previewUrl)}>
                      Copier
                  </Button>
                </div>
              </div>
            )}
            <p className="text-sm mt-2">Le pseudo <span className="bg-yellow-100 px-2 py-0.5 rounded font-medium text-black">{username}</span> sera utilisé.</p>
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
            <p className="mb-3">Il est fortement conseillé de redimensionner l&apos;overlay sur la scène pour correspondre à tes besoins, mais ne modifie pas la largeur et hauteur dans les options de l&apos;élément.</p>
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
                <span><strong>0.5 seconde</strong> → Transition en fondu entre chaque overlay</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-0.5">✓</span>
                <div>
                  <strong>15 secondes</strong> → Auto-promotion et actualisation des données.
                  <ul className="ml-6 mt-2 space-y-1 ">
                    <li>• Affichage du texte &quot;Palatracker&quot; pendant l&apos;actualisation</li>
                  </ul>
                </div>
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
                <li>Vérifiez que l&apos;URL est correcte et accessible dans votre navigateur : <a href={previewUrl} rel="noopener noreferrer" target="_blank"
                  className="text-primary hover:text-orange-700 transform transition-transform ease-in-out duration-500 hover:scale-[1.15] active:scale-95">clique ici pour tester</a></li>
                <li>Assurez-vous que les dimensions (900x250) sont bien configurées</li>
                <li>Essayez d&apos;actualiser la source en allant dans ses paramètres et en cliquant sur &quot;Rafraîchir le cache de cette page&quot;</li>
              </ul>
            </div>

            <div className="bg-card rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-primary mb-3">Les données ne se mettent pas à jour</h3>
              <ul className="ml-6 space-y-2 list-disc ">
                <li>La donnée se mettent à jour automatiquement à chaque fin de cycle.</li>
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
  );
};

export default TwitchOverlayConfig;