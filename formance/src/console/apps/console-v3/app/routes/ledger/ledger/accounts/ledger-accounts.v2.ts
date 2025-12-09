import { getPaginatedAndFilteredList } from '@platform/remix';
import { V2ListAccountsRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { LEDGER_ACCOUNTS_LIST } from '../../constants';
import { Data } from './index';

export const v2Loader = async (
  api: NormalizedSDK,
  request: Request,
  ledgerName: string
): Promise<Data> => {
  const ledger = await api.ledger.getLedger({ ledger: ledgerName });
  const ledgerStats = await api.ledger.getLedgerStats({ ledger: ledgerName });
  const assets = await api.ledger.getBalancesAggregated({ ledger: ledgerName });

  const ledgerAccounts = await getPaginatedAndFilteredList(
    (config: V2ListAccountsRequest) =>
      api.ledger.listAccounts({
        ...config,
        ledger: ledgerName,
      }),
    request,
    LEDGER_ACCOUNTS_LIST
  );

  return {
    ledger,
    ledgerStats: serializeBigInt(ledgerStats),
    ledgerAccounts: serializeBigInt(ledgerAccounts),
    assets: serializeBigInt('data' in assets ? assets?.data : {}),
  };
};
