import { ReactElement } from "react";

/**
 * Component that display the XP Calculator title and header description
 */
export function XpCalculatorTitlePage({ children }: { children: ReactElement[] }) {
  return (
    <>
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-2">
          XP Calculator
        </h1>
        <p className="text-card-foreground mt-2">Calculez l&apos;xp nécessaire pour atteindre le niveau souhaité.</p>
      </header>
      {children}
    </>
  );
}