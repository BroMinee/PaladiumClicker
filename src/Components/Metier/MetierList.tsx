import { ChangeEvent } from "react";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import "./MetierList.css";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import type { Metier } from "@/types";

type MetierListProps = {
  editable?: boolean;
};

const MetierList = ({ editable = true }: MetierListProps) => {
  const { data: playerInfo } = usePlayerInfoStore();

  const metiers = playerInfo?.metier.sort((a, b) => {
    return a.name.localeCompare(b.name);
  }) ?? [];

  return (
    <ul className={"ul-horizontal ul-metier"}>
      {
        metiers.map((metier) => (<Metier key={metier.name} metier={metier} editable={editable} />))
      }
    </ul>
  );
}

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

type MetierProps = {
  metier: Metier;
  editable?: boolean;
};

const Metier = ({
  metier,
  editable = false
}: MetierProps) => {

  const {
    data: playerInfo,
    setPlayerInfo,
    increaseMetierLevel,
    decreaseMetierLevel
  } = usePlayerInfoStore();

  function enforceMinMax(el: ChangeEvent<HTMLInputElement>) {
    if (!editable) return;

    let value = Number(el.target.value);

    if (value) {
      value = Math.floor(value);

      if (parseInt(el.target.value) < parseInt(el.target.min)) {
        el.target.value = el.target.min;
      }
      if (parseInt(el.target.value) > parseInt(el.target.max)) {
        el.target.value = el.target.max;
      }

      if (!playerInfo) {
        return;
      }

      let targettedMetier = playerInfo.metier.find((m) => m.name === metier.name)!;

      targettedMetier = {
        ...targettedMetier,
        level: parseInt(el.target.value),
        xp: 0,
      }

      const metiers = playerInfo.metier.filter((m) => m.name !== metier.name).concat(targettedMetier);
      setPlayerInfo({ ...playerInfo, metier: metiers })

      return true;
    }
  }

  const playerMetier = (playerInfo?.metier ?? []).find((m) => m.name === metier.name);
  const coefXp = getXpForLevel(metier.level, playerMetier?.xp || 0);
  const colors = getColorByMetierName(metier.name);

  const jobImagePath = `/JobsIcon/${metier.name}.webp` as const;

  return (
    <ul className={"Info-Metier-list"}>
      <div className="imageWrapper">
        <img src={jobImagePath} alt="image" className={"Metier-img"} />
        <div className="progress-bar">
          <svg className="progress blue noselect" x="0px" y="0px" viewBox="0 0 776 628">
            <path className="track"
              d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"></path>
            <path className="fill" d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
              style={{
                strokeDashoffset: 2160 * (1 - (coefXp)),
                stroke: `rgb(${colors.color[0]},${colors.color[1]},${colors.color[2]})`,
              }} />
          </svg>
        </div>
      </div>
      <div className={"Lvl-txt"} style={{ backgroundColor: `rgb(${colors.bgColor[0]},${colors.bgColor[1]},${colors.bgColor[2]})` }}>
        <input
          className={"Lvl-inside-txt"}
          style={{ padding: (editable === false ? "0 0" : "") }}
          type="number"
          min="1"
          step="1"
          max="100"
          value={metier.level}
          onChange={enforceMinMax} />
        {editable === false ? "" :
          <div className={"ArrowUpDown"}>

            <div onClick={() => {
              if (!editable) return;
              increaseMetierLevel(metier.name, 1);
            }}>
              <SlArrowUp />
            </div>
            <div onClick={() => {
              if (!editable) return;
              decreaseMetierLevel(metier.name, 1);
            }}>
              <SlArrowDown />
            </div>
          </div>
        }
      </div>
    </ul>
  );
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

export default MetierList;
