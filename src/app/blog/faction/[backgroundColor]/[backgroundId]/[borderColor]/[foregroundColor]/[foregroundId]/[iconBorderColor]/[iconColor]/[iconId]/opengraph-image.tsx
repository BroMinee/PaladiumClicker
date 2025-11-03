import { ImageResponse } from "next/og";

interface EmblemConfig {
  backgroundColor: number;
  backgroundId: number;
  borderColor: number;
  foregroundColor: number;
  foregroundId: number;
  iconBorderColor: number;
  iconColor: number;
  iconId: number;
}

function intToHex(color: number): string {
  if (color === -1) {
    return "#FFFFFF";
  }

  const unsigned = color >>> 0;
  const hex = unsigned.toString(16).padStart(8, "0");

  return `#${hex.slice(2)}`;
}

/**
 * Generator of faction emblem
 * @param params - object that represent the faction emblem
 */
export default async function ImageGen( { params }: { params: any}) {
  try {
    const emblem: EmblemConfig = {
      backgroundColor: parseInt(await params.backgroundColor),
      backgroundId: parseInt(await params.backgroundId),
      borderColor: parseInt(await params.borderColor),
      foregroundColor: parseInt(await params.foregroundColor),
      foregroundId: parseInt(await params.foregroundId),
      iconBorderColor: parseInt(await params.iconBorderColor),
      iconColor: parseInt(await params.iconColor),
      iconId: parseInt(await params.iconId),
    };

    const bgColor = intToHex(emblem.backgroundColor);
    const borderColor = intToHex(emblem.borderColor);
    const fgColor = intToHex(emblem.foregroundColor);
    const iconBorderColor = intToHex(emblem.iconBorderColor);
    const iconColor = intToHex(emblem.iconColor);

    return new ImageResponse(
      (
        <div
          style={{
            width: "200px",
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            style={{
              position: "absolute",
            }}
          >
            <defs>
              <mask id="foregroundMask">
                <image
                  href={`http://localhost:3000/img/Faction/${emblem.backgroundId}/${emblem.foregroundId}/foreground.png`}
                  width="200"
                  height="200"
                />
              </mask>
              <mask id="backgroundMask">
                <image
                  href={`http://localhost:3000/img/Faction/${emblem.backgroundId}/background.png`}
                  width="200"
                  height="200"
                />
              </mask>
              <mask id="borderMask">
                <image
                  href={`http://localhost:3000/img/Faction/${emblem.backgroundId}/border.png`}
                  width="200"
                  height="200"
                />
              </mask>
              <mask id="iconMask">
                <image
                  href={`http://localhost:3000/img/Faction/icons/${emblem.iconId+1}.png`}
                  width="200"
                  height="200"
                />
              </mask>
              <mask id="iconBorderMask">
                <image
                  href={`http://localhost:3000/img/Faction/icons/${emblem.iconId+1}-1.png`}
                  width="200"
                  height="200"
                />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="200"
              height="200"
              fill={bgColor}
              mask="url(#backgroundMask)"
            />
            <rect
              x="0"
              y="0"
              width="200"
              height="200"
              fill={fgColor}
              mask="url(#foregroundMask)"
            />
            <rect
              x="0"
              y="0"
              width="200"
              height="200"
              fill={borderColor}
              mask="url(#borderMask)"
            />
            <rect
              x="0"
              y="0"
              width="200"
              height="200"
              fill={iconColor}
              mask="url(#iconMask)"
            />
            <rect
              x="0"
              y="0"
              width="200"
              height="200"
              fill={iconBorderColor}
              mask="url(#iconBorderMask)"
            />
          </svg>
        </div>
      ),
      {
        width: 200,
        height: 200,
      }
    );
  } catch (error) {
    console.error("Erreur lors de la génération de l'emblème:", error);

    return new ImageResponse(
      (
        <div
          style={{
            width: "200px",
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
            fontSize: "24px",
            color: "#333",
          }}
        >
          Erreur de génération
        </div>
      ),
      {
        width: 200,
        height: 200,
      }
    );
  }
}