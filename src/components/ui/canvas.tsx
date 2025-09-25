import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface CanvasWithTextProps {
  text: string;
  className?: string;
  height?: number;
  width?: number;
}

// Thanks ChatGPT <3
const CanvasWithText: React.FC<CanvasWithTextProps> = ({ text, className, height, width }) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const fitTextToCanvas = () => {
      // Mettre à jour la largeur et la hauteur du canvas en fonction du parent ou des props
      canvas.width = width || canvas.parentElement?.clientWidth || 0;
      canvas.height = height || canvas.parentElement?.clientHeight || 0;

      const maxWidth = canvas.width - 20; // Margins

      // Initialiser la police avec une grande taille
      let fontSize = 20;
      const minFontSize = 10;
      context.font = `${fontSize}px Inter`;

      // Réduire la taille de la police jusqu'à ce que le texte tienne dans le canvas
      while (context.measureText(text).width > maxWidth && fontSize > minFontSize) {
        fontSize -= 1;
        context.font = `${fontSize}px Inter`;
      }

      // Si la taille de la police atteint 10 et que le texte ne tient toujours pas, on doit gérer les retours à la ligne
      const lines = [];
      if (fontSize === minFontSize && context.measureText(text).width > maxWidth) {
        let words = text.split(" ");
        let currentLine = "";

        for (let word of words) {
          let testLine = currentLine + word + " ";
          let testWidth = context.measureText(testLine).width;

          if (testWidth > maxWidth) {
            lines.push(currentLine.trim());
            currentLine = word + " ";
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine.trim()); // Push the last line
      } else {
        lines.push(text); // If text fits, keep it on one line
      }

      // Dessiner le texte ligne par ligne
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = theme === "dark" ? "white" : "black";

      const lineHeight = fontSize * 1.2;
      const totalTextHeight = lines.length * lineHeight;
      const yStart = (canvas.height - totalTextHeight) / 2; // Centrer verticalement

      lines.forEach((line, index) => {
        const x = canvas.width / 2;
        const y = yStart + index * lineHeight;
        context.fillText(line, x, y);
      });
    };

    // Mettre à jour la taille du canvas initialement et sur redimensionnement
    fitTextToCanvas();

    window.addEventListener("resize", fitTextToCanvas);
    return () => {
      window.removeEventListener("resize", fitTextToCanvas);
    };
  }, [text, theme, height, width]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      height={height}
      width={width}
    />
  );
};

export default CanvasWithText;
