"use client";

import { useCraftRecipeStore } from "@/stores/use-craft-store";
import { CraftSectionEnum, NodeType, Tree } from "@/types";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSearchParams, useRouter } from "next/navigation";
import { useItemsStore } from "@/stores/use-items-store";
import { useAllCraftsStore } from "@/stores/use-all-craft-store";
import { generateCraftUrl, levenshteinDistance } from "@/lib/misc";
import { getStaticAliases } from "@/lib/data/static-data";
import { buildCraftTree } from "@/lib/data/build-craft-tree";
import { CraftSuggestion } from "./craft-suggestion";

function calculateFlatResources(tree: Tree<NodeType> | undefined, checkedItems: Set<NodeType>) {
  const resourceMap = new Map<string, [NodeType, number]>();
  if (tree === undefined) {
    return resourceMap;
  }

  function traverse(node: Tree<NodeType>) {
    if (checkedItems.has(node.value)) {
      return;
    }

    if (node.children.length === 0) {
      const current = resourceMap.get(node.value.value) || [node.value, 0];
      resourceMap.set(node.value.value, [node.value, current[1] + node.value.count]);
    } else {
      node.children.forEach((child: any) => traverse(child));
    }
  }

  if (tree) {
    traverse(tree);
  }

  return resourceMap;
}

/**
 * Component that set the zustand craft recipe state using the searchParams
 * @param root - The root of the tree for the current craft (unused in static mode)
 * @param children - The page to display
 */
export function SetCraftingState({ children }: { root?: Tree<NodeType> | undefined, children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const quantityUrl = searchParams.get("count");
  const quantity = quantityUrl ? parseInt(quantityUrl, 10) : 1;

  const selectedItem = searchParams.get("item") ?? "";

  const { root, setRoot, setFlatResources, checkedItems, setQuantity } = useCraftRecipeStore();
  const { allItems, setSelectedItem, selectedItem: selectedItemStore, setCloseItems, closeItems } = useItemsStore();
  const { allCrafts } = useAllCraftsStore();

  useEffect(() => {
    if (selectedItem === "" && selectedItemStore) {
      router.replace(generateCraftUrl(selectedItemStore.value, 1, CraftSectionEnum.recipe));
      return;
    }
    if (!isNaN(quantity) && quantity > 0) {
      setQuantity(quantity);
    }
    const itemSelected = allItems.find(item => item.value === selectedItem) ?? undefined;
    if (itemSelected) {
      setSelectedItem(itemSelected);
      // Build craft tree client-side
      const tree = buildCraftTree(selectedItem, quantity, allCrafts, allItems);
      setRoot(tree);
    } else if (selectedItem !== "") {
      // Look up aliases from static data
      getStaticAliases().then((aliases) => {
        const aliasEntry = aliases.find(([alias]) => alias === selectedItem);
        if (aliasEntry) {
          router.replace(generateCraftUrl(aliasEntry[1], quantity, CraftSectionEnum.recipe));
        } else {
          const allItemsEvenAlias = [...allItems];
          aliases.forEach(([alias, realItemName]) => {
            const itemIndex = allItemsEvenAlias.findIndex((item) => item.value === realItemName);
            if (itemIndex !== -1) {
              allItemsEvenAlias.push({
                ...allItemsEvenAlias[itemIndex],
                value: alias,
              });
            }
          });
          const close = allItemsEvenAlias
            .map((item) => ({
              item,
              distance: levenshteinDistance(selectedItem.toLowerCase(), item.value.toLowerCase()),
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 10)
            .map(({ item }) => item);
          setCloseItems(close);
        }
      });
    }

  }, [quantity, setQuantity, allItems, allCrafts, selectedItem, setSelectedItem, selectedItemStore, setCloseItems, router, setRoot]);

  useEffect(() => {
    if (root !== undefined) {
      setFlatResources(calculateFlatResources(root, checkedItems));
    }
  }, [checkedItems, root, setFlatResources]);

  if (closeItems.length > 0) {
    return <CraftSuggestion userInput={selectedItem} />;
  }

  if (root === undefined && selectedItem !== "") {
    return <LoadingSpinner />;
  }
  return <>{children}</>;
}
