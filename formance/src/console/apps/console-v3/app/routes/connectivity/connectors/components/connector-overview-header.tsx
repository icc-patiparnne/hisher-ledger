import React from 'react';

import { ContentHeader } from '@platform/ui';
import { TConnector } from '@platform/utils';
import { LayoutHeaderConsole } from '../../../../components/layout';

type ConnectorOverviewHeaderProps = {
  connector: TConnector;
} & React.PropsWithChildren;

export default function ConnectorOverviewHeader({
  connector,
  children,
}: ConnectorOverviewHeaderProps) {
  return (
    <LayoutHeaderConsole
      contentHeader={
        <ContentHeader
          eyebrow="Connector"
          iconCustom={connector.name}
          title={connector.displayName}
          description={connector.description}
        >
          {children}
        </ContentHeader>
      }
    />
  );
}
