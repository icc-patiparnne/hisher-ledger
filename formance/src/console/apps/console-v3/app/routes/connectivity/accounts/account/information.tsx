import React from 'react';
import { useOutletContext } from 'react-router';

import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';

import { ROUTES } from '../../../../utils/routes';

import {
  AppCard,
  Badge,
  Chip,
  chipVariantFromType,
  ConnectorIcon,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  PreviewJson,
} from '@platform/ui';
import { formatDate, MODULES_NAMES, TConnectorName } from '@platform/utils';
import { TConnectivityAccountContext } from '.';
import { badgeVariantFromPaymentAccountType } from '../../../../components/badge';
import { chipVariantFromConsoleType } from '../../../../components/chip';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { getEffectiveProvider } from '../../utils';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export default function ConnectivityAccountInformation() {
  useFeatureFlag(FEATURES.payments);

  const { organizationId, stackId, region, paymentAccountId } = useRouteGuard({
    componentName: 'connectivity-account-information',
    requiredParams: ['paymentAccountId'],
  });

  const context = useOutletContext<TConnectivityAccountContext>();
  const { paymentsAccount } = context;

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_ACCOUNT_DETAIL',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'All Accounts',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_ACCOUNTS']
          .to,
      },
      {
        title: paymentAccountId,
      },
    ],
  });

  return (
    <div className="col-span-12">
      <AppCard title="Information">
        <DescriptionList>
          <DescriptionTerm>ID</DescriptionTerm>
          <DescriptionDetails>
            <Chip
              {...chipVariantFromType['id']}
              label={paymentsAccount.data.id}
              maxWidth="xl"
              copyMode="click"
            />
          </DescriptionDetails>
          <DescriptionTerm>Connector ID</DescriptionTerm>
          <DescriptionDetails>
            <Chip
              {...chipVariantFromType['id']}
              label={paymentsAccount.data.connectorID}
              maxWidth="xl"
              copyMode="click"
            />
          </DescriptionDetails>
          <DescriptionTerm>Account Name</DescriptionTerm>
          <DescriptionDetails>
            {paymentsAccount.data.accountName || paymentsAccount.data.name ? (
              <Chip
                {...chipVariantFromType['name']}
                label={
                  paymentsAccount.data.accountName ||
                  paymentsAccount.data.name ||
                  ''
                }
                copyMode={
                  paymentsAccount.data.accountName !== '' ||
                  paymentsAccount.data.name !== ''
                    ? 'tooltip'
                    : 'none'
                }
              />
            ) : (
              <span>-</span>
            )}
          </DescriptionDetails>
          <DescriptionTerm>Type</DescriptionTerm>
          <DescriptionDetails>
            <Badge
              variant={
                badgeVariantFromPaymentAccountType[paymentsAccount.data.type]
              }
            >
              {paymentsAccount.data.type}
            </Badge>
          </DescriptionDetails>
          <DescriptionTerm>Reference</DescriptionTerm>
          <DescriptionDetails>
            <Chip
              {...chipVariantFromConsoleType['reference']}
              label={paymentsAccount.data.reference}
              copyMode="click"
            />
          </DescriptionDetails>
          <DescriptionTerm>Provider</DescriptionTerm>
          <DescriptionDetails>
            <div className="flex items-center gap-2">
              <ConnectorIcon
                name={
                  getEffectiveProvider(
                    paymentsAccount.data
                  ) as unknown as TConnectorName
                }
              />
              <span className="capitalize font-medium">
                {getEffectiveProvider(paymentsAccount.data)?.toLowerCase()}
              </span>
            </div>
          </DescriptionDetails>
          <DescriptionTerm>Date</DescriptionTerm>
          <DescriptionDetails>
            <span className="font-medium text-sm">
              {formatDate(new Date(paymentsAccount.data.createdAt))}
            </span>
          </DescriptionDetails>

          <DescriptionTerm>Metadata</DescriptionTerm>
          <DescriptionDetails>
            <PreviewJson json={paymentsAccount.data.metadata ?? {}} />
          </DescriptionDetails>

          <DescriptionTerm>Raw Metadata</DescriptionTerm>
          <DescriptionDetails>
            <PreviewJson json={paymentsAccount.data.raw ?? {}} />
          </DescriptionDetails>
        </DescriptionList>
      </AppCard>
    </div>
  );
}
