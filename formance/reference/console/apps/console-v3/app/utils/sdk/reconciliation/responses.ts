import * as components from '@platform/sdks/formance/src/models/components';
import { Cursor } from '@platform/sdks/utils/cursor';
import { NormalizedPolicyModel, NormalizedReconciliationModel } from './models';

export type NormalizedListPoliciesResponse =
  | components.ReconciliationErrorResponse
  | {
      cursor: Cursor<NormalizedPolicyModel>;
    };

export type NormalizedListReconciliationsResponse =
  | components.ReconciliationErrorResponse
  | {
      cursor: Cursor<NormalizedReconciliationModel>;
    };

export type NormalizedGetReconciliationResponse =
  | components.ReconciliationErrorResponse
  | {
      data: NormalizedReconciliationModel;
    };

export type NormalizedGetPolicyResponse =
  | components.ReconciliationErrorResponse
  | {
      data: NormalizedPolicyModel;
    };

export type NormalizedCreatePolicyResponse =
  | components.ReconciliationErrorResponse
  | {
      data: NormalizedPolicyModel;
    };

export type NormalizedDeletePolicyResponse =
  | components.ReconciliationErrorResponse
  | undefined;

export type NormalizedRunReconciliationResponse =
  | components.ReconciliationResponse
  | components.ReconciliationErrorResponse;
