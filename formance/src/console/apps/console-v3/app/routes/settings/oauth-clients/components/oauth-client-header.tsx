import { KeyRound } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { ROUTES } from '../../../../utils/routes';

import { Client } from '@platform/sdks/formance/src/models/components';
import {
  Button,
  Card,
  CardContent,
  CardTitle,
  Chip,
  chipVariantFromType,
} from '@platform/ui';
import DeleteOAuthClient from './delete-oauth-client';

type TOAuthClientHeaderProps = {
  client?: Client;
};

export default function OauthClientHeader({ client }: TOAuthClientHeaderProps) {
  const { organizationId, stackId, region, clientId } = useRouteGuard({
    componentName: 'oauth-client-header',
    requiredParams: ['clientId'],
  });

  return (
    <Card data-header="oauth-client">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="cobalt" size="icon-md" notClickable>
                <KeyRound />
              </Button>
              <CardTitle>OAuth Client</CardTitle>
            </div>
            <div className="min-w-0 flex-1">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Link
                  to={
                    ROUTES({
                      organizationId,
                      stackId,
                      region,
                      clientId,
                    })['OAUTH_CLIENT_DETAIL'].to
                  }
                >
                  <Chip
                    {...chipVariantFromType['name']}
                    label={client?.name || 'default'}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            {client && <DeleteOAuthClient client={client} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
