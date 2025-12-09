import { TLedgerFavorite } from '../../../hooks/useFavorites';
import { NormalizedLedgerModel } from '../../../utils/sdk/ledger/models';

type TFilterLedgerListByFavorites = {
  ledgers: NormalizedLedgerModel[];
  isFavorite: (item: TLedgerFavorite) => boolean;
  favorites: TLedgerFavorite[] | undefined;
};

export type TFilterLedgerListByFavoritesReturn = {
  label: string;
  id: string;
  favorite: boolean;
};

export const filterLedgerListByFavorites = ({
  ledgers,
  isFavorite,
  favorites,
}: TFilterLedgerListByFavorites): TFilterLedgerListByFavoritesReturn[] =>
  ledgers
    .map((ledger: NormalizedLedgerModel) => ({
      label: ledger.name,
      id: ledger.name,
      favorite: isFavorite({ name: ledger.name, id: ledger.id || 0 }),
    }))
    .sort((a) => {
      const ledgerFav = favorites && favorites.find((f) => f.name === a.label);
      if (ledgerFav) {
        return -1;
      } else {
        return 0;
      }
    });
