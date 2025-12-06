import { ReactElement } from "react";

/**
 * Component that display the XP Calculator title and header description
 */
export function XpCalculatorTitlePage({ children }: { children: ReactElement[] }) {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-400">
            XP Calculator
          </h1>
          <p className="text-gray-400 mt-2">Calculez l&apos;xp nécessaire pour atteindre le niveau souhaité.</p>
        </header>
        {children}
      </div>
    </div>
  );
}