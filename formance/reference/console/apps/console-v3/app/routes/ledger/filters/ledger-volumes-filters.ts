import { FilterConfig } from '@platform/ui';
import {
  LEDGER_VOLUMES_END_TIME,
  LEDGER_VOLUMES_GROUP_BY,
  LEDGER_VOLUMES_START_TIME,
} from '../constants';

export function getLedgerVolumesFiltersConfig(): FilterConfig {
  return {
    account: {
      label: 'Account',
      variant: 'text',
      placeholder: 'Search by account',
    },
    asset: {
      label: 'Asset',
      variant: 'text',
      placeholder: 'Search by asset',
    },
    startTime: {
      param: LEDGER_VOLUMES_START_TIME,
      label: 'Start Time',
      variant: 'date',
      placeholder: 'Select start date',
    },
    endTime: {
      param: LEDGER_VOLUMES_END_TIME,
      label: 'End Time',
      variant: 'date',
      placeholder: 'Select end date',
    },
    groupBy: {
      param: LEDGER_VOLUMES_GROUP_BY,
      label: 'Group By',
      variant: 'number',
      min: 0,
      max: 20,
      placeholder: 'Enter number (0-20)',
    },
  };
}
