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
  CodeEditor,
  ContentHeader,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';
import { AppContentGrid } from '../../../components/app-content';
import { LayoutHeaderConsole } from '../../../components/layout';
import useAbility from '../../../hooks/useAbility';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ACTIONS_ROUTES } from '../../../utils/actions';
import { ROUTES } from '../../../utils/routes';
import { RECONCILIATION_ACTION_CREATE_POLICY } from '../constants';

export const createPolicySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  ledgerName: z.string().min(1, 'Ledger name is required'),
  ledgerQuery: z.string().min(1, 'Ledger query is required'),
  paymentsPoolID: z.string().min(1, 'Payments pool ID is required'),
});

export type CreatePolicyFormValues = z.infer<typeof createPolicySchema>;

export default function CreatePolicy() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'create-policy',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.RECONCILIATION,
    routeId: 'RECONCILIATION_POLICY_CREATE',
    breadcrumbs: [
      {
        title: 'Reconciliation',
        to: ROUTES({ organizationId, stackId, region })[
          'RECONCILIATION_OVERVIEW'
        ].to,
      },
      {
        title: 'Create Policy',
      },
    ],
  });

  const {
    stack: { canWrite },
  } = useAbility();
  const navigate = useNavigate();

  const { submit: createPolicy, isSubmitting } =
    useAction<CreatePolicyFormValues>({
      formAction: RECONCILIATION_ACTION_CREATE_POLICY,
      actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
        RECONCILIATION_ACTION_CREATE_POLICY
      ].to,
      onSuccess: (data) => {
        navigate(
          ROUTES({
            organizationId,
            stackId,
            region,
            policyId: data.id,
          })['RECONCILIATION_POLICY_DETAIL'].to
        );
      },
    });

  const form = useForm<CreatePolicyFormValues>({
    defaultValues: {
      name: '',
      ledgerName: '',
      ledgerQuery: JSON.stringify({
        $match: {
          'metadata[reconciliation]': 'pool:main',
        },
      }),
      paymentsPoolID: '',
    },
    resolver: zodResolver(createPolicySchema),
  });

  const onCreatePolicySubmit = async () => {
    if (canWrite) {
      const values = form.getValues();
      createPolicy(values);
    }
  };

  return (
    <>
      <LayoutHeaderConsole
        contentHeader={
          <ContentHeader
            context="RECONCILIATION"
            eyebrow="Reconciliation"
            iconCustom="RECONCILIATION"
            title="Create Policy"
            description="Create a new policy to start reconciling your Payments's cash pool with your ledger."
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
                  onSubmit={form.handleSubmit(onCreatePolicySubmit)}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter policy name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ledgerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ledger Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ledger name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentsPoolID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payments Pool ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter payments pool ID"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ledgerQuery"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ledger Query</FormLabel>
                        <FormControl>
                          <div className="relative max-w-screen-sm">
                            <CodeEditor
                              value={field.value ?? ''}
                              language="json"
                            />
                          </div>
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
                      {isSubmitting ? 'Creating...' : 'Create Policy'}
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
