import { V3AccountTypeEnum } from '@platform/sdks/formance/src/models/components';
import type { FilterConfig, Option } from '@platform/ui';
import { isVersionV3 } from '../../../utils/version';

/**
 * Parameters for accounts filter configuration
 */
export interface TAccountsFilterConfigParams {
  moduleVersion: string;
}

/**
 * Filter configuration for accounts data table
 * Defines all available filters for accounts with their types, options, and labels
 * Uses SDK enums for dynamic option generation based on module version
 */
export function getConnectivityAccountsFiltersConfig({
  moduleVersion,
}: TAccountsFilterConfigParams): FilterConfig {
  const isV3 = isVersionV3(moduleVersion);

  const typeOptions: Option[] = Object.values(V3AccountTypeEnum).map(
    (value) => ({
      label: value,
      value: value,
    })
  );

  return {
    reference: {
      label: 'Reference',
      variant: 'text',
      placeholder: 'Enter reference...',
    },
    metadata: {
      label: 'Metadata',
      variant: 'metadata',
      placeholderKey: 'Enter metadata key...',
      placeholderValue: 'Enter metadata value...',
    },

    ...(!isV3 && {
      id: {
        label: 'Account ID',
        variant: 'text',
        placeholder: 'Enter account ID...',
      },
      name: {
        label: 'Name',
        variant: 'text',
        placeholder: 'Enter account name...',
      },
      default_asset: {
        label: 'Default Asset',
        variant: 'text',
        placeholder: 'Enter default asset...',
      },
      connector_id: {
        label: 'Connector ID',
        variant: 'text',
        placeholder: 'Enter connector ID...',
      },
      type: {
        label: 'Type',
        variant: 'multiSelect',
        options: typeOptions,
      },
    }),
  };
}
