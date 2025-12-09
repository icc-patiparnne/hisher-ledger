import { PlugZap } from 'lucide-react';
import React from 'react';
import { Link, LoaderFunction, useLoaderData } from 'react-router';

import { AppContentGrid } from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { withContext } from '../../../../utils/auth.server';
import { getAuthenticator } from '../../../../utils/session.auth.server';

import { Cursor } from '@platform/sdks/utils/cursor';
import { Button } from '@platform/ui';
import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { FEATURES } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { ROUTES } from '../../../../utils/routes';
import {
  NormalizedConnectorConfigsModel,
  NormalizedConnectorListModel,
} from '../../../../utils/sdk/payments/models';
import {
  NormalizedListAllAvailableConnectorsResponse,
  NormalizedListConnectorsResponse,
} from '../../../../utils/sdk/payments/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import { CONNECTIVITY_CONNECTORS_LIST } from '../../constants';
import ConnectorsList from '../components/connectors-list';
import { v1Loader } from './connectors.v1';
import { v3Loader } from './connectors.v3';

export type Data = {
  connectors: NormalizedListConnectorsResponse | undefined;
  connectorsConfig: NormalizedListAllAvailableConnectorsResponse | undefined;
  serverSide: boolean;
};

export type LoaderData = LoaderWrapperProps<{
  connectors: { cursor: Cursor<NormalizedConnectorListModel> };
  connectorsConfig: { data: NormalizedConnectorConfigsModel };
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
        MODULES_GATEWAYS.PAYMENTS
      );

      switch (version) {
        case '3': {
          return wrapLoaderWithProps<Data>(
            await v3Loader(api, request),
            version
          );
        }
        default:
          return wrapLoaderWithProps<Data>(
            await v1Loader(api, request),
            version
          );
      }
    },

    authenticator,
    request,
    [MODULES_GATEWAYS.PAYMENTS],
    FEATURES.payments
  )) as LoaderData;
};

export default function ConnectorsInstalled() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'connectors-installed',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_CONNECTORS_INSTALLED',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'Installed Connectors',
      },
    ],
  });

  const data = useLoaderData<LoaderData>() as LoaderData;

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <ConnectorsList
          connectors={
            data?.connectors
              .cursor as unknown as Cursor<NormalizedConnectorListModel>
          }
          id={CONNECTIVITY_CONNECTORS_LIST}
          serverSide={data?.serverSide}
          connectorsConfig={data?.connectorsConfig?.data}
          version={data?.version}
        >
          <Link
            className="absolute top-4 right-4"
            to={
              ROUTES({ organizationId, stackId, region })[
                'CONNECTIVITY_CONNECTORS_ALL'
              ].to
            }
          >
            <Button variant="primary" size="sm">
              <PlugZap className="w-4 h-4 mr-2" />
              Install Connector
            </Button>
          </Link>
        </ConnectorsList>
      </div>
    </AppContentGrid>
  );
}
