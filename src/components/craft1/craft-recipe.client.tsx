"use client";
import { CraftSectionEnum, NodeType, OptionType, Tree } from "@/types";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { CraftingArrow } from "@/components/shared/CraftingArrow.client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { generateCraftUrl } from "@/lib/misc";
import { useCraftRecipeStore } from "@/stores/use-craft-store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card-v2";
import { ClickableLink } from "../ui/clickable-link";

const IconSearch = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const IconChevronDown = ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cn("w-4 h-4", className)}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>;

/**
 * Main crafting helper page component.
 * Renders the entire crafting helper UI including item search,
 * quantity input, resource list, and crafting tree.
 * Handles user interactions and state management via zustand store.
 */
export function CraftingHelperPage() {
  const router = useRouter();
  const { language, selectedItem, setSelectedItem, checkedItems, setCheckedItems, allItems, quantity } = useCraftRecipeStore();

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
    const isCurrentlyChecked = newCheckedItems.has(itemValue.value);

    function toggleNodeAndChildren(node: Tree<NodeType>) {
      if (isCurrentlyChecked) {
        newCheckedItems.delete(node.value);
      } else {
        newCheckedItems.add(node.value);
      }

      node.children.forEach(child => toggleNodeAndChildren(child));
    }

    toggleNodeAndChildren(itemValue);
    setCheckedItems(newCheckedItems);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Aide au Craft</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-8 self-start">
            <LanguageToggle />
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
              <ResourceList />
            )}
          </aside>

          <main className="lg:col-span-2 space-y-8">
            {!selectedItem ? (
              <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px]">
                <IconSearch />
                <h2 className="text-2xl font-semibold text-gray-400 mt-4">
                  {language === "fr" ? "Recherchez un item" : "Search for an item"}
                </h2>
                <p className="text-gray-500">
                  {language === "fr" ? "Sélectionnez un item pour voir sa recette." : "Select an item to see its recipe."}
                </p>
              </div>
            ) : (
              <>
                <SelectedItemCard />
                <CraftingTreeDisplay onToggleChecked={handleToggleChecked} />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function LanguageToggle() {
  const { language, setLanguage } = useCraftRecipeStore();
  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "us" : "fr");
  };
  return (
    <div className="flex justify-end">
      <button
        onClick={toggleLanguage}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        {language === "fr" ? "Passer en Anglais (EN)" : "Switch to French (FR)"}
      </button>
    </div>
  );
}

function SearchBar({ searchTerm, setSearchTerm, isSearchFocused, setIsSearchFocused, filteredItems, onSelectItem }: { searchTerm: string; setSearchTerm: React.Dispatch<React.SetStateAction<string>>; isSearchFocused: boolean; setIsSearchFocused: React.Dispatch<React.SetStateAction<boolean>>; filteredItems: OptionType[]; onSelectItem: (item: OptionType) => void }) {
  const { language, selectedItem } = useCraftRecipeStore();
  return (
    <Card>
      <label htmlFor="item-search" className="block text-sm font-medium text-gray-300 mb-2">
        Rechercher un item
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
          className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {isSearchFocused && filteredItems.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg max-h-60 overflow-y-auto">
            <ul className="py-1">
              {filteredItems.map(item => (
                <li
                  key={item.value}
                  onClick={() => onSelectItem(item)}
                  className="flex items-center px-4 py-2 text-white hover:bg-blue-600 cursor-pointer"
                >
                  <div className="w-8 h-8 p-1 mr-3 bg-gray-800 rounded-md flex-shrink-0">
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
  const { quantity, selectedItem } = useCraftRecipeStore();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(1, Number(e.target.value));
    router.push(generateCraftUrl(selectedItem?.value ?? "", newQuantity, CraftSectionEnum.recipe));
  };
  return (
    <Card>
      <label htmlFor="item-quantity" className="block text-sm font-medium text-gray-300 mb-2">
        Quantité désirée
      </label>
      <input
        type="number"
        id="item-quantity"
        value={quantity}
        onChange={handleQuantityChange}
        min="1"
        className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 text-white font-bold text-center"
      />
    </Card>
  );
}

function ResourceList() {
  const { flatResources, language } = useCraftRecipeStore();
  const resourceArray = Array.from(flatResources.entries());

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4 text-blue-300">
        Liste des Ressources
      </h3>
      {resourceArray.length === 0 ? (
        <p className="text-gray-400">
          Vous possédez tous les composants nécessaires !
        </p>
      ) : (
        <ul className="space-y-3">
          {resourceArray.map(([_, [item, count]]) => {
            return (
              <li key={item.value + item.count} className="p-3 rounded-md bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 p-1 bg-gray-800 rounded-md flex-shrink-0">
                      <Image src={`/AH_img/${item.img}`} alt={item.value}
                        className="h-full w-full pixelated rounded-sm hover:scale-125 duration-300"
                        width={48} height={48}
                        unoptimized={true} />
                    </div>
                    <span className="text-gray-200 font-semibold">
                      {language === "fr" ? item.label2 : item.label}
                    </span>
                  </div>
                  <span className="font-bold text-white text-lg">x{count}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
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
          <div className="w-16 h-16 p-2 bg-gray-900 rounded-lg">
            <Image src={`/AH_img/${root.value.img}`} alt={root.value.value}
              className="h-12 w-12 pixelated rounded-sm hover:scale-125 duration-300"
              width={48} height={48}
              unoptimized={true} />
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              {language === "fr" ? root.value.label2 : root.value.label}
            </h2>
            <p className="text-gray-400">
              Arbre de fabrication
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-gray-400">Quantité : </span>
          <span className="font-bold text-blue-300 text-2xl">{quantity}x</span>
        </div>
      </div>

      {root.children.length === 0 ? (
        <p className="text-center text-gray-400 py-8">
          Cet item ne peut pas être crafté.
        </p>
      ) : (
        <div className="w-fit mx-auto p-2 bg-gray-900 rounded-lg">
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

function TreeNode({ root, onToggleChecked, isRoot = false }: { root: Tree<NodeType>; onToggleChecked: (itemValue: Tree<NodeType>) => void; isRoot?: boolean }) {
  const { checkedItems, language } = useCraftRecipeStore();
  const [showRecipe, setShowRecipe] = useState(false);

  const isChecked = useMemo(() => checkedItems.has(root.value), [checkedItems, root.value]);
  const hasChildren = useMemo(() => root.children && root.children.length > 0, [root.children]);

  return (
    <li className={`relative ${!isRoot ? "ml-6 pl-4 border-l border-gray-700" : ""}`}>
      <div className={`flex items-center space-x-2 p-2 rounded-md ${isChecked ? "bg-green-800/30" : "bg-gray-700"}`}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggleChecked(root)}
          className="w-5 h-5 bg-gray-900 border-gray-600 rounded text-blue-500 focus:ring-blue-600 cursor-pointer flex-shrink-0"
        />
        <div className="w-8 h-8 p-1 bg-gray-800 rounded-md flex-shrink-0">
          <Image src={`/AH_img/${root.value.img}`} alt={root.value.value}
            className="w-full h-full object-contain pixelated rounded-sm hover:scale-125 duration-300"
            width={48} height={48}
            unoptimized={true} />
        </div>
        <div className="flex-grow">
          <span className={`font-semibold ${isChecked ? "text-green-300 line-through" : "text-white"}`}>
            {language === "fr" ? root.value.label2 : root.value.label}
          </span>
          <span className={`ml-2 text-sm ${isChecked ? "text-gray-500 line-through" : "text-gray-300"}`}>
            (x{root.value.count})
          </span>
        </div>

        {hasChildren && (
          <button
            onClick={() => setShowRecipe(!showRecipe)}
            className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-800 hover:bg-gray-600 rounded-full flex items-center transition-colors"
          >
            Ressources
            <IconChevronDown className={`ml-1 transition-transform ${showRecipe ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {hasChildren && showRecipe && (
        <div className="mt-2 ml-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-300 mb-2">
            Recette pour 1x {language === "fr" ? root.value.label2 : root.value.label}
          </p>
          <MiniCraftingGrid recipe={root.recipe} output={root.value} />
        </div>
      )}

      {hasChildren && (
        <ul className="mt-2 space-y-2">
          {root.children.map((child: Tree<NodeType>, index: any) => (
            <TreeNode
              key={`${child.value}-${index}`}
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
  const { allItems } = useCraftRecipeStore();

  return (
    <div className="w-40 grid grid-cols-3 gap-1 p-1 bg-gray-900 rounded-md">
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
      className="w-12 aspect-square bg-gray-700 border border-gray-600 rounded-sm p-1 flex items-center justify-center"
    >
      <div className="w-full h-full text-blue-300 relative">
        {slot && slot.value !== "air" &&
          <ClickableLink href={generateCraftUrl(slot.value, 1, CraftSectionEnum.recipe)}>
            <Image src={`/AH_img/${slot.img}`} alt={slot.value}
              className="w-full h-full object-contain pixelated rounded-sm"
              width={48} height={48}
              unoptimized={true} />
          </ClickableLink>
        }
        <span className="top-6 left-9 pr-2 pb-0 absolute text-xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{count}</span>
      </div>
    </div>
  );
}