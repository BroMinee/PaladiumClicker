// __tests__/crafting.test.ts


import { diff } from 'jest-diff';



import { describe, it } from "node:test";
import { getAllItems, getCraftRecipe } from "@/lib/api/apiPalaTracker.ts";
import { createNodeType } from "@/lib/misc.ts";
import { CraftingRecipeType, NodeType, Tree } from "@/types";
import { BuildTreeRecursively } from "@/components/Craft/CraftMisc.ts";
describe('Consistency check for all items', () => {
  it('should return the same result for getCraftRecipe and BuildTreeRecursively for each item', async () => {
    const bannedItem = new Set(["angelicwater",
      "magma-amulet",
      "bowspeedmodifier",
      "king-skull",
      "tile-poison-obsi",
      "toolpart-head-shovel",
      "tile-SecretLightDetector",
      "tile-SecretPlayerPlate",
      "tile-halfDrawers4-acacia",
      "tile-halfDrawers2-acacia",
      "tile-SecretStair",
      "tile-halfDrawers2-spruce"])
    const items = (await getAllItems());
    const allItems = items.filter(s => !bannedItem.has(s.value) )

    for (const item of allItems) {
      const count = Math.max(1, Math.floor((Math.random() *100)));
      const expectTree: Tree<NodeType> = await BuildTreeRecursively(
        createNodeType(item, count),
        items,
        new Map<string, CraftingRecipeType>(),
        0,
        false
      );
      const actualTree: Tree<NodeType> = await getCraftRecipe(item.value, count);
      expect(actualTree).toEqual(expectTree);
    }
  });
});
