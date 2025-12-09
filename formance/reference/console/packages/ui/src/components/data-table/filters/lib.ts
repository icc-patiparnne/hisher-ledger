import type { Column } from '@tanstack/react-table';
import * as React from 'react';

import type {
  ConfigurableColumnFilter,
  ExtendedColumnFilterV2,
  FilterOperatorV2,
  FilterVariantV2,
  MetadataFilterValue,
} from './types';
import { dataTableV2Config } from './types';

export function getCommonPinningStylesV2<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>;
  withBorder?: boolean;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? '-4px 0 4px -4px var(--border) inset'
        : isFirstRightPinnedColumn
        ? '4px 0 4px -4px var(--border) inset'
        : undefined
      : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? 'sticky' : 'relative',
    background: isPinned ? 'var(--background)' : 'var(--background)',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
}

export function getFilterOperatorsV2(filterVariant: FilterVariantV2) {
  const operatorMap: Record<
    FilterVariantV2,
    { label: string; value: FilterOperatorV2 }[]
  > = {
    text: dataTableV2Config.textOperators,
    number: dataTableV2Config.numericOperators,
    // range: dataTableV2Config.numericOperators, // Commented out - not available yet
    date: dataTableV2Config.dateOperators,
    dateRange: [{ label: 'Range', value: 'dateRange' as const }], // No selectable operators - always uses range
    boolean: dataTableV2Config.booleanOperators,
    select: dataTableV2Config.selectOperators,
    multiSelect: dataTableV2Config.multiSelectOperators,
    metadata: dataTableV2Config.metadataOperators,
    balanceByAsset: dataTableV2Config.balanceByAssetOperators,
    slider: dataTableV2Config.sliderOperators,
  } as Record<FilterVariantV2, { label: string; value: FilterOperatorV2 }[]>;

  return operatorMap[filterVariant] ?? dataTableV2Config.textOperators;
}

export function getDefaultFilterOperatorV2(filterVariant: FilterVariantV2) {
  const operators = getFilterOperatorsV2(filterVariant);

  return operators[0]?.value ?? 'eq';
}

export function getValidFiltersV2<TData>(
  filters: ExtendedColumnFilterV2<TData>[]
): ExtendedColumnFilterV2<TData>[] {
  return filters.filter(
    (filter) =>
      filter.operator === 'isEmpty' ||
      filter.operator === 'isNotEmpty' ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== '' &&
          filter.value !== null &&
          filter.value !== undefined)
  );
}

/**
 * Get valid filters for filter config approach (non-generic version)
 */
export function getValidConfigurableFilters(
  filters: ConfigurableColumnFilter[]
): ConfigurableColumnFilter[] {
  return filters.filter((filter) => {
    // Handle metadata and balanceByAsset filters - both use key-value structure
    if (
      (filter.variant === 'metadata' || filter.variant === 'balanceByAsset') &&
      typeof filter.value === 'object' &&
      filter.value !== null &&
      'key' in filter.value &&
      'value' in filter.value
    ) {
      const metadataValue = filter.value as MetadataFilterValue;

      return (
        metadataValue.key.trim() !== '' && metadataValue.value.trim() !== ''
      );
    }

    // Empty/not empty operators are always valid for other variants
    if (filter.operator === 'isEmpty' || filter.operator === 'isNotEmpty') {
      return true;
    }

    // Handle array values
    if (Array.isArray(filter.value)) {
      return filter.value.length > 0;
    }

    // Handle string values
    return (
      filter.value !== '' && filter.value !== null && filter.value !== undefined
    );
  });
}

/**
 * Generates a random ID for filters
 */
export function generateId({ length = 8 }: { length?: number } = {}) {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * Debounced callback hook for performance optimization
 */
export function useDebouncedCallbackV2<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [debouncedCallback, setDebouncedCallback] = React.useState<T | null>(
    null
  );

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
      setDebouncedCallback(null);
    };
  }, [callback, delay]);

  return debouncedCallback || callback;
}

/**
 * Format date utility
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
