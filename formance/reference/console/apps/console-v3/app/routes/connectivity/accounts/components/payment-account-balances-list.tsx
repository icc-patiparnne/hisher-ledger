import { Banknote } from 'lucide-react';
import React from 'react';

import {
  AppCard,
  Chip,
  ChipAmount,
  chipVariantFromType,
  ColumnDef,
  DataTableFormatOptions,
} from '@platform/ui';

import { DatatableServerSide } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { formatDate } from '@platform/utils';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';

import { NormalizedPaymentAccountBalanceModel } from '../../../../utils/sdk/payments/models';
import { CONNECTIVITY_ACCOUNT_BALANCES_LIST } from '../../constants';

import { useFormatAmount } from '../../../../hooks/useFormatAmount';

type TPaymentAccountTransferInitiationsProps = {
  paymentAccountBalances: Cursor<NormalizedPaymentAccountBalanceModel>;
  serverSide?: boolean;
  version: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PaymentAccountBalancesList({
  paymentAccountBalances,
  serverSide,
  version,
  ...props
}: TPaymentAccountTransferInitiationsProps) {
  useRouteGuard({
    componentName: 'payments-account-transfer-initiations',
    requiredParams: ['paymentAccountId'],
  });

  const { shouldFormat, toggleFormat } = useFormatAmount();

  const columns: ColumnDef<NormalizedPaymentAccountBalanceModel>[] = [
    {
      header: 'Asset',
      accessorKey: 'asset',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Chip {...chipVariantFromType['asset']} label={row.original.asset} />
        </div>
      ),
    },

    {
      header: 'Balance',
      accessorKey: 'balance',
      cell: ({ row }) => (
        <ChipAmount
          asset={row.original.asset}
          amount={row.original.balance}
          shouldFormat={shouldFormat}
        />
      ),
    },

    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }) =>
        row.original.createdAt ? (
          formatDate(new Date(row.original.createdAt))
        ) : (
          <span className="text-sm text-foreground">-</span>
        ),
    },

    {
      header: 'Last Updated At',
      accessorKey: 'lastUpdatedAt',
      cell: ({ row }) =>
        row.original.lastUpdatedAt ? (
          formatDate(new Date(row.original.lastUpdatedAt))
        ) : (
          <span className="text-sm text-foreground">-</span>
        ),
    },
  ];

  return (
    <AppCard title="Balances" variant="slate" appIcon={Banknote} {...props}>
      <DatatableServerSide
        columns={columns}
        data={paymentAccountBalances}
        id={CONNECTIVITY_ACCOUNT_BALANCES_LIST}
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
