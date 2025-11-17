"use client";

import { useCraftRecipeStore } from "@/stores/use-craft-store";
import { CraftSectionEnum, NodeType, OptionType, Tree } from "@/types";
import { useEffect } from "react";
import { LoadingSpinner } from "../ui/loading-spinner";
import { redirect, useSearchParams } from "next/navigation";
import { generateCraftUrl } from "@/lib/misc";

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
 * Component that set the zustand craft recipe state given the searchParams
 * @param allItems - All item available
 * @param root - The root of the tree for the current craft
 * @param children - The page to display
 */
export function CraftingSetLocal({ allItems: allItemsServer, root: rootServer, children }: { allItems: OptionType[], root: Tree<NodeType> | undefined, children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const quantityUrl = searchParams.get("count");
  const quantity = quantityUrl ? parseInt(quantityUrl, 10) : 1;

  const selectedItem = searchParams.get("item") ?? "";

  const { root, setAllItems, setRoot, setFlatResources, checkedItems, setQuantity, setSelectedItem } = useCraftRecipeStore();

  useEffect(() => {
    if (!isNaN(quantity) && quantity > 0) {
      setQuantity(quantity);
    }
    const itemSelected = allItemsServer.find(item => item.value === selectedItem) ?? null;
    if (itemSelected !== null || selectedItem === "") {
      setSelectedItem(itemSelected);
    } else if(selectedItem !== "") {
      redirect(generateCraftUrl(null, 1, CraftSectionEnum.recipe));
    }

  }, [quantity, setQuantity, allItemsServer, selectedItem, setSelectedItem]);

  useEffect(() => {
    setRoot(rootServer);
  }, [rootServer, setRoot]);

  useEffect(() => {
    if (root !== undefined) {
      setFlatResources(calculateFlatResources(root, checkedItems));
    }
  }, [rootServer, checkedItems, root, setFlatResources, setAllItems]);

  useEffect(() => {
    setAllItems(allItemsServer);
  }, [allItemsServer, setAllItems]);

  if (root === undefined && selectedItem !== "") {
    return <LoadingSpinner />;
  }
  return <>{children}</>;
}