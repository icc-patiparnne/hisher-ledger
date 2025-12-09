import { Eye, Wallet } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router';

import {
  AppCard,
  AppCardEmpty,
  Button,
  Chip,
  chipVariantFromType,
  CodeSnippet,
  ColumnDef,
  DataTableExportData,
  DataTableFavoriteFilter,
  DataTableFilterList,
  Favorite,
} from '@platform/ui';

import { DatatableServerSide, useDataTableQuery } from '@platform/remix';
import { FCTL_SNIPPETS, formatDate } from '@platform/utils';

import { Cursor } from '@platform/sdks/utils/cursor';
import { chipVariantFromConsoleType } from '../../../components/chip';
import { useFavorites } from '../../../hooks/useFavorites';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useSavedFilters } from '../../../hooks/useSavedFilters';
import { hasActiveTableFilters } from '../../../utils/filters';
import { ROUTES } from '../../../utils/routes';

import { useMicroStack } from '../../../hooks/useMicroStack';
import { CurrentContext } from '../../../root';
import { NormalizedWalletModel } from '../../../utils/sdk/wallets/models';
import { WALLETS_LIST, WALLETS_LIST_FAVORITES } from '../constants';
import { getWalletsFiltersConfig } from '../filters/wallets-list-filters';

type TWalletColumnProps = {
  organizationId: string;
  stackId: string;
  region: string;
  isFavorite: (params: { name: string; id: string }) => boolean;
  toggleFavorite: (params: { name: string; id: string }) => void;
  isFavoritesView?: boolean;
};

export function getWalletColumns({
  organizationId,
  stackId,
  region,
  isFavorite,
  toggleFavorite,
  isFavoritesView = false,
}: TWalletColumnProps): ColumnDef<NormalizedWalletModel>[] {
  const columns: ColumnDef<NormalizedWalletModel>[] = [];

  columns.push({
    header: '',
    id: 'bookmark',
    accessorKey: 'favorite',
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Favorite
          isFavorite={isFavorite({
            name: row.original.name,
            id: row.original.id,
          })}
          setIsFavorite={() =>
            toggleFavorite({ name: row.original.name, id: row.original.id })
          }
        />
      </div>
    ),
  });

  columns.push({
    header: 'ID',
    accessorKey: 'id',
    cell: ({ row }) => (
      <Link
        to={
          ROUTES({
            organizationId,
            stackId,
            region,
            walletId: row.original.id,
          })['WALLET_DETAIL'].to
        }
      >
        <Chip {...chipVariantFromType['id']} label={row.original.id} />
      </Link>
    ),
  });

  // Always show name column
  columns.push({
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }) => (
      <Link
        to={
          ROUTES({
            organizationId,
            stackId,
            region,
            walletId: row.original.id,
          })['WALLET_DETAIL'].to
        }
      >
        <Chip
          {...chipVariantFromConsoleType['wallet']}
          label={row.original.name}
        />
      </Link>
    ),
  });

  // Show additional columns only in main view
  if (!isFavoritesView) {
    columns.push({
      header: 'Ledger',
      accessorKey: 'ledger',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              ledgerName: row.original.ledger,
            })['LEDGER_DETAIL'].to
          }
        >
          <Chip
            {...chipVariantFromConsoleType['ledger']}
            label={row.original.ledger}
          />
        </Link>
      ),
    });

    columns.push({
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }) => (
        <span className="whitespace-nowrap select-all">
          {row.original.createdAt
            ? formatDate(new Date(row.original.createdAt))
            : '-'}
        </span>
      ),
    });
  }

  columns.push({
    header: '',
    id: 'see',
    accessorKey: 'See Wallet',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              walletId: row.original.id,
            })['WALLET_DETAIL'].to
          }
        >
          <Button variant="zinc" size="icon-md">
            <Eye />
          </Button>
        </Link>
      </div>
    ),
  });

  return columns;
}

type TWalletsListProps = {
  wallets: Cursor<NormalizedWalletModel>;
  serverSide?: boolean;
  version: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function WalletsList({
  wallets,
  serverSide = false,
  version,
  children,
  ...props
}: TWalletsListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'wallets-list',
  });

  const context = useOutletContext<CurrentContext>();

  const { toggleFavorite, isFavorite } = useFavorites('wallets.wallets');

  const [searchParams] = useSearchParams();
  const showOnlyFavorites =
    searchParams.get(WALLETS_LIST_FAVORITES) === '"true"';

  const { handleQueryChange, handleResetFilters } =
    useDataTableQuery(WALLETS_LIST);

  const saveFiltersHook = useSavedFilters();
  const filtersActive = hasActiveTableFilters(searchParams, WALLETS_LIST);

  const handleFavoritesChange = useCallback(
    (pressed: boolean) => {
      handleQueryChange({ [WALLETS_LIST_FAVORITES]: pressed ? '"true"' : '' });
    },
    [handleQueryChange]
  );

  const filteredWallets = useMemo(() => {
    if (!showOnlyFavorites || !wallets) return wallets;

    return {
      ...wallets,
      data: wallets.data.filter((wallet) =>
        isFavorite({ name: wallet.name, id: wallet.id })
      ),
    };
  }, [wallets, showOnlyFavorites, isFavorite]);

  const columns = getWalletColumns({
    organizationId,
    stackId,
    region,
    isFavorite,
    toggleFavorite,
    isFavoritesView: false,
  });

  const { isMicroStack } = useMicroStack(context);

  return (
    <>
      <AppCard
        title="Wallets"
        description="A list of all the wallets available in this stack"
        appIcon={Wallet}
        {...props}
      >
        {children}

        <DatatableServerSide
          columns={columns}
          data={filteredWallets}
          id={WALLETS_LIST}
          initialState={{
            columnPinning: {
              left: ['bookmark'],
              right: ['see'],
            },
          }}
          toolbarLeft={
            <>
              <DataTableFilterList
                getFilterConfig={getWalletsFiltersConfig}
                tableId={WALLETS_LIST}
                onQueryChange={handleQueryChange}
                onResetFilters={handleResetFilters}
                saveFiltersHook={saveFiltersHook}
              />
              <DataTableFavoriteFilter
                favoritesPressed={showOnlyFavorites}
                onFavoritesChange={handleFavoritesChange}
                favoritesParameterName={WALLETS_LIST_FAVORITES}
              />
            </>
          }
          toolbarRight={<DataTableExportData cursorData={filteredWallets} />}
          emptyState={
            !filtersActive ? (
              <AppCardEmpty
                title="No wallets found"
                description="Create a new wallet to get started"
                {...props}
              >
                <div className="grid gap-2 mt-3">
                  <div className="grid gap-2">
                    {!isMicroStack && (
                      <>
                        <CodeSnippet
                          isSingleLine
                          {...FCTL_SNIPPETS({
                            organizationId,
                            stackId,
                            regionId: region,
                          })['WALLET_CREATE'].snippet}
                        />

                        <p className="text-center text-muted-foreground">OR</p>
                      </>
                    )}
                    <Link
                      to={
                        ROUTES({ organizationId, stackId, region })[
                          'WALLET_CREATE'
                        ].to
                      }
                    >
                      <Button variant="primary" size="sm">
                        Create Wallet
                      </Button>
                    </Link>
                  </div>
                </div>
              </AppCardEmpty>
            ) : undefined
          }
        />
      </AppCard>
    </>
  );
}
