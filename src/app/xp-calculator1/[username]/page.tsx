import ProfileFetcherWrapper from "@/components/ProfileFetcher.client";
import { XPCalculator } from "@/components/xp-calculator1/calculator.client";
import React from "react";

/**
 * [xp-calculator page](https://palatracker.bromine.fr/xp-calculator/BroMine__)
 */
export default async function XpCaclulatorPage(props: {
  params: Promise<{ username: string }>,
}
) {
  const params = await props.params;

  return (<ProfileFetcherWrapper username={params.username}>
    <XPCalculator/>
  </ProfileFetcherWrapper>);
}