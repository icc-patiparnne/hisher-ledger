import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { MODULES_GATEWAYS } from '@platform/utils';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { getDiffBetweenObjects } from '../../../utils/common';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { LEDGER_ACTION_UPDATE_TRANSACTION_METADATA } from '../constants';

export type ActionDataType =
  | ActionType<
      typeof LEDGER_ACTION_UPDATE_TRANSACTION_METADATA,
      { ledger: string; transactionId: bigint; json: Record<string, unknown> }
    >
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== LEDGER_ACTION_UPDATE_TRANSACTION_METADATA) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      try {
        const { ledger, transactionId, json: metadata, initialJson } = values;

        const diff = getDiffBetweenObjects(initialJson, metadata);

        for (const key of diff.removed) {
          await api.ledger.deleteTransactionMetadata({
            ledger,
            id: transactionId,
            key: key.key,
          });
        }

        await api.ledger.addMetadataOnTransaction({
          ledger,
          id: transactionId,
          requestBody: metadata,
        });

        return {
          formAction: LEDGER_ACTION_UPDATE_TRANSACTION_METADATA,
          message: 'Transaction metadata updated',
        };
      } catch (e: any) {
        logError(e);

        const message = e.body
          ? JSON.parse(e.body).errorMessage
          : 'Transaction metadata could not be updated';

        return {
          formAction: FORM_ERROR,
          message,
        };
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.LEDGER],
    FEATURES.ledger
  );
};
