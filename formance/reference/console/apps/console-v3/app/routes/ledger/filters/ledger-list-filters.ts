import { FilterConfig } from '@platform/ui';
import { LEDGER_SELECTED } from '../constants';

export function getLedgersFiltersConfig(): FilterConfig {
  return {
    [LEDGER_SELECTED]: {
      label: 'Name',
      variant: 'text',
      placeholder: 'Search by ledger name...',
      operators: [{ label: 'Match', value: 'eq' }],
    },
  };
}
