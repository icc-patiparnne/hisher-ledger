import { ChevronLeft, Clock } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  Button,
  cn,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FormanceIcon,
  Kbd,
  KbdGroup,
  ModuleIcon,
  useHotkeys,
} from '@platform/ui';

import { getModule } from '@platform/utils';

import { useLastVisited } from '../hooks/useLastVisited';
import { useRouteGuard } from '../hooks/useRouteGuard';
import { TNavModule } from '../types/nav-modules';
import {
  CONNECTIVITY_SEARCH_ROUTES,
  FLOWS_SEARCH_ROUTES,
  GLOBAL_SIDEBAR_ROUTES,
  LEDGER_SEARCH_ROUTES,
  RECONCILIATION_SEARCH_ROUTES,
  ROUTES,
  TRouteId,
  WALLETS_SEARCH_ROUTES,
} from '../utils/routes';

export default function DialogSearchAll({
  open,
  setOpen,
  activatedModules,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  activatedModules: TNavModule[];
}) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'search-all',
  });

  const navigate = useNavigate();
  const { visitedPages } = useLastVisited();
  const routes = ROUTES({ organizationId, stackId, region });

  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [pages, setPages] = useState<string[]>(['global']);
  const [showRecentlyVisited, setShowRecentlyVisited] = useState(false);

  const isNested = pages.length > 1;

  useHotkeys([
    [
      'mod+k',
      () => {
        setOpen(true);
        setShowRecentlyVisited(false);
      },
    ],
    [
      'shift+h',
      () => {
        setOpen(true);
        setShowRecentlyVisited(true);
      },
    ],
  ]);

  const handleSelect = (to: string) => {
    navigate(to);
    setOpen(false);
    setShowRecentlyVisited(false);
  };

  const selectModule = (module: string) => {
    setSelectedModule(module);
    setPages([...pages, module]);
    setSearch('');
  };

  const popPage = () => {
    setPages((prevPages) => {
      const newPages = [...prevPages];
      newPages.pop();
      setSelectedModule(
        newPages[newPages.length - 1] === 'global'
          ? null
          : newPages[newPages.length - 1] || null
      );

      return newPages;
    });
  };

  const resetState = () => {
    setSelectedModule(null);
    setPages(['global']);
    setSearch('');
    setShowRecentlyVisited(false);
  };

  const renderGlobalItems = () =>
    GLOBAL_SIDEBAR_ROUTES(organizationId, stackId, region).map((route) => (
      <CommandItem key={route.id} onSelect={() => handleSelect(route.to)}>
        {route.icon && <route.icon className="h-4 w-4" />}
        {route.title}
      </CommandItem>
    ));

  const renderActivatedModules = () =>
    activatedModules.map((module) => (
      <CommandItem
        key={module.displayName}
        onSelect={() => selectModule(module.displayName)}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2 text-base font-semibold">
          <ModuleIcon name={module.name} size="icon-md" />
          {module.displayName}
        </div>
      </CommandItem>
    ));

  const renderModuleItems = (module: string) => {
    switch (module) {
      case 'Ledger':
        return LEDGER_SEARCH_ROUTES(organizationId, stackId, region).map(
          (route) => (
            <CommandItem key={route.id} onSelect={() => handleSelect(route.to)}>
              {route.icon && <route.icon className="mr-2 h-4 w-4" />}
              {route.title}
            </CommandItem>
          )
        );
      case 'Connectivity':
        return CONNECTIVITY_SEARCH_ROUTES(organizationId, stackId, region).map(
          (route) => (
            <CommandItem key={route.id} onSelect={() => handleSelect(route.to)}>
              {route.icon && <route.icon className="mr-2 h-4 w-4" />}
              {route.title}
            </CommandItem>
          )
        );
      case 'Wallets':
        return WALLETS_SEARCH_ROUTES(organizationId, stackId, region).map(
          (route) => (
            <CommandItem key={route.id} onSelect={() => handleSelect(route.to)}>
              {route.icon && <route.icon className="mr-2 h-4 w-4" />}
              {route.title}
            </CommandItem>
          )
        );
      case 'Reconciliation':
        return RECONCILIATION_SEARCH_ROUTES(
          organizationId,
          stackId,
          region
        ).map((route) => (
          <CommandItem
            key={route.title}
            onSelect={() => handleSelect(route.to)}
          >
            {route.icon && <route.icon className="mr-2 h-4 w-4" />}
            {route.title}
          </CommandItem>
        ));
      case 'Flows':
        return FLOWS_SEARCH_ROUTES(organizationId, stackId, region).map(
          (route) => (
            <CommandItem key={route.id} onSelect={() => handleSelect(route.to)}>
              {route.icon && <route.icon className="mr-2 h-4 w-4" />}
              {route.title}
            </CommandItem>
          )
        );
      default:
        return null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isNested) {
      e.preventDefault();
      setTimeout(() => popPage(), 130); // Wait for the animation to complete
    }
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setTimeout(() => resetState(), 130);
        }
      }}
      className="max-w-screen-sm"
    >
      <DialogHeader className="p-3 border-b border-border">
        <div className="flex items-center justify-between gap-2 text-lg font-semibold leading-none tracking-tight">
          <div
            className={cn({
              'opacity-0': !isNested,
            })}
          >
            <Button variant="outline" size="icon-sm" onClick={popPage}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <DialogTitle>Search</DialogTitle>
          <DialogDescription className="sr-only">
            Search for a modules
          </DialogDescription>

          <div className="w-7 h-6" aria-hidden="true"></div>
        </div>
      </DialogHeader>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="What are you looking for?"
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {!selectedModule ? (
          <>
            {showRecentlyVisited ? (
              <CommandGroup heading="Recently Visited">
                {visitedPages.map((page) => {
                  const route = routes[page.routeId as TRouteId];
                  const isModule = route?.moduleName !== undefined;

                  const moduleInfo = route?.moduleName
                    ? getModule(route.moduleName)
                    : null;

                  return (
                    <CommandItem
                      key={page.url}
                      onSelect={() => handleSelect(page.url)}
                    >
                      {moduleInfo ? (
                        <ModuleIcon name={moduleInfo.name} size="icon-md" />
                      ) : (
                        <FormanceIcon className="w-5" />
                      )}
                      <div className="ml-1">
                        <div className="flex items-center gap-1">
                          {route?.moduleName && (
                            <span className="font-medium">
                              {moduleInfo?.displayName}
                            </span>
                          )}
                          <span className="truncate max-w-lg">
                            {isModule && ' / '}
                            {page.label}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : (
              <>
                <CommandGroup heading="Global">
                  <CommandItem
                    onSelect={() => setShowRecentlyVisited(true)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recently visited
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <KbdGroup>
                        <Kbd>⇧</Kbd>
                        <Kbd>H</Kbd>
                      </KbdGroup>
                    </div>
                  </CommandItem>
                  {renderGlobalItems()}
                </CommandGroup>

                <CommandGroup heading="Modules">
                  {renderActivatedModules()}
                </CommandGroup>
              </>
            )}
          </>
        ) : (
          <>
            <CommandGroup heading={selectedModule}>
              {renderModuleItems(selectedModule)}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
