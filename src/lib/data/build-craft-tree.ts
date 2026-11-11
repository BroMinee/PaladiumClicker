import { CraftingRecipeType, NodeType, OptionType, Tree } from "@/types";

const SLOTS = ["slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8", "slot9"] as const;

/**
 * Builds a craft tree recursively from flat craft data.
 * Reproduces the server-side /v1/craft/get endpoint logic.
 */
export function buildCraftTree(
  itemName: string,
  count: number,
  allCrafts: CraftingRecipeType[],
  allItems: OptionType[],
  visited: Set<string> = new Set(),
): Tree<NodeType> | undefined {
  const craft = allCrafts.find(c => c.item.item_name === itemName);
  const item = allItems.find(i => i.value === itemName);

  if (!item) {
    return undefined;
  }

  const node: NodeType = {
    value: item.value,
    label: item.label,
    label2: item.label2,
    img: item.img,
    count,
    checked: false,
    table: craft?.table,
  };

  // If no craft recipe exists or we already visited (avoid infinite loops), return a leaf
  if (!craft || visited.has(itemName)) {
    return { value: node, children: [], recipe: [] };
  }

  visited.add(itemName);

  // Count how many of each ingredient we need
  const ingredientCounts = new Map<string, number>();
  for (const slot of SLOTS) {
    const slotItem = craft[slot];
    if (slotItem && slotItem.item_name !== "air") {
      ingredientCounts.set(slotItem.item_name, (ingredientCounts.get(slotItem.item_name) || 0) + 1);
    }
  }

  // The craft produces `craft.count` items per recipe. We need `count` total.
  const recipesNeeded = Math.ceil(count / craft.count);

  // Build children recursively
  const children: Tree<NodeType>[] = [];
  const recipe: NodeType[] = [];

  for (const [ingredientName, perRecipeCount] of ingredientCounts) {
    const totalNeeded = perRecipeCount * recipesNeeded;
    const ingredientItem = allItems.find(i => i.value === ingredientName);
    if (!ingredientItem) {
      continue;
    }

    const ingredientNode: NodeType = {
      value: ingredientItem.value,
      label: ingredientItem.label,
      label2: ingredientItem.label2,
      img: ingredientItem.img,
      count: totalNeeded,
      checked: false,
    };
    recipe.push(ingredientNode);

    const childTree = buildCraftTree(ingredientName, totalNeeded, allCrafts, allItems, new Set(visited));
    if (childTree) {
      children.push(childTree);
    } else {
      children.push({ value: ingredientNode, children: [], recipe: [] });
    }
  }

  visited.delete(itemName);

  return { value: node, children, recipe };
}
