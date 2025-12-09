import { MODULES_GATEWAYS, serializeBigInt } from '@platform/utils';
import { LoaderFunction } from 'react-router';
import invariant from 'tiny-invariant';

import { Cursor } from '@platform/sdks/utils/cursor';
import { FEATURES } from '../../../../../hooks/useFeatureFlag';
import { withContext } from '../../../../../utils/auth.server';
import {
  NormalizedPaymentAccountBalanceModel,
  NormalizedPaymentAccountModel,
} from '../../../../../utils/sdk/payments/models';
import {
  NormalizedGetPaymentAccountBalancesResponse,
  NormalizedGetPaymentAccountResponse,
} from '../../../../../utils/sdk/payments/responses';
import { NormalizedSDK } from '../../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../../utils/session.gateway.server';

export type Data = {
  paymentsAccount: NormalizedGetPaymentAccountResponse | undefined;
  paymentsAccountBalances:
    | NormalizedGetPaymentAccountBalancesResponse
    | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  paymentsAccount: { data: NormalizedPaymentAccountModel };
  paymentsAccountBalances: {
    cursor: Cursor<NormalizedPaymentAccountBalanceModel>;
  };
}>;

const getData = async (
  api: NormalizedSDK,
  accountId: string
): Promise<Data> => {
  const paymentsAccount = await api.payments.getPaymentAccount({ accountId });

  const paymentsAccountBalances = await api.payments.getPaymentAccountBalances({
    accountId,
  });

  return {
    paymentsAccount,
    paymentsAccountBalances: serializeBigInt(paymentsAccountBalances),
  };
};

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  invariant(params.paymentAccountId, 'params.paymentAccountId is required');
  const paymentAccountId = params.paymentAccountId;
  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.PAYMENTS
      );

      return wrapLoaderWithProps<Data>(
        await getData(api, paymentAccountId),
        version
      );
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.PAYMENTS],
    FEATURES.payments
  )) as LoaderData;
};
