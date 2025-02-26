'use server';

import { CraftingRecipeKey, CraftingRecipeType, NodeType, OptionType, Tree } from "@/types";
import React from "react";
import { getCraft } from "@/lib/api/apiPalaTracker.ts";
import { CraftingInformationClient } from "@/components/Craft/CraftingInformation.tsx";
import { addChildrenToTree, createNodeType, createTreeNode, getInternalNode } from "@/lib/misc.ts";
import { CraftItemRecipe } from "@/components/Craft/CraftItemRecipe.tsx";
import { Card, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { redirect } from "next/navigation";


export default async function CraftingInformationFetcher({ item, options, count }: {
  item: OptionType,
  options: OptionType[],
  count: number,
}) {

  const root = await BuildTreeRecursively(createNodeType(item, count), options, new Map<string, CraftingRecipeType>(), 0, false);

  const internalNodeNameUnique = getInternalNode(root).map((el) => { return el.value }).reduce((acc, el) => {
    if (acc.findIndex((el2) => el2.value === el.value) === -1)
      return [...acc, el];
    return acc;
  }, [] as NodeType[]);

  return (
    <>
        <Card className="row-start-3">
          <CardHeader>
            <CardTitle>
              Aide à la fabrication
            </CardTitle>
          </CardHeader>

          {internalNodeNameUnique.map((el, index) => {
            return <CraftItemRecipe key={el.value + index + "-craft"} item={el} options={options}/>
          })}
        </Card>

      <CraftingInformationClient
        root={root}>
      </CraftingInformationClient>
    </>
  );
}


export async function BuildTreeRecursively(el: NodeType, options: OptionType[], valueToRes: Map<string, CraftingRecipeType>, depth: number, testCompilation: boolean): Promise<Tree<NodeType>> {

  const root = createTreeNode(el, el.count);

  if (depth > 10) {
    redirect("/error?message=Il semblerait que le craft soit trop complexe pour être affiché. Contactez un administrateur pour plus d'informations.")
  }


  let craft_recipe = valueToRes.get(el.value) || await getCraft(el.value);
  let countChildrenResource = Math.ceil(el.count / craft_recipe.count);

  valueToRes.set(el.value, craft_recipe);

  const slotAvailable: CraftingRecipeKey[] = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6', 'slot7', 'slot8', 'slot9'] as const;
  const childrenOrNull = slotAvailable.map((slot) => {
    const itemAtSlot = craft_recipe[slot];
    if (!itemAtSlot)
      return redirect(`/error?message=Le craft de ${el.value} n'existe pas dans la base de donnée. Il sera ajouté prochainement.`)
    if (itemAtSlot.item_name === 'air')
      return null;
    const t = options.find((option) => option.value === itemAtSlot.item_name);
    if (t === undefined) {
      if (testCompilation)
        return null;
      redirect(`/error?message=Le craft de ${el.value} n'existe pas dans la base de donnée. Il sera ajouté prochainement.`)
    }
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
    const childNode = await BuildTreeRecursively(createNodeType(child[0], child[1] * countChildrenResource), options, valueToRes, depth + 1, testCompilation);
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