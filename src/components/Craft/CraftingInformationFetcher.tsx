"use server";

import { NodeType, OptionType, } from "@/types";
import React from "react";
import { getCraftRecipe } from "@/lib/api/apiPalaTracker";
import { CraftingInformationClient } from "@/components/Craft/CraftingInformation";
import { getInternalNode } from "@/lib/misc";
import { CraftItemRecipe } from "@/components/Craft/CraftItemRecipe";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Wrapper that fetch the craft of the given item and display the recipe tree and a summary of the material needed.
 * @param item - The item the user wants to craft
 * @param options - The list of available items
 * @param count - The number of `item` the user want to craft.
 */
export async function CraftingInformationFetcher({ item, options, count }: {
  item: OptionType,
  options: OptionType[],
  count: number,
}) {

  const root = await getCraftRecipe(item.value, count);

  const internalNodeNameUnique = getInternalNode(root).map((el) => {
    return el.value;
  }).reduce((acc, el) => {
    if (acc.findIndex((el2) => el2.value === el.value) === -1) {
      return [...acc, el];
    }
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
            return <CraftItemRecipe key={el.value + index + "-craft"} item={el} options={options}/>;
          })}
        </Card>

      <CraftingInformationClient
        root={root}>
      </CraftingInformationClient>
    </>
  );
}
