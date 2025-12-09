import { Eye, Users } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';

import {
  AppCard,
  Button,
  Chip,
  ChipAccount,
  ColumnDef,
  DataTableExportData,
  DataTableFavoriteFilter,
  DataTableFilterList,
  DataTableSingleFilter,
  Favorite,
} from '@platform/ui';

import { DatatableServerSide, useDataTableQuery } from '@platform/remix';
import { useLastSelected } from '../../../hooks/useLastSelected';
import { useSavedFilters } from '../../../hooks/useSavedFilters';
import { ROUTES } from '../../../utils/routes';
import {
  LEDGER_ACCOUNTS_LIST,
  LEDGER_ACCOUNTS_LIST_FAVORITES,
  LEDGER_SELECTED,
} from '../constants';

import { getSearchParam } from '@platform/remix/src/utils/helper';
import { Cursor } from '@platform/sdks/utils/cursor';
import { chipVariantFromConsoleType } from '../../../components/chip';
import { useFavorites } from '../../../hooks/useFavorites';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import {
  NormalizedAccountModel,
  NormalizedLedgerModel,
} from '../../../utils/sdk/ledger/models';
import { getLedgerAccountsFiltersConfig } from '../filters/ledger-accounts-filters';

// Extended type for account model that might include ledgerName in favorites view
type ExtendedAccountModel = NormalizedAccountModel & {
  ledgerName?: string;
};

type LedgerAccountsColumnsProps = {
  organizationId: string;
  stackId: string;
  region: string;
  ledgerName: string;
  isFavorite: (params: { address: string; ledgerName: string }) => boolean;
  toggleFavorite: (params: { address: string; ledgerName: string }) => void;
  showLedgerColumn?: boolean;
  isFavoritesView?: boolean;
};

export function getLedgerAccountsColumns({
  organizationId,
  stackId,
  region,
  ledgerName,
  isFavorite,
  toggleFavorite,
  showLedgerColumn = true,
  isFavoritesView = false,
}: LedgerAccountsColumnsProps): ColumnDef<ExtendedAccountModel>[] {
  const columns: ColumnDef<ExtendedAccountModel>[] = [];

  columns.push({
    header: '',
    accessorKey: 'favorite',
    size: 1,
    cell: ({ row }) => (
      <div>
        <Favorite
          isFavorite={isFavorite({
            address: row.original.address,
            ledgerName: row.original.ledgerName || ledgerName,
          })}
          setIsFavorite={() =>
            toggleFavorite({
              address: row.original.address,
              ledgerName: row.original.ledgerName || ledgerName,
            })
          }
        />
      </div>
    ),
  });

  // Always show the address column
  columns.push({
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => (
      <div>
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              ledgerName: row.original.ledgerName || ledgerName,
              address: row.original.address,
            })['LEDGER_ACCOUNT'].to
          }
        >
          <ChipAccount address={row.original.address} maxWidth="xl" />
        </Link>
      </div>
    ),
  });

  // Show ledger column conditionally
  if (showLedgerColumn) {
    columns.push({
      accessorKey: 'ledgerName',
      header: 'Ledger',
      cell: ({ row }) => {
        const displayLedgerName = row.original.ledgerName || ledgerName;

        return (
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                ledgerName: displayLedgerName,
              })['LEDGER_DETAIL'].to
            }
          >
            <Chip
              {...chipVariantFromConsoleType['ledger']}
              label={displayLedgerName}
            />
          </Link>
        );
      },
    });
  }

  // Only show actions column in the main list view, not in favorites view
  if (!isFavoritesView) {
    columns.push({
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="text-right">
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                ledgerName: row.original.ledgerName || ledgerName,
                address: row.original.address,
              })['LEDGER_ACCOUNT'].to
            }
          >
            <Button variant="zinc" size="icon-md">
              <Eye />
            </Button>
          </Link>
        </div>
      ),
    });
  }

  return columns;
}

type TLedgerAccountsProps = {
  title?: string;
  description?: string;
  ledgerAccounts?: Cursor<NormalizedAccountModel>;
  allLedgers?: Cursor<NormalizedLedgerModel>;
  ledger?: string;
  showLedgerColumn?: boolean;
  version: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function LedgerAccountsList({
  title = 'Accounts',
  description = 'List of accounts in the selected ledger',
  ledgerAccounts,
  allLedgers,
  ledger,
  version,
  showLedgerColumn = true,
  children,
}: TLedgerAccountsProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'ledger-accounts-list',
  });
  const { toggleFavorite, isFavorite } = useFavorites('ledger.ledgerAccounts');

  const { ledgerName: ledgerNameParam } = useParams();
  const ledgerName =
    ledgerNameParam ?? ledger ?? getSearchParam(LEDGER_SELECTED) ?? '';

  const { handleQueryChange, handleResetFilters } =
    useDataTableQuery(LEDGER_ACCOUNTS_LIST);

  const saveFiltersHook = useSavedFilters();

  const { lastSelected: lastSelectedLedger, saveLastSelected } =
    useLastSelected('ledger.ledgers');
  const stableLedgers = useMemo(
    () => allLedgers?.data || [],
    [allLedgers?.data?.length]
  );

  // Handle favorites toggle
  const handleFavoritesChange = useCallback(
    (pressed: boolean) => {
      handleQueryChange({
        [LEDGER_ACCOUNTS_LIST_FAVORITES]: pressed ? '"true"' : '',
      });
    },
    [handleQueryChange]
  );

  const columns = getLedgerAccountsColumns({
    organizationId,
    stackId,
    region,
    ledgerName,
    isFavorite,
    toggleFavorite,
    showLedgerColumn,
    isFavoritesView: false,
  });

  // Track URL changes for client-side navigation
  const [currentSearch, setCurrentSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.search;
    }

    return '';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentSearch(window.location.search);
    };

    window.addEventListener('popstate', handlePopState);

    // Also check periodically for client-side navigation
    const interval = setInterval(() => {
      if (window.location.search !== currentSearch) {
        setCurrentSearch(window.location.search);
      }
    }, 100);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearInterval(interval);
    };
  }, [currentSearch]);

  // Check if favorites are currently active (reactive to URL changes)
  const favoritesPressed = useMemo(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);

        return params.get(LEDGER_ACCOUNTS_LIST_FAVORITES) === '"true"';
      }

      return false;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error getting favorites state:', error);

      return false;
    }
  }, [currentSearch]);

  // Filter accounts data based on favorites toggle
  const filteredAccounts = useMemo(() => {
    if (!favoritesPressed || !ledgerAccounts?.data) {
      return ledgerAccounts;
    }

    // Filter to only show favorite accounts
    const favoriteAccountsData = ledgerAccounts.data.filter((account) =>
      isFavorite({
        address: account.address,
        ledgerName: ledgerName || account.metadata?.ledger || '',
      })
    );

    return {
      ...ledgerAccounts,
      data: favoriteAccountsData,
    };
  }, [favoritesPressed, ledgerAccounts, isFavorite, ledgerName]);

  // Error boundary fallback
  if (!version) {
    return (
      <AppCard
        title={title}
        description="Loading accounts..."
        variant="lilac"
        appIcon={Users}
      >
        <div className="p-4">Loading...</div>
      </AppCard>
    );
  }

  return (
    <AppCard
      title={title}
      description={description}
      variant="lilac"
      appIcon={Users}
    >
      <DatatableServerSide
        columns={columns}
        data={filteredAccounts}
        id={LEDGER_ACCOUNTS_LIST}
        toolbarLeft={
          <>
            {children}
            {/* Only show the ledger select filter if there is no ledger name param */}
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
              tableId={LEDGER_ACCOUNTS_LIST}
              getFilterConfig={() =>
                getLedgerAccountsFiltersConfig({ moduleVersion: version })
              }
              saveFiltersHook={saveFiltersHook}
              onQueryChange={handleQueryChange}
              onResetFilters={handleResetFilters}
            />
            <DataTableFavoriteFilter
              favoritesPressed={favoritesPressed}
              onFavoritesChange={handleFavoritesChange}
              favoritesParameterName={LEDGER_ACCOUNTS_LIST_FAVORITES}
            />
          </>
        }
        toolbarRight={<DataTableExportData cursorData={filteredAccounts} />}
      />
    </AppCard>
  );
}
