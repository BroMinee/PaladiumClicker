"use client";
import React, { useState, JSX, ReactNode, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

/**
 * Tab section info
 * @param key - key of the section
 * @param label - name used of display
 * @param content - the content or a lambda creating the content
 */
export interface TabData<T extends string> {
  key: T;
  label: ReactNode;
  content: ((key: T) => JSX.Element);
}

interface TabButtonProps {
  tabKey: string;
  label: ReactNode;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface GenericSectionTabsProps<T extends string> {
  tabs: TabData<T>[];
  title?: string;
  defaultTab?: T;
}

const TabButton: React.FC<TabButtonProps> = ({
  tabKey,
  label,
  isActive,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
      isActive
        ? "text-primary border-primary"
        : "border-transparent"
    }`}
    role="tab"
    aria-selected={isActive}
    data-key={tabKey}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {label}
  </button>
);

/**
 * Generic component to display clickable tabs, handle the content switch accordingly.
 * @params - the tabs information
 * @params - optional title
 * @params - optional default tab id
 */
export function GenericSectionTabs<T extends string>({ tabs, title, defaultTab }: GenericSectionTabsProps<T>) {
  const [activeTabKey, setActiveTabKey] = useState<T>(defaultTab ? (tabs.find((tab => defaultTab === tab.key))?.key ?? tabs[0]?.key ): tabs[0]?.key);

  const navRef = useRef<HTMLElement | null>(null);
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const nav = navRef.current;
      if (!nav) return;
      const targetKey = hoveredKey ?? activeTabKey;
      const activeEl = nav.querySelector(`[data-key="${targetKey}"]`) as HTMLElement | null;
      if (!activeEl) {
        setIndicatorLeft(0);
        setIndicatorWidth(0);
        return;
      }
      const navRect = nav.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setIndicatorLeft(elRect.left - navRect.left);
      setIndicatorWidth(elRect.width);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeTabKey, tabs, hoveredKey]);

  const activeTabContent = tabs.find((tab) => tab.key === activeTabKey)?.content;

  if (tabs.length === 0) {
    return (
      <div className="text-center py-4">
        Aucune section disponible.
      </div>
    );
  }

  return (
    <Card className="p-6">
      {title && (
        <h2 className="text-2xl font-semibold mb-4 dark:">
          {title}
        </h2>
      )}

      <div className="border-b border-secondary-foreground dark:border-secondary mb-6">
        <nav ref={(el) => { navRef.current = el; }} className="relative flex space-x-2 -mb-px flex-wrap" role="tablist">
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              tabKey={tab.key}
              label={tab.label}
              isActive={activeTabKey === tab.key}
              onClick={() => setActiveTabKey(tab.key)}
              // hover handlers: move indicator only
              onMouseEnter={() => setHoveredKey(tab.key)}
              onMouseLeave={() => setHoveredKey(null)}
            />
          ))}

          <div
            aria-hidden
            className="absolute bottom-0 h-[2px] bg-primary rounded"
            style={{
              transform: `translateX(${indicatorLeft}px)`,
              width: `${indicatorWidth}px`,
              transition: 'transform 300ms cubic-bezier(.2,.8,.2,1), width 300ms cubic-bezier(.2,.8,.2,1)'
            }}
          />
        </nav>
      </div>


      <div className="pt-4" role="tabpanel" aria-labelledby={activeTabKey}>
        {typeof activeTabContent === "function" ? activeTabContent(activeTabKey) : activeTabContent}
      </div>
    </Card>
  );
}