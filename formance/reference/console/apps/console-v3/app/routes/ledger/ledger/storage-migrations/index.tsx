import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { ROUTES } from '../../../../utils/routes';

import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { AppContentGrid } from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { withContext } from '../../../../utils/auth.server';
import {
  NormalizedLedgerInfoModel,
  NormalizedLedgerModel,
  NormalizedStatsModel,
} from '../../../../utils/sdk/ledger/models';
import {
  NormalizedGetLedgerResponse,
  NormalizedGetLedgerStatsResponse,
} from '../../../../utils/sdk/ledger/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import LedgerHeader from '../../components/ledger-header';
import LedgerMigrationsList from '../../components/ledger-migrations-list';
import LedgerTabs from '../../components/ledger-tabs';
import { v1Loader } from './ledger-storage-migrations.v1';
import { v2Loader } from './ledger-storage-migrations.v2';

export type Data = {
  ledger: NormalizedGetLedgerResponse | undefined;
  ledgerStats: NormalizedGetLedgerStatsResponse | undefined;
  ledgerInfo: NormalizedLedgerInfoModel | undefined;
};
export type LoaderData = LoaderWrapperProps<{
  ledger: { data: NormalizedLedgerModel };
  ledgerStats: { data: NormalizedStatsModel };
  ledgerInfo: { data: NormalizedLedgerInfoModel };
}>;

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  invariant(params.ledgerName, 'params.ledgerName is required');
  const ledgerName = params.ledgerName;

  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.LEDGER
      );

      switch (version) {
        case '1': {
          return wrapLoaderWithProps<Data>(
            await v1Loader(api, ledgerName),
            version
          );
        }
        case '2':
        default:
          return wrapLoaderWithProps<Data>(
            await v2Loader(api, ledgerName),
            version
          );
      }
    },

    authenticator,
    request,
    [MODULES_GATEWAYS.LEDGER],
    FEATURES.ledger
  )) as LoaderData;
};

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export default function Ledger() {
  useFeatureFlag(FEATURES.ledger);

  const { organizationId, stackId, region, ledgerName } = useRouteGuard({
    componentName: 'ledger-storage-migrations',
    requiredParams: ['ledgerName'],
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_STORAGE_MIGRATIONS',
    breadcrumbs: [
      {
        title: 'Ledger',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_OVERVIEW'].to,
      },
      {
        title: 'All Ledgers',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_ALL'].to,
      },
      {
        title: ledgerName,
        to: ROUTES({ organizationId, stackId, region, ledgerName })[
          'LEDGER_DETAIL'
        ].to,
      },
      {
        title: 'Storage Migrations',
      },
    ],
  });

  const data = useLoaderData<LoaderData>() as LoaderData;
  const { ledger, ledgerStats, ledgerInfo } = data;

  return (
    <div>
      <AppContentGrid>
        <div className="col-span-12">
          <LedgerHeader ledger={ledger?.data} ledgerStats={ledgerStats?.data} />
        </div>

        <div className="col-span-12">
          <LedgerTabs
            organizationId={organizationId}
            stackId={stackId}
            region={region}
            ledgerName={ledgerName}
            version={data?.version}
          />
        </div>

        <div className="col-span-12">
          <LedgerMigrationsList ledgerInfo={ledgerInfo?.data} />
        </div>
      </AppContentGrid>
    </div>
  );
}
