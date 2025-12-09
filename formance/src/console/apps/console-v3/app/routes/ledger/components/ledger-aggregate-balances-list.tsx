import { LayoutList } from 'lucide-react';
import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router';

import {
  AppCard,
  Chip,
  ChipAmount,
  chipVariantFromType,
  ColumnDef,
  DataTableExportData,
  DataTableFilterList,
  DataTableFormatOptions,
  TDataTableToolbarProps,
} from '@platform/ui';

import { DatatableServerSide, useDataTableQuery } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { useFormatAmount } from '../../../hooks/useFormatAmount';
import { useSavedFilters } from '../../../hooks/useSavedFilters';
import { hasActiveTableFilters } from '../../../utils/filters';
import { NormalizedGetBalancesAggregatedResponse } from '../../../utils/sdk/ledger/responses';
import { LEDGER_AGGREGATE_BALANCES_LIST } from '../constants';
import { getLedgerAggregatedBalancesFiltersConfig } from '../filters/ledger-aggregated-balances-filters';

// Transform the key-value data into array format for DataTable
type AggregateBalanceItem = {
  asset: string;
  amount: number | bigint;
};

type TLedgerAggregateBalancesPros = {
  ledgerAggregateBalances?: NormalizedGetBalancesAggregatedResponse;
  version: string;
} & TDataTableToolbarProps;

export default function LedgerAggregateBalancesList({
  ledgerAggregateBalances,
  version,
}: TLedgerAggregateBalancesPros) {
  const { shouldFormat, toggleFormat } = useFormatAmount();
  const [searchParams] = useSearchParams();

  const { handleQueryChange, handleResetFilters } = useDataTableQuery(
    LEDGER_AGGREGATE_BALANCES_LIST
  );

  const saveFiltersHook = useSavedFilters();
  const filtersActive = hasActiveTableFilters(
    searchParams,
    LEDGER_AGGREGATE_BALANCES_LIST
  );

  const data =
    ledgerAggregateBalances && 'data' in ledgerAggregateBalances
      ? ledgerAggregateBalances.data
      : undefined;

  const ledgerAggregateBalancesAsArray: AggregateBalanceItem[] = useMemo(
    () =>
      data
        ? Object.entries(data).map(([asset, amount]) => ({ asset, amount }))
        : [],
    [data]
  );

  // Convert to Cursor format for server-side data table
  const cursorData: Cursor<AggregateBalanceItem> = useMemo(
    () => ({
      data: ledgerAggregateBalancesAsArray,
      hasMore: false,
      next: undefined,
      previous: undefined,
      pageSize: ledgerAggregateBalancesAsArray.length,
    }),
    [ledgerAggregateBalancesAsArray]
  );

  const columns: ColumnDef<AggregateBalanceItem>[] = [
    {
      accessorKey: 'asset',
      header: 'Asset',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['asset']}
          label={row.original.asset}
          isSelectable
        />
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <ChipAmount
          asset={row.original.asset}
          amount={row.original.amount.toString()}
          shouldFormat={shouldFormat}
        />
      ),
    },
  ];

  return (
    <AppCard
      title="Aggregate Balances"
      description="Aggregated balances from selected accounts"
      variant="mint"
      appIcon={LayoutList}
    >
      <DatatableServerSide
        columns={columns}
        data={cursorData}
        id={LEDGER_AGGREGATE_BALANCES_LIST}
        toolbarLeft={
          <>
            <DataTableFilterList
              getFilterConfig={() =>
                getLedgerAggregatedBalancesFiltersConfig({
                  moduleVersion: version,
                })
              }
              tableId={LEDGER_AGGREGATE_BALANCES_LIST}
              onQueryChange={handleQueryChange}
              onResetFilters={handleResetFilters}
              saveFiltersHook={saveFiltersHook}
            />
          </>
        }
        toolbarRight={
          <>
            <DataTableExportData cursorData={cursorData} />
            <DataTableFormatOptions
              checked={shouldFormat}
              onCheckedChange={toggleFormat}
            />
          </>
        }
        emptyState={!filtersActive ? undefined : undefined}
      />
    </AppCard>
  );
}
