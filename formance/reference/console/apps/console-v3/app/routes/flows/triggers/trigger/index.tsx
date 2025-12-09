import { Info, Zap } from 'lucide-react';
import { Link, LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { formatDate, MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';

import {
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
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';
import {
  NormalizedTriggerModel,
  NormalizedTriggerOccurrenceModel,
} from '../../../../utils/sdk/flows/models';
import {
  NormalizedGetTriggerResponse,
  NormalizedListTriggerOccurrencesResponse,
} from '../../../../utils/sdk/flows/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import { v2Loader } from './trigger.v2';

import { Cursor } from '@platform/sdks/utils/cursor';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import OccurrencesList from '../../components/occurrences-list';
import WorkflowHeader from '../../components/workflow-header';

export type Data = {
  trigger: NormalizedGetTriggerResponse | undefined;
  occurrences: NormalizedListTriggerOccurrencesResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  trigger: { data: NormalizedTriggerModel };
  occurrences: { cursor: Cursor<NormalizedTriggerOccurrenceModel> };
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.triggerId, 'params.triggerId is required');
  const triggerId = params.triggerId;

  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.ORCHESTRATION
      );

      return wrapLoaderWithProps<Data>(
        await v2Loader(api, request, triggerId),
        version
      );
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.ORCHESTRATION],
    FEATURES.orchestration
  )) as LoaderData;
};

export default function Trigger() {
  useFeatureFlag(FEATURES.orchestration);

  const { organizationId, stackId, region, triggerId, workflowId } =
    useRouteGuard({
      componentName: 'trigger',
      requiredParams: ['workflowId', 'triggerId'],
    });

  useRouteUpdate({
    moduleName: MODULES_NAMES.FLOWS,
    routeId: 'FLOWS_TRIGGER_DETAIL',
    breadcrumbs: [
      {
        title: 'Flows',
      },
      {
        title: 'All Triggers',
        to: ROUTES({ organizationId, stackId, region })['FLOWS_TRIGGERS'].to,
      },
      {
        title: triggerId,
        to: ROUTES({
          organizationId,
          stackId,
          region,
          workflowId,
          triggerId,
        })['FLOWS_TRIGGER_DETAIL'].to,
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
          <TriggerHeader
            trigger={data.trigger as unknown as NormalizedTriggerModel}
          />
        </div>
      </AppContentHeaderRoute>

      <Card className="col-span-12">
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent>
          <DescriptionList>
            <DescriptionTerm>ID</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromType['id']}
                label={data.trigger.data.id}
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Event</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromType['string']}
                label={data.trigger.data.event}
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Name</DescriptionTerm>
            <DescriptionDetails>
              {data.trigger.data.name ? (
                <Chip
                  {...chipVariantFromType['name']}
                  label={data.trigger.data.name}
                  copyMode="click"
                />
              ) : (
                <span>-</span>
              )}
            </DescriptionDetails>

            <DescriptionTerm>Workflow ID</DescriptionTerm>
            <DescriptionDetails>
              <Link
                to={
                  ROUTES({
                    organizationId,
                    stackId,
                    region,
                    workflowId: data.trigger.data.workflowID,
                  })['FLOWS_WORKFLOW_DETAIL'].to
                }
              >
                <Chip
                  {...chipVariantFromType['id']}
                  label={data.trigger.data.workflowID}
                />
              </Link>
            </DescriptionDetails>
            <DescriptionTerm>Filter</DescriptionTerm>
            <DescriptionDetails>
              <PreviewJson
                className="w-full"
                json={{ filter: data.trigger.data.filter ?? {} }}
                defaultUnfoldAll={true}
              />
            </DescriptionDetails>
            <DescriptionTerm>Variables</DescriptionTerm>
            <DescriptionDetails>
              <PreviewJson
                className="w-full"
                json={data.trigger.data.vars ?? {}}
                defaultUnfoldAll={true}
              />
            </DescriptionDetails>
            <DescriptionTerm>Created at</DescriptionTerm>
            <DescriptionDetails>
              <span>{formatDate(new Date(data.trigger.data.createdAt))}</span>
            </DescriptionDetails>
          </DescriptionList>
        </CardContent>
      </Card>

      <div className="col-span-12">
        <OccurrencesList
          occurrences={
            data?.occurrences
              ?.cursor as unknown as Cursor<NormalizedTriggerOccurrenceModel>
          }
          version={data?.version}
        />
      </div>
    </AppContentGrid>
  );
}

function TriggerHeader({ trigger }: { trigger: NormalizedTriggerModel }) {
  const { triggerId } = useRouteGuard({
    componentName: 'trigger-header',
    requiredParams: ['triggerId'],
  });

  return (
    <Card data-header="trigger">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="mint" size="icon-md" notClickable>
                <Zap />
              </Button>
              <CardTitle className="flex gap-1">
                <span>Trigger</span>
              </CardTitle>
            </div>
            <div className="min-w-0 flex-1 flex items-center gap-2">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Chip
                  {...chipVariantFromType['id']}
                  label={triggerId}
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
                    Information about the trigger.
                  </SheetDescription>
                </SheetHeader>

                <Separator className="my-4" />

                <PreviewJson
                  className="w-full"
                  json={trigger ?? {}}
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
