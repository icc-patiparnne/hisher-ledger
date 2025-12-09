import { Connector } from '@platform/sdks/formance/src/models/components';
import type { FilterConfig } from '@platform/ui';

/**
 * Parameters for connectors filter configuration
 */
export interface TConnectorsFilterConfigParams {
  moduleVersion: string;
}

/**
 * Filter configuration for connectors data table
 * Defines all available filters for connectors with their types, options, and labels
 * Uses SDK enums for dynamic option generation based on module version
 */
export function getConnectivityConnectorsFiltersConfig(): FilterConfig {
  // Get provider options from Connector enum
  const getProviderOptions = () =>
    Object.values(Connector).map((value) => ({
      label: value
        .toLowerCase()
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      value: value,
    }));

  return {
    id: {
      label: 'Connector ID',
      variant: 'text',
      placeholder: 'Enter connector ID...',
    },
    name: {
      label: 'Name',
      variant: 'text',
      placeholder: 'Enter connector name...',
    },
    provider: {
      label: 'Provider',
      variant: 'select',
      options: getProviderOptions(),
    },
  };
}
