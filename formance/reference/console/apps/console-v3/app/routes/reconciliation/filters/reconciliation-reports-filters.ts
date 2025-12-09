import { FilterConfig } from '@platform/ui';
import { isVersionGreaterOrEqual } from '../../../utils/version';

type TReconciliationReportsFilterConfigParams = {
  moduleVersion: string;
};

export function getReconciliationReportsFiltersConfig({
  moduleVersion,
}: TReconciliationReportsFilterConfigParams): FilterConfig {
  const supportsQuery = isVersionGreaterOrEqual(moduleVersion, '2.2');

  return supportsQuery
    ? {
        id: {
          label: 'ID',
          variant: 'text',
          placeholder: 'Search by report ID',
        },
        policyID: {
          label: 'Policy ID',
          variant: 'text',
          placeholder: 'Search by policy ID',
        },
        status: {
          label: 'Status',
          variant: 'select',
          options: [
            { label: 'Pending', value: 'PENDING' },
            { label: 'Completed', value: 'COMPLETED' },
            { label: 'Failed', value: 'FAILED' },
          ],
        },
      }
    : {};
}
