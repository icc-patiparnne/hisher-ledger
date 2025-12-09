import { Currency, Info } from 'lucide-react';
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
import { NormalizedPaymentModel } from '../../../../utils/sdk/payments/models';

export default function PaymentHeader({
  payment,
}: {
  payment: NormalizedPaymentModel;
}) {
  const { paymentId } = useRouteGuard({
    componentName: 'payment-header',
    requiredParams: ['paymentId'],
  });

  return (
    <Card data-header="payment">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="emerald" size="icon-md" notClickable>
                <Currency />
              </Button>
              <CardTitle className="flex gap-1">
                <span>Payment</span>
              </CardTitle>
            </div>
            <div className="min-w-0 flex-1 flex items-center gap-2">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Chip
                  {...chipVariantFromType['id']}
                  label={paymentId}
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
                    Information about the payment.
                  </SheetDescription>
                </SheetHeader>

                <Separator />

                <div className="px-4">
                  <PreviewJson
                    className="w-full"
                    json={payment ?? {}}
                    defaultUnfoldAll={true}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
