import {ComputePrice} from "./pages/OptimizerClicker/Components/Building/BuildingList";

function checkIfKeyExists(obj, key) {
    return obj.hasOwnProperty(key);
}

export function getTotalSpend(playerInfo) {
    let total = 0;
    const validKey = ["building", "building_upgrade", "category_upgrade", "global_upgrade", "many_upgrade", "terrain_upgrade", "posterior_upgrade", "CPS", "metier"];
    for (const key in playerInfo) {
        if (validKey.includes(key)) {
            playerInfo[key].forEach(e => {
                if (checkIfKeyExists(e, "price") && (e["own"] === true || e["own"] >= 1)) {
                    if (key === "building") {
                        for (let i = 0; i < e["own"]; i++)
                            total += ComputePrice(e["price"], i);
                    } else
                        total += e["price"];
                }
            });
        }
    }
    return total
}

function getTotalProduction(playerInfo) {
    return playerInfo["production"];
}

function getCoinsCondition(conditions) {
    if (conditions === undefined)
        return 0;
    const r = conditions.find(c => checkIfKeyExists(c, "coins"));
    return r ? r["coins"] : -1;
}

function getBuildingIndexCondition(conditions) {
    if (conditions === undefined)
        return 0;
    const r = conditions.find(c => checkIfKeyExists(c, "index"));
    return r ? r["index"] : -1;
}

function getBuildingCountCondition(conditions) {
    if (conditions === undefined)
        return 0;
    const r = conditions.find(c => checkIfKeyExists(c, "own"));
    return r ? r["own"] : -1;
}

function getDayCondition(conditions) {
    if (conditions === undefined)
        return 0;
    const r = conditions.find(c => checkIfKeyExists(c, "day"));
    return r ? r["day"] : -1;
}


// unlockable, coins, totalCoins, day, daySinceStart, buildingIndex, buildingNeed, buildingCount
export function checkCondition(playerInfo, conditions) {
    const coinsCondition = getCoinsCondition(conditions);
    const dayCondition = getDayCondition(conditions);
    const totalCoins = getTotalProduction(playerInfo);
    const buildingIndex = getBuildingIndexCondition(conditions);
    const buildingNeed = getBuildingCountCondition(conditions);
    const daySinceStart = (new Date().getTime() - new Date("2024-02-18").getTime()) / (1000 * 60 * 60 * 24);
    const buildingCount = buildingIndex === -1 ? -1 : playerInfo["building"][buildingIndex]["own"];

    const unlockable = totalCoins >= coinsCondition && daySinceStart >= dayCondition && (buildingIndex === -1 ? true : playerInfo["building"][buildingIndex]["own"] >= buildingNeed); // TODO change day

    return [unlockable, coinsCondition, totalCoins, dayCondition, daySinceStart, buildingIndex, buildingNeed, buildingCount];
}

export function printPricePretty(price) {
    if (price === undefined)
        return "-1";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function getPathImg(bestListName, bestUpgradeIndex) {
    switch (bestListName) {
        case "building":
            return process.env.PUBLIC_URL + "/BuildingIcon/" + bestUpgradeIndex + ".png";
        case "building_upgrade":
            return process.env.PUBLIC_URL + "/BuildingUpgradeIcon/" + (bestUpgradeIndex < 16 ? "0" : "1") + ".png";
        case "category_upgrade":
            return process.env.PUBLIC_URL + "/CategoryIcon/" + bestUpgradeIndex + ".png";
        case "global_upgrade":
            return process.env.PUBLIC_URL + "/GlobalIcon/" + bestUpgradeIndex + ".png";
        case "many_upgrade":
            return process.env.PUBLIC_URL + "/ManyIcon/0.png";
        case "terrain_upgrade":
            return process.env.PUBLIC_URL + "/TerrainIcon/" + bestUpgradeIndex + ".png";
        case "posterior_upgrade":
            return process.env.PUBLIC_URL + "/PosteriorIcon/0.png";
        default:
            alert("Error in bestListName");
            return process.env.PUBLIC_URL + "/BuildingUpgradeIcon/0.png";

    }
}