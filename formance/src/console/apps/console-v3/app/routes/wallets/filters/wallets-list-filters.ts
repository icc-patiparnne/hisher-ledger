import type { FilterConfig } from '@platform/ui';

/**
 * Parameters for wallets filter configuration
 */
export interface TWalletsFilterConfigParams {
  moduleVersion?: string;
}

/**
 * Filter configuration for wallets data table
 * Defines all available filters for wallets with their types, options, and labels
 */
export function getWalletsFiltersConfig(): FilterConfig {
  return {
    // Available in all versions
    name: {
      label: 'Name',
      variant: 'text',
      placeholder: 'Search by name...',
    },
    metadata: {
      label: 'Metadata',
      variant: 'metadata',
      placeholderKey: 'Enter metadata key...',
      placeholderValue: 'Enter metadata value...',
    },
  };
}
