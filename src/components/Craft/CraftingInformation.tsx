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

    // group the same leafs together and sum their count
    const groupedLeaves = leaves.reduce((acc, leaf) => {
      const value = getValueTree(leaf);
      if (alreadyVisitedValue.has(value.value)) {
        return acc;
      }
      alreadyVisitedValue.add(value.value);
      const count = leaves.filter((el) => getValueTree(el).value === value.value).reduce((acc, el) => acc + getValueTree(el).count, 0);
      return [...acc, createTreeNode(value, count)];
    }, [] as Tree<NodeType>[]);


    setLeavesList(groupedLeaves.map((el) => { return getValueTree<NodeType>(el) }));


  }, [tree]);


  return <>
    <MyTreeView/>
    <CraftResourceList list={leavesList}/>
  </>

}