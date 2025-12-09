import { HammerIcon, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Link, LoaderFunction, useLoaderData } from 'react-router';

import {
  Button,
  buttonVariants,
  CardConnector,
  cn,
  ContentHeader,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  Label,
  Toggle,
} from '@platform/ui';
import {
  CONNECTORS,
  EXTERNAL_LINKS,
  MODULES_GATEWAYS,
  MODULES_NAMES,
  type TConnector,
  type TConnectorName,
  type TConnectorType,
} from '@platform/utils';
import { AppContentGrid } from '../../../../components/app-content';
import { LayoutHeaderConsole } from '../../../../components/layout';
import { FEATURES } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedConnectorConfigsModel } from '../../../../utils/sdk/payments/models';
import { NormalizedListAllAvailableConnectorsResponse } from '../../../../utils/sdk/payments/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';

export type Data = {
  connectorsConfig: NormalizedListAllAvailableConnectorsResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  connectorsConfig: { data: NormalizedConnectorConfigsModel };
}>;

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
      const connectorsConfig = await api.payments.listAllAvailableConnectors();

      return wrapLoaderWithProps<Data>(
        {
          connectorsConfig,
        },
        version
      );
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.PAYMENTS],
    FEATURES.payments
  )) as LoaderData;
};

export default function ConnectorsAll() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'connectors-all',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_CONNECTORS_ALL',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'Browse Connectors',
      },
    ],
  });

  const data = useLoaderData<LoaderData>();
  const availableConnectorsFromAPI = Object.keys(
    data.connectorsConfig?.data || {}
  );
  const forceAvailable = ['dummypay']; // This is because the API is not returning the dummy-pay connector config

  const [selectedTypes, setSelectedTypes] = useState<Set<TConnectorType>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState('');

  const isConnectorAvailable = (connector: TConnector) =>
    availableConnectorsFromAPI.includes(
      data?.version === '3' ? connector.slug : connector.slug.toUpperCase()
    ) ||
    forceAvailable.includes(
      data?.version === '3' ? connector.slug : connector.slug.toUpperCase()
    );

  const allConnectors = Object.entries(CONNECTORS).map(([name, connector]) => ({
    name: name as TConnectorName,
    connector,
    isAvailable: isConnectorAvailable(connector),
  }));

  const filteredConnectors = allConnectors.filter(({ connector }) => {
    const matchesType =
      selectedTypes.size === 0 ||
      connector.type.some((type) => selectedTypes.has(type));
    const matchesSearch =
      searchQuery.trim() === '' ||
      connector.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connector.slug.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  // Split into available and coming soon, sorted alphabetically
  const availableConnectors = filteredConnectors
    .filter(({ isAvailable }) => isAvailable)
    .sort((a, b) =>
      a.connector.displayName.localeCompare(b.connector.displayName)
    );

  const comingSoonConnectors = filteredConnectors
    .filter(({ isAvailable }) => !isAvailable)
    .sort((a, b) =>
      a.connector.displayName.localeCompare(b.connector.displayName)
    );

  // Get unique types for filters
  const uniqueTypes = Array.from(
    new Set(allConnectors.flatMap(({ connector }) => connector.type))
  ).sort();

  const handleTypeToggle = (type: TConnectorType) => {
    const newSelectedTypes = new Set(selectedTypes);
    if (newSelectedTypes.has(type)) {
      newSelectedTypes.delete(type);
    } else {
      newSelectedTypes.add(type);
    }
    setSelectedTypes(newSelectedTypes);
  };

  const clearAllFilters = () => {
    setSelectedTypes(new Set());
    setSearchQuery('');
  };

  const renderConnectorCard = ({
    name,
    connector,
    isAvailable,
  }: (typeof allConnectors)[0]) => (
    <CardConnector
      key={name}
      {...connector}
      isAvailable={isAvailable}
      seeLink={
        ROUTES({
          organizationId,
          stackId,
          region,
          connectorSlug: connector.slug,
        })['CONNECTIVITY_CONNECTOR_DETAIL'].to
      }
      installLink={
        ROUTES({
          organizationId,
          stackId,
          region,
          connectorSlug: connector.slug,
        })['CONNECTIVITY_INSTALL_CONNECTOR'].to
      }
      logoBackground={true}
      asRemixLink={Link}
    />
  );

  return (
    <>
      <LayoutHeaderConsole
        contentHeader={
          <ContentHeader
            eyebrow="Connectivity"
            iconCustom="CONNECTIVITY"
            title="Connectors"
            description="Find the pefect payment solution to fit your business"
          />
        }
      />

      <AppContentGrid>
        <div className="col-span-12 xl:col-span-3 lg:mr-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <InputGroup className="bg-background">
                <InputGroupAddon>
                  <Search className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Search connectors..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                />
              </InputGroup>

              <div className="mt-4 space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">
                  Filter by type
                </Label>

                <div className="flex xl:flex-col gap-2 flex-wrap items-center xl:items-start">
                  <Button
                    variant={selectedTypes.size === 0 ? 'primary' : 'outline'}
                    size="sm"
                    onClick={clearAllFilters}
                  >
                    All connectors
                  </Button>
                  {uniqueTypes.map((type) => (
                    <Toggle
                      key={type}
                      pressed={selectedTypes.has(type)}
                      onPressedChange={() => handleTypeToggle(type)}
                      className={cn(
                        buttonVariants({
                          variant: selectedTypes.has(type)
                            ? 'primary'
                            : 'outline',
                          size: 'sm',
                        }),
                        'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'
                      )}
                    >
                      {type}
                    </Toggle>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 hidden xl:block">
              <Label className="text-sm font-medium text-muted-foreground">
                Explore more
              </Label>

              <div className="flex w-full max-w-lg flex-col gap-6">
                <Item variant="outline">
                  <ItemMedia variant="icon">
                    <HammerIcon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>In need of a custom integration?</ItemTitle>
                    <ItemDescription>
                      Contact our team to discuss your needs
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Link
                      to={EXTERNAL_LINKS.WEBSITE_CONTACT_US.to}
                      target="_blank"
                    >
                      <Button size="sm" variant="outline">
                        Contact
                      </Button>
                    </Link>
                  </ItemActions>
                </Item>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-9">
          {availableConnectors.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">
                Available Connectors
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                {availableConnectors.map(renderConnectorCard)}
              </div>
            </div>
          )}

          {comingSoonConnectors.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Coming Soon</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                {comingSoonConnectors.map(renderConnectorCard)}
              </div>
            </div>
          )}

          {/* Empty state */}
          {filteredConnectors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No connectors found matching your filters.
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Show all connectors
              </Button>
            </div>
          )}
        </div>
      </AppContentGrid>
    </>
  );
}
