function checkIfKeyExists(obj, key)
{
    return obj.hasOwnProperty(key);
}

function getAllCostSpend(playerInfo)
{
    // playerInfo is an object
    let total = 0;
    for(const key in playerInfo)
    {
        playerInfo[key].forEach(e => {
            if(checkIfKeyExists(e, "price") && (e["own"] === true || e["own"] >= 1)) {
                total += e["price"];
            }
        });
    }
    return total;
}

function getCoinsCondition(conditions)
{
    if(conditions === undefined)
        return 0;
    const r = conditions.find(c => checkIfKeyExists(c, "coins"));
    return r ? r["coins"] : -1;
}

function getBuildingIndexCondition(conditions)
{
    if(conditions === undefined)
        return 0;
    const r = conditions.find(c => checkIfKeyExists(c, "index"));
    return r ? r["index"] : -1;
}

function getBuildingCountCondition(conditions)
{
    if(conditions === undefined)
        return 0;
    const r = conditions.find(c => checkIfKeyExists(c, "own"));
    return r ? r["own"] : -1;
}

function getDayCondition(conditions)
{
    if(conditions === undefined)
        return 0;
    const r = conditions.find(c => checkIfKeyExists(c, "day"));
    return r ? r["day"] : -1;
}


// unlockable, coins, totalCoins, day, daySinceStart, buildingIndex, buildingNeed, buildingCount
export function checkCondition(playerInfo, conditions)
{
    const coinsCondition = getCoinsCondition(conditions);
    const dayCondition = getDayCondition(conditions);
    const totalCoins = getAllCostSpend(playerInfo);
    const buildingIndex= getBuildingIndexCondition(conditions);
    const buildingNeed = getBuildingCountCondition(conditions);
    const daySinceStart = 50;
    const buildingCount = buildingIndex === -1 ? -1 : playerInfo["building"][buildingIndex]["own"];

    const unlockable = totalCoins >= coinsCondition && daySinceStart >= dayCondition && (buildingIndex === -1 ? true : playerInfo["building"][buildingIndex]["own"] >= buildingNeed); // TODO change day

    return [unlockable, coinsCondition, totalCoins, dayCondition, daySinceStart,  buildingIndex, buildingNeed, buildingCount];
}
export function printPricePretty(price) {
    if(price === undefined)
        return "-1";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
