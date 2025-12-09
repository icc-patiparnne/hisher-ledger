import { Eye, SendHorizontal } from 'lucide-react';
import React from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router';

import { Cursor } from '@platform/sdks/utils/cursor';
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
import {
  Connector,
  Status,
} from '@platform/sdks/formance/src/models/components';
import { FCTL_SNIPPETS, formatDate } from '@platform/utils';
import {
  badgeVariantFromTransferStatus,
  badgeVariantFromTransferType,
} from '../../../../components/badge';
import { chipVariantFromConsoleType } from '../../../../components/chip';
import { useFormatAmount } from '../../../../hooks/useFormatAmount';
import { useMicroStack } from '../../../../hooks/useMicroStack';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useSavedFilters } from '../../../../hooks/useSavedFilters';
import { CurrentContext } from '../../../../root';
import { hasActiveTableFilters } from '../../../../utils/filters';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedTransferInitiationModel } from '../../../../utils/sdk/payments/models';
import { CONNECTIVITY_TRANSFER_INITIATIONS_LIST } from '../../constants';
import { getConnectivityTransfersFiltersConfig } from '../../filters/connectivity-transfers-filters';
import { getEffectiveProvider } from '../../utils';
import PaymentTransferActions from './payment-transfer-actions';

type TPaymentTransfersListProps = {
  paymentTransfers: Cursor<NormalizedTransferInitiationModel>;
  version: string;
  onStatusUpdate?: (transferId: string, status: Status) => void;
  isUpdating?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PaymentTransfersList({
  paymentTransfers,
  version,
  onStatusUpdate,
  isUpdating = false,
  ...props
}: TPaymentTransfersListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'payment-transfers-list',
  });

  const context = useOutletContext<CurrentContext>();

  const [searchParams] = useSearchParams();
  const { shouldFormat, toggleFormat } = useFormatAmount();

  const { handleQueryChange, handleResetFilters } = useDataTableQuery(
    CONNECTIVITY_TRANSFER_INITIATIONS_LIST
  );

  const saveFiltersHook = useSavedFilters();

  // Check if any table filters are currently active
  const filtersActive = hasActiveTableFilters(
    searchParams,
    CONNECTIVITY_TRANSFER_INITIATIONS_LIST
  );

  const { isMicroStack } = useMicroStack(context);

  const columns: ColumnDef<NormalizedTransferInitiationModel>[] = [
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
              paymentTransferId: row.original.id,
            })['CONNECTIVITY_TRANSFER_DETAIL'].to
          }
        >
          <Chip
            {...chipVariantFromType['id']}
            label={row.original.id}
            maxWidth="sm"
          />
        </Link>
      ),
    },

    {
      header: 'Provider',
      accessorKey: 'provider',
      cell: ({ row }) => {
        const effectiveProvider = getEffectiveProvider(row.original);

        return (
          <>
            {effectiveProvider ? (
              <div className="flex items-center gap-1.5">
                <ConnectorIcon
                  name={effectiveProvider as unknown as Connector}
                />
                <span className="font-medium capitalize">
                  {effectiveProvider?.toLowerCase()}
                </span>
              </div>
            ) : (
              <span>-</span>
            )}
          </>
        );
      },
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
              paymentTransferId: row.original.id,
            })['CONNECTIVITY_TRANSFER_DETAIL'].to
          }
        >
          <Chip
            {...chipVariantFromConsoleType['reference']}
            label={row.original.reference}
            maxWidth="sm"
          />
        </Link>
      ),
    },

    {
      header: 'Source Account ID',
      accessorKey: 'sourceAccountId',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              paymentTransferId: row.original.id,
            })['CONNECTIVITY_TRANSFER_DETAIL'].to
          }
        >
          <Chip
            {...chipVariantFromType['id']}
            label={row.original.sourceAccountID || ''}
            maxWidth="sm"
          />
        </Link>
      ),
    },

    {
      header: 'Destination Account ID',
      accessorKey: 'destinationAccountId',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              paymentTransferId: row.original.id,
            })['CONNECTIVITY_TRANSFER_DETAIL'].to
          }
        >
          <Chip
            {...chipVariantFromType['id']}
            label={row.original.destinationAccountID || ''}
            maxWidth="sm"
          />
        </Link>
      ),
    },

    {
      header: 'Connector ID',
      accessorKey: 'connectorId',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              paymentTransferId: row.original.id,
            })['CONNECTIVITY_TRANSFER_DETAIL'].to
          }
        >
          <Chip
            {...chipVariantFromType['id']}
            label={row.original.connectorID}
            maxWidth="sm"
          />
        </Link>
      ),
    },

    {
      header: 'Initial Amount',
      accessorKey: 'initialAmount',
      cell: ({ row }) => (
        <ChipAmount
          asset={row.original.asset}
          amount={row.original.initialAmount}
          shouldFormat={shouldFormat}
        />
      ),
    },

    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }) => (
        <ChipAmount
          asset={row.original.asset}
          amount={row.original.amount}
          shouldFormat={shouldFormat}
        />
      ),
    },

    ...(shouldFormat
      ? []
      : [
          {
            header: 'Asset',
            accessorKey: 'asset',
            cell: ({
              row,
            }: {
              row: Row<NormalizedTransferInitiationModel>;
            }) => (
              <Chip
                {...chipVariantFromType['asset']}
                label={row.original.asset}
              />
            ),
          },
        ]),

    {
      header: 'Type',
      accessorKey: 'type',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              paymentTransferId: row.original.id,
            })['CONNECTIVITY_TRANSFER_DETAIL'].to
          }
        >
          <Badge variant={badgeVariantFromTransferType[row.original.type]}>
            {row.original.type}
          </Badge>
        </Link>
      ),
    },

    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              paymentTransferId: row.original.id,
            })['CONNECTIVITY_TRANSFER_DETAIL'].to
          }
        >
          <Badge variant={badgeVariantFromTransferStatus[row.original.status]}>
            {row.original.status}
          </Badge>
        </Link>
      ),
    },

    {
      header: 'Scheduled At',
      accessorKey: 'scheduledAt',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              paymentTransferId: row.original.id,
            })['CONNECTIVITY_TRANSFER_DETAIL'].to
          }
        >
          <span className="whitespace-nowrap select-all">
            {formatDate(row.original.scheduledAt)}
          </span>
        </Link>
      ),
    },

    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              paymentTransferId: row.original.id,
            })['CONNECTIVITY_TRANSFER_DETAIL'].to
          }
        >
          <span className="whitespace-nowrap select-all">
            {formatDate(row.original.createdAt)}
          </span>
        </Link>
      ),
    },

    {
      header: '',
      id: 'see-and-actions',
      accessorKey: 'See Transfer',
      enableHiding: false,
      cell: ({ row }) => {
        const transfer = row.original;

        return (
          <div className="flex items-center justify-center gap-2">
            <PaymentTransferActions transfer={transfer} />
            <div className="text-right">
              <Link
                to={
                  ROUTES({
                    organizationId,
                    stackId,
                    region,
                    paymentTransferId: row.original.id,
                  })['CONNECTIVITY_TRANSFER_DETAIL'].to
                }
              >
                <Button variant="zinc" size="icon-md">
                  <Eye />
                </Button>
              </Link>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <AppCard
        title="Transfers"
        description="A list of all payment transfers initiated from Formance"
        appIcon={SendHorizontal}
        {...props}
      >
        <DatatableServerSide
          columns={columns}
          data={paymentTransfers}
          id={CONNECTIVITY_TRANSFER_INITIATIONS_LIST}
          initialState={{
            columnPinning: {
              right: ['see-and-actions'],
            },
            columnVisibility: {
              sourceAccountId: false,
              destinationAccountId: false,
              connectorId: false,
              initialAmount: false,
              scheduledAt: false,
            },
          }}
          toolbarLeft={
            <>
              <DataTableFilterList
                getFilterConfig={() =>
                  getConnectivityTransfersFiltersConfig({
                    moduleVersion: version,
                  })
                }
                tableId={CONNECTIVITY_TRANSFER_INITIATIONS_LIST}
                onQueryChange={handleQueryChange}
                onResetFilters={handleResetFilters}
                saveFiltersHook={saveFiltersHook}
              />
            </>
          }
          toolbarRight={
            <>
              <DataTableExportData cursorData={paymentTransfers} />
              <DataTableFormatOptions
                checked={shouldFormat}
                onCheckedChange={toggleFormat}
              />
            </>
          }
          emptyState={
            !filtersActive ? (
              <AppCardEmpty
                title="No transfers found"
                description="Transfers will appear here when you create them"
                {...props}
              >
                <div className="grid gap-2 mt-3">
                  <div className="grid gap-2">
                    {!isMicroStack && (
                      <CodeSnippet
                        isSingleLine
                        {...FCTL_SNIPPETS({
                          organizationId,
                          stackId,
                          regionId: region,
                        })['CONNECTIVITY_TRANSFERS_CREATE'].snippet}
                      />
                    )}
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
