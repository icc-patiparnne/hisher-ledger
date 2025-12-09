import { LoaderFunction, useLoaderData, useOutletContext } from 'react-router';
import invariant from 'tiny-invariant';

import { formatDate, MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';

import { Cursor } from '@platform/sdks/utils/cursor';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Chip,
  chipVariantFromType,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  PreviewJson,
} from '@platform/ui';
import React from 'react';
import {
  AppContentGrid,
  AppContentHeaderRoute,
} from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { chipVariantFromConsoleType } from '../../../../components/chip';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { CurrentContext } from '../../../../root';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';

import { NormalizedAccountModel } from '../../../../utils/sdk/ledger/models';
import { NormalizedListAccountsResponse } from '../../../../utils/sdk/ledger/responses';
import {
  NormalizedConnectorConfigsModel,
  NormalizedPaymentAccountModel,
} from '../../../../utils/sdk/payments/models';
import { NormalizedListAllAvailableConnectorsResponse } from '../../../../utils/sdk/payments/responses';
import { NormalizedPolicyModel } from '../../../../utils/sdk/reconciliation/models';
import { NormalizedGetPolicyResponse } from '../../../../utils/sdk/reconciliation/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import PaymentAccountsList from '../../../connectivity/accounts/components/payment-accounts-list';
import PolicyHeader from '../../../connectivity/payments/components/policy-header';
import LedgerAccountsList from '../../../ledger/components/ledger-accounts-list';
import { v1Loader } from './policy.v1';

export type Data = {
  policy: NormalizedGetPolicyResponse | undefined;
  paymentsAccounts: { data: NormalizedPaymentAccountModel[] } | [];
  ledgerAccounts: NormalizedListAccountsResponse | [];
  connectorsConfig: NormalizedListAllAvailableConnectorsResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  policy: { data: NormalizedPolicyModel };
  ledgerAccounts: { cursor: Cursor<NormalizedAccountModel> };
  paymentsAccounts: { data: NormalizedPaymentAccountModel[] };
  connectorsConfig: { data: NormalizedConnectorConfigsModel };
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.policyId, 'params.policyId is required');
  const policyId = params.policyId;

  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.RECONCILIATION
      );

      return wrapLoaderWithProps<Data>(
        await v1Loader(api, policyId, request),
        version
      );
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.RECONCILIATION],
    FEATURES.reconciliation
  )) as LoaderData;
};

export default function Report() {
  useFeatureFlag(FEATURES.reconciliation);

  const { organizationId, stackId, region, policyId } = useRouteGuard({
    componentName: 'policy',
    requiredParams: ['policyId'],
  });

  const { gateway } = useOutletContext<CurrentContext>();
  const ledgerService = gateway.servicesVersion.find(
    (item) => item.name === 'ledger'
  );

  useRouteUpdate({
    moduleName: MODULES_NAMES.RECONCILIATION,
    routeId: 'RECONCILIATION_POLICY_DETAIL',
    breadcrumbs: [
      {
        title: 'Reconciliation',
        to: ROUTES({ organizationId, stackId, region })[
          'RECONCILIATION_OVERVIEW'
        ].to,
      },
      {
        title: 'All Policies',
        to: ROUTES({ organizationId, stackId, region })[
          'RECONCILIATION_POLICIES_LIST'
        ].to,
      },
      {
        title: policyId,
        to: ROUTES({ organizationId, stackId, region, policyId })[
          'RECONCILIATION_POLICY_DETAIL'
        ].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  return (
    <AppContentGrid>
      <AppContentHeaderRoute className="col-span-12">
        <PolicyHeader
          policy={data.policy.data as unknown as NormalizedPolicyModel}
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
                label={data.policy.data.id}
                copyMode="click"
              />
            </DescriptionDetails>
            <DescriptionTerm>Name</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromType['name']}
                label={data.policy.data.name}
                maxWidth="xl"
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Ledger</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromConsoleType['ledger']}
                label={data.policy.data.ledgerName}
                maxWidth="xl"
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Ledger Query</DescriptionTerm>
            <DescriptionDetails>
              <PreviewJson
                json={data.policy.data.ledgerQuery}
                defaultUnfoldAll={true}
              />
            </DescriptionDetails>

            <DescriptionTerm>Payments Pool</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromType['id']}
                label={data.policy.data.paymentsPoolID}
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Creation Date</DescriptionTerm>
            <DescriptionDetails>
              <span>{formatDate(new Date(data.policy.data.createdAt))}</span>
            </DescriptionDetails>
          </DescriptionList>
        </CardContent>
      </Card>

      <div className="col-span-12">
        <PaymentAccountsList
          title="Payments Accounts"
          paymentsAccounts={
            data.paymentsAccounts
              .data as unknown as NormalizedPaymentAccountModel[]
          }
          connectorsConfig={data?.connectorsConfig?.data}
          serverSide={false}
          version={data.version}
        />
      </div>

      <div className="col-span-12">
        <LedgerAccountsList
          title="Ledger Accounts"
          ledger={data?.policy.data?.ledgerName}
          ledgerAccounts={
            data.ledgerAccounts
              .cursor as unknown as Cursor<NormalizedAccountModel>
          }
          version={ledgerService?.version || '2'}
        />
      </div>
    </AppContentGrid>
  );
}
