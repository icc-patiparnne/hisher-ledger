import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import {
  AppContentGrid,
  AppContentHeaderRoute,
} from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { ROUTES } from '../../../../utils/routes';

import {
  NormalizedBankAccountModel,
  NormalizedBankAccountRelatedAccountsModel,
  NormalizedConnectorConfigsModel,
} from '../../../../utils/sdk/payments/models';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';

import { withContext } from '../../../../utils/auth.server';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import { bankAccountLoader } from './bank-account';

import { Connector } from '@platform/sdks/formance/src/models/components';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Chip,
  chipVariantFromType,
  ConnectorIcon,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  FlagIcon,
  PreviewJson,
} from '@platform/ui';
import { formatDate, MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import React from 'react';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { NormalizedListAllAvailableConnectorsResponse } from '../../../../utils/sdk/payments/responses';
import PaymentBankAccountHeader from '../components/payment-bank-account-header';
import PaymentBankAccountRelatedAccountsList from '../components/payment-bank-account-related-accounts-list';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export type Data = {
  bankAccount: NormalizedBankAccountModel | undefined;
  connectorsConfig: NormalizedListAllAvailableConnectorsResponse | undefined;
};

type LoaderData = LoaderWrapperProps<{
  bankAccount: { data: NormalizedBankAccountModel };
  connectorsConfig: { data: NormalizedConnectorConfigsModel };
}>;

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(
    params.paymentBankAccountId,
    'params.paymentBankAccountId is required'
  );
  const paymentBankAccountId = params.paymentBankAccountId;

  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.PAYMENTS
      );

      return wrapLoaderWithProps<Data>(
        await bankAccountLoader(api, { bankAccountId: paymentBankAccountId }),
        version
      );
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.PAYMENTS],
    FEATURES.payments
  )) as LoaderData;
};

export default function ConnectivityBankAccountDetail() {
  useFeatureFlag(FEATURES.payments);

  const { organizationId, stackId, region, paymentBankAccountId } =
    useRouteGuard({
      componentName: 'connectivity-bank-account-detail',
      requiredParams: ['paymentBankAccountId'],
    });

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_BANK_ACCOUNT_DETAIL',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'All Bank Accounts',
        to: ROUTES({ organizationId, stackId, region })[
          'CONNECTIVITY_BANK_ACCOUNTS'
        ].to,
      },
      {
        title: paymentBankAccountId,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  return (
    <AppContentGrid>
      <AppContentHeaderRoute className="col-span-12">
        <PaymentBankAccountHeader
          paymentBankAccount={
            data.bankAccount.data as unknown as NormalizedBankAccountModel
          }
        />
      </AppContentHeaderRoute>

      <Card className="col-span-12">
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>

        <CardContent>
          <DescriptionList>
            <DescriptionTerm>ID</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromType['id']}
                label={data.bankAccount.data.id ?? ''}
                copyMode="click"
              />
            </DescriptionDetails>

            {data.bankAccount.data.connectorID && (
              <>
                <DescriptionTerm>Connector ID</DescriptionTerm>
                <DescriptionDetails>
                  <Chip
                    {...chipVariantFromType['id']}
                    label={data.bankAccount.data.connectorID}
                    copyMode="click"
                  />
                </DescriptionDetails>
              </>
            )}

            {data.bankAccount.data.accountID && (
              <>
                <DescriptionTerm>Account ID</DescriptionTerm>
                <DescriptionDetails>
                  <Chip
                    {...chipVariantFromType['id']}
                    label={data.bankAccount.data.accountID ?? ''}
                    copyMode="click"
                  />
                </DescriptionDetails>
              </>
            )}

            <DescriptionTerm>Name</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromType['name']}
                label={data.bankAccount.data.name}
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Provider</DescriptionTerm>
            <DescriptionDetails>
              {data.bankAccount.data.provider ? (
                <div className="flex items-center gap-2">
                  <ConnectorIcon
                    name={
                      data.bankAccount.data.provider as unknown as Connector
                    }
                  />
                  <span className="font-medium capitalize">
                    {data.bankAccount.data.provider?.toLowerCase()}
                  </span>
                </div>
              ) : (
                <Chip {...chipVariantFromType['string']} label="Unknown" />
              )}
            </DescriptionDetails>

            <DescriptionTerm>Country</DescriptionTerm>
            <DescriptionDetails>
              <div className="flex items-center gap-2">
                {data.bankAccount.data.country && (
                  <FlagIcon countryCode={data.bankAccount.data.country} />
                )}
                <span className="font-medium">
                  {data.bankAccount.data.country}
                </span>
              </div>
            </DescriptionDetails>

            <DescriptionTerm>IBAN</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromType['string']}
                label={data.bankAccount.data.iban ?? ''}
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Created at</DescriptionTerm>
            <DescriptionDetails>
              {formatDate(new Date(data.bankAccount.data.createdAt))}
            </DescriptionDetails>

            <DescriptionTerm>Metadata</DescriptionTerm>
            <DescriptionDetails>
              <PreviewJson json={data.bankAccount.data.metadata ?? {}} />
            </DescriptionDetails>
          </DescriptionList>
        </CardContent>
      </Card>

      <PaymentBankAccountRelatedAccountsList
        className="col-span-12"
        connectorsConfig={data?.connectorsConfig?.data}
        paymentBankAccountRelatedAccounts={
          data.bankAccount.data?.relatedAccounts as unknown as
            | NormalizedBankAccountRelatedAccountsModel[]
            | []
        }
        version={data.version}
      />
    </AppContentGrid>
  );
}
