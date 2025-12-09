import { BanknoteIcon } from 'lucide-react';
import React from 'react';

import {
  AppCard,
  Chip,
  ChipAmount,
  chipVariantFromAmountType,
  chipVariantFromType,
  ColumnDef,
  DataTable,
  DataTableFormatOptions,
} from '@platform/ui';

import { useFormatAmount } from '../../../hooks/useFormatAmount';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { NormalizedAccountModel } from '../../../utils/sdk/ledger/models';

type TAssetsWithVolumes = {
  asset: string;
  input: number | bigint;
  output: number | bigint;
  balance?: number | bigint;
  fill: string;
};

type TLedgerAccountsProps = {
  ledgerAccount: NormalizedAccountModel;
} & React.HTMLAttributes<HTMLDivElement>;

export default function LedgerAccountAssetsList({
  ledgerAccount,
}: TLedgerAccountsProps) {
  useRouteGuard({
    componentName: 'ledger-account-assets-list',
    requiredParams: ['ledgerName'],
  });

  const { shouldFormat, toggleFormat } = useFormatAmount();

  const assetsWithVolumes: TAssetsWithVolumes[] = Object.entries(
    ledgerAccount.volumes ?? {}
  ).map(([asset, { input, output, balance }], index) => ({
    asset,
    input: Number(input),
    output: Number(output),
    balance: Number(balance),
    fill: `hsl(var(--chart-${index + 1}))`,
  }));

  const columns: ColumnDef<(typeof assetsWithVolumes)[number]>[] = [
    {
      accessorKey: 'asset',
      header: 'Asset',
      enableHiding: false,
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['asset']}
          label={row.original.asset}
          copyMode="click"
        />
      ),
    },

    {
      id: 'received',
      header: 'Received',
      accessorKey: 'input',
      cell: ({ row }) => (
        <ChipAmount
          asset={row.original.asset}
          amount={row.original.input}
          shouldFormat={shouldFormat}
        />
      ),
    },

    {
      id: 'sent',
      header: 'Sent',
      accessorKey: 'output',
      cell: ({ row }) => (
        <ChipAmount
          {...chipVariantFromAmountType['assetAmountNegative']}
          asset={row.original.asset}
          amount={row.original.output}
          shouldFormat={shouldFormat}
        />
      ),
    },

    {
      id: 'balance',
      header: 'Balance',
      accessorKey: 'balance',
      cell: ({ row }) => (
        <div>
          {row.original.balance ? (
            <ChipAmount
              asset={row.original.asset}
              amount={row.original.balance ?? 0}
              shouldFormat={shouldFormat}
            />
          ) : (
            <ChipAmount
              {...chipVariantFromAmountType['assetAmount']}
              asset={row.original.asset}
              amount={0}
              shouldFormat={shouldFormat}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <AppCard
      title="Assets"
      description="List of assets with their volumes"
      variant="slate"
      appIcon={BanknoteIcon}
    >
      <DataTable
        columns={columns}
        data={assetsWithVolumes}
        displayPagination={true}
        searchConfig={[
          {
            placeholder: 'Filter by asset',
            columnKey: 'asset',
          },
        ]}
        initialState={{
          sorting: [{ id: 'asset', desc: true }],
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
