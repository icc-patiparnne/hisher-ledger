import { ListVideo } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import {
  AppCard,
  Chip,
  chipVariantFromType,
  ColumnDef,
  PreviewJson,
} from '@platform/ui';

import { DatatableServerSide } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { formatDate } from '@platform/utils';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { ROUTES } from '../../../utils/routes';
import { NormalizedTriggerOccurrenceModel } from '../../../utils/sdk/flows/models';
import { TRIGGERS_OCCURRENCES_LIST } from '../constants';

type TTriggerOccurrencesListProps = {
  occurrences: Cursor<NormalizedTriggerOccurrenceModel>;
  version?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function OccurrencesList({
  occurrences,
  version,
  ...props
}: TTriggerOccurrencesListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'flows-trigger-occurrences',
  });

  const columns: ColumnDef<NormalizedTriggerOccurrenceModel>[] = [
    {
      header: 'Workflow ID',
      accessorKey: 'Workflow Id',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              instanceId: row.original.workflowInstanceID,
            })['FLOWS_INSTANCE_DETAIL'].to
          }
        >
          <Chip
            {...chipVariantFromType['id']}
            label={row.original.workflowInstanceID || ''}
            maxWidth="sm"
          />
        </Link>
      ),
    },
    {
      header: 'Event',
      accessorKey: 'event',
      cell: ({ row }) => (
        <PreviewJson
          className="w-full"
          json={row.original.event ?? {}}
          defaultUnfoldAll={false}
        />
      ),
    },
    {
      header: 'Fire At',
      accessorKey: 'Fire At',
      cell: ({ row }) => (
        <span className="whitespace-nowrap select-all">
          {formatDate(row.original.date)}
        </span>
      ),
    },
  ];

  return (
    <AppCard
      title="Occurrences"
      description="A list of all occurrence"
      variant="slate"
      appIcon={ListVideo}
      {...props}
    >
      <DatatableServerSide
        columns={columns}
        data={
          occurrences as unknown as Cursor<NormalizedTriggerOccurrenceModel>
        }
        id={TRIGGERS_OCCURRENCES_LIST}
      />
    </AppCard>
  );
}
