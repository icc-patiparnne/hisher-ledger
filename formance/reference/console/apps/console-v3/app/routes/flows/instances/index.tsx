import { LoaderFunction, useLoaderData } from 'react-router';

import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';

import { Cursor } from '@platform/sdks/utils/cursor';
import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { withContext } from '../../../utils/auth.server';
import { ROUTES } from '../../../utils/routes';
import { NormalizedInstanceModel } from '../../../utils/sdk/flows/models';
import { NormalizedListInstancesResponse } from '../../../utils/sdk/flows/responses';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';
import InstancesList from '../components/instances-list';
import { v2Loader } from './instances.v2';

export type Data = {
  instances: NormalizedListInstancesResponse | undefined;
};

type LoaderData = LoaderWrapperProps<{
  instances: { cursor: Cursor<NormalizedInstanceModel> };
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
    componentName: 'flows-instances',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.FLOWS,
    routeId: 'FLOWS_INSTANCES',
    breadcrumbs: [
      {
        title: 'Flows',
      },
      {
        title: 'Instances',
        to: ROUTES({ organizationId, stackId, region })['FLOWS_INSTANCES'].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  return (
    <AppContentGrid>
      <InstancesList
        className="col-span-12"
        instances={
          data.instances.cursor as unknown as Cursor<NormalizedInstanceModel>
        }
        version={data.version}
        showWorkflowId={true}
      />
    </AppContentGrid>
  );
}
