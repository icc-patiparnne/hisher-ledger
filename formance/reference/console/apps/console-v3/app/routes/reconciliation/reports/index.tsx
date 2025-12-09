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

import { NormalizedReconciliationModel } from '../../../utils/sdk/reconciliation/models';
import { NormalizedListReconciliationsResponse } from '../../../utils/sdk/reconciliation/responses';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';
import ReportsList from '../components/reports-list';
import { v1Loader } from './reports.v1';

export type Data = {
  reports: NormalizedListReconciliationsResponse | undefined;
};

type LoaderData = LoaderWrapperProps<{
  reports: { cursor: Cursor<NormalizedReconciliationModel> };
}>;

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.RECONCILIATION
      );
      switch (version) {
        default:
          return wrapLoaderWithProps<Data>(
            await v1Loader(api, request),
            version
          );
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.RECONCILIATION],
    FEATURES.reconciliation
  )) as LoaderData;
};

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export default function ReconciliationPolicies() {
  useFeatureFlag(FEATURES.reconciliation);

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'reconciliation-reports',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.RECONCILIATION,
    routeId: 'RECONCILIATION_REPORTS_LIST',
    breadcrumbs: [
      {
        title: 'Reconciliation',
        to: ROUTES({ organizationId, stackId, region })[
          'RECONCILIATION_OVERVIEW'
        ].to,
      },
      {
        title: 'Reports',
        to: ROUTES({ organizationId, stackId, region })[
          'RECONCILIATION_REPORTS_LIST'
        ].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  return (
    <AppContentGrid>
      <ReportsList
        className="col-span-12"
        reports={
          data.reports
            .cursor as unknown as Cursor<NormalizedReconciliationModel>
        }
        version={data.version}
      />
    </AppContentGrid>
  );
}
