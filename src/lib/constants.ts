import { SelectedElementConfig } from "@/components/twitch/twitch-overlay-config.client";
import { AdminShopItem, LevelPreconditions, MetierKey, NavBarCategory } from "@/types";

const version = 1;

const discord = {
  url: "https://discord.gg/WGXUKHcZ3P",
  name: "PalaTracker"
};

const githubUrl = "https://github.com/BroMinee/PaladiumClicker";

export const API_PALATRACKER = process.env.NEXT_PUBLIC_PALACLICKER_API_URL || "https://palatracker.bromine.fr";
export const API_PALATRACKER_WS = process.env.NEXT_PUBLIC_PALACLICKER_API_WS || "wss://palatracker.bromine.fr";

// I need to add +1 to the real starting date for some reason
const startSeason = new Date("2025-11-22");

const defaultUsername = "Profil_vide";

export type PathValid =
  "/profil"
  | "/ah"
  | "/xp-calculator"
  | "/clicker-optimizer"
  | "/pala-animation"
  | "/craft"
  | "/craft-optimizer"
  | "/about"
  | "/ranking?category=money"
  | "/admin-shop"
  | "/status"
  | "/politique-de-confidentialite"
  | "/patchnote"
  | "/webhook"
  | "/account"
  | "/admin-panel"
  | "/qdf";

export type LabelValid =
  "Profil"
  | "Market"
  | "Calculateur d'xp"
  | "PalaClicker Optimizer"
  | "Palatime"
  | "PalaAnimation Trainer"
  | "Craft Optimizer"
  | "Calculateur de Craft"
  | "A propos"
  | "Classement"
  | "Métiers"
  | "Boss"
  | "Egg Hunt"
  | "KOTH"
  | "Clicker"
  | "Admin Shop"
  | "Statut"
  | "Politique de confidentialité"
  | "Patchnote"
  | "Alertes Discord"
  | "Account"
  | "Admin Panel"
  | "QDF";

const profilPath: PathValid = "/profil";
const ahPath: PathValid = "/ah";
const calculatorXpPath: PathValid = "/xp-calculator";
const optimizerClickerPath: PathValid = "/clicker-optimizer";
const palaAnimationPath: PathValid = "/pala-animation";
const craftingCalculatorPath: PathValid = "/craft";
const craftingOptimizerPath: PathValid = "/craft-optimizer";
const moneyRanking: PathValid = "/ranking?category=money";
const adminShopPath: PathValid = "/admin-shop";
const statusPath: PathValid = "/status";
const politiqueDeConfidentialitePath: PathValid = "/politique-de-confidentialite";
const patchnotePath: PathValid = "/patchnote";
const aboutPath: PathValid = "/about";
const webhooksPath: PathValid = "/webhook";
const accountPath: PathValid = "/account";
const adminPanelPath: PathValid = "/admin-panel";
const qdfPath: PathValid = "/qdf";

type LinkInfo = {
  label: LabelValid;
  requiredPseudo: boolean;
};

type LinkList = {
  [K in PathValid]: LinkInfo;
};

const links: LinkList = {
  "/profil": { label: "Profil", requiredPseudo: true },
  "/ah": { label: "Market", requiredPseudo: false },
  "/xp-calculator": { label: "Calculateur d'xp", requiredPseudo: true },
  "/clicker-optimizer": { label: "PalaClicker Optimizer", requiredPseudo: true },
  "/pala-animation": { label: "PalaAnimation Trainer", requiredPseudo: false },
  "/craft": { label: "Calculateur de Craft", requiredPseudo: false },
  "/craft-optimizer": { label: "Craft Optimizer", requiredPseudo: false },
  "/about": { label: "A propos", requiredPseudo: false },
  "/ranking?category=money": { label: "Classement", requiredPseudo: false },
  "/admin-shop": { label: "Admin Shop", requiredPseudo: false },
  "/status": { label: "Statut", requiredPseudo: false },
  "/politique-de-confidentialite": { label: "Politique de confidentialité", requiredPseudo: false },
  "/patchnote": { label: "Patchnote", requiredPseudo: false },
  "/webhook": { label: "Alertes Discord", requiredPseudo: false },
  "/account": { label: "Account", requiredPseudo: false },
  "/admin-panel": { label: "Admin Panel", requiredPseudo: false },
  "/qdf": { label: "QDF", requiredPseudo: false }
};

const SMELT = "Smelt";
const BREAK = "Break";
const OBTAIN_FROM_COBBLEBREAKER = "Obtain from CobbleBreaker";
const KILL = "Kill";
const FISH = "Fish";
const CRAFT = "Craft";
const EAT = "Eat";
const EXTRACT_FROM_SAP = "Extract from Sap";
const THROW_IN_A_CAULDRON = "Throw in a Cauldron";
const CRAFT_IN_PORTAL = "Craft in Portal";
const CRAFT_IN_A_CAULDRON = "Craft in a Cauldron";
const CRUSH = "Crush";

const METIER_KEY: MetierKey[] = ["miner", "farmer", "hunter", "alchemist"];

const metier_xp_java = [
  22123, // level 1 -> 2
  40390, // level 2 -> 3
  73751, // level 3 -> 4
  118886, // level 4 -> 5
  176611, // level 5 -> 6
  247616, // level 6 -> 7
  332507, // level 7 -> 8
  431826, // level 8 -> 9
  546062, // level 9 -> 10
  675669, // level 10 -> 11
  821062, // level 11 -> 12
  982632, // level 12 -> 13
  1160743, // level 13 -> 14
  1355741, // level 14 -> 15
  1567953, // level 15 -> 16
  1797690, // level 16 -> 17
  2045248, // level 17 -> 18
  2310912, // level 18 -> 19
  2594953, // level 19 -> 20
];

const metier_xp_bedrock = [
  2000, // level 0 -> 1
  3047, // level 1 -> 2
  4641, // level 2 -> 3
  7070, // level 3 -> 4
  10770, // level 4 -> 5
  16406, // level 5 -> 6
  24993, // level 6 -> 7
  38072, // level 7 -> 8
  57997, // level 8 -> 9
  88349, // level 9 -> 10
  134586, // level 10 -> 11
  205020, // level 11 -> 12
  312314, // level 12 -> 13
  475761, // level 13 -> 14
  724746, // level 14 -> 15
  1104035, // level 15 -> 16
  1681820, // level 16 -> 17
  2561984, // level 17 -> 18
  3902773, // level 18 -> 19
  5945249 // level 19 -> 20
];

export type HowToXpElement = {
  type: string;
  action: string;
  java?: {
    xp: number;
    level?: number;
  }
  bedrock?: {
    xp: number;
    level?: number;
  }
  imgPath: string;
  ignorePotionBonus?: boolean;
};

type HowToXp = {
  [K in MetierKey]: HowToXpElement[]
}

const POTION_DOUBLE_BONUS = 1;
const POTION_X10_BONUS = 9;

const FORTUNE_II_BONUS = 0.50;
const FORTUNE_III_BONUS = 0.65;

const LEVEL_PRECONDITIONS: LevelPreconditions = {
  farmer: {
    2: "Récolter **2 949** blés",
    3: "Récolter **3 231** carottes",
    4: "Casser **3 687** pastèques",
    5: "Casser **5 944** pastèques",
    6: "Casser **8 830** pastèques",
    7: "Casser **12 380** pastèques",
    8: "Casser **13 300** pastèques",
    9: "Casser **8 636** eggplants",
    10: "Casser **10 921** eggplants",
    11: "Casser **13 513** eggplants",
    12: "Casser **16 421** eggplants",
    13: "Casser **9 826** chervils",
    14: "Casser **11 607** chervils",
    15: "Casser **13 557** chervils",
    16: "Casser **15 679** chervils",
    17: "Casser **7 190** kiwanos",
    18: "Casser **8 180** kiwanos",
    19: "Casser **9 243** kiwanos",
    20: "Casser **10 379** kiwanos",
  },

  hunter: {
    2: "Tuer **442** animaux",
    3: "Tuer **807** animaux",
    4: "Tuer **1 475** animaux",
    5: "Pêcher **951** poissons",
    6: "Pêcher **1 412** poissons",
    7: "Pêcher **1 980** poissons",
    8: "Pêcher **2 660** poissons",
    9: "Tuer **5 757** zombies",
    10: "Tuer **7 580** zombies",
    11: "Tuer **9 008** zombies",
    12: "Tuer **8 210** squelettes",
    13: "Tuer **9 826** squelettes",
    14: "Tuer **11 607** squelettes",
    15: "Tuer **7 747** sorcières",
    16: "Tuer **8 959** sorcières",
    17: "Tuer **10 272** sorcières",
    18: "Tuer **11 687** sorcières",
    19: "Tuer **13 205** sorcières",
    20: "Tuer **14 828** sorcières",
  },

  miner: {
    2: "Casser **8 849** roches",
    3: "Casser **16 156** roches",
    4: "Casser **29 500** roches",
    5: "Casser **47 554** roches",
    6: "Casser **70 644** roches",
    7: "Casser **99 046** roches",
    8: "Casser **133 003** roches",
    9: "Casser **822** minerais d'améthyste",
    10: "Casser **1 040** minerais d'améthyste",
    11: "Casser **1 286** minerais d'améthyste",
    12: "Casser **1 563** minerais d'améthyste",
    13: "Casser **1 310** minerais de titane",
    14: "Casser **1 547** minerais de titane",
    15: "Casser **1 807** minerais de titane",
    16: "Casser **2 090** minerais de titane",
    17: "Casser **798** minerais de paladium",
    18: "Casser **908** minerais de paladium",
    19: "Casser **1 027** minerais de paladium",
    20: "Casser **1 153** minerais de paladium",
  },

  alchemist: {
    2: "Casser **442** bûches moddés",
    3: "Casser **807** bûches moddés",
    4: "Extraire sève de bûche de jacaranda **983** fois",
    5: "Extraire sève de bûche de jacaranda **1 585** fois",
    6: "Extraire sève de bûche de jacaranda **2 354** fois",
    7: "Extraire sève de bûche de judeecercis **1 238** fois",
    8: "Extraire sève de bûche de judeecercis **1 662** fois",
    9: "Jeter **86 365** fleurs dans le chaudron",
    10: "Jeter **109 212** fleurs dans le chaudron",
    11: "Jeter **135 133** fleurs dans le chaudron",
    12: "Jeter **164 212** fleurs dans le chaudron",
    13: "Extraire sève de bûche d'érable **2 456** fois",
    14: "Extraire sève de bûche d'érable **2 901** fois",
    15: "Extraire sève de bûche d'érable **3 389** fois",
    16: "Extraire sève de bûche d'érable **3 919** fois",
    17: "Extraire sève de bûche d'érable **4 494** fois",
    18: "Fabriquer via portail **10 226** lingots de paladium",
    19: "Fabriquer via portail **11 554** lingots de paladium",
    20: "Fabriquer via portail **12 974** lingots de paladium",
  }
};

const how_to_xp: HowToXp = {
  "miner": [
    { type: "Bottle XP", action: "Utiliser", java: { xp: 1000 }, imgPath: "exp_miner.webp", ignorePotionBonus: true },
    { type: "Bonbon Jaune", "action": EAT, java: { xp: 50000 }, imgPath: "candy_YELLOW.webp" },
    { type: "Bonbon Multicolor", "action": EAT, java: { xp: 50000 }, imgPath: "candy_RAINBOW.webp" },
    { type: "Nether brick", "action": SMELT, java: { xp: 0.1 }, imgPath: "nether_brick.webp" },
    { type: "Stone", "action": BREAK, java: { xp: 0.5 }, imgPath: "stone.webp" },
    { type: "Charcoal", "action": SMELT, java: { xp: 1 }, bedrock: { xp: 1 }, imgPath: "charcoal.webp" },
    { type: "Andesite", "action": BREAK, java: { xp: 3 }, bedrock: { xp: 1 }, imgPath: "andesite.webp" },
    { type: "Granite", "action": BREAK, java: { xp: 3 }, bedrock: { xp: 1 }, imgPath: "granite.webp" },
    { type: "Tuff", "action": BREAK, bedrock: { xp: 3 }, imgPath: "tuff.webp" },
    { type: "Diorite", "action": BREAK, java: { xp: 3 }, bedrock: { xp: 1 }, imgPath: "diorite.webp" },
    { type: "Coal Ore", "action": BREAK, java: { xp: 4 }, bedrock: { xp: 1 }, imgPath: "coal_ore.webp" },
    { type: "Deepslate Coal Ore", "action": BREAK, bedrock: { xp: 2, level: 10 }, imgPath: "deepslate_coal_ore.webp" },
    { type: "Nether Quartz Ore", "action": BREAK, java: { xp: 6 }, bedrock: { xp: 6 }, imgPath: "nether_quartz_ore.webp" },
    { type: "Copper Ore", "action": BREAK, bedrock: { xp: 2 }, imgPath: "copper_ore.webp" },
    { type: "Copper Ingot", "action": SMELT, bedrock: { xp: 1, level: 2 }, imgPath: "copper_ingot.webp" },
    { type: "Deepslate Copper Ore", "action": BREAK, bedrock: { xp: 3, level: 10 }, imgPath: "deepslate_copper_ore.webp" },
    { type: "Obsidian", "action": BREAK, java: { xp: 6 }, bedrock: { xp: 6 }, imgPath: "obsidian.webp" },
    { type: "Lapis Lazuli Ore", "action": BREAK, java: { xp: 15 }, bedrock: { xp: 8 }, imgPath: "lapis_ore.webp" },
    { type: "Deepslate Lapis Lazuli Ore", "action": BREAK, bedrock: { xp: 12, level: 10 }, imgPath: "deepslate_lapis_ore.webp" },
    { type: "Redstone Ore", "action": BREAK, java: { xp: 15 }, bedrock: { xp: 6 }, imgPath: "redstone_ore.webp" },
    { type: "Emerald Ore", "action": BREAK, java: { xp: 75 }, bedrock: { xp: 30 }, imgPath: "emerald_ore.webp" },
    { type: "Amethyst Ore", "action": BREAK, bedrock: { xp: 18, level: 5 }, imgPath: "amethyst_ore.webp" },
    { type: "Deepslate Emerald Ore", "action": BREAK, java: { xp: 75 }, bedrock: { xp: 45, level: 10 }, imgPath: "deepslate_emerald_ore.webp" },
    { type: "Iron Ingot", "action": SMELT, java: { xp: 8, level: 2 }, bedrock: { xp: 2, level: 2 }, imgPath: "iron_ingot.webp" },
    { type: "Diamond Ore", "action": BREAK, java: { xp: 25, level: 2 }, bedrock: { xp: 20, level: 2 }, imgPath: "diamond_ore.webp" },
    { type: "Deepslate Diamond Ore", "action": BREAK, bedrock: { xp: 30, level: 10 }, imgPath: "deepslate_diamond_ore.webp" },
    { type: "Gold Ingot", "action": SMELT, java: { xp: 30, level: 3 }, bedrock: { xp: 3, level: 3 }, imgPath: "gold_ingot.webp" },
    { type: "Amethyst Ingot", "action": SMELT, java: { xp: 35, level: 4 }, bedrock: { xp: 4, level: 5 }, imgPath: "amethyst_ingot.webp" },
    { type: "Iron Particle", "action": OBTAIN_FROM_COBBLEBREAKER, java: { xp: 2, level: 5 }, imgPath: "iron_particle.webp" },
    { type: "Gold Particle", "action": OBTAIN_FROM_COBBLEBREAKER, java: { xp: 4, level: 5 }, imgPath: "gold_particle.webp" },
    { type: "Diamond Particle", "action": OBTAIN_FROM_COBBLEBREAKER, java: { xp: 8, level: 5 }, imgPath: "diamond_particle.webp" },
    { type: "Amethyst Particle", "action": OBTAIN_FROM_COBBLEBREAKER, java: { xp: 12, level: 5 }, imgPath: "amethyst_particle.webp" },
    { type: "Titane Particle", "action": OBTAIN_FROM_COBBLEBREAKER, java: { xp: 16, level: 5 }, imgPath: "titane_particle.webp" },
    { type: "Paladium Particle", "action": OBTAIN_FROM_COBBLEBREAKER, java: { xp: 20, level: 5 }, imgPath: "paladium_particle.webp" },
    { type: "Titane Ingot", "action": SMELT, java: { xp: 50, level: 6 }, bedrock: { xp: 50, level: 6 }, imgPath: "titane_ingot.webp" },
    { type: "Titane Ingot", "action": SMELT, java: { xp: 50, level: 6 }, bedrock: { xp: 5, level: 5 }, imgPath: "titane_ingot.webp" },
    { type: "Cavernous Zombie", "action": KILL, java: { xp: NaN, level: 7 }, imgPath: "cavernous_zombie.webp" },
    { type: "Paladium Ingot", "action": SMELT, java: { xp: 150, level: 8 }, bedrock: { xp: 150, level: 8 }, imgPath: "paladium_ingot.webp" },
    { type: "Paladium Ingot", "action": SMELT, bedrock: { xp: 6, level: 5 }, imgPath: "paladium_ingot.webp" },
    { type: "Findium Ore", "action": BREAK, java: { xp: 110, level: 10 }, bedrock: { xp: 100, level: 5 }, imgPath: "findium_ore.webp" },
    { type: "Paladium Green Ingot", "action": SMELT, java: { xp: 200, level: 12 }, bedrock: { xp: 200, level: 12 }, imgPath: "paladium_green_ingot.webp" },
    { type: "Paladium Green Ingot", "action": SMELT, bedrock: { xp: 400, level: 15 }, imgPath: "paladium_green_ingot.webp" },
    { type: "Deepslate Iron Ore", "action": BREAK, bedrock: { xp: 5, level: 10 }, imgPath: "deepslate_iron_ore.webp" },
    { type: "Iron Ore", "action": BREAK, bedrock: { xp: 3 }, imgPath: "iron_ore.webp" },
    { type: "Gold Ore", "action": BREAK, bedrock: { xp: 6 }, imgPath: "gold_ore.webp" },
    { type: "Nugget Paladium", "action": SMELT, bedrock: { xp: 1, level: 5 }, imgPath: "nugget_paladium.webp" },
    { type: "Nugget Amethyst", "action": SMELT, bedrock: { xp: 1, level: 5 }, imgPath: "nugget_amethyst.webp" },
    { type: "Nugget Titane", "action": SMELT, bedrock: { xp: 1, level: 5 }, imgPath: "nugget_titane.webp" },
    { type: "Xp Ore", "action": BREAK, bedrock: { xp: 2, level: 5 }, imgPath: "xp_ore.webp" },
    { type: "Instable Ore", "action": BREAK, bedrock: { xp: 1000, level: 5 }, imgPath: "instable_ore.webp" },
    { type: "Nugget Paladium Ore", "action": BREAK, bedrock: { xp: 6, level: 5 }, imgPath: "nugget_paladium_ore.webp" },
    { type: "Paladium Ore", "action": BREAK, bedrock: { xp: 36, level: 5 }, imgPath: "paladium_ore.webp" },
    { type: "Nugget Titane Ore", "action": BREAK, bedrock: { xp: 4, level: 5 }, imgPath: "nugget_titane_ore.webp" },
    { type: "Nugget Amethyst Ore", "action": BREAK, bedrock: { xp: 2, level: 5 }, imgPath: "nugget_amethyst_ore.webp" },
    { type: "Titane Ore", "action": BREAK, bedrock: { xp: 27, level: 5 }, imgPath: "titane_ore.webp" },
    { type: "Random Ore", "action": BREAK, bedrock: { xp: 8, level: 5 }, imgPath: "random_ore.webp" },
    { type: "Deepslate Redstone Ore", "action": BREAK, bedrock: { xp: 15, level: 10 }, imgPath: "deepslate_redstone_ore.webp" },
    { type: "Nugget Green Paladium", "action": BREAK, bedrock: { xp: 40, level: 15 }, imgPath: "nugget_green_paladium.webp" },
    { type: "Deepslate Titane Ore", "action": BREAK, bedrock: { xp: 41, level: 15 }, imgPath: "deepslate_titane_ore.webp" },
    { type: "Deepslate Instable Ore", "action": BREAK, bedrock: { xp: 1500, level: 15 }, imgPath: "deepslate_instable_ore.webp" },
    { type: "Deepslate Xp Ore", "action": BREAK, bedrock: { xp: 3, level: 15 }, imgPath: "deepslate_xp_ore.webp" },
    { type: "Deepslate Nugget Titanium Ore", "action": BREAK, bedrock: { xp: 6, level: 15 }, imgPath: "deepslate_nugget_titane_ore.webp" },
    { type: "Deepslate Paladium Ore", "action": BREAK, bedrock: { xp: 54, level: 15 }, imgPath: "deepslate_paladium_ore.webp" },
    { type: "Deepslate Nugget Paladium Ore", "action": BREAK, bedrock: { xp: 9, level: 15 }, imgPath: "deepslate_nugget_paladium_ore.webp" },
    { type: "Deepslate Amethyst Ore", "action": BREAK, bedrock: { xp: 27, level: 15 }, imgPath: "deepslate_amethyst_ore.webp" },
    { type: "Deepslate Random Ore", "action": BREAK, bedrock: { xp: 12, level: 15 }, imgPath: "deepslate_random_ore.webp" },
    { type: "Deepslate Nugget Amethyst Ore", "action": BREAK, bedrock: { xp: 3, level: 15 }, imgPath: "deepslate_nugget_amethyst_ore.webp" },
  ],
  "farmer": [
    { type: "Bottle XP", action: "Utiliser", java: { xp: 1000 }, imgPath: "exp_farmer.webp", ignorePotionBonus: true },
    { type: "Bonbon Vert", "action": EAT, java: { xp: 50000 }, imgPath: "candy_GREEN.webp" },
    { type: "Bonbon Multicolor", "action": EAT, java: { xp: 50000 }, imgPath: "candy_RAINBOW.webp" },
    { type: "Bread", "action": CRAFT, java: { xp: 1 }, bedrock: { xp: 5, level: 4 }, imgPath: "bread.webp" },
    { type: "Wheat", "action": BREAK, bedrock: { xp: 1 }, imgPath: "wheat.webp" },
    { type: "Seed", "action": BREAK, java: { xp: 1.5 }, imgPath: "seeds_wheat.webp" },
    { type: "Baked Potato", "action": SMELT, java: { xp: 1, level: 2 }, bedrock: { xp: 2, level: 2 }, imgPath: "potato_baked.webp" },
    { type: "Potatoes", "action": BREAK, java: { xp: 2, level: 2 }, bedrock: { xp: 2, level: 1 }, imgPath: "potato.webp" },
    { type: "Carrots", "action": BREAK, java: { xp: 2.5, level: 2 }, bedrock: { xp: 3, level: 3 }, imgPath: "carrot.webp" },
    { type: "Melon", "action": BREAK, java: { xp: 4 , level: 3 }, bedrock: { xp: 5, level: 13 }, imgPath: "melon.webp" },
    { type: "Pumpkin", "action": BREAK, java: { xp: 5 , level: 6 }, bedrock: { xp: 3, level: 11 }, imgPath: "pumpkin.webp" },
    { type: "Farmer Chicken", "action": KILL, java: { xp: NaN, level: 7 }, imgPath: "farmer_chicken.webp" },
    { type: "Amethyst Ingot", "action": CRUSH, java: { xp: 3, level: 8 }, imgPath: "amethyst_ingot.webp" },
    { type: "Eggplant", "action": BREAK, java: { xp: 10 , level: 8 }, bedrock: { xp: 20, level: 3 }, imgPath: "eggplant.webp" },
    { type: "Pumpkin Pie", "action": CRAFT, java: { xp: 4, level: 11 }, bedrock: { xp: 2, level: 15 }, imgPath: "pumpkin_pie.webp" },
    { type: "Titane Ingot", "action": CRUSH, java: { xp: 4.5, level: 12 }, imgPath: "titane_ingot.webp" },
    { type: "Chervil", "action": BREAK, java: { xp: 20, level: 12 }, bedrock: { xp: 40, level: 6 }, imgPath: "chervil.webp" },
    { type: "Paladium Ingot", "action": CRUSH, java: { xp: 6, level: 16 }, imgPath: "paladium_ingot.webp" },
    { type: "Kiwano", "action": BREAK, java: { xp: 50, level: 16 }, bedrock: { xp: 10, level: 14 }, imgPath: "kiwano.webp" },
    { type: "Beetroot", "action": BREAK, bedrock: { xp: 8, level: 5 }, imgPath: "beetroot.webp" },
    { type: "Cactus", "action": BREAK, bedrock: { xp: 1, level: 7 }, imgPath: "cactus.webp" },
    { type: "Reeds", "action": BREAK, bedrock: { xp: 2, level: 9 }, imgPath: "reeds.webp" },
    { type: "Orange Blue", "action": BREAK, bedrock: { xp: 200, level: 19 }, imgPath: "orangeblue.webp" },
  ],
  "hunter": [
    { type: "Bottle XP", action: "Utiliser", java: { xp: 1000 }, imgPath: "exp_hunter.webp", ignorePotionBonus: true },
    { type: "Bonbon Bleu", "action": EAT, java: { xp: 50000 }, imgPath: "candy_BLUE.webp" },
    { type: "Bonbon Multicolor", "action": EAT, java: { xp: 50000 }, imgPath: "candy_RAINBOW.webp" },
    { type: "Snow Golem", "action": KILL, java: { xp: 1 }, imgPath: "snow_golem_hunter.webp" },
    { type: "Squid", "action": KILL, java: { xp: 10 }, imgPath: "squid.webp" },
    { type: "Cooked Porkchop", "action": SMELT, java: { xp: 10 }, bedrock: { xp: 55, level: 4 }, imgPath: "porkchop_cooked.webp" },
    { type: "Cooked Chicken", "action": SMELT, java: { xp: 10 }, bedrock: { xp: 50, level: 3 }, imgPath: "chicken_cooked.webp" },
    { type: "Cooked Mutton", "action": SMELT, java: { xp: 10 }, bedrock: { xp: 45, level: 2 }, imgPath: "cooked_mutton.webp" },
    { type: "Cooked Rabbit", "action": SMELT, bedrock: { xp: 55, level: 4 }, imgPath: "cooked_rabbit.webp" },
    { type: "Steak", "action": SMELT, java: { xp: 10 }, bedrock: { xp: 40, level: 1 }, imgPath: "steak.webp" },
    { type: "Cow", "action": KILL, java: { xp: 14 }, bedrock: { xp: 80, level: 0 }, imgPath: "cow.webp" },
    { type: "Pig", "action": KILL, java: { xp: 14 }, bedrock: { xp: 110, level: 3 }, imgPath: "pig.webp" },
    { type: "Horse", "action": KILL, java: { xp: 14 }, imgPath: "horse.webp" },
    { type: "Sheep", "action": KILL, java: { xp: 14 }, bedrock: { xp: 90, level: 1 }, imgPath: "sheep.webp" },
    { type: "Rabbit", "action": KILL, java: { xp: 14 }, imgPath: "rabbit.webp" },
    { type: "Chicken", "action": KILL, java: { xp: 14 }, bedrock: { xp: 100, level: 2 }, imgPath: "chicken.webp" },
    { type: "Cooked Fish", "action": SMELT, java: { xp: 15 }, imgPath: "cooked_fish.webp" },
    { type: "Cooked Salmon", "action": SMELT, java: { xp: 15 }, bedrock: { xp: 45, level: 2 }, imgPath: "cooked_salmon.webp" },
    { type: "Raw fish", "action": FISH, java: { xp: 25 }, imgPath: "fish_cod_raw.webp" },
    { type: "Raw Salmon", "action": FISH, java: { xp: 35 }, imgPath: "raw_salmon.webp" },
    { type: "Creeper", "action": KILL, java: { xp: 40 }, bedrock: { xp: 140, level: 8 }, imgPath: "creeper.webp" },
    { type: "Pufferfish", "action": FISH, java: { xp: 75 }, imgPath: "pufferfish.webp" },
    { type: "Clownfish", "action": FISH, java: { xp: 200 }, imgPath: "clownfish.webp" },
    { type: "Wither", "action": KILL, java: { xp: 1000 }, imgPath: "wither.webp" },
    { type: "Goat", "action": KILL, java: { xp: 20 }, imgPath: "goat.webp" },
    { type: "Carp", "action": FISH, java: { xp: 150, level: 2 }, imgPath: "carp.webp" },
    { type: "Bass", "action": FISH, java: { xp: 225, level: 2 }, imgPath: "bass.webp" },
    { type: "Manta Ray", "action": FISH, java: { xp: 300, level: 2 }, imgPath: "manta_ray.webp" },
    { type: "Snail", "action": KILL, java: { xp: 25, level: 2 }, imgPath: "snail.webp", },
    { type: "Red Tuna", "action": FISH, java: { xp: 450, level: 2 }, imgPath: "red_tuna.webp" },
    { type: "Moonfish", "action": FISH, java: { xp: 550, level: 2 }, imgPath: "moonfish.webp" },
    { type: "Exp Fish", "action": FISH, java: { xp: 750, level: 3 }, imgPath: "exp_fish.webp" },
    { type: "Parrot", "action": KILL, java: { xp: 30, level: 3 }, imgPath: "parrot.webp" },
    { type: "Whale", "action": FISH, java: { xp: 10000, level: 4 }, imgPath: "whale.webp" },
    { type: "Kraken", "action": FISH, java: { xp: 15000, level: 4 }, imgPath: "kraken.webp" },
    { type: "Dolphin", "action": KILL, java: { xp: 35, level: 5 }, imgPath: "dolphin.webp" },
    { type: "Mega Creeper", "action": KILL, java: { xp: NaN, level: 7 }, imgPath: "mega_creeper.webp" },
    { type: "Zombie", "action": KILL, java: { xp: 15, level: 7 }, bedrock: { xp: 160, level: 4 }, imgPath: "zombie.webp" },
    { type: "Turtle", "action": KILL, java: { xp: 40, level: 8 }, imgPath: "turtle.webp" },
    { type: "Panda", "action": KILL, java: { xp: 60, level: 9 }, imgPath: "panda.webp" },
    { type: "Skeleton", "action": KILL, java: { xp: 20, level: 11 }, bedrock: { xp: 200, level: 6 }, imgPath: "skeleton.webp" },
    { type: "Wither Skeleton", "action": KILL, bedrock: { xp: 400, level: 14 }, imgPath: "wither_skeleton.webp" },
    { type: "Elephant", "action": KILL, java: { xp: NaN, level: 11 }, imgPath: "elephant.webp" },
    { type: "Crab", "action": KILL, java: { xp: 80, level: 12 }, imgPath: "crab.webp" },
    { type: "Spider", "action": KILL, java: { xp: 8, level: 13 }, bedrock: { xp: 210, level: 8 }, imgPath: "spider.webp" },
    { type: "Blaze", "action": KILL, java: { xp: 25, level: 14 }, bedrock: { xp: 500, level: 16 }, imgPath: "blaze.webp" },
    { type: "Witch", "action": KILL, java: { xp: 35, level: 14 }, imgPath: "witch.webp" },
    { type: "Snake", "action": KILL, java: { xp: 120, level: 15 }, imgPath: "snake.webp" },
    { type: "Cave Spider", "action": KILL, java: { xp: 15, level: 18 }, bedrock: { xp: 220, level: 10 }, imgPath: "cave_spider.webp" },
    { type: "Jelly Fish", "action": KILL, java: { xp: 150, level: 18 }, imgPath: "jelly_fish.webp" },
    { type: "Bat", "action": KILL, bedrock: { xp: 300, level: 12 }, imgPath: "bat.webp" },
    { type: "Paladium Arty", "action": KILL, bedrock: { xp: 1000, level: 0 }, imgPath: "paladium_arty.webp" },
    { type: "Green Paladium Arty", "action": KILL, bedrock: { xp: 20000, level: 16 }, imgPath: "green_paladium_arty.webp" },
    { type: "Endium Arty", "action": KILL, bedrock: { xp: 40000, level: 19 }, imgPath: "endium_arty.webp" },

  ],
  "alchemist": [
    { type: "Bottle XP", action: "Utiliser", java: { xp: 1000 }, imgPath: "exp_alchemist.webp", ignorePotionBonus: true },
    { type: "Bonbon Mauve", "action": EAT, java: { xp: 50000 }, imgPath: "candy_PINK.webp" },
    { type: "Bonbon Multicolor", "action": EAT, java: { xp: 50000 }, imgPath: "candy_RAINBOW.webp" },
    { type: "Empty Flask", "action": CRAFT, java: { xp: 0.2 }, imgPath: "empty_flask.webp" },
    { type: "Jacaranda Log", "action": BREAK, java: { xp: 10 }, imgPath: "jacaranda_log.webp" },
    { type: "Judeecercis Log", "action": BREAK, java: { xp: 10 }, imgPath: "judeecercis_log.webp" },
    { type: "Erable Log", "action": BREAK, java: { xp: 10 }, imgPath: "erable_log.webp" },
    { type: "Extractor", "action": CRAFT, java: { xp: 20 }, imgPath: "extractor.webp" },
    { type: "Lightning Potion", "action": CRAFT, java: { xp: 30 }, imgPath: "lightning_potion.webp" },
    { type: "Jacaranda Log", "action": EXTRACT_FROM_SAP, java: { xp: 15, level: 3 }, imgPath: "jacaranda_log.webp" },
    { type: "Blue Orchid", "action": THROW_IN_A_CAULDRON, java: { xp: 1, level: 3 }, imgPath: "blue_orchid.webp" },
    { type: "Dandelion", "action": THROW_IN_A_CAULDRON, java: { xp: 1, level: 3 }, imgPath: "dandelion.webp" },
    { type: "Poppy", "action": THROW_IN_A_CAULDRON, java: { xp: 1, level: 3 }, imgPath: "poppy.webp" },
    { type: "White Tulip", "action": THROW_IN_A_CAULDRON, java: { xp: 2, level: 3 }, imgPath: "white_tulip.webp" },
    { type: "Oxeye Daisy", "action": THROW_IN_A_CAULDRON, java: { xp: 2, level: 3 }, imgPath: "oxeye_daisy.webp" },
    { type: "Orange Tulip", "action": THROW_IN_A_CAULDRON, java: { xp: 2, level: 3 }, imgPath: "orange_tulip.webp" },
    { type: "Allium", "action": THROW_IN_A_CAULDRON, java: { xp: 2, level: 3 }, imgPath: "allium.webp" },
    { type: "Pink Tulip", "action": THROW_IN_A_CAULDRON, java: { xp: 2, level: 3 }, imgPath: "pink_tulip.webp" },
    { type: "Azure Bluet", "action": THROW_IN_A_CAULDRON, java: { xp: 2, level: 3 }, imgPath: "azure_bluet.webp" },
    { type: "Red Tulip", "action": THROW_IN_A_CAULDRON, java: { xp: 2, level: 3 }, imgPath: "red_tulip.webp" },
    { type: "Amethyst Ingot", "action": CRAFT_IN_PORTAL, java: { xp: 6, level: 3 }, imgPath: "amethyst_ingot.webp" },
    { type: "Judeecercis Log", "action": EXTRACT_FROM_SAP, java: { xp: 40, level: 5 }, imgPath: "judeecercis_log.webp" },
    { type: "Green Glueball", "action": CRAFT_IN_A_CAULDRON, java: { xp: 2, level: 6 }, imgPath: "green_glueball.webp" },
    { type: "Blue Glueball", "action": CRAFT_IN_A_CAULDRON, java: { xp: 2, level: 6 }, imgPath: "blue_glueball.webp" },
    { type: "Red Glueball", "action": CRAFT_IN_A_CAULDRON, java: { xp: 2, level: 6 }, imgPath: "red_glueball.webp" },
    { type: "Titane Ingot", "action": CRAFT_IN_PORTAL, java: { xp: 20, level: 6 }, imgPath: "titane_ingot.webp" },
    { type: "Flower Monster", "action": KILL, java: { xp: NaN, level: 7 }, imgPath: "flower_monster.webp" },
    { type: "Gray Glueball", "action": CRAFT_IN_A_CAULDRON, java: { xp: 15, level: 10 }, imgPath: "gray_glueball.webp" },
    { type: "Cyan Glueball", "action": CRAFT_IN_A_CAULDRON, java: { xp: 15, level: 10 }, imgPath: "cyan_glueball.webp" },
    { type: "Yellow Glueball", "action": CRAFT_IN_A_CAULDRON, java: { xp: 15, level: 10 }, imgPath: "yellow_glueball.webp" },
    { type: "Purple Glueball", "action": CRAFT_IN_A_CAULDRON, java: { xp: 15, level: 10 }, imgPath: "purple_glueball.webp" },
    { type: "Green Dark Glueball", "action": CRAFT_IN_A_CAULDRON, java: { xp: 15, level: 10 }, imgPath: "green_dark_glueball.webp" },
    { type: "Orange Glueball", "action": CRAFT_IN_A_CAULDRON, java: { xp: 15, level: 10 }, imgPath: "orange_glueball.webp" },
    { type: "Green Flash Glueball", "action": CRAFT_IN_A_CAULDRON, java: { xp: 15, level: 10 }, imgPath: "green_flash_glueball.webp" },
    { type: "Paladium Ingot", "action": CRAFT_IN_PORTAL, java: { xp: 40, level: 10 }, imgPath: "paladium_ingot.webp" },
    { type: "Erable Log", "action": EXTRACT_FROM_SAP, java: { xp: 80, level: 10 }, imgPath: "erable_log.webp" },
    { type: "Paladium Flower", "action": THROW_IN_A_CAULDRON, java: { xp: 100, level: 16 }, imgPath: "flower_paladium.webp" },
  ]
};

const notificationPath: Map<PathValid, [number, string]> = new Map<PathValid, [number, string]>(
  [
    ["/profil", [new Date("2025-02-22 01:00").getTime(), "Refonte du market du joueur"]],
    ["/xp-calculator", [new Date("2024-10-16").getTime(), "Ajout des \"fortunes modifiers\" dans les calculs"]],
    ["/clicker-optimizer", [new Date("2024-11-27 19:00").getTime(), "Refonte de la page"]],
    ["/ranking?category=money", [new Date("2025-02-22 01:00").getTime(), "Ajout du classement l'alignement"]],
    ["/ah", [new Date("2025-02-22 01:00").getTime(), "Ajout du détail des offres"]],
    ["/craft", [new Date("2025-05-11 10:00").getTime(), "Ajout d'un nouvel outil pour faire un max de d'argent"]],
    ["/patchnote", [new Date("2025-05-11 10:00").getTime(), "Nouveau patchnote"]],
    ["/pala-animation", [new Date("2024-12-21 16:15").getTime(), "Ajout de 174 nouvelles questions"]],
    ["/webhook", [new Date("2025-05-11 10:00").getTime(), "Ajout des alertes de vote"]],
  ]);

const menuPaths: Map<NavBarCategory, PathValid[]> = new Map<NavBarCategory, PathValid[]>([
  ["Statistiques et données", ["/profil", "/ah", "/admin-shop", "/ranking?category=money", "/qdf"]],
  ["Outils", ["/clicker-optimizer", "/xp-calculator", "/pala-animation", "/craft", "/craft-optimizer", "/webhook"]],
  ["Informations et gestion", ["/status", "/patchnote", "/politique-de-confidentialite", "/about"]],
]);

const deprecatedIdAchivement = [
  "ariane.end",
  "core.command.achievement",
  "core.command.home",
  "core.command.tellrawdaad",
  "palamod.visitservers.allservers.7",
  "palamod.visitservers.allservers.8",
  "palamod.visitservers.allservers.9",
  "core.command.default",
  "core.command.defaultAA"
];

const dictAchievementIdToSubIds = new Map<string, string[]>([

  ["palamod.shop.buysell", ["palamod.shop.sell.1", "palamod.shop.buy.2"]],
  ["palamod.hdv.buysell", ["palamod.hdv.sell.1", "palamod.hdv.buy.2"]],
  ["palamod.egg.participate", ["palamod.egg.hurtdragon.1", "palamod.egg.dragonroll.2", "palamod.egg.take.3"]],
  ["palamod.spell.unlockuser", ["palamod.spell.unlock.1", "palamod.spell.use.1"]],
  ["palamod.craftcauldron.pollenall", ["palamod.craftcauldron.pollen.1", "palamod.craftcauldron.pollen.2", "palamod.craftcauldron.pollen.3", "palamod.craftcauldron.pollen.4"]],
  ["palamod.crusher.all", ["palamod.crusher.1", "palamod.crusher.2", "palamod.crusher.3", "palamod.crusher.4"]],
  ["palamod.break.paladium.multi.all", ["palamod.break.pickaxe.paladium", "palamod.break.shovel.paladium", "palamod.break.axe.paladium", "palamod.break.sword.paladium", "palamod.break.helmet.paladium", "palamod.break.chestplate.paladium", "palamod.break.leggings.paladium", "palamod.break.boots.paladium"]],
  ["palamod.craftcauldron.gluballall", ["palamod.craftcauldron.glueball.1", "palamod.craftcauldron.glueball.2", "palamod.craftcauldron.glueball.3", "palamod.craftcauldron.glueball.4", "palamod.craftcauldron.glueball.5", "palamod.craftcauldron.glueball.6", "palamod.craftcauldron.glueball.7", "palamod.craftcauldron.glueball.8", "palamod.craftcauldron.glueball.9", "palamod.craftcauldron.glueball.10"]

  ]
]);

const dictAchievementIdToIcon = new Map<string, string>([
  // HOW_TO_START
  ["1:minecraft:chainmail_chestplate:0#", "chestplateChain"],
  ["1:minecraft:stone_hoe:0#", "hoeStone"],
  ["1:minecraft:diamond:0#", "diamond"],
  ["1:palamod:item.paladium.pickaxe:0#", "paladium-pickaxe"],
  ["1:palamod:item.paladium.chestplate:0#", "paladium-chestplate"],
  ["1:palamod:tile.grinder_block:0#", "tile-grinder-block"],
  ["1:palamod:item.hammer.paladium:0#", "hammer-paladium"],
  ["3:palamod:tile.withered_obsidian:0#", "tile-wither-obsi"],
  ["1:palamod:item.broadsword.paladium:0#{modifiersmax:4,upgradearray:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],modifiersammount:0}", "broadsword-paladium"],
  ["1:palamod:egg:6#", "egg"],
  ["1:minecraft:enchanted_book:0#", "enchantedBook"],
  ["1:factions:tile.townmarket:0#", "writtenBook"],
  ["1:customnpcs:npcMoney:0#", "fake-money"],
  ["1:minecraft:compass:0#", "compass"],
  ["1:palamod:item.travelboots:0#", "travelboots"],
  ["1:minecraft:writable_book:0#", "writtenBook"],
  // JOBS
  ["1:minecraft:reeds:0#", "reeds"],
  ["1:minecraft:nether_wart:0#", "netherStalkSeeds"],
  ["1:minecraft:dye:3#", "dyePowder-brown"],
  ["1:minecraft:wheat_seeds:0#", "seeds"],
  ["1:palamod:item.endium.sword:0#", "endium-sword"],
  ["1:palamod:item.paladium.sword:0#", "paladium-sword"],
  ["1:palamod:item.titane.sword:0#", "titane-sword"],
  ["1:palamod:item.amethyst.sword:0#", "amethyst-sword"],
  ["1:minecraft:iron_pickaxe:0#", "pickaxeIron"],
  ["1:minecraft:wooden_pickaxe:0#", "pickaxeWood"],
  ["1:minecraft:diamond_pickaxe:0#", "pickaxeDiamond"],
  ["1:minecraft:golden_pickaxe:0#", "pickaxeGold"],
  ["1:minecraft:potion:0#", "glassBottle"],
  ["1:minecraft:potion:8268#", "glassBottle"],
  ["1:minecraft:potion:8193#", "glassBottle"],
  ["1:minecraft:potion:8261#", "glassBottle"],
  ["1:minecraft:potion:8238#", "glassBottle"],
  ["1:minecraft:wooden_hoe:0#", "hoeWood"],
  ["1:minecraft:iron_hoe:0#", "hoeIron"],
  ["1:minecraft:golden_hoe:0#", "hoeGold"],
  [":minecraft:wooden_sword:0#", "swordWood"],
  ["1:minecraft:diamond_sword:0#", "swordDiamond"],
  ["1:minecraft:stone_sword:0#", "swordStone"],
  ["1:minecraft:iron_sword:0#", "swordIron"],
  ["1:minecraft:golden_sword:0#", "swordGold"],
  ["1:minecraft:wooden_sword:0#", "swordWood"],
  ["1:minecraft:stone_pickaxe:0#", "pickaxeStone"],
  ["64:palamod:tile.paladium.ore:0#", "tile-paladium-ore"],
  ["1:palamod:item.seed.orangeblue:0#", "seed-orangeblue"],
  ["1:minecraft:iron_ore:0#", "tile-oreIron"],
  ["1:palamod:item.capture_stone:1#", "capture-stone"],
  ["1:palamod:cauldron_core:0#", "tile-cauldron-core"],
  ["64:palamod:tile.cobbleBreaker:0#", "tile-cobbleBreaker"],
  ["1:palamod:item.hunter_backpack:0#", "hunter-backpack-amethyste"],
  ["1:minecraft:bread:0#", "bread"],
  ["1:palamod:extractor:0#", "tile-extractor"],
  ["1:palamod:flask:0#", "flask0"],
  ["1:palamod:item.sealed_xp_bottle:0#", "sealed-xp-bottle"],
  ["1:palamod:glueball_pattern:0#", "air"],
  ["64:palamod:item.endium_pollen:0#", "endium-pollen"],
  ["1:palamod:tile.crusher:0#", "tile-crusher"],
  ["1:palamod:item.hunter_amulet:0#", "hunter-amulet"],
  ["1:palamod:endium_portal_key:0#", "endium-portal-key"],
  ["1:palamod:flask:1#", "flask1"],
  ["1:palamod:flask:3#", "flask3"],
  ["1:palamod:flask:4#", "flask4"],
  ["1:palamod:flask:6#", "flask6"],
  ["1:palamod:tile.bamboo_block:0#", "tile-bamboo-block"],
  ["1:palamod:item.builder_wand:2#", "builder-wand-2"],
  ["1:palamod:tile.empty_mob_spawner:0#", "tile-empty-mob-spawner"],
  ["1:palamod:tile.totem:0#", "tile-totem"],
  ["1:palamod:item.voidstone.minage:0#{stone:134,}", "voidstone"],
  // FACTION

  ["1:palajobs:item.paladium_radius_hoe:0#", "paladium-radius-hoe"],
  ["1:palajobs:item.amethyst_radius_hoe:0#", "amethyst-radius-hoe"],
  ["1:palajobs:item.titane_radius_hoe:0#", "titane-radius-hoe"],
  ["1:palajobs:item.endium_radius_hoe:0#", "endium-radius-hoe"],
  ["1:minecraft:diamond_hoe:0#", "hoeDiamond"],
  ["1:minecraft:nether_star:0#", "netherStar"],
  ["1:minecraft:gold_ingot:0#", "ingotGold"],
  ["1:minecraft:emerald:0#", "emerald"],
  ["1:palamod:item.compressed_xp_berry:0#", "compressed-xp-berry"],
  ["1:palamod:item.endium.ingot:0#", "endium-ingot"],
  ["1:palamod:item.endium.fragment:0#", "endium-fragment"],
  ["1:palamod:tile.spike_obsi:2#", "tile-spikegold"],
  ["1:palamod:tile.spike_obsi:3#", "tile-spikeamethyst"],
  ["1:palamod:tile.spike_obsi:4#", "tile-spiketitane"],
  ["1:palamod:tile.spike_obsi:5#", "tile-spikeendium"],
  ["1:palamod:tile.spike_obsi:6#", "tile-spikepaladium"],
  ["1:palamod:tile.mega_boom_obsi:0#", "tile-mega-boom-obsi"],

  // ATTACK_DEFENSE
  ["1:palamod:tile.cave_block:0#", "tile-cave-block"],
  ["1:palamod:item.balaclava_helmet:0#", "balaclava-helmet"],
  ["1:minecraft:skull:1#", "skull-wither"],
  ["64:palamod:tile.big_obsi:0#", "tile-big-obsi"],
  ["64:palamod:tile.spikepaladium:0#", "tile-spikepaladium"],
  ["1:palamod:item.dynamite_big:0#", "dynamite-big"],
  ["1:palamod:item.dynamite:0#", "dynamite"],
  ["1:palamod:item.dynamite_endium:0#", "air"],
  ["1:palamod:item.unclaimfinder:20#", "unclaimfinder"],
  ["1:palamod:item.unclaimfinder_orange:20#", "unclaimfinder-orange"],
  ["1:palamod:item.unclaimfinder_rouge:200#", "unclaimfinder-rouge"],
  ["1:palamod:item.agro_stone:0#", "agro-stone"],
  ["1:palamod:item.chestexplorer:0#", "chestexplorer"],
  ["1:palamod:tile.home_finder:0#", "tile-home-finder"],
  // ECONOMY
  ["1:palamod:item.august_fake_money:0#", "august-fake-money"],
  ["1:palamod:tile.trophy_findium:3#", "tile-trophy-findium"],
  ["1:palamod:item.npcMoney:0#", "fake-money"],

  // ALLIANCE
  ["1:palamod:item.amethyst.boots:0#", "amethyst-boots"],
  ["1:palamod:item.titane.boots:0#", "titane-boots"],
  ["1:palamod:item.paladium.boots:0#", "paladium-boots"],
  ["1:customnpcs:npcCrown:0#", "npcCrown"],
  ["1:alliancemod:item.potion_neutral:0#", "air"],
  ["1:palamod:item.paladium.green.sword:0#", "paladium-green-sword"],
  ["1:palamod:tile.effect_tnt:0#", "air"],
  ["1:palamod:tile.endium_tnt:0#", "tile-endium-tnt"],
  ["1:palamod:tile.big_tnt:0#", "tile-big-tnt"],
  ["1:alliancemod:item.nexus_shard_order:0#", "air"],
  ["1:alliancemod:item.magic_glue:0#", "glue"],
  ["1:alliancemod:tile.protection_block:0#", "tile-protection-block"],
  // OTHERS
  ["1:palamod:item.endium.helmet:0#", "endium-helmet"],
  ["1:palamod:item.spawner_finder:0#", "spawner-finder"],
  ["1:palamod:item.glue:0#", "glue"],
  ["1:palamod:item.hammer.paladium:0#{modifiersmax:3,upgradearray:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],modifiersammount:0,}", "hammer-paladium"],
  ["1:palamod:item.capture_stone:0#", "capture-stone"],
  ["1:palapet:tile.pet_cage:0#", "tile-pet-cage"],
  ["1:palamod:item.endium.nugget:0#", "endium-nugget"],
  ["1:palamod:tile.flower_endium:0#", "tile-flower-endium"],
  ["1:secretroomsmod:CamoflaugePaste:0#", "CamoflaugePaste"],
  ["1:palamod:item.LEGENDARYSTONE_RANDOM:0#{LAST_USE:0L,SECURITY:{PLAYER:{POS:{X:-4.9263283336732835d,Y:67.65382134423638d,Z:287.979591758731d,WORLD:\"172.30.0.2\",},SLOT:5,CLASS:\"net.minecraft.entity.player.EntityPlayerMP\",UUID:\"22e46172-d288-4cf3-a2ac-25332b578c2f\",HAND:0b,},ITEM:{SECU_ITEM_CREATE:1670936171894L,SECU_ITEM_UUID:\"6c3c59bf-2161-44bf-8071-d7dd0a1895e6\",},VM_NAME:\"172.30.0.2\",},}", "LEGENDARYSTONE-RANDOM"],
  ["1:palamod:item.trixium:0#", "trixium"],
  ["1:palamod:tile.trixium_block:0#", "tile-trixium-block"],
]);

const imgPathProfile = "/img/Profile/";
const imgPathMarket = "/img/MarketUI/";
const imgPathRanking = "/img/Ranking/";
const imgPathClicker = "/img/Clicker/";
const imgPathCraft = "/img/Craft/";
const imgPathError = "/img/Error/";

const PUB_DISPLAY_TIME = 15;
export const AUTOPROMO_CONFIG: SelectedElementConfig = { type: "autoPromo", duration: PUB_DISPLAY_TIME, subOption: null };

export const adminShopItemsAvailable: AdminShopItem[] = [
  "feather", "wool", "paladium-ingot", "ender-pearl", "egg", "string", "log", "red-mushroom", "soul-sand",
  "glowstone-dust", "findium", "titane-ingot", "apple", "cobblestone", "reeds", "ghast-tear", "potato",
  "passive-wither-head", "cactus", "melon", "obsidian", "slime-ball", "spider-eye", "dirt",
  "quartz", "bone", "nether-wart", "wheat-seeds", "gunpowder", "iron-ingot", "fermented-spider-eye", "leather",
  "sand", "dye", "diamond", "gold-ingot", "flint", "coal", "redstone", "emerald", "brown-mushroom", "blaze-rod",
  "amethyst-ingot", "carrot", "cooked-beef"
];

export const constants = {
  defaultUsername,
  version,
  discord,
  githubUrl,
  metier_xp_java,
  metier_xp_bedrock,
  how_to_xp,
  links,
  calculatorXpPath,
  profilPath,
  ahPath,
  optimizerClickerPath,
  palaAnimationPath,
  craftingCalculatorPath,
  craftingOptimizerPath,
  moneyRanking,
  adminShopPath,
  statusPath,
  politiqueDeConfidentialitePath,
  patchnotePath,
  aboutPath,
  SMELT,
  notificationPath,
  MenuPath: menuPaths,
  deprecatedIdAchivement,
  dictAchievementIdToSubIds,
  dictAchievementIdToIcon,
  startSeason,
  webhooksPath,
  accountPath,
  adminPanelPath,
  qdfPath,
  imgPathProfile,
  imgPathMarket,
  imgPathRanking,
  imgPathClicker,
  imgPathCraft,
  imgPathError,
  AUTOPROMO_CONFIG,
  adminShopItemsAvailable,
  METIER_KEY,
  POTION_DOUBLE_BONUS,
  POTION_X10_BONUS,
  FORTUNE_II_BONUS,
  FORTUNE_III_BONUS,
  LEVEL_PRECONDITIONS,
};

