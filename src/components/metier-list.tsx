import { MetierKey } from "@/types";
import { Card, CardContent } from "./ui/card";

import "./MetierList.css";
import { MetierDisplayLvl, MetierOutline } from "@/components/metier-list.client";
import { safeJoinPaths } from "@/lib/misc";

import metierJson from "@/assets/metier.json";
import { constants } from "@/lib/constants";
import { UnOptimizedImage } from "./ui/image-loading";
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
          <MetierComponentWrapper editable={editable} metierKey={"miner"} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
          <MetierComponentWrapper editable={editable} metierKey={"farmer"} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
          <MetierComponentWrapper editable={editable} metierKey={"hunter"} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
          <MetierComponentWrapper editable={editable} metierKey={"alchemist"} />
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
  metierKey,
  twitch = false,
}: MetierProps) => {

  const metierName = structuredClone(metierJson[metierKey].name as MetierKey);

  return (
    <>
      <div className="relative">
        <UnOptimizedImage
          src={safeJoinPaths(constants.imgPathProfile, "/JobsIcon/", `${metierName}.webp`)}
          alt="image"
          width={256}
          height={256}
          style={{ position: "inherit", zIndex: 2 }}
        />
        <div className="progress-bar">
          <svg className="progress blue noselect" x="0px" y="0px" viewBox="0 0 776 628">
            <path className="track"
              d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"></path>
            <MetierOutline metierKey={metierKey} />
          </svg>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <MetierDisplayLvl metierKey={metierKey} twitch={twitch} />
      </div>
    </>
  );
};

export default MetierList;