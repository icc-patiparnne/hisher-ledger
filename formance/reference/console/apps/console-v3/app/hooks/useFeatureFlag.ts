import { throwError } from '@platform/logger/helper';
import {
  featureFlag as featureFlagHelper,
  MODULES_GATEWAYS,
  TModuleGateway,
  useFeatureFlagServerSide as useFeatureFlagServerSideHelper,
} from '@platform/utils';
import { get, isArray, uniq } from 'lodash-es';
import { useOutletContext } from 'react-router';
import { CurrentContext } from '../root';

export type GatewayVersion = {
  name: string;
  version: string;
  health: boolean;
};

export type Gateway = {
  env: string;
  region: string;
  versions: GatewayVersion[];
};

export const FEATURES: Record<TModuleGateway, TModuleGateway> = {
  [MODULES_GATEWAYS.LEDGER]: 'ledger',
  [MODULES_GATEWAYS.PAYMENTS]: 'payments',
  [MODULES_GATEWAYS.WALLETS]: 'wallets',
  [MODULES_GATEWAYS.ORCHESTRATION]: 'orchestration',
  [MODULES_GATEWAYS.RECONCILIATION]: 'reconciliation',
  [MODULES_GATEWAYS.WEBHOOKS]: 'webhooks',
  [MODULES_GATEWAYS.AUTH]: 'auth',
  [MODULES_GATEWAYS.SEARCH]: 'search',
  [MODULES_GATEWAYS.STARGATE]: 'stargate',
  [MODULES_GATEWAYS.GATEWAY]: 'gateway',
  [MODULES_GATEWAYS.BANKING_BRIDGE]: 'banking_bridge',
} as const;

export type TFeature = keyof typeof FEATURES;

export const useFeatureFlagServerSide = (
  feature: TFeature,
  features: string[]
) => useFeatureFlagServerSideHelper(feature, features);

export function useFeatureFlag(feature: TFeature) {
  const outlet = useOutletContext<CurrentContext>();

  if (outlet && outlet.gateway && outlet.gateway.featuresDisabled) {
    const ff = featureFlag(FEATURES[feature], outlet.gateway.featuresDisabled);
    if (!ff) {
      return throwError(
        403,
        'Forbidden: Feature flag is enabled. You can not access to this feature'
      );
    }

    return true;
  }

  return throwError(403, "Forbidden: Something's went wrong with feature flag");
}

export function featureFlag(
  feature: TModuleGateway,
  features: string[],
  next = false
): boolean {
  return featureFlagHelper(feature, features, next);
}

export const mergeDisabledFeatures = (
  versions: GatewayVersion[],
  featuresDisabled: string[]
) => {
  if (versions.length === 0 && featuresDisabled.length === 0) {
    return [];
  }
  const keys = Object.keys(FEATURES);

  const gatewayDisabledComponent: TModuleGateway[] = keys
    .map((key) => {
      if (versions && isArray(versions)) {
        const find = versions.find(
          (version: GatewayVersion) => version.name === key
        );

        if (!find) {
          return key;
        }
      }
    })
    .filter((key) => key) as TFeature[];

  const gatewayMappedDisabledComponent = uniq(
    gatewayDisabledComponent.map((t) => get(FEATURES, t)).flat()
  );

  return uniq([...gatewayMappedDisabledComponent, ...featuresDisabled]);
};
