import { getPaginatedAndFilteredList } from '@platform/remix';
import { ListTransferInitiationsRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { get } from 'lodash-es';
import { NormalizedSDK } from '../../../../../utils/sdk/sdk';
import { CONNECTIVITY_TRANSFER_INITIATIONS_LIST } from '../../../constants';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  request: Request,
  accountId: string
): Promise<Data> => {
  const paymentsAccountTransfers = await getPaginatedAndFilteredList(
    (config: ListTransferInitiationsRequest) =>
      api.payments.listTransferInitiations(
        config.cursor
          ? { cursor: config.cursor }
          : {
              query: {
                $and: [
                  ...get(config, 'query.$and', []),
                  {
                    $or: [
                      { $match: { source_account_id: accountId } },
                      { $match: { destination_account_id: accountId } },
                    ],
                  },
                ],
              },
            }
      ),
    request,
    CONNECTIVITY_TRANSFER_INITIATIONS_LIST
  );

  return {
    paymentsAccountTransfers: serializeBigInt(paymentsAccountTransfers),
  };
};
