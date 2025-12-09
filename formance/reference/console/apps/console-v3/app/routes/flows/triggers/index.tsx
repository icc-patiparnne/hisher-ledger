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
import { NormalizedTriggerModel } from '../../../utils/sdk/flows/models';
import { NormalizedListTriggerResponse } from '../../../utils/sdk/flows/responses';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';
import TriggersList from '../components/triggers-list';
import { v2Loader } from './triggers.v2';

export type Data = {
  triggers: NormalizedListTriggerResponse | undefined;
};

type LoaderData = LoaderWrapperProps<{
  triggers: { cursor: Cursor<NormalizedTriggerModel> };
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
    componentName: 'flows-triggers',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.FLOWS,
    routeId: 'FLOWS_TRIGGERS',
    breadcrumbs: [
      {
        title: 'Flows',
      },
      {
        title: 'Triggers',
        to: ROUTES({ organizationId, stackId, region })['FLOWS_TRIGGERS'].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  return (
    <AppContentGrid>
      <TriggersList
        className="col-span-12"
        triggers={
          data.triggers.cursor as unknown as Cursor<NormalizedTriggerModel>
        }
        version={data.version}
      />
    </AppContentGrid>
  );
}
