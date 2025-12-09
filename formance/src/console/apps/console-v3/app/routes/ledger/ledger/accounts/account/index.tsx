import { Info, Users } from 'lucide-react';
import {
  LoaderFunction,
  Outlet,
  useLoaderData,
  useOutletContext,
} from 'react-router';
import invariant from 'tiny-invariant';

import {
  Button,
  Card,
  CardContent,
  CardTitle,
  ChipAccount,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Favorite,
  PreviewJson,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@platform/ui';
import {
  AppContentGrid,
  AppContentHeaderRoute,
} from '../../../../../components/app-content';
import AppErrorBoundary from '../../../../../components/app-error-boundary';
import { useFavorites } from '../../../../../hooks/useFavorites';
import { FEATURES, useFeatureFlag } from '../../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../../hooks/useRouteGuard';
import { withContext } from '../../../../../utils/auth.server';
import { ROUTES } from '../../../../../utils/routes';
import {
  NormalizedAccountModel,
  NormalizedLedgerModel,
  NormalizedStatsModel,
  NormalizedTransactionModel,
} from '../../../../../utils/sdk/ledger/models';
import {
  NormalizedGetLedgerResponse,
  NormalizedGetLedgerStatsResponse,
  NormalizedListAccountsResponse,
  NormalizedListTransactionsResponse,
} from '../../../../../utils/sdk/ledger/responses';
import { NormalizedSDK } from '../../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../../utils/session.gateway.server';

import { Cursor } from '@platform/sdks/utils/cursor';
import { MODULES_GATEWAYS } from '@platform/utils';
import React from 'react';
import TabsNavigation from '../../../../../components/tabs-navigation';
import { CurrentContext } from '../../../../../root';
import LedgerHeader from '../../../components/ledger-header';
import { v1Loader } from './ledger-account.v1';
import { v2Loader } from './ledger-account.v2';

export type Data = {
  ledger: NormalizedGetLedgerResponse | undefined;
  ledgerStats: NormalizedGetLedgerStatsResponse | undefined;
  ledgerAccount: NormalizedListAccountsResponse | undefined;
  ledgerAccountTransactions: NormalizedListTransactionsResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  ledger: { data: NormalizedLedgerModel };
  ledgerStats: { data: NormalizedStatsModel };
  ledgerAccount: { data: NormalizedAccountModel };
  ledgerAccountTransactions: { cursor: Cursor<NormalizedTransactionModel> };
}>;

export type TLedgerAccountContext = CurrentContext & LoaderData;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  const ledgerName = params.ledgerName;
  const address = params.address;
  invariant(ledgerName, 'params.ledgerName is required');
  invariant(address, 'params.address is required');

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
            await v1Loader(api, ledgerName, address, request),
            version
          );
        }
        case '2':
        default:
          return wrapLoaderWithProps<Data>(
            await v2Loader(api, ledgerName, address, request),
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

export default function LedgerAccount() {
  useFeatureFlag(FEATURES.ledger);

  const { organizationId, stackId, region, ledgerName, address } =
    useRouteGuard({
      componentName: 'ledger-account',
      requiredParams: ['ledgerName', 'address'],
    });

  const context = useOutletContext<CurrentContext>();

  const { ledger, ledgerStats, ledgerAccount, ledgerAccountTransactions } =
    useLoaderData<LoaderData>() as unknown as LoaderData;

  const combinedContext = {
    ...context,
    ledgerAccount,
    ledger,
    ledgerStats,
    ledgerAccountTransactions,
  };

  return (
    <AppContentGrid>
      <AppContentHeaderRoute className="grid col-span-12 grid-cols-12 gap-2">
        <div className="lg:col-span-5 col-span-12">
          <LedgerHeader ledger={ledger?.data} ledgerStats={ledgerStats?.data} />
        </div>

        <div className="lg:col-span-7 col-span-12">
          <LedgerAccountHeader ledgerAccount={ledgerAccount.data} />
        </div>
      </AppContentHeaderRoute>

      <div className="col-span-12">
        <TabsNavigation
          tabs={[
            {
              label: 'Overview',
              value: 'overview',
              routeId: 'LEDGER_ACCOUNT',
              route: ROUTES({
                organizationId,
                stackId,
                region,
                ledgerName,
                address,
              })['LEDGER_ACCOUNT'].to,
              shortcut: 'o',
            },
            {
              label: 'Assets',
              value: 'assets',
              routeId: 'LEDGER_ACCOUNT_ASSETS',
              route: ROUTES({
                organizationId,
                stackId,
                region,
                ledgerName,
                address,
              })['LEDGER_ACCOUNT_ASSETS'].to,
              shortcut: 'a',
            },
            {
              label: 'Metadata',
              value: 'metadata',
              routeId: 'LEDGER_ACCOUNT_METADATA',
              route: ROUTES({
                organizationId,
                stackId,
                region,
                ledgerName,
                address,
              })['LEDGER_ACCOUNT_METADATA'].to,
              shortcut: 'm',
            },
          ]}
        />
      </div>

      <Outlet context={combinedContext} />
    </AppContentGrid>
  );
}

function LedgerAccountHeader({
  ledgerAccount,
}: {
  ledgerAccount: NormalizedAccountModel;
}) {
  const { ledgerName } = useRouteGuard({
    componentName: 'ledger-account-header',
    requiredParams: ['ledgerName'],
  });

  const { toggleFavorite, isFavorite } = useFavorites('ledger.ledgerAccounts');

  return (
    <Card data-header="ledger-account" className="h-full justify-center">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="lilac" size="icon-md" notClickable>
                <Users />
              </Button>
              <CardTitle>Account</CardTitle>
            </div>
            <div className="min-w-0 flex-1">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <ChipAccount
                  address={ledgerAccount?.address}
                  copyMode="click"
                />
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            <Favorite
              isFavorite={isFavorite({
                address: ledgerAccount.address,
                ledgerName,
              })}
              setIsFavorite={() =>
                toggleFavorite({
                  address: ledgerAccount.address,
                  ledgerName,
                })
              }
            />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon-md">
                  <Info />
                </Button>
              </SheetTrigger>
              <SheetContent className="lg:w-[700px] sm:max-w-none flex flex-col">
                <SheetHeader>
                  <SheetTitle>Information</SheetTitle>
                  <SheetDescription>
                    Information about the account
                  </SheetDescription>
                </SheetHeader>
                <Separator />
                <div className="overflow-y-scroll p-4 overflow-x-hidden flex-1 no-scrollbar">
                  <DescriptionList>
                    <DescriptionTerm>Address</DescriptionTerm>
                    <DescriptionDetails>
                      <ChipAccount
                        address={ledgerAccount?.address}
                        copyMode="click"
                      />
                    </DescriptionDetails>

                    {ledgerAccount?.metadata && (
                      <>
                        <DescriptionTerm>Metadata</DescriptionTerm>
                        <DescriptionDetails>
                          <PreviewJson
                            className="w-full"
                            json={ledgerAccount.metadata ?? {}}
                            defaultUnfoldAll={true}
                          />
                        </DescriptionDetails>
                      </>
                    )}
                  </DescriptionList>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
