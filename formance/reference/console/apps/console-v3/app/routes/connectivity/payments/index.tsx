import { Cursor } from '@platform/sdks/utils/cursor';
import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { LoaderFunction, useLoaderData } from 'react-router';
import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { withContext } from '../../../utils/auth.server';
import { ROUTES } from '../../../utils/routes';
import { NormalizedPaymentModel } from '../../../utils/sdk/payments/models';
import { NormalizedListPaymentsResponse } from '../../../utils/sdk/payments/responses';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';
import PaymentsList from './components/payments-list';
import { v1Loader } from './payments.v1';
import { v3Loader } from './payments.v3';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export type Data = {
  payments: NormalizedListPaymentsResponse | undefined;
};

type LoaderData = LoaderWrapperProps<{
  payments: { cursor: Cursor<NormalizedPaymentModel> };
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

export default function ConnectivityPayments() {
  useFeatureFlag(FEATURES.payments);

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'connectivity-payments',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_PAYMENTS',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'All Payments',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_PAYMENTS']
          .to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <PaymentsList
          payments={
            data.payments.cursor as unknown as Cursor<NormalizedPaymentModel>
          }
          version={data.version}
        />
      </div>
    </AppContentGrid>
  );
}
