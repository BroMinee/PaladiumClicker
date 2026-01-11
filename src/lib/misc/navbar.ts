
import { constants, PathValid } from "@/lib/constants";
import { CraftSectionEnum, OptionType, PlayerInfo, ProfilSection } from "@/types";
import { redirect } from "next/navigation";

/**
 * Generates a URL for the XP calculator with optional parameters.
 * @param username The username of the player.
 * @param metier The profession/metier of the player.
 * @param level The level of the player.
 * @param double Whether to apply double XP.
 * @param dailyBonus Daily bonus amount.
 * @param f2 Optional flag 2.
 * @param f3 Optional flag 3.
 */
export function generateXpCalculatorUrl(username: string, metier: string | undefined, level: number | undefined, double: boolean | undefined, dailyBonus: number | undefined, f2: boolean | undefined, f3: boolean | undefined) {
  if (f3 !== undefined && f2 !== undefined) {
    f2 = undefined;
  }
  const argMetier = metier ? `metier=${metier}` : "";
  const argLevel = level ? `level=${level}` : "";
  const argDouble = double ? `double=${double}` : "";
  const argDailyBonus = dailyBonus ? `dailyBonus=${dailyBonus}` : "";
  const argF2 = f2 ? `f2=${f2}` : "";
  const argF3 = f3 ? `f3=${f3}` : "";
  const args = [argMetier, argLevel, argDouble, argDailyBonus, argF2, argF3].filter((e) => e).join("&");
  return safeJoinPaths(constants.calculatorXpPath, username, `?${args}`);
}

/**
 * Generates a URL for the AH (Auction House) shop page.
 * @param item The item to generate the URL for.
 */
export function generateAhShopUrl(item: OptionType | undefined) {
  const argItem = item ? `item=${item.value}` : "";
  const args = [argItem].filter((e) => e).join("&");
  return safeJoinPaths(constants.ahPath, `?${args}`);
}

/**
 * Generates a URL for the Craft section with optional item, count, and section type.
 * @param item The item to craft.
 * @param count The quantity to craft.
 * @param section The craft section type.
 */
export function generateCraftUrl(item: string | null, count: number | null, section: CraftSectionEnum) {
  switch(section) {
  case  CraftSectionEnum.recipe:
  {
    const argItem = item ? `item=${item}` : "";
    const argCount = count ? `count=${count}` : "";
    const args = [argItem, argCount].filter((e) => e).join("&");
    return safeJoinPaths(constants.craftingCalculatorPath, `?${args}`);
  }
  case CraftSectionEnum.optimizer:
    return safeJoinPaths(constants.craftingOptimizerPath);
  default:
    return redirect("/error?message=Section inconnu");
  }

}

/**
 * Safely joins multiple path segments into a single URL/path string.
 * @param base The base path.
 * @param paths Additional path segments to append.
 */
export function safeJoinPaths(base: string, ...paths: string[]): string {
  const allPaths = ["/" + base, ...paths];
  const result = allPaths.join("/");
  return result.replace(/\/+/g, "/");
}

/**
 * Retrieves a valid link key from a given URL if it exists.
 * @param url The URL to analyze.
 */
export function getLinkFromUrl(url: string):
  PathValid | undefined {
  const urlArray = url.split("/");
  let trouvaille: PathValid | undefined = undefined;
  while (urlArray.length > 0 && urlArray[urlArray.length - 1] !== "") {
    trouvaille = Object.keys(constants.links).find((key) => {
      return key.includes(urlArray[urlArray.length - 1]);
    }) as PathValid | undefined;
    if (trouvaille !== undefined) {
      break;
    } else {
      urlArray.pop();
    }
  }
  return trouvaille;
}

/**
 * Determines whether a profile reload is needed based on player info, username, and default profile.
 * @param playerInfoLocal The current player info.
 * @param username The username to check.
 * @param defaultProfile Whether the profile is the default profile.
 */
export function reloadProfilNeeded(playerInfoLocal: PlayerInfo | null, username: string, defaultProfile: boolean) {
  if (defaultProfile) {
    return false;
  }

  if (username === constants.defaultUsername) {
    return false;
  }

  if (playerInfoLocal === null) {
    return true;
  }

  if (playerInfoLocal.username.toLowerCase() !== username.toLowerCase()) {
    return true;
  }

  if (playerInfoLocal.version === undefined || playerInfoLocal.version !== constants.version) {
    return true;
  }

  return false;
}

/**
 * Generates a URL for a player profile with optional ranking and usernames.
 * @param username The username of the player.
 * @param section Optional default section.
 */
export function generateProfilUrl(username: string, section?: ProfilSection) {
  const argSection = section ? `section=${section}` : "";
  const args = [argSection].filter((e) => e).join("&");
  return safeJoinPaths(constants.profilPath, username, `?${args}`);
}
