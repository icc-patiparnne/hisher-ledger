import React from 'react';
import {
  LoaderFunction,
  Outlet,
  useLoaderData,
  useOutletContext,
} from 'react-router';
import invariant from 'tiny-invariant';

import { MODULES_GATEWAYS } from '@platform/utils';
import {
  AppContentGrid,
  AppContentHeaderRoute,
} from '../../../../../components/app-content';
import AppErrorBoundary from '../../../../../components/app-error-boundary';
import TabsNavigation from '../../../../../components/tabs-navigation';
import { FEATURES, useFeatureFlag } from '../../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../../hooks/useRouteGuard';
import { CurrentContext } from '../../../../../root';
import { withContext } from '../../../../../utils/auth.server';
import { ROUTES } from '../../../../../utils/routes';
import {
  NormalizedLedgerModel,
  NormalizedStatsModel,
  NormalizedTransactionModel,
} from '../../../../../utils/sdk/ledger/models';
import {
  NormalizedGetLedgerResponse,
  NormalizedGetLedgerStatsResponse,
  NormalizedGetTransactionResponse,
} from '../../../../../utils/sdk/ledger/responses';
import { NormalizedSDK } from '../../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../../utils/session.gateway.server';
import LedgerHeader from '../../../components/ledger-header';
import LedgerTransactionHeader from '../../../components/ledger-transaction-header';
import { v1Loader } from './ledger-transaction.v1';
import { v2Loader } from './ledger-transaction.v2';

export type Data = {
  ledger: NormalizedGetLedgerResponse | undefined;
  ledgerStats: NormalizedGetLedgerStatsResponse | undefined;
  ledgerTransaction: NormalizedGetTransactionResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  ledger: { data: NormalizedLedgerModel };
  ledgerStats: { data: NormalizedStatsModel };
  ledgerTransaction: { data: NormalizedTransactionModel };
}>;

export type TLedgerTransactionContext = CurrentContext & {
  transactionData: LoaderData;
};

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  invariant(params.ledgerName, 'params.ledgerName is required');
  invariant(params.transactionId, 'params.transactionId is required');
  const { ledgerName, transactionId } = params;

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
            await v1Loader(api, ledgerName, transactionId),
            version
          );
        }
        case '2':
        default:
          return wrapLoaderWithProps<Data>(
            await v2Loader(api, ledgerName, transactionId),
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

export default function LedgerTransactionLayout() {
  const { organizationId, stackId, region, ledgerName, transactionId } =
    useRouteGuard({
      componentName: 'ledger-transaction',
      requiredParams: ['ledgerName', 'transactionId'],
    });

  useFeatureFlag(FEATURES.ledger);

  const context = useOutletContext<CurrentContext>();

  const data = useLoaderData<LoaderData>() as unknown as LoaderData;
  const { ledger, ledgerStats, ledgerTransaction } = data;

  // Create a combined context with both the app context and the transaction data
  const combinedContext: TLedgerTransactionContext = {
    ...context,
    transactionData: data,
  };

  return (
    <AppContentGrid>
      <AppContentHeaderRoute className="grid grid-cols-12 col-span-12 bg-muted-lighter gap-2">
        <div className="lg:col-span-5 col-span-12">
          <LedgerHeader ledger={ledger?.data} ledgerStats={ledgerStats?.data} />
        </div>

        <div className="lg:col-span-7 col-span-12">
          <LedgerTransactionHeader
            ledgerTransaction={ledgerTransaction?.data}
          />
        </div>
      </AppContentHeaderRoute>

      <div className="col-span-12">
        <div className="flex items-center justify-between">
          <TabsNavigation
            tabs={[
              {
                label: 'Postings',
                value: 'postings',
                routeId: 'LEDGER_TRANSACTION',
                route: ROUTES({
                  organizationId,
                  stackId,
                  region,
                  ledgerName,
                  transactionId,
                })['LEDGER_TRANSACTION'].to,
                shortcut: 'p',
              },
              {
                label: 'Information',
                value: 'information',
                routeId: 'LEDGER_TRANSACTION_INFORMATION',
                route: ROUTES({
                  organizationId,
                  stackId,
                  region,
                  ledgerName,
                  transactionId,
                })['LEDGER_TRANSACTION_INFORMATION'].to,
                shortcut: 'i',
              },
              {
                label: 'Metadata',
                value: 'metadata',
                routeId: 'LEDGER_TRANSACTION_METADATA',
                route: ROUTES({
                  organizationId,
                  stackId,
                  region,
                  ledgerName,
                  transactionId,
                })['LEDGER_TRANSACTION_METADATA'].to,
                shortcut: 'm',
              },
            ]}
          />
        </div>
      </div>

      <Outlet context={combinedContext} />
    </AppContentGrid>
  );
}
