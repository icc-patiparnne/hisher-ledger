import type { FilterConfig } from '@platform/ui';
import { isVersionGreaterOrEqual } from '../../../utils/version';

/**
 * Parameters for cash pools filter configuration
 */
export interface TCashPoolsFilterConfigParams {
  moduleVersion: string;
}

/**
 * Filter configuration for cash pools data table
 * Defines all available filters for cash pools with their types, options, and labels
 * Most filters are available only in v3
 */
export function getConnectivityCashPoolsFiltersConfig({
  moduleVersion,
}: TCashPoolsFilterConfigParams): FilterConfig {
  const isV3OrGreater = isVersionGreaterOrEqual(moduleVersion, '3');

  return {
    ...(isV3OrGreater && {
      id: {
        label: 'Cash Pool ID',
        variant: 'text',
        placeholder: 'Enter cash pool ID...',
      },
      name: {
        label: 'Name',
        variant: 'text',
        placeholder: 'Enter cash pool name...',
      },
    }),
  };
}
