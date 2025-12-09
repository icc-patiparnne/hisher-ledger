import { Info, LayoutList } from 'lucide-react';
import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import {
  AppContentGrid,
  AppContentHeaderRoute,
} from '../../../../../../components/app-content';
import AppErrorBoundary from '../../../../../../components/app-error-boundary';
import { useRouteGuard } from '../../../../../../hooks/useRouteGuard';
import { withContext } from '../../../../../../utils/auth.server';
import { ROUTES } from '../../../../../../utils/routes';
import {
  NormalizedGetConnectorResponse,
  NormalizedGetConnectorTaskInstancesResponse,
  NormalizedGetConnectorTaskResponse,
} from '../../../../../../utils/sdk/payments/responses';
import { NormalizedSDK } from '../../../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../../../utils/session.auth.server';

import { Connector } from '@platform/sdks/formance/src/models/components';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Chip,
  chipVariantFromType,
  ConnectorIcon,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  PreviewJson,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@platform/ui';
import {
  formatDate,
  MODULES_GATEWAYS,
  MODULES_NAMES,
  padNumber,
} from '@platform/utils';

import { Cursor } from '@platform/sdks/utils/cursor';
import { FEATURES } from '../../../../../../hooks/useFeatureFlag';
import { useRouteUpdate } from '../../../../../../hooks/useRouteUpdate';
import {
  NormalizedConnectorDataModel,
  NormalizedConnectorTaskModel,
  NormalizedConnectorTaskScheduleInstanceModel,
} from '../../../../../../utils/sdk/payments/models';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../../../utils/session.gateway.server';
import ConnectorHeader from '../../../components/connector-header';
import ConnectorsTaskInstancesList from '../../../components/connectors-task-instances-list';
import { v1Loader } from './task.v1';

export type Data = {
  connector: NormalizedGetConnectorResponse;
  task: NormalizedGetConnectorTaskResponse | undefined;
  instances: NormalizedGetConnectorTaskInstancesResponse;
};

type LoaderData = LoaderWrapperProps<{
  connector: { data: NormalizedConnectorDataModel };
  task: { data: NormalizedConnectorTaskModel };
  instances: { cursor: Cursor<NormalizedConnectorTaskScheduleInstanceModel> };
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const connectorId = params.connectorId;
  invariant(connectorId, 'params.connectorId is required');
  const taskId = params.taskId;
  invariant(taskId, 'params.taskId is required');
  const provider = new URL(request.url).searchParams.get('provider');
  invariant(provider, 'provider is required');

  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.PAYMENTS
      );

      switch (version) {
        case '3': {
          return wrapLoaderWithProps<Data>(
            await v1Loader(api, connectorId, taskId, provider),
            version
          );
        }
        default:
          return wrapLoaderWithProps<Data>(
            await v1Loader(api, connectorId, taskId, provider),
            version
          );
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.PAYMENTS],
    FEATURES.payments
  )) as LoaderData;
};

export default function ConnectorTask() {
  const { organizationId, stackId, region, connectorId, taskId, provider } =
    useRouteGuard({
      componentName: 'connector-task',
      requiredParams: ['connectorId', 'taskId'],
      requiredSearchParams: ['provider'],
    });

  const { connector, task, instances, version } =
    useLoaderData<LoaderData>() as unknown as LoaderData;

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_CONNECTOR_INSTALLED_TASKS_DETAIL',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'Installed Connectors',
        to: ROUTES({ organizationId, stackId, region })[
          'CONNECTIVITY_CONNECTORS_INSTALLED'
        ].to,
      },
      { title: connector?.data?.name || connectorId },
      { title: taskId },
    ],
  });

  return (
    <AppContentGrid>
      <AppContentHeaderRoute className="col-span-12 grid grid-cols-12 bg-muted-lighter gap-2">
        <div className="lg:col-span-5 col-span-12">
          <ConnectorHeader connector={connector?.data} showActions={false} />
        </div>

        <div className="lg:col-span-7 col-span-12">
          <ConnectorTaskHeader task={task?.data} />
        </div>
      </AppContentHeaderRoute>

      <Card className="col-span-12">
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>

        <CardContent>
          <DescriptionList>
            <DescriptionTerm>Provider</DescriptionTerm>
            <DescriptionDetails>
              {provider && (
                <div className="flex items-center gap-1.5">
                  <ConnectorIcon name={provider as unknown as Connector} />
                  <span className="font-medium capitalize">
                    {provider.toLowerCase()}
                  </span>
                </div>
              )}
            </DescriptionDetails>

            <DescriptionTerm>Connector Name</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromType['name']}
                label={connector?.data?.name}
                maxWidth="xl"
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Connector ID</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromType['id']}
                label={connectorId}
                maxWidth="xl"
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Task ID</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromType['id']}
                label={task?.data.id}
                maxWidth="xl"
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Created At</DescriptionTerm>
            <DescriptionDetails>
              <span className="whitespace-nowrap">
                {task?.data.createdAt ? formatDate(task?.data.createdAt) : '-'}
              </span>
            </DescriptionDetails>
          </DescriptionList>
        </CardContent>
      </Card>

      <ConnectorsTaskInstancesList
        className="col-span-12"
        instances={instances.cursor}
        version={version}
      />
    </AppContentGrid>
  );
}

function ConnectorTaskHeader({ task }: { task: NormalizedConnectorTaskModel }) {
  return (
    <Card data-header="connector-task">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="mint" size="icon-md" notClickable>
                <LayoutList />
              </Button>
              <CardTitle>Task</CardTitle>
            </div>
            <div className="min-w-0 flex-1">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Chip
                  {...chipVariantFromType['id']}
                  label={padNumber(task?.id.toString())}
                  maxWidth="lg"
                  copyMode="click"
                />
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon-md">
                  <Info />
                </Button>
              </SheetTrigger>
              <SheetContent className="lg:w-[700px] sm:max-w-none flex flex-col">
                <SheetHeader>
                  <SheetTitle>Information</SheetTitle>
                  <SheetDescription>
                    Information about the task
                  </SheetDescription>
                </SheetHeader>

                <Separator className="my-4" />

                <div className="overflow-y-scroll flex-1 no-scrollbar p-4">
                  <PreviewJson json={task ?? {}} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
