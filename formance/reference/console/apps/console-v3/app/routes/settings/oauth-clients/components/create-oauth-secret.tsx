import { CircleAlert, Copy } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@platform/ui';
import { copyToClipboard } from '@platform/utils';

import { useAction } from '@platform/remix';
import { TRouteParamsWithSearchParams } from '../../../../types/routes';
import { ACTIONS_ROUTES } from '../../../../utils/actions';
import { OAUTH_CLIENTS_ACTION_CREATE_SECRET } from '../constants';

export const createOAuthClientSecretSchema = z.object({
  name: z.string().min(1),
  clientId: z.string().min(1),
});

export type CreateOAuthClientSecretFormValues = z.infer<
  typeof createOAuthClientSecretSchema
>;

export default function CreateOAuthClientSecretDialog({
  clientId,
  routeParams,
}: {
  clientId: string;
  routeParams: Pick<
    TRouteParamsWithSearchParams,
    'organizationId' | 'stackId' | 'region'
  >;
}) {
  const { organizationId, stackId, region } = routeParams;

  const [open, setOpen] = useState(false);
  const [temporarySecret, setTemporarySecret] = useState<string | undefined>();

  const { submit, isSubmitting } = useAction({
    formAction: OAUTH_CLIENTS_ACTION_CREATE_SECRET,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      OAUTH_CLIENTS_ACTION_CREATE_SECRET
    ].to,
    onSuccess: (data: any) => {
      if (data && data.data) {
        setTemporarySecret(data.data.clear);
      }
    },
  });

  const onCreateOAuthClientSecretSubmit = async () => {
    const values = form.getValues();
    submit(values);
  };

  const form = useForm<CreateOAuthClientSecretFormValues>({
    defaultValues: {
      name: 'default',
      clientId,
    },
    resolver: zodResolver(createOAuthClientSecretSchema),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        setTemporarySecret(undefined);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="absolute top-4 right-4" variant="primary" size="sm">
          Create secret
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onCreateOAuthClientSecretSubmit)}
          >
            {temporarySecret ? (
              <DialogHeader>
                <div className="space-y-2">
                  <CircleAlert className="w-6 h-6 text-destructive-foreground" />
                  <DialogTitle>Your created secret</DialogTitle>
                </div>
                <DialogDescription>
                  Keep it in a safe place. This secret won&apos;t be shown
                  again.
                </DialogDescription>
              </DialogHeader>
            ) : (
              <DialogHeader className="mb-4">
                <DialogTitle>Create OAuth Client Secret</DialogTitle>
              </DialogHeader>
            )}
            {temporarySecret ? (
              <div className="flex items-center gap-1 pt-1">
                <div>
                  <Chip
                    {...chipVariantFromType['string']}
                    label={temporarySecret}
                    copyMode="click"
                  />
                </div>
                <Button
                  variant="emerald"
                  type="button"
                  size="icon-sm"
                  onClick={async () => {
                    await copyToClipboard(temporarySecret);
                    toast.success('Copied to clipboard');
                  }}
                >
                  <Copy />
                </Button>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your OAuth client secret name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              {!temporarySecret && (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Create
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
