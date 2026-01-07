
import { constants } from "@/lib/constants";
import { RankingType } from "@/types";
import { safeJoinPaths } from "./navbar";

/**
 * Returns the path to the image corresponding to a given ranking type.
 * @param rankingType The type of ranking.
 */
export function getImagePathFromRankingType(rankingType: string): string {
  let imgPath: string;
  switch (rankingType) {
  case RankingType.money:
    imgPath = safeJoinPaths(constants.imgPathRanking, "money.png");
    break;
  case RankingType["job.alchemist"]:
    imgPath = safeJoinPaths(constants.imgPathRanking, "alchimiste.png");
    break;
  case RankingType["job.farmer"]:
    imgPath = safeJoinPaths(constants.imgPathRanking, "farmeur.png");
    break;
  case RankingType["job.hunter"]:
    imgPath = safeJoinPaths(constants.imgPathRanking, "hunter.png");
    break;
  case RankingType["job.miner"]:
    imgPath = safeJoinPaths(constants.imgPathRanking, "mineur.png");
    break;
  case RankingType.boss:
    imgPath = safeJoinPaths(constants.imgPathRanking, "boss.png");
    break;
  case RankingType.egghunt:
    imgPath = safeJoinPaths(constants.imgPathRanking, "egghunt.png");
    break;
    // case RankingType.end:
    //   imgPath = safeJoinPaths(constants.imgPathRanking, `end.png`);
    //   break;
    // case RankingType.chorus:
    //   imgPath = safeJoinPaths(constants.imgPathRanking, `chorus.png`);
    //   break;
  case RankingType.koth:
    imgPath = safeJoinPaths(constants.imgPathRanking, "koth.png");
    break;
  case RankingType.clicker:
    imgPath = safeJoinPaths(constants.imgPathRanking, "clicker.png");
    break;
  // case RankingType.alliance:
  //   imgPath = safeJoinPaths(constants.imgPathRanking, "alliance.png");
  //   break;
  case RankingType.vote:
    imgPath = safeJoinPaths(constants.imgPathRanking, "vote.png");
    break;
  default:
    imgPath = safeJoinPaths("/unknown.png");
    break;
  }
  return imgPath;
}

/**
 * Converts a RankingType to a human-readable text.
 * @param rankingType The type of ranking.
 */
export function rankingTypeToUserFriendlyText(rankingType: RankingType): string {
  switch (rankingType) {
  case RankingType.money:
    return "Money";
  case RankingType["job.alchemist"]:
    return "Métier Alchimiste";
  case RankingType["job.farmer"]:
    return "Métier Fermier";
  case RankingType["job.hunter"]:
    return "Métier Chasseur";
  case RankingType["job.miner"]:
    return "Métier Mineur";
  case RankingType.boss:
    return "Boss";
  case RankingType.egghunt:
    return "EggHunt";
    // case RankingType.end:
    //   return "End";
    // case RankingType.chorus:
    //   return "Chorus";
  case RankingType.koth:
    return "KOTH";
  case RankingType.clicker:
    return "Clicker";
  // case RankingType.alliance:
  //   return "Alignement";
  case RankingType.vote:
    return "Vote";
  default:
    return "Inconnu";
  }
}
