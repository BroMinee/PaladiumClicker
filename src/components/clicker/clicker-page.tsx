import React, { ReactNode } from "react";
import { BestBuyCard, StatButton, StatRPS, StatSleepingCoin, StatTotalProd } from "@/components/clicker/statistics.client";
import { BuildingInputCard, UpgradeSectionClient } from "@/components/clicker/inputs.client";
import { Card } from "@/components/ui/card-v2";

/**
 * [Clicker Page](https://palatracker.bromine.fr/clicker-optimizer/BroMine__)
 * @param props.params - Username parameter
 */
export function ClickerPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <div className="lg:col-span-2 space-y-10">
        <BuildingInputCard/>
        <UpgradeSectionClient/>
      </div>

      <div className="space-y-6 sticky top-8 h-fit">
        <BestBuyCard/>
        <Card className="flex space-x-2">
          <StatButton/>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Statistiques Actuelles</h3>
          <div className="space-y-3">
            <StatRPS/>
            <StatSleepingCoin/>
            <StatTotalProd/>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface StatItemProps { icon: ReactNode; label: string; value: string; }
/**
 * A single statistic item component.
 * Used the full width of its container.
 *
 * @param icon the element used as an icon
 * @param label the label of the statistic
 * @param value the value of the statistic
 */
export function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="text-primary">{icon}</div>
        <span className="text-gray-300">{label}</span>
      </div>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}