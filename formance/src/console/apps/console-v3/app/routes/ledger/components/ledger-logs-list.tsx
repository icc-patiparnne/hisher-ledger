import { Eye, Logs } from 'lucide-react';
import React from 'react';
import { useSearchParams } from 'react-router';

import { DatatableServerSide, useDataTableQuery } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import {
  AppCard,
  AppCardEmpty,
  Button,
  Chip,
  chipVariantFromType,
  ColumnDef,
  DataTableFilterList,
  PreviewJson,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@platform/ui';
import { formatDate } from '@platform/utils';
import { chipVariantFromLogType } from '../../../components/chip';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useSavedFilters } from '../../../hooks/useSavedFilters';
import { hasActiveTableFilters } from '../../../utils/filters';
import { NormalizedLogModel } from '../../../utils/sdk/ledger/models';
import { LEDGER_LOGS_LIST } from '../constants';
import { getLedgerLogsFiltersConfig } from '../filters/ledger-logs-filters';

type TLedgerLogsListProps = {
  ledgerLogs: Cursor<NormalizedLogModel>;
  version: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function LedgerLogsList({
  ledgerLogs,
  version,
  ...props
}: TLedgerLogsListProps) {
  useRouteGuard({
    componentName: 'ledger-logs',
    requiredParams: ['ledgerName'],
  });

  const [searchParams] = useSearchParams();

  // Check if any table filters are currently active
  const filtersActive = hasActiveTableFilters(searchParams, LEDGER_LOGS_LIST);

  // V2 query hooks for filter management
  const { handleQueryChange, handleResetFilters } =
    useDataTableQuery(LEDGER_LOGS_LIST);

  const saveFiltersHook = useSavedFilters();

  const columns: ColumnDef<NormalizedLogModel>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
      cell: ({ row }) => (
        <>
          {row.original.id ? (
            <Chip
              {...chipVariantFromType['id']}
              label={row.original.id.toString()}
              copyMode="click"
            />
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromLogType[row.original.type]}
          label={row.original.type}
          copyMode="click"
        />
      ),
    },
    {
      header: 'Hash',
      accessorKey: 'hash',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['string']}
          label={row.original.hash}
          copyMode="click"
        />
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
    {
      enableHiding: false,
      accessorKey: 'Inspect Data',
      cell: ({ row }) => (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="zinc" size="icon-md">
              <Eye />
            </Button>
          </SheetTrigger>
          <SheetContent className="lg:w-[700px] sm:max-w-none flex flex-col">
            <SheetHeader>
              <SheetTitle>Inspect data</SheetTitle>
              <SheetDescription>
                Ledger log information as JSON
              </SheetDescription>
            </SheetHeader>

            <Separator className="mb-4" />

            <div className="flex flex-col h-full px-4">
              <div className="overflow-y-scroll no-scrollbar flex-1">
                <PreviewJson json={row.original} className="pb-24" />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ),
    },
  ];

  return (
    <AppCard
      title="Logs"
      description="List of the last logs that have been applied to the ledger."
      appIcon={Logs}
      className="col-span-12"
      {...props}
    >
      <DatatableServerSide
        columns={columns}
        data={ledgerLogs}
        id={LEDGER_LOGS_LIST}
        toolbarLeft={
          <DataTableFilterList
            getFilterConfig={() =>
              getLedgerLogsFiltersConfig({ moduleVersion: version })
            }
            tableId={LEDGER_LOGS_LIST}
            onQueryChange={handleQueryChange}
            onResetFilters={handleResetFilters}
            saveFiltersHook={saveFiltersHook}
          />
        }
        emptyState={
          !filtersActive ? (
            <AppCardEmpty
              title="No logs found"
              description="Logs will appear here when transactions and operations are performed on this ledger"
              className="col-span-12"
              {...props}
            />
          ) : undefined
        }
      />
    </AppCard>
  );
}
