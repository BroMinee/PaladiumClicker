import { CraftingRecipeKey, CraftingRecipeType, NodeType, OptionType, Tree } from "@/types";
import { addChildrenToTree, createNodeType, createTreeNode } from "@/lib/misc";
import { redirect } from "next/navigation";
import { getCraft } from "@/lib/api/apiPalaTracker";

/**
 * Builds a crafting tree structure recursively for a given item node.
 * Fetches or retrieves from cache the recipe of the item, determines required child nodes,
 * and constructs a tree representing all necessary crafting components.
 *
 * Recursion stops and redirects to an error page if:
 * - The tree exceeds a depth of 10 (too complex to render probably due to infinite recursion in the crafting recipe)
 * - A recipe or item reference is missing from the database
 *
 * @param el - The current item node being processed (with value and count).
 * @param options - The list of all available items/options used to resolve child nodes.
 * @param valueToRes - A cache storing already-fetched crafting recipes to avoid redundant calls.
 * @param depth - Current recursion depth, used to prevent infinite or excessively deep trees.
 *
 * @returns A Promise resolving to the root of the constructed crafting tree for the given node.
 */
export async function buildTreeRecursively(el: NodeType, options: OptionType[], valueToRes: Map<string, CraftingRecipeType>, depth: number): Promise<Tree<NodeType>> {

  const root = createTreeNode(el, el.count);
  await new Promise(resolve => setTimeout(resolve, 250));

  if (depth > 10) {
    redirect("/error?message=Il semblerait que le craft soit trop complexe pour être affiché. Contactez un administrateur pour plus d'informations.");
  }

  const craft_recipe = valueToRes.get(el.value) || await getCraft(el.value);
  const countChildrenResource = Math.ceil(el.count / craft_recipe.count);

  valueToRes.set(el.value, craft_recipe);

  const slotAvailable: CraftingRecipeKey[] = ["slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8", "slot9"] as const;
  const childrenOrNull = slotAvailable.map((slot) => {
    const itemAtSlot = craft_recipe[slot];
    if (!itemAtSlot) {
      return redirect(`/error?message=Le craft de ${el.value} n'existe pas dans la base de donnée. Il sera ajouté prochainement.`);
    }
    if (itemAtSlot.item_name === "air") {
      return null;
    }
    const t = options.find((option) => option.value === itemAtSlot.item_name);
    if (t === undefined) {
      redirect(`/error?message=Le craft de ${el.value} n'existe pas dans la base de donnée. Il sera ajouté prochainement.`);
    }
    return t;
  });
  const children = childrenOrNull.filter((el) => el !== null) as OptionType[];

  const uniqueChildrenMap = new Map<OptionType, number>();
  children.forEach((child) => {
    if (!uniqueChildrenMap.has(child)) {
      uniqueChildrenMap.set(child, 1);
    } else {
      uniqueChildrenMap.set(child, uniqueChildrenMap.get(child)! + 1);
    }
  });

  for (const child of uniqueChildrenMap) {
    const childNode = await buildTreeRecursively(createNodeType(child[0], child[1] * countChildrenResource), options, valueToRes, depth + 1);
    addChildrenToTree(root, childNode);
  }
  return root;
}
