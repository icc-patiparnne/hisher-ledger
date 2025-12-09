import { serializeBigInt } from '@platform/utils';
import { Data } from '.';
import { NormalizedSDK } from '../../../../../utils/sdk/sdk';

export const v1Loader = async (
  api: NormalizedSDK,
  ledgerName: string,
  transactionId: string
): Promise<Data> => {
  const ledger = await api.ledger.getLedger({ ledger: ledgerName });
  const ledgerStats = await api.ledger.getLedgerStats({
    ledger: ledgerName,
  });
  const ledgerTransaction = await api.ledger.getTransaction({
    ledger: ledgerName,
    id: BigInt(transactionId),
  });

  return {
    ledger,
    ledgerStats: serializeBigInt(ledgerStats),
    ledgerTransaction: serializeBigInt(ledgerTransaction),
  };
};
