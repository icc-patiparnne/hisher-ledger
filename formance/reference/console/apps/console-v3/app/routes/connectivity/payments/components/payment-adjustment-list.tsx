import { Eye, SquareDot } from 'lucide-react';
import React from 'react';

import {
  AppCard,
  Badge,
  Button,
  Chip,
  ChipAmount,
  chipVariantFromType,
  ColumnDef,
  DataTable,
  DataTableFormatOptions,
  PreviewJson,
  Row,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@platform/ui';

import { badgeVariantFromPaymentStatus } from '../../../../components/badge';
import { chipVariantFromConsoleType } from '../../../../components/chip';
import { useFormatAmount } from '../../../../hooks/useFormatAmount';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { NormalizedPaymentAdjustmentModel } from '../../../../utils/sdk/payments/models';

type TPaymentAdjustmentListProps = {
  adjustments: NormalizedPaymentAdjustmentModel[];
  asset: string;
  version: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PaymentAdjustmentList({
  adjustments,
  asset = '',
  version,
  ...props
}: TPaymentAdjustmentListProps) {
  useRouteGuard({
    componentName: 'payment-adjustment-list',
    requiredParams: ['paymentId'],
  });

  const { shouldFormat, toggleFormat } = useFormatAmount();

  const isV3 = version === '3';

  const columns: ColumnDef<NormalizedPaymentAdjustmentModel>[] = [
    {
      header: 'Reference',
      accessorKey: 'reference',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromConsoleType['reference']}
          label={row.original.reference}
        />
      ),
    },

    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }) => (
        <ChipAmount
          asset={row.original.asset ?? asset}
          amount={row.original.amount}
          shouldFormat={shouldFormat}
        />
      ),
    },

    ...(isV3
      ? [
          {
            header: 'Asset',
            accessorKey: 'asset',
            cell: ({ row }: { row: Row<NormalizedPaymentAdjustmentModel> }) => (
              <Chip
                {...chipVariantFromType['asset']}
                label={row.original.asset ?? asset}
              />
            ),
          },
        ]
      : []),

    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge variant={badgeVariantFromPaymentStatus[row.original.status]}>
          {row.original.status}
        </Badge>
      ),
    },

    {
      header: 'Raw',
      accessorKey: 'Raw',
      enableHiding: false,
      cell: ({ row }) => (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="zinc" size="icon-md">
              <Eye />
            </Button>
          </SheetTrigger>
          <SheetContent className="lg:w-[700px] sm:max-w-none flex flex-col">
            <SheetHeader>
              <SheetTitle>Raw</SheetTitle>
            </SheetHeader>

            <div className="px-4">
              <div className="overflow-y-scroll no-scrollbar flex-1">
                <PreviewJson json={row.original} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ),
    },
  ];

  return (
    <AppCard
      title="Adjustments"
      description="A list of all the adjustments made to this payment"
      variant="slate"
      appIcon={SquareDot}
      {...props}
    >
      <DataTable
        columns={columns}
        data={adjustments}
        displayPagination={true}
        searchConfig={[
          {
            placeholder: 'Filter by reference',
            columnKey: 'reference',
          },
        ]}
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
