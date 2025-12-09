import { getPaginatedAndFilteredList } from '@platform/remix';
import { ListTransactionsRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { LEDGER_SELECTED, LEDGER_TRANSACTIONS_LIST } from '../constants';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const allLedgers = await api.ledger.listLedgers({});

  // Extract selected ledger from URL parameters
  const url = new URL(request.url);
  const selectedLedger = url.searchParams.get(LEDGER_SELECTED);

  const ledgerTransactions = await getPaginatedAndFilteredList(
    (config: ListTransactionsRequest) =>
      api.ledger.listTransactions({
        ...config,
        ...(selectedLedger && { ledger: selectedLedger }),
      }),
    request,
    LEDGER_TRANSACTIONS_LIST
  );

  return {
    allLedgers,
    ledgerTransactions: serializeBigInt(ledgerTransactions),
  };
};
