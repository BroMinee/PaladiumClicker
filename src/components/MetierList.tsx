import { MetierKey } from "@/types";
import { Card, CardContent } from "./ui/card";

import "./MetierList.css";
import { MetierDecrease, MetierDisplayLvl, MetierIncrease, MetierOutline } from "@/components/MetierListClient";
import Image from "next/image";
import { safeJoinPaths } from "@/lib/misc";

import metierJson from "@/assets/metier.json";
import { constants } from "@/lib/constants";
type MetierListProps = {
  editable?: boolean;
};

/**
 * Component that display the 4 Jobs components
 * @param editable - boolean, if true the component can edit playerInfo.metier[key].level
 */
const MetierList = ({ editable = true }: MetierListProps) => {
  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 items-center gap-4">
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
          <MetierComponentWrapper editable={editable} metierKey={"miner"}/>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
          <MetierComponentWrapper editable={editable} metierKey={"farmer"}/>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
          <MetierComponentWrapper editable={editable} metierKey={"hunter"}/>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
          <MetierComponentWrapper editable={editable} metierKey={"alchemist"}/>
        </CardContent>
      </Card>
    </div>
  );
};

type MetierProps = {
  editable?: boolean;
  minLevel?: number;
  metierKey: MetierKey;
  twitch?: boolean;
};

/**
 * A component that display the PlayerInfo Jobs with the job image, outline progression, and level display.
 * @param editable - Enables level editing controls (increase/decrease).
 * @param minLevel - Minimum level allowed when decreasing the métier level.
 * @param metierKey - The job key used to to display corresponding data (image, outline, level).
 * @param twitch - Whether to display the UI in Twitch mode (affects level display styling or behavior).
 */
export const MetierComponentWrapper = ({
  editable = false,
  minLevel = 1,
  metierKey,
  twitch = false,
}: MetierProps) => {

  const metierName = structuredClone(metierJson[metierKey].name as MetierKey);

  return (
    <>
      <div className="relative">
        <Image src={safeJoinPaths(constants.imgPathProfile,"/JobsIcon/", `${metierName}.webp`)} alt="jobsImage"
               unoptimized
               style={{ position: "inherit", zIndex: 2 }} width={256} height={256}/>
        <div className="progress-bar">
          {/* BroMine.... Please, never touch this code again. It works !*/}
          {/* 30/08/2024 I have touched it o_O */}
          <svg className="progress blue noselect" x="0px" y="0px" viewBox="0 0 776 628">
            <path className="track"
                  d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"></path>
            <MetierOutline metierKey={metierKey}/>
          </svg>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        {editable && <MetierDecrease minLevel={minLevel ?? 1} metierKey={metierKey}/>}
        <MetierDisplayLvl metierKey={metierKey} twitch={twitch}/>
        {editable && <MetierIncrease metierKey={metierKey}/>}
      </div>
    </>
  );
};

export default MetierList;