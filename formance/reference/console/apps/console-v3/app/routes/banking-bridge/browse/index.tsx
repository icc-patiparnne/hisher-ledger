import React from 'react';

import { MODULES_NAMES } from '@platform/utils';
import { useOutletContext } from 'react-router';

import { AppContentGrid } from '../../../components/app-content';
import ModuleOverviewHeader from '../../../components/module-overview-header';
import { useMicroStack } from '../../../hooks/useMicroStack';
import { useModules } from '../../../hooks/useModules';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { CurrentContext } from '../../../root';
import { TNavModule } from '../../../types/nav-modules';

export default function BankingBridgeBrowse() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'banking-bridge-browse',
  });

  const context = useOutletContext<CurrentContext>();

  const { getModule } = useModules({
    organizationId,
    stackId,
    region,
    context,
  });

  const module = getModule(MODULES_NAMES.BANKING_BRIDGE);

  const { isMicroStack } = useMicroStack(context);

  return (
    <>
      <ModuleOverviewHeader
        module={module as TNavModule}
        organizationId={organizationId}
        stackId={stackId}
        isMicroStack={isMicroStack}
      />

      <AppContentGrid></AppContentGrid>
    </>
  );
}
