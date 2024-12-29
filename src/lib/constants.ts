import { MetierKey } from "@/types";

const version = 0;

const discord = {
  url: "https://discord.gg/WGXUKHcZ3P",
  name: "PalaTracker"
};

const defaultUsername = "Profil_vide";

export type PathValid =
  "/profil"
  | "/ah"
  | "/xp-calculator"
  | "/clicker-optimizer"
  | "/palatime"
  | "/pala-animation"
  | "/craft"
  | "/about"
  | "/ranking?category=money"
  | "/ranking?category=job.miner"
  | "/ranking?category=boss"
  | "/ranking?category=egghunt"
  | "/ranking?category=koth"
  | "/ranking?category=clicker"
  | "/admin-shop"
  | "/status"
  | "/politique-de-confidentialite"
  | "/patchnote";

export type LabelValid =
  "Profil"
  | "Market"
  | "Calculateur d'xp"
  | "PalaClicker Optimizer"
  | "Palatime"
  | "PalaAnimation Trainer"
  | "Craft Optimizer"
  | "A propos"
  | "Money"
  | "Métiers"
  | "Boss"
  | "Egg Hunt"
  | "KOTH"
  | "Clicker"
  | "Admin Shop"
  | "Status"
  | "Politique de confidentialité"
  | "Patchnote";


const profilPath: PathValid = "/profil";
const ahPath: PathValid = "/ah";
const calculatorXpPath: PathValid = "/xp-calculator";
const optimizerClickerPath: PathValid = "/clicker-optimizer";
const palatimePath: PathValid = "/palatime";
const palaAnimationPath: PathValid = "/pala-animation";
const craftPath: PathValid = "/craft";
const moneyRanking: PathValid = "/ranking?category=money";
const metiersRanking: PathValid = "/ranking?category=job.miner";
const bossRanking: PathValid = "/ranking?category=boss";
const eggHuntRanking: PathValid = "/ranking?category=egghunt";
const kothRanking: PathValid = "/ranking?category=koth";
const clickerRanking: PathValid = "/ranking?category=clicker";
const adminShopPath: PathValid = "/admin-shop";
const statusPath: PathValid = "/status";
const politiqueDeConfidentialitePath: PathValid = "/politique-de-confidentialite";
const patchnotePath: PathValid = "/patchnote";
const aboutPath: PathValid = "/about";

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
  "/palatime": { label: "Palatime", requiredPseudo: false },
  "/pala-animation": { label: "PalaAnimation Trainer", requiredPseudo: true },
  "/craft": { label: "Craft Optimizer", requiredPseudo: false },
  "/about": { label: "A propos", requiredPseudo: false },
  "/ranking?category=money": { label: "Money", requiredPseudo: false },
  "/ranking?category=job.miner": { label: "Métiers", requiredPseudo: false },
  "/ranking?category=boss": { label: "Boss", requiredPseudo: false },
  "/ranking?category=egghunt": { label: "Egg Hunt", requiredPseudo: false },
  "/ranking?category=koth": { label: "KOTH", requiredPseudo: false },
  "/ranking?category=clicker": { label: "Clicker", requiredPseudo: false },
  "/admin-shop": { label: "Admin Shop", requiredPseudo: false },
  "/status": { label: "Status", requiredPseudo: false },
  "/politique-de-confidentialite": { label: "Politique de confidentialité", requiredPseudo: false },
  "/patchnote": { label: "Patchnote", requiredPseudo: false },
};


const SMELT = "Smelt";
const BREAK = "Break";
const OBTAIN_FROM_COBBLEBREAKER = "Obtain from CobbleBreaker";
const KILL = "Kill";
const FISH = "Fish";
const CRAFT = "Craft";
const EXTRACT_FROM_SAP = "Extract from Sap";
const THROW_IN_A_CAULDRON = "Throw in a Cauldron";
const CRAFT_IN_PORTAL = "Craft in Portal";
const CRAFT_IN_A_CAULDRON = "Craft in a Cauldron";
const CRUSH = "Crush";

const metier_xp = [
  480,
  1044,
  1713,
  2497,
  3408,
  4451,
  5635,
  6966,
  8447,
  10086,
  11885,
  13850,
  15983,
  18290,
  20773,
  23435,
  26281,
  29312,
  32532,
  35943,
  39549,
  43351,
  47353,
  51556,
  55964,
  60577,
  65399,
  70432,
  75677,
  81137,
  86813,
  92709,
  98824,
  105162,
  111724,
  118512,
  125527,
  132772,
  140248,
  147956,
  155898,
  164076,
  172492,
  181146,
  190040,
  199176,
  208555,
  218179,
  228049,
  238166,
  248532,
  259148,
  270015,
  281135,
  292509,
  304138,
  316023,
  328166,
  340568,
  353230,
  366153,
  379339,
  392788,
  406502,
  420482,
  434728,
  449243,
  464027,
  479081,
  494407,
  510004,
  525875,
  542021,
  558442,
  575140,
  592115,
  609368,
  626901,
  644714,
  662809,
  681186,
  699846,
  718791,
  738021,
  757537,
  777339,
  797430,
  817810,
  838479,
  859439,
  880690,
  902234,
  924071,
  946202,
  968628,
  991349,
  1014368,
  1037683,
  1061297,
  1085210
]

const metier_palier = [
  0,
  1044,
  2757,
  5254,
  8662,
  13113,
  18748,
  25714,
  34161,
  44247,
  56132,
  69982,
  85965,
  104255,
  125028,
  148463,
  174744,
  204056,
  236588,
  272531,
  312080,
  355431,
  402784,
  454340,
  510304,
  570881,
  636280,
  706712,
  782389,
  863526,
  950339,
  1043048,
  1141872,
  1247034,
  1358758,
  1477270,
  1602797,
  1735569,
  1875817,
  2023773,
  2179671,
  2343747,
  2516239,
  2697385,
  2887425,
  3086601,
  3295156,
  3513335,
  3741384,
  3979550,
  4228082,
  4487230,
  4757245,
  5038380,
  5330889,
  5635027,
  5951050,
  6279216,
  6619784,
  6973014,
  7339167,
  7718566,
  8111354,
  8517856,
  8938338,
  9373066,
  9822309,
  10286336,
  10765417,
  11259824,
  11769828,
  12295703,
  12837724,
  13396166,
  13971316,
  14563431,
  15172799,
  15799700,
  16444414,
  17107223,
  17788409,
  18488255,
  19207046,
  19945067,
  20702604,
  21479943,
  22277373,
  23095183,
  23933662,
  24793100,
  25673790,
  26576024,
  27500095,
  28446297,
  29414925,
  30406274,
  31420642,
  32458325,
  33519622,
  34604832
]

export type HowToXpElement = {
  type: string;
  action: string;
  xp: number;
  imgPath: string;
};

type HowToXp = {
  [K in MetierKey]: HowToXpElement[]
}

const how_to_xp: HowToXp = {
  "miner": [
    { type: "Nether brick", "action": SMELT, "xp": 0.1, imgPath: "nether_brick.png" },
    { type: "Stone", "action": BREAK, "xp": 0.5, imgPath: "stone.png" },
    { type: "Charcoal", "action": SMELT, "xp": 1, imgPath: "charcoal.png" },
    { type: "Andesite", "action": BREAK, "xp": 3, imgPath: "andesite.png" },
    { type: "Granite", "action": BREAK, "xp": 3, imgPath: "granite.png" },
    { type: "Diorite", "action": BREAK, "xp": 3, imgPath: "diorite.png" },
    { type: "Coal Ore", "action": BREAK, "xp": 4, imgPath: "coal_ore.png" },
    { type: "Nether Quartz Ore", "action": BREAK, "xp": 6, imgPath: "nether_quartz_ore.png" },
    { type: "Obsidian", "action": BREAK, "xp": 6, imgPath: "obsidian.png" },
    { type: "Lapis Lazulli Ore", "action": BREAK, "xp": 15, imgPath: "lapis_ore.png" },
    { type: "Redstone Ore", "action": BREAK, "xp": 15, imgPath: "redstone_ore.png" },
    { type: "Emerald Ore", "action": BREAK, "xp": 75, imgPath: "emerald_ore.png" },
    { type: "Iron Ingot", "action": SMELT, "xp": 8, imgPath: "iron_ingot.png" },
    { type: "Diamond Ore", "action": BREAK, "xp": 25, imgPath: "diamond_ore.png" },
    { type: "Gold Ingot", "action": SMELT, "xp": 30, imgPath: "gold_ingot.png" },
    { type: "Amethyst Ingot", "action": SMELT, "xp": 35, imgPath: "amethyst_ingot.png" },
    { type: "Iron Particle", "action": OBTAIN_FROM_COBBLEBREAKER, "xp": 2, imgPath: "iron_particle.png" },
    { type: "Gold Particle", "action": OBTAIN_FROM_COBBLEBREAKER, "xp": 4, imgPath: "gold_particle.png" },
    { type: "Diamond Particle", "action": OBTAIN_FROM_COBBLEBREAKER, "xp": 8, imgPath: "diamond_particle.png" },
    { type: "Amethyst Particle", "action": OBTAIN_FROM_COBBLEBREAKER, "xp": 12, imgPath: "amethyst_particle.png" },
    { type: "Titane Particle", "action": OBTAIN_FROM_COBBLEBREAKER, "xp": 16, imgPath: "titane_particle.png" },
    { type: "Paladium Particle", "action": OBTAIN_FROM_COBBLEBREAKER, "xp": 20, imgPath: "paladium_particle.png" },
    { type: "Titane Ingot", "action": SMELT, "xp": 50, imgPath: "titane_ingot.png" },
    { type: "Cavernous Zombie", "action": KILL, "xp": NaN, imgPath: "cavernous_zombie.png" },
    { type: "Paladium Ingot", "action": SMELT, "xp": 150, imgPath: "paladium_ingot.png" },
    { type: "Findium Ore", "action": BREAK, "xp": 110, imgPath: "findium_ore.png" },
    { type: "Paladium Green Ingot", "action": SMELT, "xp": 200, imgPath: "paladium_green_ingot.png" },
  ],
  "farmer": [
    { type: "Bread", "action": CRAFT, "xp": 1, imgPath: "bread.png" },
    { type: "Seed", "action": BREAK, "xp": 1.5, imgPath: "seeds_wheat.png" },
    { type: "Baked Potato", "action": SMELT, "xp": 1, imgPath: "potato_baked.png" },
    { type: "Potatoes", "action": BREAK, "xp": 2, imgPath: "potato.png" },
    { type: "Carrots", "action": BREAK, "xp": 2.5, imgPath: "carrot.png" },
    { type: "Melon", "action": BREAK, "xp": 4, imgPath: "melon.png" },
    { type: "Pumpkin", "action": BREAK, "xp": 5, imgPath: "pumpkin.png" },
    { type: "Farmer Chicken", "action": KILL, "xp": NaN, imgPath: "farmer_chicken.png" },
    { type: "Amethyst Ingot", "action": CRUSH, "xp": 3, imgPath: "amethyst_ingot.png" },
    { type: "Eggplant", "action": BREAK, "xp": 10, imgPath: "eggplant.png" },
    { type: "Pumpkin Pie", "action": CRAFT, "xp": 4, imgPath: "pumpkin_pie.png" },
    { type: "Titane Ingot", "action": CRUSH, "xp": 4.5, imgPath: "titane_ingot.png" },
    { type: "Chervil", "action": BREAK, "xp": 20, imgPath: "chervil.png" },
    { type: "Paladium Ingot", "action": CRUSH, "xp": 6, imgPath: "paladium_ingot.png" },
    { type: "Kiwano", "action": BREAK, "xp": 200, imgPath: "kiwano.png" },
  ],
  "hunter": [
    { type: "Snow Golem", "action": KILL, "xp": 1, imgPath: "snow_golem.png" },
    { type: "Squid", "action": KILL, "xp": 10, imgPath: "squid.png" },
    { type: "Cooked Porkchop", "action": SMELT, "xp": 10, imgPath: "porkchop_cooked.png" },
    { type: "Cooked Chicken", "action": SMELT, "xp": 10, imgPath: "chicken_cooked.png" },
    { type: "Cooked Mutton", "action": SMELT, "xp": 10, imgPath: "cooked_mutton.png" },
    { type: "Steak", "action": SMELT, "xp": 10, imgPath: "steak.png" },
    { type: "Cow", "action": KILL, "xp": 14, imgPath: "cow.png" },
    { type: "Pig", "action": KILL, "xp": 14, imgPath: "pig.png" },
    { type: "Horse", "action": KILL, "xp": 14, imgPath: "horse.png" },
    { type: "Sheep", "action": KILL, "xp": 14, imgPath: "sheep.png" },
    { type: "Rabbit", "action": KILL, "xp": 14, imgPath: "rabbit.png" },
    { type: "Chicken", "action": KILL, "xp": 14, imgPath: "chicken.png" },
    { type: "Cooked Fish", "action": SMELT, "xp": 15, imgPath: "cooked_fish.png" },
    { type: "Cooked Salmon", "action": SMELT, "xp": 15, imgPath: "cooked_salmon.png" },
    { type: "Raw fish", "action": FISH, "xp": 25, imgPath: "fish_cod_raw.png" },
    { type: "Raw Salmon", "action": FISH, "xp": 35, imgPath: "raw_salmon.png" },
    { type: "Creeper", "action": KILL, "xp": 40, imgPath: "creeper.png" },
    { type: "Pufferfish", "action": FISH, "xp": 75, imgPath: "pufferfish.png" },
    { type: "Clownfish", "action": FISH, "xp": 200, imgPath: "clownfish.png" },
    { type: "Wither", "action": KILL, "xp": 1000, imgPath: "wither.png" },
    { type: "Goat", "action": KILL, "xp": 20, imgPath: "goat.png" },
    { type: "Carp", "action": FISH, "xp": 150, imgPath: "carp.png" },
    { type: "Bass", "action": FISH, "xp": 150, imgPath: "bass.png" },
    { type: "Manta Ray", "action": FISH, "xp": 300, imgPath: "manta_ray.png" },
    { type: "Snail", "action": KILL, "xp": 25, imgPath: "snail.png" },
    { type: "Red Tuna", "action": FISH, "xp": 450, imgPath: "red_tuna.png" },
    { type: "Moonfish", "action": FISH, "xp": 550, imgPath: "moonfish.png" },
    { type: "Exp Fish", "action": FISH, "xp": 750, imgPath: "exp_fish.png" },
    { type: "Parrot", "action": KILL, "xp": 30, imgPath: "parrot.png" },
    { type: "Whale", "action": FISH, "xp": 10000, imgPath: "whale.png" },
    { type: "Kraken", "action": FISH, "xp": 15000, imgPath: "kraken.png" },
    { type: "Dolphin", "action": KILL, "xp": 35, imgPath: "dolphin.png" },
    { type: "Mega Creeper", "action": KILL, "xp": NaN, imgPath: "mega_creeper.png" },
    { type: "Zombie", "action": KILL, "xp": 15, imgPath: "zombie.png" },
    { type: "Turtle", "action": KILL, "xp": 40, imgPath: "turtle.png" },
    { type: "Panda", "action": KILL, "xp": 60, imgPath: "panda.png" },
    { type: "Skeleton", "action": KILL, "xp": 20, imgPath: "skeleton.png" },
    { type: "Elephant", "action": KILL, "xp": NaN, imgPath: "elephant.png" },
    { type: "Crab", "action": KILL, "xp": 80, imgPath: "crab.png" },
    { type: "Spider", "action": KILL, "xp": 8, imgPath: "spider.png" },
    { type: "Blaze", "action": KILL, "xp": 25, imgPath: "blaze.png" },
    { type: "Witch", "action": KILL, "xp": 35, imgPath: "witch.png" },
    { type: "Snake", "action": KILL, "xp": 120, imgPath: "snake.png" },
    { type: "Cave Spider", "action": KILL, "xp": 15, imgPath: "cave_spider.png" },
    { type: "Jelly Fish", "action": KILL, "xp": 150, imgPath: "jelly_fish.png" },
  ],
  "alchemist": [
    { type: "Empty Flask", "action": CRAFT, "xp": 0.2, imgPath: "empty_flask.png" },
    { type: "Jacaranda Log", "action": BREAK, "xp": 10, imgPath: "jacaranda_log.png" },
    { type: "Judeecercis Log", "action": BREAK, "xp": 10, imgPath: "judeecercis_log.png" },
    { type: "Erable Log", "action": BREAK, "xp": 10, imgPath: "erable_log.png" },
    { type: "Extractor", "action": CRAFT, "xp": 20, imgPath: "extractor.png" },
    { type: "Lightning Potion", "action": CRAFT, "xp": 30, imgPath: "lightning_potion.png" },
    { type: "Jacaranda Log", "action": EXTRACT_FROM_SAP, "xp": 15, imgPath: "jacaranda_log.png" },
    { type: "Blue Orchid", "action": THROW_IN_A_CAULDRON, "xp": 1, imgPath: "blue_orchid.png" },
    { type: "Dandelion", "action": THROW_IN_A_CAULDRON, "xp": 1, imgPath: "dandelion.png" },
    { type: "Poppy", "action": THROW_IN_A_CAULDRON, "xp": 1, imgPath: "poppy.png" },
    { type: "White Tulip", "action": THROW_IN_A_CAULDRON, "xp": 2, imgPath: "white_tulip.png" },
    { type: "Oxeye Daisy", "action": THROW_IN_A_CAULDRON, "xp": 2, imgPath: "oxeye_daisy.png" },
    { type: "Orange Tulip", "action": THROW_IN_A_CAULDRON, "xp": 2, imgPath: "orange_tulip.png" },
    { type: "Allium", "action": THROW_IN_A_CAULDRON, "xp": 2, imgPath: "allium.png" },
    { type: "Pink Tulip", "action": THROW_IN_A_CAULDRON, "xp": 2, imgPath: "pink_tulip.png" },
    { type: "Azure Bluet", "action": THROW_IN_A_CAULDRON, "xp": 2, imgPath: "azure_bluet.png" },
    { type: "Red Tulip", "action": THROW_IN_A_CAULDRON, "xp": 2, imgPath: "red_tulip.png" },
    { type: "Amethyst Ingot", "action": CRAFT_IN_PORTAL, "xp": 6, imgPath: "amethyst_ingot.png" },
    { type: "Judeecercis Log", "action": EXTRACT_FROM_SAP, "xp": 40, imgPath: "judeecercis_log.png" },
    { type: "Green Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 2, imgPath: "green_glueball.png" },
    { type: "Blue Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 2, imgPath: "blue_glueball.png" },
    { type: "Red Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 2, imgPath: "red_glueball.png" },
    { type: "Titane Ingot", "action": CRAFT_IN_PORTAL, "xp": 20, imgPath: "titane_ingot.png" },
    { type: "Flower Monster", "action": KILL, "xp": NaN, imgPath: "flower_monster.png" },
    { type: "Gray Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 15, imgPath: "gray_glueball.png" },
    { type: "Cyan Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 15, imgPath: "cyan_glueball.png" },
    { type: "Yellow Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 15, imgPath: "yellow_glueball.png" },
    { type: "Purple Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 15, imgPath: "purple_glueball.png" },
    { type: "Green Dark Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 15, imgPath: "green_dark_glueball.png" },
    { type: "Orange Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 15, imgPath: "orange_glueball.png" },
    { type: "Green Flash Glueball", "action": CRAFT_IN_A_CAULDRON, "xp": 15, imgPath: "green_flash_glueball.png" },
    { type: "Paladium Ingot", "action": CRAFT_IN_PORTAL, "xp": 40, imgPath: "paladium_ingot.png" },
    { type: "Erable Log", "action": EXTRACT_FROM_SAP, "xp": 80, imgPath: "erable_log.png" },
    { type: "Paladium Flower", "action": THROW_IN_A_CAULDRON, "xp": 100, imgPath: "flower_paladium.png" },
  ]
}

const notificationPath: Map<PathValid, [number, string]> = new Map<PathValid, [number, string]>(
  [
    ["/profil", [new Date("2024-12-21 16:15").getTime(), "Ajout d'une section 'Classement'"]],
    ["/xp-calculator", [new Date("2024-10-16").getTime(), "Ajout des \"fortunes modifiers\" dans les calculs"]],
    ["/clicker-optimizer", [new Date("2024-11-27 19:00").getTime(), "Refonte de la page"]],
    ["/palatime", [new Date("2025-01-06 17:25").getTime(), "Nouvelle édition"]],
    ["/craft", [new Date("2024-10-16").getTime(), "Nouvel outil"]],
    ["/patchnote", [new Date("2024-12-21 16:15").getTime(), "Nouveau patchnote"]],
    ["/pala-animation", [new Date("2024-12-21 16:15").getTime(), "Ajout de 174 nouvelles questions"]],
  ]);

const menuPaths: Map<string, PathValid[]> = new Map<string, PathValid[]>([
  ['Utilisateur', ["/profil", "/xp-calculator", "/clicker-optimizer"]],
  ['Classement', ["/ranking?category=money", "/ranking?category=job.miner", "/ranking?category=boss", "/ranking?category=egghunt", "/ranking?category=koth", "/ranking?category=clicker"]],
  ['Statistiques', ["/ah", "/admin-shop"]],
  ['Autres', ["/status", "/palatime", "/pala-animation", "/patchnote", "/craft", "/politique-de-confidentialite"]],
]);


const deprecatedIdAchivement =[
  "ariane.end",
  "core.command.achievement",
  "core.command.home",
  "core.command.tellrawdaad",
  "palamod.visitservers.allservers.7",
  "palamod.visitservers.allservers.8",
  "palamod.visitservers.allservers.9",
  "core.command.default",
  "core.command.defaultAA"
]

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
  ["3:palamod:tile.withered_obsidian:0#", "air"],
  ["1:palamod:item.broadsword.paladium:0#{modifiersmax:4,upgradearray:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],modifiersammount:0}", "broadsword-paladium"],
  ["1:palamod:egg:6#", "egg"],
  ["1:minecraft:enchanted_book:0#", "enchantedBook"],
  ["1:factions:tile.townmarket:0#", "air"],
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
  ["1:palamod:item.endium.sword:0#", "air"],
  ["1:palamod:item.paladium.sword:0#", "paladium-sword"],
  ["1:palamod:item.titane.sword:0#", "titane-sword"],
  ["1:palamod:item.amethyst.sword:0#", "amethyst-sword"],
  ["1:minecraft:iron_pickaxe:0#", "pickaxeIron"],
  ["1:minecraft:wooden_pickaxe:0#", "pickaxeWood"],
  ["1:minecraft:diamond_pickaxe:0#", "pickaxeDiamond"],
  ["1:minecraft:golden_pickaxe:0#", "air"],
  ["1:minecraft:potion:0#", "glassBottle"],
  ["1:minecraft:potion:8268#", "glassBottle"],
  ["1:minecraft:potion:8193#", "glassBottle"],
  ["1:minecraft:potion:8261#", "glassBottle"],
  ["1:minecraft:potion:8238#", "glassBottle"],
  ["1:minecraft:wooden_hoe:0#", "air"],
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
  ["1:palamod:endium_portal_key:0#", "air"],
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
  ["1:palajobs:item.endium_radius_hoe:0#", "air"],
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
  ["1:palamod:item.agro_stone:0#", "air"],
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
  ["1:customnpcs:npcCrown:0#", "air"],
  ["1:alliancemod:item.potion_neutral:0#", "air"],
  ["1:palamod:item.paladium.green.sword:0#", "paladium-green-sword"],
  ["1:palamod:tile.effect_tnt:0#", "air"],
  ["1:palamod:tile.endium_tnt:0#", "air"],
  ["1:palamod:tile.big_tnt:0#", "tile-big-tnt"],
  ["1:alliancemod:item.nexus_shard_order:0#", "air"],
  ["1:alliancemod:item.nexus_shard_order:0#", "air"],
  ["1:alliancemod:item.magic_glue:0#", "glue"],
  ["1:alliancemod:tile.protection_block:0#", "tile-protection-block"],
  // OTHERS
  ["1:palamod:item.endium.helmet:0#","air"],
  ["1:palamod:item.spawner_finder:0#", "spawner-finder"],
  ["1:palamod:item.glue:0#","glue"],
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


const constants = {
  defaultUsername,
  version,
  discord,
  metier_xp,
  metier_palier,
  how_to_xp,
  links,
  calculatorXpPath,
  profilPath,
  ahPath,
  palatimePath,
  optimizerClickerPath,
  palaAnimationPath,
  craftPath,
  moneyRanking,
  metiersRanking,
  bossRanking,
  eggHuntRanking,
  kothRanking,
  clickerRanking,
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
};

export default constants;



