import { FilterConfig } from '@platform/ui';
import { isVersionGreaterOrEqual } from '../../../utils/version';

type TReconciliationPoliciesFilterConfigParams = {
  moduleVersion: string;
};

export function getReconciliationPoliciesFiltersConfig({
  moduleVersion,
}: TReconciliationPoliciesFilterConfigParams): FilterConfig {
  const supportsQuery = isVersionGreaterOrEqual(moduleVersion, '2.2');

  return supportsQuery
    ? {
        ledgerName: {
          label: 'Ledger Name',
          variant: 'text',
          placeholder: 'Search by ledger name',
        },
        paymentsPoolID: {
          label: 'Payments Pool ID',
          variant: 'text',
          placeholder: 'Search by payments pool ID',
        },
      }
    : {};
}
