import React from 'react';
import { useForm } from 'react-hook-form';
import { LoaderFunction, useLoaderData, useNavigate } from 'react-router';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from '@platform/remix';
import {
  Button,
  Card,
  CardContent,
  CodeEditor,
  ContentHeader,
  Country,
  CountryDropdown,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@platform/ui';
import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { AppContentGrid } from '../../../components/app-content';
import { LayoutHeaderConsole } from '../../../components/layout';
import useAbility from '../../../hooks/useAbility';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ACTIONS_ROUTES } from '../../../utils/actions';
import { withContext } from '../../../utils/auth.server';
import { ROUTES } from '../../../utils/routes';
import { NormalizedCreateBankAccountRequest } from '../../../utils/sdk/payments/requests';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';
import { isVersionV1 } from '../../../utils/version';
import { CONNECTIVITY_ACTION_CREATE_BANK_ACCOUNT } from '../constants';

// Schema based on NormalizedCreateBankAccountRequest
const createBankAccountSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  country: z.string().optional(),
  iban: z.string().optional(),
  accountNumber: z.string().optional(),
  swiftBicCode: z.string().optional(),
  metadata: z.string().optional(),
  // V1 specific fields
  connectorID: z.string().optional(),
  accountID: z.string().optional(),
  provider: z.string().optional(),
});

export type CreateBankAccountFormValues = z.infer<
  typeof createBankAccountSchema
>;

type Data = Record<string, never>;

type LoaderData = LoaderWrapperProps<Data>;

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (_api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.PAYMENTS
      );

      return wrapLoaderWithProps<Data>({}, version);
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.PAYMENTS],
    FEATURES.payments
  )) as LoaderData;
};

export default function CreateBankAccount() {
  const navigate = useNavigate();

  const data = useLoaderData<LoaderData>();

  const version = data.version;

  const isV1 = isVersionV1(version);

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'create-bank-account',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_BANK_ACCOUNTS_CREATE',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'Bank Accounts',
        to: ROUTES({ organizationId, stackId, region })[
          'CONNECTIVITY_BANK_ACCOUNTS'
        ].to,
      },
      {
        title: 'Create Bank Account',
      },
    ],
  });

  const {
    stack: { canWrite },
  } = useAbility();

  const { submit: createBankAccount, isSubmitting } =
    useAction<NormalizedCreateBankAccountRequest>({
      formAction: CONNECTIVITY_ACTION_CREATE_BANK_ACCOUNT,
      actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
        CONNECTIVITY_ACTION_CREATE_BANK_ACCOUNT
      ].to,
      onSuccess: () => {
        navigate(
          ROUTES({
            organizationId,
            stackId,
            region,
          })['CONNECTIVITY_BANK_ACCOUNTS'].to
        );
      },
    });

  const form = useForm<CreateBankAccountFormValues>({
    defaultValues: {
      name: '',
      country: '',
      iban: '',
      accountNumber: '',
      swiftBicCode: '',
      metadata: JSON.stringify({ key: 'value' }, null, 2),
      connectorID: '',
      accountID: '',
      provider: '',
    },
    resolver: zodResolver(createBankAccountSchema),
  });

  const onCreateBankAccountSubmit = async () => {
    if (canWrite) {
      const values = form.getValues();

      let metadata;
      try {
        metadata =
          values.metadata && values.metadata.trim() !== ''
            ? JSON.parse(values.metadata)
            : undefined;
      } catch (error) {
        form.setError('metadata', {
          type: 'manual',
          message: 'Invalid JSON format in metadata field',
        });

        return;
      }

      // Prepare the payload based on NormalizedCreateBankAccountRequest
      const payload: NormalizedCreateBankAccountRequest = {
        name: values.name,
        country: values.country,
        iban: values.iban || undefined,
        accountNumber: values.accountNumber || undefined,
        swiftBicCode: values.swiftBicCode || undefined,
        metadata: metadata?.formanceExample ? undefined : metadata,
        // Include V1 fields only if this is V1 version
        ...(isV1 && {
          connectorID: values.connectorID || undefined,
          accountID: values.accountID || undefined,
          provider: values.provider || undefined,
        }),
      };

      createBankAccount(payload);
    }
  };

  return (
    <>
      <LayoutHeaderConsole
        contentHeader={
          <ContentHeader
            context="CONNECTIVITY"
            eyebrow="Connectivity"
            iconCustom="CONNECTIVITY"
            title="Create Bank Account"
            description={`Create a new bank account`}
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
                  onSubmit={form.handleSubmit(onCreateBankAccountSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your bank account name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isV1 && (
                    <>
                      <FormField
                        control={form.control}
                        name="connectorID"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Connector ID</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Connector identifier"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              The ID of the connector this bank account belongs
                              to.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="accountID"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account ID</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Account identifier"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              The account identifier within the connector.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="provider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provider</FormLabel>
                            <FormControl>
                              <Input placeholder="Bank provider" {...field} />
                            </FormControl>
                            <FormDescription>
                              The bank or financial institution provider.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country{isV1 ? ' *' : ''}</FormLabel>
                        <FormControl>
                          <CountryDropdown
                            onChange={(country: Country) => {
                              field.onChange(country.alpha2);
                            }}
                            defaultValue={field.value}
                            placeholder="Select a country"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="iban"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IBAN</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="International Bank Account Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Bank account number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="swiftBicCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SWIFT/BIC Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Bank identifier code"
                            {...field}
                          />
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
                      {isSubmitting ? 'Creating...' : 'Create Bank Account'}
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
