import { Eye, OctagonPause } from 'lucide-react';
import React, { useMemo } from 'react';
import { Link } from 'react-router';

import {
  AppCard,
  Button,
  Chip,
  ChipAccount,
  chipVariantFromType,
  ColumnDef,
} from '@platform/ui';

import { DatatableServerSide } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { ROUTES } from '../../../utils/routes';

import { NormalizedWalletHoldModel } from '../../../utils/sdk/wallets/models';
import { WALLETS_HOLDS_LIST } from '../constants';

type TWalletHoldsListProps = {
  walletHolds: Cursor<NormalizedWalletHoldModel>;
  version: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function WalletHoldsList({
  walletHolds,
  version,
  ...props
}: TWalletHoldsListProps) {
  const { organizationId, stackId, region, walletId } = useRouteGuard({
    componentName: 'wallet-holds-list',
    requiredParams: ['walletId'],
  });

  const columns = useMemo<ColumnDef<NormalizedWalletHoldModel>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        cell: ({ row }) => (
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                walletId,
                walletHoldId: row.original.id,
              })['WALLET_HOLD'].to
            }
          >
            <Chip {...chipVariantFromType['id']} label={row.original.id} />
          </Link>
        ),
      },

      {
        header: 'Asset',
        accessorKey: 'asset',
        cell: ({ row }) => (
          <>
            {row.original?.asset ? (
              <Chip
                {...chipVariantFromType['asset']}
                label={row.original.asset}
              />
            ) : (
              '-'
            )}
          </>
        ),
      },

      {
        header: 'Destination',
        accessorKey: 'destination',
        cell: ({ row }) => (
          <ChipAccount address={row.original.destination?.identifier ?? '-'} />
        ),
      },

      {
        header: '',
        id: 'see',
        accessorKey: 'See Hold',
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Link
              to={
                ROUTES({
                  organizationId,
                  stackId,
                  region,
                  walletId,
                  walletHoldId: row.original.id,
                })['WALLET_HOLD'].to
              }
            >
              <Button variant="zinc" size="icon-md">
                <Eye />
              </Button>
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <AppCard
      title="Holds"
      description="A list of all wallet holds"
      variant="cobaltDark"
      appIcon={OctagonPause}
      {...props}
    >
      <DatatableServerSide
        columns={columns}
        data={walletHolds}
        id={WALLETS_HOLDS_LIST}
        initialState={{
          columnPinning: {
            right: ['see'],
          },
        }}
      />
    </AppCard>
  );
}
