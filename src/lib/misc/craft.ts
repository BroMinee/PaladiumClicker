import { CraftPrice, CraftSectionEnum, MyTreeNode, NodeType, OptionType, Tree } from "@/types";

/**
 * Creates a tree node from an item, count, and optional checked state.
 * @param item The item to include in the node.
 * @param count The quantity associated with the node.
 * @param checked Whether the node is checked or not.
 */
export function createTreeNode(item: OptionType, count: number, checked = false): Tree<NodeType> {
  const node: NodeType = createNodeType(item, count, checked);
  return { value: node, children: [], recipe: [] };
}

/**
 * Creates a NodeType object from an item, count, and optional checked state.
 * @param item The item to include in the node type.
 * @param count The quantity associated with the node type.
 * @param checked Whether the node is checked or not.
 */
export function createNodeType(item: OptionType, count: number, checked = false): NodeType {
  return { ...item, count: count, checked: checked };
}

/**
 * Adds a child node to a parent node in a tree.
 * @param father The parent tree node.
 * @param children The child tree node to add.
 */
export function addChildrenToTree<T>(father: Tree<T>, children: Tree<T>) {
  father.children.push(children);
}

/**
 * Returns the value of a tree node.
 * @param root The root tree node.
 */
export function getValueTree<T>(root: Tree<T>): T {
  return root.value;
}

/**
 * Returns all leaf nodes of a tree.
 * @param root The root tree node.
 */
export function getAllLeaves<T>(root: Tree<T>): Tree<T>[] {
  if (root.children.length === 0) {
    return [root];
  }
  return root.children.flatMap((child) => getAllLeaves(child));
}

/**
 * Returns all internal (non-leaf) nodes of a tree.
 * @param root The root tree node.
 */
export function getInternalNode<T>(root: Tree<T>): Tree<T>[] {
  if (root.children.length === 0) {
    return [];
  }
  return [root, ...root.children.flatMap((child) => getInternalNode(child))];
}

export const CraftSectionValid = Object.values(CraftSectionEnum) as string[];

/**
 * Parses a WebSocket message to extract CraftPrice update data.
 * @param message The WebSocket message to parse.
 */
export function parseMessageCraftPrice(message: any): { type: "update" | "other", data: CraftPrice[] } {

  function isCraftPrice(item: any): boolean {
    return (
      typeof item === "object" &&
      item !== null &&
      typeof item.created_at === "string" &&
        typeof item.item === "object" && typeof item.item.item_name === "string" && typeof item.item.us_trad === "string" && typeof item.item.fr_trad === "string" && typeof item.item.img === "string" &&
      typeof item.priceToCraft === "number" &&
      typeof item.currentPrice === "number" &&
      typeof item.averagePrice === "number" &&
      typeof item.totalSold === "number"
    );
  }

  try {
    const json = JSON.parse(message);
    if (json.type === "update" && Array.isArray(json.data)) {
      const r: CraftPrice[] = json.data.map((item: any) => {
        if(isCraftPrice(item)) {
          return {
            created_at: item.created_at,
            item: {
              item_name: item.item.item_name,
              us_trad: item.item.us_trad,
              fr_trad: item.item.fr_trad,
              img: item.item.img
            },
            priceToCraft: Number(item.priceToCraft),
            currentPrice: Number(item.currentPrice),
            averagePrice: Number(item.averagePrice),
            totalSold: Number(item.totalSold)
          };
        } else {
          throw new Error(`Invalid item format: ${JSON.stringify(item)}`);
        }
      });
      return { type: "update", data: r };
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return { type: "other", data: [] };
  }
  return { type: "other", data: [] };
}

/**
 * Creates a MyTreeNode from a generic Tree<NodeType>.
 * @param root The tree node to convert.
 * @param depth The current depth in the tree (default 0).
 * @param childSuffix Optional suffix to differentiate children.
 * @param parent The parent MyTreeNode, if any.
 */
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

/**
 * Compares a MyTreeNode with a Tree<NodeType> to check if they are the same.
 * @param node1 The MyTreeNode to compare.
 * @param node2 The Tree<NodeType> to compare.
 */
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

/**
 * Retrieves all IDs from a MyTreeNode and its descendants.
 * @param node The MyTreeNode to traverse.
 */
export function getAllIds(node: MyTreeNode) {
  let ids = [node.id];
  if (node.children) {
    for (const child of node.children) {
      ids = [...ids, ...getAllIds(child)];
    }
  }
  return ids;
}