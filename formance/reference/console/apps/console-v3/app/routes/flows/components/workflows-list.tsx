import { Eye, Workflow } from 'lucide-react';
import React from 'react';
import { Link, useSearchParams } from 'react-router';

import {
  AppCard,
  AppCardEmpty,
  Button,
  Chip,
  chipVariantFromType,
  CodeSnippet,
  ColumnDef,
} from '@platform/ui';

import { DatatableServerSide } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { FCTL_SNIPPETS, formatDate } from '@platform/utils';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { hasActiveTableFilters } from '../../../utils/filters';
import { ROUTES } from '../../../utils/routes';
import { NormalizedWorkflowModel } from '../../../utils/sdk/flows/models';
import { WORKFLOWS_LIST } from '../constants';

type TWorkflowsListProps = {
  workflows: Cursor<NormalizedWorkflowModel>;
  version: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function WorkflowsList({
  workflows,
  version,
  ...props
}: TWorkflowsListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'workflows-list',
  });

  const [searchParams] = useSearchParams();

  // Check if any table filters are currently active
  const filtersActive = hasActiveTableFilters(searchParams, WORKFLOWS_LIST);

  const columns: ColumnDef<NormalizedWorkflowModel>[] = [
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
              workflowId: row.original.id,
            })['FLOWS_WORKFLOW_DETAIL'].to
          }
        >
          <Chip {...chipVariantFromType['id']} label={row.original.id} />
        </Link>
      ),
    },
    {
      header: 'Name',
      accessorKey: 'config.name',
      cell: ({ row }) => (
        <>
          {row.original.config.name ? (
            <Chip
              {...chipVariantFromType['name']}
              label={row.original.config.name}
            />
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
    {
      header: 'Stages',
      accessorKey: 'config.stages',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType[
            row.original.config.stages.length > 1 ? 'numberPositive' : 'number'
          ]}
          label={row.original.config.stages.length}
        />
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
      header: 'Updated At',
      accessorKey: 'Updated At',
      cell: ({ row }) => (
        <span className="whitespace-nowrap select-all">
          {formatDate(row.original.updatedAt)}
        </span>
      ),
    },

    {
      header: '',
      id: 'see',
      accessorKey: 'See Workflow',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                workflowId: row.original.id,
              })['FLOWS_WORKFLOW_DETAIL'].to
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
      title="Workflows"
      description="A list of all workflows"
      appIcon={Workflow}
      {...props}
    >
      <DatatableServerSide
        columns={columns}
        data={workflows}
        id={WORKFLOWS_LIST}
        initialState={{
          columnPinning: {
            right: ['see'],
          },
        }}
        emptyState={
          !filtersActive ? (
            <AppCardEmpty
              title="No workflows found"
              description="Create a new workflow to get started"
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
                    })['FLOWS_WORKFLOW_CREATE'].snippet}
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
