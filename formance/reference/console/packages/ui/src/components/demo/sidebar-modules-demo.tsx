import { SidebarModules, TSidebarModuleItem } from '../app/sidebar-modules';
import { SidebarProvider } from '../sidebar';

export function SidebarModulesDemo({ items }: { items: TSidebarModuleItem[] }) {
  return (
    <SidebarProvider>
      <SidebarModules items={items} />
    </SidebarProvider>
  );
}
