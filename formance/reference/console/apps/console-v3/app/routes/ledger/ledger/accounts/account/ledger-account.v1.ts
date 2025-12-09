import { getPaginatedAndFilteredList } from '@platform/remix';
import { ListTransactionsRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../../../utils/sdk/sdk';
import { LEDGER_TRANSACTIONS_LIST } from '../../../constants';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  ledgerName: string,
  address: string,
  request: Request
): Promise<Data> => {
  const ledger = await api.ledger.getLedger({ ledger: ledgerName });
  const ledgerStats = await api.ledger.getLedgerStats({ ledger: ledgerName });
  const ledgerAccount = await api.ledger.getAccount({
    ledger: ledgerName,
    address: address,
  });

  const ledgerAccountTransactions = await getPaginatedAndFilteredList(
    (config: ListTransactionsRequest) =>
      api.ledger.listTransactions({
        ...config,
        ledger: ledgerName,
        // Note: V1 API may need additional account filtering logic here
        // The V2 version uses complex query structure which V1 may not support
      }),
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
