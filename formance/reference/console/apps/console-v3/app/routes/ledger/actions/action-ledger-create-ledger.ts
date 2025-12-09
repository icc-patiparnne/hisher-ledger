import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { MODULES_GATEWAYS } from '@platform/utils';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { LEDGER_ACTION_CREATE_LEDGER } from '../constants';
import { createLedgerSchema } from '../create';

export type ActionDataType =
  | ActionType<typeof LEDGER_ACTION_CREATE_LEDGER, { ledgerName: string }>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== LEDGER_ACTION_CREATE_LEDGER) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const createLedgerData = createLedgerSchema.parse(values);

      try {
        await api.ledger.createLedger({
          ledger: createLedgerData.name,
          bucket: createLedgerData.bucket,
          metadata: createLedgerData.metadata
            ? JSON.parse(createLedgerData.metadata)
            : undefined,
        });

        return {
          formAction: LEDGER_ACTION_CREATE_LEDGER,
          message: `Ledger ${createLedgerData.name} created!`,
          data: { ledgerName: createLedgerData.name },
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Ledger ${createLedgerData.name} could not be created`,
        };
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.LEDGER],
    FEATURES.ledger
  );
};
