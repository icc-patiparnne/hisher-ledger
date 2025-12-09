import { Eye, Wallet2 } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router';

import {
  AppCard,
  AppCardEmpty,
  Badge,
  Button,
  Checkbox,
  Chip,
  chipVariantFromType,
  CodeSnippet,
  ColumnDef,
  ConnectorIcon,
  DataTable,
  DataTableExportData,
  DataTableFavoriteFilter,
  DataTableFilterList,
  Favorite,
} from '@platform/ui';

import { DatatableServerSide, useDataTableQuery } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { FCTL_SNIPPETS, formatDate } from '@platform/utils';
import { badgeVariantFromPaymentAccountType } from '../../../../components/badge';
import { chipVariantFromConsoleType } from '../../../../components/chip';
import { useFavorites } from '../../../../hooks/useFavorites';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useSavedFilters } from '../../../../hooks/useSavedFilters';
import { TRouteParamsWithSearchParams } from '../../../../types/routes';
import { hasActiveTableFilters } from '../../../../utils/filters';
import { ROUTES } from '../../../../utils/routes';

import { useMicroStack } from '../../../../hooks/useMicroStack';
import { CurrentContext } from '../../../../root';
import { getConnectorsOptions } from '../../../../utils/sdk/payments/constants';
import {
  NormalizedConnectorConfigsModel,
  NormalizedConnectorModel,
  NormalizedPaymentAccountModel,
} from '../../../../utils/sdk/payments/models';
import {
  CONNECTIVITY_ACCOUNTS_LIST,
  CONNECTIVITY_ACCOUNTS_LIST_FAVORITES,
} from '../../constants';
import { getConnectivityAccountsFiltersConfig } from '../../filters/connectivity-accounts-filters';
import { getEffectiveProvider } from '../../utils';

type PaymentAccountsColumnsProps = {
  organizationId: string;
  stackId: string;
  region: string;
  isFavorite: (params: { id: string; name: string }) => boolean;
  toggleFavorite: (params: { id: string; name: string }) => void;
  isFavoritesView?: boolean;
};

export function getPaymentAccountsColumns({
  organizationId,
  stackId,
  region,
  isFavorite,
  toggleFavorite,
  isFavoritesView = false,
}: PaymentAccountsColumnsProps): ColumnDef<NormalizedPaymentAccountModel>[] {
  const columns: ColumnDef<NormalizedPaymentAccountModel>[] = [];

  // Always show favorite column
  columns.push({
    header: '',
    id: 'bookmark',
    accessorKey: 'favorite',
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Favorite
          isFavorite={isFavorite({
            name: row.original.accountName ?? row.original.name ?? '',
            id: row.original.id,
          })}
          setIsFavorite={() =>
            toggleFavorite({
              name: row.original.accountName ?? row.original.name ?? '',
              id: row.original.id,
            })
          }
        />
      </div>
    ),
  });

  // Always show ID column
  columns.push({
    header: 'ID',
    accessorKey: 'accountId',
    cell: ({ row }) => (
      <Link
        to={
          ROUTES({
            organizationId,
            stackId,
            region,
            paymentAccountId: row.original.id,
          })['CONNECTIVITY_ACCOUNT_DETAIL'].to
        }
      >
        <Chip
          {...chipVariantFromType['id']}
          label={row.original.id}
          maxWidth={isFavoritesView ? 'lg' : 'sm'}
        />
      </Link>
    ),
  });

  // Always show name column
  columns.push({
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Chip
        {...chipVariantFromType['name']}
        label={row.original.accountName ?? row.original.name ?? ''}
      />
    ),
  });

  // Show additional columns only in main view, not in favorites view
  if (!isFavoritesView) {
    columns.push({
      id: 'Account Name',
      header: 'Account Name',
      accessorKey: 'accountName',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['name']}
          label={row.original.accountName ?? row.original.name ?? ''}
        />
      ),
    });

    columns.push({
      header: 'Reference',
      accessorKey: 'reference',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromConsoleType['reference']}
          label={row.original.reference}
        />
      ),
    });

    columns.push({
      header: 'Provider',
      accessorKey: 'provider',
      cell: ({ row }) => {
        const effectiveProvider = getEffectiveProvider(row.original);

        return (
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                connectorId: row.original.connectorID,
                provider: row.original.provider,
              })['CONNECTIVITY_CONNECTOR_INSTALLED_DETAIL'].to
            }
            className="flex items-center gap-2"
          >
            <ConnectorIcon
              name={effectiveProvider as NormalizedConnectorModel}
            />
            <span
              className="font-medium capitalize"
              data-provider={effectiveProvider}
            >
              {effectiveProvider?.toLowerCase()}
            </span>
          </Link>
        );
      },
    });

    columns.push({
      header: 'Connector Name',
      accessorKey: 'connectorName',
      cell: ({ row }) => {
        const connectorName = (row.original as any).connector?.name;

        return connectorName ? (
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                connectorId: row.original.connectorID,
                provider: row.original.provider,
              })['CONNECTIVITY_CONNECTOR_INSTALLED_DETAIL'].to
            }
          >
            <Chip
              {...chipVariantFromType['name']}
              label={connectorName}
              maxWidth="sm"
            />
          </Link>
        ) : (
          <span>-</span>
        );
      },
    });

    columns.push({
      header: 'Connector ID',
      accessorKey: 'connectorID',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['id']}
          label={row.original.connectorID}
          maxWidth="sm"
          copyMode="click"
        />
      ),
    });

    columns.push({
      header: 'Type',
      accessorKey: 'Type',
      cell: ({ row }) => (
        <Badge variant={badgeVariantFromPaymentAccountType[row.original.type]}>
          {row.original.type}
        </Badge>
      ),
    });

    columns.push({
      header: 'Created At',
      accessorKey: 'Created At',
      cell: ({ row }) => (
        <span className="whitespace-nowrap select-all">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    });
  }

  // Always show action column for navigation
  columns.push({
    header: '',
    id: 'see',
    accessorKey: 'See Payment Account',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              paymentAccountId: row.original.id,
            })['CONNECTIVITY_ACCOUNT_DETAIL'].to
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

type TPaymentsListProps = {
  title?: string;
  description?: string;
  paymentsAccounts:
    | Cursor<NormalizedPaymentAccountModel>
    | NormalizedPaymentAccountModel[];
  version: string;
  connectorsConfig: NormalizedConnectorConfigsModel;
  serverSide?: boolean;
  onRowCheckedChange?: (id: string) => any;
  onRowChecked?: (id: string) => (boolean | 'indeterminate') | undefined;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PaymentAccountsList<TData>({
  title,
  description,
  paymentsAccounts,
  version,
  serverSide,
  onRowCheckedChange,
  connectorsConfig,
  onRowChecked,
  ...props
}: TPaymentsListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'payments-accounts-list',
  });

  const { toggleFavorite, isFavorite } = useFavorites(
    'connectivity.paymentAccounts'
  );

  const context = useOutletContext<CurrentContext>();

  const [searchParams] = useSearchParams();
  const showOnlyFavorites =
    searchParams.get(CONNECTIVITY_ACCOUNTS_LIST_FAVORITES) === '"true"';

  const { handleQueryChange, handleResetFilters } = useDataTableQuery(
    CONNECTIVITY_ACCOUNTS_LIST
  );

  const saveFiltersHook = useSavedFilters();
  const filtersActive = hasActiveTableFilters(
    searchParams,
    CONNECTIVITY_ACCOUNTS_LIST
  );

  const handleFavoritesChange = useCallback(
    (pressed: boolean) => {
      handleQueryChange({
        [CONNECTIVITY_ACCOUNTS_LIST_FAVORITES]: pressed ? '"true"' : '',
      });
    },
    [handleQueryChange]
  );

  const filteredPaymentsAccounts = useMemo(() => {
    if (!showOnlyFavorites || !paymentsAccounts) return paymentsAccounts;

    if ((paymentsAccounts as Cursor<NormalizedPaymentAccountModel>).data) {
      return {
        ...paymentsAccounts,
        data: (
          paymentsAccounts as Cursor<NormalizedPaymentAccountModel>
        ).data.filter((paymentAccount) =>
          isFavorite({
            id: paymentAccount.id,
            name: paymentAccount.accountName ?? paymentAccount.name ?? '',
          })
        ),
      };
    } else {
      return (paymentsAccounts as NormalizedPaymentAccountModel[]).filter(
        (paymentAccount) =>
          isFavorite({
            id: paymentAccount.id,
            name: paymentAccount.accountName ?? paymentAccount.name ?? '',
          })
      );
    }
  }, [paymentsAccounts, showOnlyFavorites, isFavorite]);

  const hasConnectorObjects = useMemo(() => {
    const accounts = Array.isArray(filteredPaymentsAccounts)
      ? filteredPaymentsAccounts
      : filteredPaymentsAccounts?.data || [];

    return accounts.some((account: any) => account.connector);
  }, [filteredPaymentsAccounts]);

  const columns = getPaymentAccountsColumns({
    organizationId,
    stackId,
    region,
    isFavorite,
    toggleFavorite,
    isFavoritesView: false,
  });

  const { isMicroStack } = useMicroStack(context);

  if (onRowCheckedChange && onRowChecked) {
    columns.unshift({
      id: 'select',
      cell: ({ row }) => {
        const checked = onRowChecked(row.original.id);

        return (
          <Checkbox
            key={row.original.id}
            value={row.original.reference}
            checked={checked}
            onCheckedChange={() => {
              onRowCheckedChange(row.original.id);
            }}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    });
  }

  return (
    <>
      <AppCard
        title={title || 'Accounts'}
        description={description || 'A list of all the connectivity accounts'}
        appIcon={Wallet2}
        {...props}
      >
        {serverSide ? (
          <DatatableServerSide
            columns={columns as ColumnDef<TData>[]}
            data={filteredPaymentsAccounts as Cursor<TData>}
            id={CONNECTIVITY_ACCOUNTS_LIST}
            initialState={{
              columnPinning: {
                left: ['bookmark'],
                right: ['see'],
              },
              columnVisibility: {
                accountName: false,
                connectorID: false,
                connectorName: hasConnectorObjects,
              },
            }}
            toolbarLeft={
              <>
                <DataTableFilterList
                  getFilterConfig={() =>
                    getConnectivityAccountsFiltersConfig({
                      moduleVersion: version,
                    })
                  }
                  tableId={CONNECTIVITY_ACCOUNTS_LIST}
                  onQueryChange={handleQueryChange}
                  onResetFilters={handleResetFilters}
                  saveFiltersHook={saveFiltersHook}
                />
                <DataTableFavoriteFilter
                  favoritesPressed={showOnlyFavorites}
                  onFavoritesChange={handleFavoritesChange}
                  favoritesParameterName={CONNECTIVITY_ACCOUNTS_LIST_FAVORITES}
                />
              </>
            }
            toolbarRight={
              <DataTableExportData
                cursorData={
                  Array.isArray(filteredPaymentsAccounts)
                    ? { data: filteredPaymentsAccounts }
                    : filteredPaymentsAccounts
                }
              />
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
            columns={columns as ColumnDef<TData>[]}
            data={filteredPaymentsAccounts as Cursor<TData>}
            displayPagination={false}
            initialState={{
              columnPinning: {
                right: ['see'],
              },
              columnVisibility: {
                accountName: false,
                connectorID: false,
                connectorName: hasConnectorObjects,
              },
            }}
            searchConfig={[
              {
                placeholder: 'Filter by ID',
                columnKey: 'accountId',
                size: 'md',
              },
              {
                placeholder: 'Filter by reference',
                columnKey: 'reference',
                size: 'md',
              },
            ]}
            filtersConfig={[
              {
                title: 'Provider',
                column: 'provider',
                options: getConnectorsOptions(connectorsConfig),
              },
            ]}
            emptyState={
              <EmptyState
                organizationId={organizationId}
                stackId={stackId}
                region={region}
                isMicroStack={isMicroStack}
              />
            }
          />
        )}
      </AppCard>
    </>
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
      title="No accounts found"
      description="Accounts will appear here when you install a connector"
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
                })['CONNECTIVITY_ACCOUNTS_LIST'].snippet}
              />
              <p className="text-center text-muted-foreground">OR</p>
            </>
          )}

          <Link
            to={
              ROUTES({ organizationId, stackId, region })[
                'CONNECTIVITY_CONNECTORS_ALL'
              ].to
            }
          >
            <Button variant="primary" size="md">
              Install Connector
            </Button>
          </Link>
        </div>
      </div>
    </AppCardEmpty>
  );
}
