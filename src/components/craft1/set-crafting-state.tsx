"use client";

import { useCraftRecipeStore } from "@/stores/use-craft-store";
import { CraftSectionEnum, NodeType, Tree } from "@/types";
import { useEffect } from "react";
import { LoadingSpinner } from "../ui/loading-spinner";
import { redirect, useSearchParams } from "next/navigation";
import { generateCraftUrl } from "@/lib/misc";
import { useItemsStore } from "@/stores/use-items-store";

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
  const { allItems, setSelectedItem } = useItemsStore();

  useEffect(() => {
    if (!isNaN(quantity) && quantity > 0) {
      setQuantity(quantity);
    }
    const itemSelected = allItems.find(item => item.value === selectedItem) ?? undefined;
    if (itemSelected) {
      setSelectedItem(itemSelected);
    } else if(selectedItem === "") {
      redirect(generateCraftUrl(null, 1, CraftSectionEnum.recipe));
    }

  }, [quantity, setQuantity, allItems, selectedItem, setSelectedItem]);

  useEffect(() => {
    setRoot(rootServer);
  }, [rootServer, setRoot]);

  useEffect(() => {
    if (root !== undefined) {
      setFlatResources(calculateFlatResources(root, checkedItems));
    }
  }, [rootServer, checkedItems, root, setFlatResources]);

  if (root === undefined && selectedItem !== "") {
    return <LoadingSpinner />;
  }
  return <>{children}</>;
}