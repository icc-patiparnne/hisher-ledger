import { Coins, Eye } from 'lucide-react';
import React from 'react';

import {
  AppCard,
  AppCardEmpty,
  Button,
  Chip,
  chipVariantFromType,
  CodeSnippet,
  ColumnDef,
  DataTableExportData,
  DataTableFilterList,
  Row,
  TDataTableToolbarProps,
} from '@platform/ui';

import { DatatableServerSide, useDataTableQuery } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { FCTL_SNIPPETS, formatDate } from '@platform/utils';
import { Link, useOutletContext, useSearchParams } from 'react-router';
import { useMicroStack } from '../../../../hooks/useMicroStack';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { CurrentContext } from '../../../../root';
import { hasActiveTableFilters } from '../../../../utils/filters';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedCashPoolModel } from '../../../../utils/sdk/payments/models';
import { CONNECTIVITY_CASH_POOLS_LIST } from '../../constants';
import { getConnectivityCashPoolsFiltersConfig } from '../../filters/connectivity-cash-pools-filters';

type TPaymentCashPoolsListProps = {
  cashPools:
    | Cursor<NormalizedCashPoolModel>
    | {
        id: NormalizedCashPoolModel['id'];
      }[];
  version: string;
} & TDataTableToolbarProps &
  React.HTMLAttributes<HTMLDivElement>;

export default function PaymentsCashPoolsList({
  cashPools,
  version,
  children,
  ...props
}: TPaymentCashPoolsListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'payments-cash-pools-list',
  });

  const context = useOutletContext<CurrentContext>();

  const [searchParams] = useSearchParams();
  const isV3 = version === '3';

  const { handleQueryChange, handleResetFilters } = useDataTableQuery(
    CONNECTIVITY_CASH_POOLS_LIST
  );

  // Check if any table filters are currently active
  const filtersActive = hasActiveTableFilters(
    searchParams,
    CONNECTIVITY_CASH_POOLS_LIST
  );

  const columns: ColumnDef<NormalizedCashPoolModel>[] = [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              paymentCashPoolId: row.original.id,
            })['CONNECTIVITY_CASH_POOL_DETAIL'].to
          }
        >
          <Chip {...chipVariantFromType['id']} label={row.original.id} />
        </Link>
      ),
    },

    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <>
          {row.original.name ? (
            <Link
              to={
                ROUTES({
                  organizationId,
                  stackId,
                  region,
                  paymentCashPoolId: row.original.id,
                })['CONNECTIVITY_CASH_POOL_DETAIL'].to
              }
            >
              <Chip
                {...chipVariantFromType['name']}
                label={row.original.name}
              />
            </Link>
          ) : (
            <></>
          )}
        </>
      ),
    },

    {
      header: 'Accounts in the pool',
      accessorKey: 'Accounts',
      cell: ({ row }) => (
        <>
          {row.original.accounts ? (
            <Link
              to={
                ROUTES({
                  organizationId,
                  stackId,
                  region,
                  paymentCashPoolId: row.original.id,
                })['CONNECTIVITY_CASH_POOL_DETAIL'].to
              }
            >
              <Chip
                {...chipVariantFromType['number']}
                label={row.original.accounts?.length || '0'}
              />
            </Link>
          ) : (
            <></>
          )}
        </>
      ),
    },

    ...(isV3
      ? [
          {
            header: 'Created At',
            accessorKey: 'createdAt',
            cell: ({ row }: { row: Row<NormalizedCashPoolModel> }) => (
              <>
                {row.original.createdAt ? (
                  <span>{formatDate(row.original.createdAt)}</span>
                ) : (
                  <></>
                )}
              </>
            ),
          },
        ]
      : []),

    {
      id: 'see',
      header: '',
      accessorKey: 'See Cash Pool',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                paymentCashPoolId: row.original.id,
              })['CONNECTIVITY_CASH_POOL_DETAIL'].to
            }
          >
            <Button variant="zinc" size="icon-md">
              <Eye />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  const { isMicroStack } = useMicroStack(context);

  return (
    <AppCard
      title="Cash Pools"
      description="A list of all cash pools"
      appIcon={Coins}
      {...props}
    >
      {children}
      <DatatableServerSide
        data={cashPools as unknown as Cursor<NormalizedCashPoolModel>}
        columns={columns}
        id={CONNECTIVITY_CASH_POOLS_LIST}
        initialState={{
          columnPinning: {
            right: ['see'],
          },
        }}
        toolbarLeft={
          <>
            <DataTableFilterList
              getFilterConfig={() =>
                getConnectivityCashPoolsFiltersConfig({
                  moduleVersion: version,
                })
              }
              tableId={CONNECTIVITY_CASH_POOLS_LIST}
              onQueryChange={handleQueryChange}
              onResetFilters={handleResetFilters}
            />
            {props.toolbarLeft}
          </>
        }
        toolbarRight={
          <DataTableExportData
            cursorData={
              Array.isArray(cashPools) ? { data: cashPools } : cashPools
            }
          />
        }
        emptyState={
          !filtersActive ? (
            <AppCardEmpty
              title="No cash pools found"
              description="Cash pools will appear here when you create them"
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
                        })['CONNECTIVITY_CASH_POOLS_CREATE'].snippet}
                      />
                      <p className="text-center text-muted-foreground">OR</p>
                    </>
                  )}

                  <Link
                    to={
                      ROUTES({ organizationId, stackId, region })[
                        'CONNECTIVITY_CASH_POOLS_CREATE'
                      ].to
                    }
                  >
                    <Button variant="primary" size="md">
                      Create Cash Pool
                    </Button>
                  </Link>
                </div>
              </div>
            </AppCardEmpty>
          ) : undefined
        }
      />
    </AppCard>
  );
}
