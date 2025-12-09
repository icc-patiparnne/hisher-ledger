import { getPaginatedAndFilteredList } from '@platform/remix';
import { V2ListTransactionsRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { LEDGER_SELECTED, LEDGER_TRANSACTIONS_LIST } from '../constants';
import { Data } from './index';

export const v2Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const allLedgers = await api.ledger.listLedgers({ pageSize: 500 });

  // Extract ledger from URL parameter (now using param system)
  const url = new URL(request.url);
  const selectedLedger = url.searchParams.get(LEDGER_SELECTED);

  const ledgerTransactions = await getPaginatedAndFilteredList(
    (config: V2ListTransactionsRequest) => {
      if (selectedLedger) {
        return api.ledger.listTransactions({
          ...config,
          ledger: selectedLedger,
        });
      }
    },
    request,
    LEDGER_TRANSACTIONS_LIST
  );

  return {
    allLedgers,
    ledgerTransactions: serializeBigInt(ledgerTransactions),
  };
};
