import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { AppContentGrid } from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import TabsSinglePage from '../../../../components/tabs-single-page';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { ROUTES } from '../../../../utils/routes';

import { withContext } from '../../../../utils/auth.server';
import {
  NormalizedCashPoolBalancesModel,
  NormalizedCashPoolModel,
  NormalizedConnectorConfigsModel,
  NormalizedPaymentAccountModel,
} from '../../../../utils/sdk/payments/models';
import {
  NormalizedGetCashPoolBalancesResponse,
  NormalizedGetCashPoolResponse,
  NormalizedGetPaymentAccountsResponse,
  NormalizedListAllAvailableConnectorsResponse,
} from '../../../../utils/sdk/payments/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import { v1Loader } from './cash-pool.v1';

import {
  AppCard,
  Chip,
  chipVariantFromType,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  TabsContent,
} from '@platform/ui';
import PaymentCashPoolHeader from '../components/payment-cash-pool-header';

import { formatDate, MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import React, { useState } from 'react';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import PaymentAccountsList from '../../accounts/components/payment-accounts-list';
import PaymentsCashPoolsBalancesList from '../components/payment-cash-pool-balances-list';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export type Data = {
  cashPool: NormalizedGetCashPoolResponse;
  cashPoolAccounts: NormalizedGetPaymentAccountsResponse;
  cashPoolBalances: NormalizedGetCashPoolBalancesResponse;
  connectorsConfig: NormalizedListAllAvailableConnectorsResponse | undefined;
};

type LoaderData = LoaderWrapperProps<{
  cashPool: { data: NormalizedCashPoolModel };
  cashPoolAccounts: { data: NormalizedPaymentAccountModel[] };
  cashPoolBalances: { data: NormalizedCashPoolBalancesModel };
  connectorsConfig: { data: NormalizedConnectorConfigsModel };
}>;

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.paymentCashPoolId, 'params.paymentCashPoolId is required');
  const paymentCashPoolId = params.paymentCashPoolId;

  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.PAYMENTS
      );

      return wrapLoaderWithProps<Data>(
        await v1Loader(api, { poolId: paymentCashPoolId }),
        version
      );
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.PAYMENTS],
    FEATURES.payments
  )) as LoaderData;
};

export default function ConnectivityCashPooling() {
  useFeatureFlag(FEATURES.payments);

  const { organizationId, stackId, region, paymentCashPoolId } = useRouteGuard({
    componentName: 'connectivity-cash-pool',
    requiredParams: ['paymentCashPoolId'],
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_CASH_POOL_DETAIL',
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
      {
        title: paymentCashPoolId,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  const [, setActiveTab] = useState('information');

  const tabs = [
    {
      label: 'Information',
      value: 'information',
      shortcut: 'i',
    },
    {
      label: 'Accounts',
      value: 'accounts',
      shortcut: 'a',
    },
    {
      label: 'Balances',
      value: 'balances',
      shortcut: 'b',
    },
  ];

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <PaymentCashPoolHeader
          paymentCashPool={
            data.cashPool.data as unknown as NormalizedCashPoolModel
          }
        />
      </div>

      <div className="col-span-12">
        <TabsSinglePage
          tabs={tabs}
          defaultValue="information"
          onTabChange={setActiveTab}
        >
          <TabsContent value="information" className="col-span-12">
            <AppCard title="Information">
              <DescriptionList>
                <DescriptionTerm>ID</DescriptionTerm>
                <DescriptionDetails>
                  <Chip
                    {...chipVariantFromType['id']}
                    label={data.cashPool.data.id}
                    maxWidth="xl"
                    copyMode="click"
                  />
                </DescriptionDetails>

                <DescriptionTerm>Name</DescriptionTerm>
                <DescriptionDetails>
                  <Chip
                    {...chipVariantFromType['name']}
                    label={data.cashPool.data.name}
                    copyMode="click"
                  />
                </DescriptionDetails>

                {data.cashPool.data.createdAt && (
                  <>
                    <DescriptionTerm>Created At</DescriptionTerm>
                    <DescriptionDetails>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(new Date(data.cashPool.data.createdAt))}
                      </span>
                    </DescriptionDetails>
                  </>
                )}
              </DescriptionList>
            </AppCard>
          </TabsContent>

          <TabsContent value="accounts" className="col-span-12">
            <PaymentAccountsList
              paymentsAccounts={
                data.cashPoolAccounts
                  .data as unknown as NormalizedPaymentAccountModel[]
              }
              connectorsConfig={data?.connectorsConfig?.data}
              serverSide={false}
              version={data.version}
            />
          </TabsContent>

          <TabsContent value="balances" className="col-span-12">
            <PaymentsCashPoolsBalancesList
              cashPoolBalances={data.cashPoolBalances.data}
              version={data.version}
            />
          </TabsContent>
        </TabsSinglePage>
      </div>
    </AppContentGrid>
  );
}
