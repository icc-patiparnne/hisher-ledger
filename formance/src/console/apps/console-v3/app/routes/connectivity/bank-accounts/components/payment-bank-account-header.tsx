import { Banknote, Info } from 'lucide-react';
import React from 'react';

import {
  Button,
  Card,
  CardContent,
  CardTitle,
  Chip,
  chipVariantFromType,
  PreviewJson,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@platform/ui';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';

import { NormalizedBankAccountModel } from '../../../../utils/sdk/payments/models';

type TPaymentBankAccountHeaderProps = {
  paymentBankAccount: NormalizedBankAccountModel;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PaymentBankAccountHeader({
  paymentBankAccount,
}: TPaymentBankAccountHeaderProps) {
  const { paymentBankAccountId } = useRouteGuard({
    componentName: 'payment-bank-account-header',
    requiredParams: ['paymentBankAccountId'],
  });

  return (
    <Card data-header="payment-bank-account">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="lilac" size="icon-md" notClickable>
                <Banknote />
              </Button>
              <CardTitle>Bank Account</CardTitle>
            </div>

            <div className="min-w-0 flex-1 flex items-center gap-2">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Chip
                  {...chipVariantFromType['id']}
                  label={paymentBankAccountId}
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
                    Bank account information as JSON
                  </SheetDescription>
                </SheetHeader>

                <div className="p-4">
                  <div className="overflow-y-scroll no-scrollbar flex-1">
                    <PreviewJson json={paymentBankAccount} className="pb-36" />
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
