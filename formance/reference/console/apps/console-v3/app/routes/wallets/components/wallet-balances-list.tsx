import { isEmpty } from 'lodash-es';
import { Eye, Wallet } from 'lucide-react';
import React from 'react';

import {
  AppCard,
  Button,
  Chip,
  ChipAmount,
  chipVariantFromType,
  ColumnDef,
  DataTable,
  DataTableFormatOptions,
  PreviewJson,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@platform/ui';

import {
  BalanceWithAssets,
  GetWalletSummaryResponse,
} from '@platform/sdks/formance/src/models/components';
import { formatDate } from '@platform/utils';
import { useFormatAmount } from '../../../hooks/useFormatAmount';
import { useRouteGuard } from '../../../hooks/useRouteGuard';

type TWalletBalancesListProps = {
  walletBalances: GetWalletSummaryResponse['data']['balances'];
  version: string;
  serverSide: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function WalletBalancesList({
  walletBalances,
  version,
  serverSide,
  ...props
}: TWalletBalancesListProps) {
  useRouteGuard({
    componentName: 'wallet-balances-list',
  });

  const { shouldFormat, toggleFormat } = useFormatAmount();

  const columns: ColumnDef<BalanceWithAssets>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <Chip {...chipVariantFromType['name']} label={row.original.name} />
      ),
    },

    {
      header: 'Balance',
      accessorKey: 'balance',
      cell: ({ row }) => (
        <div className="max-w-96">
          {!isEmpty(row.original.assets) ? (
            <div className="flex gap-2">
              {Object.entries(row.original.assets).map(([key, value]) => (
                <ChipAmount
                  key={key}
                  asset={key}
                  amount={value}
                  shouldFormat={shouldFormat}
                />
              ))}
            </div>
          ) : (
            '-'
          )}
        </div>
      ),
    },

    {
      header: 'Assets',
      accessorKey: 'assets',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {Object.entries(row.original.assets).length > 0
            ? Object.entries(row.original.assets).map(([key]) => (
                <Chip
                  key={key}
                  {...chipVariantFromType['asset']}
                  label={`${key}`}
                />
              ))
            : '-'}
        </div>
      ),
    },

    {
      header: 'Priority',
      accessorKey: 'priority',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['number']}
          label={row.original.priority?.toString() ?? '-'}
        />
      ),
    },

    {
      header: 'Expires At',
      accessorKey: 'expiresAt',
      cell: ({ row }) =>
        row.original.expiresAt
          ? formatDate(new Date(row.original.expiresAt))
          : '-',
    },

    {
      header: '',
      id: 'see',
      accessorKey: 'See Balance',
      cell: ({ row }) => (
        <Sheet>
          <SheetTrigger asChild>
            <div className="flex justify-center">
              <Button variant="zinc" size="icon-md">
                <Eye />
              </Button>
            </div>
          </SheetTrigger>
          <SheetContent className="lg:w-[700px] sm:max-w-none flex flex-col">
            <SheetHeader>
              <SheetTitle>Raw</SheetTitle>
            </SheetHeader>
            <Separator />
            <div className="p-4">
              <PreviewJson json={row.original} />
            </div>
          </SheetContent>
        </Sheet>
      ),
    },
  ];

  return (
    <AppCard
      title="Balances"
      description="A list of all wallet balances"
      variant="cobaltDark"
      appIcon={Wallet}
      {...props}
    >
      <DataTable
        columns={columns}
        initialState={{
          columnPinning: {
            right: ['see'],
          },
          columnVisibility: {
            assets: false,
          },
        }}
        data={walletBalances}
        toolbarRight={
          <>
            <DataTableFormatOptions
              checked={shouldFormat}
              onCheckedChange={toggleFormat}
            />
          </>
        }
      />
      {/* <DatatableServerSide
        columns={columns}
        data={walletBalances}
        id={WALLETS_BALANCES_LIST}
      /> */}
    </AppCard>
  );
}
