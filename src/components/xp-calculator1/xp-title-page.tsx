import { ReactElement } from "react";

/**
 * Component that display the XP Calculator title and header description
 */
export function XpCalculatorTitlePage({ children }: { children: ReactElement[] }) {
  return (
    <>
        <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-400">
                XP Calculator
            </h1>
            <p className="text-gray-400 mt-2">Calculez l&apos;xp nécessaire pour atteindre le niveau souhaité.</p>
        </header>
        {children}
    </>
  );
}