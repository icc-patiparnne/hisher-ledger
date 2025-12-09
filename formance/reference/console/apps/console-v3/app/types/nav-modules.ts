import { TSidebarModuleItem, TSidebarModuleItemRoute } from '@platform/ui';
import { TModule } from '@platform/utils';

export type TNavModule = {
  isVisible: boolean;
  items: TSidebarModuleItemRoute[];
} & TSidebarModuleItem &
  TModule;
