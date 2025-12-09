import { Coins, Info } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

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

import { ROUTES } from '../../../../utils/routes';
import { NormalizedCashPoolModel } from '../../../../utils/sdk/payments/models';

export default function PaymentCashPoolHeader({
  paymentCashPool,
}: {
  paymentCashPool: NormalizedCashPoolModel;
}) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'payment-cash-pool-header',
  });

  return (
    <Card data-header="payment-cash-pool">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="mint" size="icon-md">
                <Coins />
              </Button>
              <CardTitle>Cash Pool</CardTitle>
            </div>
            <div className="min-w-0 flex-1 flex items-center gap-2">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Link
                  to={
                    ROUTES({
                      organizationId,
                      stackId,
                      region,
                      paymentCashPoolId: paymentCashPool.id,
                    })['CONNECTIVITY_CASH_POOL_DETAIL'].to
                  }
                >
                  <Chip
                    {...chipVariantFromType['id']}
                    label={paymentCashPool.id}
                    copyMode="click"
                  />
                </Link>
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
                  <SheetTitle>Inspect data</SheetTitle>
                  <SheetDescription>
                    Payment cash pool information as JSON
                  </SheetDescription>
                </SheetHeader>

                <Separator className="mt-6 mb-8" />

                <div className="flex flex-col h-full">
                  <div className="overflow-y-scroll no-scrollbar flex-1">
                    <PreviewJson json={paymentCashPool} className="pb-24" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
