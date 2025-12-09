import type { FilterConfig } from '@platform/ui';
import { isVersionGreaterOrEqual } from '../../../utils/version';

export interface TAccountsFilterConfigParams {
  moduleVersion: string;
}

export function getLedgerAccountsFiltersConfig({
  moduleVersion,
}: TAccountsFilterConfigParams): FilterConfig {
  const isV2OrGreater = isVersionGreaterOrEqual(moduleVersion, '2');

  const baseFilters: FilterConfig = {
    address: {
      label: 'Address',
      variant: 'text',
      placeholder: 'Search by address...',
    },
    metadata: {
      label: 'Metadata',
      variant: 'metadata',
      placeholderKey: 'Enter metadata key...',
      placeholderValue: 'Enter metadata value...',
    },
  };

  if (isV2OrGreater) {
    baseFilters.balance_by_asset = {
      label: 'Balance by Asset',
      variant: 'balanceByAsset',
      placeholderKey: 'Enter asset...',
      placeholderValue: 'Enter balance...',
    };
  }

  return baseFilters;
}
