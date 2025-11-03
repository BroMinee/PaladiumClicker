
import constants, { PathValid } from "@/lib/constants.ts";
import { AdminShopItem, AdminShopPeriod, CraftSectionEnum, OptionType, PlayerInfo, ProfilSectionEnum, RankingType, StatusPeriod } from "@/types";
import { redirect } from "next/navigation";

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

export function generateRankingUrl(category: string | undefined, usernames?: string[] | undefined, noUsernames?: string[] | undefined) {
  const argCategory = category ? `category=${category}` : "";
  const argUsernames = usernames ? `usernames=${usernames}` : "";
  const argNoUsernames = noUsernames ? `noUsernames=${noUsernames}` : "";
  const args = [argCategory, argUsernames, argNoUsernames].filter((e) => e).join("&");
  return safeJoinPaths("/ranking", `?${args}`);
}

export function generateAhShopUrl(item: OptionType | undefined) {
  const argItem = item ? `item=${item.value}` : "";
  const args = [argItem].filter((e) => e).join("&");
  return safeJoinPaths(constants.ahPath, `?${args}`);
}

export function generateAdminShopUrl(item: AdminShopItem, periode?: AdminShopPeriod) {
  const argItem = item ? `item=${item}` : "";
  const argPeriode = periode ? `periode=${periode}` : "";
  const args = [argItem, argPeriode].filter((e) => e).join("&");
  return safeJoinPaths(constants.adminShopPath, `?${args}`);
}

export function generateStatusUrl(periode?: StatusPeriod) {
  const argPeriode = periode ? `periode=${periode}` : "";
  const args = [argPeriode].filter((e) => e).join("&");
  return safeJoinPaths(constants.statusPath, `?${args}`);
}

export function generateCraftUrl(item: string | null, count: number | null, section: CraftSectionEnum) {
  switch(section) {
  case  CraftSectionEnum.recipe:
  {
    const argItem = item ? `item=${item}` : "";
    const argCount = count ? `count=${count}` : "";
    const argSection = `section=${section}`;
    const args = [argItem, argCount, argSection].filter((e) => e).join("&");
    return safeJoinPaths(constants.craftPath, `?${args}`);
  }
  case CraftSectionEnum.optimizer:
    const argSection = `section=${section}`;
    const args = [argSection].filter((e) => e).join("&");
    return safeJoinPaths(constants.craftPath, `?${args}`);
  default:
    return redirect("/error?message=Section inconnu");
  }

}

export function safeJoinPaths(base: string, ...paths: string[]): string {
  const allPaths = ["/" + base, ...paths];
  const result = allPaths.join("/");
  return result.replace(/\/+/g, "/");
}

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

export const ProfilSectionValid = Object.values(ProfilSectionEnum) as string[];

export function isProfilSection(section?: string): boolean {
  if (section === undefined) {
    return true;
  }
  return ProfilSectionValid.includes(section);
}

export function generateProfilUrl(username: string, item: ProfilSectionEnum | string, ranking?: RankingType, usernames?: string[]) {
  if (!isProfilSection(item)) {
    throw new Error(`Invalid section given in generateProfilUrl ${item}`);
  }
  const argItem = item ? `section=${item}` : "";
  const argUsername = usernames && usernames.length != 0 ? `usernames=${usernames}` : "";
  const argRanking = ranking ? `category=${ranking}` : "";
  const args = [argItem, argRanking, argUsername].filter((e) => e).join("&");
  return safeJoinPaths(constants.profilPath, username, `?${args}`);
}

export function getHeadUrl(uuid: string | undefined) {
  if(!uuid || uuid === "") {
    return "/img/palatracker_head.png";
  } // palatracker skin
  return `https://crafatar.com/avatars/${uuid}?size=8&overlay`;
}