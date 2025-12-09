import { FilterConfig } from '@platform/ui';
import { isVersionGreaterOrEqual } from '../../../utils/version';

type TGetLedgerLogsFiltersConfigParams = {
  moduleVersion: string;
};

export function getLedgerLogsFiltersConfig({
  moduleVersion,
}: TGetLedgerLogsFiltersConfigParams): FilterConfig {
  const isV2OrGreater = isVersionGreaterOrEqual(moduleVersion, '2');

  return {
    ...(isV2OrGreater && {
      id: {
        label: 'ID',
        variant: 'text',
        placeholder: 'Search by ID',
      },
      date: {
        label: 'Date',
        variant: 'dateRange',
        placeholder: 'Search by date',
      },
    }),
  };
}
