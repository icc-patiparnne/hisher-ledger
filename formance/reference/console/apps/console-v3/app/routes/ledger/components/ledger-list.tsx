import { Eye, Server } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router';

import {
  AppCard,
  AppCardEmpty,
  Button,
  Chip,
  CodeSnippet,
  ColumnDef,
  DataTable,
  DataTableFavoriteFilter,
  DataTableFilterList,
  Favorite,
} from '@platform/ui';

import { FCTL_SNIPPETS, formatDate } from '@platform/utils';

import { DatatableServerSide, useDataTableQuery } from '@platform/remix';
import { getSearchParam } from '@platform/remix/src/utils/helper';
import { Cursor } from '@platform/sdks/utils/cursor';
import { chipVariantFromConsoleType } from '../../../components/chip';
import { useFavorites } from '../../../hooks/useFavorites';
import { useMicroStack } from '../../../hooks/useMicroStack';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useSavedFilters } from '../../../hooks/useSavedFilters';
import { CurrentContext } from '../../../root';
import { TRouteParamsWithSearchParams } from '../../../types/routes';
import { hasActiveTableFilters } from '../../../utils/filters';
import { ROUTES } from '../../../utils/routes';
import { NormalizedLedgerModel } from '../../../utils/sdk/ledger/models';
import { LEDGERS_LIST, LEDGERS_LIST_FAVORITES } from '../constants';
import { getLedgersFiltersConfig } from '../filters/ledger-list-filters';

type TLedgerListColumnsProps = {
  organizationId: string;
  stackId: string;
  region: string;
  isFavorite: (params: { name: string; id: number }) => boolean;
  toggleFavorite: (params: { name: string; id: number }) => void;
  isFavoritesView?: boolean;
};

export function getLedgerListColumns({
  organizationId,
  stackId,
  region,
  isFavorite,
  toggleFavorite,
}: TLedgerListColumnsProps): ColumnDef<NormalizedLedgerModel>[] {
  const columns: ColumnDef<NormalizedLedgerModel>[] = [];

  columns.push({
    header: '',
    accessorKey: 'favorite',
    cell: ({ row }) => (
      <div>
        <Favorite
          isFavorite={isFavorite({
            name: row.original.name,
            id: row.original.id || 0,
          })}
          setIsFavorite={() =>
            toggleFavorite({
              name: row.original.name,
              id: row.original.id || 0,
            })
          }
        />
      </div>
    ),
  });

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
            ledgerName: row.original.name,
          })['LEDGER_DETAIL'].to
        }
      >
        <Chip
          {...chipVariantFromConsoleType['ledger']}
          label={row.original.name}
        />
      </Link>
    ),
  });

  // Show added at column in main view but not in favorites view

  columns.push({
    header: 'Added At',
    accessorKey: 'Added At',
    cell: ({ row }) => (
      <span className="whitespace-nowrap select-all">
        {row.original.addedAt ? formatDate(row.original.addedAt) : '-'}
      </span>
    ),
  });

  columns.push({
    header: '',
    accessorKey: 'See Ledger',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="text-right">
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              ledgerName: row.original.name,
            })['LEDGER_DETAIL'].to
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

type TLedgerListProps = {
  ledgers?: Cursor<NormalizedLedgerModel>;
  serverSide?: boolean;
  version: string;
  showOnlyFavorites?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function LedgerList({
  ledgers,
  serverSide = false,
  version,
  children,
  showOnlyFavorites = false,
  ...props
}: TLedgerListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'ledger-list',
  });

  const context = useOutletContext<CurrentContext>();

  const { toggleFavorite, isFavorite } = useFavorites('ledger.ledgers');
  const [searchParams] = useSearchParams();

  const [favoritesPressed, setFavoritesPressed] = useState(
    getSearchParam(LEDGERS_LIST_FAVORITES) === 'true'
  );

  const filtersActive = hasActiveTableFilters(searchParams, LEDGERS_LIST);

  const { handleQueryChange, handleResetFilters } =
    useDataTableQuery(LEDGERS_LIST);

  const saveFiltersHook = useSavedFilters();

  const filteredLedgers = useMemo(() => {
    if (!ledgers?.data) return ledgers;

    if (favoritesPressed) {
      const favoriteLedgers = ledgers.data.filter((ledger) =>
        isFavorite({ name: ledger.name, id: ledger.id || 0 })
      );

      return {
        ...ledgers,
        data: favoriteLedgers,
      };
    }

    return ledgers;
  }, [ledgers, favoritesPressed, isFavorite]);

  const columns = useMemo(
    () =>
      getLedgerListColumns({
        organizationId,
        stackId,
        region,
        isFavorite,
        toggleFavorite,
        isFavoritesView: favoritesPressed,
      }),
    [isFavorite, toggleFavorite, favoritesPressed]
  );

  const { isMicroStack } = useMicroStack(context);

  return (
    <AppCard title="Ledgers" appIcon={Server} {...props}>
      {children}

      {serverSide ? (
        <DatatableServerSide
          columns={columns}
          data={filteredLedgers}
          id={LEDGERS_LIST}
          toolbarLeft={
            <>
              <DataTableFilterList
                getFilterConfig={() => getLedgersFiltersConfig()}
                tableId={LEDGERS_LIST}
                onQueryChange={handleQueryChange}
                onResetFilters={handleResetFilters}
                saveFiltersHook={saveFiltersHook}
              />
              <DataTableFavoriteFilter
                favoritesPressed={favoritesPressed}
                onFavoritesChange={setFavoritesPressed}
                favoritesParameterName={LEDGERS_LIST_FAVORITES}
              />
            </>
          }
          emptyState={
            !filtersActive ? (
              <EmptyState
                organizationId={organizationId}
                stackId={stackId}
                region={region}
                isMicroStack={isMicroStack}
              />
            ) : undefined
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredLedgers?.data || []}
          displayPagination={true}
          searchConfig={[
            {
              placeholder: 'Filter by name',
              columnKey: 'name',
            },
          ]}
          emptyState={
            !filtersActive ? (
              <EmptyState
                organizationId={organizationId}
                stackId={stackId}
                region={region}
                isMicroStack={isMicroStack}
              />
            ) : undefined
          }
        />
      )}
    </AppCard>
  );
}

function EmptyState({
  organizationId,
  stackId,
  region,
  isMicroStack,
  ...props
}: Partial<TRouteParamsWithSearchParams> & { isMicroStack: boolean }) {
  return (
    <AppCardEmpty
      title="No ledgers found"
      description="Create a new ledger to get started"
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
                })['LEDGER_CREATE'].snippet}
              />
              <p className="text-center text-muted-foreground">OR</p>
            </>
          )}
          <Link
            to={ROUTES({ organizationId, stackId, region })['LEDGER_CREATE'].to}
          >
            <Button variant="primary" size="sm">
              Create Ledger
            </Button>
          </Link>
        </div>
      </div>
    </AppCardEmpty>
  );
}
