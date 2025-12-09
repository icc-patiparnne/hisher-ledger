import {
  Badge,
  Chip,
  chipVariantFromType,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@platform/ui';
import { formatDate } from '@platform/utils';
import React from 'react';
import { badgeVariantFromWebhookStatus } from '../../../../components/badge';
import { chipVariantFromWebhookEventTypes } from '../../../../components/chip';
import { NormalizedWebhookModel } from '../../../../utils/sdk/webhooks/models';

export default function DetailsWebhook({
  webhook,
}: {
  webhook: NormalizedWebhookModel;
}) {
  return (
    <div data-testid="details-oauth-client">
      <DescriptionList>
        <DescriptionTerm>ID</DescriptionTerm>
        <DescriptionDetails>
          <Chip
            {...chipVariantFromType['id']}
            label={webhook.id}
            copyMode="click"
          />
        </DescriptionDetails>

        <DescriptionTerm>Status</DescriptionTerm>
        <DescriptionDetails>
          <Badge
            variant={
              badgeVariantFromWebhookStatus[
                webhook.active ? 'ACTIVE' : 'DISABLED'
              ]
            }
          >
            {webhook.active ? 'Active' : 'Disabled'}
          </Badge>
        </DescriptionDetails>

        <DescriptionTerm>Endpoint</DescriptionTerm>
        <DescriptionDetails>
          <Chip
            {...chipVariantFromType['string']}
            label={webhook.endpoint}
            copyMode="click"
          />
        </DescriptionDetails>

        <DescriptionTerm>Events</DescriptionTerm>
        <DescriptionDetails>
          <div className="grid gap-2">
            {webhook.eventTypes?.map((event: string, index: number) => (
              <Chip
                {...chipVariantFromWebhookEventTypes[event]}
                label={event}
                key={index}
                shouldFormatLabel={false}
                maxWidth="xl"
                copyMode="click"
              />
            ))}
          </div>
        </DescriptionDetails>

        <DescriptionTerm>Updated at</DescriptionTerm>
        <DescriptionDetails>
          <span>{formatDate(new Date(webhook.updatedAt))}</span>
        </DescriptionDetails>

        <DescriptionTerm>Created at</DescriptionTerm>
        <DescriptionDetails>
          <span>{formatDate(new Date(webhook.createdAt))}</span>
        </DescriptionDetails>
      </DescriptionList>
    </div>
  );
}
