"use client";
import React, { useEffect, useState } from "react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeItem, TreeItemProps } from "@mui/x-tree-view/TreeItem";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { NodeType, Tree } from "@/types";
import { getValueTree } from "@/lib/misc.ts";

import GradientText from "@/components/shared/GradientText.tsx";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";

type MyTreeNode = {
  id: string;
  label: string;
  nodeData: NodeType;
  parent?: MyTreeNode;
  children: MyTreeNode[];
}

type MyTreeViewProps = {
  root: Tree<NodeType>;
  setRoot: (root: Tree<NodeType>) => void;
}

const CustomTreeItem = React.forwardRef((props: TreeItemProps, ref: React.Ref<HTMLLIElement>) => {
  const { itemId, ...other } = props;

  return (
    <TreeItem
      {...other}
      ref={ref}
      itemId={itemId}
      slots={{
        label: CustomLabel,
      }}
      slotProps={{
        label: { itemId } as any,
      }}
    />
  );
});
CustomTreeItem.displayName = "CustomTreeItem";

const CustomLabel = ({ children, itemId, ...other }: any) => {
  const nodeData = React.useContext(TreeDataContext);
  const node = nodeData.find((n: MyTreeNode) => n.id === itemId);

  if (!node) {
    return <span>{children}</span>;
  }

  return (
    <div {...other}>
      <div className="flex flex-row gap-2 items-center m-2">
        <Image
          src={`/AH_img/${node.nodeData.img}`}
          alt={node.nodeData.label}
          width={40}
          height={40}
          className="pixelated"
          unoptimized
        />
        <span className="text-xl">{node.nodeData.count}x {node.nodeData.label}</span>
      </div>
    </div>
  );
};

const TreeDataContext = React.createContext<MyTreeNode[]>([]);

const MyTreeView = ({ root, setRoot }: MyTreeViewProps) => {

  const [node, setNode] = useState<MyTreeNode | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [allNodes, setAllNodes] = useState<MyTreeNode[]>([]);

  function updateSelectedItems(selection: string, isSelected: boolean) {
    const newSelection = [...selectedItems];

    // auto select/deselect children nodes
    function updateChildren(node: MyTreeNode, select: boolean) {
      if (select) {
        if (!newSelection.includes(node.id)) {
          newSelection.push(node.id);
        }
      } else {
        const index = newSelection.indexOf(node.id);
        if (index > -1) {
          newSelection.splice(index, 1);
        }
      }
      node.children?.forEach((child) => updateChildren(child, select));
    }

    // auto select/deselect parent nodes, only select if all children are selected, deselect otherwise
    function updateParent(node: MyTreeNode | undefined, select: boolean) {
      if (!node) {
        return;
      }
      if (select) {
        const allChildrenSelected = node.children.every((child) => newSelection.includes(child.id));
        if (allChildrenSelected) {
          if (!newSelection.includes(node.id)) {
            newSelection.push(node.id);
          }
          updateParent(node.parent, true);
        }
      } else {
        const index = newSelection.indexOf(node.id);
        if (index > -1) {
          newSelection.splice(index, 1);
        }
        updateParent(node.parent, false);
      }
    }

    const currentNode = allNodes.find((n) => n.id === selection);
    if (currentNode) {
      updateChildren(currentNode, isSelected);
      updateParent(currentNode.parent, isSelected);
    }

    setSelectedItems(newSelection);
  }

  useEffect(() => {
    function updateNodeCheck(node: MyTreeNode, original: Tree<NodeType>) {
      original.value.checked = selectedItems.includes(node.id);
      node.children?.map((el, index) => updateNodeCheck(el, original.children[index]));
    }

    if (node) {
      updateNodeCheck(node, root);
    }
    setRoot({ ...root });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems, setRoot]);

  useEffect(() => {
    if (node) {
      const allNodeIds = getAllIds(node).filter((el) => !selectedItems.includes(el));
      setExpandedItems(allNodeIds);
    }
  }, [node, selectedItems]);

  useEffect(() => {
    const flattenNodes = (node: MyTreeNode): MyTreeNode[] => {
      const nodes = [node];
      if (node.children) {
        node.children.forEach(child => {
          nodes.push(...flattenNodes(child));
        });
      }
      return nodes;
    };

    const newNode = createNode(root);
    if(root && isSameTree(newNode, root)) {
      return;
    }
    setNode(newNode);
    if (newNode) {
      setAllNodes(flattenNodes(newNode));
    }
  }, [root]);

  useEffect(() => {
    if (node) {
      console.log(node);
    }
  }, [node]);

  return (
    <Card className="row-start-3">
      <CardHeader>
        <CardTitle>Arbre de craft</CardTitle>
        <CardDescription className="text-primary font-semibold">
          Coche les ressources que tu possèdes déjà pour mettre à jour les ressources en temps réel.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {node === null && <MyTreeWaiting/>}
        {node !== null && (
          <TreeDataContext.Provider value={allNodes}>
            <RichTreeView
              multiSelect
              items={[node]}
              checkboxSelection
              selectedItems={selectedItems}
              onItemSelectionToggle={(_event, itemId: string, isSelected: boolean) => {
                updateSelectedItems(itemId, isSelected);
              }}
              expandedItems={expandedItems}
              onExpandedItemsChange={(_event, itemIds) => {
                setExpandedItems(itemIds);
              }}
              getItemId={(item) => item.id}
              slots={{
                item: CustomTreeItem,
                collapseIcon: FaChevronDown,
                expandIcon: FaChevronRight,
              }}
              sx={{
                "& .MuiCheckbox-root": {
                  color: "hsl(var(--primary-background))",
                  "&.Mui-checked": {
                    color: "hsl(var(--primary))",
                  },
                  "&.MuiCheckbox-indeterminate": {
                    color: "hsl(var(--primary))",
                  },
                },
              }}
            />
          </TreeDataContext.Provider>
        )}
      </CardContent>
    </Card>
  );
};

export function createNode(root: Tree<NodeType>, depth = 0, childSuffix = "", parent?: MyTreeNode): MyTreeNode {
  const nodeValue = getValueTree(root);

  if (root.children.length === 0) {
    return {
      id: root.value.value + "-" + depth + "-" + childSuffix,
      label: nodeValue.label,
      nodeData: nodeValue,
      children: [],
      parent: parent,
    };
  }

  const node: MyTreeNode = {
    id: root.value.value + "-" + depth + "-" + childSuffix,
    label: nodeValue.label,
    nodeData: nodeValue,
    children: [],
    parent: parent,
  };

  node.children = root.children.map((el, index) => createNode(el, depth + 1, childSuffix + "-" + index, node));

  return node;
}

export function isSameTree(node1: MyTreeNode, node2: Tree<NodeType>): boolean {
  if (node1.id !== node2.value.value) {
    return false;
  }
  if (node1.children === undefined && node2.children.length === 0) {
    return true;
  }
  if (node1.children === undefined && node2.children.length !== 0) {
    return false;
  }
  if (node1.children !== undefined && node2.children.length === 0) {
    return false;
  }
  if (node1.children !== undefined && node2.children.length !== 0) {
    if (node1.children.length !== node2.children.length) {
      return false;
    }
    for (let i = 0; i < node1.children.length; i++) {
      if (!isSameTree(node1.children[i], node2.children[i])) {
        return false;
      }
    }
  }
  return true;
}

function getAllIds(node: MyTreeNode) {
  let ids = [node.id];
  if (node.children) {
    for (const child of node.children) {
      ids = [...ids, ...getAllIds(child)];
    }
  }
  return ids;
}

function MyTreeWaiting() {
  return (
    <div className="flex flex-row gap-2">
      <LoadingSpinner size={4}/>
      <GradientText className="font-extrabold">
        Calcul des ressources nécessaire en cours...
      </GradientText>
    </div>
  );
}

export default MyTreeView;