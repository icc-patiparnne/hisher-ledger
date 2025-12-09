import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { Data } from './index';

export const v2Loader = async (
  api: NormalizedSDK,
  ledgerName: string
): Promise<Data> => {
  const ledger = await api.ledger.getLedger({ ledger: ledgerName });
  const ledgerStats = await api.ledger.getLedgerStats({
    ledger: ledgerName,
  });

  return {
    ledger,
    ledgerStats: serializeBigInt(ledgerStats),
  };
};
