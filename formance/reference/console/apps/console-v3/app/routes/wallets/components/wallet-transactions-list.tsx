import { omit } from 'lodash-es';
import { ArrowUpDown, LayoutList } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import {
  AppCard,
  Button,
  Chip,
  ChipAccount,
  ChipAmount,
  chipVariantFromType,
  ColumnDef,
  DataTableFormatOptions,
} from '@platform/ui';

import { DatatableServerSide } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { formatDate } from '@platform/utils';
import { chipVariantFromConsoleType } from '../../../components/chip';
import { useFormatAmount } from '../../../hooks/useFormatAmount';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { ROUTES } from '../../../utils/routes';
import { NormalizedWalletTransactionModel } from '../../../utils/sdk/wallets/models';
import { WALLETS_TRANSACTIONS_LIST } from '../constants';

type TWalletTransactionsListProps = {
  walletTransactions: Cursor<NormalizedWalletTransactionModel>;
  version: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function WalletTransactionsList({
  walletTransactions,
  version,
  ...props
}: TWalletTransactionsListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'wallet-transactions-list',
  });

  const { shouldFormat, toggleFormat } = useFormatAmount();

  const tableData = walletTransactions?.data.flatMap((transaction) =>
    transaction.postings.map((posting, index) => ({
      ...transaction,
      posting,
      isFirstPosting: index === 0,
    }))
  );

  const data = {
    ...omit(walletTransactions, ['data']),
    data: tableData,
  };

  const columns: ColumnDef<(typeof data.data)[0]>[] = [
    {
      header: 'Transaction ID',
      accessorKey: 'txID',
      cell: ({ row }) => {
        if (!row.original.isFirstPosting) return null;

        return (
          <Chip
            {...chipVariantFromConsoleType['transactionId']}
            label={row.original.id.toString()}
          />
        );
      },
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }) => (
        <ChipAmount
          asset={row.original.posting.asset}
          amount={row.original.posting.amount}
          shouldFormat={shouldFormat}
        />
      ),
    },

    {
      header: 'Asset',
      accessorKey: 'asset',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['asset']}
          label={row.original.posting.asset}
        />
      ),
    },

    {
      header: 'Source',
      accessorKey: 'source',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              ledgerName: row.original.ledger,
              address: row.original.posting.source,
            })['LEDGER_ACCOUNT'].to
          }
        >
          <ChipAccount address={row.original.posting.source} />
        </Link>
      ),
    },
    {
      header: 'Destination',
      accessorKey: 'destination',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              ledgerName: row.original.ledger,
              address: row.original.posting.destination,
            })['LEDGER_ACCOUNT'].to
          }
        >
          <ChipAccount address={row.original.posting.destination} />
        </Link>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="px-0"
        >
          Timestamp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="whitespace-nowrap select-all">
          {row.original.isFirstPosting
            ? formatDate(row.original.timestamp)
            : '-'}
        </div>
      ),
    },
  ];

  return (
    <AppCard
      title="Transactions"
      description="A list of all wallet transactions"
      variant="cobaltDark"
      appIcon={LayoutList}
      {...props}
    >
      <DatatableServerSide
        columns={columns}
        data={data}
        id={WALLETS_TRANSACTIONS_LIST}
        initialState={{
          columnVisibility: {
            Asset: false,
          },
        }}
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
