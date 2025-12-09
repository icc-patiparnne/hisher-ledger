import React from 'react';
import { useForm, UseFormGetValues } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
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

import { useAction } from '@platform/remix';
import { AppContentGrid } from '../../components/app-content';
import { LayoutHeaderConsole } from '../../components/layout';
import useAbility from '../../hooks/useAbility';
import { useRouteGuard } from '../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../hooks/useRouteUpdate';
import { ACTIONS_ROUTES } from '../../utils/actions';
import { ROUTES } from '../../utils/routes';
import { WALLETS_ACTION_CREATE_WALLET } from './constants';

const REG = /^[0-9a-zA-Z_-]{1,63}$/;

const isBucketFormat = (key?: string) => {
  if (key) {
    return REG.test(key);
  }

  return true;
};

export const createWalletSchema = z.object({
  name: z
    .string()
    .min(1)
    .refine((val) => isBucketFormat(val), {
      message: `Name value should follow this pattern: ${REG}`,
    }),
  metadata: z.string().optional(),
});

export type CreateWalletFormValues = z.infer<typeof createWalletSchema>;

export default function CreateWallet() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'create-wallet',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.WALLETS,
    routeId: 'WALLET_CREATE',
    breadcrumbs: [
      {
        title: 'Wallets',
        to: ROUTES({ organizationId, stackId, region })['WALLETS_OVERVIEW'].to,
      },
      {
        title: 'Create Wallet',
      },
    ],
  });

  const {
    stack: { canWrite },
  } = useAbility();
  const navigate = useNavigate();
  const { submit: createWallet, isSubmitting } = useAction<{
    name: string;
    metadata?: string;
  }>({
    formAction: WALLETS_ACTION_CREATE_WALLET,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      WALLETS_ACTION_CREATE_WALLET
    ].to,
    onSuccess: (data) => {
      navigate(
        ROUTES({
          organizationId,
          stackId,
          region,
          walletId: data.walletId,
        })['WALLET_DETAIL'].to
      );
    },
  });

  const form = useForm<CreateWalletFormValues>({
    defaultValues: {
      name: '',
      metadata: JSON.stringify({ formanceExample: 'metadata' }),
    },
    resolver: zodResolver(createWalletSchema),
  });

  const onCreateWalletSubmit = async () => {
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
      } as unknown as UseFormGetValues<CreateWalletFormValues>;

      createWallet(val);
    }
  };

  return (
    <>
      <LayoutHeaderConsole
        contentHeader={
          <ContentHeader
            context="WALLETS"
            eyebrow="Wallets"
            iconCustom="WALLETS"
            title="Create Wallet"
            description="Create a new wallet to start with holds and topup capabilities"
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
                  onSubmit={form.handleSubmit(onCreateWalletSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your wallet name" {...field} />
                        </FormControl>
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
