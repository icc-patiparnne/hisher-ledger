import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { formatDate, MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Chip,
  chipVariantFromType,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@platform/ui';
import {
  AppContentGrid,
  AppContentHeaderRoute,
} from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { badgeVariantFromReportStatus } from '../../../../components/badge';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';
import {
  NormalizedReconciliationBalancesModel,
  NormalizedReconciliationModel,
} from '../../../../utils/sdk/reconciliation/models';
import { NormalizedGetReconciliationResponse } from '../../../../utils/sdk/reconciliation/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import PolicyHeader from '../../../connectivity/payments/components/policy-header';
import ReportBalancesList from '../../components/report-balances-list';
import ReportHeader from '../../components/report-header';
import { v1Loader } from './report.v1';

export type Data = {
  report: NormalizedGetReconciliationResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  report: { data: NormalizedReconciliationModel };
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.reportId, 'params.reportId is required');
  const reportId = params.reportId;

  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.RECONCILIATION
      );

      return wrapLoaderWithProps<Data>(await v1Loader(api, reportId), version);
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.RECONCILIATION],
    FEATURES.reconciliation
  )) as LoaderData;
};

export default function Report() {
  useFeatureFlag(FEATURES.reconciliation);

  const { organizationId, stackId, region, reportId } = useRouteGuard({
    componentName: 'report',
    requiredParams: ['reportId'],
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.RECONCILIATION,
    routeId: 'RECONCILIATION_REPORT_DETAIL',
    breadcrumbs: [
      {
        title: 'Reconciliation',
        to: ROUTES({ organizationId, stackId, region })[
          'RECONCILIATION_OVERVIEW'
        ].to,
      },
      {
        title: 'All Reports',
        to: ROUTES({ organizationId, stackId, region })[
          'RECONCILIATION_REPORTS_LIST'
        ].to,
      },
      {
        title: reportId,
        to: ROUTES({ organizationId, stackId, region, reportId })[
          'RECONCILIATION_REPORT_DETAIL'
        ].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  return (
    <AppContentGrid>
      <AppContentHeaderRoute className="col-span-12 grid grid-cols-12 gap-2">
        <div className="lg:col-span-5 col-span-12">
          <PolicyHeader />
        </div>
        <div className="lg:col-span-7 col-span-12">
          <ReportHeader
            report={
              data.report.data as unknown as NormalizedReconciliationModel
            }
          />
        </div>
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
                label={data.report.data.id}
                maxWidth="xl"
                copyMode="click"
              />
            </DescriptionDetails>

            <DescriptionTerm>Policy ID</DescriptionTerm>
            <DescriptionDetails>
              <Chip
                {...chipVariantFromType['id']}
                label={data.report.data.policyID}
                maxWidth="xl"
                copyMode="click"
              />
            </DescriptionDetails>

            {data.report.data.policyName && (
              <>
                <DescriptionTerm>Policy Name</DescriptionTerm>
                <DescriptionDetails>
                  <Chip
                    {...chipVariantFromType['name']}
                    label={data.report.data.policyName}
                    maxWidth="xl"
                    copyMode="click"
                  />
                </DescriptionDetails>
              </>
            )}

            <DescriptionTerm>Ledger as-of</DescriptionTerm>
            <DescriptionDetails>
              <span>
                {formatDate(new Date(data.report.data.reconciledAtLedger))}
              </span>
            </DescriptionDetails>

            <DescriptionTerm>Pool as-of</DescriptionTerm>
            <DescriptionDetails>
              <span>
                {formatDate(new Date(data.report.data.reconciledAtPayments))}
              </span>
            </DescriptionDetails>

            <DescriptionTerm>Initiated at</DescriptionTerm>
            <DescriptionDetails>
              <span>{formatDate(new Date(data.report.data.createdAt))}</span>
            </DescriptionDetails>

            <DescriptionTerm>Status</DescriptionTerm>
            <DescriptionDetails>
              <Badge
                variant={badgeVariantFromReportStatus[data.report.data.status]}
              >
                {data.report.data.status}
              </Badge>
            </DescriptionDetails>
          </DescriptionList>
        </CardContent>
      </Card>

      <div className="col-span-12">
        <ReportBalancesList
          version={data.version}
          balances={
            data.report.data
              .balances as unknown as NormalizedReconciliationBalancesModel[]
          }
        />
      </div>
    </AppContentGrid>
  );
}
