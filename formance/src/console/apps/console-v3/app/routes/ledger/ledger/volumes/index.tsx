import React from 'react';
import { LoaderFunction, redirect, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { Cursor } from '@platform/sdks/utils/cursor';
import { AppContentGrid } from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';

import {
  NormalizedLedgerModel,
  NormalizedStatsModel,
  NormalizedVolumesWithBalancesModel,
  NormalizedVolumeWithBalanceModel,
} from '../../../../utils/sdk/ledger/models';
import {
  NormalizedGetLedgerResponse,
  NormalizedGetLedgerStatsResponse,
  NormalizedVolumesWithBalancesResponse,
} from '../../../../utils/sdk/ledger/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import LedgerHeader from '../../components/ledger-header';
import { v2Loader } from './ledger-volumes.v2';

import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import LedgerTabs from '../../components/ledger-tabs';
import LedgerVolumesList from '../../components/ledger-volumes';

export type Data = {
  ledger: NormalizedGetLedgerResponse | undefined;
  ledgerStats: NormalizedGetLedgerStatsResponse | undefined;
  ledgerVolumesWithBalances: NormalizedVolumesWithBalancesResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  ledger: { data: NormalizedLedgerModel };
  ledgerStats: { data: NormalizedStatsModel };
  ledgerVolumesWithBalances: {
    cursor: Cursor<NormalizedVolumesWithBalancesModel>;
  };
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

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

      const { organizationId, stackId, region } = context;

      switch (version) {
        case '1': {
          return redirect(
            ROUTES({ organizationId, stackId, region, ledgerName })[
              'LEDGER_ACCOUNTS'
            ].to
          );
        }

        default:
          return wrapLoaderWithProps<Data>(
            await v2Loader(api, request, ledgerName),
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

export default function LedgerVolumes() {
  useFeatureFlag(FEATURES.ledger);

  const { organizationId, stackId, region, ledgerName } = useRouteGuard({
    componentName: 'ledger-volumes',
    requiredParams: ['ledgerName'],
  });

  const data = useLoaderData<LoaderData>() as unknown as LoaderData;
  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_VOLUMES',
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
        title: 'Volumes',
      },
    ],
  });

  const { ledger, ledgerStats, ledgerVolumesWithBalances } = data;

  return (
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
        <LedgerVolumesList
          ledgerVolumesWithBalances={
            ledgerVolumesWithBalances?.cursor as unknown as Cursor<NormalizedVolumeWithBalanceModel>
          }
          version={data?.version}
        />
      </div>
    </AppContentGrid>
  );
}
