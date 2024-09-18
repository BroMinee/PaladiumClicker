'use client'


import React, { useState } from "react";

export default function HoverText({ text, children } : { text: string, children: React.ReactNode }) {
  const [showText, setShowText] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseOver = () => {
    setShowText(true);
  };

  const handleMouseOut = () => {
    setShowText(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setPosition({ x: e.clientX + 10, y: e.clientY - 30 });
  };


  return (<>
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onMouseMove={handleMouseMove}>
      {children}
    </div>
    {showText && (
      <div style={{ top: position.y, left: position.x, zIndex: 1 }} className="fixed bg-primary rounded-md p-1">
        {text}
      </div>
    )}
  </>)
}
