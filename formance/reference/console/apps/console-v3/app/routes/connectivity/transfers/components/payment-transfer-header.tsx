import { Info, SendHorizonal } from 'lucide-react';
import React from 'react';

import { useAction } from '@platform/remix';
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

import { Status } from '@platform/sdks/formance/src/models/components';
import { ACTIONS_ROUTES } from '../../../../utils/actions';
import { NormalizedTransferInitiationModel } from '../../../../utils/sdk/payments/models';
import { CONNECTIVITY_ACTION_UPDATE_TRANSFER } from '../../constants';
import PaymentTransferAction from './payment-transfer-actions';

type TPaymentTransferHeaderProps = {
  paymentTransfer: NormalizedTransferInitiationModel;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PaymentTransferHeader({
  paymentTransfer,
}: TPaymentTransferHeaderProps) {
  const { organizationId, stackId, region, paymentTransferId } = useRouteGuard({
    componentName: 'payment-transfer-header',
    requiredParams: ['paymentTransferId'],
  });

  const {
    submit: updateTransferStatus,
    isSubmitting: isUpdatingTransferStatus,
  } = useAction({
    formAction: CONNECTIVITY_ACTION_UPDATE_TRANSFER,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      CONNECTIVITY_ACTION_UPDATE_TRANSFER
    ].to,
  });

  const handleUpdateTransferStatus = (transferId: string, status: Status) => {
    updateTransferStatus({ transferId, status });
  };

  return (
    <Card data-header="payment-transfer">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="cobaltDark" size="icon-md" notClickable>
                <SendHorizonal />
              </Button>
              <CardTitle>Transfer</CardTitle>
            </div>

            <div className="min-w-0 flex-1 flex items-center gap-2">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Chip
                  {...chipVariantFromType['id']}
                  label={paymentTransferId}
                  maxWidth="xl"
                  copyMode="click"
                />
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            <PaymentTransferAction
              transfer={paymentTransfer}
              canUpdateStatus={
                paymentTransfer.status === 'WAITING_FOR_VALIDATION'
              }
              onUpdateTransferStatus={handleUpdateTransferStatus}
              isUpdatingTransferStatus={isUpdatingTransferStatus}
            />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon-md">
                  <Info />
                </Button>
              </SheetTrigger>
              <SheetContent className="lg:w-[700px] sm:max-w-none flex flex-col">
                <SheetHeader>
                  <SheetTitle>Inspect Data</SheetTitle>
                  <SheetDescription>
                    Transfer information as JSON
                  </SheetDescription>
                </SheetHeader>

                <Separator className="mt-6 mb-8" />

                <div className="flex flex-col h-full">
                  <div className="overflow-y-scroll no-scrollbar flex-1">
                    <PreviewJson json={paymentTransfer} className="pb-36" />
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
