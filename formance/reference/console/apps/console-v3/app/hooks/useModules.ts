import { MODULES_ICON } from '@platform/ui';
import {
  getModule,
  MODULES,
  MODULES_NAMES,
  TModuleGateway,
  TModuleName,
} from '@platform/utils';
import { CurrentContext } from '../root';
import { TNavModule } from '../types/nav-modules';
import { TRouteParamsWithSearchParams } from '../types/routes';
import {
  BANKING_BRIDGE_SIDEBAR_ROUTES,
  CONNECTIVITY_SIDEBAR_ROUTES,
  FLOWS_SIDEBAR_ROUTES,
  LEDGER_SIDEBAR_ROUTES,
  RECONCILIATION_SIDEBAR_ROUTES,
  ROUTES,
  WALLETS_SIDEBAR_ROUTES,
} from '../utils/routes';
import { FEATURES } from './useFeatureFlag';

type TUseModules = {
  context: CurrentContext;
} & Pick<TRouteParamsWithSearchParams, 'organizationId' | 'stackId' | 'region'>;

export function useModules({
  organizationId,
  stackId,
  region,
  context,
}: TUseModules) {
  const isActivated = (moduleName: TModuleName) => {
    const module = getModule(moduleName);
    const moduleGateway = FEATURES[module?.gateway as TModuleGateway];

    const isDisabled =
      context?.gateway?.featuresDisabled?.includes(moduleGateway);

    const isInServicesVersion = getServiceVersion(moduleName) !== null;

    return isInServicesVersion && !isDisabled;
  };

  // Used to only show activated modules in case of microstack
  const isVisible = (moduleName: TModuleName) => {
    const isMicroStack = context?.env.MICRO_STACK === '1';
    if (!isMicroStack) return true;

    return isActivated(moduleName);
  };

  const getServiceVersion = (moduleName: TModuleName) => {
    const module = getModule(moduleName);

    return (
      context?.gateway?.servicesVersion.find(
        (service) => service.name === module?.gateway
      )?.version ?? null
    );
  };

  const hasBankingBridge = context?.hasBankingBridge;

  const gatewayModules: TNavModule[] = [
    // LEDGERS
    {
      ...MODULES.LEDGER,
      to: ROUTES({ organizationId, stackId, region })['LEDGER_OVERVIEW']?.to,
      icon: MODULES_ICON[MODULES.LEDGER.name],
      isVisible: isVisible(MODULES_NAMES.LEDGER),
      isActivated: isActivated(MODULES_NAMES.LEDGER),
      isDefaultOpen: true,
      version: getServiceVersion(MODULES_NAMES.LEDGER),
      items: LEDGER_SIDEBAR_ROUTES(organizationId, stackId, region).map(
        (route) => ({
          ...route,
        })
      ),
    },

    // CONNECTIVITY
    {
      ...MODULES.CONNECTIVITY,
      to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
        ?.to,
      icon: MODULES_ICON[MODULES.CONNECTIVITY.name],
      isVisible: isVisible(MODULES_NAMES.CONNECTIVITY),
      isActivated: isActivated(MODULES_NAMES.CONNECTIVITY),
      isDefaultOpen: true,
      version: getServiceVersion(MODULES_NAMES.CONNECTIVITY),
      items: CONNECTIVITY_SIDEBAR_ROUTES(organizationId, stackId, region).map(
        (route) => ({
          ...route,
        })
      ),
    },

    // WALLETS
    {
      ...MODULES.WALLETS,
      to: ROUTES({ organizationId, stackId, region })['WALLETS_OVERVIEW']?.to,
      icon: MODULES_ICON[MODULES.WALLETS.name],
      isVisible: isVisible(MODULES_NAMES.WALLETS),
      isActivated: isActivated(MODULES_NAMES.WALLETS),
      isDefaultOpen: true,
      version: getServiceVersion(MODULES_NAMES.WALLETS),
      items: WALLETS_SIDEBAR_ROUTES(organizationId, stackId, region).map(
        (route) => ({
          ...route,
        })
      ),
    },

    // FLOWS
    {
      ...MODULES.FLOWS,
      to: ROUTES({ organizationId, stackId, region })['FLOWS_OVERVIEW']?.to,
      icon: MODULES_ICON[MODULES.FLOWS.name],
      isVisible: isVisible(MODULES_NAMES.FLOWS),
      isActivated: isActivated(MODULES_NAMES.FLOWS),
      isDefaultOpen: true,
      version: getServiceVersion(MODULES_NAMES.FLOWS),
      items: FLOWS_SIDEBAR_ROUTES(organizationId, stackId, region).map(
        (route) => ({
          ...route,
        })
      ),
    },

    // RECONCILIATION
    {
      ...MODULES.RECONCILIATION,
      to: ROUTES({ organizationId, stackId, region })['RECONCILIATION_OVERVIEW']
        ?.to,
      icon: MODULES_ICON[MODULES.RECONCILIATION.name],
      isVisible: isVisible(MODULES_NAMES.RECONCILIATION),
      isDefaultOpen: true,
      isActivated: isActivated(MODULES_NAMES.RECONCILIATION),
      version: getServiceVersion(MODULES_NAMES.RECONCILIATION),
      items: RECONCILIATION_SIDEBAR_ROUTES(organizationId, stackId, region).map(
        (route) => ({
          ...route,
        })
      ),
    },

    // WEBHOOKS
    {
      ...MODULES.WEBHOOKS,
      to: ROUTES({ organizationId, stackId, region })['WEBHOOKS_OVERVIEW']?.to,
      icon: MODULES_ICON[MODULES.WEBHOOKS.name],
      isVisible: isVisible(MODULES_NAMES.WEBHOOKS),
      isDefaultOpen: true,
      isActivated: isActivated(MODULES_NAMES.WEBHOOKS),
      version: getServiceVersion(MODULES_NAMES.WEBHOOKS),
      items: [],
    },

    // OAUTH CLIENTS
    {
      ...MODULES.AUTH,
      to: ROUTES({ organizationId, stackId, region })['OAUTH_CLIENTS_OVERVIEW']
        ?.to,
      icon: MODULES_ICON[MODULES.AUTH.name],
      isVisible: isVisible(MODULES_NAMES.AUTH),
      isDefaultOpen: true,
      isActivated: isActivated(MODULES_NAMES.AUTH),
      version: getServiceVersion(MODULES_NAMES.AUTH),
      items: [],
    },

    // BANKING BRIDGE
    {
      ...MODULES.BANKING_BRIDGE,
      to: ROUTES({ organizationId, stackId, region })['BANKING_BRIDGE_OVERVIEW']
        ?.to,
      icon: MODULES_ICON[MODULES.BANKING_BRIDGE.name],
      isVisible: hasBankingBridge,
      isActivated: hasBankingBridge,
      isDefaultOpen: true,
      version: getServiceVersion(MODULES_NAMES.BANKING_BRIDGE),
      items: BANKING_BRIDGE_SIDEBAR_ROUTES(organizationId, stackId, region).map(
        (route) => ({
          ...route,
        })
      ),
    },
  ];

  const allModulesServices = gatewayModules.filter(
    (module) => module.type === 'MODULE'
  );

  const visibleModuleServices = allModulesServices.filter(
    (module) => module.isVisible
  );

  const allPlatformServices = gatewayModules.filter(
    (module) => module.type === 'PLATFORM'
  );

  const visiblePlatformServices = allPlatformServices.filter(
    (module) => module.isVisible
  );

  return {
    allModules: gatewayModules,
    allActivatedModules: gatewayModules.filter((module) => module.isActivated),
    allVisibleModules: gatewayModules.filter((module) => module.isVisible),
    getModule: (moduleName: TModuleName) =>
      gatewayModules.find((module) => module.name === moduleName),
    allModulesServices,
    visibleModuleServices,
    allPlatformServices,
    visiblePlatformServices,
  };
}
