import React from 'react';

import { cn, SidebarTrigger } from '@platform/ui';
import AppBreadcrumb from './app-breadcrumb';
import AppSnippetsSheet from './app-snippets-sheet';
import { usePageContext } from './contexts/page-context';

type AppContentProps = React.HTMLAttributes<HTMLDivElement>;

export function AppContentNav({ isMicroStack }: { isMicroStack: boolean }) {
  const { currentPage } = usePageContext();

  return (
    <div className="bg-background border-b mb-2">
      <AppContentGrid className="py-2 px-2">
        <div className="col-span-12">
          <div className="flex justify-between items-center">
            <div className="flex flex-1 items-center gap-2">
              <SidebarTrigger />
              <AppBreadcrumb breadcrumbs={currentPage.breadcrumbs} />
            </div>

            {!isMicroStack && <AppSnippetsSheet currentPage={currentPage} />}
          </div>
        </div>
      </AppContentGrid>
    </div>
  );
}

export function AppContentHeaderRoute({
  children,
  className,
}: AppContentProps) {
  return (
    <div
      className={cn(
        'sticky top-[var(--top-route-header)] [--top-route-header:3rem] z-10 py-2 rounded-b-md bg-muted-lighter w-full [&_+_*]:-mt-2 -mt-2',
        className
      )}
    >
      {children}
    </div>
  );
}

type TAppContentGridProps = React.HTMLAttributes<HTMLDivElement> & {
  withContainer?: boolean;
};

export function AppContentGrid({
  children,
  withContainer = true,
  className,
  ...props
}: TAppContentGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-12 gap-2 pt-2',
        withContainer && 'container',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
