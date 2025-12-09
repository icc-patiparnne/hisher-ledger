import { Banknote } from 'lucide-react';
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

import { formatDate } from '@platform/utils';
import { useFormatAmount } from '../../../../hooks/useFormatAmount';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import {
  NormalizedCashPoolBalanceModel,
  NormalizedCashPoolBalancesModel,
} from '../../../../utils/sdk/payments/models';

type TPaymentCashPoolsBalancesListProps = {
  cashPoolBalances: NormalizedCashPoolBalancesModel;
  version: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PaymentsCashPoolsBalancesList({
  cashPoolBalances,
  version,
  ...props
}: TPaymentCashPoolsBalancesListProps) {
  useRouteGuard({
    componentName: 'payments-cash-pools-balances-list',
    requiredParams: ['paymentCashPoolId'],
  });

  const { shouldFormat, toggleFormat } = useFormatAmount();

  const columns: ColumnDef<NormalizedCashPoolBalanceModel>[] = [
    {
      header: 'Asset',
      accessorKey: 'asset',
      cell: ({ row }) => (
        <Chip {...chipVariantFromType['asset']} label={row.original.asset} />
      ),
    },

    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }) =>
        (row.original.amount as unknown as string) === '0' ||
        !row.original.amount ? (
          <Chip
            {...chipVariantFromType['string']}
            label="No balances available"
          />
        ) : (
          <ChipAmount
            asset={row.original.asset}
            amount={row.original.amount}
            shouldFormat={shouldFormat}
          />
        ),
    },

    {
      header: 'As of',
      accessorKey: 'asOf',
      cell: () => (
        <span className="whitespace-nowrap select-all">
          {formatDate(new Date())}
        </span>
      ),
    },
  ];

  return (
    <AppCard title="Balances" variant="slate" appIcon={Banknote} {...props}>
      <DataTable
        columns={columns}
        data={cashPoolBalances}
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
