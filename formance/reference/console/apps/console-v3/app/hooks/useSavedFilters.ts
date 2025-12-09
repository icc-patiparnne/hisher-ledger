import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useRouteGuard } from './useRouteGuard';

export type SavedFilterModel = {
  name: string;
  searchParams: string;
  tableId: string;
};

export const importConfigSchema = z.array(
  z.object({
    name: z.string().min(1),
    searchParams: z.string().min(1),
    tableId: z.string().min(1),
  })
);

export function useSavedFilters() {
  const { organizationId, stackId } = useRouteGuard({
    componentName: 'useSavedFilters',
  });

  const storageKey = `${organizationId}-${stackId}:saved-filters`;
  const [savedFilters, setSavedFilters] = useLocalStorage<SavedFilterModel[]>(
    storageKey,
    []
  );

  const listSavedFiltersByTableId = useCallback(
    (tableId: string): SavedFilterModel[] =>
      savedFilters.filter((savedFilter) => savedFilter.tableId === tableId),
    [savedFilters]
  );

  const getSavedFilterByName = useCallback(
    (name: string): SavedFilterModel | undefined =>
      savedFilters.find((filter) => filter.name === name),
    [savedFilters]
  );

  const isSavedFilterNameExist = useCallback(
    (name: string): boolean =>
      savedFilters.some((filter) => filter.name === name),
    [savedFilters]
  );

  const saveFilter = useCallback(
    (name: string, searchParams: string, tableId: string): void => {
      if (!isSavedFilterNameExist(name)) {
        const newSavedFilter: SavedFilterModel = {
          name,
          searchParams,
          tableId,
        };
        setSavedFilters((prev) => [...prev, newSavedFilter]);

        toast.success('Filter saved', {
          description: `Filter "${name}" has been saved successfully.`,
        });
      }
    },
    [isSavedFilterNameExist, setSavedFilters]
  );

  const removeSavedFilter = useCallback(
    (name: string): void => {
      setSavedFilters((prev) => prev.filter((filter) => filter.name !== name));

      toast.info('Filter removed', {
        description: `Filter "${name}" has been removed.`,
      });
    },
    [setSavedFilters]
  );

  const removeAllSavedFilters = useCallback((): void => {
    setSavedFilters([]);

    toast.info('All filters removed', {
      description: 'All saved filters have been cleared.',
    });
  }, [setSavedFilters]);

  const importSavedFilters = useCallback(
    (filtersJson: string): void => {
      try {
        const config = JSON.parse(filtersJson);
        importConfigSchema.parse(config);
        setSavedFilters(config);

        toast.success('Filters imported', {
          description: `Successfully imported ${config.length} filter(s).`,
        });
      } catch (error) {
        toast.error('Import failed', {
          description: 'Invalid filter configuration format.',
        });
        throw error;
      }
    },
    [setSavedFilters]
  );

  const exportSavedFilters = useCallback(
    (): string => JSON.stringify(savedFilters, null, 2),
    [savedFilters]
  );

  return {
    savedFilters,
    listSavedFiltersByTableId,
    getSavedFilterByName,
    isSavedFilterNameExist,
    saveFilter,
    removeSavedFilter,
    removeAllSavedFilters,
    importSavedFilters,
    exportSavedFilters,
  };
}
