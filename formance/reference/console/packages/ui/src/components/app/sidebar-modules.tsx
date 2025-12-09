import { ChevronRight } from 'lucide-react';
import React from 'react';

import { cn } from '../../lib/utils';
import { Button } from '../button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../collapsible';

import { TModule } from '@platform/utils';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../sidebar';
import { ModuleIcon } from './modules/module-icon';

export type TSidebarModules = {
  items: TSidebarModuleItem[];
  asRemixLink?: any;
} & React.ComponentPropsWithoutRef<'ul'>;

export type TSidebarModuleItem = Pick<TModule, 'name' | 'displayName'> & {
  isDefaultOpen: boolean;
  isActivated: boolean;
  to?: string;
  icon: React.ElementType;
  items?: TSidebarModuleItemRoute[];
};

export type TSidebarModuleItemRoute = {
  title: string;
  to: string;
  icon?: React.ElementType;
  description?: string;
};

function ModuleContent({ item }: { item: TSidebarModuleItem }) {
  return (
    <>
      <div className="flex items-center gap-2 cursor-pointer">
        <ModuleIcon name={item.name} size="icon-sm" />
        <span className="font-semibold text-base text-foreground">
          {item.displayName}
        </span>
      </div>
      {item.items && item.isActivated && (
        <>
          <Button
            variant="ghost"
            className="h-6 w-6 rounded-md p-0 ring-ring transition-all focus-visible:ring-2 group-data-[state=open]/collapsible:rotate-90"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </>
      )}
    </>
  );
}

export function SidebarModules({
  className,
  items,
  asRemixLink,
}: TSidebarModules) {
  const Link = asRemixLink ?? 'a';

  return (
    <SidebarGroup className={className}>
      <SidebarGroupLabel>Modules</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            defaultOpen={item.isActivated ? item.isDefaultOpen : false}
            className="group/collapsible"
            key={item.displayName}
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton asChild>
                  {item.to && !item.isActivated ? (
                    <Link
                      {...(asRemixLink ? { to: item.to } : { href: item.to })}
                      className={cn('flex items-center justify-between')}
                    >
                      <ModuleContent item={item} />
                    </Link>
                  ) : (
                    <div className={cn('flex items-center justify-between')}>
                      <ModuleContent item={item} />
                    </div>
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>

              {item.items?.length && item.isActivated ? (
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <SidebarMenuSub className="ml-5">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={false}>
                          <Link
                            {...(asRemixLink
                              ? { to: subItem.to }
                              : { href: subItem.to })}
                            className="flex items-center gap-2"
                          >
                            {subItem.icon && (
                              <subItem.icon className="h-4 w-4" />
                            )}
                            {subItem.title}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
