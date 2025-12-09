import { useState } from 'react';

import { Kbd, Tabs, TabsList, TabsTrigger, useHotkeys } from '@platform/ui';

type TTabsSinglePageProps = {
  tabs: {
    label: string;
    value: string;
    shortcut?: string;
  }[];
  defaultValue?: string;
  onTabChange?: (value: string) => void;
  children?: React.ReactNode;
};

export default function TabsSinglePage({
  tabs,
  defaultValue,
  onTabChange,
  children,
}: TTabsSinglePageProps) {
  const [currentTab, setCurrentTab] = useState<string>(
    defaultValue ?? tabs[0]?.value ?? ''
  );

  // Set up keyboard shortcuts for tabs that have shortcuts defined
  useHotkeys(
    tabs
      .filter((tab) => tab.shortcut)
      .map((tab) => [
        tab.shortcut!,
        () => {
          setCurrentTab(tab.value);
          onTabChange?.(tab.value);
        },
      ])
  );

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    onTabChange?.(value);
  };

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      defaultValue={defaultValue}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex items-center gap-2"
          >
            {tab.label}
            {tab.shortcut && <Kbd>{tab.shortcut}</Kbd>}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
