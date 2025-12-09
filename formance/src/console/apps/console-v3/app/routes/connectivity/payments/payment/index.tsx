import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { formatDate, MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Chip,
  ChipAmount,
  chipVariantFromType,
  ConnectorIcon,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  PreviewJson,
} from '@platform/ui';
import {
  AppContentGrid,
  AppContentHeaderRoute,
} from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';
import {
  NormalizedPaymentAdjustmentModel,
  NormalizedPaymentModel,
} from '../../../../utils/sdk/payments/models';
import { NormalizedGetPaymentResponse } from '../../../../utils/sdk/payments/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import PaymentHeader from '../components/payment-header';

import { Connector } from '@platform/sdks/formance/src/models/components';
import {
  badgeVariantFromPaymentStatus,
  badgeVariantFromPaymentType,
} from '../../../../components/badge';
import { chipVariantFromConsoleType } from '../../../../components/chip';
import { useFormatAmount } from '../../../../hooks/useFormatAmount';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { getEffectiveProvider } from '../../utils';
import PaymentAdjustmentList from '../components/payment-adjustment-list';
import { paymentLoader } from './payment';

export type Data = {
  payment: NormalizedGetPaymentResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  payment: { data: NormalizedPaymentModel };
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.paymentId, 'params.paymentId is required');
  const paymentId = params.paymentId;

  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.PAYMENTS
      );

      return wrapLoaderWithProps<Data>(
        await paymentLoader(api, { paymentId }),
        version
      );
    },

    authenticator,
    request,
    [MODULES_GATEWAYS.PAYMENTS],
    FEATURES.payments
  )) as LoaderData;
};

export default function Payment() {
  const { organizationId, stackId, region, paymentId } = useRouteGuard({
    componentName: 'payment',
    requiredParams: ['paymentId'],
  });

  const data = useLoaderData<LoaderData>();

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_PAYMENT_DETAIL',
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
      {
        title: paymentId,
        to: ROUTES({
          organizationId,
          stackId,
          region,
          paymentId,
        })['CONNECTIVITY_PAYMENT_DETAIL'].to,
      },
    ],
  });

  const { shouldFormat } = useFormatAmount();

  return (
    <AppContentGrid>
      <AppContentHeaderRoute className="col-span-12">
        <PaymentHeader
          payment={data.payment.data as unknown as NormalizedPaymentModel}
        />
      </AppContentHeaderRoute>

      <Card className="col-span-12">
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent>
          <DescriptionList>
            <DescriptionTerm>ID</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromType['id']}
                label={data.payment.data.id}
                maxWidth="xl"
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Type</DescriptionTerm>
            <DescriptionDetails>
              <Badge
                variant={badgeVariantFromPaymentType[data.payment.data.type]}
              >
                {data.payment.data.type}
              </Badge>
            </DescriptionDetails>

            <DescriptionTerm>Provider</DescriptionTerm>
            <DescriptionDetails>
              <div className="flex items-center gap-1.5">
                <ConnectorIcon
                  name={
                    getEffectiveProvider(
                      data.payment.data
                    ) as unknown as Connector
                  }
                />
                <span className="font-medium capitalize ">
                  {getEffectiveProvider(data.payment.data)?.toLowerCase()}
                </span>
              </div>
            </DescriptionDetails>

            <DescriptionTerm>Status</DescriptionTerm>
            <DescriptionDetails>
              <Badge
                variant={
                  badgeVariantFromPaymentStatus[data.payment.data.status]
                }
              >
                {data.payment.data.status}
              </Badge>
            </DescriptionDetails>

            <DescriptionTerm>Scheme</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromConsoleType['scheme']}
                label={data.payment.data.scheme}
              />
            </DescriptionDetails>

            <DescriptionTerm>Reference</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromConsoleType['reference']}
                label={data.payment.data.reference}
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Asset</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromType['asset']}
                label={data.payment.data.asset}
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Initial Amount</DescriptionTerm>
            <DescriptionDetails>
              <ChipAmount
                asset={data.payment.data.asset}
                amount={data.payment.data.initialAmount}
                shouldFormat={shouldFormat}
              />
            </DescriptionDetails>

            <DescriptionTerm>Net Amount</DescriptionTerm>
            <DescriptionDetails>
              <ChipAmount
                asset={data.payment.data.asset}
                amount={data.payment.data.amount}
                shouldFormat={shouldFormat}
              />
            </DescriptionDetails>

            <DescriptionTerm>Created at</DescriptionTerm>
            <DescriptionDetails>
              <span>{formatDate(new Date(data.payment.data.createdAt))}</span>
            </DescriptionDetails>

            <DescriptionTerm>Metadata</DescriptionTerm>
            <DescriptionDetails>
              <PreviewJson
                className="w-full"
                json={data.payment.data.metadata ?? {}}
                defaultUnfoldAll={true}
              />
            </DescriptionDetails>
          </DescriptionList>
        </CardContent>
      </Card>

      {/* <Card className="col-span-12 lg:col-span-4">
        <CardHeader>
          <CardTitle>Events journal</CardTitle>
        </CardHeader>
        <CardContent>
          <DescriptionList>
            <DescriptionTerm>Payment synced</DescriptionTerm>
            <DescriptionDetails>
              <div className="flex items-center gap-2">
                <Button
                  variant="valid"
                  size="icon-sm"
                  className="pointer-events-none"
                >
                  <Check className="text-success" />
                </Button>
                <span>
                  {formatDate(new Date(data.payment.data.createdAt))}
                </span>
              </div>
            </DescriptionDetails>
          </DescriptionList>
        </CardContent>
      </Card> */}

      <div className="col-span-12">
        <PaymentAdjustmentList
          adjustments={
            data.payment.data
              .adjustments as unknown as NormalizedPaymentAdjustmentModel[]
          }
          asset={data.payment.data.asset}
          version={data.version}
        />
      </div>
    </AppContentGrid>
  );
}
