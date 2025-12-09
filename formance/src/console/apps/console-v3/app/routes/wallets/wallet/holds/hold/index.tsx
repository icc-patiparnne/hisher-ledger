import { OctagonPause } from 'lucide-react';
import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { AppContentGrid } from '../../../../../components/app-content';
import AppErrorBoundary from '../../../../../components/app-error-boundary';
import { FEATURES } from '../../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../../hooks/useRouteGuard';
import { withContext } from '../../../../../utils/auth.server';
import { ROUTES } from '../../../../../utils/routes';
import { NormalizedSDK } from '../../../../../utils/sdk/sdk';
import {
  NormalizedWalletExpandedHoldModel,
  NormalizedWalletModel,
} from '../../../../../utils/sdk/wallets/models';
import {
  NormalizedGetWalletHoldResponse,
  NormalizedGetWalletResponse,
} from '../../../../../utils/sdk/wallets/responses';
import { getAuthenticator } from '../../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../../utils/session.gateway.server';
import WalletHeader from '../../../components/wallet-header';
import { v1Loader } from './wallet-hold.v1';

import { GetWalletSummaryResponse } from '@platform/sdks/formance/src/models/components';
import {
  AppCard,
  Button,
  Card,
  CardContent,
  CardTitle,
  Chip,
  ChipAccount,
  ChipAmount,
  chipVariantFromType,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  PreviewJson,
} from '@platform/ui';
import { chipVariantFromConsoleType } from '../../../../../components/chip';
import { useRouteUpdate } from '../../../../../hooks/useRouteUpdate';
import WalletHoldsActions from '../../../components/wallet-holds-actions';

export type Data = {
  wallet: NormalizedGetWalletResponse | undefined;
  walletSummary: GetWalletSummaryResponse | undefined;
  walletHold: NormalizedGetWalletHoldResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  wallet: { data: NormalizedWalletModel };
  walletSummary: GetWalletSummaryResponse;
  walletHold: { data: NormalizedGetWalletHoldResponse };
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const walletId = params.walletId;
  invariant(walletId, 'params.walletId is required');
  const walletHoldId = params.walletHoldId;
  invariant(walletHoldId, 'params.walletHoldId is required');

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
            await v1Loader(api, walletId, walletHoldId),
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
  const { organizationId, stackId, region, walletId, walletHoldId } =
    useRouteGuard({
      componentName: 'wallet',
      requiredParams: ['walletId', 'walletHoldId'],
    });

  useRouteUpdate({
    moduleName: MODULES_NAMES.WALLETS,
    routeId: 'WALLET_HOLD',
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
        to: ROUTES({
          organizationId,
          stackId,
          region,
          walletId,
        })['WALLET_DETAIL'].to,
      },
      {
        title: 'Holds',
        to: ROUTES({
          organizationId,
          stackId,
          region,
          walletId,
        })['WALLET_HOLDS'].to,
      },
      {
        title: 'Hold',
        to: ROUTES({
          organizationId,
          stackId,
          region,
          walletId,
          walletHoldId,
        })['WALLET_HOLD'].to,
      },
    ],
  });

  const { wallet, walletHold } = useLoaderData<LoaderData>();

  const hold = walletHold.data as unknown as NormalizedWalletExpandedHoldModel;

  const isWalletDestination = hold.destination?.type === 'WALLET';

  return (
    <AppContentGrid>
      <div className="col-span-12 lg:col-span-5">
        <WalletHeader
          wallet={wallet.data as unknown as NormalizedWalletModel}
        />
      </div>
      <div className="col-span-12 lg:col-span-7">
        <WalletHoldHeader walletHold={hold} />
      </div>

      <div className="col-span-12">
        <div className="flex justify-end">
          <WalletHoldsActions hold={hold} />
        </div>
      </div>

      <div className="col-span-12">
        <AppCard title="Information" className="col-span-12">
          <DescriptionList>
            <DescriptionTerm>ID</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromType['id']}
                label={hold.id}
                maxWidth="xl"
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Description</DescriptionTerm>
            <DescriptionDetails>
              <span>{hold.description}</span>
            </DescriptionDetails>

            {hold.destination && (
              <>
                <DescriptionTerm>Destination Type</DescriptionTerm>
                <DescriptionDetails>
                  <Chip
                    {...chipVariantFromConsoleType[
                      isWalletDestination ? 'wallet' : 'ledger'
                    ]}
                    label={`${
                      isWalletDestination ? 'Wallet' : 'Ledger Account'
                    }`}
                  />
                </DescriptionDetails>
              </>
            )}

            {hold.destination && (
              <>
                <DescriptionTerm>Destination Identifier</DescriptionTerm>
                <DescriptionDetails>
                  <ChipAccount address={hold.destination.identifier} />
                </DescriptionDetails>
              </>
            )}

            {hold.asset && (
              <>
                <DescriptionTerm>Asset</DescriptionTerm>
                <DescriptionDetails>
                  <Chip {...chipVariantFromType['asset']} label={hold.asset} />
                </DescriptionDetails>
              </>
            )}

            <DescriptionTerm>Remaining Amount</DescriptionTerm>
            <DescriptionDetails>
              <ChipAmount
                asset="USD"
                amount={hold.remaining}
                shouldFormat={true}
              />
            </DescriptionDetails>

            <DescriptionTerm>Original Amount</DescriptionTerm>
            <DescriptionDetails>
              <ChipAmount
                asset="USD"
                amount={hold.originalAmount}
                shouldFormat={true}
              />
            </DescriptionDetails>

            <DescriptionTerm>Metadata</DescriptionTerm>
            <DescriptionDetails>
              <PreviewJson json={hold.metadata} defaultUnfoldAll />
            </DescriptionDetails>
          </DescriptionList>
        </AppCard>
      </div>
    </AppContentGrid>
  );
}

function WalletHoldHeader({
  walletHold,
}: {
  walletHold: NormalizedWalletExpandedHoldModel;
}) {
  return (
    <Card data-header="wallet-hold" className="h-full justify-center">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="cobaltDark" size="icon-md" notClickable>
                <OctagonPause />
              </Button>
              <CardTitle>Hold</CardTitle>
            </div>
            <div className="min-w-0 flex-1">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Chip
                  {...chipVariantFromType['id']}
                  label={walletHold.id}
                  maxWidth="xl"
                  copyMode="click"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
