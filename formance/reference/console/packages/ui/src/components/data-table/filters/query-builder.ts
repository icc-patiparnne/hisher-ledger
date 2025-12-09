import type {
  ConfigurableColumnFilter,
  ExtendedColumnFilterV2,
  JoinOperatorV2,
  MetadataFilterValue,
  PlatformQuery,
  PlatformQueryFilter,
} from './types';

/**
 * Converts a single filter to the platform query format
 * Based on the exact backend specification:
 * - $match for equality
 * - $lt, $lte, $gt, $gte for comparisons
 * - $exists for existence checks
 * - $not for negation
 */
function convertFilterToPlatformQuery<TData>(
  filter: ExtendedColumnFilterV2<TData>
): PlatformQueryFilter {
  const { id, value, operator } = filter;
  const fieldName = id as string;

  // Handle different operators according to backend spec
  switch (operator) {
    case 'eq':
      // case "iLike": // For text equality, use $match - Not available yet
      return {
        $match: {
          [fieldName]:
            typeof value === 'string'
              ? value
              : Array.isArray(value)
              ? value[0]
              : value,
        },
      };

    case 'ne':
      // case "notILike": // For negation, use $not with $match - Not available yet
      return {
        $not: {
          $match: {
            [fieldName]:
              typeof value === 'string'
                ? value
                : Array.isArray(value)
                ? value[0]
                : value,
          },
        },
      };

    case 'lt':
      return {
        $lt: {
          [fieldName]:
            typeof value === 'string'
              ? value
              : Array.isArray(value)
              ? value[0]
              : value,
        },
      };

    case 'lte':
      return {
        $lte: {
          [fieldName]:
            typeof value === 'string'
              ? value
              : Array.isArray(value)
              ? value[0]
              : value,
        },
      };

    case 'gt':
      return {
        $gt: {
          [fieldName]:
            typeof value === 'string'
              ? value
              : Array.isArray(value)
              ? value[0]
              : value,
        },
      };

    case 'gte':
      return {
        $gte: {
          [fieldName]:
            typeof value === 'string'
              ? value
              : Array.isArray(value)
              ? value[0]
              : value,
        },
      };

    case 'isEmpty':
      return { $not: { $exists: { [fieldName]: true } } };

    case 'isNotEmpty':
      return { $exists: { [fieldName]: true } };

    case 'isBetween':
      if (Array.isArray(value) && value.length === 2) {
        return {
          $and: [
            { $gte: { [fieldName]: value[0] } },
            { $lte: { [fieldName]: value[1] } },
          ],
        };
      }
      // Fallback to match if not proper range

      return {
        $match: {
          [fieldName]:
            typeof value === 'string'
              ? value
              : Array.isArray(value)
              ? value[0]
              : value,
        },
      };

    // case "inArray": // For array values, use $match with the array - Not available yet
    //   return { "$match": { [fieldName]: Array.isArray(value) ? value : [value] } };

    // case "notInArray": // For negated array values - Not available yet
    //   return { "$not": { "$match": { [fieldName]: Array.isArray(value) ? value : [value] } } };

    default:
      // Default to $match for unknown operators
      return {
        $match: {
          [fieldName]:
            typeof value === 'string'
              ? value
              : Array.isArray(value)
              ? value[0]
              : value,
        },
      };
  }
}

/**
 * Converts an array of filters to a consolidated platform query
 */
export function convertFiltersToFormanceQuery<TData>(
  filters: ExtendedColumnFilterV2<TData>[],
  joinOperator: JoinOperatorV2 = 'and'
): PlatformQuery {
  if (filters.length === 0) {
    return {};
  }

  const platformFilters = filters.map(convertFilterToPlatformQuery);

  if (filters.length === 1) {
    return platformFilters[0]!;
  }

  const joinKey = joinOperator === 'and' ? '$and' : '$or';

  return { [joinKey]: platformFilters };
}

/**
 * Converts a single configurable filter to the platform query format
 */
function convertConfigurableFilterToPlatformQuery(
  filter: ConfigurableColumnFilter
): PlatformQueryFilter {
  const { id, value, operator, variant } = filter;

  // Handle dateRange variant (used for date range filtering)
  if (variant === 'dateRange' && typeof value === 'string' && value) {
    try {
      const parsed = JSON.parse(value);
      if (parsed.from && parsed.to) {
        const fieldName = id;

        // Set end time to end of day (23:59:59.999Z)
        const fromDate = new Date(parsed.from);
        const toDate = new Date(parsed.to);
        toDate.setHours(23, 59, 59, 999);

        return {
          $and: [
            { $gte: { [fieldName]: fromDate.toISOString() } },
            { $lte: { [fieldName]: toDate.toISOString() } },
          ],
        };
      }
    } catch (error) {
      console.warn(`Invalid dateRange value: "${value}"`);
    }

    // Fallback if parsing fails
    const fieldName = id;

    return { $exists: { [fieldName]: true } };
  }

  // Handle metadata variant (used for metadata filtering)
  if (
    variant === 'metadata' &&
    typeof value === 'object' &&
    value !== null &&
    'key' in value &&
    'value' in value
  ) {
    const metadataValue = value as MetadataFilterValue;
    const fieldName = `metadata[${metadataValue.key}]`;
    const filterValue = metadataValue.value;

    // Only support 'eq' operator for metadata variant
    return { $match: { [fieldName]: filterValue } };
  }

  // Handle balanceByAsset variant (used for balance filtering with operators)
  if (
    variant === 'balanceByAsset' &&
    typeof value === 'object' &&
    value !== null &&
    'key' in value &&
    'value' in value
  ) {
    const metadataValue = value as MetadataFilterValue;
    const fieldName = `balance[${metadataValue.key}]`;
    // Convert string value to number for balance filtering
    const filterValue = parseFloat(metadataValue.value);

    // Validate that it's a valid number
    if (isNaN(filterValue)) {
      // If not a valid number, fallback to string (for backward compatibility)
      console.warn(
        `Invalid numeric value for balance filter: "${metadataValue.value}"`
      );
      const stringFilterValue = metadataValue.value;

      return { $match: { [fieldName]: stringFilterValue } };
    }

    // Support multiple operators for balanceByAsset variant
    switch (operator) {
      case 'eq':
        return { $match: { [fieldName]: filterValue } };
      case 'ne':
        return { $not: { $match: { [fieldName]: filterValue } } };
      case 'lt':
        return { $lt: { [fieldName]: filterValue } };
      case 'lte':
        return { $lte: { [fieldName]: filterValue } };
      case 'gt':
        return { $gt: { [fieldName]: filterValue } };
      case 'gte':
        return { $gte: { [fieldName]: filterValue } };
      default:
        return { $match: { [fieldName]: filterValue } };
    }
  }

  // Standard field name for non-metadata filters
  const fieldName = id;

  // Convert value based on variant type
  const processedValue: any = (() => {
    if (variant === 'boolean') {
      // Convert string boolean values to actual booleans
      if (typeof value === 'string') {
        return value === 'true';
      }

      return Boolean(value);
    }
    // For other types, use original logic

    return typeof value === 'string'
      ? value
      : Array.isArray(value)
      ? value[0]
      : value;
  })();

  // Handle different operators according to backend spec
  switch (operator) {
    case 'eq':
      // case "iLike": // For text equality, use $match - Not available yet
      return { $match: { [fieldName]: processedValue } };

    case 'ne':
      // case "notILike": // For negation, use $not with $match - Not available yet
      return { $not: { $match: { [fieldName]: processedValue } } };

    case 'lt':
      return { $lt: { [fieldName]: processedValue } };

    case 'lte':
      return { $lte: { [fieldName]: processedValue } };

    case 'gt':
      return { $gt: { [fieldName]: processedValue } };

    case 'gte':
      return { $gte: { [fieldName]: processedValue } };

    case 'isEmpty':
      return { $not: { $exists: { [fieldName]: true } } };

    case 'isNotEmpty':
      return { $exists: { [fieldName]: true } };

    case 'isBetween':
      if (Array.isArray(value) && value.length === 2) {
        // For isBetween, process both values based on variant type
        const processedValue0 =
          variant === 'boolean'
            ? typeof value[0] === 'string'
              ? value[0] === 'true'
              : Boolean(value[0])
            : value[0];
        const processedValue1 =
          variant === 'boolean'
            ? typeof value[1] === 'string'
              ? value[1] === 'true'
              : Boolean(value[1])
            : value[1];

        return {
          $and: [
            { $gte: { [fieldName]: processedValue0 } },
            { $lte: { [fieldName]: processedValue1 } },
          ],
        };
      }
      // Fallback to match if not proper range

      return { $match: { [fieldName]: processedValue } };

    // case "inArray": // For array values, use $match with the array - Not available yet
    //   return { "$match": { [fieldName]: Array.isArray(value) ? value : [value] } };

    // case "notInArray": // For negated array values - Not available yet
    //   return { "$not": { "$match": { [fieldName]: Array.isArray(value) ? value : [value] } } };

    default:
      // Default to $match for unknown operators
      return { $match: { [fieldName]: processedValue } };
  }
}

/**
 * Separate filters into query filters and parameter filters
 */
export function separateFilters(
  filters: ConfigurableColumnFilter[],
  filterConfig: { [fieldId: string]: { param?: string } }
): {
  queryFilters: ConfigurableColumnFilter[];
  paramFilters: ConfigurableColumnFilter[];
} {
  const queryFilters: ConfigurableColumnFilter[] = [];
  const paramFilters: ConfigurableColumnFilter[] = [];

  filters.forEach((filter) => {
    const config = filterConfig[filter.id];
    if (config?.param) {
      paramFilters.push(filter);
    } else {
      queryFilters.push(filter);
    }
  });

  return { queryFilters, paramFilters };
}

/**
 * Extract URL parameters from filters that have a param property
 * Also ensures that removed filters get their parameters cleared (set to empty string)
 */
export function extractUrlParameters(
  filters: ConfigurableColumnFilter[],
  filterConfig: { [fieldId: string]: { param?: string } }
): Record<string, string> {
  const urlParams: Record<string, string> = {};

  // First, initialize all param-based filters to empty string (for clearing removed filters)
  Object.entries(filterConfig).forEach(([, config]) => {
    if (config?.param) {
      urlParams[config.param] = '';
    }
  });

  // Then, set values for active filters
  filters.forEach((filter) => {
    const config = filterConfig[filter.id];
    if (config?.param) {
      const value = Array.isArray(filter.value)
        ? filter.value[0]
        : filter.value;
      urlParams[config.param] = String(value);
    }
  });

  return urlParams;
}

/**
 * Convert configurable filters to a platform query (non-generic version)
 * Only includes filters that don't have a param property (those become URL parameters)
 */
export function convertConfigurableFiltersToPlatformQuery(
  filters: ConfigurableColumnFilter[],
  joinOperator: JoinOperatorV2 = 'and',
  filterConfig?: { [fieldId: string]: { param?: string } }
): PlatformQuery {
  // Filter out param-based filters that should become URL parameters
  const queryFilters = filterConfig
    ? filters.filter((filter) => !filterConfig[filter.id]?.param)
    : filters;

  if (queryFilters.length === 0) {
    return {};
  }

  const platformFilters = queryFilters.map(
    convertConfigurableFilterToPlatformQuery
  );

  if (queryFilters.length === 1) {
    return platformFilters[0]!;
  }

  const joinKey = joinOperator === 'and' ? '$and' : '$or';

  return { [joinKey]: platformFilters };
}

/**
 * Builds a consolidated query object for a specific table
 */
export function buildConsolidatedQuery<TData>(
  tableId: string,
  filters: ExtendedColumnFilterV2<TData>[],
  joinOperator: JoinOperatorV2 = 'and'
): { [key: string]: string } {
  const platformQuery = convertFiltersToFormanceQuery(filters, joinOperator);

  // Return empty object if no filters
  if (Object.keys(platformQuery).length === 0) {
    return {};
  }

  return {
    [tableId]: JSON.stringify(platformQuery),
  };
}
