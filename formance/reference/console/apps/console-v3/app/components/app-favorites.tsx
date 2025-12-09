import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AppCard,
  DataTable,
  ModuleIcon,
} from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';
import { Server, Users, Wallet } from 'lucide-react';
import React from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { useModules } from '../hooks/useModules';
import { useRouteGuard } from '../hooks/useRouteGuard';
import { CurrentContext } from '../root';
import { getPaymentAccountsColumns } from '../routes/connectivity/accounts/components/payment-accounts-list';
import { getLedgerAccountsColumns } from '../routes/ledger/components/ledger-accounts-list';
import { getLedgerListColumns } from '../routes/ledger/components/ledger-list';
import { getWalletColumns } from '../routes/wallets/components/wallets-list';

type TAppFavorites = {
  context: CurrentContext;
};

export default function AppFavorites({ context }: TAppFavorites) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'app-favorites',
  });

  const { allVisibleModules } = useModules({
    organizationId,
    stackId,
    region,
    context,
  });

  const modulesWithBookmarks = allVisibleModules.filter(
    (module) =>
      module.name === MODULES_NAMES.LEDGER ||
      module.name === MODULES_NAMES.WALLETS ||
      module.name === MODULES_NAMES.CONNECTIVITY
  );

  const {
    favorites: favoritesLedgers,
    isFavorite: isLedgerFavorite,
    toggleFavorite: toggleLedgerFavorite,
  } = useFavorites('ledger.ledgers');

  const {
    favorites: favoriteAccounts,
    isFavorite: isAccountFavorite,
    toggleFavorite: toggleAccountFavorite,
  } = useFavorites('ledger.ledgerAccounts');

  const {
    favorites: favoriteWallets,
    isFavorite: isWalletFavorite,
    toggleFavorite: toggleWalletFavorite,
  } = useFavorites('wallets.wallets');

  const {
    favorites: favoritePaymentAccounts,
    isFavorite: isPaymentAccountFavorite,
    toggleFavorite: togglePaymentAccountFavorite,
  } = useFavorites('connectivity.paymentAccounts');

  const ledgerColumns = getLedgerListColumns({
    organizationId,
    stackId,
    region,
    isFavorite: isLedgerFavorite,
    toggleFavorite: toggleLedgerFavorite,
    isFavoritesView: true,
  });

  const ledgerAccountsColumns = getLedgerAccountsColumns({
    organizationId,
    stackId,
    region,
    ledgerName: '',
    isFavorite: isAccountFavorite,
    toggleFavorite: toggleAccountFavorite,
    isFavoritesView: true,
  });

  const paymentAccountsColumns = getPaymentAccountsColumns({
    organizationId,
    stackId,
    region,
    isFavorite: isPaymentAccountFavorite,
    toggleFavorite: togglePaymentAccountFavorite,
    isFavoritesView: true,
  });

  const walletColumns = getWalletColumns({
    organizationId,
    stackId,
    region,
    isFavorite: isWalletFavorite,
    toggleFavorite: toggleWalletFavorite,
    isFavoritesView: true,
  });

  const renderLedgerContent = () => (
    <div className="space-y-6">
      {/* Favorite Ledgers */}
      <AppCard title="Favorite Ledgers" variant="emerald" appIcon={Server}>
        <DataTable
          columns={ledgerColumns}
          data={favoritesLedgers || []}
          displayPagination={true}
          searchConfig={[
            {
              placeholder: 'Filter by name',
              columnKey: 'name',
            },
          ]}
        />
      </AppCard>

      {/* Favorite Ledger Accounts */}
      {(favoriteAccounts?.length || 0) > 0 && (
        <AppCard
          title="Favorite Ledger Accounts"
          variant="lilac"
          appIcon={Users}
        >
          <DataTable
            columns={ledgerAccountsColumns}
            data={favoriteAccounts || []}
            displayPagination={true}
            searchConfig={[
              {
                placeholder: 'Filter by address or ledger',
                columnKey: 'address',
              },
              {
                placeholder: 'Filter by ledger',
                columnKey: 'ledgerName',
              },
            ]}
          />
        </AppCard>
      )}
    </div>
  );

  const renderWalletsContent = () => (
    <div className="space-y-6">
      <AppCard title="Favorite Wallets" variant="emerald" appIcon={Wallet}>
        <DataTable
          columns={walletColumns as any}
          data={favoriteWallets || []}
          displayPagination={true}
          searchConfig={[
            {
              placeholder: 'Filter by name',
              columnKey: 'name',
            },
          ]}
        />
      </AppCard>
    </div>
  );

  const renderConnectivityContent = () => (
    <div className="space-y-6">
      <AppCard
        title="Favorite Payment Accounts"
        variant="lilac"
        appIcon={Users}
      >
        <DataTable
          columns={paymentAccountsColumns}
          data={(favoritePaymentAccounts as any) || []}
          displayPagination={true}
          searchConfig={[
            {
              placeholder: 'Filter by name',
              columnKey: 'name',
            },
          ]}
        />
      </AppCard>
    </div>
  );

  return (
    <div className="p-4">
      <Accordion type="single" collapsible className="w-full">
        {modulesWithBookmarks.map((module) => (
          <AccordionItem key={module.name} value={module.name}>
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <ModuleIcon name={module.name} size="icon-lg" />
                <span className="font-semibold text-base text-foreground">
                  {module.displayName}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-2">
              {module.name === MODULES_NAMES.LEDGER && renderLedgerContent()}
              {module.name === MODULES_NAMES.WALLETS && renderWalletsContent()}
              {module.name === MODULES_NAMES.CONNECTIVITY &&
                renderConnectivityContent()}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
