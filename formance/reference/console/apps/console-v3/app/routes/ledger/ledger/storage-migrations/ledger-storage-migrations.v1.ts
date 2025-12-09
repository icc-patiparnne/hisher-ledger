import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  ledgerName: string
): Promise<Data> => {
  const ledger = await api.ledger.getLedger({ ledger: ledgerName });
  const ledgerStats = await api.ledger.getLedgerStats({
    ledger: ledgerName,
  });
  const ledgerInfo = await api.ledger.getLedgerInfo({
    ledger: ledgerName,
  });

  return {
    ledger,
    ledgerStats: serializeBigInt(ledgerStats),
    ledgerInfo: serializeBigInt(ledgerInfo),
  };
};
