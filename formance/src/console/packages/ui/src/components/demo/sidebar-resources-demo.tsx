import { SidebarResources } from '../app/sidebar-resources';
import { SidebarProvider } from '../sidebar';

export function SidebarResourcesDemo() {
  return (
    <SidebarProvider>
      <SidebarResources />
    </SidebarProvider>
  );
}
