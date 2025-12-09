import { Info, Wallet } from 'lucide-react';
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
import { Link } from 'react-router';
import { useFavorites } from '../../../hooks/useFavorites';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { ROUTES } from '../../../utils/routes';
import { NormalizedWalletModel } from '../../../utils/sdk/wallets/models';

export default function WalletHeader({
  wallet,
}: {
  wallet: NormalizedWalletModel;
}) {
  const { organizationId, stackId, region, walletId } = useRouteGuard({
    componentName: 'wallet-header',
    requiredParams: ['walletId'],
  });

  const { toggleFavorite, isFavorite } = useFavorites('wallets.wallets');

  return (
    <Card data-header="wallet">
      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="emerald" size="icon-md" notClickable>
                <Wallet />
              </Button>
              <CardTitle className="flex gap-1">
                <span>Wallet</span>
              </CardTitle>
            </div>
            <div className="min-w-0 flex-1 flex items-center gap-2">
              <div className="overflow-x-auto no-scrollbar rounded-md">
                <Link
                  to={
                    ROUTES({
                      organizationId,
                      stackId,
                      region,
                      walletId,
                    })['WALLET_DETAIL'].to
                  }
                >
                  <Chip
                    {...chipVariantFromType['id']}
                    label={walletId}
                    maxWidth="xl"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            <Favorite
              isFavorite={isFavorite({ id: wallet.id, name: wallet.name })}
              setIsFavorite={() =>
                toggleFavorite({ id: wallet.id, name: wallet.name })
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
                    Information about the wallet.
                  </SheetDescription>
                </SheetHeader>

                <Separator className="my-4" />

                <div className="overflow-y-scroll flex-1 no-scrollbar p-4">
                  <PreviewJson
                    className="w-full"
                    json={wallet ?? {}}
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
