import { Users } from 'lucide-react';

import { AppCard, ContentHeader, DataTable, TypographyH3 } from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';

import { useFavorites } from '../../../hooks/useFavorites';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ROUTES } from '../../../utils/routes';
import { NormalizedPaymentAccountModel } from '../../../utils/sdk/payments/models';
import { getPaymentAccountsColumns } from '../accounts/components/payment-accounts-list';

export default function ConnectivityFavorites() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'connectivity-favorites',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_OVERVIEW_FAVORITES',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'Favorites',
      },
    ],
  });

  const {
    favorites: paymentAccountsFavorites,
    toggleFavorite: togglePaymentAccountFavorite,
    isFavorite: isPaymentAccountFavorite,
  } = useFavorites('connectivity.paymentAccounts');

  const paymentAccountsColumns = getPaymentAccountsColumns({
    organizationId,
    stackId,
    region,
    isFavorite: isPaymentAccountFavorite,
    toggleFavorite: togglePaymentAccountFavorite,
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
          title="Favorite Payment Accounts"
          description="A list of all your favorite ledgers"
          variant="lilac"
          appIcon={Users}
        >
          <DataTable
            columns={paymentAccountsColumns}
            data={paymentAccountsFavorites as NormalizedPaymentAccountModel[]}
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
