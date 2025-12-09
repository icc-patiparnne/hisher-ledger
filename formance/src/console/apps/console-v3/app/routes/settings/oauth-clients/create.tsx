import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from '@platform/remix';
import {
  Button,
  Card,
  CardContent,
  ContentHeader,
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
import { MODULES_NAMES } from '@platform/utils';
import { AppContentGrid } from '../../../components/app-content';
import { LayoutHeaderConsole } from '../../../components/layout';
import useAbility from '../../../hooks/useAbility';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ACTIONS_ROUTES } from '../../../utils/actions';
import { ROUTES } from '../../../utils/routes';
import { OAUTH_CLIENTS_ACTION_CREATE_CLIENT } from './constants';

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

export default function CreateOAuthClient() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'create-oauth-client',
  });

  const navigate = useNavigate();

  useRouteUpdate({
    moduleName: MODULES_NAMES.AUTH,
    routeId: 'OAUTH_CLIENT_CREATE',
    breadcrumbs: [
      {
        title: 'OAuth Clients',
        to: ROUTES({ organizationId, stackId, region })[
          'OAUTH_CLIENTS_OVERVIEW'
        ].to,
      },
      {
        title: 'Create OAuth Client',
      },
    ],
  });

  const {
    stack: { canWrite },
  } = useAbility();

  const { submit: createOAuthClient, isSubmitting } = useAction<{
    name: string;
    redirectUris?: string;
    postLogoutRedirectUris?: string;
    scopes?: string[];
    description?: string;
  }>({
    formAction: OAUTH_CLIENTS_ACTION_CREATE_CLIENT,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      OAUTH_CLIENTS_ACTION_CREATE_CLIENT
    ].to,
    onSuccess: () => {
      form.reset();
      navigate(
        ROUTES({ organizationId, stackId, region })['OAUTH_CLIENTS_ALL'].to
      );
    },
  });

  const form = useForm<CreateOAuthClientFormValues>({
    defaultValues: {
      name: 'default',
      scopes: [],
      description: undefined,
    },
    resolver: zodResolver(createOAuthClientSchema),
  });

  const onCreateOAuthClientSubmit = async () => {
    if (canWrite) {
      const values = form.getValues();
      createOAuthClient(values);
    }
  };

  return (
    <>
      <LayoutHeaderConsole
        contentHeader={
          <ContentHeader
            context="AUTH"
            eyebrow="Authentication"
            iconCustom="AUTH"
            title="Create OAuth Client"
            description="Create a new OAuth client for application authentication"
          />
        }
      />

      <AppContentGrid className="2xl:p-8">
        <div className="col-span-12">
          <Card>
            <CardContent>
              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(onCreateOAuthClientSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your OAuth client name"
                            {...field}
                          />
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

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting || !canWrite}
                      loading={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create OAuth Client'}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => form.reset()}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </AppContentGrid>
    </>
  );
}
