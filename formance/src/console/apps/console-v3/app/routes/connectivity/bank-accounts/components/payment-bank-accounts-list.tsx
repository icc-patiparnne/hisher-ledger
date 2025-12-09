import { Banknote, Eye } from 'lucide-react';
import React from 'react';
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
  DataTableFilterList,
  FlagIcon,
} from '@platform/ui';

import { DatatableServerSide, useDataTableQuery } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { FCTL_SNIPPETS, formatDate } from '@platform/utils';
import { useMicroStack } from '../../../../hooks/useMicroStack';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { CurrentContext } from '../../../../root';
import { hasActiveTableFilters } from '../../../../utils/filters';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedBankAccountModel } from '../../../../utils/sdk/payments/models';
import { CONNECTIVITY_BANK_ACCOUNTS_LIST } from '../../constants';
import { getConnectivityBankAccountsFiltersConfig } from '../../filters/connectivity-bank-accounts-filters';

type TPaymentsListProps = {
  paymentsBankAccounts: Cursor<NormalizedBankAccountModel>;
  serverSide?: boolean;
  version: string;
  json?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PaymentsBankAccountsList({
  paymentsBankAccounts,
  serverSide,
  version,
  json,
  children,
  ...props
}: TPaymentsListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'payments-bank-accounts-list',
  });

  const context = useOutletContext<CurrentContext>();

  const [searchParams] = useSearchParams();

  const { handleQueryChange, handleResetFilters } = useDataTableQuery(
    CONNECTIVITY_BANK_ACCOUNTS_LIST
  );

  // Check if any table filters are currently active
  const filtersActive = hasActiveTableFilters(
    searchParams,
    CONNECTIVITY_BANK_ACCOUNTS_LIST
  );

  const { isMicroStack } = useMicroStack(context);

  const columns: ColumnDef<NormalizedBankAccountModel>[] = [
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
              paymentBankAccountId: row.original.id,
            })['CONNECTIVITY_BANK_ACCOUNT_DETAIL'].to
          }
        >
          <Chip {...chipVariantFromType['id']} label={row.original.id} />
        </Link>
      ),
    },

    {
      header: 'Connector ID',
      accessorKey: 'connectorId',
      cell: ({ row }) => (
        <Chip {...chipVariantFromType['id']} label={row.original.id} />
      ),
    },

    {
      header: 'Account ID',
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
            size="sm"
          />
        </Link>
      ),
    },

    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['name']}
          label={row.original.name}
          copyMode="click"
        />
      ),
    },

    {
      header: 'Related Accounts',
      accessorKey: 'relatedAccounts',
      cell: ({ row }) => {
        const relatedAccounts = row.original.relatedAccounts?.length;

        return (
          <Chip
            {...chipVariantFromType[
              relatedAccounts === 0
                ? 'number'
                : relatedAccounts && relatedAccounts > 0
                ? 'numberPositive'
                : 'numberNegative'
            ]}
            label={relatedAccounts?.toString() ?? '0'}
          />
        );
      },
    },

    {
      header: 'Country',
      accessorKey: 'country',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.country && (
            <FlagIcon countryCode={row.original.country} />
          )}
          <span className="font-medium">{row.original.country}</span>
        </div>
      ),
    },

    {
      header: 'Created At',
      accessorKey: 'Created At',
      cell: ({ row }) => (
        <span className="whitespace-nowrap select-all">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },

    {
      header: '',
      id: 'see',
      accessorKey: 'See Bank Account',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                paymentBankAccountId: row.original.id,
              })['CONNECTIVITY_BANK_ACCOUNT_DETAIL'].to
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

  return (
    <AppCard
      title="Bank Accounts"
      description="A list of all the connectivity bank accounts"
      appIcon={Banknote}
      {...props}
    >
      {children}
      <DatatableServerSide
        columns={columns}
        data={paymentsBankAccounts}
        id={CONNECTIVITY_BANK_ACCOUNTS_LIST}
        initialState={{
          columnPinning: {
            right: ['see'],
          },
          columnVisibility: {
            connectorId: false,
            accountId: false,
          },
        }}
        toolbarLeft={
          <>
            <DataTableFilterList
              getFilterConfig={() =>
                getConnectivityBankAccountsFiltersConfig({
                  moduleVersion: version,
                })
              }
              tableId={CONNECTIVITY_BANK_ACCOUNTS_LIST}
              onQueryChange={handleQueryChange}
              onResetFilters={handleResetFilters}
            />
          </>
        }
        toolbarRight={<DataTableExportData cursorData={paymentsBankAccounts} />}
        emptyState={
          !filtersActive ? (
            <AppCardEmpty
              title="No bank accounts found"
              description="Bank accounts will appear here when you install connectors that support them"
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
                        })['CONNECTIVITY_BANK_ACCOUNTS_CREATE'].snippet}
                      />
                      <p className="text-center text-muted-foreground">OR</p>
                    </>
                  )}

                  <Link
                    to={
                      ROUTES({ organizationId, stackId, region })[
                        'CONNECTIVITY_BANK_ACCOUNTS_CREATE'
                      ].to
                    }
                  >
                    <Button variant="primary" size="md">
                      Create Bank Account
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
