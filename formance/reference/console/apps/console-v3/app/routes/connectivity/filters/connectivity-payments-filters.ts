import type { FilterConfig } from '@platform/ui';
import { isVersionV3 } from '../../../utils/version';
import {
  CONNECTIVITY_PAYMENT_SCHEME_MAP,
  CONNECTIVITY_PAYMENT_STATUS_V1_MAP,
  CONNECTIVITY_PAYMENT_STATUS_V3_MAP,
  CONNECTIVITY_PAYMENT_TYPE_V1_MAP,
  CONNECTIVITY_PAYMENT_TYPE_V3_MAP,
} from '../constants';

export interface TPaymentsFilterConfigParams {
  moduleVersion: string;
}

export function getConnectivityPaymentsFiltersConfig({
  moduleVersion,
}: TPaymentsFilterConfigParams): FilterConfig {
  // Select payment type and status maps based on module version
  const isV3 = isVersionV3(moduleVersion);

  const paymentTypeMap = isV3
    ? CONNECTIVITY_PAYMENT_TYPE_V1_MAP
    : CONNECTIVITY_PAYMENT_TYPE_V3_MAP;
  const paymentStatusMap = isV3
    ? CONNECTIVITY_PAYMENT_STATUS_V1_MAP
    : CONNECTIVITY_PAYMENT_STATUS_V3_MAP;

  return {
    id: {
      label: 'Payment ID',
      variant: 'text',
      placeholder: 'Enter payment ID...',
    },
    reference: {
      label: 'Reference',
      variant: 'text',
      placeholder: 'Enter reference...',
    },
    type: {
      label: 'Payment Type',
      variant: 'select',
      options: Object.entries(paymentTypeMap)
        .filter(([key]) => key !== 'OTHER' && key !== 'Unknown') // Filter out unavailable types
        .map(([key, value]) => ({
          label: value,
          value: key,
        })),
    },
    status: {
      label: 'Status',
      variant: 'select',
      options: Object.entries(paymentStatusMap)
        .filter(([key]) => key !== 'OTHER' && key !== 'Unknown') // Filter out unavailable statuses
        .map(([key, value]) => ({
          label: value,
          value: key,
        })),
    },
    scheme: {
      label: 'Scheme',
      variant: 'select',
      options: Object.entries(CONNECTIVITY_PAYMENT_SCHEME_MAP)
        .filter(([key]) => key !== 'Unknown' && key !== 'Other') // Filter out unavailable schemes
        .map(([key, value]) => ({
          label: value,
          value: key.toUpperCase(),
        })),
    },
    amount: {
      label: 'Amount',
      variant: 'number',
      placeholder: 'Enter amount...',
    },
    asset: {
      label: 'Asset',
      variant: 'text',
      placeholder: 'Enter asset...',
    },

    source_account_id: {
      label: 'Source Account ID',
      variant: 'text',
      placeholder: 'Enter source account ID...',
    },
    destination_account_id: {
      label: 'Destination Account ID',
      variant: 'text',
      placeholder: 'Enter destination account ID...',
    },
    metadata: {
      label: 'Metadata',
      variant: 'metadata',
      placeholderKey: 'Enter metadata key...',
      placeholderValue: 'Enter metadata value...',
    },
  };
}
