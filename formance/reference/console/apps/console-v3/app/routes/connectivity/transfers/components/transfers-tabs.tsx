import React from 'react';
import TabsNavigation from '../../../../components/tabs-navigation';
import { ROUTES } from '../../../../utils/routes';

type TransfersTabsProps = {
  organizationId: string;
  stackId: string;
  region: string;
  waitingForValidationTransfers: number;
};

export default function TransfersTabs({
  organizationId,
  stackId,
  region,
  waitingForValidationTransfers,
}: TransfersTabsProps) {
  const tabs = [
    {
      label: 'All Transfers',
      value: 'all-transfers',
      routeId: 'CONNECTIVITY_TRANSFERS',
      route: ROUTES({ organizationId, stackId, region })[
        'CONNECTIVITY_TRANSFERS'
      ].to,
      shortcut: 'a',
    },
    {
      label: 'Waiting for Validation',
      value: 'waiting-for-validation',
      routeId: 'CONNECTIVITY_TRANSFERS_VALIDATE',
      route: ROUTES({ organizationId, stackId, region })[
        'CONNECTIVITY_TRANSFERS_VALIDATE'
      ].to,
      shortcut: 'w',
      disabled: waitingForValidationTransfers === 0,
      customContent: (
        <>
          {waitingForValidationTransfers === 0 ? (
            <span className="rounded-full bg-valid px-2 py-0.5 text-xs text-foreground">
              {waitingForValidationTransfers}
            </span>
          ) : (
            waitingForValidationTransfers > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {waitingForValidationTransfers}
              </span>
            )
          )}
        </>
      ),
    },
  ];

  return <TabsNavigation tabs={tabs} />;
}
