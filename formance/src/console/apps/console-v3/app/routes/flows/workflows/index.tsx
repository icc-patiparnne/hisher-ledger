import { Cursor } from '@platform/sdks/utils/cursor';
import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { LoaderFunction, useLoaderData } from 'react-router';
import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { withContext } from '../../../utils/auth.server';
import { ROUTES } from '../../../utils/routes';
import { NormalizedWorkflowModel } from '../../../utils/sdk/flows/models';
import { NormalizedListWorkflowsResponse } from '../../../utils/sdk/flows/responses';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';
import WorkflowsList from '../components/workflows-list';
import { v2Loader } from './workflows.v2';

export type Data = {
  workflows: NormalizedListWorkflowsResponse | undefined;
};

type LoaderData = LoaderWrapperProps<{
  workflows: { cursor: Cursor<NormalizedWorkflowModel> };
}>;

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.ORCHESTRATION
      );

      switch (version) {
        default:
          return wrapLoaderWithProps<Data>(
            await v2Loader(api, request),
            version
          );
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.ORCHESTRATION],
    FEATURES.orchestration
  )) as LoaderData;
};

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export default function FlowsWorkflows() {
  useFeatureFlag(FEATURES.orchestration);

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'flows-workflows',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.FLOWS,
    routeId: 'FLOWS_WORKFLOWS',
    breadcrumbs: [
      {
        title: 'Flows',
      },
      {
        title: 'Workflows',
        to: ROUTES({ organizationId, stackId, region })['FLOWS_WORKFLOWS'].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  return (
    <AppContentGrid>
      <WorkflowsList
        className="col-span-12"
        workflows={
          data.workflows.cursor as unknown as Cursor<NormalizedWorkflowModel>
        }
        version={data.version}
      />
    </AppContentGrid>
  );
}
