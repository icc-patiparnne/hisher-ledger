import React from 'react';
import { Link } from 'react-router';

import { Connector } from '@platform/sdks/formance/src/models/components';
import {
  Button,
  Card,
  CardContent,
  CardTitle,
  Chip,
  chipVariantFromType,
} from '@platform/ui';
import { KeyRound } from 'lucide-react';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { ROUTES } from '../../../../utils/routes';

import ResetConnector from './reset-connector';
import UninstallConnectorDialog from './uninstall-connector';

type TConnectorHeaderProps = {
  connector: any;
  showActions?: boolean;
};

export default function ConnectorHeader({
  connector,
  showActions = true,
}: TConnectorHeaderProps) {
  const { organizationId, stackId, region, connectorId, provider } =
    useRouteGuard({
      componentName: 'connector-header',
      requiredParams: ['connectorId'],
      requiredSearchParams: ['provider'],
    });

  return (
    <Card data-header="connector">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="cobalt" size="icon-md" notClickable>
                <KeyRound />
              </Button>
              <CardTitle>Connector</CardTitle>
            </div>
            <div className="min-w-0 flex-1">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Link
                  to={
                    ROUTES({
                      organizationId,
                      stackId,
                      region,
                      connectorId,
                      provider,
                    })['CONNECTIVITY_CONNECTOR_INSTALLED_DETAIL'].to
                  }
                >
                  <Chip
                    {...chipVariantFromType['name']}
                    label={
                      connector?.name || connector?.data?.name || 'default'
                    }
                  />
                </Link>
              </div>
            </div>
          </div>
          {showActions && (
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <UninstallConnectorDialog
                  connector={connector}
                  connectorId={connectorId}
                  provider={provider.toUpperCase() as Connector}
                />
                <ResetConnector
                  connector={connector}
                  connectorId={connectorId}
                  provider={provider.toUpperCase() as Connector}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
