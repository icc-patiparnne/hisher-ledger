import { Info, ListCheck } from 'lucide-react';
import { Link, LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { formatDate, MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';

import {
  AppCard,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Chip,
  chipVariantFromType,
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
  AppContentGrid,
  AppContentHeaderRoute,
} from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { badgeVariantFromFlowsInstanceStatus } from '../../../../components/badge';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedInstanceModel } from '../../../../utils/sdk/flows/models';
import { NormalizedGetInstanceResponse } from '../../../../utils/sdk/flows/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import WorkflowHeader from '../../components/workflow-header';
import { v2Loader } from './instance.v2';

export type Data = {
  instance: NormalizedGetInstanceResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  instance: { data: NormalizedInstanceModel };
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.instanceId, 'params.instanceId is required');
  const instanceId = params.instanceId;

  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.ORCHESTRATION
      );

      return wrapLoaderWithProps<Data>(
        await v2Loader(api, instanceId),
        version
      );
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.ORCHESTRATION],
    FEATURES.orchestration
  )) as LoaderData;
};

export default function Instance() {
  useFeatureFlag(FEATURES.orchestration);

  const { organizationId, stackId, region, workflowId, instanceId } =
    useRouteGuard({
      componentName: 'instance',
      requiredParams: ['workflowId', 'instanceId'],
    });

  useRouteUpdate({
    moduleName: MODULES_NAMES.FLOWS,
    routeId: 'FLOWS_INSTANCE_DETAIL',
    breadcrumbs: [
      {
        title: 'Flows',
      },
      {
        title: 'All Instances',
        to: ROUTES({ organizationId, stackId, region })['FLOWS_INSTANCES'].to,
      },
      {
        title: instanceId,
        to: ROUTES({
          organizationId,
          stackId,
          region,
          workflowId,
          instanceId,
        })['FLOWS_INSTANCE_DETAIL'].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  return (
    <AppContentGrid>
      <AppContentHeaderRoute className="col-span-12 grid grid-cols-12 gap-2">
        <div className="lg:col-span-5 col-span-12">
          <WorkflowHeader />
        </div>

        <div className="lg:col-span-7 col-span-12">
          <InstanceHeader
            instance={data.instance as unknown as NormalizedInstanceModel}
          />
        </div>
      </AppContentHeaderRoute>

      <AppCard title="Information" className="col-span-12">
        <DescriptionList>
          <DescriptionTerm>Instance ID</DescriptionTerm>
          <DescriptionDetails>
            <Chip
              {...chipVariantFromType['id']}
              label={data.instance.data.id}
              maxWidth="xl"
              copyMode="click"
            />
          </DescriptionDetails>
          <DescriptionTerm>Workflow ID</DescriptionTerm>
          <DescriptionDetails>
            <Link
              to={
                ROUTES({
                  organizationId,
                  stackId,
                  region,
                  workflowId: data.instance.data.workflowID,
                })['FLOWS_WORKFLOW_DETAIL'].to
              }
            >
              <Chip
                {...chipVariantFromType['id']}
                label={data.instance.data.workflowID}
              />
            </Link>
          </DescriptionDetails>
          <DescriptionTerm>Status</DescriptionTerm>
          <DescriptionDetails>
            <Badge
              variant={
                badgeVariantFromFlowsInstanceStatus[
                  data.instance.data.terminated ? 'TERMINATED' : 'IN_PROGRESS'
                ]
              }
            >
              {data.instance.data.terminated ? 'Terminated' : 'ACTIVE'}
            </Badge>
          </DescriptionDetails>
          <DescriptionTerm>Created at</DescriptionTerm>
          <DescriptionDetails>
            <span>{formatDate(new Date(data.instance.data.createdAt))}</span>
          </DescriptionDetails>
          <DescriptionTerm>Updated at</DescriptionTerm>
          <DescriptionDetails>
            <span>{formatDate(new Date(data.instance.data.updatedAt))}</span>
          </DescriptionDetails>
          <DescriptionTerm>Terminated at</DescriptionTerm>
          <DescriptionDetails>
            <span>
              {data.instance.data.terminatedAt
                ? formatDate(new Date(data.instance.data.terminatedAt))
                : '-'}
            </span>
          </DescriptionDetails>
        </DescriptionList>
      </AppCard>

      {data.instance.data.status?.map((status, index) => (
        <Card className="col-span-5" key={index}>
          <CardHeader>
            <CardTitle className="flex space-between align-center items-center">
              <span className="p-2">Stage</span>
              <Chip
                {...chipVariantFromType['id']}
                label={status.stage}
                maxWidth="xl"
                copyMode="click"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList>
              <DescriptionTerm>Started at</DescriptionTerm>
              <DescriptionDetails>
                <span>{formatDate(new Date(status.startedAt))}</span>
              </DescriptionDetails>
              <DescriptionTerm>Terminated at</DescriptionTerm>
              <DescriptionDetails>
                <span>
                  {status.terminatedAt
                    ? formatDate(new Date(status.terminatedAt))
                    : ''}
                </span>
              </DescriptionDetails>
            </DescriptionList>
          </CardContent>
        </Card>
      ))}
    </AppContentGrid>
  );
}

function InstanceHeader({ instance }: { instance: NormalizedInstanceModel }) {
  const { instanceId } = useRouteGuard({
    componentName: 'instance-header',
    requiredParams: ['instanceId'],
  });

  return (
    <Card data-header="instance">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="cobaltDark" size="icon-md" notClickable>
                <ListCheck />
              </Button>
              <CardTitle className="flex gap-1">
                <span>Instance</span>
              </CardTitle>
            </div>
            <div className="min-w-0 flex-1 flex items-center gap-2">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Chip
                  {...chipVariantFromType['id']}
                  label={instanceId}
                  maxWidth="xl"
                  copyMode="click"
                />
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
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
                    Information about the instance.
                  </SheetDescription>
                </SheetHeader>

                <Separator className="my-4" />

                <PreviewJson
                  className="w-full"
                  json={instance ?? {}}
                  defaultUnfoldAll={true}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
