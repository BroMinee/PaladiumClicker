'use server';

import { CraftingRecipeKey, CraftingRecipeType, NodeType, OptionType } from "@/types";
import React from "react";
import { getCraft } from "@/lib/api/apiPalaTracker.ts";


class Tree<T> {
  value: T;
  children: Tree<T>[];

  constructor(value: T) {
    this.value = value;
    this.children = [];
  }

  addChildren(children: Tree<T>) {
    this.children.push(children);
  }

  getValue(): T {
    return this.value;
  }

  getAllLeaves(): Tree<T>[] {
    if (this.children.length === 0)
      return [this];
    return this.children.flatMap((child) => child.getAllLeaves());
  }
}

function createTreeNode(item: OptionType, count: number): Tree<NodeType> {
  return new Tree<NodeType>(createNodeType(item, count));
}

function createNodeType(item: OptionType, count: number): NodeType {
  return { ...item, count };
}



export default async function CraftingInformationFetcher({ item, options, count, children }: {
  item: OptionType,
  options: OptionType[],
  count: number,
  children: React.ReactNode
}) {



  const alreadyVisitedValue = new Set<string>();
  const valueToRes = new Map<string, CraftingRecipeType>();

  let root = await BuildTreeRecursively(createNodeType(item, count), options, valueToRes);
  let leaves = root.getAllLeaves();


  // group the same leafs together and sum their count
  const groupedLeaves = leaves.reduce((acc, leaf) => {
    const value = leaf.getValue();
    if (alreadyVisitedValue.has(value.value)) {
      return acc;
    }
    alreadyVisitedValue.add(value.value);
    const count = leaves.filter((el) => el.getValue().value === value.value).reduce((acc, el) => acc + el.getValue().count, 0);
    return [...acc, createTreeNode(value, count)];
  }, [] as Tree<NodeType>[]);
  console.log(groupedLeaves);
  return (
    <>
      {children}
    </>
  );
}


export async function BuildTreeRecursively(el: NodeType, options: OptionType[], valueToRes: Map<string, CraftingRecipeType>, depth = 0): Promise<Tree<NodeType>> {

  // console.log(`Building tree for ${el.value}`)
  const root = createTreeNode(el, 1);

  if (depth > 10) {
    console.error(`Max depth reached ${el.value}`);
    throw new Error(`Max depth reached ${el.value}`);
  }


  let craft_recipe = valueToRes.get(el.value) || await getCraft(el.value);
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

  for (const child of children) {
    root.addChildren(await BuildTreeRecursively(createNodeType(child, 1), options, valueToRes, depth + 1));
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