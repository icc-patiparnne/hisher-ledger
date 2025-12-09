import type { FilterConfig } from '@platform/ui';
import { isVersionGreaterOrEqual } from '../../../utils/version';

/**
 * Parameters for bank accounts filter configuration
 */
export interface TBankAccountsFilterConfigParams {
  moduleVersion: string;
}

/**
 * Filter configuration for bank accounts data table
 * Defines all available filters for bank accounts with their types, options, and labels
 * Most filters are available only in v3
 */
export function getConnectivityBankAccountsFiltersConfig({
  moduleVersion,
}: TBankAccountsFilterConfigParams): FilterConfig {
  const isV3OrGreater = isVersionGreaterOrEqual(moduleVersion, '3');

  return {
    ...(isV3OrGreater && {
      id: {
        label: 'Bank Account ID',
        variant: 'text',
        placeholder: 'Enter bank account ID...',
      },
      name: {
        label: 'Name',
        variant: 'text',
        placeholder: 'Enter bank account name...',
      },
      country: {
        label: 'Country',
        variant: 'text',
        placeholder: 'Enter country (e.g., US, FR, GB)...',
      },
      metadata: {
        label: 'Metadata',
        variant: 'metadata',
        placeholderKey: 'Enter metadata key...',
        placeholderValue: 'Enter metadata value...',
      },
    }),
  };
}
