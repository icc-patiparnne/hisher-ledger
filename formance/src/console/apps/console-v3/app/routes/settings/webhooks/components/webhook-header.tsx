import { KeyRound } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import {
  Button,
  Card,
  CardContent,
  CardTitle,
  Chip,
  chipVariantFromType,
} from '@platform/ui';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedWebhookModel } from '../../../../utils/sdk/webhooks/models';
import DeleteWebhook from './delete-webhook';
import RenewSecretWebhook from './renew-secret-webhook';
import SetStatusWebhook from './set-status-webhook';

type TOWebhookHeaderProps = {
  webhook?: NormalizedWebhookModel;
};

export default function WebhookHeader({ webhook }: TOWebhookHeaderProps) {
  const { organizationId, stackId, region, webhookId } = useRouteGuard({
    componentName: 'webhook-header',
    requiredParams: ['webhookId'],
  });

  return (
    <Card data-header="webhook">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="cobalt" size="icon-md" notClickable>
                <KeyRound />
              </Button>
              <CardTitle>Webhook</CardTitle>
            </div>
            <div className="min-w-0 flex-1">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Link
                  to={
                    ROUTES({
                      organizationId,
                      stackId,
                      region,
                      webhookId,
                    })['WEBHOOK_DETAIL'].to
                  }
                >
                  <Chip
                    {...chipVariantFromType['string']}
                    label={webhook?.endpoint || 'default'}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 flex justify-between items-center gap-2">
            {webhook && <SetStatusWebhook webhook={webhook} />}
            {webhook && <RenewSecretWebhook webhook={webhook} />}
            {webhook && <DeleteWebhook webhook={webhook} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
