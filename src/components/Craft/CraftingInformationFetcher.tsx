'use server';

import { CraftingRecipeKey, CraftingRecipeType, NodeType, OptionType, Tree } from "@/types";
import React, { Suspense } from "react";
import { getCraft } from "@/lib/api/apiPalaTracker.ts";
import { CraftingInformationClient } from "@/components/Craft/CraftingInformation.tsx";
import { addChildrenToTree, createNodeType, createTreeNode, getInternalNode } from "@/lib/misc.ts";
import { CraftItemRecipe } from "@/components/Craft/CraftItemRecipe.tsx";
import { CraftRecipeFallback } from "@/app/craft/page.tsx";
import { Card, CardHeader, CardTitle } from "@/components/ui/card.tsx";


export default async function CraftingInformationFetcher({ item, options, count }: {
  item: OptionType,
  options: OptionType[],
  count: number,
}) {

  const root = await BuildTreeRecursively(createNodeType(item, count), options, new Map<string, CraftingRecipeType>());

  const internalNodeName = getInternalNode(root).map((el) => { return el.value });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Aide à la fabrication
          </CardTitle>
        </CardHeader>
        <Suspense fallback={<CraftRecipeFallback item={item}/>}>
          {internalNodeName.map((el, index) => {
            return <CraftItemRecipe key={el.value + index + "-craft"} item={el} options={options}/>
          })}
        </Suspense>
      </Card>
      <CraftingInformationClient
        root={root}>
      </CraftingInformationClient>
    </>
  );
}


export async function BuildTreeRecursively(el: NodeType, options: OptionType[], valueToRes: Map<string, CraftingRecipeType>, depth = 0): Promise<Tree<NodeType>> {

  const root = createTreeNode(el, el.count);

  if (depth > 10) {
    throw new Error(`Max depth reached ${el.value}`);
  }


  let craft_recipe = valueToRes.get(el.value) || await getCraft(el.value);
  let countChildrenResource = Math.ceil(el.count / craft_recipe.count);

  valueToRes.set(el.value, craft_recipe);

  // if(testIfLoopingTree(father, craft_recipe))
  //   throw new Error(`Looping tree for ${el.value}`)


  const slotAvailable: CraftingRecipeKey[] = ['item_name_slot1', 'item_name_slot2', 'item_name_slot3', 'item_name_slot4', 'item_name_slot5', 'item_name_slot6', 'item_name_slot7', 'item_name_slot8', 'item_name_slot9'] as const;
  const childrenOrNull = slotAvailable.map((slot) => {
    if (craft_recipe[slot] === 'air')
      return null;
    const t = options.find((option) => option.value === craft_recipe[slot]);
    if (t === undefined)
      return null;
    return t;
  });
  const children = childrenOrNull.filter((el) => el !== null) as OptionType[];

  const uniqueChildrenMap = new Map<OptionType, number>();
  children.forEach((child) => {
    if (!uniqueChildrenMap.has(child))
      uniqueChildrenMap.set(child, 1);
    else
      uniqueChildrenMap.set(child, uniqueChildrenMap.get(child)! + 1);
  });

  for (const child of uniqueChildrenMap) {
    const childNode = await BuildTreeRecursively(createNodeType(child[0], child[1] * countChildrenResource), options, valueToRes, depth + 1);
    addChildrenToTree(root, childNode);
  }
  return root;
}

// NOTE: this function is not 100% completed and normally this should not be used since the DB is always correct (if not the build failed)
// function testIfLoopingTree(father: Tree<NodeType> | null, el: CraftingRecipeType) {
//   if (father === null)
//     return false;
//
//   const e = [el.item_name_slot1, el.item_name_slot2, el.item_name_slot3, el.item_name_slot4, el.item_name_slot5, el.item_name_slot6, el.item_name_slot7, el.item_name_slot8, el.item_name_slot9].filter((el) => el !== 'air')
//
//   if (e.length !== 1)
//     return false;
//
//   const [onlyChild] = e;
//
//   return father.value.value === onlyChild;
// }