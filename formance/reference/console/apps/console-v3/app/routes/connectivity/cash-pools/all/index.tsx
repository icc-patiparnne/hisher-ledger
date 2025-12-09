import { Cursor } from '@platform/sdks/utils/cursor';
import { Button } from '@platform/ui';
import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { Plus } from 'lucide-react';
import { Link, LoaderFunction, useLoaderData } from 'react-router';
import { AppContentGrid } from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import useAbility from '../../../../hooks/useAbility';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedCashPoolModel } from '../../../../utils/sdk/payments/models';
import { NormalizedListPoolsResponse } from '../../../../utils/sdk/payments/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import PaymentsCashPoolsList from './../components/payments-cash-pools-list';
import { v1Loader } from './cash-pools.v1';
import { v3Loader } from './cash-pools.v3';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export type Data = {
  cashPools: NormalizedListPoolsResponse | undefined;
};

type LoaderData = LoaderWrapperProps<{
  cashPools: { cursor: Cursor<NormalizedCashPoolModel> };
}>;

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
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
            await v3Loader(api, request),
            version
          );
        }
        default:
          return wrapLoaderWithProps<Data>(
            await v1Loader(api, request),
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

export default function ConnectivityPools() {
  useFeatureFlag(FEATURES.payments);

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'connectivity-pools',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_CASH_POOLS',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'All Cash Pools',
        to: ROUTES({ organizationId, stackId, region })[
          'CONNECTIVITY_CASH_POOLS'
        ].to,
      },
    ],
  });

  const {
    stack: { canWrite },
  } = useAbility();

  const data = useLoaderData<LoaderData>();

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <PaymentsCashPoolsList
          cashPools={
            data.cashPools.cursor as unknown as Cursor<NormalizedCashPoolModel>
          }
          version={data.version}
        >
          <Link
            to={
              ROUTES({ organizationId, stackId, region })[
                'CONNECTIVITY_CASH_POOLS_CREATE'
              ].to
            }
          >
            <Button
              className="absolute top-4 right-4"
              variant="primary"
              disabled={!canWrite}
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Cash Pool
            </Button>
          </Link>
        </PaymentsCashPoolsList>
      </div>
    </AppContentGrid>
  );
}
