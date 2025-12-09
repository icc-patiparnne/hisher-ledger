import { Eye, ShieldCheck } from 'lucide-react';
import React from 'react';
import {
  Link,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from 'react-router';

import {
  AppCard,
  AppCardEmpty,
  Button,
  Chip,
  chipVariantFromType,
  CodeSnippet,
  ColumnDef,
  DataTableExportData,
  DataTableFilterList,
} from '@platform/ui';

import {
  DatatableServerSide,
  useAction,
  useDataTableQuery,
} from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { FCTL_SNIPPETS, formatDate } from '@platform/utils';
import { chipVariantFromConsoleType } from '../../../components/chip';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { ACTIONS_ROUTES } from '../../../utils/actions';
import { hasActiveTableFilters } from '../../../utils/filters';
import { ROUTES } from '../../../utils/routes';

import { useMicroStack } from '../../../hooks/useMicroStack';
import { CurrentContext } from '../../../root';
import { NormalizedPolicyModel } from '../../../utils/sdk/reconciliation/models';
import { POLICIES_LIST, RECONCILIATION_ACTION_RUN } from '../constants';
import { getReconciliationPoliciesFiltersConfig } from '../filters/reconciliation-policies-filters';
import ReconciliationPolicyActions from './policy-actions';

type TPoliciesListProps = {
  policies: Cursor<NormalizedPolicyModel>;
  version: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PoliciesList({
  policies,
  version,
  children,
  ...props
}: TPoliciesListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'reconciliation-policies',
  });

  const context = useOutletContext<CurrentContext>();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { handleQueryChange, handleResetFilters } =
    useDataTableQuery(POLICIES_LIST);

  const filtersActive = hasActiveTableFilters(searchParams, POLICIES_LIST);

  const { submit, isSubmitting } = useAction({
    formAction: RECONCILIATION_ACTION_RUN,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      RECONCILIATION_ACTION_RUN
    ].to,
    onSuccess: (data) => {
      navigate(
        ROUTES({
          organizationId,
          stackId,
          region,
          reportId: data.data.id,
          policyId: data.data.policyID,
        })['RECONCILIATION_REPORT_DETAIL'].to
      );
    },
  });

  const { isMicroStack } = useMicroStack(context);

  const columns: ColumnDef<NormalizedPolicyModel>[] = [
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
              policyId: row.original.id,
            })['RECONCILIATION_POLICY_DETAIL'].to
          }
        >
          <Chip {...chipVariantFromType['id']} label={row.original.id} />
        </Link>
      ),
    },

    {
      header: 'Ledger',
      accessorKey: 'ledgerName',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              ledgerName: row.original.ledgerName,
            })['LEDGER_DETAIL'].to
          }
        >
          <Chip
            {...chipVariantFromConsoleType['ledger']}
            label={row.original.ledgerName}
          />
        </Link>
      ),
    },

    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              policyId: row.original.id,
            })['RECONCILIATION_POLICY_DETAIL'].to
          }
        >
          <Chip {...chipVariantFromType['name']} label={row.original.name} />
        </Link>
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
      header: '',
      id: 'see-and-actions',
      accessorKey: 'See Policy',
      enablePinning: true,
      enableHiding: false,
      size: 10,
      cell: ({ row }) => (
        <div className="flex justify-center items-center gap-2">
          <ReconciliationPolicyActions
            policy={row.original}
            submit={submit}
            isSubmitting={isSubmitting}
          />
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                policyId: row.original.id,
              })['RECONCILIATION_POLICY_DETAIL'].to
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
      title="Policies"
      description="A list of all policies"
      appIcon={ShieldCheck}
      {...props}
    >
      {children}

      <DatatableServerSide
        columns={columns}
        data={policies}
        id={POLICIES_LIST}
        initialState={{
          columnPinning: {
            right: ['see-and-actions'],
          },
        }}
        toolbarLeft={
          <>
            <DataTableFilterList
              getFilterConfig={() =>
                getReconciliationPoliciesFiltersConfig({
                  moduleVersion: version,
                })
              }
              tableId={POLICIES_LIST}
              onQueryChange={handleQueryChange}
              onResetFilters={handleResetFilters}
            />
          </>
        }
        toolbarRight={<DataTableExportData cursorData={policies} />}
        emptyState={
          !filtersActive ? (
            <AppCardEmpty
              title="No policies found"
              description="Create a new policy to get started"
              {...props}
            >
              <div className="grid gap-2">
                {!isMicroStack && (
                  <>
                    <CodeSnippet
                      isSingleLine
                      {...FCTL_SNIPPETS({
                        organizationId,
                        stackId,
                        regionId: region,
                      })['RECONCILIATION_POLICY_CREATE'].snippet}
                    />
                    <p className="text-center text-muted-foreground">OR</p>
                  </>
                )}
                <Link
                  to={
                    ROUTES({ organizationId, stackId, region })[
                      'OAUTH_CLIENT_CREATE'
                    ].to
                  }
                >
                  <Button variant="primary" size="sm">
                    Create Policy
                  </Button>
                </Link>
              </div>
            </AppCardEmpty>
          ) : undefined
        }
      />
    </AppCard>
  );
}
