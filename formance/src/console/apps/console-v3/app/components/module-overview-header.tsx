import { Settings } from 'lucide-react';
import React from 'react';

import { Button, ContentHeader } from '@platform/ui';
import { usePortal } from '../hooks/usePortal';
import { TNavModule } from '../types/nav-modules';
import { LayoutHeaderConsole } from './layout';

interface ModuleOverviewHeaderProps {
  module: TNavModule;
  organizationId: string;
  stackId: string;
  isMicroStack: boolean;
}

export default function ModuleOverviewHeader({
  module,
  organizationId,
  stackId,
  isMicroStack,
}: ModuleOverviewHeaderProps) {
  const { redirectToPortal } = usePortal({ organizationId, stackId });

  return (
    <>
      <LayoutHeaderConsole
        contentHeader={
          <ContentHeader
            eyebrow={module.type}
            iconCustom={module.name}
            title={module?.displayName}
            description={module?.description}
          >
            {!isMicroStack && (
              <Button variant="primary" size="sm" onClick={redirectToPortal}>
                <Settings className="w-4 h-4 mr-2" />
                Manage module
              </Button>
            )}
          </ContentHeader>
        }
      />
    </>
  );
}
