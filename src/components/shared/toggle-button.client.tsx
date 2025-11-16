"use client";
import React, { ReactNode } from "react";
import { Button } from "../ui/button-v2";

const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>;

interface ToggleCardButtonProps {
  children: ReactNode;
  isToggled: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Toggle button with a Check Icon
 * @param children - Content of the button
 * @param isToggled - Boolean
 * @param onToggle - function to switch the toggle
 * @param className - optinal className on the button
 */
export function ToggleCardButton({
  children,
  isToggled,
  onToggle,
  className = "",
}: ToggleCardButtonProps) {
  const toggleClasses = isToggled
    ? "bg-indigo-500/30 border border-indigo-500 text-white"
    : "bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700";

  return (
    <Button
      onClick={onToggle}
      className={`relative p-3 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-150 ${toggleClasses} ${className}`}
    >
      {isToggled && (
        <div className="absolute top-1 right-1 bg-indigo-500 rounded-full p-0.5 z-10">
          <IconCheck />
        </div>
      )}
      {children}
    </Button>
  );
}