import { V3PaymentInitiationTypeEnum } from '@platform/sdks/formance/src/models/components';
import type { FilterConfig } from '@platform/ui';
import { isVersionV3 } from '../../../utils/version';

export interface TTransfersFilterConfigParams {
  moduleVersion: string;
}

export function getConnectivityTransfersFiltersConfig({
  moduleVersion,
}: TTransfersFilterConfigParams): FilterConfig {
  const isV3 = isVersionV3(moduleVersion);

  return {
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
    reference: {
      label: 'Reference',
      variant: 'text',
      placeholder: 'Enter reference...',
    },
    ...(isV3 && {
      id: {
        label: 'Transfer ID',
        variant: 'text',
        placeholder: 'Enter transfer ID...',
      },
      asset: {
        label: 'Asset',
        variant: 'text',
        placeholder: 'Enter asset (e.g., USD, BTC)...',
      },
      connectorId: {
        label: 'Connector ID',
        variant: 'text',
        placeholder: 'Enter connector ID...',
      },
      type: {
        label: 'Type',
        variant: 'select',
        options: Object.values(V3PaymentInitiationTypeEnum).map((value) => ({
          label: value,
          value: value,
        })),
      },
      metadata: {
        label: 'Metadata',
        variant: 'metadata',
        placeholderKey: 'Enter metadata key...',
        placeholderValue: 'Enter metadata value...',
      },
      amount: {
        label: 'Amount',
        variant: 'number',
        placeholder: 'Enter amount...',
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
      reference: {
        label: 'Reference',
        variant: 'text',
        placeholder: 'Enter reference...',
      },
    }),
  };
}
