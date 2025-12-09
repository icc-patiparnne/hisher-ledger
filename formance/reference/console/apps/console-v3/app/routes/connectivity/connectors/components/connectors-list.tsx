import { Cable, Eye, PlugZap } from 'lucide-react';
import React from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router';

import { Connector } from '@platform/sdks/formance/src/models/components';
import {
  AppCard,
  AppCardEmpty,
  Badge,
  Button,
  Chip,
  chipVariantFromType,
  CodeSnippet,
  ColumnDef,
  ConnectorIcon,
  DataTable,
  DataTableExportData,
  DataTableFilterList,
  Row,
} from '@platform/ui';

import { DatatableServerSide, useDataTableQuery } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { FCTL_SNIPPETS } from '@platform/utils';
import { useMicroStack } from '../../../../hooks/useMicroStack';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useSavedFilters } from '../../../../hooks/useSavedFilters';
import { CurrentContext } from '../../../../root';
import { TRouteParamsWithSearchParams } from '../../../../types/routes';
import { hasActiveTableFilters } from '../../../../utils/filters';
import { ROUTES } from '../../../../utils/routes';
import { getConnectorsOptions } from '../../../../utils/sdk/payments/constants';
import {
  NormalizedConnectorConfigsModel,
  NormalizedConnectorListModel,
} from '../../../../utils/sdk/payments/models';
import { CONNECTIVITY_CONNECTORS_LIST } from '../../constants';
import { getConnectivityConnectorsFiltersConfig } from '../../filters/connectivity-connectors-filters';

type ConnectorsListProps = {
  connectors: Cursor<NormalizedConnectorListModel>;
  connectorsConfig: NormalizedConnectorConfigsModel;
  serverSide?: boolean;
  version?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function ConnectorsList({
  connectors,
  children,
  serverSide,
  connectorsConfig,
  version,
  ...props
}: ConnectorsListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'connectors-all',
  });

  const [searchParams] = useSearchParams();
  const isV3 = version === '3';

  const { handleQueryChange, handleResetFilters } = useDataTableQuery(
    CONNECTIVITY_CONNECTORS_LIST
  );

  const saveFiltersHook = useSavedFilters();
  const filtersActive = hasActiveTableFilters(
    searchParams,
    CONNECTIVITY_CONNECTORS_LIST
  );

  const context = useOutletContext<CurrentContext>();
  const { isMicroStack } = useMicroStack(context);

  const columns: ColumnDef<NormalizedConnectorListModel>[] = [
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
              connectorId: row.original.id ?? row.original.connectorID,
              provider: row.original.provider,
            })['CONNECTIVITY_CONNECTOR_INSTALLED_DETAIL'].to
          }
        >
          <Chip
            {...chipVariantFromType['id']}
            label={row.original.id ?? row.original.connectorID ?? ''}
            maxWidth="md"
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
              connectorId: row.original.id ?? row.original.connectorID,
              provider: row.original.provider,
            })['CONNECTIVITY_CONNECTOR_INSTALLED_DETAIL'].to
          }
        >
          <Chip {...chipVariantFromType['name']} label={row.original.name} />
        </Link>
      ),
    },

    {
      header: 'Provider',
      accessorKey: 'provider',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <ConnectorIcon name={row.original.provider as unknown as Connector} />
          <span
            className="font-medium capitalize"
            data-provider={row.original.provider}
          >
            {row.original.provider?.toLowerCase()}
          </span>
        </div>
      ),
    },

    {
      header: 'Status',
      accessorKey: 'enabled',
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.enabled
              ? row.original.enabled
                ? 'valid'
                : 'destructive'
              : 'valid'
          }
        >
          {row.original.enabled
            ? row.original.enabled
              ? 'Enabled'
              : 'Disabled'
            : 'Enabled'}
        </Badge>
      ),
    },

    ...(isV3
      ? [
          {
            header: 'Scheduled for deletion',
            accessorKey: 'scheduledForDeletion',
            cell: ({ row }: { row: Row<NormalizedConnectorListModel> }) => (
              <Badge
                variant={row.original.scheduledForDeletion ? 'valid' : 'zinc'}
              >
                {row.original.scheduledForDeletion ? 'Yes' : 'No'}
              </Badge>
            ),
          },
        ]
      : []),

    {
      header: '',
      id: 'see',
      accessorKey: 'See Connector',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                connectorId: row.original.connectorID || row.original.id,
                provider: row.original.provider,
              })['CONNECTIVITY_CONNECTOR_INSTALLED_DETAIL'].to
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
    <>
      <AppCard
        title="Connectors"
        description="List of all the Connectors."
        appIcon={Cable}
        {...props}
      >
        {children}

        {serverSide ? (
          <DatatableServerSide
            columns={columns}
            data={connectors}
            id={CONNECTIVITY_CONNECTORS_LIST}
            initialState={{
              columnPinning: {
                right: ['see'],
              },
            }}
            toolbarLeft={
              <>
                <DataTableFilterList
                  getFilterConfig={getConnectivityConnectorsFiltersConfig}
                  tableId={CONNECTIVITY_CONNECTORS_LIST}
                  onQueryChange={handleQueryChange}
                  onResetFilters={handleResetFilters}
                  saveFiltersHook={saveFiltersHook}
                />
              </>
            }
            toolbarRight={<DataTableExportData cursorData={connectors} />}
            emptyState={
              !filtersActive ? (
                <EmptyState
                  organizationId={organizationId}
                  stackId={stackId}
                  region={region}
                  isMicroStack={isMicroStack}
                />
              ) : undefined
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={connectors.data as NormalizedConnectorListModel[]}
            searchConfig={[
              {
                placeholder: 'Filter by Name',
                columnKey: 'name',
                size: 'md',
              },
            ]}
            filtersConfig={[
              {
                title: 'Provider',
                column: 'provider',
                options: getConnectorsOptions(connectorsConfig),
              },
            ]}
            emptyState={
              <EmptyState
                organizationId={organizationId}
                stackId={stackId}
                region={region}
                isMicroStack={isMicroStack}
              />
            }
          />
        )}
      </AppCard>
    </>
  );
}

function EmptyState({
  organizationId,
  stackId,
  region,
  isMicroStack,
  ...props
}: Partial<TRouteParamsWithSearchParams> & { isMicroStack: boolean }) {
  return (
    <AppCardEmpty
      title="No connectors installed"
      description="Install a connector to start managing payments and accounts"
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
                })['CONNECTOR_INSTALL'].snippet}
              />
              <p className="text-center text-muted-foreground">OR</p>
            </>
          )}
          <Link
            to={
              ROUTES({ organizationId, stackId, region })[
                'CONNECTIVITY_CONNECTORS_ALL'
              ].to
            }
          >
            <Button variant="primary" size="md">
              <PlugZap className="w-4 h-4 mr-2" />
              Install Connector
            </Button>
          </Link>
        </div>
      </div>
    </AppCardEmpty>
  );
}
