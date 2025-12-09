import { Tabs, TabsList, TabsTrigger, useHotkeys } from '@platform/ui';
import { Kbd } from '@platform/ui/components/kbd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { usePageContext } from './contexts/page-context';

type TTabsNavigationProps = {
  tabs: {
    label: string;
    value: string;
    routeId: string;
    route: string;
    shortcut?: string;
    disabled?: boolean;
    customContent?: React.ReactNode;
  }[];
};

export default function TabsNavigation({ tabs }: TTabsNavigationProps) {
  const [currentTab, setCurrentTab] = useState<string>(tabs[0]?.value ?? '');
  const navigate = useNavigate();
  const pageContext = usePageContext();

  // Set up keyboard shortcuts for tabs that have shortcuts defined
  useHotkeys(
    tabs
      .filter((tab) => tab.shortcut)
      .map((tab) => [tab.shortcut!, () => navigate(tab.route)])
  );

  useEffect(() => {
    setCurrentTab(pageContext.currentPage?.routeId ?? '');
  }, [pageContext.currentPage]);

  return (
    <Tabs
      value={currentTab}
      onValueChange={(value) =>
        navigate(tabs.find((tab) => tab.routeId === value)?.route ?? '')
      }
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.routeId}
            className="flex items-center gap-2"
            disabled={tab.disabled}
          >
            {tab.label}
            {tab.customContent}
            {tab.shortcut && <Kbd>{tab.shortcut}</Kbd>}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
