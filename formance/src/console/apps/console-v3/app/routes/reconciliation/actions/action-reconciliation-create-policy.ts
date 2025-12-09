import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { MODULES_GATEWAYS } from '@platform/utils';
import { ActionFunction } from 'react-router';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { RECONCILIATION_ACTION_CREATE_POLICY } from '../constants';
import { createPolicySchema } from '../policies/create';

export type ActionDataType =
  | ActionType<typeof RECONCILIATION_ACTION_CREATE_POLICY, { name: string }>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== RECONCILIATION_ACTION_CREATE_POLICY) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const createPolicyData = createPolicySchema.parse(values);

      try {
        const policy = await api.reconciliation.createPolicy({
          name: createPolicyData.name,
          ledgerName: createPolicyData.ledgerName,
          ledgerQuery: JSON.parse(createPolicyData.ledgerQuery),
          paymentsPoolID: createPolicyData.paymentsPoolID,
        });

        if (policy && 'data' in policy) {
          return {
            formAction: RECONCILIATION_ACTION_CREATE_POLICY,
            message: `Policy ${createPolicyData.name} created`,
            data: { name: policy.data.name, id: policy.data.id },
          };
        }

        return {
          formAction: FORM_ERROR,
          message: `Policy ${createPolicyData.name} could not be created`,
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Policy ${createPolicyData.name} could not be created`,
        };
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.RECONCILIATION],
    FEATURES.reconciliation
  );
};
