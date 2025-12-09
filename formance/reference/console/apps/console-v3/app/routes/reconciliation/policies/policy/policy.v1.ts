import { getPaginatedAndFilteredList } from '@platform/remix';
import { V2ListAccountsRequest } from '@platform/sdks/formance/src/models/operations';
import { NormalizedPaymentAccountModel } from '../../../../utils/sdk/payments/models';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { LEDGER_ACCOUNTS_LIST } from '../../../ledger/constants';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  policyId: string,
  request: Request
): Promise<Data> => {
  const connectorsConfig = await api.payments.listAllAvailableConnectors();

  const policy = await api.reconciliation.getPolicy({
    policyID: policyId,
  });

  if (policy && 'data' in policy) {
    const ledgerAccounts =
      (await getPaginatedAndFilteredList(
        (config: V2ListAccountsRequest) => {
          const queryMatch: [] =
            config && config.query ? config.query.$and : [];

          return api.ledger.listAccounts({
            ...config,
            ledger: policy.data.ledgerName,
            query: {
              $and: [...queryMatch, policy.data.ledgerQuery],
            },
          });
        },

        request,
        LEDGER_ACCOUNTS_LIST
      ).catch(() => api.mockCursor([]))) || api.mockCursor([]);

    const pool = await api.payments
      .getCashPool({
        poolId: policy.data.paymentsPoolID,
      })
      .catch(() => undefined);

    if (pool && 'data' in pool) {
      const accountsIds = pool.data.accounts?.slice(0, 5) || [];

      const paymentsAccounts: NormalizedPaymentAccountModel[] = [];

      for (const id of accountsIds) {
        const paymentAccount = await api.payments
          .getPaymentAccount({
            accountId: id,
          })
          .catch(() => undefined);

        if (paymentAccount && 'data' in paymentAccount) {
          paymentsAccounts.push(paymentAccount.data);
        }
      }

      return {
        connectorsConfig,
        ledgerAccounts,
        paymentsAccounts: { data: paymentsAccounts },
        policy,
      };
    }

    return {
      connectorsConfig,
      ledgerAccounts,
      paymentsAccounts: { data: [] },
      policy,
    };
  }

  return {
    connectorsConfig,
    policy,
    ledgerAccounts: [],
    paymentsAccounts: [],
  };
};
