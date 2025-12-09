import { SendHorizontal } from 'lucide-react';
import React from 'react';

import {
  AppCard,
  Badge,
  Chip,
  chipVariantFromType,
  ColumnDef,
  DataTable,
} from '@platform/ui';

import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { NormalizedTransferInitiationAdjustementModel } from '../../../../utils/sdk/payments/models';

import { formatDate } from '@platform/utils';
import { badgeVariantFromTransferStatus } from '../../../../components/badge';

type TPaymentTransferRelatedAdjustementsProps = {
  paymentTransferRelatedAdjustements: NormalizedTransferInitiationAdjustementModel[];
  serverSide?: boolean;
  version: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PaymentTransferRelatedAdjustements({
  paymentTransferRelatedAdjustements,
  serverSide,
  version,
  ...props
}: TPaymentTransferRelatedAdjustementsProps) {
  useRouteGuard({
    componentName: 'payment-transfer-related-adjustements',
    requiredParams: ['paymentTransferId'],
  });

  const columns: ColumnDef<NormalizedTransferInitiationAdjustementModel>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['id']}
          label={row.original.adjustmentID}
          maxWidth="xl"
          copyMode="click"
        />
      ),
    },

    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge variant={badgeVariantFromTransferStatus[row.original.status]}>
          {row.original.status}
        </Badge>
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
  ];

  return (
    <AppCard
      title="Related Adjustements"
      description="A list of all the related adjustements to this transfer"
      variant="cobaltDark"
      appIcon={SendHorizontal}
      {...props}
    >
      <DataTable
        columns={columns}
        data={paymentTransferRelatedAdjustements as any}
        displayPagination={true}
        searchConfig={[
          {
            placeholder: 'Filter by ID',
            columnKey: 'id',
          },
        ]}
      />
    </AppCard>
  );
}
