import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

type ResetParams = Record<string, string>;

type UseDataTableQueryOptions = {
  /**
   * Additional search parameters (besides the consolidated query and cursor) that should be
   * cleared whenever the filters change or reset. Useful for table-specific extras like sorts.
   */
  additionalKeysToClear?: string[];
};

type ConsolidatedQuery = { [key: string]: string };

type UseDataTableQueryReturn = {
  consolidatedQuery: ConsolidatedQuery;
  currentUrlQuery: string;
  handleQueryChange: (query: ConsolidatedQuery) => void;
  handleResetFilters: (resetParams?: ResetParams) => void;
  searchParams: URLSearchParams;
};

export function useDataTableQuery(
  tableId: string,
  options?: UseDataTableQueryOptions
): UseDataTableQueryReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const clearAdditionalKeys = useCallback(
    (params: URLSearchParams) => {
      options?.additionalKeysToClear?.forEach((key) => params.delete(key));
    },
    [options?.additionalKeysToClear]
  );

  const currentUrlQuery = useMemo(() => {
    return searchParams.get(tableId) || '';
  }, [searchParams, tableId]);

  const consolidatedQuery = useMemo<ConsolidatedQuery>(() => {
    if (!currentUrlQuery) {
      return {};
    }

    return { [tableId]: currentUrlQuery };
  }, [currentUrlQuery, tableId]);

  const handleQueryChange = useCallback(
    (query: ConsolidatedQuery) => {
      setSearchParams((prev) => {
        const nextParams = new URLSearchParams(prev);
        const before = prev.toString();
        const previousQueryValue = prev.get(tableId);
        const nextQueryValue = query[tableId];

        if (previousQueryValue !== nextQueryValue) {
          nextParams.delete(`${tableId}_cursor`);
          clearAdditionalKeys(nextParams);
        }

        Object.entries(query).forEach(([key, value]) => {
          if (value) {
            nextParams.set(key, value);
          } else {
            nextParams.delete(key);
          }
        });

        if (!query[tableId]) {
          nextParams.delete(tableId);
        }

        const after = nextParams.toString();
        if (after === before) {
          return prev;
        }

        return nextParams;
      });
    },
    [clearAdditionalKeys, setSearchParams, tableId]
  );

  const handleResetFilters = useCallback(
    (resetParams: ResetParams = {}) => {
      setSearchParams((prev) => {
        const nextParams = new URLSearchParams(prev);
        const before = prev.toString();

        nextParams.delete(tableId);
        nextParams.delete(`${tableId}_cursor`);
        clearAdditionalKeys(nextParams);

        Object.entries(resetParams).forEach(([key, value]) => {
          if (value) {
            nextParams.set(key, value);
          } else {
            nextParams.delete(key);
          }
        });

        const after = nextParams.toString();
        if (after === before) {
          return prev;
        }

        return nextParams;
      });
    },
    [clearAdditionalKeys, setSearchParams, tableId]
  );

  return {
    consolidatedQuery,
    currentUrlQuery,
    handleQueryChange,
    handleResetFilters,
    searchParams,
  };
}

export type { UseDataTableQueryOptions };
