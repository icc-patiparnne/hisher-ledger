import type { FilterConfig } from '@platform/ui';
import { isVersionGreaterOrEqual } from '../../../utils/version';

export interface TTransactionsFilterConfigParams {
  moduleVersion: string;
}

export function getLedgerTransactionsFiltersConfig({
  moduleVersion,
}: TTransactionsFilterConfigParams): FilterConfig {
  const isV2OrGreater = isVersionGreaterOrEqual(moduleVersion, '2');

  const baseFilters: FilterConfig = {
    source: {
      label: 'Source',
      variant: 'text',
      placeholder: 'Search by source...',
    },
    destination: {
      label: 'Destination',
      variant: 'text',
      placeholder: 'Search by destination...',
    },
    account: {
      label: 'Account',
      variant: 'text',
      placeholder: 'Search by account...',
    },
    metadata: {
      label: 'Metadata',
      variant: 'metadata',
      placeholderKey: 'Enter metadata key...',
      placeholderValue: 'Enter metadata value...',
    },
  };

  if (isV2OrGreater) {
    baseFilters.reverted = {
      label: 'Reverted',
      variant: 'boolean',
    };

    baseFilters.timestamp = {
      label: 'Timestamp',
      variant: 'dateRange',
      placeholder: 'Select timestamp...',
    };

    baseFilters.inserted_at = {
      label: 'Inserted at',
      variant: 'dateRange',
      placeholder: 'Select inserted at...',
    };
    baseFilters.updated_at = {
      label: 'Updated at',
      variant: 'dateRange',
      placeholder: 'Select updated at...',
    };
  }

  return baseFilters;
}
