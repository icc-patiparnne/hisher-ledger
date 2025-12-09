import { FileBarChart, Info } from 'lucide-react';
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

import { omit } from 'lodash-es';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { NormalizedReconciliationModel } from '../../../utils/sdk/reconciliation/models';

export default function ReportHeader({
  report,
}: {
  report: NormalizedReconciliationModel;
}) {
  const { reportId } = useRouteGuard({
    componentName: 'report-header',
    requiredParams: ['reportId'],
  });

  return (
    <Card data-header="report">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="cobaltDark" size="icon-md" notClickable>
                <FileBarChart />
              </Button>
              <CardTitle className="flex gap-1">
                <span>Report</span>
              </CardTitle>
            </div>
            <div className="min-w-0 flex-1 flex items-center gap-2">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Chip
                  {...chipVariantFromType['id']}
                  label={reportId}
                  maxWidth="xl"
                  copyMode="click"
                />
              </div>
            </div>
          </div>

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
                    Information about the report.
                  </SheetDescription>
                </SheetHeader>

                <Separator className="my-4" />

                <PreviewJson
                  className="w-full"
                  json={omit(report, ['balances']) ?? {}}
                  defaultUnfoldAll={true}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
