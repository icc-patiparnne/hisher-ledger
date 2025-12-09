import { getPaginatedAndFilteredList } from '@platform/remix';
import { V2GetBalancesAggregatedRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { LEDGER_AGGREGATE_BALANCES_LIST } from '../../constants';
import { Data } from './index';

export const v2Loader = async (
  api: NormalizedSDK,
  request: Request,
  ledgerName: string
): Promise<Data> => {
  const ledger = await api.ledger.getLedger({ ledger: ledgerName });
  const ledgerStats = await api.ledger.getLedgerStats({
    ledger: ledgerName,
  });

  const ledgerAggregateBalances = await getPaginatedAndFilteredList(
    (config: V2GetBalancesAggregatedRequest) =>
      api.ledger.getBalancesAggregated({
        ...config,
        ledger: ledgerName,
      }),
    request,
    LEDGER_AGGREGATE_BALANCES_LIST
  );

  return {
    ledger,
    ledgerStats: serializeBigInt(ledgerStats),
    ledgerAggregateBalances: serializeBigInt(ledgerAggregateBalances),
  };
};
