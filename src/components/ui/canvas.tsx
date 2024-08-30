import React, { useEffect, useRef } from 'react';
import { useTheme } from "@/components/shared/ThemeProvider.tsx";

interface CanvasWithTextProps {
  text: string;
  className?: string;
  height?: number;
  width?: number;
}


// TODO: {...props}
const CanvasWithText: React.FC<CanvasWithTextProps> = ({ text, className, height, width }) => {
  const { theme } = useTheme();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas)
      return;

    canvas.width = width || canvas.parentElement?.clientWidth || 0;

    const context = canvas.getContext('2d');
    if (!context)
      return

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.font = '20px Inter';
    context.textAlign = 'center';
    context.textBaseline = 'middle';


    const x = canvas.width / 2;
    const y = canvas.height / 2;

    context.fillStyle = theme === "dark" ? 'white' : 'black';

    context.fillText(text, x, y);


  }, [text, theme]);

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