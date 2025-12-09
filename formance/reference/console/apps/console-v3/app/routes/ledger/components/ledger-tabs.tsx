import React from 'react';
import TabsNavigation from '../../../components/tabs-navigation';
import { ROUTES } from '../../../utils/routes';
import { isVersionGreaterOrEqual } from '../../../utils/version';

type LedgerTabsProps = {
  organizationId: string;
  stackId: string;
  region: string;
  ledgerName: string;
  version: string;
};

export default function LedgerTabs({
  organizationId,
  stackId,
  region,
  ledgerName,
  version,
}: LedgerTabsProps) {
  const isV2OrGreater = isVersionGreaterOrEqual(version, '2');

  const tabs = [
    {
      label: 'Information',
      value: 'information',
      routeId: 'LEDGER_DETAIL',
      route: ROUTES({ organizationId, stackId, region, ledgerName })[
        'LEDGER_DETAIL'
      ].to,
      shortcut: 'i',
    },
    {
      label: 'Transactions',
      value: 'transactions',
      routeId: 'LEDGER_TRANSACTIONS',
      route: ROUTES({ organizationId, stackId, region, ledgerName })[
        'LEDGER_TRANSACTIONS'
      ].to,
      shortcut: 't',
    },
    {
      label: 'Accounts',
      value: 'accounts',
      routeId: 'LEDGER_ACCOUNTS',
      route: ROUTES({ organizationId, stackId, region, ledgerName })[
        'LEDGER_ACCOUNTS'
      ].to,
      shortcut: 'a',
    },
    ...(isV2OrGreater
      ? [
          {
            label: 'Volumes',
            value: 'volumes',
            routeId: 'LEDGER_VOLUMES',
            route: ROUTES({ organizationId, stackId, region, ledgerName })[
              'LEDGER_VOLUMES'
            ].to,
            shortcut: 'v',
          },
        ]
      : []),
    ...(isV2OrGreater
      ? [
          {
            label: 'Aggregate Balances',
            value: 'aggregate-balances',
            routeId: 'LEDGER_AGGREGATE_BALANCES',
            route: ROUTES({ organizationId, stackId, region, ledgerName })[
              'LEDGER_AGGREGATE_BALANCES'
            ].to,
            shortcut: 'b',
          },
        ]
      : []),
    {
      label: 'Storage Migrations',
      value: 'storage-migrations',
      routeId: 'LEDGER_STORAGE_MIGRATIONS',
      route: ROUTES({ organizationId, stackId, region, ledgerName })[
        'LEDGER_STORAGE_MIGRATIONS'
      ].to,
      shortcut: 'm',
    },
    {
      label: 'Logs',
      value: 'logs',
      routeId: 'LEDGER_LOGS',
      route: ROUTES({ organizationId, stackId, region, ledgerName })[
        'LEDGER_LOGS'
      ].to,
      shortcut: 'l',
    },
  ];

  return <TabsNavigation tabs={tabs} />;
}
