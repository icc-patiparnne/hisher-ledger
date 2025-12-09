import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from '../sidebar';

import {
  SidebarModules,
  SidebarResources,
  TNavSecondaryItems,
  TSidebarModuleItem,
} from '../app';
import { FormanceLogo } from '../formance-logo';

export function AppLayoutDemo({
  navModules,
  navSecondary,
}: {
  navModules: TSidebarModuleItem[];
  navSecondary: TNavSecondaryItems[];
}) {
  return (
    <SidebarProvider>
      <Sidebar variant="floating">
        <SidebarHeader className="flex flex-row items-center justify-between p-3">
          <FormanceLogo className="w-32" />
        </SidebarHeader>

        <SidebarContent>
          <SidebarModules items={navModules} />
          <SidebarResources items={navSecondary} />
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
      </Sidebar>
      <div className="p-3">Outlet here</div>
    </SidebarProvider>
  );
}
