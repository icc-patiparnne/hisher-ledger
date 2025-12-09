import { Info, Workflow } from 'lucide-react';
import React from 'react';

import {
  Button,
  Card,
  CardContent,
  CardTitle,
  Chip,
  chipVariantFromType,
  PreviewJson,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@platform/ui';

import { Link } from 'react-router';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { ROUTES } from '../../../utils/routes';
import { NormalizedWorkflowModel } from '../../../utils/sdk/flows/models';

export default function WorkflowHeader({
  workflow,
}: {
  workflow?: NormalizedWorkflowModel;
}) {
  const { organizationId, stackId, region, workflowId } = useRouteGuard({
    componentName: 'workflow-header',
    requiredParams: ['workflowId'],
  });

  return (
    <Card data-header="workflow">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="emerald" size="icon-md" notClickable>
                <Workflow />
              </Button>
              <CardTitle className="flex gap-1">
                <span>Workflow</span>
              </CardTitle>
            </div>
            <div className="min-w-0 flex-1 flex items-center gap-2">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Link
                  to={
                    ROUTES({ organizationId, stackId, region, workflowId })[
                      'FLOWS_WORKFLOW_DETAIL'
                    ].to
                  }
                >
                  <Chip {...chipVariantFromType['id']} label={workflowId} />
                </Link>
              </div>
            </div>
          </div>

          {workflow && (
            <div className="flex-shrink-0 flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon-md">
                    <Info />
                  </Button>
                </SheetTrigger>
                <SheetContent className="lg:w-[700px] sm:max-w-none flex flex-col">
                  <SheetHeader>
                    <SheetTitle>Information</SheetTitle>
                    <SheetDescription>
                      Information about the workflow.
                    </SheetDescription>
                  </SheetHeader>

                  <Separator className="my-4" />

                  <div className="overflow-y-scroll no-scrollbar">
                    <PreviewJson
                      className="w-full"
                      json={workflow ?? {}}
                      defaultUnfoldAll={true}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
