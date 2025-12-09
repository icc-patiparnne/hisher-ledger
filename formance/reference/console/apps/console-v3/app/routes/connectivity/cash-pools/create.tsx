import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from '@platform/remix';
import { Cursor } from '@platform/sdks/utils/cursor';
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
} from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';
import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { LayoutHeaderConsole } from '../../../components/layout';
import { FEATURES, useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ACTIONS_ROUTES } from '../../../utils/actions';
import { ROUTES } from '../../../utils/routes';
import { NormalizedPaymentAccountModel } from '../../../utils/sdk/payments/models';
import { LoaderData } from '../accounts';
import PaymentAccountsList from '../accounts/components/payment-accounts-list';
import { getPaymentsAccountsLoader } from '../accounts/loader';
import { CONNECTIVITY_ACTION_CREATE_CASH_POOL } from '../constants';

export const loader = getPaymentsAccountsLoader();

const CASH_POOL_ACCOUNT_IDS_SELECTED_CREATION = 'cashPool-creation.accountIds';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

const createCashPoolSchema = z.object({
  name: z.string(),
  accountIDs: z.array(z.string().min(1)).min(1),
});

export type CreateCashPoolFormValues = z.infer<typeof createCashPoolSchema>;

const getTemporaryCashPoolAccountIdsSelected = () => {
  const cashPoolAccountIdsSaved = localStorage.getItem(
    CASH_POOL_ACCOUNT_IDS_SELECTED_CREATION
  );

  return cashPoolAccountIdsSaved !== null
    ? JSON.parse(cashPoolAccountIdsSaved)
    : [];
};
export default function ConnectivityCreateCashPool() {
  useFeatureFlag(FEATURES.payments);

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'connectivity-pools',
  });

  const [accountIds, setAccountsIds] = useState(
    getTemporaryCashPoolAccountIdsSelected()
  );

  const data = useLoaderData<LoaderData>();

  const navigate = useNavigate();

  useEffect(() => {
    form.setValue(
      'accountIDs',
      accountIds.filter((id: string) => id !== null)
    );
  }, [accountIds]);

  const { submit: createCashPool, isSubmitting: isCreatingCashPool } =
    useAction<CreateCashPoolFormValues>({
      formAction: CONNECTIVITY_ACTION_CREATE_CASH_POOL,
      actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
        CONNECTIVITY_ACTION_CREATE_CASH_POOL
      ].to,
      onSuccess: (item: { data: string }) => {
        localStorage.removeItem(CASH_POOL_ACCOUNT_IDS_SELECTED_CREATION);
        navigate(
          ROUTES({
            organizationId,
            stackId,
            region,
            paymentCashPoolId: item.data,
          })['CONNECTIVITY_CASH_POOL_DETAIL'].to
        );
      },
    });

  const onCreateCashPool = async (values: CreateCashPoolFormValues) => {
    createCashPool(values);
  };

  const form = useForm<CreateCashPoolFormValues>({
    defaultValues: {
      name: 'new cash pool',
      accountIDs: [],
    },
    resolver: zodResolver(createCashPoolSchema),
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_CASH_POOLS_CREATE',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'All Cash Pools',
        to: ROUTES({ organizationId, stackId, region })[
          'CONNECTIVITY_CASH_POOLS'
        ].to,
      },
      {
        title: 'Create Cash Pool',
        to: ROUTES({ organizationId, stackId, region })[
          'CONNECTIVITY_CASH_POOLS_CREATE'
        ].to,
      },
    ],
  });

  return (
    <>
      <LayoutHeaderConsole
        contentHeader={
          <ContentHeader
            context="CONNECTIVITY"
            eyebrow="Connectivity"
            iconCustom="CONNECTIVITY"
            title="Create Cash Pool"
            description="Create a new cash pool to be used for reconciliation."
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
                  onSubmit={form.handleSubmit(onCreateCashPool)}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Cash pool name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    {data && (
                      <>
                        <PaymentAccountsList
                          title="Select Accounts"
                          description="Select the accounts to be added to the cash pool."
                          connectorsConfig={data?.connectorsConfig?.data}
                          onRowChecked={(id: string) => {
                            const cashPoolAccountId = accountIds.find(
                              (accountId: string) => accountId === id
                            );

                            return !!cashPoolAccountId;
                          }}
                          onRowCheckedChange={(id: string) => {
                            const cashPoolAccountId = accountIds.find(
                              (accountId: string) => accountId === id
                            );

                            if (cashPoolAccountId) {
                              const ids = accountIds.filter(
                                (accountId: string) => id !== accountId
                              );
                              localStorage.setItem(
                                CASH_POOL_ACCOUNT_IDS_SELECTED_CREATION,
                                JSON.stringify(ids)
                              );
                              setAccountsIds(ids);
                            } else {
                              const ids = [...accountIds, id];
                              localStorage.setItem(
                                CASH_POOL_ACCOUNT_IDS_SELECTED_CREATION,
                                JSON.stringify([
                                  ...accountIds,
                                  cashPoolAccountId,
                                ])
                              );
                              setAccountsIds(ids);
                            }
                          }}
                          paymentsAccounts={
                            data.paymentsAccounts
                              .cursor as unknown as Cursor<NormalizedPaymentAccountModel>
                          }
                          serverSide={true}
                          version={data.version}
                        />
                        {form.formState.errors.accountIDs && (
                          <FormMessage>
                            You must choose at least one payment account
                          </FormMessage>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isCreatingCashPool}
                      loading={isCreatingCashPool}
                    >
                      {isCreatingCashPool ? 'Creating...' : 'Create'}
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
