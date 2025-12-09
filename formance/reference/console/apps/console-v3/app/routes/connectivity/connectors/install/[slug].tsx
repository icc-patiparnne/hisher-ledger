import React from 'react';
import { useForm } from 'react-hook-form';
import {
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useNavigate,
} from 'react-router';
import { z } from 'zod';

import {
  AdyenConfig$inboundSchema,
  AtlarConfig$inboundSchema,
  BankingCircleConfig$inboundSchema,
  Connector,
  CurrencyCloudConfig$inboundSchema,
  DummyPayConfig$inboundSchema,
  GenericConfig$inboundSchema,
  MangoPayConfig$inboundSchema,
  ModulrConfig$inboundSchema,
  MoneycorpConfig$inboundSchema,
  StripeConfig$inboundSchema,
  V3AdyenConfig$inboundSchema,
  V3AtlarConfig$inboundSchema,
  V3BankingcircleConfig$inboundSchema,
  V3ColumnConfig$inboundSchema,
  V3CurrencycloudConfig$inboundSchema,
  V3DummypayConfig$inboundSchema,
  V3GenericConfig$inboundSchema,
  V3IncreaseConfig$inboundSchema,
  V3MangopayConfig$inboundSchema,
  V3ModulrConfig$inboundSchema,
  V3MoneycorpConfig$inboundSchema,
  V3PlaidConfig$inboundSchema,
  V3PowensConfig$inboundSchema,
  V3QontoConfig$inboundSchema,
  V3StripeConfig$inboundSchema,
  V3TinkConfig$inboundSchema,
  V3WiseConfig$inboundSchema,
  WiseConfig$inboundSchema,
} from '@platform/sdks/formance/src/models/components';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  CardContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
} from '@platform/ui';

import { useAction } from '@platform/remix';
import {
  CONNECTORS,
  CONNECTORS_NAMES,
  formatConnectorName,
  MODULES_GATEWAYS,
  MODULES_NAMES,
  TConnector,
} from '@platform/utils';
import { AppContentGrid } from '../../../../components/app-content';
import useAbility from '../../../../hooks/useAbility';
import { FEATURES } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { ACTIONS_ROUTES } from '../../../../utils/actions';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import { getServiceVersionFromContext } from '../../../../utils/session.gateway.server';
import { CONNECTIVITY_ACTION_INSTALL_CONNECTOR } from '../../constants';
import ConnectorOverviewHeader from '../components/connector-overview-header';

const connectorSchemas = (version: string) =>
  ({
    stripe:
      version === '3'
        ? V3StripeConfig$inboundSchema
        : StripeConfig$inboundSchema,
    dummypay:
      version === '3'
        ? V3DummypayConfig$inboundSchema
        : DummyPayConfig$inboundSchema,
    wise:
      version === '3' ? V3WiseConfig$inboundSchema : WiseConfig$inboundSchema,
    modulr:
      version === '3'
        ? V3ModulrConfig$inboundSchema
        : ModulrConfig$inboundSchema,
    currencycloud:
      version === '3'
        ? V3CurrencycloudConfig$inboundSchema
        : CurrencyCloudConfig$inboundSchema,
    bankingcircle:
      version === '3'
        ? V3BankingcircleConfig$inboundSchema
        : BankingCircleConfig$inboundSchema,
    mangopay:
      version === '3'
        ? V3MangopayConfig$inboundSchema
        : MangoPayConfig$inboundSchema,
    moneycorp:
      version === '3'
        ? V3MoneycorpConfig$inboundSchema
        : MoneycorpConfig$inboundSchema,
    atlar:
      version === '3' ? V3AtlarConfig$inboundSchema : AtlarConfig$inboundSchema,
    adyen:
      version === '3' ? V3AdyenConfig$inboundSchema : AdyenConfig$inboundSchema,
    generic:
      version === '3'
        ? V3GenericConfig$inboundSchema
        : GenericConfig$inboundSchema,
    column: V3ColumnConfig$inboundSchema,
    increase: V3IncreaseConfig$inboundSchema,
    qonto: V3QontoConfig$inboundSchema,
    powens: V3PowensConfig$inboundSchema,
    plaid: V3PlaidConfig$inboundSchema,
    tink: V3TinkConfig$inboundSchema,
  } as const);

// UI customization overrides (optional - only for special cases)
type FieldOverride = {
  label?: string;
  type?: 'text' | 'password' | 'number' | 'boolean';
  placeholder?: string | number;
  hidden?: boolean;
};

const fieldOverrides: Record<string, FieldOverride> = {
  apiKey: {
    label: 'API Key',
    type: 'password',
  },
  pollingPeriod: {
    label: 'Polling period (in seconds or minutes)',
    placeholder: '120s',
  },
  provider: {
    hidden: true,
  },
} as const;

// Helper to get input type from Zod schema
const getInputTypeFromZodSchema = (
  zodSchema: any
): 'text' | 'number' | 'boolean' => {
  // Unwrap optional/nullable schemas
  let schema = zodSchema;
  while (
    schema._def.typeName === 'ZodOptional' ||
    schema._def.typeName === 'ZodNullable'
  ) {
    schema = schema._def.innerType;
  }

  // Handle default values
  if (schema._def.typeName === 'ZodDefault') {
    schema = schema._def.innerType;
  }

  const typeName = schema._def.typeName;

  switch (typeName) {
    case 'ZodNumber':
    case 'ZodBigInt':
      return 'number';
    case 'ZodBoolean':
      return 'boolean';
    case 'ZodString':
    default:
      return 'text';
  }
};

// Helper to extract default value from Zod schema
const getDefaultValueFromZodSchema = (zodSchema: any): any => {
  let schema = zodSchema;

  // Unwrap optional/nullable schemas
  while (
    schema._def.typeName === 'ZodOptional' ||
    schema._def.typeName === 'ZodNullable'
  ) {
    schema = schema._def.innerType;
  }

  // Extract default value
  if (schema._def.typeName === 'ZodDefault') {
    return schema._def.defaultValue();
  }

  return undefined;
};

// Helper to format field name to readable label
const formatFieldLabel = (fieldName: string): string =>
  fieldName
    // Insert space before capital letters that follow lowercase letters
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Insert space before capital letter sequences followed by lowercase (e.g., "HTMLElement" -> "HTML Element")
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    // Capitalize first letter
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

const renderConfigField = (name: string, zodFieldSchema: any, form: any) => {
  const override = fieldOverrides[name] || {};

  if (override.hidden) {
    return null;
  }

  const inputType = override.type || getInputTypeFromZodSchema(zodFieldSchema);
  const label = override.label || formatFieldLabel(name);
  const defaultValue = getDefaultValueFromZodSchema(zodFieldSchema);

  // Create placeholder by lowercasing only the first letter to preserve acronyms
  const placeholderText = label.charAt(0).toLowerCase() + label.slice(1);
  const placeholderWithDefault =
    defaultValue !== undefined ? `${defaultValue}` : `Enter ${placeholderText}`;
  const placeholder = override.placeholder || placeholderWithDefault;

  if (inputType === 'boolean') {
    return (
      <FormField
        key={name}
        control={form.control}
        name={`config.${name}`}
        render={({ field }) => (
          <FormItem className="flex gap-2">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      key={name}
      control={form.control}
      name={`config.${name}`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={inputType}
              placeholder={String(placeholder)}
              min={inputType === 'number' ? 0 : undefined}
              {...field}
              onChange={(e) => {
                if (inputType === 'number') {
                  field.onChange({
                    ...e,
                    target: { ...e.target, value: Number(e.target.value) },
                  });
                } else {
                  field.onChange(e);
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// TODO: Keep in in sync with SDKs at:
// v1, v2 packages/sdks/formance/src/models/components/connectorconfig.ts
// v3 packages/sdks/formance/src/models/components/v3connectorconfig.ts
export const installConnectorSchema = (version: string) => {
  const schemas = connectorSchemas(version);

  return z.discriminatedUnion('provider', [
    z.object({
      provider: z.literal(formatConnectorName(Connector.Stripe, version)),
      config: schemas.stripe,
    }),
    z.object({
      provider: z.literal(formatConnectorName(Connector.DummyPay, version)),
      config: schemas.dummypay,
    }),
    z.object({
      provider: z.literal(formatConnectorName(Connector.Wise, version)),
      config: schemas.wise,
    }),
    z.object({
      provider: z.literal(formatConnectorName(Connector.Modulr, version)),
      config: schemas.modulr,
    }),
    z.object({
      provider: z.literal(
        formatConnectorName(Connector.CurrencyCloud, version)
      ),
      config: schemas.currencycloud,
    }),
    z.object({
      provider: z.literal(
        formatConnectorName(Connector.BankingCircle, version)
      ),
      config: schemas.bankingcircle,
    }),
    z.object({
      provider: z.literal(formatConnectorName(Connector.Mangopay, version)),
      config: schemas.mangopay,
    }),
    z.object({
      provider: z.literal(formatConnectorName(Connector.Moneycorp, version)),
      config: schemas.moneycorp,
    }),
    z.object({
      provider: z.literal(formatConnectorName(Connector.Atlar, version)),
      config: schemas.atlar,
    }),
    z.object({
      provider: z.literal(formatConnectorName(Connector.Adyen, version)),
      config: schemas.adyen,
    }),
    z.object({
      provider: z.literal(formatConnectorName(Connector.Generic, version)),
      config: schemas.generic,
    }),
    z.object({
      provider: z.literal(formatConnectorName(CONNECTORS_NAMES.Qonto, version)),
      config: schemas.qonto,
    }),
    z.object({
      provider: z.literal(
        formatConnectorName(CONNECTORS_NAMES.Increase, version)
      ),
      config: schemas.increase,
    }),
    z.object({
      provider: z.literal(
        formatConnectorName(CONNECTORS_NAMES.Column, version)
      ),
      config: schemas.column,
    }),
    z.object({
      provider: z.literal(
        formatConnectorName(CONNECTORS_NAMES.Powens, version)
      ),
      config: schemas.powens,
    }),
    z.object({
      provider: z.literal(formatConnectorName(CONNECTORS_NAMES.Plaid, version)),
      config: schemas.plaid,
    }),
    z.object({
      provider: z.literal(formatConnectorName(CONNECTORS_NAMES.Tink, version)),
      config: schemas.tink,
    }),
  ]);
};

export type CreateConnectorFormValues = z.infer<
  ReturnType<typeof installConnectorSchema>
>;

type LoaderData = {
  connector: TConnector;
  version: string;
};

export async function loader({
  params,
  request,
}: LoaderFunctionArgs): Promise<LoaderData> {
  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (_api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.PAYMENTS
      );

      const connector = Object.values(CONNECTORS).find(
        (connector) => connector.slug === params.connectorSlug
      );

      if (!connector) {
        throw redirect(ROUTES({}).CONNECTIVITY_OVERVIEW.to);
      }

      return { connector, version };
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.PAYMENTS],
    FEATURES.payments
  )) as LoaderData;
}

export default function ConnectorInstallPage() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'install-connector',
    requiredParams: ['connectorSlug'],
  });

  const { connector, version } = useLoaderData<LoaderData>();

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_INSTALL_CONNECTOR',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'Browse Connectors',
        to: ROUTES({ organizationId, stackId, region })[
          'CONNECTIVITY_CONNECTORS_ALL'
        ].to,
      },
      {
        title: connector.displayName,
        to: ROUTES({
          organizationId,
          stackId,
          region,
          connectorSlug: connector.slug,
        })['CONNECTIVITY_CONNECTOR_DETAIL'].to,
      },
      {
        title: 'Install Connector',
      },
    ],
  });

  const navigate = useNavigate();

  const { submit, isSubmitting } = useAction({
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      CONNECTIVITY_ACTION_INSTALL_CONNECTOR
    ].to,
    formAction: CONNECTIVITY_ACTION_INSTALL_CONNECTOR,
    onSuccess: () => {
      navigate(
        ROUTES({
          organizationId,
          stackId,
          region,
        })['CONNECTIVITY_CONNECTORS_INSTALLED'].to
      );
    },
  });

  const {
    stack: { canWrite },
  } = useAbility();

  // Extract default values from the schema
  const getSchemaDefaults = React.useMemo(() => {
    const schemas = connectorSchemas(version);
    const schema =
      schemas[connector.slug.toLowerCase() as keyof typeof schemas];

    if (!schema) return {};

    const shape = (schema as any).shape;
    const defaults: Record<string, any> = {};

    Object.keys(shape).forEach((fieldName) => {
      const defaultValue = getDefaultValueFromZodSchema(shape[fieldName]);
      if (defaultValue !== undefined) {
        defaults[fieldName] = defaultValue;
      }
    });

    return defaults;
  }, [connector.slug, version]);

  const form = useForm<CreateConnectorFormValues>({
    defaultValues: {
      provider: connector.slug.toUpperCase() as any, // Pre-select the connector based on the slug
      config: getSchemaDefaults,
    },
    resolver: zodResolver(installConnectorSchema(version)),
  });

  const selectedProvider = form.watch('provider');

  const renderProviderSpecificFields = () => {
    if (!selectedProvider) return null;

    const schemas = connectorSchemas(version);
    const schema =
      schemas[selectedProvider.toLowerCase() as keyof typeof schemas];
    if (!schema) return null;

    const shape = (schema as any).shape;

    return Object.keys(shape).map((fieldName) =>
      renderConfigField(fieldName, shape[fieldName], form)
    );
  };

  const onInstallConnectorSubmit = async () => {
    const values = form.getValues();
    await submit({
      ...values,
      formAction: CONNECTIVITY_ACTION_INSTALL_CONNECTOR,
      provider: selectedProvider,
    });
  };

  return (
    <>
      <ConnectorOverviewHeader connector={connector} />

      <AppContentGrid className="2xl:p-8">
        <div className="col-span-12">
          <Card>
            <CardContent>
              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(onInstallConnectorSubmit)}
                >
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">
                      Install {connector.displayName} Connector
                    </h2>
                    <p className="text-muted-foreground">
                      Configure and install the {connector.displayName}{' '}
                      connector to start syncing with your payment provider.
                    </p>
                  </div>

                  {renderProviderSpecificFields()}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting || !canWrite}
                      loading={isSubmitting}
                    >
                      {isSubmitting ? 'Installing...' : 'Install Connector'}
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
