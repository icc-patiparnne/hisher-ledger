import {
  LoaderFunction,
  Outlet,
  useLoaderData,
  useOutletContext,
} from 'react-router';
import invariant from 'tiny-invariant';

import { Cursor } from '@platform/sdks/utils/cursor';
import { MODULES_GATEWAYS } from '@platform/utils';
import { AppContentGrid } from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import TabsNavigation from '../../../../components/tabs-navigation';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { CurrentContext } from '../../../../root';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';
import {
  NormalizedCashPoolModel,
  NormalizedPaymentAccountBalanceModel,
  NormalizedPaymentAccountModel,
} from '../../../../utils/sdk/payments/models';
import {
  NormalizedGetPaymentAccountBalancesResponse,
  NormalizedGetPaymentAccountResponse,
  NormalizedListPoolsResponse,
} from '../../../../utils/sdk/payments/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import PaymentAccountHeader from '../components/payment-account-header';
import { v1Loader } from './account.v1';
import { v3Loader } from './account.v3';

export type Data = {
  paymentsAccount: NormalizedGetPaymentAccountResponse | undefined;
  paymentsAccountPools: NormalizedListPoolsResponse | undefined;
  paymentsAccountBalances:
    | NormalizedGetPaymentAccountBalancesResponse
    | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  paymentsAccount: { data: NormalizedPaymentAccountModel };
  paymentsAccountPools: {
    cursor: Cursor<NormalizedCashPoolModel>;
  };
  paymentsAccountBalances: {
    cursor: Cursor<NormalizedPaymentAccountBalanceModel>;
  };
}>;

export type TConnectivityAccountContext = CurrentContext & LoaderData;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  invariant(params.paymentAccountId, 'params.paymentAccountId is required');
  const paymentAccountId = params.paymentAccountId;
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
            await v3Loader(api, paymentAccountId),
            version
          );
        }
        default:
          return wrapLoaderWithProps<Data>(
            await v1Loader(api, paymentAccountId),
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

export default function PaymentAccount() {
  useFeatureFlag(FEATURES.payments);

  const { organizationId, stackId, region, paymentAccountId } = useRouteGuard({
    componentName: 'payment-account',
    requiredParams: ['paymentAccountId'],
  });

  const context = useOutletContext<CurrentContext>();

  const { paymentsAccount, paymentsAccountPools, paymentsAccountBalances } =
    useLoaderData<LoaderData>() as unknown as LoaderData;

  const combinedContext = {
    ...context,
    paymentsAccount,
    paymentsAccountPools,
    paymentsAccountBalances,
  };

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <PaymentAccountHeader
          paymentAccount={
            paymentsAccount.data as unknown as NormalizedPaymentAccountModel
          }
        />
      </div>

      <div className="col-span-12">
        <TabsNavigation
          tabs={[
            {
              label: 'Information',
              value: 'information',
              routeId: 'CONNECTIVITY_ACCOUNT_DETAIL',
              route: ROUTES({
                organizationId,
                stackId,
                region,
                paymentAccountId,
              })['CONNECTIVITY_ACCOUNT_DETAIL'].to,
              shortcut: 'i',
            },
            {
              label: 'Balances',
              value: 'balances',
              routeId: 'CONNECTIVITY_ACCOUNT_BALANCES',
              shortcut: 'b',
              route: ROUTES({
                organizationId,
                stackId,
                region,
                paymentAccountId,
              })['CONNECTIVITY_ACCOUNT_BALANCES'].to,
            },
            {
              label: 'Transfers',
              value: 'transfers',
              routeId: 'CONNECTIVITY_ACCOUNT_TRANSFERS',
              route: ROUTES({
                organizationId,
                stackId,
                region,
                paymentAccountId,
              })['CONNECTIVITY_ACCOUNT_TRANSFERS'].to,
              shortcut: 't',
            },
            {
              label: 'Pools',
              value: 'pools',
              routeId: 'CONNECTIVITY_ACCOUNT_POOLS',
              route: ROUTES({
                organizationId,
                stackId,
                region,
                paymentAccountId,
              })['CONNECTIVITY_ACCOUNT_POOLS'].to,
              shortcut: 'p',
            },
          ]}
        />
      </div>

      <Outlet context={combinedContext} />
    </AppContentGrid>
  );
}
