import { zodResolver } from '@hookform/resolvers/zod';
import { Power } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAction } from '@platform/remix';
import {
  Badge,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  Label,
  Separator,
} from '@platform/ui';
import { badgeVariantFromWebhookStatus } from '../../../../components/badge';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { ACTIONS_ROUTES } from '../../../../utils/actions';
import { NormalizedWebhookModel } from '../../../../utils/sdk/webhooks/models';
import { WEBHOOK_ACTION_SET_STATUS } from '../constants';

export const setStatusWebhookSchema = z.object({
  id: z.string(),
  status: z.union([z.literal('deactivate'), z.literal('activate')]),
});

export type SetStatusWebhookFormValues = z.infer<typeof setStatusWebhookSchema>;

export default function SetStatusWebhook({
  webhook,
}: {
  webhook: NormalizedWebhookModel;
}) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'set-status-webhook',
  });

  const [open, setOpen] = useState(false);

  const { submit, isSubmitting } = useAction({
    formAction: WEBHOOK_ACTION_SET_STATUS,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      WEBHOOK_ACTION_SET_STATUS
    ].to,
    onSuccess: () => {
      setOpen(false);
      form.reset();
    },
  });

  const onSetStatusSubmit = () => {
    const values = form.getValues();
    submit(values);
  };

  const title = webhook.active
    ? 'Are you sure you want to disable your webhook ?'
    : 'Are you sure you want to activate your webhook ?';
  const description = webhook.active
    ? 'Once disabled, it will cease to listen events.'
    : 'Once activated, it will start to listen events.';
  const form = useForm<SetStatusWebhookFormValues>({
    defaultValues: {
      id: webhook.id,
      status: webhook.active ? 'deactivate' : 'activate',
    },
    resolver: zodResolver(setStatusWebhookSchema),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="icon-md" variant="outline">
          <Power />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px]">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSetStatusSubmit)}
          >
            <DialogHeader className="mb-4">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <Separator className="mb-4" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Label>Status</Label>
                <Badge
                  variant={
                    badgeVariantFromWebhookStatus[
                      webhook.active ? 'ACTIVE' : 'DISABLED'
                    ]
                  }
                >
                  {webhook.active ? 'Active' : 'Disabled'}
                </Badge>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {webhook.active ? 'Disable' : 'Activate'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
