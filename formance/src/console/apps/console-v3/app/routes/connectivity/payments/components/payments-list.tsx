import { Currency, Eye } from 'lucide-react';
import React from 'react';
import { Link, useOutletContext } from 'react-router';

import {
  AppCard,
  AppCardEmpty,
  Badge,
  Button,
  Chip,
  ChipAmount,
  chipVariantFromType,
  CodeSnippet,
  ColumnDef,
  ConnectorIcon,
  DataTableExportData,
  DataTableFilterList,
  DataTableFormatOptions,
  Row,
} from '@platform/ui';

import { DatatableServerSide, useDataTableQuery } from '@platform/remix';
import { Connector } from '@platform/sdks/formance/src/models/components';
import { Cursor } from '@platform/sdks/utils/cursor';
import { FCTL_SNIPPETS, formatDate } from '@platform/utils';
import {
  badgeVariantFromPaymentStatus,
  badgeVariantFromPaymentType,
} from '../../../../components/badge';
import { chipVariantFromConsoleType } from '../../../../components/chip';
import { useFormatAmount } from '../../../../hooks/useFormatAmount';
import { useMicroStack } from '../../../../hooks/useMicroStack';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useSavedFilters } from '../../../../hooks/useSavedFilters';
import { CurrentContext } from '../../../../root';
import { hasActiveTableFilters } from '../../../../utils/filters';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedPaymentModel } from '../../../../utils/sdk/payments/models';
import { CONNECTIVITY_PAYMENTS_LIST } from '../../constants';
import { getConnectivityPaymentsFiltersConfig } from '../../filters/connectivity-payments-filters';
import { getEffectiveProvider } from '../../utils';

type TPaymentsListProps = {
  payments: Cursor<NormalizedPaymentModel>;
  version: string;
  json?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PaymentsList({
  payments,
  version,
  ...props
}: TPaymentsListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'payments-list',
  });

  const { shouldFormat, toggleFormat } = useFormatAmount();
  const { handleQueryChange, handleResetFilters, searchParams } =
    useDataTableQuery(CONNECTIVITY_PAYMENTS_LIST);

  const saveFiltersHook = useSavedFilters();
  const filtersActive = hasActiveTableFilters(
    searchParams,
    CONNECTIVITY_PAYMENTS_LIST
  );

  const context = useOutletContext<CurrentContext>();
  const { isMicroStack } = useMicroStack(context);

  const columns: ColumnDef<NormalizedPaymentModel>[] = [
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
              paymentId: row.original.id,
            })['CONNECTIVITY_PAYMENT_DETAIL'].to
          }
        >
          <Chip
            {...chipVariantFromType['id']}
            label={row.original.id}
            maxWidth="xs"
          />
        </Link>
      ),
    },

    {
      header: 'Reference',
      accessorKey: 'reference',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              paymentId: row.original.id,
            })['CONNECTIVITY_PAYMENT_DETAIL'].to
          }
        >
          <Chip
            {...chipVariantFromConsoleType['reference']}
            label={row.original.reference}
            maxWidth="xs"
          />
        </Link>
      ),
    },

    {
      header: 'Type',
      accessorKey: 'type',
      cell: ({ row }) => (
        <Badge
          variant={badgeVariantFromPaymentType[row.original.type]}
          size="md"
        >
          {row.original.type}
        </Badge>
      ),
    },

    {
      header: 'Provider',
      accessorKey: 'provider',
      cell: ({ row }) => {
        const effectiveProvider = getEffectiveProvider(row.original);

        return (
          <div className="flex items-center gap-1.5">
            <ConnectorIcon name={effectiveProvider as unknown as Connector} />
            <span className="font-medium capitalize">
              {effectiveProvider?.toLowerCase()}
            </span>
          </div>
        );
      },
    },

    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge
          variant={badgeVariantFromPaymentStatus[row.original.status]}
          size="md"
        >
          {row.original.status}
        </Badge>
      ),
    },

    {
      header: 'Scheme',
      accessorKey: 'scheme',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromConsoleType['scheme']}
          label={row.original.scheme.toLowerCase()}
          className="capitalize"
        />
      ),
    },

    {
      header: 'Value',
      accessorKey: 'amount',
      cell: ({ row }) => (
        <ChipAmount
          asset={row.original.asset}
          amount={row.original.amount}
          shouldFormat={shouldFormat}
        />
      ),
    },

    {
      header: 'Asset',
      accessorKey: 'asset',
      cell: ({ row }: { row: Row<NormalizedPaymentModel> }) => (
        <Chip
          {...chipVariantFromType['asset']}
          label={row.original.asset}
          copyMode="click"
        />
      ),
    },

    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }) => (
        <span className="whitespace-nowrap select-all">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },

    // Example metadata filter - useful for filtering on custom metadata fields
    {
      header: 'Source',
      id: 'metadata[source]',
      cell: ({ row }) => {
        const metadata = row.original.metadata;

        return metadata?.source ? (
          <Chip
            {...chipVariantFromConsoleType['reference']}
            label={metadata.source}
            maxWidth="xs"
          />
        ) : (
          '-'
        );
      },
    },

    {
      header: '',
      id: 'see',
      accessorKey: 'See Payment',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                paymentId: row.original.id,
              })['CONNECTIVITY_PAYMENT_DETAIL'].to
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
    <>
      <AppCard
        title="Payments"
        description="A list of all payments"
        appIcon={Currency}
        {...props}
      >
        <DatatableServerSide
          columns={columns}
          data={payments}
          id={CONNECTIVITY_PAYMENTS_LIST}
          initialState={{
            columnPinning: {
              right: ['see'],
            },
          }}
          toolbarLeft={
            <>
              <DataTableFilterList
                getFilterConfig={() =>
                  getConnectivityPaymentsFiltersConfig({
                    moduleVersion: version,
                  })
                }
                tableId={CONNECTIVITY_PAYMENTS_LIST}
                onQueryChange={handleQueryChange}
                onResetFilters={handleResetFilters}
                saveFiltersHook={saveFiltersHook}
              />
            </>
          }
          toolbarRight={
            <>
              <DataTableExportData cursorData={payments} />
              <DataTableFormatOptions
                checked={shouldFormat}
                onCheckedChange={toggleFormat}
              />
            </>
          }
          emptyState={
            !filtersActive ? (
              <AppCardEmpty
                title="No payments found"
                description="Payments will appear here when you install a connector"
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
                          })['CONNECTIVITY_PAYMENTS_LIST'].snippet}
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
            ) : undefined
          }
        />
      </AppCard>
    </>
  );
}
