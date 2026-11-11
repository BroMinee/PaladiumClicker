"use client";

import { useCraftRecipeStore } from "@/stores/use-craft-store";
import { CraftSectionEnum, NodeType, Tree } from "@/types";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { redirect, useSearchParams } from "next/navigation";
import { useItemsStore } from "@/stores/use-items-store";
import { generateCraftUrl, levenshteinDistance } from "@/lib/misc";
import { getItemAlias,getAllItemAliases } from "@/lib/api/api-server-action.server";
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
 * @param root - The root of the tree for the current craft
 * @param children - The page to display
 */
export function SetCraftingState({ root: rootServer, children }: { root: Tree<NodeType> | undefined, children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const quantityUrl = searchParams.get("count");
  const quantity = quantityUrl ? parseInt(quantityUrl, 10) : 1;

  const selectedItem = searchParams.get("item") ?? "";

  const { root, setRoot, setFlatResources, checkedItems, setQuantity } = useCraftRecipeStore();
  const { allItems, setSelectedItem, selectedItem: selectedItemStore, setCloseItems, closeItems } = useItemsStore();

  useEffect(() => {
    if(selectedItem === "" && selectedItemStore) {
      redirect(generateCraftUrl(selectedItemStore.value, 1, CraftSectionEnum.recipe));
    }
    if (!isNaN(quantity) && quantity > 0) {
      setQuantity(quantity);
    }
    const itemSelected = allItems.find(item => item.value === selectedItem) ?? undefined;
    if (itemSelected) {
      setSelectedItem(itemSelected);
    } else if(selectedItem !== "") {
      // TODO, this part is a huge mess, sorry for that
      getItemAlias(selectedItem).then((alias) => {
        if (alias !== null) {
          redirect(generateCraftUrl(alias, quantity, CraftSectionEnum.recipe));
        } else {
          const allItemsEvenAlias = [...allItems];
          getAllItemAliases().then((aliases) => {
            aliases.forEach(([alias, realItemName]) => {
              const itemIndex = allItemsEvenAlias.findIndex((item) => item.value === realItemName);
              if (itemIndex !== -1) {
                allItemsEvenAlias.push({
                  ...allItemsEvenAlias[itemIndex],
                  value: alias,
                });
              }
            });
            const closeItems = allItemsEvenAlias
              .map((item) => ({
                item,
                distance: levenshteinDistance(selectedItem.toLowerCase(), item.value.toLowerCase()),
              }))
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 10)
              .map(({ item }) => item);
            setCloseItems(closeItems);
          });
        }
      });
    }

  }, [quantity, setQuantity, allItems, selectedItem, setSelectedItem, selectedItemStore, setCloseItems]);

  useEffect(() => {
    setRoot(rootServer);
  }, [rootServer, setRoot]);

  useEffect(() => {
    if (root !== undefined) {
      setFlatResources(calculateFlatResources(root, checkedItems));
    }
  }, [rootServer, checkedItems, root, setFlatResources]);

  if (closeItems.length > 0) {
    return <CraftSuggestion userInput={selectedItem} />;
  }

  if (root === undefined && selectedItem !== "") {
    return <LoadingSpinner />;
  }
  return <>{children}</>;
}