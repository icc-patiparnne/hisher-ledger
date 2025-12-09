import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router';

import {
  Button,
  cn,
  ComboboxHotkey,
  Input,
  ModuleIcon,
  SeparatorVertical,
  TooltipProvider,
} from '@platform/ui';
import { TModule, TModuleName } from '@platform/utils';
import { ArrowRightIcon } from 'lucide-react';
import { useModules } from '../hooks/useModules';
import { useRouteGuard } from '../hooks/useRouteGuard';
import { CurrentContext } from '../root';
import { TRouteParamsWithSearchParams, TSearchParams } from '../types/routes';
import { ROUTES, ROUTES_WITH_PARAMS, TRouteId } from '../utils/routes';
import { usePageContext } from './contexts/page-context';

export type AppGoToProps = {
  fromSearch?: boolean;
};

export default function AppGoTo({ fromSearch = false }: AppGoToProps) {
  const { organizationId, stackId, region, ...otherParams } = useRouteGuard({
    componentName: 'app-go-to',
  });

  const [searchParams] = useSearchParams();
  const { currentPage } = usePageContext();
  const navigate = useNavigate();
  const context = useOutletContext<CurrentContext>();

  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedRouteId, setSelectedRouteId] = useState<string>();

  const { allActivatedModules } = useModules({
    organizationId,
    stackId,
    region,
    context,
  });

  const moduleOptions = allActivatedModules
    .filter((module) => module.type === 'MODULE')
    .map((module) => ({
      value: module.name,
      label: module.displayName,
      icon: module.icon,
    }));

  const routeOptions = ROUTES_WITH_PARAMS(
    organizationId,
    stackId,
    region,
    selectedModule as TModule['name']
  ).map((route) => ({
    value: route.id,
    label: route.title,
    icon: route.icon,
  }));

  // === TARGET ROUTE CALCULATION ===
  const targetRouteId = (
    fromSearch
      ? selectedRouteId || 'GLOBAL_OVERVIEW'
      : selectedRouteId || currentPage?.routeId || 'GLOBAL_OVERVIEW'
  ) as TRouteId;

  const routes = ROUTES({ organizationId, stackId, region });
  const targetRoute = routes[targetRouteId];
  const requiredParams = targetRoute?.params?.map((p) => p as string) || [];

  // === INPUT VALUES MANAGEMENT ===
  // Get default values from current route context
  const defaultInputValues = useMemo(() => {
    const validSearchParams: (keyof TSearchParams)[] = ['provider'];
    const availableSearchParams = Array.from(searchParams.keys()).filter(
      (key) => validSearchParams.includes(key as keyof TSearchParams)
    );

    const allParamKeys = new Set([
      ...requiredParams,
      ...Object.keys(otherParams),
      ...availableSearchParams,
    ]);

    const values: Record<string, string> = {};
    for (const key of allParamKeys) {
      const fromRoute = otherParams[key as keyof typeof otherParams] as string;
      const fromSearch = searchParams.get(key);
      values[key] = fromRoute || fromSearch || '';
    }

    return values;
  }, [requiredParams, otherParams, searchParams]);

  // User input overrides
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});

  // Reset user inputs when navigating to different routes
  useEffect(() => {
    setUserInputs({});
  }, [organizationId, stackId, region, JSON.stringify(otherParams)]);

  if (!targetRoute) {
    return null;
  }

  // Current values = defaults + user changes
  const currentInputValues = { ...defaultInputValues, ...userInputs };

  const handleInputChange = (key: string, value: string) => {
    setUserInputs((prev) => ({ ...prev, [key]: value }));
  };

  const areAllInputsFilled = () =>
    requiredParams.every((param) => currentInputValues[param]);

  const handleGoTo = () => {
    if (!areAllInputsFilled()) return;

    const routeParams: Partial<TRouteParamsWithSearchParams> = {
      organizationId,
      stackId,
      region,
      ...otherParams,
    };

    // Add values from input fields
    requiredParams.forEach((param) => {
      routeParams[param as keyof TRouteParamsWithSearchParams] =
        currentInputValues[param];
    });

    const targetUrl = ROUTES(routeParams)[targetRouteId]?.to;
    if (targetUrl) {
      navigate(targetUrl);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && areAllInputsFilled()) {
      handleGoTo();
    }
  };

  const formatParamLabel = (param: string): string =>
    param
      .replace(/([A-Z])/g, ' $1') // Add space before capitals
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

  return (
    <div
      className={cn('items-center gap-2 hidden lg:flex', {
        'px-2 justify-center w-full': !fromSearch,
      })}
    >
      {fromSearch && (
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <div>
              <ComboboxHotkey
                hotkey="m"
                label="Select module"
                tooltipText="Choose a module"
                items={moduleOptions}
                onChange={(value) => {
                  setSelectedModule(value);
                  setSelectedRouteId('');
                }}
                defaultValue={selectedModule}
              />
            </div>

            <div>
              <ComboboxHotkey
                key={`resource-${selectedModule}`}
                hotkey="r"
                label="Select resource"
                tooltipText="Choose a resource"
                items={routeOptions}
                onChange={(value) => {
                  setSelectedRouteId(value);
                }}
                disabled={!selectedModule}
              />
            </div>
          </div>
        </TooltipProvider>
      )}

      {requiredParams.length > 0 && (
        <>
          <div className="flex justify-center flex-1">
            <div className="flex flex-1 justify-center items-center gap-1">
              <div className="flex items-center gap-1">
                {/* Module Icon - only when NOT from search */}
                {!fromSearch && (
                  <ModuleIcon
                    name={targetRoute?.moduleName as TModuleName}
                    size="icon-sm"
                  />
                )}

                {/* Input Fields with Separators */}
                {requiredParams.map((param, index) => (
                  <Fragment key={param as string}>
                    <Input
                      className={cn(
                        'max-w-none',
                        requiredParams.length === 1 ? 'w-96' : 'xl:w-64'
                      )}
                      placeholder={`Enter ${formatParamLabel(
                        param as string
                      ).toLowerCase()}...`}
                      value={currentInputValues[param as string] || ''}
                      onChange={(e) =>
                        handleInputChange(param as string, e.target.value)
                      }
                      onKeyDown={handleKeyDown}
                      size="sm"
                    />

                    {/* Separator between inputs (not after last input) - only when NOT from search */}
                    {!fromSearch && index < requiredParams.length - 1 && (
                      <SeparatorVertical className="text-muted-foreground/30" />
                    )}
                  </Fragment>
                ))}
              </div>

              <div>
                <Button
                  onClick={handleGoTo}
                  disabled={!areAllInputsFilled()}
                  size="icon-sm"
                >
                  <ArrowRightIcon />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
