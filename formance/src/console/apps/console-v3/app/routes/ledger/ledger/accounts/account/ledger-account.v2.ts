import { V2ListTransactionsRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../../../utils/sdk/sdk';
import { Data } from './index';

import { getPaginatedAndFilteredList } from '@platform/remix';
import { LEDGER_TRANSACTIONS_LIST } from '../../../constants';

export const v2Loader = async (
  api: NormalizedSDK,
  ledgerName: string,
  address: string,
  request: Request
): Promise<Data> => {
  const ledger = await api.ledger.getLedger({ ledger: ledgerName });
  const ledgerStats = await api.ledger.getLedgerStats({
    ledger: ledgerName,
  });
  const ledgerAccount = await api.ledger.getAccount({
    ledger: ledgerName,
    address: address,
    expand: 'volumes',
  });

  const ledgerAccountTransactions = await getPaginatedAndFilteredList(
    (config: V2ListTransactionsRequest) => {
      // Merge user filters with account filtering (source OR destination = address)
      const userQuery = config.query ? config.query.$and || [] : [];

      return api.ledger.listTransactions({
        ...config,
        ledger: ledgerName,
        query: {
          $and: [
            ...userQuery,
            {
              $or: [
                { $match: { source: address } },
                { $match: { destination: address } },
              ],
            },
          ],
        },
      });
    },
    request,
    LEDGER_TRANSACTIONS_LIST
  );

  return {
    ledger,
    ledgerStats: serializeBigInt(ledgerStats),
    ledgerAccount: serializeBigInt(ledgerAccount),
    ledgerAccountTransactions: serializeBigInt(ledgerAccountTransactions),
  };
};
