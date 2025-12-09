import React from 'react';
import { useForm, UseFormGetValues } from 'react-hook-form';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';
import { AppContentGrid } from '../../components/app-content';
import { LayoutHeaderConsole } from '../../components/layout';
import useAbility from '../../hooks/useAbility';
import { useRouteGuard } from '../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../hooks/useRouteUpdate';
import { ACTIONS_ROUTES } from '../../utils/actions';
import { ROUTES } from '../../utils/routes';
import { LEDGER_ACTION_CREATE_LEDGER } from './constants';

const REG = /^[0-9a-zA-Z_-]{1,63}$/;

const isBucketFormat = (key?: string) => {
  if (key) {
    return REG.test(key);
  }

  return true;
};

export const createLedgerSchema = z.object({
  name: z
    .string()
    .min(1)
    .refine((val) => isBucketFormat(val), {
      message: `Name value should follow this pattern: ${REG}`,
    }),
  metadata: z.string().optional(),
  bucket: z
    .string()
    .optional()
    .refine((val) => isBucketFormat(val), {
      message: `Bucket value should follow this pattern: ${REG}`,
    }),
});

export type CreateLedgerFormValues = z.infer<typeof createLedgerSchema>;

export default function CreateLedger() {
  const navigate = useNavigate();
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'create-ledger',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_CREATE',
    breadcrumbs: [
      {
        title: 'Ledger',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_OVERVIEW'].to,
      },
      {
        title: 'Create Ledger',
      },
    ],
  });

  const {
    stack: { canWrite },
  } = useAbility();

  const { submit: createLedger, isSubmitting } = useAction<{
    name: string;
    bucket?: string;
    metadata?: string;
  }>({
    formAction: LEDGER_ACTION_CREATE_LEDGER,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      LEDGER_ACTION_CREATE_LEDGER
    ].to,
    onSuccess: (data) => {
      navigate(
        ROUTES({
          organizationId,
          stackId,
          region,
          ledgerName: data.ledgerName,
        })['LEDGER_DETAIL'].to
      );
    },
  });

  const form = useForm<CreateLedgerFormValues>({
    defaultValues: {
      name: '',
      bucket: undefined,
      metadata: JSON.stringify({ key: 'value' }),
    },
    resolver: zodResolver(createLedgerSchema),
  });

  const onCreateLedgerSubmit = async () => {
    if (canWrite) {
      const values = form.getValues();
      const metadata = values.metadata
        ? JSON.parse(values.metadata)
        : undefined;
      const val = {
        ...values,
        metadata: metadata?.formanceExample
          ? undefined
          : JSON.stringify(metadata),
      } as unknown as UseFormGetValues<CreateLedgerFormValues>;

      createLedger(val);
    }
  };

  return (
    <>
      <LayoutHeaderConsole
        contentHeader={
          <ContentHeader
            context="LEDGER"
            eyebrow="Ledger"
            iconCustom="LEDGER"
            title="Create Ledger"
            description="Create a new ledger to start creating transactions"
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
                  onSubmit={form.handleSubmit(onCreateLedgerSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your ledger name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bucket"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bucket</FormLabel>
                        <FormControl>
                          <Input placeholder="Your ledger bucket" {...field} />
                        </FormControl>
                        <FormDescription>
                          The database bucket to create the ledger in, default
                          is _default.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metadata"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Metadata</FormLabel>
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
