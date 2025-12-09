import { Home, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import {
  Button,
  Kbd,
  KbdGroup,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarModules,
  SidebarRail,
  SidebarSeparator,
} from '@platform/ui';

import { useModules } from '../hooks/useModules';
import { CurrentContext } from '../root';
import { ROUTES } from '../utils/routes';
import DialogSearchAll from './dialog-search-all';

type TAppSidebarProps = {
  context: CurrentContext;
};

export function AppSidebarLeft({ context }: TAppSidebarProps) {
  const { organizationId, stackId, region } = context;

  const [openSearch, setOpenSearch] = useState(false);

  const { visibleModuleServices } = useModules({
    organizationId,
    stackId,
    region,
    context,
  });

  return (
    <Sidebar collapsible="offcanvas" className="sm:top-[var(--header-height)]">
      <SidebarContent className="no-scrollbar pb-12">
        <SidebarGroup className="space-y-2">
          <SidebarGroupContent className="pt-2">
            <SidebarMenuButton asChild>
              <Button
                variant="outline"
                className="w-full justify-start flex items-center gap-2 mr-auto"
                onClick={() => setOpenSearch(true)}
              >
                <Search className="w-4 h-4" />
                Search
                <KbdGroup className="ml-auto">
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </Button>
            </SidebarMenuButton>
          </SidebarGroupContent>
          <SidebarGroupContent className="pb-2">
            <SidebarMenuButton asChild>
              <Button variant="outline" className="w-full justify-start">
                <Link
                  to={
                    ROUTES({ organizationId, stackId, region })[
                      'GLOBAL_OVERVIEW'
                    ].to
                  }
                  className="flex items-center gap-2 mr-auto w-full"
                >
                  <Home className="w-4 h-4" />
                  {
                    ROUTES({ organizationId, stackId, region })[
                      'GLOBAL_OVERVIEW'
                    ].title
                  }
                </Link>
              </Button>
            </SidebarMenuButton>
          </SidebarGroupContent>

          <SidebarSeparator className="mx-0" />
        </SidebarGroup>

        <SidebarModules items={visibleModuleServices} asRemixLink={Link} />
      </SidebarContent>

      <DialogSearchAll
        open={openSearch}
        setOpen={setOpenSearch}
        activatedModules={visibleModuleServices}
      />
      <SidebarRail />
    </Sidebar>
  );
}
