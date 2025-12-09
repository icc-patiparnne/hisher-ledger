import { Cursor } from '@platform/sdks/utils/cursor';
import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { LoaderFunction, useLoaderData } from 'react-router';
import { AppContentGrid } from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedTransferInitiationModel } from '../../../../utils/sdk/payments/models';
import { NormalizedListTransferInitiationsResponse } from '../../../../utils/sdk/payments/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import PaymentTransfersValidate from '../components/payment-transfers-validate';
import TransfersTabs from '../components/transfers-tabs';
import { v1Loader } from './validate.v1';
import { v3Loader } from './validate.v3';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export type Data = {
  paymentTransfers: NormalizedListTransferInitiationsResponse | undefined;
};

type LoaderData = LoaderWrapperProps<{
  paymentTransfers: { cursor: Cursor<NormalizedTransferInitiationModel> };
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
        case '3':
          return wrapLoaderWithProps<Data>(
            await v3Loader(api, request),
            version
          );
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

export default function ConnectivityTransfers() {
  useFeatureFlag(FEATURES.payments);

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'connectivity-transfers',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_TRANSFERS_VALIDATE',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'Transfers',
        to: ROUTES({ organizationId, stackId, region })[
          'CONNECTIVITY_TRANSFERS_VALIDATE'
        ].to,
      },
      {
        title: 'Transfers Waiting for Validation',
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  const transfersWaitingForValidation =
    data.paymentTransfers.cursor.data.filter(
      (transfer) => transfer.status === 'WAITING_FOR_VALIDATION'
    );

  return (
    <AppContentGrid>
      {data.version >= '3' && (
        <div className="col-span-12">
          <TransfersTabs
            organizationId={organizationId}
            stackId={stackId}
            region={region}
            waitingForValidationTransfers={transfersWaitingForValidation.length}
          />
        </div>
      )}

      <div className="col-span-12">
        <PaymentTransfersValidate
          paymentTransfers={
            data.paymentTransfers
              .cursor as unknown as Cursor<NormalizedTransferInitiationModel>
          }
          version={data.version}
        />
      </div>
    </AppContentGrid>
  );
}
