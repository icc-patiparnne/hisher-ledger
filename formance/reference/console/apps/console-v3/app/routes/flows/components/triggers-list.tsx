import { Eye, Zap } from 'lucide-react';
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
import { NormalizedTriggerModel } from '../../../utils/sdk/flows/models';
import { TRIGGERS_LIST } from '../constants';

type TTriggersListProps = {
  triggers: Cursor<NormalizedTriggerModel>;
  version: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function TriggersList({
  triggers,
  version,
  ...props
}: TTriggersListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'flows-triggers',
  });

  const [searchParams] = useSearchParams();

  // Check if any table filters are currently active
  const filtersActive = hasActiveTableFilters(searchParams, TRIGGERS_LIST);

  const columns: ColumnDef<NormalizedTriggerModel>[] = [
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
              triggerId: row.original.id,
            })['FLOWS_TRIGGER_DETAIL'].to
          }
        >
          <Chip {...chipVariantFromType['id']} label={row.original.id} />
        </Link>
      ),
    },

    {
      header: 'Event',
      accessorKey: 'Event',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['string']}
          label={row.original.event}
          maxWidth="sm"
        />
      ),
    },
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <>
          {row.original.name ? (
            <Chip
              {...chipVariantFromType['name']}
              label={row.original.name}
              maxWidth="sm"
            />
          ) : (
            <span>-</span>
          )}
        </>
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
      id: 'see',
      header: '',
      accessorKey: 'See Trigger',
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
                triggerId: row.original.id,
              })['FLOWS_TRIGGER_DETAIL'].to
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
      title="Triggers"
      description="A list of all triggers"
      appIcon={Zap}
      {...props}
    >
      <DatatableServerSide
        columns={columns}
        data={triggers as unknown as Cursor<NormalizedTriggerModel>}
        id={TRIGGERS_LIST}
        initialState={{
          columnPinning: {
            right: ['see'],
          },
        }}
        emptyState={
          !filtersActive ? (
            <AppCardEmpty
              title="No triggers found"
              description="Create a new trigger to get started"
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
                    })['FLOWS_TRIGGER_CREATE'].snippet}
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
