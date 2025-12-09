import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from '@platform/remix';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
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
  MultiSelect,
  Textarea,
} from '@platform/ui';
import useAbility from '../../../../hooks/useAbility';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { ACTIONS_ROUTES } from '../../../../utils/actions';
import { OAUTH_CLIENTS_ACTION_CREATE_CLIENT } from '../constants';

const OAuthClientScopes = z.enum([
  'auth:read',
  'auth:write',
  'ledger:read',
  'ledger:write',
  'payments:read',
  'payments:write',
  'wallets:read',
  'wallets:write',
  'reconciliation:read',
  'reconciliation:write',
  'orchestration:read',
  'orchestration:write',
  'search:read',
  'search:write',
  'webhooks:read',
  'webhooks:write',
]);

export const createOAuthClientSchema = z.object({
  name: z.string().min(1),
  redirectUris: z.string().optional(),
  postLogoutRedirectUris: z.string().optional(),
  scopes: z.array(OAuthClientScopes).optional(),
  description: z.string().optional(),
});

export type CreateOAuthClientFormValues = z.infer<
  typeof createOAuthClientSchema
>;

export default function CreateOAuthClientDialog() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'create-oauth-client',
  });

  const { submit, isSubmitting } = useAction({
    formAction: OAUTH_CLIENTS_ACTION_CREATE_CLIENT,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      OAUTH_CLIENTS_ACTION_CREATE_CLIENT
    ].to,
    onSuccess: () => setOpen(false),
  });
  const {
    stack: { canWrite },
  } = useAbility();
  const [open, setOpen] = React.useState(false);

  const onCreateOAuthClientSubmit = async () => {
    if (canWrite) {
      const values = form.getValues();
      submit(values);
    }
  };

  const form = useForm<CreateOAuthClientFormValues>({
    defaultValues: {
      name: 'default',
      scopes: [],
      description: undefined,
    },
    resolver: zodResolver(createOAuthClientSchema),
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
        <Button
          className="absolute top-4 right-4"
          variant="primary"
          disabled={!canWrite}
          size="sm"
        >
          Create OAuth Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onCreateOAuthClientSubmit)}
          >
            <DialogHeader className="mb-4">
              <DialogTitle>Create OAuth Client</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your OAuth client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="redirectUris"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Redirect URI</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="http://localhost:3000/auth/login"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postLogoutRedirectUris"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Logout Redirect URI</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="http://localhost:3000/auth/logout"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scopes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scopes</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={OAuthClientScopes.options.map((scope) => ({
                        label: scope,
                        value: scope,
                      }))}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select scopes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
