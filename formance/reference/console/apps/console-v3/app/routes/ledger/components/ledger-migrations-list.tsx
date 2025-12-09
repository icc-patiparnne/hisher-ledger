import { Database } from 'lucide-react';
import React from 'react';

import {
  AppCard,
  Badge,
  Chip,
  chipVariantFromType,
  ColumnDef,
  DataTable,
} from '@platform/ui';

import { formatDate, padNumber } from '@platform/utils';

import { badgeVariantFromMigrationState } from '../../../components/badge';
import { chipVariantFromConsoleType } from '../../../components/chip';
import {
  NormalizedLedgerInfoModel,
  NormalizedMigrationInfoModel,
} from '../../../utils/sdk/ledger/models';

type TStorageMigrationsListProps = {
  ledgerInfo: NormalizedLedgerInfoModel;
} & React.HTMLAttributes<HTMLDivElement>;

export default function LedgerMigrationsList({
  ledgerInfo,
}: TStorageMigrationsListProps) {
  const columns: ColumnDef<NormalizedMigrationInfoModel>[] = [
    {
      header: 'Version',
      accessorKey: 'version',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromConsoleType['version']}
          label={padNumber(row.original.version?.toString() ?? '')}
          copyMode="click"
          copyValue={row.original.version?.toString()}
        />
      ),
    },

    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['name']}
          label={
            row.original.name?.replace(/^\d+-|-|\.sql$/g, ' ').trim() ?? ''
          }
        />
      ),
    },
    {
      header: 'State',
      accessorKey: 'state',
      cell: ({ row }) => (
        <Badge
          variant={badgeVariantFromMigrationState[row.original.state ?? '']}
        >
          {row.original.state ?? ''}
        </Badge>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row }) => (
        <span className="whitespace-nowrap select-all">
          {row.original.date ? formatDate(row.original.date) : '-'}
        </span>
      ),
    },
  ];

  return (
    <AppCard
      className="col-span-12"
      title="Storage Migrations"
      description="List of migrations that have been applied to the ledger."
      variant="cobaltDark"
      appIcon={Database}
    >
      <DataTable
        columns={columns}
        data={ledgerInfo?.storage?.migrations ?? []}
        searchConfig={[
          {
            placeholder: 'Filter by name',
            columnKey: 'name',
          },
        ]}
        initialState={{
          sorting: [{ id: 'date', desc: true }],
        }}
      />
    </AppCard>
  );
}
