import { Eye, FileBarChart } from 'lucide-react';
import React from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router';

import {
  AppCard,
  AppCardEmpty,
  Badge,
  Button,
  Chip,
  chipVariantFromType,
  CodeSnippet,
  ColumnDef,
  DataTableExportData,
  DataTableFilterList,
} from '@platform/ui';

import { DatatableServerSide, useDataTableQuery } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { FCTL_SNIPPETS, formatDate } from '@platform/utils';
import { badgeVariantFromReportStatus } from '../../../components/badge';
import { chipVariantFromConsoleType } from '../../../components/chip';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useSavedFilters } from '../../../hooks/useSavedFilters';
import { hasActiveTableFilters } from '../../../utils/filters';
import { ROUTES } from '../../../utils/routes';

import { useMicroStack } from '../../../hooks/useMicroStack';
import { CurrentContext } from '../../../root';
import { NormalizedReconciliationModel } from '../../../utils/sdk/reconciliation/models';
import { REPORTS_LIST } from '../constants';
import { getReconciliationReportsFiltersConfig } from '../filters/reconciliation-reports-filters';

type TReportsListProps = {
  reports: Cursor<NormalizedReconciliationModel>;
  version: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function ReportsList({
  reports,
  version,
  ...props
}: TReportsListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'reconciliation-reports',
  });

  const context = useOutletContext<CurrentContext>();

  const [searchParams] = useSearchParams();

  const { handleQueryChange, handleResetFilters } =
    useDataTableQuery(REPORTS_LIST);

  const saveFiltersHook = useSavedFilters();
  const filtersActive = hasActiveTableFilters(searchParams, REPORTS_LIST);

  const { isMicroStack } = useMicroStack(context);

  const columns: ColumnDef<NormalizedReconciliationModel>[] = [
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
              policyId: row.original.policyID,
              reportId: row.original.id,
            })['RECONCILIATION_REPORT_DETAIL'].to
          }
        >
          <Chip {...chipVariantFromType['id']} label={row.original.id} />
        </Link>
      ),
    },

    {
      header: 'Policy ID',
      accessorKey: 'policyId',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              policyId: row.original.policyID,
            })['RECONCILIATION_POLICY_DETAIL'].to
          }
        >
          <Chip
            {...chipVariantFromConsoleType['policy']}
            label={row.original.policyID}
          />
        </Link>
      ),
    },

    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge
          variant={badgeVariantFromReportStatus[row.original.status]}
          size="md"
        >
          {row.original.status}
        </Badge>
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
      id: 'see',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                policyId: row.original.policyID,
                reportId: row.original.id,
              })['RECONCILIATION_REPORT_DETAIL'].to
            }
          >
            <Button variant="zinc" size="icon-sm">
              <Eye />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <AppCard
      title="Reports"
      description="A list of all reports"
      appIcon={FileBarChart}
      {...props}
    >
      <DatatableServerSide
        columns={columns}
        data={reports}
        id={REPORTS_LIST}
        initialState={{
          columnPinning: {
            right: ['see'],
          },
        }}
        toolbarLeft={
          <>
            <DataTableFilterList
              getFilterConfig={() =>
                getReconciliationReportsFiltersConfig({
                  moduleVersion: version,
                })
              }
              tableId={REPORTS_LIST}
              onQueryChange={handleQueryChange}
              onResetFilters={handleResetFilters}
              saveFiltersHook={saveFiltersHook}
            />
          </>
        }
        toolbarRight={<DataTableExportData cursorData={reports} />}
        emptyState={
          !filtersActive ? (
            <AppCardEmpty
              title="No reports found"
              description={`Run a reconciliation from the list of policies - actions menu - or use the following fctl command:`}
              {...props}
            >
              <div className="grid gap-2 mt-3">
                <div className="grid gap-2">
                  {!isMicroStack && (
                    <>
                      <CodeSnippet
                        isSingleLine
                        {...FCTL_SNIPPETS({
                          organizationId,
                          stackId,
                          regionId: region,
                        })['RECONCILIATION_POLICY_RECONCILE'].snippet}
                      />
                      <p className="text-center text-muted-foreground">OR</p>
                    </>
                  )}
                  <Link
                    to={
                      ROUTES({ organizationId, stackId, region })[
                        'RECONCILIATION_POLICIES_LIST'
                      ].to
                    }
                  >
                    <Button variant="primary" size="md">
                      See Policies
                    </Button>
                  </Link>
                </div>
              </div>
            </AppCardEmpty>
          ) : undefined
        }
      />
    </AppCard>
  );
}
