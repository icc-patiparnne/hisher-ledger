import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { MODULES_GATEWAYS } from '@platform/utils';
import { ActionFunction } from 'react-router';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { deletePolicySchema } from '../components/delete-policy';
import { RECONCILIATION_ACTION_DELETE_POLICY } from '../constants';

export type ActionDataType =
  | ActionType<typeof RECONCILIATION_ACTION_DELETE_POLICY, { policyId: string }>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== RECONCILIATION_ACTION_DELETE_POLICY) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const deletePolicyData = deletePolicySchema.parse(values);

      try {
        await api.reconciliation.deletePolicy({
          policyID: deletePolicyData.policyId,
        });

        return {
          formAction: RECONCILIATION_ACTION_DELETE_POLICY,
          message: `Policy ${deletePolicyData.policyId} deleted`,
          data: { policyId: deletePolicyData.policyId },
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Policy ${deletePolicyData.policyId} could not be deleted`,
        };
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.RECONCILIATION],
    FEATURES.reconciliation
  );
};
