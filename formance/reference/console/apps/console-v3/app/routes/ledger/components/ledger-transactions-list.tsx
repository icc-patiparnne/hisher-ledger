import { omit } from 'lodash-es';
import { ArrowUpDown, Eye, LayoutList } from 'lucide-react';
import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router';

import {
  AppCard,
  Button,
  Chip,
  ChipAccount,
  ChipAmount,
  chipVariantFromType,
  ColumnDef,
  DataTableExportData,
  DataTableFilterList,
  DataTableFormatOptions,
  DataTableSingleFilter,
  Row,
  TDataTableToolbarProps,
} from '@platform/ui';

import { DatatableServerSide, useDataTableQuery } from '@platform/remix';
import { formatDate, padNumber } from '@platform/utils';

import { getSearchParam } from '@platform/remix/src/utils/helper';
import { Cursor } from '@platform/sdks/utils/cursor';
import { chipVariantFromConsoleType } from '../../../components/chip';
import { useFormatAmount } from '../../../hooks/useFormatAmount';
import { useLastSelected } from '../../../hooks/useLastSelected';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useSavedFilters } from '../../../hooks/useSavedFilters';
import { ROUTES } from '../../../utils/routes';
import {
  NormalizedLedgerModel,
  NormalizedTransactionModel,
} from '../../../utils/sdk/ledger/models';
import { LEDGER_SELECTED, LEDGER_TRANSACTIONS_LIST } from '../constants';
import { getLedgerTransactionsFiltersConfig } from '../filters/ledger-transactions-filters';

type TLedgerTransactionsProps = {
  title?: string;
  description?: string;
  ledgerTransactions?: Cursor<NormalizedTransactionModel>;
  allLedgers?: Cursor<NormalizedLedgerModel>;
  showLedgerColumn?: boolean;
  version: string;
} & TDataTableToolbarProps;

export default function LedgerTransactionsList({
  title = 'Transactions',
  description = 'List of transactions for the selected account',
  ledgerTransactions,
  allLedgers,
  version,
  showLedgerColumn = true,
  ...props
}: TLedgerTransactionsProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'ledger-transactions-list',
  });

  const { ledgerName: ledgerNameParam } = useParams();
  const ledgerName = ledgerNameParam ?? getSearchParam(LEDGER_SELECTED) ?? '';

  const { shouldFormat, toggleFormat } = useFormatAmount();

  const { handleQueryChange, handleResetFilters } = useDataTableQuery(
    LEDGER_TRANSACTIONS_LIST
  );

  const saveFiltersHook = useSavedFilters();

  const { lastSelected: lastSelectedLedger, saveLastSelected } =
    useLastSelected('ledger.ledgers');
  const stableLedgers = useMemo(
    () => allLedgers?.data || [],
    [allLedgers?.data?.length]
  );

  // Transform the data to create a row for each posting
  const tableData =
    ledgerTransactions?.data.flatMap((transaction) =>
      transaction.postings.map((posting, index) => ({
        ...transaction,
        posting,
        isFirstPosting: index === 0,
      }))
    ) ?? [];

  // Recreate cursor after post treatment
  const data = {
    ...omit(ledgerTransactions, ['data']),
    data: tableData,
  };

  const columns: ColumnDef<(typeof data.data)[0]>[] = [
    {
      accessorKey: 'Transaction id',
      header: 'TxID',
      size: 30,
      enableResizing: true,
      cell: ({ row }) => {
        if (!row.original.isFirstPosting) return null;

        return (
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                ledgerName,
                transactionId: row.original.id.toString(),
              })['LEDGER_TRANSACTION'].to
            }
          >
            <Chip
              {...chipVariantFromConsoleType['transactionId']}
              label={
                row.original.isFirstPosting
                  ? padNumber(row.original.id.toString())
                  : ''
              }
            />
          </Link>
        );
      },
    },

    {
      accessorKey: 'Amount',
      header: 'Amount',
      enableResizing: true,
      cell: ({ row }) => (
        <ChipAmount
          asset={row.original.posting.asset}
          amount={row.original.posting.amount}
          shouldFormat={shouldFormat}
        />
      ),
    },

    {
      accessorKey: 'Asset',
      header: 'Asset',
      enableResizing: true,
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['asset']}
          label={row.original.posting.asset}
          isSelectable
        />
      ),
    },

    ...(showLedgerColumn
      ? [
          {
            id: 'ledger',
            header: 'Ledger',
            accessorKey: 'ledger',
            cell: ({ row }: { row: Row<(typeof tableData)[0]> }) => (
              <div>
                {row.original.isFirstPosting && (
                  <Link
                    to={
                      ROUTES({ organizationId, stackId, region, ledgerName })[
                        'LEDGER_DETAIL'
                      ].to
                    }
                  >
                    <Chip
                      {...chipVariantFromConsoleType['ledger']}
                      label={ledgerName}
                    />
                  </Link>
                )}
              </div>
            ),
          },
        ]
      : []),

    {
      header: 'Source',
      accessorKey: 'Source',
      enableResizing: true,
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              ledgerName,
              address: row.original.posting.source,
            })['LEDGER_ACCOUNT'].to
          }
        >
          <ChipAccount address={row.original.posting.source} maxWidth="md" />
        </Link>
      ),
    },
    {
      header: 'Destination',
      accessorKey: 'Destination',
      enableResizing: true,
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              ledgerName,
              address: row.original.posting.destination,
            })['LEDGER_ACCOUNT'].to
          }
        >
          <ChipAccount
            address={row.original.posting.destination}
            maxWidth="md"
          />
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
    {
      header: '',
      id: 'see',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                ledgerName,
                transactionId: row.original.id.toString(),
              })['LEDGER_TRANSACTION'].to
            }
          >
            <Button variant="zinc" size="icon-sm">
              <Eye />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <AppCard
      title={title}
      description={description}
      variant="mint"
      appIcon={LayoutList}
    >
      <DatatableServerSide
        columns={columns}
        data={data}
        id={LEDGER_TRANSACTIONS_LIST}
        initialState={{
          columnPinning: {
            left: ['Transaction id'],
            right: ['see'],
          },
        }}
        toolbarLeft={
          <>
            {props.toolbarLeft}

            {!ledgerNameParam && (
              <DataTableSingleFilter
                variant="select"
                id={LEDGER_SELECTED}
                label="Ledger"
                placeholder="Select ledger..."
                options={stableLedgers.map((ledger) => ({
                  label: ledger.name,
                  value: ledger.name,
                }))}
                defaultValue={lastSelectedLedger || undefined}
                onValueChange={(value) => {
                  if (value) {
                    saveLastSelected(value);
                  }
                  handleQueryChange({ [LEDGER_SELECTED]: value });
                }}
              />
            )}

            <DataTableFilterList
              getFilterConfig={() =>
                getLedgerTransactionsFiltersConfig({
                  moduleVersion: version,
                })
              }
              tableId={LEDGER_TRANSACTIONS_LIST}
              onQueryChange={handleQueryChange}
              onResetFilters={handleResetFilters}
              saveFiltersHook={saveFiltersHook}
            />
          </>
        }
        toolbarRight={
          <>
            <DataTableExportData cursorData={data} />
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
