import { MergeIcon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import {
  AppCard,
  Chip,
  ChipAccount,
  ChipAmount,
  chipVariantFromType,
  ColumnDef,
  DataTable,
  DataTableFormatOptions,
  Row,
} from '@platform/ui';

import { V2Posting } from '@platform/sdks/formance/src/models/components';

import { ROUTES } from '../../../utils/routes';

import { useFormatAmount } from '../../../hooks/useFormatAmount';
import { useRouteGuard } from '../../../hooks/useRouteGuard';

type TLedgerTransactionsProps = {
  postings?: V2Posting[];
} & React.HTMLAttributes<HTMLDivElement>;

export default function LedgerTransactionPostingsList({
  postings,
}: TLedgerTransactionsProps) {
  const { organizationId, stackId, region, ledgerName } = useRouteGuard({
    componentName: 'ledger-transaction-postings-list',
    requiredParams: ['ledgerName'],
  });

  const { shouldFormat, toggleFormat } = useFormatAmount();

  const columns: ColumnDef<V2Posting>[] = [
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }) => (
        <ChipAmount
          asset={row.original.asset}
          amount={row.original.amount}
          shouldFormat={shouldFormat}
        />
      ),
    },

    {
      header: 'Asset',
      accessorKey: 'asset',
      cell: ({ row }: { row: Row<V2Posting> }) => (
        <Chip {...chipVariantFromType['asset']} label={row.original.asset} />
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
              ledgerName,
              address: row.original.source,
            })['LEDGER_ACCOUNT'].to
          }
        >
          <ChipAccount address={row.original.source} />
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
              ledgerName,
              address: row.original.destination,
            })['LEDGER_ACCOUNT'].to
          }
        >
          <ChipAccount address={row.original.destination} />
        </Link>
      ),
    },
  ];

  return (
    <AppCard
      title="Postings"
      description="List of all the postings in the transaction"
      variant="cobaltDark"
      appIcon={MergeIcon}
    >
      <DataTable
        columns={columns}
        data={postings ?? []}
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
