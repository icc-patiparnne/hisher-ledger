import { AlertCircle } from 'lucide-react';
import React from 'react';

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertTitle,
  Button,
  CodeSnippet,
} from '@platform/ui';
import { FCTL_SNIPPETS } from '@platform/utils';
import { useOutletContext } from 'react-router';
import { useMicroStack } from '../hooks/useMicroStack';
import { usePortal } from '../hooks/usePortal';
import { useRouteGuard } from '../hooks/useRouteGuard';
import { CurrentContext } from '../root';

export default function ModuleOverviewAlert({
  moduleName,
}: {
  moduleName: string;
}) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'module-overview-alert',
  });
  const context = useOutletContext<CurrentContext>();
  const { isMicroStack } = useMicroStack(context);
  const { redirectToPortal } = usePortal({ organizationId, stackId });

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
      <Alert variant="destructive" className="max-w-md mx-auto my-4">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="font-semibold">Module not enabled</AlertTitle>
        <AlertDescription>
          You can enable the module from the from portal or using fctl.
        </AlertDescription>
        <AlertContent>
          <Button variant="primary" onClick={redirectToPortal} size="sm">
            Install from Portal
          </Button>

          {!isMicroStack && (
            <>
              <p className="text-center text-muted-foreground">OR</p>
              <CodeSnippet
                {...FCTL_SNIPPETS({
                  organizationId,
                  stackId,
                  regionId: region,
                  moduleName: moduleName,
                })['STACK_MODULES_ENABLE'].snippet}
              />
            </>
          )}
        </AlertContent>
      </Alert>
    </div>
  );
}
