import {
  Client,
  ClientSecret,
} from '@platform/sdks/formance/src/models/components';
import { Chip, chipVariantFromType, ColumnDef, DataTable } from '@platform/ui';
import React, { useMemo } from 'react';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import DeleteOauthSecret from './delete-oauth-secret';

export default function SecretsOAuthClient({ client }: { client: Client }) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'secrets-oauth-client',
  });

  const columns = useMemo<ColumnDef<ClientSecret>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        enableHiding: true,
        cell: ({ row }) => (
          <Chip
            {...chipVariantFromType['id']}
            label={row.original.id}
            copyMode="click"
          />
        ),
      },
      {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => (
          <Chip
            {...chipVariantFromType['name']}
            label={row.original.name}
            copyMode="click"
          />
        ),
      },
      {
        header: 'Last digit',
        accessorKey: 'lastDigits',
        cell: ({ row }) => (
          <Chip
            {...chipVariantFromType['string']}
            label={`****************${row.original.lastDigits}`}
          />
        ),
      },
      {
        enableHiding: false,
        accessorKey: 'Delete secret',
        header: '',
        cell: ({ row }) => (
          <DeleteOauthSecret
            secret={row.original}
            clientId={client.id}
            routeParams={{
              organizationId,
              stackId,
              region,
            }}
          />
        ),
      },
    ],
    [client.id]
  );

  return (
    <DataTable
      data={client?.secrets ?? []}
      columns={columns}
      initialState={{
        columnVisibility: {
          id: false,
        },
      }}
      searchConfig={[
        {
          placeholder: 'Filter by name',
          columnKey: 'name',
        },
      ]}
    />
  );
}
