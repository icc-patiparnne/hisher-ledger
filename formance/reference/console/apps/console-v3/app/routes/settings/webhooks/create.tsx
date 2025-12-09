import { useForm } from 'react-hook-form';
import { LoaderFunction, useLoaderData, useNavigate } from 'react-router';
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
} from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';
import { AppContentGrid } from '../../../components/app-content';
import { LayoutHeaderConsole } from '../../../components/layout';
import useAbility from '../../../hooks/useAbility';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ACTIONS_ROUTES } from '../../../utils/actions';
import { withContext } from '../../../utils/auth.server';
import { ROUTES } from '../../../utils/routes';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { WEBHOOK_ACTION_CREATE_WEBHOOK } from './constants';

export const createWebhookSchema = z.object({
  name: z.string().optional(),
  endpoint: z.string().min(1),
  secret: z.string().optional(),
  eventTypes: z.array(z.string()).optional(),
});

export type CreateWebhookFormValues = z.infer<typeof createWebhookSchema>;

type LoaderData = {
  eventTypes: string[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      try {
        const eventTypes = await api.webhooks.listEventTypes();

        return { eventTypes };
      } catch (e) {
        return { eventTypes: [] };
      }
    },
    authenticator,
    request
  );
};

export default function CreateWebhook() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'create-webhook',
  });

  const navigate = useNavigate();

  const { eventTypes } = useLoaderData<LoaderData>();

  useRouteUpdate({
    moduleName: MODULES_NAMES.WEBHOOKS,
    routeId: 'WEBHOOK_CREATE',
    breadcrumbs: [
      {
        title: 'Webhooks',
        to: ROUTES({ organizationId, stackId, region })['WEBHOOKS_OVERVIEW'].to,
      },
      {
        title: 'Create Webhook',
      },
    ],
  });

  const {
    stack: { canWrite },
  } = useAbility();

  const { submit: createWebhook, isSubmitting } = useAction<{
    endpoint: string;
    eventTypes?: string[];
  }>({
    formAction: WEBHOOK_ACTION_CREATE_WEBHOOK,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      WEBHOOK_ACTION_CREATE_WEBHOOK
    ].to,
    onSuccess: () => {
      form.reset();
      navigate(ROUTES({ organizationId, stackId, region })['WEBHOOKS_ALL'].to);
    },
  });

  const form = useForm<CreateWebhookFormValues>({
    defaultValues: {
      endpoint: 'https://default',
      eventTypes: [],
    },
    resolver: zodResolver(createWebhookSchema),
  });

  const onCreateWebhookSubmit = async () => {
    if (canWrite) {
      const values = form.getValues();
      createWebhook(values);
    }
  };

  return (
    <>
      <LayoutHeaderConsole
        contentHeader={
          <ContentHeader
            context="WEBHOOKS"
            eyebrow="Webhooks"
            iconCustom="WEBHOOKS"
            title="Create Webhook"
            description="Create a new webhook to receive real-time notifications"
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
                  onSubmit={form.handleSubmit(onCreateWebhookSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your webhook name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secret</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your webhook secret"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endpoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endpoint *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your webhook endpoint"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventTypes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Types *</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={eventTypes.map((event: string) => ({
                              label: event,
                              value: event,
                            }))}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select events"
                          />
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
                      {isSubmitting ? 'Creating...' : 'Create'}
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
