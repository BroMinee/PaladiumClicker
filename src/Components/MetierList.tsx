import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import type { Metier } from "@/types";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

type MetierListProps = {
  editable?: boolean;
};

const MetierList = ({ editable = true }: MetierListProps) => {
  const { data: playerInfo } = usePlayerInfoStore();

  const metiers = playerInfo?.metier.sort((a, b) => {
    return a.name.localeCompare(b.name);
  }) ?? [];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center gap-4">
      {metiers.map((metier) => (<Metier key={metier.name} metier={metier} editable={editable} />))}
    </div>
  );
}

type MetierProps = {
  metier: Metier;
  editable?: boolean;
};

const Metier = ({
  metier,
  editable = false
}: MetierProps) => {

  const { data: playerInfo, increaseMetierLevel, decreaseMetierLevel } = usePlayerInfoStore();

  const playerMetier = (playerInfo?.metier ?? []).find((m) => m.name === metier.name);
  const coefXp = getXpForLevel(metier.level, playerMetier?.xp || 0);
  const colors = getColorByMetierName(metier.name);

  return (
    <Card>
      <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
        <div className="relative">
        <img src={`/JobsIcon/${metier.name}.webp`} alt="image" />
          {/* <svg className="absolute left-0 right-0 bottom-4 rotate-[30deg] scale-[0.85]" viewBox="0 0 776 628">
            <path
              d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z" />
            <path d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
              style={{
                strokeDashoffset: 2160 * (1 - (coefXp)),
                stroke: `rgb(${colors.color[0]},${colors.color[1]},${colors.color[2]})`,
              }} />
          </svg> */}
        </div>
        <div className="flex items-center justify-center gap-2">
          {editable &&
            <Button variant="outline" size="icon" onClick={() => decreaseMetierLevel(metier.name, 1)}>
              <FaArrowDown className="h-4 w-4" />
            </Button>
          }
          <span
            className="text-white rounded-sm font-bold text-sm flex items-center justify-center h-9 w-9"
            style={{ backgroundColor: `rgb(${colors.bgColor[0]},${colors.bgColor[1]},${colors.bgColor[2]})` }}
          >
            {metier.level}
          </span>
          {editable &&
            <Button variant="outline" size="icon" onClick={() => increaseMetierLevel(metier.name, 1)}>
              <FaArrowUp className="h-4 w-4" />
            </Button>}
        </div>
      </CardContent>
    </Card>
  );
}

export default MetierList;

const metierPalier = [
  480,
  1044,
  1713,
  2497,
  3408,
  4451,
  5635,
  6966,
  8447,
  10086,
  11885,
  13850,
  15983,
  18290,
  20773,
  23435,
  26281,
  29312,
  32532,
  35943,
  39549,
  43351,
  47353,
  51556,
  55964,
  60577,
  65399,
  70432,
  75677,
  81137,
  86813,
  92709,
  98824,
  105162,
  111724,
  118512,
  125527,
  132772,
  140248,
  147956,
  155898,
  164076,
  172492,
  181146,
  190040,
  199176,
  208555,
  218179,
  228049,
  238166,
  248532,
  259148,
  270015,
  281135,
  292509,
  304138,
  316023,
  328166,
  340568,
  353230,
  366153,
  379399,
  392788,
  406502,
  420482,
  434728,
  449243,
  464027,
  479081,
  494407,
  510004,
  525875,
  542021,
  558442,
  575150,
  592115,
  609368,
  626901,
  644714,
  662809,
  681186,
  699846,
  718791,
  738021,
  757537,
  777339,
  797430,
  817810,
  838479,
  859438,
  880690,
  902234,
  924071,
  946202,
  968628,
  991349,
  1014368,
  1037683,
  1061297,
  1085210
]

function getXpForLevel(level: number, currentXp: number) {
  if (level === 100)
    return 1
  if (currentXp === 0)
    return 0
  const sum = metierPalier.slice(0, level).reduce((a, b) => a + b, 0)
  return (currentXp - sum) / metierPalier[level]
}

const getColorByMetierName = (name: string) => {
  let color = [0, 150, 0];
  let bgColor = [0, 0, 0];

  switch (name) {
    case "mineur":
      color = [255, 47, 47];
      bgColor = [255, 47, 47];
      break;
    case "farmer":
      color = [199, 169, 33];
      bgColor = [255, 209, 1];
      break;
    case "hunter":
      color = [47, 103, 255];
      bgColor = [47, 103, 255];
      break;
    case "alchimiste":
      color = [255, 100, 201];
      bgColor = [255, 100, 201];
  }

  return { color, bgColor };
}
