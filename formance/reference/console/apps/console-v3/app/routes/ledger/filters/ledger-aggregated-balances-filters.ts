import { FilterConfig } from '@platform/ui';
import { isVersionGreaterOrEqual } from '../../../utils/version';

type TGetLedgerAggregatedBalancesFiltersConfigParams = {
  moduleVersion: string;
};

export function getLedgerAggregatedBalancesFiltersConfig({
  moduleVersion,
}: TGetLedgerAggregatedBalancesFiltersConfigParams): FilterConfig {
  const isV2OrGreater = isVersionGreaterOrEqual(moduleVersion, '2');

  return isV2OrGreater
    ? {
        address: {
          label: 'Address',
          variant: 'text',
          placeholder: 'Filter by account address',
        },
        metadata: {
          label: 'Metadata',
          variant: 'metadata',
          placeholderKey: 'Enter metadata key...',
          placeholderValue: 'Enter metadata value...',
        },
      }
    : {};
}
