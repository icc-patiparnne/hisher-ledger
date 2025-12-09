import { useLocalStorage } from '@uidotdev/usehooks';
import { toast } from 'sonner';
import { useRouteGuard } from './useRouteGuard';

// Ledger Types
export type TLedgerFavorite = {
  id: number;
  name: string;
};

export type TLedgerAccountFavorite = {
  ledgerName: string;
  address: string;
};

// Connectivity Types
export type TConnectivityAccountsFavorite = {
  id: string;
  name?: string;
};

export type TWalletsFavorite = {
  id: string;
  name: string;
};

// Type mapping for different modules and their subtypes
export type FavoriteTypeMap = {
  'ledger.ledgers': TLedgerFavorite;
  'ledger.ledgerAccounts': TLedgerAccountFavorite;
  'connectivity.paymentAccounts': TConnectivityAccountsFavorite;
  'wallets.wallets': TWalletsFavorite;
};

export function useFavorites<T extends keyof FavoriteTypeMap>(key: T) {
  const { organizationId, stackId } = useRouteGuard({
    componentName: 'useFavorites',
  });

  const [favorites, setFavorites] = useLocalStorage<FavoriteTypeMap[T][]>(
    `${organizationId}-${stackId}:favorites-${key}`,
    []
  );

  const toggleFavorite = (item: FavoriteTypeMap[T]) => {
    const existingIndex = favorites?.findIndex((favorite) => {
      switch (key) {
        case 'ledger.ledgers':
          return (
            (favorite as TLedgerFavorite).name ===
              (item as TLedgerFavorite).name &&
            (favorite as TLedgerFavorite).id === (item as TLedgerFavorite).id
          );
        case 'ledger.ledgerAccounts':
          return (
            (favorite as TLedgerAccountFavorite).address ===
              (item as TLedgerAccountFavorite).address &&
            (favorite as TLedgerAccountFavorite).ledgerName ===
              (item as TLedgerAccountFavorite).ledgerName
          );
        case 'connectivity.paymentAccounts':
          return (
            (favorite as TConnectivityAccountsFavorite).id ===
            (item as TConnectivityAccountsFavorite).id
          );
        case 'wallets.wallets':
          return (
            (favorite as TWalletsFavorite).name ===
              (item as TWalletsFavorite).name &&
            (favorite as TWalletsFavorite).id === (item as TWalletsFavorite).id
          );
        default:
          return false;
      }
    });

    if (existingIndex !== -1) {
      setFavorites(
        (prev) => prev?.filter((_, index) => index !== existingIndex) ?? []
      );
      toast.info('Removed from favorites');
    } else {
      setFavorites((prev) => [...(prev ?? []), item]);
      toast.success('Added to favorites', {});
    }
  };

  const isFavorite = (item: FavoriteTypeMap[T]): boolean =>
    favorites?.some((favorite) => {
      switch (key) {
        case 'ledger.ledgers':
          return (
            (favorite as TLedgerFavorite).name ===
              (item as TLedgerFavorite).name &&
            (favorite as TLedgerFavorite).id === (item as TLedgerFavorite).id
          );
        case 'ledger.ledgerAccounts':
          return (
            (favorite as TLedgerAccountFavorite).address ===
              (item as TLedgerAccountFavorite).address &&
            (favorite as TLedgerAccountFavorite).ledgerName ===
              (item as TLedgerAccountFavorite).ledgerName
          );
        case 'connectivity.paymentAccounts':
          return (
            (favorite as TConnectivityAccountsFavorite).id ===
            (item as TConnectivityAccountsFavorite).id
          );
        case 'wallets.wallets':
          return (
            (favorite as TWalletsFavorite).name ===
              (item as TWalletsFavorite).name &&
            (favorite as TWalletsFavorite).id === (item as TWalletsFavorite).id
          );
        default:
          return false;
      }
    }) ?? false;

  type ReturnType = {
    favorites: FavoriteTypeMap[T][] | undefined;
    setFavorites: (value: FavoriteTypeMap[T][]) => void;
    toggleFavorite: (item: FavoriteTypeMap[T]) => void;
    isFavorite: (item: FavoriteTypeMap[T]) => boolean;
  };

  return {
    favorites,
    setFavorites,
    toggleFavorite,
    isFavorite,
  } as ReturnType;
}

export function useMigrateFavorites() {
  const { organizationId, stackId } = useRouteGuard({
    componentName: 'useMigrateFavorites',
  });

  const migrationKey = `${organizationId}-${stackId}:favorites-migrated`;
  const [migrationCompleted, setMigrationCompleted] = useLocalStorage<boolean>(
    migrationKey,
    false
  );

  const migrateFavorites = () => {
    if (migrationCompleted) {
      return; // Migration already completed for this org-stack combination
    }

    const favoriteKeys: (keyof FavoriteTypeMap)[] = [
      'ledger.ledgers',
      'ledger.ledgerAccounts',
      'connectivity.paymentAccounts',
      'wallets.wallets',
    ];

    favoriteKeys.forEach((key) => {
      const legacyKey = `favorites-${key}`;
      const newKey = `${organizationId}-${stackId}:favorites-${key}`;

      // Check if legacy data exists
      const legacyData = localStorage.getItem(legacyKey);

      if (legacyData) {
        try {
          const parsedLegacyData = JSON.parse(legacyData);

          if (Array.isArray(parsedLegacyData) && parsedLegacyData.length > 0) {
            // Check if new scoped data already exists
            const existingNewData = localStorage.getItem(newKey);
            let newFavorites = [];

            if (existingNewData) {
              try {
                const parsedNewData = JSON.parse(existingNewData);
                if (Array.isArray(parsedNewData)) {
                  newFavorites = parsedNewData;
                }
              } catch (e) {
                // Failed to parse existing scoped favorites, continue with empty array
              }
            }

            // Merge legacy data with existing scoped data (avoid duplicates)
            const areItemsEqual = (
              item1: any,
              item2: any,
              keyType: keyof FavoriteTypeMap
            ): boolean => {
              switch (keyType) {
                case 'ledger.ledgers':
                  return item1.name === item2.name && item1.id === item2.id;
                case 'ledger.ledgerAccounts':
                  return (
                    item1.address === item2.address &&
                    item1.ledgerName === item2.ledgerName
                  );
                case 'connectivity.paymentAccounts':
                  return item1.id === item2.id;
                case 'wallets.wallets':
                  return item1.name === item2.name && item1.id === item2.id;
                default:
                  return false;
              }
            };

            const mergedFavorites = [...newFavorites];
            parsedLegacyData.forEach((legacyItem: any) => {
              const exists = mergedFavorites.some((newItem) =>
                areItemsEqual(legacyItem, newItem, key)
              );
              if (!exists) {
                mergedFavorites.push(legacyItem);
              }
            });

            // Save merged data to new scoped key
            localStorage.setItem(newKey, JSON.stringify(mergedFavorites));
          }
        } catch (e) {
          // Failed to migrate favorites for this key, continue
        }

        // Remove legacy key regardless of whether migration was successful
        localStorage.removeItem(legacyKey);
      } else {
        // Even if no data exists, remove the key to clean up
        localStorage.removeItem(legacyKey);
      }
    });

    // Mark migration as completed
    setMigrationCompleted(true);
  };

  return { migrateFavorites, migrationCompleted };
}
