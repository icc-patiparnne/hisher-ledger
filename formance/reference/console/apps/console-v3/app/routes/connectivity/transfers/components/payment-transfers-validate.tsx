import { Eye, SendHorizontal } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import {
  AppCard,
  Badge,
  Button,
  Chip,
  ChipAmount,
  chipVariantFromType,
  ColumnDef,
  ConnectorIcon,
  DataTableFilterList,
  DataTableFormatOptions,
  Row,
} from '@platform/ui';

import {
  DatatableServerSide,
  useAction,
  useDataTableQuery,
} from '@platform/remix';
import {
  Connector,
  Status,
} from '@platform/sdks/formance/src/models/components';
import { Cursor } from '@platform/sdks/utils/cursor';
import { formatDate } from '@platform/utils';

import {
  badgeVariantFromTransferStatus,
  badgeVariantFromTransferType,
} from '../../../../components/badge';
import { chipVariantFromConsoleType } from '../../../../components/chip';
import { useFormatAmount } from '../../../../hooks/useFormatAmount';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { ACTIONS_ROUTES } from '../../../../utils/actions';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedTransferInitiationModel } from '../../../../utils/sdk/payments/models';
import {
  CONNECTIVITY_ACTION_UPDATE_TRANSFER,
  CONNECTIVITY_TRANSFER_INITIATIONS_LIST,
} from '../../constants';
import { getConnectivityTransfersFiltersConfig } from '../../filters/connectivity-transfers-filters';
import PaymentTransferActions from './payment-transfer-actions';

type TPaymentsListProps = {
  paymentTransfers: Cursor<NormalizedTransferInitiationModel>;
  version: string;
  onStatusUpdate?: (transferId: string, status: Status) => void;
  isUpdating?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PaymentTransfersValidate({
  paymentTransfers,
  version,
  onStatusUpdate,
  isUpdating = false,
  ...props
}: TPaymentsListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'payment-transfers-validate',
  });

  const {
    submit: updateTransferStatus,
    isSubmitting: isUpdatingTransferStatus,
  } = useAction({
    formAction: CONNECTIVITY_ACTION_UPDATE_TRANSFER,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      CONNECTIVITY_ACTION_UPDATE_TRANSFER
    ].to,
  });

  const handleUpdateTransferStatus = (transferId: string, status: Status) => {
    updateTransferStatus({ transferId, status });
  };

  const { shouldFormat, toggleFormat } = useFormatAmount();

  const { handleQueryChange, handleResetFilters } = useDataTableQuery(
    CONNECTIVITY_TRANSFER_INITIATIONS_LIST
  );

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
      cell: ({ row }) => (
        <>
          {row.original.provider ? (
            <div className="flex items-center gap-1.5">
              <ConnectorIcon
                name={row.original.provider as unknown as Connector}
              />
              <span className="font-medium capitalize">
                {row.original.provider?.toLowerCase()}
              </span>
            </div>
          ) : (
            <span>-</span>
          )}
        </>
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
      accessorKey: 'See Transfer',
      enableHiding: false,
      cell: ({ row }) => {
        const transfer = row.original;

        return (
          <div className="flex items-center justify-center gap-2">
            <PaymentTransferActions
              transfer={transfer}
              canUpdateStatus
              onUpdateTransferStatus={handleUpdateTransferStatus}
              isUpdatingTransferStatus={isUpdatingTransferStatus}
            />
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
        );
      },
    },
  ];

  return (
    <AppCard
      className={props.className}
      title="Transfers Waiting for Validation"
      description="A list of all payment transfers waiting for validation"
      variant="gold"
      appIcon={SendHorizontal}
    >
      <DatatableServerSide
        columns={columns}
        data={paymentTransfers}
        id={CONNECTIVITY_TRANSFER_INITIATIONS_LIST}
        initialState={{
          columnVisibility: {
            provider: false,
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
            />
          </>
        }
        toolbarRight={
          <>
            <DataTableFormatOptions
              checked={shouldFormat}
              onCheckedChange={toggleFormat}
            />
          </>
        }
      />
    </AppCard>
  );
}
