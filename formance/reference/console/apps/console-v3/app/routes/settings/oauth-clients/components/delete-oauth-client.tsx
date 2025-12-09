import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { Client } from '@platform/sdks/formance/src/models/components';
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

import { useAction } from '@platform/remix';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { ACTIONS_ROUTES } from '../../../../utils/actions';
import { ROUTES } from '../../../../utils/routes';
import { OAUTH_CLIENTS_ACTION_DELETE_CLIENT } from '../constants';

export const deleteOAuthClientSchema = z.object({
  id: z.string(),
});

export type DeleteOAuthClientFormValues = z.infer<
  typeof deleteOAuthClientSchema
>;

export default function DeleteOAuthClient({ client }: { client: Client }) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'delete-oauth-client',
  });

  const navigate = useNavigate();

  const { submit, isSubmitting } = useAction({
    formAction: OAUTH_CLIENTS_ACTION_DELETE_CLIENT,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      OAUTH_CLIENTS_ACTION_DELETE_CLIENT
    ].to,
    onSuccess: () => {
      navigate(
        ROUTES({
          organizationId,
          stackId,
          region,
        })['OAUTH_CLIENTS_ALL'].to
      );
    },
  });

  const onDeleteOAuthClientSubmit = () => {
    const values = form.getValues();
    submit(values);
  };

  const form = useForm<DeleteOAuthClientFormValues>({
    defaultValues: {
      id: client.id,
    },
    resolver: zodResolver(deleteOAuthClientSchema),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon-md">
          <Trash />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px]">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onDeleteOAuthClientSubmit)}
          >
            <DialogHeader className="mb-4">
              <DialogTitle>
                Are you sure you want to delete this OAuth client?
              </DialogTitle>
              <DialogDescription>
                All secrets associated with this OAuth client will be deleted.
              </DialogDescription>
            </DialogHeader>

            <Separator className="mb-4" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Label>ID</Label>
                <Chip
                  {...chipVariantFromType['string']}
                  label={client.id}
                  copyMode="click"
                />
              </div>
              <div className="flex items-center gap-3">
                <Label>Name</Label>
                <Chip
                  {...chipVariantFromType['name']}
                  label={client.name}
                  copyMode="click"
                />
              </div>
              <div className="flex items-center gap-3">
                <Label>Secrets</Label>
                <Chip
                  {...chipVariantFromType['string']}
                  label={client.secrets?.length ?? 0}
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
