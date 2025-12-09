import { Server, Users } from 'lucide-react';

import { AppCard, ContentHeader, DataTable, TypographyH3 } from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';
import { useFavorites } from '../../../hooks/useFavorites';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ROUTES } from '../../../utils/routes';
import { getLedgerAccountsColumns } from '../components/ledger-accounts-list';
import { getLedgerListColumns } from '../components/ledger-list';

export default function LedgerFavorites() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'ledger-favorites',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_OVERVIEW_FAVORITES',
    breadcrumbs: [
      {
        title: 'Ledger',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_OVERVIEW'].to,
      },
      {
        title: 'Favorites',
      },
    ],
  });

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

  const ledgerListColumns = getLedgerListColumns({
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

  return (
    <>
      <div className="col-span-12 mt-4">
        <ContentHeader
          title="Favorites"
          titleAs={TypographyH3}
          description={`
            Favorites are stored locally in your browser.
            <br />
            Clearing your browser's cache will remove them.`}
          withPadding={false}
        />
      </div>

      <div className="col-span-12">
        <AppCard
          title="Favorite Ledgers"
          description="A list of all your favorite ledgers"
          variant="emerald"
          appIcon={Server}
        >
          <DataTable
            columns={ledgerListColumns}
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
      </div>

      {(favoriteAccounts?.length || 0) > 0 && (
        <div className="col-span-12">
          <AppCard
            title="Favorite Ledger Accounts"
            description="A list of all your favorite accounts"
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
        </div>
      )}
    </>
  );
}
