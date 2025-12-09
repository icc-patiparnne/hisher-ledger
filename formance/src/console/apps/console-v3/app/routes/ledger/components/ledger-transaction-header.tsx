import { Info, LayoutList } from 'lucide-react';
import React from 'react';

import {
  Button,
  Card,
  CardContent,
  CardTitle,
  Chip,
  chipVariantFromType,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Kbd,
  KbdGroup,
  PreviewJson,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useHotkeys,
} from '@platform/ui';
import { formatDate, padNumber } from '@platform/utils';
import { chipVariantFromConsoleType } from '../../../components/chip';
import { copyToClipboardToast } from '../../../utils/common';
import { NormalizedTransactionModel } from '../../../utils/sdk/ledger/models';

export default function LedgerTransactionHeader({
  ledgerTransaction,
}: {
  ledgerTransaction: NormalizedTransactionModel;
}) {
  const handleCopyTransaction = () => {
    if (ledgerTransaction) {
      const transactionJson = JSON.stringify(ledgerTransaction, null, 2);
      copyToClipboardToast(transactionJson, 'Transaction copied as JSON');
    }
  };

  useHotkeys([
    [
      'shift+c',
      () => {
        handleCopyTransaction();
      },
    ],
  ]);

  return (
    <Card data-header="ledger-transaction" className="h-full justify-center">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="mint" size="icon-md" notClickable>
                <LayoutList />
              </Button>
              <CardTitle>Transaction</CardTitle>
            </div>
            <div className="min-w-0 flex-1">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Chip
                  {...chipVariantFromConsoleType['transactionId']}
                  label={padNumber(ledgerTransaction?.id.toString())}
                  copyMode="click"
                />
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
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
                    Information about transaction with ID{' '}
                    {padNumber(ledgerTransaction?.id.toString())}
                  </SheetDescription>
                </SheetHeader>

                <Separator className="my-4" />

                <div className="overflow-y-scroll flex-1 no-scrollbar p-4">
                  <DescriptionList>
                    <DescriptionTerm>Transaction ID</DescriptionTerm>
                    <DescriptionDetails>
                      <Chip
                        {...chipVariantFromConsoleType['transactionId']}
                        label={padNumber(ledgerTransaction?.id.toString())}
                        copyMode="click"
                      />
                    </DescriptionDetails>

                    <DescriptionTerm>Timestamp</DescriptionTerm>
                    <DescriptionDetails>
                      <span className="whitespace-nowrap">
                        {ledgerTransaction?.timestamp
                          ? formatDate(ledgerTransaction?.timestamp)
                          : '-'}
                      </span>
                    </DescriptionDetails>

                    <DescriptionTerm>Reference</DescriptionTerm>
                    <DescriptionDetails>
                      <Chip
                        {...chipVariantFromConsoleType['reference']}
                        label={ledgerTransaction?.reference || 'None'}
                        copyMode="click"
                        size="md"
                      />
                    </DescriptionDetails>

                    <DescriptionTerm>Transaction reverted</DescriptionTerm>
                    <DescriptionDetails>
                      <Chip
                        {...chipVariantFromType[
                          ledgerTransaction?.reverted ? 'true' : 'false'
                        ]}
                        label={ledgerTransaction?.reverted ? 'Yes' : 'No'}
                        size="md"
                      />
                    </DescriptionDetails>

                    <DescriptionTerm>
                      <div className="flex items-center gap-2">
                        Transaction as JSON
                        <KbdGroup>
                          <Kbd>⇧</Kbd>
                          <Kbd>C</Kbd>
                        </KbdGroup>
                      </div>
                    </DescriptionTerm>
                    <DescriptionDetails>
                      <PreviewJson json={ledgerTransaction} />
                    </DescriptionDetails>
                  </DescriptionList>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
