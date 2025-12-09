import { Wallet } from 'lucide-react';

import {
  AppCard,
  ColumnDef,
  ContentHeader,
  DataTable,
  TypographyH3,
} from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';

import { useFavorites } from '../../../hooks/useFavorites';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ROUTES } from '../../../utils/routes';
import { getWalletColumns } from '../components/wallets-list';

export default function WalletsFavorites() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'wallets-favorites',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.WALLETS,
    routeId: 'WALLETS_OVERVIEW_FAVORITES',
    breadcrumbs: [
      {
        title: 'Wallets',
        to: ROUTES({ organizationId, stackId, region })['WALLETS_OVERVIEW'].to,
      },
      {
        title: 'Favorites',
      },
    ],
  });

  const {
    favorites: favoriteWallets,
    toggleFavorite: toggleWalletFavorite,
    isFavorite: isWalletFavorite,
  } = useFavorites('wallets.wallets');

  const walletsColumns = getWalletColumns({
    organizationId,
    stackId,
    region,
    isFavorite: isWalletFavorite,
    toggleFavorite: toggleWalletFavorite,
    isFavoritesView: true,
  }) as ColumnDef<{
    id: string;
    name: string;
  }>[];

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
          title="Favorite Wallets"
          description="A list of all your favorite wallets"
          variant="emerald"
          appIcon={Wallet}
        >
          <DataTable
            columns={walletsColumns}
            data={favoriteWallets}
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
    </>
  );
}
