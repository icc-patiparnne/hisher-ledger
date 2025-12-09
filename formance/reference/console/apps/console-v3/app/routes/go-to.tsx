import { ContentHeader } from '@platform/ui';

import React from 'react';
import { AppContentGrid } from '../components/app-content';
import AppGoTo from '../components/app-go-to';
import { LayoutHeaderConsole } from '../components/layout';
import { useRouteGuard } from '../hooks/useRouteGuard';
import { useRouteUpdate } from '../hooks/useRouteUpdate';

export default function GoTo() {
  useRouteGuard({
    componentName: 'go-to',
    requiredParams: [],
  });

  useRouteUpdate({
    routeId: 'GO_TO',
    breadcrumbs: [
      {
        title: 'Go to',
      },
    ],
  });

  return (
    <>
      <LayoutHeaderConsole
        contentHeader={
          <ContentHeader
            title="Go to resource"
            description="Allows you to go to resources which you already know name or id."
          />
        }
      />
      <AppContentGrid>
        <div className="col-span-12">
          <div className="mt-8">
            <AppGoTo fromSearch />
          </div>
        </div>
      </AppContentGrid>
    </>
  );
}
