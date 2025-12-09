import { ArrowUpRight, Book, Globe, PlugZap } from 'lucide-react';
import React from 'react';
import {
  Link,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useOutletContext,
} from 'react-router';

import {
  AppCard,
  Badge,
  Button,
  CodeSnippet,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@platform/ui';
import {
  CONNECTORS,
  EXTERNAL_LINKS,
  FCTL_SNIPPETS,
  MODULES_LINKS,
  MODULES_NAMES,
  TConnector,
} from '@platform/utils';
import { AppContentGrid } from '../../../components/app-content';
import { useMicroStack } from '../../../hooks/useMicroStack';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { CurrentContext } from '../../../root';
import { ROUTES } from '../../../utils/routes';
import ConnectorOverviewHeader from './components/connector-overview-header';

type LoaderData = {
  connector: TConnector;
};

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderData> {
  const connector = Object.values(CONNECTORS).find(
    (connector) => connector.slug === params.connectorSlug
  );

  if (!connector) {
    throw redirect(ROUTES({}).CONNECTIVITY_OVERVIEW.to);
  }

  return { connector };
}

export default function ConnectorPage() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'connectors-slug',
    requiredParams: ['connectorSlug'],
  });

  const { connector } = useLoaderData<LoaderData>();

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_CONNECTOR_DETAIL',
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
    ],
  });

  const context = useOutletContext<CurrentContext>();
  const { isMicroStack } = useMicroStack(context);

  return (
    <>
      <ConnectorOverviewHeader connector={connector}>
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              connectorSlug: connector.slug,
            })['CONNECTIVITY_INSTALL_CONNECTOR'].to
          }
        >
          <Button variant="primary" size="sm">
            <PlugZap className="w-4 h-4 mr-2" />
            Install Connector
          </Button>
        </Link>
      </ConnectorOverviewHeader>

      <AppContentGrid className="md:gap-8">
        <div className="col-span-12 lg:col-span-7">
          <div className="prose prose-sm">
            {connector.documentation && (
              <>
                <h2>Prerequisites</h2>
                <p>
                  Before you begin, you need to have a {connector.displayName}{' '}
                  account.
                  <br />
                  Make sure you have a{' '}
                  <span className="capitalize">
                    {connector.displayName}
                  </span>{' '}
                  API key and secret, with the least amount of permissions
                  required to access the functionality of the{' '}
                  <span className="capitalize">{connector.displayName}</span>{' '}
                  Connector you plan to use.
                </p>
              </>
            )}

            <h2>How to install {connector.displayName} connector?</h2>
            <p>
              You can install the {connector.displayName} connector by using the
              form on this page or using the following fctl command:
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to={
                  ROUTES({
                    organizationId,
                    stackId,
                    region,
                    connectorSlug: connector.slug,
                  })['CONNECTIVITY_INSTALL_CONNECTOR'].to
                }
                className="block"
              >
                <Button variant="primary" className="w-full">
                  <PlugZap className="w-4 h-4 mr-2" />
                  Install Connector
                </Button>
              </Link>

              {!isMicroStack && (
                <>
                  <p className="text-center text-muted-foreground not-prose">
                    OR
                  </p>

                  <div className="not-prose">
                    <CodeSnippet
                      {...FCTL_SNIPPETS({
                        organizationId,
                        stackId,
                        connectorSlug: connector.slug,
                      })['CONNECTOR_INSTALL']?.snippet}
                      isDark
                      size="sm"
                    />
                  </div>
                </>
              )}
            </div>
            <p>
              Check out the documentation for more information for the{' '}
              <a
                href={connector.documentation}
                target="_blank"
                rel="noopener noreferrer"
              >
                config.json
              </a>
            </p>

            <h2>How to list {connector.displayName} connectors installed?</h2>
            <p>
              You can use the{' '}
              <a
                href={EXTERNAL_LINKS.DOCUMENTATION_FILTERING_SYNTAX.to}
                target="_blank"
                rel="noopener noreferrer"
              >
                filtering syntax{' '}
              </a>
              to list the {connector.displayName} connectors you have installed
              over the connectivity api.
            </p>
            <div className="not-prose">
              <CodeSnippet
                code={`{
  "$match": { "provider": "${connector.slug}" }
}`}
                language="bash"
                showLineNumbers={false}
                isDark
                size="sm"
              />
            </div>
            <p>
              Use the filtering capabilities directly from console on{' '}
              <Link
                to={
                  ROUTES({ organizationId, stackId, region })[
                    'CONNECTIVITY_CONNECTORS_INSTALLED'
                  ].to
                }
              >
                this page
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 mt-4 lg:mt-0">
          <div className="grid gap-2">
            <AppCard appIcon={Globe} title="Informations">
              <DescriptionList>
                <DescriptionTerm>Available from</DescriptionTerm>
                <DescriptionDetails>
                  <Badge variant="secondary">{connector.release}</Badge>
                </DescriptionDetails>
                <DescriptionTerm>
                  Type{connector.type.length > 1 ? 's' : ''}
                </DescriptionTerm>
                <DescriptionDetails>
                  <div className="flex flex-wrap gap-2">
                    {connector.type.map((type, index) => (
                      <Badge key={index} variant="gold">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </DescriptionDetails>
                {connector.website && (
                  <>
                    <DescriptionTerm>Website</DescriptionTerm>
                    <DescriptionDetails>
                      <Link
                        to={connector.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground underline-offset-4 hover:underline"
                      >
                        {connector.website}
                      </Link>
                    </DescriptionDetails>
                  </>
                )}
              </DescriptionList>
            </AppCard>

            {MODULES_LINKS[MODULES_NAMES.CONNECTIVITY]
              ?.OVERVIEW_DOCUMENTATION_LINKS && (
              <AppCard title="Connectivity Documentation" appIcon={Book}>
                <ul className="text-muted-foreground space-y-2">
                  {MODULES_LINKS[
                    MODULES_NAMES.CONNECTIVITY
                  ]?.OVERVIEW_DOCUMENTATION_LINKS?.map((link: any) => (
                    <li key={link.LABEL}>
                      <Link
                        to={link.LINK}
                        className="text-sm hover:text-foreground flex items-center gap-1"
                      >
                        {link.LABEL}
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </AppCard>
            )}

            {MODULES_LINKS[MODULES_NAMES.CONNECTIVITY]
              ?.OVERVIEW_BLOG_POST_LINKS && (
              <AppCard title="Blog posts" appIcon={Globe}>
                <ul className="text-muted-foreground space-y-2">
                  {MODULES_LINKS[
                    MODULES_NAMES.CONNECTIVITY
                  ]?.OVERVIEW_BLOG_POST_LINKS?.map((link: any) => (
                    <li key={link.LABEL}>
                      <Link
                        to={link.LINK}
                        className="text-sm hover:text-foreground flex items-center gap-1"
                      >
                        {link.LABEL}
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </AppCard>
            )}
          </div>
        </div>
      </AppContentGrid>
    </>
  );
}
