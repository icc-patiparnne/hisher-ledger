// Client-safe constants and types for apps
// This file contains no server-only code and can be safely imported anywhere

import { TConnectorName } from '@platform/utils/connectors';
import type { TFileSystemItem } from '@platform/utils/directoryUtils';
import { TModuleName } from '@platform/utils/modules';

export const APPS_NAMES = {
  Blank: 'BLANK',
  Connectivity: 'CONNECTIVITY',
  LendingApp: 'LENDING_APP',
  CarRental: 'CAR_RENTAL',
  B2BLending: 'B2B_LENDING',
} as const;

export type TAppName = (typeof APPS_NAMES)[keyof typeof APPS_NAMES];

export type TApp = {
  order: number;
  name: TAppName;
  displayName?: string;
  slug: string;
  description: string;
};

export const APPS: Record<TAppName, TApp> = {
  [APPS_NAMES.Blank]: {
    order: 1,
    name: APPS_NAMES.Blank,
    slug: 'blank',
    displayName: 'Blank',
    description:
      'A blank app with only the ledger module enabled. Great for starting from scratch.',
  },
  [APPS_NAMES.Connectivity]: {
    order: 2,
    name: APPS_NAMES.Connectivity,
    slug: 'connectivity',
    displayName: 'Connectivity',
    description:
      'A connectivity app with the ledger & connectivity modules enabled. A great way to experiment with a connector.',
  },
  [APPS_NAMES.LendingApp]: {
    order: 3,
    name: APPS_NAMES.LendingApp,
    slug: 'lending-app',
    displayName: 'Lending App',
    description:
      'Complete lending platform with loan origination, disbursement, and repayment tracking.',
  },
  [APPS_NAMES.CarRental]: {
    order: 4,
    name: APPS_NAMES.CarRental,
    slug: 'car-rental',
    displayName: 'Car Rental',
    description:
      'Platform connecting car providers with renters, featuring booking payments, insurance integration, and escrow management.',
  },
  [APPS_NAMES.B2BLending]: {
    order: 5,
    name: APPS_NAMES.B2BLending,
    slug: 'b2b-lending',
    displayName: 'B2B Lending',
    description:
      'Complete B2B lending platform with loan origination, disbursement, and repayment tracking.',
  },
} as const;

export const SORTED_APPS = Object.values(APPS).sort(
  (a, b) => a.order - b.order
);

/**
 * Files that should be excluded from the editable file tree
 * These files are still processed for content extraction but not shown in the editor
 */
export const EXCLUDED_FILES = [
  'README.md',
  'readme.md',
  '.gitignore',
  'LICENSE',
  'license.txt',
  '.DS_Store',
] as const;

export type TAppLoaderData = {
  appFiles: TFileSystemItem[];
  appInfo: TApp | undefined;
  appManifestInfo: TAppManifestInfo | undefined;
  appReadmeContent: string | undefined;
  detectedSecrets: string[];
  initialSecretValues: Record<string, string>;
};

/**
 * Manifest information for each app
 * Extracted from the app's description files
 */
export type TAppManifestInfo = {
  title: string;
  description: string;
  modules: TModuleName[];
  connectors: TConnectorName[];
};

/**
 * App module names that can be used in app manifests
 */
export type TAppModuleName =
  | 'ledger'
  | 'connectivity'
  | 'wallet'
  | 'reconciliation'
  | 'flows'
  | 'webhooks';
