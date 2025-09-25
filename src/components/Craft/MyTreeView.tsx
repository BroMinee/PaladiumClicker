'use client';
import React, { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { FaCheckSquare, FaChevronDown, FaChevronRight, FaSquare } from 'react-icons/fa';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { NodeType, Tree } from "@/types";
import { getValueTree } from "@/lib/misc.ts";

import '@/styles/MyTreeView.css';
import GradientText from "@/components/shared/GradientText.tsx";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";

type MyTreeNode = {
  value: string;
  label: React.JSX.Element;
  children?: MyTreeNode[];
}

type MyTreeViewProps = {
  root: Tree<NodeType>;
  setRoot: (root: Tree<NodeType>) => void;
}

const MyTreeView = ({ root, setRoot }: MyTreeViewProps) => {

  const [node, setNode] = useState<MyTreeNode | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {

    function updateNodeCheck(node: MyTreeNode, original: Tree<NodeType>) {
      original.value.checked = checked.includes(node.value);
      node.children?.map((el, index) => updateNodeCheck(el, original.children[index]));
    }

    if (node) {
      updateNodeCheck(node, root);
    }
    setRoot({ ...root });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- root is modified in setRoot
  }, [checked, setRoot]);


  useEffect(() => {
    if (node) {
      const allNodeValues = getAllValues(node).filter((el) => !checked.includes(el));
      setExpanded(allNodeValues);
    }
  }, [node, checked]);

  useEffect(() => {
    const newNode = createNode(root);
    if(root && isSameTree(newNode, root))
      return;
    setNode(newNode);
  }, [root]);

  // {
  //   value: 'node1',
  //   label:
  //     <div className="inline-flex gap-2 justify-center items-center">
  //       <Image src="/AH_img/paladium_ingot.png" alt="Node 1" width={32} height={32} className="pixelated"/>
  //       <div>Node 1</div>
  //     </div>,
  //   children: [
  //     {
  //       value: 'child1',
  //       label: <div className="inline-flex gap-2 justify-center items-center">
  //         <Image src="/AH_img/titane_ingot.png" alt="Children 1" width={32} height={32} className="pixelated"/>
  //         <div>Child 1</div>
  //       </div>,
  //     },
  //     {
  //       value: 'child2',
  //       label: <div className="inline-flex gap-2 justify-center items-center">
  //         <Image src="/AH_img/amethyst_ingot.png" alt="Children 2" width={32} height={32} className="pixelated"/>
  //         <div>Child 2</div>
  //       </div>,
  //     },
  //   ],
  // },
  // {
  //   value: 'node2',
  //   label: <div className="inline-flex gap-2 justify-center items-center">
  //     <Image src="/AH_img/paladium_ingot.png" alt="Children 2" width={32} height={32} className="pixelated"/>
  //     <div>Node 2</div>
  //   </div>,
  // },


  return (
    <Card className="row-start-3">
      {/*flex-grow TODO*/}
      <CardHeader>
        <CardTitle>Arbre de craft</CardTitle>
        <CardDescription className="text-primary font-semibold">Coche les ressources que tu possèdes déjà pour mettre à
          jour les ressources en temps réel.</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {node === null && <MyTreeWaiting/>}
        {node !== null && <CheckboxTree
          nodes={[node]}
          checked={checked}
          expanded={expanded}
          onCheck={(checked) => {
            setChecked(checked)
          }}
          onExpand={(expanded) => setExpanded(expanded)}
          icons={{
            check: <FaCheckSquare/>,
            uncheck: <FaSquare/>,
            halfCheck: <FaSquare/>,
            expandClose: <FaChevronRight/>,
            expandOpen: <FaChevronDown/>,
            parentClose: null,
            parentOpen: null,
            leaf: null,
          }}
        />}
      </CardContent>
    </Card>
  );
};

export function createNode(root: Tree<NodeType>, depth = 0, childSuffix = ""): MyTreeNode {
  if (root.children.length === 0) {
    return {
      value: root.value.value + "-" + depth + "-" + childSuffix,
      label: displayNode(getValueTree(root)),
    }
  }

  return {
    value: root.value.value + "-" + depth + "-" + childSuffix,
    label: displayNode(getValueTree(root)),
    children: root.children.map((el, index) => createNode(el, depth + 1, childSuffix + "-" + index)),
  };
}

export function isSameTree(node1: MyTreeNode, node2: Tree<NodeType>): boolean {
  if (node1.value !== node2.value.value) return false;
  if (node1.children === undefined && node2.children.length === 0) return true;
  if (node1.children === undefined && node2.children.length !== 0) return false;
  if (node1.children !== undefined && node2.children.length === 0) return false;
  if (node1.children !== undefined && node2.children.length !== 0) {
    if (node1.children.length !== node2.children.length) return false;
    for (let i = 0; i < node1.children.length; i++) {
      if (!isSameTree(node1.children[i], node2.children[i])) return false;
    }
  }
  return true;

}

export function displayNode(node: NodeType) {
  return <div className="inline-flex gap-2 justify-center items-center m-2">
    <Image src={`/AH_img/${node.img}`} alt="Node 1" width={40} height={40} className="pixelated" unoptimized/>
    <span className="text-xl">{node.count}x {node.label}</span>
  </div>;
}

function getAllValues(node: MyTreeNode) {
  let values = [node.value];
  if (node.children) {
    for (let child of node.children) {
      values = [...values, ...getAllValues(child)];
    }
  }
  return values;
}

function MyTreeWaiting() {
  return (
    <div className="flex flex-row gap-2">
      <LoadingSpinner size={4}/>
      <GradientText
        className="font-extrabold">Calcul des ressources nécessaire en cours...
      </GradientText>
    </div>
  )
}

export default MyTreeView;
