import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { useAction } from '@platform/remix';
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
  Form,
  Label,
  Separator,
} from '@platform/ui';

import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { ACTIONS_ROUTES } from '../../../../utils/actions';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedWebhookModel } from '../../../../utils/sdk/webhooks/models';
import { WEBHOOK_ACTION_DELETE } from '../constants';

export const deleteWebhookSchema = z.object({
  id: z.string(),
});

export type DeleteWebhookFormValues = z.infer<typeof deleteWebhookSchema>;

export default function DeleteWebhook({
  webhook,
}: {
  webhook: NormalizedWebhookModel;
}) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'delete-webhook',
  });

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { submit, isSubmitting } = useAction({
    formAction: WEBHOOK_ACTION_DELETE,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      WEBHOOK_ACTION_DELETE
    ].to,
    onSuccess: () => {
      setOpen(false);
      form.reset();
      navigate(ROUTES({ organizationId, stackId, region })['WEBHOOKS_ALL'].to);
    },
  });

  const onDeleteWebhookSubmit = () => {
    const values = form.getValues();
    submit(values);
  };

  const form = useForm<DeleteWebhookFormValues>({
    defaultValues: {
      id: webhook.id,
    },
    resolver: zodResolver(deleteWebhookSchema),
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
        <Button variant="destructive" size="icon-md">
          <Trash />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px]">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onDeleteWebhookSubmit)}
          >
            <DialogHeader className="mb-4">
              <DialogTitle>
                Are you sure you want to delete this webhook?
              </DialogTitle>
              <DialogDescription>
                All events associated with this webhook wont work anymore.
              </DialogDescription>
            </DialogHeader>

            <Separator className="mb-4" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Label>ID</Label>
                <Chip
                  {...chipVariantFromType['string']}
                  label={webhook.id}
                  copyMode="click"
                />
              </div>
              <div className="flex items-center gap-3">
                <Label>Endpoint</Label>
                <Chip
                  {...chipVariantFromType['string']}
                  label={webhook.endpoint}
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
                variant="destructive"
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Delete
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
