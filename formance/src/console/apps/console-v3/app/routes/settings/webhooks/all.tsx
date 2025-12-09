import { Eye, Webhook } from 'lucide-react';
import {
  Link,
  LoaderFunction,
  useLoaderData,
  useOutletContext,
} from 'react-router';

import {
  AppCard,
  AppCardEmpty,
  Badge,
  Button,
  Chip,
  chipVariantFromType,
  CodeSnippet,
  ColumnDef,
  DataTable,
} from '@platform/ui';
import { FCTL_SNIPPETS, MODULES_NAMES } from '@platform/utils';

import { ActionDataError, ActionType } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { badgeVariantFromWebhookStatus } from '../../../components/badge';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { withContext, WithContext } from '../../../utils/auth.server';
import { ROUTES } from '../../../utils/routes';

import { useMicroStack } from '../../../hooks/useMicroStack';
import { CurrentContext } from '../../../root';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { NormalizedWebhookModel } from '../../../utils/sdk/webhooks/models';
import { NormalizedCreateWebhookResponse } from '../../../utils/sdk/webhooks/responses';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { WEBHOOK_ACTION_CREATE_WEBHOOK } from './constants';

type LoaderData = {
  webhooks: {
    cursor: Cursor<NormalizedWebhookModel>;
  };
  eventTypes: string[];
};

export type ActionDataType =
  | ActionType<
      typeof WEBHOOK_ACTION_CREATE_WEBHOOK,
      NormalizedCreateWebhookResponse
    >
  | ActionDataError
  | WithContext;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({ request }) => {
  const authenticator = getAuthenticator(request);

  return await withContext<LoaderData>(
    async (api: NormalizedSDK) => {
      const webhooks = await api.webhooks.listWebhooks();
      const eventTypes = await api.webhooks.listEventTypes();

      return {
        webhooks,
        eventTypes,
      };
    },
    authenticator,
    request
  );
};

export default function WebhooksAll() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'webhooks-all',
  });

  const context = useOutletContext<CurrentContext>();

  useRouteUpdate({
    moduleName: MODULES_NAMES.WEBHOOKS,
    routeId: 'WEBHOOKS_ALL',
    breadcrumbs: [
      {
        title: 'Settings',
        to: ROUTES({ organizationId, stackId, region })['GLOBAL_OVERVIEW'].to,
      },
      {
        title: 'Webhooks',
        to: ROUTES({ organizationId, stackId, region })['WEBHOOKS_ALL'].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>() as unknown as LoaderData;

  const { isMicroStack } = useMicroStack(context);

  const columns: ColumnDef<NormalizedWebhookModel>[] = [
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
              webhookId: row.original.id,
            })['WEBHOOK_DETAIL'].to
          }
        >
          <Chip {...chipVariantFromType['id']} label={row.original.id} />
        </Link>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'active',
      cell: ({ row }) => (
        <Badge
          variant={
            badgeVariantFromWebhookStatus[
              row.original.active ? 'ACTIVE' : 'DISABLED'
            ]
          }
        >
          {row.original.active ? 'Active' : 'Disabled'}
        </Badge>
      ),
    },
    {
      header: 'Endpoint',
      accessorKey: 'endpoint',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['string']}
          label={row.original.endpoint}
          copyMode="click"
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
                webhookId: row.original.id,
              })['WEBHOOK_DETAIL'].to
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
          title="Webhooks"
          description="List of all the webhooks in the stack"
          appIcon={Webhook}
        >
          <Link
            to={
              ROUTES({ organizationId, stackId, region })['WEBHOOK_CREATE'].to
            }
          >
            <Button
              className="absolute top-4 right-4"
              variant="primary"
              size="sm"
            >
              Create Webhook
            </Button>
          </Link>

          <DataTable
            data={data.webhooks.cursor.data ?? []}
            columns={columns}
            searchConfig={[
              {
                placeholder: 'Filter by ID',
                columnKey: 'id',
              },
              {
                placeholder: 'Filter by endpoint',
                columnKey: 'endpoint',
              },
            ]}
            emptyState={
              <AppCardEmpty
                title="No webhooks found"
                description="Create a new webhook to receive real-time notifications"
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
                          })['WEBHOOKS_CREATE'].snippet}
                        />
                        <p className="text-center text-muted-foreground">OR</p>
                      </>
                    )}
                    <Link
                      to={
                        ROUTES({ organizationId, stackId, region })[
                          'WEBHOOK_CREATE'
                        ].to
                      }
                    >
                      <Button variant="primary" size="sm">
                        Create Webhook
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
