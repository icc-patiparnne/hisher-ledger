import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { ACTIONS_ROUTES } from '../../../utils/actions';
import { withContext } from '../../../utils/auth.server';
import { ROUTES } from '../../../utils/routes';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';
import LedgerHeader from '../components/ledger-header';
import { v1Loader } from './ledger.v1';
import { v2Loader } from './ledger.v2';

import {
  AppCard,
  Chip,
  chipVariantFromType,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  PreviewJson,
} from '@platform/ui';

import { useRouteGuard } from '../../../hooks/useRouteGuard';
import {
  NormalizedLedgerModel,
  NormalizedStatsModel,
} from '../../../utils/sdk/ledger/models';
import {
  NormalizedGetLedgerResponse,
  NormalizedGetLedgerStatsResponse,
} from '../../../utils/sdk/ledger/responses';

import { UpdateJson } from '@platform/remix';
import { formatDate, MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { chipVariantFromConsoleType } from '../../../components/chip';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import LedgerTabs from '../components/ledger-tabs';
import { LEDGER_ACTION_UPDATE_METADATA } from '../constants';

export type Data = {
  ledger: NormalizedGetLedgerResponse | undefined;
  ledgerStats: NormalizedGetLedgerStatsResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  ledger: { data: NormalizedLedgerModel };
  ledgerStats: { data: NormalizedStatsModel };
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  invariant(params.ledgerName, 'params.ledgerName is required');
  const ledgerName = params.ledgerName;

  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.LEDGER
      );

      switch (version) {
        case '1': {
          return wrapLoaderWithProps<Data>(
            await v1Loader(api, ledgerName),
            version
          );
        }
        case '2':
        default:
          return wrapLoaderWithProps<Data>(
            await v2Loader(api, ledgerName),
            version
          );
      }
    },

    authenticator,
    request,
    [MODULES_GATEWAYS.LEDGER],
    FEATURES.ledger
  )) as LoaderData;
};

export default function Ledger() {
  useFeatureFlag(FEATURES.ledger);

  const { organizationId, stackId, region, ledgerName } = useRouteGuard({
    componentName: 'ledger',
    requiredParams: ['ledgerName'],
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_DETAIL',
    breadcrumbs: [
      {
        title: 'Ledger',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_OVERVIEW'].to,
      },
      {
        title: 'All Ledgers',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_ALL'].to,
      },
      {
        title: ledgerName,
        to: ROUTES({ organizationId, stackId, region, ledgerName })[
          'LEDGER_DETAIL'
        ].to,
      },
      {
        title: 'Information',
      },
    ],
  });

  const data = useLoaderData<LoaderData>() as unknown as LoaderData;
  const { ledger, ledgerStats } = data;

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <LedgerHeader ledger={ledger.data} ledgerStats={ledgerStats.data} />
      </div>

      <div className="col-span-12">
        <LedgerTabs
          organizationId={organizationId}
          stackId={stackId}
          region={region}
          ledgerName={ledgerName}
          version={data?.version}
        />
      </div>

      <div className="col-span-12">
        <AppCard title="Information">
          <DescriptionList>
            {ledger.data.id && (
              <>
                <DescriptionTerm>Ledger ID</DescriptionTerm>
                <DescriptionDetails>
                  <Chip
                    {...chipVariantFromType['id']}
                    label={ledger.data.id}
                    copyMode="click"
                  />
                </DescriptionDetails>
              </>
            )}

            <DescriptionTerm>Ledger Name</DescriptionTerm>
            <DescriptionDetails>
              <Chip label={ledgerName} copyMode="click" />
            </DescriptionDetails>

            {/* <DescriptionTerm>Transactions</DescriptionTerm>
              <DescriptionDetails>
                <Chip
                  variant="mint"
                  label={String(ledgerStats.data.transactions)}
                />
              </DescriptionDetails>

              <DescriptionTerm>Accounts</DescriptionTerm>
              <DescriptionDetails>
                <Chip
                  variant="lilac"
                  label={String(ledgerStats.data.accounts)}
                />
              </DescriptionDetails> */}

            {ledger.data.addedAt && (
              <>
                <DescriptionTerm>Added at</DescriptionTerm>
                <DescriptionDetails>
                  <span>{formatDate(ledger.data.addedAt)}</span>
                </DescriptionDetails>
              </>
            )}

            {ledger.data.bucket && (
              <>
                <DescriptionTerm>Bucket</DescriptionTerm>
                <DescriptionDetails>
                  <Chip
                    {...chipVariantFromConsoleType['ledger']}
                    label={ledger.data.bucket}
                    copyMode="click"
                  />
                </DescriptionDetails>
              </>
            )}

            {ledger.data.metadata && (
              <>
                <DescriptionTerm>Metadata</DescriptionTerm>
                <DescriptionDetails>
                  <UpdateJson
                    initialJson={ledger.data.metadata}
                    actionUrl={
                      ACTIONS_ROUTES({ organizationId, stackId, region })[
                        LEDGER_ACTION_UPDATE_METADATA
                      ].to
                    }
                    formAction={LEDGER_ACTION_UPDATE_METADATA}
                    formFields={{
                      ledger: ledgerName,
                    }}
                  />
                </DescriptionDetails>
              </>
            )}

            {ledger.data.features && (
              <>
                <DescriptionTerm>Features</DescriptionTerm>
                <DescriptionDetails>
                  <PreviewJson
                    className="w-full"
                    json={ledger.data.features}
                    defaultUnfoldAll={true}
                  />
                </DescriptionDetails>
              </>
            )}
          </DescriptionList>
        </AppCard>
      </div>
    </AppContentGrid>
  );
}
