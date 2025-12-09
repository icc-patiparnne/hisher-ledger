import { Link, LoaderFunction, useLoaderData } from 'react-router';

import { Cursor } from '@platform/sdks/utils/cursor';
import { Button } from '@platform/ui';
import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { withContext } from '../../../utils/auth.server';
import { ROUTES } from '../../../utils/routes';
import { NormalizedLedgerModel } from '../../../utils/sdk/ledger/models';
import { NormalizedListLedgersResponse } from '../../../utils/sdk/ledger/responses';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';
import LedgerList from '../components/ledger-list';
import { v1Loader } from './all.v1';
import { v2Loader } from './all.v2';

export { action } from '../actions/action-ledger-create-ledger';

export type Data = {
  allLedgers: NormalizedListLedgersResponse | undefined;
  serverSide: boolean;
};

export type LoaderData = LoaderWrapperProps<{
  allLedgers: { cursor: Cursor<NormalizedLedgerModel> };
}> &
  Pick<Data, 'serverSide'>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
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
            await v1Loader(api, request),
            version
          );
        }
        case '2':
        default:
          return wrapLoaderWithProps<Data>(
            await v2Loader(api, request),
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

export default function LedgersAll() {
  useFeatureFlag(FEATURES.ledger);

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'ledgers-all',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_ALL',
    breadcrumbs: [
      {
        title: 'Ledger',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_OVERVIEW'].to,
      },
      {
        title: 'All Ledgers',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_ALL'].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>() as LoaderData;

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <LedgerList
          ledgers={data?.allLedgers?.cursor}
          serverSide={data?.serverSide}
          version={data?.version}
        >
          <Link
            className="absolute top-4 right-4"
            to={ROUTES({ organizationId, stackId, region })['LEDGER_CREATE'].to}
          >
            <Button variant="primary" size="sm">
              Create Ledger
            </Button>
          </Link>
        </LedgerList>
      </div>
    </AppContentGrid>
  );
}
