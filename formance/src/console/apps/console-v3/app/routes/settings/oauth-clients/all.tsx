import { Eye, KeyRound } from 'lucide-react';
import {
  Link,
  LoaderFunction,
  useLoaderData,
  useOutletContext,
} from 'react-router';

import {
  AppCard,
  AppCardEmpty,
  Button,
  Chip,
  chipVariantFromType,
  CodeSnippet,
  ColumnDef,
  DataTable,
} from '@platform/ui';

import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { withContext, WithContext } from '../../../utils/auth.server';
import { getAuthenticator } from '../../../utils/session.auth.server';

import {
  Client,
  ListClientsResponse,
} from '@platform/sdks/formance/src/models/components';
import {
  FCTL_SNIPPETS,
  MODULES_GATEWAYS,
  MODULES_NAMES,
} from '@platform/utils';

import { chipVariantFromConsoleType } from '../../../components/chip';
import { FEATURES, useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { useMicroStack } from '../../../hooks/useMicroStack';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { CurrentContext } from '../../../root';
import { ROUTES } from '../../../utils/routes';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import {
  getServiceVersionFromContext,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';

type LoaderData = ListClientsResponse | WithContext;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({ request }) => {
  const authenticator = getAuthenticator(request);

  return await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.AUTH
      );

      return wrapLoaderWithProps<LoaderData>(
        await api.auth.listClients(),
        version
      );
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.AUTH],
    FEATURES.auth
  );
};

export default function OAuthClientsAll() {
  useFeatureFlag(FEATURES.auth);

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'oauth-clients-all',
  });

  const context = useOutletContext<CurrentContext>();

  useRouteUpdate({
    moduleName: MODULES_NAMES.AUTH,
    routeId: 'OAUTH_CLIENTS_ALL',
    breadcrumbs: [
      {
        title: 'Auth',
        to: ROUTES({ organizationId, stackId, region })[
          'OAUTH_CLIENTS_OVERVIEW'
        ].to,
      },
      {
        title: 'OAuth Clients',
        to: ROUTES({ organizationId, stackId, region })['OAUTH_CLIENTS_ALL'].to,
      },
    ],
  });

  const clients = useLoaderData<LoaderData>() as unknown as ListClientsResponse;

  const { isMicroStack } = useMicroStack(context);

  const columns: ColumnDef<Client>[] = [
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
              clientId: row.original.id,
            })['OAUTH_CLIENT_DETAIL'].to
          }
        >
          <Chip {...chipVariantFromType['id']} label={row.original.id} />
        </Link>
      ),
    },
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <Chip {...chipVariantFromType['name']} label={row.original.name} />
      ),
    },
    {
      header: 'Type',
      accessorKey: 'public',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromConsoleType[
            row.original.public ? 'public' : 'private'
          ]}
          label={row.original.public ? 'Public' : 'Private'}
        />
      ),
    },
    {
      enableHiding: false,
      accessorKey: 'Actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-2 text-right">
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                clientId: row.original.id,
              })['OAUTH_CLIENT_DETAIL'].to
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
    <AppContentGrid>
      <div className="col-span-12">
        <AppCard
          title="OAuth Clients"
          description="List of all the OAuth clients in the organization"
          appIcon={KeyRound}
        >
          <Link
            to={
              ROUTES({ organizationId, stackId, region })['OAUTH_CLIENT_CREATE']
                .to
            }
          >
            <Button
              className="absolute top-4 right-4"
              variant="primary"
              size="sm"
            >
              Create OAuth Client
            </Button>
          </Link>

          <DataTable
            data={clients.data ?? []}
            columns={columns}
            searchConfig={[
              {
                placeholder: 'Filter by ID',
                columnKey: 'id',
              },
              {
                placeholder: 'Filter by name',
                columnKey: 'name',
              },
            ]}
            emptyState={
              <AppCardEmpty
                title="No OAuth clients found"
                description="Create a new OAuth client to get started"
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
                          })['OAUTH_CLIENTS_CREATE'].snippet}
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
                        Create OAuth Client
                      </Button>
                    </Link>
                  </div>
                </div>
              </AppCardEmpty>
            }
          />
        </AppCard>
      </div>
    </AppContentGrid>
  );
}
