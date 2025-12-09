import { compare } from 'compare-versions';
import { first } from 'lodash-es';

/**
 * Normalizes a version string by removing the 'v' prefix if present
 * @example normalizeVersion('v2.0.0') => '2.0.0'
 * @example normalizeVersion('2.0.0') => '2.0.0'
 */
export const normalizeVersion = (version: string): string => {
  const hasVPrefix = first(version) === 'v';

  return hasVPrefix ? version.slice(1) : version;
};

export const isVersionGreaterOrEqual = (a: string, b: string) => {
  try {
    return compare(normalizeVersion(a), normalizeVersion(b), '>=');
  } catch {
    return false;
  }
};

export function isVersionV1(version: string): boolean {
  return getMajorVersionTag(version) === 'v1';
}

export function isVersionV2(version: string): boolean {
  return getMajorVersionTag(version) === 'v2';
}

export function isVersionV3(version: string): boolean {
  return getMajorVersionTag(version) === 'v3';
}

function getMajorVersionTag(version: string): 'v1' | 'v2' | 'v3' | 'unknown' {
  try {
    const normalized = normalizeVersion(version);
    if (compare(normalized, '2.0.0', '<')) {
      return 'v1';
    }
    if (
      compare(normalized, '2.0.0', '>=') &&
      compare(normalized, '3.0.0', '<')
    ) {
      return 'v2';
    }
    if (
      compare(normalized, '3.0.0', '>=') &&
      compare(normalized, '4.0.0', '<')
    ) {
      return 'v3';
    }

    return 'unknown';
  } catch {
    return 'unknown';
  }
}
