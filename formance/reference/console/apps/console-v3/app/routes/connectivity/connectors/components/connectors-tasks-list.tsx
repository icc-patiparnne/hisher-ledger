import { CalendarSync, Eye } from 'lucide-react';

import {
  AppCard,
  Badge,
  Button,
  Chip,
  chipVariantFromType,
  ColumnDef,
  DataTable,
  PreviewJson,
  Row,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@platform/ui';

import { DatatableServerSide } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { formatDate } from '@platform/utils';
import React from 'react';
import { Link } from 'react-router';
import { badgeVariantFromTaskStatus } from '../../../../components/badge';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedConnectorTaskModel } from '../../../../utils/sdk/payments/models';
import { CONNECTIVITY_CONNECTORS_TASKS_LIST } from '../../constants';

type ConnectorsTaskListProps = {
  tasks: Cursor<NormalizedConnectorTaskModel>;
  version: string;
  serverSide?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function ConnectorsTaskList({
  tasks,
  version,
  serverSide,
  ...props
}: ConnectorsTaskListProps) {
  const { organizationId, stackId, region, provider } = useRouteGuard({
    componentName: 'connectors-tasks-list',
    requiredSearchParams: ['provider'],
  });

  const isV3 = version === '3';

  const columns: ColumnDef<NormalizedConnectorTaskModel>[] = [
    ...(isV3
      ? [
          {
            header: 'ID',
            accessorKey: 'id',
            cell: ({ row }: { row: Row<NormalizedConnectorTaskModel> }) => (
              <Link
                to={
                  ROUTES({
                    organizationId,
                    stackId,
                    region,
                    connectorId: row.original.connectorID,
                    taskId: row.original.id,
                    provider,
                  })['CONNECTIVITY_CONNECTOR_INSTALLED_TASKS_DETAIL'].to
                }
              >
                <Chip
                  {...chipVariantFromType['id']}
                  label={row.original.id}
                  maxWidth="lg"
                />
              </Link>
            ),
          },
        ]
      : [
          {
            header: 'ID',
            accessorKey: 'id',
            cell: ({ row }: { row: Row<NormalizedConnectorTaskModel> }) => (
              <Chip
                {...chipVariantFromType['id']}
                label={row.original.id}
                maxWidth="lg"
                copyMode="click"
              />
            ),
          },
        ]),

    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['string']}
          label={row.original.descriptor?.name || 'No description'}
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
                <PreviewJson json={row.original} />
              </SheetContent>
            </Sheet>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },

    ...(isV3
      ? [
          {
            header: 'Status',
            accessorKey: 'status',
            cell: () => (
              <Badge variant={badgeVariantFromTaskStatus['ACTIVE']}>
                ACTIVE
              </Badge>
            ),
          },
        ]
      : [
          {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }: { row: Row<NormalizedConnectorTaskModel> }) => (
              <Badge
                variant={
                  badgeVariantFromTaskStatus[row.original.status ?? 'ACTIVE']
                }
              >
                {row.original.status ?? 'ACTIVE'}
              </Badge>
            ),
          },
        ]),

    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
    },

    {
      header: '',
      id: 'see',
      enableHiding: false,
      accessorKey: 'See Task',
      cell: ({ row }) => (
        <div className="flex justify-center">
          {isV3 ? (
            <Link
              to={
                ROUTES({
                  organizationId,
                  stackId,
                  region,
                  connectorId: row.original.connectorID,
                  taskId: row.original.id,
                  provider,
                })['CONNECTIVITY_CONNECTOR_INSTALLED_TASKS_DETAIL'].to
              }
            >
              <Button variant="zinc" size="icon-md">
                <Eye />
              </Button>
            </Link>
          ) : (
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
                <PreviewJson json={row.original} />
              </SheetContent>
            </Sheet>
          )}
        </div>
      ),
    },
  ];

  return (
    <AppCard title="Tasks" variant="cobalt" appIcon={CalendarSync} {...props}>
      {serverSide ? (
        <DatatableServerSide
          columns={columns}
          data={tasks}
          id={CONNECTIVITY_CONNECTORS_TASKS_LIST}
          initialState={{
            columnPinning: {
              right: ['see'],
            },
          }}
        />
      ) : (
        <DataTable columns={columns} data={tasks} />
      )}
    </AppCard>
  );
}
