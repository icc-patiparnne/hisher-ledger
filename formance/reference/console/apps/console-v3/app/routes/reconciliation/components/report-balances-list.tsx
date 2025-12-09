import { SquareDot } from 'lucide-react';
import React from 'react';

import {
  AppCard,
  Chip,
  ChipAmount,
  chipVariantFromType,
  ColumnDef,
  DataTable,
  DataTableFormatOptions,
} from '@platform/ui';
import { useFormatAmount } from '../../../hooks/useFormatAmount';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { NormalizedReconciliationBalancesModel } from '../../../utils/sdk/reconciliation/models';

type TReportBalancesListProps = {
  balances: NormalizedReconciliationBalancesModel[];
  version: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function ReportBalancesList({
  balances,
  version,
  ...props
}: TReportBalancesListProps) {
  useRouteGuard({
    componentName: 'report-balances-list',
    requiredParams: ['reportId'],
  });

  const { shouldFormat, toggleFormat } = useFormatAmount();

  const columns: ColumnDef<NormalizedReconciliationBalancesModel>[] = [
    {
      header: 'Asset',
      accessorKey: 'asset',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['asset']}
          label={row.original.ledgerBalances.split(' ')[1] ?? ''}
          copyMode="click"
        />
      ),
    },
    {
      header: 'Managed in ledger',
      accessorKey: 'ledgerBalances',
      cell: ({ row }) => {
        const asset = row.original.ledgerBalances.split(' ')[1] ?? '';
        const amount = Number(row.original.ledgerBalances.split(' ')[0] ?? 0);

        return (
          <ChipAmount
            asset={asset}
            amount={amount}
            shouldFormat={shouldFormat}
          />
        );
      },
    },
    {
      header: 'Available in pool',
      accessorKey: 'paymentsBalances',
      cell: ({ row }) => {
        const asset = row.original.paymentsBalances?.split(' ')[1] ?? '';
        const amount = Number(
          row.original.paymentsBalances?.split(' ')[0] ?? 0
        );

        return (
          <ChipAmount
            asset={asset}
            amount={amount}
            shouldFormat={shouldFormat}
          />
        );
      },
    },

    {
      header: 'Drift',
      accessorKey: 'driftBalances',
      cell: ({ row }) => {
        const asset = row.original.driftBalances?.split(' ')[1] ?? '';
        const amount = Number(row.original.driftBalances?.split(' ')[0] ?? 0);

        return (
          <ChipAmount
            {...chipVariantFromType['number']}
            asset={asset}
            amount={amount}
            shouldFormat={shouldFormat}
          />
        );
      },
    },
  ];

  return (
    <AppCard
      title="Balances"
      description="A list of all the balances from this report"
      variant="slate"
      appIcon={SquareDot}
      {...props}
    >
      <DataTable
        columns={columns}
        data={balances}
        displayPagination={true}
        toolbarRight={
          <>
            <DataTableFormatOptions
              checked={shouldFormat}
              onCheckedChange={toggleFormat}
            />
          </>
        }
      />
    </AppCard>
  );
}
