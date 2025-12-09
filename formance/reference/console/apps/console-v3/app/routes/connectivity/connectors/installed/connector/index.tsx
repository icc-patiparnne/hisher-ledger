import { Eye, EyeOff } from 'lucide-react';
import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import {
  AppContentGrid,
  AppContentHeaderRoute,
} from '../../../../../components/app-content';
import AppErrorBoundary from '../../../../../components/app-error-boundary';
import { withContext } from '../../../../../utils/auth.server';
import { getAuthenticator } from '../../../../../utils/session.auth.server';

import { Connector } from '@platform/sdks/formance/src/models/components';
import { useRouteGuard } from '../../../../../hooks/useRouteGuard';
import { ROUTES } from '../../../../../utils/routes';
import { NormalizedSDK } from '../../../../../utils/sdk/sdk';
import ConnectorHeader from '../../components/connector-header';
import ConnectorsTaskList from '../../components/connectors-tasks-list';

import {
  Button,
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
} from '@platform/ui';

import { Cursor } from '@platform/sdks/utils/cursor';
import {
  NormalizedConnectorDataModel,
  NormalizedConnectorTaskModel,
} from '../../../../../utils/sdk/payments/models';
import { v1Loader } from './connector.v1';

import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { chipVariantFromConsoleType } from '../../../../../components/chip';
import { FEATURES } from '../../../../../hooks/useFeatureFlag';
import { useRouteUpdate } from '../../../../../hooks/useRouteUpdate';
import { useSensitive } from '../../../../../hooks/useSensitive';
import {
  NormalizedGetConnectorResponse,
  NormalizedListConnectorTasksResponse,
} from '../../../../../utils/sdk/payments/responses';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../../utils/session.gateway.server';

export type Data = {
  connector: NormalizedGetConnectorResponse;
  tasks: NormalizedListConnectorTasksResponse | undefined;
};

type LoaderData = LoaderWrapperProps<{
  connector: { data: NormalizedConnectorDataModel };
  tasks: {
    cursor: Cursor<NormalizedConnectorTaskModel>;
  };
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const connectorId = params.connectorId;
  invariant(connectorId, 'params.connectorId is required');
  const provider = new URL(request.url).searchParams.get('provider');
  invariant(provider, 'provider is required');

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
            await v1Loader(api, request, connectorId, provider),
            version
          );
        }
        default:
          return wrapLoaderWithProps<Data>(
            await v1Loader(api, request, connectorId, provider),
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

export default function ConnectorInstalledPage() {
  const { organizationId, stackId, region, connectorId, provider } =
    useRouteGuard({
      componentName: 'connector-installed',
      requiredParams: ['connectorId'],
      requiredSearchParams: ['provider'],
    });

  const { connector, tasks, version } = useLoaderData<LoaderData>();

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_CONNECTOR_INSTALLED_DETAIL',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'Installed Connectors',
        to: ROUTES({ organizationId, stackId, region })[
          'CONNECTIVITY_CONNECTORS_INSTALLED'
        ].to,
      },
      { title: `${connector?.data?.name}` },
    ],
  });

  const { displayValue, isSensitive, toggleSensitive } = useSensitive({
    value: connector.data.apiKey || '',
  });

  return (
    <AppContentGrid>
      <AppContentHeaderRoute className="col-span-12">
        <ConnectorHeader connector={connector?.data} />
      </AppContentHeaderRoute>

      {connector?.data && (
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>

          <CardContent>
            <DescriptionList>
              <DescriptionTerm>Provider</DescriptionTerm>
              <DescriptionDetails>
                {connector.data.provider ? (
                  <div className="flex items-center gap-1.5">
                    <ConnectorIcon
                      name={connector.data.provider as unknown as Connector}
                    />
                    <span className="font-medium capitalize">
                      {connector.data.provider}
                    </span>
                  </div>
                ) : (
                  // This is because Payments V1 does not return the provider
                  <div className="flex items-center gap-1.5">
                    <ConnectorIcon name={provider as unknown as Connector} />
                    <span className="font-medium capitalize">{provider}</span>
                  </div>
                )}
              </DescriptionDetails>

              <DescriptionTerm>Connector ID</DescriptionTerm>
              <DescriptionDetails>
                <Chip
                  {...chipVariantFromType['id']}
                  label={connectorId}
                  maxWidth="xl"
                  copyMode="click"
                />
              </DescriptionDetails>

              <DescriptionTerm>Name</DescriptionTerm>
              <DescriptionDetails>
                <Chip
                  {...chipVariantFromType['name']}
                  label={connector.data.name}
                  copyMode="click"
                />
              </DescriptionDetails>

              {connector.data.apiKey && (
                <>
                  <DescriptionTerm>API Key</DescriptionTerm>
                  <DescriptionDetails className="flex items-center gap-1">
                    <Chip
                      {...chipVariantFromConsoleType['apiKey']}
                      label={displayValue}
                      maxWidth="xl"
                      copyMode={isSensitive ? 'none' : 'tooltip'}
                    />
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={toggleSensitive}
                    >
                      {isSensitive ? <EyeOff /> : <Eye />}
                    </Button>
                  </DescriptionDetails>
                </>
              )}

              {connector.data.pollingPeriod && (
                <>
                  <DescriptionTerm>Polling Period</DescriptionTerm>
                  <DescriptionDetails>
                    <Chip
                      {...chipVariantFromType['number']}
                      label={connector.data.pollingPeriod}
                    />
                  </DescriptionDetails>
                </>
              )}

              {connector.data.endpoint && (
                <>
                  <DescriptionTerm>Endpoint</DescriptionTerm>
                  <DescriptionDetails>
                    <Chip
                      {...chipVariantFromType['string']}
                      label={connector.data.endpoint}
                    />
                  </DescriptionDetails>
                </>
              )}
            </DescriptionList>
          </CardContent>
        </Card>
      )}

      {tasks && (
        <ConnectorsTaskList
          className="col-span-12"
          tasks={
            tasks.cursor as unknown as Cursor<NormalizedConnectorTaskModel>
          }
          version={version}
          serverSide={version === '3'}
        />
      )}
    </AppContentGrid>
  );
}
