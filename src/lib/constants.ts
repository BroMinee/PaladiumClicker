import { SelectedElementConfig } from "@/components/twitch/twitch-overlay-config.client";
import { AdminShopItem, LevelPreconditions, MetierKey, NavBarCategory } from "@/types";

const version = 1;

const discord = {
  url: "https://discord.gg/WGXUKHcZ3P",
  name: "PalaTracker"
};

const githubUrl = "https://github.com/BroMineCorp/PaladiumClickerNextJS";

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
  | "/admin-panel";

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
  | "Admin Panel";

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
  "/admin-panel": { label: "Admin Panel", requiredPseudo: false }
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

const metier_xp = [
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

const metier_palier = [
  0, // level 1
  22123, // level 2
  62513, // level 3
  136264, // level 4
  255150, // level 5
  431761, // level 6
  679377, // level 7
  1011884, // level 8
  1443710, // level 9
  1989772, // level 10
  2665441, // level 11
  3486503, // level 12
  4469135, // level 13
  5629878, // level 14
  6985619, // level 15
  8553572, // level 16
  10351262, // level 17
  12396510, // level 18
  14707422, // level 19
  17302375, // level 20
];

export type HowToXpElement = {
  type: string;
  action: string;
  xp: number;
  imgPath: string;
  level?: number;
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
    8: "Casser **6 650** eggplants",
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
    { type: "Bottle XP", action: "Utiliser", xp: 1000, imgPath: "exp_miner.webp", ignorePotionBonus: true },
    { type: "Bonbon Jaune", "action": EAT, "xp": 50000, imgPath: "candy_YELLOW.webp" },
    { type: "Bonbon Multicolor", "action": EAT, "xp": 50000, imgPath: "candy_RAINBOW.webp" },
    { type: "Nether brick", "action": SMELT, "xp": 0.1, imgPath: "nether_brick.webp" },
    { type: "Stone", "action": BREAK, "xp": 0.5, imgPath: "stone.webp" },
    { type: "Charcoal", "action": SMELT, "xp": 1, imgPath: "charcoal.webp" },
    { type: "Andesite", "action": BREAK, "xp": 3, imgPath: "andesite.webp" },
    { type: "Granite", "action": BREAK, "xp": 3, imgPath: "granite.webp" },
    { type: "Diorite", "action": BREAK, "xp": 3, imgPath: "diorite.webp" },
    { type: "Coal Ore", "action": BREAK, "xp": 4, imgPath: "coal_ore.webp" },
    { type: "Nether Quartz Ore", "action": BREAK, "xp": 6, imgPath: "nether_quartz_ore.webp" },
    { type: "Obsidian", "action": BREAK, "xp": 6, imgPath: "obsidian.webp" },
    { type: "Lapis Lazulli Ore", "action": BREAK, "xp": 15, imgPath: "lapis_ore.webp" },
    { type: "Redstone Ore", "action": BREAK, "xp": 15, imgPath: "redstone_ore.webp" },
    { type: "Emerald Ore", "action": BREAK, "xp": 75, imgPath: "emerald_ore.webp" },
    { type: "Iron Ingot", "action": SMELT, "xp": 8, imgPath: "iron_ingot.webp", level: 2 },
    { type: "Diamond Ore", "action": BREAK, "xp": 25, imgPath: "diamond_ore.webp", level: 2 },
    { type: "Gold Ingot", "action": SMELT, "xp": 30, imgPath: "gold_ingot.webp", level: 3 },
    { type: "Amethyst Ingot", "action": SMELT, "xp": 35, imgPath: "amethyst_ingot.webp", level: 4 },
    { type: "Iron Particle", "action": OBTAIN_FROM_COBBLEBREAKER, "xp": 2, imgPath: "iron_particle.webp", level: 5 },
    { type: "Gold Particle", "action": OBTAIN_FROM_COBBLEBREAKER, "xp": 4, imgPath: "gold_particle.webp", level: 5 },
    { type: "Diamond Particle", "action": OBTAIN_FROM_COBBLEBREAKER, "xp": 8, imgPath: "diamond_particle.webp", level: 5 },
    { type: "Amethyst Particle", "action": OBTAIN_FROM_COBBLEBREAKER, "xp": 12, imgPath: "amethyst_particle.webp", level: 5 },
    { type: "Titane Particle", "action": OBTAIN_FROM_COBBLEBREAKER, "xp": 16, imgPath: "titane_particle.webp", level: 5 },
    { type: "Paladium Particle", "action": OBTAIN_FROM_COBBLEBREAKER, "xp": 20, imgPath: "paladium_particle.webp", level: 5 },
    { type: "Titane Ingot", "action": SMELT, "xp": 50, imgPath: "titane_ingot.webp", level: 6 },
    { type: "Cavernous Zombie", "action": KILL, "xp": NaN, imgPath: "cavernous_zombie.webp", level: 7 },
    { type: "Paladium Ingot", "action": SMELT, "xp": 150, imgPath: "paladium_ingot.webp", level: 8 },
    { type: "Findium Ore", "action": BREAK, "xp": 110, imgPath: "findium_ore.webp", level: 10 },
    { type: "Paladium Green Ingot", "action": SMELT, "xp": 200, imgPath: "paladium_green_ingot.webp", level: 12 },
  ],
  "farmer": [
    { type: "Bottle XP", action: "Utiliser", xp: 1000, imgPath: "exp_farmer.webp", ignorePotionBonus: true },
    { type: "Bonbon Vert", "action": EAT, "xp": 50000, imgPath: "candy_GREEN.webp" },
    { type: "Bonbon Multicolor", "action": EAT, "xp": 50000, imgPath: "candy_RAINBOW.webp" },
    { type: "Bread", "action": CRAFT, "xp": 1, imgPath: "bread.webp" },
    { type: "Seed", "action": BREAK, "xp": 1.5, imgPath: "seeds_wheat.webp" },
    { type: "Baked Potato", "action": SMELT, "xp": 1, imgPath: "potato_baked.webp", level: 2 },
    { type: "Potatoes", "action": BREAK, "xp": 2, imgPath: "potato.webp", level: 2 },
    { type: "Carrots", "action": BREAK, "xp": 2.5, imgPath: "carrot.webp", level: 2 },
    { type: "Melon", "action": BREAK, "xp": 4, imgPath: "melon.webp", level: 3 },
    { type: "Pumpkin", "action": BREAK, "xp": 5, imgPath: "pumpkin.webp", level: 6 },
    { type: "Farmer Chicken", "action": KILL, "xp": NaN, imgPath: "farmer_chicken.webp", level: 7 },
    { type: "Amethyst Ingot", "action": CRUSH, "xp": 3, imgPath: "amethyst_ingot.webp", level: 8 },
    { type: "Eggplant", "action": BREAK, "xp": 10, imgPath: "eggplant.webp", level: 8 },
    { type: "Pumpkin Pie", "action": CRAFT, "xp": 4, imgPath: "pumpkin_pie.webp", level: 11 },
    { type: "Titane Ingot", "action": CRUSH, "xp": 4.5, imgPath: "titane_ingot.webp", level: 12 },
    { type: "Chervil", "action": BREAK, "xp": 20, imgPath: "chervil.webp", level: 12 },
    { type: "Paladium Ingot", "action": CRUSH, "xp": 6, imgPath: "paladium_ingot.webp", level: 16 },
    { type: "Kiwano", "action": BREAK, "xp": 50, imgPath: "kiwano.webp", level: 16 },
  ],
  "hunter": [
    { type: "Bottle XP", action: "Utiliser", xp: 1000, imgPath: "exp_hunter.webp", ignorePotionBonus: true },
    { type: "Bonbon Bleu", "action": EAT, "xp": 50000, imgPath: "candy_BLUE.webp" },
    { type: "Bonbon Multicolor", "action": EAT, "xp": 50000, imgPath: "candy_RAINBOW.webp" },
    { type: "Snow Golem", "action": KILL, "xp": 1, imgPath: "snow_golem_hunter.webp" },
    { type: "Squid", "action": KILL, "xp": 10, imgPath: "squid.webp" },
    { type: "Cooked Porkchop", "action": SMELT, "xp": 10, imgPath: "porkchop_cooked.webp" },
    { type: "Cooked Chicken", "action": SMELT, "xp": 10, imgPath: "chicken_cooked.webp" },
    { type: "Cooked Mutton", "action": SMELT, "xp": 10, imgPath: "cooked_mutton.webp" },
    { type: "Steak", "action": SMELT, "xp": 10, imgPath: "steak.webp" },
    { type: "Cow", "action": KILL, "xp": 14, imgPath: "cow.webp" },
    { type: "Pig", "action": KILL, "xp": 14, imgPath: "pig.webp" },
    { type: "Horse", "action": KILL, "xp": 14, imgPath: "horse.webp" },
    { type: "Sheep", "action": KILL, "xp": 14, imgPath: "sheep.webp" },
    { type: "Rabbit", "action": KILL, "xp": 14, imgPath: "rabbit.webp" },
    { type: "Chicken", "action": KILL, "xp": 14, imgPath: "chicken.webp" },
    { type: "Cooked Fish", "action": SMELT, "xp": 15, imgPath: "cooked_fish.webp" },
    { type: "Cooked Salmon", "action": SMELT, "xp": 15, imgPath: "cooked_salmon.webp" },
    { type: "Raw fish", "action": FISH, "xp": 25, imgPath: "fish_cod_raw.webp" },
    { type: "Raw Salmon", "action": FISH, "xp": 35, imgPath: "raw_salmon.webp" },
    { type: "Creeper", "action": KILL, "xp": 40, imgPath: "creeper.webp" },
    { type: "Pufferfish", "action": FISH, "xp": 75, imgPath: "pufferfish.webp" },
    { type: "Clownfish", "action": FISH, "xp": 200, imgPath: "clownfish.webp" },
    { type: "Wither", "action": KILL, "xp": 1000, imgPath: "wither.webp" },
    { type: "Goat", "action": KILL, "xp": 20, imgPath: "goat.webp" },
    { type: "Carp", "action": FISH, "xp": 150, imgPath: "carp.webp", level: 2 },
    { type: "Bass", "action": FISH, "xp": 225, imgPath: "bass.webp", level: 2 },
    { type: "Manta Ray", "action": FISH, "xp": 300, imgPath: "manta_ray.webp", level: 2 },
    { type: "Snail", "action": KILL, "xp": 25, imgPath: "snail.webp", level: 2 },
    { type: "Red Tuna", "action": FISH, "xp": 450, imgPath: "red_tuna.webp", level: 2 },
    { type: "Moonfish", "action": FISH, "xp": 550, imgPath: "moonfish.webp", level: 2 },
    { type: "Exp Fish", "action": FISH, "xp": 750, imgPath: "exp_fish.webp", level: 3 },
    { type: "Parrot", "action": KILL, "xp": 30, imgPath: "parrot.webp", level: 3 },
    { type: "Whale", "action": FISH, "xp": 10000, imgPath: "whale.webp", level: 4 },
    { type: "Kraken", "action": FISH, "xp": 15000, imgPath: "kraken.webp", level: 4 },
    { type: "Dolphin", "action": KILL, "xp": 35, imgPath: "dolphin.webp", level: 5 },
    { type: "Mega Creeper", "action": KILL, "xp": NaN, imgPath: "mega_creeper.webp", level: 7 },
    { type: "Zombie", "action": KILL, "xp": 15, imgPath: "zombie.webp", level: 7 },
    { type: "Turtle", "action": KILL, "xp": 40, imgPath: "turtle.webp", level: 8 },
    { type: "Panda", "action": KILL, "xp": 60, imgPath: "panda.webp", level: 9 },
    { type: "Skeleton", "action": KILL, "xp": 20, imgPath: "skeleton.webp", level: 11 },
    { type: "Elephant", "action": KILL, "xp": NaN, imgPath: "elephant.webp", level: 11 },
    { type: "Crab", "action": KILL, "xp": 80, imgPath: "crab.webp", level: 12 },
    { type: "Spider", "action": KILL, "xp": 8, imgPath: "spider.webp", level: 13 },
    { type: "Blaze", "action": KILL, "xp": 25, imgPath: "blaze.webp", level: 14 },
    { type: "Witch", "action": KILL, "xp": 35, imgPath: "witch.webp", level: 14 },
    { type: "Snake", "action": KILL, "xp": 120, imgPath: "snake.webp", level: 15 },
    { type: "Cave Spider", "action": KILL, "xp": 15, imgPath: "cave_spider.webp", level: 18 },
    { type: "Jelly Fish", "action": KILL, "xp": 150, imgPath: "jelly_fish.webp", level: 18 },
  ],
  "alchemist": [
    { type: "Bottle XP", action: "Utiliser", xp: 1000, imgPath: "exp_alchemist.webp", ignorePotionBonus: true },
    { type: "Bonbon Mauve", "action": EAT, "xp": 50000, imgPath: "candy_PINK.webp" },
    { type: "Bonbon Multicolor", "action": EAT, "xp": 50000, imgPath: "candy_RAINBOW.webp" },
    { type: "Empty Flask", "action": CRAFT, "xp": 0.2, imgPath: "empty_flask.webp" },
    { type: "Jacaranda Log", "action": BREAK, "xp": 10, imgPath: "jacaranda_log.webp" },
    { type: "Judeecercis Log", "action": BREAK, "xp": 10, imgPath: "judeecercis_log.webp" },
    { type: "Erable Log", "action": BREAK, "xp": 10, imgPath: "erable_log.webp" },
    { type: "Extractor", "action": CRAFT, "xp": 20, imgPath: "extractor.webp" },
    { type: "Lightning Potion", "action": CRAFT, "xp": 30, imgPath: "lightning_potion.webp" },
    { type: "Jacaranda Log", "action": EXTRACT_FROM_SAP, "xp": 15, imgPath: "jacaranda_log.webp", level: 3 },
    { type: "Blue Orchid", "action": THROW_IN_A_CAULDRON, "xp": 1, imgPath: "blue_orchid.webp", level: 3 },
    { type: "Dandelion", "action": THROW_IN_A_CAULDRON, "xp": 1, imgPath: "dandelion.webp", level: 3 },
    { type: "Poppy", "action": THROW_IN_A_CAULDRON, "xp": 1, imgPath: "poppy.webp", level: 3 },
    { type: "White Tulip", "action": THROW_IN_A_CAULDRON, "xp": 2, imgPath: "white_tulip.webp", level: 3 },
    { type: "Oxeye Daisy", "action": THROW_IN_A_CAULDRON, "xp": 2, imgPath: "oxeye_daisy.webp", level: 3 },
    { type: "Orange Tulip", "action": THROW_IN_A_CAULDRON, "xp": 2, imgPath: "orange_tulip.webp", level: 3 },
    { type: "Allium", "action": THROW_IN_A_CAULDRON, "xp": 2, imgPath: "allium.webp", level: 3 },
    { type: "Pink Tulip", "action": THROW_IN_A_CAULDRON, "xp": 2, imgPath: "pink_tulip.webp", level: 3 },
    { type: "Azure Bluet", "action": THROW_IN_A_CAULDRON, "xp": 2, imgPath: "azure_bluet.webp", level: 3 },
    { type: "Red Tulip", "action": THROW_IN_A_CAULDRON, "xp": 2, imgPath: "red_tulip.webp", level: 3 },
    { type: "Amethyst Ingot", "action": CRAFT_IN_PORTAL, "xp": 6, imgPath: "amethyst_ingot.webp", level: 3 },
    { type: "Judeecercis Log", "action": EXTRACT_FROM_SAP, "xp": 40, imgPath: "judeecercis_log.webp", level: 5 },
    { type: "Green Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 2, imgPath: "green_glueball.webp", level: 6 },
    { type: "Blue Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 2, imgPath: "blue_glueball.webp", level: 6 },
    { type: "Red Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 2, imgPath: "red_glueball.webp", level: 6 },
    { type: "Titane Ingot", "action": CRAFT_IN_PORTAL, "xp": 20, imgPath: "titane_ingot.webp", level: 6 },
    { type: "Flower Monster", "action": KILL, "xp": NaN, imgPath: "flower_monster.webp", level: 7 },
    { type: "Gray Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 15, imgPath: "gray_glueball.webp", level: 10 },
    { type: "Cyan Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 15, imgPath: "cyan_glueball.webp", level: 10 },
    { type: "Yellow Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 15, imgPath: "yellow_glueball.webp", level: 10 },
    { type: "Purple Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 15, imgPath: "purple_glueball.webp", level: 10 },
    { type: "Green Dark Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 15, imgPath: "green_dark_glueball.webp", level: 10 },
    { type: "Orange Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 15, imgPath: "orange_glueball.webp", level: 10 },
    { type: "Green Flash Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 15, imgPath: "green_flash_glueball.webp", level: 10 },
    { type: "Paladium Ingot", "action": CRAFT_IN_PORTAL, "xp": 40, imgPath: "paladium_ingot.webp", level: 10 },
    { type: "Erable Log", "action": EXTRACT_FROM_SAP, "xp": 80, imgPath: "erable_log.webp", level: 10 },
    { type: "Paladium Flower", "action": THROW_IN_A_CAULDRON, "xp": 100, imgPath: "flower_paladium.webp", level: 16 },
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
  ["Statistiques et données", ["/profil", "/ah", "/admin-shop", "/ranking?category=money"]],
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
  metier_xp,
  metier_palier,
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

