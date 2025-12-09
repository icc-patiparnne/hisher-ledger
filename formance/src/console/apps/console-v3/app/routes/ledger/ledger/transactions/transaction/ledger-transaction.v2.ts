import { Data } from '.';
import { NormalizedSDK } from '../../../../../utils/sdk/sdk';
import { v1Loader } from './ledger-transaction.v1';

export const v2Loader = async (
  api: NormalizedSDK,
  ledgerName: string,
  transactionId: string
): Promise<Data> => v1Loader(api, ledgerName, transactionId);
