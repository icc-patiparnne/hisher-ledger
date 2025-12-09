import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { Data } from './index';
import { v1Loader } from './ledger-storage-migrations.v1';

export const v2Loader = async (
  api: NormalizedSDK,
  ledgerName: string
): Promise<Data> => v1Loader(api, ledgerName);
