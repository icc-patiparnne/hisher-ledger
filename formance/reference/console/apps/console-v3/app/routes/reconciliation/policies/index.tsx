import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import React from 'react';
import { Link, LoaderFunction, useLoaderData } from 'react-router';

import { Cursor } from '@platform/sdks/utils/cursor';
import { Button } from '@platform/ui';
import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { withContext } from '../../../utils/auth.server';
import { ROUTES } from '../../../utils/routes';

import { NormalizedPolicyModel } from '../../../utils/sdk/reconciliation/models';
import { NormalizedListPoliciesResponse } from '../../../utils/sdk/reconciliation/responses';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';
import PoliciesList from '../components/policies-list';
import { v1Loader } from './policies.v1';

export type Data = {
  policies: NormalizedListPoliciesResponse | undefined;
};

type LoaderData = LoaderWrapperProps<{
  policies: { cursor: Cursor<NormalizedPolicyModel> };
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
    componentName: 'reconciliation-policies',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.RECONCILIATION,
    routeId: 'RECONCILIATION_POLICIES_LIST',
    breadcrumbs: [
      {
        title: 'Reconciliation',
        to: ROUTES({ organizationId, stackId, region })[
          'RECONCILIATION_OVERVIEW'
        ].to,
      },
      {
        title: 'Policies',
        to: ROUTES({ organizationId, stackId, region })[
          'RECONCILIATION_POLICIES_LIST'
        ].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <PoliciesList
          policies={
            data.policies.cursor as unknown as Cursor<NormalizedPolicyModel>
          }
          version={data.version}
        >
          <Link
            to={
              ROUTES({ organizationId, stackId, region })[
                'RECONCILIATION_POLICY_CREATE'
              ].to
            }
            className="absolute top-4 right-4"
          >
            <Button variant="primary" size="md">
              Create Policy
            </Button>
          </Link>
        </PoliciesList>
      </div>
    </AppContentGrid>
  );
}
