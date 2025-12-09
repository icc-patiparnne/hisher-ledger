import { Eye, ListCheck } from 'lucide-react';
import React from 'react';
import { Link, useSearchParams } from 'react-router';

import {
  AppCard,
  AppCardEmpty,
  Badge,
  Button,
  Chip,
  chipVariantFromType,
  CodeSnippet,
  ColumnDef,
  Row,
} from '@platform/ui';

import { DatatableServerSide } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { FCTL_SNIPPETS, formatDate } from '@platform/utils';
import { badgeVariantFromFlowsInstanceStatus } from '../../../components/badge';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { hasActiveTableFilters } from '../../../utils/filters';
import { ROUTES } from '../../../utils/routes';
import { NormalizedInstanceModel } from '../../../utils/sdk/flows/models';
import { INSTANCES_LIST } from '../constants';

type TInstancesListProps = {
  instances: Cursor<NormalizedInstanceModel>;
  version: string;
  showWorkflowId?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function InstancesList({
  instances,
  version,
  showWorkflowId = true,
  ...props
}: TInstancesListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'flows-instances',
  });

  const [searchParams] = useSearchParams();

  // Check if any table filters are currently active
  const filtersActive = hasActiveTableFilters(searchParams, INSTANCES_LIST);

  const columns: ColumnDef<NormalizedInstanceModel>[] = [
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
              workflowId: row.original.workflowID,
              instanceId: row.original.id,
            })['FLOWS_INSTANCE_DETAIL'].to
          }
        >
          <Chip {...chipVariantFromType['id']} label={row.original.id} />
        </Link>
      ),
    },
    ...(showWorkflowId
      ? [
          {
            header: 'Workflow ID',
            accessorKey: 'Workflow ID',
            cell: ({ row }: { row: Row<NormalizedInstanceModel> }) => (
              <Link
                to={
                  ROUTES({
                    organizationId,
                    stackId,
                    region,
                    workflowId: row.original.workflowID,
                  })['FLOWS_WORKFLOW_DETAIL'].to
                }
              >
                <Chip
                  {...chipVariantFromType['id']}
                  label={row.original.workflowID}
                />
              </Link>
            ),
          },
        ]
      : []),
    {
      header: 'Status',
      accessorKey: 'Status',
      cell: ({ row }) => (
        <Badge
          variant={
            badgeVariantFromFlowsInstanceStatus[
              row.original.terminated ? 'TERMINATED' : 'IN_PROGRESS'
            ]
          }
        >
          {row.original.terminated ? 'Terminated' : 'ACTIVE'}
        </Badge>
      ),
    },
    {
      header: 'Created At',
      accessorKey: 'Execution start date',
      cell: ({ row }) => (
        <span className="whitespace-nowrap select-all">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },

    {
      header: '',
      id: 'see',
      accessorKey: 'See Instance',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                workflowId: row.original.workflowID,
                instanceId: row.original.id,
              })['FLOWS_INSTANCE_DETAIL'].to
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
      title="Instances"
      description="A list of all instances"
      appIcon={ListCheck}
      {...props}
    >
      <DatatableServerSide
        columns={columns}
        data={instances as unknown as Cursor<NormalizedInstanceModel>}
        id={INSTANCES_LIST}
        initialState={{
          columnPinning: {
            right: ['see'],
          },
        }}
        emptyState={
          !filtersActive ? (
            <AppCardEmpty
              title="No instances found"
              description="Instances are created when workflows are executed"
              {...props}
            >
              <div className="grid gap-2 mt-3">
                <div className="grid gap-2">
                  <CodeSnippet
                    isSingleLine
                    {...FCTL_SNIPPETS({
                      organizationId,
                      stackId,
                      regionId: region,
                    })['FLOWS_INSTANCES_LIST'].snippet}
                  />
                </div>
              </div>
            </AppCardEmpty>
          ) : undefined
        }
      />
    </AppCard>
  );
}
