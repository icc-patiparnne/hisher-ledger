import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';

import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { MODULES_GATEWAYS } from '@platform/utils';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { getDiffBetweenObjects } from '../../../utils/common';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { LEDGER_ACTION_UPDATE_ACCOUNT_METADATA } from '../constants';

export type ActionDataType =
  | ActionType<
      typeof LEDGER_ACTION_UPDATE_ACCOUNT_METADATA,
      { ledger: string; address: string; json: Record<string, unknown> }
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
      if (values.formAction !== LEDGER_ACTION_UPDATE_ACCOUNT_METADATA) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      try {
        const { ledger, address, json: metadata, initialJson } = values;

        const diff = getDiffBetweenObjects(initialJson, metadata);

        for (const key of diff.removed) {
          await api.ledger.deleteAccountMetadata({
            ledger,
            address,
            key: key.key,
          });
        }

        await api.ledger.addMetadataToAccount({
          ledger,
          address,
          requestBody: metadata,
        });

        return {
          formAction: LEDGER_ACTION_UPDATE_ACCOUNT_METADATA,
          message: 'Account metadata updated',
        };
      } catch (e: any) {
        logError(e);

        const message = e.body
          ? JSON.parse(e.body).errorMessage
          : 'Account metadata could not be updated';

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
