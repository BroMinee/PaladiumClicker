"use client";
import React, { useState, JSX } from "react";
import { Card } from "../ui/card-v2";

/**
 * Tab section info
 * @param key - key of the section
 * @param label - name used of display
 * @param content - the content or a lambda creating the content
 */
export interface TabData<T extends string> {
  key: T;
  label: string;
  content: ((key: T) => JSX.Element);
}

interface TabButtonProps {
  tabKey: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface GenericSectionTabsProps<T extends string> {
  tabs: TabData<T>[];
  title?: string;
}

const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
      isActive
        ? "border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
    }`}
    role="tab"
    aria-selected={isActive}
  >
    {label}
  </button>
);

/**
 * Generic component to display clickable tabs, handle the content switch accordingly.
 * @params - the tabs information
 * @params - optional title
 */
export function GenericSectionTabs<T extends string>({ tabs, title }: GenericSectionTabsProps<T>) {
  const [activeTabKey, setActiveTabKey] = useState(tabs[0]?.key);

  const activeTabContent = tabs.find((tab) => tab.key === activeTabKey)?.content;

  if (tabs.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Aucune section disponible.
      </div>
    );
  }

  return (
    <Card className="p-6">
      {title && (
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          {title}
        </h2>
      )}

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-2 -mb-px" role="tablist">
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              tabKey={tab.key}
              label={tab.label}
              isActive={activeTabKey === tab.key}
              onClick={() => setActiveTabKey(tab.key)}
            />
          ))}
        </nav>
      </div>

      <div className="pt-4" role="tabpanel" aria-labelledby={activeTabKey}>
        {typeof activeTabContent === "function" ? activeTabContent(activeTabKey) : activeTabContent}
      </div>
    </Card>
  );
}