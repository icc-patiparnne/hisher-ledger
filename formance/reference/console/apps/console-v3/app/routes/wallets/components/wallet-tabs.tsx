import React from 'react';
import TabsNavigation from '../../../components/tabs-navigation';
import { ROUTES } from '../../../utils/routes';

type WalletTabsProps = {
  organizationId: string;
  stackId: string;
  region: string;
  walletId: string;
};

export default function WalletTabs({
  organizationId,
  stackId,
  region,
  walletId,
}: WalletTabsProps) {
  const tabs = [
    {
      label: 'Information',
      value: 'information',
      routeId: 'WALLET_DETAIL',
      route: ROUTES({ organizationId, stackId, region, walletId })[
        'WALLET_DETAIL'
      ].to,
      shortcut: 'i',
    },
    {
      label: 'Balances',
      value: 'balances',
      routeId: 'WALLET_BALANCES',
      route: ROUTES({ organizationId, stackId, region, walletId })[
        'WALLET_BALANCES'
      ].to,
      shortcut: 'b',
    },
    {
      label: 'Holds',
      value: 'holds',
      routeId: 'WALLET_HOLDS',
      route: ROUTES({ organizationId, stackId, region, walletId })[
        'WALLET_HOLDS'
      ].to,
      shortcut: 'h',
    },
    {
      label: 'Transactions',
      value: 'transactions',
      routeId: 'WALLET_TRANSACTIONS',
      route: ROUTES({ organizationId, stackId, region, walletId })[
        'WALLET_TRANSACTIONS'
      ].to,
      shortcut: 't',
    },
  ];

  return <TabsNavigation tabs={tabs} />;
}
