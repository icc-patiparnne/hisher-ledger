import { useAction } from '@platform/remix';
import { KeyRound } from 'lucide-react';
import { z } from 'zod';

import {
  Button,
  Chip,
  chipVariantFromType,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Separator,
} from '@platform/ui';

import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { ACTIONS_ROUTES } from '../../../../utils/actions';
import { NormalizedWebhookModel } from '../../../../utils/sdk/webhooks/models';
import { WEBHOOK_ACTION_RENEW_SECRET } from '../constants';

export const renewSecretWebhookSchema = z.object({
  id: z.string(),
});

export type RenewSecretWebhookProps = {
  webhook: NormalizedWebhookModel;
};

export default function RenewSecretWebhook({
  webhook,
}: RenewSecretWebhookProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'renew-secret-webhook',
  });

  const { submit, isSubmitting } = useAction({
    formAction: WEBHOOK_ACTION_RENEW_SECRET,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      WEBHOOK_ACTION_RENEW_SECRET
    ].to,
  });

  const onRenewSecretWebhookSubmit = async () => {
    await submit({
      id: webhook.id,
      formAction: WEBHOOK_ACTION_RENEW_SECRET,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-md" variant="outline">
          <KeyRound />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader className="mb-4">
          <DialogTitle>
            Are you sure you want to renew your webhook secret?
          </DialogTitle>
          <DialogDescription>
            Once renewed, the old one will cease to function.
          </DialogDescription>
        </DialogHeader>

        <Separator className="mb-4" />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Label>Secret</Label>
            <Chip
              {...chipVariantFromType['id']}
              label={webhook.secret}
              copyMode="click"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onRenewSecretWebhookSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Renew
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
