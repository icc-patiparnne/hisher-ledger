import { Info, Server } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import {
  Button,
  Card,
  CardContent,
  CardTitle,
  Chip,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
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
import { formatDate } from '@platform/utils';
import { chipVariantFromConsoleType } from '../../../components/chip';
import { useFavorites } from '../../../hooks/useFavorites';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { ROUTES } from '../../../utils/routes';
import {
  NormalizedLedgerModel,
  NormalizedStatsModel,
} from '../../../utils/sdk/ledger/models';

type TLedgerHeaderProps = {
  ledger: NormalizedLedgerModel;
  ledgerStats: NormalizedStatsModel;
};

export default function LedgerHeader({
  ledger,
  ledgerStats,
}: TLedgerHeaderProps) {
  const { organizationId, stackId, region, ledgerName } = useRouteGuard({
    componentName: 'ledger-header',
    requiredParams: ['ledgerName'],
  });

  const { toggleFavorite, isFavorite } = useFavorites('ledger.ledgers');

  return (
    <Card data-header="ledger">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="emerald" size="icon-md" notClickable>
                <Server />
              </Button>
              <CardTitle>Ledger</CardTitle>
            </div>
            <div className="min-w-0 flex-1 flex items-center gap-2">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Link
                  to={
                    ROUTES({ organizationId, stackId, region, ledgerName })[
                      'LEDGER_DETAIL'
                    ].to
                  }
                >
                  <Chip
                    {...chipVariantFromConsoleType['ledger']}
                    label={ledgerName}
                    maxWidth="xl"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            <Favorite
              isFavorite={isFavorite({ name: ledgerName, id: ledger.id || 0 })}
              setIsFavorite={() =>
                toggleFavorite({ name: ledgerName, id: ledger.id || 0 })
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
                  <SheetTitle>Information</SheetTitle>
                  <SheetDescription>
                    Ledger information and stats.
                  </SheetDescription>
                </SheetHeader>

                <Separator className="my-4" />

                <div className="overflow-y-scroll flex-1 no-scrollbar p-4">
                  <DescriptionList>
                    <DescriptionTerm>Ledger Name</DescriptionTerm>
                    <DescriptionDetails>
                      <Chip label={ledgerName} copyMode="click" />
                    </DescriptionDetails>

                    <DescriptionTerm>Transactions</DescriptionTerm>
                    <DescriptionDetails>
                      <Chip
                        variant="mint"
                        label={String(ledgerStats.transactions)}
                      />
                    </DescriptionDetails>

                    <DescriptionTerm>Accounts</DescriptionTerm>
                    <DescriptionDetails>
                      <Chip
                        variant="lilac"
                        label={String(ledgerStats.accounts)}
                      />
                    </DescriptionDetails>

                    {ledger?.addedAt && (
                      <>
                        <DescriptionTerm>Added at</DescriptionTerm>
                        <DescriptionDetails>
                          <span>{formatDate(ledger.addedAt)}</span>
                        </DescriptionDetails>
                      </>
                    )}

                    {ledger?.bucket && (
                      <>
                        <DescriptionTerm>Bucket</DescriptionTerm>
                        <DescriptionDetails>
                          <Chip
                            {...chipVariantFromConsoleType['ledger']}
                            label={ledger.bucket}
                            copyMode="click"
                          />
                        </DescriptionDetails>
                      </>
                    )}

                    {ledger?.metadata && (
                      <>
                        <DescriptionTerm>Metadata</DescriptionTerm>
                        <DescriptionDetails>
                          <PreviewJson
                            className="w-full"
                            json={ledger.metadata ?? {}}
                            defaultUnfoldAll
                          />
                        </DescriptionDetails>
                      </>
                    )}
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
