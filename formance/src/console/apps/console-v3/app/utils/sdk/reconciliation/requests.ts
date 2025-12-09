import { PolicyRequest } from '@platform/sdks/formance/src/models/components';
import { DeletePolicyRequest } from '@platform/sdks/formance/src/models/operations';

export type NormalizedListPoliciesRequest = {
  pageSize?: number | undefined;
  cursor?: string | undefined;
  query?: { [k: string]: any } | undefined;
};
export type NormalizedGetPolicyRequest = {
  policyID: string;
};
export type NormalizedListReconciliationsRequest = {
  pageSize?: number | undefined;
  cursor?: string | undefined;
  query?: { [k: string]: any } | undefined;
};
export type NormalizedGetReconciliationRequest = {
  reconciliationID: string;
};

export type NormalizedCreatePolicyRequest = PolicyRequest;

export type NormalizedDeletePolicyRequest = DeletePolicyRequest;

export type NormalizeRunReconciliationRequest = {
  reconciledAtLedger: Date;
  reconciledAtPayments: Date;
  policyID: string;
};
