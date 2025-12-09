import { Link, LoaderFunction, useLoaderData } from 'react-router';

import { Cursor } from '@platform/sdks/utils/cursor';
import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { withContext } from '../../../utils/auth.server';
import { ROUTES } from '../../../utils/routes';
import { NormalizedBankAccountModel } from '../../../utils/sdk/payments/models';
import { NormalizedListBankAccountsResponse } from '../../../utils/sdk/payments/responses';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';

import { v1Loader } from './bank-accounts.v1';

import { Button } from '@platform/ui/components/button';
import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { v3Loader } from './bank-accounts.v3';
import PaymentsBankAccountsList from './components/payment-bank-accounts-list';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export type Data = {
  paymentBankAccounts: NormalizedListBankAccountsResponse | undefined;
};

type LoaderData = LoaderWrapperProps<{
  paymentBankAccounts: { cursor: Cursor<NormalizedBankAccountModel> };
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

export default function ConnectivityBankAccounts() {
  useFeatureFlag(FEATURES.payments);

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'connectivity-bank-accounts',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_BANK_ACCOUNTS',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'Bank Accounts',
        to: ROUTES({ organizationId, stackId, region })[
          'CONNECTIVITY_BANK_ACCOUNTS'
        ].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <PaymentsBankAccountsList
          json={true}
          paymentsBankAccounts={
            data.paymentBankAccounts
              .cursor as unknown as Cursor<NormalizedBankAccountModel>
          }
          version={data.version}
        >
          <Link
            className="absolute top-4 right-4"
            to={
              ROUTES({ organizationId, stackId, region })[
                'CONNECTIVITY_BANK_ACCOUNTS_CREATE'
              ].to
            }
          >
            <Button variant="primary" size="sm">
              Create Bank Account
            </Button>
          </Link>
        </PaymentsBankAccountsList>
      </div>
    </AppContentGrid>
  );
}
