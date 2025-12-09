import { Cursor } from '@platform/sdks/utils/cursor';
import {
  ColumnDef,
  DataTable,
  InitialTableState,
  RowModel,
  TDataTableToolbarProps,
  transformQueryToLegacyParams,
} from '@platform/ui';
import { removeNullAndUndefinedValueFromObject } from '@platform/utils';
import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import { getAllParams } from '../utils/helper';

export type TDatatableServerSide<TData> = {
  onRowsSelection?: (selectedRows: RowModel<TData>) => any;
  initialState?: InitialTableState;
  columns: ColumnDef<TData>[];
  data?: Cursor<TData>;
  id: string;
  emptyState?: React.ReactNode;
} & TDataTableToolbarProps;

/**
 * Server-side function for APIs that accept individual query parameters
 *
 * This function is designed for APIs that expect individual query parameters like
 * ?stackId=123&action=CREATE&userId=user123. It can handle both:
 * 1. Consolidated queries (transforms them to individual parameters)
 * 2. Legacy individual filter parameters
 *
 * @param getList - Your API function that accepts individual parameters
 * @param request - The incoming request object
 * @param tableId - Unique identifier for this table
 * @param filters - Optional array of filter parameter names to extract from URL
 * @returns Promise<T> - The result from your API function
 *
 * @example
 * // For APIs like: api.listLogs(organizationId, stackId, cursor, pageSize, action, userId)
 * const result = await getPaginatedAndFilteredListQueryParams(
 *   (config) => api.listLogs(orgId, config.stackId, config.cursor, config.pageSize, config.action, config.userId),
 *   request,
 *   'logs',
 *   ['stackId', 'action', 'userId']
 * );
 */
export async function getPaginatedAndFilteredListQueryParams<T, K>(
  getList: (config: K) => Promise<T> | undefined,
  request: Request,
  tableId: string,
  filters?: string[]
) {
  const { searchParams } = new URL(request.url);
  const cursorTokenParam = searchParams.get(`${tableId}_cursor`);
  const pageSizeParam = searchParams.get(`${tableId}_pageSize`);
  const consolidatedQueryParam = searchParams.get(tableId);

  const cursor = cursorTokenParam === null ? undefined : cursorTokenParam;
  const pageSize = pageSizeParam === null ? undefined : Number(pageSizeParam);

  // First check for consolidated query (preferred format)
  if (consolidatedQueryParam) {
    try {
      const platformQuery = JSON.parse(consolidatedQueryParam);
      const individualParams = transformQueryToLegacyParams(platformQuery);
      const config = removeNullAndUndefinedValueFromObject({
        ...individualParams,
        cursor,
        pageSize,
      });
      return getList(config as K);
    } catch (error) {
      console.error('Failed to parse consolidated query:', error);
    }
  }

  // Fall back to individual filter parameters if no consolidated query
  if (filters && filters.length > 0) {
    const filterValues: Record<string, string> = {};
    filters.forEach((filterName) => {
      const value = searchParams.get(filterName);
      if (value) {
        filterValues[filterName] = value;
      }
    });

    if (Object.keys(filterValues).length > 0) {
      const config = removeNullAndUndefinedValueFromObject({
        ...filterValues,
        cursor,
        pageSize,
      });
      return getList(config as K);
    }
  }

  // No filters at all, just pagination
  return getList(
    removeNullAndUndefinedValueFromObject({
      cursor,
      pageSize,
    }) as K
  );
}

/**
 * Utility function to remove cursor parameters from URL params
 * Useful when resetting filters to also clear pagination state
 */
export const deleteCursor = (
  tableId: string,
  params: { [p: string]: string }
) => {
  delete params[`${tableId}_cursor`];
};

/**
 * Server-side data table component with pagination support
 *
 * This component handles server-side pagination by managing cursor-based navigation
 * through URL parameters. It automatically handles:
 * - Next/Previous page navigation
 * - Page size changes
 * - URL parameter management
 *
 * @param columns - Column definitions for the table
 * @param data - Cursor-based data from your API
 * @param id - Unique identifier for this table (used for URL parameters)
 * @param emptyState - Component to show when no data is available
 * @param initialState - Initial table state (pagination, sorting, etc.)
 * @param onRowsSelection - Callback for row selection events
 */
export function DatatableServerSide<TData>({
  initialState,
  onRowsSelection,
  columns,
  data,
  id,
  emptyState,
  ...props
}: TDatatableServerSide<TData>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const pageSize = searchParams.get(`${id}_pageSize`);

  const state = {
    ...initialState,
    pagination: {
      ...initialState?.pagination,
      pageSize: pageSize !== null ? Number(pageSize) : 15,
    },
  };

  const [tableState, setTableState] = useState<InitialTableState | undefined>(
    state
  );

  useEffect(() => {
    setTableState(state);
  }, [searchParams]);

  const onNextPageChange = () => {
    if (data?.hasMore && data?.next) {
      const params = {
        ...getAllParams(location.search),
        [`${id}_cursor`]: data?.next,
      };
      setSearchParams(params);
    }
  };

  const onPreviousPageChange = () => {
    if (data?.previous) {
      const params = {
        ...getAllParams(location.search),
        [`${id}_cursor`]: data?.previous,
      };
      setSearchParams(params);
    }
  };

  const onPageSizeChange = (value: string) => {
    if (value) {
      const params = {
        ...getAllParams(location.search),
        [`${id}_pageSize`]: value,
      };
      setSearchParams(params);
    }
  };

  return (
    <DataTable
      initialState={tableState}
      columns={columns}
      data={data || []}
      displayPagination
      onNextPage={onNextPageChange}
      onPreviousPage={onPreviousPageChange}
      onPageSizeChange={onPageSizeChange}
      serverSide
      emptyState={emptyState}
      {...props}
    />
  );
}

/**
 * 🚀 UNIFIED PAGINATION FUNCTION - Explicit parameter handling
 *
 * This function handles both individual query parameters and consolidated queries based on
 * the filter parameter names provided. If filterParams are provided, it uses individual parameters.
 * Otherwise, it uses consolidated query matching.
 *
 * @param getList - Your API function that receives a config object
 * @param request - The incoming request object
 * @param tableId - Unique identifier for this table
 * @param filterParams - Array of filter parameter names to extract from URL (for individual params)
 * @returns Promise<T> - The result from your API function
 *
 * @example
 * // Individual query parameters (?stackId=123&action=CREATE)
 * const result = await getPaginatedAndFilteredList(
 *   (config) => api.listLogs(orgId, config.stackId, config.cursor, config.pageSize, config.action, config.userId),
 *   request,
 *   'logs',
 *   ['stackId', 'action', 'userId'] // Explicit filter parameter names
 * );
 *
 * @example
 * // Consolidated query ($match={"stackId":"123","action":"CREATE"})
 * const result = await getPaginatedAndFilteredList(
 *   (config) => api.listLogs(config.query, config.cursor, config.pageSize),
 *   request,
 *   'logs'
 * );
 */
export async function getPaginatedAndFilteredList<T, K>(
  getList: (config: K) => Promise<T> | undefined,
  request: Request,
  tableId: string,
  filterParams?: string[]
) {
  const { searchParams } = new URL(request.url);
  const cursorTokenParam = searchParams.get(`${tableId}_cursor`);
  const pageSizeParam = searchParams.get(`${tableId}_pageSize`);
  const consolidatedQueryParam = searchParams.get(tableId);

  const cursor = cursorTokenParam === null ? undefined : cursorTokenParam;
  const pageSize = pageSizeParam === null ? undefined : Number(pageSizeParam);

  // If filterParams are provided, handle both consolidated queries and individual parameters
  if (filterParams && filterParams.length > 0) {
    // First check for consolidated query and transform it to individual parameters
    if (consolidatedQueryParam) {
      try {
        const platformQuery = JSON.parse(consolidatedQueryParam);
        const individualParams = transformQueryToLegacyParams(platformQuery);
        return getList(
          removeNullAndUndefinedValueFromObject({
            ...individualParams,
            cursor,
            pageSize,
          }) as K
        );
      } catch (error) {
        console.warn(
          `Failed to parse consolidated query for ${tableId}:`,
          error
        );
      }
    }

    // Fall back to individual parameters from URL
    const individualParams: Record<string, any> = {};
    filterParams.forEach((paramName) => {
      const value = searchParams.get(paramName);
      if (value !== null) {
        individualParams[paramName] = value;
      }
    });

    return getList(
      removeNullAndUndefinedValueFromObject({
        ...individualParams,
        cursor,
        pageSize,
      }) as K
    );
  }

  // Otherwise, use consolidated query (V2 system)
  if (consolidatedQueryParam) {
    try {
      const query = JSON.parse(consolidatedQueryParam);
      return getList(
        removeNullAndUndefinedValueFromObject({
          query,
          cursor,
          pageSize,
        }) as K
      );
    } catch (error) {
      console.warn(`Failed to parse consolidated query for ${tableId}:`, error);
    }
  }

  // No filters, just pagination
  return getList(
    removeNullAndUndefinedValueFromObject({
      cursor,
      pageSize,
    }) as K
  );
}
