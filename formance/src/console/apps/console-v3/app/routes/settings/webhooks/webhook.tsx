import { AppCard } from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';
import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';
import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { withContext } from '../../../utils/auth.server';
import { ROUTES } from '../../../utils/routes';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { NormalizedWebhookModel } from '../../../utils/sdk/webhooks/models';
import { getAuthenticator } from '../../../utils/session.auth.server';
import DetailsWebhook from './components/details-webhook';
import WebhookHeader from './components/webhook-header';

type LoaderData = { data: NormalizedWebhookModel };

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.webhookId, 'params.webhookId is required');
  const webhookId = params.webhookId;
  const authenticator = getAuthenticator(request);

  return await withContext<LoaderData>(
    async (api: NormalizedSDK) =>
      await api.webhooks.getWebhook({ id: webhookId }),
    authenticator,
    request
  );
};

export default function WebhookDetail() {
  const { organizationId, stackId, region, webhookId } = useRouteGuard({
    componentName: 'webhook',
    requiredParams: ['webhookId'],
  });

  const webhook = useLoaderData<LoaderData>() as unknown as LoaderData;

  useRouteUpdate({
    moduleName: MODULES_NAMES.WEBHOOKS,
    routeId: 'WEBHOOK_DETAIL',
    breadcrumbs: [
      {
        title: 'Settings',
        to: ROUTES({ organizationId, stackId, region })['GLOBAL_OVERVIEW'].to,
      },
      {
        title: 'Webhooks',
        to: ROUTES({ organizationId, stackId, region })['WEBHOOKS_ALL'].to,
      },
      {
        title: webhook?.data?.endpoint || webhookId,
      },
    ],
  });

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <WebhookHeader webhook={webhook?.data} />
      </div>

      <div className="col-span-12">
        <AppCard title="Information">
          {webhook?.data && <DetailsWebhook webhook={webhook.data} />}
        </AppCard>
      </div>
    </AppContentGrid>
  );
}
