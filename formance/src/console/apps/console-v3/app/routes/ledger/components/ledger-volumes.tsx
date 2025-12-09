import { LayoutList } from 'lucide-react';
import React from 'react';

import {
  AppCard,
  Chip,
  ChipAccount,
  ChipAmount,
  chipVariantFromType,
  ColumnDef,
  DataTableFilterList,
  DataTableFormatOptions,
  TDataTableToolbarProps,
} from '@platform/ui';

import { DatatableServerSide, useDataTableQuery } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { useFormatAmount } from '../../../hooks/useFormatAmount';
import { useSavedFilters } from '../../../hooks/useSavedFilters';
import { NormalizedVolumeWithBalanceModel } from '../../../utils/sdk/ledger/models';
import { LEDGER_VOLUMES_LIST } from '../constants';
import { getLedgerVolumesFiltersConfig } from '../filters/ledger-volumes-filters';

type TLedgerVolumesProps = {
  ledgerVolumesWithBalances?: Cursor<NormalizedVolumeWithBalanceModel>;
  version: string;
} & TDataTableToolbarProps;

export default function LedgerVolumesList({
  ledgerVolumesWithBalances,
  version,
  ...props
}: TLedgerVolumesProps) {
  const { shouldFormat, toggleFormat } = useFormatAmount();

  const { handleQueryChange, handleResetFilters } =
    useDataTableQuery(LEDGER_VOLUMES_LIST);

  const saveFiltersHook = useSavedFilters();

  const columns: ColumnDef<NormalizedVolumeWithBalanceModel>[] = [
    {
      accessorKey: 'account',
      header: 'Account',
      cell: ({ row }) => (
        <div>
          <ChipAccount address={row.original.account} maxWidth="xl" />
        </div>
      ),
    },
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
      accessorKey: 'input',
      header: 'Input',
      cell: ({ row }) => (
        <ChipAmount
          asset={row.original.asset}
          amount={row.original.input.toString()}
          shouldFormat={shouldFormat}
        />
      ),
    },
    {
      accessorKey: 'output',
      header: 'Output',
      cell: ({ row }) => (
        <ChipAmount
          {...chipVariantFromType['numberNegative']}
          asset={row.original.asset}
          amount={row.original.output.toString()}
          shouldFormat={shouldFormat}
        />
      ),
    },
    {
      accessorKey: 'balance',
      header: 'Balance',
      cell: ({ row }) => (
        <ChipAmount
          asset={row.original.asset}
          amount={row.original.balance.toString()}
          shouldFormat={shouldFormat}
        />
      ),
    },
  ];

  return (
    <AppCard
      title="Volumes"
      description="List of volumes and balances for account/asset"
      variant="mint"
      appIcon={LayoutList}
    >
      <DatatableServerSide
        columns={columns}
        data={
          ledgerVolumesWithBalances ?? {
            data: [],
            pageSize: 0,
            hasMore: false,
          }
        }
        id={LEDGER_VOLUMES_LIST}
        toolbarLeft={
          <>
            {props.toolbarLeft}
            <DataTableFilterList
              getFilterConfig={() => getLedgerVolumesFiltersConfig()}
              tableId={LEDGER_VOLUMES_LIST}
              onQueryChange={handleQueryChange}
              onResetFilters={handleResetFilters}
              saveFiltersHook={saveFiltersHook}
            />
          </>
        }
        toolbarRight={
          <DataTableFormatOptions
            checked={shouldFormat}
            onCheckedChange={toggleFormat}
          />
        }
      />
    </AppCard>
  );
}
