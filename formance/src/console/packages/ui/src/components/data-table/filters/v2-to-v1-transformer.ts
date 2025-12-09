/**
 * Legacy transformer utilities for backward compatibility
 * Transforms modern consolidated queries to legacy individual filter format
 * Used for V1 module support and debugging purposes
 */

import type { ConfigurableColumnFilter, PlatformQuery } from './types';

export interface V1Filter {
  [key: string]: string;
}

/**
 * Parse a consolidated query string into filters for filter config approach
 * This version returns ConfigurableColumnFilter[] instead of the generic version
 */
export function parseQueryToConfigurableFilters(
  queryString: string
): ConfigurableColumnFilter[] {
  const filters: ConfigurableColumnFilter[] = [];
  let filterId = 1;

  function extractFilters(obj: any) {
    // Handle $match
    if (obj.$match) {
      Object.entries(obj.$match).forEach(([field, value]) => {
        filters.push({
          id: field,
          value: String(value),
          variant: 'text',
          operator: 'eq',
          filterId: `parsed-${filterId++}`,
        });
      });
    }

    // Handle $and
    if (obj.$and && Array.isArray(obj.$and)) {
      obj.$and.forEach((condition: any) => {
        extractFilters(condition);
      });
    }

    // Handle $or
    if (obj.$or && Array.isArray(obj.$or)) {
      obj.$or.forEach((condition: any) => {
        extractFilters(condition);
      });
    }

    // Handle comparison operators
    const comparisonOps = ['$lt', '$lte', '$gt', '$gte', '$ne'];
    comparisonOps.forEach((op) => {
      if (obj[op]) {
        Object.entries(obj[op]).forEach(([field, value]) => {
          const operator =
            op === '$lt'
              ? 'lt'
              : op === '$lte'
              ? 'lte'
              : op === '$gt'
              ? 'gt'
              : op === '$gte'
              ? 'gte'
              : 'ne';
          filters.push({
            id: field,
            value: String(value),
            variant: 'number',
            operator: operator as any,
            filterId: `parsed-${filterId++}`,
          });
        });
      }
    });

    // Handle $exists
    if (obj.$exists) {
      Object.entries(obj.$exists).forEach(([field, value]) => {
        filters.push({
          id: field,
          value: '',
          variant: 'text',
          operator: value ? 'isNotEmpty' : 'isEmpty',
          filterId: `parsed-${filterId++}`,
        });
      });
    }

    // Handle $not (simplified)
    if (obj.$not) {
      extractFilters(obj.$not);
    }
  }

  try {
    const query = JSON.parse(queryString);
    extractFilters(query);

    return filters;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('Failed to parse query to configurable filters:', error);
    }

    return [];
  }
}

/**
 * Transform modern consolidated query to legacy simple parameters
 * This extracts simple field values for direct use in legacy SDK calls
 * @param modernQuery - The modern consolidated query object
 * @returns Object with simple key-value parameters for legacy APIs
 */
export function transformQueryToLegacyParams(
  modernQuery: PlatformQuery
): Record<string, any> {
  const v1Params: Record<string, any> = {};

  function extractParams(query: any): void {
    if (!query || typeof query !== 'object') return;

    // Handle $match operations - extract simple field values
    if (query.$match) {
      Object.entries(query.$match).forEach(([field, value]) => {
        // Handle metadata fields specially
        if (field.startsWith('metadata[') && field.endsWith(']')) {
          const metadataKey = field.slice(9, -1); // Extract key from metadata[key]
          if (!v1Params.metadata) {
            v1Params.metadata = {};
          }
          v1Params.metadata[metadataKey] = value;
        } else {
          // Regular field
          v1Params[field] = value;
        }
      });

      return;
    }

    // Handle $and operations - process all conditions
    if (query.$and && Array.isArray(query.$and)) {
      query.$and.forEach((subQuery: any) => {
        extractParams(subQuery);
      });

      return;
    }

    // Handle $or operations - for now, just process the first condition
    // V1 APIs typically don't support complex OR logic
    if (query.$or && Array.isArray(query.$or)) {
      if (query.$or.length > 0) {
        extractParams(query.$or[0]);
      }

      return;
    }

    // Note: Other operations like $lt, $gt, etc. are not supported in legacy simple params
    // They would need to be handled by the modern query system
  }

  extractParams(modernQuery);

  return v1Params;
}
