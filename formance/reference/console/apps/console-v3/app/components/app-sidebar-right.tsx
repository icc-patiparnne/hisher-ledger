import { Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Button,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@platform/ui';
import { useMigrateFavorites } from '../hooks/useFavorites';
import { CurrentContext } from '../root';
import AppFavorites from './app-favorites';

const toolItems = [
  {
    title: 'Favorites',
    icon: Bookmark,
    id: 'favorites',
  },
];

type TAppSidebarRight = {
  context: CurrentContext;
};

export function AppSidebarRight({ context }: TAppSidebarRight) {
  const [activeItem, setActiveItem] = useState<(typeof toolItems)[0] | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  const { migrateFavorites } = useMigrateFavorites();

  // Execute favorites migration once when component mounts
  useEffect(() => {
    migrateFavorites();
  }, [migrateFavorites]);

  const renderActiveContent = () => {
    switch (activeItem?.id) {
      case 'favorites':
        return <AppFavorites context={context} />;
      default:
        return (
          <div className="p-4 text-sm text-muted-foreground">
            Select a tool to get started
          </div>
        );
    }
  };

  const handleIconClick = (item: (typeof toolItems)[0]) => {
    if (activeItem?.id === item.id && isOpen) {
      // If clicking the same active item and panel is open, close it
      setIsOpen(false);
    } else {
      // If clicking a different item or panel is closed, open it with the new item
      setActiveItem(item);
      setIsOpen(true);
    }
  };

  return (
    <div className="fixed right-0 top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 flex">
      {isOpen && (
        <div className="h-full w-[600px] 2xl:w-[1200px]">
          <ResizablePanelGroup
            autoSaveId="app-sidebar-right"
            direction="horizontal"
            className="h-full"
          >
            <ResizablePanel defaultSize={20} minSize={5} maxSize={60} />
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={80}
              minSize={40}
              maxSize={95}
              className="bg-sidebar border-l flex flex-col overflow-hidden"
            >
              <div className="h-12 border-b p-4 flex items-center">
                <div className="text-foreground text-base font-medium">
                  {activeItem?.title}
                </div>
              </div>
              <div className="flex-1 overflow-auto no-scrollbar">
                {renderActiveContent()}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}

      <div className="w-[calc(var(--sidebar-width-icon)+1px)] bg-sidebar border-l flex flex-col">
        <div className="flex-1 gap-2 flex flex-col p-2">
          {toolItems.map((item) => (
            <Button
              key={item.title}
              onClick={() => handleIconClick(item)}
              title={item.title}
              size="icon-md"
              variant="outline"
              data-active={activeItem?.title === item.title && isOpen}
            >
              <item.icon />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
