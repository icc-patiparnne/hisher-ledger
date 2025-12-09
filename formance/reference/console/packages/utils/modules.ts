export const MODULES_NAMES = {
  LEDGER: 'LEDGER',
  WALLETS: 'WALLETS',
  CONNECTIVITY: 'CONNECTIVITY',
  FLOWS: 'FLOWS',
  RECONCILIATION: 'RECONCILIATION',
  WEBHOOKS: 'WEBHOOKS',
  SEARCH: 'SEARCH',
  AUTH: 'AUTH',
  STARGATE: 'STARGATE',
  GATEWAY: 'GATEWAY',
  BANKING_BRIDGE: 'BANKING_BRIDGE',
} as const;

export type TModuleName = (typeof MODULES_NAMES)[keyof typeof MODULES_NAMES];

export const MODULES_GATEWAYS = {
  LEDGER: 'ledger',
  WALLETS: 'wallets',
  PAYMENTS: 'payments',
  ORCHESTRATION: 'orchestration',
  RECONCILIATION: 'reconciliation',
  WEBHOOKS: 'webhooks',
  AUTH: 'auth',
  SEARCH: 'search',
  STARGATE: 'stargate',
  GATEWAY: 'gateway',
  BANKING_BRIDGE: 'banking_bridge',
} as const;

export type TModuleGateway =
  (typeof MODULES_GATEWAYS)[keyof typeof MODULES_GATEWAYS];

export const MODULES_TYPES = {
  MODULE: 'MODULE',
  PLATFORM: 'PLATFORM',
  'INTERNAL SERVICE': 'INTERNAL SERVICE',
} as const;

export type TModuleType = (typeof MODULES_TYPES)[keyof typeof MODULES_TYPES];

export type TModule = {
  name: TModuleName;
  displayName: string;
  gateway: TModuleGateway;
  description: string;
  license: 'MIT' | 'EE' | 'UNKNOWN';
  version: string | null;
  type: TModuleType;
};

export const MODULES_GATEWAY_DEFAULT_VERSION: Record<TModuleGateway, string> = {
  ledger: '2',
  wallets: '1',
  payments: '3',
  orchestration: '2',
  reconciliation: '1',
  webhooks: '1',
  auth: '1',
  search: '',
  stargate: '',
  gateway: '',
  banking_bridge: '1',
};

export const MODULES: Record<TModuleName, TModule> = {
  LEDGER: {
    name: MODULES_NAMES.LEDGER,
    displayName: 'Ledger',
    gateway: 'ledger',
    description:
      'Record real-time money movements on a programmable financial ledger built for scalable asset tracking.',
    license: 'MIT',
    version: null,
    type: MODULES_TYPES.MODULE,
  },
  WALLETS: {
    name: MODULES_NAMES.WALLETS,
    displayName: 'Wallets',
    gateway: 'wallets',
    description:
      'Fully managed white-label wallet service to hold user funds, with built-in support for complex flows like hold and capture.',
    license: 'EE',
    version: null,
    type: MODULES_TYPES.MODULE,
  },
  CONNECTIVITY: {
    name: MODULES_NAMES.CONNECTIVITY,
    displayName: 'Connectivity',
    gateway: 'payments',
    description:
      'Unified data layer for payments networks processing and participance providers, with upcoming support for transfers initiation and lifecycle management.',
    license: 'MIT',
    version: null,
    type: MODULES_TYPES.MODULE,
  },
  FLOWS: {
    name: MODULES_NAMES.FLOWS,
    displayName: 'Flows',
    gateway: 'orchestration',
    description:
      'Quickly set up end-to-end money flows, without the headache of piecing together APIs and untangling complex systems.',
    license: 'EE',
    version: null,
    type: MODULES_TYPES.MODULE,
  },
  RECONCILIATION: {
    name: MODULES_NAMES.RECONCILIATION,
    displayName: 'Reconciliation',
    gateway: 'reconciliation',
    description:
      'Monitor your accounts exposure, ensure assets correctness and build up safe funds management operations.',
    license: 'EE',
    version: null,
    type: MODULES_TYPES.MODULE,
  },
  WEBHOOKS: {
    name: MODULES_NAMES.WEBHOOKS,
    displayName: 'Webhooks',
    gateway: 'webhooks',
    description:
      'Receive and process events from your ledger in real-time, with customizable webhook endpoints.',
    license: 'EE',
    version: null,
    type: MODULES_TYPES.PLATFORM,
  },
  AUTH: {
    name: MODULES_NAMES.AUTH,
    displayName: 'Auth',
    gateway: 'auth',
    description:
      'Manage user authentication and authorization, with customizable roles and permissions.',
    license: 'EE',
    version: null,
    type: MODULES_TYPES.PLATFORM,
  },
  SEARCH: {
    name: MODULES_NAMES.SEARCH,
    displayName: 'Search',
    gateway: 'search',
    description:
      'Search is a service that provides a search engine for your Formance stack. It is based on Elasticsearch and provides a powerful search engine for your data.',
    license: 'EE',
    version: null,
    type: MODULES_TYPES['INTERNAL SERVICE'],
  },
  STARGATE: {
    name: MODULES_NAMES.STARGATE,
    displayName: 'Stargate',
    gateway: 'stargate',
    description:
      'Stargate is a gateway for the Stargate protocol, a protocol for cross-chain communication.',
    license: 'MIT',
    version: null,
    type: MODULES_TYPES['INTERNAL SERVICE'],
  },
  GATEWAY: {
    name: MODULES_NAMES.GATEWAY,
    displayName: 'Gateway',
    gateway: 'gateway',
    description:
      'Gateway is a gateway for the Gateway protocol, a protocol for cross-chain communication.',
    license: 'MIT',
    version: null,
    type: MODULES_TYPES['INTERNAL SERVICE'],
  },
  BANKING_BRIDGE: {
    name: MODULES_NAMES.BANKING_BRIDGE,
    displayName: 'Banking Bridge',
    gateway: 'banking_bridge',
    description:
      'Banking Bridge allows you to connect with external banking providers throught EBICS protocol or Open Banking services.',
    license: 'EE',
    version: null,
    type: MODULES_TYPES.MODULE,
  },
} as const;

/**
 * Maps gateway names to module names to handle mismatches between API responses and MODULES constant keys
 * @param gatewayOrModuleName - The gateway name or module name from the API
 * @returns The correct module name that exists in the MODULES constant
 */
export function getModuleNameFromGateway(
  gatewayOrModuleName: string
): TModuleName | null {
  // Convert to uppercase for consistent comparison
  const upperName =
    gatewayOrModuleName.toUpperCase() as Uppercase<TModuleGateway>;

  // First try direct match (if the name is already correct)
  if (Object.keys(MODULES_NAMES).includes(upperName)) {
    return upperName as TModuleName;
  }

  // Create gateway to module name mapping
  const gatewayToModuleMap: Record<Uppercase<TModuleGateway>, TModuleName> = {
    LEDGER: MODULES_NAMES.LEDGER,
    WALLETS: MODULES_NAMES.WALLETS,
    PAYMENTS: MODULES_NAMES.CONNECTIVITY,
    ORCHESTRATION: MODULES_NAMES.FLOWS,
    RECONCILIATION: MODULES_NAMES.RECONCILIATION,
    WEBHOOKS: MODULES_NAMES.WEBHOOKS,
    SEARCH: MODULES_NAMES.SEARCH,
    AUTH: MODULES_NAMES.AUTH,
    STARGATE: MODULES_NAMES.STARGATE,
    GATEWAY: MODULES_NAMES.GATEWAY,
    BANKING_BRIDGE: MODULES_NAMES.BANKING_BRIDGE,
  };

  // Try gateway mapping
  const mappedModule = gatewayToModuleMap[upperName];
  if (mappedModule) {
    return mappedModule;
  }

  // If no direct match, try to find by gateway property in MODULES
  for (const [moduleName, moduleInfo] of Object.entries(MODULES)) {
    if (moduleInfo.gateway.toUpperCase() === upperName) {
      return moduleName as TModuleName;
    }
  }

  // Return null if no match found
  return null;
}

/**
 * Gets module information by gateway name or module name
 * @param gatewayOrModuleName - The gateway name or module name from the API
 * @returns The module information or null if not found
 */
export function getModule(gatewayOrModuleName: string): TModule | null {
  const moduleName = getModuleNameFromGateway(gatewayOrModuleName);

  return moduleName ? MODULES[moduleName] : null;
}

/**
 * Sorts modules: enabled first, then by type (MODULE -> PLATFORM -> INTERNAL SERVICE)
 * Can work with both full module objects and just module names
 */
export function sortModules<
  T extends { name: string; enabled?: boolean; status?: string } | string
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    // Handle both module objects and string names
    const aName = typeof a === 'string' ? a : a.name;
    const bName = typeof b === 'string' ? b : b.name;

    const aInfo = getModule(aName);
    const bInfo = getModule(bName);
    const aType = aInfo?.type || 'UNKNOWN';
    const bType = bInfo?.type || 'UNKNOWN';

    // For module objects, sort by enabled status first
    if (
      typeof a === 'object' &&
      typeof b === 'object' &&
      'enabled' in a &&
      'enabled' in b
    ) {
      const aEnabled = a.enabled && a.status !== 'DELETED';
      const bEnabled = b.enabled && b.status !== 'DELETED';

      if (aEnabled !== bEnabled) {
        return bEnabled ? 1 : -1; // Enabled modules first
      }
    }

    // Then sort by type priority
    const typeOrder = {
      MODULE: 0,
      PLATFORM: 1,
      'INTERNAL SERVICE': 2,
      UNKNOWN: 3,
    };

    return typeOrder[aType] - typeOrder[bType];
  });
}

export const NON_DISABLEABLE_MODULES: TModuleName[] = [MODULES_NAMES.LEDGER];

export const DEPRECATED_MODULES: TModuleName[] = [MODULES_NAMES.SEARCH];

export const DEPLOYMENT_MODULES = ['analytics'];
