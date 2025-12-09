import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { MODULES_GATEWAYS } from '@platform/utils';
import { ActionFunction } from 'react-router';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import {
  RunReconciliationFormValues,
  runReconciliationSchema,
} from '../components/policy-actions';
import { RECONCILIATION_ACTION_RUN } from '../constants';

export type ActionDataType =
  | ActionType<typeof RECONCILIATION_ACTION_RUN, { name: string }>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== RECONCILIATION_ACTION_RUN) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      let runReconciliation: RunReconciliationFormValues;
      try {
        runReconciliation = runReconciliationSchema.parse({
          policyID: values.policyID,
          reconciledAtLedger: new Date(values.reconciledAtLedger),
          reconciledAtPayments: new Date(values.reconciledAtPayments),
        });

        const reconciliation = await api.reconciliation.runReconciliation({
          policyID: runReconciliation.policyID,
          reconciledAtPayments: runReconciliation.reconciledAtPayments,
          reconciledAtLedger: runReconciliation.reconciledAtLedger,
        });

        return {
          formAction: RECONCILIATION_ACTION_RUN,
          message: `Reconciliation for policy ${runReconciliation.policyID} is running. Checkout reports page in a few seconds.`,
          data: reconciliation,
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Reconciliation for policy ${values.policyID} could not be done.`,
        };
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.RECONCILIATION],
    FEATURES.reconciliation
  );
};
