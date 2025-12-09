import { AppCard, Button, CardFooter, CardModules, cn } from '@platform/ui';
import { Blocks } from 'lucide-react';
import { Link, LoaderFunction, useOutletContext } from 'react-router';

import { AppContentGrid } from '../components/app-content';
import AppErrorBoundary from '../components/app-error-boundary';
import { useMicroStack } from '../hooks/useMicroStack';
import { useModules } from '../hooks/useModules';
import { usePortal } from '../hooks/usePortal';
import { useRouteGuard } from '../hooks/useRouteGuard';
import { useRouteUpdate } from '../hooks/useRouteUpdate';
import { CurrentContext } from '../root';
import { withContext } from '../utils/auth.server';
import { getAuthenticator } from '../utils/session.auth.server';
import { LoaderData } from './ledger/transactions';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    () => true,
    authenticator,
    request
  )) as LoaderData;
};

export default function Index() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'overview',
  });

  useRouteUpdate({
    routeId: 'GLOBAL_OVERVIEW',
    breadcrumbs: [
      {
        title: 'Overview',
      },
    ],
  });

  const context = useOutletContext<CurrentContext>();

  const { redirectToPortal } = usePortal({ organizationId, stackId });

  const { isMicroStack } = useMicroStack(context);

  const { visibleModuleServices, visiblePlatformServices } = useModules({
    organizationId,
    stackId,
    region,
    context,
  });

  const hasPlatformServices = visiblePlatformServices.length > 0;

  return (
    <div>
      <AppContentGrid>
        <AppCard
          className={cn('col-span-12 2xl:col-span-8', {
            '2xl:col-span-12': !hasPlatformServices,
          })}
          title="Modules"
          description="Modules are the building blocks of your platform."
          appIcon={Blocks}
          footer={
            <>
              {!isMicroStack && (
                <CardFooter
                  className="flex justify-between gap-2"
                  variant="isInformative"
                >
                  <p>Manage your modules from Portal</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={redirectToPortal}
                  >
                    Go to Portal
                  </Button>
                </CardFooter>
              )}
            </>
          }
        >
          <div className="grid grid-cols-12 gap-2">
            {visibleModuleServices.map((module) => {
              const moduleVersion = context?.gateway?.servicesVersion?.find(
                (v) => v.name === module.gateway
              )?.version;

              return (
                <div
                  className={cn('h-full col-span-12 xl:col-span-4', {
                    'xl:col-span-6': hasPlatformServices,
                  })}
                  key={module.name}
                >
                  <CardModules
                    module={{
                      ...module,
                      to: module.items?.[0]?.to ?? '#',
                      version: moduleVersion ?? null,
                      enabled: module.isActivated,
                    }}
                    asRemixLink={Link}
                  />
                </div>
              );
            })}
          </div>
        </AppCard>

        {hasPlatformServices && (
          <AppCard
            className="col-span-12 2xl:col-span-4"
            title="Platform"
            description="Platform services available on top of your stack."
            appIcon={Blocks}
          >
            <div className="grid grid-cols-12 gap-2">
              {visiblePlatformServices.map((platformService) => (
                <div
                  className="h-full col-span-12 xl:col-span-6 2xl:col-span-12"
                  key={platformService.name}
                >
                  <CardModules
                    module={{
                      ...platformService,
                      to: platformService.to ?? '#',
                      enabled: platformService.isActivated,
                    }}
                    asRemixLink={Link}
                  />
                </div>
              ))}
            </div>
          </AppCard>
        )}
      </AppContentGrid>
    </div>
  );
}
