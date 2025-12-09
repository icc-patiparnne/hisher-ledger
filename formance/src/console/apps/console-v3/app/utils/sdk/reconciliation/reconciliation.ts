import { RequestOptions } from '@platform/sdks/formance/src/lib/sdks';
import { SDK } from '@platform/sdks/formance/src/sdk';

import { NormalizedSDK } from '../sdk';
import {
  NormalizedCreatePolicyRequest,
  NormalizedDeletePolicyRequest,
  NormalizedGetPolicyRequest,
  NormalizedGetReconciliationRequest,
  NormalizedListPoliciesRequest,
  NormalizedListReconciliationsRequest,
  NormalizeRunReconciliationRequest,
} from './requests';
import {
  NormalizedCreatePolicyResponse,
  NormalizedDeletePolicyResponse,
  NormalizedGetPolicyResponse,
  NormalizedGetReconciliationResponse,
  NormalizedListPoliciesResponse,
  NormalizedListReconciliationsResponse,
  NormalizedRunReconciliationResponse,
} from './responses';

export class NormalizedReconciliation {
  sdk: SDK;
  normalizedSDK: NormalizedSDK;
  version: string;

  constructor(sdk: SDK, version: string, normalizedSDK: NormalizedSDK) {
    this.normalizedSDK = normalizedSDK;
    this.version = version;
    this.sdk = sdk;
  }

  async listPolicies(
    request: NormalizedListPoliciesRequest,
    options?: RequestOptions
  ): Promise<NormalizedListPoliciesResponse> {
    switch (this.version) {
      default: {
        return this.sdk.reconciliation.v1.listPolicies(request, options);
      }
    }
  }

  async getPolicy(
    request: NormalizedGetPolicyRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetPolicyResponse> {
    switch (this.version) {
      default: {
        return this.sdk.reconciliation.v1.getPolicy(request, options);
      }
    }
  }

  async getReconciliation(
    request: NormalizedGetReconciliationRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetReconciliationResponse | undefined> {
    switch (this.version) {
      default: {
        const report = await this.sdk.reconciliation.v1.getReconciliation(
          request,
          options
        );

        if (report && 'data' in report) {
          const l = Object.keys(report.data.ledgerBalances).map(
            (key) => `${report.data.ledgerBalances[key]} ${key}`
          );
          const p = Object.keys(report.data.paymentsBalances).map(
            (key) => `${report.data.paymentsBalances[key]} ${key}`
          );
          const d = Object.keys(report.data.driftBalances).map(
            (key) => `${report.data.driftBalances[key]} ${key}`
          );
          const balances = l.map((value, index) => ({
            ledgerBalances: value,
            paymentsBalances: p[index],
            driftBalances: d[index],
          }));

          return { data: { ...report.data, balances } };
        }
      }
    }
  }

  async listReconciliations(
    request: NormalizedListReconciliationsRequest,
    options?: RequestOptions
  ): Promise<NormalizedListReconciliationsResponse> {
    switch (this.version) {
      default: {
        return this.sdk.reconciliation.v1.listReconciliations(request, options);
      }
    }
  }

  async createPolicy(
    request: NormalizedCreatePolicyRequest,
    options?: RequestOptions
  ): Promise<NormalizedCreatePolicyResponse> {
    switch (this.version) {
      default: {
        return this.sdk.reconciliation.v1.createPolicy(request, options);
      }
    }
  }

  async deletePolicy(
    request: NormalizedDeletePolicyRequest,
    options?: RequestOptions
  ): Promise<NormalizedDeletePolicyResponse> {
    switch (this.version) {
      default: {
        return this.sdk.reconciliation.v1.deletePolicy(request, options);
      }
    }
  }

  async runReconciliation(
    request: NormalizeRunReconciliationRequest,
    options?: RequestOptions
  ): Promise<NormalizedRunReconciliationResponse> {
    switch (this.version) {
      default: {
        return this.sdk.reconciliation.v1.reconcile(
          {
            policyID: request.policyID,
            reconciliationRequest: {
              reconciledAtLedger: request.reconciledAtLedger,
              reconciledAtPayments: request.reconciledAtPayments,
            },
          },
          options
        );
      }
    }
  }
}
