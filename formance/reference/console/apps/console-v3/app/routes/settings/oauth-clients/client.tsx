import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chip,
  chipVariantFromType,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  PreviewJson,
} from '@platform/ui';
import {
  AppContentGrid,
  AppContentHeaderRoute,
} from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { withContext, WithContext } from '../../../utils/auth.server';
import { getAuthenticator } from '../../../utils/session.auth.server';

import { ReadClientResponse } from '@platform/sdks/formance/src/models/components';
import { NormalizedSDK } from '../../../utils/sdk/sdk';

import { MODULES_NAMES } from '@platform/utils';
import { chipVariantFromConsoleType } from '../../../components/chip';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ROUTES } from '../../../utils/routes';
import CreateOAuthClientSecretDialog from './components/create-oauth-secret';
import OauthClientHeader from './components/oauth-client-header';
import SecretsOAuthClient from './components/secrets-oauth-client';

type LoaderData = ReadClientResponse | WithContext;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.clientId, 'params.clientId is required');
  const clientId = params.clientId;
  const authenticator = getAuthenticator(request);

  return await withContext<LoaderData>(
    async (api: NormalizedSDK) => await api.auth.getClient({ clientId }),
    authenticator,
    request
  );
};

export default function OAuthClientSecretsAll() {
  const { organizationId, stackId, region, clientId } = useRouteGuard({
    componentName: 'oauth-client-secrets',
    requiredParams: ['clientId'],
  });

  const client =
    useLoaderData<ReadClientResponse>() as unknown as ReadClientResponse;

  useRouteUpdate({
    moduleName: MODULES_NAMES.AUTH,
    routeId: 'OAUTH_CLIENT_DETAIL',
    breadcrumbs: [
      {
        title: 'Auth',
        to: ROUTES({ organizationId, stackId, region })[
          'OAUTH_CLIENTS_OVERVIEW'
        ].to,
      },
      {
        title: 'OAuth Clients',
        to: ROUTES({ organizationId, stackId, region })['OAUTH_CLIENTS_ALL'].to,
      },
      {
        title: client?.data?.name || clientId,
      },
    ],
  });

  return (
    <AppContentGrid>
      <AppContentHeaderRoute className="col-span-12">
        <OauthClientHeader client={client?.data} />
      </AppContentHeaderRoute>

      <div className="col-span-12">
        <Card>
          <CardHeader>
            <CardTitle>Information</CardTitle>
            <CardDescription>Details about the OAuth client.</CardDescription>
          </CardHeader>

          <CardContent>
            {client?.data && (
              <div data-testid="details-oauth-client">
                <DescriptionList>
                  <DescriptionTerm>ID</DescriptionTerm>
                  <DescriptionDetails>
                    <Chip
                      {...chipVariantFromType['id']}
                      label={client.data.id}
                      copyMode="click"
                    />
                  </DescriptionDetails>

                  <DescriptionTerm>Name</DescriptionTerm>
                  <DescriptionDetails>
                    <Chip
                      {...chipVariantFromType['name']}
                      label={client.data.name}
                      copyMode="click"
                    />
                  </DescriptionDetails>

                  <DescriptionTerm>Type</DescriptionTerm>
                  <DescriptionDetails>
                    <Chip
                      {...chipVariantFromConsoleType[
                        client.data.public ? 'public' : 'private'
                      ]}
                      label={client.data.public ? 'Public' : 'Private'}
                    />
                  </DescriptionDetails>

                  <DescriptionTerm>Description</DescriptionTerm>
                  <DescriptionDetails>
                    {client.data.description}
                  </DescriptionDetails>

                  <DescriptionTerm>Redirect URI</DescriptionTerm>
                  <DescriptionDetails>
                    <div className="grid gap-2">
                      {client.data.redirectUris?.map(
                        (uri: string, index: number) => (
                          <Chip
                            {...chipVariantFromType['string']}
                            label={uri}
                            key={index}
                            shouldFormatLabel={false}
                            maxWidth="xl"
                            copyMode="click"
                          />
                        )
                      )}
                    </div>
                  </DescriptionDetails>

                  <DescriptionTerm>Post Logout Redirect URI</DescriptionTerm>
                  <DescriptionDetails>
                    <div className="grid gap-2">
                      {client.data.postLogoutRedirectUris?.map(
                        (uri: string, index: number) => (
                          <Chip
                            {...chipVariantFromType['string']}
                            label={uri}
                            key={index}
                            shouldFormatLabel={false}
                            maxWidth="xl"
                            copyMode="click"
                          />
                        )
                      )}
                    </div>
                  </DescriptionDetails>

                  <DescriptionTerm>Scopes</DescriptionTerm>
                  <DescriptionDetails>
                    {client.data.scopes?.length &&
                    client.data.scopes?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {client.data.scopes?.map(
                          (scope: string, index: number) => (
                            <Chip
                              {...chipVariantFromConsoleType['scopes']}
                              label={scope}
                              key={index}
                              shouldFormatLabel={false}
                              copyMode="click"
                            />
                          )
                        )}
                      </div>
                    ) : (
                      <Chip
                        {...chipVariantFromType['undefined']}
                        label="No scopes defined"
                      />
                    )}
                  </DescriptionDetails>

                  <DescriptionTerm>Metadata</DescriptionTerm>
                  <DescriptionDetails>
                    <PreviewJson
                      className="w-full"
                      json={client.data.metadata ?? {}}
                      defaultUnfoldAll={false}
                    />
                  </DescriptionDetails>
                </DescriptionList>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="col-span-12">
        <Card>
          <CardHeader>
            <CardTitle>Secrets</CardTitle>
            <CardDescription>
              List of all clients secrets associated with this OAuth client.
            </CardDescription>
          </CardHeader>

          <CreateOAuthClientSecretDialog
            clientId={clientId}
            routeParams={{
              organizationId,
              stackId,
              region,
            }}
          />

          <CardContent>
            {client?.data && <SecretsOAuthClient client={client.data} />}
          </CardContent>
        </Card>
      </div>
    </AppContentGrid>
  );
}
