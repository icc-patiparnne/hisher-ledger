import type { ColumnSort, Row } from '@tanstack/react-table';

// Configuration for data table filtering system
export type DataTableV2Config = typeof dataTableV2Config;

export const dataTableV2Config = {
  textOperators: [
    // { label: "Contains", value: "iLike" as const }, // Not available yet - needs text search
    // { label: "Does not contain", value: "notILike" as const }, // Not available yet - needs text search
    { label: 'Match', value: 'eq' as const },
    { label: 'Is not', value: 'ne' as const },
  ],
  numericOperators: [
    { label: 'Match', value: 'eq' as const },
    // { label: "Is not", value: "ne" as const }, // Not available in keyValueOperation component
    { label: 'Lower than', value: 'lt' as const },
    { label: 'Lower than equal', value: 'lte' as const },
    { label: 'Greater than', value: 'gt' as const },
    { label: 'Greater than equal', value: 'gte' as const },
    // { label: "Is empty", value: "isEmpty" as const }, // Not available in keyValueOperation component
    // { label: "Is not empty", value: "isNotEmpty" as const }, // Not available in keyValueOperation component
  ],
  dateOperators: [
    { label: 'Match', value: 'eq' as const },
    // { label: "Is not", value: "ne" as const },
    // { label: "Lower than", value: "lt" as const },
    // { label: "Greater than", value: "gt" as const },
    // { label: "Lower than equal", value: "lte" as const },
    // { label: "Greater than equal", value: "gte" as const },
    // { label: "Is relative to today", value: "isRelativeToToday" as const }, // Not available yet - needs date arithmetic
    // { label: "Is empty", value: "isEmpty" as const },
    // { label: "Is not empty", value: "isNotEmpty" as const },
  ],
  selectOperators: [
    { label: 'Match', value: 'eq' as const },
    { label: 'Is not', value: 'ne' as const },
  ],
  multiSelectOperators: [
    { label: 'Match', value: 'eq' as const },
    { label: 'Is not', value: 'ne' as const },
  ],
  metadataOperators: [{ label: 'Match', value: 'eq' as const }],
  balanceByAssetOperators: [
    { label: 'Match', value: 'eq' as const },
    { label: 'Lower than', value: 'lt' as const },
    { label: 'Lower than equal', value: 'lte' as const },
    { label: 'Greater than', value: 'gt' as const },
    { label: 'Greater than equal', value: 'gte' as const },
  ],
  booleanOperators: [
    { label: 'Match', value: 'eq' as const },
    { label: 'Is not', value: 'ne' as const },
  ],
  sliderOperators: [
    { label: 'Match', value: 'eq' as const },
    // { label: "Is between", value: "isBetween" as const },
  ],
  sortOrders: [
    { label: 'Asc', value: 'asc' as const },
    { label: 'Desc', value: 'desc' as const },
  ],
  filterVariants: [
    'text', // Partially supported (eq, ne, isEmpty, isNotEmpty only)
    'number',
    // "range", // Not available yet - needs isBetween operator
    'date', // Partially supported (eq, ne, lt, lte, gt, gte, isEmpty, isNotEmpty only)
    'dateRange', // Date range picker for timestamp filtering
    'boolean',
    'select',
    'multiSelect', // Partially supported (isEmpty, isNotEmpty only - no inArray/notInArray)
    'metadata', // Key-value input for metadata filtering: metadata[key] = value
    'balanceByAsset', // Key-value input with operators for balance filtering: balance[asset] >= value
    'slider', // Range slider with min/max values
  ] as const,
  operators: [
    // "iLike", // Not available yet - needs text search
    // "notILike", // Not available yet - needs text search
    'eq',
    'ne', // Available for text/select operators but not numeric
    // "inArray", // Not available yet - needs array membership testing
    // "notInArray", // Not available yet - needs array membership testing
    'isEmpty', // Available for text/select operators but not numeric
    'isNotEmpty', // Available for text/select operators but not numeric
    'lt',
    'lte',
    'gt',
    'gte',
    'isBetween', // Available for slider and date range filters
    'dateRange', // Special operator for date range filters
    'isRelativeToToday', // Not available yet - needs date arithmetic
  ] as const,
  joinOperators: ['and', 'or'] as const,
};

export interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type FilterOperatorV2 = DataTableV2Config['operators'][number];
export type FilterVariantV2 = DataTableV2Config['filterVariants'][number];
export type JoinOperatorV2 = DataTableV2Config['joinOperators'][number];

export interface ExtendedColumnSortV2<TData> extends Omit<ColumnSort, 'id'> {
  id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilterV2<TData> {
  id: Extract<keyof TData, string>;
  value: string | string[];
  variant: FilterVariantV2;
  operator: FilterOperatorV2;
  filterId: string;
}

export interface DataTableRowActionV2<TData> {
  row: Row<TData>;
  variant: 'update' | 'delete';
}

// Platform specific types for query building
export interface PlatformQueryFilter {
  [key: string]: any;
}

export interface PlatformQuery {
  $and?: PlatformQueryFilter[];
  $or?: PlatformQueryFilter[];
}

export type ConsolidatedQuery = {
  [tableId: string]: string; // JSON stringified PlatformQuery
};

// Filter configuration types - separate from column definitions
export interface FilterFieldConfig {
  label: string;
  variant: FilterVariantV2;
  options?: Option[];
  operators?: { label: string; value: FilterOperatorV2 }[]; // Override default operators for this filter
  placeholder?: string;
  placeholderKey?: string; // For metadata/balanceByAsset variant - placeholder for the key input
  placeholderValue?: string; // For metadata/balanceByAsset variant - placeholder for the value input
  defaultValue?: string; // For pre-selecting default values
  param?: string; // If set, this filter will be emitted as a separate URL parameter instead of part of the query
  range?: [number, number]; // For backward compatibility
  min?: number; // For slider variant - minimum value
  max?: number; // For slider variant - maximum value
  step?: number; // For slider variant - step size
  unit?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface FilterConfig {
  [fieldId: string]: FilterFieldConfig;
}

// Key-value structure for metadata/balanceByAsset variants
export interface MetadataFilterValue {
  key: string;
  value: string;
}

// Non-generic version for filter config approach where field IDs are just strings
export interface ConfigurableColumnFilter {
  id: string;
  value: string | string[] | MetadataFilterValue;
  variant: FilterVariantV2;
  operator: FilterOperatorV2;
  filterId: string;
}
