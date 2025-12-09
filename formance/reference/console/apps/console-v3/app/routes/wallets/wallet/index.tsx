import { ArrowUpRight, Info } from 'lucide-react';
import { Link, LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { formatDate, MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { withContext } from '../../../utils/auth.server';
import { ROUTES } from '../../../utils/routes';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { NormalizedGetWalletResponse } from '../../../utils/sdk/wallets/responses';
import { getAuthenticator } from '../../../utils/session.auth.server';

import { GetWalletSummaryResponse } from '@platform/sdks/formance/src/models/components';
import {
  AppCard,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Chip,
  ChipAmount,
  chipVariantFromType,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  PreviewJson,
} from '@platform/ui';
import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { chipVariantFromConsoleType } from '../../../components/chip';
import { FEATURES, useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { useFormatAmount } from '../../../hooks/useFormatAmount';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { NormalizedWalletModel } from '../../../utils/sdk/wallets/models';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';
import WalletsActions from '../components/wallet-actions';
import WalletHeader from '../components/wallet-header';
import WalletTabs from '../components/wallet-tabs';
import { v1Loader } from './wallet.v1';

export type Data = {
  wallet: NormalizedGetWalletResponse | undefined;
  walletSummary: GetWalletSummaryResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  wallet: { data: NormalizedWalletModel };
  walletSummary: GetWalletSummaryResponse;
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.walletId, 'params.walletId is required');
  const walletId = params.walletId;

  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.WALLETS
      );

      switch (version) {
        case '1':
        default:
          return wrapLoaderWithProps<Data>(
            await v1Loader(api, walletId),
            version
          );
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.WALLETS],
    FEATURES.wallets
  )) as LoaderData;
};

export default function Wallet() {
  useFeatureFlag(FEATURES.wallets);

  const { organizationId, stackId, region, walletId } = useRouteGuard({
    componentName: 'wallet',
    requiredParams: ['walletId'],
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.WALLETS,
    routeId: 'WALLET_DETAIL',
    breadcrumbs: [
      {
        title: 'Wallets',
      },
      {
        title: 'All Wallets',
        to: ROUTES({ organizationId, stackId, region })['WALLETS_ALL'].to,
      },
      {
        title: walletId,
        to: ROUTES({ organizationId, stackId, region, walletId })[
          'WALLET_DETAIL'
        ].to,
      },
    ],
  });

  const { shouldFormat } = useFormatAmount();

  const data = useLoaderData<LoaderData>();

  const availableFunds = Object.entries(data.walletSummary.data.availableFunds);
  const expirableFunds = Object.entries(data.walletSummary.data.expirableFunds);
  const expiredFunds = Object.entries(data.walletSummary.data.expiredFunds);
  const holdFunds = Object.entries(data.walletSummary.data.holdFunds);

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <WalletHeader
          wallet={data.wallet.data as unknown as NormalizedWalletModel}
        />
      </div>

      <div className="col-span-12">
        <div className="flex items-center justify-between">
          <WalletTabs
            organizationId={organizationId}
            stackId={stackId}
            region={region}
            walletId={walletId}
          />
          <WalletsActions
            walletBalances={
              data.walletSummary.data
                .balances as unknown as GetWalletSummaryResponse['data']['balances']
            }
          />
        </div>
      </div>

      <div className="col-span-12">
        <div className="col-span-12 grid lg:grid-cols-2 xl:grid-cols-4 gap-2">
          <Card className="col-span-4 lg:col-span-1">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="emerald" size="icon-md">
                    <ArrowUpRight />
                  </Button>
                  <span>Available funds</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableFunds.length > 0 ? (
                <ul className="grid gap-2">
                  {availableFunds.map(([key, value]) => (
                    <li key={key} className="flex items-center gap-2">
                      <Chip
                        {...chipVariantFromType['asset']}
                        label={`${key}`}
                      />
                      <ChipAmount
                        asset={key}
                        amount={value}
                        shouldFormat={shouldFormat}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <Chip
                  {...chipVariantFromType['undefined']}
                  label="No available funds"
                />
              )}
            </CardContent>
          </Card>

          <Card className="col-span-4 lg:col-span-1">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="emerald" size="icon-md">
                    <ArrowUpRight />
                  </Button>
                  <span>Expirable funds</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expirableFunds.length > 0 ? (
                <ul className="grid gap-2">
                  {expirableFunds.map(([key, value]) => (
                    <li
                      key={key}
                      className="flex items-center gap-2"
                      title={`${key}`}
                    >
                      <Chip
                        {...chipVariantFromType['asset']}
                        label={`${key}`}
                      />

                      <ChipAmount
                        {...chipVariantFromType['numberPositive']}
                        asset={key}
                        amount={value}
                        shouldFormat={shouldFormat}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <Chip
                  {...chipVariantFromType['undefined']}
                  label="No expirable funds"
                />
              )}
            </CardContent>
          </Card>

          <Card className="col-span-4 lg:col-span-1">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="emerald" size="icon-md">
                    <ArrowUpRight />
                  </Button>
                  <span>Expired funds</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expiredFunds.length > 0 ? (
                <ul className="grid gap-2">
                  {expiredFunds.map(([key, value]) => (
                    <li key={key} className="flex items-center gap-2">
                      <Chip
                        {...chipVariantFromType['asset']}
                        label={`${key}`}
                      />
                      <ChipAmount
                        {...chipVariantFromType['numberNegative']}
                        asset={key}
                        amount={value}
                        shouldFormat={shouldFormat}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <Chip
                  {...chipVariantFromType['undefined']}
                  label="No expired funds"
                />
              )}
            </CardContent>
          </Card>

          <Card className="col-span-4 lg:col-span-1">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="emerald" size="icon-md">
                    <ArrowUpRight />
                  </Button>
                  <span>Hold funds</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {holdFunds.length > 0 ? (
                <ul className="grid gap-2">
                  {Object.entries(data.walletSummary.data.holdFunds).map(
                    ([key, value]) => (
                      <li key={key} className="flex items-center gap-2">
                        <Chip
                          {...chipVariantFromType['asset']}
                          label={`${key}`}
                        />
                        <ChipAmount
                          asset={key}
                          amount={value}
                          shouldFormat={shouldFormat}
                        />
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <Chip
                  {...chipVariantFromType['undefined']}
                  label="No funds on hold"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="col-span-12">
        <AppCard title="Information" appIcon={Info}>
          <DescriptionList>
            <DescriptionTerm>ID</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromType['id']}
                label={data.wallet.data.id}
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Name</DescriptionTerm>
            <DescriptionDetails>
              <Link
                to={
                  ROUTES({
                    organizationId,
                    stackId,
                    region,
                    walletId,
                  })['WALLET_DETAIL'].to
                }
              >
                <Chip
                  {...chipVariantFromConsoleType['wallet']}
                  label={data.wallet.data.name}
                />
              </Link>
            </DescriptionDetails>

            <DescriptionTerm>Ledger</DescriptionTerm>
            <DescriptionDetails>
              <Link
                to={
                  ROUTES({
                    organizationId,
                    stackId,
                    region,
                    ledgerName: data.wallet.data.ledger,
                  })['LEDGER_DETAIL'].to
                }
              >
                <Chip
                  {...chipVariantFromConsoleType['ledger']}
                  label={data.wallet.data.ledger}
                />
              </Link>
            </DescriptionDetails>

            <DescriptionTerm>Created at</DescriptionTerm>
            <DescriptionDetails>
              <span>{formatDate(new Date(data.wallet.data.createdAt))}</span>
            </DescriptionDetails>

            <DescriptionTerm>Metadata</DescriptionTerm>
            <DescriptionDetails>
              <PreviewJson json={data.wallet.data.metadata} />
            </DescriptionDetails>
          </DescriptionList>
        </AppCard>
      </div>
    </AppContentGrid>
  );
}
