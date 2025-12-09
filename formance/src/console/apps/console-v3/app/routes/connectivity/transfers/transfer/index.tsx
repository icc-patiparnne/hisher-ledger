import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import {
  AppContentGrid,
  AppContentHeaderRoute,
} from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { ROUTES } from '../../../../utils/routes';

import {
  NormalizedTransferInitiationAdjustementModel,
  NormalizedTransferInitiationModel,
} from '../../../../utils/sdk/payments/models';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';

import { withContext } from '../../../../utils/auth.server';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';

import { Connector } from '@platform/sdks/formance/src/models/components';
import {
  AppCard,
  Badge,
  Chip,
  ChipAmount,
  chipVariantFromType,
  ConnectorIcon,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  PreviewJson,
} from '@platform/ui';
import { formatDate, MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import {
  badgeVariantFromTransferStatus,
  badgeVariantFromTransferType,
} from '../../../../components/badge';
import { chipVariantFromConsoleType } from '../../../../components/chip';
import { useFormatAmount } from '../../../../hooks/useFormatAmount';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { getEffectiveProvider } from '../../utils';
import PaymentTransferHeader from '../components/payment-transfer-header';
import PaymentTransferRelatedAdjustements from '../components/payment-transfer-related-adjustements';
import { transferLoader } from './transfer';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export type Data = {
  transfer: NormalizedTransferInitiationModel | undefined;
};

type LoaderData = LoaderWrapperProps<{
  transfer: { data: NormalizedTransferInitiationModel };
}>;

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.paymentTransferId, 'params.paymentTransferId is required');
  const paymentTransferId = params.paymentTransferId;

  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.PAYMENTS
      );

      return wrapLoaderWithProps<Data>(
        await transferLoader(api, { transferId: paymentTransferId }),
        version
      );
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.PAYMENTS],
    FEATURES.payments
  )) as LoaderData;
};

export default function ConnectivityTransferDetail() {
  useFeatureFlag(FEATURES.payments);

  const { organizationId, stackId, region, paymentTransferId } = useRouteGuard({
    componentName: 'connectivity-transfer-detail',
    requiredParams: ['paymentTransferId'],
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_TRANSFER_DETAIL',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'All Transfers',
        to: ROUTES({ organizationId, stackId, region })[
          'CONNECTIVITY_TRANSFERS'
        ].to,
      },
      {
        title: paymentTransferId,
      },
    ],
  });

  const { shouldFormat } = useFormatAmount();

  const data = useLoaderData<LoaderData>();

  return (
    <AppContentGrid>
      <AppContentHeaderRoute className="col-span-12">
        <PaymentTransferHeader
          paymentTransfer={
            data.transfer?.data as unknown as NormalizedTransferInitiationModel
          }
        />
      </AppContentHeaderRoute>

      <AppCard title="Information" className="col-span-12">
        <DescriptionList>
          <DescriptionTerm>ID</DescriptionTerm>
          <DescriptionDetails>
            <Chip
              {...chipVariantFromType['id']}
              label={data.transfer.data.id}
              maxWidth="xl"
              copyMode="click"
            />
          </DescriptionDetails>

          <DescriptionTerm>Connector ID</DescriptionTerm>
          <DescriptionDetails>
            <Chip
              {...chipVariantFromType['id']}
              label={data.transfer.data.connectorID}
              maxWidth="xl"
              copyMode="click"
            />
          </DescriptionDetails>

          {getEffectiveProvider(data.transfer.data) && (
            <>
              <DescriptionTerm>Provider</DescriptionTerm>
              <DescriptionDetails>
                <div className="flex items-center gap-1.5">
                  <ConnectorIcon
                    name={
                      getEffectiveProvider(
                        data.transfer.data
                      ) as unknown as Connector
                    }
                  />
                  <span className="font-medium capitalize">
                    {getEffectiveProvider(data.transfer.data)?.toLowerCase()}
                  </span>
                </div>
              </DescriptionDetails>
            </>
          )}

          <DescriptionTerm>Reference</DescriptionTerm>
          <DescriptionDetails>
            <Chip
              {...chipVariantFromConsoleType['reference']}
              label={data.transfer.data.reference}
              copyMode="click"
            />
          </DescriptionDetails>

          <DescriptionTerm>Source Account ID</DescriptionTerm>
          <DescriptionDetails>
            <Chip
              {...chipVariantFromType['id']}
              label={data.transfer.data.sourceAccountID}
              maxWidth="xl"
              copyMode="click"
            />
          </DescriptionDetails>

          <DescriptionTerm>Destination Account ID</DescriptionTerm>
          <DescriptionDetails>
            <Chip
              {...chipVariantFromType['id']}
              label={data.transfer.data.destinationAccountID}
              maxWidth="xl"
              copyMode="click"
            />
          </DescriptionDetails>

          <DescriptionTerm>Type</DescriptionTerm>
          <DescriptionDetails>
            <Badge
              variant={badgeVariantFromTransferType[data.transfer.data.type]}
            >
              {data.transfer.data.type}
            </Badge>
          </DescriptionDetails>

          <DescriptionTerm>Status</DescriptionTerm>
          <DescriptionDetails>
            <Badge
              variant={
                badgeVariantFromTransferStatus[data.transfer.data.status]
              }
            >
              {data.transfer.data.status}
            </Badge>
          </DescriptionDetails>

          <DescriptionTerm>Initial Amount</DescriptionTerm>
          <DescriptionDetails>
            <ChipAmount
              asset={data.transfer.data.asset}
              amount={data.transfer.data.initialAmount}
              shouldFormat={shouldFormat}
            />
          </DescriptionDetails>

          <DescriptionTerm>Amount</DescriptionTerm>
          <DescriptionDetails>
            <ChipAmount
              asset={data.transfer.data.asset}
              amount={data.transfer.data.amount}
              shouldFormat={shouldFormat}
            />
          </DescriptionDetails>

          <DescriptionTerm>Asset</DescriptionTerm>
          <DescriptionDetails>
            <Chip
              {...chipVariantFromType['asset']}
              label={data.transfer.data.asset}
              copyMode="click"
            />
          </DescriptionDetails>

          <DescriptionTerm>Created at</DescriptionTerm>
          <DescriptionDetails>
            {formatDate(new Date(data.transfer.data.createdAt))}
          </DescriptionDetails>

          <DescriptionTerm>Scheduled at</DescriptionTerm>
          <DescriptionDetails>
            {formatDate(new Date(data.transfer.data.scheduledAt))}
          </DescriptionDetails>

          <DescriptionTerm>Metadata</DescriptionTerm>
          <DescriptionDetails>
            <PreviewJson json={data.transfer.data.metadata ?? {}} />
          </DescriptionDetails>
        </DescriptionList>
      </AppCard>

      {data?.transfer?.data?.relatedAdjustments && (
        <PaymentTransferRelatedAdjustements
          className="col-span-12"
          paymentTransferRelatedAdjustements={
            data.transfer.data
              .relatedAdjustments as unknown as NormalizedTransferInitiationAdjustementModel[]
          }
          version={data.version}
        />
      )}
    </AppContentGrid>
  );
}
