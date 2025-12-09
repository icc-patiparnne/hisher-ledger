'use client';

import { Ellipsis } from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '../button';
import { DropdownMenu, DropdownMenuTrigger } from '../dropdown-menu';

// TODO @alessandro: why _TData

interface DataTableRowActionsProps<_TData> {
  children: ReactNode;
}
export function DataTableRowActions<TData>({
  children,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      {children}
    </DropdownMenu>
  );
}
