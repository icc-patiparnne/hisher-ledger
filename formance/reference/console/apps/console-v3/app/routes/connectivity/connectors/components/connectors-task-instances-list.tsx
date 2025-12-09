import { CalendarSync, Eye } from 'lucide-react';

import {
  AppCard,
  Badge,
  Button,
  Chip,
  chipVariantFromType,
  ColumnDef,
  PreviewJson,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@platform/ui';

import { formatDate } from '@platform/utils';

import { DatatableServerSide } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import React from 'react';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { NormalizedConnectorTaskScheduleInstanceModel } from '../../../../utils/sdk/payments/models';
import { CONNECTIVITY_CONNECTORS_TASKS_INSTANCES_LIST } from '../../constants';

type ConnectorsTaskInstancesListProps = {
  instances: Cursor<NormalizedConnectorTaskScheduleInstanceModel>;
  version: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function ConnectorsTaskInstancesList({
  instances,
  version,
  ...props
}: ConnectorsTaskInstancesListProps) {
  useRouteGuard({
    componentName: 'connectors-task-instances-list',
    requiredSearchParams: ['provider'],
  });

  const columns: ColumnDef<NormalizedConnectorTaskScheduleInstanceModel>[] = [
    {
      header: 'Instance ID',
      accessorKey: 'InstanceID',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['id']}
          label={row.original.id}
          maxWidth="lg"
          copyMode="click"
        />
      ),
    },

    {
      header: 'Error',
      accessorKey: 'error',
      cell: ({ row }) => (
        <>
          {row.original.error ? (
            <Sheet>
              <SheetTrigger>
                <Chip {...chipVariantFromType['false']} label="Inspect logs" />
              </SheetTrigger>
              <SheetContent className="lg:w-[700px] sm:max-w-none flex flex-col">
                <SheetHeader>
                  <SheetTitle>Raw</SheetTitle>
                </SheetHeader>
                <Separator />
                <div className="px-4">
                  <PreviewJson json={row.original} />
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },

    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
    },

    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge variant={row.original.terminated ? 'valid' : 'zinc'}>
          {row.original.terminated ? 'Terminated' : 'Running'}
        </Badge>
      ),
    },

    {
      header: 'Terminated At',
      accessorKey: 'terminatedAt',
      cell: ({ row }) => (
        <span>
          {row.original.terminatedAt
            ? formatDate(row.original.terminatedAt)
            : '-'}
        </span>
      ),
    },

    {
      header: '',
      accessorKey: 'See Raw',
      enableHiding: false,
      cell: ({ row }) => (
        <Sheet>
          <SheetTrigger>
            <Button variant="zinc" size="icon-md">
              <Eye />
            </Button>
          </SheetTrigger>
          <SheetContent className="lg:w-[700px] sm:max-w-none flex flex-col">
            <SheetHeader>
              <SheetTitle>Raw</SheetTitle>
            </SheetHeader>

            <PreviewJson json={row.original} />
          </SheetContent>
        </Sheet>
      ),
    },
  ];

  return (
    <AppCard
      title="Task Instances"
      variant="cobalt"
      appIcon={CalendarSync}
      {...props}
    >
      <DatatableServerSide
        columns={columns}
        data={instances}
        id={CONNECTIVITY_CONNECTORS_TASKS_INSTANCES_LIST}
      />
    </AppCard>
  );
}
