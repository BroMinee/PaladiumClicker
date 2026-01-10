"use client";
import { CraftSectionEnum, NodeType, OptionType, Tree } from "@/types";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { CraftingArrow } from "@/components/shared/crafting-arrow.client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { adaptPlurial, generateCraftUrl, textFormatting } from "@/lib/misc";
import { useCraftRecipeStore } from "@/stores/use-craft-store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ClickableLink } from "@/components/ui/clickable-link";
import { useItemsStore } from "@/stores/use-items-store";
import { Button } from "@/components/ui/button-v2";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "../ui/page";

const IconSearch = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const IconChevronDown = ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cn("w-4 h-4", className)}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>;

const formatStack = (count: number) => {
  if (count <= 64) {
    return `${count}`;
  }
  const stacks = Math.floor(count / 64);
  const remainder = count % 64;
  const remainderStr = remainder > 0 ? ` + ${remainder}` : "";
  return `${count} (${stacks} ${adaptPlurial("stack", stacks)} ${remainderStr})`;
};

/**
 * Main crafting helper page component.
 * Renders the entire crafting helper UI including item search,
 * quantity input, resource list, and crafting tree.
 * Handles user interactions and state management via zustand store.
 */
export function CraftingHelperPage() {
  const router = useRouter();
  const { checkedItems, setCheckedItems, quantity, root } = useCraftRecipeStore();
  const { allItems, selectedItem, setSelectedItem } = useItemsStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return [];
    }
    const lowerSearch = searchTerm.toLowerCase();
    return allItems.filter(item =>
      item.label.toLowerCase().includes(lowerSearch) ||
      item.label2.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm, allItems]);

  const handleSelectItem = (item: OptionType) => {
    setSelectedItem(item);
    router.push(generateCraftUrl(item.value, quantity, CraftSectionEnum.recipe));
    setSearchTerm("");
    setIsSearchFocused(false);
    setCheckedItems(new Set());
  };

  const handleToggleChecked = (itemValue: Tree<NodeType>) => {
    const newCheckedItems = new Set(checkedItems);
    const willCheck = !newCheckedItems.has(itemValue.value);

    const toggleSubtree = (node: Tree<NodeType>, check: boolean) => {
      if (check) {
        newCheckedItems.add(node.value);
      } else {
        newCheckedItems.delete(node.value);
      }
      node.children.forEach(child => toggleSubtree(child, check));
    };

    toggleSubtree(itemValue, willCheck);

    if (root) {
      const reevaluateTreeState = (node: Tree<NodeType>): boolean => {
        if (node.children.length === 0) {
          return newCheckedItems.has(node.value);
        }

        const areChildrenChecked = node.children
          .map(child => reevaluateTreeState(child))
          .every(Boolean);

        if (areChildrenChecked) {
          newCheckedItems.add(node.value);
          return true;
        } else {
          newCheckedItems.delete(node.value);
          return false;
        }
      };

      reevaluateTreeState(root);
    }

    setCheckedItems(newCheckedItems);
  };

  const handleToggleFromSummary = (targetValue: string, check: boolean, isLeafOnly: boolean) => {
    const newCheckedItems = new Set(checkedItems);

    const toggleSubtree = (node: Tree<NodeType>, shouldCheck: boolean) => {
      if (shouldCheck) {
        newCheckedItems.add(node.value);
      } else {
        newCheckedItems.delete(node.value);
      }
      node.children.forEach(child => toggleSubtree(child, shouldCheck));
    };

    const findAndToggleMatchingNodes = (node: Tree<NodeType>) => {
      const isTarget = node.value.value === targetValue;
      const matchesType = isLeafOnly ? node.children.length === 0 : node.children.length > 0;

      if (isTarget && matchesType) {
        toggleSubtree(node, check);
      }

      node.children.forEach(findAndToggleMatchingNodes);
    };

    if (root) {
      findAndToggleMatchingNodes(root);

      const reevaluateTreeState = (node: Tree<NodeType>): boolean => {
        if (node.children.length === 0) {
          return newCheckedItems.has(node.value);
        }

        const areChildrenChecked = node.children
          .map(child => reevaluateTreeState(child))
          .every(Boolean);

        if (areChildrenChecked) {
          newCheckedItems.add(node.value);
          return true;
        } else {
          newCheckedItems.delete(node.value);
          return false;
        }
      };

      reevaluateTreeState(root);
    }

    setCheckedItems(newCheckedItems);
  };

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>
          {textFormatting("Calculateur de °Craft°")}
        </PageHeaderHeading>
        <PageHeaderDescription>
          {"Calcul les ressources nécessaires et génère l'arbre de fabrication."}
        </PageHeaderDescription>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-8 self-start">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
            onSelectItem={handleSelectItem}
            filteredItems={filteredItems}
          />
          {selectedItem && (
            <QuantityInput />
          )}
          {selectedItem && (
            <>
              <SummaryList
                title={"Ressources nécessaires"}
                onToggleItem={(val, check) => handleToggleFromSummary(val, check, true)}
                filterMode="leaf"
              />
              <SummaryList
                title={"Sous-crafts à faire"}
                onToggleItem={(val, check) => handleToggleFromSummary(val, check, false)}
                filterMode="intermediate"
              />
            </>
          )}
        </aside>

        <main className="lg:col-span-2 space-y-8">
          {!selectedItem ? (
            <div className="bg-card rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px]">
              <IconSearch />
              <h2 className="text-2xl font-semibold text-card-foreground mt-4">
                Recherchez un item
              </h2>
              <p className="text-gray-500">
                {"Sélectionnez un item pour voir sa recette."}
              </p>
            </div>
          ) : (
            <>
              <SelectedItemCard />
              <CraftingTreeDisplay onToggleChecked={handleToggleChecked} />
              <SubCraftRecipesDisplay />
            </>
          )}
        </main>
      </div>
    </>
  );
}

function LanguageToggle() {
  const { language, setLanguage } = useCraftRecipeStore();
  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "us" : "fr");
  };
  return (
    <div className="flex justify-end">
      <Button
        variant="primary"
        onClick={toggleLanguage}
        className="font-bold py-2 px-4 rounded-lg"
      >
        {language === "fr" ? "Passer en Anglais (EN)" : "Switch to French (FR)"}
      </Button>
    </div>
  );
}

/**
 * Search bar component for selecting items to craft.
 * Displays a dropdown of filtered items based on user input.
 */
export function SearchBar({ searchTerm, setSearchTerm, isSearchFocused, setIsSearchFocused, filteredItems, onSelectItem }: { searchTerm: string; setSearchTerm: React.Dispatch<React.SetStateAction<string>>; isSearchFocused: boolean; setIsSearchFocused: React.Dispatch<React.SetStateAction<boolean>>; filteredItems: OptionType[]; onSelectItem: (item: OptionType) => void }) {
  const { language } = useCraftRecipeStore();
  const { selectedItem } = useItemsStore();

  return (
    <Card>
      <label htmlFor="item-search" className="flex flex-row justify-between items-center text-sm font-medium mb-2 gap-2 md:gap-0">
        <span>Rechercher un item</span>
        <LanguageToggle />
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IconSearch />
        </div>
        <input
          type="text"
          id="item-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
          placeholder={selectedItem ? (language === "fr" ? selectedItem.label : selectedItem.label2) : (language === "fr" ? "Pioche en Diamant..." : "Diamond Pickaxe...")}
          className="w-full bg-background border border-secondary rounded-lg py-2 pl-10 pr-4 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {isSearchFocused && filteredItems.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-secondary border border-gray-600 rounded-lg max-h-60 overflow-y-auto">
            <ul className="py-1">
              {filteredItems.map(item => (
                <li
                  key={item.value}
                  onClick={() => onSelectItem(item)}
                  className="flex items-center px-4 py-2 hover:bg-blue-600 cursor-pointer"
                >
                  <div className="w-8 h-8 p-1 mr-3 bg-card rounded-md flex-shrink-0">
                    <Image src={`/AH_img/${item.img}`} alt={item.value}
                      className="w-full h-full object-contain pixelated rounded-sm hover:scale-125 duration-300"
                      width={48} height={48}
                      unoptimized={true} />
                  </div>
                  <span>{language === "fr" ? item.label2 : item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}

function QuantityInput() {
  const router = useRouter();
  const { quantity } = useCraftRecipeStore();
  const { selectedItem } = useItemsStore();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(1, Number(e.target.value));
    router.push(generateCraftUrl(selectedItem?.value ?? "", newQuantity, CraftSectionEnum.recipe));
  };
  return (
    <Card>
      <label htmlFor="item-quantity" className="block text-sm font-medium mb-2">
        Quantité désirée
      </label>
      <input
        type="number"
        id="item-quantity"
        value={quantity}
        onChange={handleQuantityChange}
        min="1"
        className="w-full bg-background border border-secondary rounded-lg py-2 px-4 font-bold text-center"
      />
    </Card>
  );
}

interface SummaryListProps {
  title: string;
  onToggleItem: (resourceValue: string, check: boolean) => void;
  filterMode: "leaf" | "intermediate";
}

function SummaryList({ title, onToggleItem, filterMode }: SummaryListProps) {
  const { language, checkedItems, root } = useCraftRecipeStore();

  const itemsData = useMemo(() => {
    const map = new Map<string, { item: OptionType; total: number; remaining: number }>();
    if (!root) {
      return [];
    }

    const traverse = (node: Tree<NodeType>, isRoot: boolean) => {
      const isLeaf = node.children.length === 0;
      const isEligible = filterMode === "leaf" ? isLeaf : (!isLeaf && !isRoot);

      if (isEligible) {
        const val = node.value.value;
        const count = node.value.count;
        const isChecked = checkedItems.has(node.value);

        if (!map.has(val)) {
          map.set(val, { item: node.value, total: 0, remaining: 0 });
        }

        const entry = map.get(val)!;
        entry.total += count;
        if (!isChecked) {
          entry.remaining += count;
        }
      }

      node.children.forEach(child => traverse(child, false));
    };

    traverse(root, true);

    return Array.from(map.values()).sort((a, b) =>
      a.item.label.localeCompare(b.item.label)
    );
  }, [root, checkedItems, filterMode]);

  if (itemsData.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4 text-blue-300">
        {title}
      </h3>
      <ul className="space-y-3">
        {itemsData.map(({ item, remaining }) => {
          const isCompleted = remaining === 0;

          return (
            <li
              key={item.value}
              className={cn(
                "p-3 rounded-md transition-all duration-300 border border-transparent",
                isCompleted
                  ? "bg-green-900/20 border-green-800/50 opacity-70"
                  : "bg-secondary"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={(e) => onToggleItem(item.value, e.target.checked)}
                    className="w-5 h-5 bg-background border-gray-600 rounded text-blue-500 focus:ring-blue-600 cursor-pointer flex-shrink-0"
                  />
                  <div className="w-8 h-8 p-1 bg-card rounded-md flex-shrink-0 relative">
                    <Image src={`/AH_img/${item.img}`} alt={item.value}
                      className={cn(
                        "h-full w-full pixelated rounded-sm hover:scale-125 duration-300",
                        isCompleted && "grayscale-[0.5]"
                      )}
                      width={48} height={48}
                      unoptimized={true} />
                  </div>
                  <span className={cn(
                    "font-semibold transition-all",
                    isCompleted ? "text-green-400 line-through decoration-2" : ""
                  )}>
                    {language === "fr" ? item.label2 : item.label}
                  </span>
                </div>

                <span className={cn(
                  "font-bold text-sm text-right ml-2",
                  isCompleted ? "text-green-500" : "text-card-foreground"
                )}>
                  {isCompleted ? "✔" : formatStack(remaining)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function SelectedItemCard() {
  const { root, quantity, language } = useCraftRecipeStore();
  if (!root) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 p-2 bg-background rounded-lg">
            <Image src={`/AH_img/${root.value.img}`} alt={root.value.value}
              className="h-12 w-12 pixelated rounded-sm hover:scale-125 duration-300"
              width={48} height={48}
              unoptimized={true} />
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              {language === "fr" ? root.value.label2 : root.value.label}
            </h2>
            <p className="text-card-foreground">
              Arbre de fabrication
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-card-foreground">Quantité : </span>
          <span className="font-bold text-blue-300 text-2xl">{quantity}x</span>
        </div>
      </div>

      {root.children.length === 0 ? (
        <p className="text-center text-card-foreground py-8">
          Cet item ne peut pas être crafté.
        </p>
      ) : (
        <div className="w-fit mx-auto p-2 bg-background rounded-lg">
          <MiniCraftingGrid recipe={root.recipe} output={root.value} />
        </div>
      )
      }
    </Card>
  );
}

function CraftingTreeDisplay({ onToggleChecked }: { onToggleChecked: (itemValue: Tree<NodeType>) => void }) {
  const { root } = useCraftRecipeStore();

  if (!root) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4 text-blue-300">
        Arbre de Fabrication
      </h3>
      <ul className="space-y-2">
        <TreeNode
          root={root}
          onToggleChecked={onToggleChecked}
          isRoot={true}
        />
      </ul>
    </Card>
  );
}

function SubCraftRecipesDisplay() {
  const { root, language } = useCraftRecipeStore();

  const uniqueRecipes = useMemo(() => {
    if (!root) {
      return [];
    }
    const map = new Map<string, Tree<NodeType>>();

    const traverse = (node: Tree<NodeType>, isRoot: boolean) => {
      const hasRecipe = node.children.length > 0;

      if (hasRecipe && !isRoot) {
        if (!map.has(node.value.value)) {
          map.set(node.value.value, node);
        }
      }

      node.children.forEach(child => traverse(child, false));
    };

    traverse(root, true);

    return Array.from(map.values()).sort((a, b) =>
      a.value.label.localeCompare(b.value.label)
    );
  }, [root]);

  if (uniqueRecipes.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-6 text-blue-300">
        Recettes des sous-crafts
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {uniqueRecipes.map((node) => (
          <div key={node.value.value} className="bg-secondary p-4 rounded-lg flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 relative">
                <Image src={`/AH_img/${node.value.img}`} alt={node.value.value}
                  className="object-contain pixelated"
                  fill
                  unoptimized={true} />
              </div>
              <span className="font-semibold text-lg">
                {language === "fr" ? node.value.label2 : node.value.label}
              </span>
            </div>
            <MiniCraftingGrid recipe={node.recipe} output={node.value} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function TreeNode({ root, onToggleChecked, isRoot = false }: { root: Tree<NodeType>; onToggleChecked: (itemValue: Tree<NodeType>) => void; isRoot?: boolean }) {
  const { checkedItems, language } = useCraftRecipeStore();
  const [showRecipe, setShowRecipe] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const isChecked = useMemo(() => checkedItems.has(root.value), [checkedItems, root.value]);
  const hasChildren = useMemo(() => root.children && root.children.length > 0, [root.children]);

  const handleToggleOpen = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, input")) {
      return;
    }
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <li className={`relative ${!isRoot ? "ml-6 pl-4 border-l border-secondary" : ""}`}>
      <div
        onClick={handleToggleOpen}
        className={cn(
          "flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors",
          isChecked ? "bg-green-800/30" : "bg-secondary hover:bg-secondary/80"
        )}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="p-1 hover:bg-background rounded-full transition-colors"
          >
            <IconChevronDown className={`transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`} />
          </button>
        ) : (
          <div className="w-6" />
        )}

        <input
          type="checkbox"
          checked={isChecked}
          onClick={(e) => e.stopPropagation()}
          onChange={() => onToggleChecked(root)}
          className="w-5 h-5 bg-background border-gray-600 rounded text-blue-500 focus:ring-blue-600 cursor-pointer flex-shrink-0"
        />
        <div className="w-8 h-8 p-1 bg-card rounded-md flex-shrink-0">
          <Image src={`/AH_img/${root.value.img}`} alt={root.value.value}
            className="w-full h-full object-contain pixelated rounded-sm hover:scale-125 duration-300"
            width={48} height={48}
            unoptimized={true} />
        </div>
        <div className="flex-grow">
          <span className={`font-semibold ${isChecked ? "text-green-300 line-through" : ""}`}>
            {language === "fr" ? root.value.label2 : root.value.label}
          </span>
          <span className={`ml-2 text-sm ${isChecked ? "text-gray-500 line-through" : ""}`}>
            (x{root.value.count})
          </span>
        </div>

        {hasChildren && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setShowRecipe(!showRecipe);
            }}
            className="px-2 py-1 bg-card rounded"
          >
            Craft
            <IconChevronDown className={`ml-1 transition-transform ${showRecipe ? "rotate-180" : ""}`} />
          </Button>
        )}
      </div>

      {hasChildren && showRecipe && (
        <div className="mt-2 ml-4 p-4 bg-background/50 rounded-lg border border-secondary">
          <MiniCraftingGrid recipe={root.recipe} output={root.value} />
        </div>
      )}

      {hasChildren && isOpen && (
        <ul className="mt-2 space-y-2">
          {root.children.map((child: Tree<NodeType>, index: number) => (
            <TreeNode
              key={`${child.value.value}-${index}`}
              root={child}
              onToggleChecked={onToggleChecked}
              isRoot={false}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function MiniCraftingGrid({ recipe, output }: { recipe: NodeType[], output: NodeType }) {
  return (
    <div className="flex flex-row items-center gap-2">
      <DisplayCraftingGrid recipe={recipe} />
      <CraftingArrow />
      <DisplayItem index={0} slot={output} count={recipe[0].count} />
    </div>
  );
}

function DisplayCraftingGrid({ recipe }: { recipe: OptionType[] }) {
  const { allItems } = useItemsStore();

  return (
    <div className="w-40 grid grid-cols-3 gap-1 p-1 bg-background rounded-md">
      {Array.from({ length: 9 }).map((_, index) => {
        const item = recipe.at(index);
        const gridItem = item ? allItems.find((it) => it.value === item.value) : undefined;
        return (
          <DisplayItem key={index} index={index} slot={gridItem} />
        );
      })}
    </div>
  );
}

function DisplayItem({ index, slot, count }: { index: number; slot: OptionType | undefined, count?: number }) {
  const { language } = useCraftRecipeStore();
  return (
    <div
      key={slot ? slot.value + index : "empty-" + index}
      title={(language === "fr" ? slot?.label2 : slot?.label) ?? "(Vide)"}
      className="w-12 aspect-square bg-secondary border border-gray-600 rounded-sm p-1 flex items-center justify-center"
    >
      <div className="w-full h-full text-blue-300 relative">
        {slot && slot.value !== "air" &&
          <ClickableLink href={generateCraftUrl(slot.value, 1, CraftSectionEnum.recipe)}>
            <Image src={`/AH_img/${slot.img}`} alt={slot.value}
              className="w-full h-full object-contain pixelated rounded-sm transition-transform duration-300 hover:scale-125"
              width={48} height={48}
              unoptimized={true} />
          </ClickableLink>
        }
        <span className="top-6 left-9 pr-2 pb-0 absolute text-xl font-bold pointer-events-none">{count}</span>
      </div>
    </div>
  );
}