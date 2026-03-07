import { Clicker } from "./clicker";
import { BuildingProps } from "./building";
import { Upgrade100Props } from "./upgrade100";
import { Upgrade200Props } from "./upgrade200";
import { UpgradeManyProps } from "./upgrade-many";
import { UpgradePosteriorProps } from "./upgrade-posterior";
import { UpgradeCategoryProps } from "./upgrade-category";
import { UpgradeGlobalProps } from "./upgrade-global";
import { UpgradeTerrainProps } from "./upgrade-terrain";
import { constants } from "@/lib/constants";

/**
 * Creates a new clicker game with all the buildings and upgrades
 * @returns A new clicker game
 */
export function setupClicker(test = false): Clicker {
  const buildingProps: Omit<BuildingProps, "clicker">[] = [
    { name: "Mine abandonnée", price: 1250, index: 0 },
    { name: "Caverne aux gros cailloux", index: 1, price: 3500 },
    { name: "Mine des nains", index: 2, price: 6000 },
    { name: "Jardin de mamie", index: 3, price: 12500 },
    { name: "Cabane de sorcière", index: 4, price: 27500 },
    { name: "Ruche bourdonnante", index: 5, price: 67500 },
    { name: "Forêt enneigée", index: 6, price: 125000 },
    { name: "Banquise gelée", index: 7, price: 315000 },
    { name: "Port de pirate", index: 8, price: 650000 },
    { name: "Île volcanique", index: 9, price: 1575000 },
    { name: "Dunes caniculaires", index: 10, price: 3150000 },
    { name: "Forêt mystique", index: 11, price: 6000000 },
    { name: "Jungle luxuriante", index: 12, price: 11500000 },
    { name: "Temple oublié", index: 13, price: 25750000 },
    { name: "Crypte millénaire", index: 14, price: 55000000 },
    { name: "Gouffre sans fond", index: 15, price: 95000000 },
    { name: "Mine autonome", index: 16, price: 185000000 },
    { name: "Ferme à golem", index: 17, price: 385000000 },
    { name: "Grotte radioactive", index: 18, price: 750000000 },
    { name: "Laboratoire biologique", index: 19, price: 1350000000 },
    { name: "Sous-marin thermonucléaire", index: 20, price: 2550000000 },
    { name: "Fosse du Kraken", index: 21, price: 5950000000 },
    { name: "Faille énigmatique", index: 22, price: 9500000000 },
    { name: "Terres corrompues", index: 23, price: 18500000000 },
    { name: "Bug dans la matrice", index: 24, price: 34500000000 },
    { name: "Ordinateur quantique", index: 25, price: 75000000000 },
    { name: "Accélerateur à particules", index: 26, price: 125000000000 },
    { name: "Machine à voyager dans le temps", index: 27, price: 235000000000 },
    { name: "Caverne préhistorique", index: 28, price: 455000000000 },
    { name: "Pyramide extraterrestre", index: 29, price: 885000000000 },
    { name: "Atlantis", index: 30, price: 1550000000000 },
    { name: "Panthéon des Grands Anciens", index: 31, price: 2950000000000 },
    { name: "Centre de la Terre", index: 32, price: 5500000000000 },
    { name: "Repère du Diable", index: 33, price: 10500000000000 },
    { name: "Jardin d'Eden", index: 34, price: 19500000000000 },
  ];

  const upgrade100Props: Omit<Upgrade100Props, "clicker">[] = [
    { name: "Lampe frontale", index: 0, active_index: [0], price: 5625, dayCondition: 0 },
    { name: "Dynamite", index: 1, active_index: [1], price: 18900, dayCondition: 0 },
    { name: "Musique de nain", index: 2, active_index: [2], price: 47250, dayCondition: 3 },
    { name: "Livre de jardinage poussièreux", index: 3, active_index: [3], price: 112500, dayCondition: 5 },
    { name: "Chaudron bouillonant", index: 4, active_index: [4], price: 247500, dayCondition: 8 },
    { name: "Combinaison d'apiculteur", index: 5, active_index: [5], price: 607500, dayCondition: 11 },
    { name: "Semelles anti-glissade", index: 6, active_index: [6], price: 1125000, dayCondition: 14 },
    { name: "Raquettes à neige", index: 7, active_index: [7], price: 2835000, dayCondition: 16 },
    { name: "Canons chargés", index: 8, active_index: [8], price: 5850000, dayCondition: 19 },
    { name: "Potion de résistance au feu", index: 9, active_index: [9], price: 14175000, dayCondition: 22 },
    { name: "Bottes en cuir épais", index: 10, active_index: [10], price: 28350000, dayCondition: 24 },
    { name: "Parchemin anti-malédictions", index: 11, active_index: [11], price: 54000000, dayCondition: 27 },
    { name: "Machette en paladium", index: 12, active_index: [12], price: 103500000, dayCondition: 30 },
    { name: "Radar à pièges antiques", index: 13, active_index: [13], price: 231750000, dayCondition: 34 },
    { name: "Confuseur de cultiste", index: 14, active_index: [14], price: 495000000, dayCondition: 39 },
    { name: "Cordre en fibre de carbone", index: 15, active_index: [15], price: 855000000, dayCondition: 43 },
  ];

  const upgrade200Props: Omit<Upgrade200Props, "clicker">[] = [
    { name: "Potion de vision nocturne", index: 0, active_index: [0], price: 11875, dayCondition: 1 },
    { name: "Big dynamite", index: 1, active_index: [1], price: 46550, dayCondition: 1 },
    { name: "Suppression des taxes douanières", index: 2, active_index: [2], price: 99750, dayCondition: 4 },
    { name: "Cookies faits avec amour", index: 3, active_index: [3], price: 237500, dayCondition: 6 },
    { name: "Extracteur de bave de crapauds", index: 4, active_index: [4], price: 522500, dayCondition: 9 },
    { name: "Vaccin anti-piqure", index: 5, active_index: [5], price: 1282500, dayCondition: 12 },
    { name: "Diplôme de ski", index: 6, active_index: [6], price: 2375000, dayCondition: 15 },
    { name: "Moto-neige high tech", index: 7, active_index: [7], price: 5985000, dayCondition: 17 },
    { name: "Cuirassé pirate", index: 8, active_index: [8], price: 12350000, dayCondition: 20 },
    { name: "Usine à lave", index: 9, active_index: [9], price: 29925000, dayCondition: 23 },
    { name: "Bottes d'astronaute", index: 10, active_index: [10], price: 59850000, dayCondition: 25 },
    { name: "Condensateur de malédictions", index: 11, active_index: [11], price: 114000000, dayCondition: 28 },
    { name: "Découpeur de lianes laser", index: 12, active_index: [12], price: 218500000, dayCondition: 31 },
    { name: "Sort de détection omniscient", index: 13, active_index: [13], price: 489250000, dayCondition: 35 },
    { name: "Culte du Namuu divin", index: 14, active_index: [14], price: 1045000000, dayCondition: 40 },
    { name: "Ascenseur supersonique", index: 15, active_index: [15], price: 1805000000, dayCondition: 44 },
  ];

  const upgradeManyProps: Omit<UpgradeManyProps, "clicker">[] = [
    { name: "Production nombreuse - Mine abandonnée", index: 0, active_index: [0], price: 1250, dayCondition: 0 },
    { name: "Production nombreuse - Caverne aux gros cailloux", index: 1, active_index: [1], price: 12000, dayCondition: 0 },
    { name: "Production nombreuse - Mine des nains", index: 2, active_index: [2], price: 24000, dayCondition: 2 },
    { name: "Production nombreuse - Jardin de mamie", index: 3, active_index: [3], price: 50000, dayCondition: 4 },
    { name: "Production nombreuse - Cabane de sorcière", index: 4, active_index: [4], price: 110000, dayCondition: 7 },
    { name: "Production nombreuse - Ruche bourdonnante", index: 5, active_index: [5], price: 270000, dayCondition: 10 },
    { name: "Production nombreuse - Forêt enneigée", index: 6, active_index: [6], price: 500000, dayCondition: 13 },
    { name: "Production nombreuse - Banquise gelée", index: 7, active_index: [7], price: 1260000, dayCondition: 15 },
    { name: "Production nombreuse - Port de pirate", index: 8, active_index: [8], price: 2600000, dayCondition: 18 },
    { name: "Production nombreuse - île volcanique", index: 9, active_index: [9], price: 6300000, dayCondition: 21 },
    { name: "Production nombreuse - Dunes caniculaires", index: 10, active_index: [10], price: 12600000, dayCondition: 23 },
    { name: "Production nombreuse - Forêt mystique", index: 11, active_index: [11], price: 24000000, dayCondition: 26 },
    { name: "Production nombreuse - Jungle luxuriante", index: 12, active_index: [12], price: 46000000, dayCondition: 29 },
    { name: "Production nombreuse - Temple oublié", index: 13, active_index: [13], price: 103000000, dayCondition: 33 },
    { name: "Production nombreuse - Crypte millénaire", index: 14, active_index: [14], price: 220000000, dayCondition: 38 },
    { name: "Production nombreuse - Gouffre sans fond", index: 15, active_index: [15], price: 380000000, dayCondition: 42 },
  ];

  const upgradePosteriorProps: Omit<UpgradePosteriorProps, "clicker">[] = [
    { name: "Production postérieure - Caverne aux gros cailloux", index: 1, active_index: [1], price: 7875, dayCondition: 0 },
    { name: "Production postérieure - Mine des nains", index: 2, active_index: [2], price: 13500, dayCondition: 3 },
    { name: "Production postérieure - Cabane de sorcière", index: 4, active_index: [4], price: 61875, dayCondition: 8 },
    { name: "Production postérieure - Ruche bourdonnante", index: 5, active_index: [5], price: 151875, dayCondition: 11 },
    { name: "Production postérieure - Banquise gelée", index: 7, active_index: [7], price: 708750, dayCondition: 16 },
    { name: "Production postérieure - île volcanique", index: 9, active_index: [9], price: 3543750, dayCondition: 22 },
    { name: "Production postérieure - Dunes caniculaires", index: 10, active_index: [10], price: 7087500, dayCondition: 24 },
    { name: "Production postérieure - Jungle luxuriante", index: 12, active_index: [12], price: 25875000, dayCondition: 30 },
    { name: "Production postérieure - Temple oublié", index: 13, active_index: [13], price: 57937500, dayCondition: 35 },
    { name: "Production postérieure - Crypte millénaire", index: 14, active_index: [14], price: 123750000, dayCondition: 39 },
    { name: "Production postérieure - Gouffre sans fond", index: 15, active_index: [15], price: 213750000, dayCondition: 43 },
  ];

  const upgradeCategoryProps: Omit<UpgradeCategoryProps, "clicker">[] = [
    { name: "Pioche en Paladium", index: 2, active_index: [0, 1, 2, 15, 16, 18, 32], price: 7175, pourcentage: 0.1, dayCondition: 0 },
    { name: "Seedplanter en Paladium", index: 9, active_index: [3, 9, 12, 23, 34], price: 1428750, pourcentage: 0.1, dayCondition: 0 },
    { name: "Epée en Paladium", index: 13, active_index: [10, 11, 13, 14, 21, 31], price: 31400000, pourcentage: 0.1, dayCondition: 0 },
    { name: "Portail en Paladium", index: 6, active_index: [4, 5, 6, 22, 27, 33], price: 198000, pourcentage: 0.1, dayCondition: 0 },
    { name: "Technique de persuasion", index: 8, active_index: [2, 8], price: 2948625, pourcentage: 0.5, dayCondition: 0 },
    { name: "Manteau épais", index: 7, active_index: [6, 7], price: 880000, pourcentage: 0.5, dayCondition: 0 },
    { name: "Potion contre le mal de mer", index: 8, active_index: [7, 8], price: 4342500, pourcentage: 0.5, dayCondition: 0 },
    { name: "Lame de hache en Endium", index: 11, active_index: [6, 11, 12], price: 27562500, pourcentage: 0.5, dayCondition: 0 },
  ];

  const upgradeGlobalProps: Omit<UpgradeGlobalProps, "clicker">[] = [
    { name: "Namuu Ecolier", index: -1, active_index: [], price: 1760000, coinCondition: 17600000, dayCondition: 10 },
    { name: "Namuu Constructeur", index: -1, active_index: [], price: 14000000, coinCondition: 140000000, dayCondition: 24 },
    { name: "Namuu Mécanicien", index: -1, active_index: [], price: 102000000, coinCondition: 1020000000, dayCondition: 40 },
    { name: "Namuu Scientifique", index: -1, active_index: [], price: 800000000, coinCondition: 8000000000, dayCondition: 55 },
    { name: "Namuu Investisseur", index: -1, active_index: [], price: 6200000000, coinCondition: 62000000000, dayCondition: 70 },
    { name: "Namuu Magicien", index: -1, active_index: [], price: 48000000000, coinCondition: 480000000000, dayCondition: 86 },
    { name: "Namuu Robotique", index: -1, active_index: [], price: 366000000000, coinCondition: 3660000000000, dayCondition: 101 },
    { name: "Namuu Extraterrestre", index: -1, active_index: [], price: 2820000000000, coinCondition: 28200000000000, dayCondition: 117 },
    { name: "Namuu en Endium", index: -1, active_index: [], price: 22000000000000, coinCondition: 220000000000000, dayCondition: 132 },
    { name: "Namuu Divin", index: -1, active_index: [], price: 166000000000000, coinCondition: 1660000000000000, dayCondition: 147 },
  ];

  const upgradeTerrainProps: Omit<UpgradeTerrainProps, "clicker">[] = [
    { name: "Connaissance de terrain - Mineur", index: -1, active_index: [0, 1, 2, 15, 16, 18, 32], price: 1890000, metier: "miner", dayCondition: 10 },
    { name: "Connaissance de terrain - Farmer", index: -1, active_index: [3, 9, 12, 23, 34], price: 9000000, metier: "farmer", dayCondition: 10 },
    { name: "Connaissance de terrain - Hunter", index: -1, active_index: [10, 11, 13, 14, 21, 31], price: 10800000, metier: "hunter", dayCondition: 10 },
    { name: "Connaissance de terrain - Alchimiste", index: -1, active_index: [4, 5, 6, 22, 27, 33], price: 10800000, metier: "alchemist", dayCondition: 10 }
  ];

  const clicker = new Clicker({
    buildings: buildingProps,
    upgrade_100: upgrade100Props,
    upgrade_200: upgrade200Props,
    upgrade_many: upgradeManyProps,
    upgrade_posterior: upgradePosteriorProps,
    upgrade_category: upgradeCategoryProps,
    upgrade_global: upgradeGlobalProps,
    upgrade_terrain: upgradeTerrainProps,
    starting_date: test === false ? constants.startSeason : new Date(),
  });

  return clicker;
}
