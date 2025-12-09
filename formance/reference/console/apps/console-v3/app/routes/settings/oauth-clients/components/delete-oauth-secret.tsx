import { Trash } from 'lucide-react';
import React from 'react';
import { Form, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from '@platform/remix';
import { Secret } from '@platform/sdks/formance/src/models/components';
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
import { TRouteParamsWithSearchParams } from '../../../../types/routes';
import { ACTIONS_ROUTES } from '../../../../utils/actions';
import { ROUTES } from '../../../../utils/routes';
import { OAUTH_CLIENTS_ACTION_DELETE_SECRET } from '../constants';

export const deleteOAuthSecretSchema = z.object({
  clientId: z.string().min(1),
  secretId: z.string().min(1),
});

export type DeleteOAuthSecretFormValues = z.infer<
  typeof deleteOAuthSecretSchema
>;

export default function DeleteOauthSecret({
  secret,
  clientId,
  routeParams,
}: {
  secret: Omit<Secret, 'clear' | 'metadata'>;
  clientId: string;
  routeParams: Pick<
    TRouteParamsWithSearchParams,
    'organizationId' | 'stackId' | 'region'
  >;
}) {
  const navigate = useNavigate();

  const { organizationId, stackId, region } = routeParams;

  const { submit, isSubmitting } = useAction({
    formAction: OAUTH_CLIENTS_ACTION_DELETE_SECRET,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      OAUTH_CLIENTS_ACTION_DELETE_SECRET
    ].to,
    onSuccess: () => {
      navigate(
        ROUTES({
          organizationId: routeParams.organizationId,
          stackId: routeParams.stackId,
          region: routeParams.region,
          clientId: clientId,
        })['OAUTH_CLIENT_DETAIL'].to
      );
    },
  });

  const onDeleteOAuthSecretSubmit = () => {
    submit({
      clientId,
      secretId: secret.id,
    });
  };

  const form = useForm<DeleteOAuthSecretFormValues>({
    defaultValues: {
      secretId: secret.id,
      clientId,
    },
    resolver: zodResolver(deleteOAuthSecretSchema),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon-md">
          <Trash />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader className="mb-4">
          <DialogTitle>
            Are you sure you want to delete this OAuth client secret?
          </DialogTitle>
          <DialogDescription>
            This secret could not be use anymore.
          </DialogDescription>
        </DialogHeader>

        <Separator className="mb-4" />

        <Form {...form}>
          <form>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Label>ID</Label>
                <Chip
                  {...chipVariantFromType['id']}
                  label={secret.id}
                  copyMode="click"
                />
              </div>
              <div className="flex items-center gap-3">
                <Label>Name</Label>
                <Chip
                  {...chipVariantFromType['name']}
                  label={secret.name}
                  copyMode="click"
                />
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            type="button"
            onClick={() => onDeleteOAuthSecretSubmit()}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
