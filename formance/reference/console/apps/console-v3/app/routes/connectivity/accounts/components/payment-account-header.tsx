import { Info, Wallet2 } from 'lucide-react';
import React from 'react';

import {
  Button,
  Card,
  CardContent,
  CardTitle,
  Chip,
  chipVariantFromType,
  Favorite,
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

import { Link } from 'react-router';
import { useFavorites } from '../../../../hooks/useFavorites';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedPaymentAccountModel } from '../../../../utils/sdk/payments/models';

export default function PaymentAccountHeader({
  paymentAccount,
}: {
  paymentAccount: NormalizedPaymentAccountModel;
}) {
  const { organizationId, stackId, region, paymentAccountId } = useRouteGuard({
    componentName: 'payment-account-header',
    requiredParams: ['paymentAccountId'],
  });

  const { toggleFavorite, isFavorite } = useFavorites(
    'connectivity.paymentAccounts'
  );

  return (
    <Card data-header="payment-account">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="lilac" size="icon-md" notClickable>
                <Wallet2 />
              </Button>
              <CardTitle>Payment Account</CardTitle>
            </div>

            <div className="min-w-0 flex-1 flex items-center gap-2">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Link
                  to={
                    ROUTES({
                      organizationId,
                      stackId,
                      region,
                      paymentAccountId: paymentAccount.id,
                    })['CONNECTIVITY_ACCOUNT_DETAIL'].to
                  }
                >
                  <Chip
                    {...chipVariantFromType['id']}
                    label={paymentAccount.id}
                    maxWidth="xl"
                    copyMode="click"
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <Favorite
              isFavorite={isFavorite({
                id: paymentAccountId,
                name: paymentAccount.name ?? '',
              })}
              setIsFavorite={() =>
                toggleFavorite({
                  id: paymentAccountId,
                  name: paymentAccount.name ?? '',
                })
              }
            />
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
                    Payment account information as JSON
                  </SheetDescription>
                </SheetHeader>

                <Separator />

                <div className="flex flex-col h-full">
                  <div className="overflow-y-scroll no-scrollbar flex-1 p-4">
                    <PreviewJson json={paymentAccount} />
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
