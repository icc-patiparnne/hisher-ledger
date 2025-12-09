import { Info, ShieldCheck } from 'lucide-react';
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

import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { NormalizedPolicyModel } from '../../../../utils/sdk/reconciliation/models';
import DeletePolicyDialog from '../../../reconciliation/components/delete-policy';

export default function PolicyHeader({
  policy,
}: {
  policy?: NormalizedPolicyModel;
}) {
  const { policyId } = useRouteGuard({
    componentName: 'policy-header',
    requiredParams: ['policyId'],
  });

  return (
    <Card data-header="policy">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="emerald" size="icon-md" notClickable>
                <ShieldCheck />
              </Button>
              <CardTitle className="flex gap-1">
                <span>Policy</span>
              </CardTitle>
            </div>
            <div className="min-w-0 flex-1 flex items-center gap-2">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Chip
                  {...chipVariantFromType['id']}
                  label={policyId}
                  maxWidth="xl"
                  copyMode="click"
                />
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="flex items-center gap-2">
              {policy && (
                <>
                  <DeletePolicyDialog policy={policy} policyId={policyId} />
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
                          Information about the policy.
                        </SheetDescription>
                      </SheetHeader>

                      <Separator />

                      <div className="p-4">
                        <PreviewJson
                          className="w-full"
                          json={policy ?? {}}
                          defaultUnfoldAll={true}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
