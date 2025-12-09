import { getPaginatedAndFilteredList } from '@platform/remix';
import { ListTransactionsRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { LEDGER_TRANSACTIONS_LIST } from '../../constants';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  request: Request,
  ledgerName: string
): Promise<Data> => {
  const ledger = await api.ledger.getLedger({ ledger: ledgerName });
  const ledgerStats = await api.ledger.getLedgerStats({ ledger: ledgerName });

  const ledgerTransactions = await getPaginatedAndFilteredList(
    (config: ListTransactionsRequest) =>
      api.ledger.listTransactions({
        ...config,
        ledger: ledgerName!,
      }),
    request,
    LEDGER_TRANSACTIONS_LIST
  );

  return {
    ledger,
    ledgerStats: serializeBigInt(ledgerStats),
    ledgerTransactions: serializeBigInt(ledgerTransactions),
  };
};
