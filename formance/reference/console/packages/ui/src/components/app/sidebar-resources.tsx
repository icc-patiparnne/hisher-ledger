import { EXTERNAL_LINKS } from '@platform/utils';
import {
  BookOpen,
  Code,
  Globe,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react';
import * as React from 'react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../sidebar';

export type TNavSecondaryItems = {
  title: string;
  icon: LucideIcon | React.ComponentType<any>;
  to: string;
};

type TSidebarResourcesProps = {
  items?: TNavSecondaryItems[];
  asRemixLink?: any;
};

export function SidebarResources({
  items,
  asRemixLink,
}: TSidebarResourcesProps) {
  const defaultItems: TNavSecondaryItems[] = [
    {
      title: 'Community Help',
      to: EXTERNAL_LINKS.COMMUNITY_HELP.to,
      icon: MessageCircle,
    },
    {
      title: 'Website',
      to: EXTERNAL_LINKS.WEBSITE.to,
      icon: Globe,
    },
    {
      title: 'Documentation',
      to: EXTERNAL_LINKS.DOCUMENTATION.to,
      icon: BookOpen,
    },
    {
      title: 'Numscript Playground',
      to: EXTERNAL_LINKS.NUMSCRIPT_PLAYGROUND.to,
      icon: Code,
    },
  ];

  const navItems = items ?? defaultItems;

  const Link = asRemixLink ?? 'a';

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Resources</SidebarGroupLabel>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={false}>
              <Link
                to={item.to}
                target="_blank"
                className="flex h-7 items-center gap-2.5 overflow-hidden rounded-md px-1.5 text-sm ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2"
              >
                <item.icon className="h-4 w-4 shrink-0 translate-x-0.5" />
                <div className="line-clamp-1 grow overflow-hidden pr-6">
                  {item.title}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
