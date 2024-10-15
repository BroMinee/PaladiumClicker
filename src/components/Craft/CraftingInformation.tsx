'use client'
import { NodeType, Tree } from "@/types";
import React, { useEffect, useState } from "react";
import MyTreeView from "@/components/Craft/MyTreeView.tsx";
import { CraftResourceList } from "@/components/Craft/CraftResourceList.tsx";
import { createTreeNode, getAllLeaves, getValueTree } from "@/lib/misc.ts";

export function CraftingInformationClient({ root }: { root: Tree<NodeType> }) {

  const [tree, setTree] = useState<Tree<NodeType>>(root);
  const [leavesList, setLeavesList] = useState<NodeType[]>([]);

  useEffect(() => {
    setTree(root);
  }, [root]);


  useEffect(() => {

    const alreadyVisitedValue = new Set<string>();
    let leaves = getAllLeaves(tree);
    if (leaves.length === 1 && leaves[0].value.value === tree.value.value)
      leaves = [];

    // group the same leafs together and sum their count
    let groupedLeaves = leaves.reduce((acc, leaf) => {
      const value = getValueTree(leaf);
      if (alreadyVisitedValue.has(value.value)) {
        const findIndex = acc.findIndex((el) => el.value.value === value.value);
        if (!value.checked && findIndex !== -1)
          acc[findIndex].value.count += value.count;
        return acc;
      }
      alreadyVisitedValue.add(value.value);
      return [...acc, createTreeNode(value, value.checked ? 0 : value.count, value.checked)];
    }, [] as Tree<NodeType>[])

    const newLeaves = groupedLeaves.map((el) => { return getValueTree<NodeType>(el) }).filter((el) => el.count > 0);
    setLeavesList(newLeaves);


  }, [tree]);


  return <>
    <MyTreeView root={tree} setRoot={setTree}/>
    <CraftResourceList list={leavesList}/>
  </>

}