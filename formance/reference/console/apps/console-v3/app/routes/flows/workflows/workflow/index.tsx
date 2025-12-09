import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { formatDate, MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';

import { Cursor } from '@platform/sdks/utils/cursor';
import {
  AppCard,
  Chip,
  chipVariantFromType,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@platform/ui';
import {
  AppContentGrid,
  AppContentHeaderRoute,
} from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';
import {
  NormalizedInstanceModel,
  NormalizedWorkflowModel,
} from '../../../../utils/sdk/flows/models';
import {
  NormalizedGetWorkflowResponse,
  NormalizedListInstancesResponse,
} from '../../../../utils/sdk/flows/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import InstancesList from '../../components/instances-list';
import WorkflowHeader from '../../components/workflow-header';
import { v2Loader } from './workflow.v2';

export type Data = {
  workflow: NormalizedGetWorkflowResponse | undefined;
  instances: NormalizedListInstancesResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  workflow: { data: NormalizedWorkflowModel };
  instances: { cursor: Cursor<NormalizedInstanceModel> };
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.workflowId, 'params.workflowId is required');
  const workflowId = params.workflowId;

  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.ORCHESTRATION
      );

      return wrapLoaderWithProps<Data>(
        await v2Loader(api, request, workflowId),
        version
      );
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.ORCHESTRATION],
    FEATURES.orchestration
  )) as LoaderData;
};

export default function Workflow() {
  useFeatureFlag(FEATURES.orchestration);

  const { organizationId, stackId, region, workflowId } = useRouteGuard({
    componentName: 'workflow',
    requiredParams: ['workflowId'],
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.FLOWS,
    routeId: 'FLOWS_WORKFLOW_DETAIL',
    breadcrumbs: [
      {
        title: 'Flows',
      },
      {
        title: 'All Workflows',
        to: ROUTES({ organizationId, stackId, region })['FLOWS_WORKFLOWS'].to,
      },
      {
        title: workflowId,
        to: ROUTES({
          organizationId,
          stackId,
          region,
          workflowId,
        })['FLOWS_WORKFLOW_DETAIL'].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  return (
    <AppContentGrid>
      <AppContentHeaderRoute className="col-span-12">
        <WorkflowHeader
          workflow={
            data.workflow.data.config as unknown as NormalizedWorkflowModel
          }
        />
      </AppContentHeaderRoute>

      <AppCard title="Information" className="col-span-12">
        <DescriptionList>
          <DescriptionTerm>ID</DescriptionTerm>
          <DescriptionDetails>
            <Chip
              {...chipVariantFromType['id']}
              label={data.workflow.data.id}
              maxWidth="xl"
              copyMode="click"
            />
          </DescriptionDetails>
          <DescriptionTerm>Name</DescriptionTerm>
          <DescriptionDetails>
            {data.workflow.data.config.name ? (
              <Chip
                {...chipVariantFromType['name']}
                label={data.workflow.data.config.name}
              />
            ) : (
              <span>-</span>
            )}
          </DescriptionDetails>

          <DescriptionTerm>Created at</DescriptionTerm>
          <DescriptionDetails>
            <span>{formatDate(new Date(data.workflow.data.createdAt))}</span>
          </DescriptionDetails>
          <DescriptionTerm>Updated at</DescriptionTerm>
          <DescriptionDetails>
            <span>{formatDate(new Date(data.workflow.data.updatedAt))}</span>
          </DescriptionDetails>
        </DescriptionList>
      </AppCard>

      <div className="col-span-12">
        <InstancesList
          instances={
            data.instances.cursor as unknown as Cursor<NormalizedInstanceModel>
          }
          version={data.version}
          showWorkflowId={false}
        />
      </div>
    </AppContentGrid>
  );
}
