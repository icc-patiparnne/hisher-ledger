import { get } from 'lodash-es';

import { SDK } from '@platform/sdks/formance/src/sdk';
import { Cursor } from '@platform/sdks/utils/cursor';
import {
  MODULES_GATEWAY_DEFAULT_VERSION,
  MODULES_GATEWAYS,
} from '@platform/utils';

import { CallbackContext } from '../auth.server';
import { NormalizedAuth } from './auth/auth';
import { NormalizedFlows } from './flows/flows';
import { NormalizedLedger } from './ledger/ledger';
import { NormalizedPayments } from './payments/payments';
import { NormalizedReconciliation } from './reconciliation/reconciliation';
import { NormalizedWallets } from './wallets/wallets';
import { NormalizedWebhooks } from './webhooks/webhooks';

export class NormalizedSDK {
  sdk: SDK;
  versions: CallbackContext['sdkVersions'];
  ledger: NormalizedLedger;
  payments: NormalizedPayments;
  reconciliation: NormalizedReconciliation;
  wallets: NormalizedWallets;
  flows: NormalizedFlows;
  auth: NormalizedAuth;
  webhooks: NormalizedWebhooks;

  constructor(sdk: SDK, versions: CallbackContext['sdkVersions']) {
    this.sdk = sdk;
    this.versions = versions;
    this.ledger = new NormalizedLedger(
      sdk,
      get(
        versions,
        MODULES_GATEWAYS.LEDGER,
        MODULES_GATEWAY_DEFAULT_VERSION[MODULES_GATEWAYS.LEDGER]
      ),
      this
    );
    this.payments = new NormalizedPayments(
      sdk,
      get(
        versions,
        MODULES_GATEWAYS.PAYMENTS,
        MODULES_GATEWAY_DEFAULT_VERSION[MODULES_GATEWAYS.PAYMENTS]
      ),
      this
    );
    this.wallets = new NormalizedWallets(
      sdk,
      get(
        versions,
        MODULES_GATEWAYS.WALLETS,
        MODULES_GATEWAY_DEFAULT_VERSION[MODULES_GATEWAYS.WALLETS]
      ),
      this
    );
    this.auth = new NormalizedAuth(
      sdk,
      get(
        versions,
        MODULES_GATEWAYS.AUTH,
        MODULES_GATEWAY_DEFAULT_VERSION[MODULES_GATEWAYS.AUTH]
      ),
      this
    );
    this.reconciliation = new NormalizedReconciliation(
      sdk,
      get(
        versions,
        MODULES_GATEWAYS.RECONCILIATION,
        MODULES_GATEWAY_DEFAULT_VERSION[MODULES_GATEWAYS.RECONCILIATION]
      ),
      this
    );
    this.flows = new NormalizedFlows(
      sdk,
      get(
        versions,
        MODULES_GATEWAYS.ORCHESTRATION,
        MODULES_GATEWAY_DEFAULT_VERSION[MODULES_GATEWAYS.ORCHESTRATION]
      ),
      this
    );
    this.webhooks = new NormalizedWebhooks(
      sdk,
      get(
        versions,
        MODULES_GATEWAYS.WEBHOOKS,
        MODULES_GATEWAY_DEFAULT_VERSION[MODULES_GATEWAYS.WEBHOOKS]
      ),
      this
    );
  }

  mockCursor<T>(data: T[]): { cursor: Cursor<T> } {
    return {
      cursor: {
        data,
        pageSize: 15,
        hasMore: false,
      },
    };
  }
}
